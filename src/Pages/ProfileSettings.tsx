"use client";

import type React from "react";
import { useEffect, useState } from "react";
import styles from "../Styles/ProfileSettings.module.css";
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
      <div className={styles.profileSettingsWrapper}>
        <div className={styles.skeletonProfile}>
          <div className={styles.skeletonPic} />
          <div className={styles.skeletonFields}>
            <div className={styles.skeletonField} />
            <div className={styles.skeletonField} />
            <div className={styles.skeletonField} />
          </div>
        </div>
      </div>
    );

  return (
    <div className={styles.profileSettingsWrapper}>
      <h2 className={styles.title}>Profile Settings</h2>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.profileCard}>
        <div className={styles.profilePicSection}>
          <div className={styles.profilePicWrapper}>
            <img
              src={
                picFile
                  ? URL.createObjectURL(picFile)
                  : profile.profile_image || "/figma_photos/wandernest.svg"
              }
              alt="Profile"
              className={styles.profilePic}
            />
            {editMode && (
              <label className={styles.profilePicOverlay} title="Change Photo">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePicChange}
                  className={styles.fileInput}
                />
                <span className={styles.cameraIcon}>📷</span>
              </label>
            )}
          </div>
        </div>
        <div className={styles.profileInfoSection}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Email:</label>
            <span className={styles.fieldValue}>{profile.email || "-"}</span>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Phone:</label>
            {editMode ? (
              <input
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                className={styles.inputField}
                placeholder="Enter phone number"
              />
            ) : (
              <span className={styles.fieldValue}>{profile.phone || "-"}</span>
            )}
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Country:</label>
            {editMode ? (
              <input
                name="country"
                value={form.country || ""}
                onChange={handleChange}
                className={styles.inputField}
                placeholder="Enter country"
              />
            ) : (
              <span className={styles.fieldValue}>
                {profile.country || "-"}
              </span>
            )}
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Age:</label>
            {editMode ? (
              <input
                name="age"
                type="number"
                value={form.age || ""}
                onChange={handleChange}
                className={styles.inputField}
              />
            ) : (
              <span className={styles.fieldValue}>{profile.email}</span>
            )}
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Phone Number:</label>
            {editMode ? (
              <input
                name="phonenumber"
                type="tel"
                value={form.phonenumber || ""}
                onChange={handleChange}
                placeholder="+1234567890"
                className={styles.inputField}
              />
            ) : (
              <span className={styles.fieldValue}>
                {profile.phonenumber || "-"}
              </span>
            )}
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Passport Number:</label>
            {editMode ? (
              <input
                name="passport_no"
                value={form.passport_no || ""}
                onChange={handleChange}
                className={styles.inputField}
                placeholder="Enter passport number"
              />
            ) : (
              <span className={styles.fieldValue}>
                {profile.passport_no || "-"}
              </span>
            )}
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Date of Birth:</label>
            {editMode ? (
              <DatePicker
                selected={dobPicker}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                placeholderText="Select date"
                className={styles.inputField}
                name="date_of_birth"
                id="date_of_birth"
                autoComplete="off"
              />
            ) : (
              <span className={styles.fieldValue}>
                {profile.date_of_birth || "-"}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.buttonGroup}>
        {editMode ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`${styles.button} ${styles.saveButton}`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setEditMode(false)}
              disabled={saving}
              className={`${styles.button} ${styles.cancelButton}`}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className={`${styles.button} ${styles.editButton}`}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
