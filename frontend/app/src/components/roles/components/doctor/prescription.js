import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPrescriptionByPatientId } from "../../../mockData/Prescription";

const PrescriptionForm = ({ patient, onClose, onSave }) => {
  const [prescriptionData, setPrescriptionData] = useState({
    patientId: patient?.id || "",
    patientName: patient?.patientName || "",
    age: patient?.age || "",
    gender: patient?.gender || "",
    diagnosis: "",
    symptoms: "",
    medicines: [
      {
        id: 1,
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
        quantity: "",
      },
    ],
    additionalNotes: "",
    followUpDate: "",
    doctorName: "Dr. [Doctor Name]",
    prescriptionDate: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (patient && patient.status === "Completed") {
      const existingPrescription = getPrescriptionByPatientId(patient.id);
      if (existingPrescription) {
        setPrescriptionData(existingPrescription);
        setIsEditMode(true);
      }
    }
  }, [patient]);

  const frequencyOptions = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
    "Before meals",
    "After meals",
    "At bedtime",
  ];

  const durationOptions = [
    "3 days",
    "5 days",
    "7 days",
    "10 days",
    "14 days",
    "21 days",
    "1 month",
    "2 months",
    "3 months",
    "Until finished",
    "As directed",
  ];

  const handleInputChange = (field, value) => {
    setPrescriptionData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = prescriptionData.medicines.map((medicine, i) =>
      i === index ? { ...medicine, [field]: value } : medicine
    );

    setPrescriptionData((prev) => ({
      ...prev,
      medicines: updatedMedicines,
    }));

    const errorKey = `medicine_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  const addMedicine = () => {
    const newMedicine = {
      id: prescriptionData.medicines.length + 1,
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      quantity: "",
    };

    setPrescriptionData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, newMedicine],
    }));
  };

  const removeMedicine = (index) => {
    if (prescriptionData.medicines.length > 1) {
      const updatedMedicines = prescriptionData.medicines.filter(
        (_, i) => i !== index
      );
      setPrescriptionData((prev) => ({
        ...prev,
        medicines: updatedMedicines,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!prescriptionData.diagnosis.trim()) {
      newErrors.diagnosis = "Diagnosis is required";
    }

    if (!prescriptionData.symptoms.trim()) {
      newErrors.symptoms = "Symptoms are required";
    }

    prescriptionData.medicines.forEach((medicine, index) => {
      if (!medicine.medicineName.trim()) {
        newErrors[`medicine_${index}_medicineName`] =
          "Medicine name is required";
      }
      if (!medicine.dosage.trim()) {
        newErrors[`medicine_${index}_dosage`] = "Dosage is required";
      }
      if (!medicine.frequency) {
        newErrors[`medicine_${index}_frequency`] = "Frequency is required";
      }
      if (!medicine.duration) {
        newErrors[`medicine_${index}_duration`] = "Duration is required";
      }
      if (!medicine.quantity.trim()) {
        newErrors[`medicine_${index}_quantity`] = "Quantity is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(prescriptionData);
      console.log("Prescription saved:", prescriptionData);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const medicineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                📋 {isEditMode ? "Edit Prescription" : "Prescription Form"}
              </h2>
              <p className="text-blue-100 mt-1">
                {isEditMode
                  ? "View/Edit prescription for"
                  : "Create prescription for"}{" "}
                {patient?.patientName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 transition-colors p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Information */}
            <div
              className={`p-4 rounded-lg ${
                isEditMode ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  👤 Patient Information
                </h3>
                {isEditMode && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    📅 Originally prescribed:{" "}
                    {new Date(
                      prescriptionData.prescriptionDate
                    ).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={prescriptionData.patientName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    value={prescriptionData.age}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <input
                    type="text"
                    value={prescriptionData.gender}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🩺 Diagnosis *
                </label>
                <textarea
                  value={prescriptionData.diagnosis}
                  onChange={(e) =>
                    handleInputChange("diagnosis", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.diagnosis ? "border-red-500" : "border-gray-300"
                  }`}
                  rows="3"
                  placeholder="Enter diagnosis..."
                />
                {errors.diagnosis && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.diagnosis}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🤒 Symptoms *
                </label>
                <textarea
                  value={prescriptionData.symptoms}
                  onChange={(e) =>
                    handleInputChange("symptoms", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.symptoms ? "border-red-500" : "border-gray-300"
                  }`}
                  rows="3"
                  placeholder="Enter symptoms..."
                />
                {errors.symptoms && (
                  <p className="text-red-500 text-xs mt-1">{errors.symptoms}</p>
                )}
              </div>
            </div>

            {/* Medicines Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  💊 Prescribed Medicines
                </h3>
                <button
                  type="button"
                  onClick={addMedicine}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Add Medicine</span>
                </button>
              </div>

              <AnimatePresence>
                {prescriptionData.medicines.map((medicine, index) => (
                  <motion.div
                    key={medicine.id}
                    variants={medicineVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">
                        Medicine #{index + 1}
                      </h4>
                      {prescriptionData.medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicine(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Medicine Name *
                        </label>
                        <input
                          type="text"
                          value={medicine.medicineName}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "medicineName",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors[`medicine_${index}_medicineName`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="e.g., Paracetamol"
                        />
                        {errors[`medicine_${index}_medicineName`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`medicine_${index}_medicineName`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dosage *
                        </label>
                        <input
                          type="text"
                          value={medicine.dosage}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "dosage",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors[`medicine_${index}_dosage`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="e.g., 500mg"
                        />
                        {errors[`medicine_${index}_dosage`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`medicine_${index}_dosage`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity *
                        </label>
                        <input
                          type="text"
                          value={medicine.quantity}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors[`medicine_${index}_quantity`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="e.g., 10 tablets"
                        />
                        {errors[`medicine_${index}_quantity`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`medicine_${index}_quantity`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frequency *
                        </label>
                        <select
                          value={medicine.frequency}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "frequency",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors[`medicine_${index}_frequency`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select frequency</option>
                          {frequencyOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {errors[`medicine_${index}_frequency`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`medicine_${index}_frequency`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration *
                        </label>
                        <select
                          value={medicine.duration}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors[`medicine_${index}_duration`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select duration</option>
                          {durationOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {errors[`medicine_${index}_duration`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`medicine_${index}_duration`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Instructions
                        </label>
                        <input
                          type="text"
                          value={medicine.instructions}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "instructions",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="e.g., Take with food"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📝 Additional Notes
                </label>
                <textarea
                  value={prescriptionData.additionalNotes}
                  onChange={(e) =>
                    handleInputChange("additionalNotes", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows="3"
                  placeholder="Any additional instructions or notes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📅 Follow-up Date
                </label>
                <input
                  type="date"
                  value={prescriptionData.followUpDate}
                  onChange={(e) =>
                    handleInputChange("followUpDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                <span>
                  {isEditMode ? "Update Prescription" : "Save Prescription"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PrescriptionForm;
