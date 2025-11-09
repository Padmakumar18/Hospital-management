import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useDispatch } from "react-redux";
import { setProfile } from "../Redux/slice";

import { handleLogin as loginFunction } from "./services/AuthService";

import axios from "axios";

const Auth = () => {
  const dispatch = useDispatch();

  const API_URL = "http://localhost:8080";

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAutoLogging, setIsAutoLogging] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "",
    phone: "",
    specialization: "",
    department: "",
    qualification: "",
    licenseNumber: "",
    experienceYears: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If role is changed, clear doctor-specific fields if not Doctor/Pharmacist
    if (name === "role" && value !== "Doctor" && value !== "Pharmacist") {
      setFormData({
        ...formData,
        [name]: value,
        specialization: "",
        department: "",
        qualification: "",
        licenseNumber: "",
        experienceYears: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleLogin = async () => {
    const response = await loginFunction(formData.email, formData.password);
    console.log("response from loginFunction:");
    console.log(response);

    if (response && response.pendingApproval) {
      // User account is pending approval
      toast.error(
        response.data.message || "Your account is pending admin approval.",
        {
          duration: 5000,
          position: "top-center",
        }
      );

      // Redirect to waiting approval page
      navigate("/waiting-approval", {
        state: {
          userEmail: formData.email,
          userName: formData.name || "User",
          userRole: "Doctor/Pharmacist",
        },
      });
    } else if (response) {
      const result = response.data;
      const toastID = toast.success("Login successful!", {
        position: "top-center",
      });
      localStorage.setItem("hsp-email-id", formData.email);
      localStorage.setItem("hsp-password", formData.password);

      dispatch(setProfile(result.user));

      setTimeout(() => {
        toast.dismiss(toastID);
      }, 3000);

      navigate("/home");
    } else {
      toast.error("Login failed. Please try again.", {
        duration: 5000,
        position: "top-center",
      });
    }
  };

  const handleSignup = async () => {
    try {
      const signupData = {
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        role: formData.role,
        phone: formData.phone,
      };

      // Add doctor-specific fields if role is Doctor or Pharmacist
      if (formData.role === "Doctor" || formData.role === "Pharmacist") {
        signupData.specialization = formData.specialization;
        signupData.department = formData.department;
        signupData.qualification = formData.qualification;
        signupData.licenseNumber = formData.licenseNumber;
        signupData.experienceYears = parseInt(formData.experienceYears);
      }

      const response = await axios.post(`${API_URL}/auth/signup`, signupData);
      const result = response.data;
      console.log("Signup response:", result);

      if (result.success) {
        // Check if the message indicates pending approval
        const needsApproval = result.message.includes(
          "Waiting for admin approval"
        );

        if (needsApproval) {
          // Doctor or Pharmacist - needs approval
          toast.success(result.message, {
            duration: 5000,
            position: "top-center",
          });

          clearForm();
          navigate("/waiting-approval", {
            state: {
              userEmail: formData.email,
              userName: formData.fullName,
              userRole: formData.role,
            },
          });
        } else {
          // Patient or Admin - auto-verified
          const toastID = toast.success("Signup successful!", {
            position: "top-center",
          });

          localStorage.setItem("hsp-email-id", formData.email);
          localStorage.setItem("hsp-password", formData.password);

          // Set profile in Redux with the user data
          const userProfile = {
            email: formData.email,
            name: formData.fullName,
            role: formData.role,
          };
          dispatch(setProfile(userProfile));

          clearForm();
          toast.dismiss(toastID);

          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
      console.log("Login attempt:", {
        email: formData.email,
        password: formData.password,
      });
    } else {
      handleSignup();
      console.log("Signup attempt:", formData);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("hsp-email-id");
    const savedPassword = localStorage.getItem("hsp-password");

    if (savedEmail && savedPassword) {
      const autoLogin = async () => {
        try {
          const response = await loginFunction(savedEmail, savedPassword);

          if (response && response.pendingApproval) {
            // User account is pending approval
            const toastID = toast.error(
              response.data.message ||
                "Your account is pending admin approval.",
              {
                position: "top-center",
              }
            );

            setTimeout(() => {
              toast.dismiss(toastID);
            }, 3000);

            // Clear credentials and redirect to waiting approval page
            localStorage.removeItem("hsp-email-id");
            localStorage.removeItem("hsp-password");

            navigate("/waiting-approval", {
              state: {
                userEmail: savedEmail,
                userName: "User",
                userRole: "Doctor/Pharmacist",
              },
            });
          } else if (response && response.data && response.data.success) {
            dispatch(setProfile(response.data.user));
            navigate("/home");
          } else {
            // Clear invalid credentials
            localStorage.removeItem("hsp-email-id");
            localStorage.removeItem("hsp-password");
          }
        } catch (error) {
          console.error("Auto-login failed:", error);
          // Clear invalid credentials
          localStorage.removeItem("hsp-email-id");
          localStorage.removeItem("hsp-password");
        } finally {
          setIsAutoLogging(false);
        }
      };
      autoLogin();
    } else {
      setIsAutoLogging(false);
    }
  }, []); // Empty dependency array - only run once on mount

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      role: "",
      phone: "",
      specialization: "",
      department: "",
      qualification: "",
      licenseNumber: "",
      experienceYears: "",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -30 : 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: 0.1 },
    },
    exit: {
      opacity: 0,
      x: isLogin ? 30 : -30,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const clearForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      role: "",
      phone: "",
      specialization: "",
      department: "",
      qualification: "",
      licenseNumber: "",
      experienceYears: "",
    });
  };

  // Show loading while checking auto-login
  if (isAutoLogging) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-center">
          <motion.h1
            className="text-2xl font-bold text-white mb-2"
            key={isLogin ? "login-title" : "signup-title"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {isLogin ? "Welcome Back" : "Create Account"}
          </motion.h1>
          <motion.p
            className="text-blue-100 text-sm"
            key={isLogin ? "login-subtitle" : "signup-subtitle"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {isLogin ? "Sign in to your account" : "Join us today"}
          </motion.p>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login-form" : "signup-form"}
              onSubmit={handleSubmit}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your phone number"
                    required={!isLogin}
                  />
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mt-3">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required={!isLogin}
                  >
                    <option value="">Select your role</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Patient">Patient</option>
                    <option value="Pharmacist">Pharmacist</option>
                  </select>
                </motion.div>
              )}

              {!isLogin &&
                (formData.role === "Doctor" ||
                  formData.role === "Pharmacist") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="space-y-4 pt-4 border-t border-gray-200"
                  >
                    <p className="text-sm font-medium text-gray-700">
                      Professional Details
                    </p>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialization
                      </label>
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="e.g., Cardiology, Pediatrics"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="e.g., Cardiology Department"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qualification
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="e.g., MBBS, MD"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        License Number
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Medical license number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Years of experience"
                        min="0"
                        required
                      />
                    </div>
                  </motion.div>
                )}

              {isLogin && (
                <motion.div
                  className="text-right"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Forgot your password?
                  </a>
                </motion.div>
              )}

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {isLogin ? "Sign In" : "Create Account"}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-600 text-sm mb-2">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <motion.button
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 hover:underline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLogin ? "Sign up here" : "Sign in here"}
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          className="bg-gray-50 px-6 py-4 text-center border-t"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
