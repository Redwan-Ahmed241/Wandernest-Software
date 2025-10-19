"use client";

import { type FunctionComponent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Tailwind CSS used for all styling. Centralized color theme via tailwind.config.js

import Layout from "../components/layout";

import { useAuth } from "../Authentication/auth-context";
import { getHotels, type Hotel, getTransportOptions, type TransportOption } from "../App/api-services";
import { guidesAPI, type Guide } from "../api/guides";

// Function to get appropriate guide image based on guide data
const getGuideImage = (guide: Guide): string => {
  // First check if guide has a valid image URL from API
  if (guide.image && guide.image.trim() !== "" && guide.image !== "null" && guide.image !== "undefined") {
    return guide.image;
  }
  
  if (guide.profile_picture && guide.profile_picture.trim() !== "" && guide.profile_picture !== "null" && guide.profile_picture !== "undefined") {
    return guide.profile_picture;
  }
  
  // Use different placeholder images for different guides
  const images = [
    "/Figma_photos/abtahi_bro-modified-reduced.png",
    "/Figma_photos/redwan-bro-modified-reduced.png", 
    "/Figma_photos/1600px_COLOURBOX5006565.jpg",
    "/Figma_photos/ifty_bro_2-modified_reduced.png",
    "/Figma_photos/NE.jpeg",
    "/Figma_photos/onu.png"
  ];
  
  // Use guide ID to consistently assign the same image to the same guide
  const imageIndex = (guide.id - 1) % images.length;
  return images[imageIndex];
};

interface PackageOption {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
}

interface CreatePackageData {
  title: string;
  from_location: string;
  to_location: string;
  start_date: string;
  end_date: string;
  travelers_count: number;
  budget: number;
  transport_id: string | null;
  hotel_id: string | null;
  guide_id: string | null;
  preferences: {
    skip_transport: boolean;
    skip_hotel: boolean;
    skip_vehicle: boolean;
    skip_guide: boolean;
  };
}

const CreatePackage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const today = new Date();

  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(1);

  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  // Transport filter state
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Hotel filter state
  const [hotelLocation, setHotelLocation] = useState("");
  const [hotelMinPrice, setHotelMinPrice] = useState("");
  const [hotelMaxPrice, setHotelMaxPrice] = useState("");

  // Guide filter state
  const [guideLocation, setGuideLocation] = useState("");
  const [guideMinPrice, setGuideMinPrice] = useState("");
  const [guideMaxPrice, setGuideMaxPrice] = useState("");

  // Package options state
  const [transportOptions, setTransportOptions] = useState<PackageOption[]>([]);
  const [hotelOptions, setHotelOptions] = useState<PackageOption[]>([
    {
      id: "1",
      name: "Dhaka City Center Hotel",
      description: "Modern 4-star hotel in the heart of Dhaka city",
      image: "/Figma_photos/city_center_hotel.png",
      price: 4500,
    },
    {
      id: "2",
      name: "Cox's Bazar Beach Resort",
      description: "Luxury beachfront resort in Cox's Bazar with spa and pool",
      image: "/Figma_photos/city_hotel.webp",
      price: 7500,
    },
    {
      id: "3",
      name: "Sylhet Heritage Lodge",
      description: "Traditional lodge in Sylhet with authentic local experience",
      image: "/Figma_photos/c_lodge.jpeg",
      price: 3200,
    },
    {
      id: "4",
      name: "Chittagong Harbor View Hotel",
      description: "Premium hotel in Chittagong with harbor views",
      image: "/Figma_photos/city_center_hotel.png",
      price: 5200,
    },
    {
      id: "5",
      name: "Rangpur Grand Hotel",
      description: "Luxury accommodation in Rangpur city center",
      image: "/Figma_photos/city_hotel.webp",
      price: 3800,
    },
    {
      id: "6",
      name: "Dhaka Budget Inn",
      description: "Affordable and clean accommodation in Dhaka",
      image: "/Figma_photos/c_lodge.jpeg",
      price: 2500,
    },
  ]);
  const [guideOptions, setGuideOptions] = useState<PackageOption[]>([]);

  // Selection state
  const [selectedTransport, setSelectedTransport] = useState<string | null>(
    null
  );
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  // Skip state
  const [skipTransport, setSkipTransport] = useState(false);
  const [skipHotel, setSkipHotel] = useState(false);
  const [skipGuide, setSkipGuide] = useState(false);

  // Loading and error states
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isCreatingPackage, setIsCreatingPackage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Calendar state
  const [startCalendarMonth, setStartCalendarMonth] = useState(
    today.getMonth()
  );
  const [startCalendarYear, setStartCalendarYear] = useState(
    today.getFullYear()
  );
  const [endCalendarMonth, setEndCalendarMonth] = useState(today.getMonth());
  const [endCalendarYear, setEndCalendarYear] = useState(today.getFullYear());

  // Fetch package options on component mount
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchPackageOptions();
    }
  }, [authLoading, isAuthenticated]);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchPackageOptions = async () => {
    try {
      setIsLoadingOptions(true);
      setError(null);
      console.log("Starting to fetch package options...");

      // Use real APIs for all services
      const [transportData, hotelsData, guidesData] = await Promise.all(
        [
          getTransportOptions().catch((err) => {
            console.error("Transport API error:", err);
            return [];
          }),
          getHotels().catch((err) => {
            console.error("Hotels API error:", err);
            return [];
          }),
          guidesAPI.getGuides().catch((err) => {
            console.error("Guides API error:", err);
            return { guides: [] };
          }),
        ]
      );

      console.log("Raw hotels data from API:", hotelsData);

      // Map hotels data to PackageOption format with better error handling
      let mappedHotels: PackageOption[] = [];

      if (Array.isArray(hotelsData) && hotelsData.length > 0) {
        mappedHotels = hotelsData.map((hotel: Hotel) => ({
          id: hotel.id?.toString() || Math.random().toString(),
          name: hotel.name || "Unknown Hotel",
          description: hotel.description || "No description available",
          image: hotel.image_url || "/Figma_photos/city_center_hotel.png", // Remove /public/ prefix
          price: hotel.price || 0,
        }));
        console.log("Successfully mapped hotels:", mappedHotels);
      } else {
        console.log(
          "No hotels data received or invalid format, using fallback"
        );
      }

      // Map transport data to PackageOption format
      console.log("Raw transport data from API:", transportData);
      
      let mappedTransport: PackageOption[] = [];
      
      if (Array.isArray(transportData) && transportData.length > 0) {
        mappedTransport = transportData.map((transport: TransportOption) => ({
          id: transport.id?.toString() || Math.random().toString(),
          name: transport.name || "Unknown Transport",
          description: `${transport.type} - ${transport.route || 'Route not specified'}${transport.frequency ? ` - ${transport.frequency}` : ''}`,
          image: transport.image || transport.image_url || "/Figma_photos/bus.png",
          price: typeof transport.price === 'string' ? parseFloat(transport.price) || 0 : transport.price || 0,
        }));
        console.log("Successfully mapped transport:", mappedTransport);
      }

      // Set transport with fallback data
      if (mappedTransport.length > 0) {
        setTransportOptions(mappedTransport);
        console.log("Using real transport data:", mappedTransport.length, "transport options");
      } else {
        const fallbackTransport = [
          {
            id: "fallback_1",
            name: "Dhaka - Chittagong Bus",
            description: "Luxury AC bus service between Dhaka and Chittagong with Wi-Fi",
            image: "/Figma_photos/bus.png",
            price: 1500,
          },
          {
            id: "fallback_2",
            name: "Dhaka - Sylhet Private Car",
            description: "Private sedan with professional driver for Dhaka-Sylhet route",
            image: "/Figma_photos/car.svg",
            price: 3500,
          },
          {
            id: "fallback_3",
            name: "Dhaka - Cox's Bazar Flight",
            description: "Direct flight from Dhaka to Cox's Bazar with meals",
            image: "/Figma_photos/flight.svg",
            price: 8500,
          },
        ];
        setTransportOptions(fallbackTransport);
        console.log("Using fallback transport data:", fallbackTransport.length, "transport options");
      }

      // Set hotels with fallback data
      if (mappedHotels.length > 0) {
        setHotelOptions(mappedHotels);
        console.log("Using real hotel data:", mappedHotels.length, "hotels");
      } else {
        const fallbackHotels = [
          {
            id: "fallback_1",
            name: "City Center Hotel",
            description: "Modern 4-star hotel in the heart of the city",
            image: "/Figma_photos/city_center_hotel.png",
            price: 4500,
          },
          {
            id: "fallback_2",
            name: "Beach Resort",
            description: "Luxury beachfront resort with spa and pool",
            image: "/Figma_photos/city_hotel.webp",
            price: 7500,
          },
          {
            id: "fallback_3",
            name: "Heritage Lodge",
            description: "Traditional lodge with authentic local experience",
            image: "/Figma_photos/c_lodge.jpeg",
            price: 3200,
          },
        ];
        setHotelOptions(fallbackHotels);
        console.log(
          "Using fallback hotel data:",
          fallbackHotels.length,
          "hotels"
        );
      }

      // Map guides data to PackageOption format
      console.log("Raw guides data from API:", guidesData);
      
      let mappedGuides: PackageOption[] = [];
      
      if (guidesData && guidesData.guides && Array.isArray(guidesData.guides) && guidesData.guides.length > 0) {
        mappedGuides = guidesData.guides.map((guide: Guide) => {
          // Always use getGuideImage function to ensure unique images for each guide
          const guideImage = getGuideImage(guide);
          console.log(`Guide ${guide.name} (ID: ${guide.id}) assigned image: ${guideImage}`);
          
          return {
            id: guide.id?.toString() || Math.random().toString(),
            name: guide.name || "Unknown Guide",
            description: guide.description || guide.bio || "No description available",
            image: guideImage,
            price: guide.price || guide.daily_rate || guide.price_per_day || 0,
          };
        });
        console.log("Successfully mapped guides:", mappedGuides);
      }

      // Set guides with fallback data  
      if (mappedGuides.length > 0) {
        setGuideOptions(mappedGuides);
        console.log("Using real guide data:", mappedGuides.length, "guides");
      } else {
        const fallbackGuides = [
          {
            id: "fallback_1",
            name: "Ahmed Rahman",
            description: "Expert local guide in Dhaka with 10+ years experience in cultural tours",
            image: "/Figma_photos/abtahi_bro-modified-reduced.png",
            price: 2500,
          },
          {
            id: "fallback_2",
            name: "Sarah Khan",
            description: "Adventure specialist guide in Cox's Bazar for hiking and outdoor activities",
            image: "/Figma_photos/deer.jpg",
            price: 3000,
          },
          {
            id: "fallback_3",
            name: "Mahmud Hassan",
            description: "Historical sites expert in Sylhet with archaeology background",
            image: "/Figma_photos/fc09d33522052723c107a6d1fe5741b0-ahsan-manzil.jpg",
            price: 2800,
          },
        ];
        setGuideOptions(fallbackGuides);
        console.log("Using fallback guide data:", fallbackGuides.length, "guides");
      }
    } catch (error) {
      console.error("Error fetching package options:", error);
      setError("Failed to load package options");
    } finally {
      setIsLoadingOptions(false);
    }
  };

  // Calendar utilities
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getDaysArray = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  // Check if date is in the past
  const isPastDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Date handlers with past date validation
  const handleStartDateSelect = (day: number) => {
    if (isPastDate(startCalendarYear, startCalendarMonth, day)) {
      return; // Don't allow past dates
    }
    const selectedDate = `${startCalendarYear}-${(startCalendarMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    setStartDate(selectedDate);
    setShowStartCalendar(false);
  };

  const handleEndDateSelect = (day: number) => {
    if (isPastDate(endCalendarYear, endCalendarMonth, day)) {
      return; // Don't allow past dates
    }
    // Also check if end date is before start date
    const selectedEndDate = new Date(endCalendarYear, endCalendarMonth, day);
    const startDateObj = new Date(startDate);
    if (startDate && selectedEndDate <= startDateObj) {
      return; // Don't allow end date before or same as start date
    }
    const selectedDate = `${endCalendarYear}-${(endCalendarMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    setEndDate(selectedDate);
    setShowEndCalendar(false);
  };

  // Calendar navigation functions
  const handleStartPrevMonth = () => {
    if (startCalendarMonth === 0) {
      setStartCalendarMonth(11);
      setStartCalendarYear(startCalendarYear - 1);
    } else {
      setStartCalendarMonth(startCalendarMonth - 1);
    }
  };

  const handleStartNextMonth = () => {
    if (startCalendarMonth === 11) {
      setStartCalendarMonth(0);
      setStartCalendarYear(startCalendarYear + 1);
    } else {
      setStartCalendarMonth(startCalendarMonth + 1);
    }
  };

  const handleEndPrevMonth = () => {
    if (endCalendarMonth === 0) {
      setEndCalendarMonth(11);
      setEndCalendarYear(endCalendarYear - 1);
    } else {
      setEndCalendarMonth(endCalendarMonth - 1);
    }
  };

  const handleEndNextMonth = () => {
    if (endCalendarMonth === 11) {
      setEndCalendarMonth(0);
      setEndCalendarYear(endCalendarYear + 1);
    } else {
      setEndCalendarMonth(endCalendarMonth + 1);
    }
  };

  // Selection handlers
  const handleOptionSelect = (
    optionId: string,
    currentSelection: string | null,
    setSelection: (id: string | null) => void,
    isSkipped: boolean
  ) => {
    if (!isSkipped) {
      setSelection(currentSelection === optionId ? null : optionId);
      // Clear selection error when user makes a selection
      if (selectionError) {
        setSelectionError(null);
        setShowErrorModal(false);
      }
    }
  };

  // Skip handlers
  const handleSkip = (
    isSkipped: boolean,
    setSkip: (skip: boolean) => void,
    setSelection: (id: string | null) => void
  ) => {
    setSkip(!isSkipped);
    if (!isSkipped) setSelection(null);
    // Clear selection error when user skips a section
    if (selectionError) {
      setSelectionError(null);
      setShowErrorModal(false);
    }
  };

  // Filter transportation based on location and price
  const getFilteredTransportOptions = () => {
    return transportOptions.filter((option) => {
      // Location filter (check if transport name or description contains the location terms)
      const locationMatch = 
        (!fromLocation || 
         option.name.toLowerCase().includes(fromLocation.toLowerCase()) ||
         option.description.toLowerCase().includes(fromLocation.toLowerCase())) &&
        (!toLocation || 
         option.name.toLowerCase().includes(toLocation.toLowerCase()) ||
         option.description.toLowerCase().includes(toLocation.toLowerCase()));

      // Price filter
      const priceMatch = 
        (!minPrice || option.price >= Number(minPrice)) &&
        (!maxPrice || option.price <= Number(maxPrice));

      return locationMatch && priceMatch;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFromLocation("");
    setToLocation("");
    setMinPrice("");
    setMaxPrice("");
  };

  // Filter hotels based on location and price
  const getFilteredHotelOptions = () => {
    return hotelOptions.filter((option) => {
      // Location filter (check if hotel name or description contains the location terms)
      const locationMatch = 
        !hotelLocation || 
        option.name.toLowerCase().includes(hotelLocation.toLowerCase()) ||
        option.description.toLowerCase().includes(hotelLocation.toLowerCase());

      // Price filter
      const priceMatch = 
        (!hotelMinPrice || option.price >= Number(hotelMinPrice)) &&
        (!hotelMaxPrice || option.price <= Number(hotelMaxPrice));

      return locationMatch && priceMatch;
    });
  };

  // Clear hotel filters
  const clearHotelFilters = () => {
    setHotelLocation("");
    setHotelMinPrice("");
    setHotelMaxPrice("");
  };

  // Filter guides based on location and price
  const getFilteredGuideOptions = () => {
    return guideOptions.filter((option) => {
      // Location filter (check if guide name or description contains the location terms)
      const locationMatch = 
        !guideLocation || 
        option.name.toLowerCase().includes(guideLocation.toLowerCase()) ||
        option.description.toLowerCase().includes(guideLocation.toLowerCase());

      // Price filter
      const priceMatch = 
        (!guideMinPrice || option.price >= Number(guideMinPrice)) &&
        (!guideMaxPrice || option.price <= Number(guideMaxPrice));

      return locationMatch && priceMatch;
    });
  };

  // Clear guide filters
  const clearGuideFilters = () => {
    setGuideLocation("");
    setGuideMinPrice("");
    setGuideMaxPrice("");
  };

  // Form validation
  const isFormValid = () => {
    return (
      startDate !== "" &&
      endDate !== "" &&
      travelers > 0 &&
      new Date(startDate) < new Date(endDate)
    );
  };

  // Service selection validation
  const validateServiceSelection = () => {
    const transportNotSkipped = !skipTransport;
    const hotelNotSkipped = !skipHotel;
    const guideNotSkipped = !skipGuide;
    
    // If all services are skipped, that's not allowed
    if (skipTransport && skipHotel && skipGuide) {
      return "You cannot skip all services. Please include at least one service (Transport, Hotel, or Guide).";
    }
    
    // If any service is not skipped but not selected, that's an error
    if (transportNotSkipped && !selectedTransport) {
      return "Please select a transport option or skip the transport section.";
    }
    
    if (hotelNotSkipped && !selectedHotel) {
      return "Please select a hotel option or skip the hotel section.";
    }
    
    if (guideNotSkipped && !selectedGuide) {
      return "Please select a guide option or skip the guide section.";
    }
    
    return null;
  };

  // Package creation
  const handleCreatePackage = async () => {
    // Clear previous errors
    setSelectionError(null);
    setShowErrorModal(false);
    
    if (!isFormValid()) {
      setSelectionError("Please fill in all required fields and ensure dates are valid.");
      setShowErrorModal(true);
      return;
    }

    // Validate service selection
    const selectionValidationError = validateServiceSelection();
    if (selectionValidationError) {
      setSelectionError(selectionValidationError);
      setShowErrorModal(true);
      return;
    }

    try {
      setIsCreatingPackage(true);
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Token ${token}` }),
      };

      const packageData: CreatePackageData = {
        title: "Custom Travel Package",
        from_location: "",
        to_location: "",
        start_date: startDate,
        end_date: endDate,
        travelers_count: travelers,
        budget: 0, // Default budget since field was removed from UI
        transport_id: selectedTransport,
        hotel_id: selectedHotel,
        guide_id: selectedGuide,
        preferences: {
          skip_transport: skipTransport,
          skip_hotel: skipHotel,
          skip_vehicle: true,
          skip_guide: skipGuide,
        },
      };

      const response = await fetch(
        "https://wander-nest-ad3s.onrender.com/api/packages/create/",
        {
          method: "POST",
          headers,
          body: JSON.stringify(packageData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Package created successfully:", result);
      // Optionally, navigate to a success page or show a success message
    } catch (error) {
      console.error("Error creating package:", error);
      setError("Failed to create package. Please try again.");
    } finally {
      setIsCreatingPackage(false);
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen">
          <div className="flex-grow flex items-center justify-center p-8">
            <div className="text-lg font-semibold text-primary">Loading...</div>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="text-2xl font-bold text-primary mb-2">
                Create Your Custom Package
              </div>
              {error && (
                <div className="text-red-600 font-semibold mb-2">{error}</div>
              )}
              {/* Enhanced Form Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Row 1: Start Date and End Date */}
                <div className="flex flex-col gap-2 relative">
                  <label className="font-medium flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Start Date *
                  </label>
                  <input
                    className="border rounded-lg px-3 py-2 w-full cursor-pointer"
                    type="text"
                    placeholder="Select start date"
                    value={startDate}
                    readOnly
                    onClick={() => setShowStartCalendar(!showStartCalendar)}
                    required
                  />
                  {showStartCalendar && (
                    <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-10 p-4 w-64">
                      <div className="flex items-center justify-between mb-2">
                        <button
                          type="button"
                          onClick={handleStartPrevMonth}
                          className="px-2 py-1 rounded hover:bg-gray-200"
                        >
                          ←
                        </button>
                        <span className="font-semibold">
                          {new Date(
                            startCalendarYear,
                            startCalendarMonth
                          ).toLocaleString("default", { month: "long" })}{" "}
                          {startCalendarYear}
                        </span>
                        <button
                          type="button"
                          onClick={handleStartNextMonth}
                          className="px-2 py-1 rounded hover:bg-gray-200"
                        >
                          →
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysArray(
                          startCalendarYear,
                          startCalendarMonth
                        ).map((day) => {
                          const isDisabled = isPastDate(
                            startCalendarYear,
                            startCalendarMonth,
                            day
                          );
                          return (
                            <div
                              key={day}
                              className={`px-2 py-1 rounded text-center cursor-pointer ${
                                isDisabled
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "hover:bg-primary/10"
                              }`}
                              onClick={() =>
                                !isDisabled && handleStartDateSelect(day)
                              }
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 relative">
                  <label className="font-medium flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    End Date *
                  </label>
                  <input
                    className="border rounded-lg px-3 py-2 w-full cursor-pointer"
                    type="text"
                    placeholder="Select end date"
                    value={endDate}
                    readOnly
                    onClick={() => setShowEndCalendar(!showEndCalendar)}
                    required
                  />
                  {showEndCalendar && (
                    <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-10 p-4 w-64">
                      <div className="flex items-center justify-between mb-2">
                        <button
                          type="button"
                          onClick={handleEndPrevMonth}
                          className="px-2 py-1 rounded hover:bg-gray-200"
                        >
                          ←
                        </button>
                        <span className="font-semibold">
                          {new Date(
                            endCalendarYear,
                            endCalendarMonth
                          ).toLocaleString("default", { month: "long" })}{" "}
                          {endCalendarYear}
                        </span>
                        <button
                          type="button"
                          onClick={handleEndNextMonth}
                          className="px-2 py-1 rounded hover:bg-gray-200"
                        >
                          →
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysArray(endCalendarYear, endCalendarMonth).map(
                          (day) => {
                            const isDisabled =
                              isPastDate(
                                endCalendarYear,
                                endCalendarMonth,
                                day
                              ) ||
                              (startDate &&
                                new Date(
                                  endCalendarYear,
                                  endCalendarMonth,
                                  day
                                ) <= new Date(startDate));
                            return (
                              <div
                                key={day}
                                className={`px-2 py-1 rounded text-center cursor-pointer ${
                                  isDisabled
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "hover:bg-primary/10"
                                }`}
                                onClick={() =>
                                  !isDisabled && handleEndDateSelect(day)
                                }
                              >
                                {day}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {/* Row 2: Travelers */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-medium flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    Travelers *
                  </label>
                  <input
                    className="border rounded-lg px-3 py-2 w-full max-w-xs"
                    type="number"
                    min="1"
                    max="20"
                    placeholder="1"
                    value={travelers}
                    onChange={(e) =>
                      setTravelers(Number.parseInt(e.target.value) || 1)
                    }
                    required
                  />
                </div>
              </div>
            </div>
            {isLoadingOptions ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-primary font-semibold">
                  Loading package options...
                </div>
              </div>
            ) : (
              <>
                {/* Transport Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-lg text-primary">
                      Select Transport
                    </span>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200"
                      style={{ backgroundColor: '#6ab187' }}
                      onMouseOver={e => (e.currentTarget.style.backgroundColor = '#519a6b')}
                      onMouseOut={e => (e.currentTarget.style.backgroundColor = '#6ab187')}
                      onClick={() => {
                        handleSkip(
                          skipTransport,
                          setSkipTransport,
                          setSelectedTransport
                        );
                        // Clear filters when skipping transport
                        if (!skipTransport) {
                          clearFilters();
                        }
                      }}
                    >
                      {skipTransport ? "Include" : "Skip"}
                    </button>
                  </div>

                  {/* Transport Filters */}
                  {!skipTransport && (
                  <>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="mb-3">
                      <h3 className="font-medium text-gray-700">
                        Filter Transport Options
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* From Location */}
                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-sm text-gray-600">
                            From Location
                          </label>
                          <input
                            className="border rounded-lg px-3 py-2 text-sm"
                            type="text"
                            placeholder="e.g., Dhaka, Bus"
                            value={fromLocation}
                            onChange={(e) => setFromLocation(e.target.value)}
                          />
                        </div>

                        {/* To Location */}
                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-sm text-gray-600">
                            To Location
                          </label>
                          <input
                            className="border rounded-lg px-3 py-2 text-sm"
                            type="text"
                            placeholder="e.g., Chittagong, Flight"
                            value={toLocation}
                            onChange={(e) => setToLocation(e.target.value)}
                          />
                        </div>

                        {/* Min Price */}
                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-sm text-gray-600">
                            Min Price (৳)
                          </label>
                          <input
                            className="border rounded-lg px-3 py-2 text-sm"
                            type="number"
                            placeholder="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                          />
                        </div>

                        {/* Max Price */}
                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-sm text-gray-600">
                            Max Price (৳)
                          </label>
                          <input
                            className="border rounded-lg px-3 py-2 text-sm"
                            type="number"
                            placeholder="10000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                          />
                        </div>
                      </div>

                    {(fromLocation || toLocation || minPrice || maxPrice) && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <span className="text-sm text-gray-600">
                          {getFilteredTransportOptions().length} of {transportOptions.length} options shown
                        </span>
                        <button
                          type="button"
                          className="text-sm text-red-600 hover:underline"
                          onClick={clearFilters}
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Transport Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getFilteredTransportOptions().length > 0 ? (
                      getFilteredTransportOptions().map((option) => (
                      <div
                        key={option.id}
                        className={`bg-white rounded-xl shadow p-4 flex flex-col items-center cursor-pointer transition-all duration-200 border-2
                          ${selectedTransport === option.id ? "border-primary ring-2 ring-primary scale-105 shadow-lg" : "border-transparent"}
                        `}
                        style={selectedTransport === option.id ? { boxShadow: "0 0 0 3px #38bdf8, 0 4px 24px rgba(56,189,248,0.15)" } : {}}
                        onClick={() =>
                          handleOptionSelect(
                            option.id,
                            selectedTransport,
                            setSelectedTransport,
                            skipTransport
                          )
                        }
                      >
                        <img
                          className="w-full h-32 object-cover rounded mb-2"
                          alt={option.name}
                          src={
                            option.image ||
                            "/placeholder.svg?height=200&width=300"
                          }
                        />
                        <div className="w-full text-center">
                          <div className="font-bold text-primary mb-1">
                            {option.name}
                          </div>
                          <div className="text-gray-600 text-sm mb-1">
                            {option.description}
                          </div>
                          <div className="font-semibold text-lg">
                            ৳{option.price}
                          </div>
                          {selectedTransport === option.id && (
                            <span className="text-green-600 font-bold">✔</span>
                          )}
                        </div>
                      </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        <div className="text-lg font-medium mb-2">No transport options found</div>
                        <div className="text-sm">Try adjusting your search criteria</div>
                      </div>
                    )}
                  </div>
                  </>
                  )}

                  {skipTransport && (
                    <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                      <span className="text-sm">Transport section skipped</span>
                    </div>
                  )}
                </div>
                {/* Hotels Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-lg text-primary">
                      Select Hotels
                    </span>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200"
                      style={{ backgroundColor: '#6ab187' }}
                      onMouseOver={e => (e.currentTarget.style.backgroundColor = '#519a6b')}
                      onMouseOut={e => (e.currentTarget.style.backgroundColor = '#6ab187')}
                      onClick={() => {
                        handleSkip(skipHotel, setSkipHotel, setSelectedHotel);
                        // Clear hotel filters when skipping hotels
                        if (!skipHotel) {
                          clearHotelFilters();
                        }
                      }}
                    >
                      {skipHotel ? "Include" : "Skip"}
                    </button>
                  </div>

                  {!skipHotel && (
                  <>
                  {/* Hotel Filters */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="mb-3">
                      <h3 className="font-medium text-gray-700">
                        Filter Hotel Options
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Location */}
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-sm text-gray-600">
                          Location
                        </label>
                        <input
                          className="border rounded-lg px-3 py-2 text-sm"
                          type="text"
                          placeholder="e.g., Dhaka, Cox's Bazar, Sylhet"
                          value={hotelLocation}
                          onChange={(e) => setHotelLocation(e.target.value)}
                        />
                      </div>

                      {/* Min Price */}
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-sm text-gray-600">
                          Min Price per Night (৳)
                        </label>
                        <input
                          className="border rounded-lg px-3 py-2 text-sm"
                          type="number"
                          placeholder="0"
                          value={hotelMinPrice}
                          onChange={(e) => setHotelMinPrice(e.target.value)}
                        />
                      </div>

                      {/* Max Price */}
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-sm text-gray-600">
                          Max Price per Night (৳)
                        </label>
                        <input
                          className="border rounded-lg px-3 py-2 text-sm"
                          type="number"
                          placeholder="10000"
                          value={hotelMaxPrice}
                          onChange={(e) => setHotelMaxPrice(e.target.value)}
                        />
                      </div>
                    </div>

                    {(hotelLocation || hotelMinPrice || hotelMaxPrice) && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <span className="text-sm text-gray-600">
                          {getFilteredHotelOptions().length} of {hotelOptions.length} hotels shown
                        </span>
                        <button
                          type="button"
                          className="text-sm text-red-600 hover:underline"
                          onClick={clearHotelFilters}
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Hotel Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getFilteredHotelOptions().length > 0 ? (
                      getFilteredHotelOptions().map((option) => (
                      <div
                        key={option.id}
                        className={`bg-white rounded-xl shadow p-4 flex flex-col items-center cursor-pointer transition-all duration-200 border-2
                          ${selectedHotel === option.id ? "border-primary ring-2 ring-primary scale-105 shadow-lg" : "border-transparent"}
                        `}
                        style={selectedHotel === option.id ? { boxShadow: "0 0 0 3px #38bdf8, 0 4px 24px rgba(56,189,248,0.15)" } : {}}
                        onClick={() =>
                          handleOptionSelect(
                            option.id,
                            selectedHotel,
                            setSelectedHotel,
                            skipHotel
                          )
                        }
                      >
                        <img
                          className="w-full h-32 object-cover rounded mb-2"
                          alt={option.name}
                          src={
                            option.image ||
                            "/placeholder.svg?height=200&width=300"
                          }
                        />
                        <div className="w-full text-center">
                          <div className="font-bold text-primary mb-1">
                            {option.name}
                          </div>
                          <div className="text-gray-600 text-sm mb-1">
                            {option.description}
                          </div>
                          <div className="font-semibold text-lg">
                            ৳{option.price}/night
                          </div>
                          {selectedHotel === option.id && (
                            <span className="text-green-600 font-bold">✔</span>
                          )}
                        </div>
                      </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        <div className="text-lg font-medium mb-2">No hotels found</div>
                        <div className="text-sm">Try adjusting your search criteria</div>
                      </div>
                    )}
                  </div>
                  </>
                  )}

                  {skipHotel && (
                    <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                      <span className="text-sm">Hotels section skipped</span>
                    </div>
                  )}
                </div>
                {/* Guide Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-lg text-primary">
                      Hire a Guide
                    </span>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200"
                      style={{ backgroundColor: '#6ab187' }}
                      onMouseOver={e => (e.currentTarget.style.backgroundColor = '#519a6b')}
                      onMouseOut={e => (e.currentTarget.style.backgroundColor = '#6ab187')}
                      onClick={() => {
                        handleSkip(skipGuide, setSkipGuide, setSelectedGuide);
                        // Clear guide filters when skipping guides
                        if (!skipGuide) {
                          clearGuideFilters();
                        }
                      }}
                    >
                      {skipGuide ? "Include" : "Skip"}
                    </button>
                  </div>

                  {!skipGuide && (
                  <>
                  {/* Guide Filters */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="mb-3">
                      <h3 className="font-medium text-gray-700">
                        Filter Guide Options
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Location */}
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-sm text-gray-600">
                          Specialization/Location
                        </label>
                        <input
                          className="border rounded-lg px-3 py-2 text-sm"
                          type="text"
                          placeholder="e.g., Dhaka, Cultural, Adventure"
                          value={guideLocation}
                          onChange={(e) => setGuideLocation(e.target.value)}
                        />
                      </div>

                      {/* Min Price */}
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-sm text-gray-600">
                          Min Price per Day (৳)
                        </label>
                        <input
                          className="border rounded-lg px-3 py-2 text-sm"
                          type="number"
                          placeholder="0"
                          value={guideMinPrice}
                          onChange={(e) => setGuideMinPrice(e.target.value)}
                        />
                      </div>

                      {/* Max Price */}
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-sm text-gray-600">
                          Max Price per Day (৳)
                        </label>
                        <input
                          className="border rounded-lg px-3 py-2 text-sm"
                          type="number"
                          placeholder="5000"
                          value={guideMaxPrice}
                          onChange={(e) => setGuideMaxPrice(e.target.value)}
                        />
                      </div>
                    </div>

                    {(guideLocation || guideMinPrice || guideMaxPrice) && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <span className="text-sm text-gray-600">
                          {getFilteredGuideOptions().length} of {guideOptions.length} guides shown
                        </span>
                        <button
                          type="button"
                          className="text-sm text-red-600 hover:underline"
                          onClick={clearGuideFilters}
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Guide Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getFilteredGuideOptions().length > 0 ? (
                      getFilteredGuideOptions().map((option) => (
                      <div
                        key={option.id}
                        className={`bg-white rounded-xl shadow p-4 flex flex-col items-center cursor-pointer transition-all duration-200 border-2
                          ${selectedGuide === option.id ? "border-primary ring-2 ring-primary scale-105 shadow-lg" : "border-transparent"}
                        `}
                        style={selectedGuide === option.id ? { boxShadow: "0 0 0 3px #38bdf8, 0 4px 24px rgba(56,189,248,0.15)" } : {}}
                        onClick={() =>
                          handleOptionSelect(
                            option.id,
                            selectedGuide,
                            setSelectedGuide,
                            skipGuide
                          )
                        }
                      >
                        <img
                          className="w-full h-32 object-cover rounded mb-2"
                          alt={option.name}
                          src={
                            option.image ||
                            "/placeholder.svg?height=200&width=300"
                          }
                        />
                        <div className="w-full text-center">
                          <div className="font-bold text-primary mb-1">
                            {option.name}
                          </div>
                          <div className="text-gray-600 text-sm mb-1">
                            {option.description}
                          </div>
                          <div className="font-semibold text-lg">
                            ৳{option.price}/day
                          </div>
                          {selectedGuide === option.id && (
                            <span className="text-green-600 font-bold">✔</span>
                          )}
                        </div>
                      </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        <div className="text-lg font-medium mb-2">No guides found</div>
                        <div className="text-sm">Try adjusting your search criteria</div>
                      </div>
                    )}
                  </div>
                  </>
                  )}

                  {skipGuide && (
                    <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                      <span className="text-sm">Guide section skipped</span>
                    </div>
                  )}
                </div>
              </>
            )}
            {/* Confirm section */}
            <div className="mt-8 flex flex-col items-center">
              <div className="mb-4 text-gray-700 text-center font-medium">
                Review your package details and proceed to create your custom
                travel package.
              </div>
              <button
                type="button"
                className="w-full md:w-auto px-6 py-3 rounded-lg font-bold text-white shadow transition-all duration-200"
                style={{ backgroundColor: '#6ab187' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#519a6b')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#6ab187')}
                onClick={handleCreatePackage}
                disabled={isCreatingPackage}
              >
                {isCreatingPackage ? "Creating Package..." : "Create Package"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Selection Required</h3>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">{selectionError}</p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={() => {
                  setShowErrorModal(false);
                  setSelectionError(null);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CreatePackage;
