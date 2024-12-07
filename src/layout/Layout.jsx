import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar  className=""/>
      <div className="flex-1  p-4 mt-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
