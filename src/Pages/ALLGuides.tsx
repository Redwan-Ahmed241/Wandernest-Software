import { FunctionComponent, useCallback, useState } from "react";
// Tailwind CSS used for all styling. Centralized color theme via tailwind.config.js
import { useNavigate } from "react-router-dom";
import Layout from "../App/Layout";
const AllGuides: FunctionComponent = () => {
  const [search, setSearch] = useState("");
  const _navigate = useNavigate();
  const onDepth4FrameClick = useCallback(() => {
    // Add your code here
  }, []);

  // Dummy guides data (replace with real data as needed)
  const guides = [
    {
      title: "Guide for Sundarban Area",
      area: "Forestr",
      fare: "$50/hour",
      timing: "9 AM - 6 PM",
      image: "/figma_photos/deer.jpg",
    },
    {
      title: "Guide for Rangamati",
      area: "Mountain Regions",
      fare: "$60/hour",
      timing: "8 AM - 4 PM",
      image: "/figma_photos/rangamati01-1.jpg",
    },
    {
      title: "Guide for Bandarban",
      area: "Springs, Hills, Jungle",
      fare: "$60/hour",
      timing: "8 AM - 4 PM",
      image: "/figma_photos/aboutUsHero.jpg",
    },
  ];
  const filteredGuides = guides.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className={styles.allGuides}>
        <div className={styles.localGuideParent}>
          <div className={styles.depth2Frame1}>
            <div className={styles.depth8Frame0}>
              <div className={styles.exploreLocalTravel}>
                Explore Local Travel Guides
              </div>
            </div>
            <div className={styles.depth8Frame1}>
              <div className={styles.findTheBest}>
                Find the best guides for your next adventure with detailed
                information.
              </div>
            </div>
            <div className={styles.depth8Frame01}>
              <img
                className={styles.depth9Frame0}
                alt="search"
                src="/figma_photos/search.svg"
              />
              <div className={styles.depth9Frame1}>
                <input
                  className={styles.searchForGuides}
                  type="text"
                  placeholder="Search for guides, destinations, or services"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search for guides, destinations, or services"
                />
              </div>
            </div>
          </div>
          <div className={styles.depth4Frame12}>
            <b className={styles.availableTravelGuides}>
              Available Travel Guides
            </b>
          </div>
          <div className={styles.depth4Frame2}>
            {filteredGuides.map((g, idx) => (
              <div
                className={styles.depth5Frame03}
                key={idx}
                onClick={onDepth4FrameClick}
              >
                <img
                  className={styles.depth6Frame03}
                  alt={g.title}
                  src={g.image}
                />
                <div className={styles.depth6Frame1}>
                  <div className={styles.depth7Frame01}>
                    <b className={styles.cardTitle}>{g.title}</b>
                  </div>
                  <div className={styles.depth7Frame11}>
                    <div className={styles.cardDetails}>
                      Service Area: {g.area}
                    </div>
                    <div className={styles.cardDetails}>
                      Fare: {g.fare} | Timing: {g.timing}
                    </div>
                    <div className={styles.depth8Frame11}>
                      <div className={styles.depth6Frame0}>
                        <div className={styles.viewDetails}>View Details</div>
                      </div>
                    </div>
                  </div>
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
