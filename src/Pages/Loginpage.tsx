"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context";
// Tailwind conversion: remove CSS import

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

  const _handleLogout = () => {
    // This function is no longer needed since we're using auth context
  };

  const handleWanderNestClick = () => {
    navigate("/");
  };

  // Remove the isLoggedIn state and related logic since we're using auth context
  return (
    <div className="min-h-screen flex items-center justify-center bg-accent-light font-jakarta">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleWanderNestClick}
          >
            <img
              src="/figma_photos/wandernest.svg"
              alt="WanderNest Logo"
              className="w-10 h-10"
            />
            <button
              type="button"
              className="text-xl font-bold text-primary hover:text-primary-dark transition"
            >
              WanderNest
            </button>
          </div>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2">Welcome back</h1>
          <p className="text-base text-primary-dark">
            We're so excited to see you again!
          </p>
        </div>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center font-semibold">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-primary-dark mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light text-primary-dark bg-accent-light"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary-dark mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light text-primary-dark bg-accent-light"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-end mb-2">
            <span
              className="text-sm text-primary cursor-pointer hover:underline"
              onClick={() => navigate("/fpass")}
            >
              Forget your password?
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
          <div className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
