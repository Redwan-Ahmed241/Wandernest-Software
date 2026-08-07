"use client";

import type React from "react";
import { Suspense, lazy } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "./hooks/ScrollToTop";
import { AuthProvider, useAuth } from "./Authentication/auth-context";
import { BookingProvider } from "./Context/booking-context";

// Lazy load components for better code splitting
const TermsOfService = lazy(() => import("./Pages/TermsOfService"));
const HomePage = lazy(() => import("./Pages/Homepage"));
const ThingsToDo = lazy(() => import("./Pages/ThingsToDo"));
const HotelsRooms = lazy(() => import("./Pages/HotelsRooms"));
const Destinations = lazy(() => import("./Pages/Destinations"));
const PlanATrip = lazy(() => import("./Pages/PlanATrip"));
const AboutUs = lazy(() => import("./Pages/aboutUs"));
const AllGuides = lazy(() => import("./Pages/ALLGuides"));
const GuideDetail = lazy(() => import("./Pages/GuideDetail"));
const Blogs = lazy(() => import("./Pages/Blog"));
const BlogDetail = lazy(() => import("./Pages/BlogDetail"));
const WriteStory = lazy(() => import("./Pages/WriteStory"));
const Flights = lazy(() => import("./Pages/flights"));
const Groups = lazy(() => import("./Pages/Groups"));
const CreateGroup = lazy(() => import("./Pages/CreateGroup"));
const Guides = lazy(() => import("./Pages/hiringGuides"));
const LoginPage = lazy(() => import("./Pages/Loginpage"));
const Destination01 = lazy(() => import("./Pages/Destination_01"));
const RentVehicles = lazy(() => import("./Pages/rentVehicles"));
const Restaurant = lazy(() => import("./Pages/restaurant"));
const TrustSafety = lazy(() => import("./Pages/TrustSafety"));
const CookiePolicy = lazy(() => import("./Pages/CookiePolicy"));
const VisaAssistance = lazy(() => import("./Pages/Visaassistance"));
const MyTrips = lazy(() => import("./Pages/MyTrips"));
const HelpCenter = lazy(() => import("./Pages/HelpCenter"));
const Packages = lazy(() => import("./Pages/Packages"));
const CreatePackage = lazy(() => import("./Pages/CreatePackages"));
const SignupForm = lazy(() => import("./Pages/Signup-form"));
const ShoppingCenters = lazy(() => import("./Pages/shopping-center"));
const PublicTransport = lazy(() => import("./Pages/public-transport"));
const DashboardHome = lazy(() => import("./Pages/DashboardHome"));
const Community = lazy(() => import("./Pages/Community"));
const ProfileSettings = lazy(() => import("./Pages/ProfileSettings"));
const AdminDashboard = lazy(() => import("./Pages/Admin/AdminDashboard"));
const PaymentSuccess = lazy(() => import("./Pages/PaymentSuccess"));
const ConfirmBook = lazy(() => import("./Pages/confirm_book"));
const FPass = lazy(() => import("./Pages/fpass"));
const ResetPassword = lazy(() => import("./Pages/reset-password"));
const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy"));
const Emergency = lazy(() => import("./Pages/Emergency"));
const Heritage = lazy(() => import("./Pages/Heritage"));
// Keep these as regular imports since they're used immediately
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import ProfileDropdown from "./components/profiledropdown";
import Layout from "./components/layout";
import "./styles/global.css";

// Loading component for Suspense
const LoadingSpinner = () => (
  <div
    className="min-h-screen flex items-center justify-center"
    data-testid="loading-spinner"
  >
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Routes Component (needs to be inside AuthProvider)
const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/heritage" element={<Heritage />} />
        <Route path="/things-to-do" element={<ThingsToDo />} />
        <Route path="/hotels-rooms" element={<HotelsRooms />} />
        <Route path="/plan-a-trip" element={<PlanATrip />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/all-guides" element={<AllGuides />} />
        <Route path="/guides" element={<AllGuides />} />
        <Route path="/guide/:id" element={<GuideDetail />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route
          path="/write-story"
          element={
            <ProtectedRoute>
              <WriteStory />
            </ProtectedRoute>
          }
        />
        <Route path="/flights" element={<Flights />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:id" element={<Groups />} />
        <Route
          path="/groups/create"
          element={
            <ProtectedRoute>
              <CreateGroup />
            </ProtectedRoute>
          }
        />
        <Route path="/hiring-guides" element={<Guides />} />
        <Route path="/destination/:destinationId" element={<Destination01 />} />
        <Route path="/destination-01" element={<Destination01 />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/rent-vehicles" element={<RentVehicles />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/trust-safety" element={<TrustSafety />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/visa-assistance" element={<VisaAssistance />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/community" element={<Community />} />
        <Route path="/shopping-centers" element={<ShoppingCenters />} />
        <Route path="/public-transport" element={<PublicTransport />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/create-packages" element={<CreatePackage />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/confirm-book/:destinationId/:packageId" element={<ConfirmBook />} />
        <Route path="/confirm-book" element={<ConfirmBook />} />
        <Route path="/help-center" element={<HelpCenter />} />
        {/* Redirects */}
        {/* Payment Success Route */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
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

        {/* Admin Dashboard Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

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

        {/* New Route for password reset confirmation */}
        <Route
          path="/reset-password/:uidb64/:token/"
          element={<ResetPassword />}
        />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <ScrollToTop />
          <AppRoutes />
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
