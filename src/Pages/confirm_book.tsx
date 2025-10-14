"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Layout from "../components/layout";

import { getHotels } from "../App/api-services";
import type { Hotel } from "../App/api-services";

interface Attraction {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  category: string;
}

interface Experience {
  id: number;
  name: string;
  description: string;
  image: string;
  duration: string;
  price: string;
  rating: number;
  reviews: number;
}

const optionOrder = ["transport", "hotel", "vehicle", "guide", "attractions", "experiences"] as const;
type OptionKey = (typeof optionOrder)[number];

const ConfirmBook: React.FC = () => {
  const location = useLocation();
  const { destinationId: urlDestinationId, packageId } = useParams<{ destinationId: string; packageId: string }>();
  const pkg = location.state?.pkg;
  type PackageDetails = {
    id?: string;
    title?: string;
    source?: string;
    from_location?: string;
    to_location?: string;
    destination?: string;
    price?: string | number;
    budget?: string | number;
    total_cost?: string | number;
    days?: string | number;
    image?: string;
    image_url?: string;
    transport?: {
      id: number;
      name: string;
      type: string;
      price: string;
    };
    hotel?: {
      id: number;
      name: string;
      price: string;
      rating: string;
    };
    guide?: {
      id: number;
      name: string;
      price: string;
    } | null;
    preferences?: {
      skip_guide?: boolean;
      skip_hotel?: boolean;
      skip_transport?: boolean;
    };
    [key: string]: unknown;
  };
  const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Editable fields
  const [startDate, setStartDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [totalPrice, setTotalPrice] = useState("");
  const [endDate, setEndDate] = useState("");

  const [skipHotel, setSkipHotel] = useState(false);
  const [skipVehicle, setSkipVehicle] = useState(true);
  const [skipGuide, setSkipGuide] = useState(true);
  const [skipAttractions, setSkipAttractions] = useState(false);
  const [skipExperiences, setSkipExperiences] = useState(false);

  const [activeOption, setActiveOption] = useState<OptionKey>("transport");
  const optionRefs: Record<
    OptionKey,
    React.RefObject<HTMLDivElement | null>
  > = {
    transport: useRef<HTMLDivElement>(null),
    hotel: useRef<HTMLDivElement>(null),
    vehicle: useRef<HTMLDivElement>(null),
    guide: useRef<HTMLDivElement>(null),
    attractions: useRef<HTMLDivElement>(null),
    experiences: useRef<HTMLDivElement>(null),
  };

  // Placeholder states for options (to be replaced with API data)
  const [, setTransport] = useState<string>("Not selected");
  const [, setHotel] = useState<string>("Not selected");
  const [, setGuide] = useState<string>("Not selected");

  const [warning, setWarning] = useState("");

  const navigate = useNavigate();

  const dateInputRef = React.useRef<HTMLInputElement>(null);

  // Destination ID extracted from package
  const [destinationId, setDestinationId] = useState<string | null>(null);

  // Set destination ID from URL parameter
  useEffect(() => {
    if (urlDestinationId) {
      setDestinationId(urlDestinationId);
      console.log("🎯 Using destination ID from URL:", urlDestinationId, "Type:", typeof urlDestinationId);
      console.log("🔍 URL destination ID is numeric?", /^\d+$/.test(urlDestinationId));
    }
  }, [urlDestinationId]);

  // Check if destination ID is provided
  useEffect(() => {
    if (!destinationId && !urlDestinationId) {
      console.warn("⚠️ No destination ID provided. Attractions and experiences will not be loaded.");
    }
  }, [destinationId, urlDestinationId]);

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [hotelsError, setHotelsError] = useState("");
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  // Attractions state
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [attractionsLoading, setAttractionsLoading] = useState(false);
  const [attractionsError, setAttractionsError] = useState("");
  const [selectedAttractionIds, setSelectedAttractionIds] = useState<Set<number>>(new Set());

  // Experiences state
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [experiencesLoading, setExperiencesLoading] = useState(false);
  const [experiencesError, setExperiencesError] = useState("");
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<Set<number>>(new Set());

  const getField = React.useCallback(
    (obj: PackageDetails | null, key: string): string => {
      if (!obj) return "";
      const val =
        obj[key] ??
        obj[key.toLowerCase()] ??
        obj[key.charAt(0).toUpperCase() + key.slice(1)];
      if (typeof val === "string" || typeof val === "number")
        return String(val);
      return "";
    },
    []
  );

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const extractMainLocation = (str: string): string => {
    if (!str) return "";

    const cleanStr = str.replace(/\(.*?\)/g, "").trim();

    const parts = cleanStr.split(",");
    const mainPart = parts[parts.length - 1].trim();

    return mainPart
      .replace(/[^\w\s]|_/g, "")
      .replace(/\s+/g, " ")
      .toLowerCase();
  };

  // Helper to get tomorrow's date in yyyy-mm-dd format
  const getTomorrow = () => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Add state for customer info
  const [customerName] = useState("");
  const [customerEmail] = useState("");
  const [customerPhone] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      console.log("Package data received:", pkg); // Debug log

      if (pkg?.id) {
        try {
          setLoading(true);
          setError("");

          console.log("Fetching package with ID:", pkg.id); // Debug log

          const response = await fetch(
            "https://wander-nest-ad3s.onrender.com/api/packages/all/"
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("API response:", data); // Debug log

          // Handle paginated response structure
          const packagesData =
            data.results || (Array.isArray(data) ? data : []);
          console.log("Packages data:", packagesData); // Debug log

          const found = packagesData.find(
            (p: PackageDetails) => p.id === pkg.id
          );
          console.log("Found package:", found); // Debug log

          if (found) {
            console.log("📦 Package details:", found);
            console.log("🖼️ Package image field:", found.image);
            console.log("🖼️ Package image_url field:", found.image_url);
            console.log("🚌 Transport info:", found.transport);
            console.log("🏨 Hotel info:", found.hotel);
            console.log("👨‍🦱 Guide info:", found.guide);
            console.log("⚙️ Preferences:", found.preferences);
            
            setPackageDetails(found);
            setStartDate(found.start_date || "");
            setTravelers(found.travelers_count || 1);
            setTotalPrice(found.total_cost || found.price || found.budget || "");
            
            // Pre-populate services from API response
            if (found.transport) {
              setTransport(`${found.transport.name} - ৳${found.transport.price}`);
              setActiveOption("hotel"); // Move to next step
            } else {
              setTransport("Not selected");
              setActiveOption("transport");
            }
            
            if (found.hotel) {
              setHotel(`${found.hotel.name} - ৳${found.hotel.price} (${found.hotel.rating}⭐)`);
            } else {
              setHotel("Not selected");
            }
            
            if (found.guide) {
              setGuide(`${found.guide.name} - ৳${found.guide.price}`);
              setSkipGuide(false);
            } else {
              setGuide("Not selected");
              setSkipGuide(found.preferences?.skip_guide ?? true);
            }
            
            // Set skip preferences from API
            setSkipHotel(found.preferences?.skip_hotel ?? false);
            
            // Extract destination ID from package data
            const destId = found.destination || found.destination_detail || found.destination_id;
            if (destId) {
              console.log("🔄 Package destination info - Raw:", destId, "Type:", typeof destId);
              console.log("🔄 URL destination ID:", urlDestinationId, "Type:", typeof urlDestinationId);
              // Only override if URL doesn't have destination ID
              if (!urlDestinationId) {
                setDestinationId(String(destId));
                console.log("🎯 Set destination ID from package:", destId);
              } else {
                console.log("🎯 Keeping URL destination ID:", urlDestinationId, "Package had:", destId);
              }
            }
          } else {
            setError(
              `Package with ID ${pkg.id} not found in the API response.`
            );
          }
        } catch (err) {
          console.error("Error fetching package details:", err); // Debug log
          setError(
            `Failed to fetch package details: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No package ID found in:", pkg); // Debug log
        setError("No package selected or package data is incomplete.");
        setLoading(false);
      }
    };
    fetchDetails();
  }, [pkg, urlDestinationId]);

  // Fetch package details using package ID from URL if no package data in state
  useEffect(() => {
    if (!pkg && packageId) {
      console.log("🔄 No package data in state, fetching package details for ID:", packageId);
      setLoading(true);
      setError("");
      
      // First try custom packages API with destination filter
      fetch(`https://wander-nest-ad3s.onrender.com/api/packages/?destination=${urlDestinationId}`)
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            console.log("✅ Custom packages API response:", data);
            
            // Handle paginated response structure
            const packagesData = data.results || (Array.isArray(data) ? data : []);
            const packageData = packagesData.find((p: PackageDetails) => p.id?.toString() === packageId);
            
            if (packageData) {
              console.log("✅ Package details fetched from custom packages:", packageData);
              console.log("🚌 Transport info:", packageData.transport);
              console.log("🏨 Hotel info:", packageData.hotel);
              console.log("👨‍🦱 Guide info:", packageData.guide);
              
              setPackageDetails(packageData);
              
              // Pre-populate services from API response
              if (packageData.transport) {
                setTransport(`${packageData.transport.name} - ৳${packageData.transport.price}`);
              }
              if (packageData.hotel) {
                setHotel(`${packageData.hotel.name} - ৳${packageData.hotel.price} (${packageData.hotel.rating}⭐)`);
              }
              if (packageData.guide) {
                setGuide(`${packageData.guide.name} - ৳${packageData.guide.price}`);
              }
              
              setLoading(false);
              return;
            } else {
              throw new Error("Package not found in custom packages, trying premade packages");
            }
          } else {
            // Try premade packages if custom package not found
            throw new Error("Custom packages API failed, trying premade packages");
          }
        })
        .catch(async () => {
          // Fallback to premade packages
          try {
            const response = await fetch(`https://wander-nest-ad3s.onrender.com/api/packages/all/`);
            if (!response.ok) throw new Error("Failed to fetch premade packages");
            
            const data = await response.json();
            const packages = data.results || (Array.isArray(data) ? data : []);
            const found = packages.find((p: { id: string | number }) => p.id?.toString() === packageId);
            
            if (found) {
              console.log("✅ Package details fetched from premade packages:", found);
              setPackageDetails(found);
              
              // Since we have destination ID from URL, we don't need to extract it from package
              const foundPackage = found as { destination?: string | number; destination_detail?: string | number; destination_id?: string | number };
              const destId = foundPackage.destination || foundPackage.destination_detail || foundPackage.destination_id;
              console.log("📋 Package destination ID:", destId, "URL destination ID:", urlDestinationId);
              setLoading(false);
            } else {
              throw new Error("Package not found in any API");
            }
          } catch (err) {
            console.error("❌ Failed to fetch package details:", err);
            setError("Failed to load package details");
            setLoading(false);
          }
        });
    }
  }, [packageId, pkg, urlDestinationId]);

  useEffect(() => {
    if (packageDetails) {
      const basePrice = parseFloat(
        String(packageDetails.price || packageDetails.budget || "0")
      );
      setTotalPrice((basePrice * travelers).toFixed(2));
    }
  }, [travelers, packageDetails]);

  // Recalculate end date if packageDetails or startDate changes
  useEffect(() => {
    if (packageDetails && startDate) {
      // Try to get days from package details
      const daysStr = getField(packageDetails, "days");
      const days = parseInt(daysStr, 10);
      
      console.log("🗓️ Calculating end date:", { startDate, daysStr, days, packageDetails });
      
      if (!isNaN(days) && days > 0) {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + days);
        const yyyy = end.getFullYear();
        const mm = String(end.getMonth() + 1).padStart(2, "0");
        const dd = String(end.getDate()).padStart(2, "0");
        const calculatedEndDate = `${yyyy}-${mm}-${dd}`;
        console.log("✅ End date calculated:", calculatedEndDate);
        setEndDate(calculatedEndDate);
      } else {
        console.log("⚠️ Invalid days value, using default 1 day");
        // Fallback: if days is not valid, add 1 day as default
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + 1);
        const yyyy = end.getFullYear();
        const mm = String(end.getMonth() + 1).padStart(2, "0");
        const dd = String(end.getDate()).padStart(2, "0");
        setEndDate(`${yyyy}-${mm}-${dd}`);
      }
    } else {
      console.log("⚠️ Missing packageDetails or startDate");
      setEndDate("");
    }
  }, [packageDetails, startDate, getField]);

  useEffect(() => {
    if (!skipHotel) {
      console.log("🏨 Starting hotel fetch process...");
      setHotelsLoading(true);
      setHotelsError("");
      getHotels()
        .then((hotels) => {
          console.log("✅ Hotels fetched successfully:", hotels);
          setHotels(hotels);
          setHotelsLoading(false);
        })
        .catch((error) => {
          console.error("❌ Hotel fetch failed:", error);
          const errorMessage = error.message || "Failed to fetch hotels.";
          setHotelsError(errorMessage);
          setHotels([]);
          setHotelsLoading(false);
        });
    } else {
      console.log("🚫 Hotel section skipped");
      setHotels([]);
    }
  }, [skipHotel]);

  // Fetch attractions for the destination
  useEffect(() => {
    if (!skipAttractions && destinationId) {
      console.log("🎯 Starting attractions fetch process for destination:", destinationId);
      setAttractionsLoading(true);
      setAttractionsError("");
      
      const apiUrl = `https://wander-nest-ad3s.onrender.com/api/home/destinations/${destinationId}/`;
      console.log("🌐 Fetching from URL:", apiUrl);
      
      fetch(apiUrl)
        .then((response) => {
          console.log("📡 Response status:", response.status, response.statusText);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch destination data`);
          }
          return response.json();
        })
        .then((destinationData) => {
          console.log("✅ Destination data fetched:", destinationData);
          const attractionsData = destinationData.attractions || [];
          console.log("🎯 Attractions found:", attractionsData.length);
          setAttractions(attractionsData);
          setAttractionsLoading(false);
        })
        .catch((error) => {
          console.error("❌ Attractions fetch failed:", error);
          setAttractionsError(error.message || "Failed to fetch destination data");
          setAttractions([]);
          setAttractionsLoading(false);
        });
    } else {
      console.log("🚫 Attractions section skipped or no destination ID. Skip:", skipAttractions, "DestID:", destinationId);
      setAttractions([]);
      setAttractionsLoading(false);
    }
  }, [skipAttractions, destinationId]);

  // Fetch experiences for the destination
  useEffect(() => {
    if (!skipExperiences && destinationId) {
      console.log("🌟 Starting experiences fetch process for destination:", destinationId);
      setExperiencesLoading(true);
      setExperiencesError("");
      
      const apiUrl = `https://wander-nest-ad3s.onrender.com/api/home/destinations/${destinationId}/`;
      console.log("🌐 Fetching from URL:", apiUrl);
      
      fetch(apiUrl)
        .then((response) => {
          console.log("📡 Response status:", response.status, response.statusText);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch destination data`);
          }
          return response.json();
        })
        .then((destinationData) => {
          console.log("✅ Destination data fetched:", destinationData);
          const experiencesData = destinationData.experiences || [];
          console.log("🌟 Experiences found:", experiencesData.length);
          setExperiences(experiencesData);
          setExperiencesLoading(false);
        })
        .catch((error) => {
          console.error("❌ Experiences fetch failed:", error);
          setExperiencesError(error.message || "Failed to fetch destination data");
          setExperiences([]);
          setExperiencesLoading(false);
        });
    } else {
      console.log("🚫 Experiences section skipped or no destination ID. Skip:", skipExperiences, "DestID:", destinationId);
      setExperiences([]);
      setExperiencesLoading(false);
    }
  }, [skipExperiences, destinationId]);

  const handleTravelersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, parseInt(e.target.value) || 1);
    setTravelers(val);
  };

  // Focus next division after skip
  const focusNextOption = (current: OptionKey) => {
    const idx = optionOrder.indexOf(current);
    if (idx !== -1 && idx < optionOrder.length - 1) {
      const next = optionOrder[idx + 1];
      setActiveOption(next);
      setTimeout(() => {
        optionRefs[next].current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  // Toggle skip/unskip handlers
  const handleSkipToggle = (option: OptionKey) => {
    switch (option) {
      case "transport":
        // Removed setSkipTransport (no longer used)
        break;
      case "hotel":
        setSkipHotel((prev) => {
          if (!prev) setActiveOption("hotel");
          else focusNextOption("hotel");
          return !prev;
        });
        break;
      case "vehicle":
        setSkipVehicle((prev) => {
          if (!prev) setActiveOption("vehicle");
          else focusNextOption("vehicle");
          return !prev;
        });
        break;
      case "guide":
        setSkipGuide((prev) => {
          if (!prev) setActiveOption("guide");
          return !prev;
        });
        break;
      case "attractions":
        setSkipAttractions((prev) => {
          if (!prev) setActiveOption("attractions");
          else focusNextOption("attractions");
          return !prev;
        });
        break;
      case "experiences":
        setSkipExperiences((prev) => {
          if (!prev) setActiveOption("experiences");
          else focusNextOption("experiences");
          return !prev;
        });
        break;
      default:
        break;
    }
  };

  const handleConfirmBooking = async () => {
    // Validation: required fields
    if (
      !packageDetails?.source ||
      !packageDetails?.title ||
      !startDate ||
      !endDate ||
      !travelers
    ) {
      setWarning("Please fill in all traveler details.");
      return;
    }
    if (!customerName.trim()) {
      setWarning("Name is required.");
      return;
    }
    if (!customerEmail.trim()) {
      setWarning("Email is required.");
      return;
    }
    if (!customerPhone.trim()) {
      setWarning("Phone is required.");
      return;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      setWarning("Please enter a valid email.");
      return;
    }
    if (customerPhone.length < 10) {
      setWarning("Please enter a valid phone number.");
      return;
    }
    setWarning("");
    setPaymentError("");
    setIsProcessingPayment(true);
    try {
      // Prepare payment data for package booking
      const paymentData = {
        service_type: "package",
        service_name: packageDetails?.title || "Package Booking",
        service_details: `Package booking for ${travelers} travelers from ${packageDetails?.source} to ${packageDetails?.destination}`,
        amount: Number(totalPrice),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        service_data: {
          package_id: packageDetails?.id,
          package_title: packageDetails?.title,
          from: packageDetails?.source,
          to: packageDetails?.destination,
          start_date: startDate,
          end_date: endDate,
          travelers: travelers,
        },
      };
      console.log("Sending payment data:", paymentData);
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
        const errorMessage =
          data?.detail ||
          data?.message ||
          data?.error ||
          data?.errors?.[0] ||
          `Server error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }
      if (data.status === "SUCCESS" && data.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else if (data.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else {
        throw new Error(
          data.detail ||
            data.message ||
            "Payment gateway URL not received. Please try again."
        );
      }
    } catch (err) {
      let errorMessage = "Payment failed. Please try again.";
      if (err instanceof Error) errorMessage = err.message;
      setPaymentError(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          Loading package details...
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
          {error}
        </div>
      </Layout>
    );
  }
  if (!packageDetails) {
    return (
      <Layout>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          No package data found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 mb-12">
        {packageDetails?.title && (
          <div className="mb-4 p-4 bg-gradient-to-r from-[#6ab187]/10 to-[#4a6b5b]/10 rounded-lg border-l-4 border-[#6ab187]">
            <div className="flex gap-4 items-start">
              {/* Always show an image - either package image or default */}
              <div className="flex-shrink-0">
                <img
                  src={
                    (packageDetails.image && typeof packageDetails.image === 'string') 
                      ? packageDetails.image 
                      : (packageDetails.image_url && typeof packageDetails.image_url === 'string')
                      ? packageDetails.image_url
                      : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&h=300&fit=crop"
                  }
                  alt={typeof packageDetails.title === 'string' ? packageDetails.title : 'Package'}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    console.log("Image failed to load, using fallback");
                    e.currentTarget.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop";
                  }}
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-[#6ab187] mb-1">
                  {packageDetails.title}
                </h2>
                {packageDetails.days && (
                  <p className="text-gray-600">
                    {packageDetails.days} Days Package
                  </p>
                )}
                
                {/* Show included services from API response */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {packageDetails.transport && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      🚌 {packageDetails.transport.name} - ৳{packageDetails.transport.price}
                    </span>
                  )}
                  {packageDetails.hotel && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      🏨 {packageDetails.hotel.name} - ৳{packageDetails.hotel.price}
                    </span>
                  )}
                  {packageDetails.guide && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      👨‍🦱 {packageDetails.guide.name} - ৳{packageDetails.guide.price}
                    </span>
                  )}
                  {packageDetails.preferences?.skip_guide && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                      No Guide
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <h1 className="text-3xl font-bold text-primary mb-6">
          Confirm Your Booking
        </h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-secondary mb-4">
            Traveler Details
          </h2>
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <input
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  type="text"
                  value={getField(packageDetails, "from_location") || getField(packageDetails, "source")}
                  readOnly
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  type="text"
                  value={getField(packageDetails, "to_location") || getField(packageDetails, "destination")}
                  readOnly
                />
              </div>
            </div>
            <div className="flex gap-6 mt-4">
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    type="text"
                    value={formatDisplayDate(startDate)}
                    readOnly
                    onClick={() =>
                      dateInputRef.current &&
                      dateInputRef.current.showPicker &&
                      dateInputRef.current.showPicker()
                    }
                    placeholder="dd-mm-yyyy"
                    style={{ cursor: "pointer" }}
                  />
                  <span
                    className="ml-2 text-lg cursor-pointer"
                    onClick={() =>
                      dateInputRef.current &&
                      dateInputRef.current.showPicker &&
                      dateInputRef.current.showPicker()
                    }
                    role="button"
                    tabIndex={0}
                  >
                    📅
                  </span>
                  <input
                    ref={dateInputRef}
                    type="date"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                    value={startDate}
                    min={getTomorrow()}
                    onChange={(e) => setStartDate(e.target.value)}
                    tabIndex={-1}
                  />
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  type="text"
                  value={formatDisplayDate(endDate)}
                  readOnly
                />
              </div>
            </div>
            <div className="flex gap-6 mt-4">
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Number of Travelers
                </label>
                <input
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  type="number"
                  min={1}
                  value={travelers}
                  onChange={handleTravelersChange}
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Budget (BDT)
                </label>
                <input
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  type="text"
                  value={totalPrice}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="my-8 border-t border-gray-200" />
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-secondary mb-4">
            Customize Your Package
          </h2>
          <div className="space-y-8">
            {/* Hotel */}
            <div
              ref={optionRefs.hotel}
              className={`flex flex-col gap-2 p-4 rounded-lg border ${
                activeOption === "hotel"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <span className="font-medium text-base text-gray-700">
                Select Hotel
              </span>
              <button
                type="button"
                className="ml-4 px-4 py-1 rounded-full border text-white bg-white hover:opacity-90 transition"
                style={{
                  borderColor: "#6ab187",
                  backgroundColor: "#6ab187",
                }}
                onClick={() => handleSkipToggle("hotel")}
              >
                {skipHotel ? "Include" : "Skip"}
              </button>
              {/* Only show scroll buttons and hotel cards if not skipped */}
              {!skipHotel && (
                <div style={{ width: "100%", marginTop: 24 }}>
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      aria-label="Scroll left"
                      style={{
                        position: "absolute",
                        left: -40,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2,
                        background: "#fff",
                        border: "1.5px solid #e0e0e0",
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* Left arrow icon */}
                    </button>
                    <div
                      style={{
                        display: "flex",
                        gap: 24,
                        overflowX: "auto",
                        scrollBehavior: "smooth",
                        paddingBottom: 8,
                        margin: "0 48px",
                      }}
                    >
                      {hotelsLoading && <p>Loading hotels...</p>}
                      {hotelsError && (
                        <p style={{ color: "red" }}>{hotelsError}</p>
                      )}
                      {hotels.length > 0
                        ? hotels
                            .filter((hotel) => {
                              if (!packageDetails) return true;
                              const pkgDest = extractMainLocation(
                                typeof packageDetails.destination === "string"
                                  ? packageDetails.destination
                                  : typeof packageDetails.city === "string"
                                  ? packageDetails.city
                                  : typeof packageDetails.title === "string"
                                  ? packageDetails.title
                                  : ""
                              );
                              const hotelLoc = extractMainLocation(
                                hotel.location || ""
                              );
                              return (
                                pkgDest &&
                                hotelLoc &&
                                hotelLoc.includes(pkgDest)
                              );
                            })
                            .map((hotel) => {
                              const isSelected = selectedHotelId === hotel.id;
                              return (
                                <div
                                  key={hotel.id}
                                  onClick={() =>
                                    setSelectedHotelId(
                                      isSelected ? null : hotel.id
                                    )
                                  }
                                  style={{
                                    cursor: "pointer",
                                    borderRadius: 14,
                                    border: isSelected
                                      ? "2.5px solid #4e944f"
                                      : "2.5px solid transparent",
                                    boxShadow: isSelected
                                      ? "0 4px 24px rgba(76,177,106,0.15)"
                                      : "0 2px 8px rgba(0,0,0,0.06)",
                                    overflow: "hidden",
                                    background: "#fff",
                                    minWidth: 220,
                                    maxWidth: 240,
                                    flex: "0 0 220px",
                                    transition: "border 0.2s, box-shadow 0.2s",
                                    position: "relative",
                                  }}
                                >
                                  {/* Checkmark for selected */}
                                  {isSelected && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        background: "#4e944f",
                                        borderRadius: "50%",
                                        width: 28,
                                        height: 28,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow:
                                          "0 2px 8px rgba(76,177,106,0.18)",
                                      }}
                                    >
                                      <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                      >
                                        <circle
                                          cx="10"
                                          cy="10"
                                          r="10"
                                          fill="#4e944f"
                                        />
                                        <path
                                          d="M6 10.5L9 13.5L14 8.5"
                                          stroke="#fff"
                                          strokeWidth="2.2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                  <img
                                    src={
                                      hotel.image_url ||
                                      "/placeholder.svg?height=120&width=200"
                                    }
                                    alt={hotel.name}
                                    style={{
                                      width: "100%",
                                      height: 120,
                                      objectFit: "cover",
                                      display: "block",
                                    }}
                                  />
                                  <div
                                    style={{ padding: "12px 12px 8px 12px" }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: 600,
                                        fontSize: 15,
                                        marginBottom: 4,
                                      }}
                                    >
                                      {hotel.name}
                                    </div>
                                    <div
                                      style={{
                                        color: "#8a8a8a",
                                        fontSize: 13,
                                        marginBottom: 2,
                                      }}
                                    >
                                      {hotel.description || "Hotel description"}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                        : !hotelsLoading && <p>No hotels found.</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Vehicle */}
            <div
              ref={optionRefs.vehicle}
              className={`flex flex-col gap-2 p-4 rounded-lg border ${
                activeOption === "vehicle"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <span className="font-medium text-base text-gray-700">
                Select Vehicle
              </span>
              <button
                type="button"
                className="ml-4 px-4 py-1 rounded-full border text-white bg-white hover:opacity-90 transition"
                style={{
                  borderColor: "#6ab187",
                  backgroundColor: "#6ab187",
                }}
                onClick={() => handleSkipToggle("vehicle")}
              >
                {skipVehicle ? "Include" : "Skip"}
              </button>
              {!skipVehicle && (
                <div className="p-4 bg-white rounded-lg shadow">
                  Vehicle options go here
                </div>
              )}
            </div>
            {/* Guide */}
            <div
              ref={optionRefs.guide}
              className={`flex flex-col gap-2 p-4 rounded-lg border ${
                activeOption === "guide"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <span className="font-medium text-base text-gray-700">
                Hire a Guide
              </span>
              <button
                type="button"
                className="ml-4 px-4 py-1 rounded-full border text-white bg-white hover:opacity-90 transition"
                style={{
                  borderColor: "#6ab187",
                  backgroundColor: "#6ab187",
                }}
                onClick={() => handleSkipToggle("guide")}
              >
                {skipGuide ? "Include" : "Skip"}
              </button>
              {!skipGuide && (
                <div className="p-4 bg-white rounded-lg shadow">
                  Guide options go here
                </div>
              )}
            </div>

            {/* Attractions */}
            <div
              ref={optionRefs.attractions}
              className={`flex flex-col gap-2 p-4 rounded-lg border ${
                activeOption === "attractions"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <span className="font-medium text-base text-gray-700">
                Select Attractions
              </span>
              <button
                type="button"
                className="ml-4 px-4 py-1 rounded-full border text-white bg-white hover:opacity-90 transition"
                style={{
                  borderColor: "#6ab187",
                  backgroundColor: "#6ab187",
                }}
                onClick={() => handleSkipToggle("attractions")}
              >
                {skipAttractions ? "Include" : "Skip"}
              </button>
              {/* Only show attractions if not skipped */}
              {!skipAttractions && (
                <div style={{ width: "100%", marginTop: 24 }}>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 24,
                        overflowX: "auto",
                        scrollBehavior: "smooth",
                        paddingBottom: 8,
                        margin: "0 48px",
                      }}
                    >
                      {attractionsLoading && <p>Loading attractions...</p>}
                      {attractionsError && (
                        <p style={{ color: "red" }}>{attractionsError}</p>
                      )}
                      {attractions.length > 0
                        ? attractions.map((attraction) => {
                            const isSelected = selectedAttractionIds.has(attraction.id);
                            return (
                              <div
                                key={attraction.id}
                                onClick={() => {
                                  const newSelected = new Set(selectedAttractionIds);
                                  if (isSelected) {
                                    newSelected.delete(attraction.id);
                                  } else {
                                    newSelected.add(attraction.id);
                                  }
                                  setSelectedAttractionIds(newSelected);
                                }}
                                style={{
                                  cursor: "pointer",
                                  borderRadius: 14,
                                  border: isSelected
                                    ? "2.5px solid #4e944f"
                                    : "2.5px solid transparent",
                                  boxShadow: isSelected
                                    ? "0 4px 24px rgba(76,177,106,0.15)"
                                    : "0 2px 8px rgba(0,0,0,0.06)",
                                  overflow: "hidden",
                                  background: "#fff",
                                  minWidth: 220,
                                  maxWidth: 240,
                                  flex: "0 0 220px",
                                  transition: "border 0.2s, box-shadow 0.2s",
                                  position: "relative",
                                }}
                              >
                                {/* Checkmark for selected */}
                                {isSelected && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: 8,
                                      right: 8,
                                      background: "#4e944f",
                                      borderRadius: "50%",
                                      width: 28,
                                      height: 28,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      boxShadow:
                                        "0 2px 8px rgba(76,177,106,0.18)",
                                    }}
                                  >
                                    <svg
                                      width="18"
                                      height="18"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                    >
                                      <circle
                                        cx="10"
                                        cy="10"
                                        r="10"
                                        fill="#4e944f"
                                      />
                                      <path
                                        d="M6 10.5L9 13.5L14 8.5"
                                        stroke="#fff"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                )}
                                <img
                                  src={
                                    attraction.image ||
                                    "/placeholder.svg?height=120&width=200"
                                  }
                                  alt={attraction.name}
                                  style={{
                                    width: "100%",
                                    height: 120,
                                    objectFit: "cover",
                                    display: "block",
                                  }}
                                />
                                <div style={{ padding: 16 }}>
                                  <h4 style={{ 
                                    fontSize: "16px", 
                                    fontWeight: 600, 
                                    margin: "0 0 8px 0",
                                    color: "#1f2937"
                                  }}>
                                    {attraction.name}
                                  </h4>
                                  <p style={{ 
                                    fontSize: "14px", 
                                    color: "#6b7280", 
                                    margin: "0 0 8px 0",
                                    lineHeight: "1.4"
                                  }}>
                                    {attraction.description}
                                  </p>
                                  <div style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 4 
                                  }}>
                                    <span style={{ color: "#fbbf24" }}>
                                      {"★".repeat(Math.floor(attraction.rating || 0))}
                                    </span>
                                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                                      {attraction.rating} ({attraction.reviews || 0} reviews)
                                    </span>
                                  </div>
                                  <div style={{ 
                                    marginTop: 8,
                                    fontSize: "12px",
                                    color: "#6b7280",
                                    backgroundColor: "#f3f4f6",
                                    padding: "4px 8px",
                                    borderRadius: "12px",
                                    display: "inline-block"
                                  }}>
                                    {attraction.category}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        : !attractionsLoading && (
                            <p style={{ color: "#9ca3af", fontStyle: "italic" }}>
                              No attractions available for this destination.
                            </p>
                          )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Experiences */}
            <div
              ref={optionRefs.experiences}
              className={`flex flex-col gap-2 p-4 rounded-lg border ${
                activeOption === "experiences"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <span className="font-medium text-base text-gray-700">
                Select Experiences
              </span>
              <button
                type="button"
                className="ml-4 px-4 py-1 rounded-full border text-white bg-white hover:opacity-90 transition"
                style={{
                  borderColor: "#6ab187",
                  backgroundColor: "#6ab187",
                }}
                onClick={() => handleSkipToggle("experiences")}
              >
                {skipExperiences ? "Include" : "Skip"}
              </button>
              {/* Only show experiences if not skipped */}
              {!skipExperiences && (
                <div style={{ width: "100%", marginTop: 24 }}>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 24,
                        overflowX: "auto",
                        scrollBehavior: "smooth",
                        paddingBottom: 8,
                        margin: "0 48px",
                      }}
                    >
                      {experiencesLoading && <p>Loading experiences...</p>}
                      {experiencesError && (
                        <p style={{ color: "red" }}>{experiencesError}</p>
                      )}
                      {experiences.length > 0
                        ? experiences.map((experience) => {
                            const isSelected = selectedExperienceIds.has(experience.id);
                            return (
                              <div
                                key={experience.id}
                                onClick={() => {
                                  const newSelected = new Set(selectedExperienceIds);
                                  if (isSelected) {
                                    newSelected.delete(experience.id);
                                  } else {
                                    newSelected.add(experience.id);
                                  }
                                  setSelectedExperienceIds(newSelected);
                                }}
                                style={{
                                  cursor: "pointer",
                                  borderRadius: 14,
                                  border: isSelected
                                    ? "2.5px solid #4e944f"
                                    : "2.5px solid transparent",
                                  boxShadow: isSelected
                                    ? "0 4px 24px rgba(76,177,106,0.15)"
                                    : "0 2px 8px rgba(0,0,0,0.06)",
                                  overflow: "hidden",
                                  background: "#fff",
                                  minWidth: 220,
                                  maxWidth: 240,
                                  flex: "0 0 220px",
                                  transition: "border 0.2s, box-shadow 0.2s",
                                  position: "relative",
                                }}
                              >
                                {/* Checkmark for selected */}
                                {isSelected && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: 8,
                                      right: 8,
                                      background: "#4e944f",
                                      borderRadius: "50%",
                                      width: 28,
                                      height: 28,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      boxShadow:
                                        "0 2px 8px rgba(76,177,106,0.18)",
                                    }}
                                  >
                                    <svg
                                      width="18"
                                      height="18"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                    >
                                      <circle
                                        cx="10"
                                        cy="10"
                                        r="10"
                                        fill="#4e944f"
                                      />
                                      <path
                                        d="M6 10.5L9 13.5L14 8.5"
                                        stroke="#fff"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                )}
                                <img
                                  src={
                                    experience.image ||
                                    "/placeholder.svg?height=120&width=200"
                                  }
                                  alt={experience.name}
                                  style={{
                                    width: "100%",
                                    height: 120,
                                    objectFit: "cover",
                                    display: "block",
                                  }}
                                />
                                <div style={{ padding: 16 }}>
                                  <h4 style={{ 
                                    fontSize: "16px", 
                                    fontWeight: 600, 
                                    margin: "0 0 8px 0",
                                    color: "#1f2937"
                                  }}>
                                    {experience.name}
                                  </h4>
                                  <p style={{ 
                                    fontSize: "14px", 
                                    color: "#6b7280", 
                                    margin: "0 0 8px 0",
                                    lineHeight: "1.4"
                                  }}>
                                    {experience.description}
                                  </p>
                                  <div style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 4,
                                    marginBottom: 8
                                  }}>
                                    <span style={{ color: "#fbbf24" }}>
                                      {"★".repeat(Math.floor(experience.rating || 0))}
                                    </span>
                                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                                      {experience.rating} ({experience.reviews || 0} reviews)
                                    </span>
                                  </div>
                                  <div style={{ 
                                    display: "flex", 
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                  }}>
                                    <span style={{ 
                                      fontSize: "12px",
                                      color: "#6b7280",
                                      backgroundColor: "#f3f4f6",
                                      padding: "4px 8px",
                                      borderRadius: "12px"
                                    }}>
                                      {experience.duration}
                                    </span>
                                    <span style={{ 
                                      fontSize: "14px",
                                      fontWeight: 600,
                                      color: "#4e944f"
                                    }}>
                                      {experience.price}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        : !experiencesLoading && (
                            <p style={{ color: "#9ca3af", fontStyle: "italic" }}>
                              No experiences available for this destination.
                            </p>
                          )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <hr className="my-8 border-t border-gray-200" />
        <div className="flex flex-col gap-4 items-center mt-8">
          {warning && (
            <div
              style={{
                color: "#b94a48",
                background: "#fbeeea",
                borderRadius: 8,
                padding: "12px 18px",
                marginBottom: 12,
                fontWeight: 600,
                fontSize: "1.05rem",
                textAlign: "center",
              }}
            >
              {warning}
            </div>
          )}
          {paymentError && (
            <div
              style={{
                color: "red",
                background: "#fbeeea",
                borderRadius: 8,
                padding: "12px 18px",
                marginBottom: 12,
                fontWeight: 600,
                fontSize: "1.05rem",
                textAlign: "center",
              }}
            >
              {paymentError}
            </div>
          )}
          <button
            className="w-full max-w-xs px-6 py-3 rounded-lg text-white font-semibold shadow hover:opacity-90 transition disabled:opacity-60"
            style={{ backgroundColor: "#6ab187" }}
            onClick={handleConfirmBooking}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? "Processing Payment..." : "Confirm Booking"}
          </button>
          <button
            type="button"
            className="w-full max-w-xs px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition"
            onClick={() => navigate("/packages")}
          >
            <span className="mr-2">←</span> Cancel Booking
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmBook;
