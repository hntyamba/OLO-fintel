/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './AuthContext.js';
import { useLanguage } from './LanguageContext.js';
import { useTheme } from './ThemeContext.js';
import { getApiUrl, safeStorage } from '../lib/api';
import { 
  ShieldCheck, 
  Users, 
  Check, 
  X, 
  Plus, 
  Upload, 
  Trash2, 
  FileText, 
  Eye, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Briefcase, 
  Sprout, 
  Ship, 
  ShoppingBag, 
  UserCheck, 
  Layers, 
  Calendar, 
  Sun, 
  Moon, 
  AlertTriangle,
  FileCheck2,
  ListTodo,
  Compass,
  Wrench,
  CloudSun,
  Coins,
  HeartPulse,
  Boxes,
  FileSpreadsheet,
  Users2,
  Menu,
  Command,
  Camera,
  MapPin,
  CornerDownLeft,
  CheckCircle,
  CheckCircle2,
  RotateCcw,
  Receipt,
  Sliders,
  Clock,
  Bell,
  Zap,
  Flame
} from 'lucide-react';
import { OperationalRecord, DocumentRecord, Organization, UserContext } from '../types.js';
import SectorOperationalDashboard from './SectorOperationalDashboard.js';
import FinancialModule from './FinancialModule.js';
import CommercialCRMModule from './CommercialCRMModule.js';
import DocumentKYCModule from './DocumentKYCModule.js';
import FundingReadinessModule from './FundingReadinessModule.js';
import AICenterModule from './AICenterModule.js';
import UserProfileModule from './UserProfileModule.js';
import SupportCostsModule from './SupportCostsModule.js';
import BackendConnectionManager from './BackendConnectionManager.js';
import Quick30SecLogger from './Quick30SecLogger.js';

interface SurveyStats {
  totalResponses: number;
  targetGoal: number;
  progressPercentage: number;
  byProvince: Record<string, number>;
  bySector: Record<string, number>;
  // Opcional: Se o seu backend também devolver a lista de respostas detalhadas
  rawResponses?: Array<{
    id: string;
    payload: {
      E1_orgName?: string;
      E3_sector?: string;
      E2_province?: string;
      C2_biggestHeadache?: string;
      A1_usesPaper?: boolean;
      A1_usesExcel?: boolean;
      A1_usesWhatsApp?: boolean;
    }
  }>;
}

export function getNormalizedSector(industry?: string | null, orgName?: string | null): 'AGRICULTURE' | 'LIVESTOCK' | 'FISHERIES' | 'COMMERCE' {
  const ind = (industry || '').toUpperCase();
  if (ind === 'FISHERIES' || ind.includes('PESCA') || ind.includes('FISH')) return 'FISHERIES';
  if (ind === 'LIVESTOCK' || ind.includes('PECUAR') || ind.includes('LIVESTOCK')) return 'LIVESTOCK';
  if (ind === 'COMMERCE' || ind.includes('COMERC') || ind.includes('COMMERCE')) return 'COMMERCE';
  if (ind === 'AGRICULTURE' || ind.includes('AGRI')) return 'AGRICULTURE';

  const combined = `${industry || ''} ${orgName || ''}`.toUpperCase();
  if (combined.includes('FISHERIES') || combined.includes('PESCA') || combined.includes('FISH') || combined.includes('MAR') || combined.includes('EMBARCA') || combined.includes('CAPTUR')) {
    return 'FISHERIES';
  }
  if (combined.includes('LIVESTOCK') || combined.includes('PECUAR') || combined.includes('GADO') || combined.includes('ANIMAL') || combined.includes('REBANHO') || combined.includes('BOVINO')) {
    return 'LIVESTOCK';
  }
  if (combined.includes('COMMERCE') || combined.includes('COMERC') || combined.includes('RETAIL') || combined.includes('LOJA') || combined.includes('VENDA')) {
    return 'COMMERCE';
  }
  return 'AGRICULTURE';
}

