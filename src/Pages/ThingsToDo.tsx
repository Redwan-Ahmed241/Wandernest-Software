"use client";
import { useState, useEffect } from "react";
import type { FunctionComponent } from "react";
import { API_BASE } from '../config/api';
//import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Search, MapPin, Star, ArrowRight } from "react-feather";
import Pagination from "../components/Pagination";
import { usePagination } from "../hooks/usePagination";

const filterCategories = [
  { id: "all", label: "All Activities", icon: "🌟" },
  { id: "Nature", label: "Nature", icon: "🌿" },
  { id: "Food", label: "Food", icon: "🍽️" },
  { id: "Culture", label: "Culture", icon: "🏛️" },
  { id: "Adventure", label: "Adventure", icon: "🎯" },
];

type Activity = {
  title: string;
  location: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  duration: string;
  price: string;
};

const ThingsToDo: FunctionComponent = () => {
  const [activityQuery, setActivityQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sorting state
  const [sortOption, setSortOption] = useState("Default");

  const [apiData, setApiData] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // const navigate = useNavigate();

  // Moved `cardData` inside `useEffect` to prevent unnecessary re-renders
  useEffect(() => {
    const cardData: Activity[] = [];

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/things-to-do/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setApiData(cardData); // Fallback to mock data
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCards: Activity[] = apiData.filter((card) => {
    const matchesCategory =
      selectedCategory === "all" || card.category === selectedCategory;
    const matchesActivity =
      activityQuery.trim() === "" ||
      card.title.toLowerCase().includes(activityQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(activityQuery.toLowerCase());
    const matchesLocation =
      locationQuery.trim() === "" ||
      card.location.toLowerCase().includes(locationQuery.toLowerCase());
    return matchesCategory && matchesActivity && matchesLocation;
  });

  // Sorting logic
  const sortedCards = [...filteredCards];
  if (sortOption === "Price: Low-High") {
    sortedCards.sort((a, b) => {
      const priceA = Number(a.price.replace(/[^0-9.-]/g, ""));
      const priceB = Number(b.price.replace(/[^0-9.-]/g, ""));
      return priceA - priceB;
    });
  } else if (sortOption === "Price: High-Low") {
    sortedCards.sort((a, b) => {
      const priceA = Number(a.price.replace(/[^0-9.-]/g, ""));
      const priceB = Number(b.price.replace(/[^0-9.-]/g, ""));
      return priceB - priceA;
    });
  }

  // Pagination logic
  const ITEMS_PER_PAGE = 9; // 3x3 grid
  const {
    currentPage,
    totalPages,
    currentItems: paginatedCards,
    goToPage,
    totalItems,
    itemsPerPage,
  } = usePagination({
    data: sortedCards,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Bangladesh Nature"
              className="w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.7) blur(0px)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary opacity-80"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Things to
              <span className="block text-accent font-bold drop-shadow-lg">
                Explore
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto mb-8 drop-shadow">
              Discover amazing activities and experiences across Bangladesh
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={activityQuery}
                  onChange={(e) => setActivityQuery(e.target.value)}
                  placeholder="Search activities (e.g., hiking, museums)"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Select location (e.g., Dhaka, Cox's Bazar)"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4 items-center">
              {/* Sort By dropdown */}
              <div className="relative">
                <label htmlFor="sort" className="mr-2 font-semibold text-gray-700">Sort By:</label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                  className="px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 border-none shadow focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="Default">Default</option>
                  <option value="Price: Low-High">Price: Low-High</option>
                  <option value="Price: High-Low">Price: High-Low</option>
                </select>
              </div>
              {/* Existing category filters */}
              {filterCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    cat.id === selectedCategory
                      ? "bg-[#4a6b5b] text-white shadow-lg scale-105 hover:bg-[#0d1c1c]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:bg-gray-300"
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Activities Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-16">
                <p className="text-xl font-semibold text-gray-900">
                  Loading activities...
                </p>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No activities found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria
                </p>
                <button
                  onClick={() => {
                    setActivityQuery("");
                    setLocationQuery("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedCards.map((card, idx) => (
                    <div
                      key={idx}
                      className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col h-full"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                          alt={card.title}
                          src={card.image}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=600";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-sm font-semibold text-gray-800">
                            {card.category}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold">
                            {card.rating}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {card.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-accent font-semibold">
                              <span>Explore</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
                            {card.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-2 leading-relaxed">
                            {card.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <span>⏱️</span>
                              {card.duration}
                            </span>
                          </div>
                          <div className="text-lg font-bold text-primary">
                            {card.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    className="mt-8"
                  />
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ThingsToDo;
