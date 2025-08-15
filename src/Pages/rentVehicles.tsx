import type { FunctionComponent } from "react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../App/Layout";

const RentVehicles: FunctionComponent = () => {
  const [search, setSearch] = useState("");
  const _navigate = useNavigate();

  const _onDepth4FrameClick = useCallback(() => {
    // Add your code here
  }, []);

  const vehicleData = [
    {
      name: "SUV Rentals",
      description: "Comfortable SUVs for any terrain",
      image: "/figma_photos/landA.jpeg",
    },
    {
      name: "Luxury Cars",
      description: "Premium cars for special occasions",
      image: "/figma_photos/landB.jpg",
    },
    {
      name: "Economy Options",
      description: "Affordable cars for daily use",
      image: "/figma_photos/Eco.jpg",
    },
  ];

  const filteredVehicles = search.trim()
    ? vehicleData.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.description.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-primary-700 mb-6">
            Rent Vehicles
          </h1>
          <div className="flex items-center gap-2 mb-6">
            <img
              src="/figma_photos/search.svg"
              alt="search"
              className="w-6 h-6"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vehicles, brands, or types..."
              className="border rounded px-4 py-2 w-80 focus:outline-none focus:ring focus:border-primary-400"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(search ? filteredVehicles : vehicleData).map((v, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <img
                  src={v.image}
                  alt={v.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="text-lg font-bold text-primary-700 mb-1">
                    {v.name}
                  </div>
                  <div className="text-gray-700 mb-2">{v.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RentVehicles;
