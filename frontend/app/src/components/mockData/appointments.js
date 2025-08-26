// Patient-specific appointments - showing appointments for a specific patient
export const patientAppointments = [
  {
    id: 1,
    patientName: "John Smith",
    age: 34,
    gender: "Male",
    contact: "+91 9876543210",
    doctor: "Dr. Meena Kapoor",
    department: "Cardiology",
    appointmentDate: "2025-09-05",
    appointmentTime: "10:30 AM",
    status: "Scheduled",
    reason: "Follow-up for chest pain and irregular heartbeat",
    issueDays: 3,
    bookedOn: "2025-08-26",
    appointmentId: "APT001",
  },
  {
    id: 2,
    patientName: "John Smith",
    age: 34,
    gender: "Male",
    contact: "+91 9876543210",
    doctor: "Dr. Rajesh Kumar",
    department: "Dermatology",
    appointmentDate: "2025-08-25",
    appointmentTime: "02:00 PM",
    status: "Completed",
    reason: "Skin rash on arms and face",
    issueDays: 7,
    bookedOn: "2025-08-20",
    appointmentId: "APT002",
    prescriptionGiven: true,
  },
  {
    id: 3,
    patientName: "John Smith",
    age: 34,
    gender: "Male",
    contact: "+91 9876543210",
    doctor: "Dr. Neha Bhatia",
    department: "General Medicine",
    appointmentDate: "2025-08-15",
    appointmentTime: "11:00 AM",
    status: "Completed",
    reason: "Annual health checkup and blood work",
    issueDays: 1,
    bookedOn: "2025-08-10",
    appointmentId: "APT003",
    prescriptionGiven: false,
    testResults: "Normal",
  },
  {
    id: 4,
    patientName: "John Smith",
    age: 34,
    gender: "Male",
    contact: "+91 9876543210",
    doctor: "Dr. Sneha Iyer",
    department: "Neurology",
    appointmentDate: "2025-09-12",
    appointmentTime: "09:30 AM",
    status: "Scheduled",
    reason: "Persistent headaches and dizziness",
    issueDays: 14,
    bookedOn: "2025-08-26",
    appointmentId: "APT004",
  },
  {
    id: 5,
    patientName: "John Smith",
    age: 34,
    gender: "Male",
    contact: "+91 9876543210",
    doctor: "Dr. Amitabh Singh",
    department: "Orthopedics",
    appointmentDate: "2025-07-20",
    appointmentTime: "03:15 PM",
    status: "Cancelled",
    reason: "Lower back pain after exercise",
    issueDays: 5,
    bookedOn: "2025-07-15",
    appointmentId: "APT005",
    cancellationReason: "Patient recovered",
  },
  {
    id: 6,
    patientName: "John Smith",
    age: 34,
    gender: "Male",
    contact: "+91 9876543210",
    doctor: "Dr. Priya Sharma",
    department: "ENT",
    appointmentDate: "2025-09-18",
    appointmentTime: "04:30 PM",
    status: "Scheduled",
    reason: "Ear infection and hearing issues",
    issueDays: 4,
    bookedOn: "2025-08-26",
    appointmentId: "APT006",
  },
  {
    id: 7,
    patientName: "John Smith",
    age: 34,
    gender: "Male",
    contact: "+91 9876543210",
    doctor: "Dr. Anita Gupta",
    department: "Ophthalmology",
    appointmentDate: "2025-08-10",
    appointmentTime: "01:00 PM",
    status: "Completed",
    reason: "Eye strain and blurred vision",
    issueDays: 21,
    bookedOn: "2025-08-05",
    appointmentId: "APT007",
    prescriptionGiven: true,
    followUpRequired: true,
    followUpDate: "2025-09-10",
  },
  {
    id: 8,
    patientName: "John Smith",
    age: 34,
    gender: "Male",
    contact: "+91 9876543210",
    doctor: "Dr. Vikram Rao",
    department: "General Medicine",
    appointmentDate: "2025-09-25",
    appointmentTime: "10:00 AM",
    status: "Scheduled",
    reason: "Flu symptoms and fever",
    issueDays: 2,
    bookedOn: "2025-08-26",
    appointmentId: "APT008",
  },
];

// Sample appointments for different patients (for variety)
export const allPatientAppointments = [
  ...patientAppointments,
  {
    id: 9,
    patientName: "Sarah Johnson",
    age: 28,
    gender: "Female",
    contact: "+91 9988776655",
    doctor: "Dr. Kavita Reddy",
    department: "Gynecology",
    appointmentDate: "2025-09-03",
    appointmentTime: "11:30 AM",
    status: "Scheduled",
    reason: "Routine gynecological checkup",
    issueDays: 1,
    bookedOn: "2025-08-25",
    appointmentId: "APT009",
  },
  {
    id: 10,
    patientName: "Michael Brown",
    age: 45,
    gender: "Male",
    contact: "+91 9123456789",
    doctor: "Dr. Deepak Joshi",
    department: "Cardiology",
    appointmentDate: "2025-09-07",
    appointmentTime: "02:30 PM",
    status: "Scheduled",
    reason: "High blood pressure monitoring",
    issueDays: 30,
    bookedOn: "2025-08-24",
    appointmentId: "APT010",
  },
  {
    id: 11,
    patientName: "Emily Davis",
    age: 32,
    gender: "Female",
    contact: "+91 9012345678",
    doctor: "Dr. Suresh Patel",
    department: "Pediatrics",
    appointmentDate: "2025-09-01",
    appointmentTime: "09:00 AM",
    status: "Completed",
    reason: "Child vaccination and checkup",
    issueDays: 1,
    bookedOn: "2025-08-20",
    appointmentId: "APT011",
    prescriptionGiven: false,
    notes: "Vaccination completed successfully",
  },
];

// Helper functions for patient dashboard
export const getPatientAppointments = (patientName = "John Smith") => {
  return patientAppointments.filter((apt) => apt.patientName === patientName);
};

export const getUpcomingAppointments = (patientName = "John Smith") => {
  const today = new Date();
  return patientAppointments
    .filter(
      (apt) =>
        apt.patientName === patientName &&
        apt.status === "Scheduled" &&
        new Date(apt.appointmentDate) >= today
    )
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
};

export const getPastAppointments = (patientName = "John Smith") => {
  const today = new Date();
  return patientAppointments
    .filter(
      (apt) =>
        apt.patientName === patientName &&
        (apt.status === "Completed" || apt.status === "Cancelled")
    )
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
};

export const getAppointmentsByStatus = (status, patientName = "John Smith") => {
  return patientAppointments.filter(
    (apt) => apt.patientName === patientName && apt.status === status
  );
};

export const getAppointmentById = (id) => {
  return patientAppointments.find((apt) => apt.id === id);
};

// Statistics for patient dashboard
export const getPatientStats = (patientName = "John Smith") => {
  const appointments = getPatientAppointments(patientName);

  return {
    total: appointments.length,
    scheduled: appointments.filter((apt) => apt.status === "Scheduled").length,
    completed: appointments.filter((apt) => apt.status === "Completed").length,
    cancelled: appointments.filter((apt) => apt.status === "Cancelled").length,
    withPrescription: appointments.filter((apt) => apt.prescriptionGiven)
      .length,
    followUpRequired: appointments.filter((apt) => apt.followUpRequired).length,
  };
};
