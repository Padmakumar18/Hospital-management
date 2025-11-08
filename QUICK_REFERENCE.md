# Hospital Management System - Quick Reference

## 🚀 Quick Start

### Start Development Environment

```bash
# Windows
start-dev.bat

# Manual Start
# Terminal 1
cd backend && mvn spring-boot:run

# Terminal 2
cd frontend/app && npm start
```

### Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

## 👥 User Roles

| Role           | Capabilities                                                    |
| -------------- | --------------------------------------------------------------- |
| **Doctor**     | View appointments, Create prescriptions, Manage patient records |
| **Patient**    | Book appointments, View prescriptions, Cancel appointments      |
| **Pharmacist** | View prescriptions, Dispense medicines, Track inventory         |
| **Admin**      | Manage users, View statistics, System configuration             |

## 🔑 Test Accounts

Create via signup page:

```
Doctor:      doctor@test.com / test123
Patient:     patient@test.com / test123
Pharmacist:  pharmacist@test.com / test123
```

## 📡 API Endpoints Cheat Sheet

### Authentication

```bash
POST /auth/login          # Login
POST /auth/signup         # Register
```

### Appointments

```bash
GET    /api/appointments                    # Get all
POST   /api/appointments                    # Create
GET    /api/appointments/{id}               # Get by ID
GET    /api/appointments/patient/{id}       # By patient
GET    /api/appointments/doctor/{id}        # By doctor
PUT    /api/appointments/{id}               # Update
PATCH  /api/appointments/{id}/status        # Update status
DELETE /api/appointments/{id}               # Delete
```

### Prescriptions

```bash
GET    /api/prescriptions                   # Get all
POST   /api/prescriptions                   # Create
GET    /api/prescriptions/{id}              # Get by ID
GET    /api/prescriptions/patient/{id}      # By patient
GET    /api/prescriptions/doctor/{id}       # By doctor
PUT    /api/prescriptions/{id}              # Update
DELETE /api/prescriptions/{id}              # Delete
```

### Users

```bash
GET    /api/users                           # Get all
GET    /api/users/{email}                   # Get by email
GET    /api/users/role/{role}               # By role
PUT    /api/users/{email}                   # Update
DELETE /api/users/{email}                   # Delete
```

## 🗄️ Database Quick Commands

### PostgreSQL

```bash
# Connect
psql -U postgres -d Hospitalmanagement

# Common queries
SELECT * FROM users;
SELECT * FROM appointments WHERE status = 'Scheduled';
SELECT * FROM prescriptions WHERE patient_id = 'xxx';

# Backup
pg_dump -U postgres Hospitalmanagement > backup.sql

# Restore
psql -U postgres Hospitalmanagement < backup.sql
```

## 🛠️ Common Tasks

### Add New User (SQL)

```sql
INSERT INTO users (id, user_email, user_password, user_name, user_role)
VALUES (gen_random_uuid(), 'user@email.com', 'password', 'Name', 'Role');
```

### Check Appointment Status

```sql
SELECT patient_name, doctor_name, status, appointment_date
FROM appointments
WHERE status = 'Scheduled'
ORDER BY appointment_date;
```

### View Pending Prescriptions

```sql
SELECT p.patient_name, p.doctor_name, p.diagnosis, COUNT(m.id) as medicine_count
FROM prescriptions p
LEFT JOIN medicines m ON m.prescription_id = p.id
GROUP BY p.id;
```

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check Java version
java -version

# Check port 8080
netstat -ano | findstr :8080

# Check PostgreSQL
psql --version
```

### Frontend Won't Start

```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check port 3000
netstat -ano | findstr :3000
```

### Database Connection Failed

```bash
# Check PostgreSQL service
# Windows: services.msc
# Linux: sudo systemctl status postgresql

# Test connection
psql -U postgres -h localhost -p 5432
```

### CORS Errors

- Verify backend is running on port 8080
- Check WebConfig.java CORS settings
- Clear browser cache

## 📦 Build Commands

### Backend

```bash
# Clean build
mvn clean install

