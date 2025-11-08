# 🔐 User Verification System - Implementation Guide

## Overview

Implemented a comprehensive user verification system where Doctors and Pharmacists require admin approval before accessing the system.

---

## Features Implemented

### 1. Role-Based Verification ✅

| Role       | Auto-Verified | Requires Approval |
| ---------- | ------------- | ----------------- |
| Patient    | ✅ Yes        | ❌ No             |
| Admin      | ✅ Yes        | ❌ No             |
| Doctor     | ❌ No         | ✅ Yes            |
| Pharmacist | ❌ No         | ✅ Yes            |

### 2. Additional User Fields ✅

**All Users:**

- Name
- Email
- Password (BCrypt hashed)
- Role
- Phone
- Verified status

**Doctor/Pharmacist Only:**

- Specialization
- Department
- Experience Years
- Qualification
- License Number

---

## Backend Implementation

### 1. Updated User Model

**File:** `backend/src/main/java/com/hospitalmanagement/backend/model/User.java`

**New Fields:**

```java
@Column(name = "verified")
private boolean verified = false;

@Column(name = "phone")
private String phone;

@Column(name = "specialization")
private String specialization;

@Column(name = "department")
private String department;

@Column(name = "experience_years")
private Integer experienceYears;

@Column(name = "qualification")
private String qualification;

@Column(name = "license_number")
private String licenseNumber;
```

### 2. Updated Signup Logic

**File:** `backend/src/main/java/com/hospitalmanagement/backend/controller/AuthController.java`

**Verification Logic:**

```java
// Set verification status based on role
if ("Patient".equals(role) || "Admin".equals(role)) {
    user.setVerified(true);  // Auto-verified
} else {
    user.setVerified(false); // Needs approval
}

// Collect additional fields for Doctor/Pharmacist
if ("Doctor".equals(role) || "Pharmacist".equals(role)) {
    user.setSpecialization(request.specialization);
    user.setDepartment(request.department);
    user.setExperienceYears(request.experienceYears);
    user.setQualification(request.qualification);
    user.setLicenseNumber(request.licenseNumber);
}
```

### 3. Updated Login Logic

**Verification Check:**

```java
if (!user.isVerified() && ("Doctor".equals(role) || "Pharmacist".equals(role))) {
    return "Your account is pending admin approval. Please wait for verification.";
}
```

### 4. New Admin Endpoints

**File:** `backend/src/main/java/com/hospitalmanagement/backend/controller/UserController.java`

```java
// Get pending verification users
GET /api/users/pending-verification

// Verify a user
PATCH /api/users/{email}/verify

// Reject a user (delete)
PATCH /api/users/{email}/reject
```

### 5. New Service Methods

**File:** `backend/src/main/java/com/hospitalmanagement/backend/service/UserService.java`

```java
public List<User> getPendingVerificationUsers() {
    return users.stream()
        .filter(user -> !user.isVerified() &&
               ("Doctor".equals(user.getRole()) || "Pharmacist".equals(user.getRole())))
        .collect(Collectors.toList());
}

public User verifyUser(String email) {
    user.setVerified(true);
    return save(user);
}
```

---

## Database Schema Updates

### Run Migration:

```sql
-- Add new columns
ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN phone VARCHAR(50);
ALTER TABLE users ADD COLUMN specialization VARCHAR(255);
ALTER TABLE users ADD COLUMN department VARCHAR(255);
ALTER TABLE users ADD COLUMN experience_years INTEGER;
ALTER TABLE users ADD COLUMN qualification VARCHAR(500);
ALTER TABLE users ADD COLUMN license_number VARCHAR(100);

-- Update existing users to be verified
UPDATE users SET verified = TRUE;

-- Create index
CREATE INDEX idx_users_verified ON users(verified);
```

---

## Frontend Implementation (To Be Done)

### 1. Enhanced Signup Form

**For Doctor/Pharmacist Signup:**

