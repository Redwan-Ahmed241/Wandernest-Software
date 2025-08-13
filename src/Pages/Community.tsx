"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../App/Layout"
import Sidebar from "./Sidebar"
import { useAuth } from "../Authentication/auth-context"

interface Blog {
  id: string
  title: string
  content: string
  author: {
    first_name: string
    last_name: string
    profile_image?: string
  }
  created_at: string
  image?: string
  excerpt?: string
  likes_count: number
  comments_count: number
}

interface Group {
  id: string
  name: string
  description: string
  member_count: number
  image?: string
  is_member?: boolean
}

interface Review {
  id: string
  user: {
    first_name: string
    last_name: string
    profile_image?: string
  }
  location: string
  rating: number
  content: string
  images?: string[]
  likes_count: number
  comments_count: number
  created_at: string
}

// API Service
class CommunityAPI {
  private static baseURL = "https://wander-nest-ad3s.onrender.com/api"

  private static async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("authToken")
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  static async getBlogs(page = 1, limit = 12): Promise<Blog[]> {
    const data = await this.request(`/blogs/?page=${page}&limit=${limit}`)
    return data.results || data
  }

  static async getGroups(page = 1, limit = 20): Promise<Group[]> {
    const data = await this.request(`/groups/?page=${page}&limit=${limit}`)
    return data.results || data
  }

  static async getUserGroups(): Promise<Group[]> {
    const data = await this.request(`/user/groups/`)
    return data.results || data
  }

  static async getReviews(page = 1, limit = 10): Promise<Review[]> {
    const data = await this.request(`/reviews/?page=${page}&limit=${limit}`)
    return data.results || data
  }

  static async likeReview(reviewId: string): Promise<void> {
    return this.request(`/reviews/${reviewId}/like/`, {
      method: "POST",
    })
  }

  static async joinGroup(groupId: string): Promise<void> {
    return this.request(`/groups/${groupId}/join/`, {
      method: "POST",
    })
  }
}

