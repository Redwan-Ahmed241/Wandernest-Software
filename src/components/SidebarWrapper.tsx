import React from "react";
import Sidebar from "../Pages/Sidebar";

const SidebarWrapper: React.FC<{ sidebarVisible: boolean }> = ({ sidebarVisible }) => (
  <div
  className={`fixed top-16 left-0 z-[999] transition-all duration-500 ${sidebarVisible ? 'w-64' : 'w-0'} h-[calc(100vh-4rem)]`}
    style={{ overflow: 'hidden' }}
  >
    <Sidebar />
  </div>
);

export default SidebarWrapper;