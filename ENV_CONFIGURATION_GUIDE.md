# Environment Configuration Guide

## Overview

Environment variables allow you to configure the application without changing code. This is essential for:

- Different environments (development, staging, production)
- Security (keeping secrets out of code)
- Flexibility (easy configuration changes)
- Team collaboration (each developer can have their own settings)

## Files Created

### Frontend

1. **`.env`** - Active configuration (DO NOT commit to Git)
2. **`.env.example`** - Template file (safe to commit)

### Backend

1. **`.env`** - Active configuration (DO NOT commit to Git)
2. **`.env.example`** - Template file (safe to commit)

## Frontend Configuration

### Location

```
frontend/app/.env
```

### Variables

#### API Configuration

```env
REACT_APP_API_URL=http://localhost:8080
```

- Backend API base URL
- Change for production: `https://api.yourdomain.com`

#### Environment

```env
REACT_APP_ENV=development
```

- Options: `development`, `production`, `test`
- Affects logging and debugging

#### Application Info

```env
REACT_APP_NAME=Hospital Management System
REACT_APP_VERSION=1.0.0
```

- Display name and version

#### Auto-Refresh Settings

```env
REACT_APP_AUTO_REFRESH_INTERVAL=15000
```

- Interval in milliseconds (15000 = 15 seconds)
- Controls how often data refreshes

#### Toast Notifications

```env
REACT_APP_TOAST_DURATION=5000
```

- Duration in milliseconds (5000 = 5 seconds)
- How long notifications stay visible

#### Feature Flags

```env
REACT_APP_ENABLE_AUTO_REFRESH=true
REACT_APP_ENABLE_NOTIFICATIONS=true
```

- Enable/disable features without code changes

#### Debug Mode

```env
REACT_APP_DEBUG=false
```

- Set to `true` for verbose console logging
- Set to `false` in production

### Usage in Code

```javascript
// Access environment variables
const apiUrl = process.env.REACT_APP_API_URL;
const isDebug = process.env.REACT_APP_DEBUG === "true";
const refreshInterval = parseInt(process.env.REACT_APP_AUTO_REFRESH_INTERVAL);

// Example
if (process.env.REACT_APP_DEBUG === "true") {
  console.log("Debug mode enabled");
}
```

## Backend Configuration

### Location

```
backend/.env
```

### Variables

#### Database Configuration

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/Hospitalmanagement
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres@123
```

- PostgreSQL connection details
- **IMPORTANT**: Change password in production!

#### Server Configuration

```env
SERVER_PORT=8080
```

- Port where backend runs
- Default: 8080

#### JPA/Hibernate Configuration

```env
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=true
SPRING_JPA_FORMAT_SQL=true
```

**DDL Auto Options:**

- `create` - Drop and recreate tables (DANGER: loses data!)
- `create-drop` - Create on start, drop on shutdown
- `update` - Update schema without losing data (recommended for dev)
- `validate` - Only validate schema (recommended for production)
- `none` - Do nothing

**Show SQL:**

- `true` - Log all SQL queries (good for debugging)
- `false` - No SQL logging (better for production)

#### Logging Configuration

```env
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_APP=DEBUG
```

**Log Levels:**

- `TRACE` - Most verbose
- `DEBUG` - Detailed debugging info
- `INFO` - General information
- `WARN` - Warning messages
- `ERROR` - Error messages only

#### CORS Configuration

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

- Comma-separated list of allowed frontend URLs
- Add production URL when deploying

#### Security Configuration

```env
JWT_SECRET=your-secret-key-change-this-in-production-min-256-bits
JWT_EXPIRATION=86400000
BCRYPT_STRENGTH=10
```

**JWT Settings:**

- `JWT_SECRET` - Secret key for token signing (CHANGE IN PRODUCTION!)
- `JWT_EXPIRATION` - Token expiration in milliseconds (86400000 = 24 hours)
- `BCRYPT_STRENGTH` - Password hashing strength (10 = good balance)

#### File Upload Configuration

```env
MAX_FILE_SIZE=10
MAX_REQUEST_SIZE=10
```

- Maximum file size in MB
- Maximum request size in MB

### Usage in application.properties

```properties
# Use environment variable with fallback
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/Hospitalmanagement}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:postgres}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:postgres@123}
```

**Syntax:** `${ENV_VAR:default_value}`

- Tries to read from environment variable
- Falls back to default value if not set

## Setup Instructions

### For New Developers

#### 1. Clone Repository

```bash
git clone <repository-url>
cd hospital-management
```

#### 2. Setup Frontend

```bash
cd frontend/app

# Copy example file
copy .env.example .env

# Edit .env with your settings
notepad .env

# Install dependencies
npm install
```

#### 3. Setup Backend

```bash
cd backend

# Copy example file
copy .env.example .env

# Edit .env with your database credentials
notepad .env

# Build project
mvn clean install
```

#### 4. Start Application

```bash
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend/app
npm start
```

## Environment-Specific Configurations

### Development Environment

```env
# Frontend
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENV=development
REACT_APP_DEBUG=true

# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/Hospitalmanagement
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=true
LOGGING_LEVEL_ROOT=DEBUG
```

### Production Environment

```env
# Frontend
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
REACT_APP_DEBUG=false

# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://prod-server:5432/hospital_prod
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false
LOGGING_LEVEL_ROOT=WARN
JWT_SECRET=very-long-secure-production-secret-key
```

### Testing Environment

```env
# Frontend
REACT_APP_API_URL=http://localhost:8081
REACT_APP_ENV=test

# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/hospital_test
SPRING_JPA_HIBERNATE_DDL_AUTO=create-drop
SERVER_PORT=8081
```

## Security Best Practices

### ⚠️ NEVER Commit .env Files

```bash
# .gitignore should include:
.env
.env.local
.env.*.local
```

### ✅ DO Commit .env.example Files

```bash
# Safe to commit (no secrets):
.env.example
```

### 🔒 Protect Sensitive Data

**Never put these in code:**

- Database passwords
- JWT secrets
- API keys
- Private keys
- Access tokens

**Always use environment variables!**

### 🔐 Production Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (min 256 bits)
- [ ] Set `SPRING_JPA_SHOW_SQL=false`
- [ ] Set `SPRING_JPA_HIBERNATE_DDL_AUTO=validate`
- [ ] Use HTTPS for API URL
- [ ] Restrict CORS origins
- [ ] Enable rate limiting
- [ ] Use secure database connection

## Troubleshooting

### Frontend: Environment Variables Not Working

**Problem:** Changes to .env not reflected

**Solutions:**

1. **Restart development server**

   ```bash
   # Stop (Ctrl+C)
   npm start
   ```

2. **Clear cache**

   ```bash
   npm start -- --reset-cache
   ```

3. **Check variable name**
   - Must start with `REACT_APP_`
   - Example: `REACT_APP_API_URL` ✓
   - Example: `API_URL` ✗

### Backend: Environment Variables Not Working

**Problem:** .env values not loaded

**Solutions:**

1. **Check file location**

   - Must be in `backend/.env`
   - Not in `backend/src/.env`

2. **Restart application**

   ```bash
   mvn spring-boot:run
   ```

3. **Check syntax**
   - No spaces around `=`
   - Example: `PORT=8080` ✓
   - Example: `PORT = 8080` ✗

### Common Issues

#### Issue 1: "Cannot connect to database"

```
Check: SPRING_DATASOURCE_URL
Check: SPRING_DATASOURCE_USERNAME
Check: SPRING_DATASOURCE_PASSWORD
```

#### Issue 2: "CORS error"

```
Check: CORS_ALLOWED_ORIGINS includes your frontend URL
Example: http://localhost:3000
```

#### Issue 3: "API not found"

```
Check: REACT_APP_API_URL points to correct backend
Check: Backend is running on specified port
```

## Loading .env Files

### Frontend (React)

React automatically loads `.env` files using `dotenv` (built-in with Create React App).

**Load order:**

1. `.env.local` (highest priority)
2. `.env.development` or `.env.production`
3. `.env`

### Backend (Spring Boot)

Spring Boot loads environment variables automatically.

**Load order:**

1. System environment variables
2. `.env` file (via spring-dotenv dependency)
3. `application.properties` defaults

## Verification

### Check Frontend Variables

```javascript
// Add to any component temporarily
console.log("API URL:", process.env.REACT_APP_API_URL);
console.log("Environment:", process.env.REACT_APP_ENV);
console.log("Debug:", process.env.REACT_APP_DEBUG);
```

### Check Backend Variables

```java
// Add to any service temporarily
@Value("${SPRING_DATASOURCE_URL}")
private String dbUrl;

System.out.println("Database URL: " + dbUrl);
```

## Migration from Hardcoded Values

### Before (Hardcoded)

```javascript
// Frontend
const API_URL = "http://localhost:8080/api";

// Backend
spring.datasource.url=jdbc:postgresql://localhost:5432/Hospitalmanagement
```

### After (Environment Variables)

```javascript
// Frontend
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Backend
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/Hospitalmanagement}
```

## Benefits

### For Developers

- ✅ Easy local configuration
- ✅ No code changes needed
- ✅ Each developer can have different settings
- ✅ Quick environment switching

### For Deployment

- ✅ Same code for all environments
- ✅ Configure via environment variables
- ✅ No code changes for deployment
- ✅ Secure credential management

### For Security

- ✅ Secrets not in code
- ✅ Secrets not in Git
- ✅ Easy to rotate credentials
- ✅ Different secrets per environment

## Quick Reference

### Frontend Variables

| Variable                        | Default               | Description           |
| ------------------------------- | --------------------- | --------------------- |
| REACT_APP_API_URL               | http://localhost:8080 | Backend API URL       |
| REACT_APP_ENV                   | development           | Environment name      |
| REACT_APP_AUTO_REFRESH_INTERVAL | 15000                 | Refresh interval (ms) |
| REACT_APP_DEBUG                 | false                 | Debug mode            |

### Backend Variables

| Variable                      | Default               | Description       |
| ----------------------------- | --------------------- | ----------------- |
| SPRING_DATASOURCE_URL         | jdbc:postgresql://... | Database URL      |
| SPRING_DATASOURCE_USERNAME    | postgres              | Database user     |
| SPRING_DATASOURCE_PASSWORD    | postgres@123          | Database password |
| SERVER_PORT                   | 8080                  | Server port       |
| SPRING_JPA_HIBERNATE_DDL_AUTO | update                | Schema management |

## Next Steps

1. ✅ Copy `.env.example` to `.env`
2. ✅ Update values in `.env` with your settings
3. ✅ Add `.env` to `.gitignore` (already done)
4. ✅ Restart both frontend and backend
5. ✅ Verify configuration works

## Support

If you have issues:

1. Check `.env` file exists in correct location
2. Verify variable names are correct
3. Restart application after changes
4. Check console for error messages
5. Verify `.gitignore` includes `.env`

## Conclusion

Environment variables are now properly configured for both frontend and backend. This provides:

- Secure credential management
- Easy environment switching
- Better team collaboration
- Production-ready configuration

Remember to:

- ⚠️ NEVER commit `.env` files
- ✅ ALWAYS commit `.env.example` files
- 🔒 Keep production secrets secure
- 🔄 Restart after .env changes
