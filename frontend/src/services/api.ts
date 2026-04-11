import axios from 'axios';
import type { KioskData } from '../types';
import { getApiBaseUrl } from '../config/apiBase';

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

const AUTH_TIMEOUT_MS = 12_000;

async function unwrap<T>(p: Promise<{ data: T }>): Promise<T> {
  const res = await p;
  return res.data;
}

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kiosk_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getKioskData = (): Promise<KioskData> => unwrap(api.get<KioskData>('/api/content'));

// Fallback legacy bulk update
export const updateKioskData = (data: Partial<KioskData>): Promise<KioskData> =>
  unwrap(api.put<KioskData>('/api/content', data));

// Specialized Granular Update Endpoints
export const updateLocaleAPI = (localeInfo: unknown) => unwrap(api.put('/api/content/locale', { localeInfo }));
export const updateMfaAPI = (mfaPosterUrl: string, mfaDriveLink: string) =>
  unwrap(api.put('/api/content/mfa', { mfaPosterUrl, mfaDriveLink }));
export const updateUpdatesAPI = (updates: unknown[]) => unwrap(api.put('/api/content/updates', { updates }));
export const updateEventsAPI = (events: unknown[]) => unwrap(api.put('/api/content/events', { events }));
export const updateOfficersAPI = (officers: unknown[]) => unwrap(api.put('/api/content/officers', { officers }));
export const updateGroupsAPI = (groups: unknown[]) => unwrap(api.put('/api/content/groups', { groups }));
export const updateActivitiesAPI = (activities: unknown[]) =>
  unwrap(api.put('/api/content/activities', { activities }));
export const updateMinistriesAPI = (ministries: unknown[]) =>
  unwrap(api.put('/api/content/ministries', { ministries }));
export const syncGroupsFromSheetAPI = (): Promise<{ success: boolean; groupCount: number }> =>
  unwrap(api.post('/api/content/sync-groups-sheet'));

export const login = async (username: string, password: string): Promise<string> => {
  const res = await api.post<{ token: string }>(
    '/api/auth/login',
    { username, password },
    { timeout: AUTH_TIMEOUT_MS }
  );
  return res.data.token;
};

export default api;
