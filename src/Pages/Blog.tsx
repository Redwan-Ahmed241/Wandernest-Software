import { API_BASE, getAuthHeaders } from '../config/api';
//
// Tailwind conversion: remove CSS import
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// Blog interface
interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_image?: string;
  };
  image?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
}

// API Service
class BlogAPI {
  private static baseURL = `${API_BASE}/api`;

  private static getHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    };
  }

  private static async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      ...this.getHeaders(),
      ...(options.headers as Record<string, string>),
    };

    console.log("BlogAPI request to:", `${this.baseURL}${endpoint}`);

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers,
      ...options,
    });

    console.log("BlogAPI response status:", response.status);

    if (!response.ok) {
      // If 401 and we had a token, it's invalid - clear it
      if (response.status === 401 && headers.Authorization) {
        console.warn("Token is invalid/expired, clearing localStorage");
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("authToken");
          localStorage.removeItem("accessToken");
        }
      }
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  static async getBlogs(
    page = 1,
    limit = 12
  ): Promise<{
    blogs: BlogPost[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const response = await this.request(
      `/community/blogs/?page=${page}&limit=${limit}`
    );
    // API wraps response in { success, data, message }
    return response.data || response;
  }

  static async searchBlogs(query: string): Promise<BlogPost[]> {
    const response = await this.request(
      `/community/blogs/search/?q=${encodeURIComponent(query)}`
    );
    // API wraps response in { success, data, message }
    return response.data || response;
  }
}

// Component
const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const blogsPerPage = 12;

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await BlogAPI.getBlogs(currentPage, blogsPerPage);
        setBlogs(data.blogs || data);
        setTotalPages(
          Math.ceil((data.total || data.blogs?.length || 0) / blogsPerPage)
        );
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    if (!isSearching) {
      fetchBlogs();
    }
  }, [currentPage, isSearching]);

  // Search blogs with debouncing
  useEffect(() => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        setIsSearching(true);
        const data = await BlogAPI.searchBlogs(searchTerm);
        setBlogs(Array.isArray(data) ? data : []);
        setTotalPages(1); // Search results on single page
        setCurrentPage(1);
      } catch (err) {
        console.error("Error searching blogs:", err);
        setError("Failed to search blogs");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading && blogs.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white py-12 px-4 mt-16">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-80" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-primary-700 mb-4 tracking-tight">
              WanderNest Blog
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
              Discover amazing travel stories, tips, and destinations from
              fellow wanderers around Bangladesh and beyond.
            </p>
            <button
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition"
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/community");
                } else {
                  sessionStorage.setItem("redirectAfterLogin", "/community");
                  navigate("/login");
                }
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              {isAuthenticated ? "Write Your Travel Story" : "Share Your Story"}
            </button>
          </div>

          {/* Search Section */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Blog Grid */}
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No blogs found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        blog.image ||
                        "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600"
                      }
                      alt={blog.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Author Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-semibold text-gray-800">
                        {blog.author.first_name || blog.author.username}
                      </span>
                    </div>

                    {/* Hover Info */}
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm font-medium">
                            {formatDate(blog.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-accent font-semibold">
                          <span>Read More</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {blog.excerpt || blog.content.substring(0, 150) + "..."}
                    </p>

                    {/* Stats Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {blog.likes_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {blog.comments_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isSearching && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;
