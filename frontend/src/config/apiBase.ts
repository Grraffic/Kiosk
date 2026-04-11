/** API origin for HTTP (axios) and Socket.io — keep in sync with Vite env. */
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
}
