import api from './api';
import { ApiResponse } from './authService';
import { AxiosError } from 'axios';
import { Order, CreateOrderData, OrderFilters } from '@/types/orderTypes';
import { PaginatedResponse } from './productService';

interface ErrorResponse {
  message: string;
}

export const orderService = {
  async getOrders(filters?: OrderFilters): Promise<ApiResponse<PaginatedResponse<Order>>> {
    try {
      const response = await api.get('/orders', { params: filters });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch orders',
      };
    }
  },

  async getUserOrders(page?: number): Promise<ApiResponse<PaginatedResponse<Order>>> {
    try {
      const response = await api.get('/orders/user', { params: { page } });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch your orders',
      };
    }
  },

  async getOrder(id: number): Promise<ApiResponse<Order>> {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch order',
      };
    }
  },

  async createOrder(data: CreateOrderData): Promise<ApiResponse<Order>> {
    try {
      const response = await api.post('/orders/process', data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to create order',
      };
    }
  },
};
