// Lightweight dashboard API client used by the frontend
// Uses Vite env var VITE_API_BASE (if set) as the base URL.
// Each method accepts an optional bearer token. If omitted, it will try to read from localStorage 'token'.

export interface Booking {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  price: number;
  image?: string;
  location?: string;
  travelers?: number;
}

export interface Stats {
  totalBookings: number;
  upcomingTrips: number;
  totalSpent: number;
  completedTrips: number;
  pendingBookings: number;
  cancelledBookings: number;
  averageSpentPerTrip: number;
  favoriteDestination: string;
  memberSince: string;
}

// Additional interfaces for new endpoints
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone?: string;
  profile_image?: string;
  membership_level?: string;
  join_date: string;
  preferences?: {
    currency: string;
    language: string;
    timezone: string;
    notifications_enabled: boolean;
  };
  verification?: {
    email_verified: boolean;
    phone_verified: boolean;
    identity_verified: boolean;
  };
}

export interface TravelPreferences {
  budget_range: {
    min: number;
    max: number;
    currency: string;
  };
  preferred_destinations: string[];
  travel_style: string;
  group_size: string;
  accommodation_type: string[];
  transportation: string[];
  interests: string[];
  dietary_restrictions: string[];
  accessibility_needs: string[];
}

export interface PaymentMethod {
  id: string;
  type: string;
  brand: string;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
  billing_address: {
    country: string;
    city: string;
  };
}

export interface Transaction {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: string;
  transaction_date: string;
  description: string;
  payment_method: string;
}

export interface LoyaltyStatus {
  current_points: number;
  points_to_next_tier: number;
  current_tier: string;
  next_tier: string;
  tier_benefits: string[];
  points_expiring_soon: {
    amount: number;
    expiry_date: string;
  };
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  points_required: number;
  category: string;
  validity: string;
  terms_conditions: string[];
  available: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  image: string;
  estimated_cost: number;
  best_time_to_visit: string;
  added_date: string;
  price_alerts_enabled: boolean;
}

export interface SavedSearch {
  id: string;
  name: string;
  search_type: string;
  criteria: Record<string, unknown>;
  created_date: string;
  alert_enabled: boolean;
}

type ApiSuccess<T> = { success: true; data: T };

const meta = (import.meta as unknown) as { env?: Record<string, string> };
// Default to the deployed API host if VITE_API_BASE is not provided locally
const DEFAULT_API_BASE = "https://wander-nest-ad3s.onrender.com";
const rawBase = meta.env?.VITE_API_BASE ?? DEFAULT_API_BASE;
const API_BASE = String(rawBase).replace(/\/$/, "");
const DEBUG = (meta.env?.VITE_DEBUG_API === 'true') || (typeof window !== 'undefined' && window.location && window.location.hostname.includes('localhost'));

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const resolvedToken = token ?? (typeof localStorage !== 'undefined'
    ? (localStorage.getItem('token') || localStorage.getItem('access') || localStorage.getItem('access_token') || undefined)
    : undefined);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (resolvedToken) {
    // Normalize stored tokens: remove any existing 'Token ' or 'Bearer ' prefix
    let tokenStr = String(resolvedToken).trim();
    tokenStr = tokenStr.replace(/^Bearer\s+/i, '').replace(/^Token\s+/i, '');
    // Heuristic: JWTs typically have three dot-separated parts or start with 'ey'
    const looksLikeJwt = tokenStr.split('.').length === 3 || /^ey[A-Za-z0-9_-]/.test(tokenStr);
    const scheme = looksLikeJwt ? 'Bearer' : 'Token';
    headers['Authorization'] = `${scheme} ${tokenStr}`;
  }

  if (DEBUG) {
    const maskedAuth = headers.Authorization ? headers.Authorization.replace(/\s+(.{8}).+/, ' $1...') : '(none)';
    console.debug('[API DEBUG] Request', { method: options.method ?? 'GET', url, Authorization: maskedAuth });
  }

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  if (DEBUG) {
    // try to safely log small responses
    let preview = text;
    if (preview && preview.length > 2000) preview = preview.slice(0, 2000) + '... (truncated)';
    console.debug('[API DEBUG] Response', { url, status: res.status, bodyPreview: preview });
  }
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // Not JSON — return text as-is when appropriate
    if (!res.ok) throw new Error(res.statusText || 'Request failed');
    return text as unknown as T;
  }

  if (!res.ok) {
    // try to read message from parsed json when possible
    const msg = typeof json === 'object' && json !== null ? (json as Record<string, unknown>)['message'] : undefined;
    const message = ((msg && String(msg)) || res.statusText || 'Request failed');
    throw new Error(String(message));
  }

  // Normalize new `{ success: true, data }` style and legacy raw responses
  if (json && typeof json === 'object' && ('success' in (json as Record<string, unknown>))) {
    return ((json as ApiSuccess<T>).data) as T;
  }

  return json as T;
}

