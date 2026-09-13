import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken, clearAuthToken } from '../services/api';

export type UserRole = 'SUPER_ADMIN' | 'OWNER' | 'CANDIDATE';

export interface UserSession {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
}

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (token: string, user: UserSession) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const savedToken = getAuthToken();
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const me = await api.auth.getMe();
      setUser(me);
    } catch {
      clearAuthToken();
      setUser(null);
      setTokenState(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (newToken: string, newUser: UserSession) => {
    setAuthToken(newToken);
    setTokenState(newToken);
    setUser(newUser);
  };

  const logout = () => {
    clearAuthToken();
    setTokenState(null);
    setUser(null);
    const base = (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== './') ? import.meta.env.BASE_URL : '/';
    const target = base.endsWith('/') ? base : `${base}/`;
    window.location.href = target;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
