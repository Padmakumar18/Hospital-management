// Mock data for admin dashboard
export const users = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@citycare.com",
    role: "Doctor",
    department: "Dermatology",
    specialization: "Skin Disorders",
    phone: "+91 9876543210",
    status: "Active",
    joinDate: "2023-01-15",
    lastLogin: "2025-08-28T10:30:00Z",
    experience: "8 years",
    qualification: "MBBS, MD Dermatology",
    licenseNumber: "DOC001",
  },
  {
    id: 2,
    name: "Dr. Meena Kapoor",
    email: "meena.kapoor@citycare.com",
    role: "Doctor",
    department: "Cardiology",
    specialization: "Heart Diseases",
    phone: "+91 9876543211",
    status: "Active",
    joinDate: "2022-08-20",
    lastLogin: "2025-08-28T09:15:00Z",
    experience: "12 years",
    qualification: "MBBS, MD Cardiology",
    licenseNumber: "DOC002",
  },
  {
    id: 3,
    name: "Dr. Neha Bhatia",
    email: "neha.bhatia@citycare.com",
    role: "Doctor",
    department: "General Medicine",
    specialization: "Internal Medicine",
    phone: "+91 9876543212",
    status: "Active",
    joinDate: "2023-03-10",
    lastLogin: "2025-08-27T16:45:00Z",
    experience: "6 years",
    qualification: "MBBS, MD Internal Medicine",
    licenseNumber: "DOC003",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah.johnson@citycare.com",
    role: "Pharmacist",
    department: "Pharmacy",
    specialization: "Clinical Pharmacy",
    phone: "+91 9876543213",
    status: "Active",
    joinDate: "2023-05-12",
    lastLogin: "2025-08-28T11:20:00Z",
    experience: "4 years",
    qualification: "PharmD",
    licenseNumber: "PHAR001",
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael.brown@citycare.com",
    role: "Pharmacist",
    department: "Pharmacy",
    specialization: "Drug Information",
    phone: "+91 9876543214",
    status: "Active",
    joinDate: "2022-11-08",
    lastLogin: "2025-08-28T08:30:00Z",
    experience: "7 years",
    qualification: "PharmD, RPh",
    licenseNumber: "PHAR002",
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily.davis@citycare.com",
    role: "Nurse",
    department: "Emergency",
    specialization: "Emergency Care",
    phone: "+91 9876543215",
    status: "Active",
    joinDate: "2023-07-01",
    lastLogin: "2025-08-28T07:45:00Z",
    experience: "5 years",
    qualification: "BSN, RN",
    licenseNumber: "NUR001",
  },
  {
    id: 7,
    name: "David Wilson",
    email: "david.wilson@citycare.com",
    role: "Receptionist",
    department: "Front Desk",
    specialization: "Patient Registration",
    phone: "+91 9876543216",
    status: "Active",
    joinDate: "2023-09-15",
    lastLogin: "2025-08-28T12:00:00Z",
    experience: "2 years",
    qualification: "Diploma in Hospital Administration",
    licenseNumber: "REC001",
  },
  {
    id: 8,
    name: "Dr. Anita Gupta",
    email: "anita.gupta@citycare.com",
    role: "Doctor",
    department: "Ophthalmology",
    specialization: "Eye Care",
    phone: "+91 9876543217",
    status: "Inactive",
    joinDate: "2022-04-18",
    lastLogin: "2025-08-20T14:30:00Z",
    experience: "10 years",
    qualification: "MBBS, MS Ophthalmology",
    licenseNumber: "DOC004",
  },
];

