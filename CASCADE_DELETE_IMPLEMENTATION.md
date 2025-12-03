# Cascade Delete Implementation

## Overview

Implemented cascade delete logic so that when an admin deletes a user, all their related records (appointments, prescriptions, doctor records) are automatically deleted from the database.

## Problem

Previously, when an admin deleted a user:

- User was removed from the `users` table
- BUT their appointments remained in `appointments` table
- AND their prescriptions remained in `prescriptions` table
- AND doctor records remained in `doctors` table
- This caused orphaned data and referential integrity issues

## Solution

Added `@Transactional` cascade delete logic that:

1. Identifies user role (Patient, Doctor, Pharmacist, Admin)
2. Deletes all related records based on role
3. Finally deletes the user
4. All operations wrapped in a transaction (rollback if any fails)

## Implementation Details

### Updated UserService.java

#### Added Dependencies

```java
import com.hospitalmanagement.backend.repository.AppointmentRepository;
import com.hospitalmanagement.backend.repository.PrescriptionRepository;
import org.springframework.transaction.annotation.Transactional;
```

#### Updated Constructor

```java
public UserService(
    UserRepository userRepository,
    PasswordEncoder passwordEncoder,
    DoctorRepository doctorRepository,
    DepartmentRepository departmentRepository,
    AppointmentRepository appointmentRepository,      // NEW
    PrescriptionRepository prescriptionRepository      // NEW
)
```

#### Enhanced deleteUser Method

```java
@Transactional  // Ensures all-or-nothing deletion
public void deleteUser(String email) {
    // 1. Find user
    // 2. Identify role
    // 3. Delete role-specific records
    // 4. Delete user
}
```

## Deletion Logic by Role

### 1. Patient Deletion

When a patient is deleted:

```
1. Find all appointments where:
   - patientId = patient email
   - OR patientName = patient name

2. Delete all patient appointments

3. Find all prescriptions where:
   - patientId = patient email
   - OR patientName = patient name

4. Delete all patient prescriptions
   (Medicines are cascade deleted via JPA relationship)

5. Delete patient user record
```

**Example:**

```
Patient: john@example.com
  ↓
Deletes:
  - 5 appointments
  - 3 prescriptions (with 12 medicines)
  - User record
```

### 2. Doctor Deletion

When a doctor is deleted:

```
1. Find all appointments where:
   - doctorId = doctor email
   - OR doctorName = doctor name

2. Delete all doctor appointments

3. Find all prescriptions where:
   - doctorId = doctor email
   - OR doctorName = doctor name

4. Delete all doctor prescriptions
   (Medicines are cascade deleted via JPA relationship)

5. Delete doctor record from doctors table

6. Delete doctor user record
```

**Example:**

```
Doctor: dr.smith@example.com
  ↓
Deletes:
  - 25 appointments
  - 20 prescriptions (with 60 medicines)
  - Doctor record
  - User record
```

### 3. Pharmacist Deletion

When a pharmacist is deleted:

```
1. No appointments (pharmacists don't have appointments)
2. No prescriptions (pharmacists don't create prescriptions)
3. Delete pharmacist user record
```

**Example:**

```
Pharmacist: pharma@example.com
  ↓
Deletes:
  - User record only
```

### 4. Admin Deletion

When an admin is deleted:

```
1. No appointments (admins don't have appointments)
2. No prescriptions (admins don't create prescriptions)
3. Delete admin user record
```

**Example:**

```
Admin: admin@example.com
  ↓
Deletes:
  - User record only
```

## Transaction Management

### @Transactional Annotation

```java
@Transactional
public void deleteUser(String email) {
    // All operations in one transaction
}
```

**Benefits:**

- **Atomicity**: All deletions succeed or all fail
- **Consistency**: Database remains consistent
- **Rollback**: If any deletion fails, all changes are rolled back
- **No orphaned data**: Either everything is deleted or nothing is

### Example Transaction Flow

```
BEGIN TRANSACTION
  ↓
Delete appointments
  ↓
Delete prescriptions (cascade deletes medicines)
  ↓
Delete doctor record (if doctor)
  ↓
Delete user record
  ↓
COMMIT TRANSACTION
```

If any step fails:

```
BEGIN TRANSACTION
  ↓
Delete appointments ✓
  ↓
Delete prescriptions ✗ ERROR!
  ↓
ROLLBACK TRANSACTION
  ↓
All changes reverted
User still exists
```

## Database Relationships

### Cascade Delete Chain

#### Patient Deletion

```
User (Patient)
  ├── Appointments (deleted)
  └── Prescriptions (deleted)
        └── Medicines (cascade deleted by JPA)
```

#### Doctor Deletion

```
User (Doctor)
  ├── Appointments (deleted)
  ├── Prescriptions (deleted)
  │     └── Medicines (cascade deleted by JPA)
  └── Doctor Record (deleted)
```

## Console Logging

### Patient Deletion Log

```
Deleting user: john@example.com (Role: Patient)
  ✓ Deleted 5 appointments for patient: John Doe
  ✓ Deleted 3 prescriptions for patient: John Doe
✓ User deleted: john@example.com
```

### Doctor Deletion Log

```
Deleting user: dr.smith@example.com (Role: Doctor)
  ✓ Deleted 25 appointments for doctor: Dr. Smith
  ✓ Deleted 20 prescriptions for doctor: Dr. Smith
  ✓ Deleted doctor record: Dr. Smith
✓ User deleted: dr.smith@example.com
```

### Pharmacist Deletion Log

```
Deleting user: pharma@example.com (Role: Pharmacist)
Deleting pharmacist user: pharma@example.com
✓ User deleted: pharma@example.com
```

## Code Structure

### Main Method

