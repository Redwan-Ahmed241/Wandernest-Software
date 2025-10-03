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
  const raw = await request<Record<string, unknown>>('/api/dashboard/stats/', {}, token);
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
  };
  return s;
}

export async function getBookingsActive(token?: string): Promise<Booking[]> {
  const raw = await request<unknown>('/api/bookings/active', {}, token);

  // try to extract an array from multiple possible shapes
  const asRecord = (raw as Record<string, unknown> | null) ?? null;
  let items: unknown[] = [];
  if (Array.isArray(raw)) items = raw as unknown[];
  else if (Array.isArray(asRecord?.results as unknown)) items = asRecord!.results as unknown[];
  else if (Array.isArray(asRecord?.data as unknown)) items = asRecord!.data as unknown[];
  else if (Array.isArray(asRecord?.bookings as unknown)) items = asRecord!.bookings as unknown[];
  else if (Array.isArray(asRecord?.items as unknown)) items = asRecord!.items as unknown[];

  if (!items || items.length === 0) return [];

  return items.map((item) => {
    const b = (item as Record<string, unknown>) ?? {};
    return {
      id: String(b['id'] ?? b['booking_id'] ?? b['pk'] ?? '').slice(0, 100) || `b_${Date.now()}`,
      title: String(b['title'] ?? b['name'] ?? b['package_name'] ?? 'Untitled'),
      startDate: String(b['startDate'] ?? b['start_date'] ?? b['checkin'] ?? new Date().toISOString()),
      endDate: String(b['endDate'] ?? b['end_date'] ?? b['checkout'] ?? new Date().toISOString()),
      status: String(b['status'] ?? b['booking_status'] ?? 'pending'),
      price: Number(b['price'] ?? b['amount'] ?? b['total'] ?? 0) || 0,
      image: (b['image'] ?? b['photo'] ?? b['image_url']) as string | undefined,
      location: (b['location'] ?? b['place'] ?? b['city']) as string | undefined,
      travelers: Number(b['travelers'] ?? b['guests'] ?? 1) || 1,
    } as Booking;
  });
}

export async function getBookingsHistory(token?: string): Promise<{ count?: number; results: Booking[] }>{
  return request('/api/bookings/history', {}, token) as Promise<{ count?: number; results: Booking[] }>;
}

export async function getUpcomingTrips(token?: string): Promise<Booking[]> {
  return request<Booking[]>('/api/dashboard/upcoming-trips/', {}, token);
}

export async function getUserProfile(token?: string): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>('/api/user/profile/', {}, token);
}

export default {
  getDashboardStats,
  getBookingsActive,
  getBookingsHistory,
  getUpcomingTrips,
  getUserProfile,
};
