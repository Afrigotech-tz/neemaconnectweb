import api from './api';
import {
  ContactInfo,
  CreateContactInfoData,
  UpdateContactInfoData,
  UserMessage,
  CreateUserMessageData,
  UpdateUserMessageData,
} from '@/types/contactTypes';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export const contactService = {
  /**
   * Get contact information
   */
  async getContactInfo(): Promise<ApiResponse<ContactInfo>> {
    try {
      const response = await api.get('/contact-us');
      return {
        success: true,
        message: 'Contact information fetched successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch contact information',
      };
    }
  },

  /**
   * Create contact information (initial setup)
   */
  async createContactInfo(data: CreateContactInfoData): Promise<ApiResponse<ContactInfo>> {
    try {
      const response = await api.post('/contact-us', data);
      return {
        success: true,
        message: 'Contact information created successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to create contact information',
      };
    }
  },

  /**
   * Update contact information
   */
  async updateContactInfo(data: UpdateContactInfoData): Promise<ApiResponse<ContactInfo>> {
    try {
      const response = await api.post('/contact-us/update', data);
      return {
        success: true,
        message: 'Contact information updated successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to update contact information',
      };
    }
  },

  /**
   * Get all user messages
   */
  async getUserMessages(): Promise<ApiResponse<UserMessage[]>> {
    try {
      const response = await api.get('/user-messages');
      const payload = response.data;
      return {
        success: payload?.success ?? true,
        message: payload?.message || 'User messages fetched successfully',
        data: payload?.data || payload,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch user messages',
      };
    }
  },

  /**
   * Get a single user message
   */
  async getUserMessage(id: number): Promise<ApiResponse<UserMessage>> {
    try {
      const response = await api.get(`/user-messages/${id}`);
      const payload = response.data;
      return {
        success: payload?.success ?? true,
        message: payload?.message || 'User message fetched successfully',
        data: payload?.data || payload,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch user message',
      };
    }
  },

  /**
   * Create a new public user message
   */
  async createUserMessage(data: CreateUserMessageData): Promise<ApiResponse<UserMessage>> {
    try {
      const response = await api.post('/user-messages', data);
      const payload = response.data;
      return {
        success: payload?.success ?? true,
        message: payload?.message || 'Message sent successfully',
        data: payload?.data || payload,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to send message',
      };
    }
  },

  /**
   * Update user message status
   */
  async updateUserMessage(id: number, data: UpdateUserMessageData): Promise<ApiResponse<UserMessage>> {
    try {
      const response = await api.put(`/user-messages/${id}`, data);
      const payload = response.data;
      return {
        success: payload?.success ?? true,
        message: payload?.message || 'Message updated successfully',
        data: payload?.data || payload,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to update message',
      };
    }
  },

  /**
   * Delete user message
   */
  async deleteUserMessage(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/user-messages/${id}`);
      const payload = response.data;
      return {
        success: payload?.success ?? true,
        message: payload?.message || 'Message deleted successfully',
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to delete message',
      };
    }
  },
};
