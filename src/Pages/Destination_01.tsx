/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { type FunctionComponent, useState, useEffect } from "react";
// Tailwind conversion: removed CSS module import
import Layout from "../components/layout";
import { useNavigate, useParams } from "react-router-dom";

// API Base URL
const API_BASE_URL = "https://wander-nest-ad3s.onrender.com";

// OpenWeatherMap API configuration
const OPENWEATHER_API_KEY = "bd5e378503939ddaee76f12ad7a97608"; // You should move this to environment variables
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

// Interfaces for API responses
interface DestinationData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  location: string;
  coordinates: string;
  bestTime: string;
  currency: string;
  language: string;
  image: string;
  heroImage: string;
}

interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    humidity: string;
    windSpeed: string;
    icon: string;
  };
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
    icon: string;
  }>;
}

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

interface Package {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  package_type: 'premade' | 'custom';
  from_location: string;
  to_location: string;
  destination: number;
  destination_name: string;
  start_date?: string;
  end_date?: string;
  days?: number;
  travelers_count?: number;
  budget?: string;
  total_cost?: string;
  price?: string;
  status: string;
  created_at: string;
  transport?: {
    id: number;
    name: string;
    price: string;
    type: string;
    capacity?: number;
    features?: string[];
  };
  hotel?: {
    id: number;
    name: string;
    price: string;
    rating: string;
    amenities?: string[];
  };
  guide?: {
    id: number;
    name: string;
    price: string;
  } | null;
  preferences?: Record<string, any>;
}

// Helper function to parse coordinates
const parseCoordinates = (coordString: string): { lat: number; lon: number } | null => {
  if (!coordString) return null;
  
  // Parse formats like "21.4272° N, 92.0058° E" or "21.4272, 92.0058"
  const coords = coordString.replace(/[°NSEW\s]/g, '').split(',');
  if (coords.length === 2) {
    const lat = parseFloat(coords[0].trim());
    const lon = parseFloat(coords[1].trim());
    if (!isNaN(lat) && !isNaN(lon)) {
      return { lat, lon };
    }
  }
  return null;
};

// Helper function to get weather icon URL
const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

