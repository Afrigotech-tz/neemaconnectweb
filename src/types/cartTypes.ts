import { Product, ProductVariant } from './productTypes';

export interface CartItem {
  id: number;
  product_id: number;
  product_variant_id: number | null;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}

export interface AddToCartData {
  product_id: number;
  product_variant_id?: number;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}
