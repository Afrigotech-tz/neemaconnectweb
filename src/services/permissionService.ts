import api from './api';
import { ApiResponse } from './authService';
import { Permission } from '../types/rolePermissionTypes';

export const permissionService = {
  async getPermissions(): Promise<ApiResponse<Permission[]>> {
    try {
      const response = await api.get('/permissions');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch permissions'
      };
    }
  }
};