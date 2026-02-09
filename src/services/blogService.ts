import api from './api';
import {
  Blog,
  CreateBlogData,
  UpdateBlogData,
  BlogResponse,
  BlogsResponse,
  BlogSearchParams,
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

export const blogService = {
  /**
   * Get all blogs with optional search and filter parameters
   */
  async getBlogs(params?: BlogSearchParams): Promise<ApiResponse<Blog[]>> {
    try {
      const response = await api.get('/blogs', { params });
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
   * Create a new blog
   */
  async createBlog(data: CreateBlogData): Promise<ApiResponse<Blog>> {
    try {
      const response = await api.post('/blogs', data);
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
   * Update an existing blog
   */
  async updateBlog(id: number, data: UpdateBlogData): Promise<ApiResponse<Blog>> {
    try {
      const response = await api.put(`/blogs/${id}`, data);
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
   * Get featured blogs
   */
  async getFeaturedBlogs(): Promise<ApiResponse<Blog[]>> {
    try {
      const response = await api.get('/blogs', { params: { is_featured: true, status: 'published' } });
      return {
        success: true,
        message: 'Featured blogs fetched successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch featured blogs',
      };
    }
  },

  /**
   * Get published blogs only
   */
  async getPublishedBlogs(params?: BlogSearchParams): Promise<ApiResponse<Blog[]>> {
    try {
      const response = await api.get('/blogs', {
        params: { ...params, status: 'published' }
      });
      return {
        success: true,
        message: 'Published blogs fetched successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch published blogs',
      };
    }
  },

  /**
   * Search blogs by title or content
   */
  async searchBlogs(searchTerm: string): Promise<ApiResponse<Blog[]>> {
    try {
      const response = await api.get('/blogs', {
        params: { search: searchTerm }
      });
      return {
        success: true,
        message: 'Blogs searched successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to search blogs',
      };
    }
  },

  /**
   * Get blogs by category
   */
  async getBlogsByCategory(category: string): Promise<ApiResponse<Blog[]>> {
    try {
      const response = await api.get('/blogs', {
        params: { category }
      });
      return {
        success: true,
        message: 'Blogs fetched by category successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch blogs by category',
      };
    }
  },
};