```javascript
// Additional fields to collect
{
  email: "",
  password: "",
  name: "",
  role: "Doctor", // or "Pharmacist"
  phone: "",
  specialization: "",
  department: "",
  experienceYears: 0,
  qualification: "",
  licenseNumber: ""
}
```

**Example Form:**

```jsx
{
  role === "Doctor" || role === "Pharmacist" ? (
    <>
      <input name="phone" placeholder="Phone Number" required />
      <input name="specialization" placeholder="Specialization" required />
      <select name="department" required>
        <option value="">Select Department</option>
        <option value="Cardiology">Cardiology</option>
        <option value="Neurology">Neurology</option>
        {/* ... more departments */}
      </select>
      <input
        name="experienceYears"
        type="number"
        placeholder="Years of Experience"
        required
      />
      <input
        name="qualification"
        placeholder="Qualification (e.g., MBBS, MD)"
        required
      />
      <input name="licenseNumber" placeholder="License Number" required />
    </>
  ) : null;
}
```

### 2. Login Response Handling

```javascript
// Handle pending verification
if (response.status === 403) {
  toast.error(
    "Your account is pending admin approval. Please wait for verification."
  );
  return;
}

// Handle successful login
if (response.data.success) {
  // Store user data
  // Redirect to dashboard
}
```

### 3. Admin Verification Panel

**Component:** `Admin.js`

```jsx
const [pendingUsers, setPendingUsers] = useState([]);

useEffect(() => {
  loadPendingUsers();
}, []);

const loadPendingUsers = async () => {
  const response = await userAPI.getPendingVerification();
  setPendingUsers(response.data);
};

const handleVerify = async (email) => {
  await userAPI.verify(email);
  toast.success("User verified successfully!");
  loadPendingUsers();
};

const handleReject = async (email) => {
  await userAPI.reject(email);
  toast.success("User rejected and removed.");
  loadPendingUsers();
};
```

**UI:**

```jsx
<div className="pending-users">
  <h3>Pending Verification</h3>
  {pendingUsers.map((user) => (
    <div key={user.email} className="user-card">
      <h4>{user.name}</h4>
      <p>Role: {user.role}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>

      {user.role === "Doctor" && (
        <>
          <p>Specialization: {user.specialization}</p>
          <p>Department: {user.department}</p>
          <p>Experience: {user.experienceYears} years</p>
          <p>Qualification: {user.qualification}</p>
          <p>License: {user.licenseNumber}</p>
        </>
      )}

      <button onClick={() => handleVerify(user.email)}>Approve</button>
      <button onClick={() => handleReject(user.email)}>Reject</button>
    </div>
  ))}
</div>
```

### 4. Update API Service

**File:** `frontend/app/src/services/api.js`

```javascript
export const userAPI = {
  // ... existing methods

  getPendingVerification: () => api.get("/users/pending-verification"),
  verify: (email) => api.patch(`/users/${email}/verify`),
  reject: (email) => api.patch(`/users/${email}/reject`),
};
```

---

## User Flow

### Doctor/Pharmacist Signup Flow:

```
1. User visits signup page
   ↓
2. Selects role: "Doctor" or "Pharmacist"
   ↓
3. Additional fields appear:
   - Phone
   - Specialization
   - Department
   - Experience Years
   - Qualification
   - License Number
   ↓
4. Fills all required information
   ↓
5. Submits form
   ↓
6. Backend creates user with verified=false
   ↓
7. Response: "Account created! Waiting for admin approval."
   ↓
8. User cannot login yet
```

### Admin Verification Flow:

```
1. Admin logs in
   ↓
2. Sees "Pending Verification" section
   ↓
3. Views list of pending users with all details:
   - Name, Email, Phone
   - Specialization, Department
   - Experience, Qualification
   - License Number
   ↓
4. Reviews credentials
   ↓
5. Clicks "Approve" or "Reject"
   ↓
6. If Approved:
   - User.verified = true
   - User can now login
   ↓
7. If Rejected:
   - User deleted from database
   - Cannot login
```

