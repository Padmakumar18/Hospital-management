-- ============================================
-- Password Migration Script
-- ============================================
-- This script is for reference only.
-- Existing passwords in the database need to be re-hashed.
-- Users will need to reset their passwords or re-signup.

-- IMPORTANT: After implementing BCrypt hashing, existing users 
-- with plain text passwords will NOT be able to login.

-- Option 1: Delete all users and let them re-signup
-- TRUNCATE TABLE users CASCADE;

-- Option 2: Update test users with BCrypt hashed passwords
-- BCrypt hash for "admin123": $2a$10$xQjKZZ8Z8Z8Z8Z8Z8Z8Z8O... (example)
-- BCrypt hash for "doctor123": $2a$10$yQjKZZ8Z8Z8Z8Z8Z8Z8Z8O... (example)
-- BCrypt hash for "patient123": $2a$10$zQjKZZ8Z8Z8Z8Z8Z8Z8Z8O... (example)

-- You can generate BCrypt hashes using:
-- 1. Online tool: https://bcrypt-generator.com/
-- 2. Java code in your application
-- 3. Command line tools

-- Example update (replace with actual BCrypt hashes):
-- UPDATE users SET user_password = '$2a$10$...' WHERE user_email = 'admin@hospital.com';
-- UPDATE users SET user_password = '$2a$10$...' WHERE user_email = 'doctor1@hospital.com';
-- UPDATE users SET user_password = '$2a$10$...' WHERE user_email = 'patient1@hospital.com';

-- ============================================
-- Recommended Approach
-- ============================================
-- 1. Backup your database
-- 2. Delete all users: TRUNCATE TABLE users CASCADE;
-- 3. Let users re-signup with new hashed passwords
-- 4. Or manually create test users through the signup API

-- ============================================
-- Test User Creation via API
-- ============================================
-- After implementing BCrypt, create test users via POST /auth/signup:
-- {
--   "email": "admin@hospital.com",
--   "password": "admin123",
--   "name": "Admin User",
--   "role": "Admin"
-- }

-- The password will be automatically hashed by the backend.
