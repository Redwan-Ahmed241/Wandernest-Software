import type {
  Group,
  GroupPost,
  GroupMember,
  User,
  GroupsResponse,
  PostsResponse,
  MembersResponse,
  GroupFilters,
  PostFilters,
  PaginationParams,
} from '../types/groups';

// Mock Users
const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: '/Figma_photos/ifty.jpg',
    joinedAt: '2024-01-15T08:00:00Z',
    isActive: true,
  },
  {
    id: 'u2',
    name: 'Robin Smith',
    email: 'robin@example.com',
    avatar: '/Figma_photos/ifty_bro_2-modified_reduced.png',
    joinedAt: '2024-02-10T10:30:00Z',
    isActive: true,
  },
  {
    id: 'u3',
    name: 'Fred Wilson',
    email: 'fred@example.com',
    avatar: '/Figma_photos/abtahi_bro-modified-reduced.png',
    joinedAt: '2024-01-20T14:15:00Z',
    isActive: true,
  },
  {
    id: 'u4',
    name: 'Sara Ahmed',
    email: 'sara@example.com',
    avatar: '/Figma_photos/onu.png',
    joinedAt: '2024-03-05T09:45:00Z',
    isActive: true,
  },
  {
    id: 'u5',
    name: 'Maya Patel',
    email: 'maya@example.com',
    avatar: '/Figma_photos/NE.jpeg',
    joinedAt: '2024-02-28T16:20:00Z',
    isActive: true,
  },
  {
    id: 'u6',
    name: 'Nadir Hassan',
    email: 'nadir@example.com',
    avatar: '/Figma_photos/nadir.jpg',
    joinedAt: '2024-01-08T11:00:00Z',
    isActive: true,
  },
  {
    id: 'u7',
    name: 'Redwan Ahmed',
    email: 'redwan@example.com',
    avatar: '/Figma_photos/redwan-bro-modified-reduced.png',
    joinedAt: '2024-01-01T00:00:00Z',
    isActive: true,
  },
  {
    id: 'u8',
    name: 'Mithil Rahman',
    email: 'mithil@example.com',
    avatar: '/Figma_photos/mithil_bro-modified_reduced.png',
    joinedAt: '2024-02-15T13:30:00Z',
    isActive: true,
  },
  {
    id: 'u9',
    name: 'Ifty Khan',
    email: 'ifty@example.com',
    avatar: '/Figma_photos/ifty.jpg',
    joinedAt: '2024-03-01T07:15:00Z',
    isActive: true,
  },
  {
    id: 'u10',
    name: 'Onu Tareq',
    email: 'onu@example.com',
    avatar: '/Figma_photos/onu_tareq.png',
    joinedAt: '2024-01-25T12:45:00Z',
    isActive: true,
  },
];

