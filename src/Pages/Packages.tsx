import { FunctionComponent, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/Packages.module.css";
import Layout from "../App/Layout";
import { useAuth } from "../Authentication/auth-context";

const FILTER_OPTIONS = {
  // Destination will be generated dynamically
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

const _MEDIA_BASE = "https://wander-nest-ad3s.onrender.com";

// Modal component for booking (full form)
const BookNowModal = ({ open, onClose, pkg, onConfirm, loading }: any) => {
  const [from, setFrom] = useState(pkg?.from || "");
  const [to, setTo] = useState(pkg?.title || "");
  const [startDate, setStartDate] = useState(pkg?.startDate || "");
  const [endDate, setEndDate] = useState(pkg?.endDate || "");
  const [travelers, setTravelers] = useState(1);
  const [budget, setBudget] = useState(pkg?.price || "");

  useEffect(() => {
    if (pkg) {
      setFrom(pkg.from || "");
      setTo(pkg.title || "");
      setStartDate(pkg.startDate || "");
      setEndDate(pkg.endDate || "");
      setTravelers(1);
      setBudget(pkg.price || "");
    }
  }, [pkg]);

  if (!open || !pkg) return null;
  return (
    <div className="modalOverlay" style={{ alignItems: "center" }}>
      <div
        className="modalContent"
        style={{
          maxHeight: "90vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          ×
        </button>
        <h2 style={{ marginBottom: 16 }}>Book Package</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm({ from, to, startDate, endDate, travelers, budget });
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <label>
              <b>From:</b>
            </label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>
              <b>To:</b>
            </label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>
              <b>Start Date:</b>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>
              <b>End Date:</b>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>
              <b>Number of Travelers:</b>
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>
              <b>Budget (BDT):</b>
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              style={{ width: "100%" }}
              required
            />
          </div>
          {/* Add more fields as needed, or make some read-only if required */}
          <button
            style={{
              marginTop: 24,
              width: "100%",
              padding: "10px 0",
              background: "#0a7cff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Package"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper to extract place name from package title
function extractPlaceName(title: string): string {
  // Try to extract the first part before a special character or the first 2 words
  // e.g. "Cox's Bazar Beach Retreat" => "Cox's Bazar"
  if (!title) return "";
  // Try to match known patterns
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
    "Rajshahi",
    "Barisal",
    "Mymensingh",
    "Comilla",
    "Jessore",
    "Dinajpur",
    "Bogra",
    "Pabna",
    "Noakhali",
    "Tangail",
    "Jamalpur",
    "Narayanganj",
    "Gazipur",
    "Narsingdi",
    "Kushtia",
    "Faridpur",
    "Satkhira",
    "Bhola",
    "Patuakhali",
    "Bagerhat",
    "Meherpur",
    "Lalmonirhat",
    "Kurigram",
    "Sherpur",
    "Habiganj",
    "Netrokona",
    "Sunamganj",
    "Moulvibazar",
    "Chuadanga",
    "Magura",
    "Jhalokathi",
    "Pirojpur",
    "Narail",
    "Shariatpur",
    "Madaripur",
    "Gopalganj",
    "Munshiganj",
    "Manikganj",
    "Rajbari",
    "Nilphamari",
    "Gaibandha",
    "Thakurgaon",
    "Joypurhat",
    "Naogaon",
    "Chapainawabganj",
    "Sirajganj",
    "Kishoreganj",
    "Brahmanbaria",
    "Lakshmipur",
    "Chandpur",
    "Feni",
    "Laxmipur",
    "Shatkhira",
    "Bhola",
    "Patuakhali",
    "Bagerhat",
    "Meherpur",
    "Lalmonirhat",
    "Kurigram",
    "Sherpur",
    "Habiganj",
    "Netrokona",
    "Sunamganj",
    "Moulvibazar",
    "Chuadanga",
    "Magura",
    "Jhalokathi",
    "Pirojpur",
    "Narail",
    "Shariatpur",
    "Madaripur",
    "Gopalganj",
    "Munshiganj",
    "Manikganj",
    "Rajbari",
    "Nilphamari",
    "Gaibandha",
    "Thakurgaon",
    "Joypurhat",
    "Naogaon",
    "Chapainawabganj",
    "Sirajganj",
    "Kishoreganj",
    "Brahmanbaria",
    "Lakshmipur",
    "Chandpur",
    "Feni",
    "Laxmipur",
  ];
  for (const place of knownPlaces) {
    if (title.toLowerCase().includes(place.toLowerCase())) {
      return place;
    }
  }
  // Fallback: take the first 2 words
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [, setConfirmError] = useState("");
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
        // Handle paginated response structure
        const packagesData = data.results || (Array.isArray(data) ? data : []);
        setPackages(packagesData);
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
      // Remove the filter for this category
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

  // Handler for Book Now
  const _handleBookNow = (pkg: Package) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
    setConfirmError("");
  };

  // Handler for Confirm Package (SSLCommerz API call stub)
  const handleConfirmPackage = async (formData: any) => {
    setConfirmLoading(true);
    setConfirmError("");
    try {
      // TODO: Replace with real SSLCommerz API call
      // Example: await fetch('/api/sslcommerz/checkout', { method: 'POST', body: JSON.stringify(formData) })
      await new Promise((res) => setTimeout(res, 1500)); // Simulate network
      setModalOpen(false);
      alert("Package booking initiated! (SSLCommerz)");
    } catch (err) {
      setConfirmError("Failed to confirm package. Please try again.");
    } finally {
      setConfirmLoading(false);
    }
  };

  // Dynamic Destination options (place names only)
  const destinationOptions = [
    "All",
    ...Array.from(
      new Set(packages.map((pkg) => extractPlaceName(pkg.title)))
    ).sort(),
  ];

  return (
    <Layout>
      <div className={styles.packages}>
        {/* Header Section: Flexbox for label and button */}
        <div className={styles.groupParent}>
          <div className={styles.tourPackages2}>Tour Packages</div>
          <button
            className={styles.createCustomPackage}
            onClick={() => navigate("/create-package")}
          >
            Create custom package
          </button>
        </div>
        {/* Search Bar: Centered below header */}
        <div className={styles.searchBarContainer}>
          <img
            src="/figma_photos/search.svg"
            alt="search"
            className={styles.searchIconInside}
          />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search destinations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Filters and packages remain unchanged */}
        <div className={styles.tourPackagesWrapper}>
          <div className={styles.tourPackages}>
            <div className={styles.tourPackages1}>
              <div className={styles.depth0Frame0}>
                <div className={styles.depth1Frame0}>
                  <div className={styles.depth2Frame1}>
                    <div className={styles.depth3Frame01}>
                      <div
                        className={styles.depth4Frame2}
                        ref={filterDropdownRef}
                      >
                        {/* Render Destination and Budget filters */}
                        {/* Destination filter (dynamic) */}
                        <div className={styles.depth5Frame03}>
                          <div
                            className={
                              styles.depth6Frame03 +
                              (selectedFilters["Destination"] &&
                              selectedFilters["Destination"] !== "All"
                                ? " " + styles.selected
                                : "")
                            }
                            onClick={() => handleFilterClick("Destination")}
                            style={{ cursor: "pointer", position: "relative" }}
                          >
                            <div className={styles.destinations}>
                              {selectedFilters["Destination"] &&
                              selectedFilters["Destination"] !== "All"
                                ? selectedFilters["Destination"]
                                : "Destination"}
                            </div>
                            <img
                              className={styles.depth6Frame1}
                              alt=""
                              src="/figma_photos/darrow.svg"
                            />
                            {openFilter === "Destination" && (
                              <div className={styles.filterDropdown}>
                                {destinationOptions.map((option) => (
                                  <div
                                    key={option}
                                    className={
                                      styles.filterDropdownOption +
                                      (selectedFilters["Destination"] ===
                                        option ||
                                      (!selectedFilters["Destination"] &&
                                        option === "All")
                                        ? " " + styles.selected
                                        : "")
                                    }
                                    onClick={() =>
                                      handleOptionSelect("Destination", option)
                                    }
                                  >
                                    {option}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Budget filter (static) */}
                        <div className={styles.depth5Frame03}>
                          <div
                            className={
                              styles.depth6Frame03 +
                              (selectedFilters["Budget"] &&
                              selectedFilters["Budget"] !== "All"
                                ? " " + styles.selected
                                : "")
                            }
                            onClick={() => handleFilterClick("Budget")}
                            style={{ cursor: "pointer", position: "relative" }}
                          >
                            <div className={styles.destinations}>
                              {selectedFilters["Budget"] &&
                              selectedFilters["Budget"] !== "All"
                                ? selectedFilters["Budget"]
                                : "Budget"}
                            </div>
                            <img
                              className={styles.depth6Frame1}
                              alt=""
                              src="/figma_photos/darrow.svg"
                            />
                            {openFilter === "Budget" && (
                              <div className={styles.filterDropdown}>
                                {FILTER_OPTIONS.Budget.map((option) => (
                                  <div
                                    key={option}
                                    className={
                                      styles.filterDropdownOption +
                                      (selectedFilters["Budget"] === option ||
                                      (!selectedFilters["Budget"] &&
                                        option === "All")
                                        ? " " + styles.selected
                                        : "")
                                    }
                                    onClick={() =>
                                      handleOptionSelect("Budget", option)
                                    }
                                  >
                                    {option}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={styles.depth4Frame3}>
                        <div className={styles.depth5Frame04}>
                          {loading && (
                            <div
                              style={{
                                textAlign: "center",
                                padding: "2rem",
                                color: "#666",
                              }}
                            >
                              Loading packages...
                            </div>
                          )}
                          {error && (
                            <div
                              style={{
                                textAlign: "center",
                                padding: "2rem",
                                color: "red",
                              }}
                            >
                              {error}
                            </div>
                          )}
                          {!loading &&
                            !error &&
                            filteredPackages.map((pkg) => (
                              <div
                                className={styles.depth6Frame07}
                                key={pkg.id}
                                onClick={() =>
                                  navigate(
                                    `/packages/${encodeURIComponent(pkg.title)}`
                                  )
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <img
                                  className={styles.depth7Frame01}
                                  alt=""
                                  src={pkg.image_url}
                                />
                                <div className={styles.depth7Frame11}>
                                  <div className={styles.depth7Frame11}>
                                    <div
                                      className={
                                        styles.sundarbansWildlifeExpedition
                                      }
                                    >
                                      {pkg.title}
                                    </div>
                                  </div>
                                  <div className={styles.depth8Frame1}>
                                    <div className={styles.exploreTheWorlds}>
                                      {pkg.subtitle}
                                    </div>
                                  </div>
                                  <div className={styles.cardPrice}>
                                    ৳{Number(pkg.price).toLocaleString()}
                                  </div>
                                  <button
                                    className={styles.createCustomPackage}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isAuthenticated) {
                                        navigate("/login");
                                      } else {
                                        navigate("/confirm-book", {
                                          state: { pkg },
                                        });
                                      }
                                    }}
                                  >
                                    Book Now
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                        {!loading &&
                          !error &&
                          filteredPackages.length === 0 && (
                            <div
                              style={{
                                textAlign: "center",
                                padding: "2rem",
                                color: "#666",
                              }}
                            >
                              No packages found matching your criteria.
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BookNowModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          pkg={selectedPackage}
          onConfirm={handleConfirmPackage}
          loading={confirmLoading}
        />
      </div>
    </Layout>
  );
};

export default Packages;
