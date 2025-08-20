"use client";

import type React from "react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context";
import ProfileDropdown from "./profile-dropdown";
import { Bell, Menu, X } from "react-feather";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const goHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const navItems = [
    { label: "Destinations", path: "/destinations", available: true },
    { label: "Hotels", path: "/hotels-rooms", available: true },
    { label: "Flights", path: "/flights", available: false, badge: "Coming Soon" },
    { label: "Packages", path: "/packages", available: true },
    { label: "Things to Do", path: "/things-to-do", available: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={goHome}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <img
                src="/figma_photos/wandernest.svg"
                alt="WanderNest"
                className="w-6 h-6 filter brightness-0 invert"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              WanderNest
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.available ? (
                  <button
                    onClick={() => navigate(item.path)}
                    className="text-gray-700 hover:text-primary font-medium transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-primary/10"
                  >
                    {item.label}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium px-3 py-2">
                      {item.label}
                    </span>
                    <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Auth & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <button className="relative p-2 text-gray-600 hover:text-primary transition-colors duration-200">
                      <Bell size={20} />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    </button>
                    <ProfileDropdown />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate("/login")}
                      className="px-4 py-2 text-gray-700 font-medium hover:text-primary transition-colors duration-200"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => navigate("/signup")}
                      className="px-6 py-2 bg-gradient-to-r from-accent to-primary-light text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
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
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.available ? (
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/10 rounded-lg font-medium transition-all duration-200"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-gray-400 font-medium">{item.label}</span>
                      <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>
              ))}

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