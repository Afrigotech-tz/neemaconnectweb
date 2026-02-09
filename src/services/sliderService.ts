import api from './api';
import {
  HomeSlider,
  CreateSliderData,
  UpdateSliderData,
  SliderResponse,
  SlidersResponse,
  SliderFilters,
} from '@/types/sliderTypes';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export const sliderService = {
  /**
   * Get all home sliders with optional filters
   */
  async getSliders(filters?: SliderFilters): Promise<ApiResponse<HomeSlider[]>> {
    try {
      const response = await api.get('/home-sliders', { params: filters });
      return {
        success: true,
        message: 'Sliders fetched successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch sliders',
      };
    }
  },

  /**
   * Get a single slider by ID
   */
  async getSlider(id: number): Promise<ApiResponse<HomeSlider>> {
    try {
      const response = await api.get(`/home-sliders/${id}`);
      return {
        success: true,
        message: 'Slider fetched successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch slider',
      };
    }
  },

  /**
   * Create a new slider
   */
  async createSlider(data: CreateSliderData): Promise<ApiResponse<HomeSlider>> {
    try {
      const response = await api.post('/home-sliders', data);
      return {
        success: true,
        message: 'Slider created successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to create slider',
      };
    }
  },

  /**
   * Update an existing slider
   */
  async updateSlider(id: number, data: UpdateSliderData): Promise<ApiResponse<HomeSlider>> {
    try {
      const response = await api.post(`/home-sliders/${id}`, data);
      return {
        success: true,
        message: 'Slider updated successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to update slider',
      };
    }
  },

  /**
   * Delete a slider
   */
  async deleteSlider(id: number): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/home-sliders/${id}`);
      return {
        success: true,
        message: 'Slider deleted successfully',
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to delete slider',
      };
    }
  },

  /**
   * Get active sliders only (for public display)
   */
  async getActiveSliders(): Promise<ApiResponse<HomeSlider[]>> {
    try {
      const response = await api.get('/home-sliders', {
        params: { is_active: true }
      });
      return {
        success: true,
        message: 'Active sliders fetched successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch active sliders',
      };
    }
  },

  /**
   * Reorder sliders
   * Note: This might need to be implemented based on your API
   */
  async reorderSliders(sliderIds: number[]): Promise<ApiResponse<void>> {
    try {
      await api.post('/home-sliders/reorder', { slider_ids: sliderIds });
      return {
        success: true,
        message: 'Sliders reordered successfully',
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to reorder sliders',
      };
    }
  },

  /**
   * Toggle slider active status
   */
  async toggleSliderStatus(id: number, isActive: boolean): Promise<ApiResponse<HomeSlider>> {
    try {
      const response = await api.post(`/home-sliders/${id}`, { is_active: isActive });
      return {
        success: true,
        message: `Slider ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to toggle slider status',
      };
    }
  },
};
