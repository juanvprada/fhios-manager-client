import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar.jsx";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        userName="John Doe"
        userAvatar="/path/to/avatar.jpg"
        onLogout={() => console.log('Logout clicked')}
      />
      <div className="flex mt-14">
        <Sidebar 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <div className="flex-1 p-4 md:ml-64 min-h-[calc(100vh-3.5rem)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

