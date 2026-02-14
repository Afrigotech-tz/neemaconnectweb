import api from './api';
import { ApiResponse } from './authService';
import { AxiosError } from 'axios';
import { ProcessPaymentData, PaymentResponse, PaymentMethod } from '@/types/paymentTypes';

interface ErrorResponse {
  message: string;
}

export const paymentService = {
  async processPayment(data: ProcessPaymentData): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await api.post('/payments/process', data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to process payment',
      };
    }
  },

  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    try {
      const response = await api.get('/payments/methods');
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch payment methods',
      };
    }
  },
};
