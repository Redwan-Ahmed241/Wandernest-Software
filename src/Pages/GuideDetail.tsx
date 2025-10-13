import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Calendar, Clock, Award, Globe, Phone, Mail, CheckCircle } from 'react-feather';

import Layout from '../components/layout';
import { guidesAPI, type Guide, type GuideLocation, type GuideReview, type GuideAvailability } from '../api/guides';

// Function to get appropriate guide image based on guide data
const getGuideImage = (guide: Guide): string => {
  // Use different placeholder images for different guides
  const images = [
    "/Figma_photos/abtahi_bro-modified-reduced.png",
    "/Figma_photos/redwan-bro-modified-reduced.png", 
    "/Figma_photos/1600px_COLOURBOX5006565.jpg",
    "/Figma_photos/ifty_bro_2-modified_reduced.png",
    "/Figma_photos/NE.jpeg",
    "/Figma_photos/onu.png"
  ];
  
  // Use guide ID to consistently assign the same image to the same guide
  const imageIndex = (guide.id - 1) % images.length;
  return images[imageIndex];
};

const GuideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [guide, setGuide] = useState<Guide | null>(null);
  const [reviews, setReviews] = useState<GuideReview[]>([]);
  const [availability, setAvailability] = useState<GuideAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'availability'>('overview');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchGuideDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const guideData = await guidesAPI.getGuideDetails(parseInt(id));
        console.log('Received guide data:', guideData);
        console.log('Guide data type:', typeof guideData);
        console.log('Guide keys:', Object.keys(guideData || {}));
        console.log('Guide languages:', guideData?.languages);
        console.log('Guide specialties:', guideData?.specialties);
        
        // Ensure guide has all required properties with safe defaults
        const safeGuide = {
          id: guideData?.id || parseInt(id),
          name: guideData?.name || 'Unknown Guide',
          description: guideData?.description || '',
          bio: guideData?.bio || guideData?.description || '',
          image: guideData?.image || guideData?.profile_picture || '/Figma_photos/1a.jpeg',
          profile_picture: guideData?.profile_picture || guideData?.image || '/Figma_photos/1a.jpeg',
          area: guideData?.area || '',
          location: guideData?.location || '',
          price: guideData?.price || 0,
          hourly_rate: guideData?.hourly_rate || undefined,
          daily_rate: guideData?.daily_rate || undefined,
          experience_years: guideData?.experience_years || 0,
          rating: guideData?.rating || 0,
          total_reviews: guideData?.total_reviews || 0,
          languages: Array.isArray(guideData?.languages) ? guideData.languages : [],
          specialties: Array.isArray(guideData?.specialties) ? guideData.specialties : [],
          certifications: Array.isArray(guideData?.certifications) ? guideData.certifications : [],
          services_offered: Array.isArray(guideData?.services_offered) ? guideData.services_offered : [],
          services: Array.isArray(guideData?.services) ? guideData.services : [],
          contact_info: guideData?.contact_info || {},
          availability: guideData?.availability || false,
          availability_status: guideData?.availability_status || (guideData?.availability ? 'Available' : 'Busy')
        };
        
        console.log('Safe guide data:', safeGuide);
        setGuide(safeGuide);

        // Skip reviews and availability for now to test the main component
        // const [reviewsData, availabilityData] = await Promise.all([
        //   guidesAPI.getGuideReviews(parseInt(id), { limit: 5 }),
        //   guidesAPI.getGuideAvailability(parseInt(id), selectedDate, 7)
        // ]);

        // setReviews(reviewsData.reviews || []);
        // setAvailability(availabilityData || []);
        setReviews([]);
        setAvailability([]);
      } catch (err) {
        console.error('Error fetching guide details:', err);
        setError('Failed to load guide details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuideDetails();
  }, [id, selectedDate]);

  const handleBookNow = () => {
    if (guide) {
      setShowBookingModal(true);
    }
  };

  const handleContactGuide = (type: 'phone' | 'email') => {
    if (!guide) return;
    
    if (type === 'phone') {
      window.open(`tel:${guide.phone}`, '_self');
    } else {
      window.open(`mailto:${guide.email}`, '_self');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6ab187] mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading guide details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !guide || !guide.id) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">{error || 'Guide not found'}</p>
            <button 
              onClick={() => navigate('/guides')}
              className="bg-[#6ab187] text-white px-6 py-2 rounded-lg hover:bg-[#5a9b77] transition-colors"
            >
              Back to Guides
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Guide Booking Modal Component
  const GuideBookingModal = () => {
    const [form, setForm] = useState({
      name: "",
      email: "",
      phone: "",
      tourDate: "",
      days: 1,
      groupSize: 1,
      specialRequests: ""
    });
    const [formError, setFormError] = useState("");
    const [isProcessingBooking, setIsProcessingBooking] = useState(false);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm(f => ({ ...f, [name]: value }));
    };

    const validateBookingForm = () => {
      if (!form.name.trim()) return "Name is required";
      if (!form.email.trim()) return "Email is required";
      if (!form.phone.trim()) return "Phone is required";
      if (!form.tourDate) return "Tour date is required";
      if (form.days < 1) return "At least 1 day is required";
      if (form.groupSize < 1) return "At least 1 person is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) return "Please enter a valid email";
      if (form.phone.length < 10) return "Please enter a valid phone number";
      return null;
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError("");
      const validationError = validateBookingForm();
      if (validationError) {
        setFormError(validationError);
        return;
      }

      setIsProcessingBooking(true);
      try {
        const bookingData = {
          guide_id: guide?.id,
          customer_name: form.name.trim(),
          contact_email: form.email.trim(),  // Backend expects 'contact_email' not 'customer_email'
          customer_phone: form.phone.trim(),
          booking_date: form.tourDate,
          duration_days: parseInt(form.days.toString()),
          total_travelers: parseInt(form.groupSize.toString()),
          special_requirements: form.specialRequests || "",
          contact_phone: form.phone.trim(),
          emergency_contact: form.phone.trim()
        };

        console.log('Sending booking data:', bookingData);

        // Use the guides API to create booking
        const result = await guidesAPI.createBooking(bookingData);
        console.log('Booking created successfully:', result);
        
        // Close modal and show success message
        setShowBookingModal(false);
        alert(`Booking confirmed! You will receive confirmation details via email.`);
        
      } catch (err) {
        console.error('Booking failed:', err);
        console.error('Error details:', err);
        setFormError('Booking failed. Please try again or contact support.');
      } finally {
        setIsProcessingBooking(false);
      }
    };

    if (!showBookingModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Book {guide?.name}
              </h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <span className="text-xl text-gray-600">×</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Guide Info */}
            <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <img
                src={getGuideImage(guide!)}
                alt={guide?.name}
                className="w-24 h-24 rounded-xl object-cover shadow-md"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {guide?.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {(() => {
                      if (!guide?.location) return 'Location not specified';
                      if (typeof guide.location === 'object') {
                        const loc = guide.location as GuideLocation;
                        return `${loc.city || ''}, ${loc.region || ''}`.trim().replace(/^,\s*/, '').replace(/,\s*$/, '') || 'Location not specified';
                      }
                      return guide.location;
                    })()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{guide?.rating}</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    ৳{guide?.price}/day
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {formError}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tour Date *
                  </label>
                  <input
                    name="tourDate"
                    type="date"
                    value={form.tourDate}
                    onChange={handleFormChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Days *
                  </label>
                  <input
                    name="days"
                    type="number"
                    min="1"
                    max="30"
                    value={form.days}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Group Size *
                  </label>
                  <input
                    name="groupSize"
                    type="number"
                    min="1"
                    max="20"
                    value={form.groupSize}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="1"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  name="specialRequests"
                  value={form.specialRequests}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Any special requirements or requests..."
                />
              </div>

              {/* Total Amount */}
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ৳{((guide?.price || 0) * form.days).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {form.days} day{form.days > 1 ? 's' : ''} × ৳{guide?.price} per day
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessingBooking}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-colors duration-200 shadow-md ${
                  isProcessingBooking
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark'
                }`}
                style={{
                  backgroundColor: isProcessingBooking ? '#9CA3AF' : '#6ab187',
                  color: '#ffffff'
                }}
              >
                {isProcessingBooking ? 'Processing Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Additional safety check
  if (!guide || typeof guide !== 'object') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading guide details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <button 
              onClick={() => navigate('/guides')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              Back to Guides
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Guide Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="md:flex">
              {/* Profile Image */}
              <div className="md:w-1/3">
                <img
                  src={
                    guide.profile_picture?.startsWith('https://example.com') || !guide.profile_picture
                      ? getGuideImage(guide)
                      : guide.profile_picture || guide.image
                  }
                  alt={guide.name}
                  className="w-full h-64 md:h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getGuideImage(guide);
                  }}
                />
              </div>

              {/* Profile Info */}
              <div className="md:w-2/3 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{guide.name}</h1>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star size={18} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{guide.rating}</span>
                        <span className="text-gray-600">({guide.total_reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin size={16} />
                        <span>
                          {(() => {
                            if (!guide.location) return 'Location not specified';
                            if (typeof guide.location === 'object') {
                              const loc = guide.location as GuideLocation;
                              return `${loc.city || ''}, ${loc.region || ''}`.trim().replace(/^,\s*/, '').replace(/,\s*$/, '') || 'Location not specified';
                            }
                            return guide.location;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#6ab187] mb-1">
                      ৳{guide.price || guide.daily_rate || guide.price_per_day || 'Contact for pricing'}
                    </div>
                    <div className="text-gray-600">per day</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                      guide.availability_status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {guide.availability_status}
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <span>{guide?.experience_years || 0} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe size={16} />
                    <span>{(guide?.languages || []).join(', ') || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award size={16} />
                    <span>{(guide?.certifications || []).length} certifications</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleBookNow}
                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-md border-0"
                    style={{ backgroundColor: '#6ab187', color: '#ffffff' }}
                  >
                    <Calendar size={18} />
                    Book Now
                  </button>
                  <button
                    onClick={() => handleContactGuide('phone')}
                    className="flex-1 bg-white border-2 border-[#6ab187] text-[#6ab187] py-3 px-6 rounded-lg font-semibold hover:bg-[#6ab187] hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone size={18} />
                    Call Guide
                  </button>
                  <button
                    onClick={() => handleContactGuide('email')}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail size={18} />
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <div className="flex">
                {[
                  { key: 'overview' as const, label: 'Overview', icon: CheckCircle },
                  { key: 'reviews' as const, label: 'Reviews', icon: Star },
                  { key: 'availability' as const, label: 'Availability', icon: Calendar }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors ${
                      activeTab === key
                        ? 'border-b-2 border-[#6ab187] text-[#6ab187] bg-[#6ab187]/5'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Bio */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">About</h3>
                    <p className="text-gray-700 leading-relaxed">{guide?.bio || guide?.description || 'No description available.'}</p>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {(guide?.specialties || []).map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-[#6ab187]/10 text-[#6ab187] px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Services Included</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(guide.services_offered || guide.services || []).map((service, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-600" />
                          <span className="text-gray-700">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Certifications</h3>
                    <div className="space-y-2">
                      {(guide.certifications || []).map((cert, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Award size={16} className="text-[#6ab187]" />
                          <span className="text-gray-700">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Reviews</h3>
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{guide.rating}</span>
                      <span className="text-gray-600">({guide.total_reviews} total)</span>
                    </div>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No reviews yet. Be the first to review this guide!
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#6ab187] text-white rounded-full flex items-center justify-center font-semibold">
                                {review.user_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium">{review.user_name}</p>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'availability' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Availability</h3>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6ab187]"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {availability.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No availability data for the selected dates.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availability.map((day, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 ${
                            day.is_available
                              ? 'border-green-200 bg-green-50'
                              : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">
                              {new Date(day.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                day.is_available
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {day.is_available ? 'Available' : 'Booked'}
                            </span>
                          </div>
                          {day.is_available && (
                            <div className="text-sm text-gray-600">
                              Price: ৳{day.price}
                            </div>
                          )}
                          {day.notes && (
                            <div className="text-sm text-gray-500 mt-2">
                              {day.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Modal */}
      <GuideBookingModal />
    </Layout>
  );
};

export default GuideDetail;