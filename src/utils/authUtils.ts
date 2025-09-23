// Define a type for the login response
export interface LoginResponse {
    access: string;
    refresh: string;
    token: string;
}

// Helper function to store tokens
export const storeTokens = (response: LoginResponse) => {
    localStorage.setItem("accessToken", response.access);
    localStorage.setItem("refreshToken", response.refresh);
    localStorage.setItem("authToken", response.token); // Optional if needed
};