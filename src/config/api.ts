// ============================================================
// Centralized API Configuration — Single Source of Truth
// ============================================================
// All API calls should import from here instead of hardcoding URLs.
// Set VITE_API_BASE in your .env to override the default.
//
// Usage:
//   import { API_BASE, EXPRESS_API_BASE, getAuthHeaders } from '../config/api';
//   fetch(`${API_BASE}/api/auth/login/`, { headers: getAuthHeaders() })
// ============================================================

const meta = (import.meta as unknown) as { env?: Record<string, string> };

// ── Django Backend (primary) ──────────────────────────────────
// Handles: auth, hotels, flights, packages, bookings, blogs,
//          groups, community, payments, destinations, things-to-do, visa, weather, currency
export const API_BASE: string =
  (meta.env?.VITE_API_BASE ?? "https://wander-nest-ad3s.onrender.com").replace(/\/+$/, "");

// ── Express Backend (secondary) ──────────────────────────────
// Handles: guides, transport/public-transport only
export const EXPRESS_API_BASE: string =
  (meta.env?.VITE_EXPRESS_API_BASE ?? "https://wandernest-backend.vercel.app").replace(/\/+$/, "");

// ── Auth Token Helpers ───────────────────────────────────────
// Standardized localStorage key for auth tokens
export const TOKEN_KEY = "token";
export const ACCESS_KEY = "access";
export const REFRESH_KEY = "refresh";

/** Read the best available auth token from localStorage */
export function getToken(): string | null {
  if (typeof localStorage === "undefined") return null;
  return (
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem(ACCESS_KEY) ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    null
  );
}

/** Build Authorization headers using the stored token */
export function getAuthHeaders(token?: string | null): Record<string, string> {
  const resolved = token ?? getToken();
  if (!resolved) return {};

  // Strip any existing prefix
  let clean = resolved.trim();
  clean = clean.replace(/^Bearer\s+/i, "").replace(/^Token\s+/i, "");

  // JWT tokens have 3 dot-separated parts or start with 'ey'
  const isJwt = clean.split(".").length === 3 || /^ey[A-Za-z0-9_-]/.test(clean);
  const scheme = isJwt ? "Bearer" : "Token";

  return { Authorization: `${scheme} ${clean}` };
}

/** Store tokens received from login response */
export function storeTokens(data: {
  token?: string;
  access?: string;
  refresh?: string;
  key?: string;
}) {
  if (typeof localStorage === "undefined") return;

  const token = data.token || data.key || data.access || "";
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (data.access) localStorage.setItem(ACCESS_KEY, data.access);
  if (data.refresh) localStorage.setItem(REFRESH_KEY, data.refresh);
}

/** Clear all auth tokens */
export function clearTokens() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  // Also clear legacy keys
  localStorage.removeItem("access_token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authToken");
}

// Debug flag — enabled on localhost automatically
export const DEBUG_API =
  meta.env?.VITE_DEBUG_API === "true" ||
  (typeof window !== "undefined" &&
    window.location?.hostname?.includes("localhost"));
