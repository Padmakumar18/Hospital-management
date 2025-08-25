export const prescriptions = [
  {
    id: 1,
    patientId: 2,
    patientName: "Priya Nair",
    age: 28,
    gender: "Female",
    diagnosis: "Allergic Contact Dermatitis",
    symptoms:
      "Skin redness, itching, burning sensation on arms and face, mild swelling",
    medicines: [
      {
        id: 1,
        medicineName: "Cetirizine",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "7 days",
        instructions: "Take at bedtime",
        quantity: "7 tablets",
      },
      {
        id: 2,
        medicineName: "Hydrocortisone Cream",
        dosage: "1%",
        frequency: "Twice daily",
        duration: "10 days",
        instructions: "Apply thin layer on affected areas",
        quantity: "1 tube (15g)",
      },
      {
        id: 3,
        medicineName: "Calamine Lotion",
        dosage: "100ml",
        frequency: "Three times daily",
        duration: "7 days",
        instructions: "Apply on affected areas, let dry",
        quantity: "1 bottle",
      },
    ],
    additionalNotes:
      "Avoid contact with known allergens. Use mild, fragrance-free soaps. Keep skin moisturized. Return if symptoms worsen or don't improve in 5 days.",
    followUpDate: "2025-09-05",
    doctorName: "Dr. Rajesh Kumar",
    prescriptionDate: "2025-08-28",
    createdAt: "2025-08-28T11:30:00Z",
  },
  {
    id: 2,
    patientId: 6,
    patientName: "Anita Gupta",
    age: 42,
    gender: "Female",
    diagnosis: "Hypertension Stage 1",
    symptoms:
      "Elevated blood pressure (150/95), occasional headaches, mild fatigue",
    medicines: [
      {
        id: 1,
        medicineName: "Amlodipine",
        dosage: "5mg",
        frequency: "Once daily",
        duration: "1 month",
        instructions: "Take in the morning with food",
        quantity: "30 tablets",
      },
      {
        id: 2,
        medicineName: "Aspirin",
        dosage: "75mg",
        frequency: "Once daily",
        duration: "1 month",
        instructions: "Take after dinner",
        quantity: "30 tablets",
      },
    ],
    additionalNotes:
      "Monitor blood pressure daily. Reduce salt intake. Exercise regularly (30 min walking daily). Avoid smoking and limit alcohol. Weight reduction recommended.",
    followUpDate: "2025-09-28",
    doctorName: "Dr. Meena Kapoor",
    prescriptionDate: "2025-08-25",
    createdAt: "2025-08-25T14:15:00Z",
  },
  {
    id: 3,
    patientId: 7,
    patientName: "Suresh Patel",
    age: 58,
    gender: "Male",
    diagnosis: "Type 2 Diabetes Mellitus",
    symptoms:
      "Increased thirst, frequent urination, fatigue, blurred vision, HbA1c: 8.2%",
    medicines: [
      {
        id: 1,
        medicineName: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "3 months",
        instructions: "Take with meals",
        quantity: "180 tablets",
      },
      {
        id: 2,
        medicineName: "Glimepiride",
        dosage: "2mg",
        frequency: "Once daily",
        duration: "3 months",
        instructions: "Take before breakfast",
        quantity: "90 tablets",
      },
      {
        id: 3,
        medicineName: "Vitamin B12",
        dosage: "1500mcg",
        frequency: "Once daily",
        duration: "3 months",
        instructions: "Take after breakfast",
        quantity: "90 tablets",
      },
    ],
    additionalNotes:
      "Follow diabetic diet strictly. Check blood sugar levels twice daily. Regular exercise essential. Monitor for hypoglycemia symptoms. Foot care important.",
    followUpDate: "2025-11-25",
    doctorName: "Dr. Neha Bhatia",
    prescriptionDate: "2025-08-20",
    createdAt: "2025-08-20T10:45:00Z",
  },
  {
    id: 4,
    patientId: 8,
    patientName: "Deepika Singh",
    age: 24,
    gender: "Female",
    diagnosis: "Acute Upper Respiratory Tract Infection",
    symptoms:
      "Sore throat, runny nose, mild fever (99.8°F), body aches, dry cough",
    medicines: [
      {
        id: 1,
        medicineName: "Paracetamol",
        dosage: "650mg",
        frequency: "Three times daily",
        duration: "5 days",
        instructions: "Take after meals",
        quantity: "15 tablets",
      },
      {
        id: 2,
        medicineName: "Cetirizine",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "5 days",
        instructions: "Take at bedtime",
        quantity: "5 tablets",
      },
      {
        id: 3,
        medicineName: "Dextromethorphan Syrup",
        dosage: "10ml",
        frequency: "Three times daily",
        duration: "7 days",
        instructions: "Take after meals",
        quantity: "1 bottle (100ml)",
      },
      {
        id: 4,
        medicineName: "Vitamin C",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "7 days",
        instructions: "Take with meals",
        quantity: "14 tablets",
      },
    ],
    additionalNotes:
      "Rest adequately. Drink plenty of warm fluids. Gargle with warm salt water 3 times daily. Avoid cold foods and drinks. Return if fever persists beyond 3 days.",
    followUpDate: "2025-09-02",
    doctorName: "Dr. Neha Bhatia",
    prescriptionDate: "2025-08-26",
    createdAt: "2025-08-26T16:20:00Z",
  },
  {
    id: 5,
    patientId: 9,
    patientName: "Rajesh Mehta",
    age: 35,
    gender: "Male",
    diagnosis: "Gastroesophageal Reflux Disease (GERD)",
    symptoms:
      "Heartburn, acid regurgitation, chest pain after meals, difficulty swallowing",
    medicines: [
      {
        id: 1,
        medicineName: "Omeprazole",
        dosage: "20mg",
        frequency: "Once daily",
        duration: "21 days",
        instructions: "Take 30 minutes before breakfast",
        quantity: "21 capsules",
      },
      {
        id: 2,
        medicineName: "Domperidone",
        dosage: "10mg",
        frequency: "Three times daily",
        duration: "14 days",
        instructions: "Take 30 minutes before meals",
        quantity: "42 tablets",
      },
      {
        id: 3,
        medicineName: "Sucralfate Syrup",
        dosage: "10ml",
        frequency: "Four times daily",
        duration: "14 days",
        instructions: "Take 1 hour before meals and at bedtime",
        quantity: "1 bottle (200ml)",
      },
    ],
    additionalNotes:
      "Avoid spicy, oily, and acidic foods. Eat small frequent meals. Don't lie down immediately after eating. Elevate head while sleeping. Avoid smoking and alcohol.",
    followUpDate: "2025-09-18",
    doctorName: "Dr. Amitabh Singh",
    prescriptionDate: "2025-08-24",
    createdAt: "2025-08-24T11:10:00Z",
  },
  {
    id: 6,
    patientId: 10,
    patientName: "Meera Joshi",
    age: 29,
    gender: "Female",
    diagnosis: "Iron Deficiency Anemia",
    symptoms:
      "Fatigue, weakness, pale skin, shortness of breath, cold hands and feet, brittle nails",
    medicines: [
      {
        id: 1,
        medicineName: "Ferrous Sulfate",
        dosage: "325mg",
        frequency: "Twice daily",
        duration: "3 months",
        instructions: "Take on empty stomach with vitamin C",
        quantity: "180 tablets",
      },
      {
        id: 2,
        medicineName: "Vitamin C",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "3 months",
        instructions: "Take with iron tablets",
        quantity: "180 tablets",
      },
      {
        id: 3,
        medicineName: "Folic Acid",
        dosage: "5mg",
        frequency: "Once daily",
        duration: "3 months",
        instructions: "Take after breakfast",
        quantity: "90 tablets",
      },
    ],
    additionalNotes:
      "Include iron-rich foods in diet (spinach, red meat, beans). Avoid tea/coffee with iron tablets. May cause dark stools (normal). Recheck hemoglobin after 6 weeks.",
    followUpDate: "2025-10-10",
    doctorName: "Dr. Sneha Iyer",
    prescriptionDate: "2025-08-22",
    createdAt: "2025-08-22T09:30:00Z",
  },
  {
    id: 7,
    patientId: 11,
    patientName: "Vikram Rao",
    age: 48,
    gender: "Male",
    diagnosis: "Lumbar Disc Herniation",
    symptoms:
      "Lower back pain radiating to left leg, numbness in toes, difficulty walking, pain worsens with sitting",
    medicines: [
      {
        id: 1,
        medicineName: "Diclofenac",
        dosage: "50mg",
        frequency: "Twice daily",
        duration: "10 days",
        instructions: "Take after meals",
        quantity: "20 tablets",
      },
      {
        id: 2,
        medicineName: "Pregabalin",
        dosage: "75mg",
        frequency: "Twice daily",
        duration: "21 days",
        instructions: "Take with or without food",
        quantity: "42 capsules",
      },
      {
        id: 3,
        medicineName: "Thiocolchicoside",
        dosage: "4mg",
        frequency: "Twice daily",
        duration: "7 days",
        instructions: "Take after meals",
        quantity: "14 tablets",
      },
      {
        id: 4,
        medicineName: "Diclofenac Gel",
        dosage: "1%",
        frequency: "Three times daily",
        duration: "14 days",
        instructions: "Apply on affected area, massage gently",
        quantity: "1 tube (30g)",
      },
    ],
    additionalNotes:
      "Bed rest for 2-3 days. Apply hot/cold packs alternately. Physiotherapy recommended after pain subsides. Avoid heavy lifting. Sleep on firm mattress.",
    followUpDate: "2025-09-08",
    doctorName: "Dr. Amitabh Singh",
    prescriptionDate: "2025-08-23",
    createdAt: "2025-08-23T15:45:00Z",
  },
  {
    id: 8,
    patientId: 12,
    patientName: "Kavitha Reddy",
    age: 33,
    gender: "Female",
    diagnosis: "Migraine with Aura",
    symptoms:
      "Severe throbbing headache, visual disturbances, nausea, sensitivity to light and sound",
    medicines: [
      {
        id: 1,
        medicineName: "Sumatriptan",
        dosage: "50mg",
        frequency: "As needed",
        duration: "Until finished",
        instructions: "Take at onset of headache, max 2 doses per day",
        quantity: "6 tablets",
      },
      {
        id: 2,
        medicineName: "Propranolol",
        dosage: "40mg",
        frequency: "Twice daily",
        duration: "3 months",
        instructions: "Take with food",
        quantity: "180 tablets",
      },
      {
        id: 3,
        medicineName: "Domperidone",
        dosage: "10mg",
        frequency: "As needed",
        duration: "Until finished",
        instructions: "Take with sumatriptan if nauseous",
        quantity: "10 tablets",
      },
    ],
    additionalNotes:
      "Maintain headache diary. Identify and avoid triggers. Regular sleep schedule important. Stress management techniques. Dark, quiet room during attacks.",
    followUpDate: "2025-11-23",
    doctorName: "Dr. Sneha Iyer",
    prescriptionDate: "2025-08-21",
    createdAt: "2025-08-21T13:20:00Z",
  },
];

export const getPrescriptionByPatientId = (patientId) => {
  return prescriptions.find(
    (prescription) => prescription.patientId === patientId
  );
};

export const getPrescriptionsByDoctor = (doctorName) => {
  return prescriptions.filter(
    (prescription) => prescription.doctorName === doctorName
  );
};

export const getPrescriptionsByDateRange = (startDate, endDate) => {
  return prescriptions.filter((prescription) => {
    const prescDate = new Date(prescription.prescriptionDate);
    return prescDate >= new Date(startDate) && prescDate <= new Date(endDate);
  });
};
