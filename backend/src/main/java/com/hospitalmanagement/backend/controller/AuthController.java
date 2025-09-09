package com.hospitalmanagement.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

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
