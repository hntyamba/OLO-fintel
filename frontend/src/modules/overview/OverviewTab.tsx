import React from 'react';
import { useLanguage } from '../../components/LanguageContext.js';
import {
  AlertTriangle,
  CloudSun,
  Activity,
  TrendingUp,
  Wrench,
  Sparkles,
  ShoppingBag,
  Sprout,
  Ship,
  Upload,
  ListTodo,
} from 'lucide-react';
import { DocumentRecord, OperationalRecord } from '../../types/index.js';

interface CostAlert {
  title: string;
  description: string;
  severity: string;
  savingEstimate: string;
}

interface AiRecommendation {
  title: string;
  desc: string;
  priority: string;
}

interface DefaultTask {
  id: string;
  text: string;
  done: boolean;
}

interface OverviewTabProps {
  user: any;
  canSwitchSectors: boolean;
  selectedAlertSector: 'ALL' | 'AGRICULTURE' | 'LIVESTOCK' | 'FISHERIES' | 'COMMERCE';
  setSelectedAlertSector: (v: 'ALL' | 'AGRICULTURE' | 'LIVESTOCK' | 'FISHERIES' | 'COMMERCE') => void;
  setCoopTab: (v: any) => void;
  setCommandPaletteActiveOption: (v: string) => void;
  setShowCommandPalette: (v: boolean) => void;
  setRefreshCounter: (fn: (p: number) => number) => void;
  simRevenueIncrease: number;
  setSimRevenueIncrease: (v: number) => void;
  simResolvedChecklist: number;
  setSimResolvedChecklist: (v: number) => void;
  documentsQueue: DocumentRecord[];
  totalRevenue: number;
  totalExpense: number;
  netMargin: number;
  marginPercentage: number;
  liquidityRatio: string;
  liquidityStatus: string;
  financialHealth: string;
  operationalHealth: string;
  documentalHealth: string;
  documentalHealthScore: number;
  commercialHealth: string;
  costAlerts: CostAlert[];
  defaultTasks: DefaultTask[];
  checkedTasks: string[];
  toggleTask: (id: string) => void;
  aiRecommendations: AiRecommendation[];
  operationalLogs: OperationalRecord[];
  setLogType: (v: 'HARVEST' | 'ANIMAL' | 'CATCH' | 'SALE' | 'EXPENSE') => void;
  setShowLogModal: (v: boolean) => void;
  setDocType: (v: 'NIF' | 'ID_CARD' | 'BANK_STATEMENT' | 'LICENSE') => void;
  setShowDocModal: (v: boolean) => void;
}

