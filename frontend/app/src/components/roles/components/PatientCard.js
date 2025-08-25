import React from "react";

const PatientCard = ({ patient, onStatusChange, onPrescribe }) => {
  const statusColor =
    patient.status === "Cancelled"
      ? "text-red-500"
      : patient.status === "Completed"
      ? "text-green-600"
      : "text-blue-500";

  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-2xl p-5 border border-gray-200 hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {patient.patientName}
      </h2>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Reason:</span> {patient.reason}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Gender:</span> {patient.gender}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Age:</span> {patient.age}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Date:</span> {patient.appointmentDate}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Time:</span> {patient.appointmentTime}
      </p>
      <p className={`font-medium ${statusColor}`}>Status: {patient.status}</p>

      {/* Action Buttons */}
      {patient.status === "Scheduled" && (
        <div className="mt-4 space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={() => onStatusChange(patient.id, "Completed")}
              className="flex-1 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-sm"
            >
              Complete
            </button>
            <button
              onClick={() => onStatusChange(patient.id, "Cancelled")}
              className="flex-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
            >
              Cancel
            </button>
          </div>
          <button
            onClick={() => onPrescribe(patient)}
            className="w-full bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center space-x-2"
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
            <span>📋 Prescribe</span>
          </button>
        </div>
      )}

      {patient.status === "Completed" && (
        <div className="mt-4">
          <button
            onClick={() => onPrescribe(patient)}
            className="w-full bg-indigo-500 text-white px-3 py-2 rounded-lg hover:bg-indigo-600 transition flex items-center justify-center space-x-2"
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
            <span>📋 View/Edit Prescription</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientCard;
