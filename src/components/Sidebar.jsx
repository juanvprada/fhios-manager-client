import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import menuItemsConfig from "./menuItemsConfig";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleItemClick = (route) => {
    setIsOpen(false);
    navigate(route);
  };

  return (
    <>
      {/* Botón de menú hamburguesa (visible en móviles) */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-2 bg-secondary-50 shadow-md rounded-md md:hidden"
      >
        <span className="material-icons text-primary-500 text-2xl">menu</span>
      </button>

      {/* Menú desplegable debajo del botón (en móviles) */}
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

      {/* Sidebar completo (visible en Desktop) */}
      <div className="hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:w-64 md:h-screen bg-gradient-to-b from-secondary-50 via-light to-secondary-100 shadow-xl">
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
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;





