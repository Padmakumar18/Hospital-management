-- ============================================
-- Add Verified Column to Users Table
-- ============================================

-- Check if column exists (PostgreSQL)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'verified'
    ) THEN
        -- Add verified column if it doesn't exist
        ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Column "verified" added to users table';
    ELSE
        RAISE NOTICE 'Column "verified" already exists';
    END IF;
END $$;

-- Set default value for existing NULL values
UPDATE users 
SET verified = FALSE 
WHERE verified IS NULL;

-- Set existing Patients and Admins as verified (backward compatibility)
UPDATE users 
SET verified = TRUE 
WHERE user_role IN ('Patient', 'Admin') 
  AND (verified IS NULL OR verified = FALSE);

-- Set Doctors and Pharmacists as not verified (need approval)
UPDATE users 
SET verified = FALSE 
WHERE user_role IN ('Doctor', 'Pharmacist');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_verified ON users(verified);

-- ============================================
-- Verification Queries
-- ============================================

-- Check the column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'verified';

-- Check verified status by role
SELECT 
    user_role,
    verified,
    COUNT(*) as count
FROM users
GROUP BY user_role, verified
ORDER BY user_role, verified;

-- Show all users with verification status
SELECT 
    user_email,
    user_name,
    user_role,
    verified,
    CASE 
        WHEN verified THEN 'Approved'
        ELSE 'Pending Approval'
    END as status
FROM users
ORDER BY verified, user_role, user_name;

-- Show only unverified users (pending approval)
SELECT 
    user_email,
    user_name,
    user_role,
    phone,
    specialization,
    department,
    experience_years,
    qualification
FROM users
WHERE verified = FALSE
ORDER BY user_role, user_name;

-- ============================================
-- Manual Verification Commands
-- ============================================

-- Verify a specific user
-- UPDATE users SET verified = TRUE WHERE user_email = 'doctor@hospital.com';

-- Verify all doctors in a department
-- UPDATE users SET verified = TRUE WHERE user_role = 'Doctor' AND department = 'Cardiology';

-- Reject (delete) a user
-- DELETE FROM users WHERE user_email = 'rejected@hospital.com';

-- ============================================
-- Statistics
-- ============================================

-- Count users by verification status
SELECT 
    CASE 
        WHEN verified THEN 'Verified'
        ELSE 'Pending'
    END as verification_status,
    COUNT(*) as total_users
FROM users
GROUP BY verified;

-- Count by role and verification
SELECT 
    user_role,
    SUM(CASE WHEN verified THEN 1 ELSE 0 END) as verified_count,
    SUM(CASE WHEN NOT verified THEN 1 ELSE 0 END) as pending_count,
    COUNT(*) as total
FROM users
GROUP BY user_role
ORDER BY user_role;

-- ============================================
-- Success Message
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '✓ Verified column setup complete!';
    RAISE NOTICE '✓ Patients and Admins: Auto-verified';
    RAISE NOTICE '✓ Doctors and Pharmacists: Require approval';
END $$;
