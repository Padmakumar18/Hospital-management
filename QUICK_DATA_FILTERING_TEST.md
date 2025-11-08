# 🧪 Quick Data Filtering Test

## 3-Minute Test to Verify Data Isolation

---

## Test 1: Patient Data Isolation (1 minute)

### Setup:

1. Create 2 patients with appointments
2. Login as Patient 1

### Steps:

```bash
# Login as Patient 1
Email: patient1@hospital.com
Password: patient123

# View appointments
```

### Expected Results:

✅ Only see Patient 1's appointments
✅ Statistics show only Patient 1's data
✅ Cannot see Patient 2's appointments

### Verify in Console (F12):

```
Total appointments: [X]
Patient's appointments: [Y]  // Y should be less than X
```

---

## Test 2: Doctor Data Isolation (1 minute)

### Setup:

1. Create 2 doctors with appointments
2. Login as Doctor 1

### Steps:

```bash
# Login as Doctor 1
Email: doctor1@hospital.com
Password: doctor123

# View appointments
```

### Expected Results:

✅ Only see Doctor 1's appointments
✅ Only see patients assigned to Doctor 1
✅ Cannot see Doctor 2's appointments

### Verify in Console (F12):

```
Total appointments: [X]
Doctor's appointments: [Y]  // Y should be less than X
Filtering by doctor: Dr. [Name] [email]
```

---

## Test 3: Cross-User Verification (1 minute)

### Test A: Different Patients

```bash
# Login as Patient A
- See appointments for Patient A only

# Logout and login as Patient B
- See appointments for Patient B only
- Should NOT see Patient A's appointments
```

### Test B: Different Doctors

```bash
# Login as Doctor A
- See appointments for Doctor A only

# Logout and login as Doctor B
- See appointments for Doctor B only
- Should NOT see Doctor A's appointments
```

---

## Quick Verification Script

### Create Test Data:

```sql
-- Create test appointments for different users
INSERT INTO appointments (patient_name, patient_id, doctor_name, doctor_id, status, appointment_date, appointment_time)
VALUES
  ('John Doe', 'john@hospital.com', 'Dr. Smith', 'smith@hospital.com', 'Scheduled', CURRENT_DATE, '10:00:00'),
  ('Jane Smith', 'jane@hospital.com', 'Dr. Jones', 'jones@hospital.com', 'Scheduled', CURRENT_DATE, '11:00:00'),
  ('John Doe', 'john@hospital.com', 'Dr. Jones', 'jones@hospital.com', 'Scheduled', CURRENT_DATE, '14:00:00'),
  ('Bob Wilson', 'bob@hospital.com', 'Dr. Smith', 'smith@hospital.com', 'Scheduled', CURRENT_DATE, '15:00:00');
```

### Test Queries:

```sql
-- Check total appointments
SELECT COUNT(*) FROM appointments;
-- Expected: 4

-- Check John's appointments
SELECT * FROM appointments WHERE patient_name = 'John Doe';
-- Expected: 2 appointments

-- Check Dr. Smith's appointments
SELECT * FROM appointments WHERE doctor_name = 'Dr. Smith';
-- Expected: 2 appointments
```

---

## Success Indicators

### Patient View:

- [x] Only own appointments visible
- [x] Correct count in statistics
- [x] Console shows filtered count
- [x] Other patients' data hidden

### Doctor View:

- [x] Only own appointments visible
- [x] Only own patients shown
- [x] Console shows filtered count
- [x] Other doctors' data hidden

### Pharmacist View:

- [x] All prescriptions visible (correct)
- [x] Can dispense any prescription

### Admin View:

- [x] All data visible (correct)
- [x] Can manage all users

---

## Troubleshooting

### Issue: Seeing all appointments

**Check:**

1. Profile loaded correctly? (Check Redux store)
2. Name/email matches appointment data?
3. Console logs showing filtering?

**Solution:**

```javascript
// Check profile in console
console.log("Profile:", profile);
// Should show: {name: "...", email: "...", role: "..."}
```

### Issue: Not seeing any appointments

**Check:**

1. Appointments exist in database?
2. Name/email exactly matches?
3. Case sensitivity?

**Solution:**

```sql
-- Check appointments in database
SELECT patient_name, patient_id, doctor_name, doctor_id
FROM appointments;

-- Verify exact match
SELECT * FROM appointments
WHERE patient_name = 'John Doe'
OR patient_id = 'john@hospital.com';
```

---

## Quick Test Checklist

### Before Testing:

- [ ] Backend running
- [ ] Frontend running
- [ ] Test users created
- [ ] Test appointments created

### Patient Tests:

- [ ] Login as Patient 1
- [ ] See only own appointments
- [ ] Check console logs
- [ ] Login as Patient 2
- [ ] See different appointments

### Doctor Tests:

- [ ] Login as Doctor 1
- [ ] See only own appointments
- [ ] Check console logs
- [ ] Login as Doctor 2
- [ ] See different appointments

### Verification:

- [ ] No cross-user data visible
- [ ] Statistics correct
- [ ] Console logs show filtering
- [ ] Privacy maintained

---

## Expected Console Output

### Patient Login:

```
Loading appointments...
Total appointments: 10
Patient's appointments: 3
Filtering by patient: John Doe john@hospital.com
```

### Doctor Login:

```
Loading appointments...
Total appointments: 20
Doctor's appointments: 8
Filtering by doctor: Dr. Smith smith@hospital.com
```

---

**Test Duration:** ~3 minutes
**Status:** Ready to test
**Expected Result:**
