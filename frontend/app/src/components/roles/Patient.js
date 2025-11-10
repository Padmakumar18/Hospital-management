import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { appointmentAPI, prescriptionAPI } from "../../services/api";
import AppointmentBookingForm from "./components/patient/AppointmentBookingForm";
import PrescriptionView from "./components/patient/PrescriptionView";
import Loading, { LoadingOverlay, SearchLoading, useLoading } from "../Loading";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import "./styles/Patient.css";

const Patient = () => {
  const profile = useSelector((state) => state.profile.profile);
  const [appointments, setAppointments] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({});
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { loading: prescriptionLoading, withLoading } = useLoading();

  const loadAppointments = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      // Get all appointments (can filter by patient email/ID later)
      const response = await appointmentAPI.getAll();
      const patientAppointments = response.data.filter(
        (apt) =>
          apt.patientName === profile?.name || apt.patientId === profile?.email
      );
      setAppointments(patientAppointments);
      calculateStats(patientAppointments);
    } catch (error) {
      console.error("Error loading appointments:", error);
      if (showLoading) {
        toast.error("Failed to load appointments", {
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
    if (profile) {
      loadAppointments(true);
    }
  }, [profile]);

  // Auto-refresh every 10 seconds without showing loading
  useAutoRefresh(loadAppointments, 10000, true, [profile]);

  const calculateStats = (appointments) => {
    const stats = {
      total: appointments.length,
      scheduled: appointments.filter((a) => a.status === "Scheduled").length,
      completed: appointments.filter((a) => a.status === "Completed").length,
      withPrescription: appointments.filter((a) => a.prescriptionGiven).length,
    };
    setStats(stats);
  };

  const handleBookAppointment = async (appointmentData) => {
    try {
      // Convert time from "09:00 AM" format to "09:00:00" format
      const convertTimeTo24Hour = (time12h) => {
        const [time, modifier] = time12h.split(" ");
        let [hours, minutes] = time.split(":");

        if (hours === "12") {
          hours = "00";
        }

        if (modifier === "PM") {
          hours = parseInt(hours, 10) + 12;
        }

        return `${hours.toString().padStart(2, "0")}:${minutes}:00`;
      };

      // Map form fields to backend expected fields
      const newAppointment = {
        patientId: profile?.email || appointmentData.patientId,
        doctorId: appointmentData.doctor, // Using doctor name as ID for now
        patientName: profile?.name || appointmentData.patientName,
        doctorName: appointmentData.doctor,
        age: parseInt(appointmentData.age),
        gender: appointmentData.gender,
        contactNumber: appointmentData.contact,
        department: appointmentData.department,
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: convertTimeTo24Hour(appointmentData.appointmentTime),
        status: "Scheduled",
        reason: appointmentData.reason,
        issueDays: parseInt(appointmentData.issueDays),
        prescriptionGiven: false,
        followUpRequired: false,
      };

      console.log("Sending appointment data:", newAppointment);

      await appointmentAPI.create(newAppointment);

      toast.success(
        `Appointment booked successfully for ${appointmentData.appointmentDate} at ${appointmentData.appointmentTime}`,
        {
          duration: 5000,
          position: "top-center",
        }
      );

      setShowBookingForm(false);
      await loadAppointments(); // Reload to get updated list
    } catch (error) {
      console.error("Error booking appointment:", error);
      console.error("Error details:", error.response?.data);
      toast.error(
        error.response?.data?.message ||
          "Failed to book appointment. Please try again.",
        {
          duration: 5000,
          position: "top-center",
        }
      );
    }
  };

  const handleCancelBooking = () => {
    setShowBookingForm(false);
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    switch (activeTab) {
      case "upcoming":
        return appointments.filter((apt) => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= now && apt.status === "Scheduled";
        });
      case "past":
        return appointments.filter((apt) => {
          const aptDate = new Date(apt.appointmentDate);
          return (
            aptDate < now ||
            apt.status === "Completed" ||
            apt.status === "Cancelled"
          );
        });
      default:
        return appointments;
    }
  };

  const getAppointmentCardStyle = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200";
      case "Completed":
        return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200";
      case "Cancelled":
        return "bg-gradient-to-br from-red-50 to-rose-50 border-red-200";
      default:
        return "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200";
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle appointment cancellation (patients can only cancel, not delete)
  const handleCancelAppointment = (appointmentId) => {
    toast(
      (t) => (
        <div className="flex flex-col space-y-3">
          <p className="font-medium text-gray-800">
            Are you sure you want to cancel this appointment?
          </p>
          <p className="text-sm text-gray-600">
            This action cannot be undone. You'll need to book a new appointment
            if needed.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={async () => {
                try {
                  await appointmentAPI.updateStatus(
                    appointmentId,
                    "Cancelled",
                    "Cancelled by patient"
                  );

                  toast.dismiss(t.id);
                  toast.success("Appointment cancelled successfully", {
                    duration: 5000,
                    position: "top-center",
                  });

                  await loadAppointments(); // Reload appointments
                } catch (error) {
                  console.error("Error cancelling appointment:", error);
                  toast.error("Failed to cancel appointment", {
                    duration: 5000,
                    position: "top-center",
                  });
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            >
              Yes, Cancel
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
            >
              No, Keep
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  // Handle view prescription
  const handleViewPrescription = async (appointment) => {
    try {
      console.log("Loading prescription for:", appointment.patientName);

      // Get prescriptions for this patient
      const response = await prescriptionAPI.getByPatientName(
        appointment.patientName
      );

      console.log("Prescription response:", response.data);
      console.log("Response type:", typeof response.data);
      console.log("Is array:", Array.isArray(response.data));

      // Handle both array and single object responses
      let prescriptions = [];
      if (Array.isArray(response.data)) {
        prescriptions = response.data;
      } else if (response.data) {
        prescriptions = [response.data];
      }

      if (prescriptions.length > 0) {
        // Find the most recent prescription or one matching the appointment date
        const matchingPrescription =
          prescriptions.find(
            (p) =>
              new Date(p.createdDate).toDateString() ===
              new Date(appointment.appointmentDate).toDateString()
          ) || prescriptions[0];

        console.log("Selected prescription:", matchingPrescription);

        setSelectedPrescription(matchingPrescription);
        setSelectedAppointment(appointment);
        setShowPrescriptionModal(true);
      } else {
        console.log("No prescriptions found");
        toast.error("No prescription found for this appointment.", {
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error loading prescription:", error);
      console.error("Error details:", error.response?.data);
      toast.error(
        "Failed to load prescription: " +
          (error.response?.data?.message || error.message),
        {
          duration: 5000,
          position: "top-center",
        }
      );
    }
  };

  const handleClosePrescription = () => {
    setShowPrescriptionModal(false);
    setSelectedAppointment(null);
    setSelectedPrescription(null);
  };

  // Show loading screen while data is loading
  if (isLoading) {
    return (
      <Loading
        type="medical"
        message="Loading your appointments..."
        fullScreen={true}
        size="xl"
      />
    );
  }

  return (
    <div className="container-fluid min-h-screen bg-gray-50">
      <Toaster />

      <div className="p-6">
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

        {/* Statistics Cards */}
        {!showBookingForm && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              className="bg-blue-500 text-white rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Appointments</p>
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
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-.5 3m6.5-3l.5 3M12 21l-8-4 8-4 8 4-8 4z"
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
                  <p className="text-green-100 text-sm">Scheduled</p>
                  <p className="text-2xl font-bold">{stats.scheduled || 0}</p>
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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
                  <p className="text-purple-100 text-sm">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed || 0}</p>
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-orange-500 text-white rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">With Prescription</p>
                  <p className="text-2xl font-bold">
                    {stats.withPrescription || 0}
                  </p>
                </div>
                <div className="text-orange-200">
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
          </div>
        )}

        {!showBookingForm && (
          <div className="bg-white rounded-2xl booked-appointments shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                📋 Your Appointments
              </h2>

              {/* Filter Tabs */}
              <div className="flex space-x-2">
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
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "upcoming"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "past"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Past
                </button>
              </div>
            </div>

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
                {getFilteredAppointments().map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getAppointmentCardStyle(
                      appointment.status
                    )}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">
                        {appointment.doctor}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Department:</span>{" "}
                        {appointment.department}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Time:</span>{" "}
                        {appointment.appointmentTime}
                      </p>
                      <p>
                        <span className="font-medium">Reason:</span>{" "}
                        {appointment.reason}
                      </p>
                      <p>
                        <span className="font-medium">Issue Duration:</span>{" "}
                        {appointment.issueDays} day
                        {appointment.issueDays > 1 ? "s" : ""}
                      </p>
                      {appointment.appointmentId && (
                        <p>
                          <span className="font-medium">ID:</span>{" "}
                          {appointment.appointmentId}
                        </p>
                      )}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {appointment.prescriptionGiven && (
                        <div className="flex items-center text-green-600 text-xs mb-1">
                          <svg
                            className="w-3 h-3 mr-1"
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
                          Prescription Available
                        </div>
                      )}
                      {appointment.followUpRequired && (
                        <div className="flex items-center text-orange-600 text-xs mb-1">
                          <svg
                            className="w-3 h-3 mr-1"
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
                          Follow-up:{" "}
                          {new Date(
                            appointment.followUpDate
                          ).toLocaleDateString()}
                        </div>
                      )}
                      {appointment.testResults && (
                        <div className="flex items-center text-blue-600 text-xs mb-1">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          Test Results: {appointment.testResults}
                        </div>
                      )}
                      {appointment.cancellationReason && (
                        <div className="flex items-center text-red-600 text-xs mb-1">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                          Cancelled: {appointment.cancellationReason}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      {appointment.status === "Scheduled" && (
                        <div className="flex space-x-2">
                          <motion.button
                            onClick={() =>
                              handleCancelAppointment(appointment.id)
                            }
                            className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center justify-center space-x-1"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span>Cancel</span>
                          </motion.button>
                        </div>
                      )}

                      {appointment.status === "Completed" &&
                        appointment.prescriptionGiven && (
                          <div className="flex space-x-2">
                            <motion.button
                              onClick={() =>
                                handleViewPrescription(appointment)
                              }
                              className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center space-x-1"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
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
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <span>View Prescription</span>
                            </motion.button>
                          </div>
                        )}

                      {appointment.status === "Completed" &&
                        !appointment.prescriptionGiven && (
                          <div className="text-center">
                            <span className="text-gray-500 text-xs">
                              No prescription given
                            </span>
                          </div>
                        )}

                      {appointment.status === "Cancelled" && (
                        <div className="text-center">
                          <span className="text-red-500 text-xs">
                            Appointment was cancelled
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Prescription Modal */}
        <AnimatePresence>
          {showPrescriptionModal && selectedPrescription && (
            <PrescriptionView
              prescription={selectedPrescription}
              onClose={handleClosePrescription}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default Patient;