export async function getDashboardStats(token?: string): Promise<Stats> {
  try {
    const raw = await request<Record<string, unknown>>('/api/dashboard/stats/', {}, token);
    console.log('🔍 DEBUG - Dashboard stats response:', raw);
    
    // normalize to Stats shape with safe numeric defaults
    const s: Stats = {
      totalBookings: (() => {
        const r = raw as Record<string, unknown> | null;
        const candidate = Number(
          r?.totalBookings ?? r?.total_bookings ?? r?.bookings_count ?? r?.total ?? r?.count ?? 0
        );
        if (!Number.isNaN(candidate) && candidate > 0) return candidate;
        const results = r?.results;
        if (Array.isArray(results)) return results.length;
        return 0;
      })(),
      upcomingTrips: Number(raw?.upcomingTrips ?? raw?.upcoming_trips ?? 0) || 0,
      totalSpent: Number(raw?.totalSpent ?? raw?.total_spent ?? 0) || 0,
      completedTrips: Number(raw?.completedTrips ?? raw?.completed_trips ?? 0) || 0,
      pendingBookings: Number(raw?.pendingBookings ?? raw?.pending_bookings ?? 0) || 0,
      cancelledBookings: Number(raw?.cancelledBookings ?? raw?.cancelled_bookings ?? 0) || 0,
      averageSpentPerTrip: Number(raw?.averageSpentPerTrip ?? raw?.average_spent_per_trip ?? 0) || 0,
      favoriteDestination: String(raw?.favoriteDestination ?? raw?.favorite_destination ?? ''),
      memberSince: String(raw?.memberSince ?? raw?.member_since ?? ''),
    };
    
    // If stats endpoint returns 0 bookings, try to get actual count from bookings
    if (s.totalBookings === 0) {
      console.log('🔍 DEBUG - Stats returned 0 bookings, fetching actual bookings to count...');
      const bookings = await getBookingsActive(token);
      s.totalBookings = bookings.length;
      
      // Calculate other stats from bookings
      if (bookings.length > 0) {
        s.totalSpent = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
        s.pendingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
        s.completedTrips = bookings.filter(b => b.status === 'completed').length;
        s.cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
        s.upcomingTrips = bookings.filter(b => new Date(b.startDate) > new Date()).length;
        s.averageSpentPerTrip = s.totalBookings > 0 ? s.totalSpent / s.totalBookings : 0;
        console.log('🔍 DEBUG - Calculated stats from bookings:', s);
      }
    }
    
    return s;
  } catch (error) {
    console.error('🔍 DEBUG - Error fetching dashboard stats:', error);
    console.log('🔍 DEBUG - Falling back to calculating stats from bookings...');
    
    // Fallback: Calculate stats from bookings
    const bookings = await getBookingsActive(token);
    return {
      totalBookings: bookings.length,
      upcomingTrips: bookings.filter(b => new Date(b.startDate) > new Date()).length,
      totalSpent: bookings.reduce((sum, b) => sum + (b.price || 0), 0),
      completedTrips: bookings.filter(b => b.status === 'completed').length,
      pendingBookings: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
      cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
      averageSpentPerTrip: bookings.length > 0 ? bookings.reduce((sum, b) => sum + (b.price || 0), 0) / bookings.length : 0,
      favoriteDestination: '',
      memberSince: '',
    };
  }
}

