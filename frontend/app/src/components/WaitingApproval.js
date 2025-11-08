import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const WaitingApproval = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user info from navigation state or use defaults
  const {
    userEmail = "user@hospital.com",
    userName = "User",
    userRole = "Doctor/Pharmacist",
  } = location.state || {};

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 text-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="inline-block"
            >
              <svg
                className="w-24 h-24 mx-auto text-white"
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
            </motion.div>
            <h1 className="text-3xl font-bold text-white mt-4">
              Pending Approval
            </h1>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome, {userName}!
              </h2>
              <p className="text-gray-600">
                Your {userRole} account is being reviewed
              </p>
            </div>

            {/* Status Card */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Account Verification Required
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Your account has been created successfully, but it needs
                      to be verified by an administrator before you can access
                      the system.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information */}
            <div className="space-y-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>
                      An administrator will review your credentials and
                      qualifications
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>
                      You will receive approval once your account is verified
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>
                      After approval, you can login and access all features
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2 flex items-center">
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
                  Your Information
                </h3>
                <div className="space-y-1 text-sm text-green-800">
                  <p>
                    <span className="font-medium">Email:</span> {userEmail}
                  </p>
                  <p>
                    <span className="font-medium">Role:</span> {userRole}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> Pending
                    Verification
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Estimated Time
                </h3>
                <p className="text-sm text-purple-800">
                  Account verification typically takes 24-48 hours. You will be
                  notified once your account is approved.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleBackToLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Login
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Need help?{" "}
                  <a
                    href="mailto:admin@hospital.com"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center">
            <p className="text-xs text-gray-500">
              Please check back later or contact the administrator if you have
              any questions.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WaitingApproval;
