"use client"

import type { FunctionComponent } from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../App/Layout"
import { visaAPI, type Country, type VisaPurpose, type VisaRequirement, type CurrencyRate } from "../App/api"
import { useAuth } from "../Authentication/auth-context"

const VisaAssistance: FunctionComponent = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()

  // State management
  const [countries, setCountries] = useState<Country[]>([])
  const [purposes, setPurposes] = useState<VisaPurpose[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedPurpose, setSelectedPurpose] = useState<string>("")
  const [visaRequirement, setVisaRequirement] = useState<VisaRequirement | null>(null)
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([])

  // Loading states
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const [isLoadingPurposes, setIsLoadingPurposes] = useState(true)
  const [isLoadingRequirements, setIsLoadingRequirements] = useState(false)
  const [isLoadingRates, setIsLoadingRates] = useState(true)

  // Error states
  const [, setError] = useState<string | null>(null)

  // Fetch initial data
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchCountries()
      fetchPurposes()
      fetchCurrencyRates()
    }
  }, [authLoading, isAuthenticated])

  // Fetch visa requirements when country and purpose are selected
  useEffect(() => {
    if (selectedCountry && selectedPurpose) {
      fetchVisaRequirements(selectedCountry, selectedPurpose)
    }
  }, [selectedCountry, selectedPurpose])

  const fetchCountries = async () => {
    try {
      setIsLoadingCountries(true)
      const data = await visaAPI.getCountries()
      setCountries(data.results || data)
    } catch (error) {
      console.error("Error fetching countries:", error)
      setError("Failed to load countries")
    } finally {
      setIsLoadingCountries(false)
    }
  }

  const fetchPurposes = async () => {
    try {
      setIsLoadingPurposes(true)
      const data = await visaAPI.getVisaPurposes()
      setPurposes(data.results || data)
    } catch (error) {
      console.error("Error fetching purposes:", error)
      setError("Failed to load visa purposes")
    } finally {
      setIsLoadingPurposes(false)
    }
  }

  const fetchVisaRequirements = async (countryCode: string, purpose: string) => {
    try {
      setIsLoadingRequirements(true)
      const data = await visaAPI.getVisaRequirements(countryCode, purpose)
      setVisaRequirement(data)
    } catch (error) {
      console.error("Error fetching visa requirements:", error)
      setVisaRequirement(null)
    } finally {
      setIsLoadingRequirements(false)
    }
  }

  const fetchCurrencyRates = async () => {
    try {
      setIsLoadingRates(true)
      const data = await visaAPI.getCurrencyRates()
      setCurrencyRates(data.results || data)
    } catch (error) {
      console.error("Error fetching currency rates:", error)
    } finally {
      setIsLoadingRates(false)
    }
  }

  const handleStartApplication = () => {
    if (selectedCountry && selectedPurpose) {
      navigate(`/visa-application?country=${selectedCountry}&purpose=${selectedPurpose}`)
    } else {
      alert("Please select your country and purpose of visit first.")
    }
  }

  const getVisaTypeInfo = (type: string) => {
    switch (type) {
      case "visa_free":
        return {
          title: "Visa-Free",
          description: "No visa required for selected citizenship.",
          icon: "🆓",
          color: "#27ae60",
        }
      case "visa_on_arrival":
        return {
          title: "Visa-on-Arrival",
          description: "Get your visa upon arrival in Bangladesh.",
          icon: "✈️",
          color: "#f39c12",
        }
      case "evisa_required":
        return {
          title: "eVisa Required",
          description: "Apply online for an electronic visa.",
          icon: "💻",
          color: "#3498db",
        }
      case "visa_required":
        return {
          title: "Visa Required",
          description: "Apply at embassy or consulate.",
          icon: "📋",
          color: "#e74c3c",
        }
      default:
        return {
          title: "Unknown",
          description: "Please select country and purpose.",
          icon: "❓",
          color: "#95a5a6",
        }
    }
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Layout>
        <div className={styles.container}>
          <Sidebar />
          <div className={styles.content}>
            <div className={styles.loading}>Loading...</div>
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

  const usdToBdt = currencyRates.find((rate) => rate.from_currency === "USD" && rate.to_currency === "BDT")

  return (
    <Layout>
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}>
          <div className={styles.visaAssistance}>
            {/* Header */}
            <div className={styles.header}>
              <h1 className={styles.title}>Visa Assistance</h1>
              <p className={styles.subtitle}>Get help with your visa application process</p>
            </div>

            {/* Info Cards */}
            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <div className={styles.cardIcon}>💱</div>
                <div className={styles.cardContent}>
                  <h3>Currency Rate Monitor</h3>
                  <p>Updated daily</p>
                  <div className={styles.rate}>
                    {isLoadingRates
                      ? "Loading..."
                      : usdToBdt
                        ? `1 USD = ${usdToBdt.rate.toFixed(2)} BDT`
                        : "Rate unavailable"}
                  </div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.cardIcon}>🛡️</div>
                <div className={styles.cardContent}>
                  <h3>Safety Tips</h3>
                  <p>Travel safely</p>
                  <div className={styles.rate}>Keep your documents secure.</div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.cardIcon}>🔗</div>
                <div className={styles.cardContent}>
                  <h3>Quick Links</h3>
                  <p>Helpful resources</p>
                  <div className={styles.rate}>Visa FAQs, Embassy Contacts</div>
                </div>
              </div>
            </div>

            {/* Main Application Section */}
            <div className={styles.applicationSection}>
              <div className={styles.applicationHeader}>
                <h2>Apply for Bangladesh Visa</h2>
                <p>Easily apply for a visa to explore the beauty of Bangladesh.</p>
              </div>

              {/* Country Selection */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Citizenship</label>
                <select
                  className={styles.select}
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={isLoadingCountries}
                >
                  <option value="">{isLoadingCountries ? "Loading countries..." : "Select your country"}</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Purpose Selection */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Purpose of Visit</label>
                <select
                  className={styles.select}
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                  disabled={isLoadingPurposes}
                >
                  <option value="">{isLoadingPurposes ? "Loading purposes..." : "Select purpose"}</option>
                  {purposes.map((purpose) => (
                    <option key={purpose.id} value={purpose.id}>
                      {purpose.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visa Requirement Result */}
              {isLoadingRequirements ? (
                <div className={styles.loading}>Loading visa requirements...</div>
              ) : visaRequirement ? (
                <div className={styles.visaResult}>
                  <div
                    className={styles.visaTypeCard}
                    style={{ borderColor: getVisaTypeInfo(visaRequirement.type).color }}
                  >
                    <div className={styles.visaTypeHeader}>
                      <span className={styles.visaTypeIcon}>{getVisaTypeInfo(visaRequirement.type).icon}</span>
                      <div>
                        <h3 style={{ color: getVisaTypeInfo(visaRequirement.type).color }}>
                          {getVisaTypeInfo(visaRequirement.type).title}
                        </h3>
                        <p>{getVisaTypeInfo(visaRequirement.type).description}</p>
                      </div>
                    </div>

                    {visaRequirement.type !== "visa_free" && (
                      <div className={styles.requirementDetails}>
                        <div className={styles.detailItem}>
                          <strong>Duration:</strong> {visaRequirement.duration}
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Processing Time:</strong> {visaRequirement.processing_time}
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Fee:</strong> {visaRequirement.fee}
                        </div>
                        {visaRequirement.requirements.length > 0 && (
                          <div className={styles.detailItem}>
                            <strong>Requirements:</strong>
                            <ul className={styles.requirementsList}>
                              {visaRequirement.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedCountry && selectedPurpose ? (
                <div className={styles.noResult}>
                  <p>No visa information found for the selected combination.</p>
                </div>
              ) : null}

              {/* How to Apply Section */}
              <div className={styles.howToApply}>
                <h3>How to Apply</h3>
                <div className={styles.steps}>
                  <div className={styles.step}>
                    <div className={styles.stepIcon}>📝</div>
                    <div className={styles.stepTitle}>Fill Form</div>
                  </div>
                  <div className={styles.step}>
                    <div className={styles.stepIcon}>📤</div>
                    <div className={styles.stepTitle}>Upload Documents</div>
                  </div>
                  <div className={styles.step}>
                    <div className={styles.stepIcon}>✅</div>
                    <div className={styles.stepTitle}>Submit & Track</div>
                  </div>
                </div>
              </div>

              {/* Start Application Button */}
              <button
                className={styles.startButton}
                onClick={handleStartApplication}
                disabled={!selectedCountry || !selectedPurpose}
              >
                Start Application
              </button>
            </div>

            {/* Emergency Support */}
            <div className={styles.emergencySupport}>
              <h3>Emergency Support</h3>
              <div className={styles.supportGrid}>
                <div className={styles.supportCard} onClick={() => navigate("/embassy-contacts")}>
                  <h4>Embassy Contacts</h4>
                  <p>Find your nearest embassy.</p>
                </div>
                <div className={styles.supportCard} onClick={() => navigate("/travel-faqs")}>
                  <h4>Travel FAQs</h4>
                  <p>Answers to common questions.</p>
                </div>
                <div className={styles.supportCard} onClick={() => navigate("/tourist-helplines")}>
                  <h4>Tourist Helplines</h4>
                  <p>24/7 helpline for tourists.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default VisaAssistance
