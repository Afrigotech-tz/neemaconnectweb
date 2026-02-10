import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { HomeSlider, CreateSliderData, UpdateSliderData, SliderFilters } from '@/types/sliderTypes';
import { sliderService } from '@/services/sliderService';
import { useToast } from '@/hooks/use-toast';

interface SliderContextType {
  sliders: HomeSlider[];
  selectedSlider: HomeSlider | null;
  loading: boolean;
  error: string | null;
  fetchSliders: (filters?: SliderFilters, showToast?: boolean) => Promise<void>;
  fetchSlider: (id: number) => Promise<void>;
  createSlider: (data: CreateSliderData) => Promise<boolean>;
  updateSlider: (id: number, data: UpdateSliderData) => Promise<boolean>;
  deleteSlider: (id: number) => Promise<boolean>;
  setSelectedSlider: (slider: HomeSlider | null) => void;
  clearError: () => void;
  getActiveSliders: () => Promise<void>;
  toggleSliderStatus: (id: number, isActive: boolean) => Promise<boolean>;
}

export const SliderContext = createContext<SliderContextType | undefined>(undefined);

interface SliderProviderProps {
  children: ReactNode;
}

export const SliderProvider: React.FC<SliderProviderProps> = ({ children }) => {
  const [sliders, setSliders] = useState<HomeSlider[]>([]);
  const [selectedSlider, setSelectedSlider] = useState<HomeSlider | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchSliders = useCallback(async (filters?: SliderFilters, showToast = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await sliderService.getSliders(filters);

      if (response.success && response.data) {
        // Sort by order
        const sortedSliders = [...response.data].sort((a, b) => a.sort_order - b.sort_order);
        setSliders(sortedSliders);
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
      const errorMessage = 'An unexpected error occurred while fetching sliders';
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

  const fetchSlider = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await sliderService.getSlider(id);

      if (response.success && response.data) {
        setSelectedSlider(response.data);
      } else {
        setError(response.message);
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while fetching slider';
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

  const createSlider = useCallback(async (data: CreateSliderData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await sliderService.createSlider(data);

      if (response.success) {
        toast({
          title: 'Success',
          description: response.message,
        });
        // Refresh sliders list
        await fetchSliders();
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
      const errorMessage = 'An unexpected error occurred while creating slider';
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
  }, [toast, fetchSliders]);

  const updateSlider = useCallback(async (id: number, data: UpdateSliderData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await sliderService.updateSlider(id, data);

      if (response.success) {
        toast({
          title: 'Success',
          description: response.message,
        });
        // Refresh sliders list
        await fetchSliders();
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
      const errorMessage = 'An unexpected error occurred while updating slider';
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
  }, [toast, fetchSliders]);

  const deleteSlider = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await sliderService.deleteSlider(id);

      if (response.success) {
        toast({
          title: 'Success',
          description: response.message,
        });
        // Refresh sliders list
        await fetchSliders();
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
      const errorMessage = 'An unexpected error occurred while deleting slider';
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
  }, [toast, fetchSliders]);

  const getActiveSliders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sliderService.getActiveSliders();

      if (response.success && response.data) {
        // Sort by order
        const sortedSliders = [...response.data].sort((a, b) => a.sort_order - b.sort_order);
        setSliders(sortedSliders);
      } else {
        setError(response.message);
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while fetching active sliders';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleSliderStatus = useCallback(async (id: number, isActive: boolean): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await sliderService.toggleSliderStatus(id, isActive);

      if (response.success) {
        toast({
          title: 'Success',
          description: response.message,
        });
        // Refresh sliders list
        await fetchSliders();
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
      const errorMessage = 'An unexpected error occurred while toggling slider status';
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
  }, [toast, fetchSliders]);

  const value: SliderContextType = {
    sliders,
    selectedSlider,
    loading,
    error,
    fetchSliders,
    fetchSlider,
    createSlider,
    updateSlider,
    deleteSlider,
    setSelectedSlider,
    clearError,
    getActiveSliders,
    toggleSliderStatus,
  };

  return <SliderContext.Provider value={value}>{children}</SliderContext.Provider>;
};
