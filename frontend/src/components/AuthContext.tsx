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

  // Handle nested wrapper like { user: {...}, token: "..." } or { data: {...} } or direct object
  const data = raw.user || raw.data || raw;

  // Extract ID
  const id = String(data.id || data._id || data.userId || raw.id || 'usr-' + Date.now());

  // Extract Email
  const email = data.email || raw.email || 'owner@olofintel.ao';

  // Extract Name (handles name, fullName, userName, firstName + lastName)
  let rawName = data.name || data.fullName || data.userName || 
    (data.firstName ? `${data.firstName} ${data.lastName || ''}`.trim() : null) || 
    raw.name || raw.fullName;

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

  // Extract Role
  let role = String(data.role || data.userRole || raw.role || 'OWNER').toUpperCase() as any;
  const validRoles = ['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'CONSULTANT', 'OWNER', 'MANAGER', 'FINANCIAL_OFFICER'];
  if (!validRoles.includes(role)) {
    if (role.includes('ADMIN')) role = 'ADMIN';
    else if (role.includes('ANALYS') || role.includes('ANALISTA')) role = 'ANALYST';
    else if (role.includes('CONSULT')) role = 'CONSULTANT';
    else if (role.includes('GEST') || role.includes('MANAG')) role = 'MANAGER';
    else if (role.includes('FINAN')) role = 'FINANCIAL_OFFICER';
    else role = 'OWNER';
  }

  // Extract Industry / Sector
  let rawIndustry = data.industry || data.sector || data.orgSector || raw.industry || raw.sector ||
    (data.organization && (data.organization.industry || data.organization.sector)) || 
    'AGRICULTURE';
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

  // Extract Organization Name
  const organizationName = data.organizationName || data.orgName || data.companyName || data.cooperativeName || raw.organizationName ||
    (data.organization && (data.organization.name || data.organization.organizationName)) || null;

  // Extract Organization ID
  const organizationId = data.organizationId || data.orgId || raw.organizationId ||
    (data.organization && (data.organization.id || data.organization._id)) || null;

  // Extract Province / Location
  const province = data.province || data.location || data.address || raw.province ||
    (data.organization && data.organization.province) || 'Luanda';

  // Extract Maturity
  let maturity = String(data.maturity || data.maturityLevel || raw.maturity || 'INTERMEDIATE').toUpperCase() as any;
  if (!['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(maturity)) {
    maturity = 'INTERMEDIATE';
  }

  // Extract Funding Score / Credit Score
  const fundingScore = Number(data.fundingScore || data.creditScore || data.score || raw.fundingScore || 68);

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
        const res = await fetch(getApiUrl(`/api/auth/me/${savedUserId}`));
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
            if (rawData.token || rawData.accessToken) {
              safeStorage.setItem('olo_fintel_token', rawData.token || rawData.accessToken);
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
        return { success: false, error: errorData.error || errorData.message || 'Credenciais inválidas.' };
      }

      const rawUser = await res.json();
      const normalized = normalizeUser(rawUser);
      setUser(normalized);
      safeStorage.setItem('olo-fintel-userId', normalized.id);
      safeStorage.setItem('olo_fintel_cached_user', JSON.stringify(normalized));
      if (rawUser.token || rawUser.accessToken) {
        safeStorage.setItem('olo_fintel_token', rawUser.token || rawUser.accessToken);
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
        safeStorage.setItem('olo_fintel_token', rawUser.token || rawUser.accessToken);
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
