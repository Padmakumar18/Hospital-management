# Role-Based Access Control - Permissions Matrix

## 🔐 Complete Permissions Overview

---

## 👤 PATIENT ROLE

### ✅ Allowed Actions:

#### Appointments:

- ✅ **Book** new appointments
- ✅ **View** their own appointments only
- ✅ **Cancel** scheduled appointments (status → "Cancelled")
- ✅ **Filter** appointments (All, Upcoming, Past)
- ✅ **View** appointment details

#### Prescriptions:

- ✅ **View** their own prescriptions
- ✅ **Download/Print** prescriptions (if implemented)

#### Profile:

- ✅ **View** their own profile
- ✅ **Update** their own profile information

### ❌ Restricted Actions:

- ❌ **Cannot DELETE** appointments (only cancel)
- ❌ **Cannot MODIFY** completed appointments
- ❌ **Cannot ACCESS** other patients' data
- ❌ **Cannot CREATE** prescriptions
- ❌ **Cannot VIEW** other users' information
- ❌ **Cannot MANAGE** doctors or departments

### 📋 Workflow:

```
Patient → Book Appointment → View Status → Cancel if needed → View Prescription (after completion)
```

---

## 👨‍⚕️ DOCTOR ROLE

### ✅ Allowed Actions:

#### Appointments:

- ✅ **View** all appointments (or filtered by doctor)
- ✅ **Update** appointment status (Scheduled → Completed)
- ✅ **Filter** appointments by status
- ✅ **View** patient details in appointments

#### Prescriptions:

- ✅ **Create** prescriptions for patients
- ✅ **View** prescriptions they created
- ✅ **Add** medicines to prescriptions
- ✅ **Update** prescription details

#### Analytics:

- ✅ **View** patient age distribution
- ✅ **View** appointment statistics
- ✅ **View** department analytics

### ❌ Restricted Actions:

- ❌ **Cannot DELETE** appointments
- ❌ **Cannot MODIFY** patient personal information
- ❌ **Cannot ACCESS** other doctors' prescriptions (unless shared)
- ❌ **Cannot MANAGE** users
- ❌ **Cannot DELETE** prescriptions after creation
- ❌ **Cannot DISPENSE** prescriptions

### 📋 Workflow:

```
Doctor → View Appointments → Examine Patient → Create Prescription → Mark as Completed
```

---

## 💊 PHARMACIST ROLE

### ✅ Allowed Actions:

#### Prescriptions:

- ✅ **View** all prescriptions
- ✅ **Filter** prescriptions by status
- ✅ **Search** prescriptions by patient/doctor
- ✅ **View** prescription details
- ✅ **Mark** prescriptions as dispensed
- ✅ **View** medicine details

#### Statistics:

- ✅ **View** prescription statistics
- ✅ **View** pending/dispensed counts

### ❌ Restricted Actions:

- ❌ **Cannot CREATE** prescriptions
- ❌ **Cannot MODIFY** prescription content
- ❌ **Cannot DELETE** prescriptions
- ❌ **Cannot ACCESS** appointment details
- ❌ **Cannot VIEW** patient medical history
- ❌ **Cannot MANAGE** users

### 📋 Workflow:

```
Pharmacist → View Prescriptions → Verify Details → Dispense Medicines → Mark as Dispensed
```

---

## 👨‍💼 ADMIN ROLE

### ✅ Allowed Actions:

#### User Management:

- ✅ **View** all users
- ✅ **Create** new users
- ✅ **Update** user information
- ✅ **Delete** users
- ✅ **Change** user roles
- ✅ **Search** and filter users

#### Appointments:

- ✅ **View** all appointments (read-only)
- ✅ **Filter** appointments
- ✅ **Search** appointments
- ✅ **View** appointment statistics

#### Prescriptions:

- ✅ **View** all prescriptions (read-only)
- ✅ **Filter** prescriptions
- ✅ **Search** prescriptions
- ✅ **View** prescription statistics

#### System:

- ✅ **View** system dashboard
- ✅ **View** all statistics
- ✅ **View** user distribution
- ✅ **Generate** reports (if implemented)

### ❌ Restricted Actions:

- ❌ **Cannot MODIFY** appointments directly
- ❌ **Cannot CREATE** prescriptions
- ❌ **Cannot DISPENSE** prescriptions
- ❌ **Should NOT** access patient medical details (privacy)

### 📋 Workflow:

```
Admin → View Dashboard → Manage Users → Monitor System → Generate Reports
```

---

