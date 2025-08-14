"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Tailwind conversion: remove CSS import
import Layout from "../App/Layout";

const FEATURED_API_URL =
  "https://wander-nest-ad3s.onrender.com/api/home/destinations/";
const _MEDIA_BASE = "https://wander-nest-ad3s.onrender.com";

const HomePage: FunctionComponent = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(FEATURED_API_URL);
        if (!response.ok) throw new Error("Failed to fetch destinations");
        const data = await response.json();
        // Sort by click count descending and take top 5
        const sorted = (Array.isArray(data) ? data : [])
          .sort((a, b) => (b.click || 0) - (a.click || 0))
          .slice(0, 5);
        setDestinations(sorted);
      } catch (err: any) {
        setError(err.message || "Error fetching destinations");
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const incrementDestinationClick = async (id: number) => {
    try {
      await fetch(
        `https://wander-nest-ad3s.onrender.com/api/home/destinations/${id}/click/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleCardClick = async (dest: any) => {
    await incrementDestinationClick(dest.id);
    // TODO: update to dynamic route if available
    navigate("/destination-01");
  };

  return (
    <Layout>
      <main className="min-h-screen bg-white text-primary-dark font-jakarta">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center h-72 bg-primary-light mb-10">
          <div className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center">
            Explore Bangladesh with WanderNest
          </div>
          <div className="text-lg md:text-2xl text-primary-dark text-center">
            Discover the beauty and culture of Bangladesh with our tailored
            travel services.
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="max-w-5xl mx-auto px-4 mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Featured Destinations
          </h2>
          {error && <div className="text-red-600 mb-3">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {destinations.map((place, index) => (
              <div
                key={place.id || index}
                className="bg-accent-light rounded-xl shadow-md overflow-hidden cursor-pointer hover:scale-105 transition"
                onClick={() => handleCardClick(place)}
              >
                <img
                  src={place.image_url}
                  alt={place.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="text-lg font-bold text-primary mb-1">
                    {place.name}
                  </div>
                  <div className="text-sm text-primary-dark">
                    {place.description}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="col-span-full text-center text-primary-dark">
                Loading destinations...
              </div>
            )}
          </div>
        </section>

        {/* Our Services */}
        <section className="max-w-5xl mx-auto px-4 mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-accent-light rounded-xl shadow-md p-6 flex flex-col items-center">
              <img
                className="w-16 h-16 mb-4"
                alt="Visa Assistance"
                src="/figma_photos/visa.svg"
              />
              <div className="text-lg font-bold text-primary mb-1">
                Visa Assistance
              </div>
              <div className="text-sm text-primary-dark text-center">
                Fast and reliable visa processing
              </div>
            </div>
            <div className="bg-accent-light rounded-xl shadow-md p-6 flex flex-col items-center">
              <img
                className="w-16 h-16 mb-4"
                alt="Travel Planner"
                src="/figma_photos/tp.svg"
              />
              <div className="text-lg font-bold text-primary mb-1">
                Travel Planner
              </div>
              <div className="text-sm text-primary-dark text-center">
                Customize your perfect trip
              </div>
            </div>
            <div className="bg-accent-light rounded-xl shadow-md p-6 flex flex-col items-center">
              <img
                className="w-16 h-16 mb-4"
                alt="Emergency Support"
                src="/figma_photos/em.svg"
              />
              <div className="text-lg font-bold text-primary mb-1">
                Emergency Support
              </div>
              <div className="text-sm text-primary-dark text-center">
                24/7 assistance during your travels
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default HomePage;
