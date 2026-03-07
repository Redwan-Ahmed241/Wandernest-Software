"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "react-feather";

import { API_BASE } from '../config/api';
interface FormData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirm_password)
      newErrors.confirm_password = "Please confirm your password";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    if (formData.username && formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const apiData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirm_password,
    };

    try {
      const response = await fetch(
        `${API_BASE}/api/auth/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);

        // Handle specific error messages
        if (errorData.username) {
          setApiError(`Username: ${errorData.username[0]}`);
        } else if (errorData.email) {
          setApiError(`Email: ${errorData.email[0]}`);
        } else if (errorData.password) {
          setApiError(`Password: ${errorData.password[0]}`);
        } else {
          setApiError("Registration failed. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      console.log("Success:", result);

      // Redirect to login with success message
      navigate("/login", {
        state: {
          message: "Account created successfully! Please log in."
        }
      });

    } catch (error: unknown) {
      console.error("Error:", error);
      setApiError("An unexpected error occurred. Please try again.");
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
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/Figma_photos/travel-background.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1c1c]/80 via-[#4a6b5b]/60 to-[#0d1c1c]/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Modern Signup Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
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
                Create Account
              </h1>
              <p className="text-base text-gray-500">
                Join WanderNest and start exploring Bangladesh
              </p>
            </div>

            {/* Form Section */}
            <div className="p-8">
              {apiError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium text-center">
                    {apiError}
                  </p>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6ab187] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white ${errors.username ? "border-red-500" : "border-gray-200 hover:border-gray-300"
                      }`}
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  {errors.username && (
                    <p className="text-red-600 text-sm mt-1.5">{errors.username}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6ab187] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white ${errors.email ? "border-red-500" : "border-gray-200 hover:border-gray-300"
                      }`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1.5">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6ab187] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white ${errors.password ? "border-red-500" : "border-gray-200 hover:border-gray-300"
                        }`}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1.5">{errors.password}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1.5">
                    Must be at least 8 characters long
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirm_password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6ab187] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white ${errors.confirm_password ? "border-red-500" : "border-gray-200 hover:border-gray-300"
                        }`}
                      placeholder="Confirm your password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-red-600 text-sm mt-1.5">{errors.confirm_password}</p>
                  )}
                </div>

                {/* Submit Button */}
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
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>



                {/* Sign In Link */}
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="font-semibold text-[#4a6b5b] hover:text-[#0d1c1c] transition-colors duration-200 hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
