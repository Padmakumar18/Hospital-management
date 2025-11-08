-- Complete Users Table Schema
-- This table stores both Patients and Doctors with role-specific fields

-- If creating from scratch, use this:
CREATE TABLE IF NOT EXISTS users (
    -- Common fields for all users
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_role VARCHAR(20) NOT NULL CHECK (user_role IN ('Patient', 'Doctor', 'Pharmacist', 'Admin')),
    phone VARCHAR(20),
    
    -- Verification field
    -- TRUE for Patient and Admin (auto-verified)
    -- FALSE for Doctor and Pharmacist (needs admin approval)
    verified BOOLEAN DEFAULT FALSE,
    
    -- Doctor/Pharmacist specific fields (NULL for Patients)
    specialization VARCHAR(100),
    department VARCHAR(100),
    qualification VARCHAR(200),
    license_number VARCHAR(50),
    experience_years INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(user_email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(user_role);
CREATE INDEX IF NOT EXISTS idx_users_verified ON users(verified);
CREATE INDEX IF NOT EXISTS idx_users_role_verified ON users(user_role, verified);

-- Example data structure:

-- Patient example:
-- {
--   id: "uuid",
--   user_name: "John Doe",
--   user_email: "john@example.com",
--   user_password: "hashed_password",
--   user_role: "Patient",
--   phone: "1234567890",
--   verified: true,
--   specialization: null,
--   department: null,
--   qualification: null,
--   license_number: null,
--   experience_years: null
-- }

-- Doctor example:
-- {
--   id: "uuid",
--   user_name: "Dr. Jane Smith",
--   user_email: "jane@example.com",
--   user_password: "hashed_password",
--   user_role: "Doctor",
--   phone: "0987654321",
--   verified: false,  -- Pending admin approval
--   specialization: "Cardiology",
--   department: "Cardiology",
--   qualification: "MD, FACC",
--   license_number: "MD12345",
--   experience_years: 10
-- }
