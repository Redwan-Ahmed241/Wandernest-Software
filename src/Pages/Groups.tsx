import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Using emoji icons instead of lucide-react to avoid external dependencies
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Pagination from "../components/Pagination";
import { useAuth } from "../Authentication/auth-context";
import GroupsAPI from "../api/groups";
import type { Group } from "../types/groups";
import { usePagination } from "../hooks/usePagination";
import GroupView from "./GroupView";

// Loading spinner component
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center min-h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Error message component
const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="text-center py-8">
    <div className="text-red-600 mb-2">⚠️ {message}</div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-sm text-primary hover:underline"
      >
        Try again
      </button>
    )}
  </div>
);

// Group card component for groups list
const GroupCard: React.FC<{ group: Group; onClick: () => void }> = ({ group, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col justify-between h-full min-h-[420px]"
  >
    <div className="relative overflow-hidden">
      <img
        src={group.banner}
        alt={group.name}
        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Privacy Badge */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
        <span className={`text-sm font-semibold ${
          group.privacy === 'public' ? 'text-green-600' : 
          group.privacy === 'private' ? 'text-amber-600' : 
          'text-red-600'
        }`}>
          {group.privacy === 'public' ? '🌍 Public' : group.privacy === 'private' ? '🔒 Private' : '🔐 Secret'}
        </span>
      </div>
      
      {group.isJoined && (
        <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm font-semibold text-white">✓ Joined</span>
        </div>
      )}
      
      {/* Hover info at bottom */}
      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{group.category}</span>
          </div>
          <div className="text-accent font-bold text-lg">
            {group.memberCount.toLocaleString()} members
          </div>
        </div>
      </div>
    </div>
    
    <div className="p-6 flex flex-col flex-1 justify-between">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <img
            src={group.avatar}
            alt={group.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/Figma_photos/wandernest.svg';
            }}
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-200">
              {group.name}
            </h3>
          </div>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {group.description}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-lg">👥</span>
            <span className="text-sm font-semibold text-gray-700">{group.memberCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">💬</span>
            <span className="text-sm font-semibold text-gray-700">{group.postCount}</span>
          </div>
        </div>
        <button 
          type="button"
          className="px-4 py-2 bg-[#6ab187] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 outline-none focus:outline-none"
        >
          View Group
        </button>
      </div>
      
      {/* Tags */}
      {group.tags && group.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {group.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
          {group.tags.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              +{group.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  </div>
);



// ProtectedRoute wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);
  
  if (loading || !isAuthenticated) {
    return <LoadingSpinner />;
  }
  
  return <>{children}</>;
};

// Groups List View Component
const GroupsList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  const {
    currentItems: currentGroups,
    currentPage,
    totalPages,
    goToPage,
  } = usePagination({ data: groups, itemsPerPage: 12 });

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await GroupsAPI.getGroupsWithFallback(
        {
          search: searchTerm,
          category: selectedCategory,
          sortBy: 'popular',
        },
        { page: currentPage, limit: 12 }
      );
      setGroups(response.groups);
    } catch (error) {
      console.error('Failed to load groups:', error);
      setError('Failed to load groups. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, currentPage]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const categories = [
    'Adventure & Travel',
    'Photography',
    'Food & Dining',
    'Travel',
    'Culture',
    'Nature',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-300">
      <Navbar />
      
      {/* Custom styles for dropdown */}
      <style>{`
        .category-select option:checked {
          background: linear-gradient(#6ab187, #6ab187) !important;
          background-color: #6ab187 !important;
          color: white !important;
        }
        .category-select option:hover {
          background-color: #6ab187 !important;
          color: white !important;
        }
        .category-select option {
          background-color: white;
          color: #111827;
          padding: 8px;
        }
        /* For Firefox */
        .category-select option:checked {
          box-shadow: 0 0 10px 100px #6ab187 inset;
          color: white !important;
        }
        /* For webkit browsers */
        .category-select option:checked {
          background: #6ab187 !important;
          color: white !important;
        }
      `}</style>
      
      {/* Hero Section - full width like restaurant page */}
      <section className="relative w-full h-[400px] md:h-[480px] lg:h-[520px] flex items-center justify-center overflow-hidden mb-8">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/Figma_photos/bandorban.jpg')",
          }}
        ></div>
        {/* Overlay for text readability */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
        {/* Subtle brand color overlay */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-primary-dark/20"></div>
        <div className="relative z-10 w-full flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
            Discover
            <span className="block bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              Travel Groups
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            Connect with fellow travelers and explore together across Bangladesh.
          </p>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-2xl font-bold text-primary-700 mb-6">Travel Groups</h1>
        
        <div className="flex flex-col gap-6 mb-8 w-full">
          {/* Search Bar - now wider and at the top */}
          <div className="relative w-full max-w-2xl mx-auto mb-2">
            <input
              type="text"
              className="w-full p-3 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
              placeholder="Search groups by name, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img
              src="/Figma_photos/search.svg"
              alt="search"
              className="absolute left-3 top-3 w-5 h-5"
            />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between w-full">
            {/* Category Dropdown */}
            <div className="flex items-center gap-2 min-w-[180px]">
              <span className="text-sm text-primary-700 whitespace-nowrap">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6ab187] focus:border-[#6ab187] text-gray-900 font-medium category-select"
                style={{
                  outline: 'none',
                }}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-white hover:bg-[#6ab187] hover:text-white">
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* View Toggle & Create Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('grid')}
                type="button"
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-[#6ab187] text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow hover:scale-105'
                }`}
                style={{ border: viewMode === 'grid' ? 'none' : '1px solid #e5e7eb', outline: 'none' }}
              >
                ⬚ Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                type="button"
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-[#6ab187] text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow hover:scale-105'
                }`}
                style={{ border: viewMode === 'list' ? 'none' : '1px solid #e5e7eb', outline: 'none' }}
              >
                ☰ List
              </button>
              <button
                onClick={() => navigate('/groups/create')}
                type="button"
                className="bg-[#6ab187] text-white px-6 py-3 rounded-xl hover:bg-[#5a9f77] transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 font-semibold"
                style={{ border: 'none', outline: 'none' }}
              >
                <span className="text-xl">+</span>
                Create Group
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchGroups} />
        ) : (
          <>
            {/* Groups Grid/List */}
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'space-y-4'
            }>
              {currentGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onClick={() => navigate(`/groups/${group.id}`)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                itemsPerPage={12}
                totalItems={groups.length}
              />
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

// Main Groups Component

// Main Groups Component
const Groups: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <ProtectedRoute>
      {id ? <GroupView /> : <GroupsList />}
    </ProtectedRoute>
  );
};

export default Groups;
