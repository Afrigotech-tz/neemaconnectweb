import api from './api';
import { ApiResponse } from './authService';
import { AxiosError } from 'axios';
import { Address, CreateAddressData, UpdateAddressData } from '@/types/addressTypes';

interface ErrorResponse {
  message: string;
}

export const addressService = {
  async getAddresses(): Promise<ApiResponse<Address[]>> {
    try {
      const response = await api.get('/addresses');
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch addresses',
      };
    }
  },

  async getAddress(id: number): Promise<ApiResponse<Address>> {
    try {
      const response = await api.get(`/addresses/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch address',
      };
    }
  },

  async createAddress(data: CreateAddressData): Promise<ApiResponse<Address>> {
    try {
      const response = await api.post('/addresses', data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to create address',
      };
    }
  },

  async updateAddress(id: number, data: UpdateAddressData): Promise<ApiResponse<Address>> {
    try {
      const response = await api.put(`/addresses/${id}`, data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to update address',
      };
    }
  },

  async deleteAddress(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/addresses/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to delete address',
      };
    }
  },
};
