# 🚀 Quick Password Hashing Setup

## 3-Step Setup After Implementing BCrypt

---

## Step 1: Restart Backend (1 minute)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Wait for:** "Started BackendApplication"

---

## Step 2: Reset Test Users (2 minutes)

### Option A: Delete All Users (Easiest)

```sql
-- Connect to database
psql -U postgres -d hospital_db

-- Delete all users
TRUNCATE TABLE users CASCADE;

-- Exit
\q
```

### Option B: Keep Existing Data

Skip this step and create new test users with different emails.

---

## Step 3: Create Test Users (2 minutes)

### Using Postman or curl:

#### Admin User:

```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "Admin"
  }'
```

#### Doctor User:

```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor1@hospital.com",
    "password": "doctor123",
    "name": "Dr. Sarah Johnson",
    "role": "Doctor"
  }'
```

#### Patient User:

```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient1@hospital.com",
    "password": "patient123",
    "name": "John Smith",
    "role": "Patient"
  }'
```

#### Pharmacist User:

```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pharmacist@hospital.com",
    "password": "pharma123",
    "name": "Robert Brown",
    "role": "Pharmacist"
  }'
```

---

## Verify Setup

### 1. Check Database:

```sql
SELECT user_email, user_password FROM users;
```

**Expected:** Passwords should look like:

```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

### 2. Test Login:

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "admin123"
  }'
```

**Expected:** Success response with user data

### 3. Test Wrong Password:

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "wrongpassword"
  }'
```

**Expected:** Unauthorized response

---

## Test Credentials

After setup, use these credentials:

| Role       | Email                   | Password   |
| ---------- | ----------------------- | ---------- |
| Admin      | admin@hospital.com      | admin123   |
| Doctor     | doctor1@hospital.com    | doctor123  |
| Patient    | patient1@hospital.com   | patient123 |
| Pharmacist | pharmacist@hospital.com | pharma123  |

---

## Troubleshooting

### Issue: "Email already exists"

**Solution:** User already created, try logging in

### Issue: "Invalid username or password"

**Solution:**

1. Check if user exists in database
2. Verify password is correct
3. Ensure backend restarted after changes

### Issue: Old users can't login

**Solution:**

- Old passwords are plain text
- Need to delete old users and create new ones
- Or manually update passwords in database

---

## Quick Test Script

Save as `test-password-hashing.sh`:

```bash
#!/bin/bash

echo "Testing Password Hashing Implementation"
echo "========================================"

# Test signup
echo "1. Creating test user..."
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@hospital.com",
    "password": "test123",
    "name": "Test User",
    "role": "Patient"
  }'

echo -e "\n\n2. Testing login with correct password..."
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@hospital.com",
    "password": "test123"
  }'

echo -e "\n\n3. Testing login with wrong password..."
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@hospital.com",
    "password": "wrongpassword"
  }'

echo -e "\n\nDone!"
```

Run: `bash test-password-hashing.sh`

---

## Success Indicators

✅ Backend starts without errors
✅ Can create new users via signup
✅ Passwords in database are hashed (start with $2a$10$)
✅ Can login with correct password
✅ Cannot login with wrong password
✅ Frontend login works normally

---

**Setup Time:** ~5 minutes
**Status:** Ready to use
**Security:** ✅ Passwords now securely hashed!
