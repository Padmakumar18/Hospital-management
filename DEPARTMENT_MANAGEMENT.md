# Department Management

## Overview

Simple department management system for hospital administration.

## Features

- ✅ Create new departments
- ✅ Edit existing departments
- ✅ Delete departments
- ✅ Toggle active/inactive status
- ✅ View all departments in a grid layout

## How to Use

### Access Department Management

1. Login as Admin
2. Navigate to Admin Dashboard
3. Click on "🏥 Departments" tab

### Add a Department

1. Click "Add Department" button
2. Fill in:
   - **Department Name** (Required): e.g., "Cardiology", "Neurology"
   - **Description** (Optional): Brief description of the department
   - **Active**: Check if department is operational
3. Click "Create"

### Edit a Department

1. Find the department card
2. Click "Edit" button
3. Update any field
4. Click "Update"

### Delete a Department

1. Find the department card
2. Click "Delete" button
3. Confirm deletion

## Department Fields

| Field       | Required | Description                                     |
| ----------- | -------- | ----------------------------------------------- |
| Name        | Yes      | Name of the department (e.g., Cardiology)       |
| Description | No       | Brief description of what the department does   |
| Active      | No       | Whether the department is currently operational |

## Examples

### Cardiology Department

```
Name: Cardiology
Description: Heart and cardiovascular care
Active: ✓ Yes
```

### Neurology Department

```
Name: Neurology
Description: Brain and nervous system disorders
Active: ✓ Yes
```

### Pediatrics Department

```
Name: Pediatrics
Description: Medical care for children
Active: ✓ Yes
```

## Technical Details

### Backend Model

```java
@Entity
@Table(name = "departments")
public class Department {
    private UUID id;
    private String name;
    private String description;
    private boolean active;
}
```

### API Endpoints

- `POST /api/departments` - Create department
- `GET /api/departments` - Get all departments
- `GET /api/departments/active` - Get active departments
- `GET /api/departments/{id}` - Get by ID
- `PUT /api/departments/{id}` - Update department
- `DELETE /api/departments/{id}` - Delete department

## Files

### Frontend

- `frontend/app/src/components/roles/components/admin/DepartmentManagement.js` - Main UI component
- `frontend/app/src/services/departmentAPI.js` - API service

### Backend

- `backend/src/main/java/com/hospitalmanagement/backend/model/Department.java` - Model
- `backend/src/main/java/com/hospitalmanagement/backend/controller/DepartmentController.java` - Controller
