// Mock data for pharmacist dashboard
export const pharmacyPatients = [
  {
    id: 1,
    patientName: "John Smith",
    age: 34,
    gender: "Male",
    contact: "+91 9876543210",
    appointmentId: "APT002",
    appointmentDate: "2025-08-25",
    doctor: "Dr. Rajesh Kumar",
    department: "Dermatology",
    prescriptionId: 9,
    status: "Pending", // Pending, Dispensed, Billed
    billGenerated: false,
    prescription: {
      diagnosis: "Allergic Contact Dermatitis",
      medicines: [
        {
          id: 1,
          name: "Cetirizine",
          type: "Antihistamine",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "7 days",
          quantity: 7,
          unitPrice: 5.5,
          totalPrice: 38.5,
          inStock: true,
          batchNo: "CTZ001",
          expiryDate: "2026-12-31",
        },
        {
          id: 2,
          name: "Hydrocortisone Cream",
          type: "Topical Steroid",
          dosage: "1%",
          frequency: "Twice daily",
          duration: "10 days",
          quantity: 1,
          unitPrice: 12.75,
          totalPrice: 12.75,
          inStock: true,
          batchNo: "HYD002",
          expiryDate: "2026-08-15",
        },
      ],
      totalAmount: 51.25,
      tax: 5.13,
      finalAmount: 56.38,
    },
  },
  {
    id: 2,
    patientName: "John Smith",
    age: 34,
    gender: "Male",
    contact: "+91 9876543210",
    appointmentId: "APT007",
    appointmentDate: "2025-08-10",
    doctor: "Dr. Anita Gupta",
    department: "Ophthalmology",
    prescriptionId: 10,
    status: "Dispensed",
    billGenerated: true,
    billId: "BILL001",
    billDate: "2025-08-10",
    prescription: {
      diagnosis: "Refractive Error - Myopia",
      medicines: [
        {
          id: 1,
          name: "Artificial Tears",
          type: "Eye Drops",
          dosage: "1-2 drops",
          frequency: "4 times daily",
          duration: "2 weeks",
          quantity: 2,
          unitPrice: 8.25,
          totalPrice: 16.5,
          inStock: true,
          batchNo: "ART003",
          expiryDate: "2026-06-30",
        },
        {
          id: 2,
          name: "Vitamin A",
          type: "Supplement",
          dosage: "5000 IU",
          frequency: "Once daily",
          duration: "1 month",
          quantity: 30,
          unitPrice: 0.75,
          totalPrice: 22.5,
          inStock: true,
          batchNo: "VIT004",
          expiryDate: "2027-03-15",
        },
      ],
      totalAmount: 39.0,
      tax: 3.9,
      finalAmount: 42.9,
    },
  },
  {
    id: 3,
    patientName: "Priya Nair",
    age: 28,
    gender: "Female",
    contact: "+91 9988776655",
    appointmentId: "APT015",
    appointmentDate: "2025-08-28",
    doctor: "Dr. Rajesh Kumar",
    department: "Dermatology",
    prescriptionId: 1,
    status: "Pending",
    billGenerated: false,
    prescription: {
      diagnosis: "Allergic Contact Dermatitis",
      medicines: [
        {
          id: 1,
          name: "Cetirizine",
          type: "Antihistamine",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "7 days",
          quantity: 7,
          unitPrice: 5.5,
          totalPrice: 38.5,
          inStock: true,
          batchNo: "CTZ001",
          expiryDate: "2026-12-31",
        },
        {
          id: 2,
          name: "Hydrocortisone Cream",
          type: "Topical Steroid",
          dosage: "1%",
          frequency: "Twice daily",
          duration: "10 days",
          quantity: 1,
          unitPrice: 12.75,
          totalPrice: 12.75,
          inStock: true,
          batchNo: "HYD002",
          expiryDate: "2026-08-15",
        },
        {
          id: 3,
          name: "Calamine Lotion",
          type: "Topical Solution",
          dosage: "100ml",
          frequency: "Three times daily",
          duration: "7 days",
          quantity: 1,
          unitPrice: 6.25,
          totalPrice: 6.25,
          inStock: true,
          batchNo: "CAL005",
          expiryDate: "2026-10-20",
        },
      ],
      totalAmount: 57.5,
      tax: 5.75,
      finalAmount: 63.25,
    },
  },
  {
    id: 4,
    patientName: "Anita Gupta",
    age: 42,
    gender: "Female",
    contact: "+91 9123456789",
    appointmentId: "APT016",
    appointmentDate: "2025-08-25",
    doctor: "Dr. Meena Kapoor",
    department: "Cardiology",
    prescriptionId: 2,
    status: "Dispensed",
    billGenerated: true,
    billId: "BILL002",
    billDate: "2025-08-25",
    prescription: {
      diagnosis: "Hypertension Stage 1",
      medicines: [
        {
          id: 1,
          name: "Amlodipine",
          type: "Antihypertensive",
          dosage: "5mg",
          frequency: "Once daily",
          duration: "1 month",
          quantity: 30,
          unitPrice: 2.25,
          totalPrice: 67.5,
          inStock: true,
          batchNo: "AML006",
          expiryDate: "2027-01-10",
        },
        {
          id: 2,
          name: "Aspirin",
          type: "Antiplatelet",
          dosage: "75mg",
          frequency: "Once daily",
          duration: "1 month",
          quantity: 30,
          unitPrice: 0.85,
          totalPrice: 25.5,
          inStock: true,
          batchNo: "ASP007",
          expiryDate: "2026-11-25",
        },
      ],
      totalAmount: 93.0,
      tax: 9.3,
      finalAmount: 102.3,
    },
  },
  {
    id: 5,
    patientName: "Suresh Patel",
    age: 58,
    gender: "Male",
    contact: "+91 9876543210",
    appointmentId: "APT017",
    appointmentDate: "2025-08-20",
    doctor: "Dr. Neha Bhatia",
    department: "Endocrinology",
    prescriptionId: 3,
    status: "Pending",
    billGenerated: false,
    prescription: {
      diagnosis: "Type 2 Diabetes Mellitus",
      medicines: [
        {
          id: 1,
          name: "Metformin",
          type: "Antidiabetic",
          dosage: "500mg",
          frequency: "Twice daily",
          duration: "3 months",
          quantity: 180,
          unitPrice: 0.45,
          totalPrice: 81.0,
          inStock: true,
          batchNo: "MET008",
          expiryDate: "2026-09-30",
        },
        {
          id: 2,
          name: "Glimepiride",
          type: "Antidiabetic",
          dosage: "2mg",
          frequency: "Once daily",
          duration: "3 months",
          quantity: 90,
          unitPrice: 1.15,
          totalPrice: 103.5,
          inStock: true,
          batchNo: "GLI009",
          expiryDate: "2026-12-15",
        },
        {
          id: 3,
          name: "Vitamin B12",
          type: "Supplement",
          dosage: "1500mcg",
          frequency: "Once daily",
          duration: "3 months",
          quantity: 90,
          unitPrice: 0.95,
          totalPrice: 85.5,
          inStock: true,
          batchNo: "VIT010",
          expiryDate: "2027-05-20",
        },
      ],
      totalAmount: 270.0,
      tax: 27.0,
      finalAmount: 297.0,
    },
  },
];

// Helper functions for pharmacist dashboard
export const getPendingPrescriptions = () => {
  return pharmacyPatients.filter((patient) => patient.status === "Pending");
};

export const getDispensedPrescriptions = () => {
  return pharmacyPatients.filter((patient) => patient.status === "Dispensed");
};

export const getBilledPrescriptions = () => {
  return pharmacyPatients.filter((patient) => patient.billGenerated === true);
};

export const getPatientById = (id) => {
  return pharmacyPatients.find((patient) => patient.id === id);
};

export const getPatientsByName = (name) => {
  return pharmacyPatients.filter((patient) =>
    patient.patientName.toLowerCase().includes(name.toLowerCase())
  );
};

export const getPharmacyStats = () => {
  const total = pharmacyPatients.length;
  const pending = getPendingPrescriptions().length;
  const dispensed = getDispensedPrescriptions().length;
  const billed = getBilledPrescriptions().length;

  const totalRevenue = pharmacyPatients
    .filter((p) => p.billGenerated)
    .reduce((sum, p) => sum + p.prescription.finalAmount, 0);

  return {
    total,
    pending,
    dispensed,
    billed,
    totalRevenue: totalRevenue.toFixed(2),
  };
};
