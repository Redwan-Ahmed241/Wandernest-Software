import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  image: string;
  readTime: number;
}

const WriteStory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    excerpt: "",
    category: "Adventure",
    tags: [],
    image: "",
    readTime: 5
  });
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUploadMethod, setImageUploadMethod] = useState<"file" | "url">("file");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Available categories
  const categories = ["Adventure", "Beach", "Hills", "Heritage", "Culture", "Food", "Nature", "City"];

  // Calculate estimated read time based on content
  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "content") {
      const readTime = calculateReadTime(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        readTime
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle tag management
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle tag input key press
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  // Handle image upload/URL
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, image: value }));
    
    // Simple URL validation for preview
    if (value && (value.startsWith("http") || value.startsWith("/"))) {
      setImagePreview(value);
    } else {
      setImagePreview("");
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        e.target.value = '';
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        e.target.value = '';
        return;
      }

      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
          setFormData(prev => ({ ...prev, image: file.name })); // Store filename
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-generate excerpt from content
  const generateExcerpt = () => {
    if (formData.content) {
      const excerpt = formData.content.substring(0, 200) + "...";
      setFormData(prev => ({ ...prev, excerpt }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("You must be logged in to submit a story.");
      return;
    }

    // Basic validation
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.title.trim().length < 5) {
      alert("Title must be at least 5 characters long.");
      return;
    }

    if (formData.title.trim().length > 200) {
      alert("Title must not exceed 200 characters.");
      return;
    }

    if (formData.content.length < 100) {
      alert("Story content must be at least 100 characters long.");
      return;
    }

    if (formData.content.length > 50000) {
      alert("Story content is too long. Maximum 50,000 characters allowed.");
      return;
    }

    if (formData.excerpt && formData.excerpt.length > 300) {
      alert("Story summary must not exceed 300 characters.");
      return;
    }

    if (formData.tags.length > 5) {
      alert("Maximum 5 tags allowed.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      // Prepare API payload
      let requestBody: FormData | string;
      const requestHeaders: Record<string, string> = {
        "Authorization": `Bearer ${token}`
      };

      // Check if we have a file to upload
      if (imageFile && imageUploadMethod === "file") {
        // Use FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title.trim());
        formDataToSend.append('content', formData.content.trim());
        formDataToSend.append('excerpt', formData.excerpt.trim() || formData.content.substring(0, 200) + "...");
        formDataToSend.append('category', formData.category);
        formDataToSend.append('tags', JSON.stringify(formData.tags));
        formDataToSend.append('readTime', formData.readTime.toString());
        formDataToSend.append('status', 'review');
        formDataToSend.append('image', imageFile);

        requestBody = formDataToSend;
        // Don't set Content-Type header, let browser set it with boundary for FormData
      } else {
        // Use JSON for URL-based image or no image
        const blogData = {
          title: formData.title.trim(),
          content: formData.content.trim(),
          excerpt: formData.excerpt.trim() || formData.content.substring(0, 200) + "...",
          category: formData.category,
          tags: formData.tags,
          image: formData.image.trim() || null,
          readTime: formData.readTime,
          status: "review" // Set to review by default for moderation
        };

        requestBody = JSON.stringify(blogData);
        requestHeaders["Content-Type"] = "application/json";
      }

      console.log("Submitting blog data with method:", imageUploadMethod);

      // Make API call
      const response = await fetch("https://wander-nest-ad3s.onrender.com/api/blogs/create", {
        method: "POST",
        headers: requestHeaders,
        body: requestBody
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        } else if (response.status === 400) {
          const errorMessages = Object.values(responseData.errors || {}).flat().join(", ");
          throw new Error(errorMessages || responseData.message || "Validation error");
        } else if (response.status === 429) {
          throw new Error("You have reached the daily limit of 5 blog posts. Please try again tomorrow.");
        } else if (response.status === 413) {
          throw new Error("Your story is too long. Please reduce the content size.");
        } else {
          throw new Error(responseData.message || "Failed to submit story");
        }
      }

      console.log("Blog post created successfully:", responseData);
      
      // Show success message with more details
      alert(`🎉 Success! Your story "${formData.title}" has been submitted for review. You'll be notified once it's approved for publication.`);
      
      // Reset form
      resetForm();
      
      // Navigate back to blogs page
      navigate("/blogs");
      
    } catch (error) {
      console.error("Error submitting story:", error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert("❌ Network error: Please check your internet connection and try again.");
      } else if (error instanceof Error) {
        if (error.message.includes("Authentication")) {
          alert("🔐 Authentication error: " + error.message + " Redirecting to login...");
          sessionStorage.setItem('redirectAfterLogin', '/write-story');
          navigate("/login");
        } else {
          alert("❌ Error: " + error.message);
        }
      } else {
        alert("❌ An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "Adventure",
      tags: [],
      image: "",
      readTime: 5
    });
    setTagInput("");
    setImagePreview("");
    setImageFile(null);
    setImageUploadMethod("file");
    
    // Clear file input
    const fileInput = document.getElementById("imageFile") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 mt-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary-700 mb-4">
                Share Your Travel Story
              </h1>
              <p className="text-gray-600 text-lg">
                Tell fellow travelers about your amazing experiences and discoveries
              </p>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate("/blogs")}
              className="flex items-center text-primary-600 hover:text-primary-700 mb-6 transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blogs
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Story Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter an engaging title for your story..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category and Read Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Read Time (minutes)
                </label>
                <input
                  type="number"
                  id="readTime"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  min="1"
                  max="60"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Auto-calculated based on content length</p>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Your Story *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={15}
                placeholder="Share your travel experience in detail. Describe the places you visited, the people you met, the food you tried, and the memories you made..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  {formData.content.length} characters • {calculateReadTime(formData.content)} min read
                </p>
              </div>
            </div>

            {/* Excerpt */}
            <div className="mb-6">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Story Summary
              </label>
              <div className="flex gap-2 mb-2">
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Write a brief summary of your story (will be shown in the blog list)..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
                />
                <button
                  type="button"
                  onClick={generateExcerpt}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 hover:text-purple-800 transition-all duration-200 text-sm whitespace-nowrap font-medium border border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-md"
                >
                  ✨ Auto Generate
                </button>
              </div>
              <p className="text-sm text-gray-500">{formData.excerpt.length}/300 characters</p>
            </div>

            {/* Featured Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Featured Image
              </label>
              
              {/* Upload Method Toggle */}
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setImageUploadMethod("file");
                    setImagePreview("");
                    setFormData(prev => ({ ...prev, image: "" }));
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    imageUploadMethod === "file"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  📁 Upload File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageUploadMethod("url");
                    setImagePreview("");
                    setImageFile(null);
                    setFormData(prev => ({ ...prev, image: "" }));
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    imageUploadMethod === "url"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  🔗 Image URL
                </button>
              </div>

              {/* File Upload */}
              {imageUploadMethod === "file" && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="imageFile"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 mb-2">
                      {imageFile ? imageFile.name : "Click to upload an image"}
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF, WebP up to 5MB
                    </span>
                  </label>
                </div>
              )}

              {/* URL Input */}
              {imageUploadMethod === "url" && (
                <input
                  type="url"
                  id="imageUrl"
                  name="image"
                  value={formData.image}
                  onChange={handleImageChange}
                  placeholder="https://example.com/your-image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              
              <p className="text-sm text-gray-500 mt-2">
                {imageUploadMethod === "file" 
                  ? "Upload an image from your device to represent your story"
                  : "Provide a URL to an image that represents your story"
                }
              </p>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border shadow-md"
                      onError={() => {
                        setImagePreview("");
                        if (imageUploadMethod === "url") {
                          alert("Failed to load image from URL. Please check the URL and try again.");
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setImageFile(null);
                        setFormData(prev => ({ ...prev, image: "" }));
                        if (imageUploadMethod === "file") {
                          const fileInput = document.getElementById("imageFile") as HTMLInputElement;
                          if (fileInput) fileInput.value = "";
                        }
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="mb-8">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (up to 5)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add tags (press Enter or comma to add)..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={formData.tags.length >= 5}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim() || formData.tags.length >= 5}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Add Tag
                </button>
              </div>
              
              {/* Display Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-5 h-5 flex items-center justify-center transition-all duration-200"
                        title="Remove tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                🗑️ Reset Form
              </button>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate("/blogs")}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  ← Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Publishing Story...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Publish Story
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Guidelines */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Story Guidelines:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Share authentic travel experiences from Bangladesh or other destinations</li>
                <li>• Include helpful tips and insights for fellow travelers</li>
                <li>• Use respectful language and be mindful of cultural sensitivities</li>
                <li>• Your story will be reviewed before publication</li>
                <li>• High-quality stories may be featured on our homepage</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WriteStory;