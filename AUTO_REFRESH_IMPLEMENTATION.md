# Auto-Refresh Implementation

## Overview

Implemented automatic data refresh every 10 seconds for all user role pages (Admin, Doctor, Patient, Pharmacist) without showing loading indicators during background updates.

## Features

### ✅ Smart Loading States

- **Initial Load**: Shows full loading screen when page first loads
- **Manual Refresh**: Shows loading when user manually refreshes
- **Auto-Refresh**: Updates data silently in background every 10 seconds without flickering

### ✅ No Flickering Effect

- Data updates happen seamlessly in the background
- UI remains stable and responsive
- No visual interruption for users

### ✅ Real-Time Data Sync

- Appointments automatically appear when patients book them
- Doctors see new appointments without refreshing
- Pharmacists see new prescriptions immediately
- Admin sees all updates across the system

## Implementation Details

### Custom Hook: `useAutoRefresh`

Location: `frontend/app/src/hooks/useAutoRefresh.js`

```javascript
useAutoRefresh(refreshFunction, interval, enabled, dependencies);
```

**Parameters:**

- `refreshFunction`: Function to call for data refresh
- `interval`: Refresh interval in milliseconds (default: 10000ms = 10 seconds)
- `enabled`: Whether auto-refresh is enabled (default: true)
- `dependencies`: Additional dependencies to trigger refresh

**Features:**

- Skips auto-refresh on initial mount
- Cleans up intervals properly on unmount
- Supports manual refresh with loading indicator
- Prevents memory leaks

### Updated Pages

#### 1. Admin Dashboard (`Admin.js`)

- Auto-refreshes: Users, Appointments, Prescriptions, Pending Approvals
- Updates all statistics cards automatically
- Shows new pending user approvals in real-time

#### 2. Doctor Dashboard (`Doctor.js`)

- Auto-refreshes: Doctor's appointments
- Updates patient cards automatically
- Shows new appointments as they're booked

#### 3. Patient Dashboard (`Patient.js`)

- Auto-refreshes: Patient's appointments
- Updates appointment status automatically
- Shows prescription availability in real-time

#### 4. Pharmacist Dashboard (`Pharmacist.js`)

- Auto-refreshes: All prescriptions
- Updates dispensed status automatically
- Shows new prescriptions as they're created

## How It Works

### 1. Modified Data Loading Functions

Each page's data loading function now accepts a `showLoading` parameter:

```javascript
const loadData = async (showLoading = true) => {
  try {
    if (showLoading) {
      setIsLoading(true);
    }
    // Fetch data...
  } catch (error) {
    if (showLoading) {
      // Show error toast only on manual refresh
    }
  } finally {
    if (showLoading) {
      setIsLoading(false);
    }
  }
};
```

### 2. Initial Load with Loading Screen

```javascript
useEffect(() => {
  loadData(true); // Shows loading screen
}, []);
```

### 3. Auto-Refresh Without Loading

```javascript
useAutoRefresh(loadData, 10000, true);
```

This calls `loadData(false)` every 10 seconds, updating data silently.

## Benefits

### For Users

- ✅ Always see up-to-date information
- ✅ No need to manually refresh the page
- ✅ Smooth, flicker-free experience
- ✅ Loading screen only on initial load

### For System

- ✅ Real-time data synchronization
- ✅ Better user experience
- ✅ Reduced server load (compared to constant polling)
- ✅ Clean, maintainable code

## Use Cases

### Patient Books Appointment

1. Patient books appointment → Data saved to database
2. Doctor's page auto-refreshes within 10 seconds
3. Doctor sees new appointment without manual refresh
4. Admin dashboard updates appointment count

### Doctor Creates Prescription

1. Doctor creates prescription → Data saved to database
2. Pharmacist's page auto-refreshes within 10 seconds
3. Pharmacist sees new prescription without manual refresh
4. Patient can view prescription on their dashboard

### Admin Approves User

1. Admin approves pending user → User status updated
2. Pending approvals count updates automatically
3. User list refreshes to show verified status
4. All statistics update in real-time

## Configuration

### Change Refresh Interval

To change the refresh interval, modify the second parameter:

```javascript
// Refresh every 5 seconds
useAutoRefresh(loadData, 5000, true);

// Refresh every 30 seconds
useAutoRefresh(loadData, 30000, true);
```

### Disable Auto-Refresh

To disable auto-refresh for a specific page:

```javascript
useAutoRefresh(loadData, 10000, false);
```

### Add Dependencies

To trigger refresh when specific values change:

```javascript
useAutoRefresh(loadData, 10000, true, [userId, selectedDate]);
```

## Testing

### Test Scenarios

1. **Initial Load**: Page should show loading screen
2. **Auto-Refresh**: Data should update every 10 seconds without flickering
3. **Manual Refresh**: User actions should show loading indicators
4. **Multiple Tabs**: Each tab should refresh independently
5. **Error Handling**: Errors during auto-refresh should not show toasts

### How to Test

1. Open two browser windows
2. Login as different users (e.g., Patient and Doctor)
3. Patient books appointment
4. Watch Doctor's page update within 10 seconds
5. Verify no loading screen appears during auto-refresh

## Performance Considerations

- Auto-refresh uses minimal resources
- Only active pages refresh (inactive tabs pause)
- Network requests are optimized
- No memory leaks with proper cleanup
- Interval clears on component unmount

## Future Enhancements

Possible improvements:

- WebSocket integration for instant updates
- Adaptive refresh intervals based on activity
- Pause refresh when user is inactive
- Show subtle indicator during background refresh
- Configurable refresh intervals per user preference
