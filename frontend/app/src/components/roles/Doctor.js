import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { appointments as initialAppointments } from "../mockData/doctor/PatientAppointments";

import PatientCard from "./components/doctor/PatientCard"; // Cards ( patient details )
import PrescriptionForm from "./components/doctor/Prescription"; // To give prescribe to patient
import {
  addPrescription,
  updatePrescriptionByPatientId,
  getPrescriptionByPatientId,
} from "../mockData/Prescription";
import AgeDistribution from "./components/doctor/AgeDistribution"; // This is for graph

import { motion, AnimatePresence } from "framer-motion";

import "./styles/Doctor.css";

const Doctor = () => {
  const [filter, setFilter] = useState("");
  const [appointmentData, setAppointmentData] = useState(initialAppointments);
  const [showGraph, setShowGraph] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleInputChange = (e) => {
    setFilter(e.target.value);
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointmentData((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
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

  const handleSavePrescription = (prescriptionData) => {
    console.log("Prescription data to save:", prescriptionData);

    try {
      // Check if prescription already exists for this patient
      const existingPrescriptions = getPrescriptionByPatientId(
        prescriptionData.patientId
      );

      let result;
      if (existingPrescriptions && existingPrescriptions.length > 0) {
        // Update existing prescription
        result = updatePrescriptionByPatientId(
          prescriptionData.patientId,
          prescriptionData
        );
        console.log("Prescription updated:", result);
        toast.success(
          `Prescription updated successfully for ${prescriptionData.patientName}!`,
          {
            duration: 4000,
            position: "top-center",
          }
        );
      } else {
        // Add new prescription
        result = addPrescription(prescriptionData);
        console.log("New prescription added:", result);
        toast.success(
          `Prescription created successfully for ${prescriptionData.patientName}!`,
          {
            duration: 4000,
            position: "top-center",
          }
        );
      }

      // Update patient status to completed
      handleStatusChange(prescriptionData.patientId, "Completed");
      handleClosePrescription();
    } catch (error) {
      console.error("Error saving prescription:", error);
      toast.error("Failed to save prescription. Please try again.", {
        duration: 4000,
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
