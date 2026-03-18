import api from '../api';
import { ApiResponse } from '../authService/authService';
import { AxiosError } from 'axios';
import {
  AssignDepartmentPermissionData,
  AssignDepartmentUserData,
  CreateDepartmentData,
  Department,
  UpdateDepartmentData,
  UpdateDepartmentPermissionsData,
} from '../types/departmentTypes';

interface ErrorResponse {
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

const buildErrorResponse = (error: unknown, fallback: string): ApiResponse => {
  const axiosError = error as AxiosError<ErrorResponse>;
  return {
    success: false,
    message: axiosError.response?.data?.message || axiosError.message || fallback,
  };
};

export const departmentService = {
  async getDepartments(): Promise<ApiResponse<Department[]>> {
    try {
      const response = await api.get('/departments');
      const payload = response.data as WrappedApiResponse<Department[]>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<Department[]>(payload),
        message: unwrapMessage(payload, 'Departments fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch departments');
    }
  },

  async getDepartment(departmentId: number): Promise<ApiResponse<Department>> {
    try {
      const response = await api.get(`/departments/${departmentId}`);
      const payload = response.data as WrappedApiResponse<Department>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<Department>(payload),
        message: unwrapMessage(payload, 'Department fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch department');
    }
  },

  async createDepartment(data: CreateDepartmentData): Promise<ApiResponse<Department>> {
    try {
      const response = await api.post('/departments', data);
      const payload = response.data as WrappedApiResponse<Department>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<Department>(payload),
        message: unwrapMessage(payload, 'Department created successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to create department');
    }
  },

  async updateDepartment(departmentId: number, data: UpdateDepartmentData): Promise<ApiResponse<Department>> {
    try {
      const response = await api.put(`/departments/${departmentId}`, data);
      const payload = response.data as WrappedApiResponse<Department>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<Department>(payload),
        message: unwrapMessage(payload, 'Department updated successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to update department');
    }
  },

  async deleteDepartment(departmentId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/departments/${departmentId}`);
      const payload = response.data as WrappedApiResponse<void>;
      return {
        success: payload?.success ?? true,
        message: unwrapMessage(payload, 'Department deleted successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to delete department');
    }
  },

  async assignPermission(departmentId: number, data: AssignDepartmentPermissionData): Promise<ApiResponse<void>> {
    try {
      const response = await api.post(`/departments/${departmentId}/assign-permission`, data);
      const payload = response.data as WrappedApiResponse<void>;
      return {
        success: payload?.success ?? true,
        message: unwrapMessage(payload, 'Permission assigned successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to assign permission');
    }
  },

  async removePermission(departmentId: number, data: AssignDepartmentPermissionData): Promise<ApiResponse<void>> {
    try {
      const response = await api.post(`/departments/${departmentId}/remove-permission`, data);
      const payload = response.data as WrappedApiResponse<void>;
      return {
        success: payload?.success ?? true,
        message: unwrapMessage(payload, 'Permission removed successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to remove permission');
    }
  },

  async assignUser(departmentId: number, data: AssignDepartmentUserData): Promise<ApiResponse<void>> {
    try {
      const response = await api.post(`/departments/${departmentId}/assign-user`, data);
      const payload = response.data as WrappedApiResponse<void>;
      return {
        success: payload?.success ?? true,
        message: unwrapMessage(payload, 'User assigned successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to assign user');
    }
  },

  async removeUser(departmentId: number, data: AssignDepartmentUserData): Promise<ApiResponse<void>> {
    try {
      const response = await api.post(`/departments/${departmentId}/remove-user`, data);
      const payload = response.data as WrappedApiResponse<void>;
      return {
        success: payload?.success ?? true,
        message: unwrapMessage(payload, 'User removed successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to remove user');
    }
  },

  async updatePermissions(departmentId: number, data: UpdateDepartmentPermissionsData): Promise<ApiResponse<void>> {
    try {
      const response = await api.put(`/departments/${departmentId}/update-permissions`, data);
      const payload = response.data as WrappedApiResponse<void>;
      return {
        success: payload?.success ?? true,
        message: unwrapMessage(payload, 'Department permissions updated successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to update department permissions');
    }
  },
};
