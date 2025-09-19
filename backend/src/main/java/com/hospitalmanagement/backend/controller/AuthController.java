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

        public LoginResponse(boolean success, String message,User user) {
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
        User user = userService.login(request.email, request.password);

        System.out.println("-------------------");
        System.out.println(user.getEmail());
        System.out.println(user.getPassword());
        System.out.println(user.getRole());
        System.out.println("-------------------");
        System.out.println(request.email);
        System.out.println(request.password);

        if (user != null && user.getEmail().equals(request.email) && user.getPassword().equals(request.password)) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new LoginResponse(true, "Login successful!",user));
        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "Invalid username or password",null));
        }
    }
}
