import api from './api';
import { ApiResponse } from './authService';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

import {
  ProductCategory,
  CreateCategoryData,
  UpdateCategoryData,
  Product,
  CreateProductData,
  UpdateProductData,
  ProductAttribute,
  CreateAttributeData,
  ProductAttributeValue,
  CreateAttributeValueData,
  ProductVariant,
  CreateVariantData,
  UpdateVariantData
} from '@/types/productTypes';

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export const productService = {
  // Get all categories
  async getCategories(): Promise<ApiResponse<ProductCategory[]>> {
    try {
      const response = await api.get('/admin/products/categories');
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch categories'
      };
    }
  },

  // Get category by ID
  async getCategory(id: number): Promise<ApiResponse<ProductCategory>> {
    try {
      const response = await api.get(`/admin/products/categories/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch category'
      };
    }
  },

  // Create new category
  async createCategory(data: CreateCategoryData): Promise<ApiResponse<ProductCategory>> {
    try {
      const response = await api.post('/admin/products/categories', data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to create category'
      };
    }
  },

  // Update category
  async updateCategory(id: number, data: UpdateCategoryData): Promise<ApiResponse<ProductCategory>> {
    try {
      const response = await api.put(`/admin/products/categories/${id}`, data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to update category'
      };
    }
  },

  // Delete category
  async deleteCategory(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/admin/products/categories/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to delete category'
      };
    }
  },

  // ===== PRODUCT FUNCTIONS =====

  // Get all products
  async getProducts(): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      const response = await api.get('/admin/products');
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch products'
      };
    }
  },

  // Get product by ID
  async getProduct(id: number): Promise<ApiResponse<Product>> {
    try {
      const response = await api.get(`/admin/products/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch product'
      };
    }
  },

  // Create new product
  async createProduct(data: CreateProductData | FormData): Promise<ApiResponse<Product>> {
    try {
      // If data is FormData, send as-is (multipart/form-data for images)
      // Otherwise, send as JSON
      const response = await api.post('/admin/products', data, {
        headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to create product'
      };
    }
  },

  // Update product
  async updateProduct(id: number, data: UpdateProductData | FormData): Promise<ApiResponse<Product>> {
    try {
      const response = await api.put(`/admin/products/${id}`, data, {
        headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to update product'
      };
    }
  },

  // Delete product
  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/admin/products/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to delete product'
      };
    }
  },

  // ===== ATTRIBUTE FUNCTIONS =====

  // Get all attributes
  async getAttributes(): Promise<ApiResponse<ProductAttribute[]>> {
    try {
      const response = await api.get('/admin/products/attributes');
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch attributes'
      };
    }
  },

  // Get attribute by ID
  async getAttribute(id: number): Promise<ApiResponse<ProductAttribute>> {
    try {
      const response = await api.get(`/admin/products/attributes/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch attribute'
      };
    }
  },

  // Create new attribute
  async createAttribute(data: CreateAttributeData): Promise<ApiResponse<ProductAttribute>> {
    try {
      const response = await api.post('/admin/products/attributes', data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to create attribute'
      };
    }
  },

  // Update attribute
  async updateAttribute(id: number, data: Partial<CreateAttributeData>): Promise<ApiResponse<ProductAttribute>> {
    try {
      const response = await api.put(`/admin/products/attributes/${id}`, data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to update attribute'
      };
    }
  },

  // Delete attribute
  async deleteAttribute(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/admin/products/attributes/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to delete attribute'
      };
    }
  },

  // ===== ATTRIBUTE VALUE FUNCTIONS =====

  // Get attribute values by attribute ID
  async getAttributeValues(attributeId: number): Promise<ApiResponse<ProductAttributeValue[]>> {
    try {
      const response = await api.get(`/admin/products/attributes/${attributeId}/values`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch attribute values'
      };
    }
  },

  // Create new attribute value
  async createAttributeValue(data: CreateAttributeValueData): Promise<ApiResponse<ProductAttributeValue>> {
    try {
      const response = await api.post('/admin/products/attribute-values', data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to create attribute value'
      };
    }
  },

  // Update attribute value
  async updateAttributeValue(id: number, data: Partial<CreateAttributeValueData>): Promise<ApiResponse<ProductAttributeValue>> {
    try {
      const response = await api.put(`/admin/products/attribute-values/${id}`, data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to update attribute value'
      };
    }
  },

  // Delete attribute value
  async deleteAttributeValue(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/admin/products/attribute-values/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to delete attribute value'
      };
    }
  },

  // ===== VARIANT FUNCTIONS =====

  // Get variants by product ID
  async getVariants(productId: number): Promise<ApiResponse<ProductVariant[]>> {
    try {
      const response = await api.get(`/admin/products/${productId}/variants`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch variants'
      };
    }
  },

  // Get variant by ID
  async getVariant(id: number): Promise<ApiResponse<ProductVariant>> {
    try {
      const response = await api.get(`/admin/products/variants/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch variant'
      };
    }
  },

  // Create new variant
  async createVariant(data: CreateVariantData): Promise<ApiResponse<ProductVariant>> {
    try {
      const response = await api.post('/admin/products/variants', data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to create variant'
      };
    }
  },

  // Update variant
  async updateVariant(id: number, data: UpdateVariantData): Promise<ApiResponse<ProductVariant>> {
    try {
      const response = await api.put(`/admin/products/variants/${id}`, data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to update variant'
      };
    }
  },

  // Delete variant
  async deleteVariant(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/admin/products/variants/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to delete variant'
      };
    }
  }
};
