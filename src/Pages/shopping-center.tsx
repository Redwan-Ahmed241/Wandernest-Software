"use client";

import { useState } from "react";
import "../Styles/page-styles.css";
import Layout from "../App/Layout";
export default function ShoppingCenters() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");

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
    // Place filter
    const placeMatch =
      selectedPlace === "all" ||
      center.location.toLowerCase().includes(selectedPlace.toLowerCase());
    // Rating filter
    let ratingThreshold = 0;
    if (selectedRating === "4.5") ratingThreshold = 4.5;
    else if (selectedRating === "4.0") ratingThreshold = 4.0;
    else if (selectedRating === "3.5") ratingThreshold = 3.5;
    else ratingThreshold = 0;
    const ratingMatch = center.rating >= ratingThreshold;
    return categoryMatch && searchMatch && placeMatch && ratingMatch;
  });

  return (
    <Layout>
      <div className="page-container">
        <div className="page-content">
          {/* Header Section */}
          <div className="page-header">
            <div className="header-content">
              <h1 className="page-title">Shopping Centers</h1>
              <p className="page-subtitle">
                Shop at the best locations and discover amazing deals
              </p>
            </div>
            <button className="view-all-btn">View Map</button>
          </div>

          {/* Search and Filters */}
          <div className="search-filter-section">
            <div className="search-bar">
              <div className="search-input-container">
                <svg
                  className="search-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search shopping centers, stores..."
                  className="search-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="filters">
              <select
                className="filter-dropdown"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="mall">Shopping Malls</option>
                <option value="market">Markets</option>
                <option value="street">Street Shopping</option>
                <option value="outlet">Outlets</option>
                <option value="specialty">Specialty Stores</option>
              </select>
              <select
                className="filter-dropdown"
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
              >
                <option value="all">All Places</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Mymensingh">Mymensingh</option>
                <option value="Barishal">Barishal</option>
                <option value="Jessore">Jessore</option>
                <option value="Comilla">Comilla</option>
              </select>
              <select
                className="filter-dropdown"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>
          </div>

          {/* Shopping Centers Grid */}
          <div className="cards-grid">
            {filteredCenters.map((center) => (
              <div key={center.id} className="shopping-card">
                <div className="card-image">
                  <img
                    src={center.image || "/placeholder.svg"}
                    alt={center.name}
                  />
                  <div className="category-badge">{center.category}</div>
                  <div className="rating-badge">
                    <span>⭐ {center.rating}</span>
                  </div>
                </div>
                <div className="card-content">
                  <h3 className="card-title">{center.name}</h3>
                  <p className="card-subtitle">{center.description}</p>
                  <div className="shopping-details">
                    <div className="detail-item">
                      <span className="detail-label">📍 Location:</span>
                      <span className="detail-value">{center.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">🏪 Stores:</span>
                      <span className="detail-value">{center.stores}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">🕒 Hours:</span>
                      <span className="detail-value">{center.hours}</span>
                    </div>
                  </div>
                  <div className="features">
                    {center.features.map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button className="card-action-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>

          {/* Shopping Tips Section */}
          <div className="info-section">
            <h2 className="section-title">Shopping Tips</h2>
            <div className="info-grid">
              <div className="info-card">
                <h3>Best Shopping Times</h3>
                <p>Visit weekday mornings for less crowds and better service</p>
              </div>
              <div className="info-card">
                <h3>Parking Information</h3>
                <p>Most centers offer free parking for the first 2-3 hours</p>
              </div>
              <div className="info-card">
                <h3>Tourist Discounts</h3>
                <p>
                  Show your tourist ID for special discounts at participating
                  stores
                </p>
              </div>
              <div className="info-card">
                <h3>Payment Methods</h3>
                <p>All major credit cards and mobile payments accepted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
