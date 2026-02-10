import api from './api';
import {
  HomeSlider,
  CreateSliderData,
  UpdateSliderData,
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

const buildFormData = (data: CreateSliderData | UpdateSliderData): FormData => {
  const formData = new FormData();
  if (data.image instanceof File) {
    formData.append('image', data.image);
  }
  if (data.title !== undefined) formData.append('title', data.title);
  if (data.head !== undefined) formData.append('head', data.head);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.is_active !== undefined) formData.append('is_active', String(data.is_active));
  if (data.sort_order !== undefined) formData.append('sort_order', String(data.sort_order));
  return formData;
};

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
   * Create a new slider (multipart/form-data)
   */
  async createSlider(data: CreateSliderData): Promise<ApiResponse<HomeSlider>> {
    try {
      const formData = buildFormData(data);
      const response = await api.post('/home-sliders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
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
   * Update an existing slider (multipart/form-data)
   */
  async updateSlider(id: number, data: UpdateSliderData): Promise<ApiResponse<HomeSlider>> {
    try {
      const formData = buildFormData(data);
      const response = await api.post(`/home-sliders/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
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
        params: { is_active: true },
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
   * Toggle slider active status
   */
  async toggleSliderStatus(id: number, isActive: boolean): Promise<ApiResponse<HomeSlider>> {
    try {
      const formData = new FormData();
      formData.append('is_active', String(isActive));
      const response = await api.post(`/home-sliders/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
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