export async function getBookingsActive(token?: string): Promise<Booking[]> {
  try {
    const raw = await request<unknown>('/api/bookings/active', {}, token);
    
    // Debug logging to see what backend returns
    console.log('🔍 DEBUG - Raw bookings response from /api/bookings/active:', raw);
    console.log('🔍 DEBUG - Type of response:', typeof raw);
    console.log('🔍 DEBUG - Is array?', Array.isArray(raw));

    // try to extract an array from multiple possible shapes
    const asRecord = (raw as Record<string, unknown> | null) ?? null;
    let items: unknown[] = [];
    if (Array.isArray(raw)) {
      items = raw as unknown[];
      console.log('🔍 DEBUG - Found array directly, length:', items.length);
    } else if (Array.isArray(asRecord?.results as unknown)) {
      items = asRecord!.results as unknown[];
      console.log('🔍 DEBUG - Found array in results, length:', items.length);
    } else if (Array.isArray(asRecord?.data as unknown)) {
      items = asRecord!.data as unknown[];
      console.log('🔍 DEBUG - Found array in data, length:', items.length);
    } else if (Array.isArray(asRecord?.bookings as unknown)) {
      items = asRecord!.bookings as unknown[];
      console.log('🔍 DEBUG - Found array in bookings, length:', items.length);
    } else if (Array.isArray(asRecord?.items as unknown)) {
      items = asRecord!.items as unknown[];
      console.log('🔍 DEBUG - Found array in items, length:', items.length);
    } else {
      console.log('🔍 DEBUG - No array found in response structure');
      console.log('🔍 DEBUG - Available keys:', asRecord ? Object.keys(asRecord) : 'null');
    }

    if (!items || items.length === 0) {
      console.log('🔍 DEBUG - No items found from /api/bookings/active, trying fallback endpoints...');
      // Fallback: Try to fetch from individual booking type endpoints
      return await getBookingsFromTypeEndpoints(token);
    }

    return items.map((item) => {
      const b = (item as Record<string, unknown>) ?? {};
      return {
        id: String(b['id'] ?? b['booking_id'] ?? b['pk'] ?? '').slice(0, 100) || `b_${Date.now()}`,
        title: String(b['title'] ?? b['name'] ?? b['package_name'] ?? b['hotel_name'] ?? 'Untitled'),
        startDate: String(b['startDate'] ?? b['start_date'] ?? b['checkin'] ?? b['checkin_date'] ?? new Date().toISOString()),
        endDate: String(b['endDate'] ?? b['end_date'] ?? b['checkout'] ?? new Date().toISOString()),
        status: String(b['status'] ?? b['booking_status'] ?? 'pending'),
        price: Number(b['price'] ?? b['amount'] ?? b['total'] ?? b['total_amount'] ?? 0) || 0,
        image: (b['image'] ?? b['photo'] ?? b['image_url']) as string | undefined,
        location: (b['location'] ?? b['place'] ?? b['city']) as string | undefined,
        travelers: Number(b['travelers'] ?? b['guests'] ?? 1) || 1,
      } as Booking;
    });
  } catch (error) {
    console.error('🔍 DEBUG - Error fetching from /api/bookings/active:', error);
    console.log('🔍 DEBUG - Falling back to type-specific endpoints...');
    // If /api/bookings/active fails, try individual endpoints
    return await getBookingsFromTypeEndpoints(token);
  }
}

