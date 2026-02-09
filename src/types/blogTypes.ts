export interface Blog {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  author_id?: number;
  image_url?: string;
  category: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  views_count?: number;
  likes_count?: number;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  author_id?: number;
  image_url?: string;
  category: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  published_at?: string;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
}

export type UpdateBlogData = Partial<CreateBlogData>;

export interface BlogFilters {
  category?: string;
  status?: 'draft' | 'published' | 'archived' | 'all';
  is_featured?: boolean;
  author?: string;
  search?: string;
}

export interface BlogSearchParams {
  search?: string;
  category?: string;
  status?: string;
  is_featured?: boolean;
  page?: number;
  limit?: number;
  sort_by?: 'created_at' | 'published_at' | 'views_count' | 'likes_count';
  sort_order?: 'asc' | 'desc';
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

export interface PaginatedBlogsResponse {
  success: boolean;
  message: string;
  data?: {
    blogs: Blog[];
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}
