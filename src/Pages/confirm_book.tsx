"use client"

import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../Styles/ConfirmBook.module.css';
import Layout from '../App/Layout';
import { useAuth } from "../Authentication/auth-context"
import { useBooking } from "../Context/booking-context"
import { getHotels } from "../App/api-services"
import type { Hotel } from "../App/api-services"

interface PackageOption {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}


const optionOrder = ["transport", "hotel", "vehicle", "guide"] as const
type OptionKey = typeof optionOrder[number];

const ConfirmBook: React.FC = () => {
  const location = useLocation();
  const pkg = location.state?.pkg;
  const [packageDetails, setPackageDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editable fields
  const [startDate, setStartDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [totalPrice, setTotalPrice] = useState('');
  const [endDate, setEndDate] = useState('');

  // Skip states for options
  const [skipTransport, setSkipTransport] = useState(true);
  const [skipHotel, setSkipHotel] = useState(false);
  const [skipVehicle, setSkipVehicle] = useState(true);
  const [skipGuide, setSkipGuide] = useState(true);

  // Focus state for option rows
  const [activeOption, setActiveOption] = useState<OptionKey>('transport');
  const optionRefs: Record<OptionKey, React.RefObject<HTMLDivElement>> = {
    transport: React.useRef<HTMLDivElement>(null),
    hotel: React.useRef<HTMLDivElement>(null),
    vehicle: React.useRef<HTMLDivElement>(null),
    guide: React.useRef<HTMLDivElement>(null),
  };

  // Placeholder states for options (to be replaced with API data)
  const [, setTransport] = useState<string>('Not selected');
  const [, setHotel] = useState<string>('Not selected');
  const [, setGuide] = useState<string>('Not selected');

  const [warning, setWarning] = useState('');

  const navigate = useNavigate();

  const dateInputRef = React.useRef<HTMLInputElement>(null);

  // Add hotel selection state
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [hotelsError, setHotelsError] = useState('');
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  // Add state for transport and guide options
  const [transportOptions, setTransportOptions] = useState<PackageOption[]>([]);
  const [guideOptions, setGuideOptions] = useState<PackageOption[]>([]);

  // Helper to get correct field regardless of casing
  const getField = (obj: any, key: string) => obj?.[key] || obj?.[key.toLowerCase()] || obj?.[key.charAt(0).toUpperCase() + key.slice(1)] || '';

  // Helper to format date as DD-MM-YYYY
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  // Helper to extract main location
  const extractMainLocation = (str: string): string => {
    if (!str) return '';
    // Remove any text in parentheses
    let cleanStr = str.replace(/\(.*?\)/g, '').trim();
    // Extract the last part after comma (if exists)
    const parts = cleanStr.split(',');
    const mainPart = parts[parts.length - 1].trim();
    // Remove any special characters and make lowercase
    return mainPart
      .replace(/[^\w\s]|_/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase();
  };

  // Helper to get tomorrow's date in yyyy-mm-dd format
  const getTomorrow = () => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, '0');
    const dd = String(t.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Add state for customer info
  const [customerName] = useState("");
  const [customerEmail] = useState("");
  const [customerPhone] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      console.log('Package data received:', pkg); // Debug log
      
      if (pkg?.id) {
        try {
          setLoading(true);
          setError('');
          
          console.log('Fetching package with ID:', pkg.id); // Debug log
          
          const response = await fetch('https://wander-nest-ad3s.onrender.com/api/packages/all/');
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('API response:', data); // Debug log
          
          // Handle paginated response structure
          const packagesData = data.results || (Array.isArray(data) ? data : []);
          console.log('Packages data:', packagesData); // Debug log
          
          const found = packagesData.find((p: any) => p.id === pkg.id);
          console.log('Found package:', found); // Debug log
          
          if (found) {
            setPackageDetails(found);
            setStartDate('');
            setTravelers(1);
            setTotalPrice(found.price || found.budget || '');
            setTransport('Not selected');
            setHotel('Not selected');
            setGuide('Not selected');
            setSkipTransport(true);
            setSkipHotel(false);
            setSkipGuide(true);
            setActiveOption('transport');
          } else {
            setError(`Package with ID ${pkg.id} not found in the API response.`);
          }
        } catch (err) {
          console.error('Error fetching package details:', err); // Debug log
          setError(`Failed to fetch package details: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No package ID found in:', pkg); // Debug log
        setError('No package selected or package data is incomplete.');
        setLoading(false);
      }
    };
    fetchDetails();
  }, [pkg]);

  useEffect(() => {
    if (packageDetails) {
      const basePrice = parseFloat(packageDetails.price || packageDetails.budget || '0');
      setTotalPrice((basePrice * travelers).toFixed(2));
    }
  }, [travelers, packageDetails]);

  // Recalculate end date if packageDetails or startDate changes
  useEffect(() => {
    if (packageDetails && startDate) {
      const days = parseInt(getField(packageDetails, 'days'), 10);
      if (!isNaN(days)) {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + days);
        const yyyy = end.getFullYear();
        const mm = String(end.getMonth() + 1).padStart(2, '0');
        const dd = String(end.getDate()).padStart(2, '0');
        setEndDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setEndDate('');
      }
    } else {
      setEndDate('');
    }
  }, [packageDetails, startDate]);

  // Fetch all options when needed
  const _fetchAllOptions = async () => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Token ${token}` }),
    };

    try {
      // Fetch all options in parallel
      const [transportRes, hotelsRes, guidesRes] = await Promise.all([
        fetch("https://wander-nest-ad3s.onrender.com/api/packages/transport-options/", { headers }),
        fetch("https://wander-nest-ad3s.onrender.com/api/packages/create/hotel-options/", { headers }),
        fetch("https://wander-nest-ad3s.onrender.com/api/packages/guide-options/", { headers }),
      ]);

      const transportData = await transportRes.json();
      const hotelsData = await hotelsRes.json();
      const guidesData = await guidesRes.json();

      setTransportOptions(transportData.results || transportData);
      console.log('Transport options:', transportData.results || transportData);
      setHotels(hotelsData.results || hotelsData);
      console.log('Hotel options:', hotelsData.results || hotelsData);
      setGuideOptions(guidesData.results || guidesData);
      console.log('Guide options:', guidesData.results || guidesData);
    } catch (error) {
      console.error("Error fetching options:", error);
      setHotelsError('Failed to fetch options.');
    }
  };

  // Fetch hotels when hotel selection is not skipped
  useEffect(() => {
    if (!skipHotel) {
      setHotelsLoading(true);
      setHotelsError('');
      getHotels()
        .then((hotels) => {
          setHotels(hotels);
          setHotelsLoading(false);
        })
        .catch((_err: any) => {
          setHotelsError('Failed to fetch hotels.');
          setHotels([]);
          setHotelsLoading(false);
        });
    } else {
      setHotels([]);
    }
  }, [skipHotel]);

  const handleTravelersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, parseInt(e.target.value) || 1);
    setTravelers(val);
  };

  // Focus next division after skip
  const focusNextOption = (current: OptionKey) => {
    const idx = optionOrder.indexOf(current);
    if (idx !== -1 && idx < optionOrder.length - 1) {
      const next = optionOrder[idx + 1];
      setActiveOption(next);
      setTimeout(() => {
        optionRefs[next].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  // Toggle skip/unskip handlers
  const handleSkipToggle = (option: OptionKey) => {
    switch (option) {
      case 'transport':
        setSkipTransport((prev) => {
          if (!prev) setActiveOption('transport');
          else focusNextOption('transport');
          return !prev;
        });
        break;
      case 'hotel':
        setSkipHotel((prev) => {
          if (!prev) setActiveOption('hotel');
          else focusNextOption('hotel');
          return !prev;
        });
        break;
      case 'vehicle':
        setSkipVehicle((prev) => {
          if (!prev) setActiveOption('vehicle');
          else focusNextOption('vehicle');
          return !prev;
        });
        break;
      case 'guide':
        setSkipGuide((prev) => {
          if (!prev) setActiveOption('guide');
          return !prev;
        });
        break;
      default:
        break;
    }
  };

  const handleConfirmBooking = async () => {
    // Validation: required fields
    if (!packageDetails.source || !packageDetails.title || !startDate || !endDate || !travelers) {
      setWarning('Please fill in all traveler details.');
      return;
    }
    if (!customerName.trim()) {
      setWarning('Name is required.');
      return;
    }
    if (!customerEmail.trim()) {
      setWarning('Email is required.');
      return;
    }
    if (!customerPhone.trim()) {
      setWarning('Phone is required.');
      return;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      setWarning('Please enter a valid email.');
      return;
    }
    if (customerPhone.length < 10) {
      setWarning('Please enter a valid phone number.');
      return;
    }
    setWarning('');
    setPaymentError("");
    setIsProcessingPayment(true);
    try {
      // Prepare payment data for package booking
      const paymentData = {
        service_type: "package",
        service_name: packageDetails.title || "Package Booking",
        service_details: `Package booking for ${travelers} travelers from ${packageDetails.source} to ${packageDetails.destination}`,
        amount: Number(totalPrice),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        service_data: {
          package_id: packageDetails.id,
          package_title: packageDetails.title,
          from: packageDetails.source,
          to: packageDetails.destination,
          start_date: startDate,
          end_date: endDate,
          travelers: travelers,
        },
      };
      console.log('Sending payment data:', paymentData);
      const token = localStorage.getItem("token");
      const response = await fetch("https://wander-nest-ad3s.onrender.com/initiate-payment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify(paymentData),
      });
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Invalid response format from server");
      }
      if (!response.ok) {
        const errorMessage =
          data?.detail ||
          data?.message ||
          data?.error ||
          data?.errors?.[0] ||
          `Server error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }
      if (data.status === "SUCCESS" && data.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else if (data.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else {
        throw new Error(data.detail || data.message || "Payment gateway URL not received. Please try again.");
      }
    } catch (err) {
      let errorMessage = "Payment failed. Please try again.";
      if (err instanceof Error) errorMessage = err.message;
      setPaymentError(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return <Layout><div style={{ padding: '2rem', textAlign: 'center' }}>Loading package details...</div></Layout>;
  }
  if (error) {
    return <Layout><div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div></Layout>;
  }
  if (!packageDetails) {
    return <Layout><div style={{ padding: '2rem', textAlign: 'center' }}>No package data found.</div></Layout>;
  }

  return (
    <Layout>
      <div className={styles.confirmBookContainer}>
        <h1 className={styles.pageTitle}>Confirm Your Booking</h1>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Traveler Details</h2>
          <div className={styles.formFieldsContainer}>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>From</label>
                <input className={styles.inputField} type="text" value={getField(packageDetails, 'source')} readOnly />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>To</label>
                <input className={styles.inputField} type="text" value={getField(packageDetails, 'destination')} readOnly />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Start Date</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    className={styles.inputField}
                    type="text"
                    value={formatDisplayDate(startDate)}
                    readOnly
                    onClick={() => dateInputRef.current && dateInputRef.current.showPicker && dateInputRef.current.showPicker()}
                    placeholder="dd-mm-yyyy"
                    style={{ cursor: 'pointer' }}
                  />
                  <span
                    className={styles.calendarIcon}
                    onClick={() => dateInputRef.current && dateInputRef.current.showPicker && dateInputRef.current.showPicker()}
                    role="button"
                    tabIndex={0}
                  >
                    📅
                  </span>
                  <input
                    ref={dateInputRef}
                    type="date"
                    style={{ position: 'absolute', left: 0, top: 0, opacity: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                    value={startDate}
                    min={getTomorrow()}
                    onChange={e => setStartDate(e.target.value)}
                    tabIndex={-1}
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>End Date</label>
                <input className={styles.inputField} type="text" value={formatDisplayDate(endDate)} readOnly />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Number of Travelers</label>
                <input className={styles.inputField} type="number" min={1} value={travelers} onChange={handleTravelersChange} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Budget (BDT)</label>
                <input className={styles.inputField} type="text" value={totalPrice} readOnly />
              </div>
            </div>
          </div>
        </div>
        <hr className={styles.divider} />
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Customize Your Package</h2>
          <div className={styles.optionsSection}>
            {/* Hotel */}
            <div 
              ref={optionRefs.hotel} 
              className={`${styles.optionRow} ${activeOption === 'hotel' ? 'active' : ''}`.trim()}
            >
              <span className={styles.optionLabel}>Select Hotel</span>
              <button
                type="button"
                className={styles.skipToggleBtn}
                onClick={() => handleSkipToggle('hotel')}
              >
                {skipHotel ? 'Include' : 'Skip'}
              </button>
              {/* Only show scroll buttons and hotel cards if not skipped */}
              {!skipHotel && (
                <div style={{ width: '100%', marginTop: 24 }}>
                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      aria-label="Scroll left"
                      style={{
                        position: 'absolute',
                        left: -40,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        background: '#fff',
                        border: '1.5px solid #e0e0e0',
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Left arrow icon */}
                    </button>
                    <div
                      style={{
                        display: 'flex',
                        gap: 24,
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        paddingBottom: 8,
                        margin: '0 48px',
                      }}
                    >
                      {hotelsLoading && <p>Loading hotels...</p>}
                      {hotelsError && <p style={{ color: 'red' }}>{hotelsError}</p>}
                      {hotels.length > 0 ? (
                        hotels
                          .filter(hotel => {
                            if (!packageDetails) return true;
                            const pkgDest = extractMainLocation(
                              packageDetails.destination || 
                              packageDetails.city || 
                              packageDetails.title || 
                              ''
                            );
                            const hotelLoc = extractMainLocation(hotel.location || '');
                            return pkgDest && hotelLoc && hotelLoc.includes(pkgDest);
                          })
                          .map((hotel) => {
                            const isSelected = selectedHotelId === hotel.id;
                            return (
                              <div
                                key={hotel.id}
                                onClick={() => setSelectedHotelId(isSelected ? null : hotel.id)}
                                style={{
                                  cursor: 'pointer',
                                  borderRadius: 14,
                                  border: isSelected ? '2.5px solid #4e944f' : '2.5px solid transparent',
                                  boxShadow: isSelected ? '0 4px 24px rgba(76,177,106,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                                  overflow: 'hidden',
                                  background: '#fff',
                                  minWidth: 220,
                                  maxWidth: 240,
                                  flex: '0 0 220px',
                                  transition: 'border 0.2s, box-shadow 0.2s',
                                  position: 'relative',
                                }}
                              >
                                {/* Checkmark for selected */}
                                {isSelected && (
                                  <div style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    background: '#4e944f',
                                    borderRadius: '50%',
                                    width: 28,
                                    height: 28,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 8px rgba(76,177,106,0.18)',
                                  }}>
                                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                      <circle cx="10" cy="10" r="10" fill="#4e944f"/>
                                      <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                )}
                                <img
                                  src={hotel.image_url || "/placeholder.svg?height=120&width=200"}
                                  alt={hotel.name}
                                  style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }}
                                />
                                <div style={{ padding: '12px 12px 8px 12px' }}>
                                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{hotel.name}</div>
                                  <div style={{ color: '#8a8a8a', fontSize: 13, marginBottom: 2 }}>{hotel.description || 'Hotel description'}</div>
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        !hotelsLoading && <p>No hotels found.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Vehicle */}
            <div ref={optionRefs.vehicle} className={`${styles.optionRow} ${activeOption === 'vehicle' ? 'active' : ''}`.trim()}>
              <span className={styles.optionLabel}>Select Vehicle</span>
              <button
                type="button"
                className={styles.skipToggleBtn}
                onClick={() => handleSkipToggle('vehicle')}
              >
                {skipVehicle ? 'Include' : 'Skip'}
              </button>
              {!skipVehicle && <div className={styles.optionCard}>Vehicle options go here</div>}
            </div>
            {/* Guide */}
            <div ref={optionRefs.guide} className={`${styles.optionRow} ${activeOption === 'guide' ? 'active' : ''}`.trim()}>
              <span className={styles.optionLabel}>Hire a Guide</span>
              <button
                type="button"
                className={styles.skipToggleBtn}
                onClick={() => handleSkipToggle('guide')}
              >
                {skipGuide ? 'Include' : 'Skip'}
              </button>
              {!skipGuide && <div className={styles.optionCard}>Guide options go here</div>}
            </div>
          </div>
        </div>
        <hr className={styles.divider} />
        <div className={styles.buttonRow}>
          {warning && (
            <div style={{ color: '#b94a48', background: '#fbeeea', borderRadius: 8, padding: '12px 18px', marginBottom: 12, fontWeight: 600, fontSize: '1.05rem', textAlign: 'center' }}>
              {warning}
            </div>
          )}
          {paymentError && (
            <div style={{ color: 'red', background: '#fbeeea', borderRadius: 8, padding: '12px 18px', marginBottom: 12, fontWeight: 600, fontSize: '1.05rem', textAlign: 'center' }}>
              {paymentError}
            </div>
          )}
          <button className={styles.confirmButton} onClick={handleConfirmBooking} disabled={isProcessingPayment}>
            {isProcessingPayment ? 'Processing Payment...' : 'Confirm Booking'}
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate('/packages')}
          >
            <span className={styles.cancelIcon}>←</span> Cancel Booking
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmBook;