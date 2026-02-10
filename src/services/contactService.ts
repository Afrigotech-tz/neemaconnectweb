import api from './api';
import {
  ContactInfo,
  CreateContactInfoData,
  UpdateContactInfoData,
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
};
