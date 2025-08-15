"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../App/Layout";
import Sidebar from "./Sidebar";
import { useAuth } from "../Authentication/auth-context";
// Tailwind CSS used for all styling. Centralized color theme via tailwind.config.js
// Tailwind CSS used for all styling. Centralized color theme via tailwind.config.js

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

  private static async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  static async getBlogs(page = 1, limit = 12): Promise<Blog[]> {
    const data = await this.request(`/blogs/?page=${page}&limit=${limit}`);
    return data.results || data;
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
  const [groups, setGroups] = useState<Group[]>([]);
  const [, setUserGroups] = useState<Group[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [, setIsLoadingGroups] = useState(true);
  const [, setIsLoadingUserGroups] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const [blogsError, setBlogsError] = useState<string | null>(null);
  const [, setGroupsError] = useState<string | null>(null);
  const [, setUserGroupsError] = useState<string | null>(null);
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

  const fetchGroups = async () => {
    try {
      setIsLoadingGroups(true);
      setGroupsError(null);
      const data = await CommunityAPI.getGroups(1, 20);
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroupsError("Failed to load travel groups");
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const fetchUserGroups = async () => {
    try {
      setIsLoadingUserGroups(true);
      setUserGroupsError(null);
      const data = await CommunityAPI.getUserGroups();
      setUserGroups(data);
    } catch (error) {
      console.error("Error fetching user groups:", error);
      setUserGroupsError("Failed to load user groups");
    } finally {
      setIsLoadingUserGroups(false);
    }
  };

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
      fetchGroups();
      fetchUserGroups();
      fetchReviews();
    }
  }, [authLoading, isAuthenticated]);

  const handleBlogClick = useCallback(
    (blogId: string) => {
      navigate(`/community/blog/${blogId}`);
    },
    [navigate]
  );

  const _handleGroupJoin = useCallback(
    async (groupId: string) => {
      try {
        await CommunityAPI.joinGroup(groupId);
        // Update local state
        const joinedGroup = groups.find((g) => g.id === groupId);
        if (joinedGroup) {
          setUserGroups((prev) => [
            ...prev,
            { ...joinedGroup, is_member: true },
          ]);
          setGroups((prev) =>
            prev.map((group) =>
              group.id === groupId
                ? {
                    ...group,
                    member_count: group.member_count + 1,
                    is_member: true,
                  }
                : group
            )
          );
        }
        alert(`Successfully joined ${joinedGroup?.name}!`);
      } catch (error) {
        console.error("Error joining group:", error);
        alert("Failed to join group. Please try again.");
      }
    },
    [groups]
  );

  const _handleGroupView = useCallback(
    (groupId: string) => {
      navigate(`/community/group/${groupId}`);
    },
    [navigate]
  );

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

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Layout>
        <div style={{ display: "flex" }}>
          <Sidebar />
          <div style={{ flex: 1, padding: "40px", textAlign: "center" }}>
            <div>Loading...</div>
          </div>
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
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className={styles.community}>
          <div className={styles.communityWrapper}>
            <div className={styles.community1}>
              <div className={styles.depth0Frame0}>
                <div className={styles.depth1Frame0}>
                  <div className={styles.depth2Frame1}>
                    <div className={styles.depth3Frame02}>
                      {/* Hero Section */}
                      <div className={styles.heroSection}>
                        <div className={styles.depth4Frame02}>
                          <div className={styles.depth5Frame03}>
                            <div className={styles.depth6Frame02}>
                              <div className={styles.communityTitle}>
                                <span
                                  role="img"
                                  aria-label="community"
                                  style={{ fontSize: 36, marginRight: 10 }}
                                >
                                  🌍
                                </span>
                                Community
                              </div>
                            </div>
                            <div className={styles.depth6Frame11}>
                              <div className={styles.communitySubtitle}>
                                Connect, share, and explore the world together.
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Search Section */}
                        <div className={styles.searchBarWrapper}>
                          <input
                            className={styles.searchBarResponsive}
                            type="text"
                            placeholder="Search travel blogs, groups, or discussions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Latest Travel Blogs */}
                      <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                          <span role="img" aria-label="blog">
                            📝
                          </span>{" "}
                          Latest Travel Blogs
                        </h2>
                        {isLoadingBlogs ? (
                          <div className={styles.loadingSpinner}>
                            Loading travel blogs...
                          </div>
                        ) : blogsError ? (
                          <div className={styles.errorMessage}>
                            {blogsError}
                            <button
                              onClick={fetchBlogs}
                              className={styles.retryButton}
                            >
                              Try Again
                            </button>
                          </div>
                        ) : blogs.length === 0 ? (
                          <div className={styles.emptyState}>
                            <p>No travel blogs found.</p>
                          </div>
                        ) : (
                          <div className={styles.blogsGrid}>
                            {blogs.slice(0, 6).map((blog) => (
                              <div
                                key={blog.id}
                                className={styles.blogCard}
                                onClick={() => handleBlogClick(blog.id)}
                              >
                                <img
                                  src={
                                    blog.image ||
                                    "/placeholder.svg?height=99&width=176"
                                  }
                                  alt={blog.title}
                                  className={styles.blogImage}
                                />
                                <div className={styles.blogInfo}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginBottom: 4,
                                    }}
                                  >
                                    <img
                                      src={
                                        blog.author.profile_image ||
                                        "/placeholder.svg?height=28&width=28"
                                      }
                                      alt="author"
                                      style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        marginRight: 8,
                                        border: "2px solid #abb79b",
                                      }}
                                    />
                                    <div className={styles.blogTitle}>
                                      {blog.title}
                                    </div>
                                  </div>
                                  <div className={styles.blogMeta}>
                                    By {blog.author.first_name}{" "}
                                    {blog.author.last_name} |{" "}
                                    {new Date(
                                      blog.created_at
                                    ).toLocaleDateString()}
                                  </div>
                                  {blog.excerpt && (
                                    <div className={styles.blogExcerpt}>
                                      {blog.excerpt}
                                    </div>
                                  )}
                                  <div className={styles.blogStats}>
                                    <span>❤️ {blog.likes_count}</span>
                                    <span>💬 {blog.comments_count}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Discussions & Reviews */}
                      <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                          <span role="img" aria-label="discussions">
                            💬
                          </span>{" "}
                          Discussions & Reviews
                        </h2>
                        {isLoadingReviews ? (
                          <div className={styles.loadingSpinner}>
                            Loading reviews...
                          </div>
                        ) : reviewsError ? (
                          <div className={styles.errorMessage}>
                            {reviewsError}
                            <button
                              onClick={fetchReviews}
                              className={styles.retryButton}
                            >
                              Try Again
                            </button>
                          </div>
                        ) : reviews.length === 0 ? (
                          <div className={styles.emptyState}>
                            <p>No reviews found.</p>
                          </div>
                        ) : (
                          <div className={styles.reviewsContainer}>
                            {reviews.map((review) => (
                              <div
                                key={review.id}
                                className={styles.reviewCard}
                              >
                                <div className={styles.reviewHeader}>
                                  <img
                                    src={
                                      review.user.profile_image ||
                                      "/placeholder.svg?height=40&width=40"
                                    }
                                    alt={`${review.user.first_name} ${review.user.last_name}`}
                                    className={styles.reviewAvatar}
                                  />
                                  <div className={styles.reviewUserInfo}>
                                    <div className={styles.reviewUserName}>
                                      {review.user.first_name}{" "}
                                      {review.user.last_name}
                                    </div>
                                    <div className={styles.reviewDate}>
                                      {new Date(
                                        review.created_at
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.reviewLocation}>
                                  📍 {review.location}
                                </div>
                                <div className={styles.reviewRating}>
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span
                                      key={i}
                                      className={
                                        i < review.rating
                                          ? styles.starFilled
                                          : styles.starEmpty
                                      }
                                    >
                                      ⭐
                                    </span>
                                  ))}
                                </div>
                                <div className={styles.reviewContent}>
                                  {review.content}
                                </div>
                                {review.images && review.images.length > 0 && (
                                  <div className={styles.reviewImages}>
                                    {review.images
                                      .slice(0, 3)
                                      .map((image, index) => (
                                        <img
                                          key={index}
                                          src={image || "/placeholder.svg"}
                                          alt={`Review photo ${index + 1}`}
                                          className={styles.reviewImage}
                                        />
                                      ))}
                                  </div>
                                )}
                                <div className={styles.reviewActions}>
                                  <button
                                    className={styles.reviewAction}
                                    onClick={() => handleLikeReview(review.id)}
                                  >
                                    ❤️ {review.likes_count}
                                  </button>
                                  {review.comments_count > 0 && (
                                    <button className={styles.reviewAction}>
                                      💬 {review.comments_count}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
