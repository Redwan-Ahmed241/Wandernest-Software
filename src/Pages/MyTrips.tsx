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
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">(
    "upcoming"
  );
  const [activeView, setActiveView] = useState("overview");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<ExtendedTrip | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [isLoadingItinerary, setIsLoadingItinerary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { bookings, refreshBookings } = useBooking();
  const navigate = useNavigate();

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
    if (!authLoading && isAuthenticated) {
      fetchTrips(activeTab);
      refreshBookings();
    }
  }, [activeTab, authLoading, isAuthenticated, refreshBookings]);

  // Combine API trips with booking trips
  const allTrips = useMemo(
    () => [...bookingTrips, ...trips],
    [bookingTrips, trips]
  );

  // Select first trip when trips load
  useEffect(() => {
    if (allTrips.length > 0 && !selectedTrip) {
      const allowedStatuses = ["upcoming", "past", "cancelled"] as const;
      const trip = allTrips[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const safeStatus = allowedStatuses.includes(trip.status as any)
        ? (trip.status as "upcoming" | "past" | "cancelled")
        : "upcoming";
      setSelectedTrip({ ...trip, status: safeStatus });
    }
  }, [allTrips, selectedTrip]);

  // Fetch itinerary when selected trip changes
  useEffect(() => {
    if (selectedTrip && activeView === "itinerary") {
      fetchItinerary(selectedTrip.id);
    }
  }, [selectedTrip, activeView]);

  // Add logging to verify API responses
  const fetchTrips = async (status: "upcoming" | "past" | "cancelled") => {
    try {
      setIsLoadingTrips(true);
      setError(null);
      console.log(`Fetching trips with status: ${status}`); // Log the status
      const tripsData = await tripsAPI.getTrips(status);
      console.log("Trips data fetched:", tripsData); // Log the fetched data
      setTrips(tripsData.results || tripsData);
      setSelectedTrip(null);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setError("Failed to load trips");
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
                  Upcoming (
                  {bookingTrips.filter(() => activeTab === "upcoming").length})
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
                  Past
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
                  Cancelled
                </button>
              </div>
            </div>

            {/* Content Area */}
            {isLoadingTrips ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-medium">Loading trips...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Error Loading Trips
                  </h3>
                  <p className="text-red-600 text-center">{error}</p>
                  <button
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 font-medium"
                    onClick={() => fetchTrips(activeTab)}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : allTrips.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">✈️</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No {activeTab} trips found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      You don't have any {activeTab} trips yet.
                    </p>
                    {activeTab === "upcoming" && (
                      <button
                        className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                        onClick={() => navigate("/packages")}
                      >
                        <span className="mr-2">🎒</span>
                        Book Your First Trip
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Trip Selection */}
                {allTrips.length > 1 && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Trip
                    </label>
                    <select
                      value={selectedTrip?.id || ""}
                      onChange={(e) => {
                        const trip = allTrips.find(
                          (t) => t.id === e.target.value
                        );
                        setSelectedTrip((trip as ExtendedTrip) || null);
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {allTrips.map((trip) => (
                        <option key={trip.id} value={trip.id}>
                          {trip.title} - {formatDate(trip.start_date)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Trip Details */}
                {selectedTrip && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Trip Header */}
                    <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">
                            {selectedTrip.title}
                          </h2>
                          <p className="text-lg opacity-90">
                            {formatDate(selectedTrip.start_date)} -{" "}
                            {formatDate(selectedTrip.end_date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`px-4 py-2 rounded-full font-semibold text-sm ${
                              selectedTrip.status === "upcoming"
                                ? "bg-green-500 text-white"
                                : selectedTrip.status === "cancelled"
                                ? "bg-red-500 text-white"
                                : "bg-gray-500 text-white"
                            }`}
                          >
                            {selectedTrip.status.charAt(0).toUpperCase() +
                              selectedTrip.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* View Toggle */}
                    <div className="border-b border-gray-100 p-6">
                      <div className="flex gap-2">
                        <button
                          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                            activeView === "overview"
                              ? "bg-primary text-white shadow-md"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          onClick={() => setActiveView("overview")}
                        >
                          <span className="mr-2">📊</span>
                          Overview
                        </button>
                        <button
                          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                            activeView === "itinerary"
                              ? "bg-primary text-white shadow-md"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          onClick={() => setActiveView("itinerary")}
                        >
                          <span className="mr-2">🗓️</span>
                          Itinerary
                        </button>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6">
                      {activeView === "overview" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                                <span className="text-2xl text-white">📅</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 mb-1">
                                  Duration
                                </h3>
                                <p className="text-gray-600">
                                  {selectedTrip.duration}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                <span className="text-2xl text-white">📍</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 mb-1">
                                  Location
                                </h3>
                                <p className="text-gray-600">
                                  {selectedTrip.location}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                                <span className="text-2xl text-white">🎯</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 mb-1">
                                  Activities
                                </h3>
                                <p className="text-gray-600">
                                  {selectedTrip.activities_count} planned
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                                <span className="text-2xl text-white">🏨</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 mb-1">
                                  Check-in
                                </h3>
                                <p className="text-gray-600">
                                  {selectedTrip.check_in_time}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                                <span className="text-2xl text-white">🌤️</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 mb-1">
                                  Weather
                                </h3>
                                <p className="text-gray-600">
                                  {selectedTrip.weather}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                                <span className="text-2xl text-white">💰</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 mb-1">
                                  Total Cost
                                </h3>
                                <p className="text-gray-600">
                                  ৳
                                  {selectedTrip?.price !== undefined &&
                                  selectedTrip?.price !== null
                                    ? selectedTrip.price.toLocaleString()
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {isLoadingItinerary ? (
                            <div className="flex items-center justify-center py-12">
                              <div className="flex flex-col items-center gap-4">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-600">
                                  Loading itinerary...
                                </p>
                              </div>
                            </div>
                          ) : itinerary.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-3xl">📋</span>
                                </div>
                                <p className="text-gray-500">
                                  No itinerary items found for this trip.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {itinerary.map((item, index) => (
                                <div
                                  key={item.id}
                                  className="flex gap-6 items-start"
                                >
                                  <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                      <span className="text-xl text-white">
                                        {item.icon}
                                      </span>
                                    </div>
                                    {index < itinerary.length - 1 && (
                                      <div className="w-1 h-16 bg-gradient-to-b from-primary to-primary-light mt-2"></div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
                                      <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-gray-900 text-lg">
                                          {item.title}
                                        </h3>
                                        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                                          {formatDateTime(item.date_time)}
                                        </span>
                                      </div>
                                      <p className="text-gray-600">
                                        {item.description}
                                      </p>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyTrips;