export function OverviewTab({
  user,
  canSwitchSectors,
  selectedAlertSector,
  setSelectedAlertSector,
  setCoopTab,
  setCommandPaletteActiveOption,
  setShowCommandPalette,
  setRefreshCounter,
  simRevenueIncrease,
  setSimRevenueIncrease,
  simResolvedChecklist,
  setSimResolvedChecklist,
  documentsQueue,
  totalRevenue,
  totalExpense,
  netMargin,
  marginPercentage,
  liquidityRatio,
  liquidityStatus,
  financialHealth,
  operationalHealth,
  documentalHealth,
  documentalHealthScore,
  commercialHealth,
  costAlerts,
  defaultTasks,
  checkedTasks,
  toggleTask,
  aiRecommendations,
  operationalLogs,
  setLogType,
  setShowLogModal,
  setDocType,
  setShowDocModal,
}: OverviewTabProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* 4.0. CENTRAL DE ALERTAS CRÍTICOS OPERACIONAIS */}
      <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Diagnóstico de Risco em Tempo Real (OLO Guardian)
            </span>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2 flex items-center gap-2">
              <AlertTriangle className="text-amber-500 shrink-0" size={18} />
              Alertas Contextuais do Negócio
            </h3>
            <p className="text-xs text-gray-400">Notificações operacionais cruciais geradas com base no seu padrão de colheitas, pesagens e margens de produto.</p>
          </div>

          {canSwitchSectors && (
            <div className="flex flex-wrap gap-1.5 p-1 bg-gray-50 dark:bg-black/10 rounded-xl border border-gray-150 dark:border-gray-800">
              {[
                { id: 'ALL', label: 'Todos' },
                { id: 'AGRICULTURE', label: '🌾 Agrícola' },
                { id: 'LIVESTOCK', label: '🐂 Pecuária' },
                { id: 'FISHERIES', label: '⛵ Pesca' },
                { id: 'COMMERCE', label: '🛍️ Comércio' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedAlertSector(filter.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    selectedAlertSector === filter.id
                      ? 'bg-brand-iris text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(selectedAlertSector === 'ALL' || selectedAlertSector === 'AGRICULTURE') && (
            <div className="p-4 rounded-2xl bg-amber-500/[0.04] dark:bg-amber-500/[0.02] border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-start gap-3 group">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl mt-0.5 shrink-0">
                <CloudSun size={18} className="animate-pulse" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider">Alerta Laranja (Sazonalidade)</span>
                  <span className="text-[10px] text-gray-400">Há 2 horas</span>
                </div>
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Previsão Climática: Chuva Forte na Semana de Colheita</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  Previsão indica precipitação intensa (&gt;45mm/dia) na província da Huíla entre 24/07 e 28/07. Risco elevado de perda de grãos no <strong className="text-amber-500 font-semibold">Talhão Alfa (Milho)</strong> se a colheita for atrasada.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCoopTab('operations');
                      localStorage.setItem(`olo-fintel-lastSector-${user?.id}`, 'AGRICULTURE');
                      localStorage.setItem(`olo-fintel-lastResource-${user?.id}`, 'colheitas');
                      setRefreshCounter(prev => prev + 1);
                    }}
                    className="px-2.5 py-1 bg-amber-500 text-white font-bold text-[9px] rounded-lg hover:bg-amber-600 transition-all cursor-pointer"
                  >
                    Adiantar Colheita
                  </button>
                  <button
                    onClick={() => {
                      setCommandPaletteActiveOption('COLHEITA');
                      setShowCommandPalette(true);
                    }}
                    className="px-2.5 py-1 bg-amber-500/10 text-amber-500 font-bold text-[9px] rounded-lg hover:bg-amber-500/20 transition-all cursor-pointer"
                  >
                    Registo Rápido (⌘K)
                  </button>
                </div>
              </div>
            </div>
          )}

          {(selectedAlertSector === 'ALL' || selectedAlertSector === 'LIVESTOCK') && (
            <div className="p-4 rounded-2xl bg-yellow-500/[0.04] dark:bg-yellow-500/[0.02] border border-yellow-500/20 hover:border-yellow-500/40 transition-all flex items-start gap-3 group">
              <div className="p-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-xl mt-0.5 shrink-0">
                <Activity size={18} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">Alerta Amarelo (Conversão Alimentar)</span>
                  <span className="text-[10px] text-gray-400">Hoje</span>
                </div>
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Monitoria Pendente: Lote Engorda A sem Pesagem</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  O gado do <strong className="font-semibold text-yellow-600 dark:text-yellow-400">Lote Engorda A (BOV-045)</strong> não é pesado há 15 dias. O controlo estrito de conversão alimentar é necessário para garantir a eficiência produtiva antes do abate.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCoopTab('operations');
                      localStorage.setItem(`olo-fintel-lastSector-${user?.id}`, 'LIVESTOCK');
                      localStorage.setItem(`olo-fintel-lastResource-${user?.id}`, 'crescimento');
                      setRefreshCounter(prev => prev + 1);
                    }}
                    className="px-2.5 py-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-[9px] rounded-lg transition-all cursor-pointer"
                  >
                    Pesagem de Rebanho
                  </button>
                  <button
                    onClick={() => {
                      setCommandPaletteActiveOption('PESO');
                      setShowCommandPalette(true);
                    }}
                    className="px-2.5 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-bold text-[9px] rounded-lg hover:bg-yellow-500/20 transition-all cursor-pointer"
                  >
                    Registo Rápido (⌘K)
                  </button>
                </div>
              </div>
            </div>
          )}

          {(selectedAlertSector === 'ALL' || selectedAlertSector === 'COMMERCE') && (
            <div className="p-4 rounded-2xl bg-red-500/[0.04] dark:bg-red-500/[0.02] border border-red-500/20 hover:border-red-500/40 transition-all flex items-start gap-3 group">
              <div className="p-2 bg-red-500/10 text-red-500 rounded-xl mt-0.5 shrink-0">
                <TrendingUp size={18} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-red-500 uppercase tracking-wider">Alerta Vermelho (Margem Crítica)</span>
                  <span className="text-[10px] text-gray-400">Ontem</span>
                </div>
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Margem do Arroz Agulha Caiu abaixo de 10%</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  Margem comercial do produto de giro alto <strong className="text-red-500 font-semibold">Arroz Agulha (ALIM-001)</strong> está atualmente em 8.5% (limiar de segurança de 10%) devido ao aumento do preço de custo pelo fornecedor AngoAlimentos.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCoopTab('operations');
                      localStorage.setItem(`olo-fintel-lastSector-${user?.id}`, 'COMMERCE');
                      localStorage.setItem(`olo-fintel-lastResource-${user?.id}`, 'produtos');
                      setRefreshCounter(prev => prev + 1);
                    }}
                    className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white font-bold text-[9px] rounded-lg transition-all cursor-pointer"
                  >
                    Reajustar Preço
                  </button>
                  <button
                    onClick={() => {
                      setCoopTab('crm');
                    }}
                    className="px-2.5 py-1 bg-red-500/10 text-red-500 font-bold text-[9px] rounded-lg hover:bg-red-500/20 transition-all cursor-pointer"
                  >
                    Consultar Fornecedores
                  </button>
                </div>
              </div>
            </div>
          )}

          {(selectedAlertSector === 'ALL' || selectedAlertSector === 'FISHERIES') && (
            <div className="p-4 rounded-2xl bg-orange-500/[0.04] dark:bg-orange-500/[0.02] border border-orange-500/20 hover:border-orange-500/40 transition-all flex items-start gap-3 group">
              <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl mt-0.5 shrink-0">
                <Wrench size={18} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-orange-500 uppercase tracking-wider">Alerta Laranja (Manutenção Preventiva)</span>
                  <span className="text-[10px] text-gray-400">Há 3 dias</span>
                </div>
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Motor Yamaha 250HP Atingiu Horas de Revisão</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  O motor da embarcação <strong className="font-semibold text-orange-500">Estrela do Namibe</strong> registou 512 horas activas de navegação. Recomenda-se realizar a manutenção preventiva das 500 horas imediatamente para evitar avarias marítimas.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCoopTab('operations');
                      localStorage.setItem(`olo-fintel-lastSector-${user?.id}`, 'FISHERIES');
                      localStorage.setItem(`olo-fintel-lastResource-${user?.id}`, 'manutencaoPesca');
                      setRefreshCounter(prev => prev + 1);
                    }}
                    className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[9px] rounded-lg transition-all cursor-pointer"
                  >
                    Agendar Revisão
                  </button>
                  <button
                    onClick={() => {
                      setCommandPaletteActiveOption('VIAGEM');
                      setShowCommandPalette(true);
                    }}
                    className="px-2.5 py-1 bg-orange-500/10 text-orange-500 font-bold text-[9px] rounded-lg hover:bg-orange-500/20 transition-all cursor-pointer"
                  >
                    Iniciar Viagem (⌘K)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
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
              Anel de Identidade Económica (OLO Score)
            </h3>
            <p className="text-xs text-gray-400">Analise seu score de elegibilidade a crédito em tempo real e simule impactos operacionais.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-150 dark:border-gray-800">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="58" className="stroke-gray-200 dark:stroke-gray-800" strokeWidth="10" fill="transparent" />
                  <circle
                    cx="72" cy="72" r="58"
                    className="stroke-brand-purple transition-all duration-500"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 58}
                    strokeDashoffset={2 * Math.PI * 58 * (1 - Math.min(100, Math.round((user.fundingScore || 68) + (simRevenueIncrease * 0.15) + (simResolvedChecklist * 5))) / 100)}
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
                  type="range" min="0" max="100" step="10"
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
                  type="range" min="0" max="5"
                  value={simResolvedChecklist}
                  onChange={(e) => setSimResolvedChecklist(Number(e.target.value))}
                  className="w-full accent-brand-purple"
                />
              </div>
            </div>
          </div>

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
                  <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${item.done ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {item.done ? '✓' : '◷'}
                  </span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Quick Actions */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-brand-iris/10 text-brand-iris text-[10px] font-bold uppercase tracking-wider">Acesso Rápido</span>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2">Painel de Operações Rápidas</h3>
            <p className="text-xs text-gray-400">Lance registos operacionais, envie certidões de conformidade ou contacte a IA de suporte.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => { setLogType('SALE'); setShowLogModal(true); }}
              className="p-4 bg-gray-50 hover:bg-brand-purple/5 dark:bg-black/20 border border-gray-150 dark:border-gray-800 rounded-2xl text-left transition-all hover:border-brand-purple/30 group"
            >
              <span className="text-xl block mb-2">💰</span>
              <h4 className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-purple">Lançar Venda</h4>
              <p className="text-[10px] text-gray-400 mt-1">Registe receitas e actualize fluxo de caixa.</p>
            </button>
            <button
              onClick={() => { setLogType('EXPENSE'); setShowLogModal(true); }}
              className="p-4 bg-gray-50 hover:bg-brand-purple/5 dark:bg-black/20 border border-gray-150 dark:border-gray-800 rounded-2xl text-left transition-all hover:border-brand-purple/30 group"
            >
              <span className="text-xl block mb-2">💸</span>
              <h4 className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-purple">Lançar Despesa</h4>
              <p className="text-[10px] text-gray-400 mt-1">Introduza custos logísticos e taxas.</p>
            </button>
            <button
              onClick={() => { setDocType('NIF'); setShowDocModal(true); }}
              className="p-4 bg-gray-50 hover:bg-brand-purple/5 dark:bg-black/20 border border-gray-150 dark:border-gray-800 rounded-2xl text-left transition-all hover:border-brand-purple/30 group"
            >
              <span className="text-xl block mb-2">📂</span>
              <h4 className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-purple">Submeter Documento</h4>
              <p className="text-[10px] text-gray-400 mt-1">Carregar NIF ou Alvará em PDF.</p>
            </button>
            <button
              onClick={() => { alert('Direcionando para o Módulo de Recursos e Cadeia de Produção!'); }}
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
                <h4 className="font-bold text-xs text-gray-900 dark:text-white">Diagnóstico OLO por IA</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Prepare sua submissão de fomento.</p>
              </div>
            </div>
            <button
              onClick={() => { alert('Para consultar as análises avançadas da IA, aceda ao separador "AI Center" no topo do ecrã.'); }}
              className="px-3 py-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-[10px] font-bold rounded-lg transition-all"
            >
              Aceder AI Center
            </button>
          </div>
        </div>
      </div>

      {/* --- DASHBOARD UNIVERSAL: 5 PERGUNTAS FUNDAMENTAIS --- */}
      <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm space-y-8">
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

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-iris" />
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('dash.q1')} <span className="text-xs font-normal text-gray-400 font-sans lowercase">{t('dash.q1.sub')}</span>
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.revenue')}</p>
              <p className="text-xl font-bold text-green-500 mt-1.5">{totalRevenue.toLocaleString()} Kz</p>
              <p className="text-[10px] text-gray-400 mt-1 font-mono">{operationalLogs.filter(l => l.type === 'SALE').length} {t('dash.revenue_desc')}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.expenses')}</p>
              <p className="text-xl font-bold text-red-500 mt-1.5">{totalExpense.toLocaleString()} Kz</p>
              <p className="text-[10px] text-gray-400 mt-1 font-mono">{operationalLogs.filter(l => l.type === 'EXPENSE').length} {t('dash.expenses_desc')}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.margin')}</p>
              <p className={`text-xl font-bold mt-1.5 ${netMargin >= 0 ? 'text-brand-iris' : 'text-red-500'}`}>
                {netMargin.toLocaleString()} Kz
              </p>
              <p className="text-[10px] font-semibold text-gray-500 mt-1">
                {t('dash.margin_sub')}: <span className="font-bold text-brand-purple">{marginPercentage}%</span>
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.liquidity')}</p>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <p className="text-xl font-bold text-gray-900 dark:text-white">{liquidityRatio}x</p>
                <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${liquidityStatus === 'Excelente' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
                  {liquidityStatus}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{t('dash.liquidity_desc')}</p>
            </div>
            <div className="p-4 bg-brand-purple/5 border border-brand-purple/10 rounded-2xl">
              <p className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">{t('dash.funding_score')}</p>
              <p className="text-2xl font-black text-brand-purple mt-1">{user.fundingScore} <span className="text-xs font-normal text-gray-400">/ 100</span></p>
              <p className="text-[10px] font-semibold text-brand-purple/80 mt-1 uppercase">{t('dash.maturity')} {user.maturity}</p>
            </div>
          </div>
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('dash.q2')} <span className="text-xs font-normal text-gray-400 font-sans lowercase">{t('dash.q2.sub')}</span>
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.health_financial')}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{financialHealth}</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.health_operational')}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{operationalHealth}</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-brand-iris" />
            </div>
            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.health_documental')}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{documentalHealth}</p>
              </div>
              <span className={`w-2 h-2 rounded-full ${documentalHealthScore >= 85 ? 'bg-green-500' : 'bg-amber-500'}`} />
            </div>
            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash.health_commercial')}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{commercialHealth}</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
          </div>
        </div>

        {/* Q3, Q4, Q5 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          {/* Q3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t('dash.q3')}</h4>
            </div>
            <div className="space-y-3">
              {costAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex flex-col gap-1.5 transition-all ${
                    alert.severity === 'high' ? 'bg-red-500/5 border-red-500/10' :
                    alert.severity === 'medium' ? 'bg-amber-500/5 border-amber-500/10' :
                    'bg-gray-50 dark:bg-black/10 border-gray-200 dark:border-gray-800'
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
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Q4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t('dash.q4')}</h4>
            </div>
            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-4">
              <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{t('dash.q4.tasks')}</p>
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
                    <span className={`leading-tight transition-all ${(task.done || checkedTasks.includes(task.id)) ? 'line-through text-gray-400 dark:text-gray-600 font-normal' : 'font-semibold group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                      {task.text}
                    </span>
                  </label>
                ))}
              </div>
              {!documentsQueue.some(d => d.type === 'NIF') && (
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-semibold flex items-start gap-1.5 leading-snug">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>{t('dash.q4.warning')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Q5 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t('dash.q5')}</h4>
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
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${rec.priority === 'Alta' ? 'bg-red-100 dark:bg-red-950 text-red-600' : 'bg-blue-100 dark:bg-blue-950 text-blue-600'}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">{rec.desc}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => alert('Parabéns! Recomendações enviadas para a mentoria do consultor.')}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
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
            let detectedType: 'HARVEST' | 'ANIMAL' | 'CATCH' | 'SALE' | 'EXPENSE' = 'SALE';
            if (user?.industry === 'AGRICULTURE') detectedType = 'HARVEST';
            else if (user?.industry === 'LIVESTOCK') detectedType = 'ANIMAL';
            else if (user?.industry === 'FISHERIES') detectedType = 'CATCH';
            else if (user?.industry === 'COMMERCE') detectedType = 'SALE';
            else if (user?.industry === 'TRANSPORT') detectedType = 'EXPENSE';
            setLogType(detectedType);
            setShowLogModal(true);
          }}
          className={`p-5 rounded-2xl bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer ${
            user.industry === 'AGRICULTURE' ? 'hover:border-green-500/50' :
            user.industry === 'LIVESTOCK' ? 'hover:border-amber-500/50' :
            user.industry === 'FISHERIES' ? 'hover:border-blue-500/50' :
            user.industry === 'COMMERCE' ? 'hover:border-brand-purple/50' :
            'hover:border-brand-iris/50'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
            user.industry === 'AGRICULTURE' ? 'bg-green-500/10 text-green-500' :
            user.industry === 'LIVESTOCK' ? 'bg-amber-500/10 text-amber-500' :
            user.industry === 'FISHERIES' ? 'bg-blue-500/10 text-blue-500' :
            user.industry === 'COMMERCE' ? 'bg-brand-purple/10 text-brand-purple' :
            'bg-brand-iris/10 text-brand-iris'
          }`}>
            {user.industry === 'AGRICULTURE' && <Sprout size={20} />}
            {user.industry === 'LIVESTOCK' && <Activity size={20} />}
            {user.industry === 'FISHERIES' && <Ship size={20} />}
            {['COMMERCE', 'TRANSPORT', null].includes(user.industry) && <Activity size={20} />}
          </div>
          <span className="text-xs font-bold text-gray-800 dark:text-white">
            {user.industry === 'AGRICULTURE' ? 'Módulo Agrícola' :
             user.industry === 'LIVESTOCK' ? 'Módulo Pecuário' :
             user.industry === 'FISHERIES' ? 'Módulo de Pescas' :
             user.industry === 'COMMERCE' ? 'Módulo Comercial' :
             'Módulo Operacional'}
          </span>
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
    </>
  );
}
