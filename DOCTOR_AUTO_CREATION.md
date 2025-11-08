# 🏥 Doctor Auto-Creation System

## Overview

When a doctor creates an account, the system automatically creates a corresponding record in the `doctors` table with all their details.

---

## Implementation

### 1. Automatic Doctor Record Creation ✅

**When:** Doctor signs up
**What:** Creates records in both `users` and `doctors` tables

### 2. Data Synchronization ✅

**User Table → Doctor Table Mapping:**

| User Field      | Doctor Field    |
| --------------- | --------------- |
| name            | name            |
| email           | email           |
| specialization  | specialization  |
| department      | department      |
| phone           | phone           |
| experienceYears | experienceYears |
| qualification   | qualification   |
| verified        | available       |

---

## How It Works

### Signup Flow:

```
1. Doctor fills signup form
   ↓
2. POST /auth/signup with doctor details
   ↓
3. UserService.createUserWithDoctorRecord()
   ↓
4. Creates User record (verified=false)
   ↓
5. Creates Doctor record (available=false)
   ↓
6. Response: "Account created! Waiting for admin approval."
```

### Verification Flow:

```
1. Admin approves doctor
   ↓
2. PATCH /api/users/{email}/verify
   ↓
3. UserService.verifyUser()
   ↓
4. Updates User (verified=true)
   ↓
5. Updates Doctor (available=true)
   ↓
6. Doctor can now login and be selected by patients
```

---

## Code Implementation

### 1. UserService - Create User with Doctor Record

**File:** `backend/src/main/java/com/hospitalmanagement/backend/service/UserService.java`

```java
public User createUserWithDoctorRecord(User user) {
    // Check if email exists
    if (userRepository.findByEmail(user.getEmail()) != null) {
        throw new RuntimeException("Email already exists!");
    }

    // Hash password and save user
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    User savedUser = userRepository.save(user);

    // If user is a Doctor, create Doctor record
    if ("Doctor".equals(user.getRole())) {
        Doctor doctor = new Doctor();
        doctor.setName(user.getName());
        doctor.setEmail(user.getEmail());
        doctor.setSpecialization(user.getSpecialization());
        doctor.setDepartment(user.getDepartment());
        doctor.setPhone(user.getPhone());
        doctor.setExperienceYears(user.getExperienceYears() != null ? user.getExperienceYears() : 0);
        doctor.setQualification(user.getQualification());
        doctor.setAvailable(user.isVerified()); // Available only if verified

        doctorRepository.save(doctor);
        System.out.println("Created Doctor record for: " + user.getEmail());
    }

    return savedUser;
}
```

### 2. UserService - Verify User and Update Doctor

```java
public User verifyUser(String email) {
    User user = userRepository.findByEmail(email);
    if (user != null) {
        user.setVerified(true);
        User savedUser = userRepository.save(user);

        // If user is a Doctor, update doctor availability
        if ("Doctor".equals(user.getRole())) {
            Doctor doctor = doctorRepository.findByEmail(email);
            if (doctor != null) {
                doctor.setAvailable(true);
                doctorRepository.save(doctor);
                System.out.println("Updated Doctor availability for: " + email);
            }
        }

        return savedUser;
    }
    throw new RuntimeException("User not found with email: " + email);
}
```

### 3. AuthController - Use New Method

**File:** `backend/src/main/java/com/hospitalmanagement/backend/controller/AuthController.java`

```java
@PostMapping("/signup")
public ResponseEntity<SignupResponse> signup(@RequestBody SignupRequest signupRequest) {
    // ... create user object ...

    // Create user and doctor record if role is Doctor
    userService.createUserWithDoctorRecord(user);

    // ... return response ...
}
```

---

## Database Tables

