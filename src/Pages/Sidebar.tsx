"use client";

import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context"; // Using your auth context

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
    <aside className="bg-white shadow-lg border-r border-gray-200 w-64 min-h-screen flex flex-col">
      <div className="flex flex-col items-center gap-3 p-6 pb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl border-4 border-yellow-400 shadow-lg select-none">
          {getInitial()}
        </div>
        <div className="text-xl font-bold text-gray-800">
          {user?.first_name || user?.username}
        </div>
        <div className="text-sm text-gray-500 text-center">Plan your next adventure</div>
      </div>
      <nav className="flex flex-col gap-1 px-4 pb-6">
        <button
          className={`px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 flex items-center gap-3 ${
            window.location.pathname === "/dashboard"
              ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500 shadow-sm"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          }`}
          onClick={() => navigate("/dashboard")}
        >
          <span className="text-lg">📊</span> Dashboard
        </button>
        <button
          className={`px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 flex items-center gap-3 ${
            window.location.pathname === "/my-trips"
              ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500 shadow-sm"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          }`}
          onClick={() => navigate("/my-trips")}
        >
          <span className="text-lg">✈️</span> My Trips
        </button>
        <button
          className="px-4 py-3 rounded-lg text-left font-medium text-gray-400 cursor-not-allowed flex items-center gap-3 opacity-50"
          title="This feature is coming soon!"
          disabled
        >
          <span className="text-lg">🛂</span> Visa Assistance
        </button>
        <button
          className="px-4 py-3 rounded-lg text-left font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 flex items-center gap-3"
          onClick={() => navigate("/create-packages")}
        >
          <span className="text-lg">📝</span> Plan a Trip
        </button>
        <button
          className="px-4 py-3 rounded-lg text-left font-medium text-gray-400 cursor-not-allowed flex items-center gap-3 opacity-50"
          title="This feature is coming soon!"
          disabled
        >
          <span className="text-lg">👥</span> Groups
        </button>
        <button
          className="px-4 py-3 rounded-lg text-left font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 flex items-center gap-3"
          onClick={() => navigate("/community")}
        >
          <span className="text-lg">🌐</span> Community
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