// Helper function to fetch bookings from individual type endpoints
async function getBookingsFromTypeEndpoints(token?: string): Promise<Booking[]> {
  try {
    const [hotelBookings, packageBookings, tripBookings] = await Promise.all([
      // Use trailing slashes to match backend routing (Django/DRF often requires them)
      request<unknown>('/api/bookings/hotels/', {}, token).catch((err) => {
        console.error('🔍 DEBUG - Error fetching hotel bookings:', err);
        return [];
      }),
      request<unknown>('/api/bookings/packages/', {}, token).catch((err) => {
        console.error('🔍 DEBUG - Error fetching package bookings:', err);
        return [];
      }),
      request<unknown>('/api/bookings/trips/', {}, token).catch((err) => {
        console.error('🔍 DEBUG - Error fetching trip bookings:', err);
        return [];
      }),
    ]);

    console.log('🔍 DEBUG - Hotel bookings response:', hotelBookings);
    console.log('🔍 DEBUG - Package bookings response:', packageBookings);
    console.log('🔍 DEBUG - Trip bookings response:', tripBookings);

    // Normalize each response to an array
    const normalizeToArray = (raw: unknown): unknown[] => {
      if (Array.isArray(raw)) return raw;
      const asRecord = (raw as Record<string, unknown> | null) ?? null;
      if (Array.isArray(asRecord?.results)) return asRecord!.results as unknown[];
      if (Array.isArray(asRecord?.data)) return asRecord!.data as unknown[];
      if (Array.isArray(asRecord?.bookings)) return asRecord!.bookings as unknown[];
      return [];
    };

    const hotelItems = normalizeToArray(hotelBookings);
    const packageItems = normalizeToArray(packageBookings);
    const tripItems = normalizeToArray(tripBookings);

    console.log('🔍 DEBUG - Hotel items count:', hotelItems.length);
    console.log('🔍 DEBUG - Package items count:', packageItems.length);
    console.log('🔍 DEBUG - Trip items count:', tripItems.length);

    // Combine all bookings
    const allBookings = [...hotelItems, ...packageItems, ...tripItems];

    return allBookings.map((item) => {
      const b = (item as Record<string, unknown>) ?? {};
      return {
        id: String(b['id'] ?? b['booking_id'] ?? b['pk'] ?? '').slice(0, 100) || `b_${Date.now()}`,
        title: String(b['title'] ?? b['name'] ?? b['package_name'] ?? b['hotel_name'] ?? 'Untitled'),
        startDate: String(b['startDate'] ?? b['start_date'] ?? b['checkin'] ?? b['checkin_date'] ?? new Date().toISOString()),
        endDate: String(b['endDate'] ?? b['end_date'] ?? b['checkout'] ?? new Date().toISOString()),
        status: String(b['status'] ?? b['booking_status'] ?? 'pending'),
        price: Number(b['price'] ?? b['amount'] ?? b['total'] ?? b['total_amount'] ?? 0) || 0,
        image: (b['image'] ?? b['photo'] ?? b['image_url']) as string | undefined,
        location: (b['location'] ?? b['place'] ?? b['city']) as string | undefined,
        travelers: Number(b['travelers'] ?? b['guests'] ?? 1) || 1,
      } as Booking;
    });
  } catch (error) {
    console.error('🔍 DEBUG - Error fetching from type-specific endpoints:', error);
    return [];
  }
}

export async function getBookingsHistory(token?: string): Promise<{ count?: number; results: Booking[] }>{
  return request('/api/bookings/history', {}, token) as Promise<{ count?: number; results: Booking[] }>;
}

export async function getUpcomingTrips(token?: string): Promise<Booking[]> {
  return request<Booking[]>('/api/dashboard/upcoming-trips/', {}, token);
}

export async function getUserProfile(token?: string): Promise<UserProfile> {
  return request<UserProfile>('/api/user/profile/', {}, token);
}

// Additional User Profile & Stats endpoints
export async function getUserStats(token?: string): Promise<Stats> {
  return request<Stats>('/api/users/stats', {}, token);
}

export async function updateUserProfile(userData: Partial<UserProfile>, token?: string): Promise<UserProfile> {
  return request<UserProfile>('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }, token);
}

// Booking Documents endpoints
export async function getBookingDocuments(bookingId: string, token?: string): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>(`/api/bookings/${bookingId}/documents`, {}, token);
}

export async function downloadBookingDocument(bookingId: string, documentType: string, token?: string): Promise<Blob> {
  const url = `/api/bookings/${bookingId}/documents/${documentType}/download`;
  const resolvedToken = token ?? (typeof localStorage !== 'undefined'
    ? (localStorage.getItem('token') || localStorage.getItem('access') || localStorage.getItem('access_token') || undefined)
    : undefined);

  const headers: Record<string, string> = {};
  
  if (resolvedToken) {
    let tokenStr = String(resolvedToken).trim();
    tokenStr = tokenStr.replace(/^Bearer\s+/i, '').replace(/^Token\s+/i, '');
    const looksLikeJwt = tokenStr.split('.').length === 3 || /^ey[A-Za-z0-9_-]/.test(tokenStr);
    const scheme = looksLikeJwt ? 'Bearer' : 'Token';
    headers['Authorization'] = `${scheme} ${tokenStr}`;
  }

  const response = await fetch(`${API_BASE}${url}`, { headers });
  
  if (!response.ok) {
    throw new Error(`Failed to download document: ${response.statusText}`);
  }
  
  return response.blob();
}

// Travel Preferences endpoints
export async function getTravelPreferences(token?: string): Promise<TravelPreferences> {
  return request<TravelPreferences>('/api/users/travel-preferences', {}, token);
}

export async function updateTravelPreferences(preferences: Partial<TravelPreferences>, token?: string): Promise<TravelPreferences> {
  return request<TravelPreferences>('/api/users/travel-preferences', {
    method: 'PUT',
    body: JSON.stringify(preferences),
  }, token);
}

