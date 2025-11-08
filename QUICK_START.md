# 🚀 Quick Start Guide

## Get Started in 5 Minutes

---

## 📋 Prerequisites

- ✅ PostgreSQL installed and running
- ✅ Java 17+ installed
- ✅ Node.js 16+ installed
- ✅ Maven installed

---

## 🔧 Setup Steps

### 1. Database Setup (1 minute)

```sql
-- Create database
CREATE DATABASE hospital_db;

-- That's it! Tables will be auto-created by Hibernate
```

### 2. Configure Backend (30 seconds)

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hospital_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Start Backend (1 minute)

```bash
cd backend
mvn spring-boot:run
```

**Wait for:** "✓ Seeded 10 departments" and "✓ Seeded 30 doctors"

### 4. Start Frontend (1 minute)

```bash
cd frontend/app
npm install  # First time only
npm start
```

**Opens:** http://localhost:3000

---

## 🎯 Quick Test

### Test Patient Flow (2 minutes):

1. **Login:**

   - Email: `patient1@hospital.com`
   - Password: `patient123`

2. **Book Appointment:**

   - Click "Book New Appointment"
   - Fill form:
     - Name: John Doe
     - Age: 30
     - Gender: Male
     - Contact: +91 9876543210
   - Select Department: **Cardiology** (from database!)
   - Select Doctor: **Dr. Meena Kapoor** (from database!)
   - Pick date and time
   - Click "Book Appointment"

3. **Verify:**
   - ✅ Appointment appears in list
   - ✅ Status shows "Scheduled"
   - ✅ Can cancel (not delete)

### Test Doctor Flow (1 minute):

1. **Login:**

   - Email: `doctor1@hospital.com`
   - Password: `doctor123`

2. **View Appointments:**

   - See all appointments
   - Filter by status

3. **Create Prescription:**
   - Click "Prescribe" on an appointment
   - Fill prescription form
   - Save

---

## 📊 Verify Database Integration

### Check Departments:

```bash
# In appointment booking form
# Department dropdown should show:
```

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

### Check Doctors:

```bash
# Select "Cardiology" department
# Doctor dropdown should show:
```

- Dr. Meena Kapoor - Interventional Cardiology
- Dr. Arjun Singh - Clinical Cardiology
- Dr. Kavita Reddy - Pediatric Cardiology

**All from database!** ✅

---

## 🔑 Test Accounts

| Role       | Email                   | Password   |
| ---------- | ----------------------- | ---------- |
| Patient    | patient1@hospital.com   | patient123 |
| Doctor     | doctor1@hospital.com    | doctor123  |
| Pharmacist | pharmacist@hospital.com | pharma123  |
| Admin      | admin@hospital.com      | admin123   |

---

## ✅ Success Indicators

### Backend Started Successfully:

```
✓ Seeded 10 departments
✓ Seeded 30 doctors
Started BackendApplication in X seconds
```

### Frontend Working:

- Login page loads
- Can login with test accounts
- Departments load in dropdown
- Doctors load in dropdown

### Database Integration Working:

- Departments come from database (not hardcoded)
- Doctors come from database (not hardcoded)
- Doctors filter by department
- All data persists after refresh

---

## 🐛 Troubleshooting

### Backend won't start:

```bash
# Check PostgreSQL is running
psql -U postgres

# Check database exists
\l

# Check application.properties has correct credentials
```

### Frontend won't connect:

```bash
# Check backend is running on port 8080
curl http://localhost:8080/api/departments

# Check CORS is configured (already done in WebConfig.java)
```

### No departments/doctors showing:

```bash
# Check backend logs for seeding messages
# Should see: "✓ Seeded 10 departments" and "✓ Seeded 30 doctors"

# If not, check database:
SELECT COUNT(*) FROM departments;  -- Should be 10
SELECT COUNT(*) FROM doctors;      -- Should be 30
```

---

## 📚 Next Steps

1. **Read Full Documentation:**

   - `IMPLEMENTATION_COMPLETE.md` - Complete features
   - `TESTING_GUIDE.md` - Comprehensive testing
   - `ROLE_PERMISSIONS.md` - Permission details

2. **Test All Workflows:**

   - Patient booking and cancellation
   - Doctor prescription creation
   - Pharmacist dispensing
   - Admin user management

3. **Verify Key Features:**
   - ✅ No mock data (all from DB)
   - ✅ Patient can't delete appointments
   - ✅ Proper role permissions
   - ✅ Audit trail for cancellations

---

## 🎉 You're Ready!

The system is now running with:

- ✅ 10 departments in database
- ✅ 30 doctors in database
- ✅ Complete role-based access control
- ✅ All workflows implemented
- ✅ No mock data

**Start testing and enjoy!** 🚀

---

## 💡 Quick Tips

- **Departments and doctors auto-seed** on first startup
- **Patient can only CANCEL** appointments (not delete)
- **All data comes from database** (no hardcoded lists)
- **Each role has specific permissions** (see ROLE_PERMISSIONS.md)
- **Cancellation reasons are stored** for audit trail

---

**Need Help?** Check the comprehensive guides:

- TESTING_GUIDE.md
- ROLE_PERMISSIONS.md
- IMPLEMENTATION_COMPLETE.md