## 📊 Permissions Matrix

| Feature                | Patient  | Doctor       | Pharmacist         | Admin          |
| ---------------------- | -------- | ------------ | ------------------ | -------------- |
| **Appointments**       |
| Book Appointment       | ✅       | ❌           | ❌                 | ❌             |
| View Own Appointments  | ✅       | ❌           | ❌                 | ❌             |
| View All Appointments  | ❌       | ✅           | ❌                 | ✅ (Read-only) |
| Cancel Appointment     | ✅ (Own) | ❌           | ❌                 | ❌             |
| Delete Appointment     | ❌       | ❌           | ❌                 | ❌             |
| Update Status          | ❌       | ✅           | ❌                 | ❌             |
| **Prescriptions**      |
| Create Prescription    | ❌       | ✅           | ❌                 | ❌             |
| View Own Prescriptions | ✅       | ❌           | ❌                 | ❌             |
| View All Prescriptions | ❌       | ✅ (Own)     | ✅                 | ✅ (Read-only) |
| Dispense Prescription  | ❌       | ❌           | ✅                 | ❌             |
| Modify Prescription    | ❌       | ✅ (Own)     | ❌                 | ❌             |
| Delete Prescription    | ❌       | ❌           | ❌                 | ❌             |
| **Users**              |
| View All Users         | ❌       | ❌           | ❌                 | ✅             |
| Create User            | ❌       | ❌           | ❌                 | ✅             |
| Update User            | ❌       | ❌           | ❌                 | ✅             |
| Delete User            | ❌       | ❌           | ❌                 | ✅             |
| Change Role            | ❌       | ❌           | ❌                 | ✅             |
| **Profile**            |
| View Own Profile       | ✅       | ✅           | ✅                 | ✅             |
| Update Own Profile     | ✅       | ✅           | ✅                 | ✅             |
| **Analytics**          |
| View Dashboard         | ❌       | ✅ (Limited) | ✅ (Limited)       | ✅ (Full)      |
| View Statistics        | ❌       | ✅ (Own)     | ✅ (Prescriptions) | ✅ (All)       |

---

## 🔒 Security Rules

### 1. Data Isolation

- Patients can only see their own data
- Doctors can only modify their own prescriptions
- Pharmacists can only dispense, not create

### 2. No Hard Deletes

- Appointments are **cancelled**, not deleted
- Maintains audit trail
- Preserves historical data

### 3. Status Transitions

```
Appointment Status Flow:
Scheduled → Completed (by Doctor)
Scheduled → Cancelled (by Patient)
Completed → [Final State]
Cancelled → [Final State]

Prescription Status Flow:
Pending → Dispensed (by Pharmacist)
Dispensed → [Final State]
```

### 4. Role Hierarchy

```
Admin (Highest)
  ↓
Doctor
  ↓
Pharmacist
  ↓
Patient (Lowest)
```

### 5. Action Validation

- All actions validated on backend
- Frontend restrictions for UX
- Backend enforces security

---

## 🚫 Forbidden Actions

### What NO Role Can Do:

1. ❌ **Delete appointments** (only cancel)
2. ❌ **Modify completed appointments**
3. ❌ **Delete prescriptions** (audit trail)
4. ❌ **Access data without authentication**
5. ❌ **Bypass role restrictions**
6. ❌ **Modify other users' data** (except Admin)

---

## 🎯 Implementation Details

### Frontend Protection:

- Conditional rendering based on role
- Hidden buttons for unauthorized actions
- Route guards for protected pages

### Backend Protection:

- Role-based endpoint access
- Data filtering by user
- Validation on all mutations

### Database Protection:

- Soft deletes (status changes)
- Audit columns (created_at, updated_at)
- Foreign key constraints

---

## 📝 Audit Trail

### Tracked Actions:

- Appointment cancellations (reason stored)
- Prescription creation (doctor ID stored)
- Prescription dispensing (date stored)
- User modifications (by Admin)

### Logged Information:

- Who performed the action
- When it was performed
- What was changed
- Why it was changed (for cancellations)

---

## ✅ Compliance

### HIPAA-Like Privacy:

- Patient data isolated
- Access logging (can be implemented)
- Secure data transmission
- Role-based access control

### Best Practices:

- Principle of least privilege
- Separation of duties
- Audit trail maintenance
- Data retention policies

---

**Security Status:** ✅ Implemented and Enforced
**Compliance:** ✅ Role-based access control active
**Audit Trail:** ✅ Cancellation reasons tracked
