"use client";

import type React from "react";
import Footer from "../Components/Footer";
import { useCallback } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  age: number | null;
  password: string;
  confirm_password: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "",
    age: null,
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Special handling for age field to convert to number
    if (name === "age") {
      const numValue = value === "" ? null : parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirm_password)
      newErrors.confirm_password = "Please confirm your password";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    // Password confirmation
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    // Username validation
    if (formData.username && formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    // Age validation (if provided)
    if (formData.age !== null) {
      if (isNaN(formData.age) || formData.age < 13 || formData.age > 120) {
        newErrors.age = "Age must be between 13 and 120";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const navigate = useNavigate();

  const goHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API (exclude confirm_password and convert age to number)
      const apiData = {
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        age: formData.age || 0, // Send 0 if age is null
        password: formData.password,
        confirm_password: formData.confirm_password, // Include confirm_password as required by API
      };

      // Replace this with your actual API call
      const response = await fetch(
        "https://wander-nest-ad3s.onrender.com/api/auth/register/",
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
        console.log("Full errorData:", errorData);
        console.error("API Error Response:", errorData);
        // Throw the whole error object so it can be displayed
        throw errorData;
      }

      const result = await response.json();
      console.log("Success:", result);

      setIsSuccess(true);
      // Add this inside the try block after setIsSuccess(true)
      setTimeout(() => {
        navigate("/login"); // or whatever your login route is
      }, 2000); // Wait 2 seconds then redirect

      // Reset form after successful submission
      setFormData({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        country: "",
        age: null,
        password: "",
        confirm_password: "",
      });
    } catch (error: any) {
      console.error("Error:", error);
      // Always show the error as a string, even if it's an object
      if (typeof error === "object" && error !== null) {
        setApiError(JSON.stringify(error, null, 2));
      } else if (error instanceof Error && error.message) {
        setApiError(error.message);
      } else {
        setApiError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset success state
  const resetSuccess = () => {
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1920')"
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-green-800/50 to-green-900/70" />
        
        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎉</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Created Successfully!</h1>
              <p className="text-lg text-gray-600 mb-6">
                Welcome to WanderNest! Your account has been created and you can now log in.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Go to Login
                </button>
                <button
                  onClick={resetSuccess}
                  className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  Create Another Account
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1920')"
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6">
          <div
            className="inline-flex items-center gap-3 cursor-pointer group"
            onClick={goHome}
          >
            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <img
                src="/figma_photos/wandernest.svg"
                alt="Logo"
                className="w-7 h-7"
              />
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-accent transition-colors duration-300">
              WanderNest
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Join WanderNest</h1>
              <p className="text-xl text-white/80">
                Start your journey to explore Bangladesh's hidden gems
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                {apiError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm font-medium text-center">
                      {apiError}
                    </p>
                  </div>
                )}

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Personal Information</h3>

                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${errors.username ? "border-red-300 bg-red-50" : "border-gray-300 bg-white/90"}`}
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                    {errors.username && (
                      <p className="text-red-600 text-sm mt-1 font-medium">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        id="first_name"
                        name="first_name"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${errors.first_name ? "border-red-300 bg-red-50" : "border-gray-300 bg-white/90"}`}
                        placeholder="Enter your first name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                      />
                      {errors.first_name && (
                        <p className="text-red-600 text-sm mt-1 font-medium">
                          {errors.first_name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        id="last_name"
                        name="last_name"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${errors.last_name ? "border-red-300 bg-red-50" : "border-gray-300 bg-white/90"}`}
                        placeholder="Enter your last name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                      />
                      {errors.last_name && (
                        <p className="text-red-600 text-sm mt-1 font-medium">
                          {errors.last_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        id="country"
                        name="country"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${errors.country ? "border-red-300 bg-red-50" : "border-gray-300 bg-white/90"}`}
                        placeholder="Enter your country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      />
                      {errors.country && (
                        <p className="text-red-600 text-sm mt-1 font-medium">
                          {errors.country}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-1">
                        Age <span className="text-gray-500 font-normal">(Optional)</span>
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        min="13"
                        max="120"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${errors.age ? "border-red-300 bg-red-50" : "border-gray-300 bg-white/90"}`}
                        placeholder="Age"
                        value={formData.age || ""}
                        onChange={handleChange}
                      />
                      {errors.age && (
                        <p className="text-red-600 text-sm mt-1 font-medium">
                          {errors.age}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Contact Information</h3>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300 bg-white/90"}`}
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${errors.phone ? "border-red-300 bg-red-50" : "border-gray-300 bg-white/90"}`}
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1 font-medium">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Account Security */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Account Security</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${errors.password ? "border-red-300 bg-red-50" : "border-gray-300 bg-white/90"}`}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      {errors.password && (
                        <p className="text-red-600 text-sm mt-1 font-medium">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${errors.confirm_password ? "border-red-300 bg-red-50" : "border-gray-300 bg-white/90"}`}
                        placeholder="Confirm your password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                      />
                      {errors.confirm_password && (
                        <p className="text-red-600 text-sm mt-1 font-medium">
                          {errors.confirm_password}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>

                <div className="text-center text-sm mt-6">
                  <span className="text-gray-600">Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-primary font-bold hover:text-primary-dark transition-colors duration-200"
                  >
                    Sign in here
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}