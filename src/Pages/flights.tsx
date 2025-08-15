"use client";

import type React from "react";
import type { FunctionComponent } from "react";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Tailwind CSS used for all styling. Centralized color theme via tailwind.config.js
import Layout from "../App/Layout";
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
      ? `${API_BASE_URL}/airports/?search=${encodeURIComponent(search)}`
      : `${API_BASE_URL}/airports/`;

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
    return data.success ? data.data : null;
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
  getWeatherForCity: async (city: string): Promise<WeatherData> => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API failed for ${city}`);
    }

    const data = await response.json();

    return {
      city: data.name,
      temperature: data.main.temp,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };
  },

  getWeatherForMultipleCities: async (
    cities: string[]
  ): Promise<WeatherData[]> => {
    const promises = cities.map((city) => weatherAPI.getWeatherForCity(city));
    const results = await Promise.allSettled(promises);

    return results
      .filter(
        (result): result is PromiseFulfilledResult<WeatherData> =>
          result.status === "fulfilled"
      )
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
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Book Flight</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.flightSummary}>
          <h3>Flight Details</h3>
          <div className={styles.summaryGrid}>
            <div>
              <strong>Route:</strong> {flight.from_airport.city} →{" "}
              {flight.to_airport.city}
            </div>
            <div>
              <strong>Airline:</strong> {flight.airline.name}
            </div>
            <div>
              <strong>Flight:</strong> {flight.flight_number}
            </div>
            <div>
              <strong>Aircraft:</strong> {flight.aircraft.model}
            </div>
            <div>
              <strong>Departure:</strong>{" "}
              {new Date(flight.departure_datetime).toLocaleString()}
            </div>
            <div>
              <strong>Duration:</strong> {flight.duration}
            </div>
            <div>
              <strong>Passengers:</strong> {passengers}
            </div>
            <div>
              <strong>Total Price:</strong> {flight.currency}{" "}
              {(flight.current_price * passengers).toLocaleString()}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.bookingForm}>
          {/* Contact Information */}
          <div className={styles.formSection}>
            <h3>Contact Information</h3>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Contact Email *</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Contact Phone *</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Emergency Contact Name</label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Relationship</label>
                <select
                  value={emergencyContactRelationship}
                  onChange={(e) =>
                    setEmergencyContactRelationship(e.target.value)
                  }
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
          <div className={styles.formSection}>
            <h3>Passenger Details</h3>
            {passengerDetails.map((passenger, index) => (
              <div key={index} className={styles.passengerSection}>
                <h4>Passenger {index + 1}</h4>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Title *</label>
                    <select
                      value={passenger.title}
                      onChange={(e) =>
                        handlePassengerChange(index, "title", e.target.value)
                      }
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
                  <div className={styles.inputGroup}>
                    <label>Passenger Type *</label>
                    <select
                      value={passenger.passenger_type}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "passenger_type",
                          e.target.value
                        )
                      }
                      required
                    >
                      <option value="">Select...</option>
                      <option value="adult">Adult</option>
                      <option value="child">Child</option>
                      <option value="infant">Infant</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>First Name *</label>
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
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Last Name *</label>
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
                      required
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Email *</label>
                    <input
                      type="email"
                      value={passenger.email}
                      onChange={(e) =>
                        handlePassengerChange(index, "email", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={passenger.phone}
                      onChange={(e) =>
                        handlePassengerChange(index, "phone", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Date of Birth *</label>
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
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Nationality *</label>
                    <select
                      value={passenger.nationality}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "nationality",
                          e.target.value
                        )
                      }
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
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>
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
                  <div className={styles.inputGroup}>
                    <label>
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
                      required={
                        passenger.nationality !== "Bangladeshi" &&
                        passenger.nationality !== ""
                      }
                      min={new Date().toISOString().split("T")[0]} // Passport should not be expired
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Seat Preference</label>
                    <select
                      value={passenger.seat_preference}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "seat_preference",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select...</option>
                      <option value="window">Window</option>
                      <option value="aisle">Aisle</option>
                      <option value="middle">Middle</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Meal Preference</label>
                    <select
                      value={passenger.meal_preference}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "meal_preference",
                          e.target.value
                        )
                      }
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
          <div className={styles.formSection}>
            <h3>Special Requests (Optional)</h3>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requirements or requests..."
              className={styles.textArea}
              rows={3}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.confirmButton}
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
  const { isAuthenticated, loading: authLoading } = useAuth();

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
  const [searching, setSearching] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");
  const [activeCurrencies, setActiveCurrencies] = useState([
    "EUR",
    "USD",
    "CAD",
  ]);
  const [showMap, setShowMap] = useState(false);

  // Load initial data on component mount
  useEffect(() => {
    const defaultCities = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi"];
    fetchWeatherForCities(defaultCities);
    fetchCurrencyRates();
    loadAirports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load airports for search
  const loadAirports = async () => {
    try {
      const airportData = await flightAPI.getAirports();
      setAirports(airportData);
    } catch (error) {
      console.error("Failed to load airports:", error);
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

  // API Functions (weather and currency unchanged)
  const fetchWeatherForCities = async (cities: string[]) => {
    setIsLoadingWeather(true);
    setWeatherError("");

    try {
      const weatherResults = await weatherAPI.getWeatherForMultipleCities(
        cities
      );
      setWeatherData(weatherResults);
    } catch (err) {
      setWeatherError("Failed to fetch weather data.");
      setWeatherData([]);
      console.error("Weather fetch error:", err);
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
      setCurrencyError("Failed to fetch currency rates.");
      setCurrencyRates([]);
      console.error("Currency fetch error:", err);
    } finally {
      setCurrencyLoading(false);
    }
  };

  // Update currency rates when active currencies change
  useEffect(() => {
    fetchCurrencyRates();
  }, [activeCurrencies, fetchCurrencyRates]);

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
      setSearching(false);
      const defaultCities = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi"];
      fetchWeatherForCities(defaultCities);
      return;
    }

    setSearching(true);
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

  const _onFlightsTextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

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
      <div className={styles.flightsContainer}>
        {/* Success Message */}
        {bookingSuccess && (
          <div className={styles.successMessage}>
            <h3>✅ Booking Confirmed!</h3>
            <p>
              Your flight has been booked successfully. Redirecting to
              dashboard...
            </p>
          </div>
        )}

        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Discover Your Next Flight</h1>
            <p className={styles.heroSubtitle}>
              Search and book flights to your dream destination
            </p>

            {/* Flight Search Form */}
            <div className={styles.searchForm}>
              {searchError && (
                <div className={styles.errorMessage}>{searchError}</div>
              )}

              {/* Trip Type Selection */}
              <div className={styles.tripTypeRow}>
                <label>
                  <input
                    type="radio"
                    value="one_way"
                    checked={tripType === "one_way"}
                    onChange={(e) => setTripType(e.target.value as "one_way")}
                  />
                  One Way
                </label>
                <label>
                  <input
                    type="radio"
                    value="round_trip"
                    checked={tripType === "round_trip"}
                    onChange={(e) =>
                      setTripType(e.target.value as "round_trip")
                    }
                  />
                  Round Trip
                </label>
              </div>

              <div className={styles.formRow}>
                {/* From Airport Search */}
                <div className={styles.inputGroup}>
                  <label>From</label>
                  <div className={styles.airportSearchContainer}>
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
                      style={{
                        borderColor:
                          fromAirport === toAirport && fromAirport
                            ? "#ef4444"
                            : undefined,
                      }}
                      required
                    />
                    {showFromDropdown && (
                      <div className={styles.airportDropdown}>
                        {getFilteredAirports(fromAirportSearch).map(
                          (airport) => (
                            <div
                              key={airport.code}
                              className={styles.airportOption}
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
                              <div className={styles.airportCode}>
                                {airport.code}
                              </div>
                              <div className={styles.airportDetails}>
                                <div className={styles.airportCity}>
                                  {airport.city}
                                </div>
                                <div className={styles.airportName}>
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
                <div className={styles.inputGroup}>
                  <label>To</label>
                  <div className={styles.airportSearchContainer}>
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
                      style={{
                        borderColor:
                          fromAirport === toAirport && toAirport
                            ? "#ef4444"
                            : undefined,
                      }}
                      required
                    />
                    {showToDropdown && (
                      <div className={styles.airportDropdown}>
                        {getFilteredAirports(toAirportSearch).map((airport) => (
                          <div
                            key={airport.code}
                            className={styles.airportOption}
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
                            <div className={styles.airportCode}>
                              {airport.code}
                            </div>
                            <div className={styles.airportDetails}>
                              <div className={styles.airportCity}>
                                {airport.city}
                              </div>
                              <div className={styles.airportName}>
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

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Departure</label>
                  <input
                    type="date"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                {tripType === "round_trip" && (
                  <div className={styles.inputGroup}>
                    <label>Return</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={departure || new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <label>Passengers</label>
                  <select
                    value={passengers}
                    onChange={(e) =>
                      setPassengers(Number.parseInt(e.target.value))
                    }
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Class</label>
                  <select
                    value={bookingClass}
                    onChange={(e) => setBookingClass(e.target.value)}
                  >
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>

              <button
                className={styles.searchButton}
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
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>
              Available Flights ({flights.length} found)
            </h2>
            <div className={styles.flightResults}>
              {flights.map((flight) => (
                <div key={flight.id} className={styles.flightCard}>
                  <div className={styles.flightInfo}>
                    <div className={styles.flightHeader}>
                      <div className={styles.flightRoute}>
                        <span className={styles.flightCity}>
                          {flight.from_airport.city}
                        </span>
                        <span className={styles.flightArrow}>→</span>
                        <span className={styles.flightCity}>
                          {flight.to_airport.city}
                        </span>
                      </div>
                      <div className={styles.flightNumber}>
                        {flight.flight_number}
                      </div>
                      {flight.status !== "scheduled" && (
                        <div
                          className={`${styles.flightStatus} ${
                            styles[flight.status]
                          }`}
                        >
                          {flight.status.toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className={styles.flightDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Airline:</span>
                        <span>{flight.airline.name}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Aircraft:</span>
                        <span>{flight.aircraft.model}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Duration:</span>
                        <span>{flight.duration}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Departure:</span>
                        <span>
                          {new Date(flight.departure_datetime).toLocaleString()}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Arrival:</span>
                        <span>
                          {new Date(flight.arrival_datetime).toLocaleString()}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          Available Seats:
                        </span>
                        <span className={styles.availableSeats}>
                          {flight.available_seats} left
                        </span>
                      </div>

                      {/* Amenities */}
                      <div className={styles.amenities}>
                        {flight.meal_included && (
                          <span className={styles.amenity}>🍽️ Meal</span>
                        )}
                        {flight.wifi_available && (
                          <span className={styles.amenity}>📶 WiFi</span>
                        )}
                        {flight.entertainment_available && (
                          <span className={styles.amenity}>
                            🎬 Entertainment
                          </span>
                        )}
                        {flight.power_outlet_available && (
                          <span className={styles.amenity}>🔌 Power</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.flightPrice}>
                    <div className={styles.priceInfo}>
                      {flight.base_price !== flight.current_price && (
                        <span className={styles.originalPrice}>
                          {flight.currency} {flight.base_price.toLocaleString()}
                        </span>
                      )}
                      <span className={styles.price}>
                        {flight.currency}{" "}
                        {flight.current_price.toLocaleString()}
                      </span>
                      <span className={styles.priceLabel}>per person</span>
                      {passengers > 1 && (
                        <span className={styles.totalPrice}>
                          Total: {flight.currency}{" "}
                          {(flight.current_price * passengers).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      className={styles.bookButton}
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
                        : "Login to Book"}
                    </button>
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
          <div className={styles.errorMessage}>{bookingError}</div>
        )}

        {/* Weather Forecast Section - Unchanged */}
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>
            Real-Time Weather Forecast for Bangladesh
          </h2>

          {/* Fixed Weather Map */}
          <div className={styles.fixedMapContainer}>
            <div className={styles.mapToggle}>
              <button
                className={styles.mapToggleButton}
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? "Hide Map" : "Show Weather Map"}
              </button>
            </div>

            {showMap && (
              <div className={styles.fixedMap}>
                <div className={styles.mapHeader}>
                  <h3>Bangladesh Weather Map</h3>
                  <button
                    className={styles.closeMapButton}
                    onClick={() => setShowMap(false)}
                  >
                    ×
                  </button>
                </div>

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
            )}
          </div>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <form onSubmit={handleSearch} className={styles.searchFormInline}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city..."
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButtonInline}>
                Search
              </button>
            </form>
            {searching && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSearching(false);
                  const defaultCities = [
                    "Dhaka",
                    "Chittagong",
                    "Sylhet",
                    "Rajshahi",
                  ];
                  fetchWeatherForCities(defaultCities);
                }}
                className={styles.resetButton}
              >
                Reset
              </button>
            )}
          </div>

          {isLoadingWeather && (
            <p className={styles.loadingText}>Loading weather...</p>
          )}
          {weatherError && <p className={styles.errorText}>{weatherError}</p>}

          <div className={styles.weatherGrid}>
            {weatherData.map((weather, idx) => (
              <div key={idx} className={styles.weatherCard}>
                <h2>{weather.city}</h2>
                <div className={styles.temperature}>
                  {Math.round(weather.temperature)}°C
                </div>
                <div className={styles.condition}>
                  {weather.condition}
                  <span className={styles.description}>
                    ({weather.description})
                  </span>
                </div>
                <div>Humidity: {weather.humidity}%</div>
                <div>Wind: {weather.windSpeed} km/h</div>
              </div>
            ))}
          </div>
        </div>

        {/* Currency Exchange Section - Unchanged */}
        <div className={styles.currencySection}>
          <h2 className={styles.currencyTitle}>
            Real-Time Currency Exchange Rates
          </h2>

          {/* Currency Search Bar */}
          <div className={styles.currencySearchContainer}>
            <form
              onSubmit={handleCurrencySearch}
              className={styles.currencySearchForm}
            >
              <input
                type="text"
                value={currencySearch}
                onChange={(e) => setCurrencySearch(e.target.value)}
                placeholder="Search currency code (e.g. GBP, INR, AUD)"
                className={styles.currencySearchInput}
              />
              <button type="submit" className={styles.currencySearchButton}>
                Search
              </button>
              {activeCurrencies.length > 3 && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrencySearch("");
                    setActiveCurrencies(["EUR", "USD", "CAD"]);
                  }}
                  className={styles.resetButton}
                >
                  Reset
                </button>
              )}
            </form>
          </div>

          {currencyLoading && (
            <div className={styles.currencyLoading}>
              Loading currency rates...
            </div>
          )}
          {currencyError && (
            <div className={styles.currencyError}>{currencyError}</div>
          )}

          {currencyRates.length > 0 && (
            <div className={styles.currencyContent}>
              <div className={styles.currencyRatesSection}>
                <table className={styles.currencyTable}>
                  <thead>
                    <tr>
                      <th>Currency</th>
                      <th>Rate (BDT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currencyRates.map((row) => (
                      <tr key={row.currency}>
                        <td>{row.currency}</td>
                        <td>{(1 / Number(row.rate)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!currencyLoading && !currencyError && currencyRates.length === 0 && (
            <p className={styles.currencyError}>No currency data available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Flights;
