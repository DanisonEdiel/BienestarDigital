import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type UserRole = 'parent' | 'child' | 'new_user' | null;

interface UserState {
  role: UserRole;
  domainUserId: string | null;
  clerkId: string | null;
  email: string | null;
  setRole: (role: UserRole) => void;
  setUserData: (data: { domainUserId: string; clerkId: string; email: string; role: UserRole }) => void;
  clearRole: () => void;
}

// Storage adapter for Zustand persist
const storage = {
  getItem: async (name: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(name);
    }
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(name, value);
    } else {
      await SecureStore.setItemAsync(name, value);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(name);
    } else {
      await SecureStore.deleteItemAsync(name);
    }
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      role: null,
      domainUserId: null,
      clerkId: null,
      email: null,
      setRole: (role) => set({ role }),
      setUserData: (data) => set({ 
        role: data.role, 
        domainUserId: data.domainUserId, 
        clerkId: data.clerkId, 
        email: data.email 
      }),
      clearRole: () => set({ role: null, domainUserId: null, clerkId: null, email: null }),
    }),
    {
      name: 'user-role-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
