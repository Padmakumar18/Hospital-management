import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentBookingForm from "./components/patient/AppointmentBookingForm";

const Patient = () => {
  const [appointments, setAppointments] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleBookAppointment = (appointmentData) => {
    setAppointments((prev) => [...prev, appointmentData]);
    setSuccessMessage(
      `Appointment booked successfully for ${appointmentData.appointmentDate} at ${appointmentData.appointmentTime}`
    );

    setShowBookingForm(false);

    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  const handleCancelBooking = () => {
    setShowBookingForm(false);
  };

  return (
    <div className="container-fluid min-h-screen bg-gray-50">
      <div className="patient-header flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold">
            Hello, <span className="font-light">User Name</span>
          </h1>
        </div>

        <div className="text-center flex-1">
          <h2 className="text-2xl font-extrabold tracking-wide drop-shadow-md">
            🏥 CityCare Hospital
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="bg-white text-blue-600 px-4 py-1 rounded-lg shadow-md text-sm font-semibold hover:bg-blue-100 transition cursor-pointer">
            Profile
          </button>
          <button className="bg-white text-red-600 px-4 py-1 rounded-lg shadow-md text-sm font-semibold hover:bg-red-100 transition cursor-pointer">
            Sign out
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center"
            >
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
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              📅 Appointment Management
            </h1>
            <p className="text-gray-600 mt-1">
              Book and manage your medical appointments
            </p>
          </div>

          {!showBookingForm && (
            <motion.button
              onClick={() => setShowBookingForm(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Book New Appointment</span>
            </motion.button>
          )}
        </div>

        {/* Booking Form */}
        <AnimatePresence>
          {showBookingForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <AppointmentBookingForm
                onSubmit={handleBookAppointment}
                onCancel={handleCancelBooking}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!showBookingForm && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📋 Your Appointments
            </h2>

            {appointments.length === 0 ? (
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
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-.5 3m6.5-3l.5 3M12 21l-8-4 8-4 8 4-8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No appointments yet
                </h3>
                <p className="text-gray-500">
                  Click "Book New Appointment" to schedule your first
                  appointment
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointments.map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">
                        {appointment.patientName}
                      </h3>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {appointment.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Doctor:</span>{" "}
                        {appointment.doctor}
                      </p>
                      <p>
                        <span className="font-medium">Department:</span>{" "}
                        {appointment.department}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {appointment.appointmentDate}
                      </p>
                      <p>
                        <span className="font-medium">Time:</span>{" "}
                        {appointment.appointmentTime}
                      </p>
                      <p>
                        <span className="font-medium">Reason:</span>{" "}
                        {appointment.reason}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Patient;
