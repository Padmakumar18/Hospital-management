# Hospital Management System - Testing Guide

## Quick Start Testing

### 1. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

Wait for the message: "Started BackendApplication"

### 2. Start the Frontend

```bash
cd frontend/app
npm start
```

Browser should open automatically at `http://localhost:3000`

## Test Scenarios

### Scenario 1: User Registration and Login

#### Register as Doctor

1. Click "Sign up here"
2. Fill in:
   - Full Name: Dr. John Doe
   - Email: doctor@test.com
   - Password: test123
   - Role: Doctor
3. Click "Create Account"
4. Should redirect to home with Doctor dashboard

#### Register as Patient

1. Sign out
2. Click "Sign up here"
3. Fill in:
   - Full Name: Jane Patient
   - Email: patient@test.com
   - Password: test123
   - Role: Patient
4. Click "Create Account"
5. Should redirect to home with Patient dashboard

#### Register as Pharmacist

1. Sign out
2. Click "Sign up here"
3. Fill in:
   - Full Name: Bob Pharmacist
   - Email: pharmacist@test.com
   - Password: test123
   - Role: Pharmacist
4. Click "Create Account"
5. Should redirect to home with Pharmacist dashboard

### Scenario 2: Patient Books Appointment

1. Login as Patient (patient@test.com / test123)
2. Click "Book New Appointment"
3. Fill in the form:
   - Doctor: Select any doctor
   - Department: Cardiology
   - Date: Tomorrow's date
   - Time: 10:00 AM
   - Reason: Regular checkup
   - Issue Duration: 2 days
4. Click "Book Appointment"
5. Should see success message
6. Appointment should appear in the list

### Scenario 3: Doctor Manages Appointments

1. Login as Doctor (doctor@test.com / test123)
2. Should see appointments list
3. Filter by "Scheduled" status
4. Click on a patient card
5. Click "Prescribe" button
6. Fill prescription form:
   - Diagnosis: Common cold
   - Symptoms: Fever, cough
   - Add medicine:
     - Name: Paracetamol
     - Dosage: 500mg
     - Frequency: 3 times daily
     - Duration: 5 days
     - Quantity: 15 tablets
   - Additional Notes: Rest and drink plenty of water
   - Follow-up Date: 1 week from now
7. Click "Save Prescription"
8. Appointment status should change to "Completed"

### Scenario 4: Pharmacist Dispenses Medicine

1. Login as Pharmacist (pharmacist@test.com / test123)
2. Should see prescriptions list
3. Filter by "Pending" status
4. Click "View Details" on a prescription
5. Review medicine details
6. Click "Mark as Dispensed"
7. Status should change to "Dispensed"

### Scenario 5: Patient Views Prescription

1. Login as Patient
2. Find completed appointment
3. Click "View Prescription"
4. Should see:
   - Doctor details
   - Diagnosis
   - Medicines list
   - Follow-up date
5. Can download/print prescription

### Scenario 6: Admin Manages Users (If Admin role exists)

1. Login as Admin
2. Navigate to "User Management" tab
3. View all users
4. Filter by role
5. Edit user details
6. Deactivate/Activate users
7. View system statistics

## API Testing with cURL

### Test User Login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@test.com",
    "password": "test123"
  }'
```

### Test Create Appointment

```bash
curl -X POST http://localhost:8080/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-123",
    "doctorId": "doctor-456",
    "patientName": "Jane Patient",
    "doctorName": "Dr. John Doe",
    "age": 30,
    "gender": "Female",
    "contactNumber": "1234567890",
    "department": "Cardiology",
    "appointmentDate": "2025-11-10",
    "appointmentTime": "10:00:00",
    "reason": "Regular checkup",
    "issueDays": 2
  }'
