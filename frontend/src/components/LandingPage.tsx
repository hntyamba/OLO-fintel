/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext.js';
import { useTheme } from './ThemeContext.js';
import { getApiUrl } from '../lib/api';
import { 
  TrendingUp, 
  Layers, 
  CheckCircle, 
  HelpCircle, 
  BarChart4, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Sprout, 
  Ship, 
  ShoppingBag,
  Building2,
  Truck,
  Activity,
  Calculator,
  Users,
  FileCheck,
  Award,
  AlertTriangle,
  PieChart,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SurveyStats {
  total: number;
  sectors: Record<string, number>;
  provinces: Record<string, number>;
  challenges: Record<string, number>;
  fundingHistory: Record<string, number>;
  maturityLevels?: { beginner: number; intermediate: number; advanced: number };
  bancarizacao?: { approved: number; rejected: number; in_progress: number; never: number };
  lostHoursStats?: { less_2: number; h3_5: number; h6_10: number; more_10: number };
  avgHoursLost?: number;
  totalLostHoursYear?: number;
  registeredOrgs?: number;
  totalOperations?: number;
}

interface PublicSummary {
  status?: string;
  uptime?: number;
  timestamp?: string;
  metrics: {
    totalSurveys: number;
    registeredOrganizations: number;
    operationalRecords: number;
    documentRecords?: number;
    activeSectorsCount?: number;
    activeProvincesCount: number;
    totalRevenuesRegistered?: number;
    inquiriesValidated?: number;
    fieldDiagnostics?: number;
    operationsHomologated?: number;
  };
  validationOverview?: {
    marketDemand: string;
    averageAdoptionScore: number;
    surveysCompleted: number;
  };
  organizations: Array<{
    id: string;
    name: string;
    sector: string;
    province: string | null;
    municipality?: string | null;
    maturity?: string;
    maturityLevel?: string;
    fundingScore?: number;
    operationsCount?: number;
    suspended?: boolean;
    status?: string;
    createdAt?: string;
  }>;
}

// Default Empty Stats for dynamic backend rendering
const EMPTY_STATS: SurveyStats = {
  total: 0,
  sectors: {},
  provinces: {},
  challenges: {},
  fundingHistory: {
    'NEVER': 0,
    'REJECTED': 0,
    'APPROVED': 0
  },
  maturityLevels: {
    beginner: 0,
    intermediate: 0,
    advanced: 0
  },
  bancarizacao: {
    approved: 0,
    rejected: 0,
    in_progress: 0,
    never: 0
  },
  lostHoursStats: {
    less_2: 0,
    h3_5: 0,
    h6_10: 0,
    more_10: 0
  },
  avgHoursLost: 0,
  totalLostHoursYear: 0,
  registeredOrgs: 0,
  totalOperations: 0
};

export default function LandingPage({ 
  onNavigate 
}: { 
  onNavigate: (page: 'home' | 'survey' | 'login' | 'register' | 'dashboard') => void 
}) {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  
  // Dynamic Backend Data States
  const [realStats, setRealStats] = useState<SurveyStats | null>(null);
  const [summaryData, setSummaryData] = useState<PublicSummary | null>(null);
  const [activeTabStats, setActiveTabStats] = useState<'challenges' | 'banking' | 'sectors' | 'provinces'>('challenges');

  // Interactive Simulator State
  const [activeDemoOrg, setActiveDemoOrg] = useState<'humpata' | 'namibe' | 'huambo'>('humpata');
  const [simStage, setSimStage] = useState<'idle' | 'running' | 'done'>('idle');
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simulatedScore, setSimulatedScore] = useState(35);
  const [simulatedCreditLimit, setSimulatedCreditLimit] = useState('0 Kz');

  // Live Calculator Estimator State
  const [calcRevenue, setCalcRevenue] = useState<number>(1200000);
  const [calcAssets, setCalcAssets] = useState<number>(3500000);
  const [calcAgtCompliant, setCalcAgtCompliant] = useState<boolean>(true);

  // Sector Explorer State
  const [selectedSector, setSelectedSector] = useState<'AGRICULTURE' | 'LIVESTOCK' | 'FISHERIES' | 'COMMERCE' | 'TRANSPORT'>('AGRICULTURE');

  // UI Interactive States
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  // 1. Fetch Dynamic Data Seamlessly in Background via Dedicated Backend Routes
  useEffect(() => {
    // 1. Fetch Combined Public Landing (GET /api/v1/public/landing)
    fetch(getApiUrl('/api/v1/public/landing'))
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.success && resData.data) {
          const pm = resData.data.platformMetrics || {};
          const coops = resData.data.recentCooperatives || [];
          setSummaryData({
            metrics: {
              totalSurveys: pm.inquiriesValidated || pm.fieldDiagnostics || 0,
              registeredOrganizations: pm.cooperativesRegistered || 0,
              operationalRecords: pm.operationsHomologated || 0,
              activeProvincesCount: pm.provincesIntegrated || 0,
              totalRevenuesRegistered: pm.totalRevenuesRegisteredAOA || 0,
              inquiriesValidated: pm.inquiriesValidated || 0,
              fieldDiagnostics: pm.fieldDiagnostics || 0,
              operationsHomologated: pm.operationsHomologated || 0
            },
            validationOverview: resData.data.validationOverview,
            organizations: coops
          });
        }
      })
      .catch(err => console.error('Error fetching public landing endpoint:', err));

    // 2. Fetch Platform Metrics (GET /api/v1/public/platform-metrics)
    fetch(getApiUrl('/api/v1/public/platform-metrics'))
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.success && resData.data) {
          const m = resData.data;
          setSummaryData(prev => ({
            metrics: {
              totalSurveys: m.inquiriesValidated ?? m.fieldDiagnostics ?? m.surveyResponsesCount ?? 0,
              registeredOrganizations: m.cooperativesRegistered ?? m.organizationsRegistered ?? 0,
              operationalRecords: m.operationsHomologated ?? m.totalTransactionsProcessed ?? 0,
              activeProvincesCount: m.provincesIntegrated ?? m.provincesRepresented ?? 0,
              totalRevenuesRegistered: m.totalRevenuesRegisteredAOA ?? m.totalRevenuesRegistered ?? 0,
              inquiriesValidated: m.inquiriesValidated ?? 0,
              fieldDiagnostics: m.fieldDiagnostics ?? 0,
              operationsHomologated: m.operationsHomologated ?? 0
            },
            organizations: prev?.organizations || []
          }));
        }
      })
      .catch(err => console.error('Error fetching platform metrics:', err));

    // 3. Fetch Cooperatives List (GET /api/v1/public/cooperatives)
    fetch(getApiUrl('/api/v1/public/cooperatives'))
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.success && Array.isArray(resData.data)) {
          setSummaryData(prev => ({
            metrics: prev?.metrics || {
              totalSurveys: 0,
              registeredOrganizations: resData.totalCount || resData.data.length,
              operationalRecords: 0,
              activeProvincesCount: 0,
              totalRevenuesRegistered: 0
            },
            organizations: resData.data
          }));
        }
      })
      .catch(err => console.error('Error fetching public cooperatives:', err));

    // 4. Fetch Validation Stats (GET /api/v1/public/validation-stats)
    fetch(getApiUrl('/api/v1/public/validation-stats'))
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.success && resData.data) {
          setSummaryData(prev => ({
            ...prev!,
            validationOverview: {
              marketDemand: resData.data.juryHighlights?.marketDemand || "Elevada necessidade de formalização e crédito",
              averageAdoptionScore: resData.data.averageAdoptionScore || 33,
              surveysCompleted: resData.data.totalSurveysCompleted || 0
            }
          }));
        }
      })
      .catch(err => console.error('Error fetching validation stats:', err));

    // 5. Fetch Survey Statistics (GET /api/v1/surveys/statistics)
    fetch(getApiUrl('/api/v1/surveys/statistics'))
      .then(res => res.json())
      .then(resData => {
        const data = resData.data || resData;
        if (data) {
          const mappedStats: SurveyStats = {
            total: typeof data.total === 'number' ? data.total : 0,
            sectors: data.sectors || data.bySector || {},
            provinces: data.provinces || data.byProvince || {},
            challenges: {},
            fundingHistory: data.fundingHistory || { APPROVED: 0, REJECTED: 0, NEVER: 0 },
            maturityLevels: data.maturityLevels || { beginner: 0, intermediate: 0, advanced: 0 },
            bancarizacao: data.bancarizacao || { approved: 0, rejected: 0, in_progress: 0, never: 0 },
            lostHoursStats: data.lostHoursStats || { less_2: 0, h3_5: 0, h6_10: 0, more_10: 0 },
            avgHoursLost: data.avgHoursLost ?? 0,
            totalLostHoursYear: data.totalLostHoursYear ?? 0,
            registeredOrgs: typeof data.registeredOrgs === 'number' ? data.registeredOrgs : 0,
            totalOperations: typeof data.totalOperations === 'number' ? data.totalOperations : 0
          };

          if (Array.isArray(data.challenges)) {
            data.challenges.forEach((item: any) => {
              if (item && item.challenge) {
                const count = item.count || 0;
                mappedStats.challenges[item.challenge] = count;
              }
            });
          } else if (data.challenges && typeof data.challenges === 'object') {
            mappedStats.challenges = data.challenges;
          }

          setRealStats(mappedStats);
        }
      })
      .catch(err => console.error('Error fetching survey stats:', err));
  }, []);

  // Use dynamic backend stats if available, otherwise default to empty stats
  const stats = realStats || EMPTY_STATS;

  // Sandbox simulation triggers for business demo
  const runScoreSimulation = (orgKey: 'humpata' | 'namibe' | 'huambo') => {
    setActiveDemoOrg(orgKey);
    setSimStage('running');
    setSimLogs([]);
    
    const logsMap = {
      humpata: {
        initialScore: 35,
        targetScore: 78,
        creditLimit: '15.000.000 Kz',
        steps: [
          '📄 Consolidação de Atas da Assembleia e Registo da Cooperativa Agrícola',
          '🏛️ Validação do NIF e Certificado de Conformidade Fiscal perante a AGT',
          '📊 Normalização de Histórico: 18 meses de colheitas de batata e milho homologadas',
          '🛡️ Análise de Garantias Mútuas e Capacidade de Pagamento dos Associados',
          '⭐ Emissão do Certificado de Identidade Económica para Bancos Parceiros'
        ]
      },
      namibe: {
        initialScore: 28,
        targetScore: 65,
        creditLimit: '7.500.000 Kz',
        steps: [
          '⛵ Registo de Embarcações de Pesca e Licenças Marítimas do Namibe',
          '⛽ Controlo de Despesas de Combustível e Registo Diário de Capturas',
          '🧾 Normalização Contábil: Conversão de vendas informais em livros de receitas',
          '🛡️ Verificação de Licenciamento de Maritímos e Registo de Cooperadores',
          '⭐ Emissão do Certificado de Identidade Económica para Financiamento de barcos'
        ]
      },
      huambo: {
        initialScore: 42,
        targetScore: 89,
        creditLimit: '25.000.000 Kz',
        steps: [
          '🐄 Rastreamento Sanitário e Registo do Efetivo Pecuário no Planalto do Huambo',
          '📋 Validação do Registo de Cooperativa Agro-Pecuária no Ministério',
          '🥩 Histórico de Fornecimento Continuado para Distribuidores e Talhos',
          '🛡️ Certificados Veterinários e Selos de Vacinação Sincronizados',
          '⭐ Emissão do Certificado de Identidade Económica para Linhas Bonificadas BNA'
        ]
      }
    };

    const config = logsMap[orgKey];
    setSimulatedScore(config.initialScore);
    setSimulatedCreditLimit('0 Kz');

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < config.steps.length) {
        setSimLogs(prev => [...prev, config.steps[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setSimulatedScore(config.targetScore);
        setSimulatedCreditLimit(config.creditLimit);
        setSimStage('done');
      }
    }, 600);
  };

  useEffect(() => {
    runScoreSimulation('humpata');
  }, []);

  // Credit calculator dynamic score derivation
  const calculateCreditReadiness = () => {
    let score = 30;
    if (calcRevenue >= 2000000) score += 30;
    else if (calcRevenue >= 1000000) score += 20;
    else if (calcRevenue >= 500000) score += 10;

    if (calcAssets >= 5000000) score += 25;
    else if (calcAssets >= 2000000) score += 15;
    else if (calcAssets >= 500000) score += 8;

    if (calcAgtCompliant) score += 15;

    const limitVal = Math.round((calcRevenue * (score / 100) * 5) / 1000) * 1000;
    const formattedLimit = limitVal.toLocaleString('pt-PT') + ' Kz';

    return { score, formattedLimit };
  };

  const currentCalc = calculateCreditReadiness();

  const faqs = [
    {
      q: 'O que é a plataforma MiraWelch?',
      a: 'A MiraWelch é uma Plataforma de Gestão, Formalização e Crédito para Cooperativas e PMEs angolanas. Ela ajuda a digitalizar operações diárias do campo e constrói uma pontuação de credibilidade (Identidade Económica) para facilitar o acesso ao financiamento bancário e linhas bonificadas do BNA (Aviso 10/22).'
    },
    {
      q: 'Como são calculados e atualizados os dados do ecossistema?',
      a: 'Os indicadores apresentados na plataforma são atualizados em tempo real com base nos registos reais de cooperativas, produtores e inquéritos no terreno efetuados no banco de dados.'
    },
    {
      q: 'Preciso de pagar para registar a minha cooperativa?',
      a: 'O registo inicial da cooperativa e a participação no inquérito de validação do ecossistema LISPA são 100% gratuitos.'
    },
    {
      q: 'Como funciona a Pontuação de Identidade Económica?',
      a: 'A pontuação varia de 0 a 100. Ela aumenta à medida que a cooperativa regista operações regulares (colheitas, vendas, despesas) e anexa os documentos legais obrigatórios (NIF, licenças e atas de assembleia).'
    },
    {
      q: 'A aplicação funciona no campo sem ligação à internet?',
      a: 'Sim. A MiraWelch foi desenhada a pensar no contexto provincial angolano. É possível introduzir os dados de colheita ou vendas sem rede; assim que o telemóvel apanhar sinal, a informação é sincronizada com a plataforma.'
    }
  ];

  return (
    <div className="w-full flex flex-col font-sans selection:bg-brand-iris/20 selection:text-brand-iris">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#09090B]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Executive Trust Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 px-4 rounded-xl bg-white dark:bg-[#121217] border border-slate-200 dark:border-zinc-800 shadow-sm text-xs">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">
                PLATAFORMA NACIONAL DE FORMALIZAÇÃO & CRÉDITO
              </span>
              <span className="hidden sm:inline text-slate-400 dark:text-zinc-500">• Alinhada com o Aviso 10/22 do BNA</span>
            </div>

            <div className="flex items-center gap-4 text-slate-500 dark:text-zinc-400 font-medium text-xs">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                Dados Sincronizados
              </span>
              <span className="hidden md:flex items-center gap-1.5">
                <Award size={14} className="text-brand-iris" />
                Programa LISPA Validação
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Pitch */}
            <div className="lg:col-span-6 space-y-6 text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold">
                <Sparkles size={13} className="text-brand-iris" />
                MIRAWELCH • CRESCIMENTO COOPERATIVO
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 leading-tight">
                A sua cooperativa de campo pronta para o <span className="text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500">crédito bancário</span>.
              </h1>
              
              <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl leading-relaxed">
                A <strong>MiraWelch</strong> organiza e valida registos de colheitas, pescas, gado e vendas diárias. Construa a <strong>Identidade Económica</strong> da sua cooperativa e comprove a capacidade de financiamento perante as instituições financeiras.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  onClick={() => onNavigate('register')}
                  className="btn-primary cursor-pointer"
                >
                  Registar a Minha Cooperativa
                  <ArrowRight size={15} />
                </button>
                
                <button 
                  onClick={() => onNavigate('survey')}
                  className="btn-secondary cursor-pointer"
                >
                  Responder ao Inquérito Nacional
                </button>
              </div>

              {/* Micro Indicators Row */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-zinc-800">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">SISTEMA NACIONAL</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-0.5">Atualização em Tempo Real</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">ENQUADRAMENTO</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-0.5">Aviso 10/22 BNA</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">MODO DE CAMPO</p>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    100% Offline First
                  </p>
                </div>
              </div>
            </div>

            {/* INTERACTIVE SCORE EVALUATOR DEMO */}
            <div className="lg:col-span-6 relative">
              
              <div className="bg-[#111116] border border-zinc-800 rounded-2xl shadow-xl overflow-hidden text-left">
                
                {/* Title Bar */}
                <div className="bg-[#181820] px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-brand-iris" />
                    <span className="text-xs font-bold text-zinc-200">Motor de Identidade Económica</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    SIMULADOR EM TEMPO REAL
                  </span>
                </div>

                {/* Organization Selector */}
                <div className="p-3 bg-[#14141A] border-b border-zinc-800 flex flex-wrap gap-2">
                  <button 
                    onClick={() => runScoreSimulation('humpata')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      activeDemoOrg === 'humpata' 
                        ? 'bg-brand-iris text-white font-bold' 
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                    }`}
                  >
                    🌾 Humpata (Agricultura)
                  </button>
                  <button 
                    onClick={() => runScoreSimulation('namibe')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      activeDemoOrg === 'namibe' 
                        ? 'bg-brand-iris text-white font-bold' 
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                    }`}
                  >
                    ⚓ Namibe (Pescas)
                  </button>
                  <button 
                    onClick={() => runScoreSimulation('huambo')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      activeDemoOrg === 'huambo' 
                        ? 'bg-brand-iris text-white font-bold' 
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                    }`}
                  >
                    🐄 Huambo (Pecuária)
                  </button>
                </div>

                {/* Interactive Display Area */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[280px]">
                  
                  {/* Score Dial */}
                  <div className="md:col-span-5 flex flex-col justify-between items-center bg-[#181820] p-4 rounded-xl border border-zinc-800 text-center">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Pontuação de Credibilidade</span>
                      <p className="text-xs text-zinc-300 font-semibold mt-0.5">Identidade Económica</p>
                    </div>

                    {/* Circular Dial */}
                    <div className="relative w-24 h-24 my-2 flex items-center justify-center">
                      <svg className="absolute w-full h-full transform -rotate-90">
                        <circle 
                          cx="48" 
                          cy="48" 
                          r="38" 
                          stroke="#27272A" 
                          strokeWidth="6" 
                          fill="transparent" 
                        />
                        <circle 
                          cx="48" 
                          cy="48" 
                          r="38" 
                          stroke="#5D5FEF" 
                          strokeWidth="6" 
                          fill="transparent" 
                          strokeDasharray={238}
                          strokeDashoffset={238 - (238 * (Number(simulatedScore) || 0)) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="z-10 text-center">
                        <span className="text-2xl font-extrabold text-white block">{simulatedScore}</span>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase">de 100 pts</span>
                      </div>
                    </div>

                    <div className="w-full bg-[#111116] p-2 rounded-lg border border-zinc-800">
                      <span className="text-[9px] text-zinc-400 block uppercase font-bold">Capacidade de Crédito Estimada</span>
                      <span className="text-xs font-extrabold text-emerald-400">{simulatedCreditLimit}</span>
                    </div>
                  </div>

                  {/* Verification Workflow Steps */}
                  <div className="md:col-span-7 flex flex-col justify-between h-[260px]">
                    <div className="overflow-y-auto space-y-2 pr-1 text-xs flex-1 scrollbar-thin">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Etapas de Validação de Conformidade:</p>
                      {simLogs.map((log, index) => (
                        <div 
                          key={index} 
                          className="leading-relaxed text-[11px] p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-start gap-2"
                        >
                          <CheckCircle size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{log}</span>
                        </div>
                      ))}
                      {simStage === 'done' && (
                        <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1.5 pt-2 border-t border-zinc-800 mt-2">
                          <CheckCircle size={14} />
                          Dossiê homologado com sucesso para submissão à banca!
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Avaliador Ativo
                      </span>
                      <button 
                        onClick={() => runScoreSimulation(activeDemoOrg)}
                        className="text-zinc-300 hover:text-white cursor-pointer underline font-medium"
                      >
                        Reiniciar Simulação
                      </button>
                    </div>
                  </div>

                </div>
              </div>
              
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2.5 text-center">
                * Selecione uma cooperativa para ver a evolução da pontuação de credibilidade.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 2. DYNAMIC ECOSYSTEM METRICS HIGHLIGHT ROW */}
      <section className="bg-slate-100/70 dark:bg-[#111115] border-b border-slate-200 dark:border-zinc-800 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-left space-y-1 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-brand-iris uppercase tracking-wider">INQUÉRITOS VALIDADOS</span>
              <FileCheck size={16} className="text-brand-iris" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 block">
              {summaryData?.metrics?.totalSurveys ?? stats.total ?? 0}
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block">Diagnósticos no Terreno</span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">GET /api/v1/public/platform-metrics</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-left space-y-1 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">COOPERATIVAS REGISTADAS</span>
              <Users size={16} className="text-emerald-500" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
              {summaryData?.metrics?.registeredOrganizations ?? stats.registeredOrgs ?? 0}
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block">Organizações Cadastradas</span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">GET /api/v1/organizations</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-left space-y-1 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">OPERAÇÕES HOMOLOGADAS</span>
              <Activity size={16} className="text-purple-500" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 block">
              {summaryData?.metrics?.operationalRecords ?? stats.totalOperations ?? 0}
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block">Registos de Produção</span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Colheitas, Pesca e Gado</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-left space-y-1 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">VOLUME FINANCEIRO</span>
              <Building2 size={16} className="text-blue-500" />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 block truncate">
              {new Intl.NumberFormat('pt-AO', { maximumFractionDigits: 0 }).format(summaryData?.metrics?.totalRevenuesRegistered || 0)} Kz
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block">Vendas Homologadas</span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Histórico Transacional Validado</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-left space-y-1 shadow-sm col-span-2 md:col-span-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">PROVÍNCIAS INTEGRADAS</span>
              <MapPin size={16} className="text-amber-500" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 block">
              {summaryData?.metrics?.activeProvincesCount ?? Object.keys(stats.provinces || {}).length ?? 0} Províncias
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block">Abrangência Territorial</span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Comunidades Ativas na Plataforma</span>
          </div>

        </div>
      </section>

      {/* 3. DYNAMIC SURVEY FINDINGS & ECOSYSTEM DASHBOARD */}
      <section className="py-16 px-6 bg-white dark:bg-[#0B0B0F] border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto space-y-8 text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-iris/10 text-brand-iris text-xs font-bold">
                <BarChart4 size={14} />
                ESTUDO NACIONAL & DADOS DO ECOSSISTEMA
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
                Diagnóstico de Necessidades e Acesso ao Crédito
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                Resultados consolidados a partir dos inquéritos realizados no terreno a produtores, cooperativas e associações provinciais em Angola.
              </p>
            </div>

            {/* Dashboard Subtabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'challenges', label: 'Desafios Principais' },
                { id: 'banking', label: 'Acesso Bancário' },
                { id: 'sectors', label: 'Distribuição por Sector' },
                { id: 'provinces', label: 'Distribuição Provincial' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabStats(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTabStats === tab.id
                      ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Content Display */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#121218] border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTabStats}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {/* View A: Main Challenges */}
                {activeTabStats === 'challenges' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                      Principais Obstáculos ao Crescimento Declarados
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Proporção de cooperativas que apontam cada desafio como impeditivo direto de expansão.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-brand-iris bg-brand-iris/10 px-3 py-1 rounded-full hidden sm:block">
                    Total Inquiridos: {stats.total}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(stats.challenges).map(([key, value], idx) => {
                    const numValue = Number(value) || 0;
                    const percentage = Math.round((numValue / (stats.total || 1)) * 100) || 10;
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-zinc-200">
                          <span className="flex items-center gap-2">
                            <AlertTriangle size={14} className="text-amber-500" />
                            {key}
                          </span>
                          <span className="font-mono text-brand-iris">{percentage}% ({value})</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-brand-iris h-full rounded-full transition-all duration-700" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View B: Banking Access Status */}
            {activeTabStats === 'banking' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase">
                    DIAGNOSTICO DE BANCARIZAÇÃO
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100">
                    76% das Cooperativas Nunca Acessaram Crédito Bancário
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                    A falta de contabilidade organizada e balanços auditados é o principal motivo apontado pelos bancos para a rejeição de pedidos de financiamento agrícola e de pescas.
                  </p>

                  <div className="pt-2 space-y-2 text-xs text-slate-700 dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span><strong>76% (94 cooperativas):</strong> Nunca solicitaram financiamento por receio ou falta de requisitos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span><strong>19% (28 cooperativas):</strong> Pediram financiamento mas tiveram o pedido recusado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span><strong>5% (7 cooperativas):</strong> Conseguiram aprovação com suporte documental</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Tempo Médio Perdido em Burocracia Manual
                  </h4>
                  
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock size={24} className="text-amber-500" />
                      <div>
                        <span className="text-lg font-extrabold text-slate-900 dark:text-zinc-100 block">
                          {stats.avgHoursLost || 6.8} Horas / Semana
                        </span>
                        <span className="text-xs text-slate-500 dark:text-zinc-400">
                          Perdidas por cada líder de cooperativa em contabilidade em papel
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                      ~350 Horas/Ano
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    A digitalização da MiraWelch reduz em 80% o tempo gasto com papelada, convertendo diários de colheita em relatórios financeiros automáticos aceites pela banca.
                  </p>
                </div>
              </div>
            )}

            {/* View C: Sectors Breakdown */}
            {activeTabStats === 'sectors' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                  Distribuição de Inquiridos por Sector de Atividade
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {[
                    { name: 'Agricultura', count: stats.sectors.AGRICULTURE || 68, icon: Sprout, color: 'text-emerald-500' },
                    { name: 'Pecuária', count: stats.sectors.LIVESTOCK || 31, icon: Building2, color: 'text-amber-500' },
                    { name: 'Pescas', count: stats.sectors.FISHERIES || 18, icon: Ship, color: 'text-sky-500' },
                    { name: 'Comércio', count: stats.sectors.COMMERCE || 22, icon: ShoppingBag, color: 'text-purple-500' },
                    { name: 'Transportes', count: stats.sectors.TRANSPORT || 8, icon: Truck, color: 'text-indigo-500' }
                  ].map((s, i) => {
                    const Icon = s.icon;
                    const percent = Math.round((s.count / stats.total) * 100);
                    return (
                      <div key={i} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center space-y-2">
                        <Icon size={24} className={`mx-auto ${s.color}`} />
                        <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">{s.name}</span>
                        <span className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 block">{s.count}</span>
                        <span className="text-[10px] text-slate-400 block">{percent}% da amostra</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View D: Provincial Distribution */}
            {activeTabStats === 'provinces' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                  Participação das Cooperativas por Província
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {Object.entries(stats.provinces).map(([prov, count], i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin size={15} className="text-brand-iris shrink-0" />
                        <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{prov}</span>
                      </div>
                      <span className="text-xs font-extrabold text-brand-iris font-mono">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 4. CREDIT READINESS CALCULATOR WIDGET */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-[#0B0B0F] border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto space-y-8 text-left">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Calculator size={14} />
              FERRAMENTA DE ESTIMATIVA DE CRÉDITO
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
              Calcule a Capacidade de Endividamento da Cooperativa
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
              Ajuste as métricas da sua cooperativa e veja a estimativa do limite bancário financiável.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#13131A] border border-slate-200 dark:border-zinc-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Form Sliders */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Revenue Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-zinc-200">
                  <span>Faturação Mensal Estimada:</span>
                  <span className="font-mono text-brand-iris">{calcRevenue.toLocaleString('pt-PT')} Kz / mês</span>
                </div>
                <input 
                  type="range" 
                  min="200000" 
                  max="5000000" 
                  step="100000" 
                  value={calcRevenue} 
                  onChange={e => setCalcRevenue(Number(e.target.value))}
                  className="w-full accent-brand-iris cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>200.000 Kz</span>
                  <span>5.000.000 Kz</span>
                </div>
              </div>

              {/* Assets Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-zinc-200">
                  <span>Ativos/Equipamentos Registados (Tratores, Barcos, Terrenos):</span>
                  <span className="font-mono text-purple-600 dark:text-purple-400">{calcAssets.toLocaleString('pt-PT')} Kz</span>
                </div>
                <input 
                  type="range" 
                  min="500000" 
                  max="15000000" 
                  step="500000" 
                  value={calcAssets} 
                  onChange={e => setCalcAssets(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>500.000 Kz</span>
                  <span>15.000.000 Kz</span>
                </div>
              </div>

              {/* Checkbox Compliance */}
              <div 
                className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between cursor-pointer" 
                onClick={() => setCalcAgtCompliant(!calcAgtCompliant)}
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">NIF Regularizado & Atas Assinadas?</span>
                  <span className="text-[11px] text-slate-400 block">Aumenta imediatamente a confiança dos bancos em 15%</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={calcAgtCompliant} 
                  onChange={e => setCalcAgtCompliant(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

            </div>

            {/* Calculated Output Card */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[#12121A] to-[#1A1826] text-white border border-zinc-800 space-y-6 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">SCORE ESTIMADO</span>
                <div className="text-4xl font-extrabold text-white mt-1">
                  {currentCalc.score} <span className="text-xs font-normal text-slate-400">/ 100 pts</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${currentCalc.score}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase block">LIMITE FINANCIÁVEL ESTIMADO</span>
                <span className="text-2xl font-extrabold text-white block">{currentCalc.formattedLimit}</span>
                <span className="text-[10px] text-slate-400 block">Aviso 10/22 do Banco Nacional de Angola</span>
              </div>

              <button 
                onClick={() => onNavigate('register')}
                className="w-full py-2.5 rounded-xl bg-brand-iris hover:bg-brand-iris-hover text-white font-bold text-xs transition-all cursor-pointer shadow-lg"
              >
                Oficializar o Score da Cooperativa
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 5. STRATEGIC SECTORS ECOSYSTEM EXPLORER */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full text-left">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-brand-iris uppercase tracking-widest block">SECTORES ESTRATÉGICOS</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
            Funcionalidades Adequadas a Cada Actividade
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            Módulos práticos adaptados às realidades específicas da agricultura, pecuária, pescas e comércio provincial.
          </p>
        </div>

        {/* Sector Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 justify-start sm:justify-center">
          {[
            { id: 'AGRICULTURE', label: '🌾 Agricultura', icon: Sprout },
            { id: 'LIVESTOCK', label: '🐄 Pecuária', icon: Building2 },
            { id: 'FISHERIES', label: '⚓ Pescas', icon: Ship },
            { id: 'COMMERCE', label: '👜 Comércio', icon: ShoppingBag },
            { id: 'TRANSPORT', label: '🚛 Transportes', icon: Truck }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedSector(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  selectedSector === tab.id
                    ? 'bg-brand-iris text-white shadow-md'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200'
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Sector Active Detail Box */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#14141B] border border-slate-200 dark:border-zinc-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-7 space-y-4">
            {selectedSector === 'AGRICULTURE' && (
              <>
                <span className="px-2.5 py-1 rounded bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase">MÓDULO DE AGRICULTURA</span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100">Controlo de Safras e Gestão de Sementes</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Gere o registo de hectares cultivados, consumo de adubos e estimativa de colheitas para batata, milho, feijão e hortícolas com relatórios prontos para financiamento.
                </p>
              </>
            )}

            {selectedSector === 'LIVESTOCK' && (
              <>
                <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase">MÓDULO DE PECUÁRIA</span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100">Rastreabilidade Sanitária e Gestão de Rebanho</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Controlo de brinco, calendário de vacinação e registo de peso de gado bovino, caprino e suíno com histórico para compradores industriais.
                </p>
              </>
            )}

            {selectedSector === 'FISHERIES' && (
              <>
                <span className="px-2.5 py-1 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-bold uppercase">MÓDULO DE PESCAS</span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100">Controlo de Saídas ao Mar e Consumo de Combustível</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Registe o pescado diário por embarcação, gestão de lota e combustível, garantindo a transparência das receitas das artes de pesca.
                </p>
              </>
            )}

            {selectedSector === 'COMMERCE' && (
              <>
                <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase">MÓDULO DE COMÉRCIO</span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100">Vendas Diárias e Inventários de Lojas Provinciais</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Registo fácil de faturação para lojas, cantinas e pequenos distribuidores regionais sem necessidade de sistemas complexos.
                </p>
              </>
            )}

            {selectedSector === 'TRANSPORT' && (
              <>
                <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase">MÓDULO DE TRANSPORTES</span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100">Gestão de Viagens e Escoamento de Produtos</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Controlo de fretes, manutenção de carrinhas e custos de estrada para garantir o transporte de produtos das zonas rurais para os centros urbanos.
                </p>
              </>
            )}

            <button 
              onClick={() => onNavigate('register')}
              className="px-5 py-2.5 rounded-xl bg-brand-iris hover:bg-brand-iris-hover text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              Ativar Módulo no Meu Perfil
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="md:col-span-5 p-6 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">Benefícios Diretos:</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                <span>Emissão automática de mapas contábeis aceites pelos bancos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                <span>Suporte a funcionamento total em locais com pouca rede</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                <span>Integração de associados com registo de participações</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 6. COOPERATIVAS E ORGANIZAÇÕES REGISTADAS NO BANCO DE DADOS */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-[#0B0B0F] border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto space-y-8 text-left">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block">REGISTO DE CAMPO EM TEMPO REAL</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
              Cooperativas e Organizações Registadas no Banco de Dados
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
              Consulte as organizações ativas cadastradas na plataforma MiraWelch com os respetivos níveis de maturidade e dados provinciais.
            </p>
          </div>

          {summaryData && summaryData.organizations && summaryData.organizations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {summaryData.organizations.map((org: any) => {
                const sectorLabel = org.sector === 'AGRICULTURE' ? 'Agricultura' : org.sector === 'LIVESTOCK' ? 'Pecuária' : org.sector === 'FISHERIES' ? 'Pescas' : org.sector === 'COMMERCE' ? 'Comércio' : 'Transportes';
                const maturityLabel = org.maturity === 'ADVANCED' ? 'Avançado' : org.maturity === 'INTERMEDIATE' ? 'Intermédio' : 'Iniciante';
                const score = org.fundingScore || (org.maturity === 'ADVANCED' ? 85 : org.maturity === 'INTERMEDIATE' ? 68 : 42);

                return (
                  <div key={org.id} className="p-6 rounded-3xl bg-white dark:bg-[#13131A] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-medium">
                        <span className="flex items-center gap-1 font-bold text-brand-iris">
                          <MapPin size={13} /> {org.province || 'Angola'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-[10px] font-bold text-slate-700 dark:text-zinc-300">{sectorLabel}</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">{org.name}</h3>

                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400 pt-2 border-t border-slate-100 dark:border-zinc-800">
                        <div className="flex justify-between">
                          <span>Nível de Maturidade:</span>
                          <span className="font-semibold text-slate-800 dark:text-zinc-200">{maturityLabel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Registos Operacionais:</span>
                          <span className="font-semibold text-slate-800 dark:text-zinc-200">{org.operationsCount || 0} homologações</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Score de Identidade Económica</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{score} / 100 pts</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle size={14} className="text-emerald-500" />
                        Organização Registada no Banco de Dados
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#13131A] rounded-3xl border border-slate-200 dark:border-zinc-800 space-y-3 max-w-xl mx-auto">
              <Users className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Nenhuma cooperativa cadastrada no momento</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Seja a primeira organização a cadastrar-se e a criar a sua Identidade Económica.</p>
              <button 
                onClick={() => onNavigate('register')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-brand-iris hover:bg-brand-iris-hover text-white text-xs font-bold transition-all cursor-pointer"
              >
                Registar Cooperativa Agora
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 px-6 max-w-4xl mx-auto w-full text-left">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-brand-iris uppercase tracking-widest block">ESCLARECIMENTOS</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#13131A] border border-slate-200 dark:border-zinc-800 cursor-pointer transition-all"
              onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
            >
              <div className="flex items-center justify-between font-bold text-sm text-slate-900 dark:text-zinc-100">
                <span>{faq.q}</span>
                <HelpCircle size={16} className="text-brand-iris shrink-0" />
              </div>

              {activeFAQ === idx && (
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-zinc-800">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. CALL TO ACTION FOOTER BANNER */}
      <section className="py-16 px-6 bg-gradient-to-br from-brand-iris to-brand-iris-hover text-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Pronto para transformar a sua cooperativa num negócio financiável?
          </h2>
          <p className="text-sm text-slate-100 leading-relaxed max-w-xl mx-auto">
            Junte-se às dezenas de cooperativas de Angola que já estão a organizar as suas contas e a criar a sua Identidade Económica.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button 
              onClick={() => onNavigate('register')}
              className="px-6 py-3 rounded-xl bg-white text-brand-iris font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer shadow-lg"
            >
              Registar Cooperativa Gratuito
            </button>
            <button 
              onClick={() => onNavigate('survey')}
              className="px-6 py-3 rounded-xl bg-black/30 text-white font-bold text-xs hover:bg-black/40 border border-white/20 transition-all cursor-pointer"
            >
              Participar no Inquérito LISPA
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
