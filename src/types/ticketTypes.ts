export interface TicketType {
  id: number;
  event_id: number;
  name: string;
  description?: string | null;
  price: number;
  quantity: number;
  sold?: number;
  available?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TicketOrder {
  id: number;
  event_id: number;
  ticket_type_id: number;
  quantity: number;
  total_amount: number;
  status: string;
  payment_reference?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketSalesSummary {
  event_id: number;
  total_orders?: number;
  total_tickets_sold?: number;
  total_revenue?: number;
  [key: string]: unknown;
}

export interface PurchaseTicketData {
  event_id: number;
  ticket_type_id: number;
  quantity: number;
  payment_method: string;
  guest_email?: string;
  guest_phone?: string;
}

export interface CreateTicketTypeData {
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

export interface UpdateTicketTypeData {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
}

export interface ConfirmTicketPaymentData {
  payment_ref?: string;
}
