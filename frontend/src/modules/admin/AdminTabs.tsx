import React from 'react';
import { useLanguage } from '../../components/LanguageContext.js';
import {
  Eye,
  Layers,
  FileCheck2,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { DocumentRecord, Organization } from '../../types/index.js';

interface AdminTabsProps {
  superAdminTab: 'ecosystem' | 'users' | 'kyc' | 'survey' | 'logs' | 'consultants';
  setSuperAdminTab: (v: 'ecosystem' | 'users' | 'kyc' | 'survey' | 'logs' | 'consultants') => void;
  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
  usersList: any[];
  setUsersList: React.Dispatch<React.SetStateAction<any[]>>;
  consultants: any[];
  documentsQueue: DocumentRecord[];
  systemLogs: string[];
  setSystemLogs: React.Dispatch<React.SetStateAction<string[]>>;
  partnerBanks: any[];
  setPartnerBanks: React.Dispatch<React.SetStateAction<any[]>>;
  surveyList: any[];
  activeOrgToAssign: string | null;
  setActiveOrgToAssign: (v: string | null) => void;
  viewingDoc: DocumentRecord | null;
  setViewingDoc: (v: DocumentRecord | null) => void;
  handleDelegate: (orgId: string, consId: string) => void;
  fetchDashboardData: () => void;
}

export function AdminTabs({
  superAdminTab,
  setSuperAdminTab,
  organizations,
  setOrganizations,
  usersList,
  setUsersList,
  consultants,
  documentsQueue,
  systemLogs,
  setSystemLogs,
  partnerBanks,
  setPartnerBanks,
  surveyList,
  activeOrgToAssign,
  setActiveOrgToAssign,
  viewingDoc,
  setViewingDoc,
  handleDelegate,
  fetchDashboardData,
}: AdminTabsProps) {
  return (
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
            {documentsQueue.filter(d => d.status === 'PENDING').length || 3} Documentos
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Score Geral</p>
          <p className="text-2xl font-bold text-green-500 mt-2">
            {usersList.length ? Math.round(usersList.reduce((acc: number, u: any) => acc + (u.fundingScore || 0), 0) / usersList.length) : 58} Pontos
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
                    onClick={() => { alert(`Configuração de credenciais de API do ${bank.name} aberta.`); }}
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
                Promova, despromova ou suspenda o acesso de utilizadores da plataforma OLO Fintel.
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
                {usersList.map((u: any) => {
                  const relatedOrg = organizations.find(o => o.id === u.organizationId);
                  const isSuspended = relatedOrg?.suspended || false;
                  return (
                    <tr key={u.id} className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                      <td className="py-3 font-semibold text-gray-900 dark:text-white">{u.name}</td>
                      <td className="py-3 text-gray-500 font-mono text-xs">{u.email}</td>
                      <td className="py-3 text-xs text-gray-400">
                        {u.organizationName || relatedOrg?.name || 'Sistema OLO'}
                      </td>
                      <td className="py-3">
                        <select
                          value={u.role}
                          onChange={async (e) => {
                            const newRole = e.target.value;
                            setUsersList(prev => prev.map((usr: any) => usr.id === u.id ? { ...usr, role: newRole } : usr));
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
            <span className="text-xs text-gray-400">Total de Documentos: {documentsQueue.length || 4}</span>
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
                {(documentsQueue.length > 0 ? documentsQueue : [
                  { id: 'doc-q-1', orgName: 'Cooperativa Agrícola Humpata', name: 'NIF_Cooperativa_Humpata.pdf', type: 'NIF', status: 'VERIFIED' },
                  { id: 'doc-q-2', orgName: 'Cooperativa Agrícola Humpata', name: 'Estatuto_Social_Publicado.pdf', type: 'ID_CARD', status: 'PENDING' },
                  { id: 'doc-q-3', orgName: 'Cooperativa Agrícola Humpata', name: 'Extrato_Bancario_Banco_BAI_Q1.pdf', type: 'BANK_STATEMENT', status: 'PENDING' },
                  { id: 'doc-q-4', orgName: 'Pescas Artesanais do Namibe', name: 'Licenca_Pesca_Maritima_2026.pdf', type: 'LICENSE', status: 'PENDING' }
                ]).map((doc: any) => (
                  <tr key={doc.id} className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="py-3 font-semibold text-gray-900 dark:text-white">{doc.orgName || 'Cooperativa Humpata'}</td>
                    <td className="py-3 font-mono text-xs">{doc.name}</td>
                    <td className="py-3">
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-500 uppercase">{doc.type}</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        doc.status === 'VERIFIED'
                          ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                          : doc.status === 'REJECTED'
                          ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}>
                        {doc.status}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Survey Engine */}
      {superAdminTab === 'survey' && (
        <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              📋 Survey Engine — Inquéritos de Diagnóstico Inicial
            </h3>
            <span className="text-xs text-gray-400">Total de Submissões: {surveyList.length}</span>
          </div>
          <p className="text-xs text-gray-400">
            Veja as respostas completas dos inquéritos preenchidos pelos produtores rurais para entender os maiores gargalos de financiamento.
          </p>

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
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">Província: {srv.province}</p>
                  <div className="mt-3 bg-white dark:bg-[#15151F] p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 text-xs">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Maior Desafio:</p>
                    <p className="text-gray-800 dark:text-gray-200 mt-1 leading-snug font-medium">"{srv.biggestChallenge}"</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-[10px] text-gray-500">
                  <div className="flex justify-between">
                    <span>Usa papel no campo?</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{srv.usesPaper ? 'Sim' : 'Não'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Usa folha Excel?</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{srv.usesExcel ? 'Sim' : 'Não'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coordina via WhatsApp?</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{srv.usesWhatsApp ? 'Sim' : 'Não'}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert(`Resumo do Inquérito de ${srv.orgName}:\n\n- Desafio: ${srv.biggestChallenge}\n- Província: ${srv.province}\n- Sector: ${srv.sector}\n- Gestão de Dados: ${srv.usesPaper ? 'Papel' : ''} ${srv.usesExcel ? 'Excel' : ''} ${srv.usesWhatsApp ? 'WhatsApp' : ''}`);
                  }}
                  className="w-full py-1.5 text-[10px] font-bold text-center border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                >
                  Ver Inquérito Completo
                </button>
              </div>
            ))}
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
              Selecione e atribua consultores qualificados da rede OLO para dar suporte direto de mentorização técnica às cooperativas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {organizations.map(org => {
              const assignedConsultant = consultants.find((c: any) => c.assignedOrgs.includes(org.id));
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
                        {consultants.map((c: any) => (
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
  );
}
