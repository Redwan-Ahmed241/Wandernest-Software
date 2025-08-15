"use client";
import React, { useCallback, useState } from "react";
import type { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import { useAuth } from "../Authentication/auth-context";
import ProfileDropdown from "../Components/profile-dropdown";
import { Bell } from "react-feather";
import Layout from "../App/Layout";

const cardData = [
  {
    title: "Explore the Sundarbans Mangrove Forest",
    location: "Khulna",
    description: `Immerse yourself in the lush green beauty of the Sundarbans, the world's largest mangrove forest. Capture stunning photos of diverse flora and fauna, and experience nature's tranquil essence.`,
    image: "/figma_photos/mangrove.jpg",
    category: "Nature",
  },
  {
    title: "Savor Street Food in Old Dhaka",
    location: "Dhaka",
    description:
      "Indulge in a culinary adventure through the vibrant streets of Old Dhaka. Sample local delicacies like biryani, kebabs, and flavorful chutneys.",
    image: "/figma_photos/puran_dhaka.jpg",
    category: "Food",
  },
  {
    title: "Discover Historical Sites at Lalbagh Fort",
    location: "Dhaka",
    description:
      "Journey through time within the ancient walls of Lalbagh Fort, a historical Mughal-era structure. Marvel at intricate architecture, gardens, and artifacts.",
    image: "/figma_photos/lalbagh.jpg",
    category: "Culture",
  },
  {
    title: "Boat Trip on the Buriganga River",
    location: "Dhaka",
    description: `Take a scenic boat trip on the Buriganga River, offering captivating views of Dhaka's cityscape. Experience the hustle and bustle of river life.`,
    image: "/figma_photos/burigangha.jpg",
    category: "Adventure",
  },
  {
    title: `Relax at Cox's Bazar Beach`,
    location: `Cox's Bazar`,
    description: `Find peace and rejuvenation on the golden sands of Cox's Bazar, one of the world's longest natural beaches. Relax by the sea, and soak in the coastal atmosphere.`,
    image: "/figma_photos/coxsbazar.jpg",
    category: "Nature",
  },
  {
    title: "Experience Traditional Cuisine in a Local Eatery",
    location: "Dhaka",
    description:
      "Treat yourself to a delightful culinary adventure in a traditional Bangladeshi eatery. Relish the rich flavors of local dishes like hilsa fish curry and various vegetable preparations.",
    image: "/figma_photos/local_cuisine.jpeg",
    category: "Food",
  },
  {
    title: "Visit the National Museum of Bangladesh",
    location: "Dhaka",
    description: `Step into the cultural heritage of Bangladesh at the National Museum in Dhaka. Wander through exhibits showcasing art, history, and the nation's rich past.`,
    image: "/figma_photos/museum.jpeg",
    category: "Culture",
  },
  {
    title: "Cycle through the Countryside",
    location: "Dhaka",
    description: `Embark on a picturesque cycling tour through the serene countryside surrounding Dhaka. Witness rural life, lush green fields, and local villages as you ride.`,
    image: "/figma_photos/cycling.jpg",
    category: "Adventure",
  },
];

const filterCategories = ["Nature", "Food", "Culture", "Adventure", "All"];

const ThingsToDo: FunctionComponent = () => {
  const [activityQuery, setActivityQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  // Filtering logic
  const filteredCards = cardData.filter((card) => {
    const matchesCategory =
      selectedCategory === "All" || card.category === selectedCategory;
    const matchesActivity =
      activityQuery.trim() === "" ||
      card.title.toLowerCase().includes(activityQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(activityQuery.toLowerCase());
    const matchesLocation =
      locationQuery.trim() === "" ||
      card.location.toLowerCase().includes(locationQuery.toLowerCase());
    return matchesCategory && matchesActivity && matchesLocation;
  });

  // Handler for pill label click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  // Handler for activity search (real-time)
  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivityQuery(e.target.value);
  };

  // Handler for location search (real-time)
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationQuery(e.target.value);
  };

  const onDepth4FrameClick = () => {
    // Handle navigation if needed
  };
  const goHome = useCallback(() => {
    navigate("/");
  }, [navigate]);
  const { isAuthenticated, loading } = useAuth();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300 py-8 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
          {/* Navbar */}
          <nav className="flex flex-row justify-between items-center mb-8">
            <div className="flex flex-row items-center gap-2">
              <img
                className="h-10 w-10"
                alt="Logo"
                src="/figma_photos/wandernest.svg"
              />
              <button
                onClick={goHome}
                className="text-xl font-bold text-primary-700"
              >
                WanderNest
              </button>
            </div>
            <div className="flex flex-row gap-6 items-center">
              <button
                onClick={() => navigate("/destinations")}
                className="text-base text-gray-700 hover:text-primary-600"
              >
                Destinations
              </button>
              <button
                onClick={() => navigate("/hotels-rooms")}
                className="text-base text-gray-700 hover:text-primary-600"
              >
                Hotels
              </button>
              <button
                disabled
                className="text-base text-gray-400 cursor-not-allowed"
              >
                Flights{" "}
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded ml-1">
                  Upcoming
                </span>
              </button>
              <button
                onClick={() => navigate("/Packages")}
                className="text-base text-gray-700 hover:text-primary-600"
              >
                Packages
              </button>
              {isAuthenticated ? (
                <ProfileDropdown />
              ) : (
                <>
                  <button className="px-4 py-1 rounded bg-primary-500 text-white font-semibold hover:bg-primary-600">
                    Sign up
                  </button>
                  <button className="px-4 py-1 rounded bg-gray-200 text-primary-700 font-semibold hover:bg-gray-300">
                    Log in
                  </button>
                </>
              )}
              <span title="Notifications">
                <Bell
                  size={26}
                  className="ml-4 text-yellow-400 cursor-pointer"
                />
              </span>
            </div>
          </nav>
          <h1 className="text-3xl font-bold text-primary-700 mb-6">
            Things to do
          </h1>
          {/* Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block font-medium mb-1">
                Search for activities
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activityQuery}
                  onChange={handleActivityChange}
                  placeholder="e.g., hiking, museums"
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-primary-400"
                />
                <button
                  className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition"
                  type="button"
                >
                  Search
                </button>
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Select location</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={locationQuery}
                  onChange={handleLocationChange}
                  placeholder="e.g., Dhaka, Cox's Bazar"
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-primary-400"
                />
                <button
                  className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition"
                  type="button"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          {/* Pill-shaped filter labels as buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full font-medium border ${
                  cat === selectedCategory
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                } transition`}
                onClick={() => handleCategoryClick(cat)}
                style={{ userSelect: "none" }}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Card Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredCards.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                No activities found.
              </div>
            ) : (
              filteredCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  <img
                    className="w-full h-40 object-cover"
                    alt=""
                    src={card.image}
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="text-lg font-bold text-primary-700 mb-1">
                      {card.title}
                    </div>
                    <div className="text-sm text-primary-500 mb-2">
                      {card.location}
                    </div>
                    <div className="text-gray-700 mb-2">{card.description}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-12">
            <Footer />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThingsToDo;
