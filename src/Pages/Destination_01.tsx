"use client"

import { type FunctionComponent, useState, useEffect } from "react"
// Tailwind conversion: removed CSS module import
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
        <div className="min-h-screen flex items-center justify-center bg-theme-bg">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-theme-accent border-b-4 border-theme-primary"></div>
            <p className="text-lg text-theme-primary">Loading destination...</p>
          </div>
        </div>
      </Layout>
  <div className="min-h-screen bg-theme-bg">
  }

  // Error state
  if (error && !destinationData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-theme-bg">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-theme-accent">Error Loading Destination</h2>
            <p className="text-theme-primary">{error}</p>
            <button onClick={() => navigate("/destinations")} className="mt-2 px-4 py-2 bg-theme-accent text-white rounded-lg font-semibold shadow hover:bg-theme-accent-dark transition-colors duration-200">
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
        <div className="min-h-screen flex items-center justify-center bg-theme-bg">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-theme-accent">Destination Not Found</h2>
            <p className="text-theme-primary">The requested destination could not be found.</p>
            <button onClick={() => navigate("/destinations")} className="mt-2 px-4 py-2 bg-theme-accent text-white rounded-lg font-semibold shadow hover:bg-theme-accent-dark transition-colors duration-200">
              Back to Destinations
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-theme-bg">
        {/* Hero Section */}
        <div className="relative w-full h-96 mb-8">
          <img src={destinationData.heroImage || "/placeholder.svg"} alt={destinationData.name} className="w-full h-full object-cover rounded-b-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-theme-bg/80 to-transparent flex items-end">
            <div className="p-8 w-full">
              <h1 className="text-4xl font-bold text-white mb-2">{destinationData.name}</h1>
              <p className="text-lg text-theme-accent mb-2">{destinationData.subtitle}</p>
              <p className="text-white mb-4">{destinationData.description}</p>
              <div className="flex gap-6 text-white">
                <div className="flex items-center gap-2"><span>📍</span><span>{destinationData.location}</span></div>
                {weatherData && (
                  <div className="flex items-center gap-2"><span>🌤️</span><span>{weatherData.current.temperature}°C</span></div>
                )}
                <div className="flex items-center gap-2"><span>💰</span><span>{destinationData.currency}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 justify-center mt-6 mb-8">
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeTab === "overview" ? "bg-theme-accent text-white shadow" : "bg-theme-light text-theme-primary hover:bg-theme-accent/10"}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeTab === "attractions" ? "bg-theme-accent text-white shadow" : "bg-theme-light text-theme-primary hover:bg-theme-accent/10"}`}
            onClick={() => setActiveTab("attractions")}
          >
            Attractions
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeTab === "experiences" ? "bg-theme-accent text-white shadow" : "bg-theme-light text-theme-primary hover:bg-theme-accent/10"}`}
            onClick={() => setActiveTab("experiences")}
          >
            Experiences
          </button>
          {weatherData && (
            <button
              className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeTab === "weather" ? "bg-theme-accent text-white shadow" : "bg-theme-light text-theme-primary hover:bg-theme-accent/10"}`}
              onClick={() => setActiveTab("weather")}
            >
              Weather
            </button>
          )}
        </div>

        {/* Content Area */}
  <div className="max-w-6xl mx-auto px-4">
          {activeTab === "overview" && (
            <div className="mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                  <div className="text-3xl mb-2">📍</div>
                  <h3 className="font-bold text-theme-primary mb-1">Location</h3>
                  <p className="text-theme-secondary">{destinationData.location}</p>
                  <small className="text-xs text-gray-400">{destinationData.coordinates}</small>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                  <div className="text-3xl mb-2">🌤️</div>
                  <h3 className="font-bold text-theme-primary mb-1">Best Time to Visit</h3>
                  <p className="text-theme-secondary">{destinationData.bestTime}</p>
                  <small className="text-xs text-gray-400">Peak season</small>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                  <div className="text-3xl mb-2">💰</div>
                  <h3 className="font-bold text-theme-primary mb-1">Currency</h3>
                  <p className="text-theme-secondary">{destinationData.currency}</p>
                  <small className="text-xs text-gray-400">Local currency</small>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                  <div className="text-3xl mb-2">🗣️</div>
                  <h3 className="font-bold text-theme-primary mb-1">Language</h3>
                  <p className="text-theme-secondary">{destinationData.language}</p>
                  <small className="text-xs text-gray-400">Primary languages</small>
                </div>
              </div>

              {weatherData && (
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                  <h2 className="text-xl font-bold text-theme-primary mb-2">Current Weather</h2>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-bold text-theme-accent">{weatherData.current.temperature}°C</span>
                      <span className="text-theme-secondary">{weatherData.current.condition}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2"><span className="font-semibold">Humidity:</span><span>{weatherData.current.humidity}</span></div>
                      <div className="flex gap-2"><span className="font-semibold">Wind:</span><span>{weatherData.current.windSpeed}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "attractions" && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-theme-primary mb-6">Top Attractions in {destinationData?.name}</h2>
              {attractions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {attractions.map((attraction) => (
                    <div key={attraction.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-200">
                      <div className="relative">
                        <img src={attraction.image || "/placeholder.svg"} alt={attraction.name} className="w-full h-40 object-cover rounded-lg mb-2" />
                        <div className="absolute top-2 left-2 bg-theme-accent text-white text-xs px-2 py-1 rounded">{attraction.category}</div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-theme-primary text-lg mb-1">{attraction.name}</h3>
                        <p className="text-theme-secondary mb-2">{attraction.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500">{"★".repeat(Math.floor(attraction.rating))}</span>
                          <span className="text-xs text-gray-500">{attraction.rating} ({attraction.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-theme-secondary">No attractions available for this destination.</p>
              )}
            </div>
          )}

          {activeTab === "experiences" && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-theme-primary mb-6">Experience {destinationData?.name}</h2>
              {experiences.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {experiences.map((experience) => (
                    <div key={experience.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-200">
                      <div className="relative">
                        <img src={experience.image || "/placeholder.svg"} alt={experience.name} className="w-full h-40 object-cover rounded-lg mb-2" />
                        <div className="absolute top-2 left-2 bg-theme-accent text-white text-xs px-2 py-1 rounded">{experience.price}</div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-theme-primary text-lg mb-1">{experience.name}</h3>
                        <p className="text-theme-secondary mb-2">{experience.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs">⏱️ {experience.duration}</span>
                          <span className="text-yellow-500">{"★".repeat(Math.floor(experience.rating))}</span>
                          <span className="text-xs text-gray-500">{experience.rating} ({experience.reviews} reviews)</span>
                        </div>
                        <button
                          className="mt-2 px-4 py-2 bg-theme-accent text-white rounded-lg font-semibold shadow hover:bg-theme-accent-dark transition-colors duration-200"
                          onClick={() => handleExperiencePayment(experience)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Book Now"}
                        </button>
                        {error && <div className="text-red-500 mt-2">{error}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-theme-secondary">No experiences available for this destination.</p>
              )}
            </div>
          )}

          {activeTab === "weather" && weatherData && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-theme-primary mb-6">Weather in {destinationData?.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
                  <h3 className="font-bold text-theme-primary mb-2">Current Weather</h3>
                  <div className="flex flex-col gap-2 items-center">
                    <span className="text-3xl font-bold text-theme-accent">{weatherData.current.temperature}°C</span>
                    <span className="text-theme-secondary">{weatherData.current.condition}</span>
                    <div className="flex gap-4 mt-2">
                      <div className="flex flex-col items-center"><span className="font-semibold">Humidity</span><span>{weatherData.current.humidity}</span></div>
                      <div className="flex flex-col items-center"><span className="font-semibold">Wind Speed</span><span>{weatherData.current.windSpeed}</span></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
                  <h3 className="font-bold text-theme-primary mb-2">7-Day Forecast</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="bg-theme-light rounded-lg p-3 flex flex-col items-center">
                        <span className="font-semibold text-theme-primary">{day.day}</span>
                        <span className="text-theme-secondary">{day.condition}</span>
                        <span className="text-theme-accent font-bold">{day.temp}°</span>
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
