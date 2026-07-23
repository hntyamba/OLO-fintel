export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'revenue' | 'expense';
  category: string;
  responsible?: string;
}

export interface HRMember {
  id: string;
  name: string;
  role: string;
  contact: string;
  dailyWage: number;
  status: "Ativo" | "Inativo";
  admissionDate: string;
}

export interface MachineryItem {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  status: "Operacional" | "Manutenção" | "Inativo";
  fuelConsumption: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

export interface InsumoItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  costPrice: number;
  supplierId: string;
}

export interface ProductionCycle {
  id: string;
  name: string;
  sector: "Agriculture" | "Livestock" | "Fisheries" | "Commerce";
  startDate: string;
  endDate: string;
  budgetForecast: number;
  actualCosts: number;
  targetOutput: number;
  currentOutput: number;
  status: "Preparação" | "Ativo" | "Crescimento" | "Colheita" | "Concluído";
}

export interface DailyProduction {
  id: string;
  date: string;
  cycleId: string;
  cycleTitle: string;
  quantity: number;
  unit: string;
  operatorName: string;
  notes: string;
}

export interface Partner {
  id: string;
  type: "supplier" | "client";
  name: string;
  nif: string;
  phone: string;
  email: string;
  address: string;
  balance: number;
}

export interface AssetLiability {
  id: string;
  type: "asset" | "liability";
  name: string;
  category: string;
  value: number;
  description: string;
  date: string;
}

export interface ERPData {
  humanResources: HRMember[];
  machinery: MachineryItem[];
  insumos: InsumoItem[];
  cycles: ProductionCycle[];
  production: DailyProduction[];
  partners: Partner[];
  assetsLiabilities: AssetLiability[];
  transactions: Transaction[];
}
