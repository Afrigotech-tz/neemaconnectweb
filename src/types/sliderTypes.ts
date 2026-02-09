export interface HomeSlider {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  cta_text?: string;
  cta_link?: string;
  order: number;
  is_active: boolean;
  background_color?: string;
  text_color?: string;
  overlay_opacity?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSliderData {
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  cta_text?: string;
  cta_link?: string;
  order?: number;
  is_active?: boolean;
  background_color?: string;
  text_color?: string;
  overlay_opacity?: number;
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
