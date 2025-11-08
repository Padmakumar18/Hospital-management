-- Initial test data for Hospital Management System
-- This file will be executed automatically by Spring Boot on startup

-- Insert sample users (password is plain text for demo - should be encrypted in production)
INSERT INTO users (id, user_email, user_password, user_name, user_role) VALUES
(gen_random_uuid(), 'admin@hospital.com', 'admin123', 'Admin User', 'Admin'),
(gen_random_uuid(), 'doctor1@hospital.com', 'doctor123', 'Dr. Sarah Johnson', 'Doctor'),
(gen_random_uuid(), 'doctor2@hospital.com', 'doctor123', 'Dr. Michael Chen', 'Doctor'),
(gen_random_uuid(), 'patient1@hospital.com', 'patient123', 'John Smith', 'Patient'),
(gen_random_uuid(), 'patient2@hospital.com', 'patient123', 'Emma Wilson', 'Patient'),
(gen_random_uuid(), 'pharmacist@hospital.com', 'pharma123', 'Robert Brown', 'Pharmacist')
ON CONFLICT DO NOTHING;
