import { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from '../types';
import { getApiUrl, safeStorage } from '../lib/api';

interface AuthContextType {
  user: UserContext | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: string;
    industry?: string;
    province?: string;
    organizationName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const savedUserId = safeStorage.getItem('olo-fintel-userId');
    if (savedUserId) {
      try {
        const res = await fetch(getApiUrl(`/api/auth/me/${savedUserId}`));
        if (res.ok) {
          const updatedUser = await res.json();
          setUser(updatedUser);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Error refreshing user session:', err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || 'Credenciais inválidas.' };
      }

      const loggedUser = await res.json();
      setUser(loggedUser);
      safeStorage.setItem('olo-fintel-userId', loggedUser.id);
      return { success: true };
    } catch {
      return { success: false, error: 'Erro de ligação ao servidor.' };
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    role: string;
    industry?: string;
    province?: string;
    organizationName?: string;
  }) => {
    try {
      const res = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || 'Erro no registo.' };
      }

      const registeredUser = await res.json();
      setUser(registeredUser);
      safeStorage.setItem('olo-fintel-userId', registeredUser.id);
      return { success: true };
    } catch {
      return { success: false, error: 'Erro de ligação ao servidor.' };
    }
  };

  const logout = () => {
    setUser(null);
    safeStorage.removeItem('olo-fintel-userId');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
