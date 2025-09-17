/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context";

export default function TravelLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/homepage");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("Attempting login with:", { username, password: "***" });

    // Mock authentication for testing
    const mockCredentials = {
      username: "admin",
      password: "password123",
    };

    // Check if using mock credentials
    if (
      username === mockCredentials.username &&
      password === mockCredentials.password
    ) {
      console.log("Using mock authentication - login successful");

      // Create mock user data
      const mockUser = {
        id: "1",
        email: "admin@wandernest.com",
        first_name: "Admin",
        last_name: "User",
        username: "admin",
      };

      // Create mock token
      const mockToken = "mock-jwt-token-" + Date.now();

      // Use the auth context login function
      login(mockToken, mockUser);

      console.log("Mock login successful, navigating to homepage");
      navigate("/homepage");
      return;
    }

    // Original API authentication logic (as fallback)
    try {
      const requestBody = { username, password };
      console.log(
        "Sending request to:",
        "https://wander-nest-ad3s.onrender.com/api/auth/login/"
      );
      console.log("Request body:", requestBody);

      const response = await fetch(
        "https://wander-nest-ad3s.onrender.com/api/auth/login/",
        {
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

      navigate("/homepage");
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
      {/* Background Image - mobile: show entire photo (no crop). md+: fill the area for best desktop look */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-transparent">
        <img
          src="/Figma_photos/travel-background.jpg"
          alt="Travel background"
          className="w-full h-full object-contain md:object-cover"
          style={{ objectPosition: "center" }}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-3 cursor-pointer group mb-6"
              onClick={handleWanderNestClick}
            >
              <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/Figma_photos/wandernest.svg"
                  alt="WanderNest Logo"
                  className="w-7 h-7"
                />
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-accent transition-colors duration-300">
                WanderNest
              </span>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back
              </h1>
              <p className="text-lg text-white/80">
                We're so excited to see you again!
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium text-center">
                  {error}
                </p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/90"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/90"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  className="text-sm font-medium transition-colors duration-200 hover:underline"
                  style={{ color: "#4a6b5b" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#0d1c1c")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#4a6b5b")
                  }
                  onClick={() => navigate("/fpass")}
                >
                  Forgot your password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: isLoading
                    ? "linear-gradient(to right, #6ab187, #4a6b5b)"
                    : "linear-gradient(to right, #4a6b5b, #0d1c1c)",
                  color: "white",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="font-medium transition-colors duration-200 hover:underline"
                    style={{ color: "#4a6b5b" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#0d1c1c")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#4a6b5b")
                    }
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
