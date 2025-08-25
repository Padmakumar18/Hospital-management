import React, { useState } from "react";
import { appointments } from "../mockData/appointments";
import PatientCard from "./components/PatientCard";
import { motion, AnimatePresence } from "framer-motion";
import "./style/Doctor.css";

const Doctor = () => {
  const [filter, setFilter] = useState("");

  const handleInputChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredAppointments =
    filter === ""
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="container-fluid">
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

      <div className="appointments p-3">
        <p className="font-bold appointments-para">Appointments</p>
        <label className="block text-lg font-semibold text-gray-700 mt-3">
          Filter
        </label>

        <select
          name="role"
          value={filter}
          onChange={handleInputChange}
          className="w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
        >
          <option value="">All</option>
          <option value="Completed">Completed</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Animated container */}
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
              <PatientCard patient={patient} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Doctor;
