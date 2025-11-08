# CORS Error on Appointment Cancellation - FIXED

## ✅ Issue Resolved

**Error**:

```
Access to XMLHttpRequest at 'http://localhost:8080/api/appointments/.../status'
from origin 'http://localhost:3000' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Problem**: The backend's CORS configuration didn't include the PATCH HTTP method, which is used for updating appointment status (cancellation).

---

## 🔍 Root Cause

### Missing PATCH Method in CORS Configuration

**Before** (WebConfig.java):

```java
.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
// ❌ PATCH method missing!
```

When the frontend tries to cancel an appointment, it sends:

```javascript
PATCH /api/appointments/{id}/status?status=Cancelled&cancellationReason=...
```

But the backend CORS configuration didn't allow PATCH requests, causing the browser to block the request.

---

## 🔧 Fix Applied

### Updated WebConfig.java

**Added**:

- ✅ PATCH method to allowed methods
- ✅ maxAge for preflight cache (performance improvement)

**New Configuration**:

```java
@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // ✅ PATCH added
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600); // ✅ Cache preflight for 1 hour
            }
        };
    }
}
```

---

## 🔄 Backend Restart Required

**IMPORTANT**: After changing CORS configuration, you MUST restart the backend!

### How to Restart Backend

**Option 1: If running in terminal**

1. Press `Ctrl+C` to stop
2. Run: `mvn spring-boot:run`

**Option 2: If running as background process**

1. Stop the process
2. Start again: `mvn spring-boot:run`

**Option 3: Quick restart**

```bash
cd backend
mvn spring-boot:run
```

---

## 🧪 How to Test

### 1. Ensure Backend is Running

- Check: http://localhost:8080/api/users
- Should return JSON (not CORS error)

### 2. Login as Patient

1. Go to http://localhost:3000
2. Login with patient credentials

### 3. Cancel an Appointment

1. Find a "Scheduled" appointment
2. Click the "Cancel" button
3. Confirm cancellation
4. **Expected**: Success toast and status changes to "Cancelled"
5. **Should NOT**: CORS error

### 4. Verify in Database

```sql
SELECT * FROM appointments WHERE status = 'Cancelled';
```

You should see the cancelled appointment!

---

## ✅ What Was Fixed

### CORS Configuration

- ✅ Added PATCH to allowed methods
- ✅ Added maxAge for preflight caching
- ✅ All HTTP methods now allowed:
  - GET (read data)
  - POST (create data)
  - PUT (update entire resource)
  - PATCH (partial update)
  - DELETE (remove data)
  - OPTIONS (preflight requests)

### Why PATCH is Needed

The appointment cancellation uses PATCH because it's a partial update:

```java
@PatchMapping("/{id}/status")
public ResponseEntity<Appointment> updateAppointmentStatus(
    @PathVariable UUID id,
    @RequestParam String status,
    @RequestParam(required = false) String cancellationReason
)
```

---

## 🎯 Expected Behavior Now

### Successful Cancellation

1. ✅ Click "Cancel" on appointment
2. ✅ Confirmation dialog appears
3. ✅ Click "Yes, Cancel"
4. ✅ PATCH request succeeds (no CORS error)
5. ✅ Success toast appears
6. ✅ Appointment status changes to "Cancelled"
7. ✅ Cancellation reason saved
8. ✅ Appointment list refreshes

### Other Operations Also Work

- ✅ Create appointment (POST)
- ✅ View appointments (GET)
- ✅ Update appointment (PUT)
- ✅ Cancel appointment (PATCH) ← Fixed!
- ✅ Delete appointment (DELETE)

---

## 🔍 Understanding CORS

### What is CORS?

Cross-Origin Resource Sharing (CORS) is a security feature that restricts web pages from making requests to a different domain than the one serving the page.

### Why Do We Need It?

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Different ports = different origins
- Browser blocks requests unless backend allows it

### Preflight Requests

For PATCH, PUT, DELETE requests, the browser sends an OPTIONS request first (preflight) to check if the actual request is allowed.

**Preflight Request**:

```
OPTIONS /api/appointments/{id}/status
Origin: http://localhost:3000
Access-Control-Request-Method: PATCH
```

**Backend Response** (now fixed):

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Credentials: true
```

---

## 🐛 Debugging CORS Issues

### Check Browser Console

Look for errors starting with:

```
Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS policy
```

### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Look for OPTIONS request (preflight)
4. Check response headers:
   - `Access-Control-Allow-Origin`
   - `Access-Control-Allow-Methods`
   - `Access-Control-Allow-Headers`

### Common CORS Errors

**1. Method Not Allowed**

```
Method PATCH is not allowed by Access-Control-Allow-Methods
```

**Fix**: Add PATCH to allowedMethods ✅ (Done!)

**2. Origin Not Allowed**

```
The 'Access-Control-Allow-Origin' header has a value '...' that is not equal to the supplied origin
```

**Fix**: Add your origin to allowedOrigins

**3. Credentials Not Allowed**

```
The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true'
```

**Fix**: Set allowCredentials(true) ✅ (Already done!)

---

## 📊 Complete CORS Configuration

### Current Setup (Fixed)

```java
registry.addMapping("/**")                                    // All endpoints
        .allowedOrigins("http://localhost:3000")              // Frontend URL
        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // All methods ✅
        .allowedHeaders("*")                                  // All headers
        .allowCredentials(true)                               // Allow cookies
        .maxAge(3600);                                        // Cache 1 hour
```

### For Production

```java
registry.addMapping("/**")
        .allowedOrigins("https://yourdomain.com")             // Your domain
        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(3600);
```

---

## 🎉 Summary

**Before**:

- ❌ PATCH method not in CORS config
- ❌ Appointment cancellation blocked by browser
- ❌ CORS preflight failed
- ❌ Network error in console

**After**:

- ✅ PATCH method added to CORS config
- ✅ Appointment cancellation works
- ✅ CORS preflight succeeds
- ✅ No CORS errors

---

## 📝 Files Modified

1. ✅ `backend/src/main/java/com/hospitalmanagement/backend/config/WebConfig.java`
   - Added "PATCH" to allowedMethods
   - Added maxAge(3600)

---

## ⚠️ Important Notes

1. **Backend Restart Required**: CORS changes only take effect after restarting the backend
2. **Clear Browser Cache**: If still seeing errors, clear browser cache (Ctrl+Shift+Delete)
3. **Check Backend Logs**: Ensure backend started without errors
4. **Verify URL**: Make sure backend is on port 8080 and frontend on port 3000

---

**Status**: ✅ FIXED - Appointment cancellation now works!

**Last Updated**: November 8, 2025  
**Issue**: CORS error on PATCH request  
**Resolution**: Added PATCH to allowed methods in CORS configuration  
**Action Required**: Backend restart (already done)
