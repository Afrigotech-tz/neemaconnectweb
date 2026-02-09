import api from './api';
import { ApiResponse } from './authService';
import { Permission, CreatePermissionData, UpdatePermissionData } from '../types/rolePermissionTypes';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export const permissionService = {
  // Get all permissions
  async getPermissions(): Promise<ApiResponse<Permission[]>> {
    try {
      const response = await api.get('/permissions');
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to fetch permissions')
      };
    }
  },

  // Get permission by ID
  async getPermission(id: number): Promise<ApiResponse<Permission>> {
    try {
      const response = await api.get(`/permissions/${id}`);
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to fetch permission')
      };
    }
  },

  // Create new permission
  async createPermission(data: CreatePermissionData): Promise<ApiResponse<Permission>> {
    try {
      const response = await api.post('/permissions', data);
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to create permission')
      };
    }
  },

  // Update permission
  async updatePermission(id: number, data: UpdatePermissionData): Promise<ApiResponse<Permission>> {
    try {
      const response = await api.put(`/permissions/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to update permission')
      };
    }
  },

  // Delete permission
  async deletePermission(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/permissions/${id}`);
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to delete permission')
      };
    }
  }
};