const Community: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [blogs, setBlogs] = useState<Blog[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [, setUserGroups] = useState<Group[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true)
  const [, setIsLoadingGroups] = useState(true)
  const [, setIsLoadingUserGroups] = useState(true)
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)

  const [blogsError, setBlogsError] = useState<string | null>(null)
  const [, setGroupsError] = useState<string | null>(null)
  const [, setUserGroupsError] = useState<string | null>(null)
  const [reviewsError, setReviewsError] = useState<string | null>(null)

  const fetchBlogs = async () => {
    try {
      setIsLoadingBlogs(true)
      setBlogsError(null)
      const data = await CommunityAPI.getBlogs(1, 12)
      setBlogs(data)
    } catch (error) {
      console.error("Error fetching blogs:", error)
      setBlogsError("Failed to load travel blogs")
    } finally {
      setIsLoadingBlogs(false)
    }
  }

  const fetchGroups = async () => {
    try {
      setIsLoadingGroups(true)
      setGroupsError(null)
      const data = await CommunityAPI.getGroups(1, 20)
      setGroups(data)
    } catch (error) {
      console.error("Error fetching groups:", error)
      setGroupsError("Failed to load travel groups")
    } finally {
      setIsLoadingGroups(false)
    }
  }

  const fetchUserGroups = async () => {
    try {
      setIsLoadingUserGroups(true)
      setUserGroupsError(null)
      const data = await CommunityAPI.getUserGroups()
      setUserGroups(data)
    } catch (error) {
      console.error("Error fetching user groups:", error)
      setUserGroupsError("Failed to load user groups")
    } finally {
      setIsLoadingUserGroups(false)
    }
  }

  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true)
      setReviewsError(null)
      const data = await CommunityAPI.getReviews(1, 10)
      setReviews(data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      setReviewsError("Failed to load reviews")
    } finally {
      setIsLoadingReviews(false)
    }
  }

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchBlogs()
      fetchGroups()
      fetchUserGroups()
      fetchReviews()
    }
  }, [authLoading, isAuthenticated])

  const handleBlogClick = useCallback(
    (blogId: string) => {
      navigate(`/community/blog/${blogId}`)
    },
    [navigate],
  )

  const _handleGroupJoin = useCallback(
    async (groupId: string) => {
      try {
        await CommunityAPI.joinGroup(groupId)
        // Update local state
        const joinedGroup = groups.find((g) => g.id === groupId)
        if (joinedGroup) {
          setUserGroups((prev) => [...prev, { ...joinedGroup, is_member: true }])
          setGroups((prev) =>
            prev.map((group) =>
              group.id === groupId ? { ...group, member_count: group.member_count + 1, is_member: true } : group,
            ),
          )
        }
        alert(`Successfully joined ${joinedGroup?.name}!`)
      } catch (error) {
        console.error("Error joining group:", error)
        alert("Failed to join group. Please try again.")
      }
    },
    [groups],
  )

  const _handleGroupView = useCallback(
    (groupId: string) => {
      navigate(`/community/group/${groupId}`)
    },
    [navigate],
  )

  const handleLikeReview = useCallback(async (reviewId: string) => {
    try {
      await CommunityAPI.likeReview(reviewId)
      setReviews((prev) =>
        prev.map((review) => (review.id === reviewId ? { ...review, likes_count: review.likes_count + 1 } : review)),
      )
    } catch (error) {
      console.error("Error liking review:", error)
      alert("Failed to like review. Please try again.")
    }
  }, [])

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Layout>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-10 text-center">
            <div>Loading...</div>
          </div>
        </div>
      </Layout>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login")
    return null
  }

  return (
    <Layout>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-0">
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-sans relative overflow-x-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-75 before:bg-gradient-to-br before:from-green-100/10 before:to-green-100/5 before:z-0">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="w-full">
                <div className="w-full">
                  <div className="w-full">
                    <div className="w-full">
                      {/* Hero Section */}
                      <div className="text-center pt-20 pb-15 bg-gradient-to-br from-white/90 to-gray-50/80 rounded-3xl mb-12 shadow-[0_20px_40px_rgba(0,0,0,0.1),0_0_0_1px_rgba(171,183,155,0.2),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-sm border border-green-100/30 relative overflow-hidden before:content-[''] before:absolute before:top-[-50%] before:left-[-50%] before:w-[200%] before:h-[200%] before:bg-radial-gradient before:from-green-100/10 before:to-transparent before:animate-pulse before:z-[-1]">
                        <div className="w-full flex flex-row items-start justify-start p-4">
                          <div className="flex flex-col items-start justify-start gap-3 min-w-72">
                            <div className="w-full flex flex-col items-start justify-start">
                              <div className="text-6xl font-extrabold bg-gradient-to-br from-gray-700 to-gray-600 bg-clip-text text-transparent mb-4 drop-shadow-sm tracking-tight relative after:content-[''] after:absolute after:bottom-[-8px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-transparent after:via-green-600 after:to-transparent after:rounded-sm after:shadow-[0_0_20px_rgba(171,183,155,0.6)]">
                                <span role="img" aria-label="community" className="text-4xl mr-2">
                                  🌍
                                </span>
                                Community
                              </div>
                            </div>
                            <div className="w-full flex flex-col items-start justify-start text-xl text-gray-500">
                              <div className="text-xl text-gray-500 mb-8 font-normal tracking-wide">
                                Connect, share, and explore the world together.
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Search Section */}
                        <div className="relative max-w-2xl mx-auto">
                          <input
                            className="w-full py-4 px-6 pl-14 text-base border-2 border-green-100/30 rounded-2xl bg-white/95 backdrop-blur-sm transition-all duration-300 ease-out shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] outline-none placeholder:text-gray-400 placeholder:font-normal focus:border-green-600 focus:shadow-[0_8px_32px_rgba(0,0,0,0.15),0_0_0_4px_rgba(171,183,155,0.2),0_0_20px_rgba(171,183,155,0.3),inset_0_1px_0_rgba(255,255,255,0.8)] focus:-translate-y-0.5 before:content-['🔍'] before:absolute before:left-5 before:top-1/2 before:transform before:-translate-y-1/2 before:text-lg before:z-2"
                            type="text"
                            placeholder="Search travel blogs, groups, or discussions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-lg z-10">🔍</div>
                        </div>
                      </div>

                      {/* Latest Travel Blogs */}
                      <div className="mb-16">
                        <h2 className="text-4xl font-bold text-gray-700 mb-8 flex items-center gap-3 relative after:content-[''] after:flex-1 after:h-0.5 after:bg-gradient-to-r after:from-green-600 after:to-transparent after:ml-5 after:rounded-sm">
                          <span role="img" aria-label="blog">
                            📝
                          </span>{" "}
                          Latest Travel Blogs
                        </h2>
                        {isLoadingBlogs ? (
                          <div className="text-center py-10 text-gray-500 text-lg bg-white/80 rounded-2xl border border-green-100/20 backdrop-blur-sm">Loading travel blogs...</div>
                        ) : blogsError ? (
                          <div className="bg-gradient-to-br from-red-50 to-red-100 text-red-600 p-5 rounded-2xl mb-5 border border-red-200/20 shadow-[0_4px_16px_rgba(204,51,51,0.1)] text-center font-medium">
                            {blogsError}
                            <button onClick={fetchBlogs} className="bg-gradient-to-br from-red-600 to-red-700 text-white border-none py-2 px-4 rounded-lg text-sm font-semibold cursor-pointer ml-3 transition-all duration-300 ease-out shadow-[0_2px_8px_rgba(220,53,69,0.3)] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(220,53,69,0.4)]">
                              Try Again
                            </button>
                          </div>
                        ) : blogs.length === 0 ? (
                          <div className="text-center py-15 px-5 bg-white/80 rounded-2xl border border-green-100/20 backdrop-blur-sm">
                            <p>No travel blogs found.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blogs.slice(0, 6).map((blog) => (
                              <div key={blog.id} className="bg-white/95 rounded-2xl overflow-hidden cursor-pointer transition-all duration-400 ease-out border border-green-100/20 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)] backdrop-blur-sm relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-gradient-to-br before:from-green-100/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 before:z-10 hover:-translate-y-1.5 hover:scale-105 hover:shadow-[0_16px_48px_rgba(0,0,0,0.12),0_0_0_1px_rgba(171,183,155,0.3),0_0_30px_rgba(171,183,155,0.15)] hover:border-green-100/40 hover:before:opacity-100" onClick={() => handleBlogClick(blog.id)}>
                                <img
                                  src={blog.image || "/placeholder.svg?height=99&width=176"}
                                  alt={blog.title}
                                  className="w-full h-50 object-cover transition-transform duration-400 ease-out relative z-20 hover:scale-105"
                                />
                                <div className="p-5 relative z-20">
                                  <div className="flex items-center mb-1">
                                    <img
                                      src={blog.author.profile_image || "/placeholder.svg?height=28&width=28"}
                                      alt="author"
                                      className="w-7 h-7 rounded-full mr-2 border-2 border-green-600"
                                    />
                                    <div className="text-xl font-bold text-gray-700 leading-6 mb-2 flex-1">{blog.title}</div>
                                  </div>
                                  <div className="text-gray-500 text-sm mb-2">
                                    By {blog.author.first_name} {blog.author.last_name} |{" "}
                                    {new Date(blog.created_at).toLocaleDateString()}
                                  </div>
                                  {blog.excerpt && <div className="text-gray-600 text-sm leading-6 mb-3 line-clamp-2">{blog.excerpt}</div>}
                                  <div className="flex gap-4 text-sm text-gray-500">
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
                      <div className="mb-16">
                        <h2 className="text-4xl font-bold text-gray-700 mb-8 flex items-center gap-3 relative after:content-[''] after:flex-1 after:h-0.5 after:bg-gradient-to-r after:from-green-600 after:to-transparent after:ml-5 after:rounded-sm">
                          <span role="img" aria-label="discussions">
                            💬
                          </span>{" "}
                          Discussions & Reviews
                        </h2>
                        {isLoadingReviews ? (
                          <div className="text-center py-10 text-gray-500 text-lg bg-white/80 rounded-2xl border border-green-100/20 backdrop-blur-sm">Loading reviews...</div>
                        ) : reviewsError ? (
                          <div className="bg-gradient-to-br from-red-50 to-red-100 text-red-600 p-5 rounded-2xl mb-5 border border-red-200/20 shadow-[0_4px_16px_rgba(204,51,51,0.1)] text-center font-medium">
                            {reviewsError}
                            <button onClick={fetchReviews} className="bg-gradient-to-br from-red-600 to-red-700 text-white border-none py-2 px-4 rounded-lg text-sm font-semibold cursor-pointer ml-3 transition-all duration-300 ease-out shadow-[0_2px_8px_rgba(220,53,69,0.3)] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(220,53,69,0.4)]">
                              Try Again
                            </button>
                          </div>
                        ) : reviews.length === 0 ? (
                          <div className="text-center py-15 px-5 bg-white/80 rounded-2xl border border-green-100/20 backdrop-blur-sm">
                            <p>No reviews found.</p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-5">
                            {reviews.map((review) => (
                              <div key={review.id} className="bg-white/95 rounded-2xl p-6 border border-green-100/20 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12),0_0_0_1px_rgba(171,183,155,0.3)] hover:border-green-100/30">
                                <div className="flex items-center gap-3 mb-3">
                                  <img
                                    src={review.user.profile_image || "/placeholder.svg?height=40&width=40"}
                                    alt={`${review.user.first_name} ${review.user.last_name}`}
                                    className="w-10 h-10 rounded-full border-2 border-green-600"
                                  />
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-700 mb-0.5">
                                      {review.user.first_name} {review.user.last_name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {new Date(review.created_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-3">📍 {review.location}</div>
                                <div className="mb-3 flex gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-200"}>
                                      ⭐
                                    </span>
                                  ))}
                                </div>
                                <div className="text-gray-600 leading-7 mb-4">{review.content}</div>
                                {review.images && review.images.length > 0 && (
                                  <div className="flex gap-2 mb-4">
                                    {review.images.slice(0, 3).map((image, index) => (
                                      <img
                                        key={index}
                                        src={image || "/placeholder.svg"}
                                        alt={`Review photo ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded-lg"
                                      />
                                    ))}
                                  </div>
                                )}
                                <div className="flex gap-4">
                                  <button className="bg-none border-none text-gray-500 cursor-pointer text-sm py-1 px-2 rounded-md transition-all duration-200 ease-out hover:bg-green-100/10 hover:text-gray-700" onClick={() => handleLikeReview(review.id)}>
                                    ❤️ {review.likes_count}
                                  </button>
                                  {review.comments_count > 0 && (
                                    <button className="bg-none border-none text-gray-500 cursor-pointer text-sm py-1 px-2 rounded-md transition-all duration-200 ease-out hover:bg-green-100/10 hover:text-gray-700">💬 {review.comments_count}</button>
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
  )
}

export default Community
