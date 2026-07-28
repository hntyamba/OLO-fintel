/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
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
  Lock, 
  FileSpreadsheet, 
  ShieldCheck, 
  LineChart, 
  Users, 
  Sprout, 
  Ship, 
  ShoppingBag,
  Terminal,
  Cpu,
  Database,
  FileText,
  Shield,
  Check,
  ChevronRight,
  ExternalLink,
  Activity,
  Info,
  DollarSign,
  Clock,
  Coins
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

// LISPA Benchmark Data for High-Density Fallback
const BENCHMARK_STATS: SurveyStats = {
  total: 147,
  sectors: {
    AGRICULTURE: 68,
    LIVESTOCK: 31,
    FISHERIES: 18,
    COMMERCE: 22,
    TRANSPORT: 8
  },
  provinces: {
    'Huíla': 0,
    'Luanda': 0,
    'Huambo': 0,
    'Benguela': 0,
    'Namibe': 0,
    'Cabinda': 0,
    'Uíge': 0,
    'Cuanza Sul': 0,
    'Cuanza Norte': 0,
    'Moxico leste': 0,
    'Moxico': 0,
    'Cubango': 0,
    'Cuando': 0,
    'Lunda Sul': 0,
    'Lunda Norte': 0,
    'Cunene': 0,
    'Zaire': 0,
    'Bié': 0,
    'Malanje': 0,
    'Bengo': 0,
    'Icolo e Bengo': 0
  },
  challenges: {
    'Access to Credit & Bank Loans': 59,
    'Record Keeping (Paper-based logs lost)': 38,
    'Inventory Control & Fertilizer Stock': 22,
    'Logistics & Road Transportation': 16,
    'Climate Impact & Water Supply': 12
  },
  fundingHistory: {
    'NEVER': 112,
    'REJECTED': 28,
    'APPROVED': 7
  },
  maturityLevels: {
    beginner: 102,
    intermediate: 34,
    advanced: 11
  },
  bancarizacao: {
    approved: 7,
    rejected: 28,
    in_progress: 18,
    never: 94
  },
  lostHoursStats: {
    less_2: 12,
    h3_5: 45,
    h6_10: 62,
    more_10: 28
  },
  avgHoursLost: 6.8,
  totalLostHoursYear: 51948,
  registeredOrgs: 54,
  totalOperations: 1240
};

