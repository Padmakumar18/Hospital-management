# Clean Start Guide - No Mock Data

## Overview

After deleting all database records, the system will automatically populate data when doctors create accounts.

## What Happens Automatically

### When a Doctor Signs Up:

1. **User Record Created** (in `users` table)

   - Name, Email, Password (hashed), Role, Phone
   - Professional details: Specialization, Department, Qualification, License, Experience
   - `verified = FALSE` (pending admin approval)

2. **Waiting for Admin Approval**
   - Doctor cannot login yet
   - Redirected to "Waiting Approval" page

### When Admin Approves Doctor:

1. **User Record Updated**

   - `verified = TRUE`

2. **Department Record Created** (in `departments` table)

   - If department doesn't exist, creates new one
   - Name: From doctor's signup (e.g., "Cardiology")
   - Description: "Department of [Name]"
   - Active: TRUE

3. **Doctor Record Created** (in `doctors` table)
   - Name, Email, Phone
   - Specialization, Department, Qualification, Experience
   - Available: TRUE

## Database Tables After Doctor Signup & Approval

### users table

```
id | user_name | user_email | user_password | user_role | phone | verified | specialization | department | qualification | license_number | experience_years
```

### doctors table

```
id | name | email | phone | specialization | department | qualification | experience_years | available
```

### departments table

```
id | name | description | head | active
```

## Clean Database Steps

### 1. Delete All Records

```sql
-- Delete in this order to avoid foreign key issues
DELETE FROM prescriptions;
DELETE FROM appointments;
DELETE FROM doctors;
DELETE FROM departments;
DELETE FROM users;
```

### 2. Verify Tables are Empty

```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM doctors;
SELECT COUNT(*) FROM departments;
SELECT COUNT(*) FROM appointments;
SELECT COUNT(*) FROM prescriptions;
-- All should return 0
```

### 3. Restart Backend

```bash
cd backend
mvnw clean compile
mvnw spring-boot:run
```

## Testing the Flow

### Step 1: Create Admin Account

1. Go to signup page
2. Fill in:
   - Name: Admin User
   - Email: admin@hospital.com
   - Phone: 1234567890
   - Password: admin123
   - Role: Admin
3. Click "Create Account"
4. Admin is auto-verified, login immediately

### Step 2: Create Doctor Account

1. Logout (if logged in)
2. Go to signup page
3. Fill in:
   - Name: Dr. John Smith
   - Email: john.smith@hospital.com
   - Phone: 9876543210
   - Password: doctor123
   - Role: Doctor
   - **Professional Details:**
     - Specialization: Cardiology
     - Department: Cardiology Department
     - Qualification: MBBS, MD
     - License Number: MD12345
     - Experience: 10 years
4. Click "Create Account"
5. Redirected to "Waiting Approval" page
6. Cannot login yet

### Step 3: Admin Approves Doctor

1. Login as admin (admin@hospital.com)
2. Click "Pending Approvals" tab (shows badge with count)
3. See doctor's details:
   - Name, Email, Phone
   - Specialization, Department, Qualification, License, Experience
4. Click "Approve" button
5. System automatically:
   - Creates "Cardiology Department" in departments table
   - Creates doctor record in doctors table
   - Sets user as verified

### Step 4: Doctor Can Now Login

1. Logout from admin
2. Login as doctor (john.smith@hospital.com)
3. Access doctor dashboard
4. Doctor appears in doctors list
5. Department appears in departments list

## Multiple Doctors in Same Department

If another doctor signs up with the same department:

- Department already exists → No duplicate created
- New doctor record created
- Both doctors linked to same department

Example:

- Dr. John Smith → Cardiology Department (creates department)
- Dr. Jane Doe → Cardiology Department (uses existing department)

## No Mock Data Needed

The system is fully functional with:

- ✅ Empty database
- ✅ No seed data
- ✅ No mock records
- ✅ Automatic data creation on signup/approval

## Summary

**Before Admin Approval:**

- 1 record in `users` table (verified = false)
- 0 records in `doctors` table
- 0 records in `departments` table

**After Admin Approval:**

- 1 record in `users` table (verified = true)
- 1 record in `doctors` table (available = true)
- 1 record in `departments` table (active = true)

Everything is created automatically based on doctor signup data!
