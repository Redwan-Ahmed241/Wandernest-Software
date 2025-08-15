"use client";

import type React from "react";

import { type FunctionComponent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../App/Layout";
import Sidebar from "./Sidebar";
import { useAuth } from "../Authentication/auth-context";
import { useBooking } from "../Context/booking-context";

// Success notification component
const BookingNotification: React.FC = () => {
  const [notification, setNotification] = useState<{
    message: string;
    show: boolean;
  }>({ message: "", show: false });

  useEffect(() => {
    const handleBookingSuccess = (event: CustomEvent) => {
      setNotification({ message: event.detail.message, show: true });
      setTimeout(
        () => setNotification((prev) => ({ ...prev, show: false })),
        5000
      );
    };

    window.addEventListener(
      "booking-success",
      handleBookingSuccess as EventListener
    );
    return () =>
      window.removeEventListener(
        "booking-success",
        handleBookingSuccess as EventListener
      );
  }, []);

  if (!notification.show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-xl">🎉</span>
        <span>{notification.message}</span>
        <button
          className="ml-2 text-white hover:text-gray-200"
          onClick={() => setNotification((prev) => ({ ...prev, show: false }))}
        >
          ×
        </button>
      </div>
    </div>
  );
};

const DashboardHome: FunctionComponent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { bookings, stats, refreshBookings, isLoading } = useBooking();

  // Refresh bookings on mount
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      refreshBookings();
    }
  }, [authLoading, isAuthenticated, refreshBookings]);

  // Get recent bookings (last 5)
  const recentBookings = (bookings || []).slice(0, 5);

  // Get upcoming trips
  const upcomingTrips = (bookings || [])
    .filter(
      (b) => new Date(b.startDate) > new Date() && b.status === "confirmed"
    )
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString()}`;
  };

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
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <Layout>
      <BookingNotification />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="min-h-screen bg-white text-primary-dark font-jakarta p-6 flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-6">
                    <div className="space-y-8">
                      {/* Welcome Section */}
                      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl p-6">
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <div className="space-y-1">
                              <div className="text-2xl font-bold">
                                Welcome back,{" "}
                                {user?.first_name ||
                                  user?.username ||
                                  "Traveler"}
                                ! 👋
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-lg opacity-90">
                                Ready for your next adventure?
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats Cards */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="bg-accent-light rounded-xl shadow-md p-6 flex items-center gap-4">
                            <div className="text-3xl">📊</div>
                            <div className="space-y-1">
                              <div className="text-2xl font-bold text-primary">
                                {stats.totalBookings}
                              </div>
                              <div className="text-sm text-primary-dark">
                                Total Bookings
                              </div>
                            </div>
                          </div>
                          <div className="bg-accent-light rounded-xl shadow-md p-6 flex items-center gap-4">
                            <div className="text-3xl">✈️</div>
                            <div className="space-y-1">
                              <div className="text-2xl font-bold text-primary">
                                {stats.upcomingTrips}
                              </div>
                              <div className="text-sm text-primary-dark">
                                Upcoming Trips
                              </div>
                            </div>
                          </div>
                          <div className="bg-accent-light rounded-xl shadow-md p-6 flex items-center gap-4">
                            <div className="text-3xl">💰</div>
                            <div className="space-y-1">
                              <div className="text-2xl font-bold text-primary">
                                {formatCurrency(stats.totalSpent)}
                              </div>
                              <div className="text-sm text-primary-dark">
                                Total Spent
                              </div>
                            </div>
                          </div>
                          <div className="bg-accent-light rounded-xl shadow-md p-6 flex items-center gap-4">
                            <div className="text-3xl">🏆</div>
                            <div className="space-y-1">
                              <div className="text-2xl font-bold text-primary">
                                {stats.completedTrips}
                              </div>
                              <div className="text-sm text-primary-dark">
                                Completed Trips
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Bookings */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                            <span className="text-2xl">📋</span>
                            Recent Bookings
                          </h2>
                          <button
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                            onClick={() => navigate("/my-trips")}
                          >
                            View All
                          </button>
                        </div>

                        {isLoading ? (
                          <div className="flex items-center justify-center py-8">
                            Loading bookings...
                          </div>
                        ) : recentBookings.length === 0 ? (
                          <div className="text-center py-8 space-y-4">
                            <div className="text-4xl">📝</div>
                            <p>No bookings yet</p>
                            <button
                              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                              onClick={() => navigate("/packages")}
                            >
                              Book Your First Trip
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {recentBookings.map((booking) => (
                              <div
                                key={booking.id}
                                className="bg-accent-light rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                              >
                                <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={
                                      booking.image ||
                                      "/placeholder.svg?height=60&width=80"
                                    }
                                    alt={booking.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="font-semibold text-primary">
                                    {booking.title}
                                  </div>
                                  <div className="text-sm text-primary-dark">
                                    📍 {booking.location}
                                  </div>
                                  <div className="text-sm text-primary-dark">
                                    {formatDate(booking.startDate)} -{" "}
                                    {formatDate(booking.endDate)}
                                  </div>
                                </div>
                                <div className="text-right space-y-2">
                                  <div className="font-bold text-primary">
                                    {formatCurrency(booking.price)}
                                  </div>
                                  <div
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      booking.status === "confirmed"
                                        ? "bg-green-100 text-green-800"
                                        : booking.status === "cancelled"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {booking.status
                                      ? booking.status.charAt(0).toUpperCase() +
                                        booking.status.slice(1)
                                      : "Unknown"}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Upcoming Trips */}
                      {upcomingTrips.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                              <span className="text-2xl">🗓️</span>
                              Upcoming Trips
                            </h2>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingTrips.map((trip) => (
                              <div key={trip.id} className="bg-accent-light rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                <img
                                  src={
                                    trip.image ||
                                    "/placeholder.svg?height=120&width=200"
                                  }
                                  alt={trip.title}
                                  className="w-full h-32 object-cover"
                                />
                                <div className="p-4 space-y-2">
                                  <div className="font-semibold text-primary">
                                    {trip.title}
                                  </div>
                                  <div className="text-sm text-primary-dark">
                                    📍 {trip.location}
                                  </div>
                                  <div className="text-sm text-primary-dark">
                                    🗓️ {formatDate(trip.startDate)}
                                  </div>
                                  <div className="text-sm text-primary-dark">
                                    👥 {trip.travelers} traveler
                                    {trip.travelers > 1 ? "s" : ""}
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
  );
};

export default DashboardHome;