package com.hospitalmanagement.backend.controller;

import com.hospitalmanagement.backend.model.User;
import com.hospitalmanagement.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/test")
public class TestController {

    private final UserRepository userRepository;

    public TestController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ Check DB connection
    @GetMapping("/db")
    public String checkDbConnection() {
        long count = userRepository.count(); // runs SELECT COUNT(*) on users table
        return "Database connection successful! User count: " + count;
    }

    // ✅ Get all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Insert a dummy user (for testing write access)
    @PostMapping("/add")
    public String addDummyUser() {
        User user = new User();
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("12345");
        userRepository.save(user);
        return "Dummy user added successfully!";
    }

    // ✅ Get user by ID
    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}
