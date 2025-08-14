"use client"

import type { FunctionComponent } from "react"
import Layout from "../App/Layout"
import { useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import { tripsAPI, type Trip, type ItineraryItem } from "../App/api"
import { useAuth } from "../Authentication/auth-context"
import { useBooking } from "../Context/booking-context"

interface ExtendedTrip extends Trip {
  price?: number;
  travelers?: number;
}

const MyTrips: FunctionComponent = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming")
  const [activeView, setActiveView] = useState("overview")
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTrip, setSelectedTrip] = useState<ExtendedTrip | null>(null)
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([])
  const [isLoadingTrips, setIsLoadingTrips] = useState(true)
  const [isLoadingItinerary, setIsLoadingItinerary] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { bookings, refreshBookings } = useBooking()
  const navigate = useNavigate()

  // Convert bookings to trips format for display
  const bookingTrips = bookings
    .filter((booking) => {
      const now = new Date()
      const startDate = new Date(booking.startDate)
      const endDate = new Date(booking.endDate)

      if (activeTab === "upcoming") return startDate > now && booking.status === "confirmed"
      if (activeTab === "past") return endDate < now && booking.status === "confirmed"
      if (activeTab === "cancelled") return booking.status === "cancelled"
      return false
    })
    .map((booking) => ({
      id: booking.id,
      title: booking.title,
      start_date: booking.startDate,
      end_date: booking.endDate,
      location: booking.location,
      status: booking.status,
      duration: `${Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`,
      activities_count: Math.floor(Math.random() * 10) + 1, // Mock data
      check_in_time: "3:00 PM",
      weather: "Sunny, 28°C",
      currency: "BDT",
      image: booking.image,
      price: booking.price,
      travelers: booking.travelers,
    }))

  // Fetch trips when tab changes or component mounts
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchTrips(activeTab)
      refreshBookings() // Also refresh bookings
    }
  }, [activeTab, authLoading, isAuthenticated, refreshBookings])

  // Combine API trips with booking trips
  const allTrips = [...bookingTrips, ...trips]

  // Select first trip when trips load
  useEffect(() => {
    if (trips.length > 0 && !selectedTrip) {
      setSelectedTrip(trips[0])
    }
  }, [trips, selectedTrip])

  // Fetch itinerary when selected trip changes
  useEffect(() => {
    if (selectedTrip && activeView === "itinerary") {
      fetchItinerary(selectedTrip.id)
    }
  }, [selectedTrip, activeView])

  const fetchTrips = async (status: "upcoming" | "past" | "cancelled") => {
    try {
      setIsLoadingTrips(true)
      setError(null)
      const tripsData = await tripsAPI.getTrips(status)
      setTrips(tripsData.results || tripsData)
      setSelectedTrip(null)
    } catch (error) {
      console.error("Error fetching trips:", error)
      setError("Failed to load trips")
      setTrips([])
    } finally {
      setIsLoadingTrips(false)
    }
  }

  const fetchItinerary = async (tripId: string) => {
    try {
      setIsLoadingItinerary(true)
      const itineraryData = await tripsAPI.getTripItinerary(tripId)
      setItinerary(itineraryData.results || itineraryData)
    } catch (error) {
      console.error("Error fetching itinerary:", error)
      setItinerary([])
    } finally {
      setIsLoadingItinerary(false)
    }
  }

  const handleTabChange = (tab: "upcoming" | "past" | "cancelled") => {
    setActiveTab(tab)
    setActiveView("overview")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Layout>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <Sidebar />
          <div style={{ flex: 1 }}>
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}>Loading...</div>
            </div>
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
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <div className={styles.myTrips}>
            <div className={styles.container}>
              {/* Header Section */}
              <div className={styles.header}>
                <div className={styles.breadcrumb}>
                  <span className={styles.breadcrumbItem}>Trips</span>
                  <span className={styles.breadcrumbSeparator}>/</span>
                  <span className={styles.breadcrumbActive}>My Trips</span>
                </div>
                <h1 className={styles.pageTitle}>My Trips</h1>
              </div>

              {/* Trip Status Tabs */}
              <div className={styles.tabContainer}>
                <button
                  className={`${styles.tab} ${activeTab === "upcoming" ? styles.activeTab : ""}`}
                  onClick={() => handleTabChange("upcoming")}
                >
                  Upcoming (
                  {bookingTrips.filter((t) => activeTab === "upcoming").length +
                    trips.filter((t) => activeTab === "upcoming").length}
                  )
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "past" ? styles.activeTab : ""}`}
                  onClick={() => handleTabChange("past")}
                >
                  Past
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "cancelled" ? styles.activeTab : ""}`}
                  onClick={() => handleTabChange("cancelled")}
                >
                  Cancelled
                </button>
              </div>

              {/* Loading State */}
              {isLoadingTrips ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}>Loading trips...</div>
                </div>
              ) : error ? (
                <div className={styles.errorContainer}>
                  <p className={styles.errorMessage}>{error}</p>
                  <button className={styles.retryButton} onClick={() => fetchTrips(activeTab)}>
                    Try Again
                  </button>
                </div>
              ) : allTrips.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>✈️</div>
                  <h3>No {activeTab} trips found</h3>
                  <p>You don't have any {activeTab} trips yet.</p>
                  {activeTab === "upcoming" && (
                    <button className={styles.planTripButton} onClick={() => navigate("/packages")}>
                      Book a Trip
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Trip Selection */}
                  {allTrips.length > 1 && (
                    <div className={styles.tripSelector}>
                      <select
                        value={selectedTrip?.id || ""}
                        onChange={(e) => {
                          const trip = allTrips.find((t) => t.id === e.target.value)
                          setSelectedTrip(trip as ExtendedTrip || null)
                        }}
                        className={styles.tripSelect}
                      >
                        {allTrips.map((trip) => (
                          <option key={trip.id} value={trip.id}>
                            {trip.title} - {formatDate(trip.start_date)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Trip Card */}
                  {selectedTrip && (
                    <div className={styles.tripCard}>
                      <div className={styles.tripHeader}>
                        <div className={styles.tripInfo}>
                          <h2 className={styles.tripTitle}>{selectedTrip.title}</h2>
                          <p className={styles.tripDates}>
                            {formatDate(selectedTrip.start_date)} - {formatDate(selectedTrip.end_date)}
                          </p>
                        </div>
                        <div className={styles.tripStatus}>
                          <span className={`${styles.statusBadge} ${styles[selectedTrip.status]}`}>
                            {selectedTrip.status.charAt(0).toUpperCase() + selectedTrip.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* View Toggle */}
                      <div className={styles.viewToggle}>
                        <button
                          className={`${styles.viewButton} ${activeView === "overview" ? styles.activeView : ""}`}
                          onClick={() => setActiveView("overview")}
                        >
                          Overview
                        </button>
                        <button
                          className={`${styles.viewButton} ${activeView === "itinerary" ? styles.activeView : ""}`}
                          onClick={() => setActiveView("itinerary")}
                        >
                          Itinerary
                        </button>
                      </div>

                      {/* Content Area */}
                      <div className={styles.contentArea}>
                        {activeView === "overview" ? (
                          <div className={styles.overview}>
                            <div className={styles.overviewGrid}>
                              <div className={styles.overviewCard}>
                                <div className={styles.overviewIcon}>📅</div>
                                <div className={styles.overviewContent}>
                                  <h3>Duration</h3>
                                  <p>{selectedTrip.duration}</p>
                                </div>
                              </div>
                              <div className={styles.overviewCard}>
                                <div className={styles.overviewIcon}>📍</div>
                                <div className={styles.overviewContent}>
                                  <h3>Location</h3>
                                  <p>{selectedTrip.location}</p>
                                </div>
                              </div>
                              <div className={styles.overviewCard}>
                                <div className={styles.overviewIcon}>🎯</div>
                                <div className={styles.overviewContent}>
                                  <h3>Activities</h3>
                                  <p>{selectedTrip.activities_count} planned</p>
                                </div>
                              </div>
                              <div className={styles.overviewCard}>
                                <div className={styles.overviewIcon}>🏨</div>
                                <div className={styles.overviewContent}>
                                  <h3>Check-in</h3>
                                  <p>{selectedTrip.check_in_time}</p>
                                </div>
                              </div>
                              <div className={styles.overviewCard}>
                                <div className={styles.overviewIcon}>🌤️</div>
                                <div className={styles.overviewContent}>
                                  <h3>Weather</h3>
                                  <p>{selectedTrip.weather}</p>
                                </div>
                              </div>
                              <div className={styles.overviewCard}>
                                <div className={styles.overviewIcon}>💰</div>
                                <div className={styles.overviewContent}>
                                  <h3>Total Cost</h3>
                                  <p>৳{(selectedTrip as any)?.price?.toLocaleString() || "N/A"}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className={styles.itinerary}>
                            {isLoadingItinerary ? (
                              <div className={styles.loadingSpinner}>Loading itinerary...</div>
                            ) : itinerary.length === 0 ? (
                              <div className={styles.emptyItinerary}>
                                <p>No itinerary items found for this trip.</p>
                              </div>
                            ) : (
                              <div className={styles.timeline}>
                                {itinerary.map((item, index) => (
                                  <div key={item.id} className={styles.timelineItem}>
                                    <div className={styles.timelineIcon}>
                                      <span className={styles.icon}>{item.icon}</span>
                                      {index < itinerary.length - 1 && <div className={styles.timelineLine} />}
                                    </div>
                                    <div className={styles.timelineContent}>
                                      <div className={styles.activityCard}>
                                        <div className={styles.activityHeader}>
                                          <h3 className={styles.activityTitle}>{item.title}</h3>
                                          <span className={styles.activityTime}>{formatDateTime(item.date_time)}</span>
                                        </div>
                                        <p className={styles.activityDescription}>{item.description}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MyTrips
