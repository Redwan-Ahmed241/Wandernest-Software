"use client"

import type React from "react"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./Authentication/auth-context"
import { BookingProvider } from "./Context/booking-context"

// All your existing imports
import ThingsToDo from "./Pages/ThingsToDo"
import HotelsRooms from "./Pages/HotelsRooms"
import Destinations from "./Pages/Destinations"
import PlanATrip from "./Pages/PlanATrip"
import AboutUs from "./Pages/aboutUs"
import AllGuides from "./Pages/ALLGuides"
import Blogs from "./Pages/Blog"
import Flights from "./Pages/flights"
import Groups from "./Pages/Groups"
import Guides from "./Pages/hiringGuides"
import LoginPage from "./Pages/Loginpage"
import Destination01 from "./Pages/Destination_01"
import HomePage from "./Pages/Homepage"
import RentVehicles from "./Pages/rentVehicles"
import Restaurant from "./Pages/restaurant"
import Support from "./Pages/support"
import VisaAssistance from "./Pages/Visaassistance"
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import Layout from "./App/Layout"
import MyTrips from "./Pages/MyTrips"

import Packages from "./Pages/Packages"
import CreatePackage from "./Pages/CreatePackages"
import SignupForm from "./Pages/Signup-form"
import ShoppingCenters from "./Pages/shopping-center"
import PublicTransport from "./Pages/public-transport"
import DashboardHome from "./Pages/DashboardHome"
import ProfileDropdown from "./Components/profile-dropdown"
import Community from "./Pages/Community"
import ProfileSettings from './Pages/ProfileSettings'
import "./global.css"
import ConfirmBook from "./Pages/confirm_book"
import FPass from "./Pages/fpass"

import ResetPassword from "./Pages/reset-password"


// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Routes Component (needs to be inside AuthProvider)
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/things-to-do" element={<ThingsToDo />} />
      <Route path="/hotels-rooms" element={<HotelsRooms />} />
      <Route path="/plan-a-trip" element={<PlanATrip />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/all-guides" element={<AllGuides />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/flights" element={<Flights />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/hiring-guides" element={<Guides />} />
      <Route path="/destination-01" element={<Destination01 />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/rent-vehicles" element={<RentVehicles />} />
      <Route path="/restaurant" element={<Restaurant />} />
      <Route path="/support" element={<Support />} />
      <Route path="/visa-assistance" element={<VisaAssistance />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/community" element={<Community />} />
      <Route path="/shopping-centers" element={<ShoppingCenters />} />
      <Route path="/public-transport" element={<PublicTransport />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/create-packages" element={<CreatePackage />} />
      <Route path="/profile" element={<ProfileSettings />} />
      <Route path="/confirm-book" element={<ConfirmBook />} />
      
      {/* Redirects */}
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupForm />} />
    
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-trips"
        element={
          <ProtectedRoute>
            <MyTrips />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-package"
        element={
          <ProtectedRoute>
            <CreatePackage />
          </ProtectedRoute>
        }
      />

      {/* Utility Routes (probably not needed as routes) */}
      <Route path="/navbar" element={<Navbar />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/layout" element={<Layout children={undefined} />} />
      <Route path="/profile-dropdown" element={<ProfileDropdown />} />

      {/* Test Route */}
      <Route
        path="/test"
        element={
          <div style={{ padding: "20px" }}>
            <h1>Test Route Working!</h1>
          </div>
        }
      />

      {/* New Route */}
      <Route path="/profile-settings" element={<ProfileSettings />} />

      {/* New Route */}
      <Route path="/fpass" element={<FPass />} />

      {/* New Route */}
      

      {/* New Route for password reset confirmation */}
      <Route path="/reset-password/:uidb64/:token/" element={<ResetPassword />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <AppRoutes />
        </Router>
      </BookingProvider>
    </AuthProvider>
  )
}

export default App
