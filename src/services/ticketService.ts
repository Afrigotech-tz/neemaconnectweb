import api from './api';
import { ApiResponse } from './authService';
import { AxiosError } from 'axios';
import {
  ConfirmTicketPaymentData,
  CreateTicketTypeData,
  PurchaseTicketData,
  TicketOrder,
  TicketSalesSummary,
  TicketType,
  UpdateTicketTypeData,
} from '@/types/ticketTypes';

interface ErrorResponse {
  message?: string;
}

interface WrappedApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

const unwrapData = <T>(payload: WrappedApiResponse<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in (payload as WrappedApiResponse<T>)) {
    return ((payload as WrappedApiResponse<T>).data ?? payload) as T;
  }
  return payload as T;
};

const unwrapMessage = (payload: unknown, fallback: string): string => {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as WrappedApiResponse<unknown>).message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }
  return fallback;
};

const buildErrorResponse = (error: unknown, fallback: string): ApiResponse => {
  const axiosError = error as AxiosError<ErrorResponse>;
  return {
    success: false,
    message: axiosError.response?.data?.message || axiosError.message || fallback,
  };
};

export const ticketService = {
  async purchaseTickets(data: PurchaseTicketData): Promise<ApiResponse<TicketOrder>> {
    try {
      const response = await api.post('/tickets/purchase', data);
      const payload = response.data as WrappedApiResponse<TicketOrder>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<TicketOrder>(payload),
        message: unwrapMessage(payload, 'Ticket purchase created successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to purchase tickets');
    }
  },

  async getMyOrders(): Promise<ApiResponse<TicketOrder[]>> {
    try {
      const response = await api.get('/tickets/my-orders');
      const payload = response.data as WrappedApiResponse<TicketOrder[]>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<TicketOrder[]>(payload),
        message: unwrapMessage(payload, 'Ticket orders fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch ticket orders');
    }
  },

  async getOrder(orderId: number): Promise<ApiResponse<TicketOrder>> {
    try {
      const response = await api.get(`/tickets/orders/${orderId}`);
      const payload = response.data as WrappedApiResponse<TicketOrder>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<TicketOrder>(payload),
        message: unwrapMessage(payload, 'Ticket order fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch ticket order');
    }
  },

  async cancelOrder(orderId: number): Promise<ApiResponse<TicketOrder>> {
    try {
      const response = await api.delete(`/tickets/orders/${orderId}`);
      const payload = response.data as WrappedApiResponse<TicketOrder>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<TicketOrder>(payload),
        message: unwrapMessage(payload, 'Ticket order cancelled successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to cancel ticket order');
    }
  },

  async confirmOrderPayment(orderId: number, data: ConfirmTicketPaymentData): Promise<ApiResponse<TicketOrder>> {
    try {
      const response = await api.post(`/tickets/orders/${orderId}/confirm-payment`, data);
      const payload = response.data as WrappedApiResponse<TicketOrder>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<TicketOrder>(payload),
        message: unwrapMessage(payload, 'Ticket payment confirmed successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to confirm ticket payment');
    }
  },

  async getOrderByPaymentReference(paymentRef: string): Promise<ApiResponse<TicketOrder>> {
    try {
      const response = await api.get(`/tickets/payment/${paymentRef}`);
      const payload = response.data as WrappedApiResponse<TicketOrder>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<TicketOrder>(payload),
        message: unwrapMessage(payload, 'Ticket order fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch order by payment reference');
    }
  },

  async getEventTicketTypes(eventId: number): Promise<ApiResponse<TicketType[]>> {
    try {
      const response = await api.get(`/tickets/events/${eventId}/ticket-types`);
      const payload = response.data as WrappedApiResponse<TicketType[]>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<TicketType[]>(payload),
        message: unwrapMessage(payload, 'Ticket types fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch ticket types');
    }
  },

  async createEventTicketType(eventId: number, data: CreateTicketTypeData): Promise<ApiResponse<TicketType>> {
    try {
      const response = await api.post(`/tickets/events/${eventId}/ticket-types`, data);
      const payload = response.data as WrappedApiResponse<TicketType>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<TicketType>(payload),
        message: unwrapMessage(payload, 'Ticket type created successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to create ticket type');
    }
  },

  async updateTicketType(ticketTypeId: number, data: UpdateTicketTypeData): Promise<ApiResponse<TicketType>> {
    try {
      const response = await api.put(`/tickets/ticket-types/${ticketTypeId}`, data);
      const payload = response.data as WrappedApiResponse<TicketType>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<TicketType>(payload),
        message: unwrapMessage(payload, 'Ticket type updated successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to update ticket type');
    }
  },

  async deleteTicketType(ticketTypeId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/tickets/ticket-types/${ticketTypeId}`);
      const payload = response.data as WrappedApiResponse<void>;
      return {
        success: payload?.success ?? true,
        message: unwrapMessage(payload, 'Ticket type deleted successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to delete ticket type');
    }
  },

  async getEventSalesSummary(eventId: number): Promise<ApiResponse<TicketSalesSummary>> {
    try {
      const response = await api.get(`/tickets/events/${eventId}/sales`);
      const payload = response.data as WrappedApiResponse<TicketSalesSummary>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<TicketSalesSummary>(payload),
        message: unwrapMessage(payload, 'Ticket sales summary fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch ticket sales summary');
    }
  },
};
