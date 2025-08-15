import type { FunctionComponent } from "react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../App/Layout";

const FILTERS = [
  { label: "Popular", value: "popular" },
  { label: "Highest Rated", value: "highest" },
  { label: "Newest", value: "newest" },
  { label: "Budget-friendly", value: "budget" },
  { label: "Fast Delivery", value: "fast" },
  { label: "Halal", value: "halal" },
];

const Restaurant: FunctionComponent = () => {
  const _navigate = useNavigate();
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
      image: "/figma_photos/NE.jpeg",
      rating: "4.8★ (1,200+ reviews)",
      cuisine: "Bengali cuisine",
      price: 350,
      tags: ["popular", "highest", "halal"],
    },
    {
      name: "Mezzan Haile Aaiun",
      location: "Chittagong",
      image: "/figma_photos/local_cuisine.jpeg",
      rating: "4.7★ (950+ reviews)",
      cuisine: "Traditional Bangladeshi dishes",
      price: 200,
      tags: ["popular", "budget", "halal"],
    },
    {
      name: "Panshi Restaurant",
      location: "Sylhet",
      image: "/figma_photos/tandoori-chicken.jpg",
      rating: "4.6★ (800+ reviews)",
      cuisine: "Sylheti specialties",
      price: 150,
      tags: ["popular", "newest", "halal"],
    },
    {
      name: "Sultans Dine",
      location: "Gulshan 2",
      image: "/figma_photos/s-dine.png",
      rating: "4.9★ (1,500+ reviews)",
      cuisine: "Biryani and kebabs",
      price: 400,
      tags: ["highest", "fast", "halal"],
    },
    {
      name: "Kamrul Hotel",
      location: "Khulna",
      image: "/figma_photos/hqdefault.jpg",
      rating: "4.5★ (700+ reviews)",
      cuisine: "Orginal Chuijhaal flavors",
      price: 100,
      tags: ["budget", "halal"],
    },
    {
      name: "Kacchi Vai",
      location: "Narayanganj",
      image: "/figma_photos/kacchi.jpeg",
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

  const _onDepth4FrameClick = useCallback(() => {
    // Add your code here
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-primary-700 mb-6">
            Restaurants
          </h1>
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            {/* Search Bar */}
            <div className="relative w-full max-w-md mx-auto mb-4">
              <input
                type="text"
                className="w-full p-3 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Search restaurants or cuisines"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <img
                src="/figma_photos/search.svg"
                alt="search"
                className="absolute left-3 top-3 w-5 h-5"
              />
            </div>
            {/* Price Range */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary-700">Max Price:</span>
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-primary-700">৳{priceRange}</span>
            </div>
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    selectedFilter === f.value
                      ? "bg-primary-600 text-white shadow-md"
                      : "bg-primary-100 text-primary-700 hover:bg-primary-200"
                  }`}
                  onClick={() => setSelectedFilter(f.value)}
                  type="button"
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          {/* Restaurant Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredRestaurants.map((r, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="text-lg font-bold text-primary-700 mb-1">
                    {r.name}
                  </div>
                  <div className="text-sm text-primary-500 mb-2">
                    {r.location}
                  </div>
                  <div className="text-gray-700 mb-2">{r.cuisine}</div>
                  <div className="text-yellow-600 font-semibold mb-2">
                    {r.rating}
                  </div>
                  <div className="text-green-600 font-bold">৳{r.price}</div>
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
