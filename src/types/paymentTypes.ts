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

export interface PaymentOrderListResponse {
  data: Order[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

export interface UpdatePaymentOrderStatusData {
  status: string;
}

export interface ProcessTicketPaymentData {
  order_id: number;
  payment_method_id?: number;
  notes?: string;
}

export interface ConfirmTicketPaymentData {
  payment_ref?: string;
}
