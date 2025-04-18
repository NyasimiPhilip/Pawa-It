'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { UserResponse, getCurrentUser, loginUser, LoginData, registerUser, RegisterData } from '@/services/api';
import { setToken, getToken, removeToken, isAuthenticated as checkIsAuth } from '@/utils/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUserFromToken() {
      if (checkIsAuth()) {
        try {
          setIsLoading(true);
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Error loading user:', error);
          removeToken();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    loadUserFromToken();
  }, []);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await loginUser(data);
      setToken(response.access_token);
      const userData = await getCurrentUser();
      setUser(userData);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      await login({ username: data.email, password: data.password });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}