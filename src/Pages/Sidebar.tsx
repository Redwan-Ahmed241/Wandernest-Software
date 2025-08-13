"use client"

import React, { FunctionComponent } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../Styles/Sidebar.module.css"
import { useAuth } from "../Authentication/auth-context" // Using your auth context


const Sidebar: FunctionComponent = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading } = useAuth()

  const getInitial = () => {
    if (user?.first_name && user?.first_name.length > 0) {
      return user.first_name[0].toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || "U";
  }

  // Don't render sidebar if not authenticated
  if (!isAuthenticated && !loading) {
    return null
  }

  // Debug user object
  console.log("Sidebar user:", user);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileSection}>
        <div
          className={styles.avatar}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#4285f4",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 32,
            userSelect: "none",
            border: "2px solid #a1824a"
          }}
        >
          {getInitial()}
        </div>
        <div>
          <div className={styles.userName}>
            {user?.first_name || user?.username}
          </div>
          <div className={styles.userSubtitle}>Plan your next adventure</div>
        </div>
      </div>

      <nav className={styles.navMenu}>
        <button
          className={`${styles.navItem} ${window.location.pathname === "/dashboard" ? styles.active : ""}`}
          onClick={() => navigate("/dashboard")}
        >
          <span className={styles.icon}>📊</span> Dashboard
        </button>

        <button
          className={`${styles.navItem} ${window.location.pathname === "/my-trips" ? styles.active : ""}`}
          onClick={() => navigate("/my-trips")}
        >
          <span className={styles.icon}>●●●</span> My Trips
        </button>

              <button
        className={styles.navItem}
        title="This feature is coming soon!"
        disabled
        style={{ cursor: 'not-allowed', opacity: 0.6 }}
      >
        <span className={styles.icon}>🛂</span>
        Visa Assistance
        <span
          style={{
            marginLeft: '8px',
            backgroundColor: '#ff9800',
            color: 'white',
            fontSize: '0.65rem',
            padding: '2px 6px',
            borderRadius: '6px',
            textTransform: 'uppercase'
          }}
        >
          Upcoming
        </span>
      </button>


        <button className={styles.navItem} onClick={() => navigate("/create-packages")}>
          <span className={styles.icon}>N</span> Plan a Trip
        </button>

        <button
  className={styles.navItem}
  title="This feature is coming soon!"
  disabled
  style={{ cursor: 'not-allowed', opacity: 0.6 }}
>
  <span className={styles.icon}>👥</span>
  Groups
  <span
    style={{
      marginLeft: '8px',
      backgroundColor: '#ff9800',
      color: 'white',
      fontSize: '0.65rem',
      padding: '2px 6px',
      borderRadius: '6px',
      textTransform: 'uppercase'
    }}
  >
    Upcoming
  </span>
</button>

        <button className={styles.navItem} onClick={() => navigate("/community")}>
          <span className={styles.icon}>🌐</span> Community
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
