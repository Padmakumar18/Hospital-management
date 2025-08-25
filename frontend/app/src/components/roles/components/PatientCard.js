import React from "react";

const PatientCard = ({ patient }) => {
  // dynamic color for status
  const statusColor =
    patient.status === "Cancelled"
      ? "text-red-500"
      : patient.status === "Completed"
      ? "text-green-600"
      : "text-blue-500"; // Scheduled

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
      <p className={`font-medium ${statusColor}`}>Status: {patient.status}</p>
    </div>
  );
};

export default PatientCard;