### Users Table:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(50),
    specialization VARCHAR(255),
    department VARCHAR(255),
    experience_years INTEGER,
    qualification VARCHAR(500),
    license_number VARCHAR(100)
);
```

### Doctors Table:

```sql
CREATE TABLE doctors (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    specialization VARCHAR(255),
    department VARCHAR(255),
    phone VARCHAR(50),
    experience_years INTEGER,
    qualification VARCHAR(500),
    available BOOLEAN DEFAULT TRUE
);
```

---

## Example Flow

### 1. Doctor Signup:

**Request:**

```json
POST /auth/signup
{
  "email": "dr.smith@hospital.com",
  "password": "doctor123",
  "name": "Dr. John Smith",
  "role": "Doctor",
  "phone": "+91 9876543210",
  "specialization": "Cardiology",
  "department": "Cardiology",
  "experienceYears": 10,
  "qualification": "MBBS, MD",
  "licenseNumber": "MED12345"
}
```

**Database After Signup:**

**users table:**

```
id: uuid-1
user_email: dr.smith@hospital.com
user_password: $2a$10$... (hashed)
user_name: Dr. John Smith
user_role: Doctor
verified: false
phone: +91 9876543210
specialization: Cardiology
department: Cardiology
experience_years: 10
qualification: MBBS, MD
license_number: MED12345
```

**doctors table:**

```
id: uuid-2
name: Dr. John Smith
email: dr.smith@hospital.com
specialization: Cardiology
department: Cardiology
phone: +91 9876543210
experience_years: 10
qualification: MBBS, MD
available: false  ← Not available until verified
```

### 2. Admin Verifies Doctor:

**Request:**

```
PATCH /api/users/dr.smith@hospital.com/verify
```

**Database After Verification:**

**users table:**

```
verified: true  ← Updated
```

**doctors table:**

```
available: true  ← Updated
```

### 3. Patient Books Appointment:

**Now the doctor appears in the dropdown:**

```javascript
// Frontend fetches available doctors
GET /api/doctors/available

Response: [
  {
    id: "uuid-2",
    name: "Dr. John Smith",
    email: "dr.smith@hospital.com",
    specialization: "Cardiology",
    department: "Cardiology",
    available: true  ← Now available!
  }
]
```

---

## Benefits

### 1. Single Source of Truth ✅

- Doctor details stored in both tables
- Consistent data across system

### 2. Automatic Synchronization ✅

- Signup creates both records
- Verification updates both records

### 3. Availability Control ✅

- Unverified doctors not available for appointments
- Verified doctors automatically available

### 4. Data Integrity ✅

- Email links user and doctor records
- No manual data entry needed

---

## Testing

### Test 1: Doctor Signup Creates Both Records

```bash
# 1. Create doctor account
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.doctor@hospital.com",
    "password": "test123",
    "name": "Dr. Test Doctor",
    "role": "Doctor",
    "phone": "+91 9999999999",
    "specialization": "Neurology",
    "department": "Neurology",
    "experienceYears": 5,
    "qualification": "MBBS, MD",
    "licenseNumber": "TEST123"
  }'

# 2. Check users table
SELECT * FROM users WHERE user_email = 'test.doctor@hospital.com';
# Expected: Record exists with verified=false

# 3. Check doctors table
SELECT * FROM doctors WHERE email = 'test.doctor@hospital.com';
# Expected: Record exists with available=false
```

### Test 2: Verification Updates Both Records

```bash
# 1. Verify doctor
curl -X PATCH http://localhost:8080/api/users/test.doctor@hospital.com/verify

# 2. Check users table
SELECT verified FROM users WHERE user_email = 'test.doctor@hospital.com';
# Expected: verified=true

# 3. Check doctors table
SELECT available FROM doctors WHERE email = 'test.doctor@hospital.com';
# Expected: available=true
```

### Test 3: Doctor Appears in Available List

```bash
# 1. Get available doctors
curl http://localhost:8080/api/doctors/available

# Expected: Dr. Test Doctor in the list
```

---

## Database Queries

### Check Doctor Records:

```sql
-- See both user and doctor records
SELECT
  u.user_name,
  u.user_email,
  u.verified,
  d.name as doctor_name,
  d.available,
  d.specialization,
  d.department
FROM users u
LEFT JOIN doctors d ON u.user_email = d.email
WHERE u.user_role = 'Doctor';
```

### Find Unverified Doctors:

```sql
SELECT
  u.user_name,
  u.user_email,
  u.specialization,
  u.department,
  d.available
FROM users u
LEFT JOIN doctors d ON u.user_email = d.email
WHERE u.user_role = 'Doctor'
  AND u.verified = FALSE;
```

### Find Available Doctors:

```sql
SELECT
  name,
  email,
  specialization,
  department,
  experience_years,
  qualification
FROM doctors
WHERE available = TRUE
ORDER BY department, name;
```

---

## Console Output

### During Signup:

```
Created Doctor record for: dr.smith@hospital.com
```

### During Verification:

```
Updated Doctor availability for: dr.smith@hospital.com
```

---

## Status

✅ **Doctor auto-creation - IMPLEMENTED**
✅ **Data synchronization - ACTIVE**
✅ **Verification updates - WORKING**
✅ **Availability control - FUNCTIONAL**

---

## Summary

When a doctor signs up:

1. ✅ User record created in `users` table
2. ✅ Doctor record created in `doctors` table
3. ✅ Both records linked by email
4. ✅ Both marked as unverified/unavailable

When admin verifies:

1. ✅ User marked as verified
2. ✅ Doctor marked as available
3. ✅ Doctor appears in appointment booking

**Result:** Seamless doctor onboarding with automatic data synchronization!
