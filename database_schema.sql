-- ============================================
-- Hospital Management System - Database Schema
-- PostgreSQL Table Creation Queries
-- ============================================

-- Note: These tables will be auto-created by Hibernate when you start the backend.
-- Only run these manually if you want to create the schema yourself.

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL CHECK (user_role IN ('Doctor', 'Patient', 'Pharmacist', 'Admin'))
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(user_email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(user_role);

-- ============================================
-- 2. APPOINTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id VARCHAR(255),
    doctor_id VARCHAR(255),
    patient_name VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(50),
    contact_number VARCHAR(50),
    department VARCHAR(100),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
    reason VARCHAR(500),
    issue_days INTEGER,
    prescription_given BOOLEAN DEFAULT FALSE,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    cancellation_reason VARCHAR(500)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- ============================================
-- 3. PRESCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id VARCHAR(255),
    doctor_id VARCHAR(255),
    patient_name VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    gender VARCHAR(50),
    age INTEGER,
    diagnosis VARCHAR(1000),
    symptoms VARCHAR(1000),
    additional_notes VARCHAR(1000),
    follow_up_date DATE,
    created_date DATE DEFAULT CURRENT_DATE,
    dispensed_status VARCHAR(50) DEFAULT 'Pending' CHECK (dispensed_status IN ('Pending', 'Dispensed', 'Cancelled')),
    dispensed_date TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_name ON prescriptions(patient_name);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(dispensed_status);

-- ============================================
-- 4. MEDICINES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    instruction VARCHAR(500),
    quantity VARCHAR(50),
    CONSTRAINT fk_prescription
        FOREIGN KEY (prescription_id)
        REFERENCES prescriptions(id)
        ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_medicines_prescription ON medicines(prescription_id);

-- ============================================
-- 5. DEPARTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(1000),
    head VARCHAR(255),
    active BOOLEAN DEFAULT TRUE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(name);
CREATE INDEX IF NOT EXISTS idx_departments_active ON departments(active);

-- ============================================
-- 6. DOCTORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    specialization VARCHAR(255),
    department VARCHAR(255),
    phone VARCHAR(50),
    experience_years INTEGER,
    qualification VARCHAR(500),
    available BOOLEAN DEFAULT TRUE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_doctors_email ON doctors(email);
CREATE INDEX IF NOT EXISTS idx_doctors_department ON doctors(department);
CREATE INDEX IF NOT EXISTS idx_doctors_available ON doctors(available);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample users
INSERT INTO users (id, user_email, user_password, user_name, user_role) VALUES
(gen_random_uuid(), 'admin@hospital.com', 'admin123', 'Admin User', 'Admin'),
(gen_random_uuid(), 'doctor1@hospital.com', 'doctor123', 'Dr. Sarah Johnson', 'Doctor'),
(gen_random_uuid(), 'doctor2@hospital.com', 'doctor123', 'Dr. Michael Chen', 'Doctor'),
(gen_random_uuid(), 'patient1@hospital.com', 'patient123', 'John Smith', 'Patient'),
(gen_random_uuid(), 'patient2@hospital.com', 'patient123', 'Emma Wilson', 'Patient'),
(gen_random_uuid(), 'pharmacist@hospital.com', 'pharma123', 'Robert Brown', 'Pharmacist')
ON CONFLICT (user_email) DO NOTHING;

-- Note: Departments and Doctors will be auto-seeded by the DataSeeder class on application startup

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'appointments', 'prescriptions', 'medicines');

-- Count records in each table
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM appointments) as total_appointments,
    (SELECT COUNT(*) FROM prescriptions) as total_prescriptions,
    (SELECT COUNT(*) FROM medicines) as total_medicines;

-- View all users
SELECT user_name, user_email, user_role FROM users ORDER BY user_role;

-- ============================================
-- USEFUL QUERIES FOR MANAGEMENT
-- ============================================

-- View all appointments with patient and doctor names
SELECT 
    a.id,
    a.patient_name,
    a.doctor_name,
    a.appointment_date,
    a.appointment_time,
    a.status,
    a.department
FROM appointments a
ORDER BY a.appointment_date DESC, a.appointment_time DESC;

-- View all prescriptions with medicine count
SELECT 
    p.id,
    p.patient_name,
    p.doctor_name,
    p.diagnosis,
    p.created_date,
    p.dispensed_status,
    COUNT(m.id) as medicine_count
FROM prescriptions p
LEFT JOIN medicines m ON m.prescription_id = p.id
GROUP BY p.id, p.patient_name, p.doctor_name, p.diagnosis, p.created_date, p.dispensed_status
ORDER BY p.created_date DESC;

-- View prescription details with all medicines
SELECT 
    p.patient_name,
    p.doctor_name,
    p.diagnosis,
    p.symptoms,
    m.medicine_name,
    m.dosage,
    m.frequency,
    m.duration,
    m.quantity
FROM prescriptions p
LEFT JOIN medicines m ON m.prescription_id = p.id
ORDER BY p.created_date DESC;

-- Get statistics
SELECT 
    'Total Users' as metric, COUNT(*)::text as value FROM users
UNION ALL
SELECT 'Total Doctors', COUNT(*)::text FROM users WHERE user_role = 'Doctor'
UNION ALL
SELECT 'Total Patients', COUNT(*)::text FROM users WHERE user_role = 'Patient'
UNION ALL
SELECT 'Total Appointments', COUNT(*)::text FROM appointments
UNION ALL
SELECT 'Scheduled Appointments', COUNT(*)::text FROM appointments WHERE status = 'Scheduled'
UNION ALL
SELECT 'Completed Appointments', COUNT(*)::text FROM appointments WHERE status = 'Completed'
UNION ALL
SELECT 'Total Prescriptions', COUNT(*)::text FROM prescriptions
UNION ALL
SELECT 'Pending Prescriptions', COUNT(*)::text FROM prescriptions WHERE dispensed_status = 'Pending'
UNION ALL
SELECT 'Dispensed Prescriptions', COUNT(*)::text FROM prescriptions WHERE dispensed_status = 'Dispensed';

-- ============================================
-- CLEANUP QUERIES (Use with caution!)
-- ============================================

-- Delete all data but keep tables
-- TRUNCATE TABLE medicines CASCADE;
-- TRUNCATE TABLE prescriptions CASCADE;
-- TRUNCATE TABLE appointments CASCADE;
-- TRUNCATE TABLE users CASCADE;

-- Drop all tables (Use only if you want to start fresh)
-- DROP TABLE IF EXISTS medicines CASCADE;
-- DROP TABLE IF EXISTS prescriptions CASCADE;
-- DROP TABLE IF EXISTS appointments CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- END OF SCHEMA
-- ============================================
