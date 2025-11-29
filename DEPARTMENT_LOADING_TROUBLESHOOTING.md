# Department Loading Issue - Troubleshooting Guide

## Error

"Failed to load departments and doctors"

## Possible Causes & Solutions

### 1. Backend Not Running ⚠️

**Most Common Cause**

#### Check if backend is running:

```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080

# Or try accessing directly
curl http://localhost:8080/api/departments/active
```

#### Solution:

```bash
cd backend
mvn spring-boot:run
```

**Wait for this message:**

```
Started BackendApplication in X.XXX seconds
✓ Seeded 10 departments
✓ Seeded XX doctors
```

### 2. Database Not Initialized

**Departments table might be empty**

#### Check in backend logs:

Look for:

```
✓ Seeded 10 departments
```

If you don't see this, the database might not be initialized.

#### Solution:

1. Stop backend
2. Delete database file (if using H2):
   ```bash
   rm backend/data/hospital.mv.db
   ```
3. Restart backend - it will recreate and seed data

### 3. CORS Issue

**Browser blocking cross-origin requests**

#### Check browser console:

Look for errors like:

```
Access to XMLHttpRequest at 'http://localhost:8080/api/departments/active'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

#### Solution:

Backend should have CORS configured. Check if this exists in backend:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                .allowCredentials(true);
    }
}
```

### 4. Wrong API URL

**Frontend pointing to wrong backend URL**

#### Check in `frontend/app/src/services/api.js`:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

Should match your backend port (default: 8080)

#### Solution:

Update the URL if backend is running on a different port.

### 5. Network Error

**Connection refused or timeout**

#### Check browser console:

```
Error: Network Error
Error: connect ECONNREFUSED 127.0.0.1:8080
```

#### Solution:

1. Ensure backend is running
2. Check firewall settings
3. Try accessing backend directly: `http://localhost:8080/api/departments/active`

### 6. Recent Code Changes

**Backend needs restart after changes**

#### After these changes:

- Added `isEdited` field to PrescriptionEntity
- Changed `boolean` to `Boolean`
- Updated PrescriptionService

#### Solution:

**RESTART THE BACKEND!**

```bash
# Stop current backend (Ctrl+C)
# Then restart:
cd backend
mvn clean spring-boot:run
```

## Step-by-Step Debugging

### Step 1: Check Backend Status

```bash
# Windows
netstat -ano | findstr :8080

# Should show something like:
TCP    0.0.0.0:8080    0.0.0.0:0    LISTENING    12345
```

### Step 2: Test Backend Directly

Open browser and go to:

```
http://localhost:8080/api/departments/active
```

**Expected Response:**

```json
[
  {
    "id": "uuid",
    "name": "General Medicine",
    "description": "Primary healthcare...",
    "active": true
  },
  ...
]
```

**If you get an error:**

- Backend is not running → Start it
- 404 Not Found → Check endpoint mapping
- 500 Internal Server Error → Check backend logs

### Step 3: Check Browser Console

Open Developer Tools (F12) → Console tab

Look for:

- Red error messages
- Network errors
- CORS errors

### Step 4: Check Network Tab

Developer Tools → Network tab

1. Refresh the appointment booking page
2. Look for request to `/api/departments/active`
3. Check:
   - Status code (should be 200)
   - Response data
   - Any errors

### Step 5: Check Backend Logs

Look in backend console for:

```
ERROR messages
Exception stack traces
Connection errors
```

## Quick Fix Checklist

- [ ] Backend is running on port 8080
- [ ] Can access `http://localhost:8080/api/departments/active` in browser
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows successful request (200 status)
- [ ] Backend logs show "Seeded 10 departments"
- [ ] Frontend is running on port 3000
- [ ] No firewall blocking connections

## Common Solutions

### Solution 1: Restart Everything

```bash
# Stop frontend (Ctrl+C in frontend terminal)
# Stop backend (Ctrl+C in backend terminal)

# Start backend first
cd backend
mvn clean spring-boot:run

# Wait for "Started BackendApplication"
# Then start frontend
cd frontend/app
npm start
```

### Solution 2: Clear and Reseed Database

```bash
# Stop backend
# Delete database (H2)
rm backend/data/hospital.mv.db

# Restart backend - will recreate database
cd backend
mvn spring-boot:run
```

### Solution 3: Check Port Conflicts

```bash
# If port 8080 is already in use
# Find process using it:
netstat -ano | findstr :8080

# Kill the process (replace PID):
taskkill /PID <process_id> /F

# Or change backend port in application.properties:
server.port=8081
```

## Testing the Fix

### Test 1: Backend API

```bash
curl http://localhost:8080/api/departments/active
```

Should return JSON array of departments

### Test 2: Frontend Loading

1. Open appointment booking form
2. Check department dropdown
3. Should show: "General Medicine", "Cardiology", etc.

### Test 3: Doctor Loading

1. Select a department
2. Doctor dropdown should populate
3. Should show doctors for that department

## Expected Behavior

### When Working Correctly:

1. Open appointment booking form
2. Department dropdown shows:

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

3. Select department → Doctors load
4. No error messages

### When Not Working:

1. Department dropdown shows: "Loading departments..." or "Select department"
2. Toast error: "Failed to load departments and doctors"
3. Console error in browser
4. Backend logs show errors

## Prevention

### Always Do This:

1. **Start backend BEFORE frontend**
2. **Wait for "Started BackendApplication" message**
3. **Check for "Seeded X departments" message**
4. **Then start frontend**

### After Code Changes:

1. **Restart backend** (especially after model changes)
2. **Clear browser cache** if needed
3. **Check for compilation errors**

## Still Not Working?

### Check These Files:

1. **Backend Running?**

   ```
   backend/src/main/java/com/hospitalmanagement/backend/BackendApplication.java
   ```

2. **Repository Correct?**

   ```
   backend/src/main/java/com/hospitalmanagement/backend/repository/DepartmentRepository.java
   ```

3. **Service Correct?**

   ```
   backend/src/main/java/com/hospitalmanagement/backend/service/DepartmentService.java
   ```

4. **Controller Correct?**

   ```
   backend/src/main/java/com/hospitalmanagement/backend/controller/DepartmentController.java
   ```

5. **Frontend API Correct?**
   ```
   frontend/app/src/services/api.js
   ```

## Get Help

If still not working, provide:

1. Backend console output
2. Browser console errors
3. Network tab screenshot
4. Backend logs
5. Steps you've tried

## Most Likely Solution

**90% of the time, the issue is:**

```
Backend is not running or needs restart
```

**Solution:**

```bash
cd backend
mvn spring-boot:run
```

**Wait for:**

```
Started BackendApplication in X.XXX seconds
✓ Seeded 10 departments
```

**Then refresh frontend page.**
