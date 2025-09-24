"use client";

import type React from "react";
import Footer from "../components/Footer";
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

    const apiData = {
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      age: formData.age || 0,
      password: formData.password,
      confirm_password: formData.confirm_password,
    };

    try {
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
        throw errorData;
      }

      const result = await response.json();
      console.log("Success:", result);

      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);

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
    } catch (error: unknown) {
      console.error("Error:", error);
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
      <>
        <div className="container">
          <div className="form-wrapper">
            <div className="card">
              <div className="card-header">
                <h1 className="card-title">Account Created Successfully!</h1>
                <p className="card-description">
                  Welcome!to WanderNest Your account has been created.
                </p>
              </div>
              <div className="card-content">
                <div className="success-message">
                  <p>
                    Thank you for signing up. You can now log in to your
                    account.
                  </p>
                  <button
                    onClick={resetSuccess}
                    className="button"
                    style={{ marginTop: "1rem" }}
                  >
                    Create Another Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden">
      {/* Wildlife Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80')",
        }}
      ></div>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 via-primary/60 to-transparent z-0"></div>
      {/* Centered Form Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto my-16">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 transition-all duration-300 flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-primary-700 mb-2 text-center">
            <div className="flex flex-col items-center mb-8">
              <button onClick={goHome} className="focus:outline-none">
                <img
                  src="/Figma_photos/wandernest.svg"
                  alt="WanderNest"
                  className="w-16 h-16 mb-2 drop-shadow-xl hover:scale-110 transition-transform duration-300"
                />
              </button>
              <span className="text-3xl font-bold text-primary-700 drop-shadow-lg tracking-wide">
                WanderNest
              </span>
            </div>
          </h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {apiError && (
              <div className="mt-3 text-red-600 text-center font-medium">
                {apiError}
              </div>
            )}
            {/* Personal Information */}
            <div className="section flex flex-col gap-2">
              <h3 className="section-title font-semibold text-lg mb-2">
                Personal Information
              </h3>
              <div className="field-group flex flex-col gap-2">
                <label htmlFor="username" className="label font-medium">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  className={`input bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition ${errors.username ? "border-red-500" : ""
                    }`}
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                {errors.username && (
                  <span className="text-red-600 text-sm mt-1">
                    {errors.username}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="field-group flex flex-col gap-2">
                  <label htmlFor="first_name" className="label font-medium">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    className={`input bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition ${errors.first_name ? "border-red-500" : ""
                      }`}
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                  {errors.first_name && (
                    <span className="text-red-600 text-sm mt-1">
                      {errors.first_name}
                    </span>
                  )}
                </div>
                <div className="field-group flex flex-col gap-2">
                  <label htmlFor="last_name" className="label font-medium">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    className={`input bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition ${errors.last_name ? "border-red-500" : ""
                      }`}
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                  {errors.last_name && (
                    <span className="text-red-600 text-sm mt-1">
                      {errors.last_name}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="field-group flex flex-col gap-2 col-span-2">
                  <label htmlFor="country" className="label font-medium">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    className={`input bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition ${errors.country ? "border-red-500" : ""
                      }`}
                    placeholder="Enter your country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                  {errors.country && (
                    <span className="text-red-600 text-sm mt-1">
                      {errors.country}
                    </span>
                  )}
                </div>
                <div className="field-group flex flex-col gap-2">
                  <label htmlFor="age" className="label font-medium">
                    Age{" "}
                    <span className="optional-text text-gray-500">
                      (Optional)
                    </span>
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="13"
                    max="120"
                    className={`input bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition ${errors.age ? "border-red-500" : ""
                      }`}
                    placeholder="Age"
                    value={formData.age || ""}
                    onChange={handleChange}
                  />
                  {errors.age && (
                    <span className="text-red-600 text-sm mt-1">
                      {errors.age}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Contact Information */}
            <div className="section flex flex-col gap-2">
              <h3 className="section-title font-semibold text-lg mb-2">
                Contact Information
              </h3>
              <div className="field-group flex flex-col gap-2">
                <label htmlFor="email" className="label font-medium">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`input bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition ${errors.email ? "border-red-500" : ""
                    }`}
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <span className="text-red-600 text-sm mt-1">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="field-group flex flex-col gap-2">
                <label htmlFor="phone" className="label font-medium">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`input bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition ${errors.phone ? "border-red-500" : ""
                    }`}
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                {errors.phone && (
                  <span className="text-red-600 text-sm mt-1">
                    {errors.phone}
                  </span>
                )}
              </div>
            </div>
            {/* Account Security */}
            <div className="section flex flex-col gap-2">
              <h3 className="section-title font-semibold text-lg mb-2">
                Account Security
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="field-group flex flex-col gap-2">
                  <label htmlFor="password" className="label font-medium">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={`input bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition ${errors.password ? "border-red-500" : ""
                      }`}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {errors.password && (
                    <span className="text-red-600 text-sm mt-1">
                      {errors.password}
                    </span>
                  )}
                </div>
                <div className="field-group flex flex-col gap-2">
                  <label
                    htmlFor="confirm_password"
                    className="label font-medium"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    className={`input bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition ${errors.confirm_password ? "border-red-500" : ""
                      }`}
                    placeholder="Confirm your password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                  />
                  {errors.confirm_password && (
                    <span className="text-red-600 text-sm mt-1">
                      {errors.confirm_password}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: isLoading ? "#5a9c78" : "#6ab187",
                color: "white",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
            <div className="footer-text text-center mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="footer-link text-primary-700 font-semibold hover:underline"
              >
                Sign in here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
