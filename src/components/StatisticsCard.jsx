import React from "react";

const StatisticsCard = ({ title, value }) => {
  return (
    <li className="mt-4 p-3 bg-secondary-100 rounded-lg flex flex-col items-center">
      <p className="text-secondary-700 font-poppins text-sm">{title}</p>
      <p className="text-primary-500 text-lg font-bold">{value}</p>
    </li>
  );
};

export default StatisticsCard;
