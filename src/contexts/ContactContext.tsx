import React, { createContext, useState, useCallback, ReactNode } from 'react';
import {
  ContactInfo,
  CreateContactInfoData,
  UpdateContactInfoData,
  ContactSubmission,
  CreateContactSubmissionData,
} from '@/types/contactTypes';
import { contactService } from '@/services/contactService';
import { useToast } from '@/hooks/use-toast';

interface ContactContextType {
  contactInfo: ContactInfo | null;
  contactSubmissions: ContactSubmission[];
  loading: boolean;
  error: string | null;
  fetchContactInfo: (showToast?: boolean) => Promise<void>;
  createContactInfo: (data: CreateContactInfoData) => Promise<boolean>;
  updateContactInfo: (data: UpdateContactInfoData) => Promise<boolean>;
  submitContactForm: (data: CreateContactSubmissionData) => Promise<boolean>;
  fetchContactSubmissions: () => Promise<void>;
  updateSubmissionStatus: (id: number, status: 'new' | 'read' | 'replied' | 'archived') => Promise<boolean>;
  deleteSubmission: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const ContactContext = createContext<ContactContextType | undefined>(undefined);

interface ContactProviderProps {
  children: ReactNode;
}

export const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
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
          toast({
            title: 'Success',
            description: response.message,
          });
        }
      } else {
        setError(response.message);
        if (showToast) {
          toast({
            title: 'Error',
            description: response.message,
            variant: 'destructive',
          });
        }
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while fetching contact information';
      setError(errorMessage);
      if (showToast) {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
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
        toast({
          title: 'Success',
          description: response.message,
        });
        // Refresh contact info
        await fetchContactInfo();
        return true;
      } else {
        setError(response.message);
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive',
        });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while creating contact information';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
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
        toast({
          title: 'Success',
          description: response.message,
        });
        // Refresh contact info
        await fetchContactInfo();
        return true;
      } else {
        setError(response.message);
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive',
        });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while updating contact information';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchContactInfo]);

  const submitContactForm = useCallback(async (data: CreateContactSubmissionData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await contactService.submitContactForm(data);

      if (response.success) {
        toast({
          title: 'Success',
          description: response.message,
        });
        return true;
      } else {
        setError(response.message);
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive',
        });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while submitting your message';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchContactSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contactService.getContactSubmissions();

      if (response.success && response.data) {
        setContactSubmissions(response.data);
      } else {
        setError(response.message);
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while fetching contact submissions';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateSubmissionStatus = useCallback(async (
    id: number,
    status: 'new' | 'read' | 'replied' | 'archived'
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await contactService.updateSubmissionStatus(id, status);

      if (response.success) {
        toast({
          title: 'Success',
          description: response.message,
        });
        // Refresh submissions list
        await fetchContactSubmissions();
        return true;
      } else {
        setError(response.message);
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive',
        });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while updating submission status';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchContactSubmissions]);

  const deleteSubmission = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await contactService.deleteSubmission(id);

      if (response.success) {
        toast({
          title: 'Success',
          description: response.message,
        });
        // Refresh submissions list
        await fetchContactSubmissions();
        return true;
      } else {
        setError(response.message);
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive',
        });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while deleting submission';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchContactSubmissions]);

  const value: ContactContextType = {
    contactInfo,
    contactSubmissions,
    loading,
    error,
    fetchContactInfo,
    createContactInfo,
    updateContactInfo,
    submitContactForm,
    fetchContactSubmissions,
    updateSubmissionStatus,
    deleteSubmission,
    clearError,
  };

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
};
