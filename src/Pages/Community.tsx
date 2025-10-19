"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import Sidebar from "./Sidebar";
import { useAuth } from "../Authentication/auth-context";
import { Search, Heart, MessageCircle, Star } from "react-feather";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    first_name: string;
    last_name: string;
    profile_image?: string;
  };
  created_at: string;
  image?: string;
  excerpt?: string;
  likes_count: number;
  comments_count: number;
}

interface Group {
  id: string;
  name: string;
  description: string;
  member_count: number;
  image?: string;
  is_member?: boolean;
}

interface Review {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    profile_image?: string;
  };
  location: string;
  rating: number;
  content: string;
  images?: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
}

// API Service
class CommunityAPI {
  private static baseURL = "https://wander-nest-ad3s.onrender.com/api";

  private static getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Get token from localStorage - prioritize accessToken (JWT), fallback to simple token
    const rawToken =
      (typeof localStorage !== "undefined" &&
        (localStorage.getItem("accessToken") ||
         localStorage.getItem("token") ||
         localStorage.getItem("authToken"))) ||
      undefined;

    if (rawToken) {
      let tokenStr = String(rawToken).trim();
      // Remove any existing Bearer/Token prefixes
      tokenStr = tokenStr.replace(/^Bearer\s+/i, "").replace(/^Token\s+/i, "");

      // Detect if it's a JWT (3 parts with dots, or starts with "ey")
      const looksLikeJwt =
        tokenStr.split(".").length === 3 || /^ey[A-Za-z0-9_-]/.test(tokenStr);

      // Use Bearer for JWT, Token for simple tokens
      const scheme = looksLikeJwt ? "Bearer" : "Token";
      headers["Authorization"] = `${scheme} ${tokenStr}`;
    }

    return headers;
  }

  private static async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      ...this.getAuthHeaders(),
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers,
      ...options,
    });

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

  static async getBlogs(page = 1, limit = 12): Promise<Blog[]> {
    const response = await this.request(
      `/community/blogs/?page=${page}&limit=${limit}`
    );
    // API wraps response in { success, data, message }
    // data contains { blogs, total, page, limit, hasNext, hasPrev }
    if (response.data && response.data.blogs) {
      return response.data.blogs;
    }
    return response.blogs || response.results || response.data || response;
  }

  static async getGroups(page = 1, limit = 20): Promise<Group[]> {
    const data = await this.request(`/groups/?page=${page}&limit=${limit}`);
    return data.results || data;
  }

  static async getUserGroups(): Promise<Group[]> {
    const data = await this.request(`/user/groups/`);
    return data.results || data;
  }

  static async getReviews(page = 1, limit = 10): Promise<Review[]> {
    const data = await this.request(`/reviews/?page=${page}&limit=${limit}`);
    return data.results || data;
  }

  static async likeReview(reviewId: string): Promise<void> {
    return this.request(`/reviews/${reviewId}/like/`, {
      method: "POST",
    });
  }

  static async joinGroup(groupId: string): Promise<void> {
    return this.request(`/groups/${groupId}/join/`, {
      method: "POST",
    });
  }
}

