"use client";

import { useState } from "react";
import Layout from "../Components/Layout";
import { Navigation, Clock, MapPin } from "react-feather";
export default function PublicTransport() {
  const [selectedTransportType, setSelectedTransportType] = useState("all");

  const transportOptions = [
    {
      id: 1,
      type: "Bus",
      name: "Green Line",
      route: "Dhaka to Chittagong",
      frequency: "Every 30+ minutes",
      price: "$2.50",
      image: "/figma_photos/greenline.jpeg",
      features: ["Air Conditioned", "WiFi", "Wheelchair Accessible"],
    },
    {
      id: 2,
      type: "Metro",
      name: "Metro Rail",
      route: "Shahbag to Uttara",
      frequency: "Every 10 minutes",
      price: "$3.00",
      image: "/figma_photos/metro.jpg",
      features: ["Over the roads", "Fast", "Multiple Stops"],
    },
    {
      id: 3,
      type: "Train",
      name: "Train",
      route: "Dhaka to Chittagong",
      frequency: "Every 20 minutes",
      price: "$1.75",
      image: "/figma_photos/trains.jpg",
      features: ["Scenic Route", "Historic", "Tourist Friendly"],
    },
    {
      id: 4,
      type: "Bus",
      name: "Star Line",
      route: "Dhaka to Feni",
      frequency: "Every 10minutes",
      price: "$5.00",
      image: "/figma_photos/starline.png",
      features: ["24/7 Service", "Safe", "Well Lit Stops"],
    },
    {
      id: 5,
      type: "Ferry",
      name: "Ferry",
      route: "Mawa to Barisal",
      frequency: "Every 30+ minutes",
      price: "$2.00",
      image: "/figma_photos/ferry.jpeg",
      features: ["Ocean Views", "Car Transport", "Restaurant Onboard"],
    },
    {
      id: 6,
      type: "Bus",
      name: "Gulshan Chaka",
      route: "Banani to Vatara",
      frequency: "Every 20 minutes",
      price: "$4.50",
      image: "/figma_photos/gulshan_chaka.jpg",
      features: ["High Speed", "Comfortable Seating", "Luggage Space"],
    },
  ];

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
              backgroundImage:
                "url('/Figma_photos/greenline.jpeg')"
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
              Find the best ways to travel across Bangladesh with real-time info, routes, and schedules.
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
                { type: 'all', label: 'All', icon: <Navigation className="w-4 h-4" /> },
                { type: 'bus', label: 'Bus', icon: <Navigation className="w-4 h-4" /> },
                { type: 'metro', label: 'Metro', icon: <Navigation className="w-4 h-4" /> },
                { type: 'tram', label: 'Tram', icon: <Navigation className="w-4 h-4" /> },
                { type: 'ferry', label: 'Ferry', icon: <Navigation className="w-4 h-4" /> },
                { type: 'train', label: 'Train', icon: <Navigation className="w-4 h-4" /> },
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTransport.map((transport) => (
              <div
                key={transport.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col justify-between h-full min-h-[420px]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={transport.image ? transport.image.replace('/figma_photos/', '/Figma_photos/') : "/Figma_photos/placeholder.svg"}
                    alt={transport.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/Figma_photos/placeholder.svg";
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <span className="text-sm font-semibold text-primary">{transport.type}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">{transport.route}</span>
                      </div>
                      <div className="text-accent font-bold text-lg">{transport.price}</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
                      {transport.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{transport.frequency}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {transport.features.map((feature, index) => (
                        <span key={index} className="feature-tag bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-2xl font-bold text-primary">{transport.price}</div>
                    <button
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

        </div>
      </div>
    </Layout>
  );
}
