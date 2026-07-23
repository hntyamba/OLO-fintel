import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { Organization } from '../../types/index.js';

interface ConsultantTabsProps {
  consultantTab: 'clients' | 'plans' | 'ai_recs';
  setConsultantTab: (v: 'clients' | 'plans' | 'ai_recs') => void;
  organizations: Organization[];
  activeClient: string | null;
  setActiveClient: (v: string | null) => void;
  aiPrompt: string;
  setAiPrompt: (v: string) => void;
  aiPlan: string[];
  setAiPlan: (v: string[]) => void;
  handleGenerateAIPlan: (e: React.FormEvent) => void;
}

export function ConsultantTabs({
  consultantTab,
  setConsultantTab,
  organizations,
  activeClient,
  setActiveClient,
  aiPrompt,
  setAiPrompt,
  aiPlan,
  setAiPlan,
  handleGenerateAIPlan,
}: ConsultantTabsProps) {
  return (
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
                Criador de Plano de Acção Inteligente OLO
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
              <h3 className="font-bold text-base text-gray-900 dark:text-white">🤖 OLO Strategic Advisor Center</h3>
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
                  const org = organizations.find(o => o.id === activeClient);
                  const plan = [
                    `🔍 DIAGNÓSTICO: A cooperativa ${org?.name} apresenta robusto fluxo diário, mas falta de automatização e registo consolidado do NIF.`,
                    `🚨 RISCOS: Exclusão AML imediata por bancos comerciais devido a dados fiscais não homologados e flutuações de preços de mercado.`,
                    `💡 OPORTUNIDADES: Aumento de score OLO de 55 para 80 pontos, elegibilidade na linha de microcrédito do Banco BAI Luanda.`,
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
  );
}
