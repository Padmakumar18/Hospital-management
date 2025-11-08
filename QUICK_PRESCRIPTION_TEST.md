# 🧪 Quick Prescription Test Guide

## 5-Minute Test to Verify Prescription Fix

---

## Step 1: Start Servers (1 minute)

### Backend:

```bash
cd backend
mvn spring-boot:run
```

Wait for: "Started BackendApplication"

### Frontend:

```bash
cd frontend/app
npm start
```

Opens: http://localhost:3000

---

## Step 2: Login as Doctor (30 seconds)

```
Email: doctor1@hospital.com
Password: doctor123
```

---

## Step 3: Create Prescription (2 minutes)

### Find an Appointment:

- Look for a "Scheduled" appointment
- Click the **"Prescribe"** button

### Fill the Form:

```
Diagnosis: Common Cold
Symptoms: Fever, cough, runny nose

Medicine 1:
- Medicine Name: Paracetamol
- Dosage: 500mg
- Frequency: Three times daily
- Duration: 5 days
- Quantity: 15 tablets
- Instructions: Take after meals

Additional Notes: Rest and drink plenty of fluids
Follow-up Date: [Select date 7 days from now]
```

### Save:

- Click **"Save Prescription"**
- ✅ Should see: "Prescription created successfully!"
- ✅ Appointment status changes to "Completed"

---

## Step 4: Verify as Patient (1 minute)

### Logout and Login as Patient:

```
Email: patient1@hospital.com
Password: patient123
```

### View Prescription:

- Find the completed appointment
- Click **"View Prescription"**
- ✅ Should see all prescription details
- ✅ Medicine list with dosage
- ✅ Doctor name and diagnosis

---

## Step 5: Verify as Pharmacist (30 seconds)

### Logout and Login as Pharmacist:

```
Email: pharmacist@hospital.com
Password: pharma123
```

### Check Prescription:

- Find the prescription in the list
- Click **"View Details"**
- ✅ Should see complete prescription
- ✅ Can mark as "Dispensed"

---

## Expected Results ✅

### After Doctor Saves Prescription:

- ✅ Success toast appears
- ✅ Appointment status = "Completed"
- ✅ Prescription icon shows on appointment
- ✅ Form closes automatically

### Patient View:

- ✅ "View Prescription" button visible
- ✅ Prescription modal opens
- ✅ All details displayed correctly

### Pharmacist View:

- ✅ Prescription appears in list
- ✅ Status shows "Pending"
- ✅ Can view and dispense

---

## Troubleshooting

### If Prescription Doesn't Save:

1. **Check Browser Console:**

   ```
   F12 → Console tab
   Look for error messages
   ```

2. **Check Backend Console:**

   ```
   Look for:
   "Received prescription request:"
   "Patient: [name]"
   "Doctor: [name]"
   "Medicines count: [number]"
   ```

3. **Common Issues:**
   - ❌ "Doctor name is null" → Refresh page and login again
   - ❌ "Validation error" → Fill all required fields (marked with \*)
   - ❌ "Network error" → Check backend is running

### If Appointment Doesn't Update:

1. **Refresh the page**
2. **Check appointment status in database:**
   ```sql
   SELECT status, prescription_given
   FROM appointments
   WHERE patient_name = 'John Doe';
   ```

---

## Database Verification (Optional)

### Check Prescription:

```sql
SELECT * FROM prescriptions
ORDER BY created_date DESC
LIMIT 1;
```

### Check Medicines:

```sql
SELECT m.* FROM medicines m
JOIN prescriptions p ON m.prescription_id = p.id
ORDER BY p.created_date DESC
LIMIT 5;
```

### Check Appointment:

```sql
SELECT id, patient_name, status, prescription_given, follow_up_required
FROM appointments
WHERE status = 'Completed'
ORDER BY appointment_date DESC
LIMIT 5;
```

---

## Success Indicators ✅

- [x] Doctor can create prescription
- [x] No errors in console
- [x] Success toast appears
- [x] Appointment updates to "Completed"
- [x] Patient can view prescription
- [x] Pharmacist can see prescription
- [x] All data saves to database

---

## If Everything Works:

**🎉 Prescription feature is working correctly!**

You can now:

- Create prescriptions for patients
- View prescriptions as patient
- Dispense prescriptions as pharmacist
- Track prescription history

---

## Quick Commands

### Restart Backend:

```bash
cd backend
mvn spring-boot:run
```

### Restart Frontend:

```bash
cd frontend/app
npm start
```

### Check Database:

```bash
psql -U postgres -d hospital_db
\dt  # List tables
SELECT COUNT(*) FROM prescriptions;
SELECT COUNT(*) FROM medicines;
```

---

**Test Duration:** ~5 minutes
**Status:** Ready to test
**Expected Result:** All features working correctly
