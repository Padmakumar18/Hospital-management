package com.hospitalmanagement.backend.service;

import com.hospitalmanagement.backend.model.Doctor;
import com.hospitalmanagement.backend.model.User;
import com.hospitalmanagement.backend.repository.DoctorRepository;
import com.hospitalmanagement.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DoctorRepository doctorRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            DoctorRepository doctorRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.doctorRepository = doctorRepository;
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

        // If user is a Doctor, create corresponding Doctor record
        if ("Doctor".equals(user.getRole())) {
            Doctor doctor = new Doctor();
            doctor.setName(user.getName());
            doctor.setEmail(user.getEmail());
            doctor.setSpecialization("Not specified");
            doctor.setDepartment("Not specified");
            doctor.setPhone(user.getPhone() != null ? user.getPhone() : "");
            doctor.setExperienceYears(0);
            doctor.setQualification("Not specified");
            doctor.setAvailable(user.isVerified()); // Available only if verified

            doctorRepository.save(doctor);
            System.out.println("Created Doctor record for: " + user.getEmail());
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

    public void deleteUser(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            userRepository.delete(user);
        } else {
            throw new RuntimeException("User not found with email: " + email);
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

            // If user is a Doctor, update doctor availability
            if ("Doctor".equals(user.getRole())) {
                Doctor doctor = doctorRepository.findByEmail(email);
                if (doctor != null) {
                    doctor.setAvailable(true);
                    doctorRepository.save(doctor);
                    System.out.println("Updated Doctor availability for: " + email);
                }
            }

            return savedUser;
        }
        throw new RuntimeException("User not found with email: " + email);
    }
}
