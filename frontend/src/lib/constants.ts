import {
  Sprout,
  Beef,
  Fish,
  ShoppingBag,
  Truck,
  Users,
  Building2,
  Scale,
  FileText,
  HandCoins,
  BrainCircuit,
  Settings,
  Briefcase,
  ClipboardCheck,
  Search,
  UserCheck,
  BookOpen,
  Activity,
  BarChart3,
  MessageSquare,
} from 'lucide-react';
import type { UserRole, IndustrySector } from '../types';

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  ANALYST: 'Analista',
  CONSULTANT: 'Consultor',
  OWNER: 'Proprietário',
  MANAGER: 'Gestor',
  FINANCIAL_OFFICER: 'Gestor Financeiro',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: 'bg-red-100 text-red-700',
  ADMIN: 'bg-purple-100 text-purple-700',
  ANALYST: 'bg-blue-100 text-blue-700',
  CONSULTANT: 'bg-emerald-100 text-emerald-700',
  OWNER: 'bg-amber-100 text-amber-700',
  MANAGER: 'bg-cyan-100 text-cyan-700',
  FINANCIAL_OFFICER: 'bg-indigo-100 text-indigo-700',
};

export const SECTOR_LABELS: Record<IndustrySector, string> = {
  AGRICULTURE: 'Agricultura',
  LIVESTOCK: 'Pecuária',
  FISHERIES: 'Pesca',
  COMMERCE: 'Comércio',
  TRANSPORT: 'Transporte',
};

export const SECTOR_ICONS: Record<IndustrySector, typeof Sprout> = {
  AGRICULTURE: Sprout,
  LIVESTOCK: Beef,
  FISHERIES: Fish,
  COMMERCE: ShoppingBag,
  TRANSPORT: Truck,
};

export const SECTOR_COLORS: Record<IndustrySector, string> = {
  AGRICULTURE: 'bg-green-100 text-green-700',
  LIVESTOCK: 'bg-orange-100 text-orange-700',
  FISHERIES: 'bg-blue-100 text-blue-700',
  COMMERCE: 'bg-purple-100 text-purple-700',
  TRANSPORT: 'bg-yellow-100 text-yellow-700',
};

export const PROVINCES = [
  'Bengo',
  'Benguela',
  'Bié',
  'Cabinda',
  'Cuando-Cubango',
  'Cuanza Norte',
  'Cuanza Sul',
  'Cunene',
  'Huambo',
  'Huíla',
  'Icolo e Bengo',
  'Luanda',
  'Lunda Norte',
  'Lunda Sul',
  'Malanje',
  'Moxico',
  'Namibe',
  'Uíge',
  'Zaire',
];

export const DOCUMENT_TYPES = [
  'NIF',
  'ID_CARD',
  'BANK_STATEMENT',
  'LICENSE',
  'ESTATUTO',
  'CERTIFICADO',
] as const;

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  NIF: 'NIF',
  ID_CARD: 'Bilhete de Identidade',
  BANK_STATEMENT: 'Extrato Bancário',
  LICENSE: 'Alvará',
  ESTATUTO: 'Estatuto',
  CERTIFICADO: 'Certificado',
};

export const NAVIGATION_CONFIG = {
  cooperative: [
    { id: 'overview', label: 'Dashboard', icon: BarChart3, path: '/app/overview' },
    { id: 'operations', label: 'Operações', icon: Activity, path: '/app/operations' },
    { id: 'finance', label: 'Financeiro', icon: Scale, path: '/app/finance' },
    { id: 'crm', label: 'CRM & Vendas', icon: Users, path: '/app/crm' },
    { id: 'documents', label: 'Documentos', icon: FileText, path: '/app/documents' },
    { id: 'funding', label: 'Funding', icon: HandCoins, path: '/app/funding' },
    { id: 'ai-center', label: 'Consultor IA', icon: BrainCircuit, path: '/app/ai-center' },
    { id: 'support-costs', label: 'Custos Suporte', icon: Building2, path: '/app/support-costs' },
    { id: 'ledger', label: 'Livro Razo', icon: BookOpen, path: '/app/ledger' },
  ],
  superAdmin: [
    { id: 'ecosystem', label: 'Ecossistema', icon: Building2, path: '/app/admin/ecosystem' },
    { id: 'users', label: 'Utilizadores', icon: UserCheck, path: '/app/admin/users' },
    { id: 'kyc', label: 'Fila KYC', icon: ClipboardCheck, path: '/app/admin/kyc' },
    { id: 'survey', label: 'Motor Survey', icon: Search, path: '/app/admin/survey' },
    { id: 'consultants', label: 'Delegar Consultores', icon: Users, path: '/app/admin/consultants' },
    { id: 'logs', label: 'Sistema', icon: Settings, path: '/app/admin/logs' },
  ],
  analyst: [
    { id: 'applications', label: 'Aplicações', icon: Briefcase, path: '/app/analyst/applications' },
    { id: 'scoring', label: 'Scoring', icon: BarChart3, path: '/app/analyst/scoring' },
    { id: 'doc-review', label: 'Revisão Docs', icon: FileText, path: '/app/analyst/docs' },
    { id: 'workflow', label: 'Workflow', icon: Activity, path: '/app/analyst/workflow' },
  ],
  consultant: [
    { id: 'clients', label: 'Clientes', icon: Users, path: '/app/consultant/clients' },
    { id: 'plans', label: 'Planos de Ação', icon: ClipboardCheck, path: '/app/consultant/plans' },
    { id: 'ai-recs', label: 'Recomendações IA', icon: BrainCircuit, path: '/app/consultant/ai-recs' },
  ],
} as const;

export const COLORS = {
  petroleumBlue: '#0D1B2A',
  corporateGreen: '#0DA676',
  turquoise: '#17C39B',
  white: '#FFFFFF',
  neutralBg: '#F4F6F8',
  grayMedium: '#6B7280',
  grayLight: '#E5E7EB',
  success: '#0DA676',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  darkBg: '#0E0E12',
  darkSurface: '#1A1A21',
  darkBorder: '#2A2A35',
  darkTextPrimary: '#F5F5F7',
  darkTextSecondary: '#A1A1AA',
} as const;
