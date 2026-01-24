import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {

  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (process.env.VITE_API_URL) return process.env.VITE_API_URL;
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }
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
