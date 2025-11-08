import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { userAPI, appointmentAPI, prescriptionAPI } from "../../services/api";

const Admin = () => {
  const profile = useSelector((state) => state.profile.profile);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [usersRes, appointmentsRes, prescriptionsRes] = await Promise.all([
        userAPI.getAll(),
        appointmentAPI.getAll(),
        prescriptionAPI.getAll(),
      ]);
      setUsers(usersRes.data || []);
      setAppointments(appointmentsRes.data || []);
      setPrescriptions(prescriptionsRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole) {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    return filtered;
  };

  const handleDeleteUser = (userEmail) => {
    toast(
      (t) => (
        <div className="flex flex-col space-y-3">
          <p className="font-medium text-gray-800">
            Are you sure you want to delete this user?
          </p>
          <div className="flex space-x-2">
            <button
              onClick={async () => {
                try {
                  await userAPI.delete(userEmail);
                  toast.dismiss(t.id);
                  toast.success("User deleted successfully!");
                  await loadAllData();
                } catch (error) {
                  toast.error("Failed to delete user");
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
            >
              Cancel
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

  const handleUpdateUser = async (userData) => {
    try {
      await userAPI.update(userData.email, userData);
      setShowUserModal(false);
      setSelectedUser(null);
      toast.success("User updated successfully!");
      await loadAllData();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const getUserStats = () => {
    const stats = {};
    users.forEach((user) => {
      stats[user.role] = (stats[user.role] || 0) + 1;
    });
    return stats;
  };

  const systemStats = {
    totalUsers: users.length,
    activeUsers: users.length, // All users are active by default
    totalAppointments: appointments.length,
    totalPrescriptions: prescriptions.length,
  };

  const userStats = getUserStats();
  const roles = ["Doctor", "Patient", "Pharmacist", "Admin"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6">
          {[
            { id: "dashboard", label: "Dashboard", icon: "📊" },
            { id: "users", label: "User Management", icon: "👥" },
            { id: "appointments", label: "Appointments", icon: "📅" },
            { id: "prescriptions", label: "Prescriptions", icon: "💊" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                className="bg-blue-500 text-white rounded-lg p-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Users</p>
                    <p className="text-3xl font-bold">
                      {systemStats.totalUsers}
                    </p>
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
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
                    <p className="text-green-100 text-sm">Appointments</p>
                    <p className="text-3xl font-bold">
                      {systemStats.totalAppointments}
                    </p>
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-purple-500 text-white rounded-lg p-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Prescriptions</p>
                    <p className="text-3xl font-bold">
                      {systemStats.totalPrescriptions}
                    </p>
                  </div>
                  <div className="text-purple-200">
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
                className="bg-orange-500 text-white rounded-lg p-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Active Users</p>
                    <p className="text-3xl font-bold">
                      {systemStats.activeUsers}
                    </p>
                  </div>
                  <div className="text-orange-200">
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

            {/* Role Distribution */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                User Distribution by Role
              </h3>
              <div className="space-y-3">
                {Object.entries(userStats).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <span className="text-gray-600">{role}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{
                            width: `${(count / systemStats.totalUsers) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="font-semibold text-purple-600 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-4 md:space-y-0">
                <h3 className="text-lg font-semibold text-gray-800">
                  User Management
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Roles</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterRole("");
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>

              {/* Users Table */}
              {getFilteredUsers().length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-4 font-semibold text-gray-700">
                          User
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700">
                          Role
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredUsers().map((user) => (
                        <tr
                          key={user.email}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-800">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {user.email}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                title="Edit User"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.email)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Delete User"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              All Appointments
            </h3>
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No appointments found</p>
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
                        Date
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr
                        key={apt.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="p-4">{apt.patientName}</td>
                        <td className="p-4">{apt.doctorName}</td>
                        <td className="p-4">
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              apt.status === "Scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : apt.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === "prescriptions" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              All Prescriptions
            </h3>
            {prescriptions.length === 0 ? (
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
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((pres) => (
                      <tr
                        key={pres.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="p-4">{pres.patientName}</td>
                        <td className="p-4">{pres.doctorName}</td>
                        <td className="p-4">{pres.diagnosis}</td>
                        <td className="p-4">
                          {pres.medicines?.length || 0} items
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Edit User Modal */}
        {showUserModal && selectedUser && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUserModal(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Edit User
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={selectedUser.name}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => handleUpdateUser(selectedUser)}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
