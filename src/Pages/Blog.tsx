import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

// Blog interface
interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: number;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
}

// Mock data for fallback
const mockBlogs: BlogPost[] = [
  {
    id: "1",
    title: "Adventure in Sundarbans",
    content: "The Sundarbans, a UNESCO World Heritage Site, is a sprawling mangrove forest shared by India and Bangladesh. Its unique biodiversity, including the famous Royal Bengal Tiger, makes it a haven for nature enthusiasts and adventure seekers alike. This blog narrates my thrilling journey exploring the dense wilderness, spotting rare wildlife, and connecting with the local communities who call this enchanting place home.",
    excerpt: "Discover the mysterious mangrove forests and wildlife of the Sundarbans in this thrilling adventure story.",
    author: "Omar Rahman",
    date: "2023-07-15",
    category: "Adventure",
    image: "Figma_photos/fisherman-sundarbans-india-looking-catch-mangrove-islands-west-bengal-74904922.jpg",
    readTime: 8,
    tags: ["Sundarbans", "Wildlife", "Adventure", "Bangladesh"],
    likes: 120,
    comments: 45,
    shares: 30
  },
  {
    id: "2",
    title: "Cox's Bazar: World's Longest Sea Beach",
    content: "Cox's Bazar boasts the world's longest unbroken sandy sea beach, stretching over 120 kilometers along the Bay of Bengal. This coastal paradise offers breathtaking sunsets, fresh seafood, and endless opportunities for relaxation and adventure.",
    excerpt: "Experience the magic of the world's longest natural sea beach and its stunning sunsets.",
    author: "Fatima Khan",
    date: "2023-08-10",
    category: "Beach",
    image: "Figma_photos/cox-s-bazaar-syed-zakir-hossain-1584366863439.jpg",
    readTime: 6,
    tags: ["Cox's Bazar", "Beach", "Sunset", "Bangladesh"],
    likes: 89,
    comments: 32,
    shares: 25
  },
  {
    id: "3",
    title: "Exploring the Hills of Bandarban",
    content: "Bandarban, nestled in the Chittagong Hill Tracts, offers a perfect escape into nature with its rolling hills, pristine lakes, and indigenous communities. From trekking to Nilgiri to experiencing the unique culture of hill tribes, Bandarban is a treasure trove for adventurous travelers.",
    excerpt: "Journey through the scenic hills and discover the rich cultural heritage of Bangladesh's hill tribes.",
    author: "Rajib Hasan",
    date: "2023-09-05",
    category: "Hills",
    image: "Figma_photos/bandarban.jpg",
    readTime: 10,
    tags: ["Bandarban", "Hills", "Trekking", "Culture"],
    likes: 156,
    comments: 67,
    shares: 42
  },
  {
    id: "4",
    title: "Heritage Walk in Old Dhaka",
    content: "Old Dhaka is a living museum of Mughal architecture, bustling bazaars, and centuries-old traditions. Walk through the narrow lanes of Shankhari Bazaar, visit the historic Lalbagh Fort, and experience the vibrant street food culture that defines this ancient city.",
    excerpt: "Step back in time and explore the rich history and culture of Old Dhaka's heritage sites.",
    author: "Shabnam Ara",
    date: "2023-09-20",
    category: "Heritage",
    image: "Figma_photos/fc09d33522052723c107a6d1fe5741b0-ahsan-manzil.jpg",
    readTime: 7,
    tags: ["Dhaka", "Heritage", "History", "Culture"],
    likes: 203,
    comments: 89,
    shares: 56
  },
  {
    id: "5",
    title: "Culinary Journey Through Bangladesh",
    content: "From the spicy fish curries of Sylhet to the sweet delicacies of Comilla, Bangladesh offers a rich tapestry of flavors. This culinary journey explores the diverse regional cuisines, street food culture, and traditional cooking methods that make Bangladeshi cuisine unique.",
    excerpt: "Embark on a flavorful adventure through Bangladesh's diverse culinary landscape.",
    author: "Chef Karim",
    date: "2023-09-12",
    category: "Food",
    image: "Figma_photos/555536.jpg",
    readTime: 9,
    tags: ["Food", "Culture", "Traditional", "Bangladesh"],
    likes: 178,
    comments: 91,
    shares: 67
  },
  {
    id: "6",
    title: "River Life on the Padma",
    content: "The mighty Padma River is the lifeline of Bangladesh, supporting millions of people along its banks. Experience the vibrant river culture, from fishing communities to river markets, and witness how this great river shapes the daily lives of the Bengali people.",
    excerpt: "Discover the rich cultural heritage and daily life along Bangladesh's mighty Padma River.",
    author: "Nasir Ahmed",
    date: "2023-08-28",
    category: "Culture",
    image: "Figma_photos/burigangha.jpg",
    readTime: 7,
    tags: ["River", "Culture", "Community", "Bangladesh"],
    likes: 134,
    comments: 56,
    shares: 38
  }
];

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [blogs] = useState<BlogPost[]>(mockBlogs); // Initialize with mock data
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(6);

  console.log("BlogPage rendered, blogs count:", blogs.length, "currentBlogs will be:", blogs.slice(0, 6).length);

  // Categories for filtering
  const categories = ["All", "Adventure", "Beach", "Hills", "Heritage", "Culture", "Food"];

  // Filter blogs based on search and category
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
              Discover amazing travel stories, tips, and destinations from fellow wanderers around Bangladesh and beyond.
            </p>
            
            {/* Write Blog Button - Available for all users */}
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    navigate("/write-story");
                  } else {
                    // Store the intended destination and redirect to login
                    sessionStorage.setItem('redirectAfterLogin', '/write-story');
                    navigate("/login");
                  }
                }}
                className="inline-flex items-center px-8 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-white hover:opacity-90"
                style={{ backgroundColor: '#6ab187' }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                {isAuthenticated ? "Write Your Travel Story" : "Share Your Story"}
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
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

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === category
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          {currentBlogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No blogs found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentBlogs.map((blog) => (
                <article
                  key={blog.id}
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgODBMMjI1IDEyMEwxNzUgMTYwVjgwWiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4K";
                    }}
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                        {blog.category}
                      </span>
                      <span className="text-gray-500 text-sm">{blog.readTime} min read</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>By {blog.author}</span>
                      <span>{formatDate(blog.date)}</span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          {blog.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                          {blog.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                          </svg>
                          {blog.shares}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/blogs/${blog.id}`);
                        }}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition ${
                    currentPage === page
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
              >
                Next
              </button>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center bg-primary-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-primary-700 mb-4">
              Have a Travel Story to Share?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our community of travel writers and share your adventures with fellow wanderers. 
              Your story could inspire someone's next great journey!
            </p>
            <div className="flex justify-center">
              <button 
                className="text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition"
                style={{ backgroundColor: '#6ab187' }}
                onClick={() => {
                  if (isAuthenticated) {
                    navigate("/community");
                  } else {
                    // Store the intended destination and redirect to login
                    sessionStorage.setItem('redirectAfterLogin', '/community');
                    navigate("/login");
                  }
                }}
              >
                Join Community
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;