```

### Test Get All Appointments

```bash
curl http://localhost:8080/api/appointments
```

### Test Create Prescription

```bash
curl -X POST http://localhost:8080/api/prescriptions \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-123",
    "doctorId": "doctor-456",
    "patientName": "Jane Patient",
    "doctorName": "Dr. John Doe",
    "gender": "Female",
    "age": 30,
    "diagnosis": "Common cold",
    "symptoms": "Fever, cough",
    "medicines": [
      {
        "medicineName": "Paracetamol",
        "dosage": "500mg",
        "frequency": "3 times daily",
        "duration": "5 days",
        "quantity": "15",
        "instruction": "Take after meals"
      }
    ],
    "additionalNotes": "Rest and drink plenty of water",
    "followUpDate": "2025-11-17"
  }'
```

## Expected Behaviors

### Authentication

- ✅ Successful login redirects to role-specific dashboard
- ✅ Failed login shows error message
- ✅ Auto-login works with saved credentials
- ✅ Sign out clears session and redirects to login

### Appointments

- ✅ Patient can book appointments
- ✅ Doctor can view assigned appointments
- ✅ Appointments can be filtered by status
- ✅ Appointment status updates correctly
- ✅ Cancellation requires confirmation

### Prescriptions

- ✅ Doctor can create prescriptions
- ✅ Prescriptions linked to appointments
- ✅ Patient can view their prescriptions
- ✅ Pharmacist can dispense medicines
- ✅ Prescription history is maintained

### UI/UX

- ✅ Smooth animations on page transitions
- ✅ Toast notifications for actions
- ✅ Loading states during API calls
- ✅ Responsive design works on mobile
- ✅ Form validation prevents invalid data

## Common Issues and Solutions

### Issue: Backend won't start

**Solution**:

- Check if PostgreSQL is running
- Verify database credentials in application.properties
- Ensure port 8080 is not in use

### Issue: Frontend can't connect to backend

**Solution**:

- Verify backend is running on port 8080
- Check CORS configuration in WebConfig.java
- Clear browser cache and reload

### Issue: Database tables not created

**Solution**:

- Check Hibernate ddl-auto setting (should be "update")
- Verify database connection
- Check application logs for errors

### Issue: Login fails with correct credentials

**Solution**:

- Check if user exists in database
- Verify password matches
- Check browser console for errors

### Issue: Appointments not showing

**Solution**:

- Verify user ID matches appointment records
- Check API response in browser network tab
- Ensure data is being saved to database

## Performance Testing

### Load Test Endpoints

```bash
# Install Apache Bench (ab) if not available
# Test login endpoint
ab -n 100 -c 10 -p login.json -T application/json http://localhost:8080/auth/login

# Test get appointments
ab -n 1000 -c 50 http://localhost:8080/api/appointments
```

### Expected Response Times

- Login: < 200ms
- Get appointments: < 100ms
- Create appointment: < 300ms
- Create prescription: < 400ms

## Security Testing

### Test SQL Injection

Try entering SQL in form fields:

```
' OR '1'='1
```

Should be properly escaped and not cause errors.

### Test XSS

Try entering script tags:

```html
<script>
  alert("XSS");
</script>
```

Should be sanitized and not execute.

### Test Authentication

Try accessing protected routes without login:

```bash
curl http://localhost:8080/api/appointments
```

Should return 401 or redirect to login.

## Browser Compatibility

Test on:

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Testing

- ✅ Keyboard navigation works
- ✅ Screen reader compatible
- ✅ Sufficient color contrast
- ✅ Form labels properly associated
- ✅ Error messages are clear

## Final Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Database connection successful
- [ ] User registration works
- [ ] User login works
- [ ] Doctor dashboard loads
- [ ] Patient dashboard loads
- [ ] Pharmacist dashboard loads
- [ ] Appointments can be created
- [ ] Prescriptions can be created
- [ ] Medicines can be dispensed
- [ ] All CRUD operations work
- [ ] Notifications appear correctly
- [ ] Responsive design works
- [ ] No console errors
- [ ] API endpoints respond correctly

## Support

If you encounter issues not covered here:

1. Check application logs
2. Review browser console
3. Verify database state
4. Check network requests
5. Create an issue with details
