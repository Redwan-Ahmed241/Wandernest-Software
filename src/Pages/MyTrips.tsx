"use client"

import type { FunctionComponent } from "react"
import { useState, useEffect } from "react"
// Tailwind conversion: remove CSS import
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
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary border-solid mx-auto" />
          <span className="ml-4 text-primary-dark text-lg">Loading...</span>
        </div>
      </Layout>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login")
    return null
  }

  return (
    <Layout>
      <div className="flex items-start">
        <Sidebar />
        <div className="flex-1">
          <div className="min-h-screen bg-white text-primary-dark font-jakarta p-6">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-primary-dark mb-2">
                <span>Trips</span>
                <span className="mx-1">/</span>
                <span className="font-bold text-primary">My Trips</span>
              </div>
              <h1 className="text-2xl font-bold text-primary mb-2">My Trips</h1>
            </div>
            {/* Trip Status Tabs */}
            <div className="flex gap-4 mb-6">
              <button className={`px-4 py-2 rounded-lg font-semibold border border-border bg-accent-light text-primary-dark transition ${activeTab === "upcoming" ? "bg-primary text-white" : "hover:bg-primary-light"}`} onClick={() => handleTabChange("upcoming")}>Upcoming ({bookingTrips.filter((t) => activeTab === "upcoming").length + trips.filter((t) => activeTab === "upcoming").length})</button>
              <button className={`px-4 py-2 rounded-lg font-semibold border border-border bg-accent-light text-primary-dark transition ${activeTab === "past" ? "bg-primary text-white" : "hover:bg-primary-light"}`} onClick={() => handleTabChange("past")}>Past</button>
              <button className={`px-4 py-2 rounded-lg font-semibold border border-border bg-accent-light text-primary-dark transition ${activeTab === "cancelled" ? "bg-primary text-white" : "hover:bg-primary-light"}`} onClick={() => handleTabChange("cancelled")}>Cancelled</button>
            </div>
            {/* Loading/Error/Empty State */}
            {isLoadingTrips ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary border-solid mx-auto" />
                <span className="ml-4 text-primary-dark text-lg">Loading trips...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-48">
                <p className="text-red-600 text-lg mb-2">{error}</p>
                <button className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition" onClick={() => fetchTrips(activeTab)}>Try Again</button>
              </div>
            ) : allTrips.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48">
                <div className="text-4xl mb-2">✈️</div>
                <h3 className="text-lg font-bold text-primary mb-1">No {activeTab} trips found</h3>
                <p className="text-primary-dark mb-2">You don't have any {activeTab} trips yet.</p>
                {activeTab === "upcoming" && (
                  <button className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition" onClick={() => navigate("/packages")}>Book a Trip</button>
                )}
              </div>
            ) : (
              <>
                {/* Trip Selection */}
                {allTrips.length > 1 && (
                  <div className="mb-6">
                    <select value={selectedTrip?.id || ""} onChange={(e) => { const trip = allTrips.find((t) => t.id === e.target.value); setSelectedTrip(trip as ExtendedTrip || null); }} className="px-4 py-2 rounded-lg border border-border bg-accent-light text-primary-dark font-semibold">
                      {allTrips.map((trip) => (
                        <option key={trip.id} value={trip.id}>{trip.title} - {formatDate(trip.start_date)}</option>
                      ))}
                    </select>
                  </div>
                )}
                {/* Trip Card */}
                {selectedTrip && (
                  <div className="bg-accent-light rounded-xl shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-primary mb-1">{selectedTrip.title}</h2>
                        <p className="text-sm text-primary-dark">{formatDate(selectedTrip.start_date)} - {formatDate(selectedTrip.end_date)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full font-semibold text-xs ${selectedTrip.status === "confirmed" ? "bg-primary text-white" : selectedTrip.status === "cancelled" ? "bg-red-200 text-red-700" : "bg-gray-200 text-gray-700"}`}>{selectedTrip.status.charAt(0).toUpperCase() + selectedTrip.status.slice(1)}</span>
                    </div>
                    {/* View Toggle */}
                    <div className="flex gap-4 mb-6">
                      <button className={`px-4 py-2 rounded-lg font-semibold border border-border bg-white text-primary-dark transition ${activeView === "overview" ? "bg-primary text-white" : "hover:bg-primary-light"}`} onClick={() => setActiveView("overview")}>Overview</button>
                      <button className={`px-4 py-2 rounded-lg font-semibold border border-border bg-white text-primary-dark transition ${activeView === "itinerary" ? "bg-primary text-white" : "hover:bg-primary-light"}`} onClick={() => setActiveView("itinerary")}>Itinerary</button>
                    </div>
                    {/* Content Area */}
                    <div>
                      {activeView === "overview" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                            <span className="text-2xl">📅</span>
                            <div>
                              <h3 className="font-bold text-primary mb-1">Duration</h3>
                              <p className="text-primary-dark">{selectedTrip.duration}</p>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                            <span className="text-2xl">📍</span>
                            <div>
                              <h3 className="font-bold text-primary mb-1">Location</h3>
                              <p className="text-primary-dark">{selectedTrip.location}</p>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                            <span className="text-2xl">🎯</span>
                            <div>
                              <h3 className="font-bold text-primary mb-1">Activities</h3>
                              <p className="text-primary-dark">{selectedTrip.activities_count} planned</p>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                            <span className="text-2xl">🏨</span>
                            <div>
                              <h3 className="font-bold text-primary mb-1">Check-in</h3>
                              <p className="text-primary-dark">{selectedTrip.check_in_time}</p>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                            <span className="text-2xl">🌤️</span>
                            <div>
                              <h3 className="font-bold text-primary mb-1">Weather</h3>
                              <p className="text-primary-dark">{selectedTrip.weather}</p>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                            <span className="text-2xl">💰</span>
                            <div>
                              <h3 className="font-bold text-primary mb-1">Total Cost</h3>
                              <p className="text-primary-dark">৳{(selectedTrip as any)?.price?.toLocaleString() || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {isLoadingItinerary ? (
                            <div className="flex items-center justify-center h-32">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary border-solid mx-auto" />
                              <span className="ml-4 text-primary-dark text-lg">Loading itinerary...</span>
                            </div>
                          ) : itinerary.length === 0 ? (
                            <div className="flex items-center justify-center h-32">
                              <p className="text-primary-dark">No itinerary items found for this trip.</p>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-6">
                              {itinerary.map((item, index) => (
                                <div key={item.id} className="flex gap-4 items-start">
                                  <div className="flex flex-col items-center">
                                    <span className="text-2xl">{item.icon}</span>
                                    {index < itinerary.length - 1 && <div className="w-1 h-8 bg-primary-light mt-1" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-white rounded-lg shadow p-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-primary">{item.title}</h3>
                                        <span className="text-xs text-primary-dark">{formatDateTime(item.date_time)}</span>
                                      </div>
                                      <p className="text-primary-dark text-sm">{item.description}</p>
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
    </Layout>
}

export default MyTrips
