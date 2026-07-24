/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'ANALYST' 
  | 'CONSULTANT' 
  | 'OWNER' 
  | 'MANAGER' 
  | 'FINANCIAL_OFFICER';

export type IndustrySector = 
  | 'AGRICULTURE' 
  | 'LIVESTOCK' 
  | 'FISHERIES' 
  | 'COMMERCE' 
  | 'TRANSPORT';

export type MaturityLevel = 
  | 'BEGINNER' 
  | 'INTERMEDIATE' 
  | 'ADVANCED';

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
  fundingScore: number; // 0 to 100
}

export interface SurveyResponse {
  id: string;
  persona: string;
  organizationName: string;
  sector: IndustrySector;
  province: string;
  usesPaper: boolean;
  usesExcel: boolean;
  usesWhatsApp: boolean;
  biggestChallenge: string;
  fundingHistory: 'APPROVED' | 'REJECTED' | 'NEVER';
  operationalAnalyticsRating: number; // 1-5
  aiConsultingRating: number; // 1-5
  createdAt: string;

  // Rich new strategic fields
  A1_usesPaper?: boolean;
  A1_usesExcel?: boolean;
  A1_usesWhatsApp?: boolean;
  A1_usesBillingSoftware?: boolean;
  A1_usesNone?: boolean;
  A2_lostHours?: string; // 'LESS_2' | '3_5' | '6_10' | 'MORE_10'
  A3_lostSales?: string; // 'NONE' | '1_3' | '4_6' | 'MORE_6'
  B1_appliedFunding?: string; // 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'NEVER'
  B2_rejectionReason?: string | null;
  B3_trustReport?: string; // 'YES' | 'MAYBE' | 'NO'
  C1_profitMarginIdea?: string; // 'YES' | 'MAYBE' | 'NO'
  C2_biggestHeadache?: string;
  C3_sectorConditionalAnswer?: string;
  D1_probabilityToUse?: string; // '0_20' | '21_50' | '51_80' | '81_100'
  D2_shareRealData?: string; // 'ALL_GOLD' | 'AGGREGATED_SILVER' | 'FICTIONAL_BRONZE'
  D3_willingToPay?: string; // 'UP_2500' | '2500_7500' | 'MORE_7500' | 'FREE'
  E1_orgName?: string;
  E2_nif?: string;
  E3_sector?: string;
  E4_province?: string;
  E5_employeeCount?: string; // '1_5' | '6_20' | '21_100' | 'MORE_100'
  E6_persona?: string;
  E7_contact?: string;
  adoptionScore?: number;
  painLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
  isHighIntent?: boolean;
  isUrgentPain?: boolean;
}

export interface OperationalRecord {
  id: string;
  orgId: string;
  type: 'HARVEST' | 'ANIMAL' | 'CATCH' | 'SALE' | 'EXPENSE';
  date: string;
  title: string;
  quantity?: number;
  unit?: string;
  amount?: number;
  notes?: string;
}

export interface DocumentRecord {
  id: string;
  orgId: string;
  name: string;
  type: 'NIF' | 'ID_CARD' | 'BANK_STATEMENT' | 'LICENSE' | 'ESTATUTO' | 'CERTIFICADO';
  uploadedAt: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  feedback?: string;
  version?: number;
  history?: Array<{
    version: number;
    name: string;
    uploadedAt: string;
    actionBy: string;
    actionType: 'UPLOAD' | 'REPLACE' | 'APPROVED' | 'REJECTED';
    feedback?: string;
  }>;
}

export interface Organization {
  id: string;
  name: string;
  sector: IndustrySector;
  province: string;
  maturity: MaturityLevel;
  assignedConsultantId: string | null;
  suspended: boolean;
  suspendedReason?: string;
}

export interface Consultant {
  id: string;
  name: string;
  email: string;
  assignedOrgs: string[]; // Org IDs
}
