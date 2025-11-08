-- ============================================
-- User Table Update - Add Verification Fields
-- ============================================

-- Add verification status column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;

-- Add phone column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

-- Add specialization column (for Doctor/Pharmacist)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS specialization VARCHAR(255);

-- Add department column (for Doctor/Pharmacist)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS department VARCHAR(255);

-- Add experience years column (for Doctor/Pharmacist)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS experience_years INTEGER;

-- Add qualification column (for Doctor/Pharmacist)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS qualification VARCHAR(500);

-- Add license number column (for Doctor/Pharmacist)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS license_number VARCHAR(100);

-- Update existing users to be verified (backward compatibility)
UPDATE users 
SET verified = TRUE 
WHERE verified IS NULL OR verified = FALSE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_verified ON users(verified);

-- ============================================
-- Verification
-- ============================================

-- Check new columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Check verified users
SELECT user_email, user_role, verified 
FROM users;
