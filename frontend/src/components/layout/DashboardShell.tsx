/**
 * DashboardShell — thin shell replacing the monolithic Dashboards.tsx.
 * Holds shared state, handlers, sidebar, header, and modals.
 * Delegates role-specific content to extracted modules.
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getApiUrl } from '../../lib/api';
import { useOfflineSync } from '../../hooks/useOfflineSync';
import { CommandPalette } from './CommandPalette';
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
  CornerDownLeft
} from 'lucide-react';
import { OperationalRecord, DocumentRecord, Organization, UserContext } from '../../types/index.js';
import { OperationsPage } from '../../modules/operations';
import { FinancePage } from '../../modules/finance';
import { CrmPage } from '../../modules/crm';
import { DocumentsPage } from '../../modules/documents';
import { FundingPage } from '../../modules/funding';
import { AiCenterPage } from '../../modules/ai';
import { ProfilePage } from '../../pages/dashboard/ProfilePage.js';
import { SupportCostsPage } from '../../modules/support';
import { OverviewTab } from '../../modules/overview/OverviewTab.js';
import { AdminTabs } from '../../modules/admin/AdminTabs.js';
import { AnalystTabs } from '../../modules/analyst/AnalystTabs.js';
import { ConsultantTabs } from '../../modules/consultant/ConsultantTabs.js';

export default function DashboardShell() {
  const { user, logout, refreshUser } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  const canSwitchSectors = !user?.industry || ['SUPER_ADMIN', 'ANALYST', 'CONSULTANT'].includes(user?.role || '');

  const [showProfile, setShowProfile] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [documentsQueue, setDocumentsQueue] = useState<DocumentRecord[]>([]);
  const [operationalLogs, setOperationalLogs] = useState<OperationalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [showLogModal, setShowLogModal] = useState(false);
  const [logType, setLogType] = useState<'HARVEST' | 'ANIMAL' | 'CATCH' | 'SALE' | 'EXPENSE'>('SALE');
  const [logForm, setLogForm] = useState({
    title: '', quantity: '', unit: 'kg', amount: '', notes: '', date: new Date().toISOString().split('T')[0]
  });

  const [showDocModal, setShowDocModal] = useState(false);
  const [docType, setDocType] = useState<'NIF' | 'ID_CARD' | 'BANK_STATEMENT' | 'LICENSE'>('NIF');
  const [docFileName, setDocFileName] = useState('');

  const [simRevenueIncrease, setSimRevenueIncrease] = useState<number>(0);
  const [simResolvedChecklist, setSimResolvedChecklist] = useState<number>(0);
  const [activeOrgToAssign, setActiveOrgToAssign] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Organization | null>(null);
  const [analystFeedback, setAnalystFeedback] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiPlan, setAiPlan] = useState<string[]>([]);
  const [activeClient, setActiveClient] = useState<string | null>(null);
  const [suspensionOrgId, setSuspensionOrgId] = useState<string | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [viewingDoc, setViewingDoc] = useState<DocumentRecord | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);

  const [superAdminTab, setSuperAdminTab] = useState<'ecosystem' | 'users' | 'kyc' | 'survey' | 'logs' | 'consultants'>('ecosystem');
  const [adminTab, setAdminTab] = useState<'organizations' | 'invites' | 'delegation'>('organizations');
  const [analystTab, setAnalystTab] = useState<'applications' | 'scoring' | 'docs' | 'workflow'>('applications');
  const [consultantTab, setConsultantTab] = useState<'clients' | 'plans' | 'ai_recs'>('clients');
  const [coopTab, setCoopTab] = useState<'overview' | 'operations' | 'finance' | 'crm' | 'documents' | 'credit' | 'ai_center' | 'ledger' | 'overheads'>('overview');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'CONSULTANT'].includes(user?.role || '')) {
        const orgRes = await fetch(getApiUrl('/api/admin/organizations'));
        const userRes = await fetch(getApiUrl('/api/admin/users'));
        if (orgRes.ok) setOrganizations(await orgRes.json());
        if (userRes.ok) setUsersList(await userRes.json());

        if (user?.role === 'SUPER_ADMIN') {
          const consRes = await fetch(getApiUrl('/api/admin/consultants'));
          if (consRes.ok) setConsultants(await consRes.json());
        }
      }

      if (user?.organizationId) {
        const opRes = await fetch(getApiUrl(`/api/operations/list/${user.organizationId}`));
        const docRes = await fetch(getApiUrl(`/api/documents/list/${user.organizationId}`));
        if (opRes.ok) setOperationalLogs(await opRes.json());
        if (docRes.ok) setDocumentsQueue(await docRes.json());
      }
    } catch (e) {
      console.error('Error fetching dashboard info', e);
    } finally {
      setLoading(false);
    }
  };

  const { offlineMode, setOfflineMode, offlineCache, setOfflineCache, syncingOffline, handleToggleConnection } = useOfflineSync({ fetchDashboardData, refreshUser });

  const [pwaInstalled, setPwaInstalled] = useState<boolean>(() => {
    return localStorage.getItem('olo-pwa-installed') === 'true';
  });
  const [showPwaModal, setShowPwaModal] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [selectedAlertSector, setSelectedAlertSector] = useState<'ALL' | 'AGRICULTURE' | 'LIVESTOCK' | 'FISHERIES' | 'COMMERCE'>(() => {
    const ind = user?.industry;
    if (ind && ['AGRICULTURE', 'LIVESTOCK', 'FISHERIES', 'COMMERCE'].includes(ind)) {
      return ind as any;
    }
    return 'ALL';
  });
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [commandPaletteQuery, setCommandPaletteQuery] = useState<string>('');
  const [commandPaletteActiveOption, setCommandPaletteActiveOption] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [commandPaletteFormData, setCommandPaletteFormData] = useState<Record<string, string>>({});
  const [photoEvidence, setPhotoEvidence] = useState<string | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const [systemLogs, setSystemLogs] = useState<string[]>([
    `[${new Date(Date.now() - 1200000).toLocaleTimeString()}] [INFO] Ligacao estabelecida com API do Banco BAI de Luanda.`,
    `[${new Date(Date.now() - 3600000).toLocaleTimeString()}] [SUCCESS] Documento Estatuto_Social_Publicado.pdf verificado por Sofia Antunes.`,
    `[${new Date(Date.now() - 7200000).toLocaleTimeString()}] [INFO] Utilizador Mateus Gaspar actualizou inventario no Modulo Comercial.`,
    `[${new Date(Date.now() - 10800000).toLocaleTimeString()}] [ALERT] KYC pendente para Cooperativa Luanda Norte (NIF em falta).`,
    `[${new Date(Date.now() - 14400000).toLocaleTimeString()}] [SUCCESS] Nova organizacao 'Pescas Artesanais do Namibe' registada com sucesso.`,
  ]);

  const [adminInvites, setAdminInvites] = useState([
    { id: 'inv-1', name: 'Sebastiao Simao', email: 'sebastiao@olofintel.ao', role: 'MANAGER', status: 'Pendente', sentAt: '2026-07-18' },
    { id: 'inv-2', name: 'Teresa Fonseca', email: 'teresa@olofintel.ao', role: 'FINANCIAL_OFFICER', status: 'Aceite', sentAt: '2026-07-15' },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('MANAGER');

  const [creditApplications, setCreditApplications] = useState([
    { id: 'app-1', orgName: 'Cooperativa Agricola Humpata', amount: 8500000, term: '24 meses', status: 'Em Analise', step: 2, date: '2026-07-15' },
    { id: 'app-2', orgName: 'Criadores do Planalto Huambo', amount: 15000000, term: '36 meses', status: 'Aprovado', step: 4, date: '2026-07-10' },
    { id: 'app-3', orgName: 'Pescas Artesanais do Namibe', amount: 4500000, term: '12 meses', status: 'Revisao Necessaria', step: 1, date: '2026-07-18' },
  ]);

  const [surveyList, setSurveyList] = useState([
    { id: 'surv-1', orgName: 'Cooperativa Agricola Humpata', sector: 'AGRICULTURE', province: 'Huila', biggestChallenge: 'Falta de maquinizacao de terra e sementes certificadas.', usesPaper: true, usesExcel: false, usesWhatsApp: true },
    { id: 'surv-2', orgName: 'Criadores do Planalto Huambo', sector: 'LIVESTOCK', province: 'Huambo', biggestChallenge: 'Racoes com custo inflacionado e falta de veterinarios.', usesPaper: false, usesExcel: true, usesWhatsApp: true },
    { id: 'surv-3', orgName: 'Pescas Artesanais do Namibe', sector: 'FISHERIES', province: 'Namibe', biggestChallenge: 'Conservacao de frio insuficiente e combustivel caro.', usesPaper: true, usesExcel: false, usesWhatsApp: false },
  ]);

  const [partnerBanks, setPartnerBanks] = useState([
    { id: 'bank-1', name: 'Banco BAI', line: 'Fomento Agricola LISPA', activeApps: 2, limit: '50.000.000 Kz', status: 'Sincronizado' },
    { id: 'bank-2', name: 'Banco BFA', line: 'Credito Pesca de Angola', activeApps: 1, limit: '35.000.000 Kz', status: 'Sincronizado' },
    { id: 'bank-3', name: 'BCI (Banco de Comercio e Industria)', line: 'Linha de Apoio a Producao Nacional', activeApps: 0, limit: '80.000.000 Kz', status: 'Desconectado' },
    { id: 'bank-4', name: 'FADA', line: 'Fundo de Apoio ao Desenvolvimento Agrario', activeApps: 1, limit: '20.000.000 Kz', status: 'Sincronizado' },
  ]);

  const [selectedAppWorkflow, setSelectedAppWorkflow] = useState<any>(null);

  const toggleTask = (taskId: string) => {
    setCheckedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  useEffect(() => { fetchDashboardData(); }, [user]);
  useEffect(() => { setShowProfile(false); }, [coopTab, superAdminTab, adminTab, analystTab, consultantTab]);

  const handleCommandPaletteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const userId = user.id;
    const id = `${commandPaletteActiveOption}-${Date.now()}`;
    const gpsString = gpsCoords ? `${gpsCoords.latitude.toFixed(4)}, ${gpsCoords.longitude.toFixed(4)}` : '-14.9782, 13.4321';
    const photoString = photoEvidence || '';
    const isOffline = offlineMode || commandPaletteFormData.offline === 'true';

    if (commandPaletteActiveOption === 'COLHEITA') {
      const saved = localStorage.getItem(`olo-fintel-op-colheitas-${userId}`);
      let colList = saved ? JSON.parse(saved) : [];
      const newCol = {
        id, data: new Date().toISOString().split('T')[0],
        talhao: commandPaletteFormData.talhao || 'Talhao Alfa',
        produto: commandPaletteFormData.produto || 'Milho Amarelo',
        quantidade: parseFloat(commandPaletteFormData.quantidade || '0'),
        perdas: parseFloat(commandPaletteFormData.perdas || '0'),
        observacoes: `${isOffline ? ' [PENDENTE DE SINC] ' : ''}Registo via CmdK. GPS: ${gpsString}. Obs: ${commandPaletteFormData.observacoes || 'S/D'}`,
        photo: photoString, gps: gpsString, syncStatus: isOffline ? 'PENDING' : 'SYNCED'
      };
      colList = [newCol, ...colList];
      localStorage.setItem(`olo-fintel-op-colheitas-${userId}`, JSON.stringify(colList));
    } else if (commandPaletteActiveOption === 'INSUMO') {
      const saved = localStorage.getItem(`olo-fintel-op-insumos-${userId}`);
      let insList = saved ? JSON.parse(saved) : [];
      const newIns = {
        id, nome: commandPaletteFormData.nome || 'NPK 12-24-12',
        categoria: commandPaletteFormData.categoria || 'Adubos',
        quantidade: parseFloat(commandPaletteFormData.quantidade || '0'),
        unidade: commandPaletteFormData.unidade || 'kg', movimento: 'Saida',
        talhao: commandPaletteFormData.talhao || 'Talhao Geral',
        observacoes: `${isOffline ? ' [PENDENTE DE SINC] ' : ''}Aplicado via CmdK. GPS: ${gpsString}`,
        photo: photoString, gps: gpsString, syncStatus: isOffline ? 'PENDING' : 'SYNCED'
      };
      insList = [newIns, ...insList];
      localStorage.setItem(`olo-fintel-op-insumos-${userId}`, JSON.stringify(insList));
    } else if (commandPaletteActiveOption === 'PESO') {
      const savedWeight = localStorage.getItem(`olo-fintel-op-crescimento-${userId}`);
      let cresList = savedWeight ? JSON.parse(savedWeight) : [];
      const newWeight = {
        id, animalId: commandPaletteFormData.animalId || 'BOV-045',
        data: new Date().toISOString().split('T')[0],
        peso: parseFloat(commandPaletteFormData.peso || '0'),
        altura: parseFloat(commandPaletteFormData.altura || '0'),
        ganhoDiario: parseFloat(commandPaletteFormData.ganhoDiario || '0'),
        observacoes: `${isOffline ? ' [PENDENTE DE SINC] ' : ''}Pesagem via CmdK. GPS: ${gpsString}`,
        photo: photoString, gps: gpsString, syncStatus: isOffline ? 'PENDING' : 'SYNCED'
      };
      cresList = [newWeight, ...cresList];
      localStorage.setItem(`olo-fintel-op-crescimento-${userId}`, JSON.stringify(cresList));
      const savedRebanho = localStorage.getItem(`olo-fintel-op-rebanho-${userId}`);
      if (savedRebanho) {
        let rebList = JSON.parse(savedRebanho);
        rebList = rebList.map((a: any) => {
          if (a.identificacao === commandPaletteFormData.animalId) {
            return { ...a, peso: parseFloat(commandPaletteFormData.peso || '0'), estado: 'Saudavel' };
          }
          return a;
        });
        localStorage.setItem(`olo-fintel-op-rebanho-${userId}`, JSON.stringify(rebList));
      }
    } else if (commandPaletteActiveOption === 'VACINA') {
      const savedSaude = localStorage.getItem(`olo-fintel-op-saudeAnimal-${userId}`);
      let saudeList = savedSaude ? JSON.parse(savedSaude) : [];
      const newHealth = {
        id, animalId: commandPaletteFormData.animalId || 'BOV-045',
        tipo: 'Vacinacao', descricao: commandPaletteFormData.vacina || 'Anti-Aftosa Dose Reforco',
        data: new Date().toISOString().split('T')[0],
        medicamento: commandPaletteFormData.medicamento || 'Aftovax',
        custo: parseFloat(commandPaletteFormData.custo || '0'),
        gps: gpsString, photo: photoString, syncStatus: isOffline ? 'PENDING' : 'SYNCED'
      };
      saudeList = [newHealth, ...saudeList];
      localStorage.setItem(`olo-fintel-op-saudeAnimal-${userId}`, JSON.stringify(saudeList));
    } else if (commandPaletteActiveOption === 'VIAGEM') {
      const savedViagens = localStorage.getItem(`olo-fintel-op-viagens-${userId}`);
      let vList = savedViagens ? JSON.parse(savedViagens) : [];
      const newVoyage = {
        id, embarcacao: commandPaletteFormData.embarcacao || 'Estrela do Namibe',
        combustivel: parseFloat(commandPaletteFormData.combustivel || '0'),
        tripulacao: parseInt(commandPaletteFormData.tripulacao || '4', 10),
        data: new Date().toISOString().split('T')[0], estado: 'Em Curso',
        destino: commandPaletteFormData.destino || 'Zona de Pesca Sul',
        gps: gpsString, photo: photoString, syncStatus: isOffline ? 'PENDING' : 'SYNCED'
      };
      vList = [newVoyage, ...vList];
      localStorage.setItem(`olo-fintel-op-viagens-${userId}`, JSON.stringify(vList));
    } else if (commandPaletteActiveOption === 'CAPTURA') {
      const savedCapturas = localStorage.getItem(`olo-fintel-op-capturas-${userId}`);
      let cList = savedCapturas ? JSON.parse(savedCapturas) : [];
      const newCatch = {
        id, viagemId: commandPaletteFormData.viagemId || 'VIA-Estrela',
        especie: commandPaletteFormData.especie || 'Carapau',
        quantidade: parseFloat(commandPaletteFormData.quantidade || '0'),
        preco: parseFloat(commandPaletteFormData.preco || '0'),
        comprador: 'Mercado do Namibe',
        gps: gpsString, photo: photoString, syncStatus: isOffline ? 'PENDING' : 'SYNCED'
      };
      cList = [newCatch, ...cList];
      localStorage.setItem(`olo-fintel-op-capturas-${userId}`, JSON.stringify(cList));
    } else if (commandPaletteActiveOption === 'VENDA') {
      const savedVendas = localStorage.getItem(`olo-fintel-op-vendas-${userId}`);
      let venList = savedVendas ? JSON.parse(savedVendas) : [];
      const valorTotal = parseFloat(commandPaletteFormData.quantidade || '0') * parseFloat(commandPaletteFormData.preco || '0');
      const newVenda = {
        id, cliente: commandPaletteFormData.cliente || 'Consumidor Final',
        produto: commandPaletteFormData.produto || 'Arroz Agulha 1kg',
        quantidade: parseFloat(commandPaletteFormData.quantidade || '0'),
        valor: valorTotal,
        metodo: commandPaletteFormData.fiado === 'sim' ? 'Fiado' : 'Pronto Pagamento',
        data: new Date().toISOString().split('T')[0],
        gps: gpsString, photo: photoString, syncStatus: isOffline ? 'PENDING' : 'SYNCED'
      };
      venList = [newVenda, ...venList];
      localStorage.setItem(`olo-fintel-op-vendas-${userId}`, JSON.stringify(venList));
      if (commandPaletteFormData.fiado === 'sim') {
        const savedAReceber = localStorage.getItem(`olo-fintel-op-contasAReceber-${userId}`);
        let arList = savedAReceber ? JSON.parse(savedAReceber) : [];
        const date30 = new Date();
        date30.setDate(date30.getDate() + 30);
        const newAR = {
          id: `REC-${Date.now()}`, cliente: commandPaletteFormData.cliente || 'Consumidor Final',
          documento: `FAT-${Math.floor(Math.random() * 9000) + 1000}`,
          valor: valorTotal, vencimento: date30.toISOString().split('T')[0],
          estado: 'Pendente', gps: gpsString
        };
        arList = [newAR, ...arList];
        localStorage.setItem(`olo-fintel-op-contasAReceber-${userId}`, JSON.stringify(arList));
      }
    } else if (commandPaletteActiveOption === 'PAGAMENTO') {
      const savedAReceber = localStorage.getItem(`olo-fintel-op-contasAReceber-${userId}`);
      if (savedAReceber) {
        let arList = JSON.parse(savedAReceber);
        let found = false;
        arList = arList.map((rec: any) => {
          if (rec.cliente.toLowerCase().includes((commandPaletteFormData.cliente || '').toLowerCase()) || rec.documento === commandPaletteFormData.documento) {
            found = true;
            const amortizado = parseFloat(commandPaletteFormData.valorPago || '0');
            const novoValor = Math.max(0, rec.valor - amortizado);
            return { ...rec, valor: novoValor, estado: novoValor === 0 ? 'Pago' : 'Pendente', observacoes: `Amortizado ${amortizado.toLocaleString()} Kz em ${new Date().toLocaleDateString()}` };
          }
          return rec;
        });
        localStorage.setItem(`olo-fintel-op-contasAReceber-${userId}`, JSON.stringify(arList));
        if (found) {
          const logMsg = `[RECEBIMENTO] Cliente ${commandPaletteFormData.cliente} amortizou ${commandPaletteFormData.valorPago} Kz`;
          setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ${logMsg}`, ...prev]);
        }
      }
    }

    alert(`Sucesso! Lancamento de "${commandPaletteActiveOption}" registado com exito.${isOffline ? ' (Sinalizado na cache de contingencia offline)' : ''}`);
    setShowCommandPalette(false);
    setCommandPaletteActiveOption(null);
    setCommandPaletteFormData({});
    setPhotoEvidence(null);
    setGpsCoords(null);
    setRefreshCounter(prev => prev + 1);
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logForm.title || !user?.organizationId) return;
    if (offlineMode) {
      const simulatedId = 'offline-' + Math.random().toString(36).substring(2, 9);
      const simulatedRecord: OperationalRecord = {
        id: simulatedId, orgId: user.organizationId, type: logType,
        title: logForm.title + ' [OFFLINE]',
        quantity: logForm.quantity ? parseFloat(logForm.quantity) : undefined,
        unit: logForm.unit, amount: logForm.amount ? parseFloat(logForm.amount) : undefined,
        notes: logForm.notes ? logForm.notes + ' (Registo Offline)' : 'Registo Offline',
        date: logForm.date
      };
      setOfflineCache(prev => [simulatedRecord, ...prev]);
      setShowLogModal(false);
      setLogForm({ title: '', quantity: '', unit: 'kg', amount: '', notes: '', date: new Date().toISOString().split('T')[0] });
      alert('Operacao guardada localmente em cache offline com sucesso!');
      return;
    }
    try {
      const res = await fetch(getApiUrl('/api/operations/add'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId: user.organizationId, type: logType, ...logForm })
      });
      if (res.ok) {
        setShowLogModal(false);
        setLogForm({ title: '', quantity: '', unit: 'kg', amount: '', notes: '', date: new Date().toISOString().split('T')[0] });
        fetchDashboardData();
        refreshUser();
      }
    } catch (e) { console.error(e); }
  };

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFileName || !user?.organizationId) return;
    try {
      const res = await fetch(getApiUrl('/api/documents/upload'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId: user.organizationId, type: docType, name: docFileName })
      });
      if (res.ok) { setShowDocModal(false); setDocFileName(''); fetchDashboardData(); refreshUser(); }
    } catch (e) { console.error(e); }
  };

  const handleDocAction = async (docId: string, action: 'VERIFIED' | 'REJECTED', fb?: string) => {
    try {
      const res = await fetch(getApiUrl('/api/admin/document-action'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId, action, feedback: fb })
      });
      if (res.ok) { setViewingDoc(null); fetchDashboardData(); refreshUser(); }
    } catch (e) { console.error(e); }
  };

  const handleDelegate = async (orgId: string, consId: string) => {
    try {
      const res = await fetch(getApiUrl('/api/admin/delegate'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId, consultantId: consId })
      });
      if (res.ok) { setActiveOrgToAssign(null); fetchDashboardData(); }
    } catch (e) { console.error(e); }
  };

  const handleSuspension = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspensionOrgId) return;
    const org = organizations.find(o => o.id === suspensionOrgId);
    const suspend = !org?.suspended;
    try {
      const res = await fetch(getApiUrl('/api/admin/suspend'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: suspensionOrgId, suspend, reason: suspend ? suspensionReason : '' })
      });
      if (res.ok) { setSuspensionOrgId(null); setSuspensionReason(''); fetchDashboardData(); }
    } catch (e) { console.error(e); }
  };

  const handleGenerateAIPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt) return;
    const prompts: Record<string, string[]> = {
      'score': ['Organizar certidao de registo predial e ata constitutiva', 'Registar todas as despesas de sementes e combustiveis da epoca de chuva', 'Carregar os ultimos 3 extratos bancarios do Banco BAI no portal'],
      'agricultura': ['Criar mapeamento visual dos 4 talhoes no dashboard', 'Agendar a colheita de feijao para a primeira semana de Agosto', 'Preencher a ficha tecnica de pesticidas utilizados'],
      'pesca': ['Mapear consumo de combustivel por quilometro percorrido', 'Contratar seguro de acidentes de trabalho basico para os pescadores', 'Subir licenca de pesca comercial de Luanda']
    };
    const chosenPlan = Object.entries(prompts).find(([k]) => aiPrompt.toLowerCase().includes(k))?.[1] || [
      'Digitalizar e carregar documento oficial de NIF', 'Registar vendas de producao consecutivamente no livro de caixa', 'Realizar formacao basica de planeamento de custos'
    ];
    setAiPlan(chosenPlan);
  };

  if (!user) return null;

  const combinedLogs = [...offlineCache, ...operationalLogs];
  const totalRevenue = combinedLogs.filter(log => log.type === 'SALE').reduce((sum, log) => sum + (log.amount || 0), 0);
  const totalExpense = combinedLogs.filter(log => log.type === 'EXPENSE').reduce((sum, log) => sum + (log.amount || 0), 0);
  const netMargin = totalRevenue - totalExpense;
  const marginPercentage = totalRevenue > 0 ? Math.round((netMargin / totalRevenue) * 100) : 0;
  const liquidityRatio = totalExpense > 0 ? (totalRevenue / totalExpense).toFixed(1) : '1.5';
  const liquidityStatus = parseFloat(liquidityRatio) >= 1.5 ? 'Excelente' : parseFloat(liquidityRatio) >= 1.0 ? 'Estavel' : 'Critico';
  const financialHealth = marginPercentage > 20 ? 'Excelente (88/100)' : marginPercentage > 0 ? 'Estavel (62/100)' : 'Alerta (35/100)';
  const opRecords = combinedLogs.filter(log => ['HARVEST', 'ANIMAL', 'CATCH'].includes(log.type)).length;
  const operationalHealth = opRecords >= 3 ? 'Excelente (95/100)' : opRecords > 0 ? 'Estavel (75/100)' : 'Inativo (25/100)';
  const verifiedDocs = documentsQueue.filter(d => d.status === 'VERIFIED').length;
  const pendingDocs = documentsQueue.filter(d => d.status === 'PENDING').length;
  const documentalHealthScore = Math.min(100, Math.round((verifiedDocs * 25) + (pendingDocs * 10)));
  const documentalHealth = documentalHealthScore >= 80 ? `Completo (${documentalHealthScore}/100)` : documentalHealthScore >= 40 ? `Regular (${documentalHealthScore}/100)` : `Insuficiente (${documentalHealthScore}/100)`;
  const salesCount = combinedLogs.filter(log => log.type === 'SALE').length;
  const commercialHealth = salesCount >= 3 ? 'Crescente (90/100)' : salesCount > 0 ? 'Regular (60/100)' : 'Critico (15/100)';

  const costAlerts = [];
  if (totalExpense > totalRevenue * 0.8 && totalRevenue > 0) {
    costAlerts.push({ title: 'Custos Operacionais Elevados', description: `As despesas representam ${((totalExpense / totalRevenue) * 100).toFixed(0)}% das receitas.`, severity: 'high', savingEstimate: `${Math.round(totalExpense * 0.15).toLocaleString()} Kz` });
  }
  const hasTransportExpense = operationalLogs.some(log => log.type === 'EXPENSE' && (log.title.toLowerCase().includes('combustivel') || log.title.toLowerCase().includes('transporte') || log.notes?.toLowerCase().includes('transporte') || log.notes?.toLowerCase().includes('combustivel')));
  if (hasTransportExpense) {
    costAlerts.push({ title: 'Desperdicio de Logistica / Combustivel', description: 'Identificado desvio de rota ou consumo de combustivel acima da meta regional.', severity: 'medium', savingEstimate: 'Est. 12% de poupanca' });
  } else {
    costAlerts.push({ title: 'Perdas de Armazenamento Estimadas', description: `Padrao do setor de ${user?.industry || 'Coop'} aponta para perdas pos-colheita/producao estimadas em 6%.`, severity: 'medium', savingEstimate: 'Est. 45.000 Kz' });
  }
  if (operationalLogs.length > 5 && marginPercentage < 15) {
    costAlerts.push({ title: 'Vazamento Financeiro Silencioso', description: 'A margem operacional esta abaixo do limite de seguranca (15%).', severity: 'high', savingEstimate: 'Est. 80.000 Kz' });
  } else {
    costAlerts.push({ title: 'Custos Fixos com Insumos', description: 'Oportunidade de compra conjunta com cooperativas vizinhas para obter descontos de volume.', severity: 'low', savingEstimate: 'Est. 50.000 Kz' });
  }

  const defaultTasks = [
    { id: 't1', text: 'Subir NIF Oficial da Cooperativa', done: documentsQueue.some(d => d.type === 'NIF') },
    { id: 't2', text: 'Registar vendas diarias no livro de caixa', done: totalRevenue > 0 },
    { id: 't3', text: 'Atualizar despesas com insumos/combustivel', done: totalExpense > 0 },
    { id: 't4', text: 'Validar registo operacional de colheita/pesca', done: opRecords > 0 },
  ];

  const getAiRecommendations = () => {
    const recs = [];
    if (user?.industry === 'AGRICULTURE') {
      recs.push({ title: 'Otimizar Adubacao antes das Chuvas', desc: 'Planeie a aplicacao de fertilizantes nitrogenados de forma faseada.', priority: 'Alta' });
      recs.push({ title: 'Diversificacao de Cultura Temporaria', desc: 'Intercale a cultura principal com feijao ou leguminosas.', priority: 'Media' });
    } else if (user?.industry === 'FISHERIES') {
      recs.push({ title: 'Controle de Cadeia de Frio', desc: 'Mantenha a proporcao de gelo de 2:1 para garantir a frescura.', priority: 'Alta' });
      recs.push({ title: 'Manutencao Preventiva de Motores', desc: 'Programe a limpeza de filtros de combustivel a cada 50 horas.', priority: 'Media' });
    } else if (user?.industry === 'LIVESTOCK') {
      recs.push({ title: 'Controle Sanitario do Gado', desc: 'Atualize a folha de vacinacao contra a febre aftosa.', priority: 'Alta' });
      recs.push({ title: 'Rotacao de Pastagens', desc: 'Divida o pasto em piquetes para permitir a recuperacao da forragem.', priority: 'Media' });
    } else {
      recs.push({ title: 'Registo Consecutivo de Caixa', desc: 'Evite acumular faturas de papel por mais de 48 horas.', priority: 'Alta' });
    }
    recs.push({ title: 'Aceleracao de Funding Score', desc: `A sua pontuacao atual e de ${user?.fundingScore} pontos.`, priority: 'Alta' });
    return recs;
  };

  const aiRecommendations = getAiRecommendations();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-gray-50 dark:bg-[#0E0E12] transition-colors duration-200">
      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-all duration-200" />
      )}
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r bg-white dark:bg-[#13131A] border-gray-200 dark:border-[#2A2A35] transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-y-0 shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-150 dark:border-[#2A2A35] flex items-center gap-3">
          <div className="px-3 h-10 rounded-xl bg-brand-iris text-white flex items-center justify-center font-bold text-lg shadow-md shadow-brand-iris/20 shrink-0">OLO</div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm leading-none text-gray-900 dark:text-white truncate">OLO Fintel</h2>
            <p className="text-[9px] font-mono font-bold text-brand-purple mt-1 uppercase tracking-wider truncate">{user.role} &mdash; {user.maturity}</p>
          </div>
        </div>

        <div className="p-4 mx-4 my-4 rounded-2xl bg-gray-50 dark:bg-black/25 border border-gray-150 dark:border-gray-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Modo de Ligacao</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${offlineMode ? 'bg-amber-500 animate-pulse' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 font-mono">{offlineMode ? 'OFFLINE' : 'ONLINE'}</span>
            </div>
          </div>
          <button onClick={handleToggleConnection} disabled={syncingOffline}
            className={`w-full py-2 px-3 rounded-xl text-[10px] font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              offlineMode ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
            }`}>
            {syncingOffline ? <span className="animate-spin w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" /> : offlineMode ? 'Restabelecer Ligacao (Sync)' : 'Simular Modo Offline'}
          </button>
        </div>

        <nav className="flex-1 px-4 py-1 overflow-y-auto space-y-1">
          {['OWNER', 'MANAGER', 'FINANCIAL_OFFICER'].includes(user.role) && (
            <>
              <button onClick={() => { setCoopTab('overview'); setSidebarOpen(false); }} className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${coopTab === 'overview' ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}><Compass size={14} /><span>Painel de Decisao</span></button>
              <button onClick={() => { setCoopTab('operations'); setSidebarOpen(false); }} className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${coopTab === 'operations' ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}><Sprout size={14} /><span>Gestao Operacional</span></button>
              <button onClick={() => { setCoopTab('finance'); setSidebarOpen(false); }} className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${coopTab === 'finance' ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}><Coins size={14} /><span>Financas & Caixa</span></button>
              <button onClick={() => { setCoopTab('crm'); setSidebarOpen(false); }} className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${coopTab === 'crm' ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}><Users size={14} /><span>CRM & Vendas</span></button>
              <button onClick={() => { setCoopTab('documents'); setSidebarOpen(false); }} className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${coopTab === 'documents' ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}><FileText size={14} /><span>Documentos & KYC</span></button>
              <button onClick={() => { setCoopTab('credit'); setSidebarOpen(false); }} className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${coopTab === 'credit' ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}><TrendingUp size={14} /><span>Maturidade & Credito</span></button>
              <button onClick={() => { setCoopTab('ai_center'); setSidebarOpen(false); }} className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${coopTab === 'ai_center' ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}><Sparkles size={14} /><span>Modulo OLO IA</span></button>
              <button onClick={() => { setCoopTab('overheads'); setSidebarOpen(false); }} className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${coopTab === 'overheads' ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}><Briefcase size={14} /><span>Custos de Suporte (ERP)</span></button>
              <button onClick={() => { setCoopTab('ledger'); setSidebarOpen(false); }} className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${coopTab === 'ledger' ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}><ListTodo size={14} /><span>Historico Operacional</span></button>
            </>
          )}
          {user.role === 'SUPER_ADMIN' && (
            <>
              {[
                { id: 'ecosystem', label: 'Ecosystem (Banks)' },
                { id: 'users', label: 'User Management' },
                { id: 'kyc', label: 'KYC Queue' },
                { id: 'survey', label: 'Survey Engine' },
                { id: 'logs', label: 'System Logs' },
                { id: 'consultants', label: 'Delegacao Consultores' }
              ].map(tab => (
                <button key={tab.id} onClick={() => { setSuperAdminTab(tab.id as any); setSidebarOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${superAdminTab === tab.id ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}>
                  <Layers size={16} /><span>{tab.label}</span>
                </button>
              ))}
            </>
          )}
          {user.role === 'ADMIN' && (
            <>
              {[
                { id: 'organizations', label: 'Minhas Organizacoes' },
                { id: 'invites', label: 'Convites de Equipa' },
                { id: 'delegation', label: 'Delegacao de Perfis' }
              ].map(tab => (
                <button key={tab.id} onClick={() => { setAdminTab(tab.id as any); setSidebarOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${adminTab === tab.id ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}>
                  <Layers size={16} /><span>{tab.label}</span>
                </button>
              ))}
            </>
          )}
          {user.role === 'ANALYST' && (
            <>
              {[
                { id: 'applications', label: 'Candidaturas Credito' },
                { id: 'scoring', label: 'Fila de Scores OLO' },
                { id: 'docs', label: 'Revisao Documental' },
                { id: 'workflow', label: 'Fluxo de Aprovacao' }
              ].map(tab => (
                <button key={tab.id} onClick={() => { setAnalystTab(tab.id as any); setSidebarOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${analystTab === tab.id ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}>
                  <Layers size={16} /><span>{tab.label}</span>
                </button>
              ))}
            </>
          )}
          {user.role === 'CONSULTANT' && (
            <>
              {[
                { id: 'clients', label: 'Clientes Tutelados' },
                { id: 'plans', label: 'Planos de Acao' },
                { id: 'ai_recs', label: 'Recomendacoes IA' }
              ].map(tab => (
                <button key={tab.id} onClick={() => { setConsultantTab(tab.id as any); setSidebarOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${consultantTab === tab.id ? 'bg-brand-iris/15 text-brand-iris dark:bg-brand-iris/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}>
                  <Layers size={16} /><span>{tab.label}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        {!pwaInstalled && (
          <div className="p-4 mx-4 mb-4 rounded-2xl bg-brand-purple/5 border border-brand-purple/10 text-center space-y-2 shrink-0">
            <p className="text-[9px] font-black text-brand-purple uppercase tracking-wider">Modo PWA Instalavel</p>
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 leading-normal">Aceda de forma offline e rapida a partir do ecrã inicial.</p>
            <button onClick={() => setShowPwaModal(true)} className="w-full py-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-[10px] font-extrabold transition-all shadow-sm cursor-pointer">Instalar OLO ERP</button>
          </div>
        )}

        <div className={`p-4 border-t border-gray-150 dark:border-gray-800 flex items-center justify-between shrink-0 transition-all ${showProfile ? 'bg-brand-iris/10 dark:bg-brand-iris/5' : ''}`}>
          <div onClick={() => { setShowProfile(true); setSidebarOpen(false); }} className="flex items-center gap-2.5 min-w-0 cursor-pointer group/profile flex-1 mr-2" title="Ver / Editar Meu Perfil">
            <div className="w-8 h-8 rounded-xl bg-brand-purple text-white font-bold text-xs flex items-center justify-center shrink-0 group-hover/profile:scale-105 transition-transform">{user.name.substring(0, 2).toUpperCase()}</div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate leading-none group-hover/profile:text-brand-iris transition-colors">{user.name}</p>
              <p className="text-[9px] text-gray-400 truncate mt-1">Ver Perfil</p>
            </div>
          </div>
          <button onClick={logout} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-500/5 transition-all cursor-pointer" title="Sair"><X size={15} /></button>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white dark:bg-[#1A1A21] border-b border-gray-200 dark:border-[#2A2A35] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden text-gray-500 dark:text-gray-400 cursor-pointer"><Menu size={18} /></button>
            <div>
              <h1 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                {['OWNER', 'MANAGER', 'FINANCIAL_OFFICER'].includes(user.role) ? `${user.organizationName || 'Minha Cooperativa'}` : 'Administracao OLO Fintel'}
              </h1>
              <p className="text-[10px] font-mono font-bold text-brand-purple mt-0.5 uppercase tracking-wider">{user.role} &bull; Nivel: {user.maturity}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {['OWNER', 'MANAGER', 'FINANCIAL_OFFICER'].includes(user.role) && (
              <button onClick={() => { setShowCommandPalette(true); setCommandPaletteQuery(''); setCommandPaletteActiveOption(null); setCommandPaletteFormData({}); setPhotoEvidence(null); setGpsCoords(null); }}
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer hover:text-white ${
                  user.industry === 'AGRICULTURE' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500' :
                  user.industry === 'LIVESTOCK' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500' :
                  user.industry === 'FISHERIES' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500' :
                  user.industry === 'COMMERCE' ? 'bg-brand-purple/10 text-brand-purple border-brand-purple/20 hover:bg-brand-purple' :
                  'bg-brand-iris/10 text-brand-iris border-brand-iris/20 hover:bg-brand-iris'
                }`} title="Abrir Central de Lancamentos Rapidos (Cmd+K)">
                <Command size={13} />
                <span>{user.industry === 'AGRICULTURE' ? 'Acoes Agricolas' : user.industry === 'LIVESTOCK' ? 'Acoes de Pecuaria' : user.industry === 'FISHERIES' ? 'Acoes de Pesca' : user.industry === 'COMMERCE' ? 'Acoes Comerciais' : 'Acoes Rapidas'}</span>
                <kbd className={`hidden md:inline-block px-1 py-0.5 text-[9px] rounded font-mono ${
                  user.industry === 'AGRICULTURE' ? 'bg-green-500/20 text-green-700 dark:text-green-300' :
                  user.industry === 'LIVESTOCK' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' :
                  user.industry === 'FISHERIES' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' :
                  user.industry === 'COMMERCE' ? 'bg-brand-purple/20 text-brand-purple' :
                  'bg-brand-iris/20 text-brand-iris'
                }`}>Cmd+K</kbd>
              </button>
            )}
            <select value={locale} onChange={e => setLocale(e.target.value as any)} className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300">
              <option value="pt" className="dark:bg-[#13131A]">PT (Portugues)</option>
              <option value="en" className="dark:bg-[#13131A]">EN (English)</option>
              <option value="umb" className="dark:bg-[#13131A]">UMB (Umbundu)</option>
              <option value="kmb" className="dark:bg-[#13131A]">KMB (Kimbundu)</option>
            </select>
            <select value={theme} onChange={e => setTheme(e.target.value as any)} className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300">
              <option value="light" className="dark:bg-[#13131A]">Claro</option>
              <option value="dark" className="dark:bg-[#13131A]">Escuro</option>
              <option value="system" className="dark:bg-[#13131A]">Automatico</option>
            </select>
            <button onClick={logout} className="px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 text-xs font-bold transition-all hidden sm:block cursor-pointer">Sair</button>
          </div>
        </header>

        <main className="flex-1 p-6 w-full space-y-6">
          {offlineMode && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-600 dark:text-amber-400 animate-pulse">
              <span className="font-semibold flex items-center gap-2"><AlertTriangle size={15} /> Estas a trabalhar em Modo Offline. Todas as operacoes lancadas serao salvas em cache segura.</span>
              <button onClick={handleToggleConnection} className="px-2.5 py-1 bg-amber-500 text-white rounded font-bold text-[10px]">Ligar & Sincronizar</button>
            </div>
          )}

          {coopTab === 'overview' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ola, {user.name}!</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {['OWNER', 'MANAGER', 'FINANCIAL_OFFICER'].includes(user.role) ? `Bem-vindo ao centro operacional da ${user.organizationName || 'sua Cooperativa'}.` : `Bem-vindo ao Painel de Decisao do Ecossistema OLO Fintel.`}
                </p>
              </div>
              {['OWNER', 'MANAGER', 'FINANCIAL_OFFICER'].includes(user.role) && (
                <div className="flex items-center gap-4 bg-brand-purple/5 p-4 rounded-xl border border-brand-purple/10">
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-gray-200 dark:text-gray-800" strokeWidth="4" fill="transparent" />
                      <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-brand-purple" strokeWidth="4" fill="transparent" strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * user.fundingScore) / 100} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm text-brand-purple">{user.fundingScore}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pontuacao Economica</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">Nivel: {user.maturity}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-brand-iris border-t-transparent animate-spin" />
              <p className="text-sm text-gray-500 font-medium">A carregar dados do ecossistema...</p>
            </div>
          ) : showProfile ? (
            <div className="space-y-6"><ProfilePage onBack={() => setShowProfile(false)} /></div>
          ) : (
            <div className="space-y-6">
              {/* SUPER_ADMIN DASHBOARD */}
              {user.role === 'SUPER_ADMIN' && (
                <AdminTabs
                  superAdminTab={superAdminTab} setSuperAdminTab={setSuperAdminTab}
                  organizations={organizations} setOrganizations={setOrganizations}
                  usersList={usersList} setUsersList={setUsersList}
                  consultants={consultants} documentsQueue={documentsQueue}
                  systemLogs={systemLogs} setSystemLogs={setSystemLogs}
                  partnerBanks={partnerBanks} setPartnerBanks={setPartnerBanks}
                  surveyList={surveyList} activeOrgToAssign={activeOrgToAssign}
                  setActiveOrgToAssign={setActiveOrgToAssign} viewingDoc={viewingDoc}
                  setViewingDoc={setViewingDoc} handleDelegate={handleDelegate}
                  fetchDashboardData={fetchDashboardData}
                />
              )}

              {/* ADMIN DASHBOARD */}
              {user.role === 'ADMIN' && (
                <div className="grid grid-cols-1 gap-6">
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
                  <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-850 pb-2">
                    {[
                      { id: 'organizations', label: 'My Organizations' },
                      { id: 'invites', label: 'Team Invites' },
                      { id: 'delegation', label: 'Role Delegation' }
                    ].map(tab => (
                      <button key={tab.id} onClick={() => setAdminTab(tab.id as any)} className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all border-b-2 ${adminTab === tab.id ? 'bg-brand-purple/10 text-brand-purple border-brand-purple' : 'bg-white dark:bg-[#12121A] text-gray-500 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-300'}`}>{tab.label}</button>
                    ))}
                  </div>
                  {adminTab === 'organizations' && (
                    <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                      <div><h3 className="font-bold text-base text-gray-900 dark:text-white">Gerenciamento de Cooperativas</h3><p className="text-xs text-gray-400 mt-1">Monitore e controle os estados de conformidade das cooperativas.</p></div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {organizations.map(org => {
                          const assignedConsultant = consultants.find(c => c.assignedOrgs.includes(org.id));
                          return (
                            <div key={org.id} className="p-5 bg-gray-50 dark:bg-[#1F1F2A] rounded-xl border border-gray-150 dark:border-[#2E2E3A] hover:border-brand-purple/20 transition-all flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start gap-2 mb-2">
                                  <div><h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{org.name}</h4><p className="text-xs text-gray-400 font-mono mt-0.5 uppercase tracking-wider">{org.sector} &mdash; {org.province}</p></div>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${org.suspended ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>{org.suspended ? 'Suspenso' : 'Activo'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4 p-3 bg-white dark:bg-[#15151F] rounded-lg border border-gray-200 dark:border-[#2A2A35] text-xs">
                                  <div><p className="text-gray-400 text-[10px]">Maturidade OLO:</p><p className="font-bold text-brand-purple mt-0.5">{org.maturity}</p></div>
                                  <div><p className="text-gray-400 text-[10px]">Consultor Tecnico:</p><p className="font-semibold text-gray-700 dark:text-gray-300 mt-0.5 truncate">{assignedConsultant ? assignedConsultant.name : 'Nenhum Alocado'}</p></div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-850 mt-4">
                                <span className="text-xs text-gray-400">Alterar Estado:</span>
                                <button onClick={() => { const nextState = !org.suspended; setOrganizations(prev => prev.map(o => o.id === org.id ? { ...o, suspended: nextState } : o)); alert(`Organizacao ${org.name} foi ${nextState ? 'SUSPENSA' : 'REATIVADA'}.`); const logMsg = `[${new Date().toLocaleTimeString()}] [INFO] Organizacao ${org.name} ${nextState ? 'SUSPENSA' : 'REATIVADA'} por Admin.`; setSystemLogs(prev => [logMsg, ...prev]); }} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${org.suspended ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500/15 text-red-500 hover:bg-red-500/25'}`}>{org.suspended ? 'Reativar Organizacao' : 'Suspender Operacoes'}</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {adminTab === 'invites' && (
                    <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-6">
                      <div><h3 className="font-bold text-base text-gray-900 dark:text-white">Enviar Convites de Colaboracao</h3><p className="text-xs text-gray-400 mt-1">Adicione especialistas ao seu ecossistema.</p></div>
                      <form onSubmit={(e) => { e.preventDefault(); if (!inviteName || !inviteEmail) { alert('Preencha nome e email!'); return; } setAdminInvites(prev => [{ id: `inv-${Date.now()}`, name: inviteName, email: inviteEmail, role: inviteRole, status: 'Pendente', sentAt: new Date().toISOString().split('T')[0] }, ...prev]); setInviteName(''); setInviteEmail(''); alert(`Convite enviado para ${inviteName}!`); }} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-gray-50 dark:bg-[#1A1A21] border border-gray-150 dark:border-gray-800 rounded-xl">
                        <div className="flex flex-col gap-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Nome</label><input type="text" value={inviteName} onChange={e => setInviteName(e.target.value)} className="px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F1F2A] outline-none" /></div>
                        <div className="flex flex-col gap-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Email</label><input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F1F2A] outline-none" /></div>
                        <div className="flex flex-col gap-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Funcao</label><select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F1F2A] outline-none"><option value="MANAGER">MANAGER</option><option value="ANALYST">ANALYST</option><option value="CONSULTANT">CONSULTANT</option><option value="FINANCIAL_OFFICER">FINANCIAL_OFFICER</option><option value="OWNER">OWNER</option></select></div>
                        <div className="flex items-end"><button type="submit" className="w-full h-[38px] px-4 py-2 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold rounded-lg transition-all">Enviar Convite</button></div>
                      </form>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead><tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-semibold text-xs"><th className="pb-3">Convidado</th><th className="pb-3">Email</th><th className="pb-3">Funcao</th><th className="pb-3">Enviado</th><th className="pb-3">Estado</th></tr></thead>
                          <tbody>{adminInvites.map(inv => (<tr key={inv.id} className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/30"><td className="py-3 font-semibold text-gray-900 dark:text-white">{inv.name}</td><td className="py-3 text-gray-500 font-mono text-xs">{inv.email}</td><td className="py-3 text-xs font-semibold text-brand-purple">{inv.role}</td><td className="py-3 font-mono text-xs text-gray-400">{inv.sentAt}</td><td className="py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inv.status === 'Aceite' ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'}`}>{inv.status}</span></td></tr>))}</tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {adminTab === 'delegation' && (
                    <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                      <div><h3 className="font-bold text-base text-gray-900 dark:text-white">Delegar Funcoes e Acessos</h3><p className="text-xs text-gray-400 mt-1">Atribua e gerencie as funcoes dos usuarios.</p></div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead><tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-semibold text-xs"><th className="pb-3">Nome</th><th className="pb-3">Email</th><th className="pb-3">Organizacao</th><th className="pb-3">Delegar Funcao</th></tr></thead>
                          <tbody>{usersList.map(u => { const relatedOrg = organizations.find(o => o.id === u.organizationId); return (<tr key={u.id} className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/30"><td className="py-3 font-semibold text-gray-900 dark:text-white">{u.name}</td><td className="py-3 text-gray-500 font-mono text-xs">{u.email}</td><td className="py-3 text-xs text-gray-400">{relatedOrg?.name || 'Geral (OLO)'}</td><td className="py-3"><select value={u.role} onChange={(e) => { const newRole = e.target.value; setUsersList(prev => prev.map(usr => usr.id === u.id ? { ...usr, role: newRole } : usr)); setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] [INFO] Permissoes de ${u.name} alteradas para ${newRole} por Admin.`, ...prev]); alert(`Funcao de ${u.name} delegada para ${newRole}!`); }} className="text-xs font-semibold px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent outline-none"><option value="ADMIN">ADMIN</option><option value="ANALYST">ANALYST</option><option value="CONSULTANT">CONSULTANT</option><option value="OWNER">OWNER</option><option value="MANAGER">MANAGER</option><option value="FINANCIAL_OFFICER">FINANCIAL_OFFICER</option></select></td></tr>); })}</tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ANALYST DASHBOARD */}
              {user.role === 'ANALYST' && (
                <AnalystTabs
                  analystTab={analystTab} setAnalystTab={setAnalystTab}
                  creditApplications={creditApplications} setCreditApplications={setCreditApplications}
                  organizations={organizations} documentsQueue={documentsQueue}
                  selectedAppWorkflow={selectedAppWorkflow} setSelectedAppWorkflow={setSelectedAppWorkflow}
                  setViewingDoc={setViewingDoc}
                />
              )}

              {/* CONSULTANT DASHBOARD */}
              {user.role === 'CONSULTANT' && (
                <ConsultantTabs
                  consultantTab={consultantTab} setConsultantTab={setConsultantTab}
                  organizations={organizations} activeClient={activeClient}
                  setActiveClient={setActiveClient} aiPrompt={aiPrompt}
                  setAiPrompt={setAiPrompt} aiPlan={aiPlan} setAiPlan={setAiPlan}
                  handleGenerateAIPlan={handleGenerateAIPlan}
                />
              )}

              {/* COOPERATIVE USER TABS */}
              {['OWNER', 'MANAGER', 'FINANCIAL_OFFICER'].includes(user.role) && (
                <>
                  {coopTab === 'overview' && (
                    <OverviewTab
                      user={user} canSwitchSectors={canSwitchSectors}
                      selectedAlertSector={selectedAlertSector} setSelectedAlertSector={setSelectedAlertSector}
                      setCoopTab={setCoopTab} setCommandPaletteActiveOption={setCommandPaletteActiveOption}
                      setShowCommandPalette={setShowCommandPalette} setRefreshCounter={setRefreshCounter}
                      simRevenueIncrease={simRevenueIncrease} setSimRevenueIncrease={setSimRevenueIncrease}
                      simResolvedChecklist={simResolvedChecklist} setSimResolvedChecklist={setSimResolvedChecklist}
                      documentsQueue={documentsQueue} totalRevenue={totalRevenue} totalExpense={totalExpense}
                      netMargin={netMargin} marginPercentage={marginPercentage} liquidityRatio={liquidityRatio}
                      liquidityStatus={liquidityStatus} financialHealth={financialHealth} operationalHealth={operationalHealth}
                      documentalHealth={documentalHealth} documentalHealthScore={documentalHealthScore}
                      commercialHealth={commercialHealth} costAlerts={costAlerts} defaultTasks={defaultTasks}
                      checkedTasks={checkedTasks} toggleTask={toggleTask} aiRecommendations={aiRecommendations}
                      operationalLogs={operationalLogs} setLogType={setLogType} setShowLogModal={setShowLogModal}
                      setDocType={setDocType} setShowDocModal={setShowDocModal}
                    />
                  )}
                  {coopTab === 'operations' && (
                    <OperationsPage
                      key={`ops-${user?.id || 'guest'}-${refreshCounter}`}
                      userId={user?.id || 'guest'} userRole={user?.role || 'OWNER'}
                      userIndustry={user?.industry || null}
                    />
                  )}
                  {coopTab === 'finance' && (
                    <FinancePage
                      key={`fin-${user?.id || 'guest'}`}
                      userId={user?.id || 'guest'} userRole={user?.role || 'OWNER'}
                      organizationId={user?.organizationId || null} onRefresh={fetchDashboardData}
                    />
                  )}
                  {coopTab === 'crm' && (
                    <CrmPage
                      key={`crm-${user?.id || 'guest'}`}
                      userId={user?.id || 'guest'} userRole={user?.role || 'OWNER'}
                    />
                  )}
                  {coopTab === 'documents' && (
                    <DocumentsPage
                      key={`doc-${user?.id || 'guest'}`}
                      userId={user?.id || 'guest'} userRole={user?.role || 'OWNER'}
                      organizationId={user?.organizationId || null} onRefresh={fetchDashboardData}
                    />
                  )}
                  {coopTab === 'credit' && (
                    <FundingPage
                      key={`funding-${user?.id || 'guest'}`}
                      userId={user?.id || 'guest'} userRole={user?.role || 'OWNER'}
                      organizationId={user?.organizationId || null} onRefresh={fetchDashboardData}
                    />
                  )}
                  {coopTab === 'ai_center' && (
                    <AiCenterPage
                      key={`ai-center-${user?.id || 'guest'}`}
                      userId={user?.id || 'guest'} userRole={user?.role || 'OWNER'}
                      organizationId={user?.organizationId || null}
                    />
                  )}
                  {coopTab === 'overheads' && (
                    <SupportCostsPage
                      key={`overheads-${user?.id || 'guest'}`}
                      userId={user?.id || 'guest'} userRole={user?.role || 'OWNER'}
                      userIndustry={user?.industry || null}
                    />
                  )}
                  {coopTab === 'ledger' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-12 p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Activity className="text-brand-iris" size={18} /> Registo Geral de Atividades</h3>
                        {combinedLogs.length === 0 ? (
                          <div className="text-center py-12 text-gray-400"><ListTodo size={40} className="mx-auto mb-3 opacity-40 text-brand-iris" /><p className="text-sm font-semibold">Sem registos operacionais inseridos.</p></div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                              <thead><tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-semibold text-xs"><th className="pb-3">Data</th><th className="pb-3">Atividade</th><th className="pb-3">Tipo</th><th className="pb-3 text-right">Valor / Quantidade</th></tr></thead>
                              <tbody>{combinedLogs.map(log => (
                                <tr key={log.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50">
                                  <td className="py-3 text-xs text-gray-400 font-mono">{log.date}</td>
                                  <td className="py-3 font-semibold text-gray-900 dark:text-white">{log.title}{log.notes && <p className="text-[10px] text-gray-400 font-normal mt-0.5">{log.notes}</p>}</td>
                                  <td className="py-3"><span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${log.type === 'SALE' ? 'bg-green-100 dark:bg-green-950 text-green-700' : log.type === 'EXPENSE' ? 'bg-red-100 dark:bg-red-950 text-red-700' : 'bg-blue-100 dark:bg-blue-950 text-blue-700'}`}>{log.type}</span></td>
                                  <td className="py-3 text-right font-bold">{log.amount ? `${log.amount.toLocaleString()} Kz` : `${log.quantity} ${log.unit || ''}`}</td>
                                </tr>
                              ))}</tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* DOCUMENT PREVIEW LIGHTBOX */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#1A1A21] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-gray-200 dark:border-gray-800">
            <button onClick={() => setViewingDoc(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"><X size={20} /></button>
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Analise de Documentacao</h3>
              <p className="text-xs text-gray-400 mb-6">{viewingDoc.name}</p>
              <div className="h-44 bg-gray-100 dark:bg-black/30 rounded-xl flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 text-gray-400 mb-6">
                <FileText size={48} className="text-brand-iris mb-2" />
                <span className="text-xs font-semibold text-gray-900 dark:text-white">FICHEIRO PDF SIMULADO</span>
                <span className="text-[10px] text-gray-400 font-mono mt-1">NIF Oficial verificado na AGT</span>
              </div>
              <div className="flex gap-4">
                <button onClick={() => handleDocAction(viewingDoc.id, 'VERIFIED')} className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-all shadow">Aprovar / Validar</button>
                <button onClick={() => handleDocAction(viewingDoc.id, 'REJECTED', 'Assinatura invalida ou ilegivel')} className="flex-1 py-3 bg-red-500/15 hover:bg-red-500/25 text-red-500 font-bold text-sm rounded-xl transition-all">Rejeitar Documento</button>
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
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Inserir Atividade Diaria</h3>
              <button onClick={() => setShowLogModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddLog} className="p-6 space-y-4">
              {user?.industry && (
                <div className="flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl bg-brand-iris/10 text-brand-iris border border-brand-iris/20">
                  <span className="font-semibold">Sector Auto-detetado:</span>
                  <span className="font-bold">{user.industry === 'AGRICULTURE' && 'Agricultura'}{user.industry === 'LIVESTOCK' && 'Pecuaria'}{user.industry === 'FISHERIES' && 'Pesca'}{user.industry === 'COMMERCE' && 'Comercio Geral'}{user.industry === 'TRANSPORT' && 'Transporte'}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Tipo</label><select value={logType} onChange={e => setLogType(e.target.value as any)} className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm"><option value="SALE">Venda de Producao</option><option value="EXPENSE">Despesa de Insumos</option><option value="HARVEST">Colheita (Agricultura)</option><option value="ANIMAL">Controle de Gado (Pecuaria)</option><option value="CATCH">Viagem de Captura (Pescas)</option></select></div>
                <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Data</label><input type="date" value={logForm.date} onChange={e => setLogForm({ ...logForm, date: e.target.value })} className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm" required /></div>
              </div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Titulo da Atividade</label><input type="text" value={logForm.title} onChange={e => setLogForm({ ...logForm, title: e.target.value })} placeholder="ex: Colheita do Bloco A" className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Quantidade / Volume</label><input type="number" value={logForm.quantity} onChange={e => setLogForm({ ...logForm, quantity: e.target.value })} placeholder="ex: 1500" className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm" /></div>
                <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Unidade</label><select value={logForm.unit} onChange={e => setLogForm({ ...logForm, unit: e.target.value })} className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm"><option value="kg">Quilogramas (kg)</option><option value="sacos">Sacos</option><option value="cabecas">Cabecas (Gado)</option><option value="caixas">Caixas</option><option value="litros">Litros</option></select></div>
              </div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Montante Financeiro (Kz)</label><input type="number" value={logForm.amount} onChange={e => setLogForm({ ...logForm, amount: e.target.value })} placeholder="ex: 450000" className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm" /></div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Notas Adicionais</label><textarea value={logForm.notes} onChange={e => setLogForm({ ...logForm, notes: e.target.value })} placeholder="Anotacoes para a consultoria..." className="w-full h-20 p-3 rounded-xl border bg-transparent text-sm" /></div>
              <button type="submit" className="w-full py-3 bg-brand-iris hover:bg-brand-iris-hover text-white rounded-xl font-bold transition-all shadow-md mt-4">Guardar Atividade</button>
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
              <button onClick={() => setShowDocModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleUploadDoc} className="p-6 space-y-4">
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Tipo de Documento</label><select value={docType} onChange={e => setDocType(e.target.value as any)} className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm"><option value="NIF">NIF Oficial da Cooperativa</option><option value="ID_CARD">B.I. ou Passaporte</option><option value="BANK_STATEMENT">Extratos Bancarios</option><option value="LICENSE">Alvara Comercial ou Licenca</option></select></div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Nome Simulado do Ficheiro</label><input type="text" value={docFileName} onChange={e => setDocFileName(e.target.value)} placeholder="ex: NIF_Cooperativa.pdf" className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm" required /></div>
              <div className="p-4 bg-brand-iris/5 rounded-xl text-[11px] text-gray-500 border border-brand-iris/10">O arquivo sera processado de forma segura e enviado para a Fila de Validacao dos Analistas.</div>
              <button type="submit" className="w-full py-3 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl font-bold transition-all shadow-md">Submeter Documento</button>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL COMMAND PALETTE */}
      <CommandPalette
        show={showCommandPalette}
        onClose={() => { setShowCommandPalette(false); setCommandPaletteActiveOption(null); }}
        user={user}
        offlineMode={offlineMode}
        commandPaletteActiveOption={commandPaletteActiveOption}
        setCommandPaletteActiveOption={setCommandPaletteActiveOption}
        commandPaletteQuery={commandPaletteQuery}
        setCommandPaletteQuery={setCommandPaletteQuery}
        commandPaletteFormData={commandPaletteFormData}
        setCommandPaletteFormData={setCommandPaletteFormData}
        photoEvidence={photoEvidence}
        setPhotoEvidence={setPhotoEvidence}
        gpsCoords={gpsCoords}
        setGpsCoords={setGpsCoords}
        onSubmit={handleCommandPaletteSubmit}
        canSwitchSectors={canSwitchSectors}
      />
    </div>
  );
}
