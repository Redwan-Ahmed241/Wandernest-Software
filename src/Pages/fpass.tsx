import React, { useState } from "react";

// import { supabase } from '../supabaseClient'; // Uncomment and configure if supabase client is set up

const FPass: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="max-w-lg mx-auto mt-4 p-8 bg-white rounded-xl shadow-lg font-sans text-left">
      <h2 className="text-3xl font-bold mb-3 text-gray-900 tracking-tight">
        Forgot your password?
      </h2>
      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-3 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-base"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-lg text-lg font-semibold bg-primary text-white shadow hover:bg-primary-dark transition disabled:opacity-60 mb-2"
        >
          {loading ? "Checking..." : "Send reset link"}
        </button>
      </form>
      {message && (
        <div
          className={`mt-4 text-base ${
            message.includes("sent") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default FPass;
