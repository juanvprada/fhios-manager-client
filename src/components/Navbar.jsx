import React, { useState } from "react";
import { Bell, ChevronDown, Menu } from "lucide-react";

const Navbar = ({
  userName,
  userAvatar,
  navItems = [
    { name: "Home", isActive: true },
    { name: "Projects", isActive: false },
    { name: "Team", isActive: false },
  ],
  onLogout,
  isOpen,
  setIsOpen
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
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
          <div className="flex items-center justify-center h-10 w-10 bg-primary-500 text-white rounded-full mr-4">
            <span className="font-bold text-lg">FM</span>
          </div>
          <h1 className="text-xl font-bold text-primary-600 hidden sm:block">Fhios Manager</h1>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-secondary-200 rounded-full">
          <Bell className="w-5 h-5 text-secondary-600" />
          <span className="absolute top-0 right-0 bg-primary-500 text-white text-xs rounded-full px-1.5 py-0.5">
            3
          </span>
        </button>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center space-x-2 hover:bg-secondary-200 px-2 sm:px-3 py-2 rounded-md"
          >
            <img
              src={userAvatar || "/path/to/default-avatar.png"}
              alt={userName}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-secondary-700 hidden sm:block">
              {userName}
            </span>
            <ChevronDown className="w-4 h-4 text-secondary-600" />
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    onLogout?.();
                    setIsProfileDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
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

