import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Address, CreateAddressData, UpdateAddressData } from '@/types/addressTypes';
import { addressService } from '@/services/addressService/addressService';
import { useToast } from '@/hooks/use-toast';

interface AddressContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  loading: boolean;
  error: string | null;
  fetchAddresses: () => Promise<void>;
  createAddress: (data: CreateAddressData) => Promise<boolean>;
  updateAddress: (id: number, data: UpdateAddressData) => Promise<boolean>;
  deleteAddress: (id: number) => Promise<boolean>;
  setSelectedAddress: (address: Address | null) => void;
  clearError: () => void;
}

export const AddressContext = createContext<AddressContextType | undefined>(undefined);

interface AddressProviderProps {
  children: ReactNode;
}

export const AddressProvider: React.FC<AddressProviderProps> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const clearError = useCallback(() => setError(null), []);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await addressService.getAddresses();

      if (response.success && response.data) {
        setAddresses(response.data);
      } else {
        setError(response.message);
      }
    } catch {
      setError('An unexpected error occurred while fetching addresses');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAddress = useCallback(async (data: CreateAddressData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await addressService.createAddress(data);

      if (response.success) {
        toast({ title: 'Success', description: 'Address created successfully' });
        await fetchAddresses();
        return true;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return false;
      }
    } catch {
      const errorMessage = 'An unexpected error occurred while creating address';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchAddresses]);

  const updateAddress = useCallback(async (id: number, data: UpdateAddressData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await addressService.updateAddress(id, data);

      if (response.success) {
        toast({ title: 'Success', description: 'Address updated successfully' });
        await fetchAddresses();
        return true;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return false;
      }
    } catch {
      const errorMessage = 'An unexpected error occurred while updating address';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchAddresses]);

  const deleteAddress = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await addressService.deleteAddress(id);

      if (response.success) {
        toast({ title: 'Success', description: 'Address deleted successfully' });
        await fetchAddresses();
        return true;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return false;
      }
    } catch {
      const errorMessage = 'An unexpected error occurred while deleting address';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchAddresses]);

  const value: AddressContextType = {
    addresses,
    selectedAddress,
    loading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setSelectedAddress,
    clearError,
  };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
};
