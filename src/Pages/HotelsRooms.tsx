/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import type { FunctionComponent } from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { useAuth } from "../Authentication/auth-context";
import { API_BASE } from '../config/api';
import {
  Search,
  MapPin,
  Star,
  Filter,
  Wifi,
  Truck,
  Coffee,
} from "react-feather";
import Pagination from "../components/Pagination";
import { usePagination } from "../hooks/usePagination";
import { initiatePayment } from "../api/payments";

// Define interfaces
interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  image_url: string;
  price: number;
  star: number;
  amenities: string[];
  roomTypes: string[];
}

const FILTER_OPTIONS = {
  Price: ["All", "Under 3000৳", "3000–7000৳", "7000+৳"],
  Rating: ["All", "5 Star", "4 Star", "3 Star"],
  Location: [
    "All",
    "Dhaka",
    "Chittagong",
    "Sylhet",
    "Cox's Bazar",
    "Bandarban",
  ],
  "Room Type": ["All", "Single", "Double", "Suite", "Family"],
};

type FilterKey = keyof typeof FILTER_OPTIONS;

const MEDIA_BASE = `${API_BASE}`;

// Create hotel booking record
// Helper to get normalized token and scheme
function getAuthHeaders() {
  const rawToken =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("token") ||
        localStorage.getItem("access") ||
        localStorage.getItem("access_token") ||
        undefined
      : undefined;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (rawToken) {
    let tokenStr = String(rawToken).trim();
    tokenStr = tokenStr.replace(/^Bearer\s+/i, "").replace(/^Token\s+/i, "");
    const looksLikeJwt =
      tokenStr.split(".").length === 3 || /^ey[A-Za-z0-9_-]/.test(tokenStr);
    const scheme = looksLikeJwt ? "Bearer" : "Token";
    headers["Authorization"] = `${scheme} ${tokenStr}`;
  }
  return headers;
}

const createHotelBooking = async (bookingData: {
  hotel_id: string;
  hotel_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  checkin_date: string;
  guests: number;
  total_amount: number;
  booking_id?: string; // Make optional
  status: string;
  location: string;
}) => {
  const response = await fetch(
    `${API_BASE}/api/bookings/hotels/`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...bookingData,
        type: "hotel",
        start_date: bookingData.checkin_date, // Backend expects snake_case
        end_date: new Date(
          new Date(bookingData.checkin_date).getTime() + 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0], // Next day
        price: bookingData.total_amount,
        title: bookingData.hotel_name,
        travelers: bookingData.guests,
        createdAt: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "Failed to create booking record:",
      response.statusText,
      errorText
    );
    throw new Error(`Failed to create hotel booking: ${response.statusText}`);
  }

  const bookingResult = await response.json();
  console.log("Hotel booking created successfully:", bookingResult);
  return bookingResult;
};

// Helper functions for filtering
const checkPriceRange = (price: number, range: string): boolean => {
  switch (range) {
    case "Under 3000৳":
      return price < 3000;
    case "3000–7000৳":
      return price >= 3000 && price <= 7000;
    case "7000+৳":
      return price > 7000;
    default:
      return true;
  }
};

