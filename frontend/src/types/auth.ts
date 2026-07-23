export type ThemePreference = 'light' | 'dark' | 'system';

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'ANALYST' 
  | 'CONSULTANT' 
  | 'OWNER' 
  | 'MANAGER' 
  | 'FINANCIAL_OFFICER';

export interface UserContext {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  industry: IndustrySector | null;
  maturity: MaturityLevel;
  organizationId: string | null;
  organizationName: string | null;
  province: string | null;
  fundingScore: number;
}

import type { IndustrySector, MaturityLevel } from './organization';
