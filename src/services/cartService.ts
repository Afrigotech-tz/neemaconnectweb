import api from './api';
import { ApiResponse } from './authService';
import { AxiosError } from 'axios';
import { Cart, AddToCartData, UpdateCartItemData, CartItem } from '@/types/cartTypes';

interface ErrorResponse {
  message: string;
}

export const cartService = {
  async getCart(): Promise<ApiResponse<Cart>> {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch cart',
      };
    }
  },

  async addToCart(data: AddToCartData): Promise<ApiResponse<CartItem>> {
    try {
      const response = await api.post('/cart', data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to add item to cart',
      };
    }
  },

  async updateCartItem(id: number, data: UpdateCartItemData): Promise<ApiResponse<CartItem>> {
    try {
      const response = await api.put(`/cart/${id}`, data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to update cart item',
      };
    }
  },

  async removeCartItem(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/cart/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to remove cart item',
      };
    }
  },
};