```java
@Transactional
public void deleteUser(String email) {
    User user = userRepository.findByEmail(email);

    switch (userRole) {
        case "Patient":
            deletePatientRecords(email, userName);
            break;
        case "Doctor":
            deleteDoctorRecords(email, userName);
            break;
        case "Pharmacist":
        case "Admin":
            // No related records
            break;
    }

    userRepository.delete(user);
}
```

### Helper Methods

```java
private void deletePatientRecords(String email, String name) {
    // Delete appointments
    // Delete prescriptions
}

private void deleteDoctorRecords(String email, String name) {
    // Delete appointments
    // Delete prescriptions
    // Delete doctor record
}
```

## Benefits

### Data Integrity

- ✅ No orphaned appointments
- ✅ No orphaned prescriptions
- ✅ No orphaned medicines
- ✅ No orphaned doctor records
- ✅ Clean database

### User Experience

- ✅ Admin can safely delete users
- ✅ No "ghost" data in system
- ✅ Accurate statistics
- ✅ Clean user lists

### System Health

- ✅ Prevents database bloat
- ✅ Maintains referential integrity
- ✅ Reduces storage usage
- ✅ Improves query performance

## Testing Checklist

### Test 1: Delete Patient with Appointments

- [ ] Create patient user
- [ ] Patient books 3 appointments
- [ ] Admin deletes patient
- [ ] Verify: Patient deleted
- [ ] Verify: All 3 appointments deleted
- [ ] Verify: No orphaned records

### Test 2: Delete Patient with Prescriptions

- [ ] Create patient user
- [ ] Doctor creates 2 prescriptions for patient
- [ ] Admin deletes patient
- [ ] Verify: Patient deleted
- [ ] Verify: All 2 prescriptions deleted
- [ ] Verify: All medicines deleted (cascade)

### Test 3: Delete Doctor with Appointments

- [ ] Create doctor user
- [ ] Patients book 5 appointments with doctor
- [ ] Admin deletes doctor
- [ ] Verify: Doctor deleted
- [ ] Verify: All 5 appointments deleted
- [ ] Verify: Doctor record deleted

### Test 4: Delete Doctor with Prescriptions

- [ ] Create doctor user
- [ ] Doctor creates 3 prescriptions
- [ ] Admin deletes doctor
- [ ] Verify: Doctor deleted
- [ ] Verify: All 3 prescriptions deleted
- [ ] Verify: All medicines deleted (cascade)

### Test 5: Delete Pharmacist

- [ ] Create pharmacist user
- [ ] Admin deletes pharmacist
- [ ] Verify: Pharmacist deleted
- [ ] Verify: No errors

### Test 6: Delete Admin

- [ ] Create admin user
- [ ] Admin deletes admin
- [ ] Verify: Admin deleted
- [ ] Verify: No errors

### Test 7: Transaction Rollback

- [ ] Simulate database error during deletion
- [ ] Verify: Transaction rolled back
- [ ] Verify: User still exists
- [ ] Verify: No partial deletions

## Error Handling

### User Not Found

```java
if (user == null) {
    throw new RuntimeException("User not found with email: " + email);
}
```

### Transaction Failure

```java
@Transactional  // Automatic rollback on exception
```

## Performance Considerations

### Batch Deletion

```java
appointmentRepository.deleteAll(appointments);  // Batch delete
prescriptionRepository.deleteAll(prescriptions); // Batch delete
```

Better than:

```java
for (Appointment apt : appointments) {
    appointmentRepository.delete(apt);  // One by one (slow)
}
```

### Query Optimization

```java
// First try by ID (indexed)
var appointments = appointmentRepository.findByPatientId(email);

// Fallback to name search if needed
if (appointments.isEmpty()) {
    appointments = appointmentRepository.findAll().stream()
        .filter(apt -> name.equals(apt.getPatientName()))
        .collect(Collectors.toList());
}
```

## Database Impact

### Before Cascade Delete

```sql
-- Delete user
DELETE FROM users WHERE email = 'john@example.com';

-- Orphaned records remain:
SELECT * FROM appointments WHERE patient_id = 'john@example.com';
-- Returns 5 orphaned appointments

SELECT * FROM prescriptions WHERE patient_id = 'john@example.com';
-- Returns 3 orphaned prescriptions
```

### After Cascade Delete

```sql
-- Delete user (with cascade logic)
DELETE FROM users WHERE email = 'john@example.com';

-- No orphaned records:
SELECT * FROM appointments WHERE patient_id = 'john@example.com';
-- Returns 0 rows

SELECT * FROM prescriptions WHERE patient_id = 'john@example.com';
-- Returns 0 rows
```

## API Endpoint

### DELETE /api/users/{email}

```
Request: DELETE /api/users/john@example.com
Response: 204 No Content

Backend Log:
Deleting user: john@example.com (Role: Patient)
  ✓ Deleted 5 appointments for patient: John Doe
  ✓ Deleted 3 prescriptions for patient: John Doe
✓ User deleted: john@example.com
```

## Frontend Impact

### Admin Dashboard

When admin clicks "Delete User":

1. Confirmation dialog appears
2. Admin confirms deletion
3. Backend deletes user + all records
4. Frontend refreshes user list
5. User and all their data are gone

### No Changes Needed

The frontend already has the delete functionality. This update only enhances the backend logic.

## Conclusion

The cascade delete implementation ensures that when an admin deletes a user, all their related records are automatically and safely removed from the database. This maintains data integrity, prevents orphaned records, and keeps the system clean.

**Key Features:**

- ✅ Transactional (all-or-nothing)
- ✅ Role-aware deletion
- ✅ Cascade deletes related records
- ✅ Maintains referential integrity
- ✅ Detailed logging
- ✅ Error handling
- ✅ Performance optimized

Backend compiled successfully! Restart the backend to apply the changes.
