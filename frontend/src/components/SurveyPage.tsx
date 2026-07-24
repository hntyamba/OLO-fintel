/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext.js';
import { useTheme } from './ThemeContext.js';
import { getApiUrl } from '../lib/api';
import {   CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  ClipboardCheck, 
  HelpCircle, 
  ShieldCheck, 
  Building2, 
  Briefcase,
  Sprout,
  Anchor,
  Activity,
  Award,
  Clock,
  Coins,
  TrendingUp,
  Flame,
  User,
  Users,
  MapPin,
  HeartPulse,
  Sparkles,
  Info
} from 'lucide-react';

interface StrategicSurveyData {
  started: boolean;
  
  // BLOCO A
  A1_usesPaper: boolean;
  A1_usesExcel: boolean;
  A1_usesWhatsApp: boolean;
  A1_usesBillingSoftware: boolean;
  A1_usesNone: boolean;
  A2_lostHours: string; // 'LESS_2' | '3_5' | '6_10' | 'MORE_10' | ''
  A3_lostSales: string; // 'NONE' | '1_3' | '4_6' | 'MORE_6' | ''
  
  // BLOCO B
  B1_appliedFunding: string; // 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'NEVER' | ''
  B2_rejectionReason: string; // string or preset
  B3_trustReport: string; // 'YES' | 'MAYBE' | 'NO' | ''
  
  // BLOCO C
  C1_profitMarginIdea: string; // 'YES' | 'MAYBE' | 'NO' | ''
  C2_biggestHeadache: string; // string or preset
  C3_sectorConditionalAnswer: string; // based on E3_sector
  
  // BLOCO D
  D1_probabilityToUse: string; // '0_20' | '21_50' | '51_80' | '81_100' | ''
  D2_shareRealData: string; // 'ALL_GOLD' | 'AGGREGATED_SILVER' | 'FICTIONAL_BRONZE' | ''
  D3_willingToPay: string; // 'UP_2500' | '2500_7500' | 'MORE_7500' | 'FREE' | ''
  
  // BLOCO E
  E1_orgName: string;
  E2_nif: string;
  E3_sector: string; // 'AGRICULTURE' | 'LIVESTOCK' | 'FISHERIES' | 'COMMERCE' | 'TRANSPORT' | 'INDUSTRY' | ''
  E4_province: string;
  E4_provinceOther: string;
  E5_employeeCount: string; // '1_5' | '6_20' | '21_100' | 'MORE_100' | ''
  E6_persona: string; // 'PRESIDENTE' | 'GESTOR' | 'ANALISTA' | 'CONSULTOR' | 'MEMBRO' | ''
  E7_contact: string;
}

const defaultSurveyData: StrategicSurveyData = {
  started: false,
  A1_usesPaper: false,
  A1_usesExcel: false,
  A1_usesWhatsApp: false,
  A1_usesBillingSoftware: false,
  A1_usesNone: false,
  A2_lostHours: '',
  A3_lostSales: '',
  B1_appliedFunding: '',
  B2_rejectionReason: '',
  B3_trustReport: '',
  C1_profitMarginIdea: '',
  C2_biggestHeadache: '',
  C3_sectorConditionalAnswer: '',
  D1_probabilityToUse: '',
  D2_shareRealData: '',
  D3_willingToPay: '',
  E1_orgName: '',
  E2_nif: '',
  E3_sector: '',
  E4_province: 'Luanda',
  E4_provinceOther: '',
  E5_employeeCount: '',
  E6_persona: '',
  E7_contact: ''
};

