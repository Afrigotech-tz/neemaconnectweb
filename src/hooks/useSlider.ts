import { useContext } from 'react';
import { SliderContext } from '@/contexts/SliderContext';

export const useSlider = () => {
  const context = useContext(SliderContext);

  if (!context) {
    throw new Error('useSlider must be used within a SliderProvider');
  }

  return context;
};
