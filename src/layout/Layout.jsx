//import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar.jsx";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
