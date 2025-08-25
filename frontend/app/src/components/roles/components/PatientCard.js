import React from "react";

const PatientCard = ({ patient, onStatusChange }) => {
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

      {/* Action Buttons (only show if Scheduled) */}
      {patient.status === "Scheduled" && (
        <div className="mt-4 flex space-x-3">
          <button
            onClick={() => onStatusChange(patient.id, "Completed")}
            className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
          >
            Mark Completed
          </button>
          <button
            onClick={() => onStatusChange(patient.id, "Cancelled")}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientCard;
