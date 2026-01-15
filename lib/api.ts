import axios from 'axios';
import { Platform } from 'react-native';

// Helper to determine the correct base URL
const getBaseUrl = () => {
  // If env var is set, use it
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  // Legacy support for VITE_ prefix if needed, but EXPO_PUBLIC_ is preferred in Expo
  if (process.env.VITE_API_URL) return process.env.VITE_API_URL;

  // Fallback logic
  if (Platform.OS === 'android') {
    // Android Emulator loopback
    return 'http://10.0.2.2:3000/api';
  }
  
  // iOS Simulator or Web (localhost works)
  return 'http://localhost:3000/api';
};

const baseURL = getBaseUrl();

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
