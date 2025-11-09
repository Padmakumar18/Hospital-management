-- Clean up duplicate doctor account
-- Run this if you get "duplicate key value" error

-- Delete from doctors table first (if exists)
DELETE FROM doctors WHERE email = 'doctor@gmail.com';

-- Delete from users table
DELETE FROM users WHERE user_email = 'doctor@gmail.com';

-- Verify deletion
SELECT * FROM users WHERE user_email = 'doctor@gmail.com';
SELECT * FROM doctors WHERE email = 'doctor@gmail.com';

-- Should return no rows
