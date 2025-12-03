# Null Boolean Field Fix

## Error

```
java.lang.IllegalArgumentException: Can not set boolean field
com.hospitalmanagement.backend.model.PrescriptionEntity.isEdited to null value
```

## Root Cause

The database had `NULL` values in the `is_edited` column for existing prescriptions, but the Java field was defined as a primitive `boolean` type, which cannot accept `null` values.

## Problem

```java
// Primitive boolean - CANNOT be null
@Column(name = "is_edited")
private boolean isEdited = false;
```

When Hibernate tried to load existing prescriptions with `NULL` in the database, it failed because primitive types can't be null.

## Solution

Changed from primitive `boolean` to wrapper class `Boolean`:

```java
// Boolean wrapper - CAN be null
@Column(name = "is_edited")
private Boolean isEdited = false;
```

## Changes Made

### Before

```java
@Column(name = "is_edited")
private boolean isEdited = false;

public boolean isEdited() {
    return isEdited;
}

public void setEdited(boolean edited) {
    isEdited = edited;
}
```

### After

```java
@Column(name = "is_edited")
private Boolean isEdited = false;

public Boolean getEdited() {
    return isEdited != null ? isEdited : false;
}

public void setEdited(Boolean edited) {
    isEdited = edited;
}
```

## Key Differences

### Primitive boolean

- Cannot be `null`
- Default value: `false`
- Memory: 1 bit
- Use when: Value is always known

### Boolean wrapper

- Can be `null`
- Default value: `null` (unless initialized)
- Memory: ~128 bits (object overhead)
- Use when: Value might be unknown/null

## Why This Fix Works

1. **Handles NULL values**: Existing prescriptions with `NULL` in database can now be loaded
2. **Safe getter**: Returns `false` if value is `null`
3. **Backward compatible**: New prescriptions still default to `false`
4. **No data migration needed**: Works with existing data

## Testing

### Test 1: Load Existing Prescriptions

```
Database: is_edited = NULL
Java: isEdited = null
Getter returns: false
✓ No error
```

### Test 2: Load New Prescriptions

```
Database: is_edited = false
Java: isEdited = false
Getter returns: false
✓ Works correctly
```

### Test 3: Load Edited Prescriptions

```
Database: is_edited = true
Java: isEdited = true
Getter returns: true
✓ Works correctly
```

## Alternative Solutions Considered

### Option 1: Database Migration (Not chosen)

```sql
UPDATE prescriptions
SET is_edited = false
WHERE is_edited IS NULL;

ALTER TABLE prescriptions
ALTER COLUMN is_edited SET DEFAULT false;
```

**Why not**: Requires database changes, more complex

### Option 2: Use Boolean wrapper (Chosen) ✓

```java
private Boolean isEdited = false;
```

**Why yes**: Simple, handles nulls, no migration needed

### Option 3: Custom Hibernate Type (Not chosen)

```java
@Type(type = "yes_no")
private boolean isEdited;
```

**Why not**: Overcomplicated for this use case

## Best Practices

### When to use primitive boolean

```java
// Always has a value
private boolean isActive = true;
private boolean isDeleted = false;
```

### When to use Boolean wrapper

```java
// Might be null (unknown state)
private Boolean isEdited;
private Boolean isVerified;
private Boolean hasConsent;
```

## Impact

### Before Fix

- ❌ Application crashed when loading prescriptions
- ❌ Pharmacist couldn't view prescriptions
- ❌ Error: "Can not set boolean field to null value"

### After Fix

- ✅ Application loads all prescriptions successfully
- ✅ Pharmacist can view all prescriptions
- ✅ NULL values handled gracefully
- ✅ Existing data works without migration

## Verification

To verify the fix works:

1. **Start backend server**
2. **Load prescriptions**: `GET /api/prescriptions`
3. **Check response**: Should return all prescriptions
4. **No errors**: Check logs for no IllegalArgumentException

## Conclusion

Changed `isEdited` from primitive `boolean` to `Boolean` wrapper class to handle NULL values in the database. This allows the application to load existing prescriptions that don't have the `is_edited` field set, while maintaining the same functionality for new and edited prescriptions.

The getter method ensures that NULL values are treated as `false`, providing a safe default behavior.
