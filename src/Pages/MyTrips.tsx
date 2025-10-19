"use client";

import type { FunctionComponent } from "react";
import { useState, useEffect, useMemo } from "react";
import Layout from "../components/layout";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { tripsAPI, type Trip, type ItineraryItem } from "../App/api";
import { useAuth } from "../Authentication/auth-context";
import { useBooking } from "../Context/booking-context";

interface ExtendedTrip extends Trip {
  price?: number;
  travelers?: number;
  image?: string;
  status: "upcoming" | "past" | "cancelled";
}

const MyTrips: FunctionComponent = () => {
  // Prevent infinite fetch loop
  const [hasTriedLoading, setHasTriedLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">(
    "upcoming"
  );
  const [activeView, setActiveView] = useState("overview");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<ExtendedTrip | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [isLoadingItinerary, setIsLoadingItinerary] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { bookings, refreshBookings } = useBooking();
  const navigate = useNavigate();
  const PLACEHOLDER_IMAGE =
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23e5e7eb' width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='40' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

  // Convert bookings to trips format for display
  const bookingTrips = bookings
    .filter((booking) => {
      const now = new Date();
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);

      if (activeTab === "upcoming")
        return startDate > now && booking.status === "confirmed";
      if (activeTab === "past")
        return endDate < now && booking.status === "confirmed";
      if (activeTab === "cancelled") return booking.status === "cancelled";
      return false;
    })
    .map((booking) => ({
      id: booking.id,
      title: booking.title,
      start_date: booking.startDate,
      end_date: booking.endDate,
      location: booking.location,
      status:
        booking.status === "confirmed"
          ? "upcoming"
          : (booking.status as "cancelled"),
      duration: `${Math.ceil(
        (new Date(booking.endDate).getTime() -
          new Date(booking.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )} days`,
      activities_count: Math.floor(Math.random() * 10) + 1,
      check_in_time: "3:00 PM",
      weather: "Sunny, 28°C",
      currency: "BDT",
      image: booking.image,
      price: booking.price,
      travelers: booking.travelers,
      created_at: booking.createdAt,
      updated_at: booking.createdAt,
    }));

  // Fetch trips when tab changes or component mounts
  useEffect(() => {
    if (!authLoading && isAuthenticated && !hasTriedLoading) {
      setHasTriedLoading(true);
      fetchTrips(activeTab);
      refreshBookings();
    }
  }, [activeTab, authLoading, isAuthenticated, refreshBookings, hasTriedLoading]);

  // Combine API trips with booking trips
  const allTrips = useMemo(
    () => {
      const fallbackTrips: ExtendedTrip[] = [
        {
          id: "1",
          title: "Cox's Bazar Beach Escape",
          start_date: "2025-11-10",
          end_date: "2025-11-15",
          location: "Cox's Bazar",
          status: "upcoming",
          duration: "5 days",
          activities_count: 4,
          check_in_time: "3:00 PM",
          weather: "Sunny, 28°C",
          currency: "BDT",
          image: "/Figma_photos/coxsbazar.jpg",
          price: 12000,
          travelers: 2,
          created_at: "2025-10-01",
          updated_at: "2025-10-01",
        },
        {
          id: "2",
          title: "Sundarbans Adventure",
          start_date: "2025-12-01",
          end_date: "2025-12-05",
          location: "Sundarbans",
          status: "past",
          duration: "5 days",
          activities_count: 3,
          check_in_time: "2:00 PM",
          weather: "Cloudy, 25°C",
          currency: "BDT",
          image: "/Figma_photos/sundarban.jpg",
          price: 9500,
          travelers: 3,
          created_at: "2025-10-01",
          updated_at: "2025-10-01",
        },
        {
          id: "3",
          title: "Sylhet Tea Garden Tour",
          start_date: "2026-01-20",
          end_date: "2026-01-23",
          location: "Sylhet",
          status: "cancelled",
          duration: "4 days",
          activities_count: 2,
          check_in_time: "1:00 PM",
          weather: "Rainy, 22°C",
          currency: "BDT",
          image: "/Figma_photos/srimangal.png",
          price: 8000,
          travelers: 1,
          created_at: "2025-10-01",
          updated_at: "2025-10-01",
        },
      ];
      const combined = [...bookingTrips, ...trips];
      return combined.length > 0 ? combined : fallbackTrips;
    },
    [bookingTrips, trips]
  );

  // Filter combined trips for the active tab so fallback trips appear in the correct tab
  const filteredTrips = useMemo(() => {
    return allTrips.filter((t) => t.status === activeTab);
  }, [allTrips, activeTab]);

  // Local cancel handler (optimistic, frontend-only)
  const handleCancelTrip = (id: string) => {
    // update trips state (API not called here)
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, status: "cancelled" } : t)));
    // also update selectedTrip if necessary
    setSelectedTrip((prev) => (prev && prev.id === id ? { ...prev, status: "cancelled" } : prev));
  };

  // Select first trip when filtered trips load
  useEffect(() => {
    if (filteredTrips.length > 0) {
      const inCurrent = selectedTrip && filteredTrips.some((t) => t.id === selectedTrip.id);
      if (!inCurrent) {
        const allowedStatuses = ["upcoming", "past", "cancelled"] as const;
        const trip = filteredTrips[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const safeStatus = allowedStatuses.includes(trip.status as any)
          ? (trip.status as "upcoming" | "past" | "cancelled")
          : "upcoming";
        setSelectedTrip({ ...trip, status: safeStatus });
      }
    }
  }, [filteredTrips, selectedTrip]);

  // Fetch itinerary when selected trip changes
  useEffect(() => {
    if (selectedTrip && activeView === "itinerary") {
      fetchItinerary(selectedTrip.id);
    }
  }, [selectedTrip, activeView]);

  // Add logging to verify API responses
  const fetchTrips = async (status: "upcoming" | "past" | "cancelled") => {
  setIsLoadingTrips(true);
    try {
  const tripsData = await tripsAPI.getTrips(status);
  setTrips(tripsData.results || tripsData);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setTrips([]);
    } finally {
      setIsLoadingTrips(false);
    }
  };

  const fetchItinerary = async (tripId: string) => {
    try {
      setIsLoadingItinerary(true);
      console.log(`Fetching itinerary for trip ID: ${tripId}`); // Log the trip ID
      const itineraryData = await tripsAPI.getTripItinerary(tripId);
      console.log("Itinerary data fetched:", itineraryData); // Log the fetched data
      setItinerary(itineraryData.results || itineraryData);
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      setItinerary([]);
    } finally {
      setIsLoadingItinerary(false);
    }
  };

  const handleTabChange = (tab: "upcoming" | "past" | "cancelled") => {
    setActiveTab(tab);
    setActiveView("overview");
    // clear selected trip so selection refreshes for new tab
    setSelectedTrip(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
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
              <p className="text-gray-600 font-medium">Loading...</p>
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
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <span>/</span>
                <span className="font-medium text-primary">My Trips</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            </div>

            {/* Trip Status Tabs */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2">
              <div className="flex gap-2">
                <button
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === "upcoming"
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => handleTabChange("upcoming")}
                >
                  <span className="mr-2">✈️</span>
                  Upcoming ({allTrips.filter((t) => t.status === "upcoming").length})
                </button>
                <button
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === "past"
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => handleTabChange("past")}
                >
                  <span className="mr-2">📋</span>
                  Past ({allTrips.filter((t) => t.status === "past").length})
                </button>
                <button
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === "cancelled"
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => handleTabChange("cancelled")}
                >
                  <span className="mr-2">❌</span>
                  Cancelled ({allTrips.filter((t) => t.status === "cancelled").length})
                </button>
              </div>
            </div>

            {/* Content Area */}
            {isLoadingTrips && trips.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-medium">Loading trips...</p>
                </div>
              </div>
            ) : filteredTrips.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">✈️</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab} trips found</h3>
                    <p className="text-gray-500 mb-6">You don't have any {activeTab} trips yet.</p>
                    {activeTab === 'upcoming' && (
                      <button className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium" onClick={() => navigate('/packages')}>
                        <span className="mr-2">🎒</span>Book Your First Trip
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: selection */}
                <div className="lg:col-span-1">
                  {filteredTrips.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Select Trip</label>
                      <div className="flex flex-col gap-3">
                        {filteredTrips.map((trip) => {
                          const t = trip as ExtendedTrip;
                          const isSelected = selectedTrip?.id === t.id;
                          const imgSrc = t.image || PLACEHOLDER_IMAGE;
                          return (
                            <button key={trip.id} onClick={() => setSelectedTrip((trip as ExtendedTrip) || null)} className={`w-full flex items-start gap-3 bg-white rounded-lg overflow-hidden transition-all duration-150 p-2 ${isSelected ? '-translate-y-0.5 shadow-lg ring-2 ring-primary/20 z-10' : 'border border-gray-100'}`}>
                              <div className="w-24 h-20 rounded-md overflow-hidden flex-shrink-0">
                                <img src={imgSrc} alt={trip.title} onError={(e) => (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 text-left">
                                <h4 className="font-semibold text-gray-900 text-sm truncate">{trip.title}</h4>
                                <p className="text-xs text-gray-500">{trip.location}</p>
                                <p className="text-xs text-gray-600 mt-1">{formatDate(trip.start_date)}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <select value={selectedTrip?.id || ''} onChange={(e) => setSelectedTrip((filteredTrips.find((t) => t.id === e.target.value) as ExtendedTrip) || null)} className="w-full mt-4 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                        {filteredTrips.map((trip) => (
                          <option key={trip.id} value={trip.id}>{trip.title} - {formatDate(trip.start_date)}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Right column: details */}
                <div className="lg:col-span-2">
                  {selectedTrip && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold mb-1">{selectedTrip.title}</h2>
                          <p className="text-sm opacity-90">{formatDate(selectedTrip.start_date)} - {formatDate(selectedTrip.end_date)}</p>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedTrip.status === 'upcoming' ? 'bg-green-500 text-white' : selectedTrip.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}`}>
                            {selectedTrip.status.charAt(0).toUpperCase() + selectedTrip.status.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 rounded-full p-1 flex items-center gap-1">
                            <button className={`px-3 py-1 rounded-full text-sm font-medium ${activeView === 'overview' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'}`} onClick={() => setActiveView('overview')}>📊 Overview</button>
                            <button className={`px-3 py-1 rounded-full text-sm font-medium ${activeView === 'itinerary' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'}`} onClick={() => setActiveView('itinerary')}>🗓️ Itinerary</button>
                          </div>
                        </div>
                        <div>
                          {selectedTrip.status === 'upcoming' && <button onClick={() => handleCancelTrip(selectedTrip.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Cancel Trip</button>}
                        </div>
                      </div>

                      <div className="p-4">
                        {activeView === 'overview' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="rounded-lg p-4 border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center text-white">📅</div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-900">Duration</h4>
                                <p className="text-sm text-gray-600">{selectedTrip.duration}</p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4 border border-green-100 bg-gradient-to-br from-green-50 to-green-100 flex items-center gap-4">
                              <div className="w-10 h-10 bg-green-500 rounded-md flex items-center justify-center text-white">📍</div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-900">Location</h4>
                                <p className="text-sm text-gray-600">{selectedTrip.location}</p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4 border border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center gap-4">
                              <div className="w-10 h-10 bg-purple-500 rounded-md flex items-center justify-center text-white">🎯</div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-900">Activities</h4>
                                <p className="text-sm text-gray-600">{selectedTrip.activities_count} planned</p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4 border border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center gap-4">
                              <div className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center text-white">🏨</div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-900">Check-in</h4>
                                <p className="text-sm text-gray-600">{selectedTrip.check_in_time}</p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4 border border-yellow-100 bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center gap-4">
                              <div className="w-10 h-10 bg-yellow-500 rounded-md flex items-center justify-center text-white">🌤️</div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-900">Weather</h4>
                                <p className="text-sm text-gray-600">{selectedTrip.weather}</p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4 border border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center gap-4">
                              <div className="w-10 h-10 bg-emerald-500 rounded-md flex items-center justify-center text-white">💰</div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-900">Total Cost</h4>
                                <p className="text-sm text-gray-600">৳{selectedTrip?.price ? selectedTrip.price.toLocaleString() : 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {isLoadingItinerary ? (
                              <div className="flex items-center justify-center py-6">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {(itinerary.length > 0 ? itinerary : [
                                  { id: 's-1', title: 'Arrival & Hotel Check-in', description: 'Arrive & check in', date_time: selectedTrip.start_date, icon: '🏨' },
                                  { id: 's-2', title: 'Local Market Visit', description: 'Explore local market', date_time: selectedTrip.start_date, icon: '🛍️' },
                                ]).map((item) => (
                                  <div key={item.id} className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-white">{item.icon}</div>
                                    <div>
                                      <h5 className="font-semibold text-sm">{item.title}</h5>
                                      <p className="text-xs text-gray-500">{formatDateTime(item.date_time)}</p>
                                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>

  );

};

export default MyTrips;
