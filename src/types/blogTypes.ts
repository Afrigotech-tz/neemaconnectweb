export interface Blog {
  id: number;
  image: string;
  title: string;
  description: string;
  date: string;
  location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogData {
  image?: File;
  title: string;
  description: string;
  date: string;
  location: string;
  is_active?: boolean;
}

export type UpdateBlogData = Partial<CreateBlogData>;

export interface BlogFilters {
  is_active?: boolean;
  search?: string;
}

export interface BlogResponse {
  success: boolean;
  message: string;
  data?: Blog;
}

export interface BlogsResponse {
  success: boolean;
  message: string;
  data?: Blog[];
}
