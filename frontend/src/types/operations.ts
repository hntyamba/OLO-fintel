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

export enum Role {
  Owner = 'Owner',
  Manager = 'Manager',
  FinancialOfficer = 'FinancialOfficer',
  Analyst = 'Analyst',
  Consultant = 'Consultant',
  Member = 'Member',
  Jury = 'Jury'
}

export enum Sector {
  Agriculture = 'Agriculture',
  Livestock = 'Livestock',
  Fisheries = 'Fisheries',
  Commerce = 'Commerce'
}
