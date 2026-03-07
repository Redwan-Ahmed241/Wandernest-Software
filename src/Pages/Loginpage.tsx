/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context";
import { API_BASE, storeTokens } from '../config/api';
export default function TravelLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();

  // Get the message from navigation state
  const redirectMessage = location.state?.message;

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      // Check for stored redirect URL
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl);
      } else {
        navigate("/homepage");
      }
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("Attempting login with:", { username, password: "***" });

    try {
      const requestBody = { username, password };
      const loginUrl = `${API_BASE}/api/auth/login/`;
      console.log("Sending request to:", loginUrl);

      const response = await fetch(loginUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Try to get response text first
      const responseText = await response.text();
      console.log("Response text:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Parsed response data:", data);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error(`Server returned invalid JSON: ${responseText}`);
      }

      if (!response.ok) {
        console.error("Login failed with status:", response.status);
        console.error("Error data:", data);

        // Handle different types of error responses
        let errorMessage = "Login failed";
        if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        } else if (data?.detail) {
          errorMessage = data.detail;
        } else if (typeof data === "string") {
          errorMessage = data;
        } else if (response.status === 401) {
          errorMessage = "Invalid username or password";
        } else if (response.status === 400) {
          errorMessage = "Invalid request data";
        } else if (response.status === 500) {
          errorMessage = "Server error - please try again later";
        } else if (response.status === 404) {
          errorMessage = "Login endpoint not found";
        }

        throw new Error(errorMessage);
      }

      console.log("Login successful, user data:", data);

      // Store tokens in localStorage
      storeTokens({
        access: data.access,
        refresh: data.refresh,
        token: data.token,
      });

      // Use the auth context login function
      login(
        data.token,
        data.user || {
          id: data.user_id || "1",
          email: data.email || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          username: data.username || username,
        }
      );

      // Check for stored redirect URL
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl);
      } else {
        navigate("/homepage");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      console.error("Error details:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });

      let errorMessage = "Login failed";
      if (err.message) {
        errorMessage = err.message;
      } else if (err.name === "TypeError" && err.message.includes("fetch")) {
        errorMessage = "Network error - please check your connection";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWanderNestClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/Figma_photos/travel-background.jpg"
          alt="Travel background"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center" }}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Modern Login Card - Everything Inside */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
            {/* Logo & Welcome Section - Inside Card */}
            <div className="pt-10 pb-8 px-8 text-center border-b border-gray-100">
              <div
                className="inline-flex items-center gap-3 cursor-pointer group mb-6 hover:scale-105 transition-transform duration-300"
                onClick={handleWanderNestClick}
              >
                <img
                  src="/Figma_photos/Screenshot 2025-10-19 185315.svg"
                  alt="WanderNest Logo"
                  className="w-16 h-16 drop-shadow-xl group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-3xl font-bold bg-gradient-to-r from-[#4a6b5b] to-[#6ab187] bg-clip-text text-transparent">
                  WanderNest
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back
              </h1>
              <p className="text-base text-gray-500">
                We're so excited to see you again!
              </p>
            </div>

            {/* Form Section */}
            <div className="p-8">
              {redirectMessage && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-2 justify-center">
                    <span className="text-blue-600 text-lg">🔒</span>
                    <p className="text-blue-700 text-sm font-medium">
                      {redirectMessage}
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
                  <p className="text-red-600 text-sm font-medium text-center">
                    {error}
                  </p>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6ab187] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white hover:border-gray-300"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6ab187] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white hover:border-gray-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-semibold text-[#4a6b5b] hover:text-[#0d1c1c] transition-colors duration-200 hover:underline"
                    onClick={() => navigate("/fpass")}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-gradient-to-r from-[#6ab187] to-[#4a6b5b] hover:from-[#5a9c78] hover:to-[#3a5b4b] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Log in"
                  )}
                </button>



                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="w-full py-3.5 rounded-xl font-semibold text-base border-2 border-[#6ab187] text-[#4a6b5b] hover:bg-[#6ab187] hover:text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create an account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
