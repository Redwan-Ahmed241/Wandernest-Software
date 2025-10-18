/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import type { FunctionComponent } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Tailwind CSS used for all styling. Centralized color theme via tailwind.config.js
import Layout from "../components/layout";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../Authentication/auth-context";

// API Configuration
const API_BASE_URL = "https://wander-nest-ad3s.onrender.com/api";
const WEATHER_API_KEY = "f69a050e081bb4a7910484976126421e";
const CURRENCY_API_KEY = "cur_live_LPjcwFzBdUdWJgQwyqlhl4C0gWLcWchrgJJE9oT1";

// Updated interfaces to match Django models
interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  country_code: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
}

interface Airline {
  code: string;
  name: string;
  logo?: string;
  website?: string;
}

interface Aircraft {
  model: string;
  manufacturer: string;
  total_seats: number;
  economy_seats: number;
  business_seats: number;
  first_class_seats: number;
}

interface Flight {
  id: string;
  airline: Airline; // Changed from string to Airline object
  flight_number: string;
  aircraft: Aircraft; // Changed from string to Aircraft object
  from_airport: Airport; // Changed from string to Airport object
  to_airport: Airport; // Changed from string to Airport object
  departure_datetime: string; // ISO datetime string
  arrival_datetime: string; // ISO datetime string
  duration: string;
  total_seats: number;
  available_seats: number;
  booked_seats: number;
  baggage_allowance: string;
  meal_included: boolean;
  wifi_available: boolean;
  entertainment_available: boolean;
  power_outlet_available: boolean;
  booking_class: "economy" | "business" | "first";
  base_price: number;
  current_price: number; // Use current_price instead of price
  currency: string;
  cancellation_policy: string;
  refund_policy?: string;
  status:
    | "scheduled"
    | "delayed"
    | "cancelled"
    | "boarding"
    | "departed"
    | "arrived";
  gate?: string;
  terminal?: string;
  is_active: boolean;
  is_featured: boolean;
  is_available?: boolean; // Add this computed property
}

interface FlightSearchRequest {
  from_airport: string; // Airport code
  to_airport: string; // Airport code
  departure_date: string;
  return_date?: string;
  passengers: number;
  booking_class: string;
  trip_type: "one_way" | "round_trip";
}

interface FlightSearchResponse {
  success: boolean;
  data: {
    flights: Flight[];
    total_results: number;
    search_id: string;
    search_timestamp: string;
  };
}

interface PassengerDetails {
  title: "mr" | "ms" | "mrs" | "dr" | "prof";
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  nationality: string;
  passport_number: string;
  passport_expiry: string;
  passenger_type: "adult" | "child" | "infant";
  seat_preference: "window" | "aisle" | "middle";
  meal_preference:
    | "vegetarian"
    | "non_vegetarian"
    | "halal"
    | "kosher"
    | "vegan";
}

interface BookingRequest {
  flight_id: string;
  passengers: PassengerDetails[];
  contact_details: {
    email: string;
    phone: string;
    emergency_contact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  special_requests?: string;
  total_amount: number;
  currency: string;
}

interface BookingResponse {
  success: boolean;
  data: {
    booking_id: string;
    confirmation_code: string;
    pnr: string;
    status: string;
    booking_date: string;
    flight_details: {
      airline: string;
      flight_number: string;
      from: string;
      to: string;
      departure: string;
      arrival: string;
    };
    passengers: Array<{
      name: string;
      seat_number: string;
      boarding_pass_url: string;
    }>;
    payment: {
      amount: number;
      currency: string;
      status: string;
      payment_id: string;
      payment_url?: string;
    };
    tickets: Array<{
      passenger_name: string;
      ticket_number: string;
      ticket_url: string;
    }>;
  };
}

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
}

interface CurrencyRate {
  currency: string;
  rate: number;
  change: string;
}