const Community: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  // Groups UI is not shown in this page currently, so we avoid fetching
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const [blogsError, setBlogsError] = useState<string | null>(null);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setIsLoadingBlogs(true);
      setBlogsError(null);
      const data = await CommunityAPI.getBlogs(1, 12);
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogsError("Failed to load travel blogs");
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  // Groups fetching removed as groups UI is not rendered on this page

  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true);
      setReviewsError(null);
      const data = await CommunityAPI.getReviews(1, 10);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviewsError("Failed to load reviews");
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchBlogs();
      fetchReviews();
    }
  }, [authLoading, isAuthenticated]);

  const handleBlogClick = useCallback(
    (blogId: string) => {
      navigate(`/community/blog/${blogId}`);
    },
    [navigate]
  );

  // Group join/view handlers removed (no Groups UI on this page)

  const handleLikeReview = useCallback(async (reviewId: string) => {
    try {
      await CommunityAPI.likeReview(reviewId);
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? { ...review, likes_count: review.likes_count + 1 }
            : review
        )
      );
    } catch (error) {
      console.error("Error liking review:", error);
      alert("Failed to like review. Please try again.");
    }
  }, []);

  if (authLoading) {
    return (
      <Layout>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-10">
            <div className="max-w-6xl mx-auto">
              <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
            </div>
          </main>
        </div>
      </Layout>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <Layout>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 bg-white">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Hero + Search */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "url('https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1920')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="relative z-10 px-6 md:px-10 py-10 md:py-14">
                <div className="flex items-center gap-3 mb-3">
                  <span role="img" aria-label="community" className="text-4xl">
                    🌍
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold">Community</h1>
                </div>
                <p className="text-white/90 max-w-2xl">
                  Connect, share, and explore the world together.
                </p>
                <div className="mt-6 max-w-2xl">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search travel blogs or discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/15 placeholder-white/70 text-white outline-none border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/30"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Latest Travel Blogs */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  <span role="img" aria-label="blog" className="mr-2">
                    📝
                  </span>
                  Latest Travel Blogs
                </h2>
              </div>

              {isLoadingBlogs ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl overflow-hidden bg-gray-100 animate-pulse"
                    >
                      <div className="h-40 bg-gray-200" />
                      <div className="p-5 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : blogsError ? (
                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  <span>{blogsError}</span>
                  <button
                    onClick={fetchBlogs}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-2xl text-gray-600">
                  No travel blogs found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs
                    .filter((b) =>
                      searchQuery.trim()
                        ? `${b.title} ${b.excerpt ?? ""}`
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        : true
                    )
                    .slice(0, 6)
                    .map((blog) => (
                      <div
                        key={blog.id}
                        className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
                        onClick={() => handleBlogClick(blog.id)}
                      >
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={
                              blog.image ||
                              "/placeholder.svg?height=160&width=320"
                            }
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={
                                blog.author.profile_image ||
                                "/placeholder.svg?height=28&width=28"
                              }
                              alt="author"
                              className="w-7 h-7 rounded-full border-2 border-accent"
                            />
                            <h3 className="font-semibold text-gray-900 line-clamp-1">
                              {blog.title}
                            </h3>
                          </div>
                          <div className="text-sm text-gray-500 mb-2">
                            By {blog.author.first_name} {blog.author.last_name}{" "}
                            | {new Date(blog.created_at).toLocaleDateString()}
                          </div>
                          {blog.excerpt && (
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {blog.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-gray-600">
                            <span className="inline-flex items-center gap-1">
                              <Heart className="w-4 h-4" /> {blog.likes_count}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />{" "}
                              {blog.comments_count}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>

            {/* Discussions & Reviews */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                <span role="img" aria-label="discussions" className="mr-2">
                  💬
                </span>
                Discussions & Reviews
              </h2>

              {isLoadingReviews ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-2xl p-6 shadow animate-pulse space-y-4"
                    >
                      <div className="h-6 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-28 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : reviewsError ? (
                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  <span>{reviewsError}</span>
                  <button
                    onClick={fetchReviews}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-2xl text-gray-600">
                  No reviews found.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={
                            review.user.profile_image ||
                            "/placeholder.svg?height=40&width=40"
                          }
                          alt={`${review.user.first_name} ${review.user.last_name}`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-accent"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {review.user.first_name} {review.user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-600 mb-1">
                        📍 {review.location}
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {review.content}
                      </p>
                      {review.images && review.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {review.images.slice(0, 3).map((image, index) => (
                            <img
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt={`Review photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-xl"
                            />
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <button
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                          onClick={() => handleLikeReview(review.id)}
                        >
                          <Heart className="w-4 h-4" /> {review.likes_count}
                        </button>
                        {review.comments_count > 0 && (
                          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                            <MessageCircle className="w-4 h-4" />{" "}
                            {review.comments_count}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Community;
