import api from './api';
import { AxiosError } from 'axios';
import { RegisterFormData } from '../lib/validations/auth';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface Profile {
  id: string;
  user_id: string;
  profile_picture: string | null;
  address: string;
  city: string;
  state_province: string;
  postal_code: string;
  bio: string;
  date_of_birth: string | null;
  occupation: string | null;
  location_public: boolean;
  profile_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  dial_code: string;
  created_at: string;
  updated_at: string;
}

import { Role } from '../types/rolePermissionTypes';

export interface User {
  id: string;
  email: string;
  phone_number: string;
  first_name: string;
  surname: string;
  gender: string;
  status: 'active' | 'inactive';
  verification_method: 'mobile' | 'email';
  created_at: string;
  updated_at: string;
  profile?: Profile;
  country?: Country;
  role?: 'admin' | 'user'; // Legacy role field for backward compatibility
  roles?: Role[]; // New roles array for role-based permissions
  permissions?: string[]; // Direct permissions array from API response
}

export interface RegisterResponseData {
  user: User;
  message: string;
}

export interface LoginResponseData {
  user: User;
  token: string;
  message: string;
  permissions?: string[]; // Permissions array from API response
}

export interface OTPResponseData {
  message: string;
}

interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export const authService = {
  async register(data: RegisterFormData): Promise<ApiResponse<RegisterResponseData>> {
    try {
      const response = await api.post('/register', data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      
      // Extract detailed error message
      let errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      
      // If there are field-specific errors, combine them
      if (err.response?.data?.errors) {
        const fieldErrors = Object.entries(err.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('; ');
        errorMessage = `${errorMessage}. Details: ${fieldErrors}`;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  },

  async login(login: string, password: string): Promise<ApiResponse<LoginResponseData>> {
    try {
      const response = await api.post('/login', { login, password });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Login failed. Please try again.'
      };
    }
  },

  async verifyOTP(login: string, otp_code: string): Promise<ApiResponse<LoginResponseData>> {
    try {
      const response = await api.post('/auth/verify-otp', { login, otp_code });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'OTP verification failed. Please try again.'
      };
    }
  },

  async resendOTP(login: string): Promise<ApiResponse<OTPResponseData>> {
    try {
      const response = await api.post('/auth/resend-otp', { login });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to resend OTP. Please try again.'
      };
    }
  },

  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/api/password/forgot', { email });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to send password reset link. Please try again.'
      };
    }
  },

  async resetPassword(email: string, token: string, password: string, password_confirmation: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/api/password/reset', {
        email,
        token,
        password,
        password_confirmation
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to reset password. Please try again.'
      };
    }
  }
};