// Security Settings endpoints
export async function getSecuritySettings(token?: string): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>('/api/users/security-settings', {}, token);
}

export async function updateSecuritySettings(settings: Record<string, unknown>, token?: string): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>('/api/users/security-settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }, token);
}

// Privacy Settings endpoints
export async function getPrivacySettings(token?: string): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>('/api/users/privacy-settings', {}, token);
}

export async function updatePrivacySettings(settings: Record<string, unknown>, token?: string): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>('/api/users/privacy-settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }, token);
}

// Wishlist endpoints
export async function getWishlist(token?: string): Promise<WishlistItem[]> {
  return request<WishlistItem[]>('/api/users/wishlist', {}, token);
}

export async function addToWishlist(destination: Partial<WishlistItem>, token?: string): Promise<WishlistItem> {
  return request<WishlistItem>('/api/users/wishlist', {
    method: 'POST',
    body: JSON.stringify(destination),
  }, token);
}

export async function removeFromWishlist(destinationId: string, token?: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/api/users/wishlist/${destinationId}`, {
    method: 'DELETE',
  }, token);
}

// Analytics & Insights endpoints
export async function getTravelAnalytics(token?: string): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>('/api/analytics/travel-stats', {}, token);
}

export async function getBudgetTracking(token?: string): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>('/api/analytics/budget-tracking', {}, token);
}

// Recommendations & Discovery endpoints
export async function getDashboardRecommendations(token?: string): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>('/api/recommendations/dashboard', {}, token);
}

export async function getTrendingDestinations(limit: number = 6, token?: string): Promise<Record<string, unknown>[]> {
  return request<Record<string, unknown>[]>(`/api/destinations/trending?limit=${limit}`, {}, token);
}

export async function getWeatherInformation(token?: string): Promise<Record<string, unknown>[]> {
  return request<Record<string, unknown>[]>('/api/weather/destinations', {}, token);
}

export async function getTravelAdvisories(token?: string): Promise<Record<string, unknown>[]> {
  return request<Record<string, unknown>[]>('/api/travel/advisories', {}, token);
}

// Notifications & Alerts endpoints
export async function getPriceDropAlerts(token?: string): Promise<Array<Record<string, unknown>>> {
  return request<Array<Record<string, unknown>>>('/api/alerts/price-drops', {}, token);
}

export async function getNotifications(token?: string): Promise<Notification[]> {
  return request<Notification[]>('/api/notifications/', {}, token);
}

export async function markNotificationAsRead(notificationId: string, token?: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/api/notifications/${notificationId}/read`, {
    method: 'POST',
  }, token);
}

// Financial Management endpoints
export async function getPaymentMethods(token?: string): Promise<PaymentMethod[]> {
  return request<PaymentMethod[]>('/api/users/payment-methods', {}, token);
}

export async function addPaymentMethod(paymentData: Partial<PaymentMethod>, token?: string): Promise<PaymentMethod> {
  return request<PaymentMethod>('/api/users/payment-methods', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }, token);
}

export async function removePaymentMethod(paymentMethodId: string, token?: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/api/users/payment-methods/${paymentMethodId}`, {
    method: 'DELETE',
  }, token);
}

export async function getRecentTransactions(token?: string): Promise<Transaction[]> {
  return request<Transaction[]>('/api/transactions/recent', {}, token);
}

// Loyalty & Rewards endpoints
export async function getLoyaltyStatus(token?: string): Promise<LoyaltyStatus> {
  return request<LoyaltyStatus>('/api/loyalty/status', {}, token);
}

export async function getAvailableRewards(token?: string): Promise<Reward[]> {
  return request<Reward[]>('/api/loyalty/rewards', {}, token);
}

export async function redeemReward(rewardId: string, token?: string): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>(`/api/loyalty/rewards/${rewardId}/redeem`, {
    method: 'POST',
  }, token);
}

// Quick Booking & Searches endpoints
export async function getQuickBookingOptions(token?: string): Promise<Record<string, unknown>[]> {
  return request<Record<string, unknown>[]>('/api/quick-booking/options', {}, token);
}

export async function getSavedSearches(token?: string): Promise<SavedSearch[]> {
  return request<SavedSearch[]>('/api/users/saved-searches', {}, token);
}

export async function createSavedSearch(searchData: Partial<SavedSearch>, token?: string): Promise<SavedSearch> {
  return request<SavedSearch>('/api/users/saved-searches', {
    method: 'POST',
    body: JSON.stringify(searchData),
  }, token);
}

export async function deleteSavedSearch(searchId: string, token?: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/api/users/saved-searches/${searchId}`, {
    method: 'DELETE',
  }, token);
}

