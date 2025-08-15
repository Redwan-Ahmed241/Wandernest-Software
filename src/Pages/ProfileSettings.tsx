"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface UserProfile {
  id: string;
  phone: string;
  country: string;
  age: number | null;
  passport_no: string | null;
  date_of_birth: string | null;
  profile_image: string | null;
  phonenumber: string | null;
  email: string;
}

const API_URL = "https://wander-nest-ad3s.onrender.com/api/auth/edit-profile/";

const ProfileSettings: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<UserProfile>>({});
  const [picFile, setPicFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dobPicker, setDobPicker] = useState<Date | null>(null);
  const _navigate = useNavigate();

  // Fetch user profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        const response = await fetch(API_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        console.log("Profile fetch status:", response.status);
        const data = await response.json();
        console.log("Profile fetch data:", data);
        if (!response.ok) throw new Error("Failed to fetch profile");
        setProfile(data);
        setForm(data);
        if (data.date_of_birth) setDobPicker(new Date(data.date_of_birth));
      } catch (err: any) {
        setError(err.message || "Could not load profile.");
        console.error("Profile fetch error:", err);
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

  const handleDateChange = (date: Date | null) => {
    setDobPicker(date);
    setForm({
      ...form,
      date_of_birth: date ? date.toISOString().slice(0, 10) : "",
    });
  };

  // Save profile to API using PATCH method
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      let profile_image_url = form.profile_image;

      // If a new picture is selected, upload it first
      if (picFile) {
        const imgForm = new FormData();
        imgForm.append("profile_image", picFile);
        const imgRes = await fetch(API_URL, {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: imgForm,
        });
        if (!imgRes.ok) throw new Error("Failed to upload image");
        const imgData = await imgRes.json();
        profile_image_url = imgData.profile_image;
      }

      // Prepare the data according to your Django model
      const updateData: any = {
        phone: form.phone,
        country: form.country,
        age: form.age ? parseInt(form.age.toString()) : null,
        passport_no: form.passport_no,
        date_of_birth: form.date_of_birth,
      };

      // Only include profile_image if it was updated
      if (profile_image_url) {
        updateData.profile_image = profile_image_url;
      }

      const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          passport_no: form.passport_no, // Map passportNumber to passport_no
          date_of_birth: form.date_of_birth, // Map dateOfBirth to date_of_birth
          phone_number: form.phonenumber, // Add phone number to API request
          profile_image: profile_image_url, // Include profile image if updated
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      const updated = await response.json();
      setProfile(updated);
      setForm(updated);
      setEditMode(false);
      setPicFile(null);
    } catch (err: any) {
      setError(err.message || "Could not save profile.");
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
        <form className="space-y-4">
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
            <label className="font-medium mb-1">Passport No</label>
            <input
              name="passport_no"
              value={form.passport_no || ""}
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
            />
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
            className="w-full bg-primary-500 text-white py-2 rounded font-semibold hover:bg-primary-600 transition"
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
