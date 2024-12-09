import { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Home, Users, Briefcase, Bell, Search, HelpCircle, ChevronDown } from 'lucide-react';
import ChangePasswordForm from './ChangePasswordForm'; // Importamos el formulario

const Navbar = ({ 
  userName, 
  userAvatar, 
  navItems = [
    { name: 'Home', isActive: true },
    { name: 'Projects', isActive: false },
    { name: 'Team', isActive: false }
  ],
  onSearchChange,
  onLogout
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Estado para el formulario de cambio de contraseña
  const history = useHistory();

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  const navigateToProfile = () => {
    history.push('/profile');
  };

  const handleChangePassword = (data) => {
    // Aquí puedes agregar la lógica para cambiar la contraseña
    console.log('Cambio de contraseña:', data);
    setIsSettingsOpen(false); // Cerrar el formulario después de enviar
  };

  const navigationIcons = {
    'Home': <Home className="w-5 h-5" />,
    'Projects': <Briefcase className="w-5 h-5" />,
    'Team': <Users className="w-5 h-5" />
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 flex items-center justify-between px-4 py-2 h-14">
      <div className="flex items-center">
        <img 
          src="/path/to/monday-logo.svg" 
          alt="Logo"
          className="h-8 mr-4"
        />
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={item.onClick}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ${
                item.isActive 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {navigationIcons[item.name] || null}
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-3 py-2 border rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">3</span>
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-full">
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>

        <div className="relative">
          <button onClick={toggleProfileDropdown} className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded-md">
            <img src={userAvatar || '/path/to/default-avatar.png'} alt={userName} className="w-8 h-8 rounded-full" />
            <span className="text-sm font-medium">{userName}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg">
              <div className="py-1">
                <button onClick={navigateToProfile} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Perfil</button>
                <button onClick={() => setIsSettingsOpen(true)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ajustes</button>
                <button onClick={() => { onLogout?.(); setIsProfileDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cerrar Sesión</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Cambiar Contraseña</h2>
            <ChangePasswordForm onSubmit={handleChangePassword} />
            <button onClick={() => setIsSettingsOpen(false)} className="absolute top-2 right-2 text-gray-500">X</button>
          </div>
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  userName: PropTypes.string.isRequired,
  userAvatar: PropTypes.string,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      onClick: PropTypes.func,
    })
  ).isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;
