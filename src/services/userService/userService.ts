import { ApiResponse, User } from '../authService/authService';
import { Role } from '../types/rolePermissionTypes';
import api from '../api';
import { roleService } from '../roleService/roleService';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface WrappedApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

const unwrapData = <T>(payload: WrappedApiResponse<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in (payload as WrappedApiResponse<T>)) {
    return ((payload as WrappedApiResponse<T>).data ?? payload) as T;
  }
  return payload as T;
};

const unwrapMessage = (payload: unknown, fallback: string): string => {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as WrappedApiResponse<unknown>).message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }
  return fallback;
};

export interface CreateUserData {
  first_name: string;
  surname: string;
  email: string;
  phone_number: string;
  gender: string;
  password: string;
  country_id: number;
}

export interface UpdateUserData {
  first_name?: string;
  surname?: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  password?: string;
  country_id?: number;
  status?: 'active' | 'inactive';
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
      const payload = response.data as WrappedApiResponse<UserListResponse>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<UserListResponse>(payload), // The pagination object from the API response
        message: unwrapMessage(payload, 'Users fetched successfully'),
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
      const payload = response.data as WrappedApiResponse<User>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<User>(payload),
        message: unwrapMessage(payload, 'User created successfully'),
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
      const payload = response.data as WrappedApiResponse<UserWithRoles>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<UserWithRoles>(payload),
        message: unwrapMessage(payload, 'User details fetched successfully'),
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
      const payload = response.data as WrappedApiResponse<User>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<User>(payload),
        message: unwrapMessage(payload, 'User updated successfully'),
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
      const response = await api.delete(`users/${userId}`);
      const payload = response.data as WrappedApiResponse<unknown>;
      return {
        success: payload?.success ?? true,
        message: unwrapMessage(payload, 'User deleted successfully'),
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
      const payload = response.data as WrappedApiResponse<UserListResponse>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<UserListResponse>(payload),
        message: unwrapMessage(payload, 'Users searched successfully'),
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
      const payload = response.data as WrappedApiResponse<Role[]>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<Role[]>(payload),
        message: unwrapMessage(payload, 'User roles fetched successfully'),
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
      const payload = response.data as WrappedApiResponse<UserWithRoles>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<UserWithRoles>(payload),
        message: unwrapMessage(payload, 'Role assigned to user successfully'),
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
      const payload = response.data as WrappedApiResponse<UserWithRoles>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<UserWithRoles>(payload),
        message: unwrapMessage(payload, 'Role removed from user successfully'),
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
      const response = await api.put(`users/${userId}`, {
        status: suspend ? 'inactive' : 'active',
      });

      return {
        success: true,
        data: response.data?.data || response.data,
        message: `User ${suspend ? 'suspended' : 'activated'} successfully`,
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message:
          apiError.response?.data?.message ||
          apiError.message ||
          `Failed to ${suspend ? 'suspend' : 'activate'} user`,
      };
    }
  },

  async updateUserRole(userId: string, role: string): Promise<ApiResponse<UserWithRoles>> {
    try {
      const rolesResponse = await roleService.getRoles();
      if (!rolesResponse.success || !rolesResponse.data) {
        return {
          success: false,
          message: rolesResponse.message || 'Failed to fetch roles',
        };
      }

      const parsedRoleId = Number.parseInt(role, 10);
      const targetRole = Number.isNaN(parsedRoleId)
        ? rolesResponse.data.find(
            (item) =>
              item.name.toLowerCase() === role.toLowerCase() ||
              item.display_name.toLowerCase() === role.toLowerCase()
          )
        : rolesResponse.data.find((item) => item.id === parsedRoleId);

      if (!targetRole) {
        return {
          success: false,
          message: `Role "${role}" was not found`,
        };
      }

      const currentRolesResponse = await this.getUserRoles(userId);
      if (!currentRolesResponse.success) {
        return {
          success: false,
          message: currentRolesResponse.message || 'Failed to fetch current user roles',
        };
      }

      const currentRoles = currentRolesResponse.data || [];
      const rolesToRemove = currentRoles.filter((item) => item.id !== targetRole.id);

      if (rolesToRemove.length > 0) {
        await Promise.all(
          rolesToRemove.map((item) => this.removeRoleFromUser(userId, item.id))
        );
      }

      const alreadyHasTargetRole = currentRoles.some((item) => item.id === targetRole.id);
      if (!alreadyHasTargetRole) {
        const assignResponse = await this.assignRoleToUser(userId, { role_id: targetRole.id });
        if (!assignResponse.success) {
          return {
            success: false,
            message: assignResponse.message || 'Failed to update user role',
          };
        }
      }

      const updatedUserResponse = await this.getUserById(userId);
      if (updatedUserResponse.success && updatedUserResponse.data) {
        return {
          success: true,
          data: updatedUserResponse.data,
          message: 'User role updated successfully',
        };
      }

      return {
        success: true,
        message: 'User role updated successfully',
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || apiError.message || 'Failed to update user role',
      };
    }
  },

  async getUserPermissions(userId: string): Promise<ApiResponse<string[]>> {
    try {
      const userResponse = await this.getUserById(userId);
      if (!userResponse.success || !userResponse.data) {
        return {
          success: false,
          message: userResponse.message || 'Failed to fetch user permissions',
        };
      }

      const directPermissions = (userResponse.data.permissions || []).filter(Boolean);
      const rolePermissions =
        userResponse.data.roles?.flatMap((role) =>
          (role.permissions || []).map((permission) => permission.name)
        ) || [];

      const mergedPermissions = Array.from(
        new Set([...directPermissions, ...rolePermissions])
      );

      return {
        success: true,
        data: mergedPermissions,
        message: 'User permissions fetched successfully',
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || apiError.message || 'Failed to fetch user permissions',
      };
    }
  },
};
