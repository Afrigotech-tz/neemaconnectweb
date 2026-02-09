import { AuthContext, AuthContextType } from "@/contexts/AuthContext";
import { User } from "@/services/authService";
import React, { ReactNode, useCallback, useEffect, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

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
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('verification_data');
    // Use window.location since AuthProvider is outside Router context
    window.location.href = '/login';
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

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

