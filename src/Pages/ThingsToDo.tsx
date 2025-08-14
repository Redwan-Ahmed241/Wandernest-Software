"use client"
import React, { useCallback,useState } from 'react';
import { FunctionComponent } from 'react';
import Footer from '../Components/Footer';
import { useAuth } from '../Authentication/auth-context';
import ProfileDropdown from "../Components/profile-dropdown";
import { Bell } from 'react-feather'
import Layout from '../App/Layout';


const cardData = [
  {
    title: 'Explore the Sundarbans Mangrove Forest',
    location: 'Khulna',
    description: `Immerse yourself in the lush green beauty of the Sundarbans, the world's largest mangrove forest. Capture stunning photos of diverse flora and fauna, and experience nature's tranquil essence.`,
    image: '/Figma_photoes/mangrove.jpg',
    category: 'Nature',
  },
  {
    title: 'Savor Street Food in Old Dhaka',
    location: 'Dhaka',
    description: 'Indulge in a culinary adventure through the vibrant streets of Old Dhaka. Sample local delicacies like biryani, kebabs, and flavorful chutneys.',
    image: '/Figma_photoes/puran_dhaka.jpg',
    category: 'Food',
  },
  {
    title: 'Discover Historical Sites at Lalbagh Fort',
    location: 'Dhaka',
    description: 'Journey through time within the ancient walls of Lalbagh Fort, a historical Mughal-era structure. Marvel at intricate architecture, gardens, and artifacts.',
    image: '/Figma_photoes/lalbagh.jpg',
    category: 'Culture',
  },
  {
    title: 'Boat Trip on the Buriganga River',
    location: 'Dhaka',
    description: `Take a scenic boat trip on the Buriganga River, offering captivating views of Dhaka's cityscape. Experience the hustle and bustle of river life.`,
    image: '/Figma_photoes/burigangha.jpg',
    category: 'Adventure',
  },
  {
    title: `Relax at Cox's Bazar Beach`,
    location: `Cox's Bazar`,
    description: `Find peace and rejuvenation on the golden sands of Cox's Bazar, one of the world's longest natural beaches. Relax by the sea, and soak in the coastal atmosphere.`,
    image: '/Figma_photoes/coxsbazar.jpg',
    category: 'Nature',
  },
  {
    title: 'Experience Traditional Cuisine in a Local Eatery',
    location: 'Dhaka',
    description: 'Treat yourself to a delightful culinary adventure in a traditional Bangladeshi eatery. Relish the rich flavors of local dishes like hilsa fish curry and various vegetable preparations.',
    image: '/Figma_photoes/local_cuisine.jpeg',
    category: 'Food',
  },
  {
    title: 'Visit the National Museum of Bangladesh',
    location: 'Dhaka',
    description: `Step into the cultural heritage of Bangladesh at the National Museum in Dhaka. Wander through exhibits showcasing art, history, and the nation's rich past.`,
    image: '/Figma_photoes/museum.jpeg',
    category: 'Culture',
  },
  {
    title: 'Cycle through the Countryside',
    location: 'Dhaka',
    description: `Embark on a picturesque cycling tour through the serene countryside surrounding Dhaka. Witness rural life, lush green fields, and local villages as you ride.`,
    image: '/Figma_photoes/cycling.jpg',
    category: 'Adventure',
  },
];

const filterCategories = ['Nature', 'Food', 'Culture', 'Adventure', 'All'];