const DestinationPage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { destinationId, destinationName } = useParams<{
    destinationId: string;
    destinationName: string;
  }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // State for API data
  const [destinationData, setDestinationData] =
    useState<DestinationData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);

  // Function to fetch weather data from OpenWeatherMap
  const fetchWeatherData = async (cityName: string, coordinates: string) => {
    try {
      let weatherUrl = '';
      
      // Try to use coordinates first for better accuracy
      const coords = parseCoordinates(coordinates);
      if (coords) {
        weatherUrl = `${OPENWEATHER_BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      } else {
        // Fallback to city name
        weatherUrl = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      }

      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(weatherUrl.replace('/weather?', '/forecast?'))
      ]);

      if (!currentResponse.ok) {
        throw new Error('Failed to fetch current weather');
      }

      const currentWeather = await currentResponse.json();
      const forecastWeather = forecastResponse.ok ? await forecastResponse.json() : null;

      // Transform OpenWeatherMap data to our format
      const weatherData: WeatherData = {
        current: {
          temperature: Math.round(currentWeather.main.temp),
          condition: currentWeather.weather[0].description,
          humidity: `${currentWeather.main.humidity}%`,
          windSpeed: `${currentWeather.wind.speed} m/s`,
          icon: currentWeather.weather[0].icon,
        },
        forecast: []
      };

      // Process 5-day forecast if available
      if (forecastWeather?.list) {
        const dailyForecasts = forecastWeather.list
          .filter((_: any, index: number) => index % 8 === 0) // Get one forecast per day (every 8th item = 24 hours)
          .slice(0, 7) // Limit to 7 days
          .map((item: any) => ({
            day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
            temp: Math.round(item.main.temp),
            condition: item.weather[0].description,
            icon: item.weather[0].icon,
          }));

        weatherData.forecast = dailyForecasts;
      }

      setWeatherData(weatherData);
      console.log('✅ Weather data fetched from OpenWeatherMap:', weatherData);
    } catch (error) {
      console.error('❌ Failed to fetch weather data:', error);
      setWeatherData(null);
    }
  };

  // Fetch destination data
  useEffect(() => {
    const fetchDestinationData = async () => {
      if (!destinationId) {
        setError("Destination ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching destination with ID:', destinationId);

        // Fetch destination details using the destination ID directly
        const destinationResponse = await fetch(
          `${API_BASE_URL}/api/home/destinations/${destinationId}/`
        );
        if (!destinationResponse.ok) {
          throw new Error("Failed to fetch destination data");
        }
        const destinationResult = await destinationResponse.json();
        console.log('Destination details:', destinationResult);
        
        // Transform the API response to match the component's expected format
        const transformedData = {
          id: destinationResult.id?.toString() || destinationId,
          name: destinationResult.name || "Unknown Destination",
          subtitle: destinationResult.subtitle || destinationResult.description || "",
          description: destinationResult.description || "",
          location: destinationResult.location || "Bangladesh",
          coordinates: destinationResult.coordinates || "",
          bestTime: destinationResult.bestTime || "Year-round",
          currency: destinationResult.currency || "BDT",
          language: destinationResult.language || "Bengali",
          image: destinationResult.image || destinationResult.image_url || "",
          heroImage: destinationResult.heroImage || destinationResult.image_url || "",
        };
        
        setDestinationData(transformedData);

        // Use the mapped detail ID for related data
        // Fetch attractions from the destination details response
        if (destinationResult.attractions && Array.isArray(destinationResult.attractions)) {
          setAttractions(destinationResult.attractions);
        }

        // Fetch experiences from the destination details response (same as attractions)
        if (destinationResult.experiences && Array.isArray(destinationResult.experiences)) {
          setExperiences(destinationResult.experiences);
        }

        // Fetch weather data from OpenWeatherMap API
        try {
          await fetchWeatherData(transformedData.name, transformedData.coordinates);
        } catch (error) {
          console.log('Weather data not available:', error);
        }

        // Fetch packages for this destination
        // According to API docs:
        // - GET /api/packages/?destination={id} for custom packages
        // - GET /api/packages/all/?destination_detail={id} for premade packages
        try {
          setPackagesLoading(true);
          
          console.log(`Fetching packages for destination ID: ${destinationId}`);
          
          // Fetch ALL packages first, then filter client-side for better control
          console.log(`🚀 Fetching packages for destination ID: ${destinationId}`);
          
          const packagesResponse = await fetch(`${API_BASE_URL}/api/packages/unified/`);
          
          let allPackages: any[] = [];

          if (packagesResponse.ok) {
            const packagesResult = await packagesResponse.json();
            console.log('📦 Unified packages API response:', packagesResult);
            console.log('📦 Response type:', typeof packagesResult);
            console.log('📦 Is array:', Array.isArray(packagesResult));
            
            // Handle both direct array and paginated responses
            if (packagesResult && packagesResult.results) {
              allPackages = Array.isArray(packagesResult.results) ? packagesResult.results : [];
              console.log('📦 Using paginated results:', allPackages.length);
            } else {
              allPackages = Array.isArray(packagesResult) ? packagesResult : [];
              console.log('📦 Using direct array:', allPackages.length);
            }
          } else {
            console.error('❌ Unified packages API failed with status:', packagesResponse.status);
          }

          // Filter packages by destination ID (more precise than API query parameter)
          const destinationIdNum = parseInt(destinationId);
          console.log(`🔍 Filtering for destination ID: ${destinationIdNum} (type: ${typeof destinationIdNum})`);
          
          const filteredPackages = allPackages.filter((pkg) => {
            const pkgDestId = pkg.destination;
            console.log(`📋 Package "${pkg.title}" - destination: ${pkgDestId} (type: ${typeof pkgDestId})`);
            
            // Primary filter: exact destination ID match
            const matchesDestination = pkgDestId === destinationIdNum || pkgDestId === destinationId;
            
            // Secondary filter: only show confirmed packages
            const isConfirmed = pkg.status === 'confirmed';
            
            const shouldInclude = matchesDestination && isConfirmed;
            
            if (shouldInclude) {
              console.log(`✅ Including package: ${pkg.title}`);
            }
            
            return shouldInclude;
          });

          console.log(`📊 Total packages from API: ${allPackages.length}`);
          console.log(`📊 Filtered packages for destination ${destinationId}: ${filteredPackages.length}`);
          console.log('📋 Filtered package titles:', filteredPackages.map(p => p.title));
          
          setPackages(filteredPackages);
        } catch (err) {
          console.error('❌ Error fetching packages:', err);
          console.error('❌ Error type:', typeof err);
          console.error('❌ Error message:', err instanceof Error ? err.message : String(err));
          setPackages([]);
        } finally {
          setPackagesLoading(false);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load destination data");
        console.error("Error fetching destination data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationData();
  }, [destinationId]);

  // Update the page title dynamically based on the destination name
  useEffect(() => {
    if (destinationName) {
      document.title = `${destinationName} - Destination Details`;
    }
  }, [destinationName]);

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
    );
  }

  // Error state
  if (error && !destinationData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-theme-bg">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-theme-accent">
              Error Loading Destination
            </h2>
            <p className="text-theme-primary">{error}</p>
            <button
              onClick={() =>
                navigate(`/destinations/${destinationId}/${destinationName}`)
              }
              className="mt-2 px-4 py-2 bg-theme-accent text-white rounded-lg font-semibold shadow hover:bg-theme-accent-dark transition-colors duration-200"
            >
              Back to Destinations
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // No destination data
  if (!destinationData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-theme-bg">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-theme-accent">
              Destination Not Found
            </h2>
            <p className="text-theme-primary">
              The requested destination could not be found.
            </p>
            <button
              onClick={() =>
                navigate(`/destinations/${destinationId}/${destinationName}`)
              }
              className="mt-2 px-4 py-2 bg-theme-accent text-white rounded-lg font-semibold shadow hover:bg-theme-accent-dark transition-colors duration-200"
            >
              Back to Destinations
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-theme-bg">
        {/* Hero Section */}
        <div className="relative w-full h-96 mb-8">
          <img
            src={
              destinationData?.heroImage || 
              destinationData?.image || 
              "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200"
            }
            alt={destinationData?.name || "Destination"}
            className="w-full h-full object-cover rounded-b-2xl"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200";
            }}
          />
          {/* Overlay for text readability, matching homepage/packages */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
          {/* Subtle brand color overlay (optional, matches homepage) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6ab187]/20 via-transparent to-[#4a6b5b]/20"></div>
          <div className="absolute inset-0 flex items-end">
            <div className="p-8 w-full">
              <h1 className="text-4xl font-bold text-white mb-2">
                {destinationData?.name}
              </h1>
              <p className="text-lg text-theme-accent mb-2">
                {destinationData?.subtitle}
              </p>
              <p className="text-white mb-4">{destinationData?.description}</p>
              <div className="flex gap-6 text-white">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{destinationData?.location}</span>
                </div>
                {weatherData && (
                  <div className="flex items-center gap-2">
                    <span>🌤️</span>
                    <span>{weatherData.current.temperature}°C</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>💰</span>
                  <span>{destinationData?.currency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Navigation Tabs */}
        <div className="flex gap-2 justify-center mt-6 mb-8">
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              activeTab === "overview"
                ? "bg-[#6ab187] text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              activeTab === "attractions"
                ? "bg-[#6ab187] text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("attractions")}
          >
            Attractions
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              activeTab === "experiences"
                ? "bg-[#6ab187] text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("experiences")}
          >
            Experiences
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              activeTab === "package"
                ? "bg-[#6ab187] text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("package")}
          >
            Package
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              activeTab === "weather"
                ? "bg-[#6ab187] text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("weather")}
          >
            Weather
          </button>
        </div>
        {/* Content Area */}
        <div className="max-w-6xl mx-auto px-4">
          {activeTab === "overview" && (
            <div className="mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl mb-3">📍</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    Location
                  </h3>
                  <p className="text-gray-700 font-medium mb-1">
                    {destinationData?.location}
                  </p>
                  <small className="text-xs text-gray-500">
                    {destinationData?.coordinates}
                  </small>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl mb-3">🌤️</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    Best Time to Visit
                  </h3>
                  <p className="text-gray-700 font-medium mb-1">
                    {destinationData?.bestTime}
                  </p>
                  <small className="text-xs text-gray-500">Peak season</small>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl mb-3">💰</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    Currency
                  </h3>
                  <p className="text-gray-700 font-medium mb-1">
                    {destinationData?.currency}
                  </p>
                  <small className="text-xs text-gray-500">
                    Local currency
                  </small>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl mb-3">🗣️</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    Language
                  </h3>
                  <p className="text-gray-700 font-medium mb-1">
                    {destinationData?.language}
                  </p>
                  <small className="text-xs text-gray-500">
                    Primary languages
                  </small>
                </div>
              </div>
              {weatherData && (
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                  <h2 className="text-xl font-bold text-theme-primary mb-2">
                    Current Weather
                  </h2>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex flex-col items-center">
                      <img 
                        src={getWeatherIconUrl(weatherData.current.icon)} 
                        alt={weatherData.current.condition}
                        className="w-16 h-16 mb-2"
                      />
                      <span className="text-3xl font-bold text-theme-accent">
                        {weatherData.current.temperature}°C
                      </span>
                      <span className="text-theme-secondary capitalize">
                        {weatherData.current.condition}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <span className="font-semibold">Humidity:</span>
                        <span>{weatherData.current.humidity}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-semibold">Wind:</span>
                        <span>{weatherData.current.windSpeed}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "attractions" && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-theme-primary mb-6">
                Top Attractions in {destinationData?.name}
              </h2>
              {attractions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {attractions.map((attraction) => (
                    <div
                      key={attraction.id}
                      className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="relative">
                        <img
                          src={attraction.image || "/placeholder.svg"}
                          alt={attraction.name}
                          className="w-full h-40 object-cover rounded-lg mb-2"
                        />
                        <div className="absolute top-2 left-2 bg-theme-accent text-white text-xs px-2 py-1 rounded">
                          {attraction.category}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-theme-primary text-lg mb-1">
                          {attraction.name}
                        </h3>
                        <p className="text-theme-secondary mb-2">
                          {attraction.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500">
                            {"★".repeat(Math.floor(attraction.rating))}
                          </span>
                          <span className="text-xs text-gray-500">
                            {attraction.rating} ({attraction.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-theme-secondary">
                  No attractions available for this destination.
                </p>
              )}
            </div>
          )}
          {activeTab === "experiences" && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-theme-primary mb-6">
                Experience {destinationData?.name}
              </h2>
              {experiences.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {experiences.map((experience) => (
                    <div
                      key={experience.id}
                      className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="relative">
                        <img
                          src={experience.image || "/placeholder.svg"}
                          alt={experience.name}
                          className="w-full h-40 object-cover rounded-lg mb-2"
                        />
                        <div className="absolute top-2 left-2 bg-theme-accent text-white text-xs px-2 py-1 rounded">
                          {experience.price}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-theme-primary text-lg mb-1">
                          {experience.name}
                        </h3>
                        <p className="text-theme-secondary mb-2">
                          {experience.description}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs">
                            ⏱️ {experience.duration}
                          </span>
                          <span className="text-yellow-500">
                            {"★".repeat(Math.floor(experience.rating))}
                          </span>
                          <span className="text-xs text-gray-500">
                            {experience.rating} ({experience.reviews} reviews)
                          </span>
                        </div>

                        {error && (
                          <div className="text-red-500 mt-2">{error}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-theme-secondary">
                  No experiences available for this destination.
                </p>
              )}
            </div>
          )}
          {activeTab === "package" && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-theme-primary mb-6">
                Packages for {destinationData?.name}
              </h2>
              {packagesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#6ab187] border-b-4"></div>
                </div>
              ) : packages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                    >
                      <div className="relative h-48">
                        <img
                          src={pkg.image_url || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500"}
                          alt={pkg.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500";
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-md">
                          <span className="text-[#6ab187] font-bold text-sm">
                            {pkg.days || 'Multi'} Days
                          </span>
                        </div>
                        {pkg.package_type && (
                          <div className="absolute top-3 left-3 bg-[#6ab187] px-2 py-1 rounded-full shadow-md">
                            <span className="text-white font-bold text-xs capitalize">
                              {pkg.package_type}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-bold text-gray-900 text-xl mb-2">
                          {pkg.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                          {pkg.subtitle || pkg.description || 'Explore this amazing destination'}
                        </p>
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                          <span>📍</span>
                          <span>{pkg.from_location} → {pkg.to_location}</span>
                        </div>
                        {pkg.hotel?.rating && (
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-yellow-500">
                              {"★".repeat(Math.floor(parseFloat(pkg.hotel.rating)))}
                            </span>
                            <span className="text-xs text-gray-500">
                              Hotel Rating: {pkg.hotel.rating}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Starting from</span>
                            <span className="text-2xl font-bold text-[#6ab187]">
                              ৳{parseFloat(pkg.price || pkg.total_cost || pkg.budget || '0').toLocaleString()}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              navigate(`/confirm-book/${destinationId}/${pkg.id}`, {
                                state: { pkg }
                              });
                            }}
                            className="px-6 py-2 bg-[#6ab187] hover:bg-[#5a9f77] text-white font-semibold rounded-lg transition-colors duration-200"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Packages Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    There are currently no packages available for {destinationData?.name}.
                  </p>
                  <button
                    onClick={() => navigate('/packages')}
                    className="px-6 py-2 bg-[#6ab187] hover:bg-[#5a9f77] text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Browse All Packages
                  </button>
                </div>
              )}
            </div>
          )}
          {activeTab === "weather" && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-theme-primary mb-6">
                Weather in {destinationData?.name}
              </h2>
              {weatherData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
                    <h3 className="font-bold text-theme-primary mb-2">
                      Current Weather
                    </h3>
                    <div className="flex flex-col gap-2 items-center">
                      <img 
                        src={getWeatherIconUrl(weatherData.current.icon)} 
                        alt={weatherData.current.condition}
                        className="w-16 h-16 mb-2"
                      />
                      <span className="text-3xl font-bold text-theme-accent">
                        {weatherData.current.temperature}°C
                      </span>
                      <span className="text-theme-secondary capitalize">
                        {weatherData.current.condition}
                      </span>
                      <div className="flex gap-4 mt-2">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">Humidity</span>
                          <span>{weatherData.current.humidity}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">Wind Speed</span>
                          <span>{weatherData.current.windSpeed}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
                    <h3 className="font-bold text-theme-primary mb-2">
                      7-Day Forecast
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {weatherData.forecast?.map((day, index) => (
                        <div
                          key={index}
                          className="bg-theme-light rounded-lg p-3 flex flex-col items-center"
                        >
                          <span className="font-semibold text-theme-primary">
                            {day.day}
                          </span>
                          <img 
                            src={getWeatherIconUrl(day.icon)} 
                            alt={day.condition}
                            className="w-10 h-10 my-1"
                          />
                          <span className="text-theme-secondary capitalize text-sm text-center">
                            {day.condition}
                          </span>
                          <span className="text-theme-accent font-bold">
                            {day.temp}°
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary mx-auto mb-4"></div>
                      <p className="text-theme-secondary">Loading weather information...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DestinationPage;
