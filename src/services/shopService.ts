import api from './api';
import { ApiResponse } from './authService';
import { AxiosError } from 'axios';
import { Product, ProductCategory } from '@/types/productTypes';
import { ShopProductFilters } from '@/types/shopTypes';
import { PaginatedResponse } from './productService';

interface ErrorResponse {
  message: string;
}

export const shopService = {
  async getProducts(filters?: ShopProductFilters): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      const response = await api.get('/products', { params: filters });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch products',
      };
    }
  },

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch product',
      };
    }
  },

  async getCategories(): Promise<ApiResponse<ProductCategory[]>> {
    try {
      const response = await api.get('/products/categories');
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch categories',
      };
    }
  },

  async getCategoryProducts(categoryId: number): Promise<ApiResponse<Product[]>> {
    try {
      const response = await api.get(`/products/categories/${categoryId}/products`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch category products',
      };
    }
  },
};
