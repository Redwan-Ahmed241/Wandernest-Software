import React, { useState } from "react";
import Layout from "../components/Layout";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const activities = [
  {
    title: "Visit Cox's Bazar Beach",
    time: "10:00 AM",
    image: "/figma_photos/coxsbazar.jpg",
    description: "Enjoy the world's longest sea beach.",
    icon: "🏖️",
    category: "Beach"
  },
  {
    title: "St. Martin's Island Trip",
    time: "2:00 PM",
    image: "/figma_photos/Saint-Martin.jpg",
    description: "Unwind on the only coral island of Bangladesh.",
    icon: "🏝️",
    category: "Island"
  },
  {
    title: "Explore Sundarbans",
    time: "8:00 AM",
    image: "/figma_photos/sundarban.jpg",
    description: "Discover the world's largest mangrove forest.",
    icon: "🌿",
    category: "Nature"
  },
];

const PlanATrip: React.FC = () => {
  // Calendar state
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

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

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const toggleActivity = (activityTitle: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityTitle)
        ? prev.filter(a => a !== activityTitle)
        : [...prev, activityTitle]
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Plan Your Perfect Trip
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create unforgettable memories with our curated travel experiences in Cox's Bazar
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Calendar Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Travel Date</h2>
                <p className="text-gray-600">Choose when you'd like to start your adventure</p>
              </div>

              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePrevMonth}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <span className="text-gray-600">←</span>
                </button>
                <h3 className="text-xl font-semibold text-gray-900">
                  {monthNames[calendarMonth]} {calendarYear}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <span className="text-gray-600">→</span>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-12"></div>
                ))}

                {/* Calendar days */}
                {daysArray.map((day) => {
                  const isToday = day === today.getDate() && calendarMonth === today.getMonth() && calendarYear === today.getFullYear();
                  const isSelected = selectedDay === day;
                  const isPast = new Date(calendarYear, calendarMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                  return (
                    <button
                      key={day}
                      onClick={() => !isPast && setSelectedDay(day)}
                      disabled={isPast}
                      className={`h-12 rounded-lg font-medium transition-all duration-200 ${isPast
                        ? "text-gray-300 cursor-not-allowed"
                        : isSelected
                          ? "bg-primary text-white shadow-lg scale-105"
                          : isToday
                            ? "bg-blue-100 text-blue-600 border-2 border-blue-300"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {selectedDay && (
                <div className="mt-6 p-4 bg-primary bg-opacity-10 rounded-xl border border-primary border-opacity-20">
                  <p className="text-center text-primary font-medium">
                    Selected: {monthNames[calendarMonth]} {selectedDay}, {calendarYear}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Itinerary */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Today's Itinerary</h2>
                <p className="text-gray-600">Suggested activities for your perfect day</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xl text-white">🏖️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Beach Walk</h3>
                    <p className="text-sm text-gray-600">8:00 AM</p>
                    <p className="text-sm text-gray-500">Enjoy a morning walk along the world's longest sea beach.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xl text-white">🍽️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Seafood Lunch</h3>
                    <p className="text-sm text-gray-600">1:00 PM</p>
                    <p className="text-sm text-gray-500">Taste fresh seafood at a local Cox's Bazar eatery.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xl text-white">🚤</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Boat Ride</h3>
                    <p className="text-sm text-gray-600">4:00 PM</p>
                    <p className="text-sm text-gray-500">Take a scenic boat ride to see the sunset from the water.</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-8 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold text-lg py-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <span className="mr-2">🚀</span>
                Start Planning!
              </button>
            </div>
          </div>

          {/* Activities Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Recommended Activities
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the best experiences Cox's Bazar has to offer
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity, idx) => {
                const isSelected = selectedActivities.includes(activity.title);
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 ${isSelected
                      ? "border-primary shadow-xl"
                      : "border-gray-100 hover:border-gray-200 hover:shadow-xl"
                      }`}
                    onClick={() => toggleActivity(activity.title)}
                  >
                    <div className="relative">
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                          {activity.category}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <span className="text-lg">{activity.icon}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary bg-opacity-20 flex items-center justify-center">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-2xl text-white">✓</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{activity.title}</h3>
                        <span className="text-sm font-medium text-primary bg-primary bg-opacity-10 px-3 py-1 rounded-full">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{activity.description}</p>
                      <button
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${isSelected
                          ? "bg-primary text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        {isSelected ? "Added to Itinerary" : "Add to Itinerary"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Activities Summary */}
          {selectedActivities.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Your Selected Activities ({selectedActivities.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {selectedActivities.map((activityTitle, idx) => {
                  const activity = activities.find(a => a.title === activityTitle);
                  return (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-primary bg-opacity-10 rounded-xl border border-primary border-opacity-20">
                      <span className="text-2xl">{activity?.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{activityTitle}</h4>
                        <p className="text-sm text-gray-600">{activity?.time}</p>
                      </div>
                      <button
                        onClick={() => toggleActivity(activityTitle)}
                        className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-all duration-200"
                      >
                        <span className="text-red-600">×</span>
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="text-center">
                <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  <span className="mr-2">🎯</span>
                  Finalize Your Trip Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PlanATrip;