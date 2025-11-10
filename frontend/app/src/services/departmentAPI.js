import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export const departmentAPI = {
  // Get all departments
  getAll: () => axios.get(`${API_URL}/departments`),

  // Get active departments only
  getActive: () => axios.get(`${API_URL}/departments/active`),

  // Get department by ID
  getById: (id) => axios.get(`${API_URL}/departments/${id}`),

  // Get department by name
  getByName: (name) => axios.get(`${API_URL}/departments/name/${name}`),

  // Create new department
  create: (departmentData) =>
    axios.post(`${API_URL}/departments`, departmentData),

  // Update department
  update: (id, departmentData) =>
    axios.put(`${API_URL}/departments/${id}`, departmentData),

  // Delete department
  delete: (id) => axios.delete(`${API_URL}/departments/${id}`),
};
