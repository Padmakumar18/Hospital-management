# Testing Guide - Hospital Management System

## 🧪 Complete Testing Workflow

### Prerequisites

1. PostgreSQL database running
2. Backend server running on `http://localhost:8080`
3. Frontend server running on `http://localhost:3000`

---

## 1️⃣ Patient Role Testing

### Login Credentials:

- Email: `patient1@hospital.com`
- Password: `patient123`

### Test Cases:

#### ✅ TC1: Book New Appointment

1. Click "Book New Appointment" button
2. Fill in personal information:
   - Patient Name: John Doe
   - Age: 30
   - Gender: Male
   - Contact: +91 9876543210
3. Select Department (e.g., "Cardiology")
4. **Verify:** Doctor dropdown populates with cardiologists from database
5. Select a doctor (e.g., "Dr. Meena Kapoor - Interventional Cardiology")
6. Fill appointment details:
   - Date: Tomorrow's date
   - Time: 10:00 AM
   - Reason: Chest pain
   - Issue Days: 3
7. Click "Book Appointment"
8. **Expected:** Success toast, appointment appears in list

#### ✅ TC2: View Appointments

1. Check "Your Appointments" section
2. **Verify:** All appointments show with correct details
3. Test filters:
   - Click "All" - shows all appointments
   - Click "Upcoming" - shows only future scheduled appointments
   - Click "Past" - shows completed/cancelled appointments

#### ✅ TC3: Cancel Appointment (Patient Can Only Cancel, Not Delete)

1. Find a "Scheduled" appointment
2. Click "Cancel" button
3. **Verify:** Confirmation dialog appears with warning message
4. Click "Yes, Cancel"
5. **Expected:**
   - Appointment status changes to "Cancelled"
   - Cancellation reason: "Cancelled by patient"
   - Appointment remains in database (not deleted)
   - Success toast appears

#### ❌ TC4: Verify Patient Cannot Delete

1. **Verify:** No "Delete" button exists for patients
2. **Verify:** Only "Cancel" button available for scheduled appointments

#### ✅ TC5: View Prescription

1. Find a "Completed" appointment with prescription
2. Click "View Prescription"
3. **Verify:** Prescription modal opens with:
   - Patient details
   - Doctor details
   - Diagnosis
   - Medicines list with dosage
   - Additional notes

---

## 2️⃣ Doctor Role Testing

### Login Credentials:

- Email: `doctor1@hospital.com`
- Password: `doctor123`

### Test Cases:

#### ✅ TC6: View Appointments

1. **Verify:** All appointments visible
2. Test status filter:
   - Select "Scheduled" - shows only scheduled
   - Select "Completed" - shows only completed
   - Select "All" - shows all appointments

#### ✅ TC7: Update Appointment Status

1. Find a "Scheduled" appointment
2. Click status dropdown
3. Change to "Completed"
4. **Expected:** Status updates, success toast

#### ✅ TC8: Create Prescription

1. Find a "Scheduled" appointment
2. Click "Prescribe" button
3. Fill prescription form:
   - Diagnosis: Hypertension
   - Symptoms: High blood pressure
   - Add medicines:
     - Medicine: Amlodipine
     - Dosage: 5mg
     - Frequency: Once daily
     - Duration: 30 days
     - Quantity: 30 tablets
4. Add additional notes
5. Click "Save Prescription"
6. **Expected:**
   - Prescription created
   - Appointment status changes to "Completed"
   - Success toast appears

#### ✅ TC9: View Age Distribution

1. **Verify:** Age distribution cards show correct counts
2. Click "Show Graph" button
3. **Verify:** Bar chart displays age distribution
4. Click "Show Cards" to toggle back

---

## 3️⃣ Admin Role Testing

### Login Credentials:

- Email: `admin@hospital.com`
- Password: `admin123`

### Test Cases:

#### ✅ TC10: View Dashboard

1. **Verify:** Statistics cards show:
   - Total Users
   - Total Appointments
   - Total Prescriptions
   - Active Users
2. **Verify:** User distribution by role chart

#### ✅ TC11: User Management

1. Click "User Management" tab
2. Test search:
   - Enter user name/email
   - **Verify:** Results filter correctly
3. Test role filter:
   - Select "Doctor"
   - **Verify:** Only doctors shown
4. Click "Clear Filters"

#### ✅ TC12: Edit User

1. Click edit icon on a user
2. Change user name
3. Change user role
4. Click "Save Changes"
5. **Expected:** User updated, success toast

#### ✅ TC13: Delete User

1. Click delete icon on a user
2. **Verify:** Confirmation dialog appears
3. Click "Yes, Delete"
4. **Expected:** User deleted, success toast

#### ✅ TC14: View All Appointments

1. Click "Appointments" tab
2. **Verify:** All appointments from all patients visible
3. **Verify:** Shows patient name, doctor, date, status

#### ✅ TC15: View All Prescriptions

1. Click "Prescriptions" tab
2. **Verify:** All prescriptions visible
3. **Verify:** Shows patient, doctor, diagnosis, medicine count

---

## 4️⃣ Pharmacist Role Testing

### Login Credentials:

- Email: `pharmacist@hospital.com`
- Password: `pharma123`

### Test Cases:

#### ✅ TC16: View Prescriptions

1. **Verify:** Statistics cards show:
   - Total Prescriptions
   - Pending
   - Dispensed
