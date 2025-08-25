import React, { useState } from "react";
import { appointments as initialAppointments } from "../mockData/appointments";
import PatientCard from "./components/PatientCard";
import { motion, AnimatePresence } from "framer-motion";
import AgeDistribution from "./components/AgeDistribution"; // import graph
import "./style/Doctor.css";

const Doctor = () => {
  const [filter, setFilter] = useState("");
  const [appointmentData, setAppointmentData] = useState(initialAppointments);
  const [showGraph, setShowGraph] = useState(false); // toggle table/graph

  const handleInputChange = (e) => {
    setFilter(e.target.value);
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointmentData((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
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
      {/* Header */}
      <div className="doctor-header flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-xl font-bold">
          Hello, <span className="font-light">User Name</span>
        </h1>
        <div className="flex items-center space-x-6 text-sm font-bold">
          <p className="bg-white text-blue-600 px-3 py-1 rounded-lg shadow-sm">
            📅 {new Date().toLocaleDateString()}
          </p>
          <p className="bg-white text-green-600 px-3 py-1 rounded-lg shadow-sm">
            ⏰{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="appointments p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side: Appointments + Filter */}
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
                📊 This Month's Patient Age Distribution
              </h3>
              <button
                onClick={() => setShowGraph(!showGraph)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-700 transition"
              >
                {showGraph ? "Show Cards" : "Show Graph"}
              </button>
            </div>

            {!showGraph ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-2xl font-bold text-blue-600">
                    {
                      filteredAppointments.filter(
                        (p) => p.age >= 1 && p.age <= 20
                      ).length
                    }
                  </p>
                  <p className="text-gray-600">Age 1 - 20</p>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-2xl font-bold text-green-600">
                    {
                      filteredAppointments.filter(
                        (p) => p.age > 20 && p.age <= 35
                      ).length
                    }
                  </p>
                  <p className="text-gray-600">Age 21 - 35</p>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-2xl font-bold text-purple-600">
                    {filteredAppointments.filter((p) => p.age > 35).length}
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

      {/* Cards */}
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
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Doctor;
