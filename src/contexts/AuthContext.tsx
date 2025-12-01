import React, { createContext } from 'react';
import { User } from '../services/authService';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);







