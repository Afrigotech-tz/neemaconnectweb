import { Order, Transaction } from './orderTypes';

export interface PaymentMethod {
  id: number;
  name: string;
  type: string;
  is_active: boolean;
}

export interface ProcessPaymentData {
  address_id: number;
  payment_method_id: number;
  notes?: string;
}

export interface PaymentResponse {
  order: Order;
  transaction: Transaction;
}
