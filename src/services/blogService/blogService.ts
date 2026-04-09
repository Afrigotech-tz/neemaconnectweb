import api from '../api';
import { buildStorageAssetUrl } from '@/lib/apiUrl';
import {
  Blog,
  CreateBlogData,
  UpdateBlogData,
  BlogFilters,
} from '../types/blogTypes';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

const normalizeBlog = (payload: unknown): Blog => {
  const blog = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>;

  return {
    id: Number(blog.id || 0),
    image: buildStorageAssetUrl('blogs', blog.image ?? blog.image_url ?? blog.image_path) || '',
    title: typeof blog.title === 'string' ? blog.title : '',
    description: typeof blog.description === 'string' ? blog.description : '',
    date: typeof blog.date === 'string' ? blog.date : '',
    location: typeof blog.location === 'string' ? blog.location : '',
    is_active: Boolean(blog.is_active),
    created_at: typeof blog.created_at === 'string' ? blog.created_at : '',
    updated_at: typeof blog.updated_at === 'string' ? blog.updated_at : '',
  };
};

const normalizeBlogList = (payload: unknown): Blog[] => {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map(normalizeBlog);
};

const buildFormData = (data: CreateBlogData | UpdateBlogData): FormData => {
  const formData = new FormData();
  if (data.image instanceof File) {
    formData.append('image', data.image);
  }
  if (data.title !== undefined) formData.append('title', data.title);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.date !== undefined) formData.append('date', data.date);
  if (data.location !== undefined) formData.append('location', data.location);
  // Convert boolean to numeric string to satisfy backend boolean validation
  if (data.is_active !== undefined) {
    formData.append('is_active', data.is_active ? '1' : '0');
  }
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
        data: normalizeBlogList(response.data.data || response.data),
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
        data: normalizeBlog(response.data.data || response.data),
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
      // axios will automatically set the correct multipart boundary when a FormData
      // instance is passed. Explicitly setting Content-Type can strip the boundary
      // and cause the request to be rejected by the server.
      const response = await api.post('/blogs', formData);
      return {
        success: true,
        message: 'Blog created successfully',
        data: normalizeBlog(response.data.data || response.data),
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
      // API documentation expects a PUT request for updates.  Using POST previously
      // was causing 404/405 responses on the backend.
      const response = await api.post(`/blogs/${id}`, formData);
      return {
        success: true,
        message: 'Blog updated successfully',
        data: normalizeBlog(response.data.data || response.data),
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
        data: normalizeBlogList(response.data.data || response.data),
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
