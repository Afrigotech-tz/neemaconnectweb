import { ApiResponse, User } from './authService';
import { Role } from '../types/rolePermissionTypes';
import api from './api';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export interface CreateUserData {
  first_name: string;
  surname: string;
  email: string;
  phone_number?: string;
  password: string;
}

export interface UpdateUserData {
  first_name?: string;
  surname?: string;
  email?: string;
  phone_number?: string;
}

export interface UserListResponse {
  current_page: number;
  data: User[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface UserWithRoles extends User {
  roles: Role[];
  permissions: string[];
}

export interface AssignRoleData {
  role_id: number;
}

export interface RemoveRoleData {
  role_id: number;
}

export interface UserSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
}

export const userService = {
  // GET /api/users - Get list of users
  async getAllUsers(params: UserSearchParams = {}): Promise<ApiResponse<UserListResponse>> {
    try {
      const response = await api.get('users', { params });
      return {
        success: true,
        data: response.data.data, // The pagination object from the API response
        message: 'Users fetched successfully'
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || apiError.message || 'Failed to fetch users',
      };
    }
  },

  // POST /api/users - Create a new user
  async createUser(data: CreateUserData): Promise<ApiResponse<User>> {
    try {
      const response = await api.post('users', data);
      return {
        success: true,
        data: response.data,
        message: 'User created successfully'
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || apiError.message || 'Failed to create user',
      };
    }
  },

  // GET /api/users/{id} - Get user details
  async getUserById(userId: string): Promise<ApiResponse<UserWithRoles>> {
    try {
      const response = await api.get(`users/${userId}`);
      return {
        success: true,
        data: response.data,
        message: 'User details fetched successfully'
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || apiError.message || 'Failed to fetch user details',
      };
    }
  },

  // PUT /api/users/{id} - Update user details
  async updateUser(userId: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    try {
      const response = await api.put(`users/${userId}`, data);
      return {
        success: true,
        data: response.data,
        message: 'User updated successfully'
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || apiError.message || 'Failed to update user',
      };
    }
  },

  // DELETE /api/users/{id} - Delete a user
  async deleteUser(userId: string): Promise<ApiResponse> {
    try {
      await api.delete(`users/${userId}`);
      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || apiError.message || 'Failed to delete user',
      };
    }
  },

  // GET /api/users/search - Search users
  async searchUsers(params: UserSearchParams): Promise<ApiResponse<UserListResponse>> {
    try {
      const response = await api.get('users/search', { params });
      return {
        success: true,
        data: response.data,
        message: 'Users searched successfully'
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || apiError.message || 'Failed to search users',
      };
    }
  },

  // GET /api/users/{user}/roles - Get user roles
  async getUserRoles(userId: string): Promise<ApiResponse<Role[]>> {
    try {
      const response = await api.get(`users/${userId}/roles`);
      return {
        success: true,
        data: response.data,
        message: 'User roles fetched successfully'
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || apiError.message || 'Failed to fetch user roles',
      };
    }
  },

  // POST /api/users/{user}/roles - Assign role to user
  async assignRoleToUser(userId: string, data: AssignRoleData): Promise<ApiResponse<UserWithRoles>> {
    try {
      const response = await api.post(`users/${userId}/roles`, data);
      return {
        success: true,
        data: response.data,
        message: 'Role assigned to user successfully'
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || apiError.message || 'Failed to assign role to user',
      };
    }
  },

  // DELETE /api/users/{user}/roles/{role} - Remove role from user
  async removeRoleFromUser(userId: string, roleId: number): Promise<ApiResponse<UserWithRoles>> {
    try {
      const response = await api.delete(`users/${userId}/roles/${roleId}`);
      return {
        success: true,
        data: response.data,
        message: 'Role removed from user successfully'
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || apiError.message || 'Failed to remove role from user',
      };
    }
  },

  // Legacy methods for backward compatibility
  async suspendUser(userId: string, suspend: boolean = true): Promise<ApiResponse> {
    try {
      // Update user status - you may need to add status field to UpdateUserData interface
      const response = await this.updateUser(userId, { 
        // Add proper typing when status field is available
      } as UpdateUserData);
      return response;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || apiError.message || 'Failed to update user status',
      };
    }
  },

  async updateUserRole(_userId: string, _role: string): Promise<ApiResponse> {
    // This would need to be implemented based on your role assignment logic
    return {
      success: false,
      message: 'Method not implemented. Use assignRoleToUser/removeRoleFromUser instead.',
    };
  },

  async getUserPermissions(_userId: string): Promise<ApiResponse<string[]>> {
    // This would need to be implemented if you have a specific permissions endpoint
    return {
      success: false,
      message: 'Method not implemented. Get permissions through getUserRoles.',
    };
  },
};
