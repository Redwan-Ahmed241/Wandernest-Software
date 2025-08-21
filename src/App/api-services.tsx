// Flight search API service
export interface FlightSearchParams {
  from: string
  to: string
  departure: string
  passengers: number
}

export interface Flight {
  id: string
  airline: string
  from: string
  to: string
  departure: string
  arrival: string
  duration: string
  price: number
  currency: string
}

export interface WeatherData {
  city: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
}

export interface CurrencyRate {
  currency: string
  rate: number
  change: number
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
export const searchFlights = async (params: FlightSearchParams): Promise<Flight[]> => {
  try {
    const response = await fetch("https://wander-nest-ad3s.onrender.com/api/flights/", {
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
    })

    if (!response.ok) {
      throw new Error("Failed to search flights")
    }

    const data = await response.json()
    return data.flights || []
  } catch (error) {
    console.error("Flight search error:", error)
    throw error
  }
}

// Weather API function
export const getWeatherData = async (): Promise<WeatherData[]> => {
  try {
    const response = await fetch("https://wander-nest-ad3s.onrender.com/api/weather/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const data = await response.json()
    return data.weather || []
  } catch (error) {
    console.error("Weather fetch error:", error)
    // Return fallback data
    return [
      { city: "Dhaka", temperature: 32, condition: "Partly Cloudy", humidity: 65, windSpeed: 8 },
      { city: "Chittagong", temperature: 30, condition: "Sunny", humidity: 70, windSpeed: 10 },
      { city: "Sylhet", temperature: 28, condition: "Rainy", humidity: 85, windSpeed: 12 },
    ]
  }
}

// Currency exchange API function
export const getCurrencyRates = async (): Promise<CurrencyRate[]> => {
  try {
    const response = await fetch("https://wander-nest-ad3s.onrender.com/api/currency/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch currency rates")
    }

    const data = await response.json()
    return data.rates || []
  } catch (error) {
    console.error("Currency fetch error:", error)
    // Return fallback data
    return [
      { currency: "USD", rate: 109.5, change: 0.05 },
      { currency: "EUR", rate: 118.75, change: -0.12 },
      { currency: "GBP", rate: 138.2, change: 0.08 },
      { currency: "INR", rate: 1.31, change: 0.02 },
      { currency: "AED", rate: 29.82, change: -0.03 },
    ]
  }
}

// Destinations API function
export const getDestinations = async () => {
  try {
    const response = await fetch("https://wander-nest-ad3s.onrender.com/api/home/destinations/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      throw new Error("Failed to fetch destinations")
    }
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Destinations fetch error:", error)
    return []
  }
}

export const getHotels = async (): Promise<Hotel[]> => {
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
    return hotelsData.map((hotel: any) => ({
      id: hotel.id || hotel._id || "unknown-id",
      name: hotel.name || "Unknown Hotel",
      description: hotel.description || "No description available",
      location: hotel.location || "Unknown Location",
      image_url: hotel.image_url && hotel.image_url.startsWith('http')
        ? hotel.image_url
        : hotel.image_url
          ? `https://wander-nest-ad3s.onrender.com${hotel.image_url}`
          : hotel.image && hotel.image.startsWith('http')
            ? hotel.image
            : hotel.image
              ? `https://wander-nest-ad3s.onrender.com${hotel.image}`
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
}
