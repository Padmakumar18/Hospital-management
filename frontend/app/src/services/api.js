import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Appointment APIs
export const appointmentAPI = {
  create: (appointmentData) => api.post("/appointments", appointmentData),
  getAll: () => api.get("/appointments"),
  getById: (id) => api.get(`/appointments/${id}`),
  getByPatientId: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getByDoctorId: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  getByStatus: (status) => api.get(`/appointments/status/${status}`),
  update: (id, appointmentData) =>
    api.put(`/appointments/${id}`, appointmentData),
  updateStatus: (id, status, cancellationReason) =>
    api.patch(`/appointments/${id}/status`, null, {
      params: { status, cancellationReason },
    }),
  delete: (id) => api.delete(`/appointments/${id}`),
};

// Prescription APIs
export const prescriptionAPI = {
  create: (prescriptionData) => api.post("/prescriptions", prescriptionData),
  getAll: () => api.get("/prescriptions"),
  getById: (id) => api.get(`/prescriptions/${id}`),
  getByPatientId: (patientId) => api.get(`/prescriptions/patient/${patientId}`),
  getByDoctorId: (doctorId) => api.get(`/prescriptions/doctor/${doctorId}`),
  getByPatientName: (patientName) =>
    api.get(`/prescriptions/patient-name/${patientName}`),
  update: (id, prescriptionData) =>
    api.put(`/prescriptions/${id}`, prescriptionData),
  delete: (id) => api.delete(`/prescriptions/${id}`),
};

// User APIs
export const userAPI = {
  getAll: () => api.get("/users"),
  getByEmail: (email) => api.get(`/users/${email}`),
  getByRole: (role) => api.get(`/users/role/${role}`),
  update: (email, userData) => api.put(`/users/${email}`, userData),
  delete: (email) => api.delete(`/users/${email}`),
};

// Doctor APIs
export const doctorAPI = {
  create: (doctorData) => api.post("/doctors", doctorData),
  getAll: () => api.get("/doctors"),
  getAvailable: () => api.get("/doctors/available"),
  getByDepartment: (department) => api.get(`/doctors/department/${department}`),
  getBySpecialization: (specialization) =>
    api.get(`/doctors/specialization/${specialization}`),
  getById: (id) => api.get(`/doctors/${id}`),
  getByEmail: (email) => api.get(`/doctors/email/${email}`),
  update: (id, doctorData) => api.put(`/doctors/${id}`, doctorData),
  delete: (id) => api.delete(`/doctors/${id}`),
};

// Department APIs
export const departmentAPI = {
  create: (departmentData) => api.post("/departments", departmentData),
  getAll: () => api.get("/departments"),
  getActive: () => api.get("/departments/active"),
  getById: (id) => api.get(`/departments/${id}`),
  getByName: (name) => api.get(`/departments/name/${name}`),
  update: (id, departmentData) => api.put(`/departments/${id}`, departmentData),
  delete: (id) => api.delete(`/departments/${id}`),
};

export default api;
