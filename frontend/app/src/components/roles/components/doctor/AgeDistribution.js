import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AgeDistribution = ({ filteredAppointments }) => {
  const ageGroups = [
    {
      name: "0 - 20",
      count: filteredAppointments.filter((p) => p.age >= 1 && p.age <= 20)
        .length,
    },
    {
      name: "21 - 35",
      count: filteredAppointments.filter((p) => p.age > 20 && p.age <= 35)
        .length,
    },
    {
      name: "Above 35",
      count: filteredAppointments.filter((p) => p.age > 35).length,
    },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={ageGroups}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgeDistribution;
