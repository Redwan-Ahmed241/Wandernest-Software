"use client";

import type React from "react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context";
import ProfileDropdown from "./profile-dropdown";
// Tailwind conversion: remove CSS module import
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
    <div className="sticky top-0 z-[100] bg-white w-full border-b border-[#e5e8eb]">
      <div className="w-full max-w-[1440px] mx-auto border-b border-[#e5e8eb] box-border flex flex-row items-center justify-between py-3 px-10 bg-white relative z-[1000]">
        <div className="flex flex-row items-center justify-start gap-4 cursor-pointer group">
          <img
            className="w-8 h-8 transition-transform duration-300 ease-in-out hover:scale-110"
            alt="Logo"
            src="/Figma_photos/wandernest.svg"
          />
          <div
            className="flex flex-col items-start justify-start cursor-pointer"
            onClick={goHome}
          >
            <b className="text-[18px] leading-[23px] font-['Plus Jakarta Sans'] text-[#0d1c1c] text-left transition-colors duration-300 group-hover:text-[#4a6b5b]">
              WanderNest
            </b>
          </div>
        </div>

        <div className="flex-1 flex flex-row items-center justify-end gap-8 flex-wrap">
          <div className="h-10 flex flex-row items-center justify-start gap-9 flex-wrap">
            <div
              className="flex flex-col items-start justify-start cursor-pointer"
              onClick={() => navigate("/destinations")}
            >
              <div className="text-[14px] leading-[21px] font-medium font-['Plus Jakarta Sans'] text-[#0d1c1c] cursor-pointer transition-all duration-300 hover:bg-[rgba(106,177,135,0.18)] hover:rounded-[14px] hover:shadow-[0_8px_32px_0_rgba(106,177,135,0.25),0_1.5px_8px_0_rgba(78,148,79,0.1)] hover:scale-105">
                Destinations
              </div>
            </div>
            <div
              className="flex flex-col items-start justify-start cursor-pointer"
              onClick={() => navigate("/hotels-rooms")}
            >
              <div className="text-[14px] leading-[21px] font-medium font-['Plus Jakarta Sans'] text-[#0d1c1c] cursor-pointer transition-all duration-300 hover:bg-[rgba(106,177,135,0.18)] hover:rounded-[14px] hover:shadow-[0_8px_32px_0_rgba(106,177,135,0.25),0_1.5px_8px_0_rgba(78,148,79,0.1)] hover:scale-105">
                Hotels
              </div>
            </div>
            <div
              className="flex flex-col items-start justify-start"
              title="This feature is coming soon!"
            >
              <div className="flex items-center gap-[6px] text-[#999] cursor-not-allowed text-[14px] leading-[21px] font-medium font-['Plus Jakarta Sans']">
                Flights
                <span className="bg-[#ff9800] text-white text-[0.65rem] px-[6px] py-[2px] rounded-[6px] uppercase">
                  Upcoming
                </span>
              </div>
            </div>
            <div
              className="flex flex-col items-start justify-start cursor-pointer"
              onClick={() => navigate("/Packages")}
            >
              <div className="text-[14px] leading-[21px] font-medium font-['Plus Jakarta Sans'] text-[#0d1c1c] cursor-pointer transition-all duration-300 hover:bg-[rgba(106,177,135,0.18)] hover:rounded-[14px] hover:shadow-[0_8px_32px_0_rgba(106,177,135,0.25),0_1.5px_8px_0_rgba(78,148,79,0.1)] hover:scale-105">
                Packages
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-start gap-2">
            {!loading && (
              <>
                {isAuthenticated ? (
                  // Show profile dropdown when authenticated
                  <ProfileDropdown />
                ) : (
                  // Show login/signup buttons when not authenticated
                  <>
                    <div
                      className="w-[84px] h-10 rounded-[12px] flex items-center justify-center px-4 box-border flex-shrink-0 cursor-pointer transition-all duration-300 bg-[#abb79a] hover:bg-[rgba(106,177,135,0.18)] hover:rounded-[14px] hover:shadow-[0_8px_32px_0_rgba(106,177,135,0.25),0_1.5px_8px_0_rgba(78,148,79,0.1)] hover:scale-105"
                      onClick={() => navigate("/signup")}
                    >
                      <div className="flex flex-col items-center justify-start">
                        <b className="text-[14px] leading-[21px] font-['Plus Jakarta Sans'] text-[#0d1c1c] text-center whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 hover:bg-[rgba(106,177,135,0.18)] hover:rounded-[14px] hover:shadow-[0_8px_32px_0_rgba(106,177,135,0.25),0_1.5px_8px_0_rgba(78,148,79,0.1)] hover:scale-105">
                          Sign up
                        </b>
                      </div>
                    </div>
                    <div
                      className="w-[84px] h-10 rounded-[12px] flex items-center justify-center px-4 box-border flex-shrink-0 cursor-pointer transition-all duration-300 bg-[#e8f2f2] hover:bg-[rgba(106,177,135,0.18)] hover:rounded-[14px] hover:shadow-[0_8px_32px_0_rgba(106,177,135,0.25),0_1.5px_8px_0_rgba(78,148,79,0.1)] hover:scale-105"
                      onClick={() => navigate("/login")}
                    >
                      <div className="flex flex-col items-center justify-start">
                        <b className="text-[14px] leading-[21px] font-['Plus Jakarta Sans'] text-[#0d1c1c] text-center whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 hover:bg-[rgba(106,177,135,0.18)] hover:rounded-[14px] hover:shadow-[0_8px_32px_0_rgba(106,177,135,0.25),0_1.5px_8px_0_rgba(78,148,79,0.1)] hover:scale-105">
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
