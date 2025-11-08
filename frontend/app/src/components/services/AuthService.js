import axios from "axios";

export const handleLogin = async (email, password) => {
  const API_URL = "http://localhost:8080";
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: email,
      password: password,
    });
    const result = response.data;
    console.log("Login response:", response);
    console.log("Login result:", result);
    console.log("Login User:", result.user);

    if (result.success) {
      localStorage.setItem("hsp-email-id", email);
      localStorage.setItem("hsp-password", password);
      return response;
    }
  } catch (error) {
    console.error("Login error:", error);

    // Check if it's a 403 (pending approval) error
    if (error.response && error.response.status === 403) {
      return {
        status: 403,
        data: error.response.data,
        pendingApproval: true,
      };
    }
  }
  return false;
};
