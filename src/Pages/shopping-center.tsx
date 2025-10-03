"use client";

import { useState } from "react";
import Layout from "../components/layout";
import { ShoppingBag, MapPin, Star, Clock } from "react-feather";
export default function ShoppingCenters() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  // Removed unused place and rating filters

  const shoppingCenters = [
    {
      id: 1,
      name: "Bashundhara City Shopping Mall",
      category: "Mall",
      description: "Premium shopping destination with luxury brands",
      location: "Panthapath,Dhaka",
      stores: "200+ stores",
      rating: 4.8,
      image: "/figma_photos/bashundara.jpeg",
      features: [
        "Food Court",
        "Cinema",
        "Parking",
        "Kids Zone",
        "Paint Ball Fight",
      ],
      hours: "10 AM - 10 PM",
    },
    {
      id: 2,
      name: "Aarong",
      category: "Market",
      description: "Fresh local produce and artisan goods",
      location: "Dhanmondi,Dhaka",
      stores: "50+ vendors",
      rating: 4.6,
      image: "/figma_photos/aarong.jpg",
      features: ["Organic Food", "Local Crafts", "Outdoor", "Weekend Events"],
      hours: "8 AM - 6 PM",
    },
    {
      id: 3,
      name: "Unimart",
      category: "Outlet",
      description: "All kind of products",
      location: "United City,Dhaka",
      stores: "75+ boutiques",
      rating: 4.7,
      image: "/figma_photos/unimart.jpeg",
      features: ["Daily Needs", "Cafes", "Products", "Parking", "Expensive"],
      hours: "11 AM - 9 PM",
    },
    {
      id: 4,
      name: "IDB Bhaban",
      category: "Tech Hub",
      description: "Electronics and technology specialists",
      location: "Agargaon,Dhaka",
      stores: "30+ tech stores",
      rating: 4.5,
      image: "/figma_photos/idb.jpeg",
      features: ["Latest Tech", "Repair Services", "Gaming Zone", "Workshops"],
      hours: "10 AM - 8 PM",
    },
    {
      id: 5,
      name: "Newmarket",
      category: "Street",
      description: "Traditional crafts and cultural items",
      location: "Azimpur,Dhaka",
      stores: "40+ artisans",
      rating: 4.9,
      image: "/figma_photos/newmarket.jpg",
      features: [
        "Handmade Items",
        "Cultural Tours",
        "Traditional Food",
        "Live Demos",
      ],
      hours: "9 AM - 7 PM",
    },
    {
      id: 6,
      name: "Afmi Plaza",
      category: "Outlet",
      description: "Brand name goods at discounted prices",
      location: "Sylhet",
      stores: "120+ outlets",
      rating: 4.4,
      image: "/figma_photos/afmi-plaza-.jpg",
      features: [
        "Discounted Prices",
        "Brand Names",
        "Large Parking",
        "Family Friendly",
      ],
      hours: "9 AM - 9 PM",
    },
  ];

  const filteredCenters = shoppingCenters.filter((center) => {
    // Category filter
    const categoryMatch =
      selectedCategory === "all" ||
      center.category.toLowerCase() === selectedCategory;
    // Search filter
    const searchMatch =
      search.trim() === "" ||
      center.name.toLowerCase().includes(search.toLowerCase()) ||
      center.description.toLowerCase().includes(search.toLowerCase()) ||
      center.location.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300">
        {/* Hero Section - full width */}
        <section className="relative w-full h-[400px] md:h-[480px] lg:h-[520px] flex items-center justify-center overflow-hidden mb-8">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/Figma_photos/bashundara.jpeg')",
            }}
          ></div>
          {/* Overlay for text readability */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
          {/* Subtle brand color overlay */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-primary-dark/20"></div>
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
              Shopping Centers
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              Discover the best places to shop, from luxury malls to local
              markets across Bangladesh.
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
                placeholder="Search shopping centers, stores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
            {/* Filter Buttons - replace dropdowns with styled buttons and icons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {/* Category Buttons */}
              {[
                {
                  value: "all",
                  label: "All",
                  icon: <ShoppingBag className="w-4 h-4" />,
                },
                {
                  value: "mall",
                  label: "Mall",
                  icon: <ShoppingBag className="w-4 h-4" />,
                },
                {
                  value: "market",
                  label: "Market",
                  icon: <ShoppingBag className="w-4 h-4" />,
                },
                {
                  value: "street",
                  label: "Street",
                  icon: <MapPin className="w-4 h-4" />,
                },
                {
                  value: "outlet",
                  label: "Outlet",
                  icon: <ShoppingBag className="w-4 h-4" />,
                },
                {
                  value: "specialty",
                  label: "Specialty",
                  icon: <ShoppingBag className="w-4 h-4" />,
                },
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    selectedCategory === value
                      ? "bg-primary/10 text-primary shadow-lg scale-105 hover:bg-primary/20"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:bg-gray-300"
                  }`}
                  onClick={() => setSelectedCategory(value)}
                  type="button"
                >
                  {icon}
                  {label}
                </button>
              ))}
              {/* Place Buttons */}
              {/* Rating Buttons */}
              {/* You can add more filter buttons here as needed */}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCenters.map((center) => (
              <div
                key={center.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col justify-between h-full min-h-[420px]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      center.image
                        ? center.image.replace(
                            "/figma_photos/",
                            "/Figma_photos/"
                          )
                        : "/Figma_photos/placeholder.svg"
                    }
                    alt={center.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/Figma_photos/placeholder.svg";
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <span className="text-sm font-semibold text-primary">
                      {center.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {center.location}
                        </span>
                      </div>
                      <div className="text-accent font-bold text-lg">
                        <Star className="w-4 h-4 inline-block mr-1 text-yellow-500" />
                        {center.rating}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
                      {center.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {center.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {center.features.map((feature, index) => (
                        <span
                          key={index}
                          className="feature-tag bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-sm font-bold text-primary">
                      {center.stores}
                    </div>
                    <div className="text-sm text-gray-500">
                      <Clock className="w-4 h-4 inline-block mr-1" />
                      {center.hours}
                    </div>
                    <button className="px-6 py-2 bg-[#6ab187] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2">
                      View Details
                      <ShoppingBag className="w-5 h-5 transition-transform duration-300" />
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
