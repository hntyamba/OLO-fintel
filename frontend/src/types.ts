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
  type: 'HARVEST' | 'ANIMAL' | 'CATCH' | 'SALE' | 'EXPENSE' | 'LABOR' | 'FAMILY_CONSUMPTION' | 'FIXED_ASSET' | 'PEST_MONITORING';
  date: string;
  title: string;
  quantity?: number;
  unit?: string;
  amount?: number;
  notes?: string;
}

export interface ProductionRecord {
  id: string;
  orgId?: string;
  sector: IndustrySector;
  date: string;
  item: string;
  varietyOrSpecies?: string;
  quantity: number;
  unit: string;
  losses?: number;
  quality?: string;
  fieldOrBatchOrVessel?: string;
  responsible?: string;
  estimatedValue?: number;
  notes?: string;
}

export interface LaborRecord {
  id: string;
  orgId?: string;
  sector: IndustrySector;
  date: string;
  workerName: string;
  roleOrTask: string; // 'Monda', 'Capina', 'Ordenha', 'Tripulação', 'Caixa', 'Vigilância'
  workersCount: number;
  hoursWorked: number;
  dailyRate: number; // Kz per day or per worker
  totalCost: number; // Kz
  paymentStatus: 'PAID' | 'PENDING' | 'ADVANCED';
  fieldOrLocation?: string;
  notes?: string;
}

export interface CashInflowRecord {
  id: string;
  orgId?: string;
  sector: IndustrySector;
  date: string;
  title: string;
  amount: number;
  category: 'SALE_PRODUCT' | 'DIRECT_MARKET' | 'SUBSIDY' | 'SERVICES' | 'ADVANCE' | 'OTHER';
  clientOrSource: string;
  paymentMethod: 'CASH' | 'TPA' | 'BANK_TRANSFER' | 'MOBILE_MONEY';
  invoiceOrReceiptRef?: string;
  notes?: string;
}

export interface CashOutflowRecord {
  id: string;
  orgId?: string;
  sector: IndustrySector;
  date: string;
  title: string;
  amount: number;
  category: 'INPUTS_SEEDS_FERTILIZER' | 'FEED_VACCINES' | 'FUEL_ENERGY' | 'LABOR_PAYROLL' | 'MAINTENANCE_PARTS' | 'FREIGHT_LOGISTICS' | 'FEES_LICENSES' | 'OTHER';
  supplierOrBeneficiary: string;
  costCenter: string;
  paymentMethod: 'CASH' | 'TPA' | 'BANK_TRANSFER';
  invoiceOrReceiptRef?: string;
  notes?: string;
}

export interface FamilyConsumptionRecord {
  id: string;
  orgId?: string;
  sector: IndustrySector;
  date: string;
  product: string;
  quantity: number;
  unit: string;
  marketUnitValue: number; // Kz per unit
  totalEstimatedValue: number; // Kz value consumed
  beneficiariesCount: number; // Number of family members fed
  originFieldOrBatch: string;
  purpose: 'FAMILY_MEALS' | 'COMMUNITY_WORKERS_FOOD' | 'TRADITIONAL_EVENT' | 'RESERVE';
  notes?: string;
}

export interface FixedAssetRecord {
  id: string;
  orgId?: string;
  sector: IndustrySector;
  name: string;
  assetCategory: 'TRACTOR_MACHINERY' | 'VESSEL_ENGINE' | 'BREEDING_LIVESTOCK' | 'SOLAR_PUMP_IRRIGATION' | 'BUILDING_STORAGE' | 'COMMERCIAL_VEHICLE' | 'COLD_ROOM_FREEZER' | 'PROCESSING_EQUIPMENT';
  identifierOrPlate?: string;
  acquisitionDate: string;
  acquisitionCost: number; // Kz
  currentCondition: 'EXCELLENT' | 'OPERATIONAL' | 'NEEDS_MAINTENANCE' | 'OUT_OF_SERVICE';
  usefulLifeYears: number;
  depreciationAnnualRate: number; // %
  currentEstimatedValue: number; // Kz
  locationOrPlot?: string;
  responsible?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  notes?: string;
}

export interface PestMonitoringRecord {
  id: string;
  orgId?: string;
  sector: IndustrySector;
  inspectionDate: string;
  pestOrDiseaseName: string; // Ex: 'Lagarta do Cartucho', 'Febre Aftosa', 'Parasitas de Guelras', 'Gorgulho do Grão'
  severity: 'LOW' | 'MEDIUM' | 'CRITICAL_OUTBREAK';
  affectedAreaOrUnits: string; // Ex: '2.5 hectares', '15 cabeças de gado', 'Lote 3'
  symptomsObserved: string;
  actionTaken: 'BIOLOGICAL_CONTROL' | 'CHEMICAL_SPRAY' | 'ISOLATION_QUARANTINE' | 'VACCINATION_DIPPING' | 'AERATION_SANITATION' | 'MONITORING_ONLY';
  productsApplied?: string;
  interventionCost?: number;
  resolutionStatus: 'ACTIVE_MONITORING' | 'UNDER_CONTROL' | 'RESOLVED' | 'ESCALATED';
  inspectorName: string;
  notes?: string;
}

export interface DocumentRecord {
  id: string;
  orgId: string;
  organizationId?: string;
  name: string;
  title?: string;
  type: string;
  category?: string;
  fileBase64?: string;
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
