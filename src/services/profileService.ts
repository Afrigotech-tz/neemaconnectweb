import { profileAPI } from './api';
import { AxiosError } from 'axios';
import { ApiResponse, Profile } from './authService';

interface ErrorResponse {
  message: string;
}

export interface ProfilePictureResponse {
  profile_picture_url: string;
}

export interface LocationUpdateData {
  address: string;
  postal_code: string;
  location_public: boolean;
}

export interface LocationResponse {
  location: {
    address: string;
    location_public: boolean;
  };
}

export const profileService = {
  async getProfile(): Promise<ApiResponse<{ user: any; profile: Profile }>> {
    try {
      const response = await profileAPI.getProfile();
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch profile'
      };
    }
  },

  async updateProfile(data: Partial<Profile>): Promise<ApiResponse<{ user: any; profile: Profile }>> {
    try {
      const response = await profileAPI.updateProfile(data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to update profile'
      };
    }
  },

  async uploadProfilePicture(file: File): Promise<ApiResponse<ProfilePictureResponse>> {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      
      const response = await profileAPI.uploadProfilePicture(formData);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to upload profile picture'
      };
    }
  },

  async updateLocation(data: LocationUpdateData): Promise<ApiResponse<LocationResponse>> {
    try {
      const response = await profileAPI.updateLocation(data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to update location'
      };
    }
  },

  async deleteProfilePicture(): Promise<ApiResponse> {
    try {
      const response = await profileAPI.deleteProfilePicture();
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to delete profile picture'
      };
    }
  }
};
