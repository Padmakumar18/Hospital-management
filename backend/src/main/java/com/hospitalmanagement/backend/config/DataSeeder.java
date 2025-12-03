package com.hospitalmanagement.backend.config;

import com.hospitalmanagement.backend.model.Department;
import com.hospitalmanagement.backend.model.Doctor;
import com.hospitalmanagement.backend.repository.DepartmentRepository;
import com.hospitalmanagement.backend.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {

        @Bean
        CommandLineRunner initDatabase(DepartmentRepository departmentRepository, DoctorRepository doctorRepository) {
                return args -> {
                        // Only seed if database is empty
                        if (departmentRepository.count() == 0) {
                                seedDepartments(departmentRepository);
                        }

                        if (doctorRepository.count() == 0) {
                                seedDoctors(doctorRepository);
                        }
                };
        }

        private void seedDepartments(DepartmentRepository departmentRepository) {
                List<Department> departments = Arrays.asList(
                                createDepartment("General Medicine",
                                                "Primary healthcare and general medical conditions", true),
                                createDepartment("Cardiology", "Heart and cardiovascular system care", true),
                                createDepartment("Dermatology", "Skin, hair, and nail conditions", true),
                                createDepartment("Neurology", "Brain and nervous system disorders", true),
                                createDepartment("Orthopedics", "Bone, joint, and musculoskeletal care", true),
                                createDepartment("Pediatrics", "Healthcare for infants, children, and adolescents",
                                                true),
                                createDepartment("Gynecology", "Women's reproductive health", true),
                                createDepartment("ENT", "Ear, nose, and throat conditions", true),
                                createDepartment("Ophthalmology", "Eye care and vision", true),
                                createDepartment("Psychiatry", "Mental health and behavioral disorders", true));

                departmentRepository.saveAll(departments);
                System.out.println("✓ Seeded " + departments.size() + " departments");
        }

        private void seedDoctors(DoctorRepository doctorRepository) {
                List<Doctor> doctors = Arrays.asList(
                                // General Medicine
                                createDoctor("Dr. Neha Bhatia", "neha.bhatia@hospital.com", "General Medicine",
                                                "Internal Medicine",
                                                "+91 9876543210", true, 12, "MBBS, MD"),
                                createDoctor("Dr. Rajesh Kumar", "rajesh.kumar@hospital.com", "General Medicine",
                                                "Family Medicine",
                                                "+91 9876543211", true, 15, "MBBS, MD"),
                                createDoctor("Dr. Priya Sharma", "priya.sharma@hospital.com", "General Medicine",
                                                "General Practice",
                                                "+91 9876543212", true, 8, "MBBS"),

                                // Cardiology
                                createDoctor("Dr. Meena Kapoor", "meena.kapoor@hospital.com", "Cardiology",
                                                "Interventional Cardiology",
                                                "+91 9876543213", true, 18, "MBBS, MD, DM"),
                                createDoctor("Dr. Arjun Singh", "arjun.singh@hospital.com", "Cardiology",
                                                "Clinical Cardiology",
                                                "+91 9876543214", true, 20, "MBBS, MD, DM"),
                                createDoctor("Dr. Kavita Reddy", "kavita.reddy@hospital.com", "Cardiology",
                                                "Pediatric Cardiology",
                                                "+91 9876543215", true, 14, "MBBS, MD, DM"),

                                // Dermatology
                                createDoctor("Dr. Rajesh Kumar", "rajesh.derm@hospital.com", "Dermatology",
                                                "Clinical Dermatology",
                                                "+91 9876543216", true, 10, "MBBS, MD"),
                                createDoctor("Dr. Sneha Patel", "sneha.patel@hospital.com", "Dermatology",
                                                "Cosmetic Dermatology",
                                                "+91 9876543217", true, 9, "MBBS, MD"),
                                createDoctor("Dr. Amit Gupta", "amit.gupta@hospital.com", "Dermatology",
                                                "Dermatosurgery",
                                                "+91 9876543218", true, 11, "MBBS, MD"),

                                // Neurology
                                createDoctor("Dr. Sneha Iyer", "sneha.iyer@hospital.com", "Neurology",
                                                "Clinical Neurology",
                                                "+91 9876543219", true, 13, "MBBS, MD, DM"),
                                createDoctor("Dr. Vikram Rao", "vikram.rao@hospital.com", "Neurology", "Neurosurgery",
                                                "+91 9876543220",
                                                true, 16, "MBBS, MS, MCh"),
                                createDoctor("Dr. Deepika Singh", "deepika.singh@hospital.com", "Neurology",
                                                "Pediatric Neurology",
                                                "+91 9876543221", true, 12, "MBBS, MD, DM"),

                                // Orthopedics
                                createDoctor("Dr. Amitabh Singh", "amitabh.singh@hospital.com", "Orthopedics",
                                                "Joint Replacement",
                                                "+91 9876543222", true, 19, "MBBS, MS"),
                                createDoctor("Dr. Ravi Kumar", "ravi.kumar@hospital.com", "Orthopedics",
                                                "Sports Medicine",
                                                "+91 9876543223", true, 14, "MBBS, MS"),
                                createDoctor("Dr. Meera Joshi", "meera.joshi@hospital.com", "Orthopedics",
                                                "Spine Surgery",
                                                "+91 9876543224", true, 17, "MBBS, MS, MCh"),

                                // Pediatrics
                                createDoctor("Dr. Anita Gupta", "anita.gupta@hospital.com", "Pediatrics",
                                                "General Pediatrics",
                                                "+91 9876543225", true, 11, "MBBS, MD"),
                                createDoctor("Dr. Suresh Patel", "suresh.patel@hospital.com", "Pediatrics",
                                                "Neonatology",
                                                "+91 9876543226", true, 15, "MBBS, MD, DM"),
                                createDoctor("Dr. Kavya Nair", "kavya.nair@hospital.com", "Pediatrics",
                                                "Pediatric Intensive Care",
                                                "+91 9876543227", true, 10, "MBBS, MD"),

                                // Gynecology
                                createDoctor("Dr. Priya Nair", "priya.nair@hospital.com", "Gynecology", "Obstetrics",
                                                "+91 9876543228",
                                                true, 13, "MBBS, MD"),
                                createDoctor("Dr. Sunita Sharma", "sunita.sharma@hospital.com", "Gynecology",
                                                "Gynecologic Oncology",
                                                "+91 9876543229", true, 16, "MBBS, MD, DM"),
                                createDoctor("Dr. Rekha Verma", "rekha.verma@hospital.com", "Gynecology",
                                                "Reproductive Medicine",
                                                "+91 9876543230", true, 12, "MBBS, MD"),

                                // ENT
                                createDoctor("Dr. Mohammed Ali", "mohammed.ali@hospital.com", "ENT", "Otology",
                                                "+91 9876543231", true,
                                                14, "MBBS, MS"),
                                createDoctor("Dr. Deepak Joshi", "deepak.joshi@hospital.com", "ENT", "Rhinology",
                                                "+91 9876543232",
                                                true, 11, "MBBS, MS"),
                                createDoctor("Dr. Sita Ram", "sita.ram@hospital.com", "ENT", "Head and Neck Surgery",
                                                "+91 9876543233",
                                                true, 15, "MBBS, MS"),

                                // Ophthalmology
                                createDoctor("Dr. Rahul Verma", "rahul.verma@hospital.com", "Ophthalmology",
                                                "Cataract Surgery",
                                                "+91 9876543234", true, 17, "MBBS, MS"),
                                createDoctor("Dr. Nisha Patel", "nisha.patel@hospital.com", "Ophthalmology",
                                                "Retina Specialist",
                                                "+91 9876543235", true, 13, "MBBS, MS"),
                                createDoctor("Dr. Kiran Kumar", "kiran.kumar@hospital.com", "Ophthalmology",
                                                "Glaucoma Specialist",
                                                "+91 9876543236", true, 12, "MBBS, MS"),

                                // Psychiatry
                                createDoctor("Dr. Aarav Sharma", "aarav.sharma@hospital.com", "Psychiatry",
                                                "Adult Psychiatry",
                                                "+91 9876543237", true, 10, "MBBS, MD"),
                                createDoctor("Dr. Pooja Singh", "pooja.singh@hospital.com", "Psychiatry",
                                                "Child Psychiatry",
                                                "+91 9876543238", true, 9, "MBBS, MD"),
                                createDoctor("Dr. Manish Gupta", "manish.gupta@hospital.com", "Psychiatry",
                                                "Addiction Psychiatry",
                                                "+91 9876543239", true, 11, "MBBS, MD"));

                doctorRepository.saveAll(doctors);
                System.out.println("✓ Seeded " + doctors.size() + " doctors");
        }

        private Department createDepartment(String name, String description, boolean active) {
                Department dept = new Department();
                dept.setName(name);
                dept.setDescription(description);
                dept.setActive(active);
                return dept;
        }

        private Doctor createDoctor(String name, String email, String department, String specialization,
                        String phone, boolean available, int experienceYears, String qualification) {
                Doctor doctor = new Doctor();
                doctor.setName(name);
                doctor.setEmail(email);
                doctor.setDepartment(department);
                doctor.setSpecialization(specialization);
                doctor.setPhone(phone);
                doctor.setAvailable(available);
                doctor.setExperienceYears(experienceYears);
                doctor.setQualification(qualification);
                return doctor;
        }
}
