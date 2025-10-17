"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Layout from "../components/layout";
import { useAuth } from "../Authentication/auth-context";
import { initiatePayment } from "../api/payments";

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

const ConfirmBook: React.FC = () => {
  // FIRST: Authentication check - must be at the top
  const { isAuthenticated, loading: authLoading } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const { destinationId: urlDestinationId, packageId } = useParams<{
    destinationId: string;
    packageId: string;
  }>();
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
      capacity?: number;
      features?: string[];
      description?: string;
    };
    hotel?: {
      id: number;
      name: string;
      price: string;
      rating: string;
      description?: string;
      amenities?: string[];
      location?: string;
      room_type?: string;
    };
    guide?: {
      id: number;
      name: string;
      price: string;
      description?: string;
      image?: string;
      rating?: string;
      experience_years?: number;
      languages?: string[];
      specialties?: string[];
    } | null;
    accommodation?: {
      id?: number;
      name: string;
      description?: string;
      image?: string;
      rating?: string;
      price?: string;
      amenities?: string[];
      location?: string;
      room_type?: string;
    };
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

  // Removed skip states since we're not allowing customization anymore

  const [warning, setWarning] = useState("");

  const dateInputRef = useRef<HTMLInputElement>(null);

  // Authentication protection - redirect to login if not authenticated
  useEffect(() => {
    console.log("🔐 Auth check:", { authLoading, isAuthenticated });

    if (!authLoading && !isAuthenticated) {
      console.log("🔐 Redirecting to login - user not authenticated");

      // Store the current URL to redirect back after login
      const currentPath = location.pathname + location.search;
      sessionStorage.setItem("redirectAfterLogin", currentPath);

      // Use replace to prevent back button issues
      navigate("/login", {
        state: {
          from: currentPath,
          message: "Please log in to book this package",
        },
        replace: true,
      });
    }
  }, [
    authLoading,
    isAuthenticated,
    navigate,
    location.pathname,
    location.search,
  ]);

  // Destination ID extracted from package
  const [destinationId, setDestinationId] = useState<string | null>(null);

  // Set destination ID from URL parameter
  useEffect(() => {
    if (urlDestinationId) {
      setDestinationId(urlDestinationId);
      console.log(
        "🎯 Using destination ID from URL:",
        urlDestinationId,
        "Type:",
        typeof urlDestinationId
      );
      console.log(
        "🔍 URL destination ID is numeric?",
        /^\d+$/.test(urlDestinationId)
      );
    }
  }, [urlDestinationId]);

  // Check if destination ID is provided
  useEffect(() => {
    if (!destinationId && !urlDestinationId) {
      console.warn(
        "⚠️ No destination ID provided. Attractions and experiences will not be loaded."
      );
    }
  }, [destinationId, urlDestinationId]);

  // Attractions state
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [attractionsLoading, setAttractionsLoading] = useState(false);
  const [attractionsError, setAttractionsError] = useState("");

  // Experiences state
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [experiencesLoading, setExperiencesLoading] = useState(false);
  const [experiencesError, setExperiencesError] = useState("");

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
            "https://wander-nest-ad3s.onrender.com/api/packages/unified/"
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
            setTotalPrice(
              found.total_cost || found.price || found.budget || ""
            );

            // Services are displayed directly from package data in the UI

            // Extract destination ID from package data
            const destId =
              found.destination ||
              found.destination_detail ||
              found.destination_id;
            if (destId) {
              console.log(
                "🔄 Package destination info - Raw:",
                destId,
                "Type:",
                typeof destId
              );
              console.log(
                "🔄 URL destination ID:",
                urlDestinationId,
                "Type:",
                typeof urlDestinationId
              );
              // Only override if URL doesn't have destination ID
              if (!urlDestinationId) {
                setDestinationId(String(destId));
                console.log("🎯 Set destination ID from package:", destId);
              } else {
                console.log(
                  "🎯 Keeping URL destination ID:",
                  urlDestinationId,
                  "Package had:",
                  destId
                );
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
      console.log(
        "🔄 No package data in state, fetching package details for ID:",
        packageId
      );
      setLoading(true);
      setError("");

      // Use the unified packages API to fetch package details
      fetch(
        `https://wander-nest-ad3s.onrender.com/api/packages/unified/?destination=${urlDestinationId}`
      )
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            console.log("✅ Unified packages API response:", data);

            // The unified API returns an array directly
            const packagesData = Array.isArray(data) ? data : [];
            const packageData = packagesData.find(
              (p: PackageDetails) => p.id?.toString() === packageId
            );

            if (packageData) {
              console.log("✅ Package details found:", packageData);
              console.log("🚌 Transport info:", packageData.transport);
              console.log("🏨 Hotel info:", packageData.hotel);
              console.log("👨‍🦱 Guide info:", packageData.guide);

              setPackageDetails(packageData);

              // Services are displayed directly from package data in the UI

              setLoading(false);
              return;
            } else {
              throw new Error("Package not found in unified packages response");
            }
          } else {
            throw new Error(
              `Unified packages API failed with status: ${response.status}`
            );
          }
        })
        .catch(async () => {
          // Fallback: try fetching all packages without destination filter
          try {
            console.log("🔄 Trying fallback: fetch all packages");
            const response = await fetch(
              `https://wander-nest-ad3s.onrender.com/api/packages/unified/`
            );
            if (!response.ok) throw new Error("Failed to fetch packages");

            const data = await response.json();
            const packages = Array.isArray(data) ? data : [];
            const found = packages.find(
              (p: { id: string | number }) => p.id?.toString() === packageId
            );

            if (found) {
              console.log(
                "✅ Package details found in fallback search:",
                found
              );
              setPackageDetails(found);
              setLoading(false);
            } else {
              throw new Error("Package not found in any API response");
            }
          } catch (fallbackErr) {
            console.error("❌ All attempts failed:", fallbackErr);
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

      console.log("🗓️ Calculating end date:", {
        startDate,
        daysStr,
        days,
        packageDetails,
      });

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

  // Removed hotel fetching since we're only showing package included hotels

  // Fetch attractions for the destination
  useEffect(() => {
    if (destinationId) {
      console.log(
        "🎯 Starting attractions fetch process for destination:",
        destinationId
      );
      setAttractionsLoading(true);
      setAttractionsError("");

      const apiUrl = `https://wander-nest-ad3s.onrender.com/api/home/destinations/${destinationId}/`;
      console.log("🌐 Fetching from URL:", apiUrl);

      fetch(apiUrl)
        .then((response) => {
          console.log(
            "📡 Response status:",
            response.status,
            response.statusText
          );
          if (!response.ok) {
            throw new Error(
              `HTTP ${response.status}: Failed to fetch destination data`
            );
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
          setAttractionsError(
            error.message || "Failed to fetch destination data"
          );
          setAttractions([]);
          setAttractionsLoading(false);
        });
    } else {
      console.log("🚫 No destination ID provided for attractions");
      setAttractions([]);
      setAttractionsLoading(false);
    }
  }, [destinationId]);

  // Fetch experiences for the destination
  useEffect(() => {
    if (destinationId) {
      console.log(
        "🌟 Starting experiences fetch process for destination:",
        destinationId
      );
      setExperiencesLoading(true);
      setExperiencesError("");

      const apiUrl = `https://wander-nest-ad3s.onrender.com/api/home/destinations/${destinationId}/`;
      console.log("🌐 Fetching from URL:", apiUrl);

      fetch(apiUrl)
        .then((response) => {
          console.log(
            "📡 Response status:",
            response.status,
            response.statusText
          );
          if (!response.ok) {
            throw new Error(
              `HTTP ${response.status}: Failed to fetch destination data`
            );
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
          setExperiencesError(
            error.message || "Failed to fetch destination data"
          );
          setExperiences([]);
          setExperiencesLoading(false);
        });
    } else {
      console.log("🚫 No destination ID provided for experiences");
      setExperiences([]);
      setExperiencesLoading(false);
    }
  }, [destinationId]);

  const handleTravelersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, parseInt(e.target.value) || 1);
    setTravelers(val);
  };

  // Removed skip toggle functions since we're not allowing customization

  const handleConfirmBooking = async () => {
    // Debug logging
    console.log("Validation Debug:", {
      source: packageDetails?.source,
      title: packageDetails?.title,
      startDate,
      endDate,
      travelers,
      customerName,
      customerEmail,
      customerPhone,
    });

    // Validation: required fields
    const hasSource = packageDetails?.source || packageDetails?.from_location;
    const hasDestination =
      packageDetails?.destination || packageDetails?.to_location;

    if (
      !hasSource ||
      !hasDestination ||
      !packageDetails?.title ||
      !startDate ||
      !endDate ||
      !travelers
    ) {
      console.log("Failed validation: Missing required traveler fields");
      setWarning("Please fill in all traveler details.");
      return;
    }

    // Skip customer detail validation as they are optional
    // The booking will proceed with package and travel details only
    setWarning("");
    setPaymentError("");
    setIsProcessingPayment(true);
    try {
      // STEP 1: Create package booking first to get Package.id
      console.log("[Package Booking] Creating package booking...");

      // Get authentication token (same approach as HotelsRooms.tsx)
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("access") ||
        localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Authentication required. Please login to continue.");
      }

      // Prepare package creation payload
      const packageCreationPayload = {
        title: packageDetails?.title || "Package Booking",
        from_location:
          packageDetails?.from_location || packageDetails?.source || "",
        to_location:
          packageDetails?.to_location || packageDetails?.destination || "",
        start_date: startDate,
        end_date: endDate,
        travelers_count: travelers,
        budget: Number(totalPrice) || 0,
        transport_id: packageDetails?.transport?.id || null,
        hotel_id: packageDetails?.hotel?.id || null,
        guide_id: packageDetails?.guide?.id || null,
        preferences: {
          skip_transport: packageDetails?.preferences?.skip_transport || false,
          skip_hotel: packageDetails?.preferences?.skip_hotel || false,
          skip_guide: packageDetails?.preferences?.skip_guide || false,
        },
      };

      console.log("[Package Booking] Payload:", packageCreationPayload);

      // Create the package booking
      const createResponse = await fetch(
        "https://wander-nest-ad3s.onrender.com/api/packages/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(packageCreationPayload),
        }
      );

      console.log("[Package Booking] Response status:", createResponse.status);
      console.log(
        "[Package Booking] Response headers:",
        Object.fromEntries(createResponse.headers.entries())
      );

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}));
        const errorMsg =
          errorData.detail ||
          errorData.error ||
          errorData.message ||
          "Failed to create package booking";
        console.error("[Package Booking] Creation failed:", errorData);
        throw new Error(errorMsg);
      }

      const createdPackage = await createResponse.json();
      console.log("[Package Booking] Created successfully:", createdPackage);
      console.log(
        "[Package Booking] Response keys:",
        Object.keys(createdPackage)
      );
      console.log(
        "[Package Booking] Full response:",
        JSON.stringify(createdPackage, null, 2)
      );
      console.log("[Package Booking] Response type:", typeof createdPackage);
      console.log(
        "[Package Booking] Is Array?:",
        Array.isArray(createdPackage)
      );

      // Backend might return id, pk, or package_id - check all possibilities
      const packageId =
        createdPackage.id || createdPackage.pk || createdPackage.package_id;

      if (!packageId) {
        console.error(
          "[Package Booking] No ID found in response:",
          createdPackage
        );
        console.error(
          "[Package Booking] Backend may not be implementing POST /packages/create/ correctly"
        );
        console.error(
          "[Package Booking] Expected response with 'id' and 'total_cost' fields"
        );

        // TEMPORARY WORKAROUND: Use the package template ID from URL/state
        // This is NOT ideal but allows testing until backend is fixed
        console.warn(
          "[Package Booking] WORKAROUND: Using package template ID from state"
        );

        const fallbackPackageId = packageDetails?.id || packageId;

        if (!fallbackPackageId) {
          throw new Error(
            "Package booking created but no ID returned. The backend endpoint may not be implemented correctly. Check console logs."
          );
        }

        console.warn(
          "[Package Booking] Using fallback Package ID:",
          fallbackPackageId
        );

        // Use the fallback ID and continue
        const fallbackPaymentResponse = await initiatePayment({
          amount: createdPackage.total_cost || totalPrice,
          currency: "BDT",
          booking_id: String(fallbackPackageId),
          service_type: "package" as const,
          service_name: packageDetails?.title || "Package Booking",
          service_details: `Package booking for ${travelers} travelers from ${
            packageDetails?.source || packageDetails?.from_location
          } to ${packageDetails?.destination || packageDetails?.to_location}`,
          customer_name: customerName || "Guest",
          customer_email: customerEmail || "guest@wandernest.com",
          customer_phone: customerPhone || "N/A",
          service_data: {
            package_booking_id: fallbackPackageId,
            original_template_id: packageDetails?.id,
            package_title: packageDetails?.title,
            from: packageDetails?.source || packageDetails?.from_location,
            to: packageDetails?.destination || packageDetails?.to_location,
            start_date: startDate,
            end_date: endDate,
            travelers: travelers,
            note: "Using template ID as workaround - backend did not return booking ID",
          },
        });

        console.log(
          "[Payment] Payment initiated successfully (workaround):",
          fallbackPaymentResponse
        );
        window.location.href = fallbackPaymentResponse.GatewayPageURL;
        return; // Exit early
      }

      console.log("[Package Booking] Extracted Package ID:", packageId);

      // STEP 2: Initiate payment with the real Package.id (as string, payments.ts will convert to integer)
      console.log("[Payment] Initiating payment for Package ID:", packageId);

      const paymentResponse = await initiatePayment({
        amount: createdPackage.total_cost || totalPrice,
        currency: "BDT",
        booking_id: String(packageId), // Convert to string, payments.ts will convert to integer
        service_type: "package" as const,
        service_name: packageDetails?.title || "Package Booking",
        service_details: `Package booking for ${travelers} travelers from ${
          packageDetails?.source || packageDetails?.from_location
        } to ${packageDetails?.destination || packageDetails?.to_location}`,
        customer_name: customerName || "Guest",
        customer_email: customerEmail || "guest@wandernest.com",
        customer_phone: customerPhone || "N/A",
        service_data: {
          package_booking_id: packageId,
          original_template_id: packageDetails?.id,
          package_title: packageDetails?.title,
          from: packageDetails?.source || packageDetails?.from_location,
          to: packageDetails?.destination || packageDetails?.to_location,
          start_date: startDate,
          end_date: endDate,
          travelers: travelers,
        },
      });

      console.log("[Payment] Payment initiated successfully:", paymentResponse);

      // STEP 3: Redirect to payment gateway
      window.location.href = paymentResponse.GatewayPageURL;
    } catch (err) {
      let errorMessage = "Payment failed. Please try again.";
      if (err instanceof Error) errorMessage = err.message;
      console.error("[Package Booking/Payment] Error:", err);
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

  // Show loading spinner while checking authentication
  if (authLoading) {
    console.log("🔐 Showing loading spinner - auth is loading");
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If not authenticated, show auth required screen and trigger redirect
  if (!isAuthenticated) {
    console.log("🔐 Not authenticated - showing auth required screen");

    // Additional fallback redirect (in case useEffect doesn't work)
    setTimeout(() => {
      if (!isAuthenticated) {
        console.log("🔐 Fallback redirect after 1 second");
        window.location.href = "/login";
      }
    }, 1000);

    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600">
              Please log in to book this package. Redirecting to login...
            </p>
            <div className="mt-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
              <p className="text-sm text-gray-500">Redirecting...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  console.log("🔐 User is authenticated - rendering booking form");

  return (
    <Layout>
      <div
        className="min-h-screen relative bg-gradient-to-br from-green-50 to-blue-50"
        style={{
          backgroundImage: 'url("/Figma_photos/Ratargul-2.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Subtle overlay for better form readability */}
        <div className="absolute inset-0 bg-white bg-opacity-15"></div>

        {/* Main content with background */}
        <div className="relative z-10 max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 mt-8 mb-12">
          {packageDetails?.title && (
            <div className="mb-4 p-4 bg-gradient-to-r from-[#6ab187]/10 to-[#4a6b5b]/10 rounded-lg border-l-4 border-[#6ab187]">
              <div className="flex gap-4 items-start">
                {/* Always show an image - either package image or default */}
                <div className="flex-shrink-0">
                  <img
                    src={
                      packageDetails.image &&
                      typeof packageDetails.image === "string"
                        ? packageDetails.image
                        : packageDetails.image_url &&
                          typeof packageDetails.image_url === "string"
                        ? packageDetails.image_url
                        : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&h=300&fit=crop"
                    }
                    alt={
                      typeof packageDetails.title === "string"
                        ? packageDetails.title
                        : "Package"
                    }
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      console.log("Image failed to load, using fallback");
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop";
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
                        🚌 {packageDetails.transport.name} - ৳
                        {packageDetails.transport.price}
                      </span>
                    )}
                    {packageDetails.hotel && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        🏨 {packageDetails.hotel.name} - ৳
                        {packageDetails.hotel.price}
                      </span>
                    )}
                    {packageDetails.guide && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        👨‍🦱 {packageDetails.guide.name} - ৳
                        {packageDetails.guide.price}
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
                    value={
                      getField(packageDetails, "from_location") ||
                      getField(packageDetails, "source")
                    }
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
                    value={
                      getField(packageDetails, "to_location") ||
                      getField(packageDetails, "destination")
                    }
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
              Package Details
            </h2>
            <div className="space-y-8">
              {/* Hotel */}
              <div className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200 bg-white">
                <span className="font-medium text-lg text-gray-800 mb-3">
                  🏨 Hotel Accommodation
                </span>

                {/* Show package's included hotel */}
                {packageDetails?.hotel ? (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                        INCLUDED
                      </span>
                      {packageDetails.hotel.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {packageDetails.hotel.rating && (
                          <div className="flex items-center text-yellow-500 mb-2">
                            <span className="mr-1">⭐</span>
                            <span className="text-gray-700 font-medium">
                              {packageDetails.hotel.rating}/5
                            </span>
                          </div>
                        )}
                        {packageDetails.hotel.price && (
                          <p className="text-blue-600 font-semibold">
                            ৳{packageDetails.hotel.price} per night
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                      <p className="text-blue-800 text-sm font-medium">
                        ✅ Hotel accommodation is included in your package
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-600">
                      No hotel included in this package
                    </p>
                  </div>
                )}
              </div>
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
                    {packageDetails?.hotel ? (
                      <div
                        style={{
                          borderRadius: 14,
                          border: "2.5px solid #4e944f",
                          boxShadow: "0 4px 24px rgba(76,177,106,0.15)",
                          overflow: "hidden",
                          background: "#fff",
                          minWidth: 220,
                          maxWidth: 240,
                          flex: "0 0 220px",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            background: "#4e944f",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          INCLUDED
                        </div>
                        <img
                          src={"/placeholder.svg?height=120&width=200"}
                          alt={packageDetails.hotel.name}
                          style={{
                            width: "100%",
                            height: 120,
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <div style={{ padding: "12px 12px 8px 12px" }}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 15,
                              marginBottom: 4,
                            }}
                          >
                            {packageDetails.hotel.name}
                          </div>
                          <div
                            style={{
                              color: "#8a8a8a",
                              fontSize: 13,
                              marginBottom: 2,
                            }}
                          >
                            {packageDetails.hotel.description ||
                              "Hotel accommodation"}
                          </div>
                          {packageDetails.hotel.rating && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: 4,
                              }}
                            >
                              <span
                                style={{ color: "#ffa500", marginRight: 4 }}
                              >
                                ★
                              </span>
                              <span style={{ fontSize: 12, color: "#666" }}>
                                {packageDetails.hotel.rating}
                              </span>
                            </div>
                          )}
                          {packageDetails.hotel.price && (
                            <div
                              style={{
                                color: "#4e944f",
                                fontSize: 14,
                                fontWeight: 600,
                                marginTop: 4,
                              }}
                            >
                              ৳{packageDetails.hotel.price} per night
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p>No hotel information available.</p>
                    )}
                  </div>
                </div>
              </div>
              {/* Vehicle */}
              <div className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200 bg-white">
                <span className="font-medium text-lg text-gray-800 mb-3">
                  🚗 Transport & Vehicle
                </span>

                {/* Show package's included transport */}
                {packageDetails?.transport ? (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                        INCLUDED
                      </span>
                      {packageDetails.transport.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-gray-600 text-sm mt-1">
                          Type:{" "}
                          {packageDetails.transport.type
                            ?.charAt(0)
                            .toUpperCase() +
                            packageDetails.transport.type?.slice(1)}
                        </p>
                        {packageDetails.transport.features &&
                          packageDetails.transport.features.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 mb-1">
                                Features:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {packageDetails.transport.features.map(
                                  (feature: string, index: number) => (
                                    <span
                                      key={index}
                                      className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                                    >
                                      {feature}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        {packageDetails.transport.price && (
                          <p className="text-green-600 font-semibold mt-2">
                            ৳{packageDetails.transport.price}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-green-100 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">
                        ✅ Transport is included in this package
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-600">
                      No transport included in this package
                    </p>
                  </div>
                )}
              </div>
              {/* Guide */}
              <div className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200 bg-white">
                <span className="font-medium text-lg text-gray-800 mb-3">
                  👨‍🏫 Tour Guide
                </span>

                {/* Show package's included guide */}
                {packageDetails?.guide ? (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                        INCLUDED
                      </span>
                      {packageDetails.guide.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {packageDetails.guide.specialties &&
                          packageDetails.guide.specialties.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 mb-1">
                                Specialties:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {packageDetails.guide.specialties.map(
                                  (specialty: string, index: number) => (
                                    <span
                                      key={index}
                                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                                    >
                                      {specialty}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        {packageDetails.guide.price && (
                          <p className="text-blue-600 font-semibold mt-2">
                            ৳{packageDetails.guide.price}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                      <p className="text-blue-800 text-sm font-medium">
                        ✅ Professional guide is included in this package
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-600">
                      No guide included in this package
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attractions */}
          <div className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200 bg-white">
            <span className="font-medium text-lg text-gray-800 mb-3">
              🎯 Available Attractions
            </span>
            {attractionsLoading && (
              <div className="flex items-center justify-center py-4">
                <p className="text-gray-600">Loading attractions...</p>
              </div>
            )}
            {attractionsError && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-600">{attractionsError}</p>
              </div>
            )}
            {attractions.length > 0 ? (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {attractions.map((attraction) => (
                  <div
                    key={attraction.id}
                    style={{
                      borderRadius: 8,
                      border: "2px solid #4e944f",
                      backgroundColor: "#fff",
                      padding: 12,
                      minWidth: 200,
                      maxWidth: 250,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      position: "relative",
                    }}
                  >
                    {/* INCLUDED badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        background: "#4e944f",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        zIndex: 1,
                      }}
                    >
                      INCLUDED
                    </div>
                    <img
                      src={attraction.image || "/placeholder.svg"}
                      alt={attraction.name}
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 6,
                        marginBottom: 8,
                      }}
                    />
                    <h4 style={{ margin: "0 0 4px 0", fontWeight: 600 }}>
                      {attraction.name}
                    </h4>
                    <p
                      style={{
                        fontSize: 14,
                        color: "#666",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {attraction.description}
                    </p>
                    {attraction.rating && (
                      <p style={{ fontSize: 12, color: "#888" }}>
                        ⭐ {attraction.rating}/5 ({attraction.reviews || 0}{" "}
                        reviews)
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              !attractionsLoading && (
                <p style={{ color: "#999", fontStyle: "italic" }}>
                  No attractions available for this destination.
                </p>
              )
            )}
          </div>

          {/* Experiences */}
          <div className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200 bg-white">
            <span className="font-medium text-lg text-gray-800 mb-3">
              🎪 Available Experiences
            </span>
            {/* Show experiences */}
            {experiences.length > 0 ? (
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
                    {experiencesLoading && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "2rem",
                          color: "#666",
                        }}
                      >
                        <p>Loading experiences...</p>
                      </div>
                    )}
                    {experiencesError && (
                      <div
                        style={{
                          padding: "1rem",
                          backgroundColor: "#fef2f2",
                          border: "1px solid #fecaca",
                          borderRadius: "8px",
                        }}
                      >
                        <p style={{ color: "#dc2626" }}>{experiencesError}</p>
                      </div>
                    )}
                    {experiences.length > 0
                      ? experiences.map((experience) => {
                          return (
                            <div
                              key={experience.id}
                              style={{
                                borderRadius: 14,
                                border: "2.5px solid #4e944f",
                                boxShadow: "0 4px 24px rgba(76,177,106,0.15)",
                                overflow: "hidden",
                                background: "#fff",
                                minWidth: 220,
                                maxWidth: 240,
                                flex: "0 0 220px",
                                position: "relative",
                              }}
                            >
                              {/* INCLUDED badge */}
                              <div
                                style={{
                                  position: "absolute",
                                  top: 8,
                                  left: 8,
                                  background: "#4e944f",
                                  color: "white",
                                  padding: "4px 8px",
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 600,
                                }}
                              >
                                INCLUDED
                              </div>
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
                                <h4
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    margin: "0 0 8px 0",
                                    color: "#1f2937",
                                  }}
                                >
                                  {experience.name}
                                </h4>
                                <p
                                  style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    margin: "0 0 8px 0",
                                    lineHeight: "1.4",
                                  }}
                                >
                                  {experience.description}
                                </p>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    marginBottom: 8,
                                  }}
                                >
                                  <span style={{ color: "#fbbf24" }}>
                                    {"★".repeat(
                                      Math.floor(experience.rating || 0)
                                    )}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#9ca3af",
                                    }}
                                  >
                                    {experience.rating} (
                                    {experience.reviews || 0} reviews)
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#6b7280",
                                      backgroundColor: "#f3f4f6",
                                      padding: "4px 8px",
                                      borderRadius: "12px",
                                    }}
                                  >
                                    {experience.duration}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 600,
                                      color: "#4e944f",
                                    }}
                                  >
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
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600">Loading experiences...</p>
              </div>
            )}
          </div>

          {/* Booking Actions */}
          <div className="flex flex-col gap-4 items-center mt-6">
            {warning && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 24,
                }}
              >
                <span style={{ color: "#dc2626" }}>{warning}</span>
              </div>
            )}

            {paymentError && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 24,
                }}
              >
                <span style={{ color: "#dc2626" }}>{paymentError}</span>
              </div>
            )}

            <div className="flex gap-4">
              <button
                className="bg-[#4e944f] hover:bg-[#3d7540] text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 disabled:opacity-60"
                onClick={handleConfirmBooking}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? "Processing..." : "Confirm Booking"}
              </button>

              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-8 rounded-lg transition-colors duration-300"
                onClick={() => navigate("/packages")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmBook;
