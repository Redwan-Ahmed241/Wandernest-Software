import React, { useState } from "react";
// Tailwind conversion: removed CSS module import
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
  // Calendar state
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
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

  return (
    <Layout>
      <div className="min-h-screen bg-theme-bg flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-bold text-theme-primary mb-2">Plan a Trip to Cox's Bazar</h1>
            <p className="text-lg text-theme-secondary">Select your travel dates and explore recommended activities!</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <main className="flex-1">
              {/* Calendar & Activities */}
              <section className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Calendar */}
                <div className="bg-theme-light rounded-xl shadow p-6 flex flex-col items-center min-w-[320px] max-w-[400px] flex-1">
                  <h3 className="font-bold text-xl text-theme-primary mb-4">Select Your Dates</h3>
                  <div className="grid grid-cols-7 gap-2 w-full">
                    {/* Render empty days for firstDayOfWeek */}
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                      <span key={"empty-" + i} className="" />
                    ))}
                    {/* Render days in month */}
                    {daysArray.map((day) => (
                      <span
                        key={day}
                        className={`cursor-pointer px-3 py-2 rounded-lg text-theme-primary font-semibold transition-all duration-150 ${selectedDay === day ? 'bg-theme-accent text-white' : 'bg-theme-bg hover:bg-theme-accent/20'}`}
                        onClick={() => setSelectedDay(day)}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Suggested Activities Section */}
                <div className="min-w-[320px] flex-1 max-w-[400px]">
                  <h3 className="font-bold text-xl text-theme-primary mb-4">Suggested Activities in Cox's Bazar</h3>
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-4">
                      <div className="bg-theme-light rounded-xl p-3 flex items-center justify-center">
                        <img src="/figma_photos/plan.svg" alt="Beach" className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="font-semibold text-theme-primary">Beach Walk</div>
                        <div className="text-theme-accent text-base">8:00 AM</div>
                        <div className="text-gray-600 text-base">Enjoy a morning walk along the world's longest sea beach.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-theme-light rounded-xl p-3 flex items-center justify-center">
                        <img src="/figma_photos/restaurant.svg" alt="Seafood" className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="font-semibold text-theme-primary">Seafood Lunch</div>
                        <div className="text-theme-accent text-base">1:00 PM</div>
                        <div className="text-gray-600 text-base">Taste fresh seafood at a local Cox's Bazar eatery.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-theme-light rounded-xl p-3 flex items-center justify-center">
                        <img src="/figma_photos/explore.svg" alt="Boat Ride" className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="font-semibold text-theme-primary">Boat Ride</div>
                        <div className="text-theme-accent text-base">4:00 PM</div>
                        <div className="text-gray-600 text-base">Take a scenic boat ride to see the sunset from the water.</div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="mt-7 w-full bg-theme-accent text-white rounded-xl font-bold text-lg py-3 shadow transition-colors duration-200 hover:bg-theme-accent-dark"
                  >
                    Go for it!
                  </button>
                </div>
              </section>
              {/* Activities Grid */}
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-theme-primary mb-6">Recommended Activities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {activities.map((act, idx) => (
                    <div
                      className="bg-theme-light rounded-2xl shadow p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow duration-200"
                      key={idx}
                      tabIndex={0}
                    >
                      <img
                        src={act.image}
                        alt={act.title}
                        className="w-24 h-24 object-cover rounded-xl mb-2"
                      />
                      <div className="flex flex-col items-center gap-1">
                        <div className="font-semibold text-theme-primary text-lg">{act.title}</div>
                        <div className="text-theme-accent text-base">{act.time}</div>
                        <div className="text-gray-600 text-center text-base">{act.description}</div>
                        <button className="mt-2 bg-theme-accent text-white rounded-lg px-4 py-2 font-semibold shadow hover:bg-theme-accent-dark transition-colors duration-200">Add to Itinerary</button>
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
                      className="bg-theme-light rounded-2xl shadow p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow duration-200"
                      key={idx}
                      tabIndex={0}
                    >
                      <img
                        src={act.image}
                        alt={act.title}
                        className="w-24 h-24 object-cover rounded-xl mb-2"
                      />
                      <div className="flex flex-col items-center gap-1">
                        <div className="font-semibold text-theme-primary text-lg">{act.title}</div>
                        <div className="text-theme-accent text-base">{act.time}</div>
                        <div className="text-gray-600 text-center text-base">{act.description}</div>
                        <button className="mt-2 bg-theme-accent text-white rounded-lg px-4 py-2 font-semibold shadow hover:bg-theme-accent-dark transition-colors duration-200">Add to Itinerary</button>
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
