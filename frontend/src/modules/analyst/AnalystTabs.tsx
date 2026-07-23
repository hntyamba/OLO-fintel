import React from 'react';
import {
  Check,
  Eye,
  Layers,
} from 'lucide-react';
import { DocumentRecord, Organization } from '../../types/index.js';

interface AnalystTabsProps {
  analystTab: 'applications' | 'scoring' | 'docs' | 'workflow';
  setAnalystTab: (v: 'applications' | 'scoring' | 'docs' | 'workflow') => void;
  creditApplications: any[];
  setCreditApplications: React.Dispatch<React.SetStateAction<any[]>>;
  organizations: Organization[];
  documentsQueue: DocumentRecord[];
  selectedAppWorkflow: any;
  setSelectedAppWorkflow: (v: any) => void;
  setViewingDoc: (v: DocumentRecord | null) => void;
}

export function AnalystTabs({
  analystTab,
  setAnalystTab,
  creditApplications,
  setCreditApplications,
  organizations,
  documentsQueue,
  selectedAppWorkflow,
  setSelectedAppWorkflow,
  setViewingDoc,
}: AnalystTabsProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Analyst Performance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Candidaturas Pendentes</p>
          <p className="text-2xl font-bold text-brand-iris mt-2">
            {creditApplications.filter((a: any) => a.status === 'Em Análise' || a.status === 'Pendente').length} Pedidos
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Média de Scores OLO</p>
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
                {creditApplications.map((app: any) => (
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
                        onClick={() => {
                          alert(`Relatório detalhado de Score gerado para ${org.name}.\nMaturidade: ${org.maturity}\nIntegridade de Dados: 92%`);
                        }}
                        className="px-2.5 py-1 text-[10px] font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Gerar Relatório OLO
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
                    {[
                      { id: 'doc-q-1', orgName: 'Cooperativa Agrícola Humpata', name: 'NIF_Cooperativa_Humpata.pdf', type: 'NIF', date: '2026-07-15', status: 'VERIFIED' },
                      { id: 'doc-q-2', orgName: 'Cooperativa Agrícola Humpata', name: 'Estatuto_Social_Publicado.pdf', type: 'ID_CARD', date: '2026-07-16', status: 'PENDING' },
                      { id: 'doc-q-3', orgName: 'Cooperativa Agrícola Humpata', name: 'Extrato_Bancario_Banco_BAI_Q1.pdf', type: 'BANK_STATEMENT', date: '2026-07-17', status: 'PENDING' },
                      { id: 'doc-q-4', orgName: 'Pescas Artesanais do Namibe', name: 'Licenca_Pesca_Maritima_2026.pdf', type: 'LICENSE', date: '2026-07-18', status: 'PENDING' }
                    ].map(doc => (
                      <tr key={doc.id} className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                        <td className="py-3 font-semibold text-gray-900 dark:text-white">{doc.orgName}</td>
                        <td className="py-3 font-mono text-xs">{doc.name}</td>
                        <td className="py-3"><span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-500">{doc.type}</span></td>
                        <td className="py-3 font-mono text-xs text-gray-400">{doc.date}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            doc.status === 'VERIFIED'
                              ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          }`}>
                            {doc.status}
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
                    ))}
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
                  const found = creditApplications.find((a: any) => a.id === e.target.value);
                  if (found) setSelectedAppWorkflow(found);
                }}
                value={selectedAppWorkflow?.id || ''}
                className="text-xs font-semibold px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
              >
                <option value="" disabled>Escolher candidatura ativa...</option>
                {creditApplications.map((app: any) => (
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
                        setCreditApplications(prev => prev.map((a: any) => a.id === selectedAppWorkflow.id ? { ...a, step: nextStep, status: nextStep === 4 ? 'Aprovado' : 'Em Análise' } : a));
                        setSelectedAppWorkflow({ ...selectedAppWorkflow, step: nextStep, status: nextStep === 4 ? 'Aprovado' : 'Em Análise' });
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
                      setCreditApplications(prev => prev.map((a: any) => a.id === selectedAppWorkflow.id ? { ...a, status: 'Aprovado' } : a));
                      setSelectedAppWorkflow({ ...selectedAppWorkflow, status: 'Aprovado' });
                      alert('Candidatura aprovada de forma definitiva! Transmitido por API de crédito ao Banco parceiro.');
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-all"
                  >
                    Aprovação Direta
                  </button>
                  <button
                    onClick={() => {
                      setCreditApplications(prev => prev.map((a: any) => a.id === selectedAppWorkflow.id ? { ...a, status: 'Revisão Necessária' } : a));
                      setSelectedAppWorkflow({ ...selectedAppWorkflow, status: 'Revisão Necessária' });
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
  );
}
