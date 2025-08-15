"use client";
import type { FunctionComponent } from "react";
import { useCallback, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// Tailwind CSS used for all styling. Centralized color theme via tailwind.config.js
import Layout from "../App/Layout";
import { useAuth } from "../Authentication/auth-context";

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

interface _Review {
  id: string;
  userName: string;
  date: string;
  rating: number;
  comment: string;
  likes: number;
  dislikes: number;
}

interface _FilterOptions {
  price: string;
  rating: string;
  location: string;
  roomType: string;
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

const AMENITY_LINKS = [
  {
    key: "restaurants",
    title: "Local Restaurants",
    description: "Discover popular dining spots",
    icon: "/figma_photos/loc_res.svg",
    route: "/restaurant",
  },
  {
    key: "attractions",
    title: "Tourist Attractions",
    description: "Explore nearby places of interest",
    icon: "/figma_photos/attraction.svg",
    route: "/things-to-do",
  },
  {
    key: "transport",
    title: "Public Transport",
    description: "Find transport options",
    icon: "/figma_photos/transport.svg",
    route: "/public-transport",
  },
  {
    key: "shopping",
    title: "Shopping Centers",
    description: "Shop at the best locations",
    icon: "/figma_photos/shop.svg",
    route: "/shopping-centers",
  },
  // ...other amenities
];

const MEDIA_BASE = "https://wander-nest-ad3s.onrender.com";

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

const _checkRatingMatch = (rating: number, filterRating: string): boolean => {
  const starCount = Number.parseInt(filterRating.charAt(0));
  return rating >= starCount;
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
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Please enter a valid email";
    // Phone validation (basic)
    if (form.phone.length < 10) return "Please enter a valid phone number";
    return null;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validate form first
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsProcessingPayment(true);
    try {
      // Calculate total amount
      const totalAmount = (hotel?.price || 0) * form.guests;
      // Prepare payment data - try nested object for service_data
      const paymentData = {
        service_type: "hotel",
        service_name: hotel?.name || "Hotel Booking",
        service_details: `Hotel booking for ${form.guests} guests`,
        amount: totalAmount,
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
      };
      console.log("Sending payment data:", paymentData);
      const token = localStorage.getItem("token"); // or get it from your auth context

      const response = await fetch(
        "https://wander-nest-ad3s.onrender.com/initiate-payment/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(paymentData),
        }
      );
      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );
      // Get response text first to see what we're actually receiving
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
      console.log("Parsed response data:", data);
      // Handle different response scenarios
      if (!response.ok) {
        const errorMessage =
          data?.detail ||
          data?.message ||
          data?.error ||
          data?.errors?.[0] ||
          `Server error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }
      // Check for successful payment initialization
      if (data.status === "SUCCESS" && data.GatewayPageURL) {
        console.log("Redirecting to:", data.GatewayPageURL);
        window.location.href = data.GatewayPageURL;
      } else if (data.GatewayPageURL) {
        // Sometimes status might not be exactly 'SUCCESS'
        console.log("Redirecting to gateway:", data.GatewayPageURL);
        window.location.href = data.GatewayPageURL;
      } else {
        // Log the full response to understand the structure
        console.error("Unexpected response structure:", data);
        throw new Error(
          data.detail ||
            data.message ||
            "Payment gateway URL not received. Please try again."
        );
      }
    } catch (err: any) {
      console.error("Payment error details:", err);
      let errorMessage = "Payment failed. Please try again.";
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (err.message.includes("JSON")) {
        errorMessage = "Server response error. Please try again later.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-bold text-primary-700">
            Book {hotel.name}
          </h2>
          <button
            className="text-2xl font-bold text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="flex gap-4 mb-4">
          <img
            src={
              hotel.image_url ||
              "https://via.placeholder.com/400x200?text=Hotel+Image"
            }
            alt={hotel.name}
            className="w-40 h-28 object-cover rounded-lg border"
          />
          <div>
            <h3 className="text-lg font-semibold text-primary-600">
              {hotel.name}
            </h3>
            <p className="text-sm text-gray-600">{hotel.location}</p>
            <p className="text-base font-bold text-green-600">
              ৳{hotel.price}/night
            </p>
          </div>
        </div>
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="flex flex-col">
            <label className="font-medium mb-1">Full Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-400"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-400"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Phone *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-400"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col flex-1">
              <label className="font-medium mb-1">Check-in Date *</label>
              <input
                name="checkin"
                type="date"
                value={form.checkin}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
                className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-400"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="font-medium mb-1">Guests</label>
              <input
                name="guests"
                type="number"
                min={1}
                value={form.guests}
                onChange={handleChange}
                required
                className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-400"
              />
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded border mb-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-green-600 font-bold text-lg">
                ৳{(hotel?.price || 0) * form.guests}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              ৳{hotel?.price || 0} × {form.guests} guests
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white py-2 rounded font-semibold hover:bg-primary-600 transition"
            disabled={isProcessingPayment}
          >
            {isProcessingPayment
              ? "Processing Payment..."
              : `Pay ৳${(hotel?.price || 0) * form.guests} & Book Hotel`}
          </button>
        </form>
        {error && (
          <div className="mt-3 text-red-600 text-center font-medium">
            {error}
          </div>
        )}
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

  // Data states
  const [hotels, setHotels] = useState<Hotel[]>([]);

  // Dynamic filter options
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
      // Unique locations
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
      // Unique star ratings (descending)
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
        "https://wander-nest-ad3s.onrender.com/api/hotels/"
      );
      if (!response.ok) throw new Error("Failed to fetch hotels");

      const data = await response.json();
      console.log("API Response:", data); // Debug log
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

      // Transform API data
      const transformedHotels: Hotel[] = hotelsData.map((hotel: any) => ({
        id: hotel.id || hotel._id || "unknown-id", // Use consistent ID
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
            : "/placeholder.svg?height=200&width=300",
        price:
          typeof hotel.price === "string"
            ? parseFloat(hotel.price.replace(/[^\d.]/g, "")) || 0
            : Number(hotel.price) || 0,
        star: hotel.star || 0,
        amenities: hotel.amenities || [],
        roomTypes: hotel.roomTypes || (hotel.type ? [hotel.type] : []),
      }));
      console.log("Transformed hotels:", transformedHotels); // Debug log
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
      // Remove the filter for this category
      const { [filter]: _, ...rest } = selectedFilters;
      setSelectedFilters(rest);
    } else {
      setSelectedFilters({ ...selectedFilters, [filter]: option });
    }
    setOpenFilter(null);
  };

  // Extract main city/area from location (first word or comma-separated part)
  const extractCity = (location: string) => {
    if (!location) return "";
    // Try to get the first comma-separated part, or first word
    return location.split(",")[0].trim();
  };

  // Use dynamic filter options
  const dynamicFilterOptions = {
    Price: FILTER_OPTIONS.Price,
    Rating: ratingOptions,
    Location: locationOptions,
    "Room Type": FILTER_OPTIONS["Room Type"],
  };

  // Filter hotels by search and selected filters
  const filteredHotels = hotels.filter((hotel) => {
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

  // Navigation functions
  const onHotelClick = useCallback((hotelId: string) => {
    // navigate(`/hotel/${hotelId}`)
  }, []);

  const _onViewAllClick = useCallback(() => {
    // navigate("/hotels")
  }, []);

  // Handle booking
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
      <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300 py-8 px-4">
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700">
            Hotels & Rooms
          </h1>
        </div>
        <div className="flex items-center justify-center mb-6">
          <img
            src="/figma_photos/search.svg"
            alt="search"
            className="w-6 h-6 mr-2"
          />
          <input
            type="text"
            className="border rounded px-4 py-2 w-80 focus:outline-none focus:ring focus:border-primary-400"
            placeholder="Search hotels, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mb-8">
          <div
            className="flex flex-wrap gap-4 justify-center mb-6"
            ref={filterDropdownRef}
          >
            {Object.keys(dynamicFilterOptions).map((filter) => (
              <div key={filter} className="relative">
                <button
                  className={`px-4 py-2 rounded border bg-white shadow hover:bg-primary-100 transition font-medium ${
                    selectedFilters[filter as FilterKey] &&
                    selectedFilters[filter as FilterKey] !== "All"
                      ? "border-primary-500 text-primary-700"
                      : "border-gray-300 text-gray-700"
                  }`}
                  onClick={() => handleFilterClick(filter as FilterKey)}
                >
                  {selectedFilters[filter as FilterKey] &&
                  selectedFilters[filter as FilterKey] !== "All"
                    ? selectedFilters[filter as FilterKey]
                    : filter}
                  <img
                    src="/figma_photos/darrow.svg"
                    alt=""
                    className={`inline-block ml-2 w-4 h-4 ${
                      openFilter === (filter as FilterKey) ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFilter === (filter as FilterKey) && (
                  <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow z-10">
                    {(
                      dynamicFilterOptions[filter as FilterKey] as string[]
                    ).map((option: string) => (
                      <div
                        key={option}
                        className={`px-3 py-2 cursor-pointer hover:bg-primary-50 ${
                          selectedFilters[filter as FilterKey] === option ||
                          (!selectedFilters[filter as FilterKey] &&
                            option === "All")
                            ? "bg-primary-100 font-semibold"
                            : ""
                        }`}
                        onClick={() =>
                          handleOptionSelect(filter as FilterKey, option)
                        }
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingHotels && (
              <div className="col-span-full text-center py-8 text-gray-500">
                Loading hotels...
              </div>
            )}
            {searchError && (
              <div className="col-span-full text-center py-8 text-red-500">
                {searchError}
              </div>
            )}
            {!isLoadingHotels &&
              !searchError &&
              filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col"
                  onClick={() => onHotelClick(hotel.id)}
                >
                  <img
                    src={hotel.image_url}
                    alt=""
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-primary-700 mb-1">
                        {hotel.name}
                      </h2>
                      <p className="text-sm text-gray-600 mb-2">
                        {hotel.description}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-primary-500 bg-primary-100 px-2 py-1 rounded">
                          {hotel.location}
                        </span>
                        {hotel.star > 0 && (
                          <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                            {"⭐".repeat(hotel.star)} {hotel.star} Star
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-green-600">
                        ৳{hotel.price.toLocaleString()}/night
                      </span>
                      <button
                        type="button"
                        className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookHotel(hotel);
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {!isLoadingHotels &&
              !searchError &&
              filteredHotels.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No hotels found matching your criteria.
                </div>
              )}
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary-700 mb-6 text-center">
            Local Amenities and Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {AMENITY_LINKS.map((amenity) => (
              <div
                key={amenity.key}
                className="bg-white rounded-lg shadow flex items-center gap-4 p-4 cursor-pointer hover:bg-primary-50 transition"
                onClick={() => navigate(amenity.route)}
              >
                <img
                  src={amenity.icon || "/placeholder.svg"}
                  alt={amenity.title}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h3 className="text-lg font-semibold text-primary-600">
                    {amenity.title}
                  </h3>
                  <p className="text-sm text-gray-600">{amenity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
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
