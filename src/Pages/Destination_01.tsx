"use client"

import { type FunctionComponent, useState, useEffect } from "react"
import styles from "../Styles/Destination01.module.css"
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
        <div className={styles.destinationPage}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
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
        <div className={styles.destinationPage}>
          <div className={styles.errorContainer}>
            <h2>Error Loading Destination</h2>
            <p>{error}</p>
            <button onClick={() => navigate("/destinations")} className={styles.backButton}>
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
        <div className={styles.destinationPage}>
          <div className={styles.errorContainer}>
            <h2>Destination Not Found</h2>
            <p>The requested destination could not be found.</p>
            <button onClick={() => navigate("/destinations")} className={styles.backButton}>
              Back to Destinations
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className={styles.destinationPage}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroImage}>
            <img src={destinationData.heroImage || "/placeholder.svg"} alt={destinationData.name} />
            <div className={styles.heroOverlay}>
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>{destinationData.name}</h1>
                <p className={styles.heroSubtitle}>{destinationData.subtitle}</p>
                <p className={styles.heroDescription}>{destinationData.description}</p>
                <div className={styles.heroStats}>
                  <div className={styles.stat}>
                    <span className={styles.statIcon}>📍</span>
                    <span className={styles.statText}>{destinationData.location}</span>
                  </div>
                  {weatherData && (
                    <div className={styles.stat}>
                      <span className={styles.statIcon}>🌤️</span>
                      <span className={styles.statText}>{weatherData.current.temperature}°C</span>
                    </div>
                  )}
                  <div className={styles.stat}>
                    <span className={styles.statIcon}>💰</span>
                    <span className={styles.statText}>{destinationData.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${activeTab === "overview" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`${styles.tab} ${activeTab === "attractions" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("attractions")}
          >
            Attractions
          </button>
          <button
            className={`${styles.tab} ${activeTab === "experiences" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("experiences")}
          >
            Experiences
          </button>
          {weatherData && (
            <button
              className={`${styles.tab} ${activeTab === "weather" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("weather")}
            >
              Weather
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          {activeTab === "overview" && (
            <div className={styles.overviewSection}>
              <div className={styles.overviewGrid}>
                <div className={styles.overviewCard}>
                  <div className={styles.cardIcon}>📍</div>
                  <h3>Location</h3>
                  <p>{destinationData.location}</p>
                  <small>{destinationData.coordinates}</small>
                </div>
                <div className={styles.overviewCard}>
                  <div className={styles.cardIcon}>🌤️</div>
                  <h3>Best Time to Visit</h3>
                  <p>{destinationData.bestTime}</p>
                  <small>Peak season</small>
                </div>
                <div className={styles.overviewCard}>
                  <div className={styles.cardIcon}>💰</div>
                  <h3>Currency</h3>
                  <p>{destinationData.currency}</p>
                  <small>Local currency</small>
                </div>
                <div className={styles.overviewCard}>
                  <div className={styles.cardIcon}>🗣️</div>
                  <h3>Language</h3>
                  <p>{destinationData.language}</p>
                  <small>Primary languages</small>
                </div>
              </div>

              {weatherData && (
                <div className={styles.weatherPreview}>
                  <h2>Current Weather</h2>
                  <div className={styles.currentWeather}>
                    <div className={styles.weatherMain}>
                      <span className={styles.temperature}>{weatherData.current.temperature}°C</span>
                      <span className={styles.condition}>{weatherData.current.condition}</span>
                    </div>
                    <div className={styles.weatherDetails}>
                      <div className={styles.weatherDetail}>
                        <span>Humidity</span>
                        <span>{weatherData.current.humidity}</span>
                      </div>
                      <div className={styles.weatherDetail}>
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
            <div className={styles.attractionsSection}>
              <h2>Top Attractions in {destinationData.name}</h2>
              {attractions.length > 0 ? (
                <div className={styles.attractionsGrid}>
                  {attractions.map((attraction) => (
                    <div key={attraction.id} className={styles.attractionCard}>
                      <div className={styles.attractionImage}>
                        <img src={attraction.image || "/placeholder.svg"} alt={attraction.name} />
                        <div className={styles.attractionCategory}>{attraction.category}</div>
                      </div>
                      <div className={styles.attractionContent}>
                        <h3>{attraction.name}</h3>
                        <p>{attraction.description}</p>
                        <div className={styles.attractionRating}>
                          <span className={styles.stars}>{"★".repeat(Math.floor(attraction.rating))}</span>
                          <span className={styles.ratingText}>
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
            <div className={styles.experiencesSection}>
              <h2>Experience {destinationData.name}</h2>
              {experiences.length > 0 ? (
                <div className={styles.experiencesGrid}>
                  {experiences.map((experience) => (
                    <div key={experience.id} className={styles.experienceCard}>
                      <div className={styles.experienceImage}>
                        <img src={experience.image || "/placeholder.svg"} alt={experience.name} />
                        <div className={styles.experiencePrice}>{experience.price}</div>
                      </div>
                      <div className={styles.experienceContent}>
                        <h3>{experience.name}</h3>
                        <p>{experience.description}</p>
                        <div className={styles.experienceDetails}>
                          <span className={styles.duration}>⏱️ {experience.duration}</span>
                          <div className={styles.experienceRating}>
                            <span className={styles.stars}>{"★".repeat(Math.floor(experience.rating))}</span>
                            <span className={styles.ratingText}>
                              {experience.rating} ({experience.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        <button
                          className={styles.bookButton}
                          onClick={() => handleExperiencePayment(experience)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Book Now"}
                        </button>
                        {error && <div className={styles.errorMessage}>{error}</div>}
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
            <div className={styles.weatherSection}>
              <h2>Weather in {destinationData.name}</h2>
              <div className={styles.weatherContainer}>
                <div className={styles.currentWeatherCard}>
                  <h3>Current Weather</h3>
                  <div className={styles.currentWeatherDisplay}>
                    <div className={styles.temperatureDisplay}>
                      <span className={styles.temperatureLarge}>{weatherData.current.temperature}°C</span>
                      <span className={styles.conditionLarge}>{weatherData.current.condition}</span>
                    </div>
                    <div className={styles.weatherInfo}>
                      <div className={styles.weatherInfoItem}>
                        <span>Humidity</span>
                        <span>{weatherData.current.humidity}</span>
                      </div>
                      <div className={styles.weatherInfoItem}>
                        <span>Wind Speed</span>
                        <span>{weatherData.current.windSpeed}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.forecastCard}>
                  <h3>7-Day Forecast</h3>
                  <div className={styles.forecastGrid}>
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className={styles.forecastDay}>
                        <span className={styles.forecastDayName}>{day.day}</span>
                        <span className={styles.forecastIcon}>{day.condition}</span>
                        <span className={styles.forecastTemp}>{day.temp}°</span>
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
