export { Product, ProductCategory, ProductVariant } from './productTypes';

export interface ShopProductFilters {
  category_id?: number;
  search?: string;
  active?: boolean;
  sort_by?: 'name' | 'price' | 'created_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
