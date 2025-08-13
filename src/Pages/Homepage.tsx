"use client"

import { type FunctionComponent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../App/Layout"

const FEATURED_API_URL = "https://wander-nest-ad3s.onrender.com/api/home/destinations/"

interface Destination {
  id: number
  name: string
  description: string
  image_url: string
}

const Homepage: FunctionComponent = () => {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(FEATURED_API_URL)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setDestinations(data)
      } catch (err) {
        console.error("Error fetching destinations:", err)
        setError("Failed to load destinations. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  const handleCardClick = (place: Destination) => {
    navigate(`/destination/${place.id}`)
  }

  return (
    <Layout>
      <main className="w-full flex flex-col items-center bg-gradient-to-br from-[#f7fcfc] to-[#f7fcfc] pb-15">
        <div className="relative rounded-[17px] h-[340px] bg-cover bg-no-repeat bg-top min-h-[600px] w-full max-w-[1140px] mx-auto px-4 flex items-center justify-center" style={{backgroundImage: "url('/Figma_photoes/homebg.jpg')"}}>
          <div className="w-full h-full flex flex-col justify-center items-center px-5">
            <div className="text-[48px] md:text-[48px] sm:text-[36px] font-extrabold text-white z-[1] text-center mb-4">Explore Bangladesh with WanderNest</div>
            <div className="">
              <div className="text-[20px] leading-7 text-white z-[1] max-w-[720px] text-center">
                Discover the beauty and culture of Bangladesh with our tailored travel services.
              </div>
            </div>
          </div>
        </div>

        <div className="w-full py-15 px-10 bg-white z-[2] text-center">
          <h2 className="text-[32px] font-bold mb-10 text-[#073535]">Featured Destinations</h2>
          {error && <div className="text-red-500 mb-3">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left px-5 max-w-[1200px] mx-auto">
            {destinations.map((place, index) => (
              <div
                key={place.id || index}
                className="bg-[#f8f9fa] rounded-2xl overflow-hidden shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:scale-[1.03] cursor-pointer flex flex-col"
                onClick={() => handleCardClick(place)}
              >
                <img
                  src={place.image_url}
                  alt={place.name}
                  className="w-full h-[180px] object-cover"
                />
                <div className="p-4 flex flex-col gap-2">
                  <div className="text-[20px] font-semibold flex justify-between items-center">{place.name}</div>
                  <div className="text-sm text-[#444]">{place.description}</div>
                </div>
              </div>
            ))}
            {loading && <div className="col-span-full text-center">Loading destinations...</div>}
          </div>
        </div>

        <div className="w-full py-10 px-5 bg-white text-center">
          <b className="text-[32px] leading-10 font-bold text-[#073535] text-center mb-2 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-15 after:h-[3px] after:bg-gradient-to-r after:from-[#007e6a] after:to-[#00a884] after:rounded-[2px]">Our Services</b>
        </div>

        <div className="w-full py-5 px-5 bg-white">
          <div className="flex flex-wrap gap-5 justify-center">
            {[
              { icon: "/Figma_photoes/visa.svg", title: "Visa Assistance", desc: "Fast and reliable visa processing" },
              { icon: "/Figma_photoes/tp.svg", title: "Travel Planner", desc: "Customize your perfect trip" },
              { icon: "/Figma_photoes/em.svg", title: "Emergency Support", desc: "24/7 assistance during your travels" }
            ].map((service, index) => (
              <div key={index} className="w-[300px] bg-white border border-[#e8f2f2] rounded-2xl p-6 flex flex-col gap-4 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:border-[#007e6a] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#007e6a] before:to-[#00a884] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100">
                <img className="w-12 h-12 object-contain mb-2" alt="" src={service.icon} />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="text-[20px] font-bold text-[#073535] mb-1">
                    <b>{service.title}</b>
                  </div>
                  <div className="text-[15px] text-[#666] leading-[22px] font-normal">
                    {service.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Homepage