/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FPass: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Placeholder for Supabase password reset
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://wander-nest-ad3s.onrender.com/api/auth/password-reset/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        let errorMsg =
          "No account found with that email or error sending email.";
        try {
          const errorData = await response.json();
          if (errorData) {
            if (errorData.detail) errorMsg = errorData.detail;
            else if (errorData.error) errorMsg = errorData.error;
            else if (errorData.message) errorMsg = errorData.message;
            else if (typeof errorData === "string") errorMsg = errorData;
          }
        } catch (e) {
          try {
            const errorText = await response.text();
            if (errorText) errorMsg = errorText;
            // eslint-disable-next-line no-empty
          } catch {}
        }
        setMessage(errorMsg);
      } else {
        setMessage(
          "If your email is registered, a password reset link has been sent.\n\nCheck your inbox and follow the link. After clicking the link, you will be able to set a new password. The reset link contains a unique code (uidb64 and token) that is handled automatically."
        );
      }
    } catch (err) {
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleWanderNestClick = () => {
    navigate("/");
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        }}
      />

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
                Forgot your password?
              </h1>
              <p className="text-lg text-white/80">
                No worries, we'll help you reset it!
              </p>
            </div>
          </div>

          {/* Reset Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <p className="text-gray-600 leading-relaxed">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/90"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: loading
                    ? "linear-gradient(to right, #6ab187, #4a6b5b)"
                    : "linear-gradient(to right, #4a6b5b, #0d1c1c)",
                  color: "white",
                }}
              >
                {loading ? "Sending reset link..." : "Send reset link"}
              </button>
            </form>

            {message && (
              <div className="mt-6">
                <div
                  className={`p-4 rounded-xl border ${
                    message.includes("sent") || message.includes("registered")
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-600"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 mt-0.5 ${
                        message.includes("sent") ||
                        message.includes("registered")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {message.includes("sent") ||
                      message.includes("registered") ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="text-sm font-medium whitespace-pre-line leading-relaxed">
                      {message}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Back to Login */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="font-medium transition-colors duration-200 hover:underline"
                  style={{ color: "#4a6b5b" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#0d1c1c")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#4a6b5b")
                  }
                >
                  Back to login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FPass;
