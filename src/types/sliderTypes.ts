export interface HomeSlider {
  id: number;
  image: string;
  title: string;
  head: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSliderData {
  image?: File;
  title: string;
  head: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
}

export type UpdateSliderData = Partial<CreateSliderData>;

export interface SliderFilters {
  is_active?: boolean;
  search?: string;
}

export interface SliderResponse {
  success: boolean;
  message: string;
  data?: HomeSlider;
}

export interface SlidersResponse {
  success: boolean;
  message: string;
  data?: HomeSlider[];
}
