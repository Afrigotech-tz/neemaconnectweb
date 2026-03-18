import api from '../api';
import { ApiResponse } from '../authService/authService';
import { AxiosError } from 'axios';
import {
  CreateDonationCategoryData,
  CreateDonationData,
  Donation,
  DonationCategory,
  DonationListResponse,
  DonationStatistics,
  UpdateDonationCategoryData,
  UpdateDonationStatusData,
} from '../types/donationTypes';

interface ErrorResponse {
  message?: string;
}

interface WrappedApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

const unwrapData = <T>(payload: WrappedApiResponse<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in (payload as WrappedApiResponse<T>)) {
    return ((payload as WrappedApiResponse<T>).data ?? payload) as T;
  }
  return payload as T;
};

const unwrapMessage = (payload: unknown, fallback: string): string => {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as WrappedApiResponse<unknown>).message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }
  return fallback;
};

const buildErrorResponse = (error: unknown, fallback: string): ApiResponse => {
  const axiosError = error as AxiosError<ErrorResponse>;
  return {
    success: false,
    message: axiosError.response?.data?.message || axiosError.message || fallback,
  };
};

const publicConfig = {
  headers: {
    'X-Skip-Auth': 'true',
  },
};

export const donationService = {
  async getDonations(page?: number): Promise<ApiResponse<DonationListResponse | Donation[]>> {
    try {
      const response = await api.get('/donations', { params: { page } });
      const payload = response.data as WrappedApiResponse<DonationListResponse | Donation[]>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<DonationListResponse | Donation[]>(payload),
        message: unwrapMessage(payload, 'Donations fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch donations');
    }
  },

  async getDonation(donationId: number): Promise<ApiResponse<Donation>> {
    try {
      const response = await api.get(`/donations/${donationId}`);
      const payload = response.data as WrappedApiResponse<Donation>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<Donation>(payload),
        message: unwrapMessage(payload, 'Donation fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch donation');
    }
  },

  async createDonation(data: CreateDonationData): Promise<ApiResponse<Donation>> {
    try {
      const response = await api.post('/donations', data, publicConfig);
      const payload = response.data as WrappedApiResponse<Donation>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<Donation>(payload),
        message: unwrapMessage(payload, 'Donation created successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to create donation');
    }
  },

  async updateDonationStatus(donationId: number, data: UpdateDonationStatusData): Promise<ApiResponse<Donation>> {
    try {
      const response = await api.put(`/donations/${donationId}`, data);
      const payload = response.data as WrappedApiResponse<Donation>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<Donation>(payload),
        message: unwrapMessage(payload, 'Donation updated successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to update donation');
    }
  },

  async deleteDonation(donationId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/donations/${donationId}`);
      const payload = response.data as WrappedApiResponse<void>;
      return {
        success: payload?.success ?? true,
        message: unwrapMessage(payload, 'Donation deleted successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to delete donation');
    }
  },

  async getCategories(): Promise<ApiResponse<DonationCategory[]>> {
    try {
      const response = await api.get('/donations/categories', publicConfig);
      const payload = response.data as WrappedApiResponse<DonationCategory[]>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<DonationCategory[]>(payload),
        message: unwrapMessage(payload, 'Donation categories fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch donation categories');
    }
  },

  async getCategory(categoryId: number): Promise<ApiResponse<DonationCategory>> {
    try {
      const response = await api.get(`/donations/categories/${categoryId}`);
      const payload = response.data as WrappedApiResponse<DonationCategory>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<DonationCategory>(payload),
        message: unwrapMessage(payload, 'Donation category fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch donation category');
    }
  },

  async createCategory(data: CreateDonationCategoryData): Promise<ApiResponse<DonationCategory>> {
    try {
      const response = await api.post('/donations/categories', data);
      const payload = response.data as WrappedApiResponse<DonationCategory>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<DonationCategory>(payload),
        message: unwrapMessage(payload, 'Donation category created successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to create donation category');
    }
  },

  async updateCategory(categoryId: number, data: UpdateDonationCategoryData): Promise<ApiResponse<DonationCategory>> {
    try {
      const response = await api.put(`/donations/categories/${categoryId}`, data);
      const payload = response.data as WrappedApiResponse<DonationCategory>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<DonationCategory>(payload),
        message: unwrapMessage(payload, 'Donation category updated successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to update donation category');
    }
  },

  async deleteCategory(categoryId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/donations/categories/${categoryId}`);
      const payload = response.data as WrappedApiResponse<void>;
      return {
        success: payload?.success ?? true,
        message: unwrapMessage(payload, 'Donation category deleted successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to delete donation category');
    }
  },

  async getStatistics(): Promise<ApiResponse<DonationStatistics>> {
    try {
      const response = await api.get('/donations/statistics');
      const payload = response.data as WrappedApiResponse<DonationStatistics>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<DonationStatistics>(payload),
        message: unwrapMessage(payload, 'Donation statistics fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch donation statistics');
    }
  },

  async getDonationsByUser(userId: number | string, page?: number): Promise<ApiResponse<DonationListResponse | Donation[]>> {
    try {
      const response = await api.get(`/donations/user/${userId}`, { params: { page } });
      const payload = response.data as WrappedApiResponse<DonationListResponse | Donation[]>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<DonationListResponse | Donation[]>(payload),
        message: unwrapMessage(payload, 'User donations fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch user donations');
    }
  },

  async getDonationsByCampaign(campaignId: number | string): Promise<ApiResponse<DonationListResponse | Donation[]>> {
    try {
      const response = await api.get(`/donations/campaign/${campaignId}`);
      const payload = response.data as WrappedApiResponse<DonationListResponse | Donation[]>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<DonationListResponse | Donation[]>(payload),
        message: unwrapMessage(payload, 'Campaign donations fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch campaign donations');
    }
  },
};
