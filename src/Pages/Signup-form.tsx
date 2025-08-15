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
    setApiError("");

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
    <>
      <div className={"depth3Frame0"}>
        <img
          className={"depth4Frame0"}
          alt="Logo"
          src="/figma_photos/wandernest.svg"
        />
        <div className={"depth4Frame1"} onClick={goHome}>
          <b className={"wandernest"}>WanderNest</b>
        </div>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300 py-8 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-primary-700 mb-6">
            Create Account
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {apiError && (
              <div className="mt-3 text-red-600 text-center font-medium">
                {apiError}
              </div>
            )}

            {/* Personal Information */}
            <div className="section">
              <h3 className="section-title">Personal Information</h3>

              <div className="field-group">
                <label htmlFor="username" className="label">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  className={`input ${errors.username ? "input-error" : ""}`}
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
                <div className="field-group">
                  <label htmlFor="first_name" className="label">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    className={`input ${
                      errors.first_name ? "input-error" : ""
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
                <div className="field-group">
                  <label htmlFor="last_name" className="label">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    className={`input ${errors.last_name ? "input-error" : ""}`}
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
                <div className="field-group col-span-2">
                  <label htmlFor="country" className="label">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    className={`input ${errors.country ? "input-error" : ""}`}
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
                <div className="field-group">
                  <label htmlFor="age" className="label">
                    Age <span className="optional-text">(Optional)</span>
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="13"
                    max="120"
                    className={`input ${errors.age ? "input-error" : ""}`}
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
            <div className="section">
              <h3 className="section-title">Contact Information</h3>

              <div className="field-group">
                <label htmlFor="email" className="label">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`input ${errors.email ? "input-error" : ""}`}
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

              <div className="field-group">
                <label htmlFor="phone" className="label">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`input ${errors.phone ? "input-error" : ""}`}
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
            <div className="section">
              <h3 className="section-title">Account Security</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="field-group">
                  <label htmlFor="password" className="label">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={`input ${errors.password ? "input-error" : ""}`}
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
                <div className="field-group">
                  <label htmlFor="confirm_password" className="label">
                    Confirm Password
                  </label>
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    className={`input ${
                      errors.confirm_password ? "input-error" : ""
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
              className="w-full bg-primary-500 text-white py-2 rounded font-semibold hover:bg-primary-600 transition"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="footer-text">
              Already have an account?{" "}
              <a href="/login" className="footer-link">
                Sign in here
              </a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
