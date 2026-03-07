import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { API_BASE } from '../config/api';
const ResetPassword: React.FC = () => {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!password || !confirmPassword) {
      setMessage("Please enter and confirm your new password.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/api/auth/password-reset-confirm/${uidb64}/${token}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      if (!response.ok) {
        let errorMsg = "Failed to reset password.";
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
          else if (errorData.error) errorMsg = errorData.error;
          else if (errorData.message) errorMsg = errorData.message;
          // eslint-disable-next-line no-empty
        } catch {}
        setMessage(errorMsg);
      } else {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "0 auto",
        marginTop: 40,
        padding: 32,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 16px #eee",
        fontFamily: "inherit",
        textAlign: "left",
      }}
    >
      <h2
        style={{
          fontSize: "2.2rem",
          fontWeight: 700,
          marginBottom: 12,
          color: "#19202A",
          letterSpacing: "-1px",
        }}
      >
        Reset your password
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          required
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 16,
            borderRadius: 5,
            border: "1px solid #ccc",
            fontSize: "1.1rem",
          }}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 24,
            borderRadius: 5,
            border: "1px solid #ccc",
            fontSize: "1.1rem",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 8,
            fontSize: "1.5rem",
            fontWeight: 400,
            marginBottom: 8,
            background: "#059669",
            color: "#fff",
            border: "none",
          }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: 16,
            color: message.includes("successful") ? "green" : "red",
            fontSize: "1.1rem",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
