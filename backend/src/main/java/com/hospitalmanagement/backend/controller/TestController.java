package com.hospitalmanagement.backend.controller;

import com.hospitalmanagement.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    private final UserRepository userRepository;

    public TestController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/db")
    public String checkDbConnection() {
        long count = userRepository.count(); // runs SELECT COUNT(*) on User table
        return "Database connection successful! User count: " + count;
    }
}
