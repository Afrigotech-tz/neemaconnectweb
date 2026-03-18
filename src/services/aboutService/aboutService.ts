import api from '../api';
import { AboutUs, CreateAboutUsData, UpdateAboutUsData } from '../types/aboutTypes';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

const buildFormData = (data: CreateAboutUsData | UpdateAboutUsData): FormData => {
  const formData = new FormData();
  if (data.image instanceof File) {
    formData.append('image', data.image);
  }
  if (data.our_story !== undefined) formData.append('our_story', data.our_story);
  if (data.mission !== undefined) formData.append('mission', data.mission);
  if (data.vision !== undefined) formData.append('vision', data.vision);
  return formData;
};

export const aboutService = {
  /**
   * Get about us content
   */
  async getAboutUs(): Promise<ApiResponse<AboutUs>> {
    try {
      const response = await api.get('/about-us');
      return {
        success: true,
        message: 'About us content fetched successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch about us content',
      };
    }
  },

  /**
   * Create about us content (initial setup) - multipart/form-data
   */
  async createAboutUs(data: CreateAboutUsData): Promise<ApiResponse<AboutUs>> {
    try {
      const formData = buildFormData(data);
      const response = await api.post('/about-us', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return {
        success: true,
        message: 'About us content created successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to create about us content',
      };
    }
  },

  /**
   * Update about us content - multipart/form-data
   */
  async updateAboutUs(data: UpdateAboutUsData): Promise<ApiResponse<AboutUs>> {
    try {
      const formData = buildFormData(data);
      const response = await api.post('/about-us/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return {
        success: true,
        message: 'About us content updated successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to update about us content',
      };
    }
  },
};
