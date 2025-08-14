"use client";

import type React from "react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context";
import ProfileDropdown from "./profile-dropdown";
// Tailwind conversion: all styles are now inline utility classes
import { Bell } from "react-feather";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [,] = useState(false);
  const _notifications = [
    { id: 1, text: "Your booking is confirmed!" },
    { id: 2, text: "New travel package available." },
    { id: 3, text: "Your visa application was approved." },
  ]; // TODO: Replace with real user notifications from API

  const goHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="sticky top-0 z-50 bg-white w-full border-b border-gray-200">
      <div className="w-full max-w-[1440px] mx-auto border-b border-gray-200 box-border flex flex-row items-center justify-between px-4 md:px-10 py-3 bg-white relative z-50">
        <div
          className="flex flex-row items-center gap-4 cursor-pointer"
          onClick={goHome}
        >
          <img
            className="w-8 h-8 transition-transform duration-300 hover:scale-110"
            alt="Logo"
            src="/Figma_photoes/wandernest.svg"
          />
          <b className="text-lg font-sans text-[#0d1c1c] text-left transition-colors duration-300 hover:text-[#4a6b5b]">
            WanderNest
          </b>
        </div>

        <div className="flex-1 flex flex-row items-center justify-end gap-8 flex-wrap">
          <div className="h-10 flex flex-row items-center gap-9 flex-wrap">
            <div
              className="flex flex-col items-start cursor-pointer"
              onClick={() => navigate("/destinations")}
            >
              <div className="text-sm font-medium font-sans text-[#0d1c1c] cursor-pointer">
                Destinations
              </div>
            </div>
            <div
              className="flex flex-col items-start cursor-pointer"
              onClick={() => navigate("/hotels-rooms")}
            >
              <div className="text-sm font-medium font-sans text-[#0d1c1c] cursor-pointer">
                Hotels
              </div>
            </div>
            <div
              className="flex flex-col items-start"
              title="This feature is coming soon!"
            >
              <div className="flex items-center gap-1.5 text-gray-400 cursor-not-allowed">
                Flights
                <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-md uppercase">
                  Upcoming
                </span>
              </div>
            </div>
            <div
              className="flex flex-col items-start cursor-pointer"
              onClick={() => navigate("/Packages")}
            >
              <div className="text-sm font-medium font-sans text-[#0d1c1c] cursor-pointer">
                Packages
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!loading && (
              <>
                {isAuthenticated ? (
                  <ProfileDropdown />
                ) : (
                  <>
                    <div
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => navigate("/signup")}
                    >
                      <div className="">
                        <b className="text-base font-semibold text-blue-600 hover:underline">
                          Sign up
                        </b>
                      </div>
                    </div>
                    <div
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => navigate("/login")}
                    >
                      <div className="">
                        <b className="text-base font-semibold text-blue-600 hover:underline">
                          Log in
                        </b>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            <span title="Notifications">
              <Bell
                size={26}
                style={{
                  marginLeft: 16,
                  color: "#FFD700",
                  verticalAlign: "middle",
                  cursor: "pointer",
                }}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
