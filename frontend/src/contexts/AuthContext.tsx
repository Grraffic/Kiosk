import { createContext, useContext, useState, type ReactNode } from 'react';
import { login as apiLogin } from '../services/api';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('kiosk_token')
  );

  const login = async (username: string, password: string) => {
    const jwt = await apiLogin(username, password);
    localStorage.setItem('kiosk_token', jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem('kiosk_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
