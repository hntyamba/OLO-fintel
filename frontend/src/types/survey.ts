export interface SurveyStats {
  totalResponses: number;
  goal?: number;
  count?: number;
  avgAiRating?: number;
  bySector: Record<string, number>;
  byProvince: Record<string, number>;
  byChallenge: Record<string, number>;
  byPersona?: Record<string, number>;
  byTool?: Record<string, number>;
}

export interface SurveyResponse {
  id: string;
  persona: string;
  organizationName: string;
  sector: import('./organization').IndustrySector;
  province: string;
  usesPaper: boolean;
  usesExcel: boolean;
  usesWhatsApp: boolean;
  biggestChallenge: string;
  fundingHistory: 'APPROVED' | 'REJECTED' | 'NEVER';
  operationalAnalyticsRating: number;
  aiConsultingRating: number;
  createdAt: string;
  A1_usesPaper?: boolean;
  A1_usesExcel?: boolean;
  A1_usesWhatsApp?: boolean;
  A1_usesBillingSoftware?: boolean;
  A1_usesNone?: boolean;
  A2_lostHours?: string;
  A3_lostSales?: string;
  B1_appliedFunding?: string;
  B2_rejectionReason?: string | null;
  B3_trustReport?: string;
  C1_profitMarginIdea?: string;
  C2_biggestHeadache?: string;
  C3_sectorConditionalAnswer?: string;
  D1_probabilityToUse?: string;
  D2_shareRealData?: string;
  D3_willingToPay?: string;
  E1_orgName?: string;
  E2_nif?: string;
  E3_sector?: string;
  E4_province?: string;
  E5_employeeCount?: string;
  E6_persona?: string;
  E7_contact?: string;
  adoptionScore?: number;
  painLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
  isHighIntent?: boolean;
  isUrgentPain?: boolean;
}
