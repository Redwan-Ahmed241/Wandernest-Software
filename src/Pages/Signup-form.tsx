"use client"

import type React from "react"
import Footer from "../Components/Footer" 
import { useCallback } from "react"
import { useState } from "react"
import { useNavigate } from 'react-router-dom';
interface FormData {
  username: string
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  age: number | null
  password: string
  confirm_password: string
}

interface FormErrors {
  [key: string]: string
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
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [apiError, setApiError] = useState("")

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Special handling for age field to convert to number
    if (name === 'age') {
      const numValue = value === '' ? null : parseInt(value, 10)
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }
 
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
   

    // Required field validation
    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required"
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.country) newErrors.country = "Country is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (!formData.confirm_password) newErrors.confirm_password = "Please confirm your password"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    }

    // Password confirmation
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match"
    }

    // Username validation
    if (formData.username && formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long"
    }

    // Age validation (if provided)
    if (formData.age !== null) {
      if (isNaN(formData.age) || formData.age < 13 || formData.age > 120) {
        newErrors.age = "Age must be between 13 and 120"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const navigate = useNavigate();

  const goHome = useCallback(() => {
    navigate('/');
  }, [navigate]);
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setApiError("")

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
      }

      // Replace this with your actual API call
      const response = await fetch("https://wander-nest-ad3s.onrender.com/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Full errorData:", errorData);
        console.error("API Error Response:", errorData);
        // Throw the whole error object so it can be displayed
        throw errorData;
      }

      const result = await response.json()
      console.log("Success:", result)

      setIsSuccess(true)
      // Add this inside the try block after setIsSuccess(true)
      setTimeout(() => {
        navigate('/login'); // or whatever your login route is
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
      })
    } catch (error: any) {
      console.error("Error:", error);
      // Always show the error as a string, even if it's an object
      if (typeof error === 'object' && error !== null) {
        setApiError(JSON.stringify(error, null, 2));
      } else if (error instanceof Error && error.message) {
        setApiError(error.message);
      } else {
        setApiError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Reset success state
  const resetSuccess = () => {
    setIsSuccess(false)
  }

  if (isSuccess) {
    return (
      <>
        <div className="container">
          <div className="form-wrapper">
            <div className="card">
              <div className="card-header">
                <h1 className="card-title">Account Created Successfully!</h1>
                <p className="card-description">Welcome!to WanderNest Your account has been created.</p>
              </div>
              <div className="card-content">
                <div className="success-message">
                  <p>Thank you for signing up. You can now log in to your account.</p>
                  <button onClick={resetSuccess} className="button" style={{ marginTop: "1rem" }}>
                    Create Another Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="flex flex-row items-center justify-start gap-4 cursor-pointer sticky top-0 z-[1000] bg-white w-full border-b border-[#e5e8eb] max-w-[1440px] mx-auto box-border py-3 px-10">
          <img className="w-8 h-8 transition-transform duration-300 hover:scale-110" alt="Logo" src="/Figma_photoes/wandernest.svg" />
          <div className="flex flex-col items-start justify-start cursor-pointer" onClick={goHome}>
            <b className="text-lg leading-6 font-['Plus_Jakarta_Sans'] text-[#0d1c1c] text-left transition-colors duration-300 hover:text-[#4a6b5b]">WanderNest</b>
          </div>
        </div>
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="w-full max-w-[48rem]">
          <div className="bg-white rounded-lg shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-[#e5e7eb]">
            <div className="pt-6 px-6 pb-0 text-center">
              <h1 className="text-[1.875rem] font-bold text-[#111827] m-0 mb-2">Create Account</h1>
              <p className="text-lg text-[#6b7280] m-0">Fill in your information to get started</p>
            </div>
            <div className="p-6">
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {apiError && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] p-3 rounded-md text-sm mb-4">{apiError}</div>}

                {/* Personal Information */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-semibold text-[#111827] m-0">Personal Information</h3>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="username" className="text-sm font-medium text-[#374151] mb-1">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      className={`w-full py-2 px-3 border rounded-md text-sm transition-all duration-150 bg-white ${errors.username ? "border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : "border-[#d1d5db] focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"} focus:outline-none placeholder:text-[#9ca3af]`}
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                    {errors.username && <span className="text-xs text-[#ef4444] mt-1">{errors.username}</span>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="first_name" className="text-sm font-medium text-[#374151] mb-1">
                        First Name
                      </label>
                      <input
                        id="first_name"
                        name="first_name"
                        className={`w-full py-2 px-3 border rounded-md text-sm transition-all duration-150 bg-white ${errors.first_name ? "border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : "border-[#d1d5db] focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"} focus:outline-none placeholder:text-[#9ca3af]`}
                        placeholder="Enter your first name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                      />
                      {errors.first_name && <span className="text-xs text-[#ef4444] mt-1">{errors.first_name}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="last_name" className="text-sm font-medium text-[#374151] mb-1">
                        Last Name
                      </label>
                      <input
                        id="last_name"
                        name="last_name"
                        className={`w-full py-2 px-3 border rounded-md text-sm transition-all duration-150 bg-white ${errors.last_name ? "border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : "border-[#d1d5db] focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"} focus:outline-none placeholder:text-[#9ca3af]`}
                        placeholder="Enter your last name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                      />
                      {errors.last_name && <span className="text-xs text-[#ef4444] mt-1">{errors.last_name}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label htmlFor="country" className="text-sm font-medium text-[#374151] mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        className={`w-full py-2 px-3 border rounded-md text-sm bg-white cursor-pointer transition-all duration-150 ${errors.country ? "border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : "border-[#d1d5db] focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"} focus:outline-none`}
                        value={formData.country}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select your country</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                        <option value="Brazil">Brazil</option>
                        <option value="India">India</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.country && <span className="text-xs text-[#ef4444] mt-1">{errors.country}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="age" className="text-sm font-medium text-[#374151] mb-1">
                        Age <span className="text-xs text-[#6b7280] font-normal">(Optional)</span>
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        min="13"
                        max="120"
                        className={`w-full py-2 px-3 border rounded-md text-sm transition-all duration-150 bg-white ${errors.age ? "border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : "border-[#d1d5db] focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"} focus:outline-none placeholder:text-[#9ca3af]`}
                        placeholder="Age"
                        value={formData.age || ""}
                        onChange={handleChange}
                      />
                      {errors.age && <span className="text-xs text-[#ef4444] mt-1">{errors.age}</span>}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-semibold text-[#111827] m-0">Contact Information</h3>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-[#374151] mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`w-full py-2 px-3 border rounded-md text-sm transition-all duration-150 bg-white ${errors.email ? "border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : "border-[#d1d5db] focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"} focus:outline-none placeholder:text-[#9ca3af]`}
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <span className="text-xs text-[#ef4444] mt-1">{errors.email}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-sm font-medium text-[#374151] mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className={`w-full py-2 px-3 border rounded-md text-sm transition-all duration-150 bg-white ${errors.phone ? "border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : "border-[#d1d5db] focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"} focus:outline-none placeholder:text-[#9ca3af]`}
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    {errors.phone && <span className="text-xs text-[#ef4444] mt-1">{errors.phone}</span>}
                  </div>
                </div>

                {/* Account Security */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-semibold text-[#111827] m-0">Account Security</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="password" className="text-sm font-medium text-[#374151] mb-1">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className={`w-full py-2 px-3 border rounded-md text-sm transition-all duration-150 bg-white ${errors.password ? "border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : "border-[#d1d5db] focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"} focus:outline-none placeholder:text-[#9ca3af]`}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      {errors.password && <span className="text-xs text-[#ef4444] mt-1">{errors.password}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="confirm_password" className="text-sm font-medium text-[#374151] mb-1">
                        Confirm Password
                      </label>
                      <input
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        className={`w-full py-2 px-3 border rounded-md text-sm transition-all duration-150 bg-white ${errors.confirm_password ? "border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : "border-[#d1d5db] focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"} focus:outline-none placeholder:text-[#9ca3af]`}
                        placeholder="Confirm your password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                      />
                      {errors.confirm_password && <span className="text-xs text-[#ef4444] mt-1">{errors.confirm_password}</span>}
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full h-12 bg-[#1f2937] text-white border-none rounded-md text-lg font-medium cursor-pointer transition-colors duration-150 mt-4 hover:bg-[#111827] focus:outline-none focus:shadow-[0_0_0_3px_rgba(59,130,246,0.5)] disabled:bg-[#9ca3af] disabled:cursor-not-allowed" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>

                <div className="text-center text-sm text-[#6b7280] mt-4">
                  Already have an account?{" "}
                  <a href="/login" className="font-medium text-[#2563eb] no-underline hover:text-[#1d4ed8]">
                    Sign in here
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
