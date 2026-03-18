import React, { createContext, useState, useCallback, ReactNode } from 'react';
import {
  ContactInfo,
  CreateContactInfoData,
  UpdateContactInfoData,
} from '@/types/contactTypes';
import { contactService } from '@/services/contactService/contactService';
import { useToast } from '@/hooks/use-toast';

interface ContactContextType {
  contactInfo: ContactInfo | null;
  loading: boolean;
  error: string | null;
  fetchContactInfo: (showToast?: boolean) => Promise<void>;
  createContactInfo: (data: CreateContactInfoData) => Promise<boolean>;
  updateContactInfo: (data: UpdateContactInfoData) => Promise<boolean>;
  clearError: () => void;
}

export const ContactContext = createContext<ContactContextType | undefined>(undefined);

interface ContactProviderProps {
  children: ReactNode;
}

export const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchContactInfo = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await contactService.getContactInfo();

      if (response.success && response.data) {
        setContactInfo(response.data);
        if (showToast) {
          toast({ title: 'Success', description: response.message });
        }
      } else {
        setError(response.message);
        if (showToast) {
          toast({ title: 'Error', description: response.message, variant: 'destructive' });
        }
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while fetching contact information';
      setError(errorMessage);
      if (showToast) {
        toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createContactInfo = useCallback(async (data: CreateContactInfoData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await contactService.createContactInfo(data);

      if (response.success) {
        toast({ title: 'Success', description: response.message });
        await fetchContactInfo();
        return true;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while creating contact information';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchContactInfo]);

  const updateContactInfo = useCallback(async (data: UpdateContactInfoData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await contactService.updateContactInfo(data);

      if (response.success) {
        toast({ title: 'Success', description: response.message });
        await fetchContactInfo();
        return true;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while updating contact information';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchContactInfo]);

  const value: ContactContextType = {
    contactInfo,
    loading,
    error,
    fetchContactInfo,
    createContactInfo,
    updateContactInfo,
    clearError,
  };

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
};
