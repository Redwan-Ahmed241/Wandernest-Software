// API configuration and service functions
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api"

// Get auth token from localStorage (matching your existing auth setup)
const getAuthToken = (): string | null => {
  return localStorage.getItem("token")
}

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
      throw new Error("Unauthorized")
    }
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}

// User API functions
export const userAPI = {
  getProfile: async () => {
    return apiRequest("/user/profile/")
  },

  updateProfile: async (userData: Partial<UserData>) => {
    return apiRequest("/user/profile/", {
      method: "PATCH",
      body: JSON.stringify(userData),
    })
  },

  uploadProfileImage: async (imageFile: File) => {
    const formData = new FormData()
    formData.append("profile_image", imageFile)

    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}/user/profile/image/`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    return response.json()
  },

  getStats: async () => {
    return apiRequest("/user/stats/")
  },
}

// Trips API functions
export const tripsAPI = {
  getTrips: async (status?: "upcoming" | "past" | "cancelled") => {
    const endpoint = status ? `/trips/?status=${status}` : "/trips/"
    return apiRequest(endpoint)
  },

  getTripDetails: async (tripId: string) => {
    return apiRequest(`/trips/${tripId}/`)
  },

  getTripItinerary: async (tripId: string) => {
    return apiRequest(`/trips/${tripId}/itinerary/`)
  },

  updateTrip: async (tripId: string, tripData: Partial<Trip>) => {
    return apiRequest(`/trips/${tripId}/`, {
      method: "PATCH",
      body: JSON.stringify(tripData),
    })
  },

  cancelTrip: async (tripId: string) => {
    return apiRequest(`/trips/${tripId}/cancel/`, {
      method: "POST",
    })
  },
}

// Visa API functions
export const visaAPI = {
  getVisaRequirements: async (countryCode: string, purpose: string) => {
    return apiRequest(`/visa/requirements/?country=${countryCode}&purpose=${purpose}`)
  },

  getCountries: async () => {
    return apiRequest("/visa/countries/")
  },

  getVisaPurposes: async () => {
    return apiRequest("/visa/purposes/")
  },

  submitVisaApplication: async (applicationData: VisaApplicationData) => {
    return apiRequest("/visa/applications/", {
      method: "POST",
      body: JSON.stringify(applicationData),
    })
  },

  getCurrencyRates: async () => {
    return apiRequest("/visa/currency-rates/")
  },

  getEmbassyContacts: async (countryCode?: string) => {
    const endpoint = countryCode ? `/visa/embassies/?country=${countryCode}` : "/visa/embassies/"
    return apiRequest(endpoint)
  },

  getTravelFAQs: async () => {
    return apiRequest("/visa/faqs/")
  },
}

// Package API functions
export const packageAPI = {
  // Get available transport options
  getTransportOptions: async () => {
    return apiRequest("/packages/transport-options/")
  },

  // Get available hotel options
  getHotelOptions: async () => {
    return apiRequest("/packages/hotel-options/")
  },

  // Get available vehicle options
  getVehicleOptions: async () => {
    return apiRequest("/packages/vehicle-options/")
  },

  // Get available guide options
  getGuideOptions: async () => {
    return apiRequest("/packages/guide-options/")
  },

  // Create a new package
  createPackage: async (packageData: CreatePackageData) => {
    return apiRequest("/packages/", {
      method: "POST",
      body: JSON.stringify(packageData),
    })
  },

  // Get user's packages
  getUserPackages: async () => {
    return apiRequest("/packages/my-packages/")
  },

  // Get package details
  getPackageDetails: async (packageId: string) => {
    return apiRequest(`/packages/${packageId}/`)
  },

  // Update package
  updatePackage: async (packageId: string, packageData: Partial<CreatePackageData>) => {
    return apiRequest(`/packages/${packageId}/`, {
      method: "PATCH",
      body: JSON.stringify(packageData),
    })
  },

  // Delete package
  deletePackage: async (packageId: string) => {
    return apiRequest(`/packages/${packageId}/`, {
      method: "DELETE",
    })
  },
}

// Flight API functions
export const flightAPI = {
  // Search flights
  searchFlights: async (searchParams: FlightSearchParams) => {
    return apiRequest("/flights/search/", {
      method: "POST",
      body: JSON.stringify(searchParams),
    })
  },

  // Create flight booking
  createBooking: async (bookingData: FlightBookingData) => {
    return apiRequest("/flights/bookings/", {
      method: "POST",
      body: JSON.stringify(bookingData),
    })
  },

  // Get user's flight bookings
  getUserBookings: async () => {
    return apiRequest("/flights/bookings/my-bookings/")
  },

  // Get booking details
  getBookingDetails: async (bookingId: string) => {
    return apiRequest(`/flights/bookings/${bookingId}/`)
  },

  // Cancel booking
  cancelBooking: async (bookingId: string) => {
    return apiRequest(`/flights/bookings/${bookingId}/cancel/`, {
      method: "POST",
    })
  },

  // Update booking
  updateBooking: async (bookingId: string, updateData: Partial<FlightBookingData>) => {
    return apiRequest(`/flights/bookings/${bookingId}/`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    })
  },
}

// NEW: Community API functions
export const communityAPI = {
  // Get all blog posts
  getBlogs: async (page?: number, limit?: number) => {
    const params = new URLSearchParams()
    if (page) params.append("page", page.toString())
    if (limit) params.append("limit", limit.toString())
    const endpoint = `/community/blogs/${params.toString() ? "?" + params.toString() : ""}`
    return apiRequest(endpoint)
  },

  // Get blog by ID
  getBlogById: async (blogId: string) => {
    return apiRequest(`/community/blogs/${blogId}/`)
  },

  // Search blogs
  searchBlogs: async (query: string) => {
    return apiRequest(`/community/blogs/search/?q=${encodeURIComponent(query)}`)
  },

  // Get all travel groups
  getGroups: async (page?: number, limit?: number) => {
    const params = new URLSearchParams()
    if (page) params.append("page", page.toString())
    if (limit) params.append("limit", limit.toString())
    const endpoint = `/community/groups/${params.toString() ? "?" + params.toString() : ""}`
    return apiRequest(endpoint)
  },

  // Get user's joined groups
  getUserGroups: async () => {
    return apiRequest("/community/groups/my-groups/")
  },

  // Join a group
  joinGroup: async (groupId: string) => {
    return apiRequest(`/community/groups/${groupId}/join/`, {
      method: "POST",
    })
  },

  // Leave a group
  leaveGroup: async (groupId: string) => {
    return apiRequest(`/community/groups/${groupId}/leave/`, {
      method: "POST",
    })
  },

  // Search groups
  searchGroups: async (query: string) => {
    return apiRequest(`/community/groups/search/?q=${encodeURIComponent(query)}`)
  },

  // Get group details
  getGroupDetails: async (groupId: string) => {
    return apiRequest(`/community/groups/${groupId}/`)
  },

  // Search all community content
  searchCommunity: async (query: string) => {
    return apiRequest(`/community/search/?q=${encodeURIComponent(query)}`)
  },

  // Create a new blog post
  createBlog: async (blogData: CreateBlogData) => {
    return apiRequest("/community/blogs/", {
      method: "POST",
      body: JSON.stringify(blogData),
    })
  },

  // Update blog post
  updateBlog: async (blogId: string, blogData: Partial<CreateBlogData>) => {
    return apiRequest(`/community/blogs/${blogId}/`, {
      method: "PATCH",
      body: JSON.stringify(blogData),
    })
  },

  // Delete blog post
  deleteBlog: async (blogId: string) => {
    return apiRequest(`/community/blogs/${blogId}/`, {
      method: "DELETE",
    })
  },
}

// Types
export interface UserData {
  id?: string
  email: string
  first_name: string
  last_name: string
  username: string
  age?: number
  country?: string
  phone?: string
  profile_image?: string
}

export interface UserStats {
  trips_taken: number
  hotels_booked: number
  cars_rented: number
  average_rating: number
}

export interface Trip {
  id: string
  title: string
  start_date: string
  end_date: string
  duration: string
  location: string
  activities_count: number
  check_in_time: string
  weather: string
  currency: string
  status: "upcoming" | "past" | "cancelled"
  created_at: string
  updated_at: string
  price?: number
  travelers?: number
}

export interface ItineraryItem {
  id: string
  trip_id: string
  type: "arrival" | "hotel" | "dining" | "sightseeing" | "excursion" | "shopping"
  title: string
  date_time: string
  icon: string
  description: string
  order: number
}

// Visa-related types
export interface Country {
  code: string
  name: string
  flag: string
}

export interface VisaPurpose {
  id: string
  name: string
  description: string
}

export interface VisaRequirement {
  country: string
  purpose: string
  type: "visa_free" | "visa_on_arrival" | "evisa_required" | "visa_required"
  duration: string
  requirements: string[]
  processing_time: string
  fee: string
}

export interface VisaApplicationData {
  country: string
  purpose: string
  personal_info: {
    full_name: string
    passport_number: string
    nationality: string
    date_of_birth: string
  }
  travel_info: {
    arrival_date: string
    departure_date: string
    purpose_details: string
  }
}

export interface CurrencyRate {
  from_currency: string
  to_currency: string
  rate: number
  last_updated: string
}

export interface EmbassyContact {
  country: string
  embassy_name: string
  address: string
  phone: string
  email: string
  website: string
}

// Package-related types
export interface PackageOption {
  id: string
  name: string
  description: string
  price: number
  image?: string
  rating?: number
  features?: string[]
  availability: boolean
}

export interface CreatePackageData {
  title: string
  from_location: string
  to_location: string
  start_date: string
  end_date: string
  travelers_count: number
  budget: number
  transport_id?: string | null
  hotel_id?: string | null
  vehicle_id?: string | null
  guide_id?: string | null
  preferences: {
    skip_transport: boolean
    skip_hotel: boolean
    skip_vehicle: boolean
    skip_guide: boolean
  }
}

export interface TravelPackage {
  id: string
  title: string
  from_location: string
  to_location: string
  start_date: string
  end_date: string
  travelers_count: number
  budget: number
  total_cost: number
  status: "draft" | "confirmed" | "cancelled"
  transport?: PackageOption
  hotel?: PackageOption
  vehicle?: PackageOption
  guide?: PackageOption
  created_at: string
  updated_at: string
}

// Flight-related types
export interface FlightSearchParams {
  from: string
  to: string
  departure_date: string
  return_date?: string
  passengers: number
  class?: "economy" | "business" | "first"
}

export interface FlightBookingData {
  flight_id: string
  passengers: PassengerInfo[]
  contact_email: string
  contact_phone: string
  special_requests?: string
  total_price: number
  booking_date: string
  flight_details: {
    airline: string
    flight_number: string
    from: string
    to: string
    departure: string
    arrival: string
    duration: string
    aircraft?: string
  }
  user_id?: string
  status: "pending" | "confirmed" | "cancelled"
}

export interface PassengerInfo {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  passportNumber?: string
}

export interface FlightBooking {
  id: string
  booking_reference: string
  flight_details: {
    airline: string
    flight_number: string
    from: string
    to: string
    departure: string
    arrival: string
    duration: string
    aircraft?: string
  }
  passengers: PassengerInfo[]
  contact_email: string
  contact_phone: string
  total_price: number
  status: "pending" | "confirmed" | "cancelled"
  booking_date: string
  created_at: string
  updated_at: string
}

// NEW: Community-related types
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt?: string
  author: {
    id: string
    username: string
    first_name: string
    last_name: string
    profile_image?: string
  }
  image?: string
  created_at: string
  updated_at: string
  tags?: string[]
  likes_count: number
  comments_count: number
  is_liked?: boolean
}

export interface TravelGroup {
  id: string
  name: string
  description: string
  image?: string
  cover_image?: string
  member_count: number
  created_by: {
    id: string
    username: string
    first_name: string
    last_name: string
  }
  created_at: string
  is_member?: boolean
  is_admin?: boolean
  category?: string
  location?: string
}

export interface CreateBlogData {
  title: string
  content: string
  excerpt?: string
  image?: File
  tags?: string[]
}

export interface CommunitySearchResults {
  blogs: BlogPost[]
  groups: TravelGroup[]
  total_results: number
}

export interface GroupMember {
  id: string
  user: {
    id: string
    username: string
    first_name: string
    last_name: string
    profile_image?: string
  }
  joined_at: string
  role: "member" | "admin" | "moderator"
}
