//import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <div className="flex-1 p-4 relative">
        <Outlet />
      </div>
    </div>
  );
};



export default Layout;
