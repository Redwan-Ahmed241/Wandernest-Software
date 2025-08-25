"use client";
import React, { useState } from "react";
import type { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import { Search, MapPin, Star, ArrowRight, Filter } from "react-feather";

const cardData = [
  {
    title: "Explore the Sundarbans Mangrove Forest",
    location: "Khulna",
    description: `Immerse yourself in the lush green beauty of the Sundarbans, the world's largest mangrove forest. Capture stunning photos of diverse flora and fauna, and experience nature's tranquil essence.`,
    image: "/Figma_photos/mangrove.jpg",
    category: "Nature",
    rating: 4.8,
    duration: "Full Day",
    price: "৳2,500"
  },
  {
    title: "Savor Street Food in Old Dhaka",
    location: "Dhaka",
    description: "Indulge in a culinary adventure through the vibrant streets of Old Dhaka. Sample local delicacies like biryani, kebabs, and flavorful chutneys.",
    image: "/Figma_photos/puran_dhaka.jpg",
    category: "Food",
    rating: 4.7,
    duration: "4 Hours",
    price: "৳800"
  },
  {
    title: "Discover Historical Sites at Lalbagh Fort",
    location: "Dhaka",
    description: "Journey through time within the ancient walls of Lalbagh Fort, a historical Mughal-era structure. Marvel at intricate architecture, gardens, and artifacts.",
    image: "/Figma_photos/lalbagh.jpg",
    category: "Culture",
    rating: 4.6,
    duration: "3 Hours",
    price: "৳500"
  },
  {
    title: "Boat Trip on the Buriganga River",
    location: "Dhaka",
    description: `Take a scenic boat trip on the Buriganga River, offering captivating views of Dhaka's cityscape. Experience the hustle and bustle of river life.`,
    image: "/Figma_photos/burigangha.jpg",
    category: "Adventure",
    rating: 4.5,
    duration: "2 Hours",
    price: "৳1,200"
  },
  {
    title: `Relax at Cox's Bazar Beach`,
    location: `Cox's Bazar`,
    description: `Find peace and rejuvenation on the golden sands of Cox's Bazar, one of the world's longest natural beaches. Relax by the sea, and soak in the coastal atmosphere.`,
    image: "/Figma_photos/coxsbazar.jpg",
    category: "Nature",
    rating: 4.9,
    duration: "Full Day",
    price: "৳1,800"
  },
  {
    title: "Experience Traditional Cuisine in a Local Eatery",
    location: "Dhaka",
    description: "Treat yourself to a delightful culinary adventure in a traditional Bangladeshi eatery. Relish the rich flavors of local dishes like hilsa fish curry and various vegetable preparations.",
    image: "/Figma_photos/local_cuisine.jpeg",
    category: "Food",
    rating: 4.4,
    duration: "2 Hours",
    price: "৳600"
  },
  {
    title: "Visit the National Museum of Bangladesh",
    location: "Dhaka",
    description: `Step into the cultural heritage of Bangladesh at the National Museum in Dhaka. Wander through exhibits showcasing art, history, and the nation's rich past.`,
    image: "/Figma_photos/museum.jpeg",
    category: "Culture",
    rating: 4.3,
    duration: "3 Hours",
    price: "৳300"
  },
  {
    title: "Cycle through the Countryside",
    location: "Dhaka",
    description: `Embark on a picturesque cycling tour through the serene countryside surrounding Dhaka. Witness rural life, lush green fields, and local villages as you ride.`,
    image: "/Figma_photos/cycling.jpg",
    category: "Adventure",
    rating: 4.6,
    duration: "5 Hours",
    price: "৳1,000"
  },
];

const filterCategories = [
  { id: "all", label: "All Activities", icon: "🌟" },
  { id: "Nature", label: "Nature", icon: "🌿" },
  { id: "Food", label: "Food", icon: "🍽️" },
  { id: "Culture", label: "Culture", icon: "🏛️" },
  { id: "Adventure", label: "Adventure", icon: "🎯" }
];

const ThingsToDo: FunctionComponent = () => {
  const [activityQuery, setActivityQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  // Filtering logic
  const filteredCards = cardData.filter((card) => {
    const matchesCategory = selectedCategory === "all" || card.category === selectedCategory;
    const matchesActivity = activityQuery.trim() === "" ||
      card.title.toLowerCase().includes(activityQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(activityQuery.toLowerCase());
    const matchesLocation = locationQuery.trim() === "" ||
      card.location.toLowerCase().includes(locationQuery.toLowerCase());
    return matchesCategory && matchesActivity && matchesLocation;
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
            <div className="flex flex-wrap justify-center gap-4">
              {filterCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${cat.id === selectedCategory
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
            {filteredCards.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={card.title}
                        src={card.image}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=600";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-sm font-semibold text-gray-800">{card.category}</span>
                      </div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold">{card.rating}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm font-medium">{card.location}</span>
                          </div>
                          <div className="text-accent font-bold">{card.price}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {card.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <span>⏱️</span>
                            {card.duration}
                          </span>
                        </div>
                        <button className="flex items-center gap-1 text-primary font-semibold hover:gap-2 transition-all duration-200">
                          <span>Book Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
              Explore our complete travel packages or create your own custom itinerary
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/packages")}
                className="px-8 py-4 bg-white text-primary font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                View Packages
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/plan-a-trip")}
                className="px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105"
              >
                Plan Custom Trip
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ThingsToDo;