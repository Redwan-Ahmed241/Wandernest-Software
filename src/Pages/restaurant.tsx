import type { FunctionComponent } from "react";
import { useState } from "react";
import { Star, Clock, DollarSign, Zap, CheckCircle } from "react-feather";

import Layout from "../Components/Layout";

const FILTERS = [
  { label: "Popular", value: "popular", icon: <Zap className="w-4 h-4" /> },
  { label: "Highest Rated", value: "highest", icon: <Star className="w-4 h-4" /> },
  { label: "Newest", value: "newest", icon: <Clock className="w-4 h-4" /> },
  { label: "Budget-friendly", value: "budget", icon: <DollarSign className="w-4 h-4" /> },
  { label: "Fast Delivery", value: "fast", icon: <Zap className="w-4 h-4" /> },
  { label: "Halal", value: "halal", icon: <CheckCircle className="w-4 h-4" /> },
];

const Restaurant: FunctionComponent = () => {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("popular");
  const [priceRange, setPriceRange] = useState(1000); // Example max price
  // Optionally, add filter state if you want dropdowns like Packages
  // const [openFilter, setOpenFilter] = useState<string | null>(null);
  // const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});

  // Dummy restaurant data for filtering (replace with your real data)
  const restaurants = [
    {
      name: "NORTH END coffee",
      location: "Shahajadpur, Dhaka",
  image: "/Figma_photos/NE.jpeg",
      rating: "4.8★ (1,200+ reviews)",
      cuisine: "Bengali cuisine",
      price: 350,
      tags: ["popular", "highest", "halal"],
    },
    {
      name: "Mezzan Haile Aaiun",
      location: "Chittagong",
  image: "/Figma_photos/local_cuisine.jpeg",
      rating: "4.7★ (950+ reviews)",
      cuisine: "Traditional Bangladeshi dishes",
      price: 200,
      tags: ["popular", "budget", "halal"],
    },
    {
      name: "Panshi Restaurant",
      location: "Sylhet",
  image: "/Figma_photos/tandoori-chicken.jpg",
      rating: "4.6★ (800+ reviews)",
      cuisine: "Sylheti specialties",
      price: 150,
      tags: ["popular", "newest", "halal"],
    },
    {
      name: "Sultans Dine",
      location: "Gulshan 2",
  image: "/Figma_photos/s-dine.png",
      rating: "4.9★ (1,500+ reviews)",
      cuisine: "Biryani and kebabs",
      price: 400,
      tags: ["highest", "fast", "halal"],
    },
    {
      name: "Kamrul Hotel",
      location: "Khulna",
  image: "/Figma_photos/hqdefault.jpg",
      rating: "4.5★ (700+ reviews)",
      cuisine: "Orginal Chuijhaal flavors",
      price: 100,
      tags: ["budget", "halal"],
    },
    {
      name: "Kacchi Vai",
      location: "Narayanganj",
  image: "/Figma_photos/kacchi.jpeg",
      rating: "4.7★ (600+ reviews)",
      cuisine: "Delicious Kacchi",
      price: 250,
      tags: ["budget", "fast", "halal"],
    },
  ];

  // Filter restaurants by search and selected filter
  const filteredRestaurants = restaurants.filter(
    (r) =>
      (selectedFilter === "popular" || r.tags.includes(selectedFilter)) &&
      r.price <= priceRange &&
      (r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.location.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(search.toLowerCase()))
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
                "url('/Figma_photos/tandoori-chicken.jpg')"
            }}
          ></div>
          {/* Overlay for text readability */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
          {/* Subtle brand color overlay */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-primary-dark/20"></div>
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
              Discover
              <span className="block bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Restaurants
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              Explore the best places to eat, from local favorites to top-rated cuisine across Bangladesh.
            </p>
          </div>
        </section>
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-primary-700 mb-6">
            Restaurants
          </h1>
          <div className="flex flex-col gap-6 mb-8 w-full">
            {/* Search Bar - now wider and at the top */}
            <div className="relative w-full max-w-2xl mx-auto mb-2">
              <input
                type="text"
                className="w-full p-3 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
                placeholder="Search restaurants or cuisines"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <img
                src="/Figma_photos/search.svg"
                alt="search"
                className="absolute left-3 top-3 w-5 h-5"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between w-full">
              {/* Price Range */}
              <div className="flex items-center gap-2 min-w-[180px]">
                <span className="text-sm text-primary-700 whitespace-nowrap">Max Price:</span>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-32 h-2 bg-green-500 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: '#22c55e' }}
                />
                <span className="text-sm text-primary-700">৳{priceRange}</span>
              </div>
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      selectedFilter === f.value
                        ? "bg-primary/10 text-primary shadow-lg scale-105 hover:bg-primary/20"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:bg-gray-300"
                    }`}
                    onClick={() => setSelectedFilter(f.value)}
                    type="button"
                  >
                    {f.icon}
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Restaurant Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((r, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col justify-between h-full min-h-[420px]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/Figma_photos/hqdefault.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <span className="text-sm font-semibold text-yellow-600">{r.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{r.location}</span>
                      </div>
                      <div className="text-accent font-bold text-lg">৳{r.price}</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
                      {r.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{r.cuisine}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-2xl font-bold text-primary">৳{r.price}</div>
                    <span className="px-4 py-2 bg-[#6ab187] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2">
                      {r.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Restaurant;
