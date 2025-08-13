"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

interface BookingItem {
  id: string
  type: "hotel" | "package" | "trip"
  title: string
  location: string
  startDate: string
  endDate: string
  price: number
  status: "confirmed" | "pending" | "cancelled"
  createdAt: string
  travelers: number
  image?: string
}

interface BookingStats {
  totalBookings: number
  upcomingTrips: number
  totalSpent: number
  completedTrips: number
}

interface BookingContextType {
  bookings: BookingItem[]
  stats: BookingStats
  addBooking: (booking: Omit<BookingItem, "id" | "createdAt">) => void
  updateBookingStatus: (id: string, status: BookingItem["status"]) => void
  refreshBookings: () => Promise<void>
  isLoading: boolean
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Calculate stats from bookings
  const stats: BookingStats = React.useMemo(() => {
    const now = new Date()
    const upcoming = bookings.filter((b) => new Date(b.startDate) > now && b.status === "confirmed")
    const completed = bookings.filter((b) => new Date(b.endDate) < now && b.status === "confirmed")

    return {
      totalBookings: bookings.length,
      upcomingTrips: upcoming.length,
      totalSpent: bookings.reduce((sum, b) => sum + (b.status === "confirmed" ? b.price : 0), 0),
      completedTrips: completed.length,
    }
  }, [bookings])

  // Add new booking (immediate update)
  const addBooking = useCallback((newBooking: Omit<BookingItem, "id" | "createdAt">) => {
    const booking: BookingItem = {
      ...newBooking,
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }

    setBookings((prev) => [booking, ...prev])

    // Show success notification
    if (typeof window !== "undefined") {
      const event = new CustomEvent("booking-success", {
        detail: { booking, message: `${booking.title} booked successfully!` },
      })
      window.dispatchEvent(event)
    }
  }, [])

  // Update booking status
  const updateBookingStatus = useCallback((id: string, status: BookingItem["status"]) => {
    setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status } : booking)))
  }, [])

  // Refresh from API
  const refreshBookings = useCallback(async () => {
    setIsLoading(true)
    try {
      // Simulate API calls - replace with real endpoints
      const [hotelBookings, packageBookings, tripBookings] = await Promise.all([
        fetch("/api/bookings/hotels")
          .then((r) => r.json())
          .catch(() => []),
        fetch("/api/bookings/packages")
          .then((r) => r.json())
          .catch(() => []),
        fetch("/api/bookings/trips")
          .then((r) => r.json())
          .catch(() => []),
      ])

      const allBookings = [
        ...hotelBookings.map((b: any) => ({ ...b, type: "hotel" as const })),
        ...packageBookings.map((b: any) => ({ ...b, type: "package" as const })),
        ...tripBookings.map((b: any) => ({ ...b, type: "trip" as const })),
      ]

      setBookings(allBookings)
    } catch (error) {
      console.error("Failed to refresh bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

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
  )
}