// Data Management endpoints
export async function exportUserData(dataTypes: string[], fileFormat: string = 'json', token?: string): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>('/api/users/export-data', {
    method: 'POST',
    body: JSON.stringify({ data_types: dataTypes, file_format: fileFormat }),
  }, token);
}

export async function getExportStatus(exportId: string, token?: string): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>(`/api/users/export-data/${exportId}/status`, {}, token);
}

export async function downloadExportedData(exportId: string, token?: string): Promise<Blob> {
  const url = `/api/users/export-data/${exportId}/download`;
  const resolvedToken = token ?? (typeof localStorage !== 'undefined'
    ? (localStorage.getItem('token') || localStorage.getItem('access') || localStorage.getItem('access_token') || undefined)
    : undefined);

  const headers: Record<string, string> = {};
  
  if (resolvedToken) {
    let tokenStr = String(resolvedToken).trim();
    tokenStr = tokenStr.replace(/^Bearer\s+/i, '').replace(/^Token\s+/i, '');
    const looksLikeJwt = tokenStr.split('.').length === 3 || /^ey[A-Za-z0-9_-]/.test(tokenStr);
    const scheme = looksLikeJwt ? 'Bearer' : 'Token';
    headers['Authorization'] = `${scheme} ${tokenStr}`;
  }

  const response = await fetch(`${API_BASE}${url}`, { headers });
  
  if (!response.ok) {
    throw new Error(`Failed to download exported data: ${response.statusText}`);
  }
  
  return response.blob();
}

// Support & Communication endpoints
export async function getWebSocketInfo(token?: string): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>('/api/ws-info/dashboard', {}, token);
}

export async function supportChatEcho(message: string, token?: string): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>('/api/support/chat/echo', {
    method: 'POST',
    body: JSON.stringify({ message }),
  }, token);
}

// Legacy endpoints (for backward compatibility)
export async function getLegacyDashboardStats(token?: string): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>('/api/dashboard/stats/', {}, token);
}

export async function getLegacyRecentActivity(token?: string): Promise<Record<string, unknown>[]> {
  return request<Record<string, unknown>[]>('/api/dashboard/recent-activity/', {}, token);
}

export async function getLegacyNotifications(token?: string): Promise<Record<string, unknown>[]> {
  return request<Record<string, unknown>[]>('/api/notifications/', {}, token);
}

export async function getLegacyQuickActions(token?: string): Promise<Record<string, unknown>[]> {
  return request<Record<string, unknown>[]>('/api/dashboard/quick-actions/', {}, token);
}

export default {
  // Core dashboard functions
  getDashboardStats,
  getBookingsActive,
  getBookingsHistory,
  getUpcomingTrips,
  getUserProfile,
  
  // User Profile & Stats
  getUserStats,
  updateUserProfile,
  
  // Booking Management
  getBookingDocuments,
  downloadBookingDocument,
  
  // Preferences & Settings
  getTravelPreferences,
  updateTravelPreferences,
  getSecuritySettings,
  updateSecuritySettings,
  getPrivacySettings,
  updatePrivacySettings,
  
  // Wishlist
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  
  // Analytics & Insights
  getTravelAnalytics,
  getBudgetTracking,
  
  // Recommendations & Discovery
  getDashboardRecommendations,
  getTrendingDestinations,
  getWeatherInformation,
  getTravelAdvisories,
  
  // Notifications & Alerts
  getPriceDropAlerts,
  getNotifications,
  markNotificationAsRead,
  
  // Financial Management
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  getRecentTransactions,
  
  // Loyalty & Rewards
  getLoyaltyStatus,
  getAvailableRewards,
  redeemReward,
  
  // Quick Booking & Searches
  getQuickBookingOptions,
  getSavedSearches,
  createSavedSearch,
  deleteSavedSearch,
  
  // Data Management
  exportUserData,
  getExportStatus,
  downloadExportedData,
  
  // Support & Communication
  getWebSocketInfo,
  supportChatEcho,
  
  // Legacy endpoints
  getLegacyDashboardStats,
  getLegacyRecentActivity,
  getLegacyNotifications,
  getLegacyQuickActions,
};