// Comprehensive list of nationalities
const NATIONALITIES = [
  "Afghan",
  "Albanian",
  "Algerian",
  "American",
  "Andorran",
  "Angolan",
  "Antiguans",
  "Argentinean",
  "Armenian",
  "Australian",
  "Austrian",
  "Azerbaijani",
  "Bahamian",
  "Bahraini",
  "Bangladeshi",
  "Barbadian",
  "Barbudans",
  "Batswana",
  "Belarusian",
  "Belgian",
  "Belizean",
  "Beninese",
  "Bhutanese",
  "Bolivian",
  "Bosnian",
  "Brazilian",
  "British",
  "Bruneian",
  "Bulgarian",
  "Burkinabe",
  "Burmese",
  "Burundian",
  "Cambodian",
  "Cameroonian",
  "Canadian",
  "Cape Verdean",
  "Central African",
  "Chadian",
  "Chilean",
  "Chinese",
  "Colombian",
  "Comoran",
  "Congolese",
  "Costa Rican",
  "Croatian",
  "Cuban",
  "Cypriot",
  "Czech",
  "Danish",
  "Djibouti",
  "Dominican",
  "Dutch",
  "East Timorese",
  "Ecuadorean",
  "Egyptian",
  "Emirian",
  "Equatorial Guinean",
  "Eritrean",
  "Estonian",
  "Ethiopian",
  "Fijian",
  "Filipino",
  "Finnish",
  "French",
  "Gabonese",
  "Gambian",
  "Georgian",
  "German",
  "Ghanaian",
  "Greek",
  "Grenadian",
  "Guatemalan",
  "Guinea-Bissauan",
  "Guinean",
  "Guyanese",
  "Haitian",
  "Herzegovinian",
  "Honduran",
  "Hungarian",
  "I-Kiribati",
  "Icelander",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Israeli",
  "Italian",
  "Ivorian",
  "Jamaican",
  "Japanese",
  "Jordanian",
  "Kazakhstani",
  "Kenyan",
  "Kittian and Nevisian",
  "Kuwaiti",
  "Kyrgyz",
  "Laotian",
  "Latvian",
  "Lebanese",
  "Liberian",
  "Libyan",
  "Liechtensteiner",
  "Lithuanian",
  "Luxembourger",
  "Macedonian",
  "Malagasy",
  "Malawian",
  "Malaysian",
  "Maldivan",
  "Malian",
  "Maltese",
  "Marshallese",
  "Mauritanian",
  "Mauritian",
  "Mexican",
  "Micronesian",
  "Moldovan",
  "Monacan",
  "Mongolian",
  "Moroccan",
  "Mosotho",
  "Motswana",
  "Mozambican",
  "Namibian",
  "Nauruan",
  "Nepalese",
  "New Zealander",
  "Ni-Vanuatu",
  "Nicaraguan",
  "Nigerian",
  "Nigerien",
  "North Korean",
  "Northern Irish",
  "Norwegian",
  "Omani",
  "Pakistani",
  "Palauan",
  "Panamanian",
  "Papua New Guinean",
  "Paraguayan",
  "Peruvian",
  "Polish",
  "Portuguese",
  "Qatari",
  "Romanian",
  "Russian",
  "Rwandan",
  "Saint Lucian",
  "Salvadoran",
  "Samoan",
  "San Marinese",
  "Sao Tomean",
  "Saudi",
  "Scottish",
  "Senegalese",
  "Serbian",
  "Seychellois",
  "Sierra Leonean",
  "Singaporean",
  "Slovakian",
  "Slovenian",
  "Solomon Islander",
  "Somali",
  "South African",
  "South Korean",
  "Spanish",
  "Sri Lankan",
  "Sudanese",
  "Surinamer",
  "Swazi",
  "Swedish",
  "Swiss",
  "Syrian",
  "Taiwanese",
  "Tajik",
  "Tanzanian",
  "Thai",
  "Togolese",
  "Tongan",
  "Trinidadian or Tobagonian",
  "Tunisian",
  "Turkish",
  "Tuvaluan",
  "Ugandan",
  "Ukrainian",
  "Uruguayan",
  "Uzbekistani",
  "Venezuelan",
  "Vietnamese",
  "Welsh",
  "Yemenite",
  "Zambian",
  "Zimbabwean",
];

