import type { FunctionComponent } from "react";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaStar, FaMapMarkerAlt } from "react-icons/fa";

import Layout from "../components/layout";
import { guidesAPI, type Guide, type GuideLocation, type GuideSearchParams } from "../api/guides";

// Function to get appropriate guide image based on guide data
const getGuideImage = (guide: Guide): string => {
  // Use different placeholder images for different guides
  const images = [
    "/Figma_photos/abtahi_bro-modified-reduced.png",
    "/Figma_photos/redwan-bro-modified-reduced.png", 
    "/Figma_photos/1600px_COLOURBOX5006565.jpg",
    "/Figma_photos/ifty_bro_2-modified_reduced.png",
    "/Figma_photos/NE.jpeg",
    "/Figma_photos/onu.png"
  ];
  
  // Use guide ID to consistently assign the same image to the same guide
  const imageIndex = (guide.id - 1) % images.length;
  return images[imageIndex];
};

const AllGuides: FunctionComponent = () => {
  const [search, setSearch] = useState("");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch guides from API
  const fetchGuides = useCallback(async (searchParams: GuideSearchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await guidesAPI.getGuides(searchParams);
      setGuides(response.guides || []);
    } catch (err) {
      console.error("Error fetching guides:", err);
      setError("Failed to load guides. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load guides on component mount
  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.trim()) {
        fetchGuides({ 
          location: search,
          page: 1,
          limit: 20 
        });
      } else {
        fetchGuides({});
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, fetchGuides]);

  const onCardClick = useCallback((guide: Guide) => {
    navigate(`/guide/${guide.id}`);
  }, [navigate]);

  // Filter guides based on search
  const filteredGuides = guides.filter(
    (guide) => {
      const locationString = typeof guide.location === 'object' && guide.location
        ? `${(guide.location as GuideLocation).city || ''} ${(guide.location as GuideLocation).region || ''} ${(guide.location as GuideLocation).country || ''}`
        : guide.location || '';
      
      return guide.name.toLowerCase().includes(search.toLowerCase()) ||
        guide.area.toLowerCase().includes(search.toLowerCase()) ||
        locationString.toLowerCase().includes(search.toLowerCase()) ||
        guide.specialties.some(specialty => 
          specialty.toLowerCase().includes(search.toLowerCase())
        );
    }
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/Figma_photos/1a.jpeg"
              alt="Travel Guides"
              className="w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.7) blur(0px)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary opacity-80"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Local Travel
              <span className="block text-accent font-bold drop-shadow-lg">
                Guides
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto mb-8 drop-shadow">
              Find the best guides for your next adventure with detailed information
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for guides, destinations, or services"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Available Travel Guides</h2>
              <div className="text-gray-600">
                {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''} found
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Loading state
                <div className="col-span-full flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <span className="ml-3 text-lg text-gray-600">Loading guides...</span>
                </div>
              ) : error ? (
                // Error state
                <div className="col-span-full text-center py-12">
                  <div className="text-red-600 text-lg mb-4">{error}</div>
                  <button 
                    onClick={() => fetchGuides()}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredGuides.length === 0 ? (
                // No results state
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-600 text-lg mb-4">
                    {search ? `No guides found for "${search}"` : "No guides available"}
                  </div>
                  {search && (
                    <button 
                      onClick={() => setSearch("")}
                      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                // Guides list
                filteredGuides.map((guide) => (
                  <div
                    key={guide.id}
                    onClick={() => onCardClick(guide)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100"
                  >
                    {/* Guide Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          guide.image?.startsWith('https://example.com') || !guide.image
                            ? getGuideImage(guide)
                            : guide.image || guide.profile_picture
                        }
                        alt={guide.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getGuideImage(guide);
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-500" />
                          <span>{guide.rating || '4.0'}</span>
                        </div>
                      </div>
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                        (guide.availability || guide.availability_status === 'Available')
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {guide.availability_status || (guide.availability ? 'Available' : 'Busy')}
                      </div>
                    </div>

                    {/* Guide Info */}
                    <div className="p-4">
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                          {guide.name}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          <FaMapMarkerAlt className="text-gray-600" />
                          <span>
                            {typeof guide.location === 'object' && guide.location 
                              ? `${(guide.location as GuideLocation).city || ''}, ${(guide.location as GuideLocation).region || ''}`
                              : guide.location || guide.area
                            } • {guide.area}
                          </span>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {guide.specialties.slice(0, 2).map((specialty, index) => (
                            <span
                              key={index}
                              className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                          {guide.specialties.length > 2 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{guide.specialties.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Experience & Languages */}
                      <div className="mb-3 text-sm text-gray-600">
                        <div className="flex justify-between items-center">
                          <span>{guide.experience_years || 'N/A'} years exp</span>
                          <span>({guide.total_reviews || 0} reviews)</span>
                        </div>
                        <div className="text-xs mt-1">
                          �️ {guide.languages.slice(0, 2).join(", ")}
                          {guide.languages.length > 2 && ` +${guide.languages.length - 2}`}
                        </div>
                      </div>

                      {/* Price & Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="text-lg font-bold text-primary">
                          ৳{guide.price || guide.daily_rate || guide.price_per_day}
                          <span className="text-sm font-normal text-gray-600">/day</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCardClick(guide);
                          }}
                          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AllGuides;
