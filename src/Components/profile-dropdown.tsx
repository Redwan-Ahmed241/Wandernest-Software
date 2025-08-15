"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context";

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm("Do you want to logout?");
    if (!confirmLogout) return;
    try {
      // Check if this is a mock token (starts with "mock-jwt-token-")
      const token = localStorage.getItem("token");
      const isMockToken = token && token.startsWith("mock-jwt-token-");

      if (!isMockToken) {
        // Only call logout API for real tokens
        console.log("Calling logout API for real authentication");
        await fetch("https://wander-nest-ad3s.onrender.com/api/auth/logout/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        console.log("Mock logout - skipping API call");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with logout even if API call fails
    } finally {
      console.log("Logging out user and redirecting to home");
      logout();
      navigate("/");
    }
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || "U";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg bg-white shadow hover:bg-gray-100 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow">
          {getInitials()}
        </div>
        <span className="ml-2 font-medium text-gray-800">
          {user?.first_name || user?.username}
        </span>
        <svg
          className={`ml-2 w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 border border-gray-200 animate-fade-in">
          <div className="px-4 py-3">
            <div className="font-semibold text-gray-900">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </div>
          <hr className="my-2 border-t border-gray-200" />
          <div
            className="px-4 py-2 cursor-pointer hover:bg-primary/10 text-gray-800 transition rounded"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </div>
          <div
            className="px-4 py-2 cursor-pointer hover:bg-primary/10 text-gray-800 transition rounded"
            onClick={() => navigate("/profile-settings")}
          >
            Profile Settings
          </div>
          <hr className="my-2 border-t border-gray-200" />
          <div
            className="px-4 py-2 cursor-pointer text-red-600 hover:bg-red-50 transition rounded font-semibold"
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
