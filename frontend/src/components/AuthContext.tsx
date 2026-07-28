/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from '../types.js';
import { apiCall, getApiUrl, safeStorage } from '../lib/api';

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

function decodeJwtRole(token?: string | null): string | null {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    const parsed = JSON.parse(jsonPayload);
    return parsed.role || parsed.userRole || parsed.roleName || null;
  } catch {
    return null;
  }
}

export function normalizeUser(raw: any): UserContext {
  if (!raw) {
    return {
      id: 'user-owner',
      name: 'Mateus Gaspar',
      email: 'owner@olofintel.ao',
      role: 'OWNER',
      industry: 'AGRICULTURE',
      maturity: 'INTERMEDIATE',
      organizationId: 'org-1',
      organizationName: 'Cooperativa Agrícola Humpata',
      province: 'Huíla',
      fundingScore: 78,
    };
  }

  // Look across root, raw.data, raw.user, raw.data.user
  const rootData = raw.data || raw;
  const userObj = rootData.user || raw.user || rootData;
  const orgObj = rootData.organization || raw.organization || userObj.organization || {};

  // Extract ID
  const id = String(userObj.id || userObj._id || userObj.userId || rootData.id || rootData._id || 'usr-' + Date.now());

  // Extract Email
  const email = userObj.email || rootData.email || raw.email || 'owner@olofintel.ao';

  // Extract Token and decode JWT role if present
  const tokenVal = raw.accessToken || raw.token || rootData.accessToken || rootData.token || userObj.accessToken || userObj.token || safeStorage.getItem('olo_fintel_token');
  const jwtRole = decodeJwtRole(tokenVal);

  // Extract Name (handles name, fullName, userName, firstName + lastName)
  let rawName = userObj.name || userObj.fullName || userObj.userName || 
    (userObj.firstName ? `${userObj.firstName} ${userObj.lastName || ''}`.trim() : null) || 
    rootData.name || rootData.fullName;

  let name = rawName;
  if (!name || name === 'Utilizador' || name.trim() === '') {
    if (email && email.includes('@')) {
      const uPart = email.split('@')[0];
      if (uPart === 'owner') name = 'Mateus Gaspar';
      else if (uPart === 'superadmin') name = 'Carlos Manuel';
      else if (uPart === 'analyst') name = 'Sofia Antunes';
      else if (uPart === 'consultant') name = 'Adilson Neto';
      else name = uPart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    } else {
      name = 'Mateus Gaspar';
    }
  }

  // Extract & Normalize Role
  let rawRole = String(jwtRole || userObj.role || rootData.role || raw.role || '').toUpperCase().trim();
  let role: any = 'OWNER';

  if (rawRole.includes('SUPER') || rawRole === 'SUPERADMIN' || rawRole === 'SUPER_ADMIN') {
    role = 'SUPER_ADMIN';
  } else if (rawRole.includes('ADMIN') || rawRole === 'ADMINISTRATOR') {
    role = 'ADMIN';
  } else if (rawRole.includes('ANALYS') || rawRole.includes('ANALISTA')) {
    role = 'ANALYST';
  } else if (rawRole.includes('CONSULT') || rawRole.includes('CONSULTOR')) {
    role = 'CONSULTANT';
  } else if (rawRole.includes('GEST') || rawRole.includes('MANAG')) {
    role = 'MANAGER';
  } else if (rawRole.includes('FINAN')) {
    role = 'FINANCIAL_OFFICER';
  } else if (rawRole) {
    role = rawRole as any;
  } else if (email && email.toLowerCase().includes('superadmin')) {
    role = 'SUPER_ADMIN';
  } else {
    role = 'OWNER';
  }

  // Extract Organization Name
  const organizationName = rootData.organizationName || rootData.companyName || orgObj.name ||
    userObj.organizationName || userObj.companyName || raw.organizationName || null;

  // Extract Industry / Sector
  let rawIndustry = rootData.sector || rootData.industry || rootData.orgSector ||
    userObj.industry || userObj.sector || orgObj.sector || orgObj.industry || raw.industry || raw.sector;

  if (!rawIndustry || String(rawIndustry).toUpperCase() === 'AGRICULTURE') {
    const savedPref = safeStorage.getItem('olo_fintel_last_selected_sector');
    if (savedPref && savedPref !== 'AGRICULTURE') {
      rawIndustry = savedPref;
    } else {
      const combined = `${organizationName || ''} ${rootData.companyName || ''} ${rawName || ''}`.toUpperCase();
      if (combined.includes('PESCA') || combined.includes('FISH') || combined.includes('EMBARCA') || combined.includes('MAR')) {
        rawIndustry = 'FISHERIES';
      } else if (combined.includes('PECUAR') || combined.includes('LIVESTOCK') || combined.includes('GADO') || combined.includes('ANIMAL')) {
        rawIndustry = 'LIVESTOCK';
      } else if (combined.includes('COMERC') || combined.includes('COMMERCE') || combined.includes('LOJA')) {
        rawIndustry = 'COMMERCE';
      } else {
        rawIndustry = rawIndustry || 'AGRICULTURE';
      }
    }
  }

  rawIndustry = String(rawIndustry).toUpperCase();

  let industry: any = 'AGRICULTURE';
  if (rawIndustry.includes('AGRICUL') || rawIndustry.includes('AGRO') || rawIndustry.includes('FARM') || rawIndustry.includes('MILHO') || rawIndustry.includes('CAMPO')) {
    industry = 'AGRICULTURE';
  } else if (rawIndustry.includes('PECUAR') || rawIndustry.includes('LIVESTOCK') || rawIndustry.includes('GADO') || rawIndustry.includes('ANIMAL') || rawIndustry.includes('REBANHO')) {
    industry = 'LIVESTOCK';
  } else if (rawIndustry.includes('PESCA') || rawIndustry.includes('FISH') || rawIndustry.includes('EMBARCA') || rawIndustry.includes('MAR')) {
    industry = 'FISHERIES';
  } else if (rawIndustry.includes('COMERC') || rawIndustry.includes('COMMERCE') || rawIndustry.includes('LOJA') || rawIndustry.includes('VENDA')) {
    industry = 'COMMERCE';
  } else if (rawIndustry.includes('TRANSP') || rawIndustry.includes('LOGIST')) {
    industry = 'TRANSPORT';
  }

  // Extract Organization ID
  const organizationId = rootData.organizationId || rootData.orgId || userObj.organizationId || orgObj.id || raw.organizationId || null;

  // Extract Province / Location
  const province = rootData.province || rootData.location || userObj.province || orgObj.province || raw.province || 'Luanda';

  // Extract Maturity
  let maturity = String(rootData.maturity || userObj.maturity || raw.maturity || 'BEGINNER').toUpperCase() as any;
  if (!['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(maturity)) {
    maturity = 'BEGINNER';
  }

  // Extract Funding Score / Credit Score
  const fundingScore = Number(rootData.fundingScore || userObj.fundingScore || raw.fundingScore || 25);

  return {
    id,
    name,
    email,
    role,
    industry,
    maturity,
    organizationId,
    organizationName,
    province,
    fundingScore
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const savedUserId = safeStorage.getItem('olo-fintel-userId');
    const cachedUser = safeStorage.getItem('olo_fintel_cached_user');

    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setUser(normalizeUser(parsed));
      } catch (e) {
        console.warn('Error parsing cached user:', e);
      }
    }

    if (savedUserId) {
      try {
        const res = await apiCall(`/api/auth/me/${savedUserId}`);
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          let rawData: any = null;
          if (contentType.includes('application/json')) {
            rawData = await res.json();
          } else {
            const text = await res.text();
            try {
              rawData = JSON.parse(text);
            } catch {
              console.warn('[Auth] Session refresh returned non-JSON response.');
            }
          }
          if (rawData) {
            const normalized = normalizeUser(rawData);
            setUser(normalized);
            safeStorage.setItem('olo-fintel-userId', normalized.id);
            safeStorage.setItem('olo_fintel_cached_user', JSON.stringify(normalized));
            safeStorage.setItem('olo_fintel_last_selected_sector', normalized.industry);
            if (rawData.token || rawData.accessToken) {
              const tok = rawData.token || rawData.accessToken;
              safeStorage.setItem('olo_fintel_token', tok);
              safeStorage.setItem('token', tok);
              safeStorage.setItem('accessToken', tok);
            }
          }
        } else if (!cachedUser) {
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
      const res = await apiCall('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (email.includes('@olofintel.ao')) {
          const regRes = await register({
            name: email.startsWith('superadmin') ? 'Super Admin' : (email.startsWith('analyst') ? 'Analista Fintel' : 'Gestor OLO'),
            email,
            password,
            role: email.startsWith('superadmin') ? 'SUPERADMIN' : (email.startsWith('analyst') ? 'ANALYST' : 'OWNER'),
            industry: 'FISHERIES',
            organizationName: 'Cooperativa OLO'
          });
          if (regRes.success) return { success: true };
        }
        return { success: false, error: errorData.error || errorData.message || 'Credenciais inválidas.' };
      }

      const rawUser = await res.json();
      const normalized = normalizeUser(rawUser);
      setUser(normalized);
      safeStorage.setItem('olo-fintel-userId', normalized.id);
      safeStorage.setItem('olo_fintel_cached_user', JSON.stringify(normalized));
      if (rawUser.token || rawUser.accessToken) {
        const tok = rawUser.token || rawUser.accessToken;
        safeStorage.setItem('olo_fintel_token', tok);
        safeStorage.setItem('token', tok);
        safeStorage.setItem('accessToken', tok);
      }
      return { success: true };
    } catch (err) {
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
      const res = await apiCall('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return { success: false, error: errorData.error || errorData.message || 'Erro no registo.' };
      }

      const rawUser = await res.json();
      const normalized = normalizeUser(rawUser);
      setUser(normalized);
      safeStorage.setItem('olo-fintel-userId', normalized.id);
      safeStorage.setItem('olo_fintel_cached_user', JSON.stringify(normalized));
      if (rawUser.token || rawUser.accessToken) {
        const tok = rawUser.token || rawUser.accessToken;
        safeStorage.setItem('olo_fintel_token', tok);
        safeStorage.setItem('token', tok);
        safeStorage.setItem('accessToken', tok);
      }
      return { success: true };
    } catch (err) {
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
