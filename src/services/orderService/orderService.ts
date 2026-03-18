import api from '../api';
import { ApiResponse } from '../authService/authService';
import { AxiosError } from 'axios';
import { Order, CreateOrderData, OrderFilters, UpdateOrderStatusData } from '../types/orderTypes';
import { PaginatedResponse } from '../productService/productService';

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
  const err = error as AxiosError<ErrorResponse>;
  return {
    success: false,
    message: err.response?.data?.message || err.message || fallback,
  };
};

const buildPaginatedResponse = <T>(
  items: T[],
  page = 1,
  perPage = items.length || 15,
  total = items.length
): PaginatedResponse<T> => {
  const safePerPage = Math.max(1, perPage || 1);
  const lastPage = Math.max(1, Math.ceil(total / safePerPage));
  const currentPage = Math.min(Math.max(1, page), lastPage);
  return {
    current_page: currentPage,
    data: items,
    first_page_url: '',
    from: items.length > 0 ? (currentPage - 1) * safePerPage + 1 : 0,
    last_page: lastPage,
    last_page_url: '',
    links: [],
    next_page_url: currentPage < lastPage ? '' : null,
    path: '',
    per_page: safePerPage,
    prev_page_url: currentPage > 1 ? '' : null,
    to: items.length > 0 ? (currentPage - 1) * safePerPage + items.length : 0,
    total,
  };
};

const normalizePaginatedOrders = (payload: unknown): PaginatedResponse<Order> => {
  if (Array.isArray(payload)) {
    return buildPaginatedResponse<Order>(payload as Order[]);
  }

  if (payload && typeof payload === 'object') {
    const data = payload as Record<string, unknown>;
    if (Array.isArray(data.data)) {
      const items = data.data as Order[];
      return {
        ...buildPaginatedResponse<Order>(
          items,
          Number(data.current_page ?? 1) || 1,
          Number(data.per_page ?? (items.length || 15)) || 15,
          Number(data.total ?? items.length) || items.length
        ),
        ...(data as Partial<PaginatedResponse<Order>>),
        data: items,
      };
    }
  }

  return buildPaginatedResponse<Order>([]);
};

export const orderService = {
  async getOrders(filters?: OrderFilters): Promise<ApiResponse<PaginatedResponse<Order>>> {
    try {
      const response = await api.get('/orders', { params: filters });
      const payload = response.data as WrappedApiResponse<PaginatedResponse<Order> | Order[]>;
      const data = normalizePaginatedOrders(unwrapData(payload));
      return {
        success: payload?.success ?? true,
        data,
        message: unwrapMessage(payload, 'Orders fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch orders');
    }
  },

  async getUserOrders(page?: number): Promise<ApiResponse<PaginatedResponse<Order>>> {
    try {
      const response = await api.get('/orders/user', { params: { page } });
      const payload = response.data as WrappedApiResponse<PaginatedResponse<Order> | Order[]>;
      const data = normalizePaginatedOrders(unwrapData(payload));
      return {
        success: payload?.success ?? true,
        data,
        message: unwrapMessage(payload, 'User orders fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch your orders');
    }
  },

  async getOrder(id: number): Promise<ApiResponse<Order>> {
    try {
      const response = await api.get(`/orders/${id}`);
      const payload = response.data as WrappedApiResponse<Order>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<Order>(payload),
        message: unwrapMessage(payload, 'Order fetched successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to fetch order');
    }
  },

  async createOrder(data: CreateOrderData): Promise<ApiResponse<Order>> {
    try {
      const response = await api.post('/orders/process', data);
      const payload = response.data as WrappedApiResponse<Order>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<Order>(payload),
        message: unwrapMessage(payload, 'Order created successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to create order');
    }
  },

  async updateOrderStatus(id: number, data: UpdateOrderStatusData): Promise<ApiResponse<Order>> {
    try {
      const response = await api.put(`/orders/${id}`, data);
      const payload = response.data as WrappedApiResponse<Order>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<Order>(payload),
        message: unwrapMessage(payload, 'Order updated successfully'),
      };
    } catch (error) {
      return buildErrorResponse(error, 'Failed to update order status');
    }
  },
};
