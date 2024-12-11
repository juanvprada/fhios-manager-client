import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; // Importa PropTypes
import menuItemsConfig from "./menuItemsConfig";
import StatisticsCard from "./StatisticsCard";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const handleItemClick = (route) => {
    setIsOpen(false);
    navigate(route);
  };

  return (
    <>
      {/* Sidebar completo (visible en Desktop) */}
      <div className="hidden md:flex md:flex-col md:fixed md:top-14 md:left-0 md:w-64 md:h-[calc(100vh-3.5rem)] bg-gradient-to-b from-secondary-50 via-light to-secondary-100 shadow-xl">
        <nav className="p-6">
          <ul>
            {menuItemsConfig.map((item, index) => (
              <li
                key={index}
                onClick={() => navigate(item.route)}
                className="flex items-center gap-3 md:gap-4 p-3 rounded-lg hover:bg-primary-100 cursor-pointer transition duration-300 ease-in-out"
              >
                <span className="material-icons text-primary-500 text-xl md:text-2xl">
                  {item.icon}
                </span>
                <span className="text-primary-500 font-semibold text-base md:text-lg font-poppins">
                  {item.label}
                </span>
              </li>
            ))}
            <StatisticsCard title="Proyectos activos" value="12" />
          </ul>
        </nav>
      </div>

      {/* Menú desplegable (en móviles) */}
      {isOpen && (
        <div className="absolute top-16 left-4 w-56 bg-gradient-to-b from-secondary-50 via-light to-secondary-100 shadow-lg rounded-lg z-40 md:hidden">
          <nav className="p-4">
            <ul>
              {menuItemsConfig.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleItemClick(item.route)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-100 cursor-pointer transition duration-300 ease-in-out"
                >
                  <span className="material-icons text-primary-500 text-xl">
                    {item.icon}
                  </span>
                  <span className="text-primary-500 font-semibold text-base font-poppins">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

// Agrega las validaciones de PropTypes
Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default Sidebar;





