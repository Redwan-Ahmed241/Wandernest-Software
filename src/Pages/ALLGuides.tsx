import type { FunctionComponent } from "react";
import { useCallback, useState } from "react";

import Layout from "../Components/Layout";

const AllGuides: FunctionComponent = () => {
  const [search, setSearch] = useState("");

  const onCardClick = useCallback(() => {
    // TODO: navigate to details when wired up
  }, []);

  const guides = [
    {
      title: "Guide for Sundarban Area",
      area: "Forest",
      fare: "$50/hour",
      timing: "9 AM - 6 PM",
      image: "/Figma_photos/deer.jpg",
    },
    {
      title: "Guide for Rangamati",
      area: "Mountain Regions",
      fare: "$60/hour",
      timing: "8 AM - 4 PM",
      image: "/Figma_photos/rangamati01-1.jpg",
    },
    {
      title: "Guide for Bandarban",
      area: "Springs, Hills, Jungle",
      fare: "$60/hour",
      timing: "8 AM - 4 PM",
      image: "/Figma_photos/aboutUsHero.jpg",
    },
  ];

  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(search.toLowerCase()) ||
      guide.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="w-screen min-h-screen flex flex-col items-center bg-[#f8f9fa] p-0 m-0">
        <div className="w-full max-w-[1200px] mx-auto px-5 flex flex-col items-center">
          <div
            className="w-[85%] relative flex flex-col items-center justify-center rounded-3xl min-h-[500px] max-h-[4000px] mb-6 mt-12 ml-[50px] bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.18)), url('/Figma_photos/1a.jpeg')",
            }}
          >
            <div className="flex flex-col items-center justify-start">
              <h1 className="text-[2.3rem] leading-[1.15] font-extrabold text-center text-[#f8f9fa] tracking-[-1.2px] drop-shadow">
                Explore Local Travel Guides
              </h1>
            </div>
            <div className="w-[435.9px] flex flex-col items-center justify-start text-[11.7px]">
              <p className="text-[1.15rem] leading-[1.5] text-[#f8f9fa] text-center mb-[18px] drop-shadow">
                Find the best guides for your next adventure with detailed
                information.
              </p>
            </div>
            <div className="flex items-center bg-white rounded-full shadow-md px-4 w-full max-w-[480px] my-6 mb-8 border border-[#e8f2e8] transition-[border] h-14 focus-within:ring-2 focus-within:ring-[#179c6a]">
              <div className="w-[22px] h-[60px] opacity-70 mr-2 flex items-center">
                <img
                  src="/Figma_photos/search.svg"
                  alt="search"
                  className="h-[1.5em] w-auto block"
                />
              </div>
              <div className="flex-1 flex items-center">
                <input
                  className="w-full bg-transparent outline-none text-[1.15rem] text-[#222] py-5"
                  type="text"
                  placeholder="Search for guides, destinations, or services"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search for guides, destinations, or services"
                />
              </div>
            </div>
          </div>

          <div className="w-full box-border text-[16.09px]">
            <b className="block text-right text-[1.5rem] font-extrabold tracking-[0.02em] text-[#1c170d] mb-[18px]">
              Available Travel Guides
            </b>
          </div>

          <div className="w-full flex flex-col gap-8 my-8 items-center">
            {filteredGuides.map((g, idx) => (
              <div
                key={idx}
                onClick={onCardClick}
                className="group flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-md min-w-0 max-w-[900px] w-full mx-auto transition hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] overflow-hidden border border-[#f2f2f2] cursor-pointer"
              >
                <img
                  alt={g.title}
                  src={g.image}
                  className="w-full md:w-[220px] h-[180px] md:h-[200px] object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none flex-shrink-0"
                />
                <div className="flex-1 w-full flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-8 gap-3 md:gap-8">
                  <div className="text-left">
                    <b className="text-[1.3rem] font-bold text-[#1c170d] mb-2 block">
                      {g.title}
                    </b>
                    <div className="text-left">
                      <div className="text-[#a1824a] text-[1.05rem] mb-1">
                        Service Area: {g.area}
                      </div>
                      <div className="text-[#a1824a] text-[1rem]">
                        Fare: {g.fare} | Timing: {g.timing}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bg-[#abb79a] text-[#f5f2f2] rounded-xl px-5 py-2 font-semibold text-[1.15rem] cursor-pointer transition hover:bg-[#6ab187] text-center whitespace-nowrap w-full md:w-auto"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllGuides;
