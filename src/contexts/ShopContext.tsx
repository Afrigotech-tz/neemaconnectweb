import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Product, ProductCategory } from '@/types/productTypes';
import { ShopProductFilters } from '@/types/shopTypes';
import { shopService } from '@/services/shopService';
import { PaginatedResponse } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

interface ShopContextType {
  products: Product[];
  categories: ProductCategory[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: Omit<PaginatedResponse<Product>, 'data'> | null;
  filters: ShopProductFilters;
  fetchProducts: (filters?: ShopProductFilters) => Promise<void>;
  fetchProduct: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchCategoryProducts: (categoryId: number) => Promise<void>;
  setFilters: (filters: ShopProductFilters) => void;
  setSelectedProduct: (product: Product | null) => void;
  clearError: () => void;
}

export const ShopContext = createContext<ShopContextType | undefined>(undefined);

interface ShopProviderProps {
  children: ReactNode;
}

export const ShopProvider: React.FC<ShopProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<Product>, 'data'> | null>(null);
  const [filters, setFiltersState] = useState<ShopProductFilters>({});
  const { toast } = useToast();

  const clearError = useCallback(() => setError(null), []);

  const setFilters = useCallback((newFilters: ShopProductFilters) => {
    setFiltersState(newFilters);
  }, []);

  const fetchProducts = useCallback(async (filterOverrides?: ShopProductFilters) => {
    try {
      setLoading(true);
      setError(null);
      const activeFilters = filterOverrides || filters;
      const response = await shopService.getProducts(activeFilters);

      if (response.success && response.data) {
        const { data, ...paginationData } = response.data;
        setProducts(data);
        setPagination(paginationData);
      } else {
        setError(response.message);
      }
    } catch {
      setError('An unexpected error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchProduct = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await shopService.getProduct(id);

      if (response.success && response.data) {
        setSelectedProduct(response.data);
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
      }
    } catch {
      const errorMessage = 'An unexpected error occurred while fetching product';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      const response = await shopService.getCategories();

      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setError(response.message);
      }
    } catch {
      setError('An unexpected error occurred while fetching categories');
    }
  }, []);

  const fetchCategoryProducts = useCallback(async (categoryId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await shopService.getCategoryProducts(categoryId);

      if (response.success && response.data) {
        setProducts(response.data);
        setPagination(null);
      } else {
        setError(response.message);
      }
    } catch {
      setError('An unexpected error occurred while fetching category products');
    } finally {
      setLoading(false);
    }
  }, []);

  const value: ShopContextType = {
    products,
    categories,
    selectedProduct,
    loading,
    error,
    pagination,
    filters,
    fetchProducts,
    fetchProduct,
    fetchCategories,
    fetchCategoryProducts,
    setFilters,
    setSelectedProduct,
    clearError,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
