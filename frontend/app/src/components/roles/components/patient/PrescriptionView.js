import React from "react";
import { motion } from "framer-motion";

const PrescriptionView = ({ prescription, onClose }) => {
  if (!prescription) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Medical Prescription</h2>
              <p className="text-blue-100">
                Prescription ID: {prescription.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
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

        <div className="p-6">
          {/* Doctor and Patient Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Prescribed by
              </h3>
              <p className="text-lg font-medium text-blue-600">
                {prescription.doctorName}
              </p>
              <p className="text-sm text-gray-600">
                {prescription.doctorSpecialty}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Patient</h3>
              <p className="text-lg font-medium">{prescription.patientName}</p>
              <p className="text-sm text-gray-600">
                Age: {prescription.patientAge}
              </p>
            </div>
          </div>

          {/* Prescription Details */}
          <div className="mb-6">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Date Prescribed:
                </span>
                <p className="text-gray-800">{formatDate(prescription.date)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Status:
                </span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    prescription.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {prescription.status}
                </span>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          {prescription.diagnosis && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Diagnosis</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-gray-800">{prescription.diagnosis}</p>
              </div>
            </div>
          )}

          {/* Medications */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Prescribed Medications
            </h3>
            <div className="space-y-4">
              {prescription.medicines.map((medicine, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-lg text-gray-800">
                      {medicine.name}
                    </h4>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                      {medicine.type}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Dosage:</span>
                      <p className="text-gray-800">{medicine.dosage}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Frequency:
                      </span>
                      <p className="text-gray-800">{medicine.frequency}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Duration:
                      </span>
                      <p className="text-gray-800">{medicine.duration}</p>
                    </div>
                  </div>

                  {medicine.instructions && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="font-medium text-gray-600">
                        Instructions:
                      </span>
                      <p className="text-gray-800 mt-1">
                        {medicine.instructions}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Additional Instructions */}
          {prescription.instructions && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">
                Additional Instructions
              </h3>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <p className="text-gray-800">{prescription.instructions}</p>
              </div>
            </div>
          )}

          {/* Follow-up */}
          {prescription.followUp && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Follow-up</h3>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <p className="text-gray-800">{prescription.followUp}</p>
              </div>
            </div>
          )}

          {/* Important Notes */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-400 mt-0.5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="font-medium text-red-800 mb-1">Important</h4>
                <p className="text-sm text-red-700">
                  Please follow the prescribed dosage and timing. Contact your
                  doctor if you experience any adverse effects or have questions
                  about your medication.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              This prescription is valid and should be followed as directed.
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PrescriptionView;
