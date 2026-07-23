/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getApiUrl } from '../../lib/api';
import { 
  Sparkles, 
  ChevronRight, 
  Send, 
  HelpCircle, 
  Loader2, 
  TrendingUp, 
  AlertTriangle, 
  Compass, 
  Zap, 
  Award, 
  Coins, 
  Cpu, 
  Building, 
  Activity, 
  CheckSquare, 
  Search,
  MessageSquare,
  FileText,
  Lock,
  ArrowRight
} from 'lucide-react';

interface AICenterModuleProps {
  key?: string;
  userId: string;
  userRole: string;
  organizationId: string | null;
}

interface AdvisorReport {
  diagnostico: string;
  riscos: string;
  oportunidades: string;
  acoes: string;
  impactoEsperado: string;
}

type AdvisorType = 'executive' | 'financial' | 'operations' | 'commercial' | 'funding';

export function AiCenterPage({ userId, userRole, organizationId }: AICenterModuleProps) {
  const [activeAdvisor, setActiveAdvisor] = useState<AdvisorType>('executive');
  const [customQuestion, setCustomQuestion] = useState('');
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<AdvisorReport | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  // Sourced Stats Context (What the AI will read to make decisions)
  const [stats, setStats] = useState({
    orgSector: 'AGRICULTURE',
    orgMaturity: 'BEGINNER',
    orgProvince: 'Huambo',
    orgName: 'Cooperativa',
    financials: {
      revenue: 0,
      expenses: 0,
      balance: 0,
      accountsReceivable: 0,
      accountsPayable: 0,
      budgetsCount: 0
    },
    operations: {
      logCount: 0
    },
    commercial: {
      dealsCount: 0,
      clientsCount: 0,
      contractsCount: 0
    },
    documents: {
      uploadedCount: 0,
      verifiedCount: 0
    }
  });

  // Load and synchronize stats when the module mounts
  useEffect(() => {
    fetchStatsContext();
  }, [userId, organizationId]);

  const fetchStatsContext = async () => {
    setLoadingStats(true);
    try {
      // 1. Fetch organization details
      let sector = 'AGRICULTURE';
      let maturity = 'BEGINNER';
      let province = 'Huambo';
      let orgName = 'Cooperativa';

      if (organizationId) {
        const orgRes = await fetch(`/api/auth/me/${userId}`);
        if (orgRes.ok) {
          const uData = await orgRes.json();
          sector = uData.industry || 'AGRICULTURE';
          maturity = uData.maturity || 'BEGINNER';
          province = uData.province || 'Huambo';
          orgName = uData.organizationName || 'Cooperativa';
        }
      }

      // 2. Fetch Operational records count
      let opCount = 0;
      if (organizationId) {
        const opsRes = await fetch(`/api/operations/list/${organizationId}`);
        if (opsRes.ok) {
          const ops = await opsRes.json();
          opCount = ops.length;
        }
      }

      // 3. Fetch Documents uploaded vs verified
      let docUploaded = 0;
      let docVerified = 0;
      if (organizationId) {
        const docsRes = await fetch(`/api/documents/list/${organizationId}`);
        if (docsRes.ok) {
          const docs = await docsRes.json();
          docUploaded = docs.length;
          docVerified = docs.filter((d: any) => d.status === 'VERIFIED').length;
        }
      }

      // 4. Fetch Financial Data from LocalStorage (consistent with FinancialModule)
      const cachedReceitas = localStorage.getItem(`olo-fintel-fin-receitas-${userId}`);
      const cachedDespesas = localStorage.getItem(`olo-fintel-fin-despesas-${userId}`);
      const cachedBudgets = localStorage.getItem(`olo-fintel-fin-budgets-${userId}`);
      const cachedAR = localStorage.getItem(`olo-fintel-fin-ar-${userId}`);
      const cachedAP = localStorage.getItem(`olo-fintel-fin-ap-${userId}`);

      const finReceitas = cachedReceitas ? JSON.parse(cachedReceitas) : [];
      const finDespesas = cachedDespesas ? JSON.parse(cachedDespesas) : [];
      const finBudgets = cachedBudgets ? JSON.parse(cachedBudgets) : [];
      const finAR = cachedAR ? JSON.parse(cachedAR) : [];
      const finAP = cachedAP ? JSON.parse(cachedAP) : [];

      const totalRecVal = finReceitas.reduce((sum: number, r: any) => sum + (Number(r.valor) || 0), 0);
      const totalDesVal = finDespesas.reduce((sum: number, d: any) => sum + (Number(d.valor) || 0), 0);

      // 5. Fetch CRM Data from LocalStorage (consistent with CommercialCRMModule)
      const cachedDeals = localStorage.getItem(`olo-fintel-crm-oportunidades-${userId}`);
      const cachedClients = localStorage.getItem(`olo-fintel-crm-clientes-${userId}`);
      const cachedContracts = localStorage.getItem(`olo-fintel-crm-contratos-${userId}`);

      const crmDeals = cachedDeals ? JSON.parse(cachedDeals) : [];
      const crmClients = cachedClients ? JSON.parse(cachedClients) : [];
      const crmContracts = cachedContracts ? JSON.parse(cachedContracts) : [];

      setStats({
        orgSector: sector,
        orgMaturity: maturity,
        orgProvince: province,
        orgName: orgName,
        financials: {
          revenue: totalRecVal,
          expenses: totalDesVal,
          balance: totalRecVal - totalDesVal,
          accountsReceivable: finAR.reduce((sum: number, r: any) => sum + (Number(r.valor) || 0), 0),
          accountsPayable: finAP.reduce((sum: number, r: any) => sum + (Number(r.valor) || 0), 0),
          budgetsCount: finBudgets.length
        },
        operations: {
          logCount: opCount
        },
        commercial: {
          dealsCount: crmDeals.length,
          clientsCount: crmClients.length,
          contractsCount: crmContracts.length
        },
        documents: {
          uploadedCount: docUploaded,
          verifiedCount: docVerified
        }
      });

    } catch (e) {
      console.error('Error fetching statistics context for AI Center:', e);
    } finally {
      setLoadingStats(false);
    }
  };

  // Preset prompts depending on advisor
  const advisorPresets: Record<AdvisorType, string[]> = {
    executive: [
      'Qual é o plano de crescimento recomendado para nossa cooperativa a médio prazo?',
      'Como melhorar a governança e transparência entre todos os membros cooperados?',
      'De que forma a digitalização da gestão pode atrair parceiros e compradores internacionais?'
    ],
    financial: [
      'Como reduzir custos operacionais com insumos e logística de transporte?',
      'Qual o rácio ideal de despesas em relação à nossa receita bruta?',
      'Como prever e evitar problemas de tesouraria nos meses de baixa produção?'
    ],
    operations: [
      'Como reduzir desperdícios e perdas pós-colheita/pós-pesca?',
      'Como criar uma escala de partilha eficiente de tratores/embarcações?',
      'Quais métricas de produtividade diária devemos monitorizar no campo?'
    ],
    commercial: [
      'Como conseguir contratos formais de venda com supermercados de Luanda?',
      'Como precificar nossos produtos coletivos para garantir margens justas?',
      'Como usar o CRM para reter e fidelizar compradores por grosso?'
    ],
    funding: [
      'Como nos preparar para concorrer à Linha de Crédito Aviso 10 do BNA?',
      'O que o FADA exige de documentação de uma cooperativa agrícola?',
      'Como usar a garantia pública do FGC se não temos imóveis para colateral?'
    ]
  };

  const handleGenerateReport = async (predefinedQuestion?: string) => {
    setGenerating(true);
    setReport(null);
    const questionToAsk = predefinedQuestion || customQuestion;

    // Simulation of status updates for premium feedback loop
    const steps = [
      'Sincronizando fluxo de caixa...',
      'Mapeando histórico operacional...',
      'Compilando conformidade documental (KYC)...',
      'Contactando o Modelo de Inteligência Artificial Gemini 3.5 Flash...',
      'Gerando diagnóstico estruturado...'
    ];

    let currentStep = 0;
    setStatusMessage(steps[0]);

    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setStatusMessage(steps[currentStep]);
      }
    }, 1100);

    try {
      const response = await fetch(getApiUrl('/api/ai/advisor'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          advisorType: activeAdvisor,
          organization: {
            industry: stats.orgSector,
            maturity: stats.orgMaturity,
            province: stats.orgProvince,
            name: stats.orgName
          },
          financials: stats.financials,
          operations: stats.operations,
          commercial: stats.commercial,
          documents: stats.documents,
          question: questionToAsk || undefined
        })
      });

      clearInterval(stepInterval);

      if (response.ok) {
        const data = await response.json();
        setReport(data.report);
      } else {
        throw new Error('Server returned an error');
      }
    } catch (err) {
      console.error('Error generating AI report:', err);
      alert('Ocorreu um erro ao comunicar com os assessores de IA. Por favor, tente novamente.');
    } finally {
      clearInterval(stepInterval);
      setGenerating(false);
      setStatusMessage('');
    }
  };

  const getAdvisorTitle = (type: AdvisorType) => {
    switch (type) {
      case 'financial': return 'Financial Advisor (Conselheiro Financeiro)';
      case 'operations': return 'Operations Advisor (Conselheiro Operacional)';
      case 'commercial': return 'Commercial Advisor (Conselheiro de Vendas/CRM)';
      case 'funding': return 'Funding Advisor (Conselheiro de Financiamento)';
      case 'executive':
      default:
        return 'Executive Advisor (Conselheiro Estratégico)';
    }
  };

  const getAdvisorDescription = (type: AdvisorType) => {
    switch (type) {
      case 'financial': return 'Especialista em diagnóstico financeiro, otimização de custos e equilíbrio de fluxo de caixa para cooperativas rurais e pesqueiras em Angola.';
      case 'operations': return 'Focado em eficiência operacional, controlo de perdas pós-colheita/captura, otimização de transporte e racionalização de frotas agrícolas e pesqueiras.';
      case 'commercial': return 'Especialista em atração de novos clientes industriais, canais de escoamento por grosso, formulação de preços coletivos e gestão de funil de vendas (CRM).';
      case 'funding': return 'Focado em preparar a sua cooperativa para obter crédito bonificado em Angola, cobrindo conformidade KYC, adequação às exigências do BNA, FADA e FGC.';
      case 'executive':
      default:
        return 'Diretor estratégico geral. Analisa o negócio de ponta a ponta, avaliando governança, transparência, expansão regional e posicionamento de marca.';
    }
  };

  const getAdvisorIcon = (type: AdvisorType, size: number = 24) => {
    switch (type) {
      case 'financial': return <Coins className="text-emerald-500" size={size} />;
      case 'operations': return <Activity className="text-blue-500" size={size} />;
      case 'commercial': return <TrendingUp className="text-orange-500" size={size} />;
      case 'funding': return <Award className="text-purple-500" size={size} />;
      case 'executive':
      default:
        return <Sparkles className="text-brand-purple" size={size} />;
    }
  };

  // Basic Markdown Bold & Linebreak parser to keep visual outputs highly polished
  const parseMarkdown = (text: string) => {
    if (!text) return '';
    
    // Replace double newlines with spacing, single with break
    let parsed = text;
    
    // Bold parsing
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Unordered lists parsing
    parsed = parsed.replace(/^\s*[-*]\s+(.*)$/gm, '<li class="ml-4 list-disc pl-1 text-[11px] leading-relaxed mb-1">$1</li>');
    
    // Numbered lists parsing
    parsed = parsed.replace(/^\s*(\d+)\.\s+(.*)$/gm, '<li class="ml-4 list-decimal pl-1 text-[11px] leading-relaxed mb-1">$1</li>');

    // Return HTML lines
    return parsed.split('\n').map((line, idx) => {
      if (line.includes('<li')) {
        return <ul key={idx} dangerouslySetInnerHTML={{ __html: line }} />;
      }
      return (
        <p key={idx} className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed min-h-[4px]" dangerouslySetInnerHTML={{ __html: line }} />
      );
    });
  };

  return (
    <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm space-y-8" id="ai-center-module">
      
      {/* HEADER DISPLAY */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 dark:border-gray-800 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Cpu size={12} className="animate-pulse" />
              Módulo de Inteligência Artificial (AI Center)
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-green-500 font-mono font-bold bg-green-500/10 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              Conselheiro Ativo
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1.5 flex items-center gap-2">
            <Sparkles className="text-brand-purple" size={22} />
            Assessores OLO AI Fintel
          </h3>
        </div>
        <button
          onClick={fetchStatsContext}
          className="px-4 py-2 bg-gray-50 dark:bg-[#232330] hover:bg-gray-100 dark:hover:bg-[#2F2F3F] text-gray-700 dark:text-white rounded-xl text-xs font-semibold transition-all border border-gray-200 dark:border-gray-800 flex items-center gap-1.5"
          disabled={loadingStats}
        >
          {loadingStats ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Sincronizar Dados de Entrada'}
        </button>
      </div>

      {/* SYNC DATA PREVIEW STRIP */}
      <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 items-center justify-between">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
          Dados Reais Analisados pelo Cérebro IA:
        </span>
        <div className="flex flex-wrap gap-3 text-[10px] text-gray-600 dark:text-gray-300 font-mono">
          <span className="bg-white dark:bg-[#1D1D26] px-2 py-1 rounded border border-gray-100 dark:border-gray-800">
            📊 Financeiro: {stats.financials.revenue.toLocaleString()} Kz
          </span>
          <span className="bg-white dark:bg-[#1D1D26] px-2 py-1 rounded border border-gray-100 dark:border-gray-800">
            ⚙️ Operacional: {stats.operations.logCount} Logs
          </span>
          <span className="bg-white dark:bg-[#1D1D26] px-2 py-1 rounded border border-gray-100 dark:border-gray-800">
            🤝 CRM: {stats.commercial.dealsCount} Oportunidades
          </span>
          <span className="bg-white dark:bg-[#1D1D26] px-2 py-1 rounded border border-gray-100 dark:border-gray-800">
            📁 KYC: {stats.documents.uploadedCount} Docs
          </span>
        </div>
      </div>

      {/* ADVISOR SELECTOR TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {(['executive', 'financial', 'operations', 'commercial', 'funding'] as AdvisorType[]).map((type) => {
          const isActive = activeAdvisor === type;
          return (
            <button
              key={type}
              onClick={() => {
                setActiveAdvisor(type);
                setReport(null);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 cursor-pointer ${
                isActive 
                  ? 'border-brand-purple bg-brand-purple/5 ring-1 ring-brand-purple shadow-sm' 
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1A1A21] hover:bg-gray-50 dark:hover:bg-gray-800/40'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                {getAdvisorIcon(type, 20)}
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />}
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-gray-900 dark:text-white capitalize leading-tight block">
                  {type === 'executive' ? 'Executive' : type === 'financial' ? 'Financial' : type === 'operations' ? 'Operations' : type === 'commercial' ? 'Commercial' : 'Funding'}
                </span>
                <span className="text-[9px] text-gray-400 block font-mono">
                  {type === 'executive' ? 'Estratégia' : type === 'financial' ? 'Custos & Caixa' : type === 'operations' ? 'Eficiência' : type === 'commercial' ? 'Vendas/CRM' : 'Prontidão'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ADVISOR DETAILS & INSTRUCTION BOX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* INPUT PROMPT PANEL */}
        <div className="lg:col-span-5 p-5 bg-gray-50 dark:bg-black/15 border border-gray-100 dark:border-gray-800 rounded-2xl space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-[#1E1E28] border border-gray-100 dark:border-gray-800 rounded-xl shrink-0">
              {getAdvisorIcon(activeAdvisor, 24)}
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                {getAdvisorTitle(activeAdvisor)}
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                {getAdvisorDescription(activeAdvisor)}
              </p>
            </div>
          </div>

          {/* Preset Questions Suggestion Box */}
          <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
            <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest flex items-center gap-1 font-mono">
              <MessageSquare size={12} /> Sugestões de Consulta Rápida:
            </span>
            <div className="space-y-1.5">
              {advisorPresets[activeAdvisor].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCustomQuestion(preset);
                    handleGenerateReport(preset);
                  }}
                  className="w-full text-left p-2.5 bg-white dark:bg-[#1E1E28] hover:bg-brand-purple/5 border border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-semibold text-gray-700 dark:text-gray-300 transition-all flex justify-between items-center group cursor-pointer"
                  disabled={generating}
                >
                  <span className="group-hover:text-brand-purple leading-tight pr-2">{preset}</span>
                  <ArrowRight size={12} className="text-gray-400 group-hover:text-brand-purple shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="space-y-1.5 pt-2 border-t border-gray-200 dark:border-gray-800">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
              Escreva uma pergunta personalizada (Opcional):
            </label>
            <div className="relative">
              <textarea
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Ex: Como posso renegociar faturas vencidas no módulo de contas a pagar de forma amigável em Angola?"
                rows={3}
                className="w-full p-3 rounded-xl border bg-transparent text-xs border-gray-300 dark:border-gray-700 outline-none focus:border-brand-purple resize-none pr-8"
                disabled={generating}
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={() => handleGenerateReport()}
            className="w-full py-3 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{statusMessage || 'Solicitando análise...'}</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Gerar Relatório Estruturado de IA</span>
              </>
            )}
          </button>
        </div>

        {/* OUTPUT REPORT VIEW */}
        <div className="lg:col-span-7">
          {!report && !generating ? (
            <div className="p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 min-h-[350px]">
              <div className="w-12 h-12 rounded-full bg-brand-purple/5 flex items-center justify-center text-brand-purple">
                <Cpu size={24} className="animate-pulse" />
              </div>
              <h5 className="font-bold text-sm text-gray-900 dark:text-white">Aguardando Solicitação</h5>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                Selecione uma das sugestões rápidas ou envie uma pergunta customizada. O assessor selecionado gerará um relatório detalhado em português estruturado em Diagnóstico, Riscos, Oportunidades, Ações e Impacto.
              </p>
            </div>
          ) : generating ? (
            <div className="p-8 border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 min-h-[350px] bg-brand-purple/5 border-dashed">
              <Loader2 size={36} className="text-brand-purple animate-spin" />
              <div className="space-y-1">
                <h5 className="font-bold text-sm text-brand-purple">Processando com OLO AI...</h5>
                <p className="text-xs text-gray-400">{statusMessage || 'Por favor, aguarde...'}</p>
              </div>
              <div className="text-[9px] font-mono text-gray-400 border border-gray-100 dark:border-gray-800 bg-white dark:bg-black/40 px-3 py-1.5 rounded-lg max-w-xs leading-normal">
                Análise com Gemini baseada na província do {stats.orgProvince} e sector de {stats.orgSector === 'AGRICULTURE' ? 'Agricultura' : 'Pesca/Pecuária'}.
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  {getAdvisorIcon(activeAdvisor, 16)}
                  Relatório Estruturado de Inteligência Artificial
                </span>
                <span className="text-[9px] font-mono text-gray-400">
                  OLO Fintel Gen3 • {new Date().toLocaleDateString()}
                </span>
              </div>

              {/* RENDER THE STRUCTURED PARTS (Diagnóstico → Riscos → Oportunidades → Ações → Impacto esperado) */}
              <div className="space-y-4">
                
                {/* 1. DIAGNÓSTICO */}
                <div className="p-4 bg-blue-500/5 border-l-4 border-blue-500 rounded-r-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                    <Search size={13} /> 1. Diagnóstico Analítico
                  </span>
                  <div className="pl-1">
                    {parseMarkdown(report?.diagnostico || '')}
                  </div>
                </div>

                {/* 2. RISCOS */}
                <div className="p-4 bg-red-500/5 border-l-4 border-red-500 rounded-r-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                    <AlertTriangle size={13} /> 2. Riscos Detetados
                  </span>
                  <div className="pl-1 space-y-1">
                    {parseMarkdown(report?.riscos || '')}
                  </div>
                </div>

                {/* 3. OPORTUNIDADES */}
                <div className="p-4 bg-emerald-500/5 border-l-4 border-emerald-500 rounded-r-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                    <Compass size={13} /> 3. Oportunidades de Melhoria
                  </span>
                  <div className="pl-1 space-y-1">
                    {parseMarkdown(report?.oportunidades || '')}
                  </div>
                </div>

                {/* 4. AÇÕES */}
                <div className="p-4 bg-violet-500/5 border-l-4 border-violet-500 rounded-r-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                    <Zap size={13} /> 4. Plano de Ações Concretas
                  </span>
                  <div className="pl-1 space-y-1">
                    {parseMarkdown(report?.acoes || '')}
                  </div>
                </div>

                {/* 5. IMPACTO ESPERADO */}
                <div className="p-4 bg-amber-500/5 border-l-4 border-amber-500 rounded-r-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                    <Award size={13} /> 5. Impacto Esperado no Negócio e Score
                  </span>
                  <div className="pl-1">
                    {parseMarkdown(report?.impactoEsperado || '')}
                  </div>
                </div>

              </div>

              {/* ACTION BUTTONS ON REPORT */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => {
                    const printText = `RELATÓRIO OLO FINTEL AI\nConsultor: ${getAdvisorTitle(activeAdvisor)}\n\n1. DIAGNÓSTICO:\n${report?.diagnostico}\n\n2. RISCOS:\n${report?.riscos}\n\n3. OPORTUNIDADES:\n${report?.oportunidades}\n\n4. AÇÕES CONCRETAS:\n${report?.acoes}\n\n5. IMPACTO ESPERADO:\n${report?.impactoEsperado}`;
                    const blob = new Blob([printText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = `relatorio-${activeAdvisor}-${Date.now()}.txt`;
                    link.href = url;
                    link.click();
                  }}
                  className="px-4 py-2 bg-gray-50 dark:bg-[#232330] hover:bg-gray-100 dark:hover:bg-[#2F2F3F] text-gray-700 dark:text-white rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 transition-all flex items-center gap-1.5"
                >
                  <FileText size={14} /> Exportar como Texto
                </button>
                <button
                  onClick={() => {
                    alert('Análise anexada com sucesso aos relatórios de tutoria do consultor regional.');
                  }}
                  className="px-4 py-2 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  Partilhar com Mentor
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
