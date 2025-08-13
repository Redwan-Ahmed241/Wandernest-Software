"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../Authentication/auth-context"
import ProfileDropdown from "./profile-dropdown"
import { Bell } from 'react-feather'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()
  const [,] = useState(false)
  const _notifications = [
    { id: 1, text: "Your booking is confirmed!" },
    { id: 2, text: "New travel package available." },
    { id: 3, text: "Your visa application was approved." },
  ] // TODO: Replace with real user notifications from API

  const goHome = useCallback(() => {
    navigate("/")
  }, [navigate])

  return (
    <div className="sticky top-0 z-[100] bg-white w-full border-b border-[#e5e8eb]">
      <div className="w-full max-w-[1440px] mx-auto border-b border-[#e5e8eb] box-border flex flex-row items-center justify-between py-3 px-10 bg-white relative z-[1000]">
        <div className="flex flex-row items-center justify-start gap-4 cursor-pointer" onClick={goHome}>
          <img className="w-8 h-8 transition-transform duration-300 hover:scale-110" alt="Logo" src="/Figma_photoes/wandernest.svg" />
          <div className="flex flex-col items-start justify-start cursor-pointer">
            <b className="text-lg leading-6 font-['Plus_Jakarta_Sans'] text-[#0d1c1c] text-left transition-colors duration-300 hover:text-[#4a6b5b]">WanderNest</b>
          </div>
        </div>

        <div className="flex-1 flex flex-row items-center justify-end gap-8 flex-wrap">
          <div className="h-10 flex flex-row items-center justify-start gap-9 flex-wrap">
            <div className="flex flex-col items-start justify-start cursor-pointer" onClick={() => navigate("/destinations")}>
              <div className="text-sm leading-5 font-medium font-['Plus_Jakarta_Sans'] text-[#0d1c1c] cursor-pointer transition-all duration-300 hover:text-[#0d1c1c] hover:bg-[rgba(106,177,135,0.18)] hover:rounded-[14px] hover:shadow-[0_8px_32px_0_rgba(106,177,135,0.25),0_1.5px_8px_0_rgba(78,148,79,0.1)] hover:scale-[1.04] px-2 py-1">Destinations</div>
            </div>
            <div className="flex flex-col items-start justify-start cursor-pointer" onClick={() => navigate("/hotels-rooms")}>
              <div className="text-sm leading-5 font-medium font-['Plus_Jakarta_Sans'] text-[#0d1c1c] cursor-pointer transition-all duration-300 hover:text-[#0d1c1c] hover:bg-[rgba(106,177,135,0.18)] hover:rounded-[14px] hover:shadow-[0_8px_32px_0_rgba(106,177,135,0.25),0_1.5px_8px_0_rgba(78,148,79,0.1)] hover:scale-[1.04] px-2 py-1">Hotels</div>
            </div>
            <div className="flex flex-col items-start justify-start" title="This feature is coming soon!">
              <div className="flex items-center gap-1.5 text-[#999] cursor-not-allowed text-sm leading-5 font-medium font-['Plus_Jakarta_Sans']">
    Flights
                <span className="bg-[#ff9800] text-white text-[0.65rem] py-0.5 px-1.5 rounded-md uppercase">
      Upcoming
    </span>
  </div>
</div>

            <div className="flex flex-col items-start justify-start cursor-pointer" onClick={() => navigate("/Packages")}>
              <div className="text-sm leading-5 font-medium font-['Plus_Jakarta_Sans'] text-[#0d1c1c] cursor-pointer transition-all duration-300 hover:text-[#0d1c1c] hover:bg-[rgba(106,177,135,0.18)] hover:rounded-[14px] hover:shadow-[0_8px_32px_0_rgba(106,177,135,0.25),0_1.5px_8px_0_rgba(78,148,79,0.1)] hover:scale-[1.04] px-2 py-1">Packages</div>
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
                    <div className="w-[84px] h-10 rounded-xl bg-[#abb79a] overflow-hidden flex-shrink-0 flex flex-row items-center justify-center px-4 box-border min-w-[84px] max-w-[480px] cursor-pointer transition-all duration-300 hover:bg-[rgba(106,177,135,0.18)] hover:rounded-[14px] hover:shadow-[0_8px_32px_0_rgba(106,177,135,0.25),0_1.5px_8px_0_rgba(78,148,79,0.1)] hover:scale-[1.04]" onClick={() => navigate("/signup")}>
                      <div className="overflow-hidden flex flex-col items-center justify-start">
                        <b className="text-sm leading-5 font-['Plus_Jakarta_Sans'] text-[#0d1c1c] text-center whitespace-nowrap overflow-hidden text-ellipsis">Sign up</b>
                      </div>
                    </div>
                    <div className="w-[84px] h-10 rounded-xl bg-[#e8f2f2] overflow-hidden flex-shrink-0 flex flex-row items-center justify-center px-4 box-border min-w-[84px] max-w-[480px] cursor-pointer transition-all duration-300 hover:bg-[rgba(106,177,135,0.18)] hover:rounded-[14px] hover:shadow-[0_8px_32px_0_rgba(106,177,135,0.25),0_1.5px_8px_0_rgba(78,148,79,0.1)] hover:scale-[1.04]" onClick={() => navigate("/login")}>
                      <div className="overflow-hidden flex flex-col items-center justify-start">
                        <b className="text-sm leading-5 font-['Plus_Jakarta_Sans'] text-[#0d1c1c] text-center whitespace-nowrap overflow-hidden text-ellipsis">Log in</b>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            <span title="Notifications">
              <Bell size={26} className="ml-4 text-[#FFD700] align-middle cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
