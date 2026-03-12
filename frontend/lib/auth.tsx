'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole } from '@/lib/types/user';
import { LocalStorage } from '@/lib/localStorage';
import { authApi } from '@/lib/api.service';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole, phone?: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = LocalStorage.getUser() as User | null;
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      const userData: User = {
        id: response.user._id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        phone: response.user.phone || '',
        createdAt: new Date(response.user.createdAt),
        avatar: response.user.avatar,
      };

      setUser(userData);
      LocalStorage.setUser(userData);
      LocalStorage.set('token', response.token);
    } catch (error: any) {
      // Fallback to mock login if backend is not available
      console.warn('Backend login failed, using mock login:', error.message);
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockUsers: Record<string, { id: string; name: string; email: string; role: UserRole }> = {
        'ravi@farmer.com': { id: 'f1', name: 'Ravi Kumar', email: 'ravi@farmer.com', role: 'farmer' },
        'suresh@farmer.com': { id: 'f2', name: 'Suresh Patel', email: 'suresh@farmer.com', role: 'farmer' },
        'amit@buyer.com': { id: 'b1', name: 'Amit Singh', email: 'amit@buyer.com', role: 'buyer' },
        'priya@buyer.com': { id: 'b2', name: 'Priya Sharma', email: 'priya@buyer.com', role: 'buyer' },
        'rajesh@transport.com': { id: 't1', name: 'Rajesh Transport', email: 'rajesh@transport.com', role: 'transporter' },
        'vikram@transport.com': { id: 't2', name: 'Vikram Logistics', email: 'vikram@transport.com', role: 'transporter' },
        'admin@agriai.com': { id: 'a1', name: 'Admin User', email: 'admin@agriai.com', role: 'admin' },
      };

      const mockUser = mockUsers[email];
      if (!mockUser) {
        throw new Error('Invalid email or password');
      }

      const userData: User = {
        ...mockUser,
        phone: '+91 98765 43210',
        createdAt: new Date(),
      };

      setUser(userData);
      LocalStorage.setUser(userData);
      LocalStorage.set('token', 'mock-token-' + mockUser.id);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole, phone?: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.register({ name, email, password, role, phone });
      const userData: User = {
        id: response.user._id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        phone: response.user.phone || '',
        createdAt: new Date(response.user.createdAt),
        avatar: response.user.avatar,
      };

      setUser(userData);
      LocalStorage.setUser(userData);
      LocalStorage.set('token', response.token);
    } catch (error: any) {
      // Fallback to mock signup if backend is not available
      console.warn('Backend signup failed, using mock signup:', error.message);
      await new Promise(resolve => setTimeout(resolve, 500));

      const userData: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        phone: phone || '',
        createdAt: new Date(),
      };

      setUser(userData);
      LocalStorage.setUser(userData);
      LocalStorage.set('token', 'mock-token-' + userData.id);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      LocalStorage.setUser(updated);
    }
  };

  const logout = () => {
    setUser(null);
    LocalStorage.remove('user');
    LocalStorage.remove('token');
    LocalStorage.remove('acceptedJobs');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, isLoading }}>
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