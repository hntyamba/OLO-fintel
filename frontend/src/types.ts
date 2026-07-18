export enum Role {
  Owner = "Owner",
  Manager = "Manager",
  FinancialOfficer = "FinancialOfficer",
  Analyst = "Analyst",
  Consultant = "Consultant",
  Member = "Member",
  Jury = "Jury"
}

export enum Sector {
  Agriculture = "Agriculture",
  Livestock = "Livestock",
  Fisheries = "Fisheries",
  Commerce = "Commerce"
}

export type ThemePreference = "light" | "dark" | "system";

export enum DocumentStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected"
}

export interface Document {
  id: string;
  name: string;
  category: string;
  status: DocumentStatus;
  uploadedAt: string;
  size: string;
  url: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  type: "revenue" | "expense";
  category: string;
  amount: number;
  date: string;
  description: string;
  responsible: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  stage: "Lead" | "Contacted" | "Negotiation" | "Contract" | "Cliente";
  value: number;
  phone: string;
  email: string;
  updatedAt: string;
}

// Sector Specific Types
export interface Plot {
  id: string;
  name: string;
  area: number; // in hectares
  soilType: string;
  crop: string;
  status: "Preparação" | "Plantado" | "Crescimento" | "Colheita";
}

export interface CropCycle {
  id: string;
  crop: string;
  variety: string;
  plotId: string;
  plotName: string;
  plantedDate: string;
  harvestDateExpected: string;
  quantityPlanted: number;
  status: "Ativo" | "Concluído";
}

export interface AnimalBatch {
  id: string;
  species: string;
  breed: string;
  count: number;
  birthDate: string;
  avgWeight: number;
  healthStatus: "Excelente" | "Observação" | "Tratamento";
  lastVaccination: string;
}

export interface Vessel {
  id: string;
  name: string;
  registration: string;
  capacity: number; // in tons
  status: "Disponível" | "Em Viagem" | "Manutenção";
}

export interface FishingTrip {
  id: string;
  vesselId: string;
  vesselName: string;
  departureDate: string;
  returnDate: string;
  catchQty: number; // in kg
  mainSpecies: string;
  fuelCost: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
}

// Survey Validation Module Types
export interface SurveyResponse {
  id: string;
  timestamp: string;
  persona: string;
  sector: string;
  province: string;
  managementTool: string;
  biggestChallenge: string;
  fundingHistory: string;
  aiValueRating: number; // 1-5
  organizationName?: string;
  email?: string;
  phone?: string;
}

export interface SurveyStats {
  totalResponses: number;
  goal: number;
  byProvince: Record<string, number>;
  bySector: Record<string, number>;
  byPersona: Record<string, number>;
  byChallenge: Record<string, number>;
  byTool: Record<string, number>;
  byFunding: Record<string, number>;
  avgAiRating: number;
}