export default function SurveyPage({ 
  onNavigate 
}: { 
  onNavigate: (page: 'home' | 'survey' | 'login' | 'register' | 'dashboard') => void 
}) {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  
  const [step, setStep] = useState(0); // Step 0 is Welcome Screen
  const [formData, setFormData] = useState<StrategicSurveyData>(defaultSurveyData);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState<any>(null);

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem('olo-fintel-survey-draft-v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        if (parsed.started) {
          // Find the last completed step or just default to step 1
          setStep(1);
        }
      } catch (e) {
        console.error('Failed to parse survey draft', e);
      }
    }
  }, []);

  // Save draft on changes
  const updateForm = (fields: Partial<StrategicSurveyData>) => {
    const updated = { ...formData, ...fields };
    setFormData(updated);
    localStorage.setItem('olo-fintel-survey-draft-v2', JSON.stringify(updated));
    setError(null);
  };

  const handleStartSurvey = () => {
    updateForm({ started: true });
    setStep(1);
  };

  const handleResetSurvey = () => {
    localStorage.removeItem('olo-fintel-survey-draft-v2');
    setFormData({ ...defaultSurveyData, started: true });
    setStep(1);
    setError(null);
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      // Bloco A Validation
      const hasTool = formData.A1_usesPaper || formData.A1_usesExcel || formData.A1_usesWhatsApp || formData.A1_usesBillingSoftware || formData.A1_usesNone;
      if (!hasTool) {
        setError('Por favor, selecione pelo menos uma forma de gestão operacional (Pergunta A1).');
        return false;
      }
      if (!formData.A2_lostHours) {
        setError('Por favor, responda ao tempo perdido por semana (Pergunta A2).');
        return false;
      }
      if (!formData.A3_lostSales) {
        setError('Por favor, indique os negócios perdidos no último trimestre (Pergunta A3).');
        return false;
      }
    }

    if (step === 2) {
      // Bloco B Validation
      if (!formData.B1_appliedFunding) {
        setError('Por favor, selecione se já tentou obter financiamento (Pergunta B1).');
        return false;
      }
      if (formData.B1_appliedFunding === 'REJECTED' && !formData.B2_rejectionReason) {
        setError('Por favor, indique o principal motivo de rejeição (Pergunta B2).');
        return false;
      }
      if (!formData.B3_trustReport) {
        setError('Por favor, responda se o relatório de credibilidade aumentaria a sua confiança (Pergunta B3).');
        return false;
      }
    }

    if (step === 3) {
      // Bloco C Validation
      if (!formData.C1_profitMarginIdea) {
        setError('Por favor, selecione o seu nível de controle sobre a margem de lucro (Pergunta C1).');
        return false;
      }
      if (!formData.C2_biggestHeadache) {
        setError('Por favor, indique a sua principal dor de cabeça operacional (Pergunta C2).');
        return false;
      }
      
      // Auto-validate sector conditional C3
      // We need their sector configured. If not configured, we ask them to select one here or default.
      if (!formData.E3_sector) {
        setError('Por favor, selecione o setor de atividade para responder à pergunta de maturidade.');
        return false;
      }
      if (!formData.C3_sectorConditionalAnswer) {
        setError('Por favor, responda à pergunta específica do seu setor (Pergunta C3).');
        return false;
      }
    }

    if (step === 4) {
      // Bloco D Validation
      if (!formData.D1_probabilityToUse) {
        setError('Por favor, selecione a probabilidade de começar a usar o Fintel OS (Pergunta D1).');
        return false;
      }
      if (!formData.D2_shareRealData) {
        setError('Por favor, selecione a sua disposição para partilhar dados operacionais (Pergunta D2).');
        return false;
      }
      if (!formData.D3_willingToPay) {
        setError('Por favor, indique o valor que estaria disposto a pagar após o teste (Pergunta D3).');
        return false;
      }
    }

    if (step === 5) {
      // Bloco E Validation
      if (!formData.E3_sector) {
        setError('O setor de atividade é obrigatório.');
        return false;
      }
      if (!formData.E4_province) {
        setError('A província de operação é obrigatória.');
        return false;
      }
      if (formData.E4_province === 'Outra' && !formData.E4_provinceOther) {
        setError('Por favor, especifique qual é a outra província.');
        return false;
      }
      if (!formData.E5_employeeCount) {
        setError('Por favor, indique o número de funcionários.');
        return false;
      }
      if (!formData.E6_persona) {
        setError('A sua função/perfil é obrigatória.');
        return false;
      }
      if (!formData.E7_contact) {
        setError('O seu contacto (email ou telefone) é obrigatório para enviar o relatório de diagnóstico gratuito.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 0));
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(getApiUrl('/api/survey/submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedResponse(data.survey);
        setSubmitted(true);
        localStorage.removeItem('olo-fintel-survey-draft-v2');
      } else {
        const errData = await res.json();
        setError(errData.error || 'Ocorreu um erro ao submeter o inquérito.');
      }
    } catch (e) {
      setError('Falha na ligação ao servidor. Verifique a sua ligação à internet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const provinces = ['Luanda', 'Huíla', 'Benguela', 'Huambo', 'Bié', 'Moxico', 'Cabinda', 'Cuanza Sul', 'Namibe', 'Uíge', 'Malanje', 'Zaire', 'Lunda Norte', 'Lunda Sul', 'Cunene', 'Cuando Cubango', 'Cuanza Norte', 'Bengo', 'Outra'];
  const sectorsList = [
    { id: 'AGRICULTURE', label: '🌾 Agro-Pecuária (Agricultura/Plantação)' },
    { id: 'LIVESTOCK', label: '🐄 Pecuária (Animais/Criação)' },
    { id: 'FISHERIES', label: '⚓ Pesca' },
    { id: 'COMMERCE', label: '👜 Comércio / Retalho' },
    { id: 'TRANSPORT', label: '🚛 Transportes / Logística' },
    { id: 'INDUSTRY', label: '🏭 Indústria / Transformação' }
  ];

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 transition-all">
      
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-iris/10 text-brand-iris mb-3 uppercase tracking-wider font-mono">
          <ClipboardCheck size={12} />
          Sandbox LISPA — Validação Operacional
        </span>
        <h1 className="text-3xl font-sans font-extrabold tracking-tight text-gray-900 dark:text-white flex justify-center items-center gap-2.5">
          Diagnóstico Estratégico OLO Fintel
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto">
          Mapeamento em tempo real do custo da desorganização e maturidade digital das PMEs e Cooperativas em Angola.
        </p>
      </div>

      {submitted ? (
        /* GAMIFIED PROGRESS REPORT PREVIEW (Instead of a standard thank you screen) */
        <div className="bg-white dark:bg-[#111115] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircle size={32} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider font-mono">Inquérito Concluído</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Seu Relatório de Diagnóstico Prévio</h2>
              </div>
            </div>
            <div className="px-4 py-2 bg-brand-iris/10 text-brand-iris rounded-xl text-center">
              <span className="block text-[10px] font-bold uppercase tracking-wider">Score de Adoção</span>
              <span className="text-xl font-mono font-extrabold">{submittedResponse?.adoptionScore || 45} / 100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Maturidade */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#16161F] border border-gray-100 dark:border-gray-800/60 space-y-2">
              <div className="text-gray-400 dark:text-gray-500"><Award size={20} /></div>
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">Nível de Maturidade</h4>
              <p className="text-base font-extrabold text-gray-900 dark:text-white">
                {formData.C1_profitMarginIdea === 'YES' ? 'Nível 3: Avançado' : formData.C1_profitMarginIdea === 'MAYBE' ? 'Nível 2: Intermédio' : 'Nível 1: Iniciante'}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {formData.C1_profitMarginIdea === 'YES' 
                  ? 'Possui controlo exato de margens. Pronto para aceleração.' 
                  : formData.C1_profitMarginIdea === 'MAYBE' 
                    ? 'Algum controlo operacional. Falta formalizar e automatizar.' 
                    : 'Processos altamente informais baseados em anotações dispersas.'}
              </p>
            </div>

            {/* Box 2: Tempo perdido */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#16161F] border border-gray-100 dark:border-gray-800/60 space-y-2">
              <div className="text-gray-400 dark:text-gray-500"><Clock size={20} /></div>
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">Tempo Desperdiçado</h4>
              <p className="text-base font-extrabold text-gray-900 dark:text-white">
                {formData.A2_lostHours === 'LESS_2' ? 'Até 2h / semana' : formData.A2_lostHours === '3_5' ? 'Aprox. 4h / semana' : formData.A2_lostHours === '6_10' ? 'Aprox. 8h / semana' : 'Mais de 10h / semana'}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Isso representa cerca de <strong className="text-brand-iris font-mono">{formData.A2_lostHours === 'LESS_2' ? '52' : formData.A2_lostHours === '3_5' ? '208' : formData.A2_lostHours === '6_10' ? '416' : '624'} horas por ano</strong> perdidas a procurar papéis e consolidar contas à mão.
              </p>
            </div>

            {/* Box 3: Gravidade Financeira */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#16161F] border border-gray-100 dark:border-gray-800/60 space-y-2">
              <div className="text-gray-400 dark:text-gray-500"><TrendingUp size={20} /></div>
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">Negócios Perdidos</h4>
              <p className="text-base font-extrabold text-gray-900 dark:text-white">
                {formData.A3_lostSales === 'NONE' ? 'Nenhuma Perda' : formData.A3_lostSales === '1_3' ? '1 a 3 vendas perdidas' : formData.A3_lostSales === '4_6' ? '4 a 6 vendas perdidas' : 'Mais de 6 vendas perdidas'}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {formData.A3_lostSales === 'NONE' 
                  ? 'A sua operação tem bom fluxo, mas carece de agilidade bancária.' 
                  : 'A lentidão documental e falta de registos organizados custaram dinheiro direto ao seu caixa.'}
              </p>
            </div>
          </div>

          {/* Core dynamic alerts and CTAs based on secret score rules */}
          {submittedResponse?.isHighIntent && (
            <div className="p-5 bg-brand-iris/10 border border-brand-iris/20 rounded-2xl space-y-2.5">
              <h4 className="text-sm font-bold text-brand-iris flex items-center gap-2">
                <Sparkles size={16} />
                Lançamento Rápido Disponível — Alta Intenção Detetada
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                Parabéns! A sua disposição para usar dados de produção reais para gerar um <strong>Relatório de Credibilidade Financeira</strong> qualifica-o para a nossa lista VIP de ativação rápida da OLO Fintel. 
                A nossa equipa de onboarding entrará em contacto direto através do contacto <strong>{formData.E7_contact}</strong> para disponibilizar o seu espaço de trabalho personalizado.
              </p>
            </div>
          )}

          {submittedResponse?.isUrgentPain && (
            <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-amber-500 flex items-center gap-2">
                <Flame size={16} />
                Alerta de Risco: Dor Crítica Operacional e Financeira
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                Identificámos que a sua organização está a perder negócios diretos por falta de histórico estruturado e desconhece a margem líquida real de lucro das operações. Isto é um bloqueio grave para a sua sustentabilidade.
              </p>
              <div>
                <a 
                  href={`mailto:onboarding@olofintel.ao?subject=Pedido de Consultoria Gratuita - ${formData.E1_orgName || 'Cooperativa'}`}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow"
                >
                  Agendar Aconselhamento Grátis OLO
                  <ArrowRight size={12} />
                </a>
              </div>
            </div>
          )}

          {!submittedResponse?.isHighIntent && !submittedResponse?.isUrgentPain && (
            <div className="p-5 bg-green-500/10 border border-green-500/20 rounded-2xl space-y-2">
              <h4 className="text-sm font-bold text-green-500 flex items-center gap-2">
                <ShieldCheck size={16} />
                Mapeamento Concluído com Sucesso
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                Os seus dados foram registados e farão parte do relatório agregado entregue ao júri de inovação da LISPA. Enviaremos o seu Diagnóstico de Maturidade individual detalhado para <strong>{formData.E7_contact}</strong>.
              </p>
            </div>
          )}

          {/* Gamified summary visualizer */}
          <div className="p-5 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800 rounded-2xl">
            <h4 className="font-bold text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono mb-3">Resumo da Identidade Mapeada</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/80 pb-2">
                <span className="text-gray-500">Organização:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formData.E1_orgName || 'Anónima'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/80 pb-2">
                <span className="text-gray-500">Setor de Atividade:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {sectorsList.find(s => s.id === formData.E3_sector)?.label?.split(') ')[1] || formData.E3_sector}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/80 pb-2">
                <span className="text-gray-500">Província:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formData.E4_province === 'Outra' ? formData.E4_provinceOther : formData.E4_province}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/80 pb-2">
                <span className="text-gray-500">Membros/Staff:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formData.E5_employeeCount === '1_5' ? '1 a 5' : formData.E5_employeeCount === '6_20' ? '6 a 20' : formData.E5_employeeCount === '21_100' ? '21 a 100' : 'Mais de 100'}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <button 
              onClick={() => onNavigate('home')}
              className="px-6 py-3 bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-800 rounded-xl font-semibold transition-all text-xs"
            >
              Voltar ao Início
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="px-6 py-3 bg-brand-iris hover:bg-brand-iris-hover text-white rounded-xl font-bold transition-all text-xs shadow"
            >
              Iniciar Onboarding OLO Fintel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111115] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl transition-all">
          
          {/* STEP 0: Welcome Screen */}
          {step === 0 && (
            <div className="space-y-8 py-4 animate-fade-in text-center max-w-xl mx-auto">
              <div className="w-20 h-20 bg-brand-iris/10 text-brand-iris rounded-3xl flex items-center justify-center mx-auto shadow">
                <ClipboardCheck size={40} />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Ajude a construir o futuro digital das PMEs e Cooperativas Africanas</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  As suas respostas vão gerar um relatório de diagnóstico gratuito para si e ajudar-nos a levar financiamento a mais organizações como a sua. (Demora apenas 5 minutos).
                </p>
              </div>

              {/* Draft Recover Alert */}
              {formData.started && (
                <div className="p-4 bg-gray-50 dark:bg-[#16161F] border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Rascunho Guardado Detectado</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Tem um preenchimento em curso no seu navegador.</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={handleResetSurvey}
                      className="px-3 py-1.5 border border-red-500/20 text-red-500 hover:bg-red-500/5 rounded-lg text-xs font-bold transition-all"
                    >
                      Recomeçar
                    </button>
                    <button 
                      onClick={() => setStep(1)}
                      className="px-4 py-1.5 bg-brand-iris text-white hover:bg-brand-iris-hover rounded-lg text-xs font-bold transition-all"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button 
                  onClick={handleStartSurvey}
                  className="w-full sm:w-auto px-10 py-4 bg-brand-iris hover:bg-brand-iris-hover text-white font-extrabold rounded-2xl transition-all shadow-md text-sm tracking-wide"
                >
                  Iniciar Questionário
                </button>
              </div>
            </div>
          )}

          {step > 0 && (
            <>
              {/* Progress timeline */}
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 overflow-x-auto">
                {[1, 2, 3, 4, 5].map(stepNum => (
                  <React.Fragment key={stepNum}>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        step >= stepNum 
                          ? 'bg-brand-iris text-white shadow-sm' 
                          : 'bg-gray-100 dark:bg-[#1A1A24] text-gray-400 dark:text-gray-600'
                      }`}>
                        {stepNum}
                      </div>
                      <span className={`text-xs font-semibold hidden md:inline ${step === stepNum ? 'text-brand-iris font-extrabold' : 'text-gray-400 dark:text-gray-600'}`}>
                        {stepNum === 1 && 'Dor Operacional'}
                        {stepNum === 2 && 'Exclusão Financeira'}
                        {stepNum === 3 && 'Maturidade Digital'}
                        {stepNum === 4 && 'Disposição p/ Adoção'}
                        {stepNum === 5 && 'Dados Finais'}
                      </span>
                    </div>
                    {stepNum < 5 && (
                      <div className={`flex-1 min-w-[20px] h-0.5 mx-2 ${step > stepNum ? 'bg-brand-iris' : 'bg-gray-100 dark:bg-[#1A1A24]'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Error notice */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-red-500 text-xs font-bold mb-6 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: Bloco A — A DOR OPERACIONAL (Custo da Desorganização) */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                      <Activity className="text-brand-iris" size={20} />
                      BLOCO A – A DOR OPERACIONAL (Custo da Desorganização)
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Este bloco ajuda a quantificar o custo da desorganização das operações diárias da sua cooperativa ou empresa.</p>
                  </div>

                  {/* A1: Como gere as operações */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                      A1. Como gere, atualmente, as operações do dia-a-dia? (Selecione todas as que usa)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { key: 'A1_usesPaper', label: '📖 Cadernos / Papel físico' },
                        { key: 'A1_usesExcel', label: '📊 Excel / Folhas de cálculo' },
                        { key: 'A1_usesWhatsApp', label: '💬 WhatsApp (encomendas e controlo)' },
                        { key: 'A1_usesBillingSoftware', label: '🧾 Software de faturação (Facturama, ERP, etc)' },
                        { key: 'A1_usesNone', label: '🧠 Nenhum sistema – é tudo na cabeça' }
                      ].map(tool => (
                        <button
                          key={tool.key}
                          type="button"
                          onClick={() => updateForm({ [tool.key]: !formData[tool.key as keyof StrategicSurveyData] })}
                          className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            formData[tool.key as keyof StrategicSurveyData] 
                              ? 'border-brand-iris bg-brand-iris/5 text-brand-iris font-semibold' 
                              : 'border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={!!formData[tool.key as keyof StrategicSurveyData]} 
                            onChange={() => {}} 
                            className="pointer-events-none rounded accent-brand-iris shrink-0" 
                          />
                          <span className="text-xs">{tool.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* A2: Horas perdidas */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                      A2. Em média, quantas horas por SEMANA a sua equipa perde a procurar papéis, preencher relatórios manuais ou reconciliar contas no Excel?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { val: 'LESS_2', label: '⏱️ Menos de 2 horas' },
                        { val: '3_5', label: '📅 3 a 5 horas (meio dia por semana)' },
                        { val: '6_10', label: '📆 6 a 10 horas (mais de 1 dia por semana)' },
                        { val: 'MORE_10', label: '🚨 Mais de 10 horas (mais de 2 dias por semana)' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => updateForm({ A2_lostHours: opt.val })}
                          className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            formData.A2_lostHours === opt.val 
                              ? 'border-brand-iris bg-brand-iris/5 text-brand-iris font-semibold' 
                              : 'border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40'
                          }`}
                        >
                          <input 
                            type="radio" 
                            checked={formData.A2_lostHours === opt.val} 
                            onChange={() => {}} 
                            className="pointer-events-none accent-brand-iris shrink-0" 
                          />
                          <span className="text-xs">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* A3: Vendas perdidas */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                      A3. Na última época/trimestre, quantas vendas ou negócios perdeu porque não tinha os dados ou documentos prontos a tempo?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { val: 'NONE', label: '✅ Nenhum' },
                        { val: '1_3', label: '⚠️ 1 a 3 negócios perdidos' },
                        { val: '4_6', label: '❌ 4 a 6 negócios perdidos' },
                        { val: 'MORE_6', label: '🚨 Mais de 6 negócios (perda grave)' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => updateForm({ A3_lostSales: opt.val })}
                          className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            formData.A3_lostSales === opt.val 
                              ? 'border-brand-iris bg-brand-iris/5 text-brand-iris font-semibold' 
                              : 'border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40'
                          }`}
                        >
                          <input 
                            type="radio" 
                            checked={formData.A3_lostSales === opt.val} 
                            onChange={() => {}} 
                            className="pointer-events-none accent-brand-iris shrink-0" 
                          />
                          <span className="text-xs">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Bloco B — A EXCLUSÃO FINANCEIRA (Relação com Bancos) */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                      <Coins className="text-brand-iris" size={20} />
                      BLOCO B – A EXCLUSÃO FINANCEIRA (Relação com Bancos)
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Vamos avaliar o nível de elegibilidade e preparação para financiamento ("Funding Readiness") da sua organização.</p>
                  </div>

                  {/* B1: Já tentou obter crédito */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                      B1. Já tentou obter crédito ou financiamento para a sua organização nos últimos 3 anos?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { val: 'APPROVED', label: '🟢 Sim, e fui aprovado' },
                        { val: 'REJECTED', label: '🔴 Sim, mas fui rejeitado' },
                        { val: 'IN_PROGRESS', label: '🟡 Sim, estou em processo agora' },
                        { val: 'NEVER', label: '⚪ Nunca tentei' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => {
                            updateForm({ 
                              B1_appliedFunding: opt.val,
                              B2_rejectionReason: opt.val !== 'REJECTED' ? '' : formData.B2_rejectionReason
                            });
                          }}
                          className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            formData.B1_appliedFunding === opt.val 
                              ? 'border-brand-iris bg-brand-iris/5 text-brand-iris font-semibold' 
                              : 'border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40'
                          }`}
                        >
                          <input 
                            type="radio" 
                            checked={formData.B1_appliedFunding === opt.val} 
                            onChange={() => {}} 
                            className="pointer-events-none accent-brand-iris shrink-0" 
                          />
                          <span className="text-xs">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* B2: Conditional on REJECTED */}
                  {formData.B1_appliedFunding === 'REJECTED' && (
                    <div className="space-y-3 p-5 bg-red-500/5 border border-red-500/10 rounded-2xl animate-slide-up">
                      <label className="text-xs font-bold text-red-500 uppercase tracking-wider font-mono flex items-center gap-2">
                        <Info size={14} />
                        B2. Qual foi o principal motivo apontado pelo banco ou instituição financeira?
                      </label>
                      <div className="space-y-2">
                        {[
                          'Falta de histórico financeiro organizado (extratos, balanços)',
                          'Falta de documentação legal / NIF / licenças atualizadas',
                          'Não comprovar a produção/operação (ex: não tenho registo de colheitas/vendas)',
                          'Taxa de juro ou garantias exigidas eram inviáveis'
                        ].map(reason => (
                          <button
                            key={reason}
                            type="button"
                            onClick={() => updateForm({ B2_rejectionReason: reason })}
                            className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                              formData.B2_rejectionReason === reason 
                                ? 'border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 font-semibold' 
                                : 'border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40'
                            }`}
                          >
                            <input 
                              type="radio" 
                              checked={formData.B2_rejectionReason === reason} 
                              onChange={() => {}} 
                              className="pointer-events-none accent-red-500 shrink-0" 
                            />
                            <span className="text-xs">{reason}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* B3: Relatório de Credibilidade */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                      B3. Se tivesse um "Relatório de Credibilidade" gerado automaticamente a partir dos seus dados operacionais, isso aumentaria a sua confiança para ir ao banco solicitar crédito?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { val: 'YES', label: '👍 Sim, completamente' },
                        { val: 'MAYBE', label: '🤔 Talvez, mas ainda prefiro o gestor tradicional' },
                        { val: 'NO', label: '👎 Não, confio apenas em balanços contábeis tradicionais' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => updateForm({ B3_trustReport: opt.val })}
                          className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            formData.B3_trustReport === opt.val 
                              ? 'border-brand-iris bg-brand-iris/5 text-brand-iris font-semibold' 
                              : 'border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40'
                          }`}
                        >
                          <input 
                            type="radio" 
                            checked={formData.B3_trustReport === opt.val} 
                            onChange={() => {}} 
                            className="pointer-events-none accent-brand-iris shrink-0" 
                          />
                          <span className="text-xs">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Bloco C — MATURIDADE DIGITAL E OPERACIONAL */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                      <Sprout className="text-brand-iris" size={20} />
                      BLOCO C – MATURIDADE DIGITAL E OPERACIONAL
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Medir a prontidão para a adoção de tecnologias e o nível de sofisticação operacional atual.</p>
                  </div>

                  {/* C1: Margem de lucro */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                      C1. Consegue dizer, neste exato momento, qual é a sua margem de lucro líquida (percentagem) do mês passado sem consultar nada?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { val: 'YES', label: '⭐ Sim, sei exatamente (Advanced)' },
                        { val: 'MAYBE', label: '📈 Tenho uma ideia, mas não o valor exato (Intermediate)' },
                        { val: 'NO', label: '📝 Não faço ideia, preciso de somar tudo primeiro (Beginner)' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => updateForm({ C1_profitMarginIdea: opt.val })}
                          className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            formData.C1_profitMarginIdea === opt.val 
                              ? 'border-brand-iris bg-brand-iris/5 text-brand-iris font-semibold' 
                              : 'border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40'
                          }`}
                        >
                          <input 
                            type="radio" 
                            checked={formData.C1_profitMarginIdea === opt.val} 
                            onChange={() => {}} 
                            className="pointer-events-none accent-brand-iris shrink-0" 
                          />
                          <span className="text-xs">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* C2: Área de maior dor de cabeça */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                      C2. Das seguintes áreas, qual é a que lhe dá MAIS DOR DE CABEÇA atualmente? (Escolha apenas 1)
                    </label>
                    <div className="space-y-2">
                      {[
                        'Controlar o inventário/stock (nunca sei o que tenho)',
                        'Registar as vendas e clientes (esqueço-me de cobrar ou cobrar atrasados)',
                        'Controlar as despesas operacionais (combustível, ração, insumos, sementes)',
                        'Preencher papelada para o governo / licenças / impostos (NIF, AGT)',
                        'Saber se estou a ter lucro ou prejuízo na cultura/atividade específica'
                      ].map(headache => (
                        <button
                          key={headache}
                          type="button"
                          onClick={() => updateForm({ C2_biggestHeadache: headache })}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            formData.C2_biggestHeadache === headache 
                              ? 'border-brand-iris bg-brand-iris/5 text-brand-iris font-semibold' 
                              : 'border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40'
                          }`}
                        >
                          <input 
                            type="radio" 
                            checked={formData.C2_biggestHeadache === headache} 
                            onChange={() => {}} 
                            className="pointer-events-none accent-brand-iris shrink-0" 
                          />
                          <span className="text-xs">{headache}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sector Confirmation (needed for C3) */}
                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-[#16161F] border border-gray-100 dark:border-gray-800 rounded-2xl">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                      Antes de responder à C3, por favor indique o seu Setor de Atividade Principal:
                    </label>
                    <select
                      value={formData.E3_sector}
                      onChange={e => {
                        updateForm({ 
                          E3_sector: e.target.value,
                          C3_sectorConditionalAnswer: '' // Reset sector specific C3
                        });
                      }}
                      className="w-full text-xs px-3 py-2.5 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                    >
                      <option value="">-- Selecione o seu Setor --</option>
                      {sectorsList.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* C3: Sector Specific Conditional Question */}
                  {formData.E3_sector && (
                    <div className="space-y-3 p-5 bg-brand-iris/5 border border-brand-iris/10 rounded-2xl animate-slide-up">
                      <span className="text-[10px] font-bold text-brand-iris uppercase tracking-widest font-mono">PERGUNTA CONDICIONAL DE MATURIDADE</span>
                      
                      {formData.E3_sector === 'AGRICULTURE' && (
                        <>
                          <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                            C3. (Agricultura): Regista de forma sistemática a produtividade/colheitas por talhão e cultura?
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                            {[
                              { val: 'SIM_HISTORICO', label: '🟢 Sim, tenho mapa/histórico' },
                              { val: 'MAIS_OU_MENOS', label: '🟡 Mais ou menos' },
                              { val: 'NAO_REGISTO', label: '🔴 Não, planto e colho sem registo' }
                            ].map(opt => (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => updateForm({ C3_sectorConditionalAnswer: opt.val })}
                                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                                  formData.C3_sectorConditionalAnswer === opt.val ? 'border-brand-iris bg-brand-iris/10 text-brand-iris font-semibold' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black/20'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {formData.E3_sector === 'LIVESTOCK' && (
                        <>
                          <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                            C3. (Pecuária): Tem controlo detalhado de vacinação, pesagem e mortalidade animal?
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                            {[
                              { val: 'PLANILHA', label: '🟢 Sim, planilha/ficha detalhada' },
                              { val: 'A_VULSO', label: '🟡 Só quando acontece algo' },
                              { val: 'SEM_CONTROLO', label: '🔴 Não tenho controlo' }
                            ].map(opt => (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => updateForm({ C3_sectorConditionalAnswer: opt.val })}
                                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                                  formData.C3_sectorConditionalAnswer === opt.val ? 'border-brand-iris bg-brand-iris/10 text-brand-iris font-semibold' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black/20'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {formData.E3_sector === 'FISHERIES' && (
                        <>
                          <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                            C3. (Pesca): Controla rigorosamente o custo por viagem e por embarcação (combustível, gelo, rancho)?
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                            {[
                              { val: 'COM_DADOS', label: '🟢 Sim, tenho dados' },
                              { val: 'MAIS_OU_MENOS', label: '🟡 Mais ou menos' },
                              { val: 'NAO_CONTROLO', label: '🔴 Não controlo' }
                            ].map(opt => (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => updateForm({ C3_sectorConditionalAnswer: opt.val })}
                                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                                  formData.C3_sectorConditionalAnswer === opt.val ? 'border-brand-iris bg-brand-iris/10 text-brand-iris font-semibold' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black/20'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {formData.E3_sector === 'COMMERCE' && (
                        <>
                          <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                            C3. (Comércio): Sabe qual o produto com maior margem de lucro nas suas prateleiras?
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                            {[
                              { val: 'EXATO', label: '🟢 Sim, sei exatamente' },
                              { val: 'ACHO', label: '🟡 Acho que sei' },
                              { val: 'NAO_SEI', label: '🔴 Não sei' }
                            ].map(opt => (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => updateForm({ C3_sectorConditionalAnswer: opt.val })}
                                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                                  formData.C3_sectorConditionalAnswer === opt.val ? 'border-brand-iris bg-brand-iris/10 text-brand-iris font-semibold' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black/20'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {(formData.E3_sector === 'TRANSPORT' || formData.E3_sector === 'INDUSTRY') && (
                        <>
                          <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                            C3. Sabe calcular exatamente o custo operacional unitário (por quilómetro ou unidade produzida)?
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                            {[
                              { val: 'EXATO', label: '🟢 Sim, sei exatamente' },
                              { val: 'ACHO', label: '🟡 Acho que sei' },
                              { val: 'NAO_SEI', label: '🔴 Não sei' }
                            ].map(opt => (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => updateForm({ C3_sectorConditionalAnswer: opt.val })}
                                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                                  formData.C3_sectorConditionalAnswer === opt.val ? 'border-brand-iris bg-brand-iris/10 text-brand-iris font-semibold' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black/20'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Bloco D — TESTE DE URGÊNCIA E DISPOSIÇÃO ( Early Adopter Factor ) */}
              {step === 4 && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                      <Flame className="text-brand-iris" size={20} />
                      BLOCO D – TESTE DE URGÊNCIA E ADOÇÃO
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Este é o bloco mais preditivo de utilidade e retenção do sistema Fintel OS de acordo com as metas do júri LISPA.</p>
                  </div>

                  {/* D1: Probabilidade de usar */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                      D1. Se a OLO Fintel estivesse disponível HOJE, qual a probabilidade de começar a usar para registar as operações de amanhã?
                    </label>
                    <div className="space-y-2">
                      {[
                        { val: '0_20', label: '❌ 0% a 20% (Não me interessa / prefiro como está)' },
                        { val: '21_50', label: '🤷 21% a 50% (Talvez no futuro, mas sem pressa)' },
                        { val: '51_80', label: '📈 51% a 80% (Provavelmente, quero testar e ver)' },
                        { val: '81_100', label: '🚀 81% a 100% (Instalo agora mesmo, estou farto da bagunça!)' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => updateForm({ D1_probabilityToUse: opt.val })}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            formData.D1_probabilityToUse === opt.val 
                              ? 'border-brand-iris bg-brand-iris/5 text-brand-iris font-semibold' 
                              : 'border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40'
                          }`}
                        >
                          <input 
                            type="radio" 
                            checked={formData.D1_probabilityToUse === opt.val} 
                            onChange={() => {}} 
                            className="pointer-events-none accent-brand-iris shrink-0" 
                          />
                          <span className="text-xs">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* D2: Disposição a partilhar dados reais */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                      D2. Durante o primeiro mês, estaria disposto a partilhar os seus dados reais (vendas, despesas) na plataforma para receber um diagnóstico completo e preparar a sua identidade bancária?
                    </label>
                    <div className="space-y-2">
                      {[
                        { val: 'ALL_GOLD', label: '🏆 Sim, partilho tudo para ter o diagnóstico de credibilidade (Nível Ouro)' },
                        { val: 'AGGREGATED_SILVER', label: '🥈 Sim, mas apenas dados agregados/anónimos para segurança (Nível Prata)' },
                        { val: 'FICTIONAL_BRONZE', label: '🥉 Prefiro apenas testar a plataforma com dados fictícios (Nível Bronze)' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => updateForm({ D2_shareRealData: opt.val })}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            formData.D2_shareRealData === opt.val 
                              ? 'border-brand-iris bg-brand-iris/5 text-brand-iris font-semibold' 
                              : 'border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40'
                          }`}
                        >
                          <input 
                            type="radio" 
                            checked={formData.D2_shareRealData === opt.val} 
                            onChange={() => {}} 
                            className="pointer-events-none accent-brand-iris shrink-0" 
                          />
                          <span className="text-xs">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* D3: Disposição para pagar */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                      D3. Considerando o valor de organização, relatórios e IA entregues pela plataforma, quanto estaria disposto a pagar mensalmente após um período de teste gratuito?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { val: 'UP_2500', label: '💵 Até 2.500 Kz (Plano Essencial)' },
                        { val: '2500_7500', label: '💳 Entre 2.500 e 7.500 Kz (Plano Profissional)' },
                        { val: 'MORE_7500', label: '🏢 Mais de 7.500 Kz (Plano Enterprise)' },
                        { val: 'FREE', label: '🆓 Não pagaria nada, só usaria se fosse 100% grátis' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => updateForm({ D3_willingToPay: opt.val })}
                          className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            formData.D3_willingToPay === opt.val 
                              ? 'border-brand-iris bg-brand-iris/5 text-brand-iris font-semibold' 
                              : 'border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40'
                          }`}
                        >
                          <input 
                            type="radio" 
                            checked={formData.D3_willingToPay === opt.val} 
                            onChange={() => {}} 
                            className="pointer-events-none accent-brand-iris shrink-0" 
                          />
                          <span className="text-xs">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Bloco E — DADOS DEMOGRÁFICOS (Segmentação do Mercado) */}
              {step === 5 && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                      <Users className="text-brand-iris" size={20} />
                      BLOCO E – DADOS DE IDENTIFICAÇÃO E SEGMENTAÇÃO
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Insira os dados finais para podermos segmentar o mercado nacional e gerar o relatório correto para a sua província.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Nome da Organização (Opcional)</label>
                      <input 
                        type="text" 
                        value={formData.E1_orgName}
                        onChange={e => updateForm({ E1_orgName: e.target.value })}
                        placeholder="Ex: Cooperativa de Frutas do Lubango" 
                        className="w-full h-11 px-4 rounded-xl border bg-white dark:bg-[#111115] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white focus:border-brand-iris outline-none text-xs transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">NIF da Organização (Opcional)</label>
                      <input 
                        type="text" 
                        value={formData.E2_nif}
                        onChange={e => updateForm({ E2_nif: e.target.value })}
                        placeholder="Ex: 5410932821" 
                        className="w-full h-11 px-4 rounded-xl border bg-white dark:bg-[#111115] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white focus:border-brand-iris outline-none text-xs transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Província de Operação Principal</label>
                      <select 
                        value={formData.E4_province}
                        onChange={e => updateForm({ E4_province: e.target.value })}
                        className="w-full h-11 px-3 rounded-xl border bg-white dark:bg-[#111115] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white focus:border-brand-iris outline-none text-xs transition-all"
                      >
                        {provinces.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    {formData.E4_province === 'Outra' && (
                      <div className="space-y-2 animate-slide-up">
                        <label className="text-xs font-bold text-gray-400 uppercase">Especifique a Província</label>
                        <input 
                          type="text" 
                          value={formData.E4_provinceOther}
                          onChange={e => updateForm({ E4_provinceOther: e.target.value })}
                          placeholder="Ex: Namibe, Lunda, Cabinda, etc." 
                          className="w-full h-11 px-4 rounded-xl border bg-white dark:bg-[#111115] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white focus:border-brand-iris outline-none text-xs transition-all"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Tamanho da Equipa / Membros</label>
                      <select 
                        value={formData.E5_employeeCount}
                        onChange={e => updateForm({ E5_employeeCount: e.target.value })}
                        className="w-full h-11 px-3 rounded-xl border bg-white dark:bg-[#111115] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white focus:border-brand-iris outline-none text-xs transition-all"
                      >
                        <option value="">Selecione...</option>
                        <option value="1_5">👥 1 a 5 colaboradores/membros</option>
                        <option value="6_20">👥 6 a 20 colaboradores/membros</option>
                        <option value="21_100">👥 21 a 100 colaboradores/membros</option>
                        <option value="MORE_100">👥 Mais de 100 colaboradores/membros</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Função / Perfil (Sua Persona)</label>
                      <select 
                        value={formData.E6_persona}
                        onChange={e => updateForm({ E6_persona: e.target.value })}
                        className="w-full h-11 px-3 rounded-xl border bg-white dark:bg-[#111115] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white focus:border-brand-iris outline-none text-xs transition-all"
                      >
                        <option value="">Selecione...</option>
                        <option value="PRESIDENTE">👑 Presidente / Sócio-Gerente</option>
                        <option value="GESTOR">👔 Gestor / Administrador</option>
                        <option value="ANALISTA">📈 Analista Financeiro / Contabilista</option>
                        <option value="CONSULTOR">💼 Consultor Externo</option>
                        <option value="MEMBRO">🤝 Membro / Colaborador de Cooperativa</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                        Contacto Obrigatório (Email/Telefone)
                        <span className="text-red-500 font-extrabold">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.E7_contact}
                        onChange={e => updateForm({ E7_contact: e.target.value })}
                        placeholder="Ex: +244 923 000 000 ou email@exemplo.com" 
                        className="w-full h-11 px-4 rounded-xl border bg-white dark:bg-[#111115] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white focus:border-brand-iris outline-none text-xs transition-all"
                      />
                      <p className="text-[10px] text-gray-400 leading-relaxed">Necessário para o envio do relatório de diagnóstico em formato PDF.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-[10px] text-gray-400 mt-4 p-3 bg-gray-50 dark:bg-black/20 rounded-xl">
                    <input type="checkbox" defaultChecked disabled className="mt-0.5 accent-brand-iris shrink-0" />
                    <span>Declaro que os dados fornecidos são verídicos e autorizo o tratamento de dados agregados não identificáveis para fins estatísticos e apresentação ao Júri de Inovação da LISPA.</span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-between mt-10 border-t border-gray-100 dark:border-gray-800 pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800/50 disabled:opacity-50 text-xs flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  Voltar
                </button>

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-brand-iris hover:bg-brand-iris-hover text-white rounded-xl font-bold transition-all text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    Continuar
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-extrabold transition-all text-xs shadow flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'A processar...' : 'Submeter Respostas'}
                    <CheckCircle size={15} />
                  </button>
                )}
              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
}
