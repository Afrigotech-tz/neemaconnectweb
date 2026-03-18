import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Cart, CartItem, AddToCartData, UpdateCartItemData } from '@/types/cartTypes';
import { cartService } from '@/services/cartService/cartService';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cart: Cart;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (data: AddToCartData) => Promise<boolean>;
  updateCartItem: (id: number, data: UpdateCartItemData) => Promise<boolean>;
  removeCartItem: (id: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  clearError: () => void;
}

const emptyCart: Cart = { items: [], total: 0, count: 0 };

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const clearError = useCallback(() => setError(null), []);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setCart(emptyCart);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart();

      if (response.success && response.data) {
        setCart(response.data);
      } else {
        setError(response.message);
      }
    } catch {
      setError('An unexpected error occurred while fetching cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (data: AddToCartData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.addToCart(data);

      if (response.success) {
        toast({ title: 'Success', description: 'Item added to cart' });
        await fetchCart();
        return true;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return false;
      }
    } catch {
      const errorMessage = 'An unexpected error occurred while adding to cart';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchCart]);

  const updateCartItem = useCallback(async (id: number, data: UpdateCartItemData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.updateCartItem(id, data);

      if (response.success) {
        await fetchCart();
        return true;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return false;
      }
    } catch {
      const errorMessage = 'An unexpected error occurred while updating cart';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchCart]);

  const removeCartItem = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.removeCartItem(id);

      if (response.success) {
        toast({ title: 'Success', description: 'Item removed from cart' });
        await fetchCart();
        return true;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return false;
      }
    } catch {
      const errorMessage = 'An unexpected error occurred while removing cart item';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchCart]);

  const clearCart = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.clearCart();

      if (response.success) {
        setCart(emptyCart);
        toast({ title: 'Success', description: 'Cart cleared successfully' });
        return true;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return false;
      }
    } catch {
      const errorMessage = 'An unexpected error occurred while clearing cart';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Auto-fetch cart on mount if authenticated
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const value: CartContextType = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    clearError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
