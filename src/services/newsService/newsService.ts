import api from '../api';
import { AxiosError } from 'axios';
import { News, PaginatedResponse, ApiResponse, CreateNewsData, UpdateNewsData } from '../types/newsTypes';

interface ErrorResponse {
  message: string;
}

export const newsService = {
  // Get all news with pagination and optional filters
  async getNews(params?: { page?: number; per_page?: number; category?: string }): Promise<ApiResponse<PaginatedResponse<News>>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
      if (params?.category) queryParams.append('category', params.category);

      const queryString = queryParams.toString();
      const url = `/news${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      return {
        success: true,
        message: 'News fetched successfully',
        data: response.data,
      };
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch news',
      };
    }
  },

  // Get featured news
  async getFeaturedNews(params?: { page?: number; per_page?: number }): Promise<ApiResponse<PaginatedResponse<News>>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

      const queryString = queryParams.toString();
      const url = `/news/featured${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      return {
        success: true,
        message: 'Featured news fetched successfully',
        data: response.data,
      };
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch featured news',
      };
    }
  },

  // Get recent news
  async getRecentNews(page?: number): Promise<ApiResponse<PaginatedResponse<News> | News[]>> {
    try {
      const response = await api.get('/news/recent', { params: { page } });
      return {
        success: true,
        message: 'Recent news fetched successfully',
        data: response.data,
      };
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch recent news',
      };
    }
  },

  // Get single news by ID
  async getNewsById(id: number): Promise<ApiResponse<News>> {
    try {
      const response = await api.get(`/news/${id}`);
      return {
        success: true,
        message: 'News fetched successfully',
        data: response.data,
      };
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch news',
      };
    }
  },

  // Create new news
  async createNews(data: CreateNewsData): Promise<ApiResponse<News>> {
    try {
      const response = await api.post('/news', data);
      return {
        success: true,
        message: 'News created successfully',
        data: response.data,
      };
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || error.message || 'Failed to create news',
      };
    }
  },

  // Update news by ID
  async updateNews(id: number, data: UpdateNewsData): Promise<ApiResponse<News>> {
    try {
      const response = await api.put(`/news/${id}`, data);
      return {
        success: true,
        message: 'News updated successfully',
        data: response.data,
      };
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to update news',
      };
    }
  },

  // Delete news by ID
  async deleteNews(id: number): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/news/${id}`);
      return {
        success: true,
        message: 'News deleted successfully',
      };
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to delete news',
      };
    }
  },
};
