import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import { useAuth } from '../Authentication/auth-context';

// Mock group data (replace with API call)
const mockGroup = {
  id: '1',
  name: 'Adventure seekers',
  banner: '/Figma_photoes/bandarban.jpg',
  about: 'Adventure community for thrill-seekers.',
  privacy: 'Private: Members-only posts.',
  visibility: 'Visible: Anyone can find the group.',
  members: [
    { id: 'u1', name: 'Alex', avatar: '/Figma_photoes/ifty.jpg' },
    { id: 'u2', name: 'Robin', avatar: '/Figma_photoes/ifty_bro_2-modified_reduced.png' },
    { id: 'u3', name: 'Fred', avatar: '/Figma_photoes/ab tahi_bro-modified-reduced.png' },
    { id: 'u4', name: 'Sara', avatar: '/Figma_photoes/onu.png' },
    { id: 'u5', name: 'Maya', avatar: '/Figma_photoes/NE.jpeg' },
    { id: 'u6', name: 'Nadir', avatar: '/Figma_photoes/nadir.jpg' },
    { id: 'u7', name: 'Redwan', avatar: '/Figma_photoes/redwan-bro-modified-reduced.png' },
    { id: 'u8', name: 'Mithil', avatar: '/Figma_photoes/mithil_bro-modified_reduced.png' },
    { id: 'u9', name: 'Ifty', avatar: '/Figma_photoes/ifty.jpg' },
    { id: 'u10', name: 'Onu Tareq', avatar: '/Figma_photoes/onu_tareq.png' },
  ],
  images: [
    '/Figma_photoes/cox.jpg',
    '/Figma_photoes/NE.jpeg',
    '/Figma_photoes/nadir.jpg',
    '/Figma_photoes/bandarban.jpg',
    '/Figma_photoes/ifty.jpg',
  ],
  posts: [
    {
      id: 'p1',
      title: 'Adventure Certificate',
      author: 'Alex',
      time: '1h ago',
      image: '/Figma_photoes/cox.jpg',
      content: 'Got my adventure certificate!',
      status: 'approved',
    },
    {
      id: 'p2',
      title: 'My first tour at Rangmati',
      author: 'Robin',
      time: '1h ago',
      image: '/Figma_photoes/bandarban.jpg',
      content: 'Amazing experience at Rangmati!',
      status: 'approved',
    },
    {
      id: 'p3',
      title: 'I got scammed!!!',
      author: 'Fred',
      time: '1h ago',
      image: '/Figma_photoes/NE.jpeg',
      content: 'Be careful with online bookings!',
      status: 'approved',
    },
  ],
};

// Mock pending posts (would come from API for admin)
const mockPendingPosts = [
  {
    id: 'p4',
    title: 'Pending Adventure',
    author: 'Sam',
    time: 'just now',
    image: '/Figma_photoes/ifty.jpg',
    content: 'Waiting for approval!',
    status: 'pending',
  },
];

const TABS = [
  { label: 'About', icon: 'ℹ️' },
  { label: 'Discussion', icon: '💬' },
  { label: 'Featured', icon: '⭐' },
  { label: 'Members', icon: '👥' },
];

// ProtectedRoute wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);
  if (loading || !isAuthenticated) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }
  return <>{children}</>;
};

