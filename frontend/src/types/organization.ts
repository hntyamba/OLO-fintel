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
  assignedOrgs: string[];
}
