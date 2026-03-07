/* eslint-disable react-refresh/only-export-components */
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

import { API_BASE } from '../config/api';
interface BookingItem {
  id: string;
  type: "hotel" | "package" | "trip";
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
  travelers: number;
  image?: string;
}

interface BookingStats {
  totalBookings: number;
  upcomingTrips: number;
  totalSpent: number;
  completedTrips: number;
  pendingBookings: number;
  cancelledBookings: number;
  averageSpentPerTrip: number;
  favoriteDestination: string;
  memberSince: string;
}

interface BookingContextType {
  bookings: BookingItem[];
  stats: BookingStats;
  addBooking: (booking: Omit<BookingItem, "id" | "createdAt">) => void;
  updateBookingStatus: (id: string, status: BookingItem["status"]) => void;
  refreshBookings: () => Promise<void>;
  isLoading: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate stats from bookings
  const stats: BookingStats = React.useMemo(() => {
    const now = new Date();
    const upcoming = bookings.filter(
      (b) => new Date(b.startDate) > now && b.status === "confirmed"
    );
    const completed = bookings.filter(
      (b) => new Date(b.endDate) < now && b.status === "confirmed"
    );
    const pending = bookings.filter((b) => b.status === "pending");
    const cancelled = bookings.filter((b) => b.status === "cancelled");
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
    const totalSpent = confirmedBookings.reduce((sum, b) => sum + b.price, 0);

    // Calculate favorite destination
    const destinations = bookings
      .filter((b) => b.location && b.status === "confirmed")
      .map((b) => b.location!);
    const destinationCounts = destinations.reduce((acc, dest) => {
      acc[dest] = (acc[dest] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favoriteDestination =
      Object.entries(destinationCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "";

    return {
      totalBookings: bookings.length,
      upcomingTrips: upcoming.length,
      totalSpent,
      completedTrips: completed.length,
      pendingBookings: pending.length,
      cancelledBookings: cancelled.length,
      averageSpentPerTrip:
        confirmedBookings.length > 0
          ? Math.round(totalSpent / confirmedBookings.length)
          : 0,
      favoriteDestination,
      memberSince:
        bookings.length > 0
          ? new Date(
            Math.min(...bookings.map((b) => new Date(b.createdAt).getTime()))
          )
            .toISOString()
            .split("T")[0]
          : "",
    };
  }, [bookings]);

  // Add new booking (immediate update)
  const addBooking = useCallback(
    (newBooking: Omit<BookingItem, "id" | "createdAt">) => {
      const booking: BookingItem = {
        ...newBooking,
        id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      setBookings((prev) => [booking, ...prev]);

      // Show success notification
      if (typeof window !== "undefined") {
        const event = new CustomEvent("booking-success", {
          detail: { booking, message: `${booking.title} booked successfully!` },
        });
        window.dispatchEvent(event);
      }
    },
    []
  );

  // Update booking status
  const updateBookingStatus = useCallback(
    (id: string, status: BookingItem["status"]) => {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, status } : booking
        )
      );
    },
    []
  );

  // Refresh from API using new unified bookings endpoint
  const refreshBookings = async () => {
    setIsLoading(true);
    try {
      const API_BASE =
        import.meta.env.VITE_REACT_APP_API_URL ||
        `${API_BASE}/api`;
      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("token");

      if (!token) {
        console.warn("No auth token found for booking refresh");
        setBookings([]);
        setIsLoading(false);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      console.log("Refreshing bookings from unified endpoint");

      // Fetch all booking types using the new unified endpoint
      const [packageRes, hotelRes, flightRes] = await Promise.all([
        fetch(`${API_BASE}/bookings/?type=package`, { headers }),
        fetch(`${API_BASE}/bookings/?type=hotel`, { headers }),
        fetch(`${API_BASE}/bookings/?type=flight`, { headers }),
      ]);

      const allBookings: BookingItem[] = [];

      // Process package bookings
      if (packageRes.ok) {
        const packageData = await packageRes.json();
        const packages =
          packageData.data?.bookings || packageData.bookings || [];
        allBookings.push(...packages);
      }

      // Process hotel bookings
      if (hotelRes.ok) {
        const hotelData = await hotelRes.json();
        const hotels = hotelData.data?.bookings || hotelData.bookings || [];
        allBookings.push(...hotels);
      }

      // Process flight bookings
      if (flightRes.ok) {
        const flightData = await flightRes.json();
        const flights = flightData.data?.bookings || flightData.bookings || [];
        allBookings.push(...flights);
      }

      console.log(`Loaded ${allBookings.length} total bookings`);
      setBookings(allBookings);
    } catch (error) {
      console.error("Failed to refresh bookings:", error);
      setBookings([]); // Clear on error
    } finally {
      setIsLoading(false);
    }
  }; // Removed the empty dependency array to fix syntax error

  return (
    <BookingContext.Provider
      value={{
        bookings,
        stats,
        addBooking,
        updateBookingStatus,
        refreshBookings,
        isLoading,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
