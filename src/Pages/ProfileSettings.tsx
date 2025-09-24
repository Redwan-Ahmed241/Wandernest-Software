"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "..//Authentication/auth-context";
import "react-datepicker/dist/react-datepicker.css";

interface UserProfile {
  id: string;
  phone: string;
  country: string;
  age: number | null;
  passport_no: string | null;
  date_of_birth: string | null;
  profile_image: string | null;

  email: string;
}

const API_URL = "https://wander-nest-ad3s.onrender.com/api/auth/edit-profile/";

// Helper function to map allowed profile fields
const mapAllowedProfileFields = (data: Partial<UserProfile>): UserProfile => ({
  id: data.id || "",
  phone: data.phone || "",
  country: data.country || "",
  age: data.age || null,
  passport_no: data.passport_no || null,
  date_of_birth: data.date_of_birth || null,
  profile_image: data.profile_image || null,

  email: data.email || "",
});

// Helper function for error handling
const handleError = (
  err: unknown,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  defaultMessage: string
) => {
  if (err instanceof Error) {
    setError(err.message || defaultMessage);
  } else {
    setError(defaultMessage);
  }
};

// Update API headers to use accessToken
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};

const ProfileSettings: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // Redirect if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<Partial<UserProfile>>({});
  const [picFile, setPicFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch user profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(null);
        const headers = getAuthHeaders();
        const response = await fetch(API_URL, {
          method: "PATCH", // Change this to "PATCH" if the endpoint is for updates only
          headers,
        });
        console.log("API Response Status:", response.status);
        console.log("API Response Headers:", response.headers);
        const data = await response.json();
        console.log("API Response Data:", data);
        if (!response.ok) throw new Error("Failed to fetch profile");
        const allowedProfile = mapAllowedProfileFields(data);
        setProfile(allowedProfile);
        setForm(allowedProfile);
      } catch (err: unknown) {
        handleError(err, setError, "Could not load profile.");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPicFile(e.target.files[0]);
    }
  };

  // Save profile to API using PATCH method
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing auth token");

      let response: Response;
      if (picFile) {
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value as string);
          }
        });
        formData.append("profile_image", picFile);
        response = await fetch(API_URL, {
          method: "PATCH",
          headers: { Authorization: `Token ${token}` },
          body: formData,
        });
      } else {
        const headers = getAuthHeaders();
        response = await fetch(API_URL, {
          method: "PATCH",
          headers,
          body: JSON.stringify(form),
        });
      }
      if (!response.ok) {
        const failBody = await response.text();
        throw new Error("Save failed: " + failBody);
      }
      const data = await response.json();
      setSuccess("Profile updated successfully!");
      const allowedProfile = mapAllowedProfileFields(data);
      setProfile(allowedProfile);
      setForm(allowedProfile);
    } catch (err: unknown) {
      handleError(err, setError, "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!profile)
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300 py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-primary-700 mb-6">
            Profile Settings
          </h1>
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="flex flex-col">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="flex flex-col">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="flex flex-col">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-primary-700 mb-6">
          Profile Settings
        </h1>
        {error && (
          <div className="mb-4 text-red-600 font-medium text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-600 font-medium text-center">
            {success}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Phone</label>
            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-400"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Country</label>
            <input
              name="country"
              value={form.country || ""}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-400"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Age</label>
            <input
              name="age"
              type="number"
              value={form.age || ""}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Date of Birth</label>
            <input
              name="date_of_birth"
              type="date"
              value={form.date_of_birth || ""}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-400"
              disabled={!!profile?.date_of_birth} // Disable if date_of_birth is already set
            />
            {profile?.date_of_birth && (
              <p className="text-sm text-gray-500 mt-1">
                Date of Birth cannot be changed once set.
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email || ""}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-400"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Profile Image</label>
            <input
              name="profile_image"
              type="file"
              onChange={handlePicChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-400"
            />
          </div>
          <button
            type="submit"
            className="text-white font-semibold px-6 py-2 rounded-lg transition bg-[#6ab187] hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:bg-gray-300"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
