"use client"

import { type FunctionComponent, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../App/Layout"
import Sidebar from "./Sidebar"
import { useAuth } from "../Authentication/auth-context"

interface PackageOption {
  id: string
  name: string
  description: string
  image: string
  price: number
}

interface CreatePackageData {
  title: string
  from_location: string
  to_location: string
  start_date: string
  end_date: string
  travelers_count: number
  budget: number
  transport_id: string | null
  hotel_id: string | null
  guide_id: string | null
  preferences: {
    skip_transport: boolean
    skip_hotel: boolean
    skip_vehicle: boolean
    skip_guide: boolean
  }
}

const CreatePackage: FunctionComponent = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const today = new Date()

  // Form state
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [travelers, setTravelers] = useState(1)
  const [budget, setBudget] = useState("")
  const [showStartCalendar, setShowStartCalendar] = useState(false)
  const [showEndCalendar, setShowEndCalendar] = useState(false)

  // Package options state
  const [transportOptions, setTransportOptions] = useState<PackageOption[]>([])
  const [hotelOptions, setHotelOptions] = useState<PackageOption[]>([])
  const [guideOptions, setGuideOptions] = useState<PackageOption[]>([])

  // Selection state
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null)
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null)
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null)

  // Skip state
  const [skipTransport, setSkipTransport] = useState(false)
  const [skipHotel, setSkipHotel] = useState(false)
  const [skipGuide, setSkipGuide] = useState(false)

  // Loading and error states
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)
  const [isCreatingPackage, setIsCreatingPackage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calendar state
  const [startCalendarMonth, setStartCalendarMonth] = useState(today.getMonth())
  const [startCalendarYear, setStartCalendarYear] = useState(today.getFullYear())
  const [endCalendarMonth, setEndCalendarMonth] = useState(today.getMonth())
  const [endCalendarYear, setEndCalendarYear] = useState(today.getFullYear())

  // Fetch package options on component mount
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchPackageOptions()
    }
  }, [authLoading, isAuthenticated])

  const fetchPackageOptions = async () => {
    try {
      setIsLoadingOptions(true)
      setError(null)

      const token = localStorage.getItem("token")
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Token ${token}` }),
      }

      // Updated to use your actual API endpoints
      const [transport, hotels, guides] = await Promise.all([
        fetch("https://wander-nest-ad3s.onrender.com/api/packages/transport-options/", { headers }),
        fetch("https://wander-nest-ad3s.onrender.com/api/packages/create/hotel-options/", { headers }),
        fetch("https://wander-nest-ad3s.onrender.com/api/packages/guide-options/", { headers }),
      ])

      const transportData = await transport.json()
      const hotelsData = await hotels.json()
      const guidesData = await guides.json()

      setTransportOptions(transportData.results || transportData)
      setHotelOptions(hotelsData.results || hotelsData)
      setGuideOptions(guidesData.results || guidesData)
    } catch (error) {
      console.error("Error fetching package options:", error)
      setError("Failed to load package options")
    } finally {
      setIsLoadingOptions(false)
    }
  }

  // Calendar utilities
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getDaysArray = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month)
    return Array.from({ length: daysInMonth }, (_, i) => i + 1)
  }

  // Check if date is in the past
  const isPastDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Date handlers with past date validation
  const handleStartDateSelect = (day: number) => {
    if (isPastDate(startCalendarYear, startCalendarMonth, day)) {
      return // Don't allow past dates
    }
    const selectedDate = `${startCalendarYear}-${(startCalendarMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
    setStartDate(selectedDate)
    setShowStartCalendar(false)
  }

  const handleEndDateSelect = (day: number) => {
    if (isPastDate(endCalendarYear, endCalendarMonth, day)) {
      return // Don't allow past dates
    }
    // Also check if end date is before start date
    const selectedEndDate = new Date(endCalendarYear, endCalendarMonth, day)
    const startDateObj = new Date(startDate)
    if (startDate && selectedEndDate <= startDateObj) {
      return // Don't allow end date before or same as start date
    }
    const selectedDate = `${endCalendarYear}-${(endCalendarMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
    setEndDate(selectedDate)
    setShowEndCalendar(false)
  }

  // Calendar navigation functions
  const handleStartPrevMonth = () => {
    if (startCalendarMonth === 0) {
      setStartCalendarMonth(11)
      setStartCalendarYear(startCalendarYear - 1)
    } else {
      setStartCalendarMonth(startCalendarMonth - 1)
    }
  }

  const handleStartNextMonth = () => {
    if (startCalendarMonth === 11) {
      setStartCalendarMonth(0)
      setStartCalendarYear(startCalendarYear + 1)
    } else {
      setStartCalendarMonth(startCalendarMonth + 1)
    }
  }

  const handleEndPrevMonth = () => {
    if (endCalendarMonth === 0) {
      setEndCalendarMonth(11)
      setEndCalendarYear(endCalendarYear - 1)
    } else {
      setEndCalendarMonth(endCalendarMonth - 1)
    }
  }

  const handleEndNextMonth = () => {
    if (endCalendarMonth === 11) {
      setEndCalendarMonth(0)
      setEndCalendarYear(endCalendarYear + 1)
    } else {
      setEndCalendarMonth(endCalendarMonth + 1)
    }
  }

  // Selection handlers
  const handleOptionSelect = (
    optionId: string,
    currentSelection: string | null,
    setSelection: (id: string | null) => void,
    isSkipped: boolean,
  ) => {
    if (!isSkipped) {
      setSelection(currentSelection === optionId ? null : optionId)
    }
  }

  // Skip handlers
  const handleSkip = (
    isSkipped: boolean,
    setSkip: (skip: boolean) => void,
    setSelection: (id: string | null) => void,
  ) => {
    setSkip(!isSkipped)
    if (!isSkipped) setSelection(null)
  }

  // Form validation
  const isFormValid = () => {
    return (
      from.trim() !== "" &&
      to.trim() !== "" &&
      startDate !== "" &&
      endDate !== "" &&
      travelers > 0 &&
      budget.trim() !== "" &&
      new Date(startDate) < new Date(endDate)
    )
  }

  // Package creation
  const handleCreatePackage = async () => {
    if (!isFormValid()) {
      alert("Please fill in all required fields and ensure dates are valid.")
      return
    }

    try {
      setIsCreatingPackage(true)
      setError(null)

      const packageData: CreatePackageData = {
        title: `${from} to ${to} Package`,
        from_location: from,
        to_location: to,
        start_date: startDate,
        end_date: endDate,
        travelers_count: travelers,
        budget: Number.parseFloat(budget),
        transport_id: skipTransport ? null : selectedTransport,
        hotel_id: skipHotel ? null : selectedHotel,
        guide_id: skipGuide ? null : selectedGuide,
        preferences: {
          skip_transport: skipTransport,
          skip_hotel: skipHotel,
          skip_vehicle: false,
          skip_guide: skipGuide,
        },
      }

      // Updated to use your actual create endpoint
      const response = await fetch("https://wander-nest-ad3s.onrender.com/api/packages/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(packageData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const createdPackage = await response.json()
      navigate(`/package/${createdPackage.id}`)
    } catch (error) {
      console.error("Error creating package:", error)
      setError("Failed to create package. Please try again.")
    } finally {
      setIsCreatingPackage(false)
    }
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Layout>
        <div className="flex flex-row min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col items-center justify-center p-10">
            <div>Loading...</div>
          </div>
        </div>
      </Layout>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login")
    return null
  }

  return (
    <Layout>
      <div className="flex flex-row min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-start text-left text-base text-gray-900 font-['Plus_Jakarta_Sans'] bg-white p-5 box-border min-h-screen">
            <div className="w-full max-w-4xl flex flex-col items-center py-8 px-5 mb-6 text-center">
              <div className="text-4xl font-extrabold tracking-tight leading-10 mb-7 mt-0 text-center">Create Your Custom Package</div>

              {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-5 border border-red-200 text-center">
                {error}
              </div>}

              {/* Enhanced Form Section */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl">
                  {/* Row 1: From and To */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      From *
                    </label>
                    <input
                      className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-sm bg-white/90 backdrop-blur-sm transition-all duration-200 ease-out box-border focus:outline-none focus:border-green-600 focus:shadow-[0_0_0_3px_rgba(22,163,74,0.1)] placeholder:text-gray-400"
                      type="text"
                      placeholder="Departure city"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      To *
                    </label>
                    <input
                      className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-sm bg-white/90 backdrop-blur-sm transition-all duration-200 ease-out box-border focus:outline-none focus:border-green-600 focus:shadow-[0_0_0_3px_rgba(22,163,74,0.1)] placeholder:text-gray-400"
                      type="text"
                      placeholder="Destination city"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      required
                    />
                  </div>

                  {/* Row 2: Start Date and End Date */}
                  <div className="flex flex-col gap-1.5 relative">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Start Date *
                    </label>
                    <input
                      className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-sm bg-white/90 backdrop-blur-sm transition-all duration-200 ease-out box-border focus:outline-none focus:border-green-600 focus:shadow-[0_0_0_3px_rgba(22,163,74,0.1)] placeholder:text-gray-400 cursor-pointer"
                      type="text"
                      placeholder="Select start date"
                      value={startDate}
                      readOnly
                      onClick={() => setShowStartCalendar(!showStartCalendar)}
                      required
                      style={{ cursor: "pointer" }}
                    />
                    {showStartCalendar && (
                      <div className="absolute z-20 bg-white border-2 border-green-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-4 mt-2 top-full">
                        <div className="font-semibold mb-3 text-center flex items-center justify-between text-green-600">
                          <button
                            type="button"
                            onClick={handleStartPrevMonth}
                            className="bg-none border-none cursor-pointer text-lg py-2 px-3 rounded-lg transition-colors duration-200 text-green-600 hover:bg-green-50"
                          >
                            ←
                          </button>
                          <span>
                            {new Date(startCalendarYear, startCalendarMonth).toLocaleString("default", {
                              month: "long",
                            })}{" "}
                            {startCalendarYear}
                          </span>
                          <button
                            type="button"
                            onClick={handleStartNextMonth}
                            className="bg-none border-none cursor-pointer text-lg py-2 px-3 rounded-lg transition-colors duration-200 text-green-600 hover:bg-green-50"
                          >
                            →
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {getDaysArray(startCalendarYear, startCalendarMonth).map((day) => {
                            const isDisabled = isPastDate(startCalendarYear, startCalendarMonth, day)
                            return (
                              <div
                                key={day}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors duration-200 text-sm ${isDisabled ? "text-gray-300 cursor-not-allowed bg-gray-50 hover:bg-gray-50" : "hover:bg-green-100"}`}
                                onClick={() => !isDisabled && handleStartDateSelect(day)}
                              >
                                {day}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 relative">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      End Date *
                    </label>
                    <input
                      className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-sm bg-white/90 backdrop-blur-sm transition-all duration-200 ease-out box-border focus:outline-none focus:border-green-600 focus:shadow-[0_0_0_3px_rgba(22,163,74,0.1)] placeholder:text-gray-400 cursor-pointer"
                      type="text"
                      placeholder="Select end date"
                      value={endDate}
                      readOnly
                      onClick={() => setShowEndCalendar(!showEndCalendar)}
                      required
                      style={{ cursor: "pointer" }}
                    />
                    {showEndCalendar && (
                      <div className="absolute z-20 bg-white border-2 border-green-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-4 mt-2 top-full">
                        <div className="font-semibold mb-3 text-center flex items-center justify-between text-green-600">
                          <button
                            type="button"
                            onClick={handleEndPrevMonth}
                            className="bg-none border-none cursor-pointer text-lg py-2 px-3 rounded-lg transition-colors duration-200 text-green-600 hover:bg-green-50"
                          >
                            ←
                          </button>
                          <span>
                            {new Date(endCalendarYear, endCalendarMonth).toLocaleString("default", { month: "long" })}{" "}
                            {endCalendarYear}
                          </span>
                          <button
                            type="button"
                            onClick={handleEndNextMonth}
                            className="bg-none border-none cursor-pointer text-lg py-2 px-3 rounded-lg transition-colors duration-200 text-green-600 hover:bg-green-50"
                          >
                            →
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {getDaysArray(endCalendarYear, endCalendarMonth).map((day) => {
                            const isDisabled =
                              isPastDate(endCalendarYear, endCalendarMonth, day) ||
                              (startDate && new Date(endCalendarYear, endCalendarMonth, day) <= new Date(startDate))
                            return (
                              <div
                                key={day}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors duration-200 text-sm ${isDisabled ? "text-gray-300 cursor-not-allowed bg-gray-50 hover:bg-gray-50" : "hover:bg-green-100"}`}
                                onClick={() => !isDisabled && handleEndDateSelect(day)}
                              >
                                {day}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Row 3: Travelers and Budget */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                      Travelers *
                    </label>
                    <input
                      className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-sm bg-white/90 backdrop-blur-sm transition-all duration-200 ease-out box-border focus:outline-none focus:border-green-600 focus:shadow-[0_0_0_3px_rgba(22,163,74,0.1)] placeholder:text-gray-400"
                      type="number"
                      min="1"
                      max="20"
                      placeholder="1"
                      value={travelers}
                      onChange={(e) => setTravelers(Number.parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      Budget (BDT) *
                    </label>
                    <input
                      className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-sm bg-white/90 backdrop-blur-sm transition-all duration-200 ease-out box-border focus:outline-none focus:border-green-600 focus:shadow-[0_0_0_3px_rgba(22,163,74,0.1)] placeholder:text-gray-400"
                      type="number"
                      min="0"
                      step="100"
                      placeholder="Enter budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {isLoadingOptions ? (
              <div className="text-center py-15 px-5 text-gray-500 text-lg">
                <div>Loading package options...</div>
              </div>
            ) : (
              <>
                {/* Transport Section */}
                <div className="w-full max-w-5xl mx-auto mb-10 px-5 box-border">
                  <div className="flex flex-row items-center justify-center w-full mb-6 gap-4">
                    <span className="text-2xl font-bold text-gray-900 text-center">Select Transport</span>
                    <button
                      type="button"
                      className="bg-green-100 text-green-700 border-none rounded-lg py-2 px-5 text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-green-200"
                      onClick={() => handleSkip(skipTransport, setSkipTransport, setSelectedTransport)}
                    >
                      {skipTransport ? "Include" : "Skip"}
                    </button>
                  </div>
                  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto justify-items-center ${skipTransport ? "opacity-50 pointer-events-none" : ""}`}>
                    {transportOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`bg-gray-50 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-0 flex flex-col items-start cursor-pointer relative transition-all duration-300 ease-out border-2 border-transparent w-full max-w-80 min-h-80 overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 ${selectedTransport === option.id ? "border-green-500 shadow-[0_0_0_2px_#c8e6c9,0_4px_16px_rgba(76,175,80,0.2)] -translate-y-0.5" : ""}`}
                        onClick={() =>
                          handleOptionSelect(option.id, selectedTransport, setSelectedTransport, skipTransport)
                        }
                      >
                        <img
                          className="w-full h-50 object-cover rounded-t-xl mb-0"
                          alt={option.name}
                          src={option.image || "/placeholder.svg?height=200&width=300"}
                        />
                        <div className="p-4 flex flex-col gap-2 w-full box-border">
                          <div className="text-lg font-semibold my-0 text-gray-900">{option.name}</div>
                          <div className="text-sm text-gray-600 my-0 leading-6">{option.description}</div>
                          <div className="font-bold text-green-600 mt-2 text-xl">৳{option.price}</div>
                          {selectedTransport === option.id && <span className="absolute top-3 right-3 text-green-500 text-2xl font-bold bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)]">✔</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hotels Section */}
                <div className="w-full max-w-5xl mx-auto mb-10 px-5 box-border">
                  <div className="flex flex-row items-center justify-center w-full mb-6 gap-4">
                    <span className="text-2xl font-bold text-gray-900 text-center">Select Hotels</span>
                    <button
                      type="button"
                      className="bg-green-100 text-green-700 border-none rounded-lg py-2 px-5 text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-green-200"
                      onClick={() => handleSkip(skipHotel, setSkipHotel, setSelectedHotel)}
                    >
                      {skipHotel ? "Include" : "Skip"}
                    </button>
                  </div>
                  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto justify-items-center ${skipHotel ? "opacity-50 pointer-events-none" : ""}`}>
                    {hotelOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`bg-gray-50 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-0 flex flex-col items-start cursor-pointer relative transition-all duration-300 ease-out border-2 border-transparent w-full max-w-80 min-h-80 overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 ${selectedHotel === option.id ? "border-green-500 shadow-[0_0_0_2px_#c8e6c9,0_4px_16px_rgba(76,175,80,0.2)] -translate-y-0.5" : ""}`}
                        onClick={() => handleOptionSelect(option.id, selectedHotel, setSelectedHotel, skipHotel)}
                      >
                        <img
                          className="w-full h-50 object-cover rounded-t-xl mb-0"
                          alt={option.name}
                          src={option.image || "/placeholder.svg?height=200&width=300"}
                        />
                        <div className="p-4 flex flex-col gap-2 w-full box-border">
                          <div className="text-lg font-semibold my-0 text-gray-900">{option.name}</div>
                          <div className="text-sm text-gray-600 my-0 leading-6">{option.description}</div>
                          <div className="font-bold text-green-600 mt-2 text-xl">৳{option.price}/night</div>
                          {selectedHotel === option.id && <span className="absolute top-3 right-3 text-green-500 text-2xl font-bold bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)]">✔</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guide Section */}
                <div className="w-full max-w-5xl mx-auto mb-10 px-5 box-border">
                  <div className="flex flex-row items-center justify-center w-full mb-6 gap-4">
                    <span className="text-2xl font-bold text-gray-900 text-center">Hire a Guide</span>
                    <button
                      type="button"
                      className="bg-green-100 text-green-700 border-none rounded-lg py-2 px-5 text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-green-200"
                      onClick={() => handleSkip(skipGuide, setSkipGuide, setSelectedGuide)}
                    >
                      {skipGuide ? "Include" : "Skip"}
                    </button>
                  </div>
                  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto justify-items-center ${skipGuide ? "opacity-50 pointer-events-none" : ""}`}>
                    {guideOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`bg-gray-50 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-0 flex flex-col items-start cursor-pointer relative transition-all duration-300 ease-out border-2 border-transparent w-full max-w-80 min-h-80 overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 ${selectedGuide === option.id ? "border-green-500 shadow-[0_0_0_2px_#c8e6c9,0_4px_16px_rgba(76,175,80,0.2)] -translate-y-0.5" : ""}`}
                        onClick={() => handleOptionSelect(option.id, selectedGuide, setSelectedGuide, skipGuide)}
                      >
                        <img
                          className="w-full h-50 object-cover rounded-t-xl mb-0"
                          alt={option.name}
                          src={option.image || "/placeholder.svg?height=200&width=300"}
                        />
                        <div className="p-4 flex flex-col gap-2 w-full box-border">
                          <div className="text-lg font-semibold my-0 text-gray-900">{option.name}</div>
                          <div className="text-sm text-gray-600 my-0 leading-6">{option.description}</div>
                          <div className="font-bold text-green-600 mt-2 text-xl">৳{option.price}/day</div>
                          {selectedGuide === option.id && <span className="absolute top-3 right-3 text-green-500 text-2xl font-bold bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)]">✔</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Confirm section */}
            <div className="w-full max-w-2xl flex flex-col items-center mx-auto mt-10 mb-15 px-5 text-center">
              <div className="text-lg text-gray-700 mb-6 text-center leading-6">
                Review your package details and proceed to create your custom travel package.
              </div>
              <button
                type="button"
                className="bg-green-700 text-white border-none rounded-xl py-4 px-12 text-xl font-bold cursor-pointer transition-all duration-300 ease-out shadow-[0_4px_12px_rgba(56,142,60,0.3)] hover:bg-green-800 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(56,142,60,0.4)] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                onClick={handleCreatePackage}
                disabled={!isFormValid() || isCreatingPackage}
              >
                {isCreatingPackage ? "Creating Package..." : "Create Package"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreatePackage