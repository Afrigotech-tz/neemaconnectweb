import { AuthContext, AuthContextType } from "@/contexts/AuthContext";
import { authService, User } from "@/services/authService/authService";
import { getCachedProfilePicture } from "@/lib/profilePictureCache";
import React, { ReactNode, useCallback, useEffect, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
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

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
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

const sanitizeUserProfilePicture = (userData: User | null): User | null => {
  if (!userData?.profile) {
    return userData;
  }

  const normalizedProfilePicture = normalizeProfilePictureUrl(userData.profile.profile_picture);
  const cachedProfilePicture = getCachedProfilePicture(String(userData.id), userData.profile.profile_picture);
  // Prefer cached image to avoid ORB-blocked backend image URLs.
  const resolvedProfilePicture = cachedProfilePicture || normalizedProfilePicture;
  const normalizedDateOfBirth = normalizeDateForInput(userData.profile.date_of_birth);

  if (
    userData.profile.profile_picture === resolvedProfilePicture &&
    userData.profile.date_of_birth === normalizedDateOfBirth
  ) {
    return userData;
  }

  return {
    ...userData,
    profile: {
      ...userData.profile,
      profile_picture: resolvedProfilePicture,
      date_of_birth: normalizedDateOfBirth,
    },
  };
};

const buildLoginRedirectUrl = (): string => {
  if (typeof window === 'undefined') {
    return '/login';
  }

  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (!currentPath || currentPath === '/' || currentPath.startsWith('/login')) {
    return '/login';
  }

  return `/login?redirect=${encodeURIComponent(currentPath)}`;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth data on mount
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_data');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        const sanitizedUser = sanitizeUserProfilePicture(parsedUser);
        setUser(sanitizedUser);

        if (sanitizedUser) {
          localStorage.setItem('user_data', JSON.stringify(sanitizedUser));
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData: User, authToken: string) => {
    const sanitizedUser = sanitizeUserProfilePicture(userData);
    setUser(sanitizedUser);
    setToken(authToken);
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('user_data', JSON.stringify(sanitizedUser));
  }, []);

  const logout = useCallback(() => {
    void authService.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('verification_data');
    // Use window.location since AuthProvider is outside Router context.
    window.location.assign(buildLoginRedirectUrl());
  }, []);

  // Listen for 401 auth-expired events from the API interceptor
  useEffect(() => {
    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener('auth-expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, [logout]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      const updatedUser = sanitizeUserProfilePicture({ ...prevUser, ...userData });
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
