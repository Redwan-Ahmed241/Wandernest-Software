// TypeScript interfaces for Groups functionality

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
  isActive: boolean;
}

export interface GroupMember {
  id: string;
  userId: string;
  user: User;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  isActive: boolean;
}

export interface GroupPost {
  id: string;
  title: string;
  content: string;
  author: User;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  images: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isPinned: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  about: string;
  banner: string;
  avatar: string;
  privacy: 'public' | 'private' | 'secret';
  visibility: 'visible' | 'hidden';
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  postCount: number;
  isJoined: boolean;
  role?: 'admin' | 'moderator' | 'member';
  settings: {
    allowMemberPosts: boolean;
    requirePostApproval: boolean;
    allowMemberInvites: boolean;
  };
  location?: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  photos: string[];
  rules: string[];
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  about: string;
  privacy: 'public' | 'private' | 'secret';
  category: string;
  tags: string[];
  banner?: string;
  avatar?: string;
  location?: {
    city: string;
    country: string;
  };
  rules?: string[];
}

export interface UpdateGroupRequest extends Partial<CreateGroupRequest> {
  id: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  groupId: string;
  images?: string[];
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string;
}

export interface GroupsResponse {
  groups: Group[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PostsResponse {
  posts: GroupPost[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface MembersResponse {
  members: GroupMember[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GroupFilters {
  category?: string;
  privacy?: 'public' | 'private';
  location?: string;
  tags?: string[];
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'members';
}

export interface PostFilters {
  status?: 'pending' | 'approved';
  author?: string;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'popular';
  isPinned?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}