const Groups: React.FC = () => {
  // const { id } = useParams(); // For real API
  const group = mockGroup; // Replace with API fetch by id
  const [activeTab, setActiveTab] = useState('Discussion');
  const [postInput, setPostInput] = useState('');
  const [pendingMessage, setPendingMessage] = useState('');
  const [pendingPosts, setPendingPosts] = useState(mockPendingPosts); // For admin
  const [posts, setPosts] = useState(group.posts);
  const isAdmin = false; // Set true for admin, or get from user context
  const isJoined = true; // Set true if user is a member (from context or API)
  const currentUser = { id: 'u1', name: 'Alex', avatar: '/Figma_photoes/ifty.jpg' }; // Replace with real user

  // API-ready: submit post (pending)
  const handlePost = async () => {
    if (!postInput.trim()) return;
    setPendingMessage('Your post is pending admin approval.');
    setPendingPosts(prev => [
      ...prev,
      {
        id: 'pending-' + Date.now(),
        title: postInput.slice(0, 30) || 'Untitled',
        author: currentUser.name,
        time: 'just now',
        image: '/Figma_photoes/ifty.jpg',
        content: postInput,
        status: 'pending',
      },
    ]);
    setPostInput('');
  };

  // API-ready: admin approve/reject
  const handleApprove = (postId: string) => {
    const post = pendingPosts.find(p => p.id === postId);
    if (post) {
      setPosts(prev => [...prev, { ...post, status: 'approved' }]);
      setPendingPosts(prev => prev.filter(p => p.id !== postId));
    }
  };
  const handleReject = (postId: string) => {
    setPendingPosts(prev => prev.filter(p => p.id !== postId));
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className={styles.groupDetailWrapper}>
        {/* Banner and group name */}
        <div className={styles.groupBannerSection}>
          <img src={group.banner} alt={group.name} className={styles.groupBanner} />
          <div className={styles.groupBannerName}>
            <img src="/Figma_photoes/wandernest.svg" alt="group icon" style={{width:32, height:32, borderRadius:'50%', marginRight:12, verticalAlign:'middle', background:'#fff', padding:2}} />
            {group.name}
          </div>
        </div>
        <div className={styles.groupMainContent}>
          {/* Left: Main content */}
          <div className={styles.groupMainLeft}>
            {/* Member avatars */}
            <div className={styles.groupAvatarsRow}>
              {group.members.slice(0, 10).map(m => (
                <img key={m.id} src={m.avatar} alt={m.name} className={styles.groupAvatar} />
              ))}
            </div>
            {/* Tabs */}
            <div className={styles.groupTabsRow}>
              {TABS.map(tab => (
                <button
                  key={tab.label}
                  className={activeTab === tab.label ? styles.groupTabActive : styles.groupTab}
                  onClick={() => setActiveTab(tab.label)}
                >
                  <span style={{marginRight:6}}>{tab.icon}</span>{tab.label}
                </button>
              ))}
            </div>
            {/* Tab content */}
            <div className={styles.groupTabContent}>
              {activeTab === 'Discussion' && (
                <>
                  {/* Post input (joined users) */}
                  {isJoined && (
                    <div className={styles.groupPostInputRow}>
                      <img src={currentUser.avatar} alt="user" className={styles.groupAvatar} />
                      <span style={{fontSize:'1.2rem',marginRight:6}}>✏️</span>
                      <input
                        className={styles.groupPostInput}
                        placeholder={'Share your thoughts...'}
                        value={postInput}
                        onChange={e => setPostInput(e.target.value)}
                        disabled={false}
                      />
                      <button className={styles.groupPostButton} disabled={!postInput.trim()} onClick={handlePost}>Post</button>
                    </div>
                  )}
                  {pendingMessage && (
                    <div style={{ color: '#b0b0b0', marginBottom: 12 }}>{pendingMessage}</div>
                  )}
                  {/* Admin: Pending posts */}
                  {isAdmin && pendingPosts.length > 0 && (
                    <div className={styles.groupPendingPostsSection}>
                      <div className={styles.groupSidebarTitle} style={{marginBottom: 8}}>Pending Posts</div>
                      {pendingPosts.map(post => (
                        <div key={post.id} className={styles.groupPostCard}>
                          <div className={styles.groupPostInfo}>
                            <div className={styles.groupPostTitle}>{post.title}</div>
                            <div className={styles.groupPostMeta}>Posted by {post.author} - {post.time}</div>
                            <div style={{display:'flex', gap:8}}>
                              <button className={styles.groupPostButton} onClick={() => handleApprove(post.id)}>Approve</button>
                              <button className={styles.groupPostButton} style={{background:'#e57373'}} onClick={() => handleReject(post.id)}>Reject</button>
                            </div>
                          </div>
                          <img src={post.image} alt={post.title} className={styles.groupPostImage} />
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Approved posts list */}
                  <div className={styles.groupPostsList}>
                    {posts.filter(p => p.status === 'approved').map(post => (
                      <div key={post.id} className={styles.groupPostCard}>
                        <div className={styles.groupPostInfo}>
                          <div className={styles.groupPostTitle}>{post.title}</div>
                          <div className={styles.groupPostMeta}>Posted by {post.author} - {post.time}</div>
                          <button className={styles.groupPostDetailsBtn}>View Details</button>
                        </div>
                        <img src={post.image} alt={post.title} className={styles.groupPostImage} />
                      </div>
                    ))}
                  </div>
                </>
              )}
              {activeTab === 'About' && (
                <div className={styles.groupAboutTab}>{group.about}</div>
              )}
              {activeTab === 'Featured' && (
                <div className={styles.groupAboutTab}>No featured posts yet.</div>
              )}
              {activeTab === 'Members' && (
                <div className={styles.groupMembersTab}>
                  {group.members.map(m => (
                    <div key={m.id} className={styles.groupMemberRow}>
                      <img src={m.avatar} alt={m.name} className={styles.groupAvatar} />
                      <span>{m.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Right: Sidebar */}
          <div className={styles.groupSidebar}>
            <div className={styles.groupSidebarSection}>
              <div className={styles.groupSidebarTitle}>About</div>
              <div className={styles.groupSidebarText}>{group.about}</div>
              <div className={styles.groupSidebarTitle}>Privacy <span style={{marginLeft:4}}>🔒</span></div>
              <div className={styles.groupSidebarText}>{group.privacy}</div>
              <div className={styles.groupSidebarTitle}>Visibility <span style={{marginLeft:4}}>👁️</span></div>
              <div className={styles.groupSidebarText}>{group.visibility}</div>
            </div>
            <div className={styles.groupSidebarImages}>
              {group.images.map((img, i) => (
                <img key={i} src={img} alt="group" className={styles.groupSidebarImg} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </ProtectedRoute>
  );
};

export default Groups;
