package com.hospitalmanagement.backend.controller;

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

    // Simple login request DTO
    static class LoginRequest {
        public String email;
        public String password;
    }

    // Simple login response DTO
    static class LoginResponse {
        public boolean success;
        public String message;

        public LoginResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }

    static class SignupRequest {
        public String email;
        public String password;
        public String name;
        public String role;
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
            // role can be saved if you add a column in User entity

            userService.createUser(user);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new SignupResponse(true, "Account created successfully!"));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new SignupResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        System.out.println(request.email);
        System.out.println(request.password);
        // Hardcoded user credentials for demo
        String demoUser = "padmakumar23.dev@gmail.com";
        String demoPass = "##pk545A";

        if (demoUser.equals(request.email) && demoPass.equals(request.password)) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new LoginResponse(true, "Login successful!"));
        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "Invalid username or password"));
        }
    }
}
