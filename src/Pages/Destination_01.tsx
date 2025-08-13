"use client"

import { type FunctionComponent, useState, useEffect } from "react"
import Layout from "../App/Layout"
import { useNavigate, useParams } from "react-router-dom"

// API Base URL
const API_BASE_URL = "https://wander-nest-ad3s.onrender.com/api"

// Interfaces for API responses
interface DestinationData {
  id: string
  name: string
  subtitle: string
  description: string
  location: string
  coordinates: string
  bestTime: string
  currency: string
  language: string
  image: string
  heroImage: string
}

interface WeatherData {
  current: {
    temperature: number
    condition: string
    humidity: string
    windSpeed: string
  }
  forecast: Array<{
    day: string
    temp: number
    condition: string
  }>
}

interface Attraction {
  id: number
  name: string
  description: string
  image: string
  rating: number
  reviews: number
  category: string
}

interface Experience {
  id: number
  name: string
  description: string
  image: string
  duration: string
  price: string
  rating: number
  reviews: number
}

const DestinationPage: FunctionComponent = () => {
  const navigate = useNavigate()
  const { destinationId } = useParams<{ destinationId: string }>()
  const [activeTab, setActiveTab] = useState("overview")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // State for API data
  const [destinationData, setDestinationData] = useState<DestinationData | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])

  // Fetch destination data
  useEffect(() => {
    const fetchDestinationData = async () => {
      if (!destinationId) {
        setError("Destination ID is required")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Fetch destination details
        const destinationResponse = await fetch(`${API_BASE_URL}/destinations/${destinationId}/`)
        if (!destinationResponse.ok) {
          throw new Error("Failed to fetch destination data")
        }
        const destinationResult = await destinationResponse.json()
        setDestinationData(destinationResult)

        // Fetch weather data
        const weatherResponse = await fetch(`${API_BASE_URL}/destinations/${destinationId}/weather/`)
        if (weatherResponse.ok) {
          const weatherResult = await weatherResponse.json()
          setWeatherData(weatherResult)
        }

        // Fetch attractions
        const attractionsResponse = await fetch(`${API_BASE_URL}/destinations/${destinationId}/attractions/`)
        if (attractionsResponse.ok) {
          const attractionsResult = await attractionsResponse.json()
          setAttractions(attractionsResult.results || attractionsResult)
        }

        // Fetch experiences
        const experiencesResponse = await fetch(`${API_BASE_URL}/destinations/${destinationId}/experiences/`)
        if (experiencesResponse.ok) {
          const experiencesResult = await experiencesResponse.json()
          setExperiences(experiencesResult.results || experiencesResult)
        }
      } catch (err: any) {
        setError(err.message || "Failed to load destination data")
        console.error("Error fetching destination data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDestinationData()
  }, [destinationId])

  // Payment handler for experiences
  const handleExperiencePayment = async (experience: Experience) => {
    setError(null)
    setIsProcessing(true)
    try {
      // Parse price (remove currency symbol if present)
      const amount =
        typeof experience.price === "string"
          ? Number.parseFloat(experience.price.replace(/[^\d.]/g, "")) || 0
          : Number(experience.price) || 0

      // Prepare payment data
      const paymentData = {
        service_type: "experience",
        service_name: experience.name,
        service_details: experience.description,
        amount,
        customer_name: "Guest", // Or get from user context
        customer_email: "guest@example.com",
        customer_phone: "0000000000",
        service_data: JSON.stringify({
          experience_id: experience.id,
          experience_name: experience.name,
          duration: experience.duration,
          destination_id: destinationId,
        }),
      }

      const response = await fetch(`${API_BASE_URL}/initiate-payment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.detail || data.message || `Payment failed with status ${response.status}`)
      }

      if (data.status === "SUCCESS" && data.GatewayPageURL) {
        window.location.href = data.GatewayPageURL
      } else {
        setError(data.detail || "Payment initialization failed. Please try again.")
      }
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.")
      console.error("Payment error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p>Loading destination...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Error state
  if (error && !destinationData) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2>Error Loading Destination</h2>
            <p>{error}</p>
            <button onClick={() => navigate("/destinations")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Back to Destinations
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  // No destination data
  if (!destinationData) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2>Destination Not Found</h2>
            <p>The requested destination could not be found.</p>
            <button onClick={() => navigate("/destinations")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Back to Destinations
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="relative w-full h-full max-w-6xl mx-auto box-border px-4">
            <img src={destinationData.heroImage || "/placeholder.svg"} alt={destinationData.name} />
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-none flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-5">
                <h1 className="text-4xl md:text-6xl font-extrabold my-0 mb-4 tracking-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">{destinationData.name}</h1>
                <p className="text-xl md:text-2xl font-semibold my-0 mb-4 opacity-90">{destinationData.subtitle}</p>
                <p className="text-lg leading-7 my-0 mb-8 opacity-80">{destinationData.description}</p>
                <div className="flex justify-center gap-8 flex-wrap">
                  <div className="flex items-center gap-2 bg-white/10 py-3 px-5 rounded-3xl backdrop-blur-sm">
                    <span className="text-xl">📍</span>
                    <span className="font-medium text-sm">{destinationData.location}</span>
                  </div>
                  {weatherData && (
                    <div className="flex items-center gap-2 bg-white/10 py-3 px-5 rounded-3xl backdrop-blur-sm">
                      <span className="text-xl">🌤️</span>
                      <span className="font-medium text-sm">{weatherData.current.temperature}°C</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-white/10 py-3 px-5 rounded-3xl backdrop-blur-sm">
                    <span className="text-xl">💰</span>
                    <span className="font-medium text-sm">{destinationData.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-2 py-6 px-5 bg-white border-b border-gray-200 sticky top-0 z-10">
          <button
            className={`py-3 px-6 border-none bg-transparent rounded-3xl text-base font-medium text-gray-600 cursor-pointer border-b-3 border-transparent transition-all duration-300 ease-out hover:bg-gray-100 hover:text-gray-800 ${activeTab === "overview" ? "bg-green-600 text-white" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`py-3 px-6 border-none bg-transparent rounded-3xl text-base font-medium text-gray-600 cursor-pointer border-b-3 border-transparent transition-all duration-300 ease-out hover:bg-gray-100 hover:text-gray-800 ${activeTab === "attractions" ? "bg-green-600 text-white" : ""}`}
            onClick={() => setActiveTab("attractions")}
          >
            Attractions
          </button>
          <button
            className={`py-3 px-6 border-none bg-transparent rounded-3xl text-base font-medium text-gray-600 cursor-pointer border-b-3 border-transparent transition-all duration-300 ease-out hover:bg-gray-100 hover:text-gray-800 ${activeTab === "experiences" ? "bg-green-600 text-white" : ""}`}
            onClick={() => setActiveTab("experiences")}
          >
            Experiences
          </button>
          {weatherData && (
            <button
              className={`py-3 px-6 border-none bg-transparent rounded-3xl text-base font-medium text-gray-600 cursor-pointer border-b-3 border-transparent transition-all duration-300 ease-out hover:bg-gray-100 hover:text-gray-800 ${activeTab === "weather" ? "bg-green-600 text-white" : ""}`}
              onClick={() => setActiveTab("weather")}
            >
              Weather
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto py-10 px-5">
          {activeTab === "overview" && (
            <div className="flex flex-col gap-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl transition-all duration-300 ease-out hover:bg-gray-200 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                  <div className="text-3xl">📍</div>
                  <h3>Location</h3>
                  <p>{destinationData.location}</p>
                  <small>{destinationData.coordinates}</small>
                </div>
                <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl transition-all duration-300 ease-out hover:bg-gray-200 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                  <div className="text-3xl">🌤️</div>
                  <h3>Best Time to Visit</h3>
                  <p>{destinationData.bestTime}</p>
                  <small>Peak season</small>
                </div>
                <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl transition-all duration-300 ease-out hover:bg-gray-200 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                  <div className="text-3xl">💰</div>
                  <h3>Currency</h3>
                  <p>{destinationData.currency}</p>
                  <small>Local currency</small>
                </div>
                <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl transition-all duration-300 ease-out hover:bg-gray-200 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                  <div className="text-3xl">🗣️</div>
                  <h3>Language</h3>
                  <p>{destinationData.language}</p>
                  <small>Primary languages</small>
                </div>
              </div>

              {weatherData && (
                <div className="bg-white p-8 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                  <h2>Current Weather</h2>
                  <div className="flex items-center justify-between gap-8">
                    <div className="flex flex-col items-center">
                      <span className="text-5xl font-bold text-gray-800">{weatherData.current.temperature}°C</span>
                      <span className="text-xl text-gray-600 mt-2">{weatherData.current.condition}</span>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <span>Humidity</span>
                        <span>{weatherData.current.humidity}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <span>Wind</span>
                        <span>{weatherData.current.windSpeed}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "attractions" && (
            <div>
              <h2>Top Attractions in {destinationData.name}</h2>
              {attractions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {attractions.map((attraction) => (
                    <div key={attraction.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]">
                      <div className="relative h-50 overflow-hidden">
                        <img src={attraction.image || "/placeholder.svg"} alt={attraction.name} />
                        <div className="absolute top-3 right-3 bg-black/70 text-white py-1 px-3 rounded-xl text-xs font-medium">{attraction.category}</div>
                      </div>
                      <div className="p-5">
                        <h3>{attraction.name}</h3>
                        <p>{attraction.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 text-base">{"★".repeat(Math.floor(attraction.rating))}</span>
                          <span className="text-sm text-gray-600">
                            {attraction.rating} ({attraction.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No attractions available for this destination.</p>
              )}
            </div>
          )}

          {activeTab === "experiences" && (
            <div>
              <h2>Experience {destinationData.name}</h2>
              {experiences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {experiences.map((experience) => (
                    <div key={experience.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]">
                      <div className="relative h-50 overflow-hidden">
                        <img src={experience.image || "/placeholder.svg"} alt={experience.name} />
                        <div className="absolute top-3 right-3 bg-green-600 text-white py-1.5 px-3 rounded-xl font-semibold text-sm">{experience.price}</div>
                      </div>
                      <div className="p-5">
                        <h3>{experience.name}</h3>
                        <p>{experience.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-600 font-medium">⏱️ {experience.duration}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-base">{"★".repeat(Math.floor(experience.rating))}</span>
                            <span className="text-sm text-gray-600">
                              {experience.rating} ({experience.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        <button
                          className="w-full bg-green-600 text-white border-none py-3 rounded-lg font-semibold text-sm cursor-pointer transition-colors duration-300 hover:bg-green-700"
                          onClick={() => handleExperiencePayment(experience)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Book Now"}
                        </button>
                        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mt-3 text-center">{error}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No experiences available for this destination.</p>
              )}
            </div>
          )}

          {activeTab === "weather" && weatherData && (
            <div>
              <h2>Weather in {destinationData.name}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                  <h3>Current Weather</h3>
                  <div className="flex flex-col gap-6">
                    <div className="text-center">
                      <span className="text-6xl font-bold text-gray-800 block">{weatherData.current.temperature}°C</span>
                      <span className="text-2xl text-gray-600 mt-2">{weatherData.current.condition}</span>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <span>Humidity</span>
                        <span>{weatherData.current.humidity}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <span>Wind Speed</span>
                        <span>{weatherData.current.windSpeed}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                  <h3>7-Day Forecast</h3>
                  <div className="grid grid-cols-7 gap-3">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="flex flex-col items-center gap-2 py-4 px-2 rounded-xl bg-gray-50 transition-colors duration-300 hover:bg-gray-200">
                        <span className="text-sm font-semibold text-gray-800">{day.day}</span>
                        <span className="text-2xl">{day.condition}</span>
                        <span className="text-base font-semibold text-gray-800">{day.temp}°</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default DestinationPage
