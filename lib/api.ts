import axios from 'axios';

// Fallback to localhost for development if env var is not set
// We try EXPO_PUBLIC_ first (standard), then VITE_ (user provided), then localhost.
const baseURL = process.env.EXPO_PUBLIC_API_URL || process.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
