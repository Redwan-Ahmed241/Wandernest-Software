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
    <aside className="bg-white shadow rounded-lg p-4 w-64 min-h-screen flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-3xl border-2 border-yellow-600 select-none">
          {getInitial()}
        </div>
        <div className="text-lg font-semibold text-primary-700">
          {user?.first_name || user?.username}
        </div>
        <div className="text-sm text-gray-500">Plan your next adventure</div>
      </div>
      <nav className="flex flex-col gap-2">
        <button
          className={`px-4 py-2 rounded text-left font-medium ${
            window.location.pathname === "/dashboard"
              ? "bg-primary-100 text-primary-700"
              : "text-gray-700"
          }`}
          onClick={() => navigate("/dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={`px-4 py-2 rounded text-left font-medium ${
            window.location.pathname === "/my-trips"
              ? "bg-primary-100 text-primary-700"
              : "text-gray-700"
          }`}
          onClick={() => navigate("/my-trips")}
        >
          ●●● My Trips
        </button>
        <button
          className="px-4 py-2 rounded text-left font-medium text-gray-400 cursor-not-allowed"
          title="This feature is coming soon!"
          disabled
        >
          🛂 Visa Assistance
        </button>
        <button
          className="px-4 py-2 rounded text-left font-medium"
          onClick={() => navigate("/create-packages")}
        >
          <span className="text-gray-700">N</span> Plan a Trip
        </button>
        <button
          className="px-4 py-2 rounded text-left font-medium text-gray-400 cursor-not-allowed"
          title="This feature is coming soon!"
          disabled
        >
          <span className="text-gray-700">👥</span> Groups
        </button>
        <button
          className="px-4 py-2 rounded text-left font-medium"
          onClick={() => navigate("/community")}
        >
          <span className="text-gray-700">🌐</span> Community
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
