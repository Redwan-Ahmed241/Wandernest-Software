"use client"

import { type FunctionComponent, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../Styles/CreatePackage.module.css"
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
        <div className={styles.flexRow}>
          <Sidebar />
          <div className={`${styles.flexGrow} ${styles.centeredPadding}`}>
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
      <div className={styles.flexRow}>
        <Sidebar />
        <div className={styles.flexGrow}>
          <div className={styles.createPackage}>
            <div className={styles.headerSection}>
              <div className={styles.createYourCustom}>Create Your Custom Package</div>

              {error && <div className={styles.errorMessage}>{error}</div>}

              {/* Enhanced Form Section */}
              <div className={styles.enhancedFormSection}>
                <div className={styles.compactFormGrid}>
                  {/* Row 1: From and To */}
                  <div className={styles.compactInputGroup}>
                    <label className={styles.enhancedInputLabel}>
                      <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className={styles.enhancedInputField}
                      type="text"
                      placeholder="Departure city"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.compactInputGroup}>
                    <label className={styles.enhancedInputLabel}>
                      <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className={styles.enhancedInputField}
                      type="text"
                      placeholder="Destination city"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      required
                    />
                  </div>

                  {/* Row 2: Start Date and End Date */}
                  <div className={styles.compactInputGroup} style={{ position: "relative" }}>
                    <label className={styles.enhancedInputLabel}>
                      <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className={styles.enhancedInputField}
                      type="text"
                      placeholder="Select start date"
                      value={startDate}
                      readOnly
                      onClick={() => setShowStartCalendar(!showStartCalendar)}
                      required
                      style={{ cursor: "pointer" }}
                    />
                    {showStartCalendar && (
                      <div className={styles.enhancedCalendarPopup}>
                        <div className={styles.enhancedCalendarHeader}>
                          <button
                            type="button"
                            onClick={handleStartPrevMonth}
                            className={styles.enhancedCalendarNavButton}
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
                            className={styles.enhancedCalendarNavButton}
                          >
                            →
                          </button>
                        </div>
                        <div className={styles.enhancedCalendarGrid}>
                          {getDaysArray(startCalendarYear, startCalendarMonth).map((day) => {
                            const isDisabled = isPastDate(startCalendarYear, startCalendarMonth, day)
                            return (
                              <div
                                key={day}
                                className={`${styles.enhancedCalendarDay} ${isDisabled ? styles.disabled : ""}`}
                                onClick={() => !isDisabled && handleStartDateSelect(day)}
                                style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                              >
                                {day}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.compactInputGroup} style={{ position: "relative" }}>
                    <label className={styles.enhancedInputLabel}>
                      <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className={styles.enhancedInputField}
                      type="text"
                      placeholder="Select end date"
                      value={endDate}
                      readOnly
                      onClick={() => setShowEndCalendar(!showEndCalendar)}
                      required
                      style={{ cursor: "pointer" }}
                    />
                    {showEndCalendar && (
                      <div className={styles.enhancedCalendarPopup}>
                        <div className={styles.enhancedCalendarHeader}>
                          <button
                            type="button"
                            onClick={handleEndPrevMonth}
                            className={styles.enhancedCalendarNavButton}
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
                            className={styles.enhancedCalendarNavButton}
                          >
                            →
                          </button>
                        </div>
                        <div className={styles.enhancedCalendarGrid}>
                          {getDaysArray(endCalendarYear, endCalendarMonth).map((day) => {
                            const isDisabled =
                              isPastDate(endCalendarYear, endCalendarMonth, day) ||
                              (startDate && new Date(endCalendarYear, endCalendarMonth, day) <= new Date(startDate))
                            return (
                              <div
                                key={day}
                                className={`${styles.enhancedCalendarDay} ${isDisabled ? styles.disabled : ""}`}
                                onClick={() => !isDisabled && handleEndDateSelect(day)}
                                style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
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
                  <div className={styles.compactInputGroup}>
                    <label className={styles.enhancedInputLabel}>
                      <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className={styles.enhancedInputField}
                      type="number"
                      min="1"
                      max="20"
                      placeholder="1"
                      value={travelers}
                      onChange={(e) => setTravelers(Number.parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>

                  <div className={styles.compactInputGroup}>
                    <label className={styles.enhancedInputLabel}>
                      <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className={styles.enhancedInputField}
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
              <div className={styles.loadingSection}>
                <div>Loading package options...</div>
              </div>
            ) : (
              <>
                {/* Transport Section */}
                <div className={styles.sectionContainer}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Select Transport</span>
                    <button
                      type="button"
                      className={styles.skipButton}
                      onClick={() => handleSkip(skipTransport, setSkipTransport, setSelectedTransport)}
                    >
                      {skipTransport ? "Include" : "Skip"}
                    </button>
                  </div>
                  <div className={`${styles.cardsGrid} ${skipTransport ? styles.sectionDisabled : ""}`}>
                    {transportOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`${styles.card} ${selectedTransport === option.id ? styles.selectedCard : ""}`}
                        onClick={() =>
                          handleOptionSelect(option.id, selectedTransport, setSelectedTransport, skipTransport)
                        }
                      >
                        <img
                          className={styles.cardImage}
                          alt={option.name}
                          src={option.image || "/placeholder.svg?height=200&width=300"}
                        />
                        <div className={styles.cardContent}>
                          <div className={styles.cardTitle}>{option.name}</div>
                          <div className={styles.cardDescription}>{option.description}</div>
                          <div className={styles.cardPrice}>৳{option.price}</div>
                          {selectedTransport === option.id && <span className={styles.selectedMark}>✔</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hotels Section */}
                <div className={styles.sectionContainer}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Select Hotels</span>
                    <button
                      type="button"
                      className={styles.skipButton}
                      onClick={() => handleSkip(skipHotel, setSkipHotel, setSelectedHotel)}
                    >
                      {skipHotel ? "Include" : "Skip"}
                    </button>
                  </div>
                  <div className={`${styles.cardsGrid} ${skipHotel ? styles.sectionDisabled : ""}`}>
                    {hotelOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`${styles.card} ${selectedHotel === option.id ? styles.selectedCard : ""}`}
                        onClick={() => handleOptionSelect(option.id, selectedHotel, setSelectedHotel, skipHotel)}
                      >
                        <img
                          className={styles.cardImage}
                          alt={option.name}
                          src={option.image || "/placeholder.svg?height=200&width=300"}
                        />
                        <div className={styles.cardContent}>
                          <div className={styles.cardTitle}>{option.name}</div>
                          <div className={styles.cardDescription}>{option.description}</div>
                          <div className={styles.cardPrice}>৳{option.price}/night</div>
                          {selectedHotel === option.id && <span className={styles.selectedMark}>✔</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guide Section */}
                <div className={styles.sectionContainer}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Hire a Guide</span>
                    <button
                      type="button"
                      className={styles.skipButton}
                      onClick={() => handleSkip(skipGuide, setSkipGuide, setSelectedGuide)}
                    >
                      {skipGuide ? "Include" : "Skip"}
                    </button>
                  </div>
                  <div className={`${styles.cardsGrid} ${skipGuide ? styles.sectionDisabled : ""}`}>
                    {guideOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`${styles.card} ${selectedGuide === option.id ? styles.selectedCard : ""}`}
                        onClick={() => handleOptionSelect(option.id, selectedGuide, setSelectedGuide, skipGuide)}
                      >
                        <img
                          className={styles.cardImage}
                          alt={option.name}
                          src={option.image || "/placeholder.svg?height=200&width=300"}
                        />
                        <div className={styles.cardContent}>
                          <div className={styles.cardTitle}>{option.name}</div>
                          <div className={styles.cardDescription}>{option.description}</div>
                          <div className={styles.cardPrice}>৳{option.price}/day</div>
                          {selectedGuide === option.id && <span className={styles.selectedMark}>✔</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Confirm section */}
            <div className={styles.confirmSection}>
              <div className={styles.reviewText}>
                Review your package details and proceed to create your custom travel package.
              </div>
              <button
                type="button"
                className={styles.confirmPackage}
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
