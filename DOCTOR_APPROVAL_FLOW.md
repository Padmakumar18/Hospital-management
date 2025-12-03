# Doctor Approval Flow - Complete Implementation

## Overview

When a doctor signs up, they provide professional details that are stored in the users table. When admin approves, these details are automatically transferred to the doctors table.

## Signup Flow

### 1. Doctor Signup Form

When role is "Doctor" or "Pharmacist", additional fields appear:

- Specialization (e.g., Cardiology, Pediatrics)
- Department (e.g., Cardiology Department)
- Qualification (e.g., MBBS, MD)
- License Number (Medical license)
- Years of Experience

### 2. Data Storage

All data is stored in the `users` table:

```
users table:
- id, name, email, password, role, phone
- verified = FALSE (pending approval)
- specialization, department, qualification, license_number, experience_years
```

### 3. Admin Review

Admin sees pending approvals with all professional details:

- Name, Email, Phone
- Role badge
- Specialization
- Department
- Qualification
- License Number
- Years of Experience

### 4. Admin Approval

When admin clicks "Approve":

1. User.verified is set to TRUE
2. Doctor record is created in doctors table with all details from users table
3. Doctor.available is set to TRUE
4. User can now login

### 5. Doctor Table

After approval, doctors table contains:

```
doctors table:
- id, name, email, phone
- specialization (from users table)
- department (from users table)
- qualification (from users table)
- experience_years (from users table)
- available = TRUE
```

## Database Schema

### users table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    user_name VARCHAR(100),
    user_email VARCHAR(100) UNIQUE,
    user_password VARCHAR(255),
    user_role VARCHAR(20),
    phone VARCHAR(20),
    verified BOOLEAN DEFAULT FALSE,

    -- Doctor/Pharmacist fields (NULL for patients)
    specialization VARCHAR(100),
    department VARCHAR(100),
    qualification VARCHAR(200),
    license_number VARCHAR(50),
    experience_years INTEGER
);
```

### doctors table

```sql
CREATE TABLE doctors (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    specialization VARCHAR(100),
    department VARCHAR(100),
    qualification VARCHAR(200),
    experience_years INTEGER,
    available BOOLEAN DEFAULT TRUE
);
```

## API Endpoints

### Signup

```
POST /auth/signup
Body: {
  email, password, name, role, phone,
  specialization, department, qualification,
  licenseNumber, experienceYears
}
```

### Get Pending Users

```
GET /api/users/pending-verification
Returns: List of unverified users with all details
```

### Approve User

```
PATCH /api/users/{email}/verify
- Sets verified = TRUE
- Creates doctor record with stored details
- Sets doctor.available = TRUE
```

### Reject User

```
PATCH /api/users/{email}/reject
- Deletes user account permanently
```

## Frontend Components

### Auth.js

- Conditional form fields based on role
- Collects doctor details during signup
- Sends all data to backend

### Admin.js - Pending Approvals Tab

- Displays all pending users
- Shows professional details for doctors
- Approve/Reject buttons
- Badge showing pending count

## User Experience

### Patient Signup

1. Fill: Name, Email, Phone, Password, Role
2. Auto-verified
3. Login immediately

### Doctor Signup

1. Fill: Name, Email, Phone, Password, Role
2. Fill: Specialization, Department, Qualification, License, Experience
3. Account created (verified = false)
4. Redirected to "Waiting Approval" page
5. Cannot login until approved

### Admin Approval

1. See notification badge on "Pending Approvals" tab
2. Review doctor's professional details
3. Click "Approve" → Doctor can login, appears in doctors list
4. Click "Reject" → Account deleted

## Benefits

✅ All doctor details collected upfront
✅ Admin can review credentials before approval
✅ Automatic transfer to doctors table on approval
✅ No manual data entry needed
✅ Professional verification workflow
