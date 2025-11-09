package com.hospitalmanagement.backend.controller;

import com.hospitalmanagement.backend.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hospitalmanagement.backend.service.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    static class LoginRequest {
        public String email;
        public String password;
    }

    static class LoginResponse {
        public boolean success;
        public String message;
        public User user;

        public LoginResponse(boolean success, String message, User user) {
            this.success = success;
            this.message = message;
            this.user = user;
        }
    }

    static class SignupRequest {
        public String email;
        public String password;
        public String name;
        public String role;
        public String phone;
        public String specialization;
        public String department;
        public String qualification;
        public String licenseNumber;
        public Integer experienceYears;
    }

    static class SignupResponse {
        public boolean success;
        public String message;

        public SignupResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@RequestBody SignupRequest signupRequest) {
        try {
            User user = new User();
            user.setName(signupRequest.name);
            user.setEmail(signupRequest.email);
            user.setPassword(signupRequest.password);
            user.setRole(signupRequest.role);

            // Set phone if provided
            if (signupRequest.phone != null && !signupRequest.phone.isEmpty()) {
                user.setPhone(signupRequest.phone);
            }

            // Set verification status based on role
            // Patients and Admins are auto-verified
            // Doctors and Pharmacists need admin approval
            if ("Patient".equals(signupRequest.role) || "Admin".equals(signupRequest.role)) {
                user.setVerified(true);
            } else {
                user.setVerified(false);
            }

            // Store doctor/pharmacist specific fields
            if ("Doctor".equals(signupRequest.role) || "Pharmacist".equals(signupRequest.role)) {
                user.setSpecialization(signupRequest.specialization);
                user.setDepartment(signupRequest.department);
                user.setQualification(signupRequest.qualification);
                user.setLicenseNumber(signupRequest.licenseNumber);
                user.setExperienceYears(signupRequest.experienceYears);
            }

            // Create user and doctor record if role is Doctor
            userService.createUserWithDoctorRecord(user);

            String message = user.isVerified()
                    ? "Account created successfully!"
                    : "Account created! Waiting for admin approval.";

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new SignupResponse(true, message));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new SignupResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        User user = userService.login(request.email, request.password);

        System.out.println("-------------------");
        System.out.println("Login attempt for: " + request.email);
        System.out.println("User found: " + (user != null));
        if (user != null) {
            System.out.println("User verified: " + user.isVerified());
            System.out.println("User role: " + user.getRole());
        }
        System.out.println("-------------------");

        if (user != null) {
            // Check if user is verified (for Doctor and Pharmacist)
            if (!user.isVerified() && ("Doctor".equals(user.getRole()) || "Pharmacist".equals(user.getRole()))) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(new LoginResponse(false,
                                "Your account is pending admin approval. Please wait for verification.", null));
            }

            // Password verification is done in UserService using BCrypt
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new LoginResponse(true, "Login successful!", user));
        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "Invalid username or password", null));
        }
    }
}
