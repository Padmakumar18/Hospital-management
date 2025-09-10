import React from "react";
import { motion } from "framer-motion";

// Main Loading Component
const Loading = ({
  type = "default",
  message = "Loading...",
  size = "medium",
  overlay = false,
  fullScreen = false,
}) => {
  const getSize = () => {
    switch (size) {
      case "small":
        return "w-6 h-6";
      case "large":
        return "w-16 h-16";
      case "xl":
        return "w-24 h-24";
      default:
        return "w-10 h-10";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "small":
        return "text-sm";
      case "large":
        return "text-lg";
      case "xl":
        return "text-xl";
      default:
        return "text-base";
    }
  };

  const LoadingContent = () => {
    switch (type) {
      case "spinner":
        return <SpinnerLoader size={getSize()} />;
      case "dots":
        return <DotsLoader size={size} />;
      case "pulse":
        return <PulseLoader size={getSize()} />;
      case "skeleton":
        return <SkeletonLoader />;
      case "search":
        return <SearchLoader size={getSize()} />;
      case "medical":
        return <MedicalLoader size={getSize()} />;
      default:
        return <DefaultLoader size={getSize()} />;
    }
  };

  const containerClasses = `
    flex flex-col items-center justify-center space-y-4
    ${fullScreen ? "fixed inset-0 bg-white z-50" : ""}
    ${overlay ? "absolute inset-0 bg-white bg-opacity-90 z-40" : ""}
  `;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={containerClasses}
    >
      <LoadingContent />
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-gray-600 font-medium ${getTextSize()}`}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

// Default Spinner Loader
const DefaultLoader = ({ size }) => (
  <motion.div
    className={`${size} border-4 border-blue-200 border-t-blue-600 rounded-full`}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);

// Spinner Loader with gradient
const SpinnerLoader = ({ size }) => (
  <motion.div
    className={`${size} relative`}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 border-r-blue-400 rounded-full"></div>
    <div className="absolute inset-1 border-4 border-transparent border-t-purple-600 border-r-purple-400 rounded-full"></div>
  </motion.div>
);

// Dots Loader
const DotsLoader = ({ size }) => {
  const dotSize =
    size === "small" ? "w-2 h-2" : size === "large" ? "w-4 h-4" : "w-3 h-3";

  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${dotSize} bg-blue-600 rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
};

// Pulse Loader
const PulseLoader = ({ size }) => (
  <motion.div
    className={`${size} bg-blue-600 rounded-full`}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
    }}
  />
);

// Skeleton Loader for content
const SkeletonLoader = () => (
  <div className="w-full max-w-md space-y-4">
    {[1, 2, 3].map((index) => (
      <div key={index} className="animate-pulse">
        <div className="flex space-x-4">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Search Loader
const SearchLoader = ({ size }) => (
  <motion.div className="relative">
    <motion.div
      className={`${size} border-4 border-gray-200 border-t-blue-600 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <svg
        className="w-4 h-4 text-blue-600"
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
    </motion.div>
  </motion.div>
);

// Medical/Hospital themed loader
const MedicalLoader = ({ size }) => (
  <motion.div className="relative">
    <motion.div
      className={`${size} border-4 border-green-200 border-t-green-600 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <svg
        className="w-6 h-6 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </motion.div>
  </motion.div>
);

// Loading Button Component
export const LoadingButton = ({
  loading = false,
  children,
  className = "",
  disabled = false,
  loadingText = "Loading...",
  ...props
}) => (
  <button
    className={`relative flex items-center justify-center space-x-2 ${className} ${
      loading || disabled ? "opacity-70 cursor-not-allowed" : ""
    }`}
    disabled={loading || disabled}
    {...props}
  >
    {loading && (
      <motion.div
        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    )}
    <span>{loading ? loadingText : children}</span>
  </button>
);

// Loading Overlay Component
export const LoadingOverlay = ({
  loading = false,
  children,
  message = "Loading...",
  type = "default",
}) => (
  <div className="relative">
    {children}
    {loading && (
      <Loading type={type} message={message} overlay={true} size="large" />
    )}
  </div>
);

// Page Loading Component
export const PageLoading = ({ message = "Loading page..." }) => (
  <Loading type="medical" message={message} fullScreen={true} size="xl" />
);

// Search Loading Component
export const SearchLoading = ({ message = "Searching..." }) => (
  <div className="flex items-center justify-center py-8">
    <Loading type="search" message={message} size="medium" />
  </div>
);

// Card Loading Component
export const CardLoading = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="animate-pulse">
      <div className="flex space-x-4">
        <div className="rounded-full bg-gray-300 h-12 w-12"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

// Table Loading Component
export const TableLoading = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="animate-pulse">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-t border-gray-200 px-6 py-4">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Loading Hook for async operations
export const useLoading = (initialState = false) => {
  const [loading, setLoading] = React.useState(initialState);

  const withLoading = async (asyncFunction) => {
    setLoading(true);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      setLoading(false);
    }
  };

  return { loading, setLoading, withLoading };
};

export default Loading;
