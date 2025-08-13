"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../Authentication/auth-context"
import ProfileDropdown from "./profile-dropdown"
import styles from "../Styles/Navbar.module.css"
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
    <div className={styles.navbarWrapper}>
      <div className={styles.navbar}>
        <div className={styles.depth3Frame0}>
          <img className={styles.depth4Frame0} alt="Logo" src="/Figma_photoes/wandernest.svg" />
          <div className={styles.depth4Frame1} onClick={goHome}>
            <b className={styles.wandernest}>WanderNest</b>
          </div>
        </div>

        <div className={styles.depth3Frame1}>
          <div className={styles.depth4Frame01}>
            <div className={styles.depth4Frame1} onClick={() => navigate("/destinations")}>
              <div className={styles.destinations}>Destinations</div>
            </div>
            <div className={styles.depth4Frame1} onClick={() => navigate("/hotels-rooms")}>
              <div className={styles.destinations}>Hotels</div>
            </div>
            <div className={styles.depth5Frame2} title="This feature is coming soon!">
  <div className={styles.flights} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#999', cursor: 'not-allowed' }}>
    Flights
    <span style={{
      backgroundColor: '#ff9800',
      color: 'white',
      fontSize: '0.65rem',
      padding: '2px 6px',
      borderRadius: '6px',
      textTransform: 'uppercase'
    }}>
      Upcoming
    </span>
  </div>
</div>

            <div className={styles.depth4Frame1} onClick={() => navigate("/Packages")}>
              <div className={styles.destinations}>Packages</div>
            </div>
          </div>

          <div className={styles.depth4Frame11}>
            {!loading && (
              <>
                {isAuthenticated ? (
                  // Show profile dropdown when authenticated
                  <ProfileDropdown />
                ) : (
                  // Show login/signup buttons when not authenticated
                  <>
                    <div className={styles.depth5Frame01} onClick={() => navigate("/signup")}>
                      <div className={styles.depth6Frame0}>
                        <b className={styles.signUp}>Sign up</b>
                      </div>
                    </div>
                    <div className={styles.depth5Frame11} onClick={() => navigate("/login")}>
                      <div className={styles.depth6Frame0}>
                        <b className={styles.signUp}>Log in</b>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            <span title="Notifications">
              <Bell size={26} style={{ marginLeft: 16, color: '#FFD700', verticalAlign: 'middle', cursor: 'pointer' }} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
