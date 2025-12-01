export interface Song {
  id: number;
  name: string;
  choir: string;
  release_date: string;
  genre: string;
  description: string;
  picture: string | null;
  audio_file: string | null;
  duration: string | null;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links?: {
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface CreateMusicData {
  name: string;
  choir: string;
  release_date: string;
  genre: string;
  description: string;
}

export interface UpdateMusicData extends Partial<CreateMusicData> {
  id: number;
}


