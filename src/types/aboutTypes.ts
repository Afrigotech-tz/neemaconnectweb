export interface AboutUs {
  id: number;
  our_story: string;
  image: string;
  mission: string;
  vision: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAboutUsData {
  image?: File;
  our_story: string;
  mission: string;
  vision: string;
}

export type UpdateAboutUsData = Partial<CreateAboutUsData>;

export interface AboutUsResponse {
  success: boolean;
  message: string;
  data?: AboutUs;
}
