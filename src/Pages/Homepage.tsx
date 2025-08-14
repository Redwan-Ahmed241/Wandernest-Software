"use client"

import { type FunctionComponent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../Styles/Homepage.module.css"
import Layout from "../App/Layout"

const FEATURED_API_URL = "https://wander-nest-ad3s.onrender.com/api/home/destinations/"
const _MEDIA_BASE = "https://wander-nest-ad3s.onrender.com"

const HomePage: FunctionComponent = () => {
  const [destinations, setDestinations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true)
      setError("")
      try {
        const response = await fetch(FEATURED_API_URL)
        if (!response.ok) throw new Error("Failed to fetch destinations")
        const data = await response.json()
        // Sort by click count descending and take top 5
        const sorted = (Array.isArray(data) ? data : []).sort((a, b) => (b.click || 0) - (a.click || 0)).slice(0, 5)
        setDestinations(sorted)
      } catch (err: any) {
        setError(err.message || "Error fetching destinations")
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  const incrementDestinationClick = async (id: number) => {
    try {
      await fetch(`https://wander-nest-ad3s.onrender.com/api/home/destinations/${id}/click/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      // Optionally handle error
    }
  }

  const handleCardClick = async (dest: any) => {
    await incrementDestinationClick(dest.id);
    // TODO: update to dynamic route if available
    navigate("/destination-01")
  }

  return (
    <Layout>
      <main className={styles.homePage}>
        <div className={styles.depth6Frame02}>
          <div className={styles.heroContentWrapper}>
            <div className={styles.exploreBangladeshWith}>Explore Bangladesh with WanderNest</div>
            <div className={styles.depth7Frame0}>
              <div className={styles.discoverTheBeauty}>
                Discover the beauty and culture of Bangladesh with our tailored travel services.
              </div>
            </div>
          </div>
        </div>

        <div className={styles.Destinations}>
          <h2 className={styles.sectionTitle}>Featured Destinations</h2>
          {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
          <div className={styles.destinationsGrid}>
            {destinations.map((place, index) => (
              <div
                key={place.id || index}
                className={styles.destinationCard}
                onClick={() => handleCardClick(place)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={place.image_url}
                  alt={place.name}
                  className={styles.destinationImage}
                />
                <div className={styles.destinationContent}>
                  <div className={styles.destinationTitle}>{place.name}</div>
                  <div className={styles.destinationDescription}>{place.description}</div>
                </div>
              </div>
            ))}
            {loading && <div style={{ gridColumn: "1/-1", textAlign: "center" }}>Loading destinations...</div>}
          </div>
        </div>

        <div className={styles.depth4Frame12}>
          <b className={styles.featuredDestinations}>Our Services</b>
        </div>

        <div className={styles.depth4Frame4}>
          <div className={styles.depth5Frame04}>
            <div className={styles.depth6Frame04}>
              <img className={styles.depth7Frame05} alt="" src="/Figma_photoes/visa.svg" />
              <div className={styles.depth7Frame14}>
                <div className={styles.depth8Frame04}>
                  <b className={styles.visaAssistance}>Visa Assistance</b>
                </div>
                <div className={styles.depth7Frame1}>
                  <div className={styles.exploreLushTea}>Fast and reliable visa processing</div>
                </div>
              </div>
            </div>

            <div className={styles.depth6Frame04}>
              <img className={styles.depth7Frame05} alt="" src="/Figma_photoes/tp.svg" />
              <div className={styles.depth7Frame14}>
                <div className={styles.depth8Frame04}>
                  <b className={styles.visaAssistance}>Travel Planner</b>
                </div>
                <div className={styles.depth7Frame1}>
                  <div className={styles.exploreLushTea}>Customize your perfect trip</div>
                </div>
              </div>
            </div>

            <div className={styles.depth6Frame04}>
              <img className={styles.depth7Frame05} alt="" src="/Figma_photoes/em.svg" />
              <div className={styles.depth7Frame14}>
                <div className={styles.depth8Frame04}>
                  <b className={styles.visaAssistance}>Emergency Support</b>
                </div>
                <div className={styles.depth7Frame1}>
                  <div className={styles.exploreLushTea}>24/7 assistance during your travels</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default HomePage
