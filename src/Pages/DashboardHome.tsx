"use client"

import type React from "react"

import { type FunctionComponent, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../App/Layout"
import Sidebar from "./Sidebar"
import { useAuth } from "../Authentication/auth-context"
import { useBooking } from "../Context/booking-context"

// Success notification component
const BookingNotification: React.FC = () => {
  const [notification, setNotification] = useState<{ message: string; show: boolean }>({ 
    message: "", 
    show: false 
  })

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
    <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-300 rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎉</span>
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
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-10 text-center">
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
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 bg-gradient-to-br from-gray-100 to-blue-100 min-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="w-full">
              <div className="w-full">
                <div className="w-full">
                  <div className="w-full">
                    <div className="w-full">
                      {/* Welcome Section */}
                      <div className="mb-8">
                        <div className="w-full flex flex-row items-start justify-start p-4">
                          <div className="flex flex-col items-start justify-start gap-3 min-w-72">
                            <div className="w-full flex flex-col items-start justify-start">
                              <div className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-br from-amber-700 to-amber-600 bg-clip-text text-transparent">
                                Welcome back, {user?.first_name || user?.username || "Traveler"}! 👋
                              </div>
                            </div>
                            <div className="w-full flex flex-col items-start justify-start text-lg text-gray-600">
                              <div className="text-lg text-gray-600 font-normal">Ready for your next adventure?</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats Cards */}
                      <div className="mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                            <div className="text-3xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-amber-700 to-amber-600 rounded-xl text-white">📊</div>
                            <div className="flex-1">
                              <div className="text-3xl font-bold text-gray-900 my-0 mb-1">{stats.totalBookings}</div>
                              <div className="text-sm text-gray-600 my-0 font-medium">Total Bookings</div>
                            </div>
                          </div>
                          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                            <div className="text-3xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-amber-700 to-amber-600 rounded-xl text-white">✈️</div>
                            <div className="flex-1">
                              <div className="text-3xl font-bold text-gray-900 my-0 mb-1">{stats.upcomingTrips}</div>
                              <div className="text-sm text-gray-600 my-0 font-medium">Upcoming Trips</div>
                            </div>
                          </div>
                          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                            <div className="text-3xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-amber-700 to-amber-600 rounded-xl text-white">💰</div>
                            <div className="flex-1">
                              <div className="text-3xl font-bold text-gray-900 my-0 mb-1">{formatCurrency(stats.totalSpent)}</div>
                              <div className="text-sm text-gray-600 my-0 font-medium">Total Spent</div>
                            </div>
                          </div>
                          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                            <div className="text-3xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-amber-700 to-amber-600 rounded-xl text-white">🏆</div>
                            <div className="flex-1">
                              <div className="text-3xl font-bold text-gray-900 my-0 mb-1">{stats.completedTrips}</div>
                              <div className="text-sm text-gray-600 my-0 font-medium">Completed Trips</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Bookings */}
                      <div className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold text-gray-900 my-0 flex items-center gap-3">
                            <span className="text-xl">📋</span>
                            Recent Bookings
                          </h2>
                          <button className="bg-gradient-to-br from-amber-700 to-amber-600 text-white border-none py-3 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(161,130,74,0.3)]" onClick={() => navigate("/my-trips")}>
                            View All
                          </button>
                        </div>

                        {isLoading ? (
                          <div className="text-center py-10 text-gray-600 text-lg">Loading bookings...</div>
                        ) : recentBookings.length === 0 ? (
                          <div className="text-center py-10 text-gray-600">
                            <div className="text-5xl mb-4 opacity-50">📝</div>
                            <p>No bookings yet</p>
                            <button className="bg-gradient-to-br from-amber-700 to-amber-600 text-white border-none py-3 px-6 rounded-lg font-semibold cursor-pointer mt-4 transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(161,130,74,0.3)]" onClick={() => navigate("/packages")}>
                              Book Your First Trip
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                            {recentBookings.map((booking) => (
                              <div key={booking.id} className="bg-white rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex items-center gap-4 transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                                <div className="w-20 h-15 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={booking.image || "/placeholder.svg?height=60&width=80"}
                                    alt={booking.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="text-lg font-semibold text-gray-900 mb-1">{booking.title}</div>
                                  <div className="text-sm text-gray-600 mb-1">📍 {booking.location}</div>
                                  <div className="text-sm text-gray-500">
                                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="text-lg font-bold text-amber-700 mb-1">{formatCurrency(booking.price)}</div>
                                  <div className={`text-xs font-semibold py-1 px-2 rounded-sm text-transform-capitalize ${
                                    booking.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                                    booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                    booking.status === 'cancelled' ? 'bg-red-200 text-red-800' : ''
                                  }`}>
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
                        <div className="mb-8">
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 my-0 flex items-center gap-3">
                              <span className="text-xl">🗓️</span>
                              Upcoming Trips
                            </h2>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {upcomingTrips.map((trip) => (
                              <div key={trip.id} className="bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                                <img
                                  src={trip.image || "/placeholder.svg?height=120&width=200"}
                                  alt={trip.title}
                                  className="w-full h-30 object-cover"
                                />
                                <div className="p-4">
                                  <div className="text-lg font-semibold text-gray-900 mb-2">{trip.title}</div>
                                  <div className="text-sm text-gray-600 mb-1">📍 {trip.location}</div>
                                  <div className="text-sm text-gray-500 mb-1">🗓️ {formatDate(trip.startDate)}</div>
                                  <div className="text-sm text-gray-500">
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
