// Centralized auth storage helpers to keep keys consistent and avoid duplication

export interface AuthUserSession<User> {
  token: string;
  user: User;
}

export const AUTH_KEYS = {
  token: "token",
  userData: "userData",
  // Legacy/other keys used elsewhere in the app or server responses
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  authToken: "authToken",
} as const;

export function getSession<User = unknown>(): AuthUserSession<User> | null {
  try {
    // Preferred keys
    const token = localStorage.getItem(AUTH_KEYS.token);
    const rawUser = localStorage.getItem(AUTH_KEYS.userData);
    if (token && rawUser) {
      return { token, user: JSON.parse(rawUser) } as AuthUserSession<User>;
    }

    // Fallback: support existing keys set by storeTokens or other flows
    const legacyToken =
      localStorage.getItem(AUTH_KEYS.authToken) ||
      localStorage.getItem(AUTH_KEYS.accessToken) ||
      null;
    if (legacyToken && rawUser) {
      return { token: legacyToken, user: JSON.parse(rawUser) } as AuthUserSession<User>;
    }
  } catch {
    // If parsing fails, treat as no session
  }
  return null;
}

export function setSession<User = unknown>(session: AuthUserSession<User>) {
  const { token, user } = session;
  localStorage.setItem(AUTH_KEYS.token, token);
  localStorage.setItem(AUTH_KEYS.userData, JSON.stringify(user));
  // Also mirror to legacy key so existing consumers that read authToken still see it
  localStorage.setItem(AUTH_KEYS.authToken, token);
}

export function clearSession() {
  // Remove all known keys to avoid stale sessions
  localStorage.removeItem(AUTH_KEYS.token);
  localStorage.removeItem(AUTH_KEYS.userData);
  localStorage.removeItem(AUTH_KEYS.authToken);
  localStorage.removeItem(AUTH_KEYS.accessToken);
  localStorage.removeItem(AUTH_KEYS.refreshToken);
}