### Doctor/Pharmacist Login Flow:

```
1. User tries to login
   ↓
2. Backend checks credentials
   ↓
3. If verified=false:
   - Return 403 Forbidden
   - Message: "Pending admin approval"
   ↓
4. If verified=true:
   - Return 200 OK
   - User logged in successfully
```

---

## API Endpoints

### Signup:

```
POST /auth/signup
Body: {
  email, password, name, role,
  phone, specialization, department,
  experienceYears, qualification, licenseNumber
}
Response: {
  success: true,
  message: "Account created! Waiting for admin approval."
}
```

### Login:

```
POST /auth/login
Body: { email, password }
Response (if not verified): {
  success: false,
  message: "Your account is pending admin approval."
}
Response (if verified): {
  success: true,
  message: "Login successful!",
  user: { ... }
}
```

### Get Pending Users:

```
GET /api/users/pending-verification
Response: [
  {
    email, name, role, phone,
    specialization, department,
    experienceYears, qualification,
    licenseNumber, verified: false
  }
]
```

### Verify User:

```
PATCH /api/users/{email}/verify
Response: {
  email, name, role, verified: true, ...
}
```

### Reject User:

```
PATCH /api/users/{email}/reject
Response: 204 No Content
```

---

## Testing

### Test 1: Doctor Signup

```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newdoctor@hospital.com",
    "password": "doctor123",
    "name": "Dr. New Doctor",
    "role": "Doctor",
    "phone": "+91 9876543210",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "experienceYears": 5,
    "qualification": "MBBS, MD",
    "licenseNumber": "MED12345"
  }'
```

**Expected:** "Account created! Waiting for admin approval."

### Test 2: Try to Login (Before Verification)

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newdoctor@hospital.com",
    "password": "doctor123"
  }'
```

**Expected:** 403 Forbidden - "Pending admin approval"

### Test 3: Admin Gets Pending Users

```bash
curl http://localhost:8080/api/users/pending-verification
```

**Expected:** List with new doctor

### Test 4: Admin Verifies User

```bash
curl -X PATCH http://localhost:8080/api/users/newdoctor@hospital.com/verify
```

**Expected:** User with verified=true

### Test 5: Login After Verification

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newdoctor@hospital.com",
    "password": "doctor123"
  }'
```

**Expected:** 200 OK - Login successful

---

## Database Queries

### Check Pending Users:

```sql
SELECT user_email, user_name, user_role, verified,
       specialization, department, experience_years,
       qualification, license_number
FROM users
WHERE verified = FALSE
  AND (user_role = 'Doctor' OR user_role = 'Pharmacist');
```

### Verify User Manually:

```sql
UPDATE users
SET verified = TRUE
WHERE user_email = 'newdoctor@hospital.com';
```

### Check All Users:

```sql
SELECT user_email, user_name, user_role, verified
FROM users
ORDER BY verified, user_role;
```

---

## Status

✅ **Backend Implementation - COMPLETE**
✅ **Database Schema - UPDATED**
✅ **API Endpoints - CREATED**
✅ **Verification Logic - IMPLEMENTED**
⏳ **Frontend Implementation - PENDING**

---

## Next Steps

1. **Update Frontend Signup Form**

   - Add conditional fields for Doctor/Pharmacist
   - Collect all required information

2. **Update Frontend Login**

   - Handle 403 response for unverified users
   - Show appropriate message

3. **Create Admin Verification Panel**

   - Show pending users
   - Display all user details
   - Approve/Reject buttons

4. **Test Complete Flow**
   - Signup as doctor
   - Try to login (should fail)
   - Admin approves
   - Login again (should succeed)

---

**Security Level:** 🔐 **ENHANCED**
**Verification System:** ✅ **ACTIVE**
**Admin Control:** ✅ **IMPLEMENTED**
