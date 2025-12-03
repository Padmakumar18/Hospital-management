package com.hospitalmanagement.backend.service;

import com.hospitalmanagement.backend.model.Department;
import com.hospitalmanagement.backend.model.Doctor;
import com.hospitalmanagement.backend.model.User;
import com.hospitalmanagement.backend.repository.AppointmentRepository;
import com.hospitalmanagement.backend.repository.DepartmentRepository;
import com.hospitalmanagement.backend.repository.DoctorRepository;
import com.hospitalmanagement.backend.repository.PrescriptionRepository;
import com.hospitalmanagement.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            DoctorRepository doctorRepository, DepartmentRepository departmentRepository,
            AppointmentRepository appointmentRepository, PrescriptionRepository prescriptionRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
    }

    public User createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists!");
        }
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User createUserWithDoctorRecord(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists!");
        }

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        // If user is a Doctor AND already verified (e.g., Patient or Admin role),
        // create doctor record immediately
        // For unverified doctors, the record will be created when admin approves
        if ("Doctor".equals(user.getRole()) && user.isVerified()) {
            Doctor doctor = new Doctor();
            doctor.setName(user.getName());
            doctor.setEmail(user.getEmail());
            doctor.setSpecialization(user.getSpecialization() != null ? user.getSpecialization() : "Not specified");
            doctor.setDepartment(user.getDepartment() != null ? user.getDepartment() : "Not specified");
            doctor.setPhone(user.getPhone() != null ? user.getPhone() : "");
            doctor.setExperienceYears(user.getExperienceYears() != null ? user.getExperienceYears() : 0);
            doctor.setQualification(user.getQualification() != null ? user.getQualification() : "Not specified");
            doctor.setAvailable(true);

            doctorRepository.save(doctor);
            System.out.println("Created Doctor record for: " + user.getEmail() + " (auto-verified)");
        } else if ("Doctor".equals(user.getRole())) {
            System.out.println("Doctor signup pending approval: " + user.getEmail()
                    + " - Doctor record will be created upon admin approval");
        }

        return savedUser;
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email);
        // Use BCrypt to verify password
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole().equalsIgnoreCase(role))
                .collect(Collectors.toList());
    }

    public User updateUser(String email, User userDetails) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setName(userDetails.getName());
            user.setRole(userDetails.getRole());
            // Hash password if it's being updated
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found with email: " + email);
    }

    @Transactional
    public void deleteUser(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            String userName = user.getName();
            String userRole = user.getRole();

            System.out.println("Deleting user: " + email + " (Role: " + userRole + ")");

            // Delete based on role
            switch (userRole) {
                case "Patient":
                    deletePatientRecords(email, userName);
                    break;
                case "Doctor":
                    deleteDoctorRecords(email, userName);
                    break;
                case "Pharmacist":
                    // Pharmacists don't have appointments or prescriptions
                    System.out.println("Deleting pharmacist user: " + email);
                    break;
                case "Admin":
                    // Admins don't have appointments or prescriptions
                    System.out.println("Deleting admin user: " + email);
                    break;
            }

            // Finally, delete the user
            userRepository.delete(user);
            System.out.println("✓ User deleted: " + email);
        } else {
            throw new RuntimeException("User not found with email: " + email);
        }
    }

    private void deletePatientRecords(String patientEmail, String patientName) {
        // Delete patient's appointments
        var patientAppointments = appointmentRepository.findByPatientId(patientEmail);
        if (patientAppointments.isEmpty()) {
            patientAppointments = appointmentRepository.findAll().stream()
                    .filter(apt -> patientName.equals(apt.getPatientName()))
                    .collect(Collectors.toList());
        }

        if (!patientAppointments.isEmpty()) {
            appointmentRepository.deleteAll(patientAppointments);
            System.out
                    .println("  ✓ Deleted " + patientAppointments.size() + " appointments for patient: " + patientName);
        }

        // Delete patient's prescriptions
        var patientPrescriptions = prescriptionRepository.findByPatientId(patientEmail);
        if (patientPrescriptions.isEmpty()) {
            patientPrescriptions = prescriptionRepository.findByPatientName(patientName);
        }

        if (!patientPrescriptions.isEmpty()) {
            prescriptionRepository.deleteAll(patientPrescriptions);
            System.out.println(
                    "  ✓ Deleted " + patientPrescriptions.size() + " prescriptions for patient: " + patientName);
        }
    }

    private void deleteDoctorRecords(String doctorEmail, String doctorName) {
        // Delete doctor's appointments
        var doctorAppointments = appointmentRepository.findByDoctorId(doctorEmail);
        if (doctorAppointments.isEmpty()) {
            doctorAppointments = appointmentRepository.findAll().stream()
                    .filter(apt -> doctorName.equals(apt.getDoctorName()))
                    .collect(Collectors.toList());
        }

        if (!doctorAppointments.isEmpty()) {
            appointmentRepository.deleteAll(doctorAppointments);
            System.out.println("  ✓ Deleted " + doctorAppointments.size() + " appointments for doctor: " + doctorName);
        }

        // Delete doctor's prescriptions
        var doctorPrescriptions = prescriptionRepository.findByDoctorId(doctorEmail);
        if (doctorPrescriptions.isEmpty()) {
            doctorPrescriptions = prescriptionRepository.findAll().stream()
                    .filter(pres -> doctorName.equals(pres.getDoctorName()))
                    .collect(Collectors.toList());
        }

        if (!doctorPrescriptions.isEmpty()) {
            prescriptionRepository.deleteAll(doctorPrescriptions);
            System.out
                    .println("  ✓ Deleted " + doctorPrescriptions.size() + " prescriptions for doctor: " + doctorName);
        }

        // Delete doctor record from doctors table
        Doctor doctor = doctorRepository.findByEmail(doctorEmail);
        if (doctor != null) {
            doctorRepository.delete(doctor);
            System.out.println("  ✓ Deleted doctor record: " + doctorName);
        }
    }

    public List<User> getPendingVerificationUsers() {
        return userRepository.findAll().stream()
                .filter(user -> !user.isVerified() &&
                        ("Doctor".equals(user.getRole()) || "Pharmacist".equals(user.getRole())))
                .collect(Collectors.toList());
    }

    public User verifyUser(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setVerified(true);
            User savedUser = userRepository.save(user);

            // If user is a Doctor, create or update doctor record and department
            if ("Doctor".equals(user.getRole())) {
                String departmentName = user.getDepartment() != null ? user.getDepartment() : "General";

                // Create or update department
                Department department = departmentRepository.findByName(departmentName);
                if (department == null) {
                    // Create new department
                    department = new Department();
                    department.setName(departmentName);
                    department.setDescription("Department of " + departmentName);
                    department.setActive(true);
                    departmentRepository.save(department);
                    System.out.println("Created new department: " + departmentName);
                }

                // Create or update doctor record
                Doctor doctor = doctorRepository.findByEmail(email);
                if (doctor != null) {
                    // Doctor record exists, just update availability
                    doctor.setAvailable(true);
                    doctorRepository.save(doctor);
                    System.out.println("Updated Doctor availability for: " + email);
                } else {
                    // Doctor record doesn't exist, create it now with details from user
                    doctor = new Doctor();
                    doctor.setName(user.getName());
                    doctor.setEmail(user.getEmail());
                    doctor.setSpecialization(
                            user.getSpecialization() != null ? user.getSpecialization() : "Not specified");
                    doctor.setDepartment(departmentName);
                    doctor.setPhone(user.getPhone() != null ? user.getPhone() : "");
                    doctor.setExperienceYears(user.getExperienceYears() != null ? user.getExperienceYears() : 0);
                    doctor.setQualification(
                            user.getQualification() != null ? user.getQualification() : "Not specified");
                    doctor.setAvailable(true);

                    doctorRepository.save(doctor);
                    System.out.println("Created Doctor record upon approval for: " + email + " in department: "
                            + departmentName);
                }
            }

            return savedUser;
        }
        throw new RuntimeException("User not found with email: " + email);
    }
}