# Skip tests
mvn clean install -DskipTests

# Run tests only
mvn test

# Package JAR
mvn package
```

### Frontend

```bash
# Install dependencies
npm install

# Development server
npm start

# Production build
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## 🔍 Useful Queries

### Get User by Email

```bash
curl http://localhost:8080/api/users/doctor@test.com
```

### Create Appointment

```bash
curl -X POST http://localhost:8080/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "doctorName": "Dr. Smith",
    "appointmentDate": "2025-11-10",
    "appointmentTime": "10:00:00",
    "department": "Cardiology"
  }'
```

### Get Doctor's Appointments

```bash
curl http://localhost:8080/api/appointments/doctor/doctor-id-123
```

## 📊 Status Values

### Appointment Status

- `Scheduled` - Appointment booked
- `Completed` - Consultation done
- `Cancelled` - Appointment cancelled

### Prescription Status

- `Pending` - Not yet dispensed
- `Dispensed` - Medicines given

### User Roles

- `Doctor` - Medical practitioner
- `Patient` - Hospital patient
- `Pharmacist` - Medicine dispenser
- `Admin` - System administrator

## 🎨 Component Structure

```
Frontend Components
├── Auth.js              # Login/Signup
├── Home.js              # Role router
├── Header.js            # Navigation
├── roles/
│   ├── Doctor.js        # Doctor dashboard
│   ├── Patient.js       # Patient dashboard
│   ├── Pharmacist.js    # Pharmacist dashboard
│   └── Admin.js         # Admin dashboard
└── services/
    └── api.js           # API client
```

## 🔐 Security Notes

- Passwords stored in plain text (demo only)
- Use BCrypt in production
- Implement JWT for API auth
- Add rate limiting
- Enable HTTPS in production

## 📝 File Locations

### Configuration

- Backend: `backend/src/main/resources/application.properties`
- Frontend: `frontend/app/src/services/api.js`
- Database: `backend/src/main/resources/data.sql`

### Logs

- Backend: Console output or `logs/application.log`
- Frontend: Browser console
- Database: PostgreSQL logs

## 🚨 Emergency Commands

### Stop All Services

```bash
# Windows
taskkill /F /IM java.exe
taskkill /F /IM node.exe

# Linux
pkill -f java
pkill -f node
```

### Reset Database

```sql
DROP DATABASE Hospitalmanagement;
CREATE DATABASE Hospitalmanagement;
```

### Clear Frontend Cache

```bash
cd frontend/app
rm -rf node_modules build
npm install
```

## 📞 Support

- Documentation: README.md
- Testing: TEST_GUIDE.md
- Deployment: DEPLOYMENT.md
- Summary: PROJECT_SUMMARY.md

## 🎯 Quick Tips

1. **Always start backend before frontend**
2. **Check PostgreSQL is running first**
3. **Use Chrome DevTools for debugging**
4. **Check browser console for errors**
5. **Verify API responses in Network tab**
6. **Use Redux DevTools for state debugging**
7. **Check backend logs for errors**
8. **Clear browser cache if issues persist**

## 📈 Performance Tips

- Use filters to reduce data load
- Implement pagination for large lists
- Cache frequently accessed data
- Optimize database queries
- Use lazy loading for routes
- Minimize re-renders in React

## 🔄 Common Workflows

### Book Appointment (Patient)

1. Login as Patient
2. Click "Book New Appointment"
3. Fill form
4. Submit
5. View in appointment list

### Create Prescription (Doctor)

1. Login as Doctor
2. View appointments
3. Click patient card
4. Click "Prescribe"
5. Fill prescription form
6. Add medicines
7. Save

### Dispense Medicine (Pharmacist)

1. Login as Pharmacist
2. View prescriptions
3. Filter by "Pending"
4. Click "View Details"
5. Review medicines
6. Click "Mark as Dispensed"

### Manage Users (Admin)

1. Login as Admin
2. Go to "User Management"
3. Search/Filter users
4. Edit/Activate/Deactivate
5. View statistics

---

**Last Updated**: November 7, 2025
**Version**: 1.0.0
