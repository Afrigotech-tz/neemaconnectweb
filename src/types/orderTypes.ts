import { Product } from './productTypes';
import { Address } from './addressTypes';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: Product;
}

export interface Transaction {
  id: number;
  order_id: number;
  amount: number;
  status: string;
  payment_method: string;
  reference: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  address_id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  payment_method_id: number | null;
  notes: string | null;
  items: OrderItem[];
  address?: Address;
  transaction?: Transaction;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  address_id: number;
  items: { product_id: number; quantity: number; product_variant_id?: number }[];
  payment_method_id: number;
  notes?: string;
}

export interface OrderFilters {
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface UpdateOrderStatusData {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
}
