import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { prescriptionAPI } from "../../services/api";
import useAutoRefresh from "../../hooks/useAutoRefresh";

const Pharmacist = () => {
  const profile = useSelector((state) => state.profile.profile);
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadPrescriptions = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      const response = await prescriptionAPI.getAll();
      console.log("Loaded prescriptions:", response.data);
      setPrescriptions(response.data);
    } catch (error) {
      console.error("Error loading prescriptions:", error);
      if (showLoading) {
        toast.error("Failed to load prescriptions", {
          duration: 5000,
          position: "top-center",
        });
      }
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadPrescriptions(true);
  }, []);

  useEffect(() => {
    filterPrescriptions();
  }, [searchTerm, statusFilter, prescriptions]);

  // Auto-refresh every 15 seconds without showing loading
  useAutoRefresh(loadPrescriptions, 15000, true);

  const filterPrescriptions = () => {
    let filtered = prescriptions;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id?.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.dispensedStatus === statusFilter);
    }

    setFilteredPrescriptions(filtered);
  };

  const handleDispense = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailModal(true);
  };

  const confirmDispense = async () => {
    try {
      const pharmacistName = profile?.name || "Pharmacist";
      await prescriptionAPI.dispense(selectedPrescription.id, pharmacistName);

      toast.success(
        `Prescription dispensed for ${selectedPrescription.patientName}`,
        {
          duration: 5000,
          position: "top-center",
        }
      );

      setShowDetailModal(false);
      await loadPrescriptions(false); // Reload without showing loading
    } catch (error) {
      console.error("Error dispensing prescription:", error);
      toast.error("Failed to dispense prescription", {
        duration: 5000,
        position: "top-center",
      });
    }
  };

  const getStatus = (prescription) => {
    return prescription.dispensedStatus || "Pending";
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Dispensed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const stats = {
    total: prescriptions.length,
    pending: prescriptions.filter((p) => getStatus(p) === "Pending").length,
    dispensed: prescriptions.filter((p) => getStatus(p) === "Dispensed").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          💊 Pharmacy Dashboard
        </h1>
        <p className="text-gray-600">Manage and dispense prescriptions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          className="bg-blue-500 text-white rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Prescriptions</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="text-blue-200">
              <svg
                className="w-10 h-10"
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
          className="bg-yellow-500 text-white rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
            <div className="text-yellow-200">
              <svg
                className="w-10 h-10"
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
          className="bg-green-500 text-white rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Dispensed</p>
              <p className="text-3xl font-bold">{stats.dispensed}</p>
            </div>
            <div className="text-green-200">
              <svg
                className="w-10 h-10"
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
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by patient, doctor, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Dispensed">Dispensed</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Prescriptions</h2>

        {filteredPrescriptions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No prescriptions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Patient
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Doctor
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Diagnosis
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Medicines
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.map((prescription) => (
                  <tr
                    key={prescription.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {prescription.patientName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {prescription.age} yrs, {prescription.gender}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {prescription.doctorName}
                    </td>
                    <td className="p-4 text-gray-600">
                      {prescription.diagnosis}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">
                          {prescription.medicines?.length || 0} items
                        </span>
                        {prescription.edited && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
                            Edited
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${getStatusBadge(
                          getStatus(prescription)
                        )}`}
                      >
                        {getStatus(prescription)}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDispense(prescription)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal - Enhanced Prescription View */}
      <AnimatePresence>
        {showDetailModal && selectedPrescription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-2xl font-bold">
                        💊 Prescription Details
                      </h3>
                      {selectedPrescription.edited && (
                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                          EDITED
                        </span>
                      )}
                    </div>
                    <p className="text-blue-100 text-sm">
                      Prescription ID: {selectedPrescription.id}
                      {selectedPrescription.edited &&
                        selectedPrescription.lastEditedDate && (
                          <span className="ml-2">
                            • Last edited:{" "}
                            {new Date(
                              selectedPrescription.lastEditedDate
                            ).toLocaleDateString()}
                          </span>
                        )}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
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

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Patient & Doctor Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <h4 className="font-semibold text-gray-800">
                        Patient Information
                      </h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">Name:</span>{" "}
                        {selectedPrescription.patientName}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Age:</span>{" "}
                        {selectedPrescription.age} years
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Gender:</span>{" "}
                        {selectedPrescription.gender}
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-5 h-5 text-green-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <h4 className="font-semibold text-gray-800">
                        Prescribed By
                      </h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">Doctor:</span>{" "}
                        {selectedPrescription.doctorName}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Date:</span>{" "}
                        {selectedPrescription.createdDate
                          ? new Date(
                              selectedPrescription.createdDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            getStatus(selectedPrescription)
                          )}`}
                        >
                          {getStatus(selectedPrescription)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diagnosis & Symptoms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {selectedPrescription.diagnosis && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-600 mr-2"
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
                        Diagnosis
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {selectedPrescription.diagnosis}
                      </p>
                    </div>
                  )}

                  {selectedPrescription.symptoms && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <svg
                          className="w-5 h-5 text-red-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        Symptoms
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {selectedPrescription.symptoms}
                      </p>
                    </div>
                  )}
                </div>

                {/* Medicines - Enhanced View */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-6 h-6 text-purple-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Prescribed Medications
                  </h4>

                  {selectedPrescription.medicines &&
                  selectedPrescription.medicines.length > 0 ? (
                    <div className="space-y-4">
                      {selectedPrescription.medicines.map((medicine, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <span className="bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2">
                                  {index + 1}
                                </span>
                                <h5 className="text-lg font-bold text-gray-800">
                                  {medicine.medicineName}
                                </h5>
                              </div>
                            </div>
                            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Qty: {medicine.quantity}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <div className="bg-white rounded-lg p-3 border border-purple-100">
                              <p className="text-xs text-gray-500 mb-1">
                                💊 Dosage
                              </p>
                              <p className="font-semibold text-gray-800">
                                {medicine.dosage}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-purple-100">
                              <p className="text-xs text-gray-500 mb-1">
                                ⏰ Frequency
                              </p>
                              <p className="font-semibold text-gray-800">
                                {medicine.frequency}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-purple-100">
                              <p className="text-xs text-gray-500 mb-1">
                                📅 Duration
                              </p>
                              <p className="font-semibold text-gray-800">
                                {medicine.duration}
                              </p>
                            </div>
                          </div>

                          {medicine.instruction && (
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                              <p className="text-xs text-blue-600 font-medium mb-1">
                                📋 INSTRUCTIONS
                              </p>
                              <p className="text-sm text-gray-700 font-medium">
                                {medicine.instruction}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No medicines prescribed</p>
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                {selectedPrescription.additionalNotes && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <svg
                        className="w-5 h-5 text-orange-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      Additional Notes
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {selectedPrescription.additionalNotes}
                    </p>
                  </div>
                )}

                {/* Important Notice */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
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
                      <h4 className="font-semibold text-red-800 mb-1">
                        Important Dispensing Instructions
                      </h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Verify patient identity before dispensing</li>
                        <li>• Check for drug interactions and allergies</li>
                        <li>• Provide clear usage instructions to patient</li>
                        <li>• Ensure proper labeling on all medications</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                {getStatus(selectedPrescription) === "Pending" ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={confirmDispense}
                      className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Mark as Dispensed</span>
                    </button>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {getStatus(selectedPrescription) === "Dispensed" && (
                        <span className="flex items-center text-green-600">
                          <svg
                            className="w-5 h-5 mr-2"
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
                          Already dispensed
                          {selectedPrescription.dispensedBy &&
                            ` by ${selectedPrescription.dispensedBy}`}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pharmacist;
