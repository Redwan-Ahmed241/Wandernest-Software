"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Navigation, Clock, MapPin } from "react-feather";
import { getTransportOptions, type TransportOption } from "../App/api-services";

export default function PublicTransport() {
  const navigate = useNavigate();
  const [selectedTransportType, setSelectedTransportType] = useState("all");
  const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransport = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getTransportOptions();
        console.log('Fetched transport options:', data);
        setTransportOptions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching transport:', err);
        setError("Failed to fetch transport options");
        setTransportOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransport();
  }, []);

  const filteredTransport =
    selectedTransportType === "all"
      ? transportOptions
      : transportOptions.filter(
          (option) => option.type.toLowerCase() === selectedTransportType
        );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300">
        {/* Hero Section - full width */}
        <section className="relative w-full h-[400px] md:h-[480px] lg:h-[520px] flex items-center justify-center overflow-hidden mb-8">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/Figma_photos/greenline.jpeg')",
            }}
          ></div>
          {/* Overlay for text readability */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
          {/* Subtle brand color overlay */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-primary-dark/20"></div>
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
              Public Transport
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              Find the best ways to travel across Bangladesh with real-time
              info, routes, and schedules.
            </p>
          </div>
        </section>
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col gap-6 mb-8 w-full">
            {/* Search Bar - wide and at the top */}
            <div className="relative w-full max-w-2xl mx-auto mb-2">
              <input
                type="text"
                className="w-full p-3 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
                placeholder="Search routes, stations..."
              />
              <svg
                className="absolute left-3 top-3 w-5 h-5 text-primary-500"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            {/* Filter Buttons - replace dropdowns with styled buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {/* Transport Type Buttons */}
              {[
                {
                  type: "all",
                  label: "All",
                  icon: <Navigation className="w-4 h-4" />,
                },
                {
                  type: "bus",
                  label: "Bus",
                  icon: <Navigation className="w-4 h-4" />,
                },
                {
                  type: "metro",
                  label: "Metro",
                  icon: <Navigation className="w-4 h-4" />,
                },
                {
                  type: "tram",
                  label: "Tram",
                  icon: <Navigation className="w-4 h-4" />,
                },
                {
                  type: "ferry",
                  label: "Ferry",
                  icon: <Navigation className="w-4 h-4" />,
                },
                {
                  type: "train",
                  label: "Train",
                  icon: <Navigation className="w-4 h-4" />,
                },
              ].map(({ type, label, icon }) => (
                <button
                  key={type}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    selectedTransportType === type
                      ? "bg-primary/10 text-primary shadow-lg scale-105 hover:bg-primary/20"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:bg-gray-300"
                  }`}
                  onClick={() => setSelectedTransportType(type)}
                  type="button"
                >
                  {icon}
                  {label}
                </button>
              ))}
              {/* Price Range Buttons */}
              {/* Frequency Buttons */}
              {/* You can add more filter buttons here as needed */}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
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
                Error Loading Transport Options
              </h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          ) : filteredTransport.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Navigation className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No transport options found
              </h3>
              <p className="text-gray-600 mb-6">
                Try selecting a different transport type
              </p>
              <button
                onClick={() => setSelectedTransportType("all")}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200"
              >
                Show All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTransport.map((transport) => (
              <div
                key={transport.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col justify-between h-full min-h-[420px]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      transport.image_url || 
                      transport.image ||
                      "/Figma_photos/bus.png"
                    }
                    alt={transport.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/Figma_photos/bus.png";
                    }}
                  />
                  {/* Transport Type Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg z-10">
                    <span className="text-sm font-bold text-gray-900">
                      {transport.type}
                    </span>
                  </div>
                  
                  {/* Transport Name - Always visible at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 py-4 z-10">
                    <h3 className="text-white text-2xl font-bold drop-shadow-lg">
                      {transport.name}
                    </h3>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Route/Destination - Now the main heading */}
                    <div className="flex items-start gap-2 text-gray-900 mb-4">
                      <MapPin className="w-6 h-6 text-[#6ab187] mt-1 flex-shrink-0" />
                      <p className="text-lg font-bold leading-tight">
                        {transport.route || `${transport.from_location || ''} to ${transport.to_location || ''}`}
                      </p>
                    </div>

                    {/* Frequency */}
                    {transport.frequency && (
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <Clock className="w-4 h-4" />
                        <p className="text-sm">
                          {transport.frequency}
                        </p>
                      </div>
                    )}

                    {/* Features */}
                    {transport.features && transport.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {transport.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700 font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Price and Button */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="text-3xl font-bold text-[#6ab187]">
                      {typeof transport.price === 'number' ? `৳${transport.price}` : transport.price}
                    </div>
                    <button 
                      onClick={() => {
                        // You can navigate to a details page or show a modal
                        // For now, let's navigate to a transport details page
                        navigate(`/transport/${transport.id}`);
                        // Or you could show an alert/modal:
                        // alert(`Viewing schedule for ${transport.name}`);
                      }}
                      className="px-6 py-2 bg-[#6ab187] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                    >
                      View Schedule
                      <Clock className="w-5 h-5 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
