"use client";

import { type FunctionComponent, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Tailwind CSS used for all styling. Centralized color theme via tailwind.config.js
import Layout from "../App/Layout";
import Sidebar from "./Sidebar";
import { useAuth } from "../Authentication/auth-context";
import { useBooking } from "../Context/booking-context";

interface BookingFormData {
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: string;
  specialRequests?: string;
}

const ConfirmBook: FunctionComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { addBooking } = useBooking();

  const packageData = location.state?.pkg;

  const [formData, setFormData] = useState<BookingFormData>({
    from: "",
    to: packageData?.title || "",
    startDate: "",
    endDate: "",
    travelers: 1,
    budget: packageData?.price || "",
    specialRequests: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!packageData) {
      navigate("/packages");
    }
  }, [packageData, navigate]);

  const handleInputChange = (
    field: keyof BookingFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateNights = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const totalPrice = Number(formData.budget) * formData.travelers;

  const handleConfirmBooking = async () => {
    if (!formData.startDate || !formData.endDate || !formData.from) {
      setError("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Add booking to context (immediate update)
      addBooking({
        type: "package",
        title: packageData.title,
        location: formData.to,
        startDate: formData.startDate,
        endDate: formData.endDate,
        price: totalPrice,
        status: "confirmed",
        travelers: formData.travelers,
        image: packageData.image_url,
      });

      // Navigate to dashboard to see the update
      navigate("/dashboard");
    } catch (error) {
      console.error("Booking failed:", error);
      setError("Booking failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Layout>
        <div style={{ display: "flex" }}>
          <Sidebar />
          <div style={{ flex: 1, padding: "40px", textAlign: "center" }}>
            <div>Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (!packageData) {
    return (
      <Layout>
        <div style={{ display: "flex" }}>
          <Sidebar />
          <div style={{ flex: 1, padding: "40px", textAlign: "center" }}>
            <div>Package not found</div>
            <button onClick={() => navigate("/packages")}>
              Back to Packages
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className={styles.confirmBook}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.pageTitle}>Confirm Your Booking</h1>
              <p className={styles.subtitle}>
                Review and confirm your package details
              </p>
            </div>

            <div className={styles.bookingContent}>
              {/* Package Summary */}
              <div className={styles.packageSummary}>
                <div className={styles.packageImage}>
                  <img
                    src={
                      packageData.image_url ||
                      "/placeholder.svg?height=200&width=300"
                    }
                    alt={packageData.title}
                  />
                </div>
                <div className={styles.packageInfo}>
                  <h2 className={styles.packageTitle}>{packageData.title}</h2>
                  <div className={styles.packagePrice}>
                    ৳{Number(packageData.price).toLocaleString()} per person
                  </div>
                  <div className={styles.packageDescription}>
                    Experience the beauty of {packageData.title} with our
                    carefully curated package.
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className={styles.bookingForm}>
                <h3 className={styles.formTitle}>Booking Details</h3>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>From *</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Departure city"
                      value={formData.from}
                      onChange={(e) =>
                        handleInputChange("from", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>To</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={formData.to}
                      readOnly
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Start Date *</label>
                    <input
                      type="date"
                      className={styles.formInput}
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>End Date *</label>
                    <input
                      type="date"
                      className={styles.formInput}
                      value={formData.endDate}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                      min={
                        formData.startDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Number of Travelers
                    </label>
                    <input
                      type="number"
                      className={styles.formInput}
                      min="1"
                      max="20"
                      value={formData.travelers}
                      onChange={(e) =>
                        handleInputChange("travelers", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Budget per Person (BDT)
                    </label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={formData.budget}
                      onChange={(e) =>
                        handleInputChange("budget", e.target.value)
                      }
                      readOnly
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Special Requests (Optional)
                  </label>
                  <textarea
                    className={styles.formTextarea}
                    placeholder="Any special requirements or requests..."
                    value={formData.specialRequests}
                    onChange={(e) =>
                      handleInputChange("specialRequests", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>

              {/* Booking Summary */}
              <div className={styles.bookingSummary}>
                <h3 className={styles.summaryTitle}>Booking Summary</h3>
                <div className={styles.summaryDetails}>
                  <div className={styles.summaryRow}>
                    <span>Package:</span>
                    <span>{packageData.title}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Duration:</span>
                    <span>{calculateNights()} nights</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Travelers:</span>
                    <span>
                      {formData.travelers} person
                      {formData.travelers > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Price per person:</span>
                    <span>৳{Number(formData.budget).toLocaleString()}</span>
                  </div>
                  <div className={styles.summaryRow + " " + styles.totalRow}>
                    <span>
                      <strong>Total Amount:</strong>
                    </span>
                    <span>
                      <strong>৳{totalPrice.toLocaleString()}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <button
                  className={styles.backButton}
                  onClick={() => navigate("/packages")}
                  disabled={isProcessing}
                >
                  Back to Packages
                </button>
                <button
                  className={styles.confirmButton}
                  onClick={handleConfirmBooking}
                  disabled={
                    isProcessing ||
                    !formData.startDate ||
                    !formData.endDate ||
                    !formData.from
                  }
                >
                  {isProcessing
                    ? "Processing..."
                    : `Confirm Booking - ৳${totalPrice.toLocaleString()}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmBook;
