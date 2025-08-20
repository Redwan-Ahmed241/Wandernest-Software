"use client";
import type { FunctionComponent } from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
replace
import Layout from "../Components/Layout";
import { useAuth } from "../Authentication/auth-context";
import { Search, MapPin, Star, ArrowRight, Filter, Wifi, Truck, Coffee, ShoppingBag } from "react-feather";

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

const AMENITY_LINKS = [
  {
    key: "restaurants",
    title: "Local Restaurants",
    description: "Discover popular dining spots",
    icon: <Coffee className="w-8 h-8" />,
    route: "/restaurant",
    color: "from-orange-500 to-red-500"
  },
  {
    key: "attractions",
    title: "Tourist Attractions",
    description: "Explore nearby places of interest",
    icon: <MapPin className="w-8 h-8" />,
    route: "/things-to-do",
    color: "from-blue-500 to-indigo-500"
  },
  {
    key: "transport",
    title: "Public Transport",
    description: "Find transport options",
    icon: <Truck className="w-8 h-8" />,
    route: "/public-transport",
    color: "from-green-500 to-emerald-500"
  },
  {
    key: "shopping",
    title: "Shopping Centers",
    description: "Shop at the best locations",
    icon: <ShoppingBag className="w-8 h-8" />,
    route: "/shopping-centers",
    color: "from-purple-500 to-pink-500"
  },
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

      const token = localStorage.getItem("token");
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

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error("Invalid response format from server");
      }

      if (!response.ok) {
        const errorMessage = data?.detail || data?.message || data?.error || `Server error: ${response.status}`;
        throw new Error(errorMessage);
      }

      if (data.status === "SUCCESS" && data.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else if (data.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else {
        throw new Error("Payment gateway URL not received. Please try again.");
      }
    } catch (err: unknown) {
      let errorMessage = "Payment failed. Please try again.";
      if (err instanceof TypeError && err.message.includes("fetch")) {
        errorMessage = "Network error. Please check your connection and try again.";
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
            <h2 className="text-2xl font-bold text-gray-900">Book {hotel.name}</h2>
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
              src={hotel.image_url || "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400"}
              alt={hotel.name}
              className="w-24 h-24 rounded-xl object-cover shadow-md"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{hotel.name}</h3>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{hotel.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: hotel.star }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <span className="text-2xl font-bold text-green-600">৳{hotel.price.toLocaleString()}/night</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in Date *</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Guests</label>
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
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
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
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingPayment ? "Processing Payment..." : `Pay ৳${((hotel?.price || 0) * form.guests).toLocaleString()} & Book Hotel`}
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
      const response = await fetch("https://wander-nest-ad3s.onrender.com/api/hotels/");
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
          return extractCity(hotel.location).toLowerCase() === value.toLowerCase();
        }
        if (filter === "Room Type") {
          let hotelRoomTypes: string[] = [];
          if (Array.isArray(hotel.roomTypes)) {
            hotelRoomTypes = (hotel.roomTypes as string[]).map((rt: string) => rt.trim());
          } else if (typeof (hotel.roomTypes as any) === "string") {
            hotelRoomTypes = [(hotel.roomTypes as string).trim()];
          }
          return hotelRoomTypes.some((rt) => rt.toLowerCase() === value.toLowerCase());
        }
        return true;
      }
    );

    return matchesSearch && matchesFilters;
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
        <section className="relative py-20 bg-gradient-to-br from-primary via-primary-dark to-primary overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1920')"
            }}
          ></div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Hotels &
              <span className="block bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Accommodations
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto mb-8">
              Find the perfect place to stay during your Bangladesh adventure
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search hotels, locations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-accent/30 shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4" ref={filterDropdownRef}>
              {Object.keys(dynamicFilterOptions).map((filter) => (
                <div key={filter} className="relative">
                  <button
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${selectedFilters[filter as FilterKey] && selectedFilters[filter as FilterKey] !== "All"
                        ? "bg-primary text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                      }`}
                    onClick={() => handleFilterClick(filter as FilterKey)}
                  >
                    <Filter className="w-4 h-4" />
                    {selectedFilters[filter as FilterKey] && selectedFilters[filter as FilterKey] !== "All"
                      ? selectedFilters[filter as FilterKey]
                      : filter}
                    <span className={`transform transition-transform duration-200 ${openFilter === (filter as FilterKey) ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {openFilter === (filter as FilterKey) && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                      {(dynamicFilterOptions[filter as FilterKey] as string[]).map((option: string) => (
                        <button
                          key={option}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${selectedFilters[filter as FilterKey] === option ||
                              (!selectedFilters[filter as FilterKey] && option === "All")
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-gray-700"
                            }`}
                          onClick={() => handleOptionSelect(filter as FilterKey, option)}
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
                  <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Hotels</h3>
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={hotel.image_url}
                        alt={hotel.name}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold">{hotel.star}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm font-medium">{hotel.location}</span>
                          </div>
                          <div className="text-accent font-bold text-lg">৳{hotel.price.toLocaleString()}/night</div>
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
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                          <span className="text-sm text-gray-500 ml-1">({hotel.star} Star)</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookHotel(hotel);
                          }}
                          className="px-6 py-2 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                        >
                          Book Now
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Local Amenities */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Local Amenities & Services
              </h2>
              <p className="text-lg text-gray-600">
                Discover what's around your hotel
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {AMENITY_LINKS.map((amenity) => (
                <div
                  key={amenity.key}
                  className="group bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  onClick={() => navigate(amenity.route)}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${amenity.color} rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    {amenity.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
                    {amenity.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {amenity.description}
                  </p>
                  <div className="flex items-center gap-1 text-primary font-semibold group-hover:gap-2 transition-all duration-200">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
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