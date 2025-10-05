import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Group, GroupPost, GroupMember, PostFilters } from '../types/groups';
import GroupsAPI from '../api/groups';
import { useAuth } from '../Authentication/auth-context';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

// Loading Spinner Component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-96">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
  </div>
);

// Error Message Component
const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <p className="text-red-800 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold border-0 outline-none focus:outline-none"
        type="button"
      >
        Try Again
      </button>
    )}
  </div>
);

// Post Card Component
const PostCard: React.FC<{
  post: GroupPost;
  onLike: (postId: string) => void;
  onPin?: (postId: string) => void;
  showActions?: boolean;
}> = ({ post, onLike, onPin, showActions }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    {post.isPinned && (
      <div className="mb-3 flex items-center gap-2 text-amber-600 text-sm font-semibold">
        📌 Pinned Post
      </div>
    )}
    <div className="flex items-start gap-3 mb-4">
      <img
        src={post.author.avatar}
        alt={post.author.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
        <p className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      {showActions && onPin && (
        <button
          onClick={() => onPin(post.id)}
          style={{ border: 'none', outline: 'none' }}
          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium shadow-sm"
          type="button"
        >
          {post.isPinned ? '📌 Unpin' : '📌 Pin'}
        </button>
      )}
    </div>
    
    {post.title && <h4 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h4>}
    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
    
    {post.images && post.images.length > 0 && (
      <div className="grid grid-cols-2 gap-2 mb-4">
        {post.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Post image ${index + 1}`}
            className="w-full h-48 object-cover rounded-lg"
          />
        ))}
      </div>
    )}
    
    <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
      <button
        onClick={() => onLike(post.id)}
        style={{ border: 'none', outline: 'none', background: 'none' }}
        className={`flex items-center gap-2 transition-colors ${
          post.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
        }`}
        type="button"
      >
        <span className="text-xl">{post.isLiked ? '❤️' : '🤍'}</span>
        <span className="font-medium">{post.likes}</span>
      </button>
      <button 
        style={{ border: 'none', outline: 'none', background: 'none' }}
        className="flex items-center gap-2 text-gray-600 hover:text-[#6ab187] transition-colors" 
        type="button"
      >
        <span className="text-xl">💬</span>
        <span className="font-medium">{post.comments}</span>
      </button>
      <button 
        style={{ border: 'none', outline: 'none', background: 'none' }}
        className="flex items-center gap-2 text-gray-600 hover:text-[#6ab187] transition-colors" 
        type="button"
      >
        <span className="text-xl">🔗</span>
        <span className="font-medium">Share</span>
      </button>
    </div>
  </div>
);

// Individual Group View Component
const GroupView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Discussion');
  const [postInput, setPostInput] = useState('');
  const [pendingMessage, setPendingMessage] = useState('');
  const [postFilters] = useState<PostFilters>({ status: 'approved', sortBy: 'newest' });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFeeling, setSelectedFeeling] = useState<string>('');
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);

  const fetchGroupData = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const [groupResponse, postsResponse, membersResponse] = await Promise.all([
        GroupsAPI.getGroupWithFallback(id),
        GroupsAPI.getPostsWithFallback(id, postFilters, { page: 1, limit: 20 }),
        GroupsAPI.getMembersWithFallback(id, { page: 1, limit: 50 }),
      ]);

      if (!groupResponse) {
        throw new Error('Group not found');
      }

      setGroup(groupResponse);
      setPosts(postsResponse.posts);
      setMembers(membersResponse.members);
    } catch (error) {
      console.error('Failed to load group data:', error);
      setError('Failed to load group data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, postFilters]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  const handleJoinGroup = async () => {
    if (!group) return;
    try {
      await GroupsAPI.joinGroup(group.id);
      setGroup({ ...group, isJoined: true, memberCount: group.memberCount + 1 });
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };

  const handleLeaveGroup = async () => {
    if (!group) return;
    try {
      await GroupsAPI.leaveGroup(group.id);
      setGroup({ ...group, isJoined: false, memberCount: group.memberCount - 1 });
    } catch (error) {
      console.error('Failed to leave group:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!postInput.trim() || !group) return;
    
    try {
      await GroupsAPI.createPost({
        title: postInput.slice(0, 100),
        content: postInput,
        groupId: group.id,
      });
      
      setPendingMessage('Your post has been submitted and is pending approval.');
      setPostInput('');
      setSelectedImages([]);
      setSelectedFeeling('');
      
      setTimeout(() => {
        setPendingMessage('');
        fetchGroupData();
      }, 2000);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handlePhotoClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files) {
        const imageUrls: string[] = [];
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              imageUrls.push(e.target.result as string);
              setSelectedImages(prev => [...prev, e.target?.result as string]);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    };
    input.click();
  };

  const handleFeelingClick = () => {
    setShowFeelingPicker(!showFeelingPicker);
  };

  const selectFeeling = (feeling: string) => {
    setSelectedFeeling(feeling);
    setShowFeelingPicker(false);
  };

  const feelings = [
    '😊 Happy', '😍 Loved', '😎 Cool', '😢 Sad', '😡 Angry', 
    '🤩 Excited', '😴 Tired', '🤔 Thoughtful', '🎉 Celebrating', '✈️ Traveling'
  ];

  const handleLikePost = async (postId: string) => {
    if (!group) return;
    
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.isLiked) {
        await GroupsAPI.unlikePost(group.id, postId);
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, isLiked: false, likes: p.likes - 1 }
            : p
        ));
      } else {
        await GroupsAPI.likePost(group.id, postId);
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, isLiked: true, likes: p.likes + 1 }
            : p
        ));
      }
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  };

  const handlePinPost = async (postId: string) => {
    if (!group) return;
    
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.isPinned) {
        await GroupsAPI.unpinPost(group.id, postId);
      } else {
        await GroupsAPI.pinPost(group.id, postId);
      }
      
      fetchGroupData();
    } catch (error) {
      console.error('Failed to pin/unpin post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }
  
  if (error || !group) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={error || 'Group not found'} onRetry={fetchGroupData} />
        </div>
        <Footer />
      </div>
    );
  }

  const canPost = group.isJoined && (group.settings.allowMemberPosts || group.role === 'admin' || group.role === 'moderator');
  const canModerate = group.role === 'admin' || group.role === 'moderator';

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      {/* Cover Photo */}
      <div className="relative h-32 md:h-90 bg-gradient-to-b from-gray-900 to-gray-700">
        <img
          src={group.banner}
          alt={group.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/Figma_photos/bandorban.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Group Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
            {/* Group Info */}
            <div className="flex items-center gap-4">
              <img
                src={group.avatar || '/Figma_photos/wandernest.svg'}
                alt={group.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 border-gray-200 shadow-md object-cover bg-gray-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/Figma_photos/wandernest.svg';
                }}
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{group.name}</h1>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    group.privacy === 'public' ? 'bg-green-100 text-green-700' : 
                    group.privacy === 'private' ? 'bg-amber-100 text-amber-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {group.privacy === 'public' ? '🌍' : group.privacy === 'private' ? '🔒' : '🔐'} {group.privacy.charAt(0).toUpperCase() + group.privacy.slice(1)} group
                  </span>
                  <span>•</span>
                  <span className="font-semibold">{group.memberCount.toLocaleString()} members</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {group.isJoined ? (
                <>
                  <button
                    onClick={() => navigate('/groups')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium shadow-sm text-sm"
                    style={{ border: 'none', outline: 'none' }}
                    type="button"
                  >
                    ← Back to Groups
                  </button>
                  <button
                    onClick={handleLeaveGroup}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all font-medium shadow-sm text-sm"
                    style={{ border: 'none', outline: 'none' }}
                    type="button"
                  >
                    ✓ Joined
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/groups')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium shadow-sm text-sm"
                    style={{ border: 'none', outline: 'none' }}
                    type="button"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleJoinGroup}
                    className="px-5 py-2 bg-[#6ab187] text-white rounded-lg hover:bg-[#5a9f77] transition-all font-semibold shadow-md hover:shadow-lg text-sm"
                    style={{ border: 'none', outline: 'none' }}
                    type="button"
                  >
                    + Join Group
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
            {[
              { label: 'Discussion', icon: '💬' },
              { label: 'About', icon: 'ℹ️' },
              { label: 'Members', icon: '👥' },
              { label: 'Photos', icon: '📷' },
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                style={{ border: 'none', outline: 'none', borderBottom: activeTab === tab.label ? '3px solid #6ab187' : '3px solid transparent' }}
                className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.label
                    ? 'text-[#6ab187] bg-[#6ab187]/5'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                type="button"
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-3 space-y-4">
            {activeTab === 'Discussion' && (
              <>
                {/* Create Post Box */}
                {canPost && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start gap-3">
                      <img
                        src={'/Figma_photos/ifty.jpg'}
                        alt="Your avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <textarea
                          value={postInput}
                          onChange={(e) => setPostInput(e.target.value)}
                          placeholder={`What's on your mind, ${user?.first_name || 'there'}?`}
                          className="w-full p-3 bg-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary border-0"
                          rows={3}
                        />
                        
                        {/* Selected Images Preview */}
                        {selectedImages.length > 0 && (
                          <div className="mt-3 flex gap-2 flex-wrap">
                            {selectedImages.map((img, index) => (
                              <div key={index} className="relative">
                                <img src={img} alt={`Selected ${index + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                                <button
                                  onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                  style={{ border: 'none', outline: 'none' }}
                                  type="button"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Selected Feeling Display */}
                        {selectedFeeling && (
                          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                            <span>{selectedFeeling}</span>
                            <button
                              onClick={() => setSelectedFeeling('')}
                              className="text-blue-700 hover:text-blue-900"
                              style={{ border: 'none', outline: 'none', background: 'none' }}
                              type="button"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-3 relative">
                          <div className="flex gap-2">
                            <button 
                              onClick={handlePhotoClick}
                              className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors shadow-sm" 
                              style={{ border: '1px solid #e5e7eb', outline: 'none' }}
                              type="button"
                            >
                              <span className="text-lg">📷</span>
                              <span>Photo</span>
                            </button>
                            <div className="relative">
                              <button 
                                onClick={handleFeelingClick}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors shadow-sm" 
                                style={{ border: '1px solid #e5e7eb', outline: 'none' }}
                                type="button"
                              >
                                <span className="text-lg">😊</span>
                                <span>Feeling</span>
                              </button>
                              
                              {/* Feeling Picker Dropdown */}
                              {showFeelingPicker && (
                                <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-10 w-64">
                                  <p className="text-sm font-semibold text-gray-700 mb-2">How are you feeling?</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {feelings.map((feeling) => (
                                      <button
                                        key={feeling}
                                        onClick={() => selectFeeling(feeling)}
                                        className="px-3 py-2 text-left text-sm hover:bg-gray-100 rounded-lg transition-colors"
                                        style={{ border: 'none', outline: 'none' }}
                                        type="button"
                                      >
                                        {feeling}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={handleCreatePost}
                            disabled={!postInput.trim()}
                            className="px-6 py-2 bg-[#6ab187] text-white rounded-lg hover:bg-[#5a9f77] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold shadow-sm"
                            style={{ border: 'none', outline: 'none' }}
                            type="button"
                          >
                            Post
                          </button>
                        </div>
                        {pendingMessage && (
                          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                            ⏳ {pendingMessage}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Posts Feed */}
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                      <p className="text-gray-500 text-lg">No posts yet. Be the first to post!</p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onLike={handleLikePost}
                        onPin={canModerate ? handlePinPost : undefined}
                        showActions={canModerate}
                      />
                    ))
                  )}
                </div>
              </>
            )}

            {activeTab === 'About' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About this group</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{group.about}</p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🌍</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Privacy</h3>
                      <p className="text-gray-600 text-sm">{group.privacy.charAt(0).toUpperCase() + group.privacy.slice(1)} • {group.visibility}</p>
                    </div>
                  </div>
                  
                  {group.location && (
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">Location</h3>
                        <p className="text-gray-600 text-sm">{group.location.city}, {group.location.country}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Created</h3>
                      <p className="text-gray-600 text-sm">{new Date(group.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🏷️</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {group.rules && group.rules.length > 0 && (
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📋</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Group Rules</h3>
                        <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm">
                          {group.rules.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Members' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Members <span className="text-gray-500 font-normal text-lg">({members.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <img
                        src={member.user.avatar}
                        alt={member.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{member.user.name}</p>
                        <p className="text-sm text-gray-500">
                          {member.role === 'admin' ? '👑 Admin' : member.role === 'moderator' ? '🛡️ Moderator' : '👤 Member'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Photos' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Photos</h2>
                {group.photos && group.photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {group.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Group photo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg hover:opacity-75 transition-opacity cursor-pointer"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No photos yet</p>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* About Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-3">About</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{group.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span>🌍</span>
                  <span className="font-medium">{group.privacy.charAt(0).toUpperCase() + group.privacy.slice(1)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>👥</span>
                  <span>{group.memberCount.toLocaleString()} members</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>💬</span>
                  <span>{group.postCount} posts</span>
                </div>
              </div>
            </div>

            {/* Recent Members */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-3">Recent Members</h3>
              <div className="space-y-3">
                {members.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center gap-2">
                    <img
                      src={member.user.avatar}
                      alt={member.user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{member.user.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-3">Category</h3>
              <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                {group.category}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GroupView;
