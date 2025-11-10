# Prescription View Fix - Empty Fields Issue

## Problem

After a doctor prescribes medication to a patient, both the doctor and patient were unable to view the prescription properly. The prescription view showed empty fields instead of the actual prescription data.

## Root Cause

The issue was caused by **lazy loading** in the JPA entity relationships:

1. **PrescriptionEntity** has a `@OneToMany` relationship with `Medicine`
2. **Medicine** has a `@ManyToOne` relationship with `PrescriptionEntity`
3. The `Medicine` list was using default `FetchType.LAZY` loading
4. When the prescription was serialized to JSON for the API response, the medicines list wasn't loaded, resulting in empty data

## Solution

### Backend Changes

#### 1. Changed Fetch Type to EAGER in PrescriptionEntity.java

**File**: `backend/src/main/java/com/hospitalmanagement/backend/model/PrescriptionEntity.java`

**Before**:

```java
@OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Medicine> medicines = new ArrayList<>();
```

**After**:

```java
@OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
private List<Medicine> medicines = new ArrayList<>();
```

**Why**: This ensures that when a prescription is loaded, all its medicines are loaded immediately, not lazily.

#### 2. Added @JsonIgnore to Medicine.java

**File**: `backend/src/main/java/com/hospitalmanagement/backend/model/Medicine.java`

**Before**:

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "prescription_id")
private PrescriptionEntity prescription;
```

**After**:

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "prescription_id")
@com.fasterxml.jackson.annotation.JsonIgnore
private PrescriptionEntity prescription;
```

**Why**: This prevents circular reference issues when serializing to JSON. Without this, Jackson would try to serialize:

- Prescription → Medicines → Prescription → Medicines → ... (infinite loop)

## How It Works Now

### 1. Doctor Creates Prescription

```
Doctor fills prescription form
  ↓
Frontend sends prescription data to backend
  ↓
Backend saves prescription with medicines
  ↓
Medicines are properly linked to prescription
  ↓
Response includes full prescription with medicines
```

### 2. Patient/Doctor Views Prescription

```
User clicks "View Prescription"
  ↓
Frontend requests prescription from backend
  ↓
Backend loads prescription with EAGER fetch
  ↓
All medicines are loaded immediately
  ↓
JSON response includes complete data
  ↓
Frontend displays all prescription details
```

## What Was Fixed

### Before Fix

- ✗ Prescription view showed empty medicine fields
- ✗ Diagnosis and symptoms were missing
- ✗ Additional notes weren't displayed
- ✗ Medicine list was empty or undefined

### After Fix

- ✓ All prescription fields display correctly
- ✓ Medicine list shows all prescribed medications
- ✓ Diagnosis and symptoms are visible
- ✓ Additional notes appear properly
- ✓ Follow-up dates are shown
- ✓ Doctor and patient information is complete

## Technical Details

### Fetch Types in JPA

**LAZY (Default)**:

- Data is loaded only when accessed
- Good for performance when you don't always need related data
- Can cause issues with JSON serialization

**EAGER**:

- Data is loaded immediately with the parent entity
- Ensures all data is available
- Better for cases where you always need the related data

### Why EAGER for Medicines?

- Prescriptions are always viewed with their medicines
- The medicine list is essential data, not optional
- The number of medicines per prescription is small (typically 1-10)
- Performance impact is minimal

### Why @JsonIgnore on Medicine.prescription?

- Prevents circular reference during JSON serialization
- Medicine doesn't need to include its parent prescription in the response
- The prescription already contains the medicines list

## Testing

### Test Scenario 1: Create and View Prescription

1. Login as Doctor
2. Select a patient with scheduled appointment
3. Click "Prescribe"
4. Fill in:
   - Diagnosis: "Common Cold"
   - Symptoms: "Fever, Cough"
   - Add medicine: "Paracetamol 500mg, Twice daily, 5 days"
5. Save prescription
6. View the prescription
7. **Expected**: All fields should be populated

### Test Scenario 2: Patient Views Prescription

1. Login as Patient
2. Go to completed appointments
3. Click "View Prescription" on an appointment
4. **Expected**: Full prescription details with all medicines

### Test Scenario 3: Multiple Medicines

1. Create prescription with 3+ medicines
2. View prescription
3. **Expected**: All medicines should be listed with complete details

## Files Modified

### Backend

1. `backend/src/main/java/com/hospitalmanagement/backend/model/PrescriptionEntity.java`

   - Added `fetch = FetchType.EAGER` to medicines relationship

2. `backend/src/main/java/com/hospitalmanagement/backend/model/Medicine.java`
   - Added `@JsonIgnore` to prescription field

### Frontend

No changes required - the frontend code was already correct.

## Verification

To verify the fix is working:

1. **Check Backend Logs**:

   ```
   Received prescription request:
   Patient: [Patient Name]
   Doctor: [Doctor Name]
   Medicines count: [Number]
   ```

2. **Check API Response**:

   ```json
   {
     "id": "uuid",
     "patientName": "John Doe",
     "doctorName": "Dr. Smith",
     "diagnosis": "Common Cold",
     "symptoms": "Fever, Cough",
     "medicines": [
       {
         "id": "uuid",
         "medicineName": "Paracetamol",
         "dosage": "500mg",
         "frequency": "Twice daily",
         "duration": "5 days",
         "instruction": "Take with food",
         "quantity": "10 tablets"
       }
     ],
     "additionalNotes": "Rest and drink plenty of fluids",
     "followUpDate": "2025-11-15",
     "createdDate": "2025-11-10"
   }
   ```

3. **Check Frontend Display**:
   - All fields should be populated
   - No "undefined" or "null" values
   - Medicine cards should show complete information

## Performance Considerations

### Impact of EAGER Loading

- **Positive**: Eliminates lazy loading issues
- **Positive**: Reduces number of database queries
- **Minimal Impact**: Medicine count per prescription is small
- **Trade-off**: Slightly more memory usage (negligible)

### When to Use LAZY vs EAGER

- **Use EAGER**: When you always need the related data (like medicines in prescriptions)
- **Use LAZY**: When related data is optional or rarely needed

## Conclusion

The prescription viewing issue has been resolved by:

1. Changing the fetch type from LAZY to EAGER for medicines
2. Adding @JsonIgnore to prevent circular references
3. Ensuring proper JSON serialization

Both doctors and patients can now view complete prescription details including all medicines, diagnosis, symptoms, and additional notes.
