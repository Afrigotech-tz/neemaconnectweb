import api from './api';
import {
  Blog,
  CreateBlogData,
  UpdateBlogData,
  BlogFilters,
} from '@/types/blogTypes';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

const buildFormData = (data: CreateBlogData | UpdateBlogData): FormData => {
  const formData = new FormData();
  if (data.image instanceof File) {
    formData.append('image', data.image);
  }
  if (data.title !== undefined) formData.append('title', data.title);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.date !== undefined) formData.append('date', data.date);
  if (data.location !== undefined) formData.append('location', data.location);
  if (data.is_active !== undefined) formData.append('is_active', String(data.is_active));
  return formData;
};

export const blogService = {
  /**
   * Get all blogs with optional filters
   */
  async getBlogs(filters?: BlogFilters): Promise<ApiResponse<Blog[]>> {
    try {
      const response = await api.get('/blogs', { params: filters });
      return {
        success: true,
        message: 'Blogs fetched successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch blogs',
      };
    }
  },

  /**
   * Get a single blog by ID
   */
  async getBlog(id: number): Promise<ApiResponse<Blog>> {
    try {
      const response = await api.get(`/blogs/${id}`);
      return {
        success: true,
        message: 'Blog fetched successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch blog',
      };
    }
  },

  /**
   * Create a new blog (multipart/form-data)
   */
  async createBlog(data: CreateBlogData): Promise<ApiResponse<Blog>> {
    try {
      const formData = buildFormData(data);
      const response = await api.post('/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return {
        success: true,
        message: 'Blog created successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to create blog',
      };
    }
  },

  /**
   * Update an existing blog (multipart/form-data)
   */
  async updateBlog(id: number, data: UpdateBlogData): Promise<ApiResponse<Blog>> {
    try {
      const formData = buildFormData(data);
      const response = await api.post(`/blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return {
        success: true,
        message: 'Blog updated successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to update blog',
      };
    }
  },

  /**
   * Delete a blog
   */
  async deleteBlog(id: number): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/blogs/${id}`);
      return {
        success: true,
        message: 'Blog deleted successfully',
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to delete blog',
      };
    }
  },

  /**
   * Get active blogs only (for public display)
   */
  async getActiveBlogs(filters?: BlogFilters): Promise<ApiResponse<Blog[]>> {
    try {
      const response = await api.get('/blogs', {
        params: { ...filters, is_active: true },
      });
      return {
        success: true,
        message: 'Active blogs fetched successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch active blogs',
      };
    }
  },
};