// Updated API Service Functions
const flightAPI = {
  // Get airports for search autocomplete
  getAirports: async (search?: string): Promise<Airport[]> => {
    const url = search
      ? `${API_BASE_URL}flights/airports/?search=${encodeURIComponent(search)}`
      : `${API_BASE_URL}flights/airports/`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch airports: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success ? data.data : [];
  },

  // Search flights
  searchFlights: async (
    searchParams: FlightSearchRequest
  ): Promise<FlightSearchResponse> => {
    const response = await fetch(`${API_BASE_URL}/flights/search/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchParams),
    });

    if (!response.ok) {
      throw new Error(`Flight search failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Get flight details
  getFlightDetails: async (flightId: string): Promise<Flight> => {
    const response = await fetch(`${API_BASE_URL}/flights/${flightId}/`);

    if (!response.ok) {
      throw new Error(`Failed to get flight details: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error("Flight not found");
  },

  // Create booking
  createBooking: async (
    bookingData: BookingRequest
  ): Promise<BookingResponse> => {
    const response = await fetch(`${API_BASE_URL}/flights/bookings/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error(`Booking failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Get user bookings
  getUserBookings: async (userId: string): Promise<BookingResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/bookings/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get bookings: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success ? data.data.bookings : [];
  },

  // Track flight click for analytics
  trackFlightClick: async (flightId: string, searchId?: string) => {
    try {
      await fetch(`${API_BASE_URL}/analytics/flight-click/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flight_id: flightId,
          search_id: searchId,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to track flight click:", error);
    }
  },
};

// Weather API Service (unchanged)
const weatherAPI = {
const WEATHERAPI_KEY = "7883430411a0463b8ad135316251810";
const weatherAPI = {
  getWeatherForCity: async (city: string): Promise<WeatherData> => {
    const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(city)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`WeatherAPI.com failed for ${city}`);
    }
    const data = await response.json();
    return {
      city: data.location.name,
      temperature: data.current.temp_c,
      condition: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      icon: data.current.condition.icon,
    };
  },
  getWeatherForMultipleCities: async (cities: string[]): Promise<WeatherData[]> => {
    const promises = cities.map((city) => weatherAPI.getWeatherForCity(city));
    const results = await Promise.allSettled(promises);
    return results
      .filter((result): result is PromiseFulfilledResult<WeatherData> => result.status === "fulfilled")
      .map((result) => result.value);
  },
};

// Currency API Service (unchanged)
const currencyAPI = {
  getRates: async (currencies: string[]): Promise<CurrencyRate[]> => {
    const currencyList = currencies.join(",");
    const url = `https://api.currencyapi.com/v3/latest?apikey=${CURRENCY_API_KEY}&currencies=${currencyList}&base_currency=BDT`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Currency API failed");
    }

    const data = await response.json();

    if (!data.data) {
      throw new Error("Invalid currency API response");
    }

    return Object.entries(data.data).map(([currency, info]: [string, any]) => ({
      currency,
      rate: info.value,
      change: "N/A",
    }));
  },
};

// Updated Booking Modal Component
const BookingModal: React.FC<{
  flight: Flight;
  passengers: number;
  onClose: () => void;
  onConfirm: (bookingData: BookingRequest) => void;
  isLoading: boolean;
}> = ({ flight, passengers, onClose, onConfirm, isLoading }) => {
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails[]>(
    Array.from({ length: passengers }, () => ({
      title: "mr",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      nationality: "",
      passport_number: "",
      passport_expiry: "",
      passenger_type: "adult",
      seat_preference: "window",
      meal_preference: "vegan",
    }))
  );
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [emergencyContactRelationship, setEmergencyContactRelationship] =
    useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const handlePassengerChange = (
    index: number,
    field: keyof PassengerDetails,
    value: string
  ) => {
    const updated = [...passengerDetails];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerDetails(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation
    const isValid =
      passengerDetails.every(
        (p) =>
          p.first_name.trim() &&
          p.last_name.trim() &&
          p.email.trim() &&
          p.nationality.trim() &&
          p.date_of_birth.trim()
      ) &&
      contactEmail.trim() &&
      contactPhone.trim();

    if (!isValid) {
      alert(
        "Please fill in all required fields including nationality and date of birth"
      );
      return;
    }

    // Additional validation for international flights
    const hasInternationalPassengers = passengerDetails.some(
      (p) => p.nationality !== "Bangladeshi"
    );
    const missingPassportInfo = passengerDetails.some(
      (p) =>
        p.nationality !== "Bangladeshi" &&
        (!p.passport_number.trim() || !p.passport_expiry.trim())
    );

    if (hasInternationalPassengers && missingPassportInfo) {
      alert(
        "Passport number and expiry date are required for international passengers"
      );
      return;
    }

    const bookingData: BookingRequest = {
      flight_id: flight.id,
      passengers: passengerDetails,
      contact_details: {
        email: contactEmail,
        phone: contactPhone,
        emergency_contact: emergencyContactName
          ? {
              name: emergencyContactName,
              phone: emergencyContactPhone,
              relationship: emergencyContactRelationship,
            }
          : undefined,
      },
      special_requests: specialRequests,
      total_amount: flight.current_price * passengers,
      currency: flight.currency,
    };

    onConfirm(bookingData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Book Flight</h2>
          <button
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Flight Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-sm">
              <strong>Route:</strong> {flight.from_airport.city} →{" "}
              {flight.to_airport.city}
            </div>
            <div className="text-sm">
              <strong>Airline:</strong> {flight.airline.name}
            </div>
            <div className="text-sm">
              <strong>Flight:</strong> {flight.flight_number}
            </div>
            <div className="text-sm">
              <strong>Aircraft:</strong> {flight.aircraft.model}
            </div>
            <div className="text-sm">
              <strong>Departure:</strong>{" "}
              {new Date(flight.departure_datetime).toLocaleString()}
            </div>
            <div className="text-sm">
              <strong>Duration:</strong> {flight.duration}
            </div>
            <div className="text-sm">
              <strong>Passengers:</strong> {passengers}
            </div>
            <div className="text-sm">
              <strong>Total Price:</strong> {flight.currency}{" "}
              {(flight.current_price * passengers).toLocaleString()}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship
                </label>
                <select
                  value={emergencyContactRelationship}
                  onChange={(e) =>
                    setEmergencyContactRelationship(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select relationship</option>
                  <option value="spouse">Spouse</option>
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Passenger Details
            </h3>
            {passengerDetails.map((passenger, index) => (
              <div
                key={index}
                className="mb-6 p-4 border border-gray-200 rounded-lg"
              >
                <h4 className="text-md font-semibold text-gray-800 mb-4">
                  Passenger {index + 1}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <select
                      value={passenger.title}
                      onChange={(e) =>
                        handlePassengerChange(index, "title", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="mr">Mr</option>
                      <option value="ms">Ms</option>
                      <option value="mrs">Mrs</option>
                      <option value="dr">Dr</option>
                      <option value="prof">Prof</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passenger Type *
                    </label>
                    <select
                      value={passenger.passenger_type}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "passenger_type",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="adult">Adult</option>
                      <option value="child">Child</option>
                      <option value="infant">Infant</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={passenger.first_name}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "first_name",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={passenger.last_name}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "last_name",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={passenger.email}
                      onChange={(e) =>
                        handlePassengerChange(index, "email", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={passenger.phone}
                      onChange={(e) =>
                        handlePassengerChange(index, "phone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={passenger.date_of_birth}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "date_of_birth",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality *
                    </label>
                    <select
                      value={passenger.nationality}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "nationality",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select nationality</option>
                      {NATIONALITIES.map((nationality) => (
                        <option key={nationality} value={nationality}>
                          {nationality}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passport Number{" "}
                      {passenger.nationality !== "Bangladeshi" &&
                      passenger.nationality
                        ? "*"
                        : ""}
                    </label>
                    <input
                      type="text"
                      value={passenger.passport_number}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "passport_number",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={
                        passenger.nationality !== "Bangladeshi" &&
                        passenger.nationality !== ""
                      }
                      placeholder={
                        passenger.nationality === "Bangladeshi"
                          ? "Optional for domestic flights"
                          : "Required for international passengers"
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passport Expiry{" "}
                      {passenger.nationality !== "Bangladeshi" &&
                      passenger.nationality
                        ? "*"
                        : ""}
                    </label>
                    <input
                      type="date"
                      value={passenger.passport_expiry}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "passport_expiry",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={
                        passenger.nationality !== "Bangladeshi" &&
                        passenger.nationality !== ""
                      }
                      min={new Date().toISOString().split("T")[0]} // Passport should not be expired
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seat Preference
                    </label>
                    <select
                      value={passenger.seat_preference}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "seat_preference",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select...</option>
                      <option value="window">Window</option>
                      <option value="aisle">Aisle</option>
                      <option value="middle">Middle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meal Preference
                    </label>
                    <select
                      value={passenger.meal_preference}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "meal_preference",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!flight.meal_included}
                    >
                      {flight.meal_included ? (
                        <>
                          <option value="">Select...</option>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="non_vegetarian">Non-Vegetarian</option>
                          <option value="halal">Halal</option>
                          <option value="kosher">Kosher</option>
                          <option value="vegan">Vegan</option>
                        </>
                      ) : (
                        <option value="">No meal service on this flight</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Special Requests */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Special Requests (Optional)
            </h3>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requirements or requests..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
            >
              {isLoading
                ? "Booking..."
                : `Confirm Booking (${flight.currency} ${(
                    flight.current_price * passengers
                  ).toLocaleString()})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Flights: FunctionComponent = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Form states - Updated to use airport codes
  const [fromAirport, setFromAirport] = useState("");
  const [toAirport, setToAirport] = useState("");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [bookingClass, setBookingClass] = useState("economy");
  const [tripType, setTripType] = useState<"one_way" | "round_trip">("one_way");

  // Airport search states
  const [airports, setAirports] = useState<Airport[]>([]);
  const [fromAirportSearch, setFromAirportSearch] = useState("");
  const [toAirportSearch, setToAirportSearch] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // API data states
  const [flights, setFlights] = useState<Flight[]>([]);
  const [currentSearchId, setCurrentSearchId] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);

  // Booking states
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Loading states
  const [isSearchingFlights, setIsSearchingFlights] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [currencyLoading, setCurrencyLoading] = useState(true);

  // Error states
  const [searchError, setSearchError] = useState("");
  const [weatherError, setWeatherError] = useState("");
  const [currencyError, setCurrencyError] = useState("");
  const [bookingError, setBookingError] = useState("");

  // Search states
  const [search, setSearch] = useState("");
  const [currencySearch, setCurrencySearch] = useState("");
  const [activeCurrencies, setActiveCurrencies] = useState([
    "EUR",
    "USD",
    "CAD",
  ]);
  const [showMap, setShowMap] = useState(false);

  // Load initial data on component mount
  useEffect(() => {
    // Load mock data for development
    loadMockData();
    loadAirports();
  }, []);

  // Mock data for development
  const loadMockData = () => {
    // Mock weather data
    const mockWeatherData: WeatherData[] = [
      {
        city: "Dhaka",
        temperature: 28,
        condition: "Partly Cloudy",
        description: "partly cloudy",
        humidity: 65,
        windSpeed: 15,
      },
      {
        city: "Chittagong",
        temperature: 26,
        condition: "Sunny",
        description: "clear sky",
        humidity: 70,
        windSpeed: 12,
      },
      {
        city: "Sylhet",
        temperature: 24,
        condition: "Rainy",
        description: "light rain",
        humidity: 85,
        windSpeed: 8,
      },
      {
        city: "Rajshahi",
        temperature: 30,
        condition: "Hot",
        description: "clear sky",
        humidity: 55,
        windSpeed: 18,
      },
    ];

    // Mock currency data
    const mockCurrencyRates: CurrencyRate[] = [
      { currency: "USD", rate: 0.0091, change: "+0.5%" },
      { currency: "EUR", rate: 0.0083, change: "+0.2%" },
      { currency: "CAD", rate: 0.012, change: "-0.1%" },
    ];

    // Set mock data
    setWeatherData(mockWeatherData);
    setCurrencyRates(mockCurrencyRates);
    setIsLoadingWeather(false);
    setCurrencyLoading(false);
  };

  // Load airports for search
  const loadAirports = async () => {
    try {
      const airportData = await flightAPI.getAirports();
      setAirports(airportData);
    } catch (error) {
      console.error("Failed to load airports:", error);
      // Use mock airports if API fails
      const mockAirports: Airport[] = [
        {
          code: "DAC",
          name: "Hazrat Shahjalal International Airport",
          city: "Dhaka",
          country: "Bangladesh",
          country_code: "BD",
        },
        {
          code: "CGP",
          name: "Shah Amanat International Airport",
          city: "Chittagong",
          country: "Bangladesh",
          country_code: "BD",
        },
        {
          code: "ZYL",
          name: "Osmani International Airport",
          city: "Sylhet",
          country: "Bangladesh",
          country_code: "BD",
        },
        {
          code: "RJH",
          name: "Shah Makhdum Airport",
          city: "Rajshahi",
          country: "Bangladesh",
          country_code: "BD",
        },
        {
          code: "JSR",
          name: "Jessore Airport",
          city: "Jessore",
          country: "Bangladesh",
          country_code: "BD",
        },
        {
          code: "BZL",
          name: "Cox's Bazar Airport",
          city: "Cox's Bazar",
          country: "Bangladesh",
          country_code: "BD",
        },
        {
          code: "DXB",
          name: "Dubai International Airport",
          city: "Dubai",
          country: "UAE",
          country_code: "AE",
        },
        {
          code: "DOH",
          name: "Hamad International Airport",
          city: "Doha",
          country: "Qatar",
          country_code: "QA",
        },
        {
          code: "KUL",
          name: "Kuala Lumpur International Airport",
          city: "Kuala Lumpur",
          country: "Malaysia",
          country_code: "MY",
        },
        {
          code: "BKK",
          name: "Suvarnabhumi Airport",
          city: "Bangkok",
          country: "Thailand",
          country_code: "TH",
        },
      ];
      setAirports(mockAirports);
    }
  };

  // Filter airports based on search
  const getFilteredAirports = (searchTerm: string) => {
    if (!searchTerm) return airports.slice(0, 10); // Show first 10 if no search

    return airports
      .filter(
        (airport) =>
          airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          airport.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10);
  };

  // API Functions (with fallback to mock data)
  const fetchWeatherForCities = async (cities: string[]) => {
    setIsLoadingWeather(true);
    setWeatherError("");

    try {
      const weatherResults = await weatherAPI.getWeatherForMultipleCities(
        cities
      );
      setWeatherData(weatherResults);
    } catch (err) {
      console.log("Using mock weather data due to API error:", err);
      // Use mock data if API fails
      loadMockData();
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const fetchCurrencyRates = async () => {
    setCurrencyLoading(true);
    setCurrencyError("");

    try {
      const rates = await currencyAPI.getRates(activeCurrencies);
      setCurrencyRates(rates);
    } catch (err) {
      console.log("Using mock currency data due to API error:", err);
      // Use mock data if API fails
      const mockCurrencyRates: CurrencyRate[] = [
        { currency: "USD", rate: 0.0091, change: "+0.5%" },
        { currency: "EUR", rate: 0.0083, change: "+0.2%" },
        { currency: "CAD", rate: 0.012, change: "-0.1%" },
        { currency: "GBP", rate: 0.0072, change: "+0.8%" },
        { currency: "INR", rate: 0.76, change: "-0.3%" },
        { currency: "AUD", rate: 0.014, change: "+0.1%" },
      ];
      const filteredRates = mockCurrencyRates.filter((rate) =>
        activeCurrencies.includes(rate.currency)
      );
      setCurrencyRates(filteredRates);
    } finally {
      setCurrencyLoading(false);
    }
  };

  // Update currency rates when active currencies change
  useEffect(() => {
    fetchCurrencyRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCurrencies]);

  const handleSearchFlights = async () => {
    // Check if required fields are filled
    if (!fromAirport || !toAirport || !departure) {
      if (!fromAirport && fromAirportSearch) {
        setSearchError(
          "Please select a departure airport from the dropdown list"
        );
      } else if (!toAirport && toAirportSearch) {
        setSearchError(
          "Please select a destination airport from the dropdown list"
        );
      } else {
        setSearchError(
          "Please select departure city, destination city, and departure date"
        );
      }
      return;
    }

    // Check if from and to airports are different
    if (fromAirport === toAirport) {
      setSearchError("Departure and destination cities must be different");
      return;
    }

    // Ensure at least one airport is in Bangladesh
    const bangladeshAirportCodes = ["DAC", "CGP", "ZYL", "RJH", "JSR", "BZL"];
    if (
      !bangladeshAirportCodes.includes(fromAirport) &&
      !bangladeshAirportCodes.includes(toAirport)
    ) {
      setSearchError(
        "At least one of the departure or destination airports must be in Bangladesh"
      );
      return;
    }

    if (tripType === "round_trip" && !returnDate) {
      setSearchError("Please select return date for round trip");
      return;
    }

    // Clear any previous errors
    setSearchError("");

    try {
      setIsSearchingFlights(true);
      setFlights([]);

      const searchParams: FlightSearchRequest = {
        from_airport: fromAirport,
        to_airport: toAirport,
        departure_date: departure,
        return_date: tripType === "round_trip" ? returnDate : undefined,
        passengers: passengers,
        booking_class: bookingClass,
        trip_type: tripType,
      };

      const response = await flightAPI.searchFlights(searchParams);

      if (response.success) {
        setFlights(response.data.flights);
        setCurrentSearchId(response.data.search_id);

        if (response.data.flights.length === 0) {
          setSearchError("No flights found for your search criteria");
        }
      } else {
        setSearchError("Failed to search flights");
      }
    } catch (error) {
      setSearchError("Failed to search flights. Please try again.");
      console.error("Flight search error:", error);
      setFlights([]);
    } finally {
      setIsSearchingFlights(false);
    }
  };

  // Handle flight booking
  const handleBookFlight = async (flight: Flight) => {
    // Track flight click
    await flightAPI.trackFlightClick(flight.id, currentSearchId);

    if (!isAuthenticated) {
      // Store the intended booking in localStorage and redirect to login
      localStorage.setItem(
        "pendingFlightBooking",
        JSON.stringify({
          flight,
          passengers,
          returnUrl: "/flights",
        })
      );
      navigate("/login");
      return;
    }

    setSelectedFlight(flight);
    setShowBookingModal(true);
    setBookingError("");
  };

  // Confirm booking
  const handleConfirmBooking = async (bookingData: BookingRequest) => {
    try {
      setIsBooking(true);
      setBookingError("");

      const response = await flightAPI.createBooking(bookingData);

      if (response.success) {
        setBookingSuccess(true);
        setShowBookingModal(false);

        // Show success message and redirect to dashboard after delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setBookingError("Failed to complete booking. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookingError("Failed to complete booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  // Handle weather search (unchanged)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) {
      const defaultCities = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi"];
      fetchWeatherForCities(defaultCities);
      return;
    }
    setIsLoadingWeather(true);
    setWeatherError("");
    try {
      const weatherResult = await weatherAPI.getWeatherForCity(search.trim());
      setWeatherData([weatherResult]);
    } catch (err) {
      setWeatherError("Failed to fetch weather data.");
      setWeatherData([]);
      console.error("Weather search error:", err);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Handle currency search (unchanged)
  const handleCurrencySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const code = currencySearch.trim().toUpperCase();
    if (!code) {
      setActiveCurrencies(["EUR", "USD", "CAD"]);
      return;
    }

    if (!activeCurrencies.includes(code)) {
      setActiveCurrencies([...activeCurrencies, code]);
    }
  };

  // Check for pending booking on component mount
  useEffect(() => {
    if (isAuthenticated) {
      const pendingBooking = localStorage.getItem("pendingFlightBooking");
      if (pendingBooking) {
        try {
          const { flight, passengers: pendingPassengers } =
            JSON.parse(pendingBooking);
          setPassengers(pendingPassengers);
          handleBookFlight(flight);
          localStorage.removeItem("pendingFlightBooking");
        } catch (e) {
          console.error("Error processing pending booking:", e);
          localStorage.removeItem("pendingFlightBooking");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-0">
        {/* Success Message */}
        {bookingSuccess && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <h3>✅ Booking Confirmed!</h3>
            <p>
              Your flight has been booked successfully. Redirecting to
              dashboard...
            </p>
          </div>
        )}

        {/* Hero Section */}
        <div
          className="relative bg-cover bg-center bg-no-repeat text-white py-16 min-h-[600px] flex items-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/flight-hero-bg.jpg)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center mb-4">
              Discover Your Next Flight
            </h1>
            <p className="text-xl text-center mb-8">
              Search and book flights to your dream destination
            </p>

            {/* Flight Search Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
              {searchError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {searchError}
                </div>
              )}

              {/* Trip Type Selection */}
              <div className="flex gap-4 mb-6">
                <label className="flex items-center text-gray-900">
                  <input
                    type="radio"
                    value="one_way"
                    checked={tripType === "one_way"}
                    onChange={(e) => setTripType(e.target.value as "one_way")}
                    className="mr-2"
                  />
                  One Way
                </label>
                <label className="flex items-center text-gray-900">
                  <input
                    type="radio"
                    value="round_trip"
                    checked={tripType === "round_trip"}
                    onChange={(e) =>
                      setTripType(e.target.value as "round_trip")
                    }
                    className="mr-2"
                  />
                  Round Trip
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* From Airport Search */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search city or airport"
                      value={fromAirportSearch}
                      onChange={(e) => {
                        setFromAirportSearch(e.target.value);
                        setShowFromDropdown(true);

                        // Auto-select if exact match found
                        const exactMatch = airports.find(
                          (airport) =>
                            airport.city.toLowerCase() ===
                              e.target.value.toLowerCase() ||
                            airport.name.toLowerCase() ===
                              e.target.value.toLowerCase()
                        );
                        if (exactMatch) {
                          setFromAirport(exactMatch.code);
                        } else {
                          setFromAirport(""); // Clear if no exact match
                        }
                      }}
                      onFocus={() => setShowFromDropdown(true)}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                        fromAirport === toAirport && fromAirport
                          ? "border-red-500"
                          : ""
                      }`}
                      required
                    />
                    {showFromDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {getFilteredAirports(fromAirportSearch).map(
                          (airport) => (
                            <div
                              key={airport.code}
                              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => {
                                setFromAirport(airport.code);
                                setFromAirportSearch(
                                  `${airport.city} (${airport.code})`
                                );
                                setShowFromDropdown(false);

                                // Clear "To" field if same airport is selected
                                if (toAirport === airport.code) {
                                  setToAirport("");
                                  setToAirportSearch("");
                                }
                              }}
                            >
                              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold mr-3">
                                {airport.code}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {airport.city}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {airport.name}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* To Airport Search */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search city or airport"
                      value={toAirportSearch}
                      onChange={(e) => {
                        setToAirportSearch(e.target.value);
                        setShowToDropdown(true);

                        // Auto-select if exact match found
                        const exactMatch = airports.find(
                          (airport) =>
                            airport.city.toLowerCase() ===
                              e.target.value.toLowerCase() ||
                            airport.name.toLowerCase() ===
                              e.target.value.toLowerCase()
                        );
                        if (exactMatch) {
                          setToAirport(exactMatch.code);
                        } else {
                          setToAirport(""); // Clear if no exact match
                        }
                      }}
                      onFocus={() => setShowToDropdown(true)}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                        fromAirport === toAirport && toAirport
                          ? "border-red-500"
                          : ""
                      }`}
                      required
                    />
                    {showToDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {getFilteredAirports(toAirportSearch).map((airport) => (
                          <div
                            key={airport.code}
                            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => {
                              setToAirport(airport.code);
                              setToAirportSearch(
                                `${airport.city} (${airport.code})`
                              );
                              setShowToDropdown(false);

                              // Clear "From" field if same airport is selected
                              if (fromAirport === airport.code) {
                                setFromAirport("");
                                setFromAirportSearch("");
                              }
                            }}
                          >
                            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold mr-3">
                              {airport.code}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {airport.city}
                              </div>
                              <div className="text-sm text-gray-500">
                                {airport.name}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure
                  </label>
                  <input
                    type="date"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>

                {tripType === "round_trip" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={departure || new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passengers
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) =>
                      setPassengers(Number.parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <select
                    value={bookingClass}
                    onChange={(e) => setBookingClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>

              <button
                className="w-full bg-[#6ab187] hover:from-[#6ab187] hover:to-green-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                onClick={handleSearchFlights}
                disabled={isSearchingFlights}
              >
                {isSearchingFlights ? "Searching..." : "Search Flights"}
              </button>
            </div>
          </div>
        </div>

        {/* Flight Results Section */}
        {flights.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Flights ({flights.length} found)
            </h2>
            <div className="space-y-4">
              {flights.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-lg font-semibold text-gray-900">
                            {flight.from_airport.city} →{" "}
                            {flight.to_airport.city}
                          </div>
                          <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {flight.flight_number}
                          </div>
                        </div>
                        {flight.status !== "scheduled" && (
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              flight.status === "delayed"
                                ? "bg-yellow-100 text-yellow-800"
                                : flight.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : flight.status === "boarding"
                                ? "bg-blue-100 text-blue-800"
                                : flight.status === "departed"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {flight.status.toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Airline:
                          </span>
                          <span className="ml-2 text-sm text-gray-900">
                            {flight.airline.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Aircraft:
                          </span>
                          <span className="ml-2 text-sm text-gray-900">
                            {flight.aircraft.model}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Duration:
                          </span>
                          <span className="ml-2 text-sm text-gray-900">
                            {flight.duration}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Departure:
                          </span>
                          <span className="ml-2 text-sm text-gray-900">
                            {new Date(
                              flight.departure_datetime
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Arrival:
                          </span>
                          <span className="ml-2 text-sm text-gray-900">
                            {new Date(flight.arrival_datetime).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Available Seats:
                          </span>
                          <span
                            className={`ml-2 text-sm font-semibold ${
                              flight.available_seats <= 5
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {flight.available_seats} left
                          </span>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2">
                        {flight.meal_included && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            🍽️ Meal
                          </span>
                        )}
                        {flight.wifi_available && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            📶 WiFi
                          </span>
                        )}
                        {flight.entertainment_available && (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            🎬 Entertainment
                          </span>
                        )}
                        {flight.power_outlet_available && (
                          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                            🔌 Power
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
                      <div className="mb-4">
                        {flight.base_price !== flight.current_price && (
                          <div className="text-sm text-gray-500 line-through">
                            {flight.currency}{" "}
                            {flight.base_price.toLocaleString()}
                          </div>
                        )}
                        <div className="text-2xl font-bold text-gray-900">
                          {flight.currency}{" "}
                          {flight.current_price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">per person</div>
                        {passengers > 1 && (
                          <div className="text-sm font-semibold text-gray-700 mt-1">
                            Total: {flight.currency}{" "}
                            {(
                              flight.current_price * passengers
                            ).toLocaleString()}
                          </div>
                        )}
                      </div>

                      <button
                        className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                          flight.available_seats <= 0 ||
                          flight.status !== "scheduled" ||
                          !flight.is_active
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none hover:scale-100"
                            : "bg-[#6ab187]  hover:from-[#6ab187] hover:to-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        }`}
                        onClick={() => handleBookFlight(flight)}
                        disabled={
                          flight.available_seats <= 0 ||
                          flight.status !== "scheduled" ||
                          !flight.is_active
                        }
                      >
                        {flight.available_seats <= 0
                          ? "Sold Out"
                          : flight.status !== "scheduled"
                          ? flight.status.charAt(0).toUpperCase() +
                            flight.status.slice(1)
                          : isAuthenticated
                          ? "Book Now"
                          : "Sign up"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedFlight && (
          <BookingModal
            flight={selectedFlight}
            passengers={passengers}
            onClose={() => {
              setShowBookingModal(false);
              setSelectedFlight(null);
              setBookingError("");
            }}
            onConfirm={handleConfirmBooking}
            isLoading={isBooking}
          />
        )}

        {/* Booking Error */}
        {bookingError && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {bookingError}
          </div>
        )}

        {/* Weather Forecast Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Real-Time Weather Forecast for Bangladesh
          </h2>

          {/* Fixed Weather Map */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <button
                className="bg-[#6ab187]  hover:from-[#6ab187] hover:to-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? "Hide Map" : "Show Weather Map"}
              </button>
            </div>

            {showMap && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Bangladesh Weather Map
                    </h3>
                    <button
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                      onClick={() => setShowMap(false)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="p-4">
                    <MapContainer
                      center={[23.685, 90.3563]}
                      zoom={6}
                      style={{ height: "400px", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                      />
                      <TileLayer
                        url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`}
                        attribution="&copy; OpenWeatherMap"
                      />
                    </MapContainer>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-[#6ab187] hover:from-[#6ab187] hover:to-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Search
              </button>
            </form>
          </div>

          {isLoadingWeather && (
            <p className="text-center text-gray-600">Loading weather...</p>
          )}
          {weatherError && (
            <p className="text-center text-red-600">{weatherError}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {weatherData.map((weather, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {weather.city}
                </h2>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Math.round(weather.temperature)}°C
                </div>
                <div className="text-gray-700 mb-2">
                  {weather.condition}
                  <span className="text-gray-500 block text-sm">
                    ({weather.description})
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Humidity: {weather.humidity}%
                </div>
                <div className="text-sm text-gray-600">
                  Wind: {weather.windSpeed} km/h
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Currency Exchange Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Real-Time Currency Exchange Rates
          </h2>

          {/* Currency Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
            <form onSubmit={handleCurrencySearch} className="flex gap-2">
              <input
                type="text"
                value={currencySearch}
                onChange={(e) => setCurrencySearch(e.target.value)}
                placeholder="Search currency code (e.g. GBP, INR, AUD)"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[250px]"
              />
              <button
                type="submit"
                className="bg-[#6ab187] hover:from-[#6ab187] hover:to-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Search
              </button>
              {activeCurrencies.length > 3 && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrencySearch("");
                    setActiveCurrencies(["EUR", "USD", "CAD"]);
                  }}
                  className="bg-[#6ab187] hover:from-[#6ab187] hover:to-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Reset
                </button>
              )}
            </form>
          </div>

          {currencyLoading && (
            <div className="text-center text-gray-600">
              Loading currency rates...
            </div>
          )}
          {currencyError && (
            <div className="text-center text-red-600">{currencyError}</div>
          )}

          {currencyRates.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Currency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate (BDT)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currencyRates.map((row) => (
                      <tr key={row.currency} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(1 / Number(row.rate)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!currencyLoading && !currencyError && currencyRates.length === 0 && (
            <p className="text-center text-red-600">
              No currency data available.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Flights;
