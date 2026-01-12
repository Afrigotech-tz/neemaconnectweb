import api, { profileAPI } from './api';
import { AxiosError } from 'axios';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ProfileUpdateData {
  bio?: string;
  city?: string;
  state_province?: string;
  date_of_birth?: string;
  occupation?: string;
  profile_public?: boolean;
}

export interface LocationUpdateData {
  address?: string;
  postal_code?: string;
  location_public?: boolean;
}

export interface ProfilePictureResponse {
  profile_picture_url?: string;
}

export const profileService = {
  async getProfile(userId?: string): Promise<ApiResponse<any>> {
    try {
      const response = await profileAPI.getProfile(userId);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to get profile'
      };
    }
  },

  async updateProfile(userId: string, data: ProfileUpdateData): Promise<ApiResponse<any>> {
    try {
      const response = await profileAPI.updateProfile(userId, data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return {
        success: false,
        message: err.response?.data?.message || (err as Error).message || 'Failed to update profile'
      };
    }
  },

  async uploadProfilePicture(userId: string, file: File): Promise<ApiResponse<ProfilePictureResponse>> {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      const response = await profileAPI.uploadProfilePicture(userId, formData);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return {
        success: false,
        message: err.response?.data?.message || (err as Error).message || 'Failed to upload profile picture'
      };
    }
  },

  async updateLocation(userId: string, data: LocationUpdateData): Promise<ApiResponse<any>> {
    try {
      const response = await profileAPI.updateLocation(userId, data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return {
        success: false,
        message: err.response?.data?.message || (err as Error).message || 'Failed to update location'
      };
    }
  },

  async deleteProfilePicture(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await profileAPI.deleteProfilePicture(userId);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return {
        success: false,
        message: err.response?.data?.message || (err as Error).message || 'Failed to delete profile picture'
      };
    }
  }
};
