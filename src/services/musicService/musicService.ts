import { AxiosError } from 'axios';
import api from '@/services/api';
import {
  Song,
  PaginatedResponse,
  ApiResponse,
  CreateMusicData,
  UpdateMusicData,
  MusicListParams,
} from '@/types/musicTypes';

interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[] | string>;
}

interface WrappedApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

const MUSIC_UPLOAD_TIMEOUT_MS = 180000;

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://31.170.165.83/api/').replace(/\/+$/, '');
const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();

const unwrapPayload = <T>(payload: WrappedApiResponse<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in (payload as WrappedApiResponse<T>)) {
    const wrapped = payload as WrappedApiResponse<T>;
    if (wrapped.data !== undefined) {
      return wrapped.data;
    }
  }
  return payload as T;
};

const unwrapMessage = (payload: unknown, fallback: string): string => {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as WrappedApiResponse<unknown>).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  return fallback;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as AxiosError<ErrorResponse>;
  const baseMessage = err.response?.data?.message || err.message || fallback;
  const errors = err.response?.data?.errors;

  if (!errors || typeof errors !== 'object') {
    return baseMessage;
  }

  const details = Object.entries(errors)
    .map(([field, value]) => {
      if (Array.isArray(value)) return `${field}: ${value.join(', ')}`;
      if (typeof value === 'string') return `${field}: ${value}`;
      return '';
    })
    .filter(Boolean)
    .join(' | ');

  return details ? `${baseMessage}. ${details}` : baseMessage;
};

const normalizeMediaUrl = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const raw = value.trim();
  if (!raw) return null;

  if (/^(https?:\/\/|data:|blob:)/i.test(raw)) {
    return raw;
  }

  if (!raw.includes('/')) {
    return null;
  }

  if (!API_ORIGIN) {
    return raw;
  }

  if (raw.startsWith('/')) {
    return `${API_ORIGIN}${raw}`;
  }

  return `${API_ORIGIN}/${raw.replace(/^\/+/, '')}`;
};

const normalizeReleaseDate = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  const dateOnlyMatch = trimmed.match(/^\d{4}-\d{2}-\d{2}$/);
  if (dateOnlyMatch) return trimmed;
  const isoMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (isoMatch?.[1]) return isoMatch[1];
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const normalizeSong = (payload: unknown): Song => {
  const source = (payload && typeof payload === 'object' ? payload : {}) as Partial<Song>;

  return {
    id: Number(source.id || 0),
    name: source.name || '',
    choir: source.choir || '',
    release_date: normalizeReleaseDate(source.release_date),
    genre: source.genre || null,
    description: source.description || null,
    picture: normalizeMediaUrl(source.picture),
    audio_file: normalizeMediaUrl(source.audio_file),
    duration: source.duration || null,
    file_size: source.file_size ?? null,
    mime_type: source.mime_type || null,
    created_at: source.created_at || '',
    updated_at: source.updated_at || '',
  };
};

const normalizePaginatedSongs = (payload: unknown): PaginatedResponse<Song> => {
  const unwrapped = unwrapPayload(payload as WrappedApiResponse<unknown>) as unknown;
  const dataSource = (unwrapped && typeof unwrapped === 'object' ? unwrapped : {}) as Record<string, unknown>;
  const rows = Array.isArray(dataSource.data)
    ? dataSource.data
    : Array.isArray(unwrapped)
      ? (unwrapped as unknown[])
      : [];

  const currentPage = Number(dataSource.current_page ?? 1);
  const perPage = Number(dataSource.per_page ?? rows.length ?? 10);
  const total = Number(dataSource.total ?? rows.length);
  const lastPageRaw = Number(dataSource.last_page ?? 0);
  const lastPage = lastPageRaw > 0 ? lastPageRaw : Math.max(1, Math.ceil(total / (perPage || 1)));

  return {
    data: rows.map((row) => normalizeSong(row)),
    current_page: Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1,
    last_page: Number.isFinite(lastPage) && lastPage > 0 ? lastPage : 1,
    per_page: Number.isFinite(perPage) && perPage > 0 ? perPage : 10,
    total: Number.isFinite(total) && total >= 0 ? total : rows.length,
  };
};

const appendOptionalValue = (
  formData: FormData,
  key: string,
  value: unknown,
  options?: { allowEmptyString?: boolean }
) => {
  if (value === undefined || value === null) return;
  if (value instanceof File) {
    formData.append(key, value);
    return;
  }
  const rawStringValue = String(value);
  if (rawStringValue === '' && options?.allowEmptyString) {
    formData.append(key, '');
    return;
  }
  const stringValue = rawStringValue.trim();
  if (!stringValue) return;
  formData.append(key, stringValue);
};

