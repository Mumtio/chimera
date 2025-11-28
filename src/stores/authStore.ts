import { create } from 'zustand';
import type { User } from '../types';
import { dummyUsers } from '../data/dummyData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  demoLogin: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (_email: string, _password: string) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo, accept any credentials
    const user = dummyUsers[0];
    set({ user, isAuthenticated: true, isLoading: false });
  },

  signup: async (name: string, email: string, _password: string) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      createdAt: new Date(),
    };
    
    set({ user: newUser, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  demoLogin: () => {
    const user = dummyUsers[0];
    set({ user, isAuthenticated: true });
  },
}));
