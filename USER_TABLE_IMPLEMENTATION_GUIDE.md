# User Table Implementation Guide

## Overview

The `users` table stores both Patients and Doctors with role-specific fields. The table structure supports multiple user types with conditional field usage.

## Table Structure

### Common Fields (All Users)

- `id` (UUID) - Primary key
- `user_name` (VARCHAR) - Full name
- `user_email` (VARCHAR) - Email address (unique)
- `user_password` (VARCHAR) - Hashed password
- `user_role` (VARCHAR) - Role: Patient, Doctor, Pharmacist, or Admin
- `phone` (VARCHAR) - Phone number
- `verified` (BOOLEAN) - Verification status

### Doctor/Pharmacist Specific Fields

- `specialization` (VARCHAR) - Medical specialization
- `department` (VARCHAR) - Department
- `qualification` (VARCHAR) - Educational qualifications
- `license_number` (VARCHAR) - Medical license number
- `experience_years` (INTEGER) - Years of experience

## Verification Logic

### Auto-Verified (verified = TRUE)

- **Patient**: Automatically verified upon signup
- **Admin**: Automatically verified upon signup

### Requires Approval (verified = FALSE)

- **Doctor**: Needs admin approval before login
- **Pharmacist**: Needs admin approval before login

## Field Usage by Role

### Patient

```
Required: name, email, password, role, phone
Optional: None
Unused: specialization, department, qualification, license_number, experience_years
Default verified: TRUE
```

### Doctor/Pharmacist

```
Required: name, email, password, role, phone
Optional: specialization, department, qualification, license_number, experience_years
Default verified: FALSE (pending admin approval)
```

### Admin

```
Required: name, email, password, role
Optional: phone
Unused: specialization, department, qualification, license_number, experience_years
Default verified: TRUE
```

## Migration Steps

1. **Run the migration script**: `MIGRATE_USERS_TABLE.sql`

   - Adds all required columns if they don't exist
   - Sets default verification status based on role
   - Safe to run multiple times (idempotent)

2. **Verify the changes**:

   ```sql
   SELECT user_role, verified, COUNT(*)
   FROM users
   GROUP BY user_role, verified;
   ```

3. **Backend is already configured**:
   - User model has all fields defined
   - AuthController sets verification based on role
   - UserService creates Doctor records automatically

## Current Implementation Status

✅ User model has all required fields
✅ Verification column with default value
✅ Doctor-specific fields (nullable for Patients)
✅ AuthController sets verification based on role
✅ UserService creates Doctor records for Doctor role
✅ Login blocks unverified Doctors/Pharmacists
✅ Frontend handles pending approval flow

## Testing

### Test Patient Signup

1. Sign up as Patient
2. Should be auto-verified (verified = true)
3. Should login immediately

### Test Doctor Signup

1. Sign up as Doctor
2. Should NOT be verified (verified = false)
3. Should redirect to waiting approval page
4. Cannot login until admin approves

### Test Admin Approval

1. Admin logs in
2. Views pending users
3. Approves Doctor account
4. Doctor can now login
