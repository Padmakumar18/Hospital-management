import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { prescriptionAPI } from "../../services/api";

const Pharmacist = () => {
  const profile = useSelector((state) => state.profile.profile);
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  useEffect(() => {
    filterPrescriptions();
  }, [searchTerm, statusFilter, prescriptions]);

  const loadPrescriptions = async () => {
    try {
      setIsLoading(true);
      const response = await prescriptionAPI.getAll();
      const prescriptionsWithStatus = response.data.map((p) => ({
        ...p,
        dispensedStatus: p.dispensedStatus || "Pending",
      }));
      setPrescriptions(prescriptionsWithStatus);
    } catch (error) {
      console.error("Error loading prescriptions:", error);
      toast.error("Failed to load prescriptions", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const confirmDispense = () => {
    const updatedPrescriptions = prescriptions.map((p) =>
      p.id === selectedPrescription.id
        ? {
            ...p,
            dispensedStatus: "Dispensed",
            dispensedDate: new Date().toISOString(),
          }
        : p
    );
    setPrescriptions(updatedPrescriptions);
    setShowDetailModal(false);
    toast.success(
      `Prescription dispensed for ${selectedPrescription.patientName}`,
      {
        duration: 5000,
        position: "top-center",
      }
    );
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
                    <td className="p-4 text-gray-600">
                      {prescription.medicines?.length || 0} items
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

      {/* Detail Modal */}
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
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Prescription Details
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-500 hover:text-gray-700"
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

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Patient Name</p>
                      <p className="font-semibold">
                        {selectedPrescription.patientName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Doctor Name</p>
                      <p className="font-semibold">
                        {selectedPrescription.doctorName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Age / Gender</p>
                      <p className="font-semibold">
                        {selectedPrescription.age} yrs /{" "}
                        {selectedPrescription.gender}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${getStatusBadge(
                          getStatus(selectedPrescription)
                        )}`}
                      >
                        {getStatus(selectedPrescription)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Diagnosis</p>
                    <p className="font-semibold">
                      {selectedPrescription.diagnosis}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Medicines</p>
                    <div className="space-y-2">
                      {selectedPrescription.medicines?.map(
                        (medicine, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-3 rounded-lg"
                          >
                            <p className="font-semibold">
                              {medicine.medicineName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {medicine.dosage} - {medicine.frequency} -{" "}
                              {medicine.duration}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {medicine.quantity}
                            </p>
                            {medicine.instruction && (
                              <p className="text-sm text-gray-600 italic">
                                {medicine.instruction}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {selectedPrescription.additionalNotes && (
                    <div>
                      <p className="text-sm text-gray-600">Additional Notes</p>
                      <p className="font-semibold">
                        {selectedPrescription.additionalNotes}
                      </p>
                    </div>
                  )}
                </div>

                {getStatus(selectedPrescription) === "Pending" && (
                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={confirmDispense}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Mark as Dispensed
                    </button>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
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
