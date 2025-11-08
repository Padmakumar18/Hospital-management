-- Add verified column to users table
-- This column tracks whether a user has been approved by an admin
-- Default value is false (not verified)

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;

-- Optional: Set existing admin users as verified
UPDATE users 
SET verified = TRUE 
WHERE user_role = 'ADMIN';

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'verified';