const ThingsToDo: FunctionComponent = () => {
  const [activityQuery, setActivityQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  // Filtering logic
  const filteredCards = cardData.filter(card => {
    const matchesCategory = selectedCategory === 'All' || card.category === selectedCategory;
    const matchesActivity = activityQuery.trim() === '' || card.title.toLowerCase().includes(activityQuery.toLowerCase()) || card.description.toLowerCase().includes(activityQuery.toLowerCase());
    const matchesLocation = locationQuery.trim() === '' || card.location.toLowerCase().includes(locationQuery.toLowerCase());
    return matchesCategory && matchesActivity && matchesLocation;
  });

  // Handler for pill label click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  // Handler for activity search (real-time)
  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivityQuery(e.target.value);
  };

  // Handler for location search (real-time)
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationQuery(e.target.value);
  };

  const onDepth4FrameClick = () => {
    // Handle navigation if needed
  };
   const goHome = useCallback(() => {
    navigate("/")
  }, [navigate])
   const { isAuthenticated, loading } = useAuth()

  return (
    <Layout>
      <div className={styles.thingsToDo}>
        <div className={styles.depth0Frame0}>
          <div className={styles.depth1Frame0}>
            <div className={styles.depth2Frame0}>
              <div className={styles.depth3Frame0}>
                <div className={styles.depth4Frame0} onClick={() => navigate('/homepage')}>
                  <img className={styles.depth5Frame0} alt="" src="/Figma_photoes/wandernest.svg" />
                  <div className={styles.depth5Frame1}>
                    <b className={styles.wandernest}>WanderNest</b>
                  </div>
                </div>
                <div className={styles.depth4Frame1}>
                  <div className={styles.depth5Frame01} onClick={onDepth4FrameClick}>
                    <div className={styles.stay}>Stay</div>
                  </div>
                  <div className={styles.depth5Frame01} onClick={onDepth4FrameClick}>
                    <div className={styles.stay}>Eat</div>
                  </div>
                </div>
              </div>
               <div className={styles.navbarWrapper}>
      <div className={styles.navbar}>
        <div className={styles.depth3Frame0}>
          <img className={styles.depth4Frame0} alt="Logo" src="/Figma_photoes/wandernest.svg" />
          <div className={styles.depth4Frame1} onClick={goHome}>
            <b className={styles.wandernest}>WanderNest</b>
          </div>
        </div>

        <div className={styles.depth3Frame1}>
          <div className={styles.depth4Frame01}>
            <div className={styles.depth4Frame1} onClick={() => navigate("/destinations")}>
              <div className={styles.destinations}>Destinations</div>
            </div>
            <div className={styles.depth4Frame1} onClick={() => navigate("/hotels-rooms")}>
              <div className={styles.destinations}>Hotels</div>
            </div>
            <div className={styles.depth5Frame2} title="This feature is coming soon!">
  <div className={styles.flights} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#999', cursor: 'not-allowed' }}>
    Flights
    <span style={{
      backgroundColor: '#ff9800',
      color: 'white',
      fontSize: '0.65rem',
      padding: '2px 6px',
      borderRadius: '6px',
      textTransform: 'uppercase'
    }}>
      Upcoming
    </span>
  </div>
</div>

            <div className={styles.depth4Frame1} onClick={() => navigate("/Packages")}>
              <div className={styles.destinations}>Packages</div>
            </div>
          </div>

          <div className={styles.depth4Frame11}>
            {!loading && (
              <>
                {isAuthenticated ? (
                  // Show profile dropdown when authenticated
                  <ProfileDropdown />
                ) : (
                  // Show login/signup buttons when not authenticated
                  <>
                    <div className={styles.depth5Frame01} onClick={() => navigate("/signup")}>
                      <div className={styles.depth6Frame0}>
                        <b className={styles.signUp}>Sign up</b>
                      </div>
                    </div>
                    <div className={styles.depth5Frame11} onClick={() => navigate("/login")}>
                      <div className={styles.depth6Frame0}>
                        <b className={styles.signUp}>Log in</b>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            <span title="Notifications">
              <Bell size={26} style={{ marginLeft: 16, color: '#FFD700', verticalAlign: 'middle', cursor: 'pointer' }} />
            </span>
          </div>
        </div>
      </div>
    </div>
            </div>
            <div className={styles.depth2Frame1}>
              <div className={styles.depth3Frame01}>
                <div className={styles.depth4Frame02}>
                  <b className={styles.thingsToDo1}>Things to do</b>
                </div>
                <div className={styles.depth4Frame12}>
                  {/* Search for Activities */}
                  <div className={styles.searchLabel}>Search for activities</div>
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      value={activityQuery}
                      onChange={handleActivityChange}
                      placeholder="e.g., hiking, museums"
                      className={styles.searchInput}
                    />
                    <button className={styles.searchButton} type="button">Search</button>
                  </div>
                  {/* Search for Locations */}
                  <div className={styles.searchLabel}>Select location</div>
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={handleLocationChange}
                      placeholder="e.g., Dhaka, Cox's Bazar"
                      className={styles.searchInput}
                    />
                    <button className={styles.searchButton} type="button">Search</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        {/* Pill-shaped filter labels as buttons */}
        <div className={styles.pillFilterRow}>
          {filterCategories.map(cat => (
            <div
              key={cat}
              className={cat === selectedCategory ? styles.activePill : styles.pill}
              onClick={() => handleCategoryClick(cat)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              {cat}
            </div>
          ))}
        </div>
        {/* Card Grid Section */}
        <div className={styles.cardGrid}>
          {filteredCards.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: 32 }}>No activities found.</div>
          ) : (
            filteredCards.map((card, idx) => (
              <div className={styles.depth6Frame07} key={idx}>
                <img className={styles.cardImage} alt="" src={card.image} />
                <div className={styles.cardContent}>
                  <div className={styles.cardTitle}>{card.title}</div>
                  <div className={styles.cardLocation}>{card.location}</div>
                  <div className={styles.immerseYourselfIn}>{card.description}</div>
                </div>
              </div>
            ))
          )}
        </div>
        <Footer />
      </div>
    </Layout>
  );
};

export default ThingsToDo;