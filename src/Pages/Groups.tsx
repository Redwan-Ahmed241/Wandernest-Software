import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Tailwind CSS used for all styling. Centralized color theme via tailwind.config.js
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../Authentication/auth-context";

// Mock group data (replace with API call)
const mockGroup = {
  id: "1",
  name: "Adventure seekers",
  banner: "/figma_photos/bandarban.jpg",
  about: "Adventure community for thrill-seekers.",
  privacy: "Private: Members-only posts.",
  visibility: "Visible: Anyone can find the group.",
  members: [
    { id: "u1", name: "Alex", avatar: "/figma_photos/ifty.jpg" },
    {
      id: "u2",
      name: "Robin",
      avatar: "/figma_photos/ifty_bro_2-modified_reduced.png",
    },
    {
      id: "u3",
      name: "Fred",
      avatar: "/figma_photos/ab tahi_bro-modified-reduced.png",
    },
    { id: "u4", name: "Sara", avatar: "/figma_photos/onu.png" },
    { id: "u5", name: "Maya", avatar: "/figma_photos/NE.jpeg" },
    { id: "u6", name: "Nadir", avatar: "/figma_photos/nadir.jpg" },
    {
      id: "u7",
      name: "Redwan",
      avatar: "/figma_photos/redwan-bro-modified-reduced.png",
    },
    {
      id: "u8",
      name: "Mithil",
      avatar: "/figma_photos/mithil_bro-modified_reduced.png",
    },
    { id: "u9", name: "Ifty", avatar: "/figma_photos/ifty.jpg" },
    { id: "u10", name: "Onu Tareq", avatar: "/figma_photos/onu_tareq.png" },
  ],
  images: [
    "/figma_photos/cox.jpg",
    "/figma_photos/NE.jpeg",
    "/figma_photos/nadir.jpg",
    "/figma_photos/bandarban.jpg",
    "/figma_photos/ifty.jpg",
  ],
  posts: [
    {
      id: "p1",
      title: "Adventure Certificate",
      author: "Alex",
      time: "1h ago",
      image: "/figma_photos/cox.jpg",
      content: "Got my adventure certificate!",
      status: "approved",
    },
    {
      id: "p2",
      title: "My first tour at Rangmati",
      author: "Robin",
      time: "1h ago",
      image: "/figma_photos/bandarban.jpg",
      content: "Amazing experience at Rangmati!",
      status: "approved",
    },
    {
      id: "p3",
      title: "I got scammed!!!",
      author: "Fred",
      time: "1h ago",
      image: "/figma_photos/NE.jpeg",
      content: "Be careful with online bookings!",
      status: "approved",
    },
  ],
};

// Mock pending posts (would come from API for admin)
const mockPendingPosts = [
  {
    id: "p4",
    title: "Pending Adventure",
    author: "Sam",
    time: "just now",
    image: "/figma_photos/ifty.jpg",
    content: "Waiting for approval!",
    status: "pending",
  },
];

const TABS = [
  { label: "About", icon: "ℹ️" },
  { label: "Discussion", icon: "💬" },
  { label: "Featured", icon: "⭐" },
  { label: "Members", icon: "👥" },
];

// ProtectedRoute wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);
  if (loading || !isAuthenticated) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-lg text-gray-600">Loading...</div>
    </div>;
  }
  return <>{children}</>;
};

const Groups: React.FC = () => {
  // const { id } = useParams(); // For real API
  const group = mockGroup; // Replace with API fetch by id
  const [activeTab, setActiveTab] = useState("Discussion");
  const [postInput, setPostInput] = useState("");
  const [pendingMessage, setPendingMessage] = useState("");
  const [pendingPosts, setPendingPosts] = useState(mockPendingPosts); // For admin
  const [posts, setPosts] = useState(group.posts);
  const isAdmin = false; // Set true for admin, or get from user context
  const isJoined = true; // Set true if user is a member (from context or API)
  const currentUser = {
    id: "u1",
    name: "Alex",
    avatar: "/figma_photos/ifty.jpg",
  }; // Replace with real user

  // API-ready: submit post (pending)
  const handlePost = async () => {
    if (!postInput.trim()) return;
    setPendingMessage("Your post is pending admin approval.");
    setPendingPosts((prev) => [
      ...prev,
      {
        id: "pending-" + Date.now(),
        title: postInput.slice(0, 30) || "Untitled",
        author: currentUser.name,
        time: "just now",
        image: "/figma_photos/ifty.jpg",
        content: postInput,
        status: "pending",
      },
    ]);
    setPostInput("");
  };

  // API-ready: admin approve/reject
  const handleApprove = (postId: string) => {
    const post = pendingPosts.find((p) => p.id === postId);
    if (post) {
      setPosts((prev) => [...prev, { ...post, status: "approved" }]);
      setPendingPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };
  const handleReject = (postId: string) => {
    setPendingPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Banner and group name */}
        <div className="relative w-full">
          <img
            src={group.banner}
            alt={group.name}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute bottom-6 left-6 flex items-center text-white text-2xl md:text-3xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded-lg">
            <img
              src="/figma_photos/wandernest.svg"
              alt="group icon"
              className="w-8 h-8 rounded-full mr-3 bg-white p-0.5"
            />
            {group.name}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Member avatars */}
            <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg shadow-sm">
              {group.members.slice(0, 10).map((m) => (
                <img
                  key={m.id}
                  src={m.avatar}
                  alt={m.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-primary transition-colors duration-200"
                />
              ))}
            </div>
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.label}
                  className={
                    activeTab === tab.label
                      ? "flex-1 px-4 py-2 rounded-md bg-white text-primary font-medium shadow-sm transition-all duration-200"
                      : "flex-1 px-4 py-2 rounded-md text-gray-600 hover:text-primary hover:bg-white hover:shadow-sm transition-all duration-200"
                  }
                  onClick={() => setActiveTab(tab.label)}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Tab content */}
            <div className="space-y-4">
              {activeTab === "Discussion" && (
                <>
                  {/* Post input (joined users) */}
                  {isJoined && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                      <img
                        src={currentUser.avatar}
                        alt="user"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-xl mr-1">
                        ✏️
                      </span>
                      <input
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Share your thoughts..."
                        value={postInput}
                        onChange={(e) => setPostInput(e.target.value)}
                        disabled={false}
                      />
                      <button
                        className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={!postInput.trim()}
                        onClick={handlePost}
                      >
                        Post
                      </button>
                    </div>
                  )}
                  {pendingMessage && (
                    <div className="text-gray-500 mb-3 px-4">
                      {pendingMessage}
                    </div>
                  )}
                  {/* Admin: Pending posts */}
                  {isAdmin && pendingPosts.length > 0 && (
                    <div className="mb-6">
                      <div className="text-lg font-semibold text-gray-900 mb-4">
                        Pending Posts
                      </div>
                      {pendingPosts.map((post) => (
                        <div key={post.id} className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 hover:shadow-md transition-shadow duration-200">
                          <div className="flex-1 pr-4">
                            <div className="font-semibold text-gray-900 mb-1">
                              {post.title}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                              Posted by {post.author} - {post.time}
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
                                onClick={() => handleApprove(post.id)}
                              >
                                Approve
                              </button>
                              <button
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                                onClick={() => handleReject(post.id)}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Approved posts list */}
                  <div className="space-y-4">
                    {posts
                      .filter((p) => p.status === "approved")
                      .map((post) => (
                        <div key={post.id} className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 group">
                          <div className="flex-1 pr-4">
                            <div className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-200">
                              {post.title}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                              Posted by {post.author} - {post.time}
                            </div>
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-primary hover:text-white transition-colors duration-200">
                              View Details
                            </button>
                          </div>
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                  </div>
                </>
              )}
              {activeTab === "About" && (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{group.about}</p>
                </div>
              )}
              {activeTab === "Featured" && (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <p className="text-gray-500 text-center py-8">No featured posts yet.</p>
                </div>
              )}
              {activeTab === "Members" && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {group.members.map((m, index) => (
                    <div key={m.id} className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors duration-200 ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-900">{m.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Right: Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900 mb-3">About</div>
              <div className="text-gray-700 mb-4 leading-relaxed">{group.about}</div>
              <div className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                Privacy <span className="ml-1">🔒</span>
              </div>
              <div className="text-gray-700 mb-4 leading-relaxed">{group.privacy}</div>
              <div className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                Visibility <span className="ml-1">👁️</span>
              </div>
              <div className="text-gray-700 leading-relaxed">{group.visibility}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900 mb-4">Photos</div>
              <div className="grid grid-cols-2 gap-3">
                {group.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="group"
                    className="w-full h-24 object-cover rounded-lg hover:opacity-75 transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </ProtectedRoute>
  );
};

export default Groups;
