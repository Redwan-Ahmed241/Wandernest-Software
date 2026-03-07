/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_BASE, EXPRESS_API_BASE } from "../config/api";

// Flight search API service
export interface FlightSearchParams {
  from: string;
  to: string;
  departure: string;
  passengers: number;
}

export interface Flight {
  id: string;
  airline: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  currency: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export interface CurrencyRate {
  currency: string;
  rate: number;
  change: number;
}

export interface Hotel {
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

// Flight search function
export const searchFlights = async (
  params: FlightSearchParams,
): Promise<Flight[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/flights/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // If auth required
      },
      body: JSON.stringify({
        origin: params.from,
        destination: params.to,
        departure_date: params.departure,
        passengers: params.passengers,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to search flights");
    }

    const data = await response.json();
    return data.flights || [];
  } catch (error) {
    console.error("Flight search error:", error);
    throw error;
  }
};

// Weather API function
export const getWeatherData = async (): Promise<WeatherData[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/weather/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();
    return data.weather || [];
  } catch (error) {
    console.error("Weather fetch error:", error);
    // Return fallback data
    return [
      {
        city: "Dhaka",
        temperature: 32,
        condition: "Partly Cloudy",
        humidity: 65,
        windSpeed: 8,
      },
      {
        city: "Chittagong",
        temperature: 30,
        condition: "Sunny",
        humidity: 70,
        windSpeed: 10,
      },
      {
        city: "Sylhet",
        temperature: 28,
        condition: "Rainy",
        humidity: 85,
        windSpeed: 12,
      },
    ];
  }
};

// Currency exchange API function
export const getCurrencyRates = async (): Promise<CurrencyRate[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/currency/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch currency rates");
    }

    const data = await response.json();
    return data.rates || [];
  } catch (error) {
    console.error("Currency fetch error:", error);
    // Return fallback data
    return [
      { currency: "USD", rate: 109.5, change: 0.05 },
      { currency: "EUR", rate: 118.75, change: -0.12 },
      { currency: "GBP", rate: 138.2, change: 0.08 },
      { currency: "INR", rate: 1.31, change: 0.02 },
      { currency: "AED", rate: 29.82, change: -0.03 },
    ];
  }
};

// Destinations API function
export const getDestinations = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/home/destinations/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch destinations");
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Destinations fetch error:", error);
    return [];
  }
};

// Get single destination by ID
export const getDestinationById = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE}/api/home/destinations/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch destination details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Destination details fetch error:", error);
    throw error;
  }
};

// Transport API functions
export interface TransportOption {
  id: number;
  type: string;
  name: string;
  route: string;
  from_location?: string;
  to_location?: string;
  frequency: string;
  price: string | number;
  image?: string;
  image_url?: string;
  features: string[];
  operator?: string;
  availability?: boolean;
  rating?: number;
}

export const getTransportOptions = async (
  params: any = {},
): Promise<TransportOption[]> => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${EXPRESS_API_BASE}/api/transport/options${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) throw new Error("Failed to fetch transport options");
    const data = await response.json();

    // Handle different response structures
    let transportData = [];
    if (data.success && data.data) {
      transportData = data.data.transports || data.data.options || data.data;
    } else if (Array.isArray(data)) {
      transportData = data;
    } else if (data.results) {
      transportData = data.results;
    }

    return Array.isArray(transportData) ? transportData : [];
  } catch (error) {
    console.error("Transport fetch error:", error);
    return [];
  }
};

export const getTransportById = async (
  id: number,
): Promise<TransportOption | null> => {
  try {
    const response = await fetch(
      `${EXPRESS_API_BASE}/api/transport/options/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) throw new Error("Failed to fetch transport details");
    const data = await response.json();
    return data.success ? data.data : data;
  } catch (error) {
    console.error("Transport details fetch error:", error);
    return null;
  }
};

export const getHotels = async (
  destination?: string | number,
): Promise<Hotel[]> => {
  try {
    const url = destination
      ? `${API_BASE}/api/hotels/?destination=${destination}`
      : `${API_BASE}/api/hotels/`;

    const response = await fetch(url);
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
    return hotelsData.map((hotel: any) => ({
      id: hotel.id || hotel._id || "unknown-id",
      name: hotel.name || "Unknown Hotel",
      description: hotel.description || "No description available",
      location: hotel.location || "Unknown Location",
      image_url:
        hotel.image_url && hotel.image_url.startsWith("http")
          ? hotel.image_url
          : hotel.image_url
            ? `${API_BASE}${hotel.image_url}`
            : hotel.image && hotel.image.startsWith("http")
              ? hotel.image
              : hotel.image
                ? `${API_BASE}${hotel.image}`
                : "/placeholder.svg?height=200&width=300",
      price: parseFloat(hotel.price) || 0,
      star: hotel.star || 0,
      amenities: hotel.amenities || [],
      roomTypes: hotel.roomTypes || (hotel.type ? [hotel.type] : []),
    }));
  } catch (error) {
    console.error("Hotel fetch error:", error);
    return [];
  }
};

// Restaurant interface and API function (from API documentation)
export interface Restaurant {
  id: number;
  name: string;
  location: string;
  destination: number;
  image_url: string;
  rating: string;
  cuisine: string;
  price: number;
  tags: string[];
}

export const getRestaurants = async (
  destination?: string | number,
): Promise<Restaurant[]> => {
  try {
    const url = destination
      ? `${API_BASE}/api/restaurants/?destination=${destination}`
      : `${API_BASE}/api/restaurants/`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch restaurants");

    const data = await response.json();
    let restaurantData = [];
    if (Array.isArray(data)) {
      restaurantData = data;
    } else if (Array.isArray(data?.results)) {
      restaurantData = data.results;
    } else if (Array.isArray(data?.data)) {
      restaurantData = data.data;
    } else {
      throw new Error("Unexpected response structure");
    }

    return restaurantData;
  } catch (error) {
    console.error("Restaurant fetch error:", error);
    return [];
  }
};

// Trip interface and API function (from API documentation)
export interface Trip {
  id: string;
  title: string;
  location: string;
  destination: number;
  start_date: string;
  end_date: string;
  status: string;
  duration: string;
  activities_count: number;
  price: string;
  travelers: number;
}

export const getTrips = async (
  destination?: string | number,
): Promise<Trip[]> => {
  try {
    const url = destination
      ? `${API_BASE}/api/trips/?destination=${destination}`
      : `${API_BASE}/api/trips/`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch trips");

    const data = await response.json();
    let tripData = [];
    if (Array.isArray(data)) {
      tripData = data;
    } else if (Array.isArray(data?.results)) {
      tripData = data.results;
    } else if (Array.isArray(data?.data)) {
      tripData = data.data;
    } else {
      throw new Error("Unexpected response structure");
    }

    return tripData;
  } catch (error) {
    console.error("Trip fetch error:", error);
    return [];
  }
};
