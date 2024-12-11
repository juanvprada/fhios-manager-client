import PropTypes from 'prop-types'; // Importa PropTypes

const StatisticsCard = ({ title, value }) => {
  return (
    <li className="mt-4 p-3 bg-secondary-100 rounded-lg flex flex-col items-center">
      <p className="text-secondary-700 font-poppins text-sm">{title}</p>
      <p className="text-primary-500 text-lg font-bold">{value}</p>
    </li>
  );
};

// Agrega las validaciones de PropTypes
StatisticsCard.propTypes = {
  title: PropTypes.string.isRequired, // title debe ser una cadena (string) y es obligatorio
  value: PropTypes.string.isRequired, // value debe ser una cadena (string) y es obligatorio
};

export default StatisticsCard;
