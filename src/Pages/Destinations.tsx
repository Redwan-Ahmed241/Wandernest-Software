/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getDestinations } from "../App/api-services";
import { MapPin, Star, ArrowRight, Search } from "react-feather";

const incrementDestinationClick = async (id: number) => {
  try {
    await fetch(
      `https://wander-nest-ad3s.onrender.com/api/home/destinations/${id}/click/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Failed to increment click:", err);
  }
};

const Destinations: FunctionComponent = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Destinations", icon: "🌍" },
    { id: "beach", label: "Beaches", icon: "🏖️" },
    { id: "mountain", label: "Mountains", icon: "⛰️" },
    { id: "forest", label: "Forests", icon: "🌲" },
    { id: "historical", label: "Historical", icon: "🏛️" },
    { id: "cultural", label: "Cultural", icon: "🎭" },
  ];

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getDestinations();
        setDestinations(Array.isArray(data) ? data : []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch destinations");
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      !searchQuery ||
      dest.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Normalize both category and selectedCategory for robust matching
    const destCategory = (dest.category || "all").toLowerCase();
    const selected = selectedCategory.toLowerCase();
    const matchesCategory =
      selected === "all" ||
      destCategory === selected ||
      destCategory.includes(selected); // allow partial match for flexibility

    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary via-primary-dark to-primary overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1920')",
            }}
          ></div>
          {/* Overlay for text readability, matching homepage/packages */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
          {/* Subtle brand color overlay (optional, matches homepage) */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/20"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Amazing
              <span className="block bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Destinations
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto mb-8">
              From pristine beaches to ancient forests, explore Bangladesh's
              most captivating places
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-accent/30 shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-normal ${selectedCategory === category.id
                      ? "bg-[#4a6b5b] text-white shadow-lg scale-105 min-w-max hover:bg-[#0d1c1c]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:bg-gray-300"
                    }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Destinations Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse"
                  >
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Error Loading Destinations
                </h3>
                <p className="text-red-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            ) : filteredDestinations.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No destinations found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDestinations.map((dest, idx) => (
                  <div
                    key={dest.id || idx}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105"
                    onClick={async () => {
                      await incrementDestinationClick(dest.id);
                      navigate(`/destination-01`);
                    }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          dest.image_url ||
                          "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600"
                        }
                        alt={dest.name || dest.title}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold">4.8</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Bangladesh
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-accent font-semibold">
                            <span>Explore</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
                        {dest.name || dest.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 leading-relaxed">
                        {dest.subtitle ||
                          dest.description ||
                          "Discover the beauty and culture of this amazing destination"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-accent via-accent-light to-accent">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-primary-dark/80 mb-8 max-w-2xl mx-auto">
              Let us create a custom travel package tailored to your preferences
              and budget
            </p>
            <button
              onClick={() => navigate("/plan-a-trip")}
              className="px-8 py-4 bg-primary text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 mx-auto focus:outline-none focus:ring-4 focus:ring-accent/40"
              style={{ backgroundColor: "#4a6b5b", color: "#fff", opacity: 1 }}
            >
              <MapPin className="w-5 h-5" />
              Plan Custom Trip
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Destinations;
