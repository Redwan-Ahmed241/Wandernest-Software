/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  type FunctionComponent,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import OptimizedImage from "../components/optimizedimages";
import { ArrowRight, MapPin, Star, Shield, Clock } from "react-feather";
import { getDestinations } from "../App/api-services";

const HomePage: FunctionComponent = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getDestinations();
      // Sort by clicks (highest first) and take top 6 for featured section
      const sorted = (Array.isArray(data) ? data : [])
        .sort((a, b) => (b.click || 0) - (a.click || 0))
        .slice(0, 6);
      setDestinations(sorted);
    } catch (err: any) {
      setError(err.message || "Error fetching destinations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // Memoize the click handler to prevent unnecessary re-renders
  const incrementDestinationClick = useCallback(async (id: number) => {
    try {
      await fetch(
        `https://wander-nest-ad3s.onrender.com/api/home/destinations/${id}/click/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      // Optionally handle error
    }
  }, []);

  const handleCardClick = useCallback(
    async (dest: any) => {
      await incrementDestinationClick(dest.id);
      navigate(`/destination/${dest.id}`); // Fix navigation to include destination ID
    },
    [incrementDestinationClick, navigate]
  );

  // Memoize static data to prevent unnecessary re-renders
  const services = useMemo(
    () => [
      {
        icon: <Shield className="w-8 h-8" />,
        title: "Visa Assistance",
        description: "Fast and reliable visa processing with expert guidance",
        color: "from-blue-500 to-blue-600",
        path: "/visa-assistance",
      },
      {
        icon: <MapPin className="w-8 h-8" />,
        title: "Travel Planner",
        description: "Customize your perfect trip with our AI-powered planner",
        color: "from-green-500 to-green-600",
        path: "/plan-a-trip",
      },
      {
        icon: <Clock className="w-8 h-8" />,
        title: "24/7 Support",
        description: "Round-the-clock assistance during your travels",
        color: "from-purple-500 to-purple-600",
        path: "/support",
      },
    ],
    []
  );

  const stats = useMemo(
    () => [
      { number: "50K+", label: "Happy Travelers", icon: "👥" },
      { number: "200+", label: "Destinations", icon: "🗺️" },
      { number: "1000+", label: "Hotels", icon: "🏨" },
      { number: "4.9", label: "Average Rating", icon: "⭐" },
    ],
    []
  );

  return (
    <Layout>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background Image - Hero */}
          <div
            className="absolute inset-0 w-full h-full bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: "url('/Figma_photos/2102331.jpg')" }}
          ></div>
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>

          {/* Subtle brand color overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary-dark/30"></div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl md:max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-white drop-shadow-2xl">
              Explore Bangladesh with Wandernest
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-white/90 max-w-xl sm:max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Discover the beauty, culture, and adventure of Bangladesh with our
              expertly crafted travel experiences
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full">
              <button
                onClick={() => navigate("/packages")}
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-white/80 text-black font-semibold text-base sm:text-xl rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-accent border border-gray-200 flex items-center justify-center gap-2 group tracking-wide min-w-[160px] sm:min-w-[200px] mb-3 sm:mb-0"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => navigate("/destinations")}
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 border-2 border-white text-white font-bold text-base sm:text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:text-accent hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent min-w-[160px] sm:min-w-[200px]"
              >
                Explore Destinations
              </button>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="hidden sm:block absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
          <div className="hidden sm:block absolute bottom-20 right-10 w-32 h-32 bg-primary-light/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Featured Destinations
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore Bangladesh's most visited destinations - curated based on traveler interest and popularity
              </p>
            </div>

            {error && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 rounded-2xl overflow-hidden animate-pulse"
                    >
                      <div className="h-64 bg-gray-200"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-6 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))
                : destinations.map((place, index) => (
                    <div
                      key={place.id || index}
                      className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105"
                      onClick={() => handleCardClick(place)}
                    >
                      <div className="relative overflow-hidden">
                        <OptimizedImage
                          src={
                            place.image_url ||
                            "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600"
                          }
                          webpSrc={
                            place.image_url ||
                            "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600&format=webp"
                          }
                          alt={place.name}
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold">4.8</span>
                        </div>
                        {/* Popular badge for high-click destinations */}
                        <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                          <span className="text-xs font-semibold text-white">🔥 Popular</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
                          {place.name}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {place.description ||
                            "Experience the beauty and culture of this amazing destination"}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">Bangladesh</span>
                          </div>
                          <div className="flex items-center gap-1 text-primary font-semibold group-hover:gap-2 transition-all duration-200">
                            <span>Explore</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                        {/* Click count indicator */}
                        {place.click && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>👁️ {place.click.toLocaleString()} views</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
            </div>

            {/* View All Destinations Button */}
            {!loading && destinations.length > 0 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => navigate("/destinations")}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-primary-dark"
                >
                  <span>View All Destinations</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {!loading && destinations.length === 0 && !error && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No destinations found
                </h3>
                <p className="text-gray-600">
                  Check back later for amazing destinations
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Local Amenities & Services Section (from HotelsRooms) */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Local Amenities & Services
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover what's around your hotel
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Local amenities cards */}
              <div
                className="group bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col justify-between h-full min-h-[340px]"
                onClick={() => navigate("/restaurant")}
              >
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    {/* Coffee icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 17a4 4 0 008 0M4 10h16v2a4 4 0 01-4 4H8a4 4 0 01-4-4v-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-200">
                    Local Restaurants
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Discover popular dining spots
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-200 mt-auto">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div
                className="group bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col justify-between h-full min-h-[340px]"
                onClick={() => navigate("/destinations")}
              >
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    {/* MapPin icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 10c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-200">
                    Tourist Attractions
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Explore nearby places of interest
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-200 mt-auto">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div
                className="group bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col justify-between h-full min-h-[340px]"
                onClick={() => navigate("/public-transport")}
              >
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    {/* Truck icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <rect x="3" y="11" width="13" height="6" rx="2" />
                      <rect x="16" y="13" width="5" height="4" rx="1" />
                      <circle cx="7.5" cy="17.5" r="1.5" />
                      <circle cx="18.5" cy="17.5" r="1.5" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-200">
                    Public Transport
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Find transport options
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-200 mt-auto">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div
                className="group bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col justify-between h-full min-h-[340px]"
                onClick={() => navigate("/shopping-centers")}
              >
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    {/* ShoppingBag icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <rect x="6" y="7" width="12" height="13" rx="2" />
                      <path d="M9 7V5a3 3 0 016 0v2" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-200">
                    Shopping Centers
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Shop at the best locations
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-200 mt-auto">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Services Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Services
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need for the perfect travel experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  onClick={() => navigate(service.path)}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                  >
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-200">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What Our Travelers Say
              </h2>
              <p className="text-xl text-gray-600">
                Real experiences from real travelers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Ahmed",
                  location: "Dhaka",
                  rating: 5,
                  comment:
                    "WanderNest made our Cox's Bazar trip absolutely perfect. The attention to detail was incredible!",
                  avatar:
                    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
                },
                {
                  name: "Michael Chen",
                  location: "Singapore",
                  rating: 5,
                  comment:
                    "As a foreign visitor, WanderNest's visa assistance and local guides were invaluable. Highly recommended!",
                  avatar:
                    "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
                },
                {
                  name: "Fatima Rahman",
                  location: "Chittagong",
                  rating: 5,
                  comment:
                    "The Sundarbans tour was a once-in-a-lifetime experience. Professional service from start to finish.",
                  avatar:
                    "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <OptimizedImage
                      src={testimonial.avatar}
                      webpSrc={testimonial.avatar.replace(
                        /\.(jpg|jpeg)$/i,
                        ".webp"
                      )}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover shadow-md"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default HomePage;