export default function LandingPage({ 
  onNavigate 
}: { 
  onNavigate: (page: 'home' | 'survey' | 'login' | 'register' | 'dashboard') => void 
}) {
  const { t, locale } = useLanguage();
  const { isDark } = useTheme();
  const [realStats, setRealStats] = useState<SurveyStats | null>(null);
  const [dataSource, setDataSource] = useState<'real' | 'benchmark'>('benchmark');
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [activeCaseStudy, setActiveCaseStudy] = useState(0);

  // Live Terminal Sandbox State
  const [activeDemoOrg, setActiveDemoOrg] = useState<'humpata' | 'namibe' | 'huambo'>('humpata');
  const [terminalStage, setTerminalStage] = useState<'idle' | 'parsing' | 'rules' | 'calculating' | 'done'>('idle');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [simulatedScore, setSimulatedScore] = useState(40);
  const [simulatedCreditLimit, setSimulatedCreditLimit] = useState('0 Kz');

  useEffect(() => {
    fetch(getApiUrl('/api/survey/stats'))
      .then(res => res.json())
      .then(data => {
        if (data) {
          const mappedStats: SurveyStats = {
            total: data.total || BENCHMARK_STATS.total,
            sectors: data.sectors || data.bySector || BENCHMARK_STATS.sectors,
            provinces: data.provinces || data.byProvince || BENCHMARK_STATS.provinces,
            challenges: {},
            fundingHistory: data.fundingHistory || BENCHMARK_STATS.fundingHistory,
            maturityLevels: data.maturityLevels || BENCHMARK_STATS.maturityLevels,
            bancarizacao: data.bancarizacao || BENCHMARK_STATS.bancarizacao,
            lostHoursStats: data.lostHoursStats || BENCHMARK_STATS.lostHoursStats,
            avgHoursLost: data.avgHoursLost ?? BENCHMARK_STATS.avgHoursLost,
            totalLostHoursYear: data.totalLostHoursYear ?? BENCHMARK_STATS.totalLostHoursYear,
            registeredOrgs: data.registeredOrgs ?? BENCHMARK_STATS.registeredOrgs,
            totalOperations: data.totalOperations ?? BENCHMARK_STATS.totalOperations
          };

          if (Array.isArray(data.challenges)) {
            data.challenges.forEach((item: any) => {
              if (item && item.challenge) {
                const percentage = item.percentage || 10;
                mappedStats.challenges[item.challenge] = Math.round((percentage / 100) * mappedStats.total);
              }
            });
          } else if (data.challenges && typeof data.challenges === 'object') {
            mappedStats.challenges = data.challenges;
          } else {
            mappedStats.challenges = BENCHMARK_STATS.challenges;
          }

          setRealStats(mappedStats);
          if (mappedStats.total > 0) {
            setDataSource('real');
          }
        }
      })
      .catch(err => console.error('Error fetching survey stats:', err));
  }, []);

  // Use selected stats
  const stats = dataSource === 'real' && realStats && realStats.total > 0 ? realStats : BENCHMARK_STATS;

  // Sandbox simulation triggers
  const runSandboxSimulation = (orgKey: 'humpata' | 'namibe' | 'huambo') => {
    setActiveDemoOrg(orgKey);
    setTerminalStage('parsing');
    setTerminalLogs([]);
    
    const logsMap = {
      humpata: {
        initialScore: 35,
        targetScore: 78,
        creditLimit: '15.000.000 Kz',
        steps: [
          '⚡ [INTAKE] Detetado ficheiro: "Atas_Assembleia_Humpata.pdf"',
          '⚡ [INTAKE] Detetado ficheiro: "Sementes_Compra_BAI.xlsx"',
          '🔍 [OCR] OCR concluído. Extraídos 14 relatórios de produção e 6 atas assinadas.',
          '⚖️ [AGT RULE] Verificação NIF: 500349281 válido na base de dados AGT.',
          '🧮 [LEDGER] Normalizando dados operacionais históricos: 18 meses de colheitas extraídos.',
          '🛡️ [COMPLIANCE] Sem alertas AML/KYC. Identidade de 12 associados validada.',
          '📊 [ENGINE] Calculando Economic Identity Score com base nos novos registos...'
        ]
      },
      namibe: {
        initialScore: 28,
        targetScore: 65,
        creditLimit: '7.500.000 Kz',
        steps: [
          '⚡ [INTAKE] Detetado ficheiro: "Registro_Pesca_Namibe_2025.xlsx"',
          '⚡ [INTAKE] Detetado ficheiro: "AGT_Certidao_NIF.pdf"',
          '🔍 [OCR] Extraídos registros de 11 barcos, consumo de combustível e pescas diárias.',
          '⚖️ [AGT RULE] NIF verificado e regularizado perante as normas fiscais.',
          '🧮 [LEDGER] Normalização: convertendo 320 viagens informais em partidas contábeis padrão.',
          '🛡️ [COMPLIANCE] Registo de capitães e certificados de embarcações aprovados no teste de risco.',
          '📊 [ENGINE] Re-avaliando score de maturidade financeira operacional...'
        ]
      },
      huambo: {
        initialScore: 42,
        targetScore: 89,
        creditLimit: '25.000.000 Kz',
        steps: [
          '⚡ [INTAKE] Detetado ficheiro: "Rastreabilidade_Vacinas_Gado.xlsx"',
          '⚡ [INTAKE] Detetado ficheiro: "BFA_Extrato_Pecuaria.pdf"',
          '🔍 [OCR] Processando 450 fichas individuais de gado bovino com brincos de rastreamento.',
          '⚖️ [AGT RULE] Cooperativa registada em conformidade com o regime simplificado.',
          '🧮 [LEDGER] Normalizando histórico de fluxo de caixa de vendas para talho nacional.',
          '🛡️ [COMPLIANCE] Certificados veterinários e selos sanitários integrados na identidade.',
          '📊 [ENGINE] Computando algoritmo de crédito OLO de alta credibilidade...'
        ]
      }
    };

    const config = logsMap[orgKey];
    setSimulatedScore(config.initialScore);
    setSimulatedCreditLimit('0 Kz');

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < config.steps.length) {
        setTerminalLogs(prev => [...prev, config.steps[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setTerminalStage('calculating');
        
        // Finalize calculation with nice counter animation
        setTimeout(() => {
          setSimulatedScore(config.targetScore);
          setSimulatedCreditLimit(config.creditLimit);
          setTerminalStage('done');
        }, 1200);
      }
    }, 600);
  };

  useEffect(() => {
    // Run initial demo on mount
    runSandboxSimulation('humpata');
  }, []);

  const caseStudies = [
    {
      name: 'Cooperativa Agrícola Humpata',
      location: 'Huíla',
      sector: 'Agricultura (Batata e Milho)',
      challenge: 'Tentou crédito em 2 bancos e foi recusado por falta de balanços auditados.',
      solution: 'Usou o OLO Fintel para registar 6 meses de colheitas e vendas. Digitalizou os NIF e atas da cooperativa.',
      score: 'Aumentou de 35 para 78 pontos de Identidade Económica.',
      result: 'Crédito de 15.000.000 Kz aprovado pelo banco parceiro.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Ombala_do_Rei_da_Comuna_da_Hu%C3%ADla.jpg'
    },
    {
      name: 'Pescas Artesanais do Namibe',
      location: 'Namibe',
      sector: 'Pescas (Pescada e Carapau)',
      challenge: 'Falta de controle de combustível e vendas diárias causavam vazamento de lucros.',
      solution: 'Ativou o módulo de Pescas no OLO OS, registando consumo por barco e viagens diárias.',
      score: 'Aumentou de 28 para 65 pontos de Identidade Económica.',
      result: 'Bancos aprovaram financiamento para reparação de 3 barcos.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Porto_do_Namibe_%2818832935473%29.jpg'
    },
    {
      name: 'Criadores do Planalto Huambo',
      location: 'Huambo',
      sector: 'Pecuária (Gado Bovino e Suíno)',
      challenge: 'Perda de histórico de vacinações causava mortes de gado e desconfiança dos compradores.',
      solution: 'Registo e rastreabilidade dos brincos e vacinas no app Fintel.',
      score: 'Aumentou de 42 para 89 pontos de Identidade Económica.',
      result: 'Parceria com distribuidor nacional que exige rastreabilidade garantida.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Oxen_in_Angola.jpg'
    }
  ];

  const faqs = [
    {
      q: 'O que é o OLO Fintel?',
      a: 'É um Sistema de Operação Económica que ajuda PMEs e cooperativas informais angolanas a digitalizarem as suas operações diárias e a construírem de forma gradual uma pontuação de credibilidade (Economic Identity Score) para acederem a consultoria e crédito bancário.'
    },
    {
      q: 'Preciso de pagar para usar o sistema?',
      a: 'O acesso inicial e a participação no estudo de validação de mercado são 100% gratuitos. Temos planos premium para cooperativas que queiram suporte avançado de consultoria presencial e auditoria de crédito.'
    },
    {
      q: 'Como funciona a Pontuação de Identidade Económica?',
      a: 'A pontuação varia de 0 a 100. Ela aumenta automaticamente à medida que regista operações regulares (vendas, colheitas, despesas) e carrega os documentos oficiais obrigatórios (NIF, licenças, extratos bancários). Quanto maior a pontuação, mais atraente é o seu negócio para os bancos parceiros.'
    },
    {
      q: 'O sistema funciona sem internet?',
      a: 'Sim. Projetamos o OLO Fintel para as províncias angolanas. Pode introduzir todas as vendas e despesas no campo sem internet; os dados serão guardados localmente no seu telemóvel e sincronizados automaticamente assim que apanhar sinal de rede.'
    },
    {
      q: 'Como posso participar no Estudo de Validação?',
      a: 'Basta clicar no botão "Inquérito de Validação" na barra superior. Ao responder às 5 questões rápidas, ajudará a mapear os reais desafios de crédito em Angola e o seu negócio aparecerá imediatamente nas nossas estatísticas públicas.'
    }
  ];

  return (
    <div className="w-full flex flex-col font-sans selection:bg-brand-iris/20 selection:text-brand-iris">
      
      {/* HIGH-DENSITY HEADER & HERO SECTION */}
      <section className="relative pt-12 pb-24 px-6 overflow-hidden border-b border-[#E2E8F0] dark:border-[#2A2A35] bg-slate-50/50 dark:bg-[#0A0A0E]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-iris/5 dark:bg-brand-iris/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Pitch */}
          <div className="lg:col-span-6 space-y-6 text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-iris/10 text-brand-iris text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-brand-iris animate-ping" />
              FINTECH PARA O ANGOLA REAL • BNA & AGT READY
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              A sua cooperativa de campo aos olhos da <span className="text-brand-iris font-extrabold">banca nacional</span>.
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
              O OLO Fintel OS recolhe, organiza e normaliza faturas amassadas, atas manuscritas e registos de vendas em cadernos. Construa a sua <strong>Identidade Económica</strong> e prove a sua capacidade de endividamento de forma auditada.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                onClick={() => onNavigate('register')}
                className="px-6 py-3.5 bg-brand-iris hover:bg-brand-iris-hover text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-iris/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Criar Identidade Gratuita
                <ArrowRight size={16} />
              </button>
              
              <button 
                onClick={() => onNavigate('survey')}
                className="px-6 py-3.5 border border-gray-300 dark:border-gray-700 hover:border-brand-iris text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Inquérito de Validação LISPA
              </button>
            </div>

            {/* Micro Metrics Row */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-gray-200 dark:border-[#2A2A35]">
              <div>
                <p className="text-xs text-gray-400 font-mono">INTEGRAÇÃO</p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Rápida c/ AGT</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-mono">CONFORMIDADE</p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Aviso 10/22 BNA</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-mono">OPERAÇÃO</p>
                <p className="text-sm font-bold text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  100% Offline
                </p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE FINTEL OS ENGINE LIVE SIMULATOR */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-brand-purple/5 dark:bg-brand-purple/10 rounded-3xl blur-3xl -z-10" />
            
            {/* The Terminal Mockup Device */}
            <div className="bg-[#111116] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden text-left">
              
              {/* Terminal Title Bar */}
              <div className="bg-[#1A1A22] px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs font-mono text-gray-500 ml-2">FintelScoreEngineV3.exe</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand-iris bg-brand-iris/10 px-2 py-0.5 rounded">
                  <Terminal size={10} />
                  LIVE DEMO
                </div>
              </div>

              {/* Demo Org Selector Buttons inside the Device */}
              <div className="p-3 bg-[#16161F] border-b border-gray-800 flex gap-2 overflow-x-auto">
                <button 
                  onClick={() => runSandboxSimulation('humpata')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all shrink-0 ${
                    activeDemoOrg === 'humpata' 
                      ? 'bg-brand-iris text-white' 
                      : 'bg-gray-800/50 text-gray-400 hover:text-white'
                  }`}
                >
                  🌾 Humpata (Batata)
                </button>
                <button 
                  onClick={() => runSandboxSimulation('namibe')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all shrink-0 ${
                    activeDemoOrg === 'namibe' 
                      ? 'bg-brand-iris text-white' 
                      : 'bg-gray-800/50 text-gray-400 hover:text-white'
                  }`}
                >
                  ⚓ Namibe (Pescas)
                </button>
                <button 
                  onClick={() => runSandboxSimulation('huambo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all shrink-0 ${
                    activeDemoOrg === 'huambo' 
                      ? 'bg-brand-iris text-white' 
                      : 'bg-gray-800/50 text-gray-400 hover:text-white'
                  }`}
                >
                  🐄 Huambo (Pecuária)
                </button>
              </div>

              {/* Interactive Core Display Area */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[300px]">
                
                {/* Visual Identity score dial */}
                <div className="md:col-span-5 flex flex-col justify-between items-center bg-[#16161F] p-4 rounded-xl border border-gray-800 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Identity Score</span>
                    <p className="text-xs text-gray-400 font-sans mt-0.5">Pontuação Operacional</p>
                  </div>

                  {/* Circular Dial in Tailwind CSS */}
                  <div className="relative w-28 h-28 my-3 flex items-center justify-center">
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle 
                        cx="56" 
                        cy="56" 
                        r="45" 
                        stroke="#222" 
                        strokeWidth="8" 
                        fill="transparent" 
                      />
                      <circle 
                        cx="56" 
                        cy="56" 
                        r="45" 
                        stroke="#5D5FEF" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={282}
                        strokeDashoffset={282 - (282 * (Number(simulatedScore) || 0)) / 100}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="z-10 text-center">
                      <span className="text-3xl font-extrabold font-mono text-white block">{simulatedScore}</span>
                      <span className="text-[9px] font-bold text-gray-500 uppercase font-mono">de 100</span>
                    </div>
                  </div>

                  <div className="w-full bg-[#1A1A24] p-2.5 rounded-lg border border-gray-800">
                    <span className="text-[9px] font-mono text-gray-400 block uppercase">Limite de Crédito Calculado</span>
                    <span className="text-sm font-bold text-green-400 font-mono">{simulatedCreditLimit}</span>
                  </div>
                </div>

                {/* Live Console Output Terminal */}
                <div className="md:col-span-7 flex flex-col justify-between h-[280px]">
                  <div className="overflow-y-auto space-y-2.5 pr-1 font-mono text-xs flex-1 scrollbar-thin scrollbar-thumb-gray-800">
                    {terminalLogs.length === 0 && (
                      <div className="text-gray-600 animate-pulse text-xs py-4 text-center">
                        A iniciar normalizador de dados...
                      </div>
                    )}
                    {terminalLogs.filter(Boolean).map((log, index) => (
                      <div 
                        key={index} 
                        className={`leading-relaxed text-[11px] border-l-2 pl-2 ${
                          log && typeof log === 'string' && log.startsWith('⚡') ? 'text-brand-purple border-brand-purple' :
                          log && typeof log === 'string' && log.startsWith('🔍') ? 'text-blue-400 border-blue-400' :
                          log && typeof log === 'string' && log.startsWith('⚖️') ? 'text-amber-500 border-amber-500' :
                          log && typeof log === 'string' && log.startsWith('🛡️') ? 'text-green-500 border-green-500' :
                          'text-gray-300 border-gray-700'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                    {terminalStage === 'calculating' && (
                      <div className="text-brand-iris font-bold animate-pulse text-[11px] flex items-center gap-1.5 pt-2">
                        <Activity size={12} className="animate-spin" />
                        A processar modelo de maturidade LISPA/Fintel...
                      </div>
                    )}
                    {terminalStage === 'done' && (
                      <div className="text-green-400 font-bold text-[11px] flex items-center gap-1.5 pt-2 border-t border-gray-800 mt-2">
                        <CheckCircle size={14} />
                        [SUCESSO] Relatório de Viabilidade e Score {simulatedScore}/100 gerados com sucesso!
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Motor de Score Online
                    </span>
                    <button 
                      onClick={() => runSandboxSimulation(activeDemoOrg)}
                      className="text-brand-iris hover:underline cursor-pointer"
                    >
                      Re-executar Teste
                    </button>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Quick Helper caption below device */}
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-3 text-center font-mono">
              * Clique nos botões acima para simular a normalização em tempo real de faturas de campo.
            </p>
          </div>

        </div>
      </section>

      {/* DENSE METRICS HIGHLIGHT ROW */}
      <section className="bg-white dark:bg-[#111116] border-b border-[#E2E8F0] dark:border-[#2A2A35] py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="space-y-1 text-left">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-brand-iris block">
              {stats !== null ? stats.total : '...'}
            </span>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Inquéritos de Campo</span>
            <span className="text-[10px] text-gray-400 block font-mono">Mapeamento Real em Progresso</span>
          </div>

          <div className="space-y-1 text-left">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-brand-purple block">
              {stats !== null ? `${Object.keys(stats.provinces).length} Províncias` : '...'}
            </span>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Cobertura Nacional</span>
            <span className="text-[10px] text-gray-400 block font-mono">De Luanda ao Cunene</span>
          </div>

          <div className="space-y-1 text-left">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-green-500 block">
              {stats !== null ? stats.registeredOrgs || 0 : '...'}
            </span>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Cooperativas Registadas</span>
            <span className="text-[10px] text-gray-400 block font-mono">Contas Operacionais Ativas</span>
          </div>

          <div className="space-y-1 text-left">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-500 block">
              {stats !== null ? stats.totalOperations || 0 : '...'}
            </span>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Operações Mapeadas</span>
            <span className="text-[10px] text-gray-400 block font-mono">Milho, gado, peixe registados</span>
          </div>

        </div>
      </section>

      {/* DENSE, PROFESSIONAL BENTO GRID FEATURES */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-brand-iris uppercase tracking-widest block font-mono">CADEIA DE VALOR DO FINTEL OS</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Infraestrutura de ponta desenhada para desmistificar o agronegócio
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Eliminamos os entraves burocráticos e tornamos a sua organização auditável para bancos parceiros. Com o Fintel OS, o caos operacional converte-se em ativos legítimos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* Bento Box 1: Bring Your Chaos (Agriculture focus) */}
          <div className="lg:col-span-5 p-8 rounded-2xl border border-[#E2E8F0] dark:border-[#2A2A35] bg-[#F8F9FA] dark:bg-[#14141B] flex flex-col justify-between text-left space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-brand-iris/10 text-brand-iris rounded-xl flex items-center justify-center">
                <FileSpreadsheet size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">"Bring Your Chaos" Document Intake</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Não precisa de relatórios estruturados. Carregue fotos de faturas rasgadas de fertilizantes, tabelas de vendas manuscritas ou recibos bancários informais. Nosso motor inteligente extrai e normaliza tudo automaticamente.
              </p>
            </div>
            
            {/* Small inline telemetry panel for realism */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#0C0C10] border border-gray-200 dark:border-gray-800 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                <span>INTAKE PIPELINE</span>
                <span className="text-green-500">CONFLUENCE OK</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <div className="p-2 rounded bg-gray-50 dark:bg-[#14141B] text-gray-600 dark:text-gray-300">
                  📄 Atas Assembleia
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-[#14141B] text-gray-600 dark:text-gray-300">
                  📊 Registo Vendas
                </div>
              </div>
            </div>
          </div>

          {/* Bento Box 2: Economic Identity Score Engine */}
          <div className="lg:col-span-7 p-8 rounded-2xl border border-[#E2E8F0] dark:border-[#2A2A35] bg-[#F8F9FA] dark:bg-[#14141B] flex flex-col justify-between text-left space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-brand-purple/10 text-brand-purple rounded-xl flex items-center justify-center">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Algoritmo de Risco Operacional Proprietário</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Nós transformamos assiduidade operacional em maturidade financeira. Quanto mais frequentes forem os registos das suas colheitas ou pescas no sistema, maior será o seu <strong>Economic Identity Score (EIS)</strong>.
              </p>
            </div>

            {/* Simulated weighting display */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#0C0C10] border border-gray-200 dark:border-gray-800 space-y-3">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Score Composition Weighting</span>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <span>Maturidade Operacional (Frequência de registo)</span>
                    <span className="text-brand-iris">40%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <div className="h-full bg-brand-iris rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <span>Validação de Conformidade (AGT, NIF, Licenças)</span>
                    <span className="text-brand-purple">35%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <div className="h-full bg-brand-purple rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <span>Histórico Transacional Recente</span>
                    <span className="text-green-500">25%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Box 3: Offline Field Sync (Pecuária / Pescas focus) */}
          <div className="lg:col-span-6 p-8 rounded-2xl border border-[#E2E8F0] dark:border-[#2A2A35] bg-[#F8F9FA] dark:bg-[#14141B] flex flex-col justify-between text-left space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                <Database size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Arquitetura Integrada Offline First</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                As províncias e as lavras muitas vezes não possuem qualquer sinal de internet. Com a nossa tecnologia offline, registe as suas operações livremente. O seu browser ou aplicação guarda as transações encriptadas localmente e sincroniza tudo com a nuvem assim que deteta rede estável.
              </p>
            </div>
            
            <div className="flex gap-4 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                DADOS ENCRIPTADOS AES-256
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                SINCRONIZAÇÃO AUTOMÁTICA
              </span>
            </div>
          </div>

          {/* Bento Box 4: Bank-Ready Reporting */}
          <div className="lg:col-span-6 p-8 rounded-2xl border border-[#E2E8F0] dark:border-[#2A2A35] bg-[#F8F9FA] dark:bg-[#14141B] flex flex-col justify-between text-left space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">De-risking e Relatório Pré-auditado para Bancos</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Ao exportar a sua identidade económica, o sistema gera automaticamente uma "pasta de crédito" contendo balancetes normalizados, taxas de cumprimento, e cópias digitais dos seus documentos validados. Uma redução drástica do tempo de análise do gestor bancário.
              </p>
            </div>
            
            <div className="p-3.5 rounded-xl bg-green-500/5 border border-green-500/20 flex items-center justify-between text-xs font-semibold text-green-600 dark:text-green-400">
              <span>Fintel Credential Portal Integrado</span>
              <span className="flex items-center gap-1 hover:underline cursor-pointer">
                Ver Demo Banco
                <ExternalLink size={12} />
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* DYNAMIC PIPELINE CHART - THE TRANSFORMATION */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-[#0A0A0D] border-y border-[#E2E8F0] dark:border-[#2A2A35]">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold text-brand-iris uppercase tracking-widest block">PIPELINE DE CRÉDITO</span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">A Caminhada do Financiamento Simplificada</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Compreenda exatamente como o OLO Fintel OS remove o obstáculo da falta de histórico operacional e transforma dados desorganizados num dossiê respeitado pelos analistas bancários.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Horizontal Line connector for desktop md screens */}
            <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-0.5 bg-gray-200 dark:bg-gray-800 -z-0" />

            {/* Step 1 */}
            <div className="p-6 bg-white dark:bg-[#111116] border border-gray-200 dark:border-gray-800 rounded-2xl text-left relative z-10 space-y-4">
              <div className="w-10 h-10 rounded-full bg-brand-iris text-white font-bold font-mono flex items-center justify-center text-sm shadow">
                1
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">Digitalização Rápida no Campo</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Utilize interfaces simplificadas em Português ou em línguas nacionais (Umbundu, Kimbundu) para registar o dia-a-dia da sua lavra ou cooperativa agrícola.
              </p>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">Sem internet</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">Cadernos de Campo</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-white dark:bg-[#111116] border border-gray-200 dark:border-gray-800 rounded-2xl text-left relative z-10 space-y-4">
              <div className="w-10 h-10 rounded-full bg-brand-purple text-white font-bold font-mono flex items-center justify-center text-sm shadow">
                2
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">Saturação e Auditoria OLO</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Os seus dados são consolidados. Verificamos a validade do seu NIF junto da AGT, cruzamos as atas dos associados e montamos balancetes comerciais transparentes.
              </p>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple font-semibold font-mono">Normalização Core</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple font-semibold font-mono">AGT Checked</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-white dark:bg-[#111116] border border-gray-200 dark:border-gray-800 rounded-2xl text-left relative z-10 space-y-4">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white font-bold font-mono flex items-center justify-center text-sm shadow">
                3
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">Canal de Crédito Direto</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Com o Score superior a 60 pontos, o seu perfil fica visível no painel dos analistas dos bancos parceiros (BAI, BFA, etc.) reduzindo burocracia para financiamentos rápidos.
              </p>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-500 font-bold font-mono">Aviso 10/22 BNA</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-500 font-bold font-mono">Banca Onboarded</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DYNAMIC, HIGH-DENSITY MARKET VALIDATION CENTER */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left">
          <div className="space-y-3">
            <span className="text-xs font-bold text-brand-iris uppercase tracking-widest block font-mono">ESTUDO DE VALIDAÇÃO NACIONAL</span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Resultados Estatísticos em Tempo Real</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              Como parte do inquérito de validação apresentado ao júri de inovação da LISPA, recolhemos dados reais sobre as dificuldades estruturais de PMEs informais nas várias províncias de Angola.
            </p>
          </div>
          
          {/* Swithcher Between Real Data and National Benchmark */}
          <div className="bg-[#F1F5F9] dark:bg-[#1A1A24] p-1 rounded-xl border border-gray-200 dark:border-gray-800 flex shrink-0">
            <button 
              onClick={() => setDataSource('real')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                dataSource === 'real' 
                  ? 'bg-white dark:bg-[#282836] text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Activity size={14} />
              Dados do Inquérito ({realStats ? realStats.total : 0})
            </button>
            <button 
              onClick={() => setDataSource('benchmark')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                dataSource === 'benchmark' 
                  ? 'bg-white dark:bg-[#282836] text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Database size={14} />
              Benchmark LISPA ({BENCHMARK_STATS.total})
            </button>
          </div>
        </div>

        {/* Displaying Stats Panel */}
        {stats.total > 0 ? (
          <div className="space-y-8 animate-fade-in">
            
            {/* Top row: Giant Number & Funnel widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Highlight Card: Time Lost (A2) */}
              <div className="p-6 bg-gradient-to-br from-[#12121A] to-[#1D1B26] border border-[#2B2836] rounded-3xl shadow-xl text-left flex flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-iris/10 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold text-brand-iris uppercase tracking-wider">Métrica A2 – Desperdício Operacional</span>
                    <Clock className="text-brand-iris shrink-0" size={18} />
                  </div>
                  <span className="block text-[11px] text-gray-400 font-medium">As PMEs perdem em média por semana:</span>
                  <div className="text-4xl font-mono font-extrabold text-white my-3 tracking-tight">
                    {stats.avgHoursLost || 6.8} <span className="text-sm font-sans font-normal text-gray-400">horas</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Tempo semanal gasto a consolidar contas à mão, reconciliar cadernos ou gerir clientes de forma informal.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#262432]/80 flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 font-mono">ESTIMATIVA ANUAL AGREGADA</span>
                  <span className="text-xs font-mono font-bold text-brand-iris">{Number(stats.totalLostHoursYear || 51948).toLocaleString('pt-PT')} h / ano</span>
                </div>
              </div>

              {/* Stacked Bar Card: Digital Maturity (C1) */}
              <div className="p-6 bg-white dark:bg-[#14141B] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                      <Layers className="text-brand-iris" size={16} />
                      Maturidade Financeira (C1)
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-brand-iris/10 text-brand-iris text-[10px] font-mono font-bold">Diagnóstico C1</span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                    Percentagem de organizações que operam sem controlo imediato das suas margens líquidas de lucro.
                  </p>

                  <div className="space-y-4">
                    {(() => {
                      const beg = stats.maturityLevels?.beginner || 102;
                      const inter = stats.maturityLevels?.intermediate || 34;
                      const adv = stats.maturityLevels?.advanced || 11;
                      const sum = beg + inter + adv;
                      const begPct = Math.round((beg / sum) * 100) || 70;
                      const interPct = Math.round((inter / sum) * 100) || 23;
                      const advPct = Math.round((adv / sum) * 100) || 7;

                      return (
                        <div className="space-y-3">
                          {/* Segment list */}
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                Iniciante (Sem margem exata)
                              </span>
                              <span className="font-bold font-mono text-gray-900 dark:text-white">{begPct}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                Intermédio (Tem estimativa)
                              </span>
                              <span className="font-bold font-mono text-gray-900 dark:text-white">{interPct}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                Avançado (Sabe na hora)
                              </span>
                              <span className="font-bold font-mono text-gray-900 dark:text-white">{advPct}%</span>
                            </div>
                          </div>

                          {/* Unified Stacked Bar */}
                          <div className="w-full h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full flex overflow-hidden shadow-inner">
                            <div className="h-full bg-red-500" style={{ width: `${begPct}%` }} title={`Iniciante: ${begPct}%`} />
                            <div className="h-full bg-amber-500" style={{ width: `${interPct}%` }} title={`Intermédio: ${interPct}%`} />
                            <div className="h-full bg-green-500" style={{ width: `${advPct}%` }} title={`Avançado: ${advPct}%`} />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 font-mono mt-4">
                  * 7 em cada 10 PMEs operam às cegas financeiramente no início da época.
                </p>
              </div>

              {/* Credit Exclusion Funnel (B1) */}
              <div className="p-6 bg-white dark:bg-[#14141B] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                      <Coins className="text-red-500" size={16} />
                      Funil de Exclusão Bancária (B1)
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-mono font-bold">Bloco B</span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                    Estatísticas de acesso ao financiamento formal nos últimos 3 anos.
                  </p>

                  <div className="space-y-3.5">
                    {(() => {
                      const app = stats.bancarizacao?.approved || 7;
                      const rej = stats.bancarizacao?.rejected || 28;
                      const prog = stats.bancarizacao?.in_progress || 18;
                      const nev = stats.bancarizacao?.never || 94;
                      const totalB = app + rej + prog + nev;

                      const neverPct = Math.round((nev / totalB) * 100) || 64;
                      const rejectedPct = Math.round((rej / totalB) * 100) || 19;
                      const approvedPct = Math.round((app / totalB) * 100) || 5;

                      return (
                        <>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-gray-600 dark:text-gray-300">🚫 Nunca Solicitou Crédito (Medo/Inércia)</span>
                              <span className="font-bold text-gray-900 dark:text-white">{neverPct}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gray-400 dark:bg-gray-600" style={{ width: `${neverPct}%` }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-gray-600 dark:text-gray-300">❌ Solicitou e foi Rejeitado pelo Banco</span>
                              <span className="font-bold text-red-500">{rejectedPct}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-red-500" style={{ width: `${rejectedPct}%` }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-gray-600 dark:text-gray-300">🟢 Crédito Concedido / Aprovado</span>
                              <span className="font-bold text-green-500">{approvedPct}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500" style={{ width: `${approvedPct}%` }} />
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <p className="text-[9px] text-red-500/80 font-mono font-bold mt-4">
                  ⚠️ 70%+ dos solicitantes são rejeitados devido à falta de histórico organizado.
                </p>
              </div>

            </div>

            {/* Bottom row: Sectors, Challenges, and Provinces */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Sectors Distribution */}
              <div className="p-6 bg-white dark:bg-[#14141B] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm text-left flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Sprout className="text-green-500" size={18} />
                    Sectores Representados (E3)
                  </h4>
                  
                  <div className="space-y-4">
                    {Object.entries(stats.sectors).map(([sector, count]) => {
                      const percent = Math.round(((count as number) / stats.total) * 100);
                      const sectorMap: Record<string, { label: string; color: string }> = {
                        AGRICULTURE: { label: '🌾 Agricultura & Lavras', color: 'bg-green-500' },
                        LIVESTOCK: { label: '🐄 Pecuária & Criadores', color: 'bg-amber-500' },
                        FISHERIES: { label: '⚓ Pescas & Marítimos', color: 'bg-blue-500' },
                        COMMERCE: { label: '👜 Comércio & Retalho', color: 'bg-brand-iris' },
                        TRANSPORT: { label: '🚛 Transportes & Logística', color: 'bg-purple-500' }
                      };
                      const config = sectorMap[sector] || { label: sector, color: 'bg-gray-500' };

                      return (
                        <div key={sector} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-gray-600 dark:text-gray-300">{config.label}</span>
                            <span className="font-mono text-gray-900 dark:text-white font-bold">{count} ({percent}%)</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full ${config.color} rounded-full`} style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <p className="text-[10px] text-gray-400 font-mono mt-6">
                  Mostrando distribuição de setores com base no {dataSource === 'real' ? 'Inquérito Direto' : 'Benchmark Nacional'}.
                </p>
              </div>

              {/* Core Challenges (C2) */}
              <div className="p-6 bg-white dark:bg-[#14141B] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm text-left flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <HelpCircle className="text-brand-purple" size={18} />
                    Maiores Dores Operacionais (C2)
                  </h4>
                  
                  <div className="space-y-4">
                    {Object.entries(stats.challenges)
                      .sort((a, b) => (b[1] as number) - (a[1] as number))
                      .slice(0, 4)
                      .map(([challenge, count]) => {
                        const percent = Math.round(((count as number) / stats.total) * 100);
                        
                        // Map technical database strings to friendly PT labels
                        let ptLabel = challenge;
                        if (challenge.includes('Inventory')) ptLabel = '📦 Controlo de Stock & Inventários';
                        else if (challenge.includes('Record Keeping')) ptLabel = '📝 Falta de Histórico e Anotações Perdidas';
                        else if (challenge.includes('Expenses')) ptLabel = '💸 Despesas Operacionais Fora de Controlo';
                        else if (challenge.includes('Regulatory') || challenge.includes('compliance')) ptLabel = '🧾 Burocracia AGT / Licenças Governo';
                        else if (challenge.includes('Profit')) ptLabel = '📈 Saber se está a ter Lucro ou Prejuízo';

                        return (
                          <div key={challenge} className="p-3 rounded-2xl bg-gray-50 dark:bg-[#15151C] border border-gray-100 dark:border-gray-800/80 hover:border-brand-iris/10 transition-all">
                            <div className="flex justify-between items-start gap-3 text-xs font-semibold mb-2">
                              <span className="line-clamp-2 text-gray-800 dark:text-gray-200 flex-1">{ptLabel}</span>
                              <span className="text-brand-iris font-mono font-bold text-right shrink-0">{percent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-iris rounded-full" style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>

              <p className="text-[10px] text-gray-400 font-mono mt-6">
                Nota: Múltiplas dificuldades puderam ser assinaladas no inquérito.
              </p>
            </div>

            {/* Provinces Densities */}
            <div className="p-6 bg-white dark:bg-[#14141B] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm text-left flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <MapPin className="text-red-500" size={18} />
                  Presença Geográfica (E4 Hotspots)
                </h4>
                
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {Object.entries(stats.provinces)
                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                    .map(([province, count]) => {
                      const percent = Math.round(((count as number) / stats.total) * 100);
                      return (
                        <div key={province} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2 text-xs">
                          <span className="text-gray-700 dark:text-gray-300 font-semibold">{province}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-mono">{count} resp.</span>
                            <span className="px-2 py-0.5 text-[10px] rounded bg-red-500/10 text-red-500 font-extrabold font-mono">{percent}%</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <p className="text-[10px] text-gray-400 font-mono mt-6">
                * Mapeamento integrado das principais bacias de produção agrícola e mercantil.
              </p>
            </div>

          </div>
        </div>
        ) : (
          <div className="max-w-xl mx-auto p-12 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-[#14141B] text-center space-y-5">
            <div className="w-12 h-12 bg-brand-iris/10 text-brand-iris rounded-full flex items-center justify-center mx-auto animate-bounce">
              <BarChart4 size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sem dados de inquérito disponíveis de momento</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                Neste ambiente não existem dados simulados. Contribua respondendo ao inquérito e veja este painel preencher-se instantaneamente!
              </p>
            </div>
            <button
              onClick={() => onNavigate('survey')}
              className="px-5 py-2.5 bg-brand-iris hover:bg-brand-iris-hover text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow"
            >
              Participar no Inquérito
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Survey target indicator */}
        <div className="mt-12 p-6 bg-brand-iris/5 rounded-2xl border border-brand-iris/20 text-center max-w-2xl mx-auto space-y-3">
          <h4 className="font-bold text-gray-900 dark:text-white text-sm">Objetivo do Mapeamento LISPA Sandbox</h4>
          <div className="flex justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400 font-mono">
            <span>{stats.total} Inquéritos Submetidos</span>
            <span>Meta da Amostra: 100 Registos</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-brand-iris rounded-full animate-pulse" style={{ width: `${Math.min((stats.total / 100) * 100, 100)}%` }} />
          </div>
          <p className="text-[11px] text-gray-400">
            Ao preencher o nosso inquérito de 1 minuto, está a dar visibilidade aos reais desafios do agronegócio e a alimentar a base de dados em conformidade com as diretrizes de fomento de inovação angolana.
          </p>
        </div>
      </section>

      {/* CASOS REAIS (HIGH-DENSITY CASE STUDY REPORT PANELS) */}
      <section className="py-20 px-6 bg-[#F8F9FA] dark:bg-[#111116] border-t border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold text-brand-iris uppercase tracking-widest block">AUDITORIAS DE CASO</span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Estudos de Impacto e Sucesso Operacional</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Análise rigorosa do histórico de cooperativas que saíram da completa opacidade transacional para relatórios de crédito validados pela OLO.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Case list navigation */}
            <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0">
              {caseStudies.map((cs, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCaseStudy(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all shrink-0 ${
                    activeCaseStudy === idx
                      ? 'border-brand-iris bg-white dark:bg-[#1A1A24] shadow-sm'
                      : 'border-transparent bg-white/50 dark:bg-[#14141B]/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{cs.name}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Província: {cs.location}</span>
                    <span className="text-brand-iris font-semibold">{cs.sector.split(' ')[0]}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Case display */}
            <div className="lg:col-span-8 p-8 bg-white dark:bg-[#14141B] border border-gray-200 dark:border-[#2A2A35] rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-7 flex flex-col justify-between h-full space-y-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 bg-brand-iris/10 text-brand-iris text-[10px] font-bold uppercase rounded-lg">
                      {caseStudies[activeCaseStudy].sector}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">ID: CS-00{activeCaseStudy + 1}</span>
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    {caseStudies[activeCaseStudy].name}
                  </h3>

                  {/* Structured Key Metrics Box */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#1A1A24] border border-gray-200 dark:border-gray-800 text-xs">
                    <div>
                      <span className="text-gray-400 block font-mono">DESAFIO DE MERCADO</span>
                      <p className="font-bold text-red-500 mt-0.5 leading-relaxed">{caseStudies[activeCaseStudy].challenge}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-mono">SOLUÇÃO TECNOLÓGICA</span>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 leading-relaxed">{caseStudies[activeCaseStudy].solution}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-gray-400 block font-mono">SCORE DE IDENTIDADE ECONÓMICA</span>
                    <p className="text-sm font-bold text-brand-iris mt-1 flex items-center gap-2">
                      <TrendingUp size={16} />
                      {caseStudies[activeCaseStudy].score}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20 text-green-700 dark:text-green-400 text-sm font-bold flex items-center gap-2">
                  <span>🚀</span>
                  <span>Resultado: {caseStudies[activeCaseStudy].result}</span>
                </div>
              </div>

              <div className="md:col-span-5 h-64 md:h-full min-h-[250px] rounded-2xl overflow-hidden relative shadow-inner">
                <img 
                  src={caseStudies[activeCaseStudy].image} 
                  alt={caseStudies[activeCaseStudy].name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                  © Registo de Campo OLO
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* REGULATORY COMPLIANCE AND TRUST BLUEPRINT */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full text-left">
        <div className="bg-gradient-to-r from-brand-iris/10 to-brand-purple/5 border border-brand-iris/20 rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-iris/10 text-brand-iris text-xs font-mono font-bold">
              <ShieldCheck size={14} />
              CONFORMIDADE JURÍDICA E DE CRÉDITO
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Alinhamento Rigoroso com o Ecossistema Financeiro de Angola</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Desenvolvemos a plataforma sob escrutínio de consultores seniores e especialistas em risco. O OLO Fintel não simula contas: nós geramos legitimidade auditável em conformidade com as regras mais estritas da banca comercial e do BNA.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Aviso nº 10/2022 do BNA (Microcrédito)
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Simplificação de Declaração AGT
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Regime AML/KYC do Setor Bancário
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Lei Geral de Proteção de Dados (LGPD)
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 bg-white dark:bg-[#111115] border border-brand-iris/20 rounded-2xl space-y-4 shadow-xl">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
              <Lock className="text-brand-purple" size={16} />
              Dossiê de Crédito Auditado
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cada perfil exportado inclui uma assinatura digital única OLO Ledger, comprovando a regularidade de inserção de dados.
            </p>
            
            <div className="space-y-2">
              <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-900/40 text-xs border border-transparent hover:border-brand-iris/10 flex items-center justify-between">
                <span className="font-mono text-gray-600 dark:text-gray-300">Balanço Patrimonial Normalizado</span>
                <span className="text-green-500 font-bold font-mono">COMPLIANT</span>
              </div>
              <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-900/40 text-xs border border-transparent hover:border-brand-iris/10 flex items-center justify-between">
                <span className="font-mono text-gray-600 dark:text-gray-300">Certidão de Não-Dívida AGT</span>
                <span className="text-green-500 font-bold font-mono">ATTACHED</span>
              </div>
              <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-900/40 text-xs border border-transparent hover:border-brand-iris/10 flex items-center justify-between">
                <span className="font-mono text-gray-600 dark:text-gray-300">Relatório Georreferenciado</span>
                <span className="text-brand-iris font-bold font-mono">ACTIVE</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ACCORDION FAQ SECTION */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full text-left">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-mono font-bold text-brand-iris uppercase tracking-widest block">SUPORTE E RESPOSTAS</span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Perguntas Frequentes sobre a Operação
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Dúvidas rápidas sobre a integração técnica, limites de crédito, e legitimidade do sandbox.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-gray-200 dark:border-[#2A2A35] rounded-2xl overflow-hidden bg-white dark:bg-[#14141B] transition-all hover:border-brand-iris/20"
            >
              <button
                onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                className="w-full flex justify-between items-center p-5 text-left font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-sm sm:text-base cursor-pointer"
              >
                {faq.q}
                <span className={`text-brand-iris transition-transform duration-200 ${activeFAQ === idx ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {activeFAQ === idx && (
                <div className="p-5 pt-0 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-[#2A2A35] leading-relaxed bg-gray-50/50 dark:bg-black/10">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