2. **Verify:** Prescription list shows all prescriptions

#### ✅ TC17: Filter Prescriptions

1. Test search:
   - Enter patient name
   - **Verify:** Results filter
2. Test status filter:
   - Select "Pending"
   - **Verify:** Only pending prescriptions shown

#### ✅ TC18: Dispense Prescription

1. Find a "Pending" prescription
2. Click "View Details"
3. **Verify:** Modal shows:
   - Patient and doctor details
   - Diagnosis
   - Complete medicine list with dosage
4. Click "Mark as Dispensed"
5. **Expected:**
   - Status changes to "Dispensed"
   - Success toast appears
   - Statistics update

---

## 5️⃣ Database Integration Testing

### Test Cases:

#### ✅ TC19: Departments Load from Database

1. Login as patient
2. Click "Book New Appointment"
3. Open department dropdown
4. **Verify:** Departments loaded from database:
   - General Medicine
   - Cardiology
   - Dermatology
   - Neurology
   - Orthopedics
   - Pediatrics
   - Gynecology
   - ENT
   - Ophthalmology
   - Psychiatry

#### ✅ TC20: Doctors Load from Database

1. Select a department (e.g., "Cardiology")
2. **Verify:** Doctor dropdown shows:
   - Dr. Meena Kapoor - Interventional Cardiology
   - Dr. Arjun Singh - Clinical Cardiology
   - Dr. Kavita Reddy - Pediatric Cardiology
3. Change department
4. **Verify:** Doctors update based on department

#### ✅ TC21: Doctor Filtering

1. Select "General Medicine"
2. **Verify:** Only General Medicine doctors shown
3. Select "Neurology"
4. **Verify:** Only Neurology doctors shown

---

## 6️⃣ Workflow Validation

### ✅ TC22: Patient Cannot Delete Appointments

1. Login as patient
2. View appointments
3. **Verify:** No "Delete" button exists
4. **Verify:** Only "Cancel" button for scheduled appointments
5. Cancel an appointment
6. **Verify:** Appointment status = "Cancelled" (not deleted)

### ✅ TC23: Doctor Cannot Delete Appointments

1. Login as doctor
2. View appointments
3. **Verify:** No "Delete" button exists
4. **Verify:** Can only update status

### ✅ TC24: Complete Appointment Workflow

1. **Patient:** Book appointment
2. **Doctor:** View appointment
3. **Doctor:** Create prescription
4. **Doctor:** Mark as completed
5. **Patient:** View prescription
6. **Pharmacist:** Dispense prescription
7. **Admin:** View all records

---

## 7️⃣ Error Handling Testing

### ✅ TC25: Form Validation

1. Try to book appointment with empty fields
2. **Verify:** Error messages appear
3. Try invalid phone number
4. **Verify:** Validation error
5. Try past date
6. **Verify:** Date validation error

### ✅ TC26: Network Error Handling

1. Stop backend server
2. Try to book appointment
3. **Verify:** Error toast appears
4. **Verify:** User-friendly error message

---

## 8️⃣ UI/UX Testing

### ✅ TC27: Loading States

1. Refresh page
2. **Verify:** Loading spinner appears
3. **Verify:** "Loading..." message shown
4. **Verify:** Content appears after loading

### ✅ TC28: Empty States

1. Login with new patient account
2. **Verify:** "No appointments yet" message
3. **Verify:** Helpful message to book appointment

### ✅ TC29: Responsive Design

1. Resize browser window
2. **Verify:** Layout adapts to screen size
3. Test on mobile viewport
4. **Verify:** All features accessible

---

## 🎯 Expected Results Summary

### ✅ All Tests Should Pass:

- Patients can book and cancel (not delete) appointments
- Doctors can manage appointments and create prescriptions
- Admins can view and manage all data
- Pharmacists can dispense prescriptions
- All data loads from database (no mock data)
- Departments and doctors dynamically loaded
- Proper role-based access control
- User-friendly error messages
- Loading states work correctly

### ❌ These Should NOT Be Possible:

- Patients deleting appointments
- Patients accessing other patients' data
- Doctors deleting appointments
- Pharmacists creating prescriptions
- Unauthorized role access

---

## 📊 Database Verification

### Check Data in PostgreSQL:

```sql
-- Verify departments
SELECT * FROM departments;
-- Expected: 10 departments

-- Verify doctors
SELECT * FROM doctors;
-- Expected: 30 doctors (3 per department)

-- Verify appointments
SELECT * FROM appointments;

-- Verify prescriptions
SELECT * FROM prescriptions;

-- Check cancelled appointments (should not be deleted)
SELECT * FROM appointments WHERE status = 'Cancelled';
```

---

## 🚀 Quick Test Script

Run all critical tests in sequence:

1. **Patient Flow:**

   - Login → Book Appointment → View → Cancel

2. **Doctor Flow:**

   - Login → View Appointments → Create Prescription

3. **Pharmacist Flow:**

   - Login → View Prescriptions → Dispense

4. **Admin Flow:**

   - Login → View Dashboard → Manage Users

5. **Database Check:**
   - Verify departments loaded
   - Verify doctors loaded
   - Verify no appointments deleted (only cancelled)

---

**Testing Status:** Ready for comprehensive testing
**All workflows:** Implemented and validated
**Database integration:** Complete
