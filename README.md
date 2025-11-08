# Hospital Management System

A comprehensive full-stack hospital management system built with Spring Boot (Backend) and React (Frontend).

## Features

### Role-Based Access Control

- **Doctor**: Manage appointments, create prescriptions, view patient history
- **Patient**: Book appointments, view prescriptions, track medical history
- **Pharmacist**: Manage and dispense prescriptions
- **Admin**: User management, department oversight, system settings

### Core Functionality

- User authentication and authorization
- Appointment scheduling and management
- Prescription creation and tracking
- Medicine inventory management
- Real-time notifications
- Responsive UI with animations

## Tech Stack

### Backend

- **Framework**: Spring Boot 3.5.5
- **Language**: Java 24
- **Database**: PostgreSQL
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven

### Frontend

- **Framework**: React 19.1.1
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **UI Libraries**:
  - Framer Motion (animations)
  - Recharts (data visualization)
  - React Hot Toast (notifications)
  - Tailwind CSS (styling)
- **HTTP Client**: Axios

## Prerequisites

- Java 17 or higher (Java 21 recommended)
- Node.js 18+ and npm
- PostgreSQL 12+
- Maven 3.6+

## Database Setup

1. Install PostgreSQL and create a database:

```sql
CREATE DATABASE Hospitalmanagement;
CREATE USER postgres WITH PASSWORD 'postgres@123';
GRANT ALL PRIVILEGES ON DATABASE Hospitalmanagement TO postgres;
```

2. The application will automatically create tables on first run using Hibernate's `ddl-auto=update` setting.

## Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Update database credentials in `src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/Hospitalmanagement
spring.datasource.username=postgres
spring.datasource.password=postgres@123
```

3. Build and run the application:

```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

## Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend/app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Default Test Users

After first run, you can create users through the signup page with the following roles:

- Doctor
- Patient
- Pharmacist
- Admin

## API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Appointments

- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/patient/{patientId}` - Get patient appointments
- `GET /api/appointments/doctor/{doctorId}` - Get doctor appointments
- `PUT /api/appointments/{id}` - Update appointment
- `PATCH /api/appointments/{id}/status` - Update appointment status

### Prescriptions

- `GET /api/prescriptions` - Get all prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions/patient/{patientId}` - Get patient prescriptions
- `GET /api/prescriptions/doctor/{doctorId}` - Get doctor prescriptions
- `PUT /api/prescriptions/{id}` - Update prescription

### Users

- `GET /api/users` - Get all users
- `GET /api/users/{email}` - Get user by email
- `GET /api/users/role/{role}` - Get users by role
- `PUT /api/users/{email}` - Update user
- `DELETE /api/users/{email}` - Delete user

## Project Structure

```
hospital-management-system/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/hospitalmanagement/backend/
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── model/           # Entity models
│   │   │   │   ├── repository/      # JPA repositories
│   │   │   │   ├── service/         # Business logic
│   │   │   │   └── BackendApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
└── frontend/
    └── app/
        ├── public/
        ├── src/
        │   ├── components/
        │   │   ├── roles/           # Role-specific components
        │   │   │   ├── Admin.js
        │   │   │   ├── Doctor.js
        │   │   │   ├── Patient.js
        │   │   │   ├── Pharmacist.js
        │   │   │   └── components/  # Sub-components
        │   │   ├── services/        # API services
        │   │   ├── Auth.js
        │   │   ├── Header.js
        │   │   └── Home.js
        │   ├── Redux/               # State management
        │   │   ├── slice.js
        │   │   └── store.js
        │   ├── services/
        │   │   └── api.js           # API client
        │   ├── App.js
        │   └── index.js
        └── package.json
```

## Features by Role

### Doctor Dashboard

- View all appointments (scheduled, completed, cancelled)
- Filter appointments by status
- Create prescriptions for patients
- View patient age distribution analytics
- Update appointment status

### Patient Dashboard

- Book new appointments
- View appointment history
- Cancel scheduled appointments
- View prescriptions
- Track follow-up appointments

### Pharmacist Dashboard

- View all prescriptions
- Filter by status (pending/dispensed)
- Dispense medicines
- Track prescription history

### Admin Dashboard

- User management (CRUD operations)
- Department overview
- Role and permission management
- System statistics
- Activity monitoring

## Development

### Running Tests

```bash
# Backend
cd backend
mvn test

# Frontend
cd frontend/app
npm test
```

### Building for Production

Backend:

```bash
cd backend
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

Frontend:

```bash
cd frontend/app
npm run build
```

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify database credentials in `application.properties`
- Check if the database exists

### CORS Issues

- Backend CORS is configured for `http://localhost:3000`
- Update `WebConfig.java` if using different ports

### Port Conflicts

- Backend default: 8080
- Frontend default: 3000
- Change ports in respective configuration files if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
