import api from '../api';
import { AxiosError } from 'axios';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ProfileUpdateData {
  profile_picture?: File;
  address?: string;
  bio?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  date_of_birth?: string;
  occupation?: string;
  location_public?: boolean;
  profile_public?: boolean;
}

export interface LocationUpdateData {
  address?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  location_public?: boolean;
}

export interface ProfilePictureResponse {
  profile_picture_url?: string;
}

interface WrappedApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[] | string>;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://31.170.165.83:8000/api/').replace(/\/+$/, '');
const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();
const LEGACY_PROFILE_PICTURE_URL_PATTERN = /\/api\/users\/\d+\/profile\/?$/i;

const normalizeDateForInput = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const dateOnlyMatch = trimmed.match(/^\d{4}-\d{2}-\d{2}$/);
  if (dateOnlyMatch) {
    return trimmed;
  }

  const isoMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (isoMatch?.[1]) {
    return isoMatch[1];
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as AxiosError<{ message?: string; errors?: Record<string, string[] | string> }>;
  const baseMessage = err.response?.data?.message || err.message || fallback;
  const errorMap = err.response?.data?.errors;

  if (!errorMap || typeof errorMap !== 'object') {
    return baseMessage;
  }

  const flattenedErrors = Object.entries(errorMap)
    .map(([field, messages]) => {
      if (Array.isArray(messages)) {
        return `${field}: ${messages.join(', ')}`;
      }
      if (typeof messages === 'string') {
        return `${field}: ${messages}`;
      }
      return '';
    })
    .filter((entry) => entry.length > 0)
    .join(' | ');

  return flattenedErrors ? `${baseMessage}. ${flattenedErrors}` : baseMessage;
};

const sanitizePayload = <T extends Record<string, unknown>>(data: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => {
      return value !== undefined && value !== null;
    })
  ) as Partial<T>;
};

const normalizeProfilePictureUrl = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const pictureUrl = value.trim();
  if (!pictureUrl || LEGACY_PROFILE_PICTURE_URL_PATTERN.test(pictureUrl)) {
    return null;
  }

  if (/^(https?:\/\/|data:|blob:)/i.test(pictureUrl)) {
    return pictureUrl;
  }

  // Backend sometimes returns only a filename (for example profile_44_xxx.png).
  // That value is not a directly resolvable image URL on the frontend and
  // causes ORB-blocked image requests, so keep it null and rely on a valid
  // absolute/path URL or cached preview.
  if (!pictureUrl.includes('/')) {
    return null;
  }

  if (!API_ORIGIN) {
    return pictureUrl;
  }

  if (pictureUrl.startsWith('/')) {
    return `${API_ORIGIN}${pictureUrl}`;
  }

  return `${API_ORIGIN}/${pictureUrl.replace(/^\/+/, '')}`;
};

const normalizeProfileData = <T>(input: T): T => {
  if (!input || typeof input !== 'object') {
    return input;
  }

  const cloned = { ...(input as Record<string, unknown>) };

  if ('profile_picture' in cloned) {
    cloned.profile_picture = normalizeProfilePictureUrl(cloned.profile_picture);
  }
  if ('date_of_birth' in cloned) {
    cloned.date_of_birth = normalizeDateForInput(cloned.date_of_birth);
  }

  if (cloned.profile && typeof cloned.profile === 'object') {
    const profile = { ...(cloned.profile as Record<string, unknown>) };
    profile.profile_picture = normalizeProfilePictureUrl(profile.profile_picture);
    if ('date_of_birth' in profile) {
      profile.date_of_birth = normalizeDateForInput(profile.date_of_birth);
    }
    cloned.profile = profile;
  }

  return cloned as T;
};

const unwrapData = <T>(payload: WrappedApiResponse<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in (payload as WrappedApiResponse<T>)) {
    return ((payload as WrappedApiResponse<T>).data ?? payload) as T;
  }
  return payload as T;
};

const unwrapMessage = (payload: unknown, fallback: string): string => {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as WrappedApiResponse<unknown>).message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }
  return fallback;
};

export const profileService = {
  async getProfile(userId?: string): Promise<ApiResponse<any>> {
    try {
      void userId;
      const response = await api.get('/profile');
      const payload = response.data as WrappedApiResponse<any>;
      return {
        success: payload?.success ?? true,
        data: normalizeProfileData(unwrapData<any>(payload)),
        message: unwrapMessage(payload, 'Profile fetched successfully'),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to get profile'),
      };
    }
  },

  async updateProfile(userIdOrData: string | ProfileUpdateData, maybeData?: ProfileUpdateData): Promise<ApiResponse<any>> {
    try {
      const rawData = (typeof userIdOrData === 'string' ? maybeData : userIdOrData) || {};
      const data = sanitizePayload(rawData as Record<string, unknown>);
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (value instanceof File) {
          formData.append(key, value);
          return;
        }
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
          return;
        }
        formData.append(key, String(value));
      });

      const response = await api.put('/profile', formData);

      const payload = response.data as WrappedApiResponse<any>;
      return {
        success: payload?.success ?? true,
        data: normalizeProfileData(unwrapData<any>(payload)),
        message: unwrapMessage(payload, 'Profile updated successfully'),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to update profile'),
      };
    }
  },

  async uploadProfilePicture(userIdOrFile: string | File, maybeFile?: File): Promise<ApiResponse<ProfilePictureResponse>> {
    try {
      const file = (userIdOrFile instanceof File ? userIdOrFile : maybeFile) as File | undefined;
      if (!file) {
        return {
          success: false,
          message: 'Profile picture file is required',
        };
      }

      const formData = new FormData();
      formData.append('profile_picture', file);
      const response = await api.post('/profile/picture', formData);

      const payload = response.data as WrappedApiResponse<any>;
      const data = unwrapData<any>(payload);
      return {
        success: payload?.success ?? true,
        data: {
          profile_picture_url: normalizeProfilePictureUrl(
            data?.profile_picture_url ||
            data?.profile_picture ||
            data?.profile?.profile_picture
          ),
        },
        message: unwrapMessage(payload, 'Profile picture updated successfully'),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to upload profile picture'),
      };
    }
  },

  async updateLocation(userIdOrData: string | LocationUpdateData, maybeData?: LocationUpdateData): Promise<ApiResponse<any>> {
    try {
      const rawData = (typeof userIdOrData === 'string' ? maybeData : userIdOrData) || {};
      const data = sanitizePayload(rawData as Record<string, unknown>);
      const response = await api.put('/profile/location', data);
      const payload = response.data as WrappedApiResponse<any>;
      return {
        success: payload?.success ?? true,
        data: normalizeProfileData(unwrapData<any>(payload)),
        message: unwrapMessage(payload, 'Profile location updated successfully'),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to update location'),
      };
    }
  },

  async deleteProfilePicture(userId?: string): Promise<ApiResponse<any>> {
    try {
      void userId;
      const response = await api.delete('/profile/picture');
      const payload = response.data as WrappedApiResponse<any>;
      return {
        success: payload?.success ?? true,
        data: unwrapData<any>(payload),
        message: unwrapMessage(payload, 'Profile picture deleted successfully'),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to delete profile picture'),
      };
    }
  }
};
