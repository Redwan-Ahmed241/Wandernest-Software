"use client";

import type React from "react";
import { type FunctionComponent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import Sidebar from "./Sidebar";
import { useAuth } from "../Authentication/auth-context";
import { useBooking } from "../Context/booking-context";
import dashboardApi, { type Booking, type Stats } from "../api/dashboard";

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
    <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-2xl border border-green-400 animate-slide-in">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span className="text-lg">🎉</span>
        </div>
        <span className="font-medium">{notification.message}</span>
        <button
          className="ml-2 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
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
  // Prefer the dedicated API client but keep the booking context as a fallback
  const bookingCtx = useBooking();
  const [bookings, setBookings] = useState<Booking[]>(bookingCtx?.bookings || []);
  const [stats, setStats] = useState<Stats>(bookingCtx?.stats || {
    totalBookings: 0,
    upcomingTrips: 0,
    totalSpent: 0,
    completedTrips: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    averageSpentPerTrip: 0,
    favoriteDestination: '',
    memberSince: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(!!bookingCtx?.isLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [remoteStats, remoteBookings] = await Promise.all([
          dashboardApi.getDashboardStats(),
          dashboardApi.getBookingsActive(),
        ]);
        if (!mounted) return;
        if (remoteStats) setStats(remoteStats as Stats);
        if (Array.isArray(remoteBookings)) setBookings(remoteBookings as Booking[]);
      } catch (err) {
        // Fallback to context values if API fails
        if (!mounted) return;
        console.warn('Dashboard API load failed', err);
        console.log('🔍 DEBUG - Fallback booking context data:', bookingCtx?.bookings);
        setError(String(err || 'Failed to load dashboard data'));
        
        // Force refresh booking context data
        if (bookingCtx?.refreshBookings) {
          await bookingCtx.refreshBookings();
        }
        
        if (bookingCtx?.bookings) setBookings(bookingCtx.bookings);
        if (bookingCtx?.stats) setStats(bookingCtx.stats);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    if (!authLoading && isAuthenticated) {
      load();
    }

    return () => {
      mounted = false;
    };
  }, [authLoading, isAuthenticated, bookingCtx?.bookings, bookingCtx?.stats, bookingCtx]);

  // Get recent bookings (last 5)
  const recentBookings = (bookings || []).slice(0, 5);

  // Get upcoming trips
  const upcomingTrips = (bookings || [])
    .filter((b) => new Date(b.startDate) > new Date() && b.status === "confirmed")
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount?: number | null) => {
    const n = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0;
    try {
      return `৳${n.toLocaleString()}`;
    } catch {
      return `৳${String(n)}`;
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading dashboard...</p>
            </div>
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
      <div
        className="flex bg-gray-50"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3">
                <strong className="font-semibold">Data may be stale:</strong>
                <span className="ml-2">{error}</span>
              </div>
            )}
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-primary via-primary-dark to-primary-light text-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-extrabold mb-2 text-gray-900 drop-shadow-lg">
                    Welcome back,{" "}
                    {user?.first_name || user?.username || "Traveler"}!{" "}
                    <span className="align-middle">👋</span>
                  </h1>
                  <p className="text-xl text-gray-700 font-medium drop-shadow">
                    Ready for your next adventure?
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-gradient-to-br from-white via-gray-100 to-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-5xl">✈️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.totalBookings || (bookings || []).length}
                    </div>
                    <div className="text-sm text-gray-500">Total Bookings</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✈️</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.upcomingTrips}
                    </div>
                    <div className="text-sm text-gray-500">Upcoming Trips</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-2/3"></div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(stats.totalSpent)}
                    </div>
                    <div className="text-sm text-gray-500">Total Spent</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full w-4/5"></div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.completedTrips}
                    </div>
                    <div className="text-sm text-gray-500">Completed Trips</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Bookings */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">📋</span>
                        </div>
                        Recent Bookings
                      </h2>
                      <button
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 font-medium"
                        onClick={() => navigate("/my-trips")}
                      >
                        View All
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-gray-500">Loading bookings...</p>
                        </div>
                      </div>
                    ) : recentBookings.length === 0 ? (
                      <div className="text-center py-12 space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-3xl">📝</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No bookings yet
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Start planning your first adventure
                          </p>
                          <button
                            className="px-6 py-3 bg-white text-black font-bold rounded-xl border border-primary/30 shadow-lg hover:bg-white/10 hover:text-accent hover:border-accent hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent"
                            onClick={() => navigate("/packages")}
                          >
                            Book Your First Trip
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary hover:shadow-md transition-all duration-200"
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                              <img
                                src={
                                  booking.image ||
                                  "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=400"
                                }
                                alt={booking.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {booking.title}
                              </h3>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <span>📍</span>
                                {booking.location}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(booking.startDate)} -{" "}
                                {formatDate(booking.endDate)}
                              </p>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="font-bold text-gray-900">
                                {formatCurrency(booking.price)}
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  booking.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : booking.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {booking.status.charAt(0).toUpperCase() +
                                  booking.status.slice(1)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Upcoming Trips Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                      onClick={() => navigate("/create-packages")}
                    >
                      <span className="mr-2">✨</span>
                      Create Package
                    </button>
                    <button
                      className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                      onClick={() => navigate("/blogs")}
                    >
                      <span className="mr-2">📝</span>
                      Visit Blog
                    </button>
                  </div>
                </div>

                {/* Upcoming Trips */}
                {upcomingTrips.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">🗓️</span>
                      Upcoming Trips
                    </h3>
                    <div className="space-y-4">
                      {upcomingTrips.map((trip) => (
                        <div
                          key={trip.id}
                          className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
                        >
                          <img
                            src={
                              trip.image ||
                              "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=400"
                            }
                            alt={trip.title}
                            className="w-full h-24 object-cover"
                          />
                          <div className="p-3 space-y-2">
                            <h4 className="font-semibold text-gray-900 text-sm truncate">
                              {trip.title}
                            </h4>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <span>📍</span>
                              {trip.location}
                            </p>
                            <p className="text-xs text-gray-500">
                              🗓️ {formatDate(trip.startDate)}
                            </p>
                            <p className="text-xs text-gray-500">
                              👥 {trip.travelers ?? 1} traveler{(trip.travelers ?? 1) > 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Travel Tips */}
                <div className="bg-gradient-to-br from-accent to-accent-light rounded-xl shadow-lg p-6 text-primary-dark">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">💡</span>
                    Travel Tips
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        Book accommodations 2-3 weeks in advance for better
                        rates
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Check weather forecasts before packing</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Keep digital copies of important documents</span>
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
