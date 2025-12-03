import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doctorAPI, departmentAPI } from "../../../../services/api";
import toast from "react-hot-toast";

const AppointmentBookingForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    contact: "",
    doctor: "",
    department: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    issueDays: 1,
  });

  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load departments and doctors from database
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoadingData(true);
      const [deptResponse, doctorResponse] = await Promise.all([
        departmentAPI.getActive(),
        doctorAPI.getAvailable(),
      ]);

      setDepartments(deptResponse.data || []);
      setAllDoctors(doctorResponse.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load departments and doctors", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  // Filter doctors when department changes
  useEffect(() => {
    if (formData.department) {
      const doctors = allDoctors.filter(
        (doc) => doc.department === formData.department
      );
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors([]);
    }
  }, [formData.department, allDoctors]);

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    if (field === "department") {
      setFormData((prev) => ({
        ...prev,
        doctor: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = "Patient name is required";
    }

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = "Please enter a valid age (1-120)";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Please enter a valid 10-digit phone number";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.doctor) {
      newErrors.doctor = "Doctor is required";
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Appointment date is required";
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.appointmentDate = "Appointment date cannot be in the past";
      }
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Appointment time is required";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason for visit is required";
    }

    if (!formData.issueDays || formData.issueDays < 1) {
      newErrors.issueDays = "Issue duration must be at least 1 day";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const appointmentData = {
        ...formData,
        id: Date.now(),
        status: "Scheduled",
      };

      onSubmit(appointmentData);
      console.log("Appointment booked:", appointmentData);
    }
  };

  const handlePhoneChange = (e) => {
    // Only allow digits, max 10 characters
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    handleInputChange("contact", value);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📅 Book New Appointment
        </h2>
        <p className="text-gray-600">
          Fill in the details below to schedule your appointment
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            👤 Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name *
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) =>
                  handleInputChange("patientName", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.patientName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter full name"
              />
              {errors.patientName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.patientName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.age ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter age"
                min="1"
                max="120"
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.gender ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number *
            </label>
            <input
              type="tel"
              value={formData.contact}
              onChange={handlePhoneChange}
              className={`w-full md:w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.contact ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter 10-digit number"
              maxLength="10"
            />
            {errors.contact && (
              <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
            )}
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🏥 Medical Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.department ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoadingData}
              >
                <option value="">
                  {isLoadingData
                    ? "Loading departments..."
                    : "Select department"}
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-500 text-xs mt-1">{errors.department}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor *
              </label>
              <select
                value={formData.doctor}
                onChange={(e) => handleInputChange("doctor", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.doctor ? "border-red-500" : "border-gray-300"
                }`}
                disabled={!formData.department || isLoadingData}
              >
                <option value="">
                  {!formData.department
                    ? "Select department first"
                    : filteredDoctors.length === 0
                    ? "No doctors available"
                    : "Select doctor"}
                </option>
                {filteredDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
              {errors.doctor && (
                <p className="text-red-500 text-xs mt-1">{errors.doctor}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Visit *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.reason ? "border-red-500" : "border-gray-300"
              }`}
              rows="3"
              placeholder="Describe your symptoms or reason for the visit..."
            />
            {errors.reason && (
              <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How many days have you been experiencing this issue? *
            </label>
            <input
              type="number"
              value={formData.issueDays}
              onChange={(e) => handleInputChange("issueDays", e.target.value)}
              className={`w-full md:w-1/3 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.issueDays ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Number of days"
              min="1"
            />
            {errors.issueDays && (
              <p className="text-red-500 text-xs mt-1">{errors.issueDays}</p>
            )}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📅 Appointment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Date *
              </label>
              <input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) =>
                  handleInputChange("appointmentDate", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.appointmentDate ? "border-red-500" : "border-gray-300"
                }`}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.appointmentDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.appointmentDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Time *
              </label>
              <select
                value={formData.appointmentTime}
                onChange={(e) =>
                  handleInputChange("appointmentTime", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.appointmentTime ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.appointmentTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.appointmentTime}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <motion.button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
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
                d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-.5 3m6.5-3l.5 3M12 21l-8-4 8-4 8 4-8 4z"
              />
            </svg>
            <span>Book Appointment</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AppointmentBookingForm;
