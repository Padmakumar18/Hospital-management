-- Migration script to update users table with verification and doctor-specific fields
-- This script is idempotent (safe to run multiple times)

-- Step 1: Add verified column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;

-- Step 2: Add phone column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Step 3: Add doctor-specific columns if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS specialization VARCHAR(100);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS department VARCHAR(100);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS qualification VARCHAR(200);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS license_number VARCHAR(50);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS experience_years INTEGER;

-- Step 4: Set default values based on role
-- Set verified = TRUE for all existing Patients and Admins
UPDATE users 
SET verified = TRUE 
WHERE user_role IN ('Patient', 'Admin') AND verified IS NULL OR verified = FALSE;

-- Set verified = FALSE for all existing Doctors and Pharmacists (pending approval)
UPDATE users 
SET verified = FALSE 
WHERE user_role IN ('Doctor', 'Pharmacist');

-- Step 5: Verify the changes
SELECT 
    user_name,
    user_email,
    user_role,
    verified,
    phone,
    specialization,
    department,
    qualification,
    license_number,
    experience_years
FROM users
ORDER BY user_role, user_name;

-- Step 6: Show summary by role
SELECT 
    user_role,
    COUNT(*) as total_users,
    SUM(CASE WHEN verified = TRUE THEN 1 ELSE 0 END) as verified_users,
    SUM(CASE WHEN verified = FALSE THEN 1 ELSE 0 END) as pending_approval
FROM users
GROUP BY user_role
ORDER BY user_role;
