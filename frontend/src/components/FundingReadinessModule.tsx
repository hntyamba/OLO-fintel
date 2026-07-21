/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getApiUrl } from '../lib/api';
import { 
  Award, 
  Coins, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  Send, 
  FileSpreadsheet, 
  HelpCircle, 
  Briefcase, 
  Loader2,
  ChevronRight,
  Info,
  Calendar,
  Building,
  Check,
  Percent,
  FileText
} from 'lucide-react';

interface FundingReadinessModuleProps {
  key?: string;
  userId: string;
  userRole: string;
  organizationId: string | null;
  onRefresh?: () => void;
}

interface ActionPlanStep {
  title: string;
  description: string;
  category: string;
  impact: 'ALTO' | 'MÉDIO' | 'BAIXO';
}

interface ActionPlan {
  summary: string;
  nextSteps: ActionPlanStep[];
  tips: string[];
}

interface FundingLine {
  id: string;
  name: string;
  entity: string;
  description: string;
  maxAmount: string;
  interestRate: string;
  gracePeriod: string;
  requiredScore: number;
  sectorLimits: string[];
  tips: string;
}

export default function FundingReadinessModule({ 
  userId, 
  userRole, 
  organizationId,
  onRefresh 
}: FundingReadinessModuleProps) {
  
  // --- STATE ---
  const [loadingStats, setLoadingStats] = useState(true);
  
  // Computed dynamic subscores
  const [subscores, setSubscores] = useState({
    financeiro: 10,
    operacional: 5,
    documental: 10,
    comercial: 5
  });
  
  const [checklistItems, setChecklistItems] = useState<Array<{ id: string; text: string; done: boolean; category: string }>>([]);
  const [opCount, setOpCount] = useState(0);
  const [docList, setDocList] = useState<any[]>([]);
  const [orgSector, setOrgSector] = useState<string>('AGRICULTURE');
  const [orgMaturity, setOrgMaturity] = useState<string>('BEGINNER');

  // Interactive Simulations States
  const [simRevenueIncrease, setSimRevenueIncrease] = useState<number>(0); // percentage 0-100
  const [simResolveDocs, setSimResolveDocs] = useState<boolean>(false);
  const [simCloseDeals, setSimCloseDeals] = useState<number>(0); // count 0-5
  const [simLogOps, setSimLogOps] = useState<number>(0); // count 0-10

  // AI Action Plan States
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);

  // Applications States
  const [applications, setApplications] = useState<any[]>([]);
  const [showApplyModal, setShowApplyModal] = useState<FundingLine | null>(null);
  const [applying, setApplying] = useState(false);
  
  // Apply Form State
  const [applyForm, setApplyForm] = useState({
    amountRequested: '',
    termMonths: '12',
    purpose: 'Capital de Giro',
    contactPhone: '',
    confirmTrueData: false
  });

  // Funding Lines List
  const fundingLines: FundingLine[] = [
    {
      id: 'line-fada',
      name: 'Linha FADA (Fundo de Apoio ao Desenvolvimento Agrário)',
      entity: 'FADA / Ministério da Agricultura',
      description: 'Financiamento bonificado específico para cooperativas agrícolas e camponesas de pequena e média escala para compra de insumos, sementes e pequenas alfaias agrícolas.',
      maxAmount: '15.000.000 Kz',
      interestRate: '3% ao ano',
      gracePeriod: '12 meses',
      requiredScore: 45,
      sectorLimits: ['AGRICULTURE', 'LIVESTOCK'],
      tips: 'Requer registos de colheita atualizados e declaração da cooperativa ativa.'
    },
    {
      id: 'line-bna-av10',
      name: 'Linha de Crédito BNA (Aviso nº 10/2022)',
      entity: 'Bancos Comerciais do Estado (BPC, BCI, BAI)',
      description: 'Fomento à produção nacional de bens essenciais. Taxas de juro bonificadas e garantia mútua do FGC para projetos agro-pecuários, pescas e comércio grossista de insumos.',
      maxAmount: '150.000.000 Kz',
      interestRate: '7.5% ao ano',
      gracePeriod: '18 meses',
      requiredScore: 70,
      sectorLimits: ['AGRICULTURE', 'LIVESTOCK', 'FISHERIES', 'COMMERCE'],
      tips: 'Exige pelo menos 3 meses de registos de tesouraria limpos e Contrato Promessa de venda de produção.'
    },
    {
      id: 'line-pac',
      name: 'PAC (Projecto de Apoio ao Crédito)',
      entity: 'PRODESI / Ministério da Economia e Planeamento',
      description: 'Facilitador de acesso a crédito bancário para cooperativas e PMEs engajadas em fileiras agro-alimentares prioritárias, com cobertura de colaterais pelo Fundo de Garantia de Crédito (FGC).',
      maxAmount: '80.000.000 Kz',
      interestRate: '6.5% ao ano',
      gracePeriod: '24 meses',
      requiredScore: 60,
      sectorLimits: ['AGRICULTURE', 'LIVESTOCK', 'FISHERIES', 'COMMERCE', 'TRANSPORT'],
      tips: 'Apresentar histórico detalhado de transporte ou vendas no módulo de CRM para evidenciar comercialização.'
    },
    {
      id: 'line-fgc-jovem',
      name: 'Garantia de Crédito OLO - Microfomento',
      entity: 'Fundo de Garantia de Crédito & OLO Fintel',
      description: 'Financiamento rápido com dispensa de garantias reais para cooperativas iniciantes ou intermédias em Angola. Foco na inclusão financeira de associações rurais e pesqueiras.',
      maxAmount: '5.000.000 Kz',
      interestRate: '5% ao ano',
      gracePeriod: '6 meses',
      requiredScore: 30,
      sectorLimits: ['AGRICULTURE', 'LIVESTOCK', 'FISHERIES', 'COMMERCE', 'TRANSPORT'],
      tips: 'Basta ter o NIF carregado e validado e pelo menos 3 registos de atividade no sistema.'
    }
  ];

  // Fetch metrics and calculate subscores
  useEffect(() => {
    fetchMetrics();
    loadApplications();
  }, [userId, organizationId]);

  const fetchMetrics = async () => {
    setLoadingStats(true);
    try {
      // 1. Fetch organization details
      let sector = 'AGRICULTURE';
      let maturity = 'BEGINNER';
      if (organizationId) {
        const orgRes = await fetch(`/api/auth/me/${userId}`);
        if (orgRes.ok) {
          const uData = await orgRes.json();
          sector = uData.industry || 'AGRICULTURE';
          maturity = uData.maturity || 'BEGINNER';
          setOrgSector(sector);
          setOrgMaturity(maturity);
        }
      }

      // 2. Fetch Operational records (using the API)
      let ops: any[] = [];
      if (organizationId) {
        const opsRes = await fetch(`/api/operations/list/${organizationId}`);
        if (opsRes.ok) {
          ops = await opsRes.json();
          setOpCount(ops.length);
        }
      }

      // 3. Fetch Documents (using the API)
      let docs: any[] = [];
      if (organizationId) {
        const docsRes = await fetch(`/api/documents/list/${organizationId}`);
        if (docsRes.ok) {
          docs = await docsRes.json();
          setDocList(docs);
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

      // 5. Fetch CRM Data from LocalStorage (consistent with CommercialCRMModule)
      const cachedDeals = localStorage.getItem(`olo-fintel-crm-oportunidades-${userId}`);
      const cachedClients = localStorage.getItem(`olo-fintel-crm-clientes-${userId}`);
      const cachedContracts = localStorage.getItem(`olo-fintel-crm-contratos-${userId}`);

      const crmDeals = cachedDeals ? JSON.parse(cachedDeals) : [];
      const crmClients = cachedClients ? JSON.parse(cachedClients) : [];
      const crmContracts = cachedContracts ? JSON.parse(cachedContracts) : [];

      // CALCULATE SUBSCORES
      // A. Financial Subscore (Max 25)
      let finScore = 0;
      if (finReceitas.length > 0) finScore += 5;
      if (finDespesas.length > 0) finScore += 5;
      if (finBudgets.length > 0) finScore += 5;
      if (finAR.length > 0 || finAP.length > 0) finScore += 5;
      const totalRecVal = finReceitas.reduce((sum: number, r: any) => sum + (Number(r.valor) || 0), 0);
      const totalDesVal = finDespesas.reduce((sum: number, d: any) => sum + (Number(d.valor) || 0), 0);
      if (totalRecVal > totalDesVal && finReceitas.length > 0) finScore += 5;

      // B. Operational Subscore (Max 25)
      // 5 points for each operational record registered, max 25 (5 records)
      const opsScore = Math.min(ops.length * 5, 25);

      // C. Documental Subscore (Max 25)
      // 10 points for having uploaded at least 1 document, and 5 points for each verified document, up to 25
      let docScore = 0;
      if (docs.length > 0) docScore += 10;
      const verifiedCount = docs.filter((d: any) => d.status === 'VERIFIED').length;
      docScore = Math.min(docScore + (verifiedCount * 7.5), 25);

      // D. Commercial Subscore (Max 25)
      let comScore = 0;
      if (crmDeals.length > 0) comScore += 5;
      if (crmClients.length > 0) comScore += 10;
      if (crmContracts.length > 0) comScore += 10;

      setSubscores({
        financeiro: finScore,
        operacional: opsScore,
        documental: Math.round(docScore),
        comercial: comScore
      });

      // CONSTRUCT CHECKLIST
      const items = [
        { id: 'chk-rec', text: 'Registar receitas no Módulo Financeiro', done: finReceitas.length > 0, category: 'Financeiro' },
        { id: 'chk-des', text: 'Registar despesas operacionais', done: finDespesas.length > 0, category: 'Financeiro' },
        { id: 'chk-bud', text: 'Definir orçamentos por centro de custo', done: finBudgets.length > 0, category: 'Financeiro' },
        { id: 'chk-ops', text: `Registar pelo menos 3 fluxos operacionais (Atualmente: ${ops.length})`, done: ops.length >= 3, category: 'Operacional' },
        { id: 'chk-doc-up', text: 'Carregar NIF e alvará comercial', done: docs.length > 0, category: 'Documental' },
        { id: 'chk-doc-ve', text: `Obter a validação técnica de documentos (Atualmente: ${verifiedCount} validados)`, done: verifiedCount >= 2, category: 'Documental' },
        { id: 'chk-crm-deal', text: 'Registar oportunidades comerciais ativas', done: crmDeals.length > 0, category: 'Comercial' },
        { id: 'chk-crm-cli', text: 'Adicionar clientes e parceiros ao CRM', done: crmClients.length > 0, category: 'Comercial' },
        { id: 'chk-crm-con', text: 'Anexar acordos ou contratos de fornecimento futuros', done: crmContracts.length > 0, category: 'Comercial' }
      ];
      setChecklistItems(items);

    } catch (e) {
      console.error('Error computing funding readiness subscores:', e);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadApplications = async () => {
    try {
      const res = await fetch(getApiUrl(`/api/funding/applications/${organizationId || 'guest'}`));
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      } else {
        // Fallback to local storage
        const saved = localStorage.getItem(`olo-funding-apps-${userId}`);
        if (saved) {
          setApplications(JSON.parse(saved));
        }
      }
    } catch (e) {
      const saved = localStorage.getItem(`olo-funding-apps-${userId}`);
      if (saved) {
        setApplications(JSON.parse(saved));
      }
    }
  };

  // SCORE SIMULATIONS CALCULATIONS
  const currentActualScore = Math.min(
    subscores.financeiro + subscores.operacional + subscores.documental + subscores.comercial,
    100
  );

  // Simulated score computation
  const getSimulatedScore = () => {
    let simFin = subscores.financeiro;
    if (simRevenueIncrease > 0) {
      // Revenue increase boosts the financial completeness and ratio score
      simFin = Math.min(simFin + Math.round(simRevenueIncrease / 15), 25);
    }
    
    let simDoc = subscores.documental;
    if (simResolveDocs) {
      simDoc = 25; // All verified
    }

    let simCom = subscores.comercial;
    if (simCloseDeals > 0) {
      simCom = Math.min(simCom + (simCloseDeals * 5), 25);
    }

    let simOp = subscores.operacional;
    if (simLogOps > 0) {
      simOp = Math.min(simOp + (simLogOps * 3), 25);
    }

    return Math.min(simFin + simDoc + simCom + simOp, 100);
  };

  const simulatedScore = getSimulatedScore();

  // Handle AI Action Plan Generation
  const handleGenerateAIPlan = async () => {
    setGeneratingPlan(true);
    setActionPlan(null);

    const requestPayload = {
      subscores,
      currentScore: currentActualScore,
      industry: orgSector,
      maturity: orgMaturity,
      pendingChecklist: checklistItems.filter(item => !item.done).map(i => i.text)
    };

    try {
      const response = await fetch(getApiUrl('/api/funding/action-plan'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (response.ok) {
        const data = await response.json();
        setActionPlan(data.actionPlan);
      } else {
        throw new Error('API failed');
      }
    } catch (err) {
      console.warn('Gemini API action plan failed or not configured, using robust local rule engine fallback.');
      
      // Robust fallbacks based on sector and maturity gaps
      setTimeout(() => {
        const fallbackSteps: ActionPlanStep[] = [];
        if (subscores.financeiro < 15) {
          fallbackSteps.push({
            title: 'Formalizar Diário de Caixa e Fluxo Mensal',
            description: 'Insira registos de receitas e despesas no Módulo Financeiro para gerar demonstrativos legíveis. Bancos comerciais em Angola exigem pelo menos 3 meses de histórico financeiro digitalizado.',
            category: 'Financeiro',
            impact: 'ALTO'
          });
        }
        if (subscores.documental < 20) {
          fallbackSteps.push({
            title: 'Submeter Alvará Comercial e Ata de Constituição da Cooperativa',
            description: 'Envie todos os documentos obrigatórios para validação pela equipa OLO. A falta de documentos verificados é a principal causa de reprovação de crédito (KYC/AML).',
            category: 'Documental',
            impact: 'ALTO'
          });
        }
        if (subscores.comercial < 15) {
          fallbackSteps.push({
            title: 'Firmar Acordo de Fornecimento Futuro (Offtake Agreement)',
            description: 'Registe no CRM o contrato ou intenção de compra com compradores locais (parceiros, hotéis ou distribuidores). Provar canais de escoamento reduz o risco do financiador em até 40%.',
            category: 'Comercial',
            impact: 'MÉDIO'
          });
        }
        if (subscores.operacional < 15) {
          fallbackSteps.push({
            title: 'Manter Registos Operacionais Constantes',
            description: 'Logar pelo menos 2 entradas operacionais semanais (colheitas, animais vacinados ou capturas). Isso prova transparência e capacidade técnica para executar o plano de produção.',
            category: 'Operacional',
            impact: 'MÉDIO'
          });
        }

        // Default addition in case they already have high scores
        if (fallbackSteps.length === 0) {
          fallbackSteps.push({
            title: 'Auditoria de Conformidade e Preparação de Pitch Deck',
            description: 'Com um score excelente de prontidão, prepare uma apresentação estruturada com ajuda de um consultor fintel OLO para aceder à Linha Aviso 10 do BNA.',
            category: 'Financeiro',
            impact: 'ALTO'
          });
        }

        setActionPlan({
          summary: `Com base na maturidade ${orgMaturity} da cooperativa no sector de ${orgSector === 'AGRICULTURE' ? 'Agricultura' : orgSector === 'FISHERIES' ? 'Pesca' : orgSector === 'LIVESTOCK' ? 'Pecuária' : 'Comércio'}, identificamos que o seu score de prontidão para financiamento é de ${currentActualScore}/100. Há excelente margem para acréscimo de pontuação resolvendo pontos cruciais de transparência operacional.`,
          nextSteps: fallbackSteps,
          tips: [
            'Separe rigorosamente as finanças pessoais da direção das finanças da Cooperativa.',
            'Procure submeter candidaturas a taxas bonificadas (como FADA de 3%) antes de recorrer a taxas comerciais.',
            'Mantenha os registos operacionais sempre no mesmo dia da atividade para aumentar o índice de confiabilidade técnica.'
          ]
        });
      }, 1200);
    } finally {
      setGeneratingPlan(false);
    }
  };

  // Submit structured application
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showApplyModal) return;
    if (!applyForm.amountRequested || !applyForm.contactPhone || !applyForm.confirmTrueData) {
      alert('Por favor preencha todos os campos obrigatórios e declare a veracidade dos dados.');
      return;
    }

    setApplying(true);

    const newApp = {
      id: `app-${Date.now()}`,
      orgId: organizationId || 'org-1',
      lineId: showApplyModal.id,
      lineName: showApplyModal.name,
      entity: showApplyModal.entity,
      amountRequested: Number(applyForm.amountRequested),
      termMonths: Number(applyForm.termMonths),
      purpose: applyForm.purpose,
      contactPhone: applyForm.contactPhone,
      submittedAt: new Date().toISOString(),
      status: 'PENDING', // PENDING, IN_REVIEW, APPROVED, REJECTED
      scoreAtSubmission: currentActualScore
    };

    try {
      const res = await fetch(getApiUrl('/api/funding/apply'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      });

      if (res.ok) {
        const data = await res.json();
        setApplications(prev => [data.application, ...prev]);
        alert(`Candidatura ao programa "${showApplyModal.name}" submetida com sucesso! A equipa de analistas OLO Fintel irá avaliar e responder em até 48 horas.`);
        setShowApplyModal(null);
        setApplyForm({
          amountRequested: '',
          termMonths: '12',
          purpose: 'Capital de Giro',
          contactPhone: '',
          confirmTrueData: false
        });
        if (onRefresh) onRefresh();
      } else {
        throw new Error('Server side apply failed');
      }
    } catch (err) {
      // Local fallback
      const updatedList = [newApp, ...applications];
      setApplications(updatedList);
      localStorage.setItem(`olo-funding-apps-${userId}`, JSON.stringify(updatedList));
      alert(`Candidatura ao programa "${showApplyModal.name}" registada com sucesso localmente no simulador!`);
      setShowApplyModal(null);
      setApplyForm({
        amountRequested: '',
        termMonths: '12',
        purpose: 'Capital de Giro',
        contactPhone: '',
        confirmTrueData: false
      });
    } finally {
      setApplying(false);
    }
  };

  const getEligibilityBadge = (score: number, reqScore: number) => {
    if (score >= reqScore) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 uppercase tracking-wider">
          Altamente Elegível
        </span>
      );
    } else if (score >= reqScore - 15) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase tracking-wider">
          Elegível com Requisitos
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 uppercase tracking-wider">
          Requer Ajustes
        </span>
      );
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm space-y-8" id="funding-readiness-module">
      
      {/* MODULE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 dark:border-gray-800 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-wider">
              Análise e Prontidão
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
              <Building size={12} />
              Setor: {orgSector}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1.5 flex items-center gap-2">
            <Award className="text-brand-purple" size={22} />
            Módulo de Prontidão de Financiamento (Funding Readiness)
          </h3>
        </div>
        <button
          onClick={fetchMetrics}
          className="px-4 py-2 bg-gray-50 dark:bg-[#232330] hover:bg-gray-100 dark:hover:bg-[#2F2F3F] text-gray-700 dark:text-white rounded-xl text-xs font-semibold transition-all border border-gray-200 dark:border-gray-800 flex items-center gap-1.5"
          disabled={loadingStats}
        >
          {loadingStats ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Sincronizar Dados'}
        </button>
      </div>

      {/* GRID OVERALL SCORE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SCORE GAUGE */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Score Geral de Crédito</p>
          
          {/* Circular Score representation */}
          <div className="relative w-44 h-44 mt-6 flex items-center justify-center">
            {/* Outer ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="74"
                className="stroke-gray-200 dark:stroke-gray-800"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="88"
                cy="88"
                r="74"
                className="stroke-brand-purple transition-all duration-1000 ease-out"
                strokeWidth="12"
                fill="none"
                strokeDasharray="465"
                strokeDashoffset={465 - (465 * currentActualScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-gray-900 dark:text-white">{currentActualScore}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Pontos</span>
            </div>
          </div>

          <div className="mt-6 w-full space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-semibold">Nível de Maturidade:</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                currentActualScore >= 75 
                  ? 'bg-green-500/10 text-green-500' 
                  : currentActualScore >= 45 
                  ? 'bg-amber-500/10 text-amber-500' 
                  : 'bg-red-500/10 text-red-500'
              }`}>
                {currentActualScore >= 75 ? 'AVANÇADO' : currentActualScore >= 45 ? 'INTERMÉDIO' : 'INICIANTE'}
              </span>
            </div>
            
            {/* Subscores Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
              <div className="text-left p-2 rounded-xl bg-white dark:bg-black/10">
                <span className="text-[9px] text-gray-400 font-bold uppercase">Financeiro</span>
                <p className="text-sm font-black text-brand-purple">{subscores.financeiro} <span className="text-[10px] text-gray-400 font-normal">/25</span></p>
              </div>
              <div className="text-left p-2 rounded-xl bg-white dark:bg-black/10">
                <span className="text-[9px] text-gray-400 font-bold uppercase">Operacional</span>
                <p className="text-sm font-black text-brand-purple">{subscores.operacional} <span className="text-[10px] text-gray-400 font-normal">/25</span></p>
              </div>
              <div className="text-left p-2 rounded-xl bg-white dark:bg-black/10">
                <span className="text-[9px] text-gray-400 font-bold uppercase">Documental</span>
                <p className="text-sm font-black text-brand-purple">{subscores.documental} <span className="text-[10px] text-gray-400 font-normal">/25</span></p>
              </div>
              <div className="text-left p-2 rounded-xl bg-white dark:bg-black/10">
                <span className="text-[9px] text-gray-400 font-bold uppercase">Comercial</span>
                <p className="text-sm font-black text-brand-purple">{subscores.comercial} <span className="text-[10px] text-gray-400 font-normal">/25</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE PENDING CHECKLIST */}
        <div className="lg:col-span-8 space-y-4">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-brand-purple" />
            Checklist de Conformidade OLO Fintel
          </h4>
          <p className="text-xs text-gray-400">
            Atingir 100 pontos de prontidão exige a formalização de todas as vertentes abaixo. Complete as tarefas pendentes nos respetivos módulos superiores.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {checklistItems.map((item) => (
              <div 
                key={item.id} 
                className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                  item.done 
                    ? 'bg-green-500/5 border-green-500/10' 
                    : 'bg-amber-500/5 border-amber-500/10'
                }`}
              >
                {item.done ? (
                  <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`text-xs font-bold leading-tight ${item.done ? 'text-green-800 dark:text-green-300 line-through opacity-70' : 'text-gray-800 dark:text-gray-200'}`}>
                    {item.text}
                  </p>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider mt-1.5 inline-block ${
                    item.category === 'Financeiro' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' 
                      : item.category === 'Documental' 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : item.category === 'Operacional'
                      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                  }`}>
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* INTERACTIVE SCORE PLAYGROUND / SIMULATIONS */}
      <div className="p-6 bg-brand-purple/5 border border-brand-purple/10 rounded-2xl space-y-6">
        <div>
          <h4 className="text-xs font-bold text-brand-purple uppercase tracking-wider flex items-center gap-1.5">
            <Sliders size={16} />
            Simulador de Impacto Financeiro & Operacional
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Projete o impacto de melhorias no seu negócio. Descubra qual seria a sua nota de crédito em tempo real se atingir novas metas de faturação ou regularizar documentos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Simulator Controls */}
          <div className="space-y-4 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Revenue slider */}
            <div className="space-y-2 p-3 bg-white dark:bg-[#1C1C24] border border-gray-100 dark:border-gray-800 rounded-xl">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">Aumento de Receitas</label>
                <span className="text-xs font-mono font-bold text-brand-purple">+{simRevenueIncrease}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={simRevenueIncrease}
                onChange={(e) => setSimRevenueIncrease(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-purple"
              />
              <p className="text-[9px] text-gray-400 font-mono">Reflete incremento nas receitas da cooperativa em Angola.</p>
            </div>

            {/* Close new contracts */}
            <div className="space-y-2 p-3 bg-white dark:bg-[#1C1C24] border border-gray-100 dark:border-gray-800 rounded-xl">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">Novos Contratos Fechados</label>
                <span className="text-xs font-mono font-bold text-brand-purple">+{simCloseDeals} un</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={simCloseDeals}
                onChange={(e) => setSimCloseDeals(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-purple"
              />
              <p className="text-[9px] text-gray-400 font-mono">Simula novos acordos formais assinados e registados.</p>
            </div>

            {/* Log new operations */}
            <div className="space-y-2 p-3 bg-white dark:bg-[#1C1C24] border border-gray-100 dark:border-gray-800 rounded-xl">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">Atividades Registadas</label>
                <span className="text-xs font-mono font-bold text-brand-purple">+{simLogOps} logs</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={simLogOps}
                onChange={(e) => setSimLogOps(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-purple"
              />
              <p className="text-[9px] text-gray-400 font-mono">Projeta histórico operacional consistente no sector.</p>
            </div>

            {/* Resolve all documents checkbox */}
            <div className="p-3 bg-white dark:bg-[#1C1C24] border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase block">Regularizar Documentação</label>
                <span className="text-[9px] text-gray-400 block font-mono">Simular todos docs verificados (25/25)</span>
              </div>
              <input
                type="checkbox"
                checked={simResolveDocs}
                onChange={(e) => setSimResolveDocs(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-purple focus:ring-brand-purple cursor-pointer"
              />
            </div>

          </div>

          {/* SIMULATOR OUTPUT BOX */}
          <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
            <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">Score Projetado</span>
            <div className="mt-2 text-3xl font-black text-brand-purple flex items-baseline gap-1">
              {simulatedScore}
              <span className="text-xs font-normal text-gray-400">/ 100</span>
            </div>
            <div className="mt-3 text-[11px] font-bold text-gray-600 dark:text-gray-300">
              {simulatedScore > currentActualScore ? (
                <span className="text-green-500 font-bold flex items-center gap-1">
                  <TrendingUp size={14} /> +{simulatedScore - currentActualScore} pontos simulados
                </span>
              ) : (
                <span className="text-gray-400">Mova os controles para simular</span>
              )}
            </div>
            
            {/* Action suggestion banner */}
            {simulatedScore >= 60 && currentActualScore < 60 && (
              <p className="mt-3 text-[9px] text-green-600 dark:text-green-400 leading-snug font-semibold bg-green-500/5 p-2 rounded-lg">
                Excelente! Com esta nota simulada de {simulatedScore}, a sua cooperativa ficaria elegível para a Linha PAC do PRODESI!
              </p>
            )}
          </div>

        </div>
      </div>

      {/* AI PLANO DE ACÇÃO */}
      <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="text-brand-purple animate-pulse" size={16} />
              Plano de Ação Inteligente OLO (Gerado por IA)
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              Gerado instantaneamente com recurso a IA generativa com base nas suas lacunas e subscores reais.
            </p>
          </div>
          <button
            onClick={handleGenerateAIPlan}
            className="px-5 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            disabled={generatingPlan}
          >
            {generatingPlan ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                A analisar scores...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Gerar Plano de Ação IA
              </>
            )}
          </button>
        </div>

        {/* AI Action Plan Output */}
        {actionPlan && (
          <div className="p-5 bg-brand-purple/5 border border-brand-purple/10 rounded-2xl space-y-5 animate-fade-in">
            <div>
              <p className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">Análise de Elegibilidade</p>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{actionPlan.summary}</p>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">Passos Recomendados Concretos</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actionPlan.nextSteps.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-[#1C1C24] border border-gray-100 dark:border-gray-800 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-brand-purple/10 text-brand-purple font-bold px-1.5 py-0.5 rounded font-mono">
                        Passo {idx + 1}
                      </span>
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        step.impact === 'ALTO' 
                          ? 'bg-red-500/10 text-red-500' 
                          : step.impact === 'MÉDIO' 
                          ? 'bg-amber-500/10 text-amber-500' 
                          : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        Impacto: {step.impact}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{step.title}</h5>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{step.description}</p>
                    <span className="text-[9px] font-mono text-gray-400 block pt-1 border-t border-gray-100 dark:border-gray-800">
                      Módulo: {step.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-yellow-500/5 border border-yellow-500/10 rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest flex items-center gap-1">
                <Info size={12} /> Conselhos Práticos de Tesouraria em Angola
              </span>
              <ul className="list-disc pl-4 space-y-1 text-[10px] text-gray-600 dark:text-gray-400">
                {actionPlan.tips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* STRUCURED APPLICATION SUBMISSIONS */}
      <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        <div>
          <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase size={16} className="text-brand-purple" />
            Candidaturas Estruturadas a Financiamento
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            Programas oficiais ativos em Angola. OLO Fintel sincroniza os seus dados diretamente com os bancos validadores para acelerar o desembolso.
          </p>
        </div>

        {/* List of credit lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fundingLines.map((line) => {
            const isEligible = currentActualScore >= line.requiredScore;
            return (
              <div 
                key={line.id} 
                className="p-5 rounded-2xl bg-gray-50 dark:bg-black/10 border border-gray-100 dark:border-gray-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{line.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{line.entity}</p>
                    </div>
                    {getEligibilityBadge(currentActualScore, line.requiredScore)}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pt-1">{line.description}</p>
                </div>

                {/* Info row */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-200 dark:border-gray-800 text-[10px] font-mono">
                  <div>
                    <span className="text-gray-400 block">Montante Máximo</span>
                    <span className="font-bold text-gray-900 dark:text-white">{line.maxAmount}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Taxa de Juro</span>
                    <span className="font-bold text-gray-900 dark:text-white">{line.interestRate}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Carência</span>
                    <span className="font-bold text-gray-900 dark:text-white">{line.gracePeriod}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[9px] text-brand-purple font-semibold font-mono">
                    Score Mínimo: {line.requiredScore} pontos
                  </span>
                  
                  <button
                    onClick={() => setShowApplyModal(line)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                      isEligible 
                        ? 'bg-brand-purple hover:bg-brand-purple-hover text-white' 
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!isEligible}
                  >
                    Candidatar-se
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* APPLICATIONS LOG HISTORY */}
      <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <FileSpreadsheet size={16} className="text-brand-purple" />
          Histórico de Candidaturas Submetidas
        </h4>

        {applications.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6 bg-gray-50 dark:bg-black/10 rounded-xl border border-gray-100 dark:border-gray-800">
            Nenhuma candidatura enviada ainda. Submeta o formulário acima num dos programas elegíveis.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
            <table className="w-full text-left text-xs bg-white dark:bg-black/10">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-bold bg-gray-50 dark:bg-[#1F1F2C]">
                  <th className="p-3">Data</th>
                  <th className="p-3">Programa / Linha</th>
                  <th className="p-3">Montante Solicitado</th>
                  <th className="p-3">Score ao Submeter</th>
                  <th className="p-3">Finalidade</th>
                  <th className="p-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 font-medium text-gray-700 dark:text-gray-300">
                    <td className="p-3 font-mono text-[10px]">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-gray-900 dark:text-white">{app.lineName}</div>
                      <span className="text-[9px] text-gray-400 font-mono block">{app.entity}</span>
                    </td>
                    <td className="p-3 font-bold text-gray-900 dark:text-white font-mono">
                      {Number(app.amountRequested).toLocaleString()} Kz
                    </td>
                    <td className="p-3 font-mono text-center">{app.scoreAtSubmission} pts</td>
                    <td className="p-3 text-[10px]">{app.purpose}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        app.status === 'APPROVED' 
                          ? 'bg-green-500/10 text-green-500' 
                          : app.status === 'REJECTED' 
                          ? 'bg-red-500/10 text-red-500' 
                          : app.status === 'IN_REVIEW' 
                          ? 'bg-blue-500/10 text-blue-500' 
                          : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {app.status === 'APPROVED' 
                          ? 'Aprovado' 
                          : app.status === 'REJECTED' 
                          ? 'Recusado' 
                          : app.status === 'IN_REVIEW' 
                          ? 'Em Análise' 
                          : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MULTI-STEP SUBMISSION FORM MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl p-6 max-w-lg w-full space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Title */}
            <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <span className="text-[9px] font-bold text-brand-purple uppercase bg-brand-purple/10 px-2 py-0.5 rounded">Formulário Oficial de Crédito</span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1.5">{showApplyModal.name}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Sincronizado via OLO Fintel com o validador.</p>
              </div>
              <button 
                onClick={() => setShowApplyModal(null)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              
              {/* Score validation card */}
              <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-xl flex items-center justify-between text-xs font-semibold text-green-700 dark:text-green-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-green-500" />
                  Prontidão Aprovada
                </span>
                <span>O seu score ({currentActualScore}) cumpre o requisito de {showApplyModal.requiredScore} pontos.</span>
              </div>

              {/* Amount field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Montante Solicitado (AOA)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={applyForm.amountRequested}
                    onChange={(e) => setApplyForm(prev => ({ ...prev, amountRequested: e.target.value }))}
                    placeholder="Ex: 5000000"
                    required
                    className="w-full h-11 px-4 rounded-xl border bg-transparent text-sm border-gray-300 dark:border-gray-700 outline-none focus:border-brand-purple font-mono"
                  />
                  <span className="absolute right-4 top-3 text-xs font-bold text-gray-400">Kz</span>
                </div>
                <p className="text-[10px] text-gray-400">Montante máximo permitido por esta linha: {showApplyModal.maxAmount}</p>
              </div>

              {/* Term in months and Purpose */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Prazo de Amortização</label>
                  <select
                    value={applyForm.termMonths}
                    onChange={(e) => setApplyForm(prev => ({ ...prev, termMonths: e.target.value }))}
                    className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm border-gray-300 dark:border-gray-700 outline-none focus:border-brand-purple dark:bg-[#1A1A21] cursor-pointer"
                  >
                    <option value="6">6 meses</option>
                    <option value="12">12 meses (1 ano)</option>
                    <option value="18">18 meses</option>
                    <option value="24">24 meses (2 anos)</option>
                    <option value="36">36 meses (3 anos)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Finalidade Principal</label>
                  <select
                    value={applyForm.purpose}
                    onChange={(e) => setApplyForm(prev => ({ ...prev, purpose: e.target.value }))}
                    className="w-full h-11 px-3 rounded-xl border bg-transparent text-sm border-gray-300 dark:border-gray-700 outline-none focus:border-brand-purple dark:bg-[#1A1A21] cursor-pointer"
                  >
                    <option value="Capital de Giro">Capital de Giro (Operações)</option>
                    <option value="Sementes e Fertilizantes">Insumos (Sementes/Adubo)</option>
                    <option value="Compra de Trator / Equipamento">Compra de Equipamentos</option>
                    <option value="Investimento em Infraestrutura">Infraestrutura (Armazém/Frio)</option>
                  </select>
                </div>
              </div>

              {/* Contact telephone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Contacto Telefónico do Responsável</label>
                <input
                  type="tel"
                  value={applyForm.contactPhone}
                  onChange={(e) => setApplyForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="Ex: +244 923 000 000"
                  required
                  className="w-full h-11 px-4 rounded-xl border bg-transparent text-sm border-gray-300 dark:border-gray-700 outline-none focus:border-brand-purple font-mono"
                />
              </div>

              {/* Checklist verification row */}
              <div className="p-3.5 bg-brand-purple/5 rounded-xl border border-brand-purple/10 text-[10px] text-gray-500 dark:text-gray-400 space-y-1.5">
                <span className="font-bold text-brand-purple uppercase">Documentos Sincronizados do Perfil:</span>
                <div className="space-y-1 pl-1">
                  {docList.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <Check size={10} className="text-green-500 shrink-0" />
                      <span>{doc.name} (Tipo: {doc.type} • Status: {doc.status})</span>
                    </div>
                  ))}
                  {docList.length === 0 && (
                    <p className="text-red-500 font-semibold">Nenhum documento carregado! Recomenda-se carregar na Central de Documentos antes de prosseguir.</p>
                  )}
                </div>
              </div>

              {/* Veracity declaration */}
              <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-gray-600 dark:text-gray-300 pt-2 select-none">
                <input
                  type="checkbox"
                  required
                  checked={applyForm.confirmTrueData}
                  onChange={(e) => setApplyForm(prev => ({ ...prev, confirmTrueData: e.target.checked }))}
                  className="mt-0.5 rounded border-gray-300 text-brand-purple focus:ring-brand-purple cursor-pointer"
                />
                <span className="leading-snug">
                  Declaro que as informações e registos operacionais introduzidos nesta plataforma são verdadeiros e representam fidedignamente a atividade da cooperativa.
                </span>
              </label>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(null)}
                  className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-white rounded-xl text-xs font-bold transition-all border border-gray-200 dark:border-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  disabled={applying}
                >
                  {applying ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      A Enviar...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Submeter Candidatura
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
