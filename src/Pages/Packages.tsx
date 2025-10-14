import type { FunctionComponent } from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { useAuth } from "../Authentication/auth-context";
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  Filter,
  Calendar,
  Users,
} from "react-feather";
import Pagination from "../components/Pagination";
import { usePagination } from "../hooks/usePagination";

const FILTER_OPTIONS = {
  Budget: ["All", "< 4000৳", "4000–6000৳", "6000+৳"],
};

type FilterKey = "Destination" | "Budget";

interface Package {
  id: number;
  title: string;
  subtitle: string;
  pic?: string;
  price: string;
  image_url: string;
  destination: string;
  source: string;
  days: number;
}

// Helper to extract place name from package title
function extractPlaceName(title: string): string {
  if (!title) return "";
  const knownPlaces = [
    "Cox's Bazar",
    "Chittagong",
    "Dhaka",
    "St. Martin",
    "Sundarbans",
    "Sylhet",
    "Rangamati",
    "Bandarban",
    "Srimangal",
    "Panchagarh",
    "Khulna",
  ];
  for (const place of knownPlaces) {
    if (title.toLowerCase().includes(place.toLowerCase())) {
      return place;
    }
  }
  return title.split(" ").slice(0, 2).join(" ");
}

const Packages: FunctionComponent = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key in FilterKey]?: string;
  }>({});
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  // Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          "https://wander-nest-ad3s.onrender.com/api/packages/all/"
        );
        const data = await response.json();
        const packagesData = data.results || (Array.isArray(data) ? data : []);
        setPackages(packagesData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch packages");
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenFilter(null);
      }
    }
    if (openFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openFilter]);

  const handleFilterClick = (filter: FilterKey) => {
    setOpenFilter(openFilter === filter ? null : filter);
  };

  const handleOptionSelect = (filter: FilterKey, option: string) => {
    if (option === "All") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [filter]: _, ...rest } = selectedFilters;
      setSelectedFilters(rest);
    } else {
      setSelectedFilters({ ...selectedFilters, [filter]: option });
    }
    setOpenFilter(null);
  };

  // Filter packages by search and selected filters
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilters = Object.entries(selectedFilters).every(
      ([filter, value]) => {
        if (filter === "Destination") {
          return extractPlaceName(pkg.title) === value || value === "All";
        }
        if (filter === "Budget") {
          const price = Number(pkg.price);
          if (value === "< 4000৳") return price < 4000;
          if (value === "4000–6000৳") return price >= 4000 && price <= 6000;
          if (value === "6000+৳") return price > 6000;
          return true;
        }
        return true;
      }
    );
    return matchesSearch && matchesFilters;
  });

  // Pagination logic
  const ITEMS_PER_PAGE = 9; // 3x3 grid
  const {
    currentPage,
    totalPages,
    currentItems: paginatedPackages,
    goToPage,
    totalItems,
    itemsPerPage,
  } = usePagination({
    data: filteredPackages,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  // Dynamic Destination options
  const destinationOptions = [
    "All",
    ...Array.from(
      new Set(packages.map((pkg) => extractPlaceName(pkg.title)))
    ).sort(),
  ];

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
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
          {/* Subtle brand color overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary-dark/20"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
              Travel
              <span className="block bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Packages
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              Discover curated travel experiences designed for unforgettable
              adventures
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-accent/30 shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <div
              className="flex flex-wrap justify-center gap-4"
              ref={filterDropdownRef}
            >
              {/* Destination filter */}
              <div className="relative">
                <button
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    selectedFilters["Destination"] &&
                    selectedFilters["Destination"] !== "All"
                      ? "bg-[#4a6b5b] text-white shadow-lg scale-105 hover:bg-[#0d1c1c]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:bg-gray-300"
                  }`}
                  onClick={() => handleFilterClick("Destination")}
                >
                  <MapPin className="w-4 h-4" />
                  {selectedFilters["Destination"] &&
                  selectedFilters["Destination"] !== "All"
                    ? selectedFilters["Destination"]
                    : "Destination"}
                  <span
                    className={`transform transition-transform duration-200 ${
                      openFilter === "Destination" ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {openFilter === "Destination" && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                    {destinationOptions.map((option) => (
                      <button
                        key={option}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                          selectedFilters["Destination"] === option ||
                          (!selectedFilters["Destination"] && option === "All")
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-gray-700"
                        }`}
                        onClick={() =>
                          handleOptionSelect("Destination", option)
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget filter */}
              <div className="relative">
                <button
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    selectedFilters["Budget"] &&
                    selectedFilters["Budget"] !== "All"
                      ? "bg-[#4a6b5b] text-white shadow-lg scale-105 hover:bg-[#0d1c1c]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:bg-gray-300"
                  }`}
                  onClick={() => handleFilterClick("Budget")}
                >
                  <Filter className="w-4 h-4" />
                  {selectedFilters["Budget"] &&
                  selectedFilters["Budget"] !== "All"
                    ? selectedFilters["Budget"]
                    : "Budget"}
                  <span
                    className={`transform transition-transform duration-200 ${
                      openFilter === "Budget" ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {openFilter === "Budget" && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                    {FILTER_OPTIONS.Budget.map((option) => (
                      <button
                        key={option}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                          selectedFilters["Budget"] === option ||
                          (!selectedFilters["Budget"] && option === "All")
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-gray-700"
                        }`}
                        onClick={() => handleOptionSelect("Budget", option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Packages Grid */}
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
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
                  Error Loading Packages
                </h3>
                <p className="text-red-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No packages found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedFilters({});
                  }}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col justify-between h-full min-h-[420px]"
                    onClick={() =>
                      navigate(`/packages/${encodeURIComponent(pkg.title)}`)
                    }
                  >
                    <div className="relative overflow-hidden">
                      <img
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={pkg.title}
                        src={
                          pkg.image_url ||
                          "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600"
                        }
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (
                            target.src !==
                            "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600"
                          ) {
                            target.src =
                              "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600";
                          }
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
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {pkg.days} Days
                            </span>
                          </div>
                          <div className="text-accent font-bold text-xl">
                            ৳{Number(pkg.price).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
                          {pkg.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {pkg.subtitle ||
                            "Experience the beauty and culture of this amazing destination"}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {extractPlaceName(pkg.title)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {pkg.days} Days
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-2xl font-bold text-primary">
                          ৳{Number(pkg.price).toLocaleString()}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isAuthenticated) {
                              navigate("/login");
                            } else {
                              // Use destination and package ID for navigation
                              const destinationId = pkg.destination || 'unknown';
                              navigate(`/confirm-book/${destinationId}/${pkg.id}`, { state: { pkg } });
                            }
                          }}
                          className="px-6 py-2 bg-[#6ab187] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                        >
                          Book Now
                          <ArrowRight className="w-5 h-5 transition-transform duration-300" />
                        </button>
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

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-accent via-accent-light to-accent">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-6">
              Can't Find the Perfect Package?
            </h2>
            <p className="text-lg text-primary-dark/80 mb-8 max-w-2xl mx-auto">
              Create your own custom travel package tailored to your preferences
              and budget
            </p>
            <button
              onClick={() => navigate("/create-packages")}
              className="px-8 py-4 bg-white text-black font-bold text-lg rounded-xl shadow-lg border border-primary/30 hover:bg-white/10 hover:text-accent hover:border-accent hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 mx-auto focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <Users className="w-5 h-5 mr-2" />
              Create Custom Package
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Packages;
