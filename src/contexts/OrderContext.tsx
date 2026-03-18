import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Order, CreateOrderData, OrderFilters, UpdateOrderStatusData } from '@/types/orderTypes';
import { orderService } from '@/services/orderService';
import { PaginatedResponse } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  ordersPagination: Omit<PaginatedResponse<Order>, 'data'> | null;
  userOrdersPagination: Omit<PaginatedResponse<Order>, 'data'> | null;
  fetchOrders: (filters?: OrderFilters) => Promise<void>;
  fetchUserOrders: (page?: number) => Promise<void>;
  fetchOrder: (id: number) => Promise<void>;
  createOrder: (data: CreateOrderData) => Promise<Order | null>;
  updateOrderStatus: (id: number, data: UpdateOrderStatusData) => Promise<boolean>;
  setSelectedOrder: (order: Order | null) => void;
  clearError: () => void;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ordersPagination, setOrdersPagination] = useState<Omit<PaginatedResponse<Order>, 'data'> | null>(null);
  const [userOrdersPagination, setUserOrdersPagination] = useState<Omit<PaginatedResponse<Order>, 'data'> | null>(null);
  const { toast } = useToast();

  const clearError = useCallback(() => setError(null), []);

  const fetchOrders = useCallback(async (filters?: OrderFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrders(filters);

      if (response.success && response.data) {
        const { data, ...paginationData } = response.data;
        setOrders(data);
        setOrdersPagination(paginationData);
      } else {
        setError(response.message);
      }
    } catch {
      setError('An unexpected error occurred while fetching orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserOrders = useCallback(async (page?: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getUserOrders(page);

      if (response.success && response.data) {
        const { data, ...paginationData } = response.data;
        setUserOrders(data);
        setUserOrdersPagination(paginationData);
      } else {
        setError(response.message);
      }
    } catch {
      setError('An unexpected error occurred while fetching your orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrder = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrder(id);

      if (response.success && response.data) {
        setSelectedOrder(response.data);
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
      }
    } catch {
      const errorMessage = 'An unexpected error occurred while fetching order';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createOrder = useCallback(async (data: CreateOrderData): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.createOrder(data);

      if (response.success && response.data) {
        toast({ title: 'Success', description: 'Order created successfully' });
        return response.data;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return null;
      }
    } catch {
      const errorMessage = 'An unexpected error occurred while creating order';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateOrderStatus = useCallback(async (id: number, data: UpdateOrderStatusData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.updateOrderStatus(id, data);

      if (response.success && response.data) {
        setSelectedOrder((prev) => (prev && prev.id === id ? response.data as Order : prev));
        setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, ...response.data } : order)));
        setUserOrders((prev) => prev.map((order) => (order.id === id ? { ...order, ...response.data } : order)));
        toast({ title: 'Success', description: response.message || 'Order status updated successfully' });
        return true;
      }

      setError(response.message);
      toast({ title: 'Error', description: response.message, variant: 'destructive' });
      return false;
    } catch {
      const errorMessage = 'An unexpected error occurred while updating order status';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const value: OrderContextType = {
    orders,
    userOrders,
    selectedOrder,
    loading,
    error,
    ordersPagination,
    userOrdersPagination,
    fetchOrders,
    fetchUserOrders,
    fetchOrder,
    createOrder,
    updateOrderStatus,
    setSelectedOrder,
    clearError,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
