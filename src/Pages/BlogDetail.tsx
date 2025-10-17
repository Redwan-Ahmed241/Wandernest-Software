import React from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  static async getBlogById(blogId: string): Promise<BlogPost> {
    const data = await this.request(`/community/blogs/${blogId}/`);
    return data;
  }
}

// Component
const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = React.useState<BlogPost | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await BlogAPI.getBlogById(id);
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white py-12 px-4 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4" />
              <div className="h-64 bg-gray-200 rounded mb-6" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white py-12 px-4 mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {error || "Blog Post Not Found"}
            </h1>
            <p className="text-gray-600 mb-8">
              {error
                ? "Failed to load the blog post."
                : "The blog post you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => navigate("/blogs")}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition"
            >
              Back to Blogs
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatContent = (content: string) => {
    // Split content by double line breaks to create paragraphs
    return content.split("\n\n").map((paragraph, index) => {
      // Check if paragraph is a heading (starts with **)
      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
        const headingText = paragraph.slice(2, -2);
        return (
          <h3
            key={index}
            className="text-2xl font-bold text-gray-900 mt-8 mb-4"
          >
            {headingText}
          </h3>
        );
      }

      // Check if paragraph contains bullet points
      if (paragraph.includes("- **")) {
        const items = paragraph
          .split("\n")
          .filter((line) => line.trim().startsWith("- "));
        return (
          <ul key={index} className="space-y-2 mb-6">
            {items.map((item, itemIndex) => {
              // Handle bold text in list items
              const cleanItem = item.replace("- **", "").replace(/\*\*/g, "");
              const [boldPart, ...rest] = cleanItem.split(":");
              return (
                <li key={itemIndex} className="flex">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>
                    <strong className="text-gray-900">{boldPart}:</strong>
                    {rest.length > 0 && (
                      <span className="text-gray-700">{rest.join(":")}</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        );
      }

      // Regular paragraph
      return (
        <p key={index} className="text-gray-700 mb-6 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <>
      <Navbar />
      <article className="min-h-screen bg-white py-12 px-4 mt-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-8 transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blogs
          </button>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between text-gray-600 mb-6">
              <div className="flex items-center gap-4">
                <span>
                  By{" "}
                  <strong>
                    {blog.author.first_name} {blog.author.last_name}
                  </strong>
                </span>
                <span>{formatDate(blog.created_at)}</span>
              </div>
            </div>

            {/* Featured Image */}
            <img
              src={
                blog.image ||
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgODBMMjI1IDEyMEwxNzUgMTYwVjgwWiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4K"
              }
              alt={blog.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgODBMMjI1IDEyMEwxNzUgMTYwVjgwWiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4K";
              }}
            />
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {formatContent(blog.content)}
          </div>

          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {blog.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Social Stats */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex gap-6 text-gray-600">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {blog.likes_count} likes
                </span>
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {blog.comments_count} comments
                </span>
              </div>

              <div className="flex gap-3">
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition">
                  Like
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
};

export default BlogDetail;
