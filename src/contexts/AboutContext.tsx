import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { AboutUs, CreateAboutUsData, UpdateAboutUsData } from '@/types/aboutTypes';
import { aboutService } from '@/services/aboutService';
import { useToast } from '@/hooks/use-toast';

interface AboutContextType {
  aboutUs: AboutUs | null;
  loading: boolean;
  error: string | null;
  fetchAboutUs: (showToast?: boolean) => Promise<void>;
  createAboutUs: (data: CreateAboutUsData) => Promise<boolean>;
  updateAboutUs: (data: UpdateAboutUsData) => Promise<boolean>;
  clearError: () => void;
}

export const AboutContext = createContext<AboutContextType | undefined>(undefined);

interface AboutProviderProps {
  children: ReactNode;
}

export const AboutProvider: React.FC<AboutProviderProps> = ({ children }) => {
  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchAboutUs = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aboutService.getAboutUs();

      if (response.success && response.data) {
        setAboutUs(response.data);
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
      const errorMessage = 'An unexpected error occurred while fetching about us content';
      setError(errorMessage);
      if (showToast) {
        toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createAboutUs = useCallback(async (data: CreateAboutUsData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await aboutService.createAboutUs(data);

      if (response.success) {
        if (response.data) setAboutUs(response.data);
        toast({ title: 'Success', description: response.message });
        return true;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while creating about us content';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateAboutUs = useCallback(async (data: UpdateAboutUsData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await aboutService.updateAboutUs(data);

      if (response.success) {
        if (response.data) setAboutUs(response.data);
        toast({ title: 'Success', description: response.message });
        return true;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while updating about us content';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const value: AboutContextType = {
    aboutUs,
    loading,
    error,
    fetchAboutUs,
    createAboutUs,
    updateAboutUs,
    clearError,
  };

  return <AboutContext.Provider value={value}>{children}</AboutContext.Provider>;
};
