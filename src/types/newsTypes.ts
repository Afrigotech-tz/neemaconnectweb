export interface News {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  author: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

export interface CreateNewsData {
  title: string;
  content: string;
  image_url?: string | null;
  author: string;
  published_at: string;
}

export interface UpdateNewsData extends CreateNewsData {
  id?: number;
  created_at?: string;
  updated_at?: string;
}
