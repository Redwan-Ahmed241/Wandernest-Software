"use client";

import type React from "react";
import { useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context";
import ProfileDropdown from "./profiledropdown";
import { Menu, X } from "react-feather";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true); // Assume unread notifications by default

  const goHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const navItems = [
    { label: "Destinations", path: "/destinations", available: true },
    { label: "Hotels", path: "/hotels-rooms", available: true },
    {
      label: "Flights",
      path: "/flights",
      available: true,
    },
    { label: "Packages", path: "/packages", available: true },
    { label: "Things to Do", path: "/things-to-do", available: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={goHome}
          >
            <img
              src="/Figma_photos/Gemini_Generated_Image_8c7rnh8c7rnh8c7r.svg"
              alt="WanderNest Logo"
              className="w-14 h-14 object-cover object-center rounded-full"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-black">
              WanderNest
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div key={item.label} className="relative">
                  {item.available ? (
                    <button
                      onClick={() => navigate(item.path)}
                      className={`font-medium transition-all duration-200 px-4 py-2 rounded-lg ${
                        isActive
                          ? "text-white bg-[#6ab187] shadow-lg scale-105 font-semibold"
                          : "text-gray-700 hover:text-primary hover:scale-105 hover:bg-primary/10"
                      }`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-medium px-3 py-2">
                        {item.label}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Auth & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <ProfileDropdown />
                    <div className="relative">
                      <button
                        className="relative p-2 text-gray-600 hover:text-primary transition-colors duration-200"
                        onClick={() => {
                          setShowNotifications((prev) => !prev);
                          setHasUnread(false); // Mark notifications as read when opened
                        }}
                        aria-label="Notifications"
                      >
                        <span className="inline-block">
                          {/* Modern filled bell SVG icon */}
                          <svg
                            className="w-7 h-7"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: hasUnread ? "#6ab187" : "#6ab187" }}
                          >
                            <path d="M12 2C8.13 2 5 5.13 5 9v4.28c0 .44-.18.86-.5 1.18l-1.3 1.3A1 1 0 004 17h16a1 1 0 00.8-1.74l-1.3-1.3a1.7 1.7 0 01-.5-1.18V9c0-3.87-3.13-7-7-7zm0 20a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0012 22z" />
                          </svg>
                        </span>
                        {hasUnread && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                      </button>
                      {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 z-50 animate-fade-in">
                          <div className="p-4 border-b border-gray-100 font-bold text-gray-900 flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-primary"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Notifications
                          </div>
                          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                            {/* Example notifications, replace with real data */}
                            <div className="flex gap-3 items-start p-4 hover:bg-primary/5 cursor-pointer">
                              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-primary"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <div>
                                <div className="font-semibold text-primary">
                                  Booking Confirmed
                                </div>
                                <div className="text-gray-700 text-sm">
                                  Your booking for Hotel Sundarbans is
                                  confirmed.
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  2 hours ago
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3 items-start p-4 hover:bg-primary/5 cursor-pointer">
                              <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-accent"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3"
                                  />
                                </svg>
                              </div>
                              <div>
                                <div className="font-semibold text-accent">
                                  Trip Reminder
                                </div>
                                <div className="text-gray-700 text-sm">
                                  Your trip to Cox's Bazar starts tomorrow.
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  1 day ago
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3 items-start p-4 hover:bg-primary/5 cursor-pointer">
                              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3"
                                  />
                                </svg>
                              </div>
                              <div>
                                <div className="font-semibold text-green-600">
                                  Payment Received
                                </div>
                                <div className="text-gray-700 text-sm">
                                  We have received your payment for the Dhaka
                                  City Tour.
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  3 days ago
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            className="w-full py-2 text-center text-primary font-semibold hover:bg-primary/10 rounded-b-xl border-t border-gray-100"
                            onClick={() => setShowNotifications(false)}
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate("/login")}
                      className="px-6 py-2 bg-white text-accent font-bold rounded-lg border border-accent/40 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent hover:bg-transparent hover:text-accent hover:border-accent hover:shadow-lg hover:scale-105"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => navigate("/signup")}
                      className="relative z-10 px-6 py-2 bg-[#6ab187] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-primary transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <div key={item.label}>
                    {item.available ? (
                      <button
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isActive
                            ? "text-white bg-[#6ab187] shadow-lg font-semibold"
                            : "text-gray-700 hover:text-primary hover:bg-primary/10"
                        }`}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-gray-400 font-medium">
                          {item.label}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {!loading && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/10 rounded-lg font-medium transition-all duration-200"
                      >
                        Dashboard
                      </button>
                      <div className="px-3 py-2">
                        <ProfileDropdown />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          navigate("/login");
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/10 rounded-lg font-medium transition-all duration-200"
                      >
                        Log in
                      </button>
                      <button
                        onClick={() => {
                          navigate("/signup");
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full px-3 py-2 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        Sign up
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