// Mock Groups
const mockGroups: Group[] = [
  {
    id: 'g1',
    name: 'Adventure Seekers Bangladesh',
    description: 'Join fellow adventurers exploring the hidden gems of Bangladesh',
    about: 'We are a community of thrill-seekers, nature lovers, and adventure enthusiasts who explore the beautiful landscapes of Bangladesh. From the hills of Bandarban to the beaches of Cox\'s Bazar, we discover and share amazing experiences together.',
    banner: '/Figma_photos/bandarban.jpg',
    avatar: '/Figma_photos/adventure.svg',
    privacy: 'public',
    visibility: 'visible',
    category: 'Adventure & Travel',
    tags: ['adventure', 'travel', 'bangladesh', 'hiking', 'nature'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
    memberCount: 1247,
    postCount: 89,
    isJoined: true,
    role: 'member',
    settings: {
      allowMemberPosts: true,
      requirePostApproval: true,
      allowMemberInvites: true,
    },
    location: {
      city: 'Dhaka',
      country: 'Bangladesh',
      coordinates: { lat: 23.8103, lng: 90.4125 },
    },
    photos: [
      '/Figma_photos/cox.jpg',
      '/Figma_photos/bandarban.jpg',
      '/Figma_photos/Alutila-Cave-Khagrachari.jpg',
      '/Figma_photos/China-Matir-Pahar.jpg',
      '/Figma_photos/deer.jpg',
    ],
    rules: [
      'Be respectful to all members',
      'Share original content only',
      'No spam or promotional posts',
      'Keep discussions travel-related',
      'Help fellow travelers with genuine advice',
    ],
  },
  {
    id: 'g2',
    name: 'Photography Enthusiasts',
    description: 'Capture and share the beauty of Bangladesh through your lens',
    about: 'A community for photographers of all skill levels to share their work, learn new techniques, and discover the most photogenic spots in Bangladesh.',
    banner: '/Figma_photos/coxsbazar.jpg',
    avatar: '/Figma_photos/2023-03-07things14-02-44.jpeg',
    privacy: 'public',
    visibility: 'visible',
    category: 'Photography',
    tags: ['photography', 'art', 'landscape', 'portrait', 'nature'],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-03-20T15:45:00Z',
    memberCount: 892,
    postCount: 156,
    isJoined: false,
    settings: {
      allowMemberPosts: true,
      requirePostApproval: false,
      allowMemberInvites: true,
    },
    location: {
      city: 'Chittagong',
      country: 'Bangladesh',
    },
    photos: [
      '/Figma_photos/coxsbazar.jpg',
      '/Figma_photos/burigangha.jpg',
      '/Figma_photos/dh-hs.jpg',
      '/Figma_photos/fc09d33522052723c107a6d1fe5741b0-ahsan-manzil.jpg',
    ],
    rules: [
      'Original photos only',
      'Credit other photographers when sharing',
      'Constructive feedback welcome',
      'No NSFW content',
    ],
  },
  {
    id: 'g3',
    name: 'Foodie Adventures',
    description: 'Discover the best local cuisines and hidden food gems',
    about: 'From street food to fine dining, we explore the diverse culinary landscape of Bangladesh. Share your food discoveries, recipes, and restaurant recommendations.',
    banner: '/Figma_photos/kacchi.jpeg',
    avatar: '/Figma_photos/dinner.svg',
    privacy: 'public',
    visibility: 'visible',
    category: 'Food & Dining',
    tags: ['food', 'restaurant', 'street-food', 'cuisine', 'local'],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-03-22T09:15:00Z',
    memberCount: 634,
    postCount: 78,
    isJoined: true,
    role: 'moderator',
    settings: {
      allowMemberPosts: true,
      requirePostApproval: false,
      allowMemberInvites: true,
    },
    location: {
      city: 'Dhaka',
      country: 'Bangladesh',
    },
    photos: [
      '/Figma_photos/kacchi.jpeg',
      '/Figma_photos/tandoori-chicken.jpg',
      '/Figma_photos/local_cuisine.jpeg',
      '/Figma_photos/restaurant.jpg',
      '/Figma_photos/dinner.svg',
    ],
    rules: [
      'Share genuine food experiences',
      'Include location details',
      'Respect cultural food practices',
      'No fake reviews',
    ],
  },
  {
    id: 'g4',
    name: 'Solo Travelers Unite',
    description: 'Connect with fellow solo travelers and share experiences',
    about: 'A supportive community for solo travelers to share tips, find travel buddies, and inspire each other to explore the world independently.',
    banner: '/Figma_photos/cycling.jpg',
    avatar: '/Figma_photos/explore.svg',
    privacy: 'private',
    visibility: 'visible',
    category: 'Travel',
    tags: ['solo-travel', 'backpacking', 'budget-travel', 'safety'],
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-03-18T11:20:00Z',
    memberCount: 423,
    postCount: 67,
    isJoined: false,
    settings: {
      allowMemberPosts: true,
      requirePostApproval: true,
      allowMemberInvites: false,
    },
    photos: [
      '/Figma_photos/cycling.jpg',
      '/Figma_photos/eco.jpg',
    ],
    rules: [
      'Maintain privacy and safety',
      'Share helpful solo travel tips',
      'Be supportive of other solo travelers',
      'No meetup arrangements in public posts',
    ],
  },
];

// Mock Posts
const mockPosts: GroupPost[] = [
  {
    id: 'p1',
    title: 'Amazing Adventure at Rangamati!',
    content: 'Just came back from an incredible 3-day trip to Rangamati. The boat ride through Kaptai Lake was breathtaking, and the hanging bridge at Shuvolong was an adrenaline rush! Highly recommend visiting during the dry season for the best experience. The local tribal culture and food were amazing too. Would love to organize a group trip here soon!',
    author: mockUsers[0],
    groupId: 'g1',
    createdAt: '2024-03-20T10:15:00Z',
    updatedAt: '2024-03-20T10:15:00Z',
    status: 'approved',
    images: ['/Figma_photos/bandarban.jpg', '/Figma_photos/cox.jpg'],
    likes: 47,
    comments: 12,
    shares: 8,
    isLiked: true,
    isPinned: false,
  },
  {
    id: 'p2',
    title: 'Cox\'s Bazar Sunrise Photography Tips',
    content: 'Captured this stunning sunrise at Cox\'s Bazar last weekend. Pro tip: Wake up at 5 AM and head to the beach by 5:30. The golden hour lighting is perfect for both landscape and portrait shots. Don\'t forget to bring a tripod for those long exposure shots of the waves!',
    author: mockUsers[1],
    groupId: 'g1',
    createdAt: '2024-03-18T08:30:00Z',
    updatedAt: '2024-03-18T08:30:00Z',
    status: 'approved',
    images: ['/Figma_photos/coxsbazar.jpg'],
    likes: 23,
    comments: 6,
    shares: 3,
    isLiked: false,
    isPinned: true,
  },
  {
    id: 'p3',
    title: 'Warning: Scam Alert in Sylhet',
    content: 'Hey everyone, just wanted to warn you about a scam I encountered in Sylhet. Some fake tour guides are approaching tourists near Jaflong and offering "exclusive" boat rides at inflated prices. Always verify with official tour operators and don\'t pay upfront. Stay safe out there!',
    author: mockUsers[2],
    groupId: 'g1',
    createdAt: '2024-03-15T16:45:00Z',
    updatedAt: '2024-03-15T16:45:00Z',
    status: 'approved',
    images: [],
    likes: 89,
    comments: 31,
    shares: 24,
    isLiked: true,
    isPinned: false,
  },
  {
    id: 'p4',
    title: 'Planning a Bandarban Trek - Need Advice',
    content: 'Hi fellow adventurers! I\'m planning a 5-day trek in Bandarban covering Nilgiri, Chimbuk, and Boga Lake. Has anyone done this route recently? Looking for advice on: 1) Best time to visit 2) Accommodation options 3) Local guides 4) Essential gear to pack. Any tips would be greatly appreciated!',
    author: mockUsers[3],
    groupId: 'g1',
    createdAt: '2024-03-12T11:20:00Z',
    updatedAt: '2024-03-12T11:20:00Z',
    status: 'pending',
    images: ['/Figma_photos/bandarban.jpg'],
    likes: 5,
    comments: 2,
    shares: 0,
    isLiked: false,
    isPinned: false,
  },
  {
    id: 'p5',
    title: 'Street Food Paradise in Old Dhaka',
    content: 'Spent the entire day exploring the street food scene in Old Dhaka. From chotpoti at Chawkbazar to faluda at Star Kabab, every bite was a flavor explosion! The biryani at Hajir Biryani was absolutely divine. Pro tip: Go with an empty stomach and comfortable shoes. You\'ll be walking and eating a lot!',
    author: mockUsers[4],
    groupId: 'g3',
    createdAt: '2024-03-22T14:00:00Z',
    updatedAt: '2024-03-22T14:00:00Z',
    status: 'approved',
    images: ['/Figma_photos/restaurant.jpg'],
    likes: 34,
    comments: 8,
    shares: 5,
    isLiked: true,
    isPinned: false,
  },
];

// Mock Members
const mockMembers: GroupMember[] = mockUsers.map((user, index) => ({
  id: `m${index + 1}`,
  userId: user.id,
  user,
  role: index === 0 ? 'admin' : index < 3 ? 'moderator' : 'member',
  joinedAt: user.joinedAt,
  isActive: user.isActive,
}));

// Helper functions to simulate API responses with filtering and pagination
export const getMockGroups = (
  filters: GroupFilters = {},
  pagination: PaginationParams = { page: 1, limit: 12 }
): GroupsResponse => {
  let filteredGroups = [...mockGroups];

  // Apply filters
  if (filters.category) {
    filteredGroups = filteredGroups.filter(group => 
      group.category.toLowerCase().includes(filters.category!.toLowerCase())
    );
  }

  if (filters.privacy) {
    filteredGroups = filteredGroups.filter(group => group.privacy === filters.privacy);
  }

  if (filters.location) {
    filteredGroups = filteredGroups.filter(group => 
      group.location?.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
      group.location?.country.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredGroups = filteredGroups.filter(group =>
      group.name.toLowerCase().includes(searchTerm) ||
      group.description.toLowerCase().includes(searchTerm) ||
      group.about.toLowerCase().includes(searchTerm) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filteredGroups = filteredGroups.filter(group =>
      filters.tags!.some(tag => group.tags.includes(tag))
    );
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'newest':
        filteredGroups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filteredGroups.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'popular':
      case 'members':
        filteredGroups.sort((a, b) => b.memberCount - a.memberCount);
        break;
    }
  }

  // Apply pagination
  const page = pagination.page || 1;
  const limit = pagination.limit || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex);

  return {
    groups: paginatedGroups,
    total: filteredGroups.length,
    page,
    limit,
    hasNext: endIndex < filteredGroups.length,
    hasPrev: page > 1,
  };
};

export const getMockGroupById = (id: string): Group | null => {
  return mockGroups.find(group => group.id === id) || null;
};

export const getMockPosts = (
  groupId: string,
  filters: PostFilters = {},
  pagination: PaginationParams = { page: 1, limit: 10 }
): PostsResponse => {
  let filteredPosts = mockPosts.filter(post => post.groupId === groupId);

  // Apply filters
  if (filters.status) {
    filteredPosts = filteredPosts.filter(post => post.status === filters.status);
  }

  if (filters.author) {
    filteredPosts = filteredPosts.filter(post => 
      post.author.name.toLowerCase().includes(filters.author!.toLowerCase())
    );
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredPosts = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.isPinned !== undefined) {
    filteredPosts = filteredPosts.filter(post => post.isPinned === filters.isPinned);
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'newest':
        filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filteredPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'popular':
        filteredPosts.sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares));
        break;
    }
  } else {
    // Default: pinned posts first, then by newest
    filteredPosts.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  // Apply pagination
  const page = pagination.page || 1;
  const limit = pagination.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    total: filteredPosts.length,
    page,
    limit,
    hasNext: endIndex < filteredPosts.length,
    hasPrev: page > 1,
  };
};

export const getMockMembers = (
  groupId: string,
  pagination: PaginationParams = { page: 1, limit: 20 }
): MembersResponse => {
  // For the demo, return all members. In a real app, you'd filter by groupId
  console.log(`Getting members for group: ${groupId}`);
  const filteredMembers = [...mockMembers];

  // Apply pagination
  const page = pagination.page || 1;
  const limit = pagination.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  return {
    members: paginatedMembers,
    total: filteredMembers.length,
    page,
    limit,
    hasNext: endIndex < filteredMembers.length,
    hasPrev: page > 1,
  };
};

// Export individual data for testing
export { mockGroups, mockPosts, mockMembers, mockUsers };