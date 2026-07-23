export enum DocumentStatus {
  Approved = 'Approved',
  Pending = 'Pending',
  Rejected = 'Rejected'
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
