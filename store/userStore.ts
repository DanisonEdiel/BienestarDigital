import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface UserState {
  domainUserId: string | null;
  clerkId: string | null;
  email: string | null;
  setUserData: (data: { domainUserId: string; clerkId: string; email: string }) => void;
  clearData: () => void;
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
      domainUserId: null,
      clerkId: null,
      email: null,
      setUserData: (data) => set({ 
        domainUserId: data.domainUserId, 
        clerkId: data.clerkId, 
        email: data.email 
      }),
      clearData: () => set({ domainUserId: null, clerkId: null, email: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
