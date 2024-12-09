import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar.jsx";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex mt-14">
        <Sidebar />
        <div className="flex-1 p-4 md:ml-64">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
