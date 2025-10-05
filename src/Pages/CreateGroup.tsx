import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupsAPI from '../api/groups';
import type { CreateGroupRequest } from '../types/groups';

interface FormErrors {
  name?: string;
  description?: string;
  about?: string;
  category?: string;
  banner?: string;
  avatar?: string;
}

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Form state
  const [formData, setFormData] = useState<CreateGroupRequest>({
    name: '',
    description: '',
    about: '',
    privacy: 'public',
    category: '',
    tags: [],
    banner: '',
    avatar: '',
    location: {
      city: '',
      country: '',
    },
    rules: [''],
  });

  // Tag input
  const [tagInput, setTagInput] = useState('');

  // Image previews
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const categories = [
    'Travel & Adventure',
    'Photography',
    'Food & Dining',
    'Nature & Wildlife',
    'Cultural Experiences',
    'Beach & Coastal',
    'Mountain & Hiking',
    'City Exploration',
    'Backpacking',
    'Luxury Travel',
    'Budget Travel',
    'Solo Travel',
    'Family Travel',
    'Road Trips',
    'Other',
  ];

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please give your group a name! What should we call it?';
    } else if (formData.name.length < 3) {
      newErrors.name = `Almost there! Add ${3 - formData.name.length} more character${3 - formData.name.length > 1 ? 's' : ''} to your group name`;
    } else if (formData.name.length > 100) {
      newErrors.name = 'That\'s a great name, but let\'s keep it under 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Help others discover your group! Add a short description';
    } else if (formData.description.length < 10) {
      newErrors.description = `Just ${10 - formData.description.length} more character${10 - formData.description.length > 1 ? 's' : ''} to go! Tell us a bit more`;
    } else if (formData.description.length > 200) {
      newErrors.description = 'Great description! Let\'s trim it to 200 characters or less';
    }

    if (!formData.about.trim()) {
      newErrors.about = 'Tell us about your group! What makes it special?';
    } else if (formData.about.length < 20) {
      newErrors.about = `You're doing great! Add ${20 - formData.about.length} more character${20 - formData.about.length > 1 ? 's' : ''} to complete this section`;
    } else if (formData.about.length > 1000) {
      newErrors.about = 'Wow, that\'s detailed! Let\'s keep it under 1000 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Pick a category to help travelers find your group!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle text input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle location changes
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location!,
        [name]: value,
      },
    }));
  };

  // Handle tag input
  const handleAddTag = useCallback(() => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput('');
    }
  }, [tagInput, formData.tags]);

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle rule changes
  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...(formData.rules || [''])];
    newRules[index] = value;
    setFormData((prev) => ({
      ...prev,
      rules: newRules,
    }));
  };

  const handleAddRule = () => {
    if (formData.rules && formData.rules.length < 10) {
      setFormData((prev) => ({
        ...prev,
        rules: [...(prev.rules || []), ''],
      }));
    }
  };

  const handleRemoveRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: (prev.rules || []).filter((_, i) => i !== index),
    }));
  };

  // Handle image uploads
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'banner' | 'avatar'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Oops! That doesn\'t look like an image file. Please choose a JPG, PNG, or GIF');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setError(`That image is ${sizeMB}MB. Let's use one smaller than 5MB for faster loading!`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'banner') {
          setBannerPreview(base64String);
          setFormData((prev) => ({ ...prev, banner: base64String }));
        } else {
          setAvatarPreview(base64String);
          setFormData((prev) => ({ ...prev, avatar: base64String }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (type: 'banner' | 'avatar') => {
    if (type === 'banner') {
      setBannerPreview(null);
      setFormData((prev) => ({ ...prev, banner: '' }));
    } else {
      setAvatarPreview(null);
      setFormData((prev) => ({ ...prev, avatar: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      setError('Almost ready! Please fill out the highlighted fields above 👆');
      return;
    }

    setLoading(true);

    try {
      // Clean up the data before sending
      const cleanedData: CreateGroupRequest = {
        ...formData,
        rules: formData.rules?.filter((rule) => rule.trim() !== '') || undefined,
        location:
          formData.location?.city || formData.location?.country
            ? formData.location
            : undefined,
      };

      const response = await GroupsAPI.createGroup(cleanedData);

      if (response.success && response.data) {
        setSuccess(true);
        // Navigate to the newly created group
        setTimeout(() => {
          navigate(`/groups/${response.data!.id}`);
        }, 1500);
      } else {
        setError(response.error || 'Hmm, something went wrong. Please try again or contact support if this continues');
      }
    } catch (err) {
      setError('Oops! We couldn\'t create your group right now. Please check your connection and try again');
      console.error('Create group error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create a New Group</h1>
              <p className="text-gray-600 mt-2">
                Build your travel community and connect with fellow adventurers
              </p>
            </div>
            <button
              onClick={() => navigate('/groups')}
              className="text-gray-600 hover:text-gray-900"
              style={{ border: 'none', outline: 'none' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-green-700 font-medium">
                🎉 Awesome! Your group is ready! Taking you there now...
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

            {/* Group Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Bangladesh Travel Enthusiasts"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={100}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              <p className="text-gray-500 text-sm mt-1">
                {formData.name.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="A brief description of your group"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={200}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                {formData.description.length}/200 characters
              </p>
            </div>

            {/* About */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About <span className="text-red-500">*</span>
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Tell us more about your group, its purpose, and what members can expect..."
                rows={6}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                  errors.about ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={1000}
              />
              {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about}</p>}
              <p className="text-gray-500 text-sm mt-1">
                {formData.about.length}/1000 characters
              </p>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Privacy */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privacy <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="privacy"
                    value="public"
                    checked={formData.privacy === 'public'}
                    onChange={handleInputChange}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Public</p>
                    <p className="text-sm text-gray-600">
                      Anyone can see the group, its members, and their posts
                    </p>
                  </div>
                </label>
                <label className="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="privacy"
                    value="private"
                    checked={formData.privacy === 'private'}
                    onChange={handleInputChange}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Private</p>
                    <p className="text-sm text-gray-600">
                      Only members can see posts. Anyone can find the group and request to join
                    </p>
                  </div>
                </label>
                <label className="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="privacy"
                    value="secret"
                    checked={formData.privacy === 'secret'}
                    onChange={handleInputChange}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Secret</p>
                    <p className="text-sm text-gray-600">
                      Only members can find the group and see posts. Invite-only
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Group Images</h2>

            {/* Cover Banner */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {bannerPreview ? (
                  <div className="relative">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('banner')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      style={{ border: 'none', outline: 'none' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      Click to upload cover photo (Recommended: 1200x400px)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'banner')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Group Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Icon (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {avatarPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-32 h-32 object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('avatar')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      style={{ border: 'none', outline: 'none' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">
                      Click to upload group icon (Recommended: 400x400px)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'avatar')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City (Optional)
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.location?.city || ''}
                  onChange={handleLocationChange}
                  placeholder="e.g., Dhaka"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country (Optional)
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.location?.country || ''}
                  onChange={handleLocationChange}
                  placeholder="e.g., Bangladesh"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional - Max 10)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={formData.tags.length >= 10}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={formData.tags.length >= 10}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  style={{ border: 'none', outline: 'none' }}
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-green-600 hover:text-green-800"
                        style={{ border: 'none', outline: 'none' }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Group Rules */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Rules (Optional - Max 10)
              </label>
              <div className="space-y-3">
                {formData.rules?.map((rule, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => handleRuleChange(index, e.target.value)}
                      placeholder={`Rule ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {formData.rules && formData.rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                        style={{ border: 'none', outline: 'none' }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                {formData.rules && formData.rules.length < 10 && (
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                    style={{ border: 'none', outline: 'none' }}
                  >
                    + Add Another Rule
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate('/groups')}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ outline: 'none' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ border: 'none', outline: 'none' }}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Group'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
