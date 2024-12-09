import React, { useState } from "react";
import {
  Bell,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

const Navbar = ({
  userName,
  userAvatar,
  navItems = [
    { name: "Home", isActive: true },
    { name: "Projects", isActive: false },
    { name: "Team", isActive: false },
  ],
  onLogout,
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-secondary-50 via-light to-secondary-100 shadow-lg z-50 flex items-center justify-between px-6 py-3">
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="flex items-center justify-center h-10 w-10 bg-primary-500 text-white rounded-full mr-4">
          <span className="font-bold text-lg">FM</span>
        </div>
        {/* <img
          src="/path/to/monday-logo.svg"
          alt="Monday.com Logo"
          className="h-8 mr-4"
        /> */}

        {/* Placeholder for Fhios Manager */}
        <h1 className="text-xl font-bold text-primary-600">Fhios Manager</h1>

        {/* Navigation Links */}
        {/* <div className="flex space-x-4">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={item.onClick}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ${
                item.isActive
                  ? "bg-primary-100 text-primary-600"
                  : "hover:bg-secondary-200 text-secondary-700"
              }`}
            >
              {navigationIcons[item.name] || null}
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
        </div> */}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-secondary-200 rounded-full">
          <Bell className="w-5 h-5 text-secondary-600" />
          <span className="absolute top-0 right-0 bg-primary-500 text-white text-xs rounded-full px-1.5 py-0.5">
            3
          </span>
        </button>

        {/* Help */}
        <button className="p-2 hover:bg-secondary-200 rounded-full">
          <HelpCircle className="w-5 h-5 text-secondary-600" />
        </button>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center space-x-2 hover:bg-secondary-200 px-3 py-2 rounded-md"
          >
            <img
              src={userAvatar || "/path/to/default-avatar.png"}
              alt={userName}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-secondary-700">
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