// Booking Modal Component
interface BookingModalProps {
  hotel: Hotel;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ hotel, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    checkin: "",
    guests: 1,
  });
  const [error, setError] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.phone.trim()) return "Phone is required";
    if (!form.checkin) return "Check-in date is required";
    if (form.guests < 1) return "At least 1 guest is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Please enter a valid email";
    if (form.phone.length < 10) return "Please enter a valid phone number";
    return null;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsProcessingPayment(true);
    try {
      const totalAmount = (hotel?.price || 0) * form.guests;

      // STEP 1: Create booking record FIRST to get the booking_id (UUID)
      const bookingResponse = await createHotelBooking({
        hotel_id: hotel.id,
        hotel_name: hotel.name,
        customer_name: form.name.trim(),
        customer_email: form.email.trim(),
        customer_phone: form.phone.trim(),
        checkin_date: form.checkin,
        guests: form.guests,
        total_amount: totalAmount,
        status: "pending",
        location: hotel.location,
      });

      console.log("[Hotel Payment] Booking created:", bookingResponse);

      // Extract the UUID booking ID from the response
      // Backend returns UUID in 'id' field
      const bookingId = bookingResponse?.id;

      if (!bookingId) {
        throw new Error(
          "Failed to get booking ID from server. Please try again."
        );
      }

      console.log("[Hotel Payment] Using booking_id:", bookingId);

      // STEP 2: Initiate payment with the UUID booking_id from Step 1
      const paymentResponse = await initiatePayment({
        amount: totalAmount,
        currency: "BDT",
        booking_id: bookingId, // UUID from database
        service_type: "hotel" as const,
        service_name: hotel?.name || "Hotel Booking",
        service_details: `Hotel booking for ${form.guests} guests`,
        customer_name: form.name.trim(),
        customer_email: form.email.trim(),
        customer_phone: form.phone.trim(),
        service_data: {
          hotel_id: hotel.id,
          hotel_name: hotel.name,
          checkin_date: form.checkin,
          guests: form.guests,
          location: hotel.location,
        },
      });

      // STEP 3: Redirect to payment gateway
      window.location.href = paymentResponse.GatewayPageURL;
    } catch (err: unknown) {
      let errorMessage = "Payment failed. Please try again.";
      if (err instanceof TypeError && err.message.includes("fetch")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (err instanceof Error && err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Book {hotel.name}
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <span className="text-xl text-gray-600">×</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Hotel Info */}
          <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
            <img
              src={
                hotel.image_url ||
                "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400"
              }
              alt={hotel.name}
              className="w-24 h-24 rounded-xl object-cover shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (
                  target.src !==
                  "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400"
                ) {
                  target.src =
                    "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400";
                }
              }}
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {hotel.name}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{hotel.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: hotel.star }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold text-green-600">
                  ৳{hotel.price.toLocaleString()}/night
                </span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-in Date *
                </label>
                <input
                  name="checkin"
                  type="date"
                  value={form.checkin}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Guests
              </label>
              <input
                name="guests"
                type="number"
                min={1}
                value={form.guests}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Total Amount */}
            <div className="bg-primary/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-primary">
                  ৳{((hotel?.price || 0) * form.guests).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                ৳{hotel?.price?.toLocaleString() || 0} × {form.guests} guests
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessingPayment}
              className="w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: '#6ab187',
                color: 'white',
              }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#519a6b')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#6ab187')}
            >
              {isProcessingPayment
                ? "Processing Payment..."
                : `Pay ৳${(
                    (hotel?.price || 0) * form.guests
                  ).toLocaleString()} & Book Hotel`}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 font-medium text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HotelsRooms: FunctionComponent = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Search and filter states
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key in FilterKey]?: string;
  }>({});
  const filterDropdownRef = useRef<HTMLDivElement>(null);

    // Sorting state
    const [sortOption, setSortOption] = useState("Default");

  // Data states
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [locationOptions, setLocationOptions] = useState<string[]>(["All"]);
  const [ratingOptions, setRatingOptions] = useState<string[]>(["All"]);

  // Loading states
  const [isLoadingHotels, setIsLoadingHotels] = useState(true);
  const [searchError, setSearchError] = useState("");

  // Modal states
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Load hotels on component mount
  useEffect(() => {
    fetchHotels();
  }, []);

  // Update dynamic filter options when hotels change
  useEffect(() => {
    if (hotels.length > 0) {
      const locs = Array.from(
        new Set(
          hotels.map((h) =>
            h.location && h.location.trim()
              ? h.location.split(",")[0].trim()
              : "Unknown Location"
          )
        )
      );
      setLocationOptions(["All", ...locs.filter((l) => l && l !== "All")]);

      const stars = Array.from(
        new Set(
          hotels
            .map((h) => h.star)
            .filter((s) => typeof s === "number" && s > 0)
        )
      ).sort((a, b) => b - a);
      setRatingOptions(["All", ...stars.map((s) => `${s} Star`)]);
    }
  }, [hotels]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenFilter(null);
      }
    }
    if (openFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openFilter]);

  // Fetch hotels from API
  const fetchHotels = async () => {
    setIsLoadingHotels(true);
    setSearchError("");
    try {
      const response = await fetch(
        `${API_BASE}/api/hotels/`
      );
      if (!response.ok) throw new Error("Failed to fetch hotels");

      const data = await response.json();
      let hotelsData = [];
      if (Array.isArray(data)) {
        hotelsData = data;
      } else if (Array.isArray(data?.results)) {
        hotelsData = data.results;
      } else if (Array.isArray(data?.data)) {
        hotelsData = data.data;
      } else if (Array.isArray(data?.hotels)) {
        hotelsData = data.hotels;
      } else {
        throw new Error("Unexpected response structure");
      }

      const transformedHotels: Hotel[] = hotelsData.map((hotel: any) => ({
        id: hotel.id || hotel._id || "unknown-id",
        name: hotel.name || "Unknown Hotel",
        description: hotel.description || "No description available",
        location: hotel.location || "Unknown Location",
        image_url:
          hotel.image_url && hotel.image_url.startsWith("http")
            ? hotel.image_url
            : hotel.image_url
            ? `${MEDIA_BASE}${hotel.image_url}`
            : hotel.image && hotel.image.startsWith("http")
            ? hotel.image
            : hotel.image
            ? `${MEDIA_BASE}${hotel.image}`
            : "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600",
        price:
          typeof hotel.price === "string"
            ? parseFloat(hotel.price.replace(/[^\d.]/g, "")) || 0
            : Number(hotel.price) || 0,
        star: hotel.star || 0,
        amenities: hotel.amenities || [],
        roomTypes: hotel.roomTypes || (hotel.type ? [hotel.type] : []),
      }));
      setHotels(transformedHotels);
    } catch (err) {
      setSearchError("Failed to fetch hotels. Please try again.");
      setHotels([]);
      console.error("Hotel fetch error:", err);
    } finally {
      setIsLoadingHotels(false);
    }
  };

  // Filter functions
  const handleFilterClick = (filter: FilterKey) => {
    setOpenFilter(openFilter === filter ? null : filter);
  };

  const handleOptionSelect = (filter: FilterKey, option: string) => {
    if (option === "All") {
      const { [filter]: _, ...rest } = selectedFilters;
      setSelectedFilters(rest);
    } else {
      setSelectedFilters({ ...selectedFilters, [filter]: option });
    }
    setOpenFilter(null);
  };

  const extractCity = (location: string) => {
    if (!location) return "";
    return location.split(",")[0].trim();
  };

  const dynamicFilterOptions = {
    Price: FILTER_OPTIONS.Price,
    Rating: ratingOptions,
    Location: locationOptions,
    "Room Type": FILTER_OPTIONS["Room Type"],
  };

  // Filter hotels by search and selected filters
  let filteredHotels = hotels.filter((hotel) => {
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      hotel.name.toLowerCase().includes(query) ||
      hotel.description.toLowerCase().includes(query) ||
      hotel.location.toLowerCase().includes(query);

    const matchesFilters = Object.entries(selectedFilters).every(
      ([filter, value]) => {
        if (filter === "Price") {
          return checkPriceRange(hotel.price, value);
        }
        if (filter === "Rating") {
          if (value === "All") return true;
          const selectedStar = parseInt(value);
          return hotel.star === selectedStar;
        }
        if (filter === "Location") {
          return (
            extractCity(hotel.location).toLowerCase() === value.toLowerCase()
          );
        }
        if (filter === "Room Type") {
          let hotelRoomTypes: string[] = [];
          if (Array.isArray(hotel.roomTypes)) {
            hotelRoomTypes = (hotel.roomTypes as string[]).map((rt: string) =>
              rt.trim()
            );
          } else if (typeof (hotel.roomTypes as any) === "string") {
            hotelRoomTypes = [(hotel.roomTypes as string).trim()];
          }
          return hotelRoomTypes.some(
            (rt) => rt.toLowerCase() === value.toLowerCase()
          );
        }
        return true;
      }
    );

    return matchesSearch && matchesFilters;
  });

  // Sorting logic
  if (sortOption === "Price: Low-High") {
    filteredHotels = [...filteredHotels].sort((a, b) => a.price - b.price);
  } else if (sortOption === "Price: High-Low") {
    filteredHotels = [...filteredHotels].sort((a, b) => b.price - a.price);
  } else if (sortOption === "Rating (High > Low)") {
    filteredHotels = [...filteredHotels].sort((a, b) => b.star - a.star);
  } else if (sortOption === "Rating (Low > High)") {
    filteredHotels = [...filteredHotels].sort((a, b) => a.star - b.star);
  }

  // Pagination logic
  const ITEMS_PER_PAGE = 9; // 3x3 grid
  const {
    currentPage,
    totalPages,
    currentItems: paginatedHotels,
    goToPage,
    totalItems,
    itemsPerPage,
  } = usePagination({
    data: filteredHotels,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const handleBookHotel = (hotel: Hotel) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSelectedHotel(hotel);
    setIsBookingModalOpen(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Hotels Bangladesh"
              className="w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.7) blur(0px)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary opacity-80"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Hotels & Rooms
              <span className="block bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent drop-shadow-lg">
                Accommodations
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto mb-8 drop-shadow">
              Find the perfect place to stay during your Bangladesh adventure
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                  <Search className="w-7 h-7 text-gray-700 drop-shadow-lg" />
                </span>
                <input
                  type="text"
                  placeholder="Search hotels, locations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-accent/30 shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4 items-center" ref={filterDropdownRef}>
              {/* Sort By dropdown */}
              <div className="relative">
                <label htmlFor="sort" className="mr-2 font-semibold text-gray-700">Sort By:</label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                  className="px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 border-none shadow focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="Default">Default</option>
                  <option value="Price: Low-High">Price: Low-High</option>
                  <option value="Price: High-Low">Price: High-Low</option>
                </select>
              </div>
              {/* Existing filters */}
              {Object.keys(dynamicFilterOptions).map((filter) => (
                <div key={filter} className="relative">
                  <button
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      selectedFilters[filter as FilterKey] &&
                      selectedFilters[filter as FilterKey] !== "All"
                        ? "bg-[#4a6b5b] text-white shadow-lg scale-105 hover:bg-[#0d1c1c]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:bg-gray-300"
                    }`}
                    onClick={() => handleFilterClick(filter as FilterKey)}
                  >
                    <Filter className="w-4 h-4" />
                    {selectedFilters[filter as FilterKey] &&
                    selectedFilters[filter as FilterKey] !== "All"
                      ? selectedFilters[filter as FilterKey]
                      : filter}
                    <span
                      className={`transform transition-transform duration-200 ${
                        openFilter === (filter as FilterKey) ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  {openFilter === (filter as FilterKey) && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                      {(
                        dynamicFilterOptions[filter as FilterKey] as string[]
                      ).map((option: string) => (
                        <button
                          key={option}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                            selectedFilters[filter as FilterKey] === option ||
                            (!selectedFilters[filter as FilterKey] &&
                              option === "All")
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-gray-700"
                          }`}
                          onClick={() =>
                            handleOptionSelect(filter as FilterKey, option)
                          }
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hotels Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            {isLoadingHotels ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse"
                  >
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchError ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Error Loading Hotels
                </h3>
                <p className="text-red-600 mb-6">{searchError}</p>
                <button
                  onClick={fetchHotels}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hotels found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedFilters({});
                  }}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedHotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={hotel.image_url}
                          alt={hotel.name}
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (
                              target.src !==
                              "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600"
                            ) {
                              target.src =
                                "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600";
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold">
                            {hotel.star}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {hotel.location}
                              </span>
                            </div>
                            <div className="text-accent font-bold text-lg">
                              ৳{hotel.price.toLocaleString()}/night
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
                          {hotel.name}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {hotel.description}
                        </p>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                            <Wifi className="w-3 h-3" />
                            <span>WiFi</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                            <Truck className="w-3 h-3" />
                            <span>Parking</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                            <Coffee className="w-3 h-3" />
                            <span>Restaurant</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: hotel.star }).map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 text-yellow-500 fill-current"
                              />
                            ))}
                            <span className="text-sm text-gray-500 ml-1">
                              ({hotel.star} Star)
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookHotel(hotel);
                            }}
                            className="px-6 py-2 bg-[#6ab187] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                          >
                            Book Now
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 transition-transform duration-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    className="mt-8"
                  />
                )}
              </div>
            )}
          </div>
        </section>

        {/* Booking Modal */}
        {isBookingModalOpen && selectedHotel && (
          <BookingModal
            hotel={selectedHotel}
            onClose={() => {
              setIsBookingModalOpen(false);
              setSelectedHotel(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default HotelsRooms;
