# Fix Backend Issues

## Problem 1: Java Version Mismatch

Your code was compiled with Java 24 but runtime is Java 23.

## Problem 2: Duplicate Email

Email `doctor@gmail.com` already exists in database.

## Solutions:

### Fix 1: Clean and Rebuild Backend

Run these commands in the `backend` directory:

```bash
# Windows CMD
cd backend
mvnw clean
mvnw compile
mvnw spring-boot:run

# Or if using Maven directly
mvn clean
mvn compile
mvn spring-boot:run
```

This will:

- Clean old compiled classes
- Recompile with correct Java version (21)
- Start the backend

### Fix 2: Delete Existing Doctor Account

Option A: Delete from database directly:

```sql
DELETE FROM doctors WHERE email = 'doctor@gmail.com';
DELETE FROM users WHERE user_email = 'doctor@gmail.com';
```

Option B: Use a different email for testing:

- Try: `doctor2@gmail.com`, `newdoctor@gmail.com`, etc.

### Fix 3: Ensure Correct Java Version

Check your Java version:

```bash
java -version
```

Should show Java 21 or 23 (not 24).

If you have Java 24 installed, either:

1. Downgrade to Java 21 or 23
2. Update pom.xml to use Java 24:
   ```xml
   <properties>
       <java.version>24</java.version>
       <maven.compiler.source>24</maven.compiler.source>
       <maven.compiler.target>24</maven.compiler.target>
   </properties>
   ```

## Quick Fix Steps:

1. **Stop the backend** (Ctrl+C)
2. **Delete the existing doctor account** from database OR use different email
3. **Clean and rebuild**:
   ```bash
   cd backend
   mvnw clean compile
   ```
4. **Restart backend**:
   ```bash
   mvnw spring-boot:run
   ```
5. **Try signup again** with a new email

## Alternative: Delete from Admin Panel

If you can login as admin:

1. Login as admin
2. Go to "User Management" tab
3. Find and delete the doctor@gmail.com user
4. Try signup again
