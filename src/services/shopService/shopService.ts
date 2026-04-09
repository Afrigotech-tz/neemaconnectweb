import api from '../api';
import { ApiResponse } from '../authService/authService';
import { AxiosError } from 'axios';
import { normalizeBackendAssetUrl } from '@/lib/apiUrl';
import { Product, ProductCategory } from '../types/productTypes';
import { ShopProductFilters } from '../types/shopTypes';
import { PaginatedResponse } from '../productService/productService';

interface ErrorResponse {
  message: string;
}

const normalizeCategory = (category: ProductCategory): ProductCategory => ({
  ...category,
  image_url: normalizeBackendAssetUrl(category.image_url),
  children: Array.isArray(category.children)
    ? category.children.map(normalizeCategory)
    : category.children,
});

const normalizeProduct = (product: Product): Product => ({
  ...product,
  image_url: normalizeBackendAssetUrl(product.image_url),
  images: Array.isArray(product.images)
    ? product.images
        .map((image) => normalizeBackendAssetUrl(image))
        .filter((image): image is string => Boolean(image))
    : product.images,
  category: product.category ? normalizeCategory(product.category) : product.category,
});

export const shopService = {
  async getProducts(filters?: ShopProductFilters): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      const response = await api.get('/products', { params: filters });
      return {
        ...response.data,
        data: response.data.data
          ? {
              ...response.data.data,
              data: Array.isArray(response.data.data.data)
                ? response.data.data.data.map(normalizeProduct)
                : [],
            }
          : response.data.data,
      };
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
      return {
        ...response.data,
        data: response.data.data ? normalizeProduct(response.data.data) : response.data.data,
      };
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
      return {
        ...response.data,
        data: Array.isArray(response.data.data)
          ? response.data.data.map(normalizeCategory)
          : response.data.data,
      };
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
      return {
        ...response.data,
        data: Array.isArray(response.data.data)
          ? response.data.data.map(normalizeProduct)
          : response.data.data,
      };
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch category products',
      };
    }
  },
};
