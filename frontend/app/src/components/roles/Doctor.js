import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { appointmentAPI, prescriptionAPI } from "../../services/api";

import PatientCard from "./components/doctor/PatientCard";
import PrescriptionForm from "./components/doctor/Prescription";
import AgeDistribution from "./components/doctor/AgeDistribution";
import Loading from "../Loading";

import { motion, AnimatePresence } from "framer-motion";

import "./styles/Doctor.css";

const Doctor = () => {
  const profile = useSelector((state) => state.profile.profile);
  const [filter, setFilter] = useState("");
  const [appointmentData, setAppointmentData] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load appointments on component mount
  useEffect(() => {
    loadAppointments();
  }, [profile]);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      // Get all appointments for now (can filter by doctor ID later)
      const response = await appointmentAPI.getAll();
      setAppointmentData(response.data);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFilter(e.target.value);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentAPI.updateStatus(id, newStatus);
      setAppointmentData((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      toast.success(`Appointment status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update appointment status");
    }
  };

  const handlePrescribe = (patient) => {
    // console.log("patient");
    // console.log(patient);
    setSelectedPatient(patient);
    setShowPrescriptionForm(true);
  };

  const handleClosePrescription = () => {
    setShowPrescriptionForm(false);
    setSelectedPatient(null);
  };

  const handleSavePrescription = async (prescriptionData) => {
    console.log("Prescription data to save:", prescriptionData);

    try {
      // Prepare prescription data with doctor info
      const prescriptionToSave = {
        ...prescriptionData,
        doctorId: profile?.email || "",
        doctorName: profile?.name || "Dr. Unknown",
        // Map instructions to instruction (singular) for backend
        medicines: prescriptionData.medicines.map((med) => ({
          medicineName: med.medicineName,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instruction: med.instructions || "", // Map instructions to instruction
          quantity: med.quantity,
        })),
      };

      console.log("Sending prescription to backend:", prescriptionToSave);

      // Create prescription via API
      const response = await prescriptionAPI.create(prescriptionToSave);
      console.log("Prescription created successfully:", response.data);

      // Update appointment: mark as completed and prescription given
      const updatedAppointment = {
        ...selectedPatient,
        status: "Completed",
        prescriptionGiven: true,
        followUpRequired: prescriptionToSave.followUpDate ? true : false,
        followUpDate: prescriptionToSave.followUpDate || null,
      };

      await appointmentAPI.update(selectedPatient.id, updatedAppointment);

      toast.success(
        `Prescription created successfully for ${prescriptionData.patientName}!`,
        {
          duration: 4000,
          position: "top-center",
        }
      );

      // Reload appointments to get updated data
      await loadAppointments();

      handleClosePrescription();
    } catch (error) {
      console.error("Error saving prescription:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to save prescription. Please try again.";

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
      });
    }
  };

  const filteredAppointments =
    filter === ""
      ? appointmentData
      : appointmentData.filter((a) => a.status === filter);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const count0to20 = filteredAppointments.filter(
    (p) => p.age >= 1 && p.age <= 20
  ).length;
  const count21to35 = filteredAppointments.filter(
    (p) => p.age > 20 && p.age <= 35
  ).length;
  const countAbove35 = filteredAppointments.filter((p) => p.age > 35).length;

  if (isLoading) {
    return (
      <Loading
        type="medical"
        message="Loading appointments..."
        fullScreen={true}
        size="xl"
      />
    );
  }

  return (
    <div className="container-fluid">
      <div className="appointments p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <p className="text-2xl font-bold text-gray-800">Appointments</p>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filter}
                onChange={handleInputChange}
                className="w-64 px-4 py-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                transition bg-gray-50 focus:bg-white"
              >
                <option value="">All</option>
                <option value="Completed">Completed</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-100 p-5 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                📊 This Month's Patient Age Distribution -{" "}
                {filter === "" ? "All" : filter}
              </h3>
              <button
                onClick={() => setShowGraph(!showGraph)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-700 transition"
              >
                {showGraph ? "Show Cards" : "Show Graph"}
              </button>
            </div>

            {!showGraph ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-lg shadow p-2">
                  <p className="text-2xl font-bold text-blue-600">
                    {count0to20}
                  </p>
                  <p className="text-gray-600">Age 1 - 20</p>
                </div>

                <div className="bg-white rounded-lg shadow p-2">
                  <p className="text-2xl font-bold text-green-600">
                    {count21to35}
                  </p>
                  <p className="text-gray-600">Age 21 - 35</p>
                </div>

                <div className="bg-white rounded-lg shadow p-2">
                  <p className="text-2xl font-bold text-purple-600">
                    {countAbove35}
                  </p>
                  <p className="text-gray-600">Above 35</p>
                </div>
              </div>
            ) : (
              <AgeDistribution filteredAppointments={filteredAppointments} />
            )}
          </div>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No appointments found
          </h3>
          <p className="text-gray-500">
            {filter
              ? `No ${filter.toLowerCase()} appointments`
              : "No appointments available"}
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence mode="sync">
            {filteredAppointments.map((patient) => (
              <motion.div
                key={patient.id}
                variants={cardVariants}
                exit="exit"
                layout
                transition={{ duration: 0.4 }}
              >
                <PatientCard
                  patient={patient}
                  onStatusChange={handleStatusChange}
                  onPrescribe={handlePrescribe}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      <AnimatePresence>
        {showPrescriptionForm && selectedPatient && (
          <PrescriptionForm
            patient={selectedPatient}
            onClose={handleClosePrescription}
            onSave={handleSavePrescription}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Doctor;
