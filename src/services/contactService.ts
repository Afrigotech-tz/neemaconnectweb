import api from './api';
import {
  ContactInfo,
  CreateContactInfoData,
  UpdateContactInfoData,
  ContactSubmission,
  CreateContactSubmissionData,
  ContactInfoResponse,
  ContactSubmissionsResponse,
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
   * Submit a contact form (for public users)
   * Note: This endpoint might be different in your API
   * Adjust the endpoint based on your backend implementation
   */
  async submitContactForm(data: CreateContactSubmissionData): Promise<ApiResponse<ContactSubmission>> {
    try {
      const response = await api.post('/contact-submissions', data);
      return {
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon!',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to submit contact form',
      };
    }
  },

  /**
   * Get all contact submissions (for admin)
   * Note: This endpoint might need to be added to your API
   */
  async getContactSubmissions(): Promise<ApiResponse<ContactSubmission[]>> {
    try {
      const response = await api.get('/contact-submissions');
      return {
        success: true,
        message: 'Contact submissions fetched successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch contact submissions',
      };
    }
  },

  /**
   * Update contact submission status
   * Note: This endpoint might need to be added to your API
   */
  async updateSubmissionStatus(
    id: number,
    status: 'new' | 'read' | 'replied' | 'archived'
  ): Promise<ApiResponse<ContactSubmission>> {
    try {
      const response = await api.patch(`/contact-submissions/${id}`, { status });
      return {
        success: true,
        message: 'Submission status updated successfully',
        data: response.data.data || response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to update submission status',
      };
    }
  },

  /**
   * Delete a contact submission
   * Note: This endpoint might need to be added to your API
   */
  async deleteSubmission(id: number): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/contact-submissions/${id}`);
      return {
        success: true,
        message: 'Submission deleted successfully',
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to delete submission',
      };
    }
  },
};
