import api from '../api';
import { ApiResponse } from '../authService/authService';
import { AxiosError } from 'axios';
import {
  ConfirmTicketPaymentData,
  PaymentMethod,
  PaymentOrderListResponse,
  PaymentResponse,
  ProcessPaymentData,
  ProcessTicketPaymentData,
  UpdatePaymentOrderStatusData,
} from '../types/paymentTypes';
import { Order } from '../types/orderTypes';

interface ErrorResponse {
  message: string;
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

let paymentsOrdersUnsupported = false;

export const paymentService = {
  async processPayment(data: ProcessPaymentData): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await api.post('/payments/process', data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to process payment',
      };
    }
  },

  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    try {
      const response = await api.get('/payments/methods');
      const payload = response.data as WrappedApiResponse<PaymentMethod[]>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<PaymentMethod[]>(payload),
        message: unwrapMessage(payload, 'Payment methods fetched successfully'),
      };
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch payment methods',
      };
    }
  },

  async getPaymentOrders(
    page?: number,
    scope: 'user' | 'admin' = 'user'
  ): Promise<ApiResponse<PaymentOrderListResponse | Order[]>> {
    const primaryFallback = scope === 'admin' ? '/orders' : '/orders/user';
    const secondaryFallback = scope === 'admin' ? '/orders/user' : '/orders';

    const fetchList = async (url: string): Promise<ApiResponse<PaymentOrderListResponse | Order[]>> => {
      const response = await api.get(url, { params: { page } });
      const payload = response.data as WrappedApiResponse<PaymentOrderListResponse | Order[]>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<PaymentOrderListResponse | Order[]>(payload),
        message: unwrapMessage(payload, 'Payment orders fetched successfully'),
      };
    };

    if (paymentsOrdersUnsupported) {
      try {
        return await fetchList(primaryFallback);
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        if (err.response?.status === 404 || err.response?.status === 403) {
          try {
            return await fetchList(secondaryFallback);
          } catch (secondaryError) {
            const secondaryErr = secondaryError as AxiosError<ErrorResponse>;
            return {
              success: false,
              message: secondaryErr.response?.data?.message || secondaryErr.message || 'Failed to fetch payment orders',
            };
          }
        }
        return {
          success: false,
          message: err.response?.data?.message || err.message || 'Failed to fetch payment orders',
        };
      }
    }

    try {
      return await fetchList('/payments/orders');
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.status === 404) {
        paymentsOrdersUnsupported = true;
        try {
          return await fetchList(primaryFallback);
        } catch (fallbackError) {
          const fallbackErr = fallbackError as AxiosError<ErrorResponse>;
          if (fallbackErr.response?.status === 404 || fallbackErr.response?.status === 403) {
            try {
              return await fetchList(secondaryFallback);
            } catch (secondaryError) {
              const secondaryErr = secondaryError as AxiosError<ErrorResponse>;
              return {
                success: false,
                message: secondaryErr.response?.data?.message || secondaryErr.message || 'Failed to fetch payment orders',
              };
            }
          }
          return {
            success: false,
            message: fallbackErr.response?.data?.message || fallbackErr.message || 'Failed to fetch payment orders',
          };
        }
      }
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch payment orders',
      };
    }
  },

  async getPaymentOrder(orderId: number): Promise<ApiResponse<Order>> {
    const fetchSingle = async (url: string): Promise<ApiResponse<Order>> => {
      const response = await api.get(url);
      const payload = response.data as WrappedApiResponse<Order>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<Order>(payload),
        message: unwrapMessage(payload, 'Payment order fetched successfully'),
      };
    };

    if (paymentsOrdersUnsupported) {
      try {
        return await fetchSingle(`/orders/${orderId}`);
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return {
          success: false,
          message: err.response?.data?.message || err.message || 'Failed to fetch payment order',
        };
      }
    }

    try {
      return await fetchSingle(`/payments/orders/${orderId}`);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.status === 404) {
        paymentsOrdersUnsupported = true;
        try {
          return await fetchSingle(`/orders/${orderId}`);
        } catch (fallbackError) {
          const fallbackErr = fallbackError as AxiosError<ErrorResponse>;
          return {
            success: false,
            message: fallbackErr.response?.data?.message || fallbackErr.message || 'Failed to fetch payment order',
          };
        }
      }
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch payment order',
      };
    }
  },

  async updatePaymentOrderStatus(orderId: number, data: UpdatePaymentOrderStatusData): Promise<ApiResponse<Order>> {
    const updateOrder = async (url: string): Promise<ApiResponse<Order>> => {
      const response = await api.put(url, data);
      const payload = response.data as WrappedApiResponse<Order>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<Order>(payload),
        message: unwrapMessage(payload, 'Order status updated successfully'),
      };
    };

    if (paymentsOrdersUnsupported) {
      try {
        return await updateOrder(`/orders/${orderId}`);
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return {
          success: false,
          message: err.response?.data?.message || err.message || 'Failed to update payment order status',
        };
      }
    }

    try {
      return await updateOrder(`/payments/orders/${orderId}/status`);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.status === 404) {
        paymentsOrdersUnsupported = true;
        try {
          return await updateOrder(`/orders/${orderId}`);
        } catch (fallbackError) {
          const fallbackErr = fallbackError as AxiosError<ErrorResponse>;
          return {
            success: false,
            message: fallbackErr.response?.data?.message || fallbackErr.message || 'Failed to update payment order status',
          };
        }
      }
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to update payment order status',
      };
    }
  },

  async processTicketPayment(data: ProcessTicketPaymentData): Promise<ApiResponse<unknown>> {
    try {
      const response = await api.post('/payments/tickets/process', data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to process ticket payment',
      };
    }
  },

  async confirmTicketPayment(orderId: number, data: ConfirmTicketPaymentData): Promise<ApiResponse<unknown>> {
    try {
      const response = await api.post(`/payments/tickets/${orderId}/confirm`, data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to confirm ticket payment',
      };
    }
  },
};
