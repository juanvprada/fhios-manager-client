//import React from "react";
import PropTypes from "prop-types";

const StatisticsCard = ({ title, value }) => {
  return (
    <li className="mt-4 p-3 bg-secondary-100 rounded-lg flex flex-col items-center">
      <p className="text-secondary-700 font-poppins text-sm">{title}</p>
      <p className="text-primary-500 text-lg font-bold">{value}</p>
    </li>
  );
};

// Validación de las props
StatisticsCard.propTypes = {
  title: PropTypes.string.isRequired,  // Validación para title (debe ser string)
  value: PropTypes.string.isRequired,  // Validación para value (debe ser string)
};

export default StatisticsCard;
