import type {
  Group,
  GroupPost,
  GroupMember,
  CreateGroupRequest,
  UpdateGroupRequest,
  CreatePostRequest,
  UpdatePostRequest,
  GroupsResponse,
  PostsResponse,
  MembersResponse,
  ApiResponse,
  GroupFilters,
  PostFilters,
  PaginationParams,
} from '../types/groups';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://wander-nest-ad3s.onrender.com';

class GroupsAPI {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Success',
      };
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return {
        success: false,
        data: null as T,
        message: 'Request failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Groups CRUD Operations
  static async getAllGroups(
    filters: GroupFilters = {},
    pagination: PaginationParams = { page: 1, limit: 12 }
  ): Promise<ApiResponse<GroupsResponse>> {
    const queryParams = new URLSearchParams();
    
    if (pagination.page) queryParams.append('page', pagination.page.toString());
    if (pagination.limit) queryParams.append('limit', pagination.limit.toString());
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.privacy) queryParams.append('privacy', filters.privacy);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.tags) queryParams.append('tags', filters.tags.join(','));

    return this.makeRequest<GroupsResponse>(`/api/groups?${queryParams.toString()}`);
  }

  static async getGroupById(id: string): Promise<ApiResponse<Group>> {
    return this.makeRequest<Group>(`/api/groups/${id}`);
  }

  static async createGroup(groupData: CreateGroupRequest): Promise<ApiResponse<Group>> {
    return this.makeRequest<Group>('/api/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  static async updateGroup(groupData: UpdateGroupRequest): Promise<ApiResponse<Group>> {
    return this.makeRequest<Group>(`/api/groups/${groupData.id}`, {
      method: 'PUT',
      body: JSON.stringify(groupData),
    });
  }

  static async deleteGroup(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/api/groups/${id}`, {
      method: 'DELETE',
    });
  }

  static async joinGroup(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/api/groups/${id}/join`, {
      method: 'POST',
    });
  }

  static async leaveGroup(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/api/groups/${id}/leave`, {
      method: 'POST',
    });
  }

  // Posts CRUD Operations
  static async getGroupPosts(
    groupId: string,
    filters: PostFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<ApiResponse<PostsResponse>> {
    const queryParams = new URLSearchParams();
    
    if (pagination.page) queryParams.append('page', pagination.page.toString());
    if (pagination.limit) queryParams.append('limit', pagination.limit.toString());
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.author) queryParams.append('author', filters.author);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.isPinned !== undefined) queryParams.append('isPinned', filters.isPinned.toString());

    return this.makeRequest<PostsResponse>(`/api/groups/${groupId}/posts?${queryParams.toString()}`);
  }

  static async getPostById(groupId: string, postId: string): Promise<ApiResponse<GroupPost>> {
    return this.makeRequest<GroupPost>(`/api/groups/${groupId}/posts/${postId}`);
  }

  static async createPost(postData: CreatePostRequest): Promise<ApiResponse<GroupPost>> {
    return this.makeRequest<GroupPost>(`/api/groups/${postData.groupId}/posts`, {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  static async updatePost(postData: UpdatePostRequest): Promise<ApiResponse<GroupPost>> {
    return this.makeRequest<GroupPost>(`/api/groups/${postData.groupId}/posts/${postData.id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  static async deletePost(groupId: string, postId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/api/groups/${groupId}/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  static async approvePost(groupId: string, postId: string): Promise<ApiResponse<GroupPost>> {
    return this.makeRequest<GroupPost>(`/api/groups/${groupId}/posts/${postId}/approve`, {
      method: 'POST',
    });
  }

  static async rejectPost(groupId: string, postId: string): Promise<ApiResponse<GroupPost>> {
    return this.makeRequest<GroupPost>(`/api/groups/${groupId}/posts/${postId}/reject`, {
      method: 'POST',
    });
  }

  static async likePost(groupId: string, postId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/api/groups/${groupId}/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  static async unlikePost(groupId: string, postId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/api/groups/${groupId}/posts/${postId}/unlike`, {
      method: 'POST',
    });
  }

  static async pinPost(groupId: string, postId: string): Promise<ApiResponse<GroupPost>> {
    return this.makeRequest<GroupPost>(`/api/groups/${groupId}/posts/${postId}/pin`, {
      method: 'POST',
    });
  }

  static async unpinPost(groupId: string, postId: string): Promise<ApiResponse<GroupPost>> {
    return this.makeRequest<GroupPost>(`/api/groups/${groupId}/posts/${postId}/unpin`, {
      method: 'POST',
    });
  }

  // Members CRUD Operations
  static async getGroupMembers(
    groupId: string,
    pagination: PaginationParams = { page: 1, limit: 20 }
  ): Promise<ApiResponse<MembersResponse>> {
    const queryParams = new URLSearchParams();
    
    if (pagination.page) queryParams.append('page', pagination.page.toString());
    if (pagination.limit) queryParams.append('limit', pagination.limit.toString());

    return this.makeRequest<MembersResponse>(`/api/groups/${groupId}/members?${queryParams.toString()}`);
  }

  static async addMember(groupId: string, userId: string, role: 'member' | 'moderator' = 'member'): Promise<ApiResponse<GroupMember>> {
    return this.makeRequest<GroupMember>(`/api/groups/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    });
  }

  static async removeMember(groupId: string, userId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/api/groups/${groupId}/members/${userId}`, {
      method: 'DELETE',
    });
  }

  static async updateMemberRole(groupId: string, userId: string, role: 'admin' | 'moderator' | 'member'): Promise<ApiResponse<GroupMember>> {
    return this.makeRequest<GroupMember>(`/api/groups/${groupId}/members/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  // Utility functions for offline/mock data
  static async getGroupsWithFallback(
    filters: GroupFilters = {},
    pagination: PaginationParams = { page: 1, limit: 12 }
  ): Promise<GroupsResponse> {
    try {
      const response = await this.getAllGroups(filters, pagination);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
    }

    // Return mock data as fallback
    const { getMockGroups } = await import('../data/mockGroups');
    return getMockGroups(filters, pagination);
  }

  static async getGroupWithFallback(id: string): Promise<Group | null> {
    try {
      const response = await this.getGroupById(id);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
    }

    // Return mock data as fallback
    const { getMockGroupById } = await import('../data/mockGroups');
    return getMockGroupById(id);
  }

  static async getPostsWithFallback(
    groupId: string,
    filters: PostFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<PostsResponse> {
    try {
      const response = await this.getGroupPosts(groupId, filters, pagination);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
    }

    // Return mock data as fallback
    const { getMockPosts } = await import('../data/mockGroups');
    return getMockPosts(groupId, filters, pagination);
  }

  static async getMembersWithFallback(
    groupId: string,
    pagination: PaginationParams = { page: 1, limit: 20 }
  ): Promise<MembersResponse> {
    try {
      const response = await this.getGroupMembers(groupId, pagination);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
    }

    // Return mock data as fallback
    const { getMockMembers } = await import('../data/mockGroups');
    return getMockMembers(groupId, pagination);
  }
}

export default GroupsAPI;