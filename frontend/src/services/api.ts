import axios from 'axios';
import type { KioskData } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kiosk_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getKioskData = async (): Promise<KioskData> => {
  const res = await api.get('/api/content');
  return res.data;
};

// Fallback legacy bulk update
export const updateKioskData = async (data: Partial<KioskData>): Promise<KioskData> => {
  const res = await api.put('/api/content', data);
  return res.data;
};

// Specialized Granular Update Endpoints
export const updateLocaleAPI = async (localeInfo: any) => api.put('/api/content/locale', { localeInfo }).then(r => r.data);
export const updateMfaAPI = async (mfaPosterUrl: string, mfaDriveLink: string) => api.put('/api/content/mfa', { mfaPosterUrl, mfaDriveLink }).then(r => r.data);
export const updateUpdatesAPI = async (updates: any[]) => api.put('/api/content/updates', updates).then(r => r.data);
export const updateEventsAPI = async (events: any[]) => api.put('/api/content/events', events).then(r => r.data);
export const updateOfficersAPI = async (officers: any[]) => api.put('/api/content/officers', officers).then(r => r.data);
export const updateGroupsAPI = async (groups: any[]) => api.put('/api/content/groups', groups).then(r => r.data);
export const updateActivitiesAPI = async (activities: any[]) => api.put('/api/content/activities', activities).then(r => r.data);
export const updateMinistriesAPI = async (ministries: any[]) => api.put('/api/content/ministries', ministries).then(r => r.data);

export const login = async (username: string, password: string): Promise<string> => {
  const res = await api.post('/api/auth/login', { username, password });
  return res.data.token;
};

export default api;