const toMusicFormData = (data: CreateMusicData | UpdateMusicData, isUpdate: boolean): FormData => {
  const formData = new FormData();
  if (isUpdate) {
    formData.append('_method', 'PUT');
  }
  appendOptionalValue(formData, 'name', data.name);
  appendOptionalValue(formData, 'release_date', data.release_date);
  appendOptionalValue(formData, 'choir', data.choir);
  appendOptionalValue(formData, 'description', data.description, { allowEmptyString: true });
  appendOptionalValue(formData, 'genre', data.genre, { allowEmptyString: true });
  if (data.picture instanceof File) {
    formData.append('picture', data.picture);
  }
  if (data.audio_file instanceof File) {
    formData.append('audio_file', data.audio_file);
  }
  return formData;
};

export const musicService = {
  async getSongs(params: MusicListParams = {}): Promise<ApiResponse<PaginatedResponse<Song>>> {
    try {
      const response = await api.get('/music', { params });
      return {
        success: true,
        message: 'Music fetched successfully',
        data: normalizePaginatedSongs(response.data),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to fetch music list'),
      };
    }
  },

  async getSong(id: number): Promise<ApiResponse<Song>> {
    try {
      const response = await api.get(`/music/${id}`);
      const payload = response.data as WrappedApiResponse<unknown>;
      const songRaw = unwrapPayload(payload);
      return {
        success: payload?.success ?? true,
        message: unwrapMessage(payload, 'Music details fetched successfully'),
        data: normalizeSong(songRaw),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to fetch music details'),
      };
    }
  },

  async deleteSong(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/music/${id}`);
      return {
        success: true,
        message: unwrapMessage(response.data, 'Music deleted successfully'),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to delete music'),
      };
    }
  },

  async createSong(data: CreateMusicData): Promise<ApiResponse<Song>> {
    try {
      const formData = toMusicFormData(data, false);
      const response = await api.post('/music', formData, {
        timeout: MUSIC_UPLOAD_TIMEOUT_MS,
      });
      const payload = response.data as WrappedApiResponse<unknown>;
      const songRaw = unwrapPayload(payload);
      return {
        success: payload?.success ?? true,
        message: unwrapMessage(payload, 'Music uploaded successfully'),
        data: normalizeSong(songRaw),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to upload music'),
      };
    }
  },

  async updateSong(id: number, data: UpdateMusicData): Promise<ApiResponse<Song>> {
    try {
      const payload = toMusicFormData(data, false);
      let response: { data: unknown };
      try {
        response = await api.put(`/music/${id}`, payload, {
          timeout: MUSIC_UPLOAD_TIMEOUT_MS,
        });
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        const status = err.response?.status;

        if (status === 413) {
          return {
            success: false,
            message: 'File is too large for server upload limits. Please use a smaller file and try again.',
          };
        }

        if (!status) {
          return {
            success: false,
            message: 'Upload failed due to network/CORS restriction on the server. This is usually caused by server size limits.',
          };
        }

        // Some backends fail file parsing on PUT multipart and only work with
        // POST multipart + _method=PUT.
        if (status === 400 || status === 405 || status === 415 || status === 422) {
          const fallbackPayload = toMusicFormData(data, true);
          try {
            response = await api.post(`/music/${id}`, fallbackPayload, {
              timeout: MUSIC_UPLOAD_TIMEOUT_MS,
            });
          } catch (fallbackError) {
            const fallbackErr = fallbackError as AxiosError<ErrorResponse>;
            const fallbackStatus = fallbackErr.response?.status;
            if (fallbackStatus === 413) {
              return {
                success: false,
                message: 'File is too large for server upload limits. Please use a smaller file and try again.',
              };
            }
            if (!fallbackStatus) {
              return {
                success: false,
                message: 'Upload failed due to network/CORS restriction on the server. This is usually caused by server size limits.',
              };
            }
            throw fallbackError;
          }
        } else {
          throw error;
        }
      }

      const responsePayload = response.data as WrappedApiResponse<unknown>;
      const songRaw = unwrapPayload(responsePayload);
      return {
        success: responsePayload?.success ?? true,
        message: unwrapMessage(responsePayload, 'Music updated successfully'),
        data: normalizeSong(songRaw),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to update music'),
      };
    }
  },
};
