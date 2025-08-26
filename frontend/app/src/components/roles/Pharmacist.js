import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  pharmacyPatients,
  getPharmacyStats,
} from "../mockData/pharmacistMockdata";

const Pharmacist = () => {
  const [patients, setPatients] = useState(pharmacyPatients);
  const [activeTab, setActiveTab] = useState("pending");
  const [stats, setStats] = useState({});
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const pharmacyStats = getPharmacyStats();
    setStats(pharmacyStats);
  }, [patients]);

  const getFilteredPatients = () => {
    let filtered = [];
    switch (activeTab) {
      case "pending":
        filtered = patients.filter((p) => p.status === "Pending");
        break;
      case "dispensed":
        filtered = patients.filter((p) => p.status === "Dispensed");
        break;
      case "all":
        filtered = patients;
        break;
      default:
        filtered = patients;
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.appointmentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const handleDispenseMedicine = (patientId) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: "Dispensed" } : p))
    );
    toast.success("Medicine dispensed successfully!", {
      duration: 3000,
      position: "top-right",
    });
  };

  const handleGenerateBill = (patient) => {
    const billId = `BILL${String(Date.now()).slice(-6)}`;
    const billDate = new Date().toISOString().split("T")[0];

    setPatients((prev) =>
      prev.map((p) =>
        p.id === patient.id
          ? {
              ...p,
              billGenerated: true,
              billId: billId,
              billDate: billDate,
            }
          : p
      )
    );

    toast.success(`Bill ${billId} generated successfully!`, {
      duration: 4000,
      position: "top-right",
    });
    setShowBillModal(false);
  };

  const handleViewPrescription = (patient) => {
    setSelectedPatient(patient);
    setShowPrescriptionModal(true);
  };

  const handleViewBill = (patient) => {
    setSelectedPatient(patient);
    setShowBillModal(true);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Dispensed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container-fluid min-h-screen bg-gray-50">
      <Toaster />

      {/* Header */}
      <div className="pharmacist-header flex items-center justify-between bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold">
            Hello, <span className="font-light">Pharmacist</span>
          </h1>
        </div>

        <div className="text-center flex-1">
          <h2 className="text-2xl font-extrabold tracking-wide drop-shadow-md">
            💊 CityCare Pharmacy
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="bg-white text-green-600 px-4 py-1 rounded-lg shadow-md text-sm font-semibold hover:bg-green-100 transition cursor-pointer">
            Profile
          </button>
          <button className="bg-white text-red-600 px-4 py-1 rounded-lg shadow-md text-sm font-semibold hover:bg-red-100 transition cursor-pointer">
            Sign out
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <motion.div
            className="bg-blue-500 text-white rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Prescriptions</p>
                <p className="text-2xl font-bold">{stats.total || 0}</p>
              </div>
              <div className="text-blue-200">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-yellow-500 text-white rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pending</p>
                <p className="text-2xl font-bold">{stats.pending || 0}</p>
              </div>
              <div className="text-yellow-200">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-green-500 text-white rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Dispensed</p>
                <p className="text-2xl font-bold">{stats.dispensed || 0}</p>
              </div>
              <div className="text-green-200">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-purple-500 text-white rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Billed</p>
                <p className="text-2xl font-bold">{stats.billed || 0}</p>
              </div>
              <div className="text-purple-200">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-indigo-500 text-white rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue || 0}</p>
              </div>
              <div className="text-indigo-200">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
            <h2 className="text-xl font-bold text-gray-800">
              💊 Patient Prescriptions
            </h2>

            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by patient name or appointment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full md:w-80"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab("dispensed")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "dispensed"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Dispensed
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "all"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
              </div>
            </div>
          </div>

          {/* Patient Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredPatients().map((patient) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">
                    {patient.patientName}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                      patient.status
                    )}`}
                  >
                    {patient.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Age:</span> {patient.age}
                  </p>
                  <p>
                    <span className="font-medium">Doctor:</span>{" "}
                    {patient.doctor}
                  </p>
                  <p>
                    <span className="font-medium">Department:</span>{" "}
                    {patient.department}
                  </p>
                  <p>
                    <span className="font-medium">Appointment ID:</span>{" "}
                    {patient.appointmentId}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(patient.appointmentDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Total Amount:</span> $
                    {patient.prescription.finalAmount}
                  </p>
                  {patient.billGenerated && (
                    <p>
                      <span className="font-medium">Bill ID:</span>{" "}
                      {patient.billId}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                  <button
                    onClick={() => handleViewPrescription(patient)}
                    className="w-full bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center space-x-1"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>View Prescription</span>
                  </button>

                  {patient.status === "Pending" && (
                    <button
                      onClick={() => handleDispenseMedicine(patient.id)}
                      className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center justify-center space-x-1"
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Dispense Medicine</span>
                    </button>
                  )}

                  {patient.status === "Dispensed" && !patient.billGenerated && (
                    <button
                      onClick={() => handleViewBill(patient)}
                      className="w-full bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm flex items-center justify-center space-x-1"
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
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>Generate Bill</span>
                    </button>
                  )}

                  {patient.billGenerated && (
                    <button
                      onClick={() => handleViewBill(patient)}
                      className="w-full bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center justify-center space-x-1"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>View Bill</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Prescription Modal */}
        <AnimatePresence>
          {showPrescriptionModal && selectedPatient && (
            <PrescriptionModal
              patient={selectedPatient}
              onClose={() => setShowPrescriptionModal(false)}
            />
          )}
        </AnimatePresence>

        {/* Bill Modal */}
        <AnimatePresence>
          {showBillModal && selectedPatient && (
            <BillModal
              patient={selectedPatient}
              onClose={() => setShowBillModal(false)}
              onGenerateBill={handleGenerateBill}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Prescription Modal Component
const PrescriptionModal = ({ patient, onClose }) => {
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
        <div className="bg-green-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Prescription Details</h2>
              <p className="text-green-100">Patient: {patient.patientName}</p>
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
          {/* Patient Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Patient Information
              </h3>
              <p className="text-lg font-medium">{patient.patientName}</p>
              <p className="text-sm text-gray-600">
                Age: {patient.age} | {patient.gender}
              </p>
              <p className="text-sm text-gray-600">
                Contact: {patient.contact}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Appointment Details
              </h3>
              <p className="text-sm text-gray-600">
                ID: {patient.appointmentId}
              </p>
              <p className="text-sm text-gray-600">Doctor: {patient.doctor}</p>
              <p className="text-sm text-gray-600">
                Department: {patient.department}
              </p>
              <p className="text-sm text-gray-600">
                Date: {new Date(patient.appointmentDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Diagnosis</h3>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-gray-800">{patient.prescription.diagnosis}</p>
            </div>
          </div>

          {/* Medications */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Prescribed Medications
            </h3>
            <div className="space-y-4">
              {patient.prescription.medicines.map((medicine, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-lg text-gray-800">
                      {medicine.name}
                    </h4>
                    <div className="text-right">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        {medicine.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-medium text-gray-600">Type:</span>
                      <p className="text-gray-800">{medicine.type}</p>
                    </div>
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

                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">
                        Quantity:
                      </span>
                      <p className="text-gray-800">{medicine.quantity}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Unit Price:
                      </span>
                      <p className="text-gray-800">${medicine.unitPrice}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Total:</span>
                      <p className="text-gray-800 font-semibold">
                        ${medicine.totalPrice}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Batch:</span>
                      <p className="text-gray-800">{medicine.batchNo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-bold text-green-600">
                ${patient.prescription.finalAmount}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Bill Modal Component
const BillModal = ({ patient, onClose, onGenerateBill }) => {
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
        <div className="bg-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {patient.billGenerated ? "Bill Details" : "Generate Bill"}
              </h2>
              <p className="text-purple-100">Patient: {patient.patientName}</p>
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
          {/* Bill Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              CityCare Pharmacy
            </h3>
            <p className="text-gray-600">Medical Bill</p>
            {patient.billGenerated && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Bill ID: {patient.billId}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(patient.billDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Patient Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Bill To:</h4>
              <p className="font-medium">{patient.patientName}</p>
              <p className="text-sm text-gray-600">Age: {patient.age}</p>
              <p className="text-sm text-gray-600">
                Contact: {patient.contact}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Prescription Details:
              </h4>
              <p className="text-sm text-gray-600">
                Appointment ID: {patient.appointmentId}
              </p>
              <p className="text-sm text-gray-600">Doctor: {patient.doctor}</p>
              <p className="text-sm text-gray-600">
                Date: {new Date(patient.appointmentDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Medicine Items */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">Items</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Medicine
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Qty
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Unit Price
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patient.prescription.medicines.map((medicine, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        <div>
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-sm text-gray-600">
                            {medicine.type} - {medicine.dosage}
                          </p>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {medicine.quantity}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        ${medicine.unitPrice}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                        ${medicine.totalPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${patient.prescription.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${patient.prescription.tax}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total Amount:</span>
                <span className="text-purple-600">
                  ${patient.prescription.finalAmount}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            {!patient.billGenerated ? (
              <button
                onClick={() => onGenerateBill(patient)}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Generate Bill
              </button>
            ) : (
              <button
                onClick={() => toast.success("Bill printed successfully!")}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Print Bill
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Pharmacist;
