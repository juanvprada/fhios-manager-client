import React, { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useStore from '../store/store';
import NotificationBell from './NotificationBell';
import NotificationDropdown from '../components/NotificationsDropdown';

const Navbar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/login');
  };

  const handleNavigateToProfile = () => {
    setIsProfileDropdownOpen(false);
    navigate('/profile');
  };

  // Función para obtener las iniciales
  const getInitials = () => {
    if (!user) return 'U';
    return `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase();
  };

  // Función para obtener el nombre completo
  const getFullName = () => {
    if (!user) return 'Usuario';
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-secondary-50 via-light to-secondary-100 shadow-lg z-50 flex items-center justify-between px-4 sm:px-6 py-3">
      {/* Logo y Menú Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-secondary-200 rounded-full text-primary-500"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center">
          <div className="hidden md:flex items-center justify-center h-10 w-10 bg-primary-500 text-white rounded-full mr-4">
            <span className="font-bold text-lg">FM</span>
          </div>
          <h1 className="text-xl font-bold text-primary-600 hidden sm:block">Fhios Manager</h1>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Notifications - Solo mostrar si hay usuario logueado */}
        {user && (
          <div className="relative">
            <NotificationBell onClick={toggleNotifications} />
            <NotificationDropdown
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>
        )}

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center space-x-2 hover:bg-secondary-200 px-2 sm:px-3 py-2 rounded-md"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-secondary-500 text-white rounded-full">
              <span className="font-bold text-sm">{getInitials()}</span>
            </div>
            <span className="text-sm font-medium text-secondary-700 hidden sm:block">
              {getFullName()}
            </span>
            <ChevronDown className="w-4 h-4 text-secondary-600" />
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-500">
                  {user?.email}
                </div>
                <hr />
                <button
                  onClick={handleNavigateToProfile}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mi Perfil
                </button>
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Configuración
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

