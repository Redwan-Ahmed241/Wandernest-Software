"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Tailwind CSS used for all styling. Centralized color theme via tailwind.config.js
import Layout from "../App/Layout";
// Removed unused imports
import { getHotels } from "../App/api-services";
import type { Hotel } from "../App/api-services";

// Removed unused PackageOption interface

const optionOrder = ["transport", "hotel", "vehicle", "guide"] as const;
type OptionKey = (typeof optionOrder)[number];

const ConfirmBook: React.FC = () => {
  const location = useLocation();
  const pkg = location.state?.pkg;
  type PackageDetails = {
    id?: string;
    title?: string;
    source?: string;
    destination?: string;
    price?: string | number;
    budget?: string | number;
    days?: string | number;
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

  // Skip states for options
  const [skipHotel, setSkipHotel] = useState(false);
  const [skipVehicle, setSkipVehicle] = useState(true);
  const [skipGuide, setSkipGuide] = useState(true);

  // Focus state for option rows
  const [activeOption, setActiveOption] = useState<OptionKey>("transport");
  const optionRefs: Record<OptionKey, React.RefObject<HTMLDivElement>> = {
    transport: useRef<HTMLDivElement>(null),
    hotel: useRef<HTMLDivElement>(null),
    vehicle: useRef<HTMLDivElement>(null),
    guide: useRef<HTMLDivElement>(null),
  };

  // Placeholder states for options (to be replaced with API data)
  const [, setTransport] = useState<string>("Not selected");
  const [, setHotel] = useState<string>("Not selected");
  const [, setGuide] = useState<string>("Not selected");

  const [warning, setWarning] = useState("");

  const navigate = useNavigate();

  const dateInputRef = React.useRef<HTMLInputElement>(null);

  // Add hotel selection state
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [hotelsError, setHotelsError] = useState("");
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  // Add state for transport and guide options
  // Removed unused transportOptions and guideOptions

  // Helper to get correct field regardless of casing
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

  // Helper to format date as DD-MM-YYYY
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  // Helper to extract main location
  const extractMainLocation = (str: string): string => {
    if (!str) return "";
    // Remove any text in parentheses
    const cleanStr = str.replace(/\(.*?\)/g, "").trim();
    // Extract the last part after comma (if exists)
    const parts = cleanStr.split(",");
    const mainPart = parts[parts.length - 1].trim();
    // Remove any special characters and make lowercase
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
            setPackageDetails(found);
            setStartDate("");
            setTravelers(1);
            setTotalPrice(found.price || found.budget || "");
            setTransport("Not selected");
            setHotel("Not selected");
            setGuide("Not selected");
            // Removed setSkipTransport (no longer used)
            setSkipHotel(false);
            setSkipGuide(true);
            setActiveOption("transport");
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
  }, [pkg]);

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
      const days = parseInt(getField(packageDetails, "days"), 10);
      if (!isNaN(days)) {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + days);
        const yyyy = end.getFullYear();
        const mm = String(end.getMonth() + 1).padStart(2, "0");
        const dd = String(end.getDate()).padStart(2, "0");
        setEndDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setEndDate("");
      }
    } else {
      setEndDate("");
    }
  }, [packageDetails, startDate, getField]);

  // Fetch all options when needed
  // Removed unused _fetchAllOptions function

  // Fetch hotels when hotel selection is not skipped
  useEffect(() => {
    if (!skipHotel) {
      setHotelsLoading(true);
      setHotelsError("");
      getHotels()
        .then((hotels) => {
          setHotels(hotels);
          setHotelsLoading(false);
        })
        .catch(() => {
          setHotelsError("Failed to fetch hotels.");
          setHotels([]);
          setHotelsLoading(false);
        });
    } else {
      setHotels([]);
    }
  }, [skipHotel]);

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
                  value={getField(packageDetails, "source")}
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
                  value={getField(packageDetails, "destination")}
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
                className="ml-4 px-4 py-1 rounded-full border border-primary text-primary bg-white hover:bg-primary hover:text-white transition"
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
                className="ml-4 px-4 py-1 rounded-full border border-primary text-primary bg-white hover:bg-primary hover:text-white transition"
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
                className="ml-4 px-4 py-1 rounded-full border border-primary text-primary bg-white hover:bg-primary hover:text-white transition"
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
            className="w-full max-w-xs px-6 py-3 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary-dark transition disabled:opacity-60"
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
