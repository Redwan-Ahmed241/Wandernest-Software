"use client"

import type React from "react"

import { type FunctionComponent, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../Styles/DashboardHome.module.css"
import Layout from "../App/Layout"
import Sidebar from "./Sidebar"
import { useAuth } from "../Authentication/auth-context"
import { useBooking } from "../Context/booking-context"

// Success notification component
const BookingNotification: React.FC = () => {
  const [notification, setNotification] = useState<{ message: string; show: boolean }>({ message: "", show: false })

  useEffect(() => {
    const handleBookingSuccess = (event: CustomEvent) => {
      setNotification({ message: event.detail.message, show: true })
      setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 5000)
    }

    window.addEventListener("booking-success", handleBookingSuccess as EventListener)
    return () => window.removeEventListener("booking-success", handleBookingSuccess as EventListener)
  }, [])

  if (!notification.show) return null

  return (
    <div className={styles.successNotification}>
      <div className={styles.notificationContent}>
        <span className={styles.successIcon}>🎉</span>
        <span>{notification.message}</span>
        <button onClick={() => setNotification((prev) => ({ ...prev, show: false }))}>×</button>
      </div>
    </div>
  )
}

const DashboardHome: FunctionComponent = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading, user } = useAuth()
  const { bookings, stats, refreshBookings, isLoading } = useBooking()

  // Refresh bookings on mount
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      refreshBookings()
    }
  }, [authLoading, isAuthenticated, refreshBookings])

  // Get recent bookings (last 5)
  const recentBookings = (bookings || []).slice(0, 5)

  // Get upcoming trips
  const upcomingTrips = (bookings || [])
    .filter((b) => new Date(b.startDate) > new Date() && b.status === "confirmed")
    .slice(0, 3)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString()}`
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Layout>
        <div style={{ display: "flex" }}>
          <Sidebar />
          <div style={{ flex: 1, padding: "40px", textAlign: "center" }}>
            <div>Loading...</div>
          </div>
        </div>
      </Layout>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login")
    return null
  }

  return (
    <Layout>
      <BookingNotification />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className={styles.dashboardHome}>
          <div className={styles.dashboardWrapper}>
            <div className={styles.dashboard1}>
              <div className={styles.depth0Frame0}>
                <div className={styles.depth1Frame0}>
                  <div className={styles.depth2Frame1}>
                    <div className={styles.depth3Frame02}>
                      {/* Welcome Section */}
                      <div className={styles.welcomeSection}>
                        <div className={styles.depth4Frame02}>
                          <div className={styles.depth5Frame03}>
                            <div className={styles.depth6Frame02}>
                              <div className={styles.welcomeBack}>
                                Welcome back, {user?.first_name || user?.username || "Traveler"}! 👋
                              </div>
                            </div>
                            <div className={styles.depth6Frame11}>
                              <div className={styles.readyForYour}>Ready for your next adventure?</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats Cards */}
                      <div className={styles.statsSection}>
                        <div className={styles.statsGrid}>
                          <div className={styles.statCard}>
                            <div className={styles.statIcon}>📊</div>
                            <div className={styles.statContent}>
                              <div className={styles.statNumber}>{stats.totalBookings}</div>
                              <div className={styles.statLabel}>Total Bookings</div>
                            </div>
                          </div>
                          <div className={styles.statCard}>
                            <div className={styles.statIcon}>✈️</div>
                            <div className={styles.statContent}>
                              <div className={styles.statNumber}>{stats.upcomingTrips}</div>
                              <div className={styles.statLabel}>Upcoming Trips</div>
                            </div>
                          </div>
                          <div className={styles.statCard}>
                            <div className={styles.statIcon}>💰</div>
                            <div className={styles.statContent}>
                              <div className={styles.statNumber}>{formatCurrency(stats.totalSpent)}</div>
                              <div className={styles.statLabel}>Total Spent</div>
                            </div>
                          </div>
                          <div className={styles.statCard}>
                            <div className={styles.statIcon}>🏆</div>
                            <div className={styles.statContent}>
                              <div className={styles.statNumber}>{stats.completedTrips}</div>
                              <div className={styles.statLabel}>Completed Trips</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Bookings */}
                      <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                          <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>📋</span>
                            Recent Bookings
                          </h2>
                          <button className={styles.viewAllButton} onClick={() => navigate("/my-trips")}>
                            View All
                          </button>
                        </div>

                        {isLoading ? (
                          <div className={styles.loadingSpinner}>Loading bookings...</div>
                        ) : recentBookings.length === 0 ? (
                          <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📝</div>
                            <p>No bookings yet</p>
                            <button className={styles.ctaButton} onClick={() => navigate("/packages")}>
                              Book Your First Trip
                            </button>
                          </div>
                        ) : (
                          <div className={styles.bookingsList}>
                            {recentBookings.map((booking) => (
                              <div key={booking.id} className={styles.bookingCard}>
                                <div className={styles.bookingImage}>
                                  <img
                                    src={booking.image || "/placeholder.svg?height=60&width=80"}
                                    alt={booking.title}
                                  />
                                </div>
                                <div className={styles.bookingInfo}>
                                  <div className={styles.bookingTitle}>{booking.title}</div>
                                  <div className={styles.bookingLocation}>📍 {booking.location}</div>
                                  <div className={styles.bookingDate}>
                                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                  </div>
                                </div>
                                <div className={styles.bookingMeta}>
                                  <div className={styles.bookingPrice}>{formatCurrency(booking.price)}</div>
                                  <div className={`${styles.bookingStatus} ${styles[booking.status]}`}>
                                    {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Upcoming Trips */}
                      {upcomingTrips.length > 0 && (
                        <div className={styles.section}>
                          <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                              <span className={styles.sectionIcon}>🗓️</span>
                              Upcoming Trips
                            </h2>
                          </div>
                          <div className={styles.upcomingTripsGrid}>
                            {upcomingTrips.map((trip) => (
                              <div key={trip.id} className={styles.tripCard}>
                                <img
                                  src={trip.image || "/placeholder.svg?height=120&width=200"}
                                  alt={trip.title}
                                  className={styles.tripImage}
                                />
                                <div className={styles.tripInfo}>
                                  <div className={styles.tripTitle}>{trip.title}</div>
                                  <div className={styles.tripLocation}>📍 {trip.location}</div>
                                  <div className={styles.tripDate}>🗓️ {formatDate(trip.startDate)}</div>
                                  <div className={styles.tripTravelers}>
                                    👥 {trip.travelers} traveler{trip.travelers > 1 ? "s" : ""}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardHome