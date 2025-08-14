import React, { useState } from "react";
import styles from "../Styles/PlanATrip.module.css";
import Layout from "../App/Layout";
import Sidebar from "./Sidebar";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const activities = [
  {
    title: "Visit Cox's Bazar Beach",
    time: "10:00 AM",
    image: "/figma_photos/coxsbazar.jpg",
    description: "Enjoy the world's longest sea beach.",
  },
  {
    title: "St. Martin's Island Trip",
    time: "2:00 PM",
    image: "/figma_photos/Saint-Martin.jpg",
    description: "Unwind on the only coral island of Bangladesh.",
  },
  {
    title: "Explore Sundarbans",
    time: "8:00 AM",
    image: "/figma_photos/sundarban.jpg",
    description: "Discover the world's largest mangrove forest.",
  },
];

const PlanATrip: React.FC = () => {
  // Sidebar toggle for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Calendar state
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
  // Search state
  const [search, setSearch] = useState("");
  // Active nav
  const [, setActiveNav] = useState(0);

  // Sidebar navigation (dummy)
  const _navItems = [
    { label: "Home", icon: "/figma_photos/homebg.jpg" },
    { label: "My Trips", icon: "/figma_photos/plan.svg" },
    { label: "Explore", icon: "/figma_photos/explore.svg" },
    { label: "Plan a Trip", icon: "/figma_photos/plan.svg" },
    { label: "Flights", icon: "/figma_photos/flight.svg" },
    { label: "Hotels", icon: "/figma_photos/hotel.svg" },
    { label: "Cars", icon: "/figma_photos/car.svg" },
    { label: "Gift Cards", icon: "/figma_photos/gift.svg" },
  ];

  // Calendar navigation
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };
  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  // Sidebar toggle handler
  const _handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
  const _handleNavClick = (idx: number) => setActiveNav(idx);

  return (
    <Layout>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <div className={styles.planATripGrid}>
            {/* Main Content */}
            <main className={styles.mainContentModern}>
              {/* Page Heading */}
              <div style={{ marginBottom: 12 }}>
                <h1
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    color: "#1c170d",
                    margin: 0,
                  }}
                >
                  Plan Your Trip
                </h1>
                <div
                  style={{
                    color: "#a1824a",
                    fontSize: "1.25rem",
                    marginTop: 8,
                  }}
                >
                  Use the trip planner to create a personalized travel
                  experience.
                </div>
              </div>
              {/* Search Bar */}
              <div className={styles.searchBarContainerModern}>
                <img
                  src="/figma_photos/search.svg"
                  alt="search"
                  className={styles.searchIconInside}
                />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search activities, hotels, destinations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className={styles.searchButton}>Search</button>
              </div>
              {/* Calendar and Suggested Activities Row */}
              <section
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 32,
                  marginBottom: 32,
                }}
              >
                {/* Calendar */}
                <div className={styles.calendarContainerModern}>
                  <div className={styles.calendarHeaderRow}>
                    <button
                      onClick={handlePrevMonth}
                      className={styles.calendarNavBtn}
                    >
                      {"<"}
                    </button>
                    <span className={styles.calendarMonthLabel}>
                      {new Date(calendarYear, calendarMonth).toLocaleString(
                        "default",
                        { month: "long", year: "numeric" }
                      )}
                    </span>
                    <button
                      onClick={handleNextMonth}
                      className={styles.calendarNavBtn}
                    >
                      {">"}
                    </button>
                  </div>
                  <div className={styles.calendarWeekdays}>
                    {weekDays.map((d, i) => (
                      <span key={i} className={styles.calendarWeekday}>
                        {d}
                      </span>
                    ))}
                  </div>
                  <div className={styles.calendarGrid}>
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                      <span
                        key={"empty-" + i}
                        className={styles.calendarDayEmpty}
                      ></span>
                    ))}
                    {daysArray.map((day) => (
                      <span
                        key={day}
                        className={
                          styles.calendarDay +
                          (selectedDay === day
                            ? " " + styles.selectedCalendarDay
                            : "")
                        }
                        onClick={() => setSelectedDay(day)}
                        style={{ cursor: "pointer" }}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Suggested Activities Section */}
                <div style={{ minWidth: 320, flex: 1, maxWidth: 400 }}>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      color: "#1c170d",
                      marginBottom: 18,
                    }}
                  >
                    Suggested Activities in Cox's Bazar
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 20,
                    }}
                  >
                    {/* Example activities, you can expand this list */}
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 16 }}
                    >
                      <div
                        style={{
                          background: "#f5f0e5",
                          borderRadius: 12,
                          padding: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src="/figma_photos/plan.svg"
                          alt="Beach"
                          style={{ width: 32, height: 32 }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1c170d" }}>
                          Beach Walk
                        </div>
                        <div style={{ color: "#a1824a", fontSize: "1em" }}>
                          8:00 AM
                        </div>
                        <div style={{ color: "#555", fontSize: "1em" }}>
                          Enjoy a morning walk along the world's longest sea
                          beach.
                        </div>
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 16 }}
                    >
                      <div
                        style={{
                          background: "#f5f0e5",
                          borderRadius: 12,
                          padding: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src="/figma_photos/restaurant.svg"
                          alt="Seafood"
                          style={{ width: 32, height: 32 }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1c170d" }}>
                          Seafood Lunch
                        </div>
                        <div style={{ color: "#a1824a", fontSize: "1em" }}>
                          1:00 PM
                        </div>
                        <div style={{ color: "#555", fontSize: "1em" }}>
                          Taste fresh seafood at a local Cox's Bazar eatery.
                        </div>
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 16 }}
                    >
                      <div
                        style={{
                          background: "#f5f0e5",
                          borderRadius: 12,
                          padding: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src="/figma_photos/explore.svg"
                          alt="Boat Ride"
                          style={{ width: 32, height: 32 }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1c170d" }}>
                          Boat Ride
                        </div>
                        <div style={{ color: "#a1824a", fontSize: "1em" }}>
                          4:00 PM
                        </div>
                        <div style={{ color: "#555", fontSize: "1em" }}>
                          Take a scenic boat ride to see the sunset from the
                          water.
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    style={{
                      marginTop: 28,
                      width: "100%",
                      background: "#008060",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      padding: "14px 0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      cursor: "pointer",
                      transition: "background 0.18s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#00684a")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "#008060")
                    }
                  >
                    Go for it!
                  </button>
                </div>
              </section>
              {/* Activities Grid */}
              <section className={styles.activitiesSection}>
                <h2 className={styles.sectionTitle}>Recommended Activities</h2>
                <div className={styles.activitiesGridModern}>
                  {activities.map((act, idx) => (
                    <div
                      className={styles.activityCardModern}
                      key={idx}
                      tabIndex={0}
                    >
                      <img
                        src={act.image}
                        alt={act.title}
                        className={styles.activityImageModern}
                      />
                      <div className={styles.activityContentModern}>
                        <div className={styles.activityTitle}>{act.title}</div>
                        <div className={styles.activityTime}>{act.time}</div>
                        <div className={styles.activityDesc}>
                          {act.description}
                        </div>
                        <button className={styles.addToItineraryBtnModern}>
                          Add to Itinerary
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlanATrip;