export default function Dashboards() {
  const { user, logout, refreshUser } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const token = safeStorage.getItem('olo_fintel_token');

  const userSector = user ? getNormalizedSector(user.industry, user.organizationName) : null;
  const canSwitchSectors = !user?.industry || ['SUPER_ADMIN', 'ANALYST', 'CONSULTANT'].includes(user?.role || '');

  // survey engine
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [surveyList, setSurveyList] = useState<any[]>([]); // Começa vazio e é preenchido pela API
  const [questionStats, setQuestionStats] = useState<any[]>([]);
  const [surveyInfo, setSurveyInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Shared state
  const [showProfile, setShowProfile] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [documentsQueue, setDocumentsQueue] = useState<DocumentRecord[]>([]);
  const [operationalLogs, setOperationalLogs] = useState<OperationalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms and Modals
  const [showLogModal, setShowLogModal] = useState(false);
  const [logType, setLogType] = useState<'HARVEST' | 'ANIMAL' | 'CATCH' | 'SALE' | 'EXPENSE'>('SALE');
  const [logForm, setLogForm] = useState({
    title: '',
    quantity: '',
    unit: 'kg',
    amount: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [showDocModal, setShowDocModal] = useState(false);
  const [docType, setDocType] = useState<'NIF' | 'ID_CARD' | 'BANK_STATEMENT' | 'LICENSE'>('NIF');
  const [docFileName, setDocFileName] = useState('');

  // Score Simulation state
  const [simRevenueIncrease, setSimRevenueIncrease] = useState<number>(0);
  const [simResolvedChecklist, setSimResolvedChecklist] = useState<number>(0);

  // Drag-and-drop simulation / Delegation
  const [activeOrgToAssign, setActiveOrgToAssign] = useState<string | null>(null);

  // Analyst state
  const [selectedApp, setSelectedApp] = useState<Organization | null>(null);
  const [analystFeedback, setAnalystFeedback] = useState('');

  // Consultant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiPlan, setAiPlan] = useState<string[]>([]);
  const [activeClient, setActiveClient] = useState<string | null>(null);

  // SuperAdmin Suspension Modal
  const [suspensionOrgId, setSuspensionOrgId] = useState<string | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');

  // Lightbox view for documents
  const [viewingDoc, setViewingDoc] = useState<DocumentRecord | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);

  // Interactive Popup Modals replacing alerts
  const [scoreReportOrgModal, setScoreReportOrgModal] = useState<Organization | null>(null);
  const [customNotificationModal, setCustomNotificationModal] = useState<{ title: string; message: string; type?: 'success' | 'info' | 'warning' } | null>(null);

  // Role-specific Tab States
  const [superAdminTab, setSuperAdminTab] = useState<'ecosystem' | 'users' | 'kyc' | 'survey' | 'logs' | 'consultants'>('ecosystem');
  const [adminTab, setAdminTab] = useState<'organizations' | 'invites' | 'delegation'>('organizations');
  const [analystTab, setAnalystTab] = useState<'applications' | 'scoring' | 'docs' | 'workflow'>('applications');
  const [consultantTab, setConsultantTab] = useState<'clients' | 'plans' | 'ai_recs'>('clients');

  // Cooperative user active tab state (for single page/module per screen sidebar navigation)
  const [coopTab, setCoopTab] = useState<'overview' | 'operations' | 'finance' | 'crm' | 'documents' | 'credit' | 'ai_center' | 'ledger' | 'overheads'>('overview');
  const [financeSubTab, setFinanceSubTab] = useState<'receitas_despesas' | 'fluxo_caixa' | 'rentabilidade' | 'planeamento' | 'ar_ap' | 'ativos' | 'relatorios'>('receitas_despesas');
  const [crmSubTab, setCrmSubTab] = useState<'pipeline' | 'clientes' | 'fornecedores' | 'contratos'>('pipeline');
  const [docsSubTab, setDocsSubTab] = useState<'meus-documentos' | 'fila-kyc'>('meus-documentos');
  const [overheadsSubTab, setOverheadsSubTab] = useState<'dashboard' | 'rh' | 'maquinas' | 'utilitarios'>('dashboard');

  // Offline support simulation states
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [offlineCache, setOfflineCache] = useState<OperationalRecord[]>([]);
  const [syncingOffline, setSyncingOffline] = useState<boolean>(false);

  // PWA installer support simulation states
  const [pwaInstalled, setPwaInstalled] = useState<boolean>(() => {
    return localStorage.getItem('olo-pwa-installed') === 'true';
  });
  const [showPwaModal, setShowPwaModal] = useState<boolean>(false);

  // Mobile sidebar open state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Quick 30-Sec Logger Modal state
  const [quickLoggerModalOpen, setQuickLoggerModalOpen] = useState<boolean>(false);

  // Operational Alerts, Resolved Alerts and Modal states
  const [selectedAlertSector, setSelectedAlertSector] = useState<'ALL' | 'AGRICULTURE' | 'LIVESTOCK' | 'FISHERIES' | 'COMMERCE'>(
    () => {
      if (userSector) return userSector;
      const ind = user?.industry;
      if (ind && ['AGRICULTURE', 'LIVESTOCK', 'FISHERIES', 'COMMERCE'].includes(ind)) {
        return ind as any;
      }
      return 'ALL';
    }
  );

  useEffect(() => {
    if (superAdminTab !== 'survey') return;

    const loadRealSurveyData = async () => {
      setLoading(true);
      setError(null);
      try {
        let response = await fetch(getApiUrl('/api/v1/surveys/jury-dashboard'), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok && response.status !== 401 && response.status !== 403) {
          response = await fetch(getApiUrl('/api/v1/surveys/responses'), {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }

        if (response.status === 401 || response.status === 403) {
          setError('Acesso negado. Requer o papel de Júri ou Administrador.');
          return;
        }

        const data = await response.json().catch(() => ({}));

        const surveyObj = data.survey || data.data?.survey || null;
        const qStats = data.questionStats || data.data?.questionStats || [];
        setSurveyInfo(surveyObj);
        setQuestionStats(qStats);

        let rawResponses = data.responses || data.data?.responses || (Array.isArray(data.data) ? data.data : []);

        // If rawResponses is empty or not array, reconstruct from questionStats sample texts returned by Render backend
        if ((!Array.isArray(rawResponses) || rawResponses.length === 0) && qStats.length > 0) {
          const orgQuestion = qStats.find((q: any) => q.id === 'E1_orgName');
          const nifQuestion = qStats.find((q: any) => q.id === 'E2_nif');
          const headacheQuestion = qStats.find((q: any) => q.id === 'C2_biggestHeadache');
          const contactQuestion = qStats.find((q: any) => q.id === 'E7_contact');

          const sampleOrgs = orgQuestion?.stats?.sampleTexts || [];
          const sampleNifs = nifQuestion?.stats?.sampleTexts || [];
          const sampleHeadaches = headacheQuestion?.stats?.sampleTexts || [];
          const sampleContacts = contactQuestion?.stats?.sampleTexts || [];

          const count = Math.max(sampleOrgs.length, surveyObj?.responsesCount || 3);
          const reconstructed: any[] = [];

          for (let i = 0; i < count; i++) {
            reconstructed.push({
              id: `resp-${i + 1}`,
              payload: {
                E1_orgName: sampleOrgs[i] || (i === 0 ? 'Serra da Leba' : i === 1 ? 'Deus é Grande' : 'Luz do dia'),
                E2_nif: sampleNifs[i] || (i === 0 ? '242353456436' : i === 1 ? '8745675645' : '283968246238'),
                E3_sector: i === 0 ? 'AGRICULTURE' : i === 1 ? 'LIVESTOCK' : 'COMMERCE',
                E4_province: i === 0 ? 'Malanje' : i === 1 ? 'Luanda' : 'Bié',
                C2_biggestHeadache: sampleHeadaches[i] || 'Controlar despesas operacionais e impostos/NIF.',
                E7_contact: sampleContacts[i] || (i === 0 ? '9785673456' : i === 1 ? '934567278' : '9732643434'),
                A1_usesPaper: i % 2 === 0,
                A1_usesExcel: i % 2 !== 0,
                A1_usesWhatsApp: true,
                D1_probabilityToUse: '81_100',
                D3_willingToPay: 'MORE_7500'
              }
            });
          }
          rawResponses = reconstructed;
        }

        // Fallback to local storage or seed data if API didn't return responses list
        if (!Array.isArray(rawResponses) || rawResponses.length === 0) {
          try {
            rawResponses = JSON.parse(safeStorage.getItem('olo_fintel_survey_submissions') || '[]');
          } catch {
            rawResponses = [];
          }
        }

        // Default seed fallback if still empty
        if (!rawResponses || rawResponses.length === 0) {
          rawResponses = [
            {
              id: 'sub-1001',
              adoptionScore: 78,
              isHighIntent: true,
              isUrgentPain: true,
              payload: {
                E1_orgName: 'Serra da Leba',
                E3_sector: 'AGRICULTURE',
                E4_province: 'Malanje',
                C2_biggestHeadache: 'Controlar as despesas operacionais (combustível, ração, insumos, sementes).',
                A1_usesPaper: true,
                A1_usesExcel: false,
                A1_usesWhatsApp: true,
                E2_nif: '242353456436',
                E7_contact: '9785673456',
                D1_probabilityToUse: '51_80',
                D3_willingToPay: 'MORE_7500'
              }
            },
            {
              id: 'sub-1002',
              adoptionScore: 65,
              isHighIntent: false,
              isUrgentPain: false,
              payload: {
                E1_orgName: 'Deus é Grande',
                E3_sector: 'LIVESTOCK',
                E4_province: 'Luanda',
                C2_biggestHeadache: 'Preencher papelada para o governo / licenças / impostos (NIF, AGT).',
                A1_usesPaper: false,
                A1_usesExcel: true,
                A1_usesWhatsApp: true,
                E2_nif: '8745675645',
                E7_contact: '934567278',
                D1_probabilityToUse: '21_50',
                D3_willingToPay: 'AGGREGATED_SILVER'
              }
            },
            {
              id: 'sub-1003',
              adoptionScore: 85,
              isHighIntent: true,
              isUrgentPain: true,
              payload: {
                E1_orgName: 'Luz do dia',
                E3_sector: 'COMMERCE',
                E4_province: 'Bié',
                C2_biggestHeadache: 'Preencher papelada para o governo / licenças / impostos (NIF, AGT).',
                A1_usesPaper: true,
                A1_usesExcel: false,
                A1_usesWhatsApp: false,
                E2_nif: '283968246238',
                E7_contact: '9732643434',
                D1_probabilityToUse: '81_100',
                D3_willingToPay: 'MORE_7500'
              }
            }
          ];
        }

        const totalResp = surveyObj?.responsesCount || data.stats?.totalResponses || rawResponses.length;
        const target = surveyObj?.target || data.stats?.targetGoal || 100;

        setStats({
          totalResponses: totalResp,
          targetGoal: target,
          progressPercentage: Math.min(100, Math.round((totalResp / target) * 100)),
          byProvince: data.stats?.byProvince || {},
          bySector: data.stats?.bySector || {}
        });

        const mappedList = rawResponses.map((resp: any) => {
          const p = resp.payload || resp || {};
          return {
            id: resp.id || `sub-${Math.random().toString(36).substring(2, 7)}`,
            orgName: p.E1_orgName || resp.orgName || p.orgName || resp.organizationTypeHint || 'Empresa Anónima',
            sector: p.E3_sector || resp.sector || p.sector || 'AGRICULTURE',
            province: p.E4_province || p.E2_province || resp.provinceHint || p.province || 'Luanda',
            biggestChallenge: p.C2_biggestHeadache || resp.biggestChallenge || p.biggestChallenge || 'Sem descrição.',
            usesPaper: !!(p.A1_usesPaper ?? resp.usesPaper ?? true),
            usesExcel: !!(p.A1_usesExcel ?? resp.usesExcel ?? false),
            usesWhatsApp: !!(p.A1_usesWhatsApp ?? resp.usesWhatsApp ?? true),
            nif: p.E2_nif || resp.nif || '',
            contact: p.E7_contact || resp.contact || '',
            probabilityToUse: p.D1_probabilityToUse || resp.probabilityToUse || '',
            willingToPay: p.D3_willingToPay || resp.willingToPay || '',
            adoptionScore: resp.adoptionScore ?? p.adoptionScore ?? 75,
            isHighIntent: resp.isHighIntent ?? p.isHighIntent ?? false,
            isUrgentPain: resp.isUrgentPain ?? p.isUrgentPain ?? false,
          };
        });

        setSurveyList(mappedList);
      } catch (err) {
        setError('Falha na comunicação com o ecossistema de backend.');
      } finally {
        setLoading(false);
      }
    };

    loadRealSurveyData();
  }, [superAdminTab, token]);

  useEffect(() => {
    if (userSector) {
      setSelectedAlertSector(userSector);
    }
  }, [userSector]);

  const [resolvedAlertIds, setResolvedAlertIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`olo-fintel-resolved-alerts-${user?.id || 'default'}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [successBannerMessage, setSuccessBannerMessage] = useState<string | null>(null);
  const [showGuardianAlertsPopover, setShowGuardianAlertsPopover] = useState<boolean>(false);

  // Alert Action Modal States
  const [motorRevisionModalOpen, setMotorRevisionModalOpen] = useState<boolean>(false);
  const [harvestModalOpen, setHarvestModalOpen] = useState<boolean>(false);
  const [weightingModalOpen, setWeightingModalOpen] = useState<boolean>(false);
  const [priceMarginModalOpen, setPriceMarginModalOpen] = useState<boolean>(false);

  const markAlertResolved = (alertId: string, alertTitle: string) => {
    setResolvedAlertIds(prev => {
      const next = prev.includes(alertId) ? prev : [...prev, alertId];
      localStorage.setItem(`olo-fintel-resolved-alerts-${user?.id || 'default'}`, JSON.stringify(next));
      return next;
    });
    setSuccessBannerMessage(`✅ Alerta resolvido com sucesso: "${alertTitle}"`);
    setTimeout(() => {
      setSuccessBannerMessage(null);
    }, 6000);
  };

  const resetAllAlerts = () => {
    setResolvedAlertIds([]);
    localStorage.removeItem(`olo-fintel-resolved-alerts-${user?.id || 'default'}`);
    setSuccessBannerMessage(`🔄 Alertas contextuais restaurados para demonstração.`);
    setTimeout(() => setSuccessBannerMessage(null), 4000);
  };
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [commandPaletteQuery, setCommandPaletteQuery] = useState<string>('');
  const [commandPaletteActiveOption, setCommandPaletteActiveOption] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [commandPaletteFormData, setCommandPaletteFormData] = useState<Record<string, string>>({});
  const [photoEvidence, setPhotoEvidence] = useState<string | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  // Role-specific Mock Datastores
  const [systemLogs, setSystemLogs] = useState<string[]>([
    `[${new Date(Date.now() - 1200000).toLocaleTimeString()}] [INFO] Ligação estabelecida com API do Banco BAI de Luanda.`,
    `[${new Date(Date.now() - 3600000).toLocaleTimeString()}] [SUCCESS] Documento Estatuto_Social_Publicado.pdf verificado por Sofia Antunes.`,
    `[${new Date(Date.now() - 7200000).toLocaleTimeString()}] [INFO] Utilizador Mateus Gaspar actualizou inventário no Módulo Comercial.`,
    `[${new Date(Date.now() - 10800000).toLocaleTimeString()}] [ALERT] KYC pendente para Cooperativa Luanda Norte (NIF em falta).`,
    `[${new Date(Date.now() - 14400000).toLocaleTimeString()}] [SUCCESS] Nova organização 'Pescas Artesanais do Namibe' registada com sucesso.`,
  ]);

  const [adminInvites, setAdminInvites] = useState([
    { id: 'inv-1', name: 'Sebastião Simão', email: 'sebastiao@olofintel.ao', role: 'MANAGER', status: 'Pendente', sentAt: '2026-07-18' },
    { id: 'inv-2', name: 'Teresa Fonseca', email: 'teresa@olofintel.ao', role: 'FINANCIAL_OFFICER', status: 'Aceite', sentAt: '2026-07-15' },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('MANAGER');

  const [creditApplications, setCreditApplications] = useState([
    { id: 'app-1', orgName: 'Cooperativa Agrícola Humpata', amount: 8500000, term: '24 meses', status: 'Em Análise', step: 2, date: '2026-07-15' },
    { id: 'app-2', orgName: 'Criadores do Planalto Huambo', amount: 15000000, term: '36 meses', status: 'Aprovado', step: 4, date: '2026-07-10' },
    { id: 'app-3', orgName: 'Pescas Artesanais do Namibe', amount: 4500000, term: '12 meses', status: 'Revisão Necessária', step: 1, date: '2026-07-18' },
  ]);

  const [partnerBanks, setPartnerBanks] = useState([
    { id: 'bank-1', name: 'Banco BAI', line: 'Fomento Agrícola LISPA', activeApps: 2, limit: '50.000.000 Kz', status: 'Sincronizado' },
    { id: 'bank-2', name: 'Banco BFA', line: 'Crédito Pesca de Angola', activeApps: 1, limit: '35.000.000 Kz', status: 'Sincronizado' },
    { id: 'bank-3', name: 'BCI (Banco de Comércio e Indústria)', line: 'Linha de Apoio à Produção Nacional', activeApps: 0, limit: '80.000.000 Kz', status: 'Desconectado' },
    { id: 'bank-4', name: 'FADA', line: 'Fundo de Apoio ao Desenvolvimento Agrário', activeApps: 1, limit: '20.000.000 Kz', status: 'Sincronizado' },
  ]);

  const [selectedAppWorkflow, setSelectedAppWorkflow] = useState<any>(null);

  // Specialized Operational Modules States
  const [activeSectorTab, setActiveSectorTab] = useState<'AGRICULTURE' | 'LIVESTOCK' | 'FISHERIES' | 'COMMERCE'>(
    (user?.industry as any) || 'AGRICULTURE'
  );
  const [activeResourceTab, setActiveResourceTab] = useState<string>('talhoes');

  // AGRICULTURE STATES
  const [talhoes, setTalhoes] = useState([
    { id: 't-1', nome: 'Talhão Alfa', codigo: 'TAL-001', area: 12.5, gps: '-12.784, 13.456', tipoSolo: 'Argiloso', estado: 'Ativo' },
    { id: 't-2', nome: 'Talhão Beta', codigo: 'TAL-002', area: 8.2, gps: '-12.786, 13.459', tipoSolo: 'Arenoso', estado: 'Em Pousio' }
  ]);
  const [culturas, setCulturas] = useState([
    { id: 'c-1', cultura: 'Milho', variedade: 'Kambeta', dataPlantio: '2026-03-10', dataColheitaPrevista: '2026-08-15', talhao: 'Talhão Alfa', quantidade: 5000 },
    { id: 'c-2', cultura: 'Batata Doce', variedade: 'Dourada', dataPlantio: '2026-04-01', dataColheitaPrevista: '2026-09-01', talhao: 'Talhão Beta', quantidade: 3000 }
  ]);
  const [producoes, setProducoes] = useState([
    { id: 'p-1', produto: 'Milho Branco', quantidade: 1200, unidade: 'kg', qualidade: 'Classe A', talhao: 'Talhão Alfa', responsavel: 'Mateus Gaspar', periodo: 'Diário' }
  ]);
  const [colheitasList, setColheitasList] = useState([
    { id: 'col-1', data: '2026-07-10', talhao: 'Talhão Alfa', produto: 'Milho Branco', quantidade: 4500, perdas: 150, observacoes: 'Excelente colheita sob clima ameno' }
  ]);
  const [insumosList, setInsumosList] = useState([
    { id: 'ins-1', nome: 'NPK 12-24-12', categoria: 'Fertilizantes', quantidade: 45, unidade: 'sacos', movimento: 'Entrada' },
    { id: 'ins-2', nome: 'Sementes de Milho Amarelo', categoria: 'Sementes', quantidade: 120, unidade: 'kg', movimento: 'Entrada' }
  ]);
  const [equipamentosList, setEquipamentosList] = useState([
    { id: 'eq-1', nome: 'Trator Massey 275', tipo: 'Tratores', estado: 'Operacional', combustivel: 75, proximaManutencao: '2026-08-10' },
    { id: 'eq-2', nome: 'Bomba de Água Solar 5kW', tipo: 'Bombas', estado: 'Manutenção', combustivel: 100, proximaManutencao: '2026-07-22' }
  ]);
  const [climaList, setClimaList] = useState([
    { id: 'cli-1', data: '2026-07-18', precipitacao: 1.2, temperatura: 24, humidade: 62, vento: 14, alertas: 'Sem Alertas' }
  ]);

  // LIVESTOCK STATES
  const [rebanhoList, setRebanhoList] = useState([
    { id: 'reb-1', identificacao: 'BOV-045', raca: 'Nelore', sexo: 'Macho', dataNascimento: '2024-05-12', peso: 420, estado: 'Saudável', lote: 'Lote Engorda A' },
    { id: 'reb-2', identificacao: 'BOV-089', raca: 'Nelore', sexo: 'Fêmea', dataNascimento: '2023-11-20', peso: 380, estado: 'Saudável', lote: 'Lote Reprodução' }
  ]);
  const [reproducaoList, setReproducaoList] = useState([
    { id: 'rep-1', tipo: 'Gestação', vacaId: 'BOV-089', touroId: 'BOV-002', data: '2026-02-15', resultado: 'Confirmado', estado: 'Ativo' }
  ]);
  const [saudeAnimalList, setSaudeAnimalList] = useState([
    { id: 'sau-1', animalId: 'BOV-045', tipo: 'Vacinação', descricao: 'Vacina contra Febre Aftosa', data: '2026-06-10', dePara: 'Aftovax', custo: 5000 }
  ]);
  const [alimentacaoList, setAlimentacaoList] = useState([
    { id: 'ali-1', lote: 'Lote Engorda A', tipo: 'Ração', consumoDiario: 250, custo: 18000 }
  ]);
  const [crescimentoList, setCrescimentoList] = useState([
    { id: 'cre-1', animalId: 'BOV-045', data: '2026-07-15', peso: 420, altura: 135, ganhoDiario: 0.85 }
  ]);
  const [producaoAnimalList, setProducaoAnimalList] = useState([
    { id: 'pa-1', produto: 'Leite', data: '2026-07-18', quantidade: 320, unidade: 'Litros', responsavel: 'Mateus Gaspar' }
  ]);
  const [comercializacaoPecuariaList, setComercializacaoPecuariaList] = useState([
    { id: 'com-1', tipo: 'Venda de Animais', cliente: 'Carnes de Angola Lda', descricao: 'Venda de 5 Bois Gordos', valor: 2500000, data: '2026-07-12' }
  ]);

  // FISHERIES STATES
  const [embarcoesList, setEmbarcoesList] = useState([
    { id: 'emb-1', nome: 'Estrela do Namibe', matricula: 'NAM-2024-A', capacidade: 15, estado: 'Ativo', motor: 'Yamaha 250HP' },
    { id: 'emb-2', nome: 'Kwanza Mar', matricula: 'NAM-2021-B', capacidade: 8, estado: 'Ativo', motor: 'Suzuki 150HP' }
  ]);
  const [viagensList, setViagensList] = useState([
    { id: 'via-1',  embarcacao: 'Estrela do Namibe', dataSaida: '2026-07-12', dataChegada: '2026-07-15', tripulacao: 6, combustivel: 800, zonaPesca: 'Zona Sul - Tombwa' }
  ]);
  const [capturasList, setCapturasList] = useState([
    { id: 'cap-1', viagemId: 'via-1', especie: 'Carapau', quantidade: 140, peso: 3500, valor: 1400000, qualidade: 'Fresco Classe A' }
  ]);
  const [custosPescaList, setCustosPescaList] = useState([
    { id: 'cust-1', viagemId: 'via-1', combustivel: 320000, gelo: 80000, alimentacao: 45000, manutencao: 25000, taxas: 15000 }
  ]);
  const [manutencaoPescaList, setManutencaoPescaList] = useState([
    { id: 'man-1', embarcacao: 'Estrela do Namibe', tipo: 'Preventiva', descricao: 'Mudança de óleo e filtros do motor', data: '2026-07-05', custo: 120000 }
  ]);
  const [comercializacaoPescaList, setComercializacaoPescaList] = useState([
    { id: 'com-p1', lote: 'Lote-CAP1', mercado: 'Armazenistas', comprador: 'FrioNamibe S.A.', quantidade: 3500, valor: 1650000, contrato: 'Venda à Vista' }
  ]);

  // COMMERCE STATES
  const [produtosList, setProdutosList] = useState([
    { id: 'prod-1', sku: 'ALIM-001', codigo: 'PROD-789', categoria: 'Alimentos', fornecedor: 'AngoAlimentos Lda', precoCompra: 1200, precoVenda: 1800, estoque: 450 },
    { id: 'prod-2', sku: 'LIMPEZA-005', codigo: 'PROD-456', categoria: 'Higiene', fornecedor: 'Distribuidora Sul', precoCompra: 800, precoVenda: 1350, estoque: 280 }
  ]);
  const [inventarioList, setInventarioList] = useState([
    { id: 'inv-1', produtoId: 'prod-1', tipo: 'Entrada', quantidade: 100, data: '2026-07-16', responsavel: 'Mateus Gaspar' }
  ]);
  const [comprasList, setComprasList] = useState([
    { id: 'com-c1', pedido: 'Compra de Arroz Agulha (50 sacos)', fornecedor: 'AngoAlimentos Lda', valor: 650000, estado: 'Receção', data: '2026-07-14' }
  ]);
  const [vendasList, setVendasList] = useState([
    { id: 'ven-c1', orcamento: 'Fornecimento de Cesta Básica (20 un)', cliente: 'Hotel Império', valor: 540000, estado: 'Pagamento', data: '2026-07-17' }
  ]);
  const [crmList, setCrmList] = useState([
    { id: 'crm-1', nome: 'Hotel Império', tipo: 'Cliente', contacto: '+244 923 456 789', email: 'compras@hotelimperio.ao', status: 'Ativo' }
  ]);
  const [contasAReceberList, setContasAReceberList] = useState([
    { id: 'cr-1', fatura: 'FAT-2026-098', cliente: 'Hotel Império', parcelas: '1/1', valor: 540000, dataVencimento: '2026-07-30', estado: 'Pendente' }
  ]);
  const [contasAPagarList, setContasAPagarList] = useState([
    { id: 'cp-1', fornecedor: 'AngoAlimentos Lda', despesa: 'Fatura de Arroz', obrigacoes: 'Fornecimento', valor: 650000, dataVencimento: '2026-07-28', estado: 'Pendente' }
  ]);

  // Temporary Form Fields for addition
  const [genericForm, setGenericForm] = useState<Record<string, string>>({});

  const toggleTask = (taskId: string) => {
    setCheckedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const changeSectorTab = (sector: 'AGRICULTURE' | 'LIVESTOCK' | 'FISHERIES' | 'COMMERCE') => {
    setActiveSectorTab(sector);
    setGenericForm({});
    if (sector === 'AGRICULTURE') setActiveResourceTab('talhoes');
    else if (sector === 'LIVESTOCK') setActiveResourceTab('rebanho');
    else if (sector === 'FISHERIES') setActiveResourceTab('embarcacoes');
    else if (sector === 'COMMERCE') setActiveResourceTab('produtos');
  };

  const handleAddResourceItem = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `${activeResourceTab}-${Date.now()}`;
    const newItem = { id, ...genericForm };

    if (activeSectorTab === 'AGRICULTURE') {
      if (activeResourceTab === 'talhoes') {
        setTalhoes(prev => [...prev, { ...newItem, area: parseFloat(genericForm.area || '0'), estado: genericForm.estado || 'Ativo' } as any]);
      } else if (activeResourceTab === 'culturas') {
        setCulturas(prev => [...prev, { ...newItem, quantidade: parseFloat(genericForm.quantidade || '0') } as any]);
      } else if (activeResourceTab === 'producao') {
        setProducoes(prev => [...prev, { ...newItem, quantidade: parseFloat(genericForm.quantidade || '0') } as any]);
      } else if (activeResourceTab === 'colheitas') {
        setColheitasList(prev => [...prev, { ...newItem, quantidade: parseFloat(genericForm.quantidade || '0'), perdas: parseFloat(genericForm.perdas || '0') } as any]);
      } else if (activeResourceTab === 'insumos') {
        setInsumosList(prev => [...prev, { ...newItem, quantidade: parseFloat(genericForm.quantidade || '0') } as any]);
      } else if (activeResourceTab === 'equipamentos') {
        setEquipamentosList(prev => [...prev, { ...newItem, combustivel: parseInt(genericForm.combustivel || '100', 10), estado: genericForm.estado || 'Operacional' } as any]);
      } else if (activeResourceTab === 'clima') {
        setClimaList(prev => [...prev, { ...newItem, precipitacao: parseFloat(genericForm.precipitacao || '0'), temperatura: parseFloat(genericForm.temperatura || '24'), humidade: parseFloat(genericForm.humidade || '50'), vento: parseFloat(genericForm.vento || '10') } as any]);
      }
    } else if (activeSectorTab === 'LIVESTOCK') {
      if (activeResourceTab === 'rebanho') {
        setRebanhoList(prev => [...prev, { ...newItem, peso: parseFloat(genericForm.peso || '0'), estado: genericForm.estado || 'Saudável' } as any]);
      } else if (activeResourceTab === 'reproducao') {
        setReproducaoList(prev => [...prev, newItem as any]);
      } else if (activeResourceTab === 'saude') {
        setSaudeAnimalList(prev => [...prev, { ...newItem, custo: parseFloat(genericForm.custo || '0') } as any]);
      } else if (activeResourceTab === 'alimentacao') {
        setAlimentacaoList(prev => [...prev, { ...newItem, consumoDiario: parseFloat(genericForm.consumoDiario || '0'), custo: parseFloat(genericForm.custo || '0') } as any]);
      } else if (activeResourceTab === 'crescimento') {
        setCrescimentoList(prev => [...prev, { ...newItem, peso: parseFloat(genericForm.peso || '0'), altura: parseFloat(genericForm.altura || '0'), ganhoDiario: parseFloat(genericForm.ganhoDiario || '0') } as any]);
      } else if (activeResourceTab === 'producaoAnimal') {
        setProducaoAnimalList(prev => [...prev, { ...newItem, quantidade: parseFloat(genericForm.quantidade || '0') } as any]);
      } else if (activeResourceTab === 'comercializacaoPecuaria') {
        setComercializacaoPecuariaList(prev => [...prev, { ...newItem, valor: parseFloat(genericForm.valor || '0') } as any]);
      }
    } else if (activeSectorTab === 'FISHERIES') {
      if (activeResourceTab === 'embarcacoes') {
        setEmbarcoesList(prev => [...prev, { ...newItem, capacidade: parseFloat(genericForm.capacidade || '0'), estado: genericForm.estado || 'Ativo' } as any]);
      } else if (activeResourceTab === 'viagens') {
        setViagensList(prev => [...prev, { ...newItem, tripulacao: parseInt(genericForm.tripulacao || '5', 10), combustivel: parseFloat(genericForm.combustivel || '0') } as any]);
      } else if (activeResourceTab === 'capturas') {
        setCapturasList(prev => [...prev, { ...newItem, quantidade: parseInt(genericForm.quantidade || '0', 10), peso: parseFloat(genericForm.peso || '0'), valor: parseFloat(genericForm.valor || '0') } as any]);
      } else if (activeResourceTab === 'custosPesca') {
        setCustosPescaList(prev => [...prev, { ...newItem, combustivel: parseFloat(genericForm.combustivel || '0'), gelo: parseFloat(genericForm.gelo || '0'), alimentacao: parseFloat(genericForm.alimentacao || '0'), manutencao: parseFloat(genericForm.manutencao || '0'), taxas: parseFloat(genericForm.taxas || '0') } as any]);
      } else if (activeResourceTab === 'manutencaoPesca') {
        setManutencaoPescaList(prev => [...prev, { ...newItem, custo: parseFloat(genericForm.custo || '0') } as any]);
      } else if (activeResourceTab === 'comercializacaoPesca') {
        setComercializacaoPescaList(prev => [...prev, { ...newItem, quantidade: parseFloat(genericForm.quantidade || '0'), valor: parseFloat(genericForm.valor || '0') } as any]);
      }
    } else if (activeSectorTab === 'COMMERCE') {
      if (activeResourceTab === 'produtos') {
        setProdutosList(prev => [...prev, { ...newItem, precoCompra: parseFloat(genericForm.precoCompra || '0'), precoVenda: parseFloat(genericForm.precoVenda || '0'), estoque: parseInt(genericForm.estoque || '0', 10) } as any]);
      } else if (activeResourceTab === 'inventario') {
        setInventarioList(prev => [...prev, { ...newItem, quantidade: parseInt(genericForm.quantidade || '0', 10) } as any]);
      } else if (activeResourceTab === 'compras') {
        setComprasList(prev => [...prev, { ...newItem, valor: parseFloat(genericForm.valor || '0'), estado: genericForm.estado || 'Pedido' } as any]);
      } else if (activeResourceTab === 'vendas') {
        setVendasList(prev => [...prev, { ...newItem, valor: parseFloat(genericForm.valor || '0'), estado: genericForm.estado || 'Orçamento' } as any]);
      } else if (activeResourceTab === 'crm') {
        setCrmList(prev => [...prev, { ...newItem, status: genericForm.status || 'Ativo' } as any]);
      } else if (activeResourceTab === 'contasAReceber') {
        setContasAReceberList(prev => [...prev, { ...newItem, valor: parseFloat(genericForm.valor || '0'), estado: genericForm.estado || 'Pendente' } as any]);
      } else if (activeResourceTab === 'contasAPagar') {
        setContasAPagarList(prev => [...prev, { ...newItem, valor: parseFloat(genericForm.valor || '0'), estado: genericForm.estado || 'Pendente' } as any]);
      }
    }

    setGenericForm({});
    alert('Registo criado com sucesso no módulo operacional!');
  };

  // Helper for safe JSON parsing from fetch responses
  const safeJson = async (res: Response) => {
    if (!res || !res.ok) return null;
    try {
      const contentType = res.headers.get('content-type') || '';
      let json: any = null;
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        try { json = JSON.parse(text); } catch { return null; }
      } else {
        json = await res.json();
      }
      if (json && typeof json === 'object' && !Array.isArray(json)) {
        if (Array.isArray(json.data)) return json.data;
        if (Array.isArray(json.documents)) return json.documents;
        if (Array.isArray(json.users)) return json.users;
        if (Array.isArray(json.organizations)) return json.organizations;
        if (json.data !== undefined) return json.data;
      }
      return json;
    } catch {
      return null;
    }
  };

  // Helper to normalize backend document items
  const normalizeDocQueueItem = (d: any) => {
    const sUpper = String(d.status || 'PENDING').toUpperCase();
    const normStatus = (sUpper === 'APPROVED' || sUpper === 'VERIFIED') ? 'VERIFIED' : (sUpper === 'REJECTED' ? 'REJECTED' : 'PENDING');
    const docTitle = d.title || d.name || 'Documento Submetido';
    const docName = d.name || d.title || 'Documento Submetido';
    const docCat = (d.category || d.type || 'FINANCIAL').toUpperCase();
    const docOrgId = d.organizationId || d.orgId || d.org_id || '';
    const dateVal = d.date || (d.createdAt ? String(d.createdAt).split('T')[0].split(' ')[0] : '') || (d.updatedAt ? String(d.updatedAt).split('T')[0].split(' ')[0] : '') || new Date().toISOString().split('T')[0];

    return {
      ...d,
      id: d.id || `doc-${Math.random().toString(36).substring(2, 8)}`,
      title: docTitle,
      name: docName,
      type: docCat,
      category: docCat,
      status: normStatus,
      rawStatus: d.status,
      organizationId: docOrgId,
      orgId: docOrgId,
      date: dateVal,
      updatedAt: d.updatedAt || d.createdAt || dateVal,
    };
  };

  // Fetch dashboard data based on role
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'CONSULTANT'].includes(user?.role || '')) {
        const orgRes = await fetch(getApiUrl('/api/admin/organizations'));
        const userRes = await fetch(getApiUrl('/api/admin/users'));
        const allDocRes = await fetch(getApiUrl('/api/v1/documents/list/all'));
        const orgs = await safeJson(orgRes);
        const users = await safeJson(userRes);
        const allDocs = await safeJson(allDocRes);
        if (Array.isArray(orgs)) setOrganizations(orgs);
        if (Array.isArray(users)) setUsersList(users);
        const docArr = Array.isArray(allDocs) ? allDocs : (allDocs?.data || allDocs?.documents || []);
        setDocumentsQueue(docArr.map(normalizeDocQueueItem));

        if (user?.role === 'SUPER_ADMIN') {
          const consRes = await fetch(getApiUrl('/api/admin/consultants'));
          const cons = await safeJson(consRes);
          if (Array.isArray(cons)) setConsultants(cons);
        }
      }

      if (user?.organizationId) {
        const opRes = await fetch(getApiUrl(`/api/operations/list/${user.organizationId}`));
        const docRes = await fetch(getApiUrl(`/api/documents/list/${user.organizationId}`));
        const ops = await safeJson(opRes);
        const docs = await safeJson(docRes);
        if (Array.isArray(ops)) setOperationalLogs(ops);
        const orgDocArr = Array.isArray(docs) ? docs : (docs?.data || docs?.documents || []);
        setDocumentsQueue(orgDocArr.map(normalizeDocQueueItem));
      }
    } catch (e) {
      console.warn('Dashboard fetch notice:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Automatically hide profile view when any navigation tab changes
  useEffect(() => {
    setShowProfile(false);
  }, [coopTab, superAdminTab, adminTab, analystTab, consultantTab]);

  // Global Command Palette keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
        setCommandPaletteQuery('');
        setCommandPaletteActiveOption(null);
        setCommandPaletteFormData({});
        setPhotoEvidence(null);
        setGpsCoords(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle operation connection toggle
  const handleToggleConnection = async () => {
    if (!offlineMode) {
      // Switch to Offline
      setOfflineMode(true);
      alert('Modo Offline Ativado! O ERP MiraWelch agora está a funcionar em cache local resiliente.');
    } else {
      // Switch to Online & Sync
      setSyncingOffline(true);
      setOfflineMode(false);
      
      if (offlineCache.length > 0) {
        try {
          for (const item of offlineCache) {
            await fetch(getApiUrl('/api/operations/add'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orgId: item.orgId,
                type: item.type,
                title: item.title.replace(' [OFFLINE]', ''),
                quantity: item.quantity?.toString() || '',
                unit: item.unit,
                amount: item.amount?.toString() || '',
                notes: (item.notes || '').replace(' (Registo Offline)', '') + ' (Sincronizado Offline)',
                date: item.date
              })
            });
          }
          alert(`Excelente! Ligação restabelecida e sincronização concluída com sucesso. ${offlineCache.length} registo(s) offline foram homologados na base de dados centralizada da MiraWelch.`);
          setOfflineCache([]);
          fetchDashboardData();
          refreshUser();
        } catch (err) {
          console.error('Erro na sincronização offline:', err);
          alert('Não foi possível sincronizar todos os dados, mas foram mantidos na cache de segurança.');
        } finally {
          setSyncingOffline(false);
        }
      } else {
        alert('Modo Online restabelecido!');
        setSyncingOffline(false);
      }
    }
  };

  // Submit handler for Command Palette Forms
  const handleCommandPaletteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const userId = user.id;
    const id = `${commandPaletteActiveOption}-${Date.now()}`;
    const gpsString = gpsCoords ? `${gpsCoords.latitude.toFixed(4)}, ${gpsCoords.longitude.toFixed(4)}` : '-14.9782, 13.4321';
    const photoString = photoEvidence || '';

    const isOffline = offlineMode || commandPaletteFormData.offline === 'true';

    if (commandPaletteActiveOption === 'COLHEITA') {
      const saved = localStorage.getItem(`mirawelch-op-colheitas-${userId}`) || localStorage.getItem(`olo-fintel-op-colheitas-${userId}`);
      let colList = saved ? JSON.parse(saved) : [];
      const newCol = {
        id,
        data: new Date().toISOString().split('T')[0],
        talhao: commandPaletteFormData.talhao || 'Talhão Alfa',
        produto: commandPaletteFormData.produto || 'Milho Amarelo',
        quantidade: parseFloat(commandPaletteFormData.quantidade || '0'),
        perdas: parseFloat(commandPaletteFormData.perdas || '0'),
        observacoes: `${isOffline ? '⚠️ [PENDENTE DE SINC] ' : ''}Registo via ⌘K. GPS: ${gpsString}. Obs: ${commandPaletteFormData.observacoes || 'S/D'}`,
        photo: photoString,
        gps: gpsString,
        syncStatus: isOffline ? 'PENDING' : 'SYNCED'
      };
      colList = [newCol, ...colList];
      localStorage.setItem(`mirawelch-op-colheitas-${userId}`, JSON.stringify(colList));

    } else if (commandPaletteActiveOption === 'INSUMO') {
      const saved = localStorage.getItem(`mirawelch-op-insumos-${userId}`) || localStorage.getItem(`olo-fintel-op-insumos-${userId}`);
      let insList = saved ? JSON.parse(saved) : [];
      const newIns = {
        id,
        nome: commandPaletteFormData.nome || 'NPK 12-24-12',
        categoria: commandPaletteFormData.categoria || 'Adubos',
        quantidade: parseFloat(commandPaletteFormData.quantidade || '0'),
        unidade: commandPaletteFormData.unidade || 'kg',
        movimento: 'Saída',
        talhao: commandPaletteFormData.talhao || 'Talhão Geral',
        observacoes: `${isOffline ? '⚠️ [PENDENTE DE SINC] ' : ''}Aplicado via ⌘K. GPS: ${gpsString}`,
        photo: photoString,
        gps: gpsString,
        syncStatus: isOffline ? 'PENDING' : 'SYNCED'
      };
      insList = [newIns, ...insList];
      localStorage.setItem(`mirawelch-op-insumos-${userId}`, JSON.stringify(insList));

    } else if (commandPaletteActiveOption === 'PESO') {
      const savedWeight = localStorage.getItem(`mirawelch-op-crescimento-${userId}`) || localStorage.getItem(`olo-fintel-op-crescimento-${userId}`);
      let cresList = savedWeight ? JSON.parse(savedWeight) : [];
      const newWeight = {
        id,
        animalId: commandPaletteFormData.animalId || 'BOV-045',
        data: new Date().toISOString().split('T')[0],
        peso: parseFloat(commandPaletteFormData.peso || '0'),
        altura: parseFloat(commandPaletteFormData.altura || '0'),
        ganhoDiario: parseFloat(commandPaletteFormData.ganhoDiario || '0'),
        observacoes: `${isOffline ? '⚠️ [PENDENTE DE SINC] ' : ''}Pesagem via ⌘K. GPS: ${gpsString}`,
        photo: photoString,
        gps: gpsString,
        syncStatus: isOffline ? 'PENDING' : 'SYNCED'
      };
      cresList = [newWeight, ...cresList];
      localStorage.setItem(`mirawelch-op-crescimento-${userId}`, JSON.stringify(cresList));

      const savedRebanho = localStorage.getItem(`mirawelch-op-rebanho-${userId}`) || localStorage.getItem(`olo-fintel-op-rebanho-${userId}`);
      if (savedRebanho) {
        let rebList = JSON.parse(savedRebanho);
        rebList = rebList.map((a: any) => {
          if (a.identificacao === commandPaletteFormData.animalId) {
            return { ...a, peso: parseFloat(commandPaletteFormData.peso || '0'), estado: 'Saudável' };
          }
          return a;
        });
        localStorage.setItem(`mirawelch-op-rebanho-${userId}`, JSON.stringify(rebList));
      }

    } else if (commandPaletteActiveOption === 'VACINA') {
      const savedSaude = localStorage.getItem(`mirawelch-op-saudeAnimal-${userId}`) || localStorage.getItem(`olo-fintel-op-saudeAnimal-${userId}`);
      let saudeList = savedSaude ? JSON.parse(savedSaude) : [];
      const newHealth = {
        id,
        animalId: commandPaletteFormData.animalId || 'BOV-045',
        tipo: 'Vacinação',
        descricao: commandPaletteFormData.vacina || 'Anti-Aftosa Dose Reforço',
        data: new Date().toISOString().split('T')[0],
        medicamento: commandPaletteFormData.medicamento || 'Aftovax',
        custo: parseFloat(commandPaletteFormData.custo || '0'),
        gps: gpsString,
        photo: photoString,
        syncStatus: isOffline ? 'PENDING' : 'SYNCED'
      };
      saudeList = [newHealth, ...saudeList];
      localStorage.setItem(`mirawelch-op-saudeAnimal-${userId}`, JSON.stringify(saudeList));

    } else if (commandPaletteActiveOption === 'VIAGEM') {
      const savedViagens = localStorage.getItem(`mirawelch-op-viagens-${userId}`) || localStorage.getItem(`olo-fintel-op-viagens-${userId}`);
      let vList = savedViagens ? JSON.parse(savedViagens) : [];
      const newVoyage = {
        id,
        embarcacao: commandPaletteFormData.embarcacao || 'Estrela do Namibe',
        combustivel: parseFloat(commandPaletteFormData.combustivel || '0'),
        tripulacao: parseInt(commandPaletteFormData.tripulacao || '4', 10),
        data: new Date().toISOString().split('T')[0],
        estado: 'Em Curso',
        destino: commandPaletteFormData.destino || 'Zona de Pesca Sul',
        gps: gpsString,
        photo: photoString,
        syncStatus: isOffline ? 'PENDING' : 'SYNCED'
      };
      vList = [newVoyage, ...vList];
      localStorage.setItem(`mirawelch-op-viagens-${userId}`, JSON.stringify(vList));

    } else if (commandPaletteActiveOption === 'CAPTURA') {
      const savedCapturas = localStorage.getItem(`mirawelch-op-capturas-${userId}`) || localStorage.getItem(`olo-fintel-op-capturas-${userId}`);
      let cList = savedCapturas ? JSON.parse(savedCapturas) : [];
      const newCatch = {
        id,
        viagemId: commandPaletteFormData.viagemId || 'VIA-Estrela',
        especie: commandPaletteFormData.especie || 'Carapau',
        quantidade: parseFloat(commandPaletteFormData.quantidade || '0'),
        preco: parseFloat(commandPaletteFormData.preco || '0'),
        comprador: 'Mercado do Namibe',
        gps: gpsString,
        photo: photoString,
        syncStatus: isOffline ? 'PENDING' : 'SYNCED'
      };
      cList = [newCatch, ...cList];
      localStorage.setItem(`mirawelch-op-capturas-${userId}`, JSON.stringify(cList));

    } else if (commandPaletteActiveOption === 'VENDA') {
      const savedVendas = localStorage.getItem(`mirawelch-op-vendas-${userId}`) || localStorage.getItem(`olo-fintel-op-vendas-${userId}`);
      let venList = savedVendas ? JSON.parse(savedVendas) : [];
      const valorTotal = parseFloat(commandPaletteFormData.quantidade || '0') * parseFloat(commandPaletteFormData.preco || '0');
      const newVenda = {
        id,
        cliente: commandPaletteFormData.cliente || 'Consumidor Final',
        produto: commandPaletteFormData.produto || 'Arroz Agulha 1kg',
        quantidade: parseFloat(commandPaletteFormData.quantidade || '0'),
        valor: valorTotal,
        metodo: commandPaletteFormData.fiado === 'sim' ? 'Fiado' : 'Pronto Pagamento',
        data: new Date().toISOString().split('T')[0],
        gps: gpsString,
        photo: photoString,
        syncStatus: isOffline ? 'PENDING' : 'SYNCED'
      };
      venList = [newVenda, ...venList];
      localStorage.setItem(`mirawelch-op-vendas-${userId}`, JSON.stringify(venList));

      if (commandPaletteFormData.fiado === 'sim') {
        const savedAReceber = localStorage.getItem(`mirawelch-op-contasAReceber-${userId}`) || localStorage.getItem(`olo-fintel-op-contasAReceber-${userId}`);
        let arList = savedAReceber ? JSON.parse(savedAReceber) : [];
        const date30 = new Date();
        date30.setDate(date30.getDate() + 30);
        const newAR = {
          id: `REC-${Date.now()}`,
          cliente: commandPaletteFormData.cliente || 'Consumidor Final',
          documento: `FAT-${Math.floor(Math.random() * 9000) + 1000}`,
          valor: valorTotal,
          vencimento: date30.toISOString().split('T')[0],
          estado: 'Pendente',
          gps: gpsString
        };
        arList = [newAR, ...arList];
        localStorage.setItem(`mirawelch-op-contasAReceber-${userId}`, JSON.stringify(arList));
      }

    } else if (commandPaletteActiveOption === 'PAGAMENTO') {
      const savedAReceber = localStorage.getItem(`mirawelch-op-contasAReceber-${userId}`) || localStorage.getItem(`olo-fintel-op-contasAReceber-${userId}`);
      if (savedAReceber) {
        let arList = JSON.parse(savedAReceber);
        let found = false;
        arList = arList.map((rec: any) => {
          if (rec.cliente.toLowerCase().includes((commandPaletteFormData.cliente || '').toLowerCase()) || rec.documento === commandPaletteFormData.documento) {
            found = true;
            const amortizado = parseFloat(commandPaletteFormData.valorPago || '0');
            const novoValor = Math.max(0, rec.valor - amortizado);
            return {
              ...rec,
              valor: novoValor,
              estado: novoValor === 0 ? 'Pago' : 'Pendente',
              observacoes: `Amortizado ${amortizado.toLocaleString()} Kz em ${new Date().toLocaleDateString()}`
            };
          }
          return rec;
        });
        localStorage.setItem(`mirawelch-op-contasAReceber-${userId}`, JSON.stringify(arList));
        if (found) {
          const logMsg = `[RECEBIMENTO] Cliente ${commandPaletteFormData.cliente} amortizou ${commandPaletteFormData.valorPago} Kz`;
          setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ${logMsg}`, ...prev]);
        }
      }
    }

    alert(`Sucesso! Lançamento de "${commandPaletteActiveOption}" registado com êxito.${isOffline ? ' (Sinalizado na cache de contingência offline)' : ''}`);

    setShowCommandPalette(false);
    setCommandPaletteActiveOption(null);
    setCommandPaletteFormData({});
    setPhotoEvidence(null);
    setGpsCoords(null);
    setRefreshCounter(prev => prev + 1);
  };

  // Handle operation logging
  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logForm.title || !user?.organizationId) return;

    if (offlineMode) {
      const simulatedId = 'offline-' + Math.random().toString(36).substring(2, 9);
      const simulatedRecord: OperationalRecord = {
        id: simulatedId,
        orgId: user.organizationId,
        type: logType,
        title: logForm.title + ' [OFFLINE]',
        quantity: logForm.quantity ? parseFloat(logForm.quantity) : undefined,
        unit: logForm.unit,
        amount: logForm.amount ? parseFloat(logForm.amount) : undefined,
        notes: logForm.notes ? logForm.notes + ' (Registo Offline)' : 'Registo Offline',
        date: logForm.date
      };

      setOfflineCache(prev => [simulatedRecord, ...prev]);
      setShowLogModal(false);
      setLogForm({ title: '', quantity: '', unit: 'kg', amount: '', notes: '', date: new Date().toISOString().split('T')[0] });
      alert('Operação guardada localmente em cache offline com sucesso! Os seus dados serão sincronizados automaticamente assim que restabelecer a ligação à internet.');
      return;
    }

    try {
      const res = await fetch(getApiUrl('/api/operations/add'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: user.organizationId,
          type: logType,
          ...logForm
        })
      });

      if (res.ok) {
        setShowLogModal(false);
        setLogForm({ title: '', quantity: '', unit: 'kg', amount: '', notes: '', date: new Date().toISOString().split('T')[0] });
        fetchDashboardData();
        refreshUser();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle document upload simulation
  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFileName || !user?.organizationId) return;

    try {
      const res = await fetch(getApiUrl('/api/documents/upload'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: user.organizationId,
          type: docType,
          name: docFileName
        })
      });

      if (res.ok) {
        setShowDocModal(false);
        setDocFileName('');
        fetchDashboardData();
        refreshUser();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getOrgNameForDoc = (doc: any) => {
    if (doc?.orgName && doc.orgName !== 'Organização Registada') return doc.orgName;
    if (doc?.organizationName && doc.organizationName !== 'Organização Registada') return doc.organizationName;
    const orgId = doc?.organizationId || doc?.orgId || doc?.org_id;
    if (orgId) {
      const found = organizations.find(o => o.id === orgId);
      if (found?.name) return found.name;
    }
    return user?.organizationName || 'Cooperativa Agrícola Humpata';
  };

  // SuperAdmin: Verify/Reject KYC doc
  const handleDocAction = async (docId: string, action: 'VERIFIED' | 'REJECTED', fb?: string) => {
    try {
      setDocumentsQueue(prev => prev.map((d: any) => {
        if (d.id === docId || (viewingDoc && (d.title === viewingDoc.title || d.name === viewingDoc.name))) {
          return { ...d, status: action, feedback: fb || d.feedback };
        }
        return d;
      }));

      await fetch(getApiUrl('/api/admin/document-action'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          documentId: docId, 
          id: docId, 
          action, 
          decision: action, 
          feedback: fb,
          title: viewingDoc?.title || viewingDoc?.name,
          name: viewingDoc?.name || viewingDoc?.title,
          organizationId: viewingDoc?.organizationId
        })
      });
      setViewingDoc(null);
      await fetchDashboardData();
      if (refreshUser) refreshUser();
    } catch (e) {
      console.error(e);
      setViewingDoc(null);
      await fetchDashboardData();
      if (refreshUser) refreshUser();
    }
  };

  // SuperAdmin: Delegate Org to Consultant
  const handleDelegate = async (orgId: string, consId: string) => {
    try {
      const res = await fetch(getApiUrl('/api/admin/delegate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId, consultantId: consId })
      });
      if (res.ok) {
        setActiveOrgToAssign(null);
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // SuperAdmin: Toggle Suspension
  const handleSuspension = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspensionOrgId) return;

    const org = organizations.find(o => o.id === suspensionOrgId);
    const suspend = !org?.suspended;

    try {
      const res = await fetch(getApiUrl('/api/admin/suspend'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: suspensionOrgId,
          suspend,
          reason: suspend ? suspensionReason : ''
        })
      });

      if (res.ok) {
        setSuspensionOrgId(null);
        setSuspensionReason('');
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Consultant: AI Action Plan Simulation
  const handleGenerateAIPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt) return;

    // Fast, beautiful simulated AI plan checklist based on context
    const prompts: Record<string, string[]> = {
      'score': [
        'Organizar certidão de registo predial e ata constitutiva',
        'Registar todas as despesas de sementes e combustíveis da época de chuva',
        'Carregar os últimos 3 extratos bancários do Banco BAI no portal'
      ],
      'agricultura': [
        'Criar mapeamento visual dos 4 talhões no dashboard',
        'Agendar a colheita de feijão para a primeira semana de Agosto',
        'Preencher a ficha técnica de pesticidas utilizados'
      ],
      'pesca': [
        'Mapear consumo de combustível por quilómetro percorrido',
        'Contratar seguro de acidentes de trabalho básico para os pescadores',
        'Subir licença de pesca comercial de Luanda'
      ]
    };

    const chosenPlan = Object.entries(prompts).find(([k]) => aiPrompt.toLowerCase().includes(k))?.[1] || [
      'Digitalizar e carregar documento oficial de NIF',
      'Registar vendas de produção consecutivamente no livro de caixa',
      'Realizar formação básica de planeamento de custos'
    ];

    setAiPlan(chosenPlan);
  };

  if (!user) return null;

  // --- UNIVERSAL DASHBOARD CALCULATIONS (5 FUNDAMENTAL QUESTIONS) ---
  const combinedLogs = [...offlineCache, ...operationalLogs];

  // Q1: Como estamos? (Revenue, Expenses, Margin, Liquidity, Funding Score)
  const totalRevenue = combinedLogs
    .filter(log => log.type === 'SALE')
    .reduce((sum, log) => sum + (log.amount || 0), 0);

  const totalExpense = combinedLogs
    .filter(log => log.type === 'EXPENSE')
    .reduce((sum, log) => sum + (log.amount || 0), 0);

  const netMargin = totalRevenue - totalExpense;
  const marginPercentage = totalRevenue > 0 ? Math.round((netMargin / totalRevenue) * 100) : 0;

  const liquidityRatio = totalExpense > 0 ? (totalRevenue / totalExpense).toFixed(1) : '1.5';
  const liquidityStatus = parseFloat(liquidityRatio) >= 1.5 ? 'Excelente' : parseFloat(liquidityRatio) >= 1.0 ? 'Estável' : 'Crítico';

  // Q2: O que mudou? (Health Indicators)
  const financialHealth = marginPercentage > 20 ? 'Excelente (88/100)' : marginPercentage > 0 ? 'Estável (62/100)' : 'Alerta (35/100)';
  
  const opRecords = combinedLogs.filter(log => ['HARVEST', 'ANIMAL', 'CATCH'].includes(log.type)).length;
  const operationalHealth = opRecords >= 3 ? 'Excelente (95/100)' : opRecords > 0 ? 'Estável (75/100)' : 'Inativo (25/100)';

  const verifiedDocs = documentsQueue.filter(d => d.status === 'VERIFIED').length;
  const pendingDocs = documentsQueue.filter(d => d.status === 'PENDING').length;
  const documentalHealthScore = Math.min(100, Math.round((verifiedDocs * 25) + (pendingDocs * 10)));
  const documentalHealth = documentalHealthScore >= 80 ? `Completo (${documentalHealthScore}/100)` : documentalHealthScore >= 40 ? `Regular (${documentalHealthScore}/100)` : `Insuficiente (${documentalHealthScore}/100)`;

  const salesCount = combinedLogs.filter(log => log.type === 'SALE').length;
  const commercialHealth = salesCount >= 3 ? 'Crescente (90/100)' : salesCount > 0 ? 'Regular (60/100)' : 'Crítico (15/100)';

  // Q3: Onde perdemos dinheiro? (Leaks & Waste Alerts)
  const costAlerts = [];
  if (totalExpense > totalRevenue * 0.8 && totalRevenue > 0) {
    costAlerts.push({
      title: 'Custos Operacionais Elevados',
      description: `As despesas representam ${((totalExpense / totalRevenue) * 100).toFixed(0)}% das receitas. Recomenda-se reduzir gastos imediatos.`,
      severity: 'high',
      savingEstimate: `${Math.round(totalExpense * 0.15).toLocaleString()} Kz`
    });
  }
  const hasTransportExpense = operationalLogs.some(log => log.type === 'EXPENSE' && (log.title.toLowerCase().includes('combustível') || log.title.toLowerCase().includes('transporte') || log.notes?.toLowerCase().includes('transporte') || log.notes?.toLowerCase().includes('combustível')));
  if (hasTransportExpense) {
    costAlerts.push({
      title: 'Desperdício de Logística / Combustível',
      description: 'Identificado desvio de rota ou consumo de combustível acima da meta regional nos registos de transporte.',
      severity: 'medium',
      savingEstimate: 'Est. 12% de poupança'
    });
  } else {
    costAlerts.push({
      title: 'Perdas de Armazenamento Estimadas',
      description: `Padrão do setor de ${user?.industry || 'Coop'} aponta para perdas pós-colheita/produção estimadas em 6% por conservação inadequada.`,
      severity: 'medium',
      savingEstimate: 'Est. 45.000 Kz'
    });
  }
  if (operationalLogs.length > 5 && marginPercentage < 15) {
    costAlerts.push({
      title: 'Vazamento Financeiro Silencioso',
      description: 'A margem operacional está abaixo do limite de segurança (15%). Verifique se há custos residuais não catalogados.',
      severity: 'high',
      savingEstimate: 'Est. 80.000 Kz'
    });
  } else {
    costAlerts.push({
      title: 'Custos Fixos com Insumos',
      description: 'Oportunidade de compra conjunta com cooperativas vizinhas para obter descontos de volume.',
      severity: 'low',
      savingEstimate: 'Est. 50.000 Kz'
    });
  }

  // Q4: O que precisa atenção? (Checklist & Alerts)
  const defaultTasks = [
    { id: 't1', text: 'Subir NIF Oficial da Cooperativa', done: documentsQueue.some(d => d.type === 'NIF') },
    { id: 't2', text: 'Registar vendas diárias no livro de caixa', done: totalRevenue > 0 },
    { id: 't3', text: 'Atualizar despesas com insumos/combustível', done: totalExpense > 0 },
    { id: 't4', text: 'Validar registo operacional de colheita/pesca', done: opRecords > 0 },
  ];

  // Q5: O que devo fazer hoje? (AI recommendations based on sector & metrics)
  const getAiRecommendations = () => {
    const recs = [];
    if (user?.industry === 'AGRICULTURE') {
      recs.push({
        title: 'Otimizar Adubação antes das Chuvas',
        desc: 'Planeie a aplicação de fertilizantes nitrogenados de forma faseada para evitar perdas por lixiviação nas valas de drenagem.',
        priority: 'Alta'
      });
      recs.push({
        title: 'Diversificação de Cultura Temporária',
        desc: 'Intercale a cultura principal com feijão ou leguminosas para enriquecer o solo com nitrogénio de forma biológica.',
        priority: 'Média'
      });
    } else if (user?.industry === 'FISHERIES') {
      recs.push({
        title: 'Controle de Cadeia de Frio',
        desc: 'Mantenha a proporção de gelo de 2:1 para garantir a frescura do pescado capturado até ao porto de descarga.',
        priority: 'Alta'
      });
      recs.push({
        title: 'Manutenção Preventiva de Motores',
        desc: 'Programe a limpeza de filtros de combustível a cada 50 horas de navegação para evitar falhas em alto mar.',
        priority: 'Média'
      });
    } else if (user?.industry === 'LIVESTOCK') {
      recs.push({
        title: 'Controle Sanitário do Gado',
        desc: 'Atualize a folha de vacinação contra a febre aftosa para garantir a conformidade documental exigida pelos analistas do BAI.',
        priority: 'Alta'
      });
      recs.push({
        title: 'Rotação de Pastagens',
        desc: 'Divida o pasto em piquetes para permitir a recuperação da forragem e evitar a degradação e erosão do solo.',
        priority: 'Média'
      });
    } else {
      recs.push({
        title: 'Registo Consecutivo de Caixa',
        desc: 'Evite acumular faturas de papel por mais de 48 horas. Registar vendas no mesmo dia aumenta o score em até 15%.',
        priority: 'Alta'
      });
    }

    recs.push({
      title: 'Aceleração de Funding Score',
      desc: `A sua pontuação atual é de ${user?.fundingScore} pontos. Carregar mais 1 extrato bancário válido desbloqueará o nível ${user?.maturity === 'BEGINNER' ? 'Intermédio' : 'Avançado'}.`,
      priority: 'Alta'
    });

    return recs;
  };

  const aiRecommendations = getAiRecommendations();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-gray-50 dark:bg-[#0E0E12] transition-colors duration-200">
      
      {/* 1. SIDEBAR PANEL (STYLISH & RESPONSIVE) */}
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-all duration-200"
        />
      )}

      {/* Sidebar aside */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r bg-white dark:bg-[#13131A] border-gray-200 dark:border-[#2A2A35] transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-y-0 shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-gray-150 dark:border-[#2A2A35] flex items-center gap-3">
          <div className="px-3 h-10 rounded-xl bg-brand-iris text-white flex items-center justify-center font-bold text-lg shadow-md shadow-brand-iris/20 shrink-0">
            MW
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm leading-none text-gray-900 dark:text-white truncate">MiraWelch</h2>
            <p className="text-[9px] font-mono font-bold text-brand-purple mt-1 uppercase tracking-wider truncate">
              {user.role} — {user.maturity}
            </p>
          </div>
        </div>

        {/* INTEGRATED OFFLINE SYNC CONTROLLER */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-gray-50 dark:bg-black/25 border border-gray-150 dark:border-gray-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Modo de Ligação</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${offlineMode ? 'bg-amber-500 animate-pulse' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 font-mono">
                {offlineMode ? 'OFFLINE' : 'ONLINE'}
              </span>
            </div>
          </div>
          <button
            onClick={handleToggleConnection}
            disabled={syncingOffline}
            className={`w-full py-2 px-3 rounded-xl text-[10px] font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              offlineMode 
                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
            }`}
          >
            {syncingOffline ? (
              <span className="animate-spin w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
            ) : offlineMode ? (
              'Restabelecer Ligação (Sync)'
            ) : (
              'Simular Modo Offline'
            )}
          </button>
        </div>

        {/* DYNAMIC ROLE-BASED SIDEBAR NAVIGATION */}
        <nav className="flex-1 px-4 py-1 overflow-y-auto space-y-1">
          {/* A. COOPERATIVE OWNER / MANAGER SIDEBAR MENU */}
          {!['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'CONSULTANT'].includes(user.role) && (
            <>
              <button
                onClick={() => { setCoopTab('overview'); setSidebarOpen(false); }}
                className={`mercury-sidebar-btn ${coopTab === 'overview' ? 'active' : ''}`}
              >
                <Compass size={14} />
                <span>Painel de Decisão</span>
              </button>

              <button
                onClick={() => { setCoopTab('operations'); setSidebarOpen(false); }}
                className={`mercury-sidebar-btn ${coopTab === 'operations' ? 'active' : ''}`}
              >
                <Sprout size={14} />
                <span>Gestão Operacional</span>
              </button>

              {/* 2. FINANÇAS & CAIXA */}
              <div className="space-y-1">
                <button
                  onClick={() => { setCoopTab('finance'); setSidebarOpen(false); }}
                  className={`mercury-sidebar-btn w-full flex items-center justify-between ${coopTab === 'finance' ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Coins size={14} />
                    <span>Finanças & Caixa</span>
                  </div>
                </button>
                {coopTab === 'finance' && (
                  <div className="pl-4 space-y-1 py-1 border-l border-brand-iris/30 ml-3">
                    <button
                      onClick={() => { setCoopTab('finance'); setFinanceSubTab('receitas_despesas'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${financeSubTab === 'receitas_despesas' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Receitas & Despesas
                    </button>
                    <button
                      onClick={() => { setCoopTab('finance'); setFinanceSubTab('fluxo_caixa'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${financeSubTab === 'fluxo_caixa' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Fluxo de Caixa
                    </button>
                    <button
                      onClick={() => { setCoopTab('finance'); setFinanceSubTab('rentabilidade'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${financeSubTab === 'rentabilidade' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Rentabilidade & DRE
                    </button>
                    <button
                      onClick={() => { setCoopTab('finance'); setFinanceSubTab('planeamento'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${financeSubTab === 'planeamento' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Budgets & Planeamento
                    </button>
                    <button
                      onClick={() => { setCoopTab('finance'); setFinanceSubTab('ar_ap'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${financeSubTab === 'ar_ap' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Contas AP / AR
                    </button>
                    <button
                      onClick={() => { setCoopTab('finance'); setFinanceSubTab('ativos'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${financeSubTab === 'ativos' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Ativos & Amortizações
                    </button>
                    <button
                      onClick={() => { setCoopTab('finance'); setFinanceSubTab('relatorios'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${financeSubTab === 'relatorios' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Relatórios DRE & Audit
                    </button>
                  </div>
                )}
              </div>

              {/* 3. CRM & VENDAS */}
              <div className="space-y-1">
                <button
                  onClick={() => { setCoopTab('crm'); setSidebarOpen(false); }}
                  className={`mercury-sidebar-btn w-full flex items-center justify-between ${coopTab === 'crm' ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>CRM & Vendas</span>
                  </div>
                </button>
                {coopTab === 'crm' && (
                  <div className="pl-4 space-y-1 py-1 border-l border-brand-iris/30 ml-3">
                    <button
                      onClick={() => { setCoopTab('crm'); setCrmSubTab('pipeline'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${crmSubTab === 'pipeline' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Oportunidades & Funil
                    </button>
                    <button
                      onClick={() => { setCoopTab('crm'); setCrmSubTab('clientes'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${crmSubTab === 'clientes' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Gestão de Clientes
                    </button>
                    <button
                      onClick={() => { setCoopTab('crm'); setCrmSubTab('fornecedores'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${crmSubTab === 'fornecedores' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Fornecedores & Parcerias
                    </button>
                    <button
                      onClick={() => { setCoopTab('crm'); setCrmSubTab('contratos'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${crmSubTab === 'contratos' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Contratos Comerciais
                    </button>
                  </div>
                )}
              </div>

              {/* 4. DOCUMENTOS & KYC */}
              <div className="space-y-1">
                <button
                  onClick={() => { setCoopTab('documents'); setSidebarOpen(false); }}
                  className={`mercury-sidebar-btn w-full flex items-center justify-between ${coopTab === 'documents' ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <FileText size={14} />
                    <span>Documentos & KYC</span>
                  </div>
                </button>
                {coopTab === 'documents' && (
                  <div className="pl-4 space-y-1 py-1 border-l border-brand-iris/30 ml-3">
                    <button
                      onClick={() => { setCoopTab('documents'); setDocsSubTab('meus-documentos'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${docsSubTab === 'meus-documentos' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Meus Documentos
                    </button>
                    <button
                      onClick={() => { setCoopTab('documents'); setDocsSubTab('fila-kyc'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${docsSubTab === 'fila-kyc' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Validador & Fila KYC
                    </button>
                  </div>
                )}
              </div>

              {/* 5. MATURIDADE & CRÉDITO */}
              <button
                onClick={() => { setCoopTab('credit'); setSidebarOpen(false); }}
                className={`mercury-sidebar-btn ${coopTab === 'credit' ? 'active' : ''}`}
              >
                <TrendingUp size={14} />
                <span>Maturidade & Crédito</span>
              </button>

              {/* 6. MÓDULO MIRAWELCH IA */}
              <button
                onClick={() => { setCoopTab('ai_center'); setSidebarOpen(false); }}
                className={`mercury-sidebar-btn ${coopTab === 'ai_center' ? 'active' : ''}`}
              >
                <Sparkles size={14} />
                <span>Módulo IA MiraWelch</span>
              </button>

              {/* 7. CUSTOS DE SUPORTE (ERP) */}
              <div className="space-y-1">
                <button
                  onClick={() => { setCoopTab('overheads'); setSidebarOpen(false); }}
                  className={`mercury-sidebar-btn w-full flex items-center justify-between ${coopTab === 'overheads' ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} />
                    <span>Custos de Suporte (ERP)</span>
                  </div>
                </button>
                {coopTab === 'overheads' && (
                  <div className="pl-4 space-y-1 py-1 border-l border-brand-iris/30 ml-3">
                    <button
                      onClick={() => { setCoopTab('overheads'); setOverheadsSubTab('dashboard'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${overheadsSubTab === 'dashboard' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Resumo de Custos
                    </button>
                    <button
                      onClick={() => { setCoopTab('overheads'); setOverheadsSubTab('rh'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${overheadsSubTab === 'rh' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Recursos Humanos & Folha
                    </button>
                    <button
                      onClick={() => { setCoopTab('overheads'); setOverheadsSubTab('maquinas'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${overheadsSubTab === 'maquinas' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Frota & Máquinas
                    </button>
                    <button
                      onClick={() => { setCoopTab('overheads'); setOverheadsSubTab('utilitarios'); setSidebarOpen(false); }}
                      className={`text-[11px] block w-full text-left py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${overheadsSubTab === 'utilitarios' ? 'text-brand-iris bg-brand-iris/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      • Água, Luz & Apoio
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => { setCoopTab('ledger'); setSidebarOpen(false); }}
                className={`mercury-sidebar-btn ${coopTab === 'ledger' ? 'active' : ''}`}
              >
                <ListTodo size={14} />
                <span>Histórico Operacional</span>
              </button>
            </>
          )}

          {/* B. SUPER ADMIN SIDEBAR MENU */}
          {user.role === 'SUPER_ADMIN' && (
            <>
              {[
                { id: 'ecosystem', label: '🏦 Ecosystem (Banks)' },
                { id: 'users', label: '👥 User Management' },
                { id: 'kyc', label: '📂 KYC Queue' },
                { id: 'survey', label: '📋 Survey Engine' },
                { id: 'logs', label: '💻 System Logs' },
                { id: 'consultants', label: '🤝 Delegação Consultores' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setSuperAdminTab(tab.id as any); setSidebarOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    superAdminTab === tab.id
                      ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Layers size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </>
          )}

          {/* C. ADMIN SIDEBAR MENU */}
          {user.role === 'ADMIN' && (
            <>
              {[
                { id: 'organizations', label: '🏢 Minhas Organizações' },
                { id: 'invites', label: '✉️ Convites de Equipa' },
                { id: 'delegation', label: '🤝 Delegação de Perfis' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setAdminTab(tab.id as any); setSidebarOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    adminTab === tab.id
                      ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Layers size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </>
          )}

          {/* D. ANALYST SIDEBAR MENU */}
          {user.role === 'ANALYST' && (
            <>
              {[
                { id: 'applications', label: '📥 Candidaturas Crédito' },
                { id: 'scoring', label: '📊 Fila de Scores MiraWelch' },
                { id: 'docs', label: '📂 Revisão Documental' },
                { id: 'workflow', label: '⚙️ Fluxo de Aprovação' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setAnalystTab(tab.id as any); setSidebarOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    analystTab === tab.id
                      ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Layers size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </>
          )}

          {/* E. CONSULTANT SIDEBAR MENU */}
          {user.role === 'CONSULTANT' && (
            <>
              {[
                { id: 'clients', label: '👥 Clientes Tutelados' },
                { id: 'plans', label: '📋 Planos de Ação' },
                { id: 'ai_recs', label: '🤖 Recomendações IA' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setConsultantTab(tab.id as any); setSidebarOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    consultantTab === tab.id
                      ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Layers size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        {/* SIMULATED PWA LAUNCHER PROMOTIONAL CARD */}
        {!pwaInstalled && (
          <div className="p-4 mx-4 mb-4 rounded-2xl bg-brand-purple/5 border border-brand-purple/10 text-center space-y-2 shrink-0">
            <p className="text-[9px] font-black text-brand-purple uppercase tracking-wider">Modo PWA Instalável</p>
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 leading-normal">
              Aceda de forma offline e rápida a partir do ecrã inicial.
            </p>
            <button
              onClick={() => setShowPwaModal(true)}
              className="w-full py-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-[10px] font-extrabold transition-all shadow-sm cursor-pointer"
            >
              Instalar MiraWelch ERP
            </button>
          </div>
        )}

        {/* PROFILE CARD AT SIDEBAR FOOTER */}
        <div className={`p-4 border-t border-gray-150 dark:border-gray-800 flex items-center justify-between shrink-0 transition-all ${showProfile ? 'bg-brand-iris/10 dark:bg-brand-iris/5' : ''}`}>
          <div 
            onClick={() => { setShowProfile(true); setSidebarOpen(false); }}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group/profile flex-1 mr-2"
            title="Ver / Editar Meu Perfil"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-purple text-white font-bold text-xs flex items-center justify-center shrink-0 group-hover/profile:scale-105 transition-transform">
              {(user?.name || user?.email || 'US').substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate leading-none group-hover/profile:text-brand-iris transition-colors">{user?.name || user?.email || 'Utilizador'}</p>
              <p className="text-[9px] text-gray-400 truncate mt-1">Ver Perfil</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-500/5 transition-all cursor-pointer"
            title="Sair"
          >
            <X size={15} />
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        
        {/* UPPER STATUS & CONTROLS HEADER */}
        <header className="sticky top-0 z-30 bg-white dark:bg-[#1A1A21] border-b border-gray-200 dark:border-[#2A2A35] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden text-gray-500 dark:text-gray-400 cursor-pointer"
            >
              <Menu size={18} />
            </button>

            <div>
              <h1 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                {!['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'CONSULTANT'].includes(user.role) 
                  ? `${user.organizationName || 'Minha Cooperativa'}`
                  : 'Administração MiraWelch'}
              </h1>
              <p className="text-[10px] font-mono font-bold text-brand-purple mt-0.5 uppercase tracking-wider">
                {user.role} • Nível: {user.maturity}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Command Palette Trigger Button */}
            {!['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'CONSULTANT'].includes(user.role) && (
              <button
                onClick={() => {
                  setShowCommandPalette(true);
                  setCommandPaletteQuery('');
                  setCommandPaletteActiveOption(null);
                  setCommandPaletteFormData({});
                  setPhotoEvidence(null);
                  setGpsCoords(null);
                }}
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer hover:text-white ${
                  userSector === 'AGRICULTURE' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500' :
                  userSector === 'LIVESTOCK' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500' :
                  userSector === 'FISHERIES' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500' :
                  userSector === 'COMMERCE' ? 'bg-brand-purple/10 text-brand-purple border-brand-purple/20 hover:bg-brand-purple' :
                  'bg-brand-iris/10 text-brand-iris border-brand-iris/20 hover:bg-brand-iris'
                }`}
                title="Abrir Central de Lançamentos Rápidos (Shortcut: Cmd+K / Ctrl+K)"
              >
                <Command size={13} />
                <span>
                  {userSector === 'AGRICULTURE' ? 'Ações Agrícolas' :
                   userSector === 'LIVESTOCK' ? 'Ações de Pecuária' :
                   userSector === 'FISHERIES' ? 'Ações de Pesca' :
                   userSector === 'COMMERCE' ? 'Ações Comerciais' :
                   'Ações Rápidas'}
                </span>
                <kbd className={`hidden md:inline-block px-1 py-0.5 text-[9px] rounded font-mono ${
                  userSector === 'AGRICULTURE' ? 'bg-green-500/20 text-green-700 dark:text-green-300' :
                  userSector === 'LIVESTOCK' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' :
                  userSector === 'FISHERIES' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' :
                  userSector === 'COMMERCE' ? 'bg-brand-purple/20 text-brand-purple' :
                  'bg-brand-iris/20 text-brand-iris'
                }`}>⌘K</kbd>
              </button>
            )}
            
            {/* Multi-language Selector */}
            <select 
              value={locale} 
              onChange={e => setLocale(e.target.value as any)}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300"
            >
              <option value="pt" className="dark:bg-[#13131A]">PT (Português)</option>
              <option value="en" className="dark:bg-[#13131A]">EN (English)</option>
              <option value="umb" className="dark:bg-[#13131A]">UMB (Umbundu)</option>
              <option value="kmb" className="dark:bg-[#13131A]">KMB (Kimbundu)</option>
            </select>

            {/* Claro/Escuro/Automático Theme Selector */}
            <select
              value={theme}
              onChange={e => setTheme(e.target.value as any)}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300"
            >
              <option value="light" className="dark:bg-[#13131A]">☀️ Claro</option>
              <option value="dark" className="dark:bg-[#13131A]">🌙 Escuro</option>
              <option value="system" className="dark:bg-[#13131A]">🖥️ Automático</option>
            </select>

            <BackendConnectionManager />

            {/* Logout button */}
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 text-xs font-bold transition-all hidden sm:block cursor-pointer"
            >
              Sair
            </button>
          </div>
        </header>

        {/* MAIN VIEWS DESK AREA */}
        <main className="flex-1 p-6 w-full space-y-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={showProfile ? 'profile' : `${coopTab}-${consultantTab}-${analystTab}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-6 w-full"
            >

          {/* Connection Mode Simulated Offline Sync Notification Banner */}
          {offlineMode && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-600 dark:text-amber-400 animate-pulse">
              <span className="font-semibold flex items-center gap-2">
                <AlertTriangle size={15} />
                Estás a trabalhar em Modo Offline. Todas as operações lançadas serão salvas em cache segura no dispositivo.
              </span>
              <button 
                onClick={handleToggleConnection}
                className="px-2.5 py-1 bg-amber-500 text-white rounded font-bold text-[10px]"
              >
                Ligar & Sincronizar
              </button>
            </div>
          )}

          {/* Dynamic Welcome bar */}
          {coopTab === 'overview' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm relative">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Olá, {user?.name || user?.email || 'Utilizador'}!</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {!['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'CONSULTANT'].includes(user.role) 
                    ? `Bem-vindo ao centro operacional da ${user.organizationName || 'sua Cooperativa'}.` 
                    : `Bem-vindo ao Painel de Decisão do Ecossistema MiraWelch.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {/* 30-SECOND QUICK LOGGER BUTTON */}
                <button
                  onClick={() => setQuickLoggerModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Zap size={16} className="text-amber-300 animate-pulse" />
                  <span>Registo em &lt;30s</span>
                </button>

                {/* NOTIFICAÇÕES & ALERTAS DO NEGÓCIO BUTTON */}
                <div className="relative">
                  <button
                    onClick={() => setShowGuardianAlertsPopover(!showGuardianAlertsPopover)}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 text-xs font-bold transition-all cursor-pointer shadow-sm relative"
                  >
                    <Bell size={16} className="text-amber-500" />
                    <span>Alertas do Negócio</span>
                    {['alert-agri-weather', 'alert-agri-motor', 'alert-livestock-weight', 'alert-commerce-margin', 'alert-fisheries-motor'].filter(id => !resolvedAlertIds.includes(id)).length > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold animate-pulse">
                        {['alert-agri-weather', 'alert-agri-motor', 'alert-livestock-weight', 'alert-commerce-margin', 'alert-fisheries-motor'].filter(id => !resolvedAlertIds.includes(id)).length}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-extrabold">
                        0
                      </span>
                    )}
                  </button>

                  {/* POPOVER MENU FOR GUARDIAN ALERTS */}
                  {showGuardianAlertsPopover && (
                    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 md:w-[460px] p-4 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl shadow-2xl z-50 space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
                            <AlertTriangle size={16} />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">Central de Alertas Operacionais</h4>
                            <span className="text-[10px] text-gray-400">MiraWelch Guardian • Diagnóstico de risco</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {resolvedAlertIds.length > 0 && (
                            <button
                              onClick={resetAllAlerts}
                              className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline cursor-pointer"
                            >
                              Restaurar
                            </button>
                          )}
                          <button
                            onClick={() => setShowGuardianAlertsPopover(false)}
                            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                        {/* Alert 1: Weather */}
                        {!resolvedAlertIds.includes('alert-agri-weather') && (
                          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-left space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-500">
                                Agricultura • Sazonalidade
                              </span>
                              <span className="text-[9px] text-gray-400">Há 2 horas</span>
                            </div>
                            <h5 className="font-bold text-xs text-gray-900 dark:text-white">Previsão Climática: Chuva Forte na Colheita</h5>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                              Previsão indica precipitação intensa (&gt;45mm/dia) na Huíla. Risco no Talhão Alfa (Milho).
                            </p>
                            <div className="pt-1 flex items-center gap-2">
                              <button
                                onClick={() => { setHarvestModalOpen(true); setShowGuardianAlertsPopover(false); }}
                                className="px-2 py-1 bg-amber-500 text-white font-bold text-[9px] rounded-lg hover:bg-amber-600 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                              >
                                <Sprout size={10} />
                                <span>Adiantar Colheita</span>
                              </button>
                              <button
                                onClick={() => markAlertResolved('alert-agri-weather', 'Previsão Climática: Chuva Forte')}
                                className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] rounded-lg hover:bg-emerald-500/20 transition-all cursor-pointer border border-emerald-500/20"
                              >
                                Resolver
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Alert 2: Equipment Maintenance */}
                        {!resolvedAlertIds.includes('alert-agri-motor') && (
                          <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 text-left space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-500">
                                Equipamentos • Revisão
                              </span>
                              <span className="text-[9px] text-gray-400">Há 1 dia</span>
                            </div>
                            <h5 className="font-bold text-xs text-gray-900 dark:text-white">Motobomba Diesel 50HP: Horas de Revisão</h5>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                              Pivot de Irrigação 02 atingiu 480h activas. Substituir filtros e óleo.
                            </p>
                            <div className="pt-1 flex items-center gap-2">
                              <button
                                onClick={() => { setMotorRevisionModalOpen(true); setShowGuardianAlertsPopover(false); }}
                                className="px-2 py-1 bg-orange-500 text-white font-bold text-[9px] rounded-lg hover:bg-orange-600 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                              >
                                <Wrench size={10} />
                                <span>Concluir Revisão</span>
                              </button>
                              <button
                                onClick={() => markAlertResolved('alert-agri-motor', 'Motobomba de Rega Diesel 50HP')}
                                className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] rounded-lg hover:bg-emerald-500/20 transition-all cursor-pointer border border-emerald-500/20"
                              >
                                Resolver
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Alert 3: Livestock */}
                        {!resolvedAlertIds.includes('alert-livestock-weight') && (
                          <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-left space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                                Pecuária • Pesagem
                              </span>
                              <span className="text-[9px] text-gray-400">Hoje</span>
                            </div>
                            <h5 className="font-bold text-xs text-gray-900 dark:text-white">Lote Engorda A sem Pesagem (15 dias)</h5>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                              Gado do Lote BOV-045 necessita controlo de conversão alimentar.
                            </p>
                            <div className="pt-1 flex items-center gap-2">
                              <button
                                onClick={() => { setWeightingModalOpen(true); setShowGuardianAlertsPopover(false); }}
                                className="px-2 py-1 bg-yellow-500 text-white font-bold text-[9px] rounded-lg hover:bg-yellow-600 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                              >
                                <Activity size={10} />
                                <span>Registar Pesagem</span>
                              </button>
                              <button
                                onClick={() => markAlertResolved('alert-livestock-weight', 'Monitoria Pendente: Lote Engorda A')}
                                className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] rounded-lg hover:bg-emerald-500/20 transition-all cursor-pointer border border-emerald-500/20"
                              >
                                Resolver
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Alert 4: Commerce */}
                        {!resolvedAlertIds.includes('alert-commerce-margin') && (
                          <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-left space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-500">
                                Comércio • Margem Crítica
                              </span>
                              <span className="text-[9px] text-gray-400">Ontem</span>
                            </div>
                            <h5 className="font-bold text-xs text-gray-900 dark:text-white">Margem do Arroz Agulha abaixo de 10%</h5>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                              Margem em 8.5% devido a custos do fornecedor AngoAlimentos.
                            </p>
                            <div className="pt-1 flex items-center gap-2">
                              <button
                                onClick={() => { setPriceMarginModalOpen(true); setShowGuardianAlertsPopover(false); }}
                                className="px-2 py-1 bg-red-500 text-white font-bold text-[9px] rounded-lg hover:bg-red-600 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                              >
                                <TrendingUp size={10} />
                                <span>Reajustar Margem</span>
                              </button>
                              <button
                                onClick={() => markAlertResolved('alert-commerce-margin', 'Margem do Arroz Agulha ALIM-001')}
                                className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] rounded-lg hover:bg-emerald-500/20 transition-all cursor-pointer border border-emerald-500/20"
                              >
                                Resolver
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Alert 5: Fisheries */}
                        {!resolvedAlertIds.includes('alert-fisheries-motor') && (
                          <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 text-left space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-500">
                                Pesca • Motor
                              </span>
                              <span className="text-[9px] text-gray-400">Há 3 dias</span>
                            </div>
                            <h5 className="font-bold text-xs text-gray-900 dark:text-white">Motor Yamaha 250HP Atingiu 500h</h5>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                              Embarcação Estrela do Namibe necessita revisão preventiva das 500h.
                            </p>
                            <div className="pt-1 flex items-center gap-2">
                              <button
                                onClick={() => { setMotorRevisionModalOpen(true); setShowGuardianAlertsPopover(false); }}
                                className="px-2 py-1 bg-orange-500 text-white font-bold text-[9px] rounded-lg hover:bg-orange-600 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                              >
                                <Wrench size={10} />
                                <span>Agendar Revisão</span>
                              </button>
                              <button
                                onClick={() => markAlertResolved('alert-fisheries-motor', 'Motor Yamaha 250HP Atingiu Horas de Revisão')}
                                className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] rounded-lg hover:bg-emerald-500/20 transition-all cursor-pointer border border-emerald-500/20"
                              >
                                Resolver
                              </button>
                            </div>
                          </div>
                        )}

                        {['alert-agri-weather', 'alert-agri-motor', 'alert-livestock-weight', 'alert-commerce-margin', 'alert-fisheries-motor'].filter(id => !resolvedAlertIds.includes(id)).length === 0 && (
                          <div className="p-4 text-center text-emerald-500 text-xs font-bold space-y-1">
                            <CheckCircle2 size={24} className="mx-auto" />
                            <p>Todos os alertas operacionais resolvidos!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Economic Identity Score Widget */}
                {!['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'CONSULTANT'].includes(user.role) && (
                  <div className="flex items-center gap-4 bg-brand-purple/5 p-4 rounded-xl border border-brand-purple/10">
                    {/* Circular Gauge */}
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-gray-200 dark:text-gray-800" strokeWidth="4" fill="transparent" />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="28" 
                          stroke="currentColor" 
                          className="text-brand-purple" 
                          strokeWidth="4" 
                          fill="transparent" 
                          strokeDasharray={175.9}
                          strokeDashoffset={175.9 - (175.9 * (Number(user.fundingScore) || 0)) / 100}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm text-brand-purple">
                        {user.fundingScore || 0}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pontuação Económica</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">Nível: {user.maturity}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dashboard loading states */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-brand-iris border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500 font-medium">A carregar dados do ecossistema...</p>
          </div>
        ) : showProfile ? (
          <div className="space-y-6">
            <UserProfileModule onBack={() => setShowProfile(false)} />
          </div>
        ) : (
          <div className="space-y-6">

            {/* 1. SUPER_ADMIN DASHBOARD FLOW */}
            {user.role === 'SUPER_ADMIN' && (
              <div className="grid grid-cols-1 gap-6">
                
                {/* Platform Health Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Parceiros Registados</p>
                    <p className="text-2xl font-bold text-brand-iris mt-2">{organizations.length} Coops</p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Utilizadores Totais</p>
                    <p className="text-2xl font-bold text-brand-purple mt-2">{usersList.length} Contas</p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">KYC Pendente</p>
                    <p className="text-2xl font-bold text-amber-500 mt-2">
                      {documentsQueue.filter(d => d.status === 'PENDING').length} Documentos
                    </p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Score Geral</p>
                    <p className="text-2xl font-bold text-green-500 mt-2">
                      {usersList.length ? Math.round(usersList.reduce((acc, u) => acc + (u.fundingScore || 0), 0) / usersList.length) : 58} Pontos
                    </p>
                  </div>
                </div>

                {/* Tab Selector */}
                <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-850 pb-2">
                  {[
                    { id: 'ecosystem', label: '🏦 Ecosystem (Banks)', color: 'border-blue-500' },
                    { id: 'users', label: '👥 User Management', color: 'border-purple-500' },
                    { id: 'kyc', label: '📂 KYC Queue', color: 'border-amber-500' },
                    { id: 'survey', label: '📋 Survey Engine', color: 'border-green-500' },
                    { id: 'logs', label: '💻 System Logs', color: 'border-emerald-500' },
                    { id: 'consultants', label: '🤝 Delegação de Consultores', color: 'border-indigo-500' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSuperAdminTab(tab.id as any)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all border-b-2 ${
                        superAdminTab === tab.id
                          ? 'bg-brand-iris/10 text-brand-iris border-brand-iris'
                          : 'bg-white dark:bg-[#12121A] text-gray-500 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB CONTENT: Ecosystem */}
                {superAdminTab === 'ecosystem' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                          🏦 Ecossistema de Bancos Parceiros (BAI, BFA, BPC, BCI, FADA)
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Consulte e gira as integrações de API de crédito e os limites das linhas de apoio financeiro ao produtor rural.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const logMsg = `[${new Date().toLocaleTimeString()}] [SUCCESS] Sincronização em lote concluída para todos os bancos parceiros de Angola.`;
                          setSystemLogs(prev => [logMsg, ...prev]);
                          alert('Sincronização com as APIs bancárias efetuada com sucesso!');
                        }}
                        className="px-4 py-2 text-xs font-bold text-white bg-brand-iris hover:bg-brand-iris/90 rounded-xl transition-all shadow-sm"
                      >
                        Sincronizar APIs de Crédito
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {partnerBanks.map(bank => (
                        <div key={bank.id} className="p-4 bg-gray-50 dark:bg-[#1F1F2A] rounded-xl border border-gray-150 dark:border-[#2E2E3A] flex flex-col justify-between space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{bank.name}</h4>
                              <p className="text-xs text-brand-iris font-semibold mt-0.5">{bank.line}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              bank.status === 'Sincronizado'
                                ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                            }`}>
                              {bank.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-200 dark:border-gray-850">
                            <div>
                              <p className="text-gray-400">Limite Linha</p>
                              <p className="font-bold text-gray-900 dark:text-white">{bank.limit}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Candidaturas Activas</p>
                              <p className="font-bold text-gray-900 dark:text-white">{bank.activeApps} Submetidas</p>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              onClick={() => {
                                alert(`Configuração de credenciais de API do ${bank.name} aberta.`);
                              }}
                              className="px-3 py-1.5 text-[10px] font-bold border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                            >
                              Configurar API
                            </button>
                            <button
                              onClick={() => {
                                setPartnerBanks(prev => prev.map(b => b.id === bank.id ? { ...b, status: 'Sincronizado' } : b));
                                const logMsg = `[${new Date().toLocaleTimeString()}] [INFO] API do ${bank.name} reconectada manualmente pelo SuperAdmin.`;
                                setSystemLogs(prev => [logMsg, ...prev]);
                              }}
                              className="px-3 py-1.5 text-[10px] font-bold text-white bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 rounded-lg transition-all"
                            >
                              Forçar Reconexão
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: User Management */}
                {superAdminTab === 'users' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                          👥 Gestão de Utilizadores e Delegação de Funções
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Promova, despromova ou suspenda o acesso de utilizadores da plataforma MiraWelch.
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-semibold text-xs">
                            <th className="pb-3">Nome</th>
                            <th className="pb-3">Email</th>
                            <th className="pb-3">Organização</th>
                            <th className="pb-3">Função (Role)</th>
                            <th className="pb-3">Estado</th>
                            <th className="pb-3 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersList.map(u => {
                            const relatedOrg = organizations.find(o => o.id === u.organizationId);
                            const isSuspended = relatedOrg?.suspended || false;
                            return (
                              <tr key={u.id} className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                <td className="py-3 font-semibold text-gray-900 dark:text-white">{u.name}</td>
                                <td className="py-3 text-gray-500 font-mono text-xs">{u.email}</td>
                                <td className="py-3 text-xs text-gray-400">
                                  {u.organizationName || relatedOrg?.name || 'Sistema MiraWelch'}
                                </td>
                                <td className="py-3">
                                  <select
                                    value={u.role}
                                    onChange={async (e) => {
                                      const newRole = e.target.value;
                                      // Local state update immediately
                                      setUsersList(prev => prev.map(usr => usr.id === u.id ? { ...usr, role: newRole } : usr));
                                      const logMsg = `[${new Date().toLocaleTimeString()}] [INFO] Permissões do utilizador ${u.name} alteradas para ${newRole}.`;
                                      setSystemLogs(prev => [logMsg, ...prev]);
                                      alert(`Função de ${u.name} atualizada com sucesso para ${newRole}!`);
                                    }}
                                    className="text-xs font-semibold px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
                                  >
                                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="ANALYST">ANALYST</option>
                                    <option value="CONSULTANT">CONSULTANT</option>
                                    <option value="OWNER">OWNER</option>
                                    <option value="MANAGER">MANAGER</option>
                                    <option value="FINANCIAL_OFFICER">FINANCIAL_OFFICER</option>
                                  </select>
                                </td>
                                <td className="py-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isSuspended
                                      ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                                      : 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                                  }`}>
                                    {isSuspended ? 'SUSPENSO' : 'ACTIVO'}
                                  </span>
                                </td>
                                <td className="py-3 text-right">
                                  <button
                                    onClick={() => {
                                      if (u.organizationId) {
                                        const nextSuspendState = !isSuspended;
                                        fetch(`/api/admin/suspend`, {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ 
                                            organizationId: u.organizationId, 
                                            suspend: nextSuspendState,
                                            reason: nextSuspendState ? 'Suspensão manual temporária via SuperAdmin.' : undefined
                                          })
                                        }).then(() => {
                                          fetchDashboardData();
                                          const logMsg = `[${new Date().toLocaleTimeString()}] [INFO] Organização ${u.organizationName} ${nextSuspendState ? 'SUSPENSA' : 'REATIVADA'} por SuperAdmin.`;
                                          setSystemLogs(prev => [logMsg, ...prev]);
                                        });
                                      } else {
                                        alert('Utilizadores sem organização associada não podem ser suspensos por este canal.');
                                      }
                                    }}
                                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                                      isSuspended
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white'
                                    }`}
                                  >
                                    {isSuspended ? 'Reativar' : 'Suspender'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: KYC Queue */}
                {superAdminTab === 'kyc' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                        <FileCheck2 className="text-amber-500" size={18} />
                        Fila de Validação Documental (AML & KYC)
                      </h3>
                      <span className="text-xs text-gray-400">Total de Documentos: {documentsQueue.length}</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-semibold text-xs">
                            <th className="pb-3">Organização</th>
                            <th className="pb-3">Nome do Ficheiro</th>
                            <th className="pb-3">Tipo</th>
                            <th className="pb-3">Estado</th>
                            <th className="pb-3 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documentsQueue.length === 0 ? (
                            <tr className="border-b border-gray-100 dark:border-gray-850">
                              <td colSpan={5} className="py-6 text-center text-gray-400">Nenhum documento pendente na fila.</td>
                            </tr>
                          ) : (
                            documentsQueue.map((doc: any) => (
                            <tr key={doc.id} className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                              <td className="py-3 font-semibold text-gray-900 dark:text-white">{getOrgNameForDoc(doc)}</td>
                              <td className="py-3 font-mono text-xs">{doc.name || doc.title || 'Documento Submetido'}</td>
                              <td className="py-3">
                                <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-500 uppercase">{doc.type || doc.category || 'FINANCIAL'}</span>
                              </td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  doc.status === 'VERIFIED' 
                                    ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300' 
                                    : doc.status === 'REJECTED'
                                    ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                }`}>
                                  {doc.status === 'VERIFIED' ? 'Aprovado' : doc.status === 'REJECTED' ? 'Rejeitado' : 'Pendente'}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => setViewingDoc(doc as any)}
                                  className="p-1 text-brand-iris hover:bg-brand-iris/10 rounded"
                                  title="Analisar Documento"
                                >
                                  <Eye size={16} />
                                </button>
                              </td>
                            </tr>
                          )))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Survey Engine */}
                {superAdminTab === 'survey' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-6">
                    {/* Header bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                      <div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                          📋 Survey Engine — Painel do Júri e Inquéritos
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Estudo Activo: <strong className="text-brand-iris">{surveyInfo?.title || 'Validação LISPA 2026'}</strong>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-50 dark:bg-[#1F1F2A] px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 text-right">
                          <span className="text-[10px] text-gray-400 uppercase font-bold block">Submissões</span>
                          <span className="text-sm font-extrabold font-mono text-gray-900 dark:text-white">
                            {stats?.totalResponses || surveyInfo?.responsesCount || surveyList.length} / {stats?.targetGoal || 100}
                          </span>
                        </div>
                        <div className="bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-500/20 text-right">
                          <span className="text-[10px] text-green-500 uppercase font-bold block">Meta LISPA</span>
                          <span className="text-sm font-extrabold font-mono text-green-500">
                            {stats?.progressPercentage || 4}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section 1: Question Analytics (if available from Render Jury Dashboard API) */}
                    {questionStats && questionStats.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-brand-iris flex items-center gap-2">
                          📊 Análise Agregada do Júri (GET /api/v1/surveys/jury-dashboard)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {questionStats.map((q: any) => {
                            const freq = q.stats?.frequency || {};
                            const samples = q.stats?.sampleTexts || [];
                            const totalAns = q.stats?.totalAnswers || 0;
                            const freqKeys = Object.keys(freq);

                            return (
                              <div key={q.id} className="p-4 bg-gray-50 dark:bg-[#1F1F2A] rounded-xl border border-gray-200 dark:border-[#2E2E3A] flex flex-col justify-between space-y-3">
                                <div>
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-iris/10 text-brand-iris">
                                      {q.id}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-mono">
                                      {totalAns} respostas
                                    </span>
                                  </div>
                                  <h5 className="font-bold text-xs text-gray-900 dark:text-white mt-1.5 leading-snug">
                                    {q.text}
                                  </h5>
                                </div>

                                {/* Frequency Bars */}
                                {freqKeys.length > 0 && (
                                  <div className="space-y-1.5 pt-2 border-t border-gray-200/50 dark:border-gray-800">
                                    {freqKeys.map(k => {
                                      const count = Number(freq[k] || 0);
                                      const pct = totalAns > 0 ? Math.round((count / totalAns) * 100) : 0;
                                      return (
                                        <div key={k} className="text-[10px]">
                                          <div className="flex justify-between text-gray-600 dark:text-gray-300 font-medium mb-0.5">
                                            <span className="truncate max-w-[150px]">{k}</span>
                                            <span className="font-mono font-bold">{count} ({pct}%)</span>
                                          </div>
                                          <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-brand-iris h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Sample Texts */}
                                {samples.length > 0 && (
                                  <div className="space-y-1 pt-2 border-t border-gray-200/50 dark:border-gray-800">
                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Exemplos Registados:</span>
                                    <div className="flex flex-col gap-1">
                                      {samples.slice(0, 3).map((txt: string, idx: number) => (
                                        txt ? (
                                          <p key={idx} className="text-[10px] text-gray-700 dark:text-gray-300 bg-white dark:bg-[#15151F] px-2 py-1 rounded border border-gray-100 dark:border-gray-800 italic truncate">
                                            "{txt}"
                                          </p>
                                        ) : null
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Section 2: Individual Respondent Organizations */}
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        🏢 Respostas Individuais das Organizações ({surveyList.length})
                      </h4>

                      {surveyList.length === 0 && !loading && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-[#2E2E3A] rounded-xl text-gray-400 text-xs">
                          Nenhuma resposta individual submetida para este estudo de validação ainda.
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {surveyList.map(srv => (
                          <div key={srv.id} className="p-4 bg-gray-50 dark:bg-[#1F1F2A] rounded-xl border border-gray-200 dark:border-[#2E2E3A] flex flex-col justify-between space-y-4">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-xs text-gray-900 dark:text-white leading-snug">{srv.orgName}</h4>
                                <span className="px-1.5 py-0.5 rounded bg-brand-iris/10 text-brand-iris font-mono text-[9px] font-bold">
                                  {srv.sector}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400 font-semibold mt-1">
                                Província: {srv.province} {srv.nif ? `| NIF: ${srv.nif}` : ''}
                              </p>
                              
                              <div className="mt-3 bg-white dark:bg-[#15151F] p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 text-xs">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Maior Desafio:</p>
                                <p className="text-gray-800 dark:text-gray-200 mt-1 leading-snug font-medium">"{srv.biggestChallenge}"</p>
                              </div>
                            </div>

                            <div className="space-y-1.5 text-[10px] text-gray-500">
                              {srv.contact && (
                                <div className="flex justify-between">
                                  <span>Contacto:</span>
                                  <span className="font-bold text-gray-700 dark:text-gray-300 font-mono">{srv.contact}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Usa papel no campo?</span>
                                <span className="font-bold text-gray-700 dark:text-gray-300">{srv.usesPaper ? 'Sim' : 'Não'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Usa folha Excel?</span>
                                <span className="font-bold text-gray-700 dark:text-gray-300">{srv.usesExcel ? 'Sim' : 'Não'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Coordena via WhatsApp?</span>
                                <span className="font-bold text-gray-700 dark:text-gray-300">{srv.usesWhatsApp ? 'Sim' : 'Não'}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                alert(
                                  `Resumo do Inquérito de ${srv.orgName}:\n\n` +
                                  `- Desafio: ${srv.biggestChallenge}\n` +
                                  `- Província: ${srv.province}\n` +
                                  `- Sector: ${srv.sector}\n` +
                                  `- NIF: ${srv.nif || 'Não fornecido'}\n` +
                                  `- Contacto: ${srv.contact || 'Não fornecido'}\n` +
                                  `- Intenção de Uso: ${srv.probabilityToUse || 'Não avaliado'}\n` +
                                  `- Propensão a Pagar: ${srv.willingToPay || 'Não avaliado'}\n\n` +
                                  `- Gestão de Dados: ${srv.usesPaper ? 'Papel ' : ''}${srv.usesExcel ? 'Excel ' : ''}${srv.usesWhatsApp ? 'WhatsApp' : ''}`
                                );
                              }}
                              className="w-full py-1.5 text-[10px] font-bold text-center border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 transition-all cursor-pointer"
                            >
                              Ver Inquérito Completo
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: System Logs */}
                {superAdminTab === 'logs' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                          💻 Console de Auditoria e System Logs
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Monitore as ações do ecossistema e requisições de API em tempo real.
                        </p>
                      </div>
                      <button
                        onClick={() => setSystemLogs([])}
                        className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-lg border border-red-500/10 transition-all"
                      >
                        Limpar Logs
                      </button>
                    </div>

                    <div className="bg-[#0D0D12] rounded-xl p-4 border border-gray-800 font-mono text-xs text-emerald-400 h-64 overflow-y-auto space-y-1.5 scrollbar-thin">
                      {systemLogs.length === 0 ? (
                        <p className="text-gray-500 italic">Nenhum evento registado no console de auditoria.</p>
                      ) : (
                        systemLogs.map((log, i) => (
                          <p key={i} className="leading-relaxed hover:bg-white/5 px-1 rounded transition-colors">{log}</p>
                        ))
                      )}
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const input = (e.target as any).elements.logInput;
                        if (input.value.trim()) {
                          const customLog = `[${new Date().toLocaleTimeString()}] [MANUAL] ${input.value.trim()}`;
                          setSystemLogs(prev => [customLog, ...prev]);
                          input.value = '';
                        }
                      }}
                      className="flex gap-2"
                    >
                      <input
                        name="logInput"
                        placeholder="Injete uma mensagem de log manual para simular auditoria..."
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-[#1A1A21] border border-gray-200 dark:border-gray-800 outline-none text-gray-900 dark:text-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold text-white bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 rounded-xl"
                      >
                        Injetar Log
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB CONTENT: Consultants Delegation */}
                {superAdminTab === 'consultants' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-6">
                    <div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                        🤝 Painel de Delegação de Consultores Especialistas
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Selecione e atribua consultores qualificados da rede MiraWelch para dar suporte direto de mentorização técnica às cooperativas.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {organizations.map(org => {
                        const assignedConsultant = consultants.find(c => Array.isArray(c.assignedOrgs) && c.assignedOrgs.includes(org.id));
                        return (
                          <div key={org.id} className="p-4 bg-gray-50 dark:bg-[#1F1F2A] rounded-xl border border-gray-150 dark:border-[#2E2E3A] flex flex-col justify-between space-y-4 hover:border-brand-purple/20 transition-all">
                            <div>
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <div>
                                  <h4 className="font-bold text-xs text-gray-900 dark:text-white leading-tight">{org.name}</h4>
                                  <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-wider">{org.sector} — {org.province}</p>
                                </div>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  org.suspended ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                                }`}>
                                  {org.suspended ? 'Suspenso' : 'Ativo'}
                                </span>
                              </div>

                              <div className="mt-3 p-2 bg-white dark:bg-[#15151F] rounded-lg border border-gray-200 dark:border-[#2A2A35] text-[11px]">
                                <p className="text-gray-400">Consultor Atribuído:</p>
                                <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                                  {assignedConsultant ? `👤 ${assignedConsultant.name}` : '❌ Nenhum consultor alocado.'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-850">
                              <span className="text-[10px] text-gray-400">Selecionar Especialista:</span>
                              {activeOrgToAssign === org.id ? (
                                <select
                                  onChange={e => {
                                    handleDelegate(org.id, e.target.value);
                                    const logMsg = `[${new Date().toLocaleTimeString()}] [SUCCESS] Consultor atribuído com sucesso à organização ${org.name}.`;
                                    setSystemLogs(prev => [logMsg, ...prev]);
                                  }}
                                  className="text-[10px] font-bold px-2 py-1 rounded bg-brand-purple text-white outline-none"
                                  defaultValue=""
                                >
                                  <option value="" disabled>Escolha...</option>
                                  {consultants.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                  ))}
                                </select>
                              ) : (
                                <button
                                  onClick={() => setActiveOrgToAssign(org.id)}
                                  className="text-[10px] font-bold text-brand-purple hover:underline"
                                >
                                  Delegar Consultor
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 1.5. ADMIN DASHBOARD FLOW */}
            {user.role === 'ADMIN' && (
              <div className="grid grid-cols-1 gap-6">
                
                {/* Admin Quick Performance KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cooperativas Geridas</p>
                    <p className="text-2xl font-bold text-brand-purple mt-2">{organizations.length} Registadas</p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Convites de Equipa</p>
                    <p className="text-2xl font-bold text-brand-iris mt-2">{adminInvites.length} Enviados</p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Membros Activos</p>
                    <p className="text-2xl font-bold text-green-500 mt-2">{usersList.length} Utilizadores</p>
                  </div>
                </div>

                {/* Tab Selector */}
                <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-850 pb-2">
                  {[
                    { id: 'organizations', label: '🏢 My Organizations (As Minhas Organizações)' },
                    { id: 'invites', label: '✉️ Team Invites (Convites)' },
                    { id: 'delegation', label: '🔑 Role Delegation (Delegar Funções)' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setAdminTab(tab.id as any)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all border-b-2 ${
                        adminTab === tab.id
                          ? 'bg-brand-purple/10 text-brand-purple border-brand-purple'
                          : 'bg-white dark:bg-[#12121A] text-gray-500 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB CONTENT: Organizations */}
                {adminTab === 'organizations' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white">Gerenciamento de Cooperativas</h3>
                        <p className="text-xs text-gray-400 mt-1">Monitore e controle os estados de conformidade das cooperativas sob a alçada da sua administração.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {organizations.map(org => {
                        const assignedConsultant = consultants.find(c => Array.isArray(c.assignedOrgs) && c.assignedOrgs.includes(org.id));
                        return (
                          <div key={org.id} className="p-5 bg-gray-50 dark:bg-[#1F1F2A] rounded-xl border border-gray-150 dark:border-[#2E2E3A] hover:border-brand-purple/20 transition-all flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <div>
                                  <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{org.name}</h4>
                                  <p className="text-xs text-gray-400 font-mono mt-0.5 uppercase tracking-wider">{org.sector} — {org.province}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  org.suspended ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                                }`}>
                                  {org.suspended ? 'Suspenso' : 'Activo'}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mt-4 p-3 bg-white dark:bg-[#15151F] rounded-lg border border-gray-200 dark:border-[#2A2A35] text-xs">
                                <div>
                                  <p className="text-gray-400 text-[10px]">Maturidade MiraWelch:</p>
                                  <p className="font-bold text-brand-purple mt-0.5">{org.maturity}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-[10px]">Consultor Técnico:</p>
                                  <p className="font-semibold text-gray-700 dark:text-gray-300 mt-0.5 truncate">
                                    {assignedConsultant ? `👤 ${assignedConsultant.name}` : 'Nenhum Alocado'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-850 mt-4">
                              <span className="text-xs text-gray-400">Alterar Estado da Cooperativa:</span>
                              <button
                                onClick={async () => {
                                  const nextState = !org.suspended;
                                  const reason = nextState ? 'Suspensão aplicada por administrador de equipa.' : undefined;
                                  
                                  // Local state update
                                  setOrganizations(prev => prev.map(o => o.id === org.id ? { ...o, suspended: nextState, suspendedReason: reason } : o));
                                  alert(`Organização ${org.name} foi ${nextState ? 'SUSPENSA' : 'REATIVADA'} com sucesso.`);
                                  
                                  const logMsg = `[${new Date().toLocaleTimeString()}] [INFO] Organização ${org.name} ${nextState ? 'SUSPENSA' : 'REATIVADA'} por Admin.`;
                                  setSystemLogs(prev => [logMsg, ...prev]);
                                }}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                  org.suspended 
                                    ? 'bg-green-500 text-white hover:bg-green-600' 
                                    : 'bg-red-500/15 text-red-500 hover:bg-red-500/25'
                                }`}
                              >
                                {org.suspended ? 'Reativar Organização' : 'Suspender Operações'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Team Invites */}
                {adminTab === 'invites' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-6">
                    <div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">✉️ Enviar Convites de Colaboração</h3>
                      <p className="text-xs text-gray-400 mt-1">Adicione especialistas, analistas de crédito ou diretores de cooperativa diretamente ao seu ecossistema.</p>
                    </div>

                    {/* Invite form */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!inviteName || !inviteEmail) {
                          alert('Por favor, preencha o nome e o email!');
                          return;
                        }
                        const newInvite = {
                          id: `inv-${Date.now()}`,
                          name: inviteName,
                          email: inviteEmail,
                          role: inviteRole,
                          status: 'Pendente',
                          sentAt: new Date().toISOString().split('T')[0]
                        };
                        setAdminInvites(prev => [newInvite, ...prev]);
                        setInviteName('');
                        setInviteEmail('');
                        alert(`Convite enviado com sucesso para ${inviteName} (${inviteEmail})!`);
                        const logMsg = `[${new Date().toLocaleTimeString()}] [INFO] Administrador convidou ${inviteName} como ${inviteRole}.`;
                        setSystemLogs(prev => [logMsg, ...prev]);
                      }}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-gray-50 dark:bg-[#1A1A21] border border-gray-150 dark:border-gray-800 rounded-xl"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nome Completo</label>
                        <input
                          type="text"
                          value={inviteName}
                          onChange={e => setInviteName(e.target.value)}
                          placeholder="ex: João Gaspar"
                          className="px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F1F2A] outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Corporativo</label>
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={e => setInviteEmail(e.target.value)}
                          placeholder="ex: joao@gaspar.co"
                          className="px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F1F2A] outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Função de Equipa</label>
                        <select
                          value={inviteRole}
                          onChange={e => setInviteRole(e.target.value)}
                          className="px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F1F2A] outline-none text-gray-700 dark:text-gray-300"
                        >
                          <option value="MANAGER">MANAGER (Gestor)</option>
                          <option value="ANALYST">ANALYST (Analista)</option>
                          <option value="CONSULTANT">CONSULTANT (Consultor)</option>
                          <option value="FINANCIAL_OFFICER">FINANCIAL_OFFICER (Diretor Financeiro)</option>
                          <option value="OWNER">OWNER (Presidente)</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full h-[38px] px-4 py-2 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold rounded-lg transition-all"
                        >
                          Enviar Convite
                        </button>
                      </div>
                    </form>

                    {/* Invite list */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-semibold text-xs">
                            <th className="pb-3">Convidado</th>
                            <th className="pb-3">Email</th>
                            <th className="pb-3">Função Atribuída</th>
                            <th className="pb-3">Enviado Em</th>
                            <th className="pb-3">Estado</th>
                            <th className="pb-3 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminInvites.map(inv => (
                            <tr key={inv.id} className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                              <td className="py-3 font-semibold text-gray-900 dark:text-white">{inv.name}</td>
                              <td className="py-3 text-gray-500 font-mono text-xs">{inv.email}</td>
                              <td className="py-3 text-xs font-semibold text-brand-purple">{inv.role}</td>
                              <td className="py-3 font-mono text-xs text-gray-400">{inv.sentAt}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  inv.status === 'Aceite'
                                    ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                }`}>
                                  {inv.status}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => {
                                    alert(`Convite reenviado com sucesso para ${inv.email}!`);
                                  }}
                                  className="text-[10px] font-bold text-brand-purple hover:underline"
                                >
                                  Reenviar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Role Delegation */}
                {adminTab === 'delegation' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">🔑 Delegar Funções e Acessos</h3>
                      <p className="text-xs text-gray-400 mt-1">Atribua e gerencie instantaneamente as funções dos usuários em todo o ecossistema da organização.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-semibold text-xs">
                            <th className="pb-3">Nome</th>
                            <th className="pb-3">Email</th>
                            <th className="pb-3">Organização Associada</th>
                            <th className="pb-3">Delegar Função (Role)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersList.map(u => {
                            const relatedOrg = organizations.find(o => o.id === u.organizationId);
                            return (
                              <tr key={u.id} className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                <td className="py-3 font-semibold text-gray-900 dark:text-white">{u.name}</td>
                                <td className="py-3 text-gray-500 font-mono text-xs">{u.email}</td>
                                <td className="py-3 text-xs text-gray-400">{relatedOrg?.name || 'Geral (MiraWelch)'}</td>
                                <td className="py-3">
                                  <select
                                    value={u.role}
                                    onChange={async (e) => {
                                      const newRole = e.target.value;
                                      setUsersList(prev => prev.map(usr => usr.id === u.id ? { ...usr, role: newRole } : usr));
                                      const logMsg = `[${new Date().toLocaleTimeString()}] [INFO] Permissões do utilizador ${u.name} alteradas para ${newRole} por Admin.`;
                                      setSystemLogs(prev => [logMsg, ...prev]);
                                      alert(`Função de ${u.name} delegada com sucesso para ${newRole}!`);
                                    }}
                                    className="text-xs font-semibold px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent outline-none"
                                  >
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="ANALYST">ANALYST</option>
                                    <option value="CONSULTANT">CONSULTANT</option>
                                    <option value="OWNER">OWNER</option>
                                    <option value="MANAGER">MANAGER</option>
                                    <option value="FINANCIAL_OFFICER">FINANCIAL_OFFICER</option>
                                  </select>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 2. ANALYST DASHBOARD FLOW */}
            {user.role === 'ANALYST' && (
              <div className="grid grid-cols-1 gap-6">
                
                {/* Analyst Performance Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Candidaturas Pendentes</p>
                    <p className="text-2xl font-bold text-brand-iris mt-2">
                      {creditApplications.filter(a => a.status === 'Em Análise' || a.status === 'Pendente').length} Pedidos
                    </p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Média de Scores MiraWelch</p>
                    <p className="text-2xl font-bold text-brand-purple mt-2">68 Pontos</p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Documentos na Fila</p>
                    <p className="text-2xl font-bold text-amber-500 mt-2">2 Pendentes</p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Taxa de Conversão</p>
                    <p className="text-2xl font-bold text-green-500 mt-2">78% Aprovados</p>
                  </div>
                </div>

                {/* Tab Selector */}
                <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-850 pb-2">
                  {[
                    { id: 'applications', label: '📂 Applications & Requests' },
                    { id: 'scoring', label: '📊 Scoring Queue' },
                    { id: 'docs', label: '📄 Document Review' },
                    { id: 'workflow', label: '⚡ Approval Workflow' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setAnalystTab(tab.id as any)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all border-b-2 ${
                        analystTab === tab.id
                          ? 'bg-brand-iris/10 text-brand-iris border-brand-iris'
                          : 'bg-white dark:bg-[#12121A] text-gray-500 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB CONTENT: Applications */}
                {analystTab === 'applications' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">Fila de Candidaturas a Financiamento</h3>
                      <span className="text-xs text-gray-400">Total: {creditApplications.length}</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-semibold text-xs">
                            <th className="pb-3">Cooperativa</th>
                            <th className="pb-3">Montante Solicitado</th>
                            <th className="pb-3">Prazo</th>
                            <th className="pb-3">Data Envio</th>
                            <th className="pb-3">Estado</th>
                            <th className="pb-3 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {creditApplications.map(app => (
                            <tr key={app.id} className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                              <td className="py-3 font-semibold text-gray-900 dark:text-white">{app.orgName}</td>
                              <td className="py-3 font-bold text-gray-800 dark:text-gray-200">
                                {app.amount.toLocaleString('pt-AO')} Kz
                              </td>
                              <td className="py-3 font-semibold text-xs text-gray-500">{app.term}</td>
                              <td className="py-3 font-mono text-xs text-gray-400">{app.date}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  app.status === 'Aprovado'
                                    ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                                    : app.status === 'Revisão Necessária'
                                    ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedAppWorkflow(app);
                                    setAnalystTab('workflow');
                                  }}
                                  className="px-3 py-1.5 text-xs font-bold text-white bg-brand-iris hover:bg-brand-iris/90 rounded-lg transition-all"
                                >
                                  Avaliar no Fluxo
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Scoring Queue */}
                {analystTab === 'scoring' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">Priorização e Fila de Pontuação (Scoring Queue)</h3>
                    <p className="text-xs text-gray-400">
                      As cooperativas rurais com maior Economic Identity Score devem ser canalizadas prioritariamente para os bancos BAI, BFA e BPC.
                    </p>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-semibold text-xs">
                            <th className="pb-3">Membro do Ecossistema</th>
                            <th className="pb-3">Sector</th>
                            <th className="pb-3">Província</th>
                            <th className="pb-3">Nível Maturidade</th>
                            <th className="pb-3">Economic Identity Score</th>
                            <th className="pb-3 text-right">Acção de Auditoria</th>
                          </tr>
                        </thead>
                        <tbody>
                          {organizations.map(org => (
                            <tr key={org.id} className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                              <td className="py-3 font-semibold text-gray-900 dark:text-white">{org.name}</td>
                              <td className="py-3 font-mono text-xs text-brand-iris font-semibold uppercase">{org.sector}</td>
                              <td className="py-3 text-xs text-gray-400">{org.province}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  org.maturity === 'ADVANCED'
                                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                                    : org.maturity === 'INTERMEDIATE'
                                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                }`}>
                                  {org.maturity}
                                </span>
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-12 bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${
                                        (org.maturity === 'ADVANCED' ? 85 : 55) >= 70 ? 'bg-green-500' : 'bg-amber-500'
                                      }`}
                                      style={{ width: `${org.maturity === 'ADVANCED' ? 85 : 55}%` }}
                                    />
                                  </div>
                                  <span className="font-bold text-gray-900 dark:text-white">
                                    {org.maturity === 'ADVANCED' ? 85 : 55} pts
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => setScoreReportOrgModal(org)}
                                  className="px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                                >
                                  Gerar Relatório MiraWelch
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Document Review */}
                {analystTab === 'docs' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">📄 Revisão de Documentos do Ecossistema</h3>
                    <p className="text-xs text-gray-400">
                      Revise e valide minuciosamente os documentos de registo e conformidade das cooperativas de forma rigorosa.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-12">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm border-collapse">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-semibold text-xs">
                                <th className="pb-3">Cooperativa</th>
                                <th className="pb-3">Nome Ficheiro</th>
                                <th className="pb-3">Tipo</th>
                                <th className="pb-3">Enviado em</th>
                                <th className="pb-3">Estado</th>
                                <th className="pb-3 text-right">Acção de Auditoria</th>
                              </tr>
                            </thead>
                            <tbody>
                              {documentsQueue.length === 0 ? (
                                <tr className="border-b border-gray-100 dark:border-gray-850">
                                  <td colSpan={6} className="py-6 text-center text-gray-400">Nenhum documento pendente na fila.</td>
                                </tr>
                              ) : (
                                documentsQueue.map((doc: any) => (
                                <tr key={doc.id} className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                  <td className="py-3 font-semibold text-gray-900 dark:text-white">{getOrgNameForDoc(doc)}</td>
                                  <td className="py-3 font-mono text-xs">{doc.name || doc.title || 'Documento Submetido'}</td>
                                  <td className="py-3"><span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-500 uppercase">{doc.type || doc.category || 'FINANCIAL'}</span></td>
                                  <td className="py-3 font-mono text-xs text-gray-400">{doc.date || doc.createdAt?.split(' ')[0] || '2026-07-28'}</td>
                                  <td className="py-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      doc.status === 'VERIFIED'
                                        ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                                        : doc.status === 'REJECTED'
                                        ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                    }`}>
                                      {doc.status === 'VERIFIED' ? 'Aprovado' : doc.status === 'REJECTED' ? 'Rejeitado' : 'Pendente'}
                                    </span>
                                  </td>
                                  <td className="py-3 text-right">
                                    <button
                                      onClick={() => setViewingDoc(doc as any)}
                                      className="p-1.5 text-brand-iris hover:bg-brand-iris/10 rounded-lg transition-all"
                                      title="Abrir Lightbox de Validação"
                                    >
                                      <Eye size={16} />
                                    </button>
                                  </td>
                                </tr>
                              )))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Approval Workflow */}
                {analystTab === 'workflow' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                      <div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white">⚡ Fluxo Sequencial de Aprovação de Crédito</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Avalie passo-a-passo a elegibilidade técnica da cooperativa selecionada antes de submeter ao banco de fomento.
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <select
                          onChange={(e) => {
                            const found = creditApplications.find(a => a.id === e.target.value);
                            if (found) setSelectedAppWorkflow(found);
                          }}
                          value={selectedAppWorkflow?.id || ''}
                          className="text-xs font-semibold px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
                        >
                          <option value="" disabled>Escolher candidatura ativa...</option>
                          {creditApplications.map(app => (
                            <option key={app.id} value={app.id}>{app.orgName}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {selectedAppWorkflow ? (
                      <div className="space-y-6">
                        <div className="p-4 bg-gray-50 dark:bg-[#1F1F2A] rounded-xl border border-gray-150 dark:border-[#2E2E3A]">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{selectedAppWorkflow.orgName}</h4>
                              <p className="text-xs text-gray-400 font-mono mt-0.5">Montante: {selectedAppWorkflow.amount.toLocaleString('pt-AO')} Kz • Prazo: {selectedAppWorkflow.term}</p>
                            </div>
                            <span className="px-2 py-0.5 bg-brand-purple/10 text-brand-purple text-xs font-bold rounded">
                              Score: {selectedAppWorkflow.orgName.includes('Humpata') ? '55' : '85'} Pontos
                            </span>
                          </div>
                        </div>

                        {/* Interactive Workflow Steps Visualizer */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                          {[
                            { step: 1, name: '1. KYC & AML', desc: 'Validação de Identidade' },
                            { step: 2, name: '2. Histórico Operacional', desc: 'Frequência de Registos' },
                            { step: 3, name: '3. Saúde Financeira', desc: 'Balanço Geral e Margem' },
                            { step: 4, name: '4. Integração Bancária', desc: 'Envio API do Banco' }
                          ].map(s => {
                            const isCurrent = selectedAppWorkflow.step === s.step;
                            const isCompleted = selectedAppWorkflow.step > s.step;
                            return (
                              <div 
                                key={s.step}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                  isCurrent
                                    ? 'border-brand-iris bg-brand-iris/5 shadow'
                                    : isCompleted
                                    ? 'border-green-500 bg-green-500/5'
                                    : 'border-gray-150 dark:border-gray-800 bg-transparent opacity-60'
                                }`}
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-mono text-xs font-bold text-gray-400">PASSO {s.step}</span>
                                  {isCompleted && <Check className="text-green-500 w-4 h-4" />}
                                  {isCurrent && <span className="w-2 h-2 rounded-full bg-brand-iris animate-ping" />}
                                </div>
                                <h5 className="font-bold text-xs text-gray-900 dark:text-white leading-snug">{s.name}</h5>
                                <p className="text-[10px] text-gray-400 mt-1">{s.desc}</p>
                              </div>
                            );
                          })}
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-850 flex flex-col sm:flex-row gap-2 justify-between items-center">
                          <div className="text-xs text-gray-400">
                            Estado Atual da Candidatura: <span className="font-bold text-brand-iris">{selectedAppWorkflow.status}</span>
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => {
                                if (selectedAppWorkflow.step < 4) {
                                  const nextStep = selectedAppWorkflow.step + 1;
                                  setCreditApplications(prev => prev.map(a => a.id === selectedAppWorkflow.id ? { ...a, step: nextStep, status: nextStep === 4 ? 'Aprovado' : 'Em Análise' } : a));
                                  setSelectedAppWorkflow(prev => ({ ...prev, step: nextStep, status: nextStep === 4 ? 'Aprovado' : 'Em Análise' }));
                                  alert(`Etapa de avaliação avançada com sucesso para o Passo ${nextStep}.`);
                                } else {
                                  alert('Candidatura já se encontra na última etapa!');
                                }
                              }}
                              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold text-white bg-brand-iris hover:bg-brand-iris/90 rounded-xl transition-all"
                            >
                              Avançar Etapa
                            </button>
                            <button
                              onClick={() => {
                                setCreditApplications(prev => prev.map(a => a.id === selectedAppWorkflow.id ? { ...a, status: 'Aprovado' } : a));
                                setSelectedAppWorkflow(prev => ({ ...prev, status: 'Aprovado' }));
                                alert(`Candidatura aprovada de forma definitiva! Transmitido por API de crédito ao Banco parceiro.`);
                              }}
                              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-all"
                            >
                              Aprovação Direta
                            </button>
                            <button
                              onClick={() => {
                                setCreditApplications(prev => prev.map(a => a.id === selectedAppWorkflow.id ? { ...a, status: 'Revisão Necessária' } : a));
                                setSelectedAppWorkflow(prev => ({ ...prev, status: 'Revisão Necessária' }));
                                alert('Estado alterado para "Revisão Necessária" e consultor notificado.');
                              }}
                              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/20"
                            >
                              Solicitar Revisão
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-xs text-gray-400">
                        Selecione uma candidatura no topo para iniciar a avaliação passo-a-passo.
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* 3. CONSULTANT DASHBOARD FLOW */}
            {user.role === 'CONSULTANT' && (
              <div className="grid grid-cols-1 gap-6">
                
                {/* Consultant Header Performance stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cooperativas em Tutoria</p>
                    <p className="text-2xl font-bold text-brand-purple mt-2">
                      {organizations.filter(o => o.assignedConsultantId === 'consultant-1').length} Clientes
                    </p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Planos Activos publicados</p>
                    <p className="text-2xl font-bold text-brand-iris mt-2">3 Planos</p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Maturidade Alcançada</p>
                    <p className="text-2xl font-bold text-green-500 mt-2">ADVANCED</p>
                  </div>
                </div>

                {/* Tab Selector */}
                <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-850 pb-2">
                  {[
                    { id: 'clients', label: '👤 My Clients (Meus Clientes)' },
                    { id: 'plans', label: '📋 Action Plans (Plano de Acção)' },
                    { id: 'ai_recs', label: '✨ AI Recommendations (Consultor Estratégico IA)' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setConsultantTab(tab.id as any)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all border-b-2 ${
                        consultantTab === tab.id
                          ? 'bg-brand-purple/10 text-brand-purple border-brand-purple'
                          : 'bg-white dark:bg-[#12121A] text-gray-500 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB CONTENT: Clients */}
                {consultantTab === 'clients' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">Lista de Clientes Rurais em Tutoria</h3>
                    <p className="text-xs text-gray-400">Acompanhe a atividade das cooperativas, analise o score operacional e o progresso das auditorias técnicas.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {organizations.filter(o => o.assignedConsultantId === 'consultant-1').map(org => (
                        <div 
                          key={org.id}
                          onClick={() => setActiveClient(org.id)}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                            activeClient === org.id
                              ? 'border-brand-purple bg-brand-purple/5'
                              : 'border-gray-150 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/20'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{org.name}</h4>
                              <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mt-0.5">{org.sector} • {org.province}</p>
                            </div>
                            <span className="px-2 py-0.5 bg-brand-purple/15 text-brand-purple text-xs font-bold rounded">
                              Score: {org.maturity === 'ADVANCED' ? '85' : '55'}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] bg-white dark:bg-[#15151F] p-2.5 rounded-lg border border-gray-200 dark:border-[#2A2A35]">
                            <div>
                              <span className="text-gray-400 block">Maturidade:</span>
                              <span className="font-bold text-gray-700 dark:text-gray-300">{org.maturity}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block">Sincronização:</span>
                              <span className="font-bold text-green-500">100% Ativa</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block">Limitações:</span>
                              <span className={`font-bold ${org.suspended ? 'text-red-500' : 'text-green-500'}`}>
                                {org.suspended ? 'Suspensa' : 'Nenhuma'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Action Plans */}
                {consultantTab === 'plans' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                          <Sparkles className="text-brand-purple animate-pulse" size={18} />
                          Criador de Plano de Acção Inteligente MiraWelch
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Gere metas concretas e monitorize o progresso de maturidade das suas cooperativas tutoradas.</p>
                      </div>

                      <select
                        onChange={(e) => setActiveClient(e.target.value)}
                        value={activeClient || ''}
                        className="text-xs font-semibold px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
                      >
                        <option value="" disabled>Escolha a Cooperativa...</option>
                        {organizations.filter(o => o.assignedConsultantId === 'consultant-1').map(org => (
                          <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                      </select>
                    </div>

                    {activeClient ? (
                      <div className="space-y-6">
                        {/* Custom prompt builder */}
                        <form onSubmit={handleGenerateAIPlan} className="flex gap-2">
                          <input
                            type="text"
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            placeholder="ex: Melhorar controlo de stock e score financeiro da pesca"
                            className="flex-1 h-11 px-4 rounded-xl border bg-transparent text-sm border-gray-300 dark:border-gray-700 outline-none focus:border-brand-purple"
                          />
                          <button
                            type="submit"
                            className="px-6 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl font-bold text-xs transition-all"
                          >
                            Gere Plano IA
                          </button>
                        </form>

                        {aiPlan.length > 0 && (
                          <div className="p-5 rounded-2xl bg-brand-purple/5 border border-brand-purple/10 space-y-4">
                            <h4 className="font-bold text-sm text-brand-purple flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              Milestones de Maturidade Sugeridos pela IA
                            </h4>
                            <ul className="space-y-3">
                              {aiPlan.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
                                  <span className="w-5 h-5 rounded-full bg-brand-purple/20 text-brand-purple flex items-center justify-center font-bold font-mono text-[10px] mt-0.5 shrink-0">
                                    {idx + 1}
                                  </span>
                                  <span className="leading-relaxed">{item}</span>
                                </li>
                              ))}
                            </ul>

                            <button
                              type="button"
                              onClick={() => {
                                alert('O Plano de Ação foi publicado com sucesso no diário operacional do cliente!');
                                setAiPlan([]);
                                setAiPrompt('');
                              }}
                              className="w-full py-2.5 bg-brand-purple text-white hover:bg-brand-purple-hover font-bold text-xs rounded-xl transition-all"
                            >
                              Publicar Plano e Notificar Cooperativa
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-xs text-gray-400">
                        Por favor, selecione uma cooperativa tutelada no dropdown superior para criar o Plano de Acção.
                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT: AI recommendations */}
                {consultantTab === 'ai_recs' && (
                  <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white">🤖 MiraWelch Strategic Advisor Center</h3>
                        <p className="text-xs text-gray-400 mt-1">Consulte diagnósticos estratégicos baseados nas melhores práticas de cooperativas de crédito de Luanda e Huíla.</p>
                      </div>

                      <select
                        onChange={(e) => setActiveClient(e.target.value)}
                        value={activeClient || ''}
                        className="text-xs font-semibold px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
                      >
                        <option value="" disabled>Escolha a Cooperativa...</option>
                        {organizations.filter(o => o.assignedConsultantId === 'consultant-1').map(org => (
                          <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                      </select>
                    </div>

                    {activeClient ? (
                      <div className="space-y-6">
                        <button
                          type="button"
                          onClick={() => {
                            // Generating highly detailed diagnostic
                            const org = organizations.find(o => o.id === activeClient);
                            const plan = [
                              `🔍 DIAGNÓSTICO: A cooperativa ${org?.name} apresenta robusto fluxo diário, mas falta de automatização e registo consolidado do NIF.`,
                              `🚨 RISCOS: Exclusão AML imediata por bancos comerciais devido a dados fiscais não homologados e flutuações de preços de mercado.`,
                              `💡 OPORTUNIDADES: Aumento de score MiraWelch de 55 para 80 pontos, elegibilidade na linha de microcrédito do Banco BAI Luanda.`,
                              `🛠️ AÇÕES CONCRETAS: 1. Submeter certidão comercial em PDF; 2. Lançar inventário de insumos semanalmente; 3. Solicitar auditoria formal.`,
                              `📈 IMPACTO ESPERADO: Redução de custos logísticos em até 15%, acesso prioritário a financiamentos agrícolas.`
                            ];
                            setAiPlan(plan);
                          }}
                          className="px-5 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold rounded-xl transition-all"
                        >
                          Executar Diagnóstico Estratégico IA
                        </button>

                        {aiPlan.length > 0 && (
                          <div className="p-6 bg-gray-50 dark:bg-[#1F1F2A] rounded-2xl border border-gray-150 dark:border-gray-800 space-y-4">
                            <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Relatório de Recomendação IA (Aconselhamento Técnico)</h4>
                            <div className="space-y-4">
                              {aiPlan.map((rec, i) => (
                                <div key={i} className="p-3.5 bg-white dark:bg-[#1A1A21] rounded-xl border border-gray-200 dark:border-[#2E2E3A] text-xs">
                                  <p className="leading-relaxed font-semibold text-gray-700 dark:text-gray-300">{rec}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-xs text-gray-400">
                        Por favor, selecione uma cooperativa tutelada para executar o diagnóstico estratégico da IA.
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* 4. COOPERATIVE OWNER/MANAGER DASHBOARD */}
            {!['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'CONSULTANT'].includes(user.role) && (
              <div className="grid grid-cols-1 gap-8">

                {/* Suspension notice overlay if needed */}
                {organizations.find(o => o.id === user.organizationId)?.suspended && (
                  <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-red-500">Atenção: Operações Limitadas</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        A administração suspendeu temporariamente as suas submissões de crédito. Razão: {organizations.find(o => o.id === user.organizationId)?.suspendedReason}
                      </p>
                    </div>
                  </div>
                )}

                {/* OVERVIEW CONTENT */}
                {coopTab === 'overview' && (
                  <>
                    {/* Success Banner Notification if active */}
                    {successBannerMessage && (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-between shadow-sm animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                          <span>{successBannerMessage}</span>
                        </div>
                        <button
                          onClick={() => setSuccessBannerMessage(null)}
                          className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer text-xs p-1"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* REGISTO EM <30 SEGUNDOS (REGRA DOS 30S) EMBEDDED WIDGET */}
                    <div className="mb-2">
                      <Quick30SecLogger onRecordAdded={fetchDashboardData} />
                    </div>



                    {/* 4.1. ECONOMIC IDENTITY SCORE RING & QUICK ACTIONS DUAL CARD */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* LEFT: Economic Identity Score Ring & Simulation */}
                  <div className="lg:col-span-7 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm space-y-6">
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-wider">
                        MÓDULO FUNDING READINESS
                      </span>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2">
                        Anel de Identidade Económica (MiraWelch Score)
                      </h3>
                      <p className="text-xs text-gray-400">Analise seu score de elegibilidade a crédito em tempo real e simule impactos operacionais.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      
                      {/* SVG Ring Container */}
                      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-150 dark:border-gray-800">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                          {/* Background Circle */}
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="72"
                              cy="72"
                              r="58"
                              className="stroke-gray-200 dark:stroke-gray-800"
                              strokeWidth="10"
                              fill="transparent"
                            />
                            {/* Animated Progress Circle */}
                            <circle
                              cx="72"
                              cy="72"
                              r="58"
                              className="stroke-brand-purple transition-all duration-500"
                              strokeWidth="10"
                              strokeDasharray={2 * Math.PI * 58}
                              strokeDashoffset={2 * Math.PI * 58 * (1 - Math.min(100, Math.round((Number(user.fundingScore) || 68) + ((Number(simRevenueIncrease) || 0) * 0.15) + ((Number(simResolvedChecklist) || 0) * 5))) / 100)}
                              strokeLinecap="round"
                              fill="transparent"
                            />
                          </svg>
                          <div className="absolute text-center">
                            <span className="text-3xl font-black text-gray-900 dark:text-white">
                              {Math.min(100, Math.round((user.fundingScore || 68) + (simRevenueIncrease * 0.15) + (simResolvedChecklist * 5)))}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest mt-0.5">Pontos</span>
                          </div>
                        </div>
                        <div className="text-center mt-3">
                          <span className="text-[11px] font-bold text-brand-purple uppercase bg-brand-purple/10 px-2.5 py-0.5 rounded-full">
                            Maturidade: {Math.min(100, Math.round((user.fundingScore || 68) + (simRevenueIncrease * 0.15) + (simResolvedChecklist * 5))) >= 80 ? 'ADVANCED' : 'INTERMEDIATE'}
                          </span>
                        </div>
                      </div>

                      {/* Subscores with interactive feedback */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subscores de Elegibilidade</h4>
                        {[
                          { label: 'Financeiro', val: Math.min(100, 75 + Math.round(simRevenueIncrease * 0.2)), color: 'bg-green-500' },
                          { label: 'Operacional', val: Math.min(100, 60 + Math.round(simResolvedChecklist * 3)), color: 'bg-brand-purple' },
                          { label: 'Documental', val: Math.min(100, 80 + Math.round(simResolvedChecklist * 4)), color: 'bg-brand-iris' },
                          { label: 'Comercial', val: Math.min(100, 70 + Math.round(simRevenueIncrease * 0.1)), color: 'bg-blue-500' }
                        ].map((sub, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-gray-700 dark:text-gray-300">{sub.label}</span>
                              <span className="font-bold text-gray-900 dark:text-white">{sub.val}/100</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div className={`h-full ${sub.color} transition-all duration-300`} style={{ width: `${sub.val}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Interactive Score Simulation Widget */}
                    <div className="p-4 bg-brand-purple/5 border border-brand-purple/10 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-brand-purple flex items-center gap-1.5">
                          <Sparkles size={14} className="animate-pulse" />
                          Simulador de Impacto IA
                        </h4>
                        <button 
                          onClick={() => { setSimRevenueIncrease(0); setSimResolvedChecklist(0); }}
                          className="text-[10px] font-bold text-brand-purple hover:underline"
                        >
                          Limpar Simulação
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Aumento de Receita:</span>
                            <span className="font-bold text-brand-purple">+{simRevenueIncrease}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={simRevenueIncrease}
                            onChange={(e) => setSimRevenueIncrease(Number(e.target.value))}
                            className="w-full accent-brand-purple"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Milestones Resolvidos:</span>
                            <span className="font-bold text-brand-purple">+{simResolvedChecklist} itens</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="5"
                            value={simResolvedChecklist}
                            onChange={(e) => setSimResolvedChecklist(Number(e.target.value))}
                            className="w-full accent-brand-purple"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Funding Checklist Items */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Checklist de Prontidão (Funding Readiness)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[
                          { text: 'Certidão Comercial publicada em PDF', done: true },
                          { text: 'NIF regularizado junto à AGT', done: false },
                          { text: 'Registo de vendas mensais homologado', done: true },
                          { text: 'Rácio de Liquidez Corrente > 1.2x', done: false }
                        ].map((item, idx) => (
                          <div key={idx} className="p-2.5 bg-gray-50 dark:bg-black/10 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center gap-2 text-xs">
                            <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                              item.done ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {item.done ? '✓' : '◷'}
                            </span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* RIGHT: Quick Actions (Ações Rápidas) */}
                  <div className="lg:col-span-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-brand-iris/10 text-brand-iris text-[10px] font-bold uppercase tracking-wider">
                        Acesso Rápido
                      </span>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2">
                        Painel de Operações Rápidas
                      </h3>
                      <p className="text-xs text-gray-400">Lance registos operacionais, envie certidões de conformidade ou contacte a IA de suporte.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      
                      {/* Action 1: Registo de Vendas */}
                      <button
                        onClick={() => {
                          setLogType('SALE');
                          setShowLogModal(true);
                        }}
                        className="p-4 bg-gray-50 hover:bg-brand-purple/5 dark:bg-black/20 border border-gray-150 dark:border-gray-800 rounded-2xl text-left transition-all hover:border-brand-purple/30 group"
                      >
                        <span className="text-xl block mb-2">💰</span>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-purple">Lançar Venda</h4>
                        <p className="text-[10px] text-gray-400 mt-1">Registe receitas e actualize fluxo de caixa.</p>
                      </button>

                      {/* Action 2: Registo de Despesas */}
                      <button
                        onClick={() => {
                          setLogType('EXPENSE');
                          setShowLogModal(true);
                        }}
                        className="p-4 bg-gray-50 hover:bg-brand-purple/5 dark:bg-black/20 border border-gray-150 dark:border-gray-800 rounded-2xl text-left transition-all hover:border-brand-purple/30 group"
                      >
                        <span className="text-xl block mb-2">💸</span>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-purple">Lançar Despesa</h4>
                        <p className="text-[10px] text-gray-400 mt-1">Introduza custos logísticos e taxas.</p>
                      </button>

                      {/* Action 3: Enviar Documentação */}
                      <button
                        onClick={() => {
                          setDocType('NIF');
                          setShowDocModal(true);
                        }}
                        className="p-4 bg-gray-50 hover:bg-brand-purple/5 dark:bg-black/20 border border-gray-150 dark:border-gray-800 rounded-2xl text-left transition-all hover:border-brand-purple/30 group"
                      >
                        <span className="text-xl block mb-2">📂</span>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-purple">Submeter Documento</h4>
                        <p className="text-[10px] text-gray-400 mt-1">Carregar NIF ou Alvará em PDF.</p>
                      </button>

                      {/* Action 4: Set Tab to Operational */}
                      <button
                        onClick={() => {
                          // Triggering a scroll to the specialized operations or displaying operational help
                          alert('Direcionando para o Módulo de Recursos e Cadeia de Produção!');
                        }}
                        className="p-4 bg-gray-50 hover:bg-brand-purple/5 dark:bg-black/20 border border-gray-150 dark:border-gray-800 rounded-2xl text-left transition-all hover:border-brand-purple/30 group"
                      >
                        <span className="text-xl block mb-2">🚜</span>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-purple">Gesto Operacional</h4>
                        <p className="text-[10px] text-gray-400 mt-1">Inventários e controlo de sementes.</p>
                      </button>

                    </div>

                    <div className="mt-6 p-4 bg-gray-50 dark:bg-black/20 border border-gray-150 dark:border-gray-800 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🤖</span>
                        <div>
                          <h4 className="font-bold text-xs text-gray-900 dark:text-white">Diagnóstico MiraWelch por IA</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Prepare sua submissão de fomento.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          alert('Para consultar as análises avançadas da IA, aceda ao separador "AI Center" no topo do ecrã.');
                        }}
                        className="px-3 py-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-[10px] font-bold rounded-lg transition-all"
                      >
                        Aceder AI Center
                      </button>
                    </div>

                  </div>

                </div>

                {/* --- DASHBOARD UNIVERSAL: 5 PERGUNTAS FUNDAMENTAIS --- */}
                <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm space-y-8">
                  
                  {/* Dashboard Universal Title & Mode Indicator */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 dark:border-gray-800 pb-4 gap-2">
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-brand-iris/10 text-brand-iris text-[10px] font-bold uppercase tracking-wider">
                        {t('dash.universal_mode')}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1.5">
                        {t('dash.universal_title')}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-400 font-mono">
                      {t('dash.last_update')}, {new Date().toLocaleTimeString()}
                    </p>
                  </div>

                  {/* PERGUNTA 1: Como estamos? */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-iris" />
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                        {t('dash.q1')} <span className="text-xs font-normal text-gray-400 font-sans lowercase">{t('dash.q1.sub')}</span>
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Receita */}
                      <div className="p-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.revenue')}</p>
                        <p className="text-xl font-bold text-green-500 mt-1.5">{totalRevenue.toLocaleString()} Kz</p>
                        <p className="text-[10px] text-gray-400 mt-1 font-mono">{operationalLogs.filter(l => l.type === 'SALE').length} {t('dash.revenue_desc')}</p>
                      </div>

                      {/* Despesa */}
                      <div className="p-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.expenses')}</p>
                        <p className="text-xl font-bold text-red-500 mt-1.5">{totalExpense.toLocaleString()} Kz</p>
                        <p className="text-[10px] text-gray-400 mt-1 font-mono">{operationalLogs.filter(l => l.type === 'EXPENSE').length} {t('dash.expenses_desc')}</p>
                      </div>

                      {/* Margem */}
                      <div className="p-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.margin')}</p>
                        <p className={`text-xl font-bold mt-1.5 ${netMargin >= 0 ? 'text-brand-iris' : 'text-red-500'}`}>
                          {netMargin.toLocaleString()} Kz
                        </p>
                        <p className="text-[10px] font-semibold text-gray-500 mt-1">
                          {t('dash.margin_sub')}: <span className="font-bold text-brand-purple">{marginPercentage}%</span>
                        </p>
                      </div>

                      {/* Liquidez */}
                      <div className="p-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.liquidity')}</p>
                        <div className="flex items-baseline gap-1.5 mt-1.5">
                          <p className="text-xl font-bold text-gray-900 dark:text-white">{liquidityRatio}x</p>
                          <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${
                            liquidityStatus === 'Excelente' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {liquidityStatus}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">{t('dash.liquidity_desc')}</p>
                      </div>

                      {/* Funding Score */}
                      <div className="p-4 bg-brand-purple/5 border border-brand-purple/10 rounded-2xl">
                        <p className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">{t('dash.funding_score')}</p>
                        <p className="text-2xl font-black text-brand-purple mt-1">{user.fundingScore} <span className="text-xs font-normal text-gray-400">/ 100</span></p>
                        <p className="text-[10px] font-semibold text-brand-purple/80 mt-1 uppercase">{t('dash.maturity')} {user.maturity}</p>
                      </div>
                    </div>
                  </div>

                  {/* PERGUNTA 2: O que mudou? */}
                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                        {t('dash.q2')} <span className="text-xs font-normal text-gray-400 font-sans lowercase">{t('dash.q2.sub')}</span>
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Financeiro */}
                      <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.health_financial')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{financialHealth}</p>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      </div>

                      {/* Operacional */}
                      <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.health_operational')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{operationalHealth}</p>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-brand-iris" />
                      </div>

                      {/* Documental */}
                      <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.health_documental')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{documentalHealth}</p>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${documentalHealthScore >= 85 ? 'bg-green-500' : 'bg-amber-500'}`} />
                      </div>

                      {/* Comercial */}
                      <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.health_commercial')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{commercialHealth}</p>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                    </div>
                  </div>

                  {/* PERGUNTAS 3, 4 & 5 GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    
                    {/* PERGUNTA 3: Onde perdemos dinheiro? */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                          {t('dash.q3')}
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {costAlerts.map((alert, idx) => (
                          <div 
                            key={idx} 
                            className={`p-3.5 rounded-xl border flex flex-col gap-1.5 transition-all ${
                              alert.severity === 'high' 
                                ? 'bg-red-500/5 border-red-500/10' 
                                : alert.severity === 'medium'
                                ? 'bg-amber-500/5 border-amber-500/10'
                                : 'bg-gray-50 dark:bg-black/10 border-gray-200 dark:border-gray-800'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h5 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                {alert.severity === 'high' && <AlertTriangle className="text-red-500 shrink-0" size={12} />}
                                {alert.title}
                              </h5>
                              <span className="text-[10px] font-bold text-red-500 font-mono">
                                {t('dash.q3.savings')}: {alert.savingEstimate}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                              {alert.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PERGUNTA 4: O que precisa atenção? */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                          {t('dash.q4')}
                        </h4>
                      </div>

                      <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-4">
                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                          {t('dash.q4.tasks')}
                        </p>
                        
                        <div className="space-y-3">
                          {defaultTasks.map(task => (
                            <label 
                              key={task.id} 
                              className="flex items-start gap-2.5 cursor-pointer group text-xs text-gray-700 dark:text-gray-300"
                            >
                              <input 
                                type="checkbox"
                                checked={task.done || checkedTasks.includes(task.id)}
                                onChange={() => toggleTask(task.id)}
                                disabled={task.done}
                                className="mt-0.5 rounded border-gray-300 text-brand-iris focus:ring-brand-iris cursor-pointer disabled:cursor-not-allowed"
                              />
                              <span className={`leading-tight transition-all ${
                                (task.done || checkedTasks.includes(task.id)) 
                                  ? 'line-through text-gray-400 dark:text-gray-600 font-normal' 
                                  : 'font-semibold group-hover:text-gray-900 dark:group-hover:text-white'
                              }`}>
                                {task.text}
                              </span>
                            </label>
                          ))}
                        </div>

                        {/* Critical warning message if documents are missing */}
                        {!documentsQueue.some(d => d.type === 'NIF') && (
                          <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-semibold flex items-start gap-1.5 leading-snug">
                            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                            <span>{t('dash.q4.warning')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* PERGUNTA 5: O que devo fazer hoje? */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                          {t('dash.q5')}
                        </h4>
                      </div>

                      <div className="bg-green-500/5 border border-green-500/10 p-4 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles size={12} /> {t('dash.q5.recommendations')}
                          </p>
                          <span className="text-[8px] bg-green-500/20 text-green-600 font-bold px-1 py-0.2 rounded uppercase">{t('dash.q5.active')}</span>
                        </div>

                        <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                          {aiRecommendations.map((rec, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-[#1C1C24] border border-gray-100 dark:border-gray-800 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-900 dark:text-white">{rec.title}</span>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                                  rec.priority === 'Alta' ? 'bg-red-100 dark:bg-red-950 text-red-600' : 'bg-blue-100 dark:bg-blue-950 text-blue-600'
                                }`}>
                                  {rec.priority}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">{rec.desc}</p>
                            </div>
                          ))}
                        </div>

                        <button 
                          onClick={() => setCustomNotificationModal({ title: 'Recomendações Enviadas', message: 'As suas recomendações foram enviadas com sucesso para a mentoria do consultor!', type: 'success' })}
                          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          {t('dash.q5.request_review')}
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

                {/* --- SECTOR QUICK ACTION BUTTONS --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => { setLogType('SALE'); setShowLogModal(true); }}
                    className="p-5 rounded-2xl bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] hover:border-brand-iris transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-iris/10 text-brand-iris flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShoppingBag size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-800 dark:text-white">Nova Venda</span>
                  </button>

                  <button 
                    onClick={() => { setLogType('EXPENSE'); setShowLogModal(true); }}
                    className="p-5 rounded-2xl bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] hover:border-red-500/50 transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp size={20} className="transform rotate-180" />
                    </div>
                    <span className="text-xs font-bold text-gray-800 dark:text-white">Nova Despesa</span>
                  </button>

                  <button 
                    onClick={() => { 
                      let effectiveIndustry = user?.industry;
                      if (!effectiveIndustry && user?.organizationName) {
                        const name = user.organizationName.toLowerCase();
                        if (name.includes('pesca') || name.includes('pescador')) effectiveIndustry = 'FISHERIES';
                        else if (name.includes('pecuári') || name.includes('pecuari') || name.includes('gado')) effectiveIndustry = 'LIVESTOCK';
                        else if (name.includes('comércio') || name.includes('loja')) effectiveIndustry = 'COMMERCE';
                        else if (name.includes('transp')) effectiveIndustry = 'TRANSPORT';
                        else effectiveIndustry = 'AGRICULTURE';
                      }

                      let detectedType: 'HARVEST' | 'ANIMAL' | 'CATCH' | 'SALE' | 'EXPENSE' = 'SALE';
                      if (effectiveIndustry === 'AGRICULTURE') detectedType = 'HARVEST';
                      else if (effectiveIndustry === 'LIVESTOCK') detectedType = 'ANIMAL';
                      else if (effectiveIndustry === 'FISHERIES') detectedType = 'CATCH';
                      else if (effectiveIndustry === 'COMMERCE') detectedType = 'SALE';
                      else if (effectiveIndustry === 'TRANSPORT') detectedType = 'EXPENSE';
                      setLogType(detectedType); 
                      setShowLogModal(true); 
                    }}
                    className={`p-5 rounded-2xl bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer relative ${
                      userSector === 'AGRICULTURE' ? 'hover:border-green-500/50' :
                      userSector === 'LIVESTOCK' ? 'hover:border-amber-500/50' :
                      userSector === 'FISHERIES' ? 'hover:border-blue-500/50' :
                      userSector === 'COMMERCE' ? 'hover:border-brand-purple/50' :
                      'hover:border-brand-iris/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                      userSector === 'AGRICULTURE' ? 'bg-green-500/10 text-green-500' :
                      userSector === 'LIVESTOCK' ? 'bg-amber-500/10 text-amber-500' :
                      userSector === 'FISHERIES' ? 'bg-blue-500/10 text-blue-500' :
                      userSector === 'COMMERCE' ? 'bg-brand-purple/10 text-brand-purple' :
                      'bg-brand-iris/10 text-brand-iris'
                    }`}>
                      {userSector === 'AGRICULTURE' && <Sprout size={20} />}
                      {userSector === 'LIVESTOCK' && <Activity size={20} />}
                      {userSector === 'FISHERIES' && <Ship size={20} />}
                      {userSector === 'COMMERCE' && <ShoppingBag size={20} />}
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-xs font-bold text-gray-800 dark:text-white">
                        {userSector === 'AGRICULTURE' ? 'Módulo Agrícola' :
                         userSector === 'LIVESTOCK' ? 'Módulo Pecuário' :
                         userSector === 'FISHERIES' ? 'Módulo de Pescas' :
                         userSector === 'COMMERCE' ? 'Módulo Comercial' :
                         'Módulo Operacional'}
                      </span>
                      {userSector && (
                        <span className="text-[9px] font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-md border border-green-500/20">
                          Auto-detetado
                        </span>
                      )}
                    </div>
                  </button>

                  <button 
                    onClick={() => setShowDocModal(true)}
                    className="p-5 rounded-2xl bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] hover:border-brand-purple transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-800 dark:text-white">Subir Documentos</span>
                  </button>
                </div>
                {/* Close Overview Tab */}
                </>
                )}

                {/* SPECIALIZED OPERATIONAL SECTOR MODULES */}
                {coopTab === 'operations' && (
                  <SectorOperationalDashboard 
                    key={`${user?.id || 'guest'}-${refreshCounter}`}
                    userId={user?.id || 'guest'}
                    userIndustry={userSector || user?.industry || null}
                    userRole={user?.role || 'OWNER'}
                  />
                )}

                {/* COMPLETE INTEGRATED FINANCIAL SYSTEM */}
                {coopTab === 'finance' && (
                  <FinancialModule 
                    key={`fin-${user?.id || 'guest'}`}
                    userId={user?.id || 'guest'}
                    userRole={user?.role || 'OWNER'}
                    initialSubTab={financeSubTab}
                    onSubTabChange={setFinanceSubTab}
                  />
                )}

                {/* COMMERCIAL CRM & CONTRACT MANAGEMENT MODULE */}
                {coopTab === 'crm' && (
                  <CommercialCRMModule 
                    key={`crm-${user?.id || 'guest'}`}
                    userId={user?.id || 'guest'}
                    userRole={user?.role || 'OWNER'}
                    initialSubTab={crmSubTab}
                    onSubTabChange={setCrmSubTab}
                  />
                )}

                {/* DOCUMENTARY AND KYC MANAGEMENT MODULE */}
                {coopTab === 'documents' && (
                  <DocumentKYCModule 
                    key={`kyc-${user?.id || 'guest'}`}
                    userId={user?.id || 'guest'}
                    userRole={user?.role || 'OWNER'}
                    organizationId={user?.organizationId || null}
                    initialSubTab={docsSubTab}
                    onSubTabChange={setDocsSubTab}
                    onRefresh={fetchDashboardData}
                  />
                )}

                {/* FUNDING READINESS & AI CREDIT ANALYTICS MODULE */}
                {coopTab === 'credit' && (
                  <FundingReadinessModule
                    key={`funding-${user?.id || 'guest'}`}
                    userId={user?.id || 'guest'}
                    userRole={user?.role || 'OWNER'}
                    organizationId={user?.organizationId || null}
                    onRefresh={fetchDashboardData}
                  />
                )}

                {/* MÓDULO IA (AI CENTER) */}
                {coopTab === 'ai_center' && (
                  <AICenterModule
                    key={`ai-center-${user?.id || 'guest'}`}
                    userId={user?.id || 'guest'}
                    userRole={user?.role || 'OWNER'}
                    organizationId={user?.organizationId || null}
                  />
                )}

                {/* OVERHEADS AND SUPPORT COSTS ERP MODULE */}
                {coopTab === 'overheads' && (
                  <SupportCostsModule
                    key={`overheads-${user?.id || 'guest'}`}
                    userId={user?.id || 'guest'}
                    userRole={user?.role || 'OWNER'}
                    userIndustry={userSector || user?.industry || null}
                    initialSubTab={overheadsSubTab}
                    onSubTabChange={setOverheadsSubTab}
                  />
                )}

                {/* Sub-grid: Logs Table */}
                {coopTab === 'ledger' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Ledger logs */}
                    <div className="lg:col-span-12 p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl">
                      <h3 className="font-bold text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Activity className="text-brand-iris" size={18} />
                        Registo Geral de Atividades
                      </h3>

                      {combinedLogs.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                          <ListTodo size={40} className="mx-auto mb-3 opacity-40 text-brand-iris" />
                          <p className="text-sm font-semibold">Sem registos operacionais inseridos.</p>
                          <p className="text-xs mt-1">Utilize as Ações Rápidas do Painel de Decisão para introduzir colheitas, gado ou vendas.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-semibold text-xs">
                                <th className="pb-3">Data</th>
                                <th className="pb-3">Atividade</th>
                                <th className="pb-3">Tipo</th>
                                <th className="pb-3 text-right">Valor / Quantidade</th>
                              </tr>
                            </thead>
                            <tbody>
                              {combinedLogs.map(log => (
                                <tr key={log.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50">
                                  <td className="py-3 text-xs text-gray-400 font-mono">{log.date}</td>
                                  <td className="py-3 font-semibold text-gray-900 dark:text-white">
                                    {log.title}
                                    {log.notes && <p className="text-[10px] text-gray-400 font-normal mt-0.5">{log.notes}</p>}
                                  </td>
                                  <td className="py-3">
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                      log.type === 'SALE' 
                                        ? 'bg-green-100 dark:bg-green-950 text-green-700' 
                                        : log.type === 'EXPENSE' 
                                        ? 'bg-red-100 dark:bg-red-950 text-red-700' 
                                        : 'bg-blue-100 dark:bg-blue-950 text-blue-700'
                                    }`}>
                                      {log.type}
                                    </span>
                                  </td>
                                  <td className="py-3 text-right font-bold">
                                    {log.amount ? `${log.amount.toLocaleString()} Kz` : `${log.quantity} ${log.unit || ''}`}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>
        )}

            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* DOCUMENT PREVIEW LIGHTBOX */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#1A1A21] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-gray-200 dark:border-gray-800">
            <button 
              onClick={() => setViewingDoc(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Análise de Documentação</h3>
              <p className="text-xs text-gray-400 mb-6">{viewingDoc.name}</p>

              {/* Simulated visual image of document */}
              <div className="h-44 bg-gray-100 dark:bg-black/30 rounded-xl flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 text-gray-400 mb-6">
                <FileText size={48} className="text-brand-iris mb-2" />
                <span className="text-xs font-semibold text-gray-900 dark:text-white">FICHEIRO PDF SIMULADO</span>
                <span className="text-[10px] text-gray-400 font-mono mt-1">NIF Oficial verificado na AGT</span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleDocAction(viewingDoc.id, 'VERIFIED')}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-all shadow"
                >
                  Aprovar / Validar
                </button>
                <button
                  onClick={() => handleDocAction(viewingDoc.id, 'REJECTED', 'Assinatura inválida ou ilegível')}
                  className="flex-1 py-3 bg-red-500/15 hover:bg-red-500/25 text-red-500 font-bold text-sm rounded-xl transition-all"
                >
                  Rejeitar Documento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOG OPERATION MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#1A1A21] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-black/20">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Inserir Atividade Diária</h3>
              <button onClick={() => setShowLogModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="p-6 space-y-4">
              {userSector && (
                <div className="flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl bg-brand-iris/10 text-brand-iris border border-brand-iris/20">
                  <span className="font-semibold">Sector Auto-detetado:</span>
                  <span className="font-bold">
                    {userSector === 'AGRICULTURE' && '🌾 Agricultura'}
                    {userSector === 'LIVESTOCK' && '🐂 Pecuária'}
                    {userSector === 'FISHERIES' && '🐟 Pesca'}
                    {userSector === 'COMMERCE' && '🏪 Comércio Geral'}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Tipo</label>
                  <select
                    value={logType}
                    onChange={e => setLogType(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm"
                  >
                    <option value="SALE">Venda de Produção</option>
                    <option value="EXPENSE">Despesa de Insumos</option>
                    <option value="HARVEST">Colheita (Agricultura)</option>
                    <option value="ANIMAL">Controle de Gado (Pecuária)</option>
                    <option value="CATCH">Viagem de Captura (Pescas)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Data</label>
                  <input
                    type="date"
                    value={logForm.date}
                    onChange={e => setLogForm({ ...logForm, date: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Título da Atividade</label>
                <input
                  type="text"
                  value={logForm.title}
                  onChange={e => setLogForm({ ...logForm, title: e.target.value })}
                  placeholder="ex: Colheita do Bloco A"
                  className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Quantidade / Volume</label>
                  <input
                    type="number"
                    value={logForm.quantity}
                    onChange={e => setLogForm({ ...logForm, quantity: e.target.value })}
                    placeholder="ex: 1500"
                    className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Unidade</label>
                  <select
                    value={logForm.unit}
                    onChange={e => setLogForm({ ...logForm, unit: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm"
                  >
                    <option value="kg">Quilogramas (kg)</option>
                    <option value="sacos">Sacos</option>
                    <option value="cabecas">Cabeças (Gado)</option>
                    <option value="caixas">Caixas</option>
                    <option value="litros">Litros</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Montante Financeiro (Kz)</label>
                <input
                  type="number"
                  value={logForm.amount}
                  onChange={e => setLogForm({ ...logForm, amount: e.target.value })}
                  placeholder="ex: 450000"
                  className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Notas Adicionais</label>
                <textarea
                  value={logForm.notes}
                  onChange={e => setLogForm({ ...logForm, notes: e.target.value })}
                  placeholder="Anotações para a consultoria ou análise..."
                  className="w-full h-20 p-3 rounded-xl border bg-transparent text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-iris hover:bg-brand-iris-hover text-white rounded-xl font-bold transition-all shadow-md mt-4"
              >
                Guardar Atividade
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT UPLOAD MODAL */}
      {showDocModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#1A1A21] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-black/20">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Carregar Documento Oficial</h3>
              <button onClick={() => setShowDocModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadDoc} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Tipo de Documento</label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm"
                >
                  <option value="NIF">NIF Oficial da Cooperativa</option>
                  <option value="ID_CARD">B.I. ou Passaporte dos Sócios</option>
                  <option value="BANK_STATEMENT">Extratos Bancários Recentes</option>
                  <option value="LICENSE">Alvará Comercial ou Licença Agrícola</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Nome Simulado do Ficheiro</label>
                <input
                  type="text"
                  value={docFileName}
                  onChange={e => setDocFileName(e.target.value)}
                  placeholder="ex: NIF_Cooperativa_Assinada.pdf"
                  className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm"
                  required
                />
              </div>

              <div className="p-4 bg-brand-iris/5 rounded-xl text-[11px] text-gray-500 border border-brand-iris/10">
                O arquivo será processado de forma segura no nosso sistema e enviado imediatamente para a Fila de Validação dos Analistas.
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl font-bold transition-all shadow-md"
              >
                Submeter Documento
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL COMMAND PALETTE (Spotlight ⌘K Modal) */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-[10vh] px-4 overflow-y-auto pb-12">
          {/* Backdrop closer */}
          <div className="absolute inset-0" onClick={() => {
            setShowCommandPalette(false);
            setCommandPaletteActiveOption(null);
          }} />

          <div className="relative bg-[#0D0D12] text-white border border-gray-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col my-4">
            {/* Header / Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800 bg-[#12121A]">
              <Command className="text-brand-purple shrink-0 animate-pulse" size={20} />
              <input
                type="text"
                value={commandPaletteQuery}
                onChange={e => setCommandPaletteQuery(e.target.value)}
                placeholder={commandPaletteActiveOption ? `Configurar lançamento de ${commandPaletteActiveOption}...` : "Escreva 'colheita', 'peso', 'venda', 'vacina' ou prima uma categoria..."}
                className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-sm text-gray-150 placeholder-gray-500"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-gray-800 text-gray-400 font-mono px-2 py-0.5 rounded-md">ESC</span>
                <button
                  onClick={() => {
                    setShowCommandPalette(false);
                    setCommandPaletteActiveOption(null);
                  }}
                  className="text-gray-500 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Offline & GPS Status Simulator (Prominent Top Banner) */}
            <div className="px-5 py-3 bg-[#171724]/60 border-b border-gray-800 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${offlineMode || commandPaletteFormData.offline === 'true' ? 'bg-amber-500' : 'bg-green-500'} animate-pulse`} />
                <span className="font-semibold text-gray-300">
                  {offlineMode || commandPaletteFormData.offline === 'true' 
                    ? 'Modo Contingência (Offline / Sem Sinal)' 
                    : 'Ligação Segura MiraWelch Cloud (Online)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Offline Simulator Switch */}
                <button
                  type="button"
                  onClick={() => {
                    const nextOffline = !(offlineMode || commandPaletteFormData.offline === 'true');
                    setCommandPaletteFormData(prev => ({ ...prev, offline: nextOffline ? 'true' : 'false' }));
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                    offlineMode || commandPaletteFormData.offline === 'true'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20'
                      : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
                  }`}
                >
                  Simular {offlineMode || commandPaletteFormData.offline === 'true' ? 'Online' : 'Offline'}
                </button>

                {/* GPS Simulator Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setGpsCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                          alert(`GPS Sincronizado: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
                        },
                        () => {
                          setGpsCoords({ latitude: -14.9782, longitude: 13.4321 });
                          alert('GPS Ativado: -14.9782, 13.4321 (Namibe Hub)');
                        }
                      );
                    } else {
                      setGpsCoords({ latitude: -14.9782, longitude: 13.4321 });
                      alert('GPS Ativado: -14.9782, 13.4321 (Namibe Hub)');
                    }
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                    gpsCoords
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  <MapPin size={10} />
                  {gpsCoords ? `${gpsCoords.latitude.toFixed(4)}, ${gpsCoords.longitude.toFixed(4)}` : 'Obter GPS'}
                </button>
              </div>
            </div>

            {/* List options OR active form */}
            {!commandPaletteActiveOption ? (
              <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-900">
                {/* Search Instructions */}
                <div className="p-4 text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                  Ações Rápidas por Setor Operacional
                </div>

                {/* AGRICULTURE CATEGORY */}
                {(userSector === 'AGRICULTURE' || !userSector) && (
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] text-green-500 font-bold uppercase tracking-wider">
                      🌾 Agricultura & Cooperativas Agrícolas
                    </div>
                    {[
                      { id: 'COLHEITA', title: 'Registar Colheita Rápida', desc: 'Lançamento de sacos, peso e perdas registadas por campo/talhão.', icon: Sprout, keywords: 'colheita colheitas semente milho batata' },
                      { id: 'INSUMO', title: 'Aplicação Rápida de Insumo', desc: 'Registo de aplicação de fertilizantes NPK, adubos ou herbicidas.', icon: Boxes, keywords: 'insumo insumos adubo fertilizante' }
                    ].filter(o => !commandPaletteQuery || o.title.toLowerCase().includes(commandPaletteQuery.toLowerCase()) || o.keywords.includes(commandPaletteQuery.toLowerCase())).map(option => (
                      <button
                        key={option.id}
                        onClick={() => setCommandPaletteActiveOption(option.id)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-850 transition-all text-left text-sm cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/10 text-green-500 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-all">
                            <option.icon size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-200 group-hover:text-white">{option.title}</p>
                            <p className="text-xs text-gray-500">{option.desc}</p>
                          </div>
                        </div>
                        <CornerDownLeft size={14} className="text-gray-600 group-hover:text-white" />
                      </button>
                    ))}
                  </div>
                )}

                {/* LIVESTOCK CATEGORY */}
                {(userSector === 'LIVESTOCK' || !userSector) && (
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                      ox Pecuária & Criação de Animais
                    </div>
                    {[
                      { id: 'PESO', title: 'Registar Peso e Medição Corporal', desc: 'Controlo estrito de peso (kg) e taxa de conversão alimentar diária.', icon: Activity, keywords: 'peso pesagem engorda crescimento kg' },
                      { id: 'VACINA', title: 'Lançar Profilaxia ou Vacina', desc: 'Registo de tratamentos, medicamentos aplicados e respetivo custo unitário.', icon: HeartPulse, keywords: 'vacina vacinas saude aftosa' }
                    ].filter(o => !commandPaletteQuery || o.title.toLowerCase().includes(commandPaletteQuery.toLowerCase()) || o.keywords.includes(commandPaletteQuery.toLowerCase())).map(option => (
                      <button
                        key={option.id}
                        onClick={() => setCommandPaletteActiveOption(option.id)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-850 transition-all text-left text-sm cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-all">
                            <option.icon size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-200 group-hover:text-white">{option.title}</p>
                            <p className="text-xs text-gray-500">{option.desc}</p>
                          </div>
                        </div>
                        <CornerDownLeft size={14} className="text-gray-600 group-hover:text-white" />
                      </button>
                    ))}
                  </div>
                )}

                {/* FISHERIES CATEGORY */}
                {(userSector === 'FISHERIES' || !userSector) && (
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] text-sky-500 font-bold uppercase tracking-wider">
                      ⛵ Pesca Artesanal e Industrial
                    </div>
                    {[
                      { id: 'VIAGEM', title: 'Iniciar Viagem de Pesca', desc: 'Indicar embarcação activa, combustível inicial e número de tripulantes.', icon: Ship, keywords: 'viagem barco mar embarcacao' },
                      { id: 'CAPTURA', title: 'Registar Captura de Peixe', desc: 'Lançamento de espécies capturadas no mar (kg, preço unitário).', icon: Compass, keywords: 'captura peixe carapau kg mar' }
                    ].filter(o => !commandPaletteQuery || o.title.toLowerCase().includes(commandPaletteQuery.toLowerCase()) || o.keywords.includes(commandPaletteQuery.toLowerCase())).map(option => (
                      <button
                        key={option.id}
                        onClick={() => setCommandPaletteActiveOption(option.id)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-850 transition-all text-left text-sm cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg group-hover:bg-sky-500 group-hover:text-white transition-all">
                            <option.icon size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-200 group-hover:text-white">{option.title}</p>
                            <p className="text-xs text-gray-500">{option.desc}</p>
                          </div>
                        </div>
                        <CornerDownLeft size={14} className="text-gray-600 group-hover:text-white" />
                      </button>
                    ))}
                  </div>
                )}

                {/* COMMERCE & CRM CATEGORY */}
                {(userSector === 'COMMERCE' || !userSector) && (
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] text-brand-purple font-bold uppercase tracking-wider">
                      🛍️ Comércio, Retalho e Vendas
                    </div>
                    {[
                      { id: 'VENDA', title: 'Registar Venda Rápida (Faturação)', desc: 'Venda de produtos ao público. Suporta faturamento a prazo (Fiado).', icon: ShoppingBag, keywords: 'venda vendas fatura fiado' },
                      { id: 'PAGAMENTO', title: 'Lançar Pagamento / Amortização', desc: 'Recebimento de valores pendentes de clientes no modo fiado.', icon: Coins, keywords: 'pagamento pagar fiado dinheiro' }
                    ].filter(o => !commandPaletteQuery || o.title.toLowerCase().includes(commandPaletteQuery.toLowerCase()) || o.keywords.includes(commandPaletteQuery.toLowerCase())).map(option => (
                      <button
                        key={option.id}
                        onClick={() => setCommandPaletteActiveOption(option.id)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-850 transition-all text-left text-sm cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-brand-purple/10 text-brand-purple rounded-lg group-hover:bg-brand-purple group-hover:text-white transition-all">
                            <option.icon size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-200 group-hover:text-white">{option.title}</p>
                            <p className="text-xs text-gray-500">{option.desc}</p>
                          </div>
                        </div>
                        <CornerDownLeft size={14} className="text-gray-600 group-hover:text-white" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* ACTIVE FORM INPUTS */
              <form onSubmit={handleCommandPaletteSubmit} className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-brand-purple/20 text-brand-purple px-2 py-0.5 rounded-lg font-bold">LANÇAMENTO ATIVO</span>
                    <h4 className="font-bold text-sm text-white">{commandPaletteActiveOption}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCommandPaletteActiveOption(null);
                      setCommandPaletteFormData({});
                    }}
                    className="text-xs text-gray-400 hover:text-white font-semibold cursor-pointer"
                  >
                    ← Voltar às categorias
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* DYNAMIC FIELD RENDERING BY ACTIVE OPTION */}
                  {commandPaletteActiveOption === 'COLHEITA' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Identificação do Talhão</label>
                        <input
                          type="text"
                          required
                          placeholder="ex: Talhão Alfa (Cultura de Milho)"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.talhao || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, talhao: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Produto Colhido</label>
                        <input
                          type="text"
                          required
                          placeholder="ex: Milho Amarelo Seco"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.produto || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, produto: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Quantidade Líquida Colhida (kg)</label>
                        <input
                          type="number"
                          required
                          placeholder="ex: 1500"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.quantidade || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, quantidade: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Perdas Registadas no Campo (kg)</label>
                        <input
                          type="number"
                          placeholder="ex: 45"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.perdas || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, perdas: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Observações / Incidentes</label>
                        <textarea
                          placeholder="ex: Problema leve de irrigação detetado no quadrante norte do talhão."
                          className="w-full h-20 p-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.observacoes || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, observacoes: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {commandPaletteActiveOption === 'INSUMO' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Nome Comercial do Insumo</label>
                        <input
                          type="text"
                          required
                          placeholder="ex: NPK 12-24-12"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.nome || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, nome: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Categoria de Insumo</label>
                        <select
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.categoria || 'Adubos'}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, categoria: e.target.value })}
                        >
                          <option value="Adubos">Fertilizantes e Adubos</option>
                          <option value="Sementes">Sementes Certificadas</option>
                          <option value="Herbicidas">Herbicidas e Defensivos</option>
                          <option value="Ferramentas">Ferramentas de Desgaste</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Quantidade Aplicada</label>
                        <input
                          type="number"
                          required
                          placeholder="ex: 15"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.quantidade || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, quantidade: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Unidade de Medida</label>
                        <select
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.unidade || 'kg'}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, unidade: e.target.value })}
                        >
                          <option value="kg">Quilogramas (kg)</option>
                          <option value="L">Litros (L)</option>
                          <option value="Sacos">Sacos de 50kg</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Destinado ao Talhão</label>
                        <input
                          type="text"
                          placeholder="ex: Talhão Alfa"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.talhao || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, talhao: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {commandPaletteActiveOption === 'PESO' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Brinco / ID do Animal</label>
                        <input
                          type="text"
                          required
                          placeholder="ex: BOV-045"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.animalId || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, animalId: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Peso Corporal Medido (kg)</label>
                        <input
                          type="number"
                          required
                          placeholder="ex: 420"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.peso || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, peso: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Altura Medida no Dorso (m)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="ex: 1.35"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.altura || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, altura: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Ganho de Peso Diário Esperado (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="ex: 1.2"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.ganhoDiario || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, ganhoDiario: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {commandPaletteActiveOption === 'VACINA' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">ID do Animal ou Lote</label>
                        <input
                          type="text"
                          required
                          placeholder="ex: BOV-045"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.animalId || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, animalId: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Nome da Vacina / Procedimento</label>
                        <input
                          type="text"
                          required
                          placeholder="ex: Anti-Aftosa Dose Anual"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.vacina || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, vacina: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Medicamento Utilizado</label>
                        <input
                          type="text"
                          placeholder="ex: Aftovax 5ml"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.medicamento || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, medicamento: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Custo do Lançamento (Kz)</label>
                        <input
                          type="number"
                          placeholder="ex: 1200"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.custo || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, custo: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {commandPaletteActiveOption === 'VIAGEM' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Identificação da Embarcação</label>
                        <input
                          type="text"
                          required
                          placeholder="ex: Estrela do Namibe"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.embarcacao || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, embarcacao: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Combustível Abastecido (Litros)</label>
                        <input
                          type="number"
                          required
                          placeholder="ex: 200"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.combustivel || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, combustivel: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Quantidade de Tripulantes</label>
                        <input
                          type="number"
                          required
                          placeholder="ex: 4"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.tripulacao || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, tripulacao: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Zona Geográfica de Destino</label>
                        <input
                          type="text"
                          placeholder="ex: Zona de Pesca Sul"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.destino || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, destino: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {commandPaletteActiveOption === 'CAPTURA' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">ID da Viagem Associada</label>
                        <input
                          type="text"
                          required
                          placeholder="ex: VIA-Estrela-01"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.viagemId || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, viagemId: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Espécie de Peixe Capturada</label>
                        <select
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.especie || 'Carapau'}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, especie: e.target.value })}
                        >
                          <option value="Carapau">Carapau</option>
                          <option value="Sardinha">Sardinha do Namibe</option>
                          <option value="Garoupa">Garoupa Vermelha</option>
                          <option value="Corvina">Corvina</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Quantidade Capturada (kg)</label>
                        <input
                          type="number"
                          required
                          placeholder="ex: 750"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.quantidade || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, quantidade: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Preço de Venda Esperado (Kz/kg)</label>
                        <input
                          type="number"
                          required
                          placeholder="ex: 1200"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.preco || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, preco: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {commandPaletteActiveOption === 'VENDA' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Cliente ou Cooperador comprador</label>
                        <input
                          type="text"
                          required
                          placeholder="ex: Sofia Gaspar Antunes"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.cliente || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, cliente: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Produto Comercializado</label>
                        <input
                          type="text"
                          required
                          placeholder="ex: Arroz Agulha 1kg"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.produto || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, produto: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Quantidade Vendida</label>
                        <input
                          type="number"
                          required
                          placeholder="ex: 10"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.quantidade || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, quantidade: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Preço Unitário (Kz)</label>
                        <input
                          type="number"
                          required
                          placeholder="ex: 850"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.preco || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, preco: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Venda Fiada (Contas a Receber)?</label>
                        <select
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.fiado || 'nao'}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, fiado: e.target.value })}
                        >
                          <option value="nao">Não, pronto pagamento (Caixa)</option>
                          <option value="sim">Sim, faturamento a prazo (30 dias)</option>
                        </select>
                      </div>
                    </>
                  )}

                  {commandPaletteActiveOption === 'PAGAMENTO' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Nome do Cliente para Amortização</label>
                        <input
                          type="text"
                          required
                          placeholder="ex: Sofia Gaspar Antunes"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.cliente || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, cliente: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Referência da Fatura / Documento</label>
                        <input
                          type="text"
                          placeholder="ex: FAT-4921"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.documento || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, documento: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Valor Amortizado / Pago (Kz)</label>
                        <input
                          type="number"
                          required
                          placeholder="ex: 15000"
                          className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none"
                          value={commandPaletteFormData.valorPago || ''}
                          onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, valorPago: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Simulated Evidence Cam Capture */}
                <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-850 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera size={14} className="text-brand-purple" />
                      <span className="text-xs font-bold">Comprovativo Fotográfico (Evidência Real)</span>
                    </div>
                    {photoEvidence && (
                      <span className="text-[10px] bg-green-500/20 text-green-400 font-bold px-2 py-0.5 rounded-lg">FOTO ANEXADA</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoEvidence("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23222'/><text x='10' y='50' fill='white' font-size='10'>EVIDENCIA MIRAWELCH</text></svg>");
                        alert('Sucesso! Foto simulada capturada via câmera integrada do dispositivo móvel e guardada em cache.');
                      }}
                      className="px-3 py-2 bg-gray-850 hover:bg-gray-800 text-gray-200 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Camera size={12} />
                      Simular Captura Câmara
                    </button>

                    {photoEvidence && (
                      <button
                        type="button"
                        onClick={() => setPhotoEvidence(null)}
                        className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                      >
                        Remover Foto
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl font-bold transition-all text-sm shadow-md cursor-pointer"
                  >
                    Homologar Registo {offlineMode || commandPaletteFormData.offline === 'true' ? 'na Cache Offline' : 'Online'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCommandPaletteActiveOption(null);
                      setCommandPaletteFormData({});
                    }}
                    className="px-4 py-3 bg-gray-900 border border-gray-800 hover:bg-gray-850 text-gray-400 hover:text-white rounded-xl font-bold transition-all text-sm cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {/* Footer with tips */}
            <div className="px-5 py-3 border-t border-gray-800 bg-[#0A0A0F] text-[10px] text-gray-500 flex justify-between items-center">
              <span>Prima <kbd className="font-mono bg-gray-900 px-1 py-0.5 rounded border border-gray-800">⌘K</kbd> a qualquer altura para fechar</span>
              <span>MiraWelch Platform Integration • Angola</span>
            </div>
          </div>
        </div>
      )}

      {/* 5.1. MOTOR REVISION MODAL */}
      {motorRevisionModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#13131A] border border-orange-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
            <div className="p-6 border-b border-gray-800 bg-[#1A1A21] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 text-orange-500 rounded-xl">
                  <Wrench size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Registar Revisão & Manutenção do Motor</h3>
                  <p className="text-xs text-gray-400">Insira os dados da intervenção para homologação e resolução do alerta.</p>
                </div>
              </div>
              <button
                onClick={() => setMotorRevisionModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const equip = formData.get('equipamento') as string || 'Estrela do Namibe (Motor Yamaha 250HP)';
                const custo = parseFloat(formData.get('custo') as string || '150000');
                const tecnico = formData.get('tecnico') as string || 'Oficina Náutica do Namibe';

                setManutencaoPescaList(prev => [
                  {
                    id: `m-yamaha-${Date.now()}`,
                    embarcacao: equip,
                    tipo: 'Preventiva 500H (Motor Yamaha 250HP)',
                    custo,
                    data: new Date().toISOString().split('T')[0],
                    tecnico,
                    pecas: 'Troca de Óleo de Motor, Filtro de Combustível, Impulsora de Água',
                    status: 'Concluído'
                  },
                  ...prev
                ]);

                markAlertResolved('alert-fisheries-motor', 'Motor Yamaha 250HP Atingiu Horas de Revisão');
                setMotorRevisionModalOpen(false);
              }}
              className="p-6 space-y-4"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Equipamento / Motor</label>
                <input
                  type="text"
                  name="equipamento"
                  defaultValue="Estrela do Namibe - Motor Yamaha 250HP"
                  className="w-full h-11 px-3.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-semibold focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Horas no Horímetro</label>
                  <input
                    type="text"
                    name="horas"
                    defaultValue="512 Horas Activas"
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-semibold focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Custo da Manutenção (Kz)</label>
                  <input
                    type="number"
                    name="custo"
                    defaultValue="150000"
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-semibold focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Oficina / Técnico Responsável</label>
                <input
                  type="text"
                  name="tecnico"
                  defaultValue="Oficina Náutica do Namibe (Eng. Manuel Tchipepe)"
                  className="w-full h-11 px-3.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-semibold focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Peças Substituídas & Observações</label>
                <textarea
                  name="pecas"
                  rows={2}
                  defaultValue="Filtro de Óleo Yamaha, Filtro de Decantação de Combustível, Óleo Sintético 10W40, Impulsora da Bomba de Água."
                  className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-semibold focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMotorRevisionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  <CheckCircle2 size={16} />
                  <span>Concluir Revisão & Resolver Alerta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5.2. HARVEST MODAL */}
      {harvestModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#13131A] border border-amber-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
            <div className="p-6 border-b border-gray-800 bg-[#1A1A21] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                  <Sprout size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Registar Colheita Antecipada</h3>
                  <p className="text-xs text-gray-400">Homologação da colheita em prevenção das chuvas fortes prevostas.</p>
                </div>
              </div>
              <button
                onClick={() => setHarvestModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                markAlertResolved('alert-agri-weather', 'Previsão Climática: Chuva Forte na Semana de Colheita');
                setHarvestModalOpen(false);
              }}
              className="p-6 space-y-4"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Talhão Agrícola</label>
                <input
                  type="text"
                  defaultValue="Talhão Alfa (Milho - 12 Hectares)"
                  className="w-full h-11 px-3.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-semibold focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Volume Estimado (Toneladas)</label>
                  <input
                    type="number"
                    defaultValue="45"
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-semibold focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Data de Conclusão</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-semibold focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setHarvestModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <CheckCircle2 size={16} />
                  <span>Salvar Colheita & Resolver Alerta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5.3. LIVESTOCK WEIGHTING MODAL */}
      {weightingModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#13131A] border border-yellow-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
            <div className="p-6 border-b border-gray-800 bg-[#1A1A21] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-yellow-500/10 text-yellow-500 rounded-xl">
                  <Activity size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Registar Pesagem do Rebanho</h3>
                  <p className="text-xs text-gray-400">Atualização da monitoria de engorda para controlo de conversão alimentar.</p>
                </div>
              </div>
              <button
                onClick={() => setWeightingModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                markAlertResolved('alert-livestock-weight', 'Monitoria Pendente: Lote Engorda A sem Pesagem');
                setWeightingModalOpen(false);
              }}
              className="p-6 space-y-4"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Lote / Rebanho</label>
                <input
                  type="text"
                  defaultValue="Lote Engorda A (BOV-045 - 28 Cabeças)"
                  className="w-full h-11 px-3.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-semibold focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Peso Médio por Cabeça (Kg)</label>
                  <input
                    type="number"
                    defaultValue="385"
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-semibold focus:border-yellow-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Ganha Diário Médio (kg/dia)</label>
                  <input
                    type="text"
                    defaultValue="1.4 kg/dia"
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-semibold focus:border-yellow-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setWeightingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-yellow-500/20"
                >
                  <CheckCircle2 size={16} />
                  <span>Salvar Pesagem & Resolver Alerta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5.4. PRICE MARGIN MODAL */}
      {priceMarginModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#13131A] border border-red-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
            <div className="p-6 border-b border-gray-800 bg-[#1A1A21] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Reajuste de Preço & Margem Comercial</h3>
                  <p className="text-xs text-gray-400">Ajuste do valor de venda para recomposição da margem líquida.</p>
                </div>
              </div>
              <button
                onClick={() => setPriceMarginModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                markAlertResolved('alert-commerce-margin', 'Margem do Arroz Agulha ALIM-001');
                setPriceMarginModalOpen(false);
              }}
              className="p-6 space-y-4"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Produto Comercial</label>
                <input
                  type="text"
                  defaultValue="Arroz Agulha 5kg (ALIM-001)"
                  className="w-full h-11 px-3.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-semibold focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Preço de Custo (Kz)</label>
                  <input
                    type="number"
                    defaultValue="3800"
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-semibold focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Novo Preço de Venda (Kz)</label>
                  <input
                    type="number"
                    defaultValue="4500"
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-semibold focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-xs text-green-400 flex items-center justify-between font-semibold">
                <span>Margem de Lucro Resultante:</span>
                <span className="font-bold text-sm">18.4% (Segura)</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPriceMarginModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-red-500/20"
                >
                  <CheckCircle2 size={16} />
                  <span>Salvar Preço & Resolver Alerta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5.5. SCORE REPORT DETAILED MODAL */}
      {scoreReportOrgModal && (
        <div className="fintel-modal-backdrop" onClick={() => setScoreReportOrgModal(null)}>
          <div className="fintel-modal-content max-w-xl space-y-4 text-left" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold font-mono text-[10px] flex items-center justify-center">
                  MW
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                    Relatório de Score Operacional & Financeiro
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                    {scoreReportOrgModal.name} • NIF AGT Validade Checked
                  </p>
                </div>
              </div>
              <button
                onClick={() => setScoreReportOrgModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">Economic Score</span>
                  <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {scoreReportOrgModal.maturity === 'ADVANCED' ? '85' : '55'} / 100
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">Nível MiraWelch</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-1 block">
                    {scoreReportOrgModal.maturity}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">Integridade Dados</span>
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-zinc-100 mt-1 block">
                    92% Auditado
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-zinc-800 space-y-2 bg-white dark:bg-zinc-950">
                <h4 className="font-bold text-slate-900 dark:text-zinc-100 text-xs">Métricas de Confiabilidade Bancária:</h4>
                <div className="space-y-1.5 font-mono text-[11px] text-slate-600 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Validação Fiscal AGT:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">NIF Activo e Regularizado</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frequência de Diários de Campo:</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">Diário (&gt; 24 registos/mês)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aviso 10/22 Banco Nacional de Angola:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Em Conformidade Directa</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                Este dossiê está pronto para transmissão via API aos analistas de risco dos bancos parceiros (BAI, BFA, BPC).
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-zinc-800">
              <button
                onClick={() => setScoreReportOrgModal(null)}
                className="btn-primary text-xs py-1.5 px-3 cursor-pointer"
              >
                Concluir Análise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5.6. CUSTOM NOTIFICATION POPUP MODAL */}
      {customNotificationModal && (
        <div className="fintel-modal-backdrop" onClick={() => setCustomNotificationModal(null)}>
          <div className="fintel-modal-content max-w-md space-y-4 text-left" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                {customNotificationModal.title}
              </h3>
              <button
                onClick={() => setCustomNotificationModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
              {customNotificationModal.message}
            </p>

            <div className="pt-2 flex justify-end border-t border-slate-200 dark:border-zinc-800">
              <button
                onClick={() => setCustomNotificationModal(null)}
                className="btn-primary text-xs py-1.5 px-3 cursor-pointer"
              >
                Compreendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON FOR REGRA DOS 30 SEGUNDOS */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setQuickLoggerModalOpen(true)}
          className="px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-full font-black text-xs shadow-2xl flex items-center gap-2.5 border-2 border-white dark:border-gray-800 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        >
          <Zap size={16} className="text-amber-300 animate-pulse group-hover:rotate-12 transition-transform" />
          <span>REGISTO &lt;30s</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[9px]">
            ⚡ Rápido
          </span>
        </button>
      </div>

      {/* 30-SECOND QUICK LOGGER MODAL */}
      {quickLoggerModalOpen && (
        <Quick30SecLogger
          isOpenAsModal={true}
          onCloseModal={() => setQuickLoggerModalOpen(false)}
          onRecordAdded={() => {
            fetchDashboardData();
          }}
        />
      )}

    </div>
  );
}
