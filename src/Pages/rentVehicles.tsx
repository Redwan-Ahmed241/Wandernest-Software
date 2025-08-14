import { FunctionComponent, useCallback, useState } from "react";
import styles from "../Styles/rentVehicles.module.css";
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
      <div className={styles.rentVehicles}>
        <div className={styles.depth0Frame0}>
          <div className={styles.depth1Frame0}>
            <div className={styles.depth3Frame01}>
              <div className={styles.depth4Frame02}>
                <div className={styles.depth5Frame02}>
                  <div className={styles.depth6Frame02}>
                    <div className={styles.depth7Frame0}>
                      <div className={styles.depth8Frame0}>
                        <div className={styles.exploreTheWorld}>
                          Explore the World with WanderNest
                        </div>
                      </div>
                      <div className={styles.depth8Frame1}>
                        <div className={styles.findThePerfect}>
                          Find the perfect rental car for your journey.
                        </div>
                      </div>
                    </div>
                    <div className={styles.searchBarContainer}>
                      <img
                        src="/figma_photos/search.svg"
                        alt="search"
                        className={styles.searchIconInside}
                      />
                      <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search vehicles, brands, or types..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      {search && filteredVehicles.length > 0 && (
                        <div className={styles.searchDropdown}>
                          {filteredVehicles.map((v, idx) => (
                            <div className={styles.searchResult} key={idx}>
                              <img
                                src={v.image}
                                alt={v.name}
                                className={styles.searchResultImg}
                              />
                              <div>
                                <div className={styles.searchResultName}>
                                  {v.name}
                                </div>
                                <div className={styles.searchResultDesc}>
                                  {v.description}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.depth4Frame12}>
                <b className={styles.featuredVehicles}>Featured Vehicles</b>
              </div>
              <div className={styles.vehicleCardsGrid}>
                <div className={styles.vehicleCard}>
                  <img
                    className={styles.vehicleImage}
                    alt="SUV Rentals"
                    src="/figma_photos/landA.jpeg"
                  />
                  <div className={styles.vehicleCardContent}>
                    <div className={styles.suvRentals}>SUV Rentals</div>
                    <div className={styles.comfortableSuvsFor}>
                      Comfortable SUVs for any terrain
                    </div>
                  </div>
                </div>
                <div className={styles.vehicleCard}>
                  <img
                    className={styles.vehicleImage}
                    alt="Luxury Cars"
                    src="/figma_photos/landB.jpg"
                  />
                  <div className={styles.vehicleCardContent}>
                    <div className={styles.suvRentals}>Luxury Cars</div>
                    <div className={styles.comfortableSuvsFor}>
                      Premium cars for special occasions
                    </div>
                  </div>
                </div>
                <div className={styles.vehicleCard}>
                  <img
                    className={styles.vehicleImage}
                    alt="Economy Options"
                    src="/figma_photos/Eco.jpg"
                  />
                  <div className={styles.vehicleCardContent}>
                    <div className={styles.suvRentals}>Economy Options</div>
                    <div className={styles.comfortableSuvsFor}>
                      Affordable cars for daily use
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.depth4Frame12}>
                <b className={styles.featuredVehicles}>Our Services</b>
              </div>
              <div className={styles.depth4Frame2}>
                <div className={styles.depth5Frame03}>
                  <div className={styles.depth6Frame04}>
                    <img
                      className={styles.depth7Frame04}
                      alt="Customer Support"
                      src="/figma_photos/cust.svg"
                    />
                    <div className={styles.depth7Frame14}>
                      <div className={styles.depth8Frame05}>
                        <b className={styles.customerSupport}>
                          24/7 Customer Support
                        </b>
                      </div>
                      <div className={styles.depth8Frame11}>
                        <div className={styles.comfortableSuvsFor}>
                          Always here to assist you
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.depth6Frame04}>
                    <img
                      className={styles.depth7Frame04}
                      alt="Flexible Booking"
                      src="/figma_photos/booking.svg"
                    />
                    <div className={styles.depth7Frame14}>
                      <div className={styles.depth8Frame05}>
                        <b className={styles.customerSupport}>
                          Flexible Booking
                        </b>
                      </div>
                      <div className={styles.depth8Frame11}>
                        <div className={styles.comfortableSuvsFor}>
                          Adjust your plans anytime
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.depth6Frame04}>
                    <img
                      className={styles.depth7Frame04}
                      alt="Insurance Coverage"
                      src="/figma_photos/umb.svg"
                    />
                    <div className={styles.depth7Frame14}>
                      <div className={styles.depth8Frame05}>
                        <b className={styles.customerSupport}>
                          Insurance Coverage
                        </b>
                      </div>
                      <div className={styles.depth8Frame11}>
                        <div className={styles.comfortableSuvsFor}>
                          Drive worry-free with full coverage
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.depth3Frame11}>
              <div className={styles.depth4Frame03} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RentVehicles;
