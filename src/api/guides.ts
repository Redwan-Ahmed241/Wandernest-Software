// Guide API service functions for frontend

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || "https://wandernest-backend.vercel.app/api";

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  
  const config: RequestInit = {
    method: 'GET',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
  console.log('Request config:', config);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Unauthorized");
      }
      
      // Try to get error details from response body
      let errorDetails = '';
      try {
        const errorData = await response.json();
        errorDetails = errorData.message || errorData.error || errorData.detail || JSON.stringify(errorData);
        console.error('Server error details:', errorData);
      } catch {
        console.error('Could not parse error response');
      }
      
      throw new Error(`API Error: ${response.status} - ${response.statusText}${errorDetails ? ` - ${errorDetails}` : ''}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Guide-related types
export interface GuideLocation {
  city?: string;
  region?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Guide {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  hourly_rate?: number;
  daily_rate?: number;
  currency?: string;
  area: string;
  location?: string | GuideLocation;
  specialties: string[];
  languages: string[];
  experience_years?: number;
  rating?: number;
  total_reviews?: number;
  availability?: boolean;
  contact_info?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  services_offered?: string[];
  certifications?: string[];
  schedule?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  
  // Backwards compatibility
  profile_picture?: string;
  bio?: string;
  price_per_day?: number;
  availability_status?: string;
  phone?: string;
  email?: string;
  services?: string[];
}

export interface GuideSearchParams {
  location?: string;
  area?: string;
  specialties?: string[];
  languages?: string[];
  max_price?: number;
  min_rating?: number;
  experience_years?: number;
  services?: string[];
  availability_date?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface GuideAvailability {
  date: string;
  is_available: boolean;
  price: number;
  notes?: string;
}

export interface GuideReview {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  booking_date?: string;
}

export interface BookingData {
  guide_id: number;
  booking_date: string;
  duration_days: number;
  total_travelers: number;
  special_requirements?: string;
  contact_phone: string;
  emergency_contact: string;
}

export interface UserBooking {
  id: number;
  guide_name: string;
  booking_date: string;
  status: string;
  total_cost: number;
}

export interface BookingDetails {
  id: number;
  guide: Guide;
  booking_date: string;
  duration_days: number;
  total_travelers: number;
  special_requirements?: string;
  contact_phone: string;
  emergency_contact: string;
  status: string;
  total_cost: number;
  created_at: string;
}

// Guides API Functions
export const guidesAPI = {
  // Get all guides with optional filters
  async getGuides(params: GuideSearchParams = {}): Promise<{ guides: Guide[]; total: number; page: number; limit: number }> {
    const queryString = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryString.append(key, v.toString()));
        } else {
          queryString.append(key, value.toString());
        }
      }
    });

    // Try simple fetch first to avoid CORS issues
    try {
      const url = `${API_BASE_URL}/guides${queryString.toString() ? `?${queryString.toString()}` : ''}`;
      console.log('Trying simple fetch to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Simple fetch response:', data);
      
      // Transform the API response to match expected format
      if (data.success && data.data) {
        return {
          guides: data.data.guides || [],
          total: data.data.total_results || 0,
          page: data.data.page || 1,
          limit: data.data.guides?.length || 0
        };
      }
      
      // Fallback for direct format
      return data;
    } catch (error) {
      console.error('Simple fetch failed, trying apiRequest:', error);
      
      // Fallback to the original apiRequest
      const response = await apiRequest(`/guides${queryString.toString() ? `?${queryString.toString()}` : ''}`);
      
      // Transform the API response to match expected format
      if (response.success && response.data) {
        return {
          guides: response.data.guides || [],
          total: response.data.total_results || 0,
          page: response.data.page || 1,
          limit: response.data.guides?.length || 0
        };
      }
      
      // Fallback for direct format
      return response;
    }
  },

  // Search guides with advanced parameters
  async searchGuides(searchParams: GuideSearchParams): Promise<{ guides: Guide[]; total: number }> {
    return await apiRequest('/guides/search', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    });
  },

  // Get guide details by ID
  async getGuideDetails(guideId: number): Promise<Guide> {
    const response = await apiRequest(`/guides/${guideId}`);
    console.log('Raw guide details response:', response);
    // Handle the actual response structure: {success: true, data: {...guide data}}
    return response.data || response.guide || response;
  },

  // Get guide availability for specific dates
  async getGuideAvailability(guideId: number, date: string, days: number = 1): Promise<GuideAvailability[]> {
    return await apiRequest(`/guides/${guideId}/availability?date=${date}&days=${days}`);
  },

  // Create a new booking
  async createBooking(bookingData: BookingData): Promise<{ booking_id: number; message: string }> {
    return await apiRequest('/guides/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Get user's guide bookings
  async getUserBookings(filters: { status?: string; page?: number; limit?: number } = {}): Promise<{ bookings: UserBooking[]; total: number; page: number; limit: number }> {
    const queryString = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryString.append(key, value.toString());
      }
    });
    
    return await apiRequest(`/guides/bookings/my-bookings${queryString.toString() ? `?${queryString.toString()}` : ''}`);
  },

  // Get booking details
  async getBookingDetails(bookingId: number): Promise<{ booking: BookingDetails }> {
    return await apiRequest(`/guides/bookings/${bookingId}`);
  },

  // Update booking
  async updateBooking(bookingId: number, updateData: Partial<BookingData>): Promise<{ message: string }> {
    return await apiRequest(`/guides/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  // Cancel booking
  async cancelBooking(bookingId: number): Promise<{ message: string }> {
    return await apiRequest(`/guides/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  },

  // Get guide reviews
  async getGuideReviews(guideId: number, params: { page?: number; limit?: number; sort_by?: string } = {}): Promise<{ reviews: GuideReview[]; total: number; average_rating: number }> {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryString.append(key, value.toString());
      }
    });
    
    return await apiRequest(`/guides/${guideId}/reviews${queryString.toString() ? `?${queryString.toString()}` : ''}`);
  },

  // Create a review
  async createReview(guideId: number, reviewData: { rating: number; comment: string }): Promise<{ message: string }> {
    return await apiRequest(`/guides/${guideId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }
};

export default guidesAPI;