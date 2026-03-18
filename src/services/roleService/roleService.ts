import api from "../api";
import { ApiResponse } from "../authService/authService";
import {
  Permission,
  Role,
  CreateRoleData,
  UpdateRoleData,
  RolePermissionsData,
} from "../types/rolePermissionTypes";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export const roleService = {
  // Get all roles
  async getRoles(): Promise<ApiResponse<Role[]>> {
    try {
      const response = await api.get("/roles");
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, "Failed to fetch roles"),
      };
    }
  },

  // Get role by ID
  async getRole(id: number): Promise<ApiResponse<Role>> {
    try {
      const response = await api.get(`/roles/${id}`);
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, "Failed to fetch role"),
      };
    }
  },

  // Create new role
  async createRole(data: CreateRoleData): Promise<ApiResponse<Role>> {
    try {
      const response = await api.post("/roles", data);
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, "Failed to create role"),
      };
    }
  },

  // Update role
  async updateRole(
    id: number,
    data: UpdateRoleData
  ): Promise<ApiResponse<Role>> {
    try {
      const response = await api.put(`/roles/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, "Failed to update role"),
      };
    }
  },

  // Delete role
  async deleteRole(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/roles/${id}`);
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, "Failed to delete role"),
      };
    }
  },

  // Get all permissions
  async getPermissions(): Promise<ApiResponse<Permission[]>> {
    try {
      const response = await api.get("/permissions");
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, "Failed to fetch permissions"),
      };
    }
  },

  // Add permissions to role
  async addPermissionsToRole(
    roleId: number,
    data: RolePermissionsData
  ): Promise<ApiResponse<Role>> {
    try {
      const response = await api.post(`/roles/${roleId}/permissions`, data);
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, "Failed to add permissions to role"),
      };
    }
  },

  // Remove permissions from role
  async removePermissionsFromRole(
    roleId: number,
    data: RolePermissionsData
  ): Promise<ApiResponse<Role>> {
    try {
      const response = await api.delete(`/roles/${roleId}/permissions`, {
        data,
      });
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, "Failed to remove permissions from role"),
      };
    }
  },
};