export const departments = [
  {
    id: 1,
    name: "Cardiology",
    head: "Dr. Meena Kapoor",
    totalStaff: 8,
    totalDoctors: 3,
    description: "Heart and cardiovascular diseases treatment",
    established: "2020-01-01",
  },
  {
    id: 2,
    name: "Dermatology",
    head: "Dr. Rajesh Kumar",
    totalStaff: 5,
    totalDoctors: 2,
    description: "Skin, hair, and nail disorders treatment",
    established: "2020-03-15",
  },
  {
    id: 3,
    name: "General Medicine",
    head: "Dr. Neha Bhatia",
    totalStaff: 12,
    totalDoctors: 4,
    description: "General healthcare and internal medicine",
    established: "2020-01-01",
  },
  {
    id: 4,
    name: "Ophthalmology",
    head: "Dr. Anita Gupta",
    totalStaff: 6,
    totalDoctors: 2,
    description: "Eye care and vision treatment",
    established: "2020-06-01",
  },
  {
    id: 5,
    name: "Pharmacy",
    head: "Sarah Johnson",
    totalStaff: 4,
    totalDoctors: 0,
    description: "Medicine dispensing and pharmaceutical care",
    established: "2020-01-01",
  },
  {
    id: 6,
    name: "Emergency",
    head: "Dr. Robert Smith",
    totalStaff: 15,
    totalDoctors: 5,
    description: "24/7 emergency medical services",
    established: "2020-01-01",
  },
];

export const systemStats = {
  totalUsers: users.length,
  activeUsers: users.filter((u) => u.status === "Active").length,
  totalDoctors: users.filter((u) => u.role === "Doctor").length,
  totalPharmacists: users.filter((u) => u.role === "Pharmacist").length,
  totalNurses: users.filter((u) => u.role === "Nurse").length,
  totalDepartments: departments.length,
  totalAppointments: 156,
  totalPrescriptions: 89,
  totalRevenue: 15420.5,
};

export const recentActivities = [
  {
    id: 1,
    type: "user_added",
    message: "New doctor Dr. Neha Bhatia added to General Medicine",
    timestamp: "2025-08-28T10:30:00Z",
    user: "Admin",
  },
  {
    id: 2,
    type: "role_changed",
    message: "User role updated for Emily Davis from Nurse to Senior Nurse",
    timestamp: "2025-08-28T09:15:00Z",
    user: "Admin",
  },
  {
    id: 3,
    type: "department_updated",
    message: "Cardiology department information updated",
    timestamp: "2025-08-27T16:45:00Z",
    user: "Admin",
  },
  {
    id: 4,
    type: "user_deactivated",
    message: "User Dr. Anita Gupta deactivated",
    timestamp: "2025-08-27T14:20:00Z",
    user: "Admin",
  },
  {
    id: 5,
    type: "system_backup",
    message: "System backup completed successfully",
    timestamp: "2025-08-27T02:00:00Z",
    user: "System",
  },
];

export const roles = [
  {
    id: 1,
    name: "Doctor",
    permissions: [
      "view_patients",
      "create_prescription",
      "update_appointment",
      "view_reports",
    ],
    description: "Medical practitioners who can diagnose and treat patients",
  },
  {
    id: 2,
    name: "Pharmacist",
    permissions: [
      "view_prescriptions",
      "dispense_medicine",
      "generate_bills",
      "manage_inventory",
    ],
    description: "Pharmacy staff who dispense medications and manage inventory",
  },
  {
    id: 3,
    name: "Nurse",
    permissions: ["view_patients", "update_patient_records", "assist_doctor"],
    description: "Nursing staff who provide patient care and assistance",
  },
  {
    id: 4,
    name: "Receptionist",
    permissions: [
      "book_appointments",
      "view_appointments",
      "manage_patient_registration",
    ],
    description:
      "Front desk staff who handle appointments and patient registration",
  },
  {
    id: 5,
    name: "Admin",
    permissions: [
      "full_access",
      "user_management",
      "system_settings",
      "reports",
    ],
    description: "System administrators with full access to all features",
  },
];

// Helper functions
export const getUsersByRole = (role) => {
  return users.filter((user) => user.role === role);
};

export const getUsersByDepartment = (department) => {
  return users.filter((user) => user.department === department);
};

export const getActiveUsers = () => {
  return users.filter((user) => user.status === "Active");
};

export const getInactiveUsers = () => {
  return users.filter((user) => user.status === "Inactive");
};

export const getDepartmentStats = () => {
  return departments.map((dept) => ({
    ...dept,
    activeStaff: users.filter(
      (u) => u.department === dept.name && u.status === "Active"
    ).length,
  }));
};

export const getRecentUsers = (limit = 5) => {
  return users
    .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
    .slice(0, limit);
};

export const getUserStats = () => {
  const roleStats = {};
  users.forEach((user) => {
    roleStats[user.role] = (roleStats[user.role] || 0) + 1;
  });
  return roleStats;
};
