"use client";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context"; // Using your auth context

import type { FunctionComponent } from "react";
import { FiBarChart2, FiMapPin, FiShield, FiFileText, FiUsers, FiBookOpen, FiSettings, FiLogOut } from "react-icons/fi";
const Sidebar: FunctionComponent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  const getInitial = () => {
    if (user?.first_name && user?.first_name.length > 0) {
      return user.first_name[0].toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || "U";
  };

  // Don't render sidebar if not authenticated
  if (!isAuthenticated && !loading) {
    return null;
  }
  return (
    <aside className="bg-[#1a2536] w-64 min-h-screen flex flex-col justify-between shadow-xl">
      <div>
        <div className="flex flex-col items-center gap-2 pt-8 pb-4">
          <div className="w-14 h-14 rounded-full bg-[#22c55e] text-white flex items-center justify-center font-bold text-2xl shadow-lg select-none">
            {getInitial()}
          </div>
          <div className="text-lg font-bold text-white mt-2">
            {user?.first_name || user?.username}
          </div>
          <div className="text-xs text-[#b6c2d6]">Travel Management</div>
        </div>
        <nav className="flex flex-col gap-1 px-6 pt-2">
          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-left transition-all duration-200 ${window.location.pathname === "/dashboard" ? "bg-[#174c3c] text-white" : "text-[#e2e8f0] hover:bg-[#22304a] hover:text-white"}`}
            onClick={() => navigate("/dashboard")}
          >
            <FiBarChart2 className="text-xl" /> Dashboard
          </button>
          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-left transition-all duration-200 ${window.location.pathname === "/my-trips" ? "bg-[#174c3c] text-white" : "text-[#e2e8f0] hover:bg-[#22304a] hover:text-white"}`}
            onClick={() => navigate("/my-trips")}
          >
            <FiMapPin className="text-xl" /> My Trips
          </button>
          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-left transition-all duration-200 ${window.location.pathname === "/visa-assistance" ? "bg-[#174c3c] text-white" : "text-[#e2e8f0] hover:bg-[#22304a] hover:text-white"}`}
            onClick={() => navigate("/visa-assistance")}
          >
            <FiShield className="text-xl" /> Visa Assistance
          </button>
          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-left transition-all duration-200 ${window.location.pathname === "/create-packages" ? "bg-[#174c3c] text-white" : "text-[#e2e8f0] hover:bg-[#22304a] hover:text-white"}`}
            onClick={() => navigate("/create-packages")}
          >
            <FiFileText className="text-xl" /> Plan a Trip
          </button>
          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-left transition-all duration-200 ${window.location.pathname === "/groups" ? "bg-[#174c3c] text-white" : "text-[#e2e8f0] hover:bg-[#22304a] hover:text-white"}`}
            onClick={() => navigate("/groups")}
          >
            <FiUsers className="text-xl" /> Groups
          </button>
          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-left transition-all duration-200 ${window.location.pathname === "/blogs" ? "bg-[#174c3c] text-white" : "text-[#e2e8f0] hover:bg-[#22304a] hover:text-white"}`}
            onClick={() => navigate("/blogs")}
          >
            <FiBookOpen className="text-xl" /> Blog
          </button>
        </nav>
        <div className="border-t border-[#22304a] mx-6 mt-6 pt-4">
          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-left text-[#b6c2d6] hover:bg-[#22304a] hover:text-white transition-all duration-200 w-full`}
            onClick={() => navigate("/settings")}
          >
            <FiSettings className="text-xl" /> Settings
          </button>
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-left text-red-500 border border-red-500 bg-transparent hover:bg-red-50 transition-all duration-200 mt-2"
            onClick={() => navigate("/logout")}
          >
            <FiLogOut className="text-xl" /> Sign Out
          </button>
        </div>
      </div>
      <div className="h-6" />
    </aside>
  );
};

export default Sidebar;
