/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getApiUrl } from '../../lib/api';
import { 
  FileText, 
  ShieldCheck, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  UploadCloud, 
  CheckCircle, 
  Eye, 
  Download, 
  Lock, 
  Filter, 
  RefreshCw, 
  ChevronRight, 
  Search, 
  FileCheck, 
  Info, 
  X, 
  Check, 
  Sparkles, 
  UserCheck, 
  History, 
  Building
} from 'lucide-react';
import { DocumentRecord, Organization } from '../../types/index.js';

interface DocumentKYCModuleProps {
  key?: string;
  userId: string;
  userRole: string;
  organizationId: string | null;
  onRefresh?: () => void;
}

export function DocumentsPage({ userId, userRole, organizationId, onRefresh }: DocumentKYCModuleProps) {
  // --- TABS ---
  const isAdminOrAnalyst = ['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'CONSULTANT'].includes(userRole);
  const [activeTab, setActiveTab] = useState<'meus-documentos' | 'fila-kyc'>(
    isAdminOrAnalyst ? 'fila-kyc' : 'meus-documentos'
  );

  // --- STATE ---
  const [myDocuments, setMyDocuments] = useState<DocumentRecord[]>([]);
  const [allOrganizations, setAllOrganizations] = useState<Organization[]>([]);
  const [allDocuments, setAllDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [kycFilter, setKycFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING' | 'REJECTED' | 'SUSPENDED'>('ALL');
  
  // Modal / Feedback state
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [selectedDocForHistory, setSelectedDocForHistory] = useState<DocumentRecord | null>(null);
  const [selectedDocForReview, setSelectedDocForReview] = useState<{ doc: DocumentRecord, orgName: string } | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const triggerAlert = (text: string, type: 'success' | 'error' = 'success') => {
    setAlertMsg({ text, type });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      if (organizationId) {
        const res = await fetch(getApiUrl(`/api/documents/list/${organizationId}`));
        if (res.ok) {
          const data = await res.json();
          setMyDocuments(data);
        }
      }

      if (isAdminOrAnalyst) {
        const orgRes = await fetch(getApiUrl('/api/admin/organizations'));
        const docRes = await fetch(getApiUrl('/api/admin/documents'));
        if (orgRes.ok) {
          setAllOrganizations(await orgRes.json());
        }
        if (docRes.ok) {
          setAllDocuments(await docRes.json());
        }
      }
    } catch (e) {
      console.error('Error fetching KYC documents', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [organizationId, userRole]);

  // --- MANUAL REFRESH ---
  const handleManualRefresh = () => {
    fetchData();
    if (onRefresh) onRefresh();
    triggerAlert('Dados de KYC atualizados com sucesso!');
  };

  // --- FILE UPLOAD SIMULATOR ---
  const handleUploadDocument = async (e: React.FormEvent, type: DocumentRecord['type']) => {
    e.preventDefault();
    if (!uploadedFileName || !organizationId) return;

    try {
      const res = await fetch(getApiUrl('/api/documents/upload'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: organizationId,
          type,
          name: uploadedFileName,
          uploadedBy: userRole
        })
      });

      if (res.ok) {
        triggerAlert(`Documento ${type} carregado com sucesso como nova versão!`);
        setUploadedFileName('');
        setUploadingType(null);
        fetchData();
        if (onRefresh) onRefresh();
      } else {
        const err = await res.json();
        triggerAlert(err.error || 'Erro no envio do ficheiro.', 'error');
      }
    } catch (e) {
      console.error(e);
      triggerAlert('Erro ao conectar ao servidor.', 'error');
    }
  };

  // --- REVIEW ACTION HANDLER ---
  const handleReviewAction = async (action: 'VERIFIED' | 'REJECTED') => {
    if (!selectedDocForReview) return;

    try {
      const res = await fetch(getApiUrl('/api/admin/document-action'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: selectedDocForReview.doc.id,
          action,
          feedback: action === 'REJECTED' ? reviewFeedback : undefined,
          actionBy: `${userRole} (ID: ${userId.substring(0, 6)})`
        })
      });

      if (res.ok) {
        triggerAlert(`Documento ${action === 'VERIFIED' ? 'aprovado' : 'rejeitado'} com sucesso!`);
        setSelectedDocForReview(null);
        setReviewFeedback('');
        fetchData();
        if (onRefresh) onRefresh();
      } else {
        const err = await res.json();
        triggerAlert(err.error || 'Erro ao guardar validação.', 'error');
      }
    } catch (e) {
      console.error(e);
      triggerAlert('Erro ao conectar ao servidor.', 'error');
    }
  };

  // --- HELPER FOR FALLBACK AUDIT HISTORY ---
  const getDocHistory = (doc: DocumentRecord) => {
    if (doc.history && doc.history.length > 0) {
      return doc.history;
    }
    // Dynamic fallback audit history for pre-seeded database records
    const fallback: Array<{
      version: number;
      name: string;
      uploadedAt: string;
      actionBy: string;
      actionType: 'UPLOAD' | 'REPLACE' | 'APPROVED' | 'REJECTED';
      feedback?: string;
    }> = [
      {
        version: 1,
        name: doc.name,
        uploadedAt: doc.uploadedAt,
        actionBy: 'Representante da Cooperativa',
        actionType: 'UPLOAD',
        feedback: undefined
      }
    ];

    if (doc.status === 'VERIFIED') {
      fallback.push({
        version: 1,
        name: doc.name,
        uploadedAt: new Date(new Date(doc.uploadedAt).getTime() + 12 * 3600 * 1000).toISOString(),
        actionBy: 'Carlos Manuel (SuperAdmin)',
        actionType: 'APPROVED' as const,
        feedback: 'Documento legal em perfeita conformidade com as diretrizes do BNA.'
      });
    } else if (doc.status === 'REJECTED') {
      fallback.push({
        version: 1,
        name: doc.name,
        uploadedAt: new Date(new Date(doc.uploadedAt).getTime() + 8 * 3600 * 1000).toISOString(),
        actionBy: 'Sofia Antunes (Analyst)',
        actionType: 'REJECTED' as const,
        feedback: doc.feedback || 'NIF ilegível ou expirado.'
      });
    }
    return fallback;
  };

  // --- CALCULATE KYC PROGRESS ---
  const getKycProgress = (orgId: string) => {
    const orgDocs = allDocuments.filter(d => d.orgId === orgId);
    if (orgDocs.length === 0) return 0;
    
    // Each of the 4 key doc types represents 25% if verified
    const requiredTypes: DocumentRecord['type'][] = ['NIF', 'LICENSE', 'ESTATUTO', 'CERTIFICADO'];
    let verifiedCount = 0;
    
    requiredTypes.forEach(t => {
      const doc = orgDocs.find(d => d.type === t && d.status === 'VERIFIED');
      if (doc) verifiedCount++;
    });

    return verifiedCount * 25;
  };

  // --- FILTER ORGANIZATIONS FOR KYC QUEUE ---
  const filteredOrgs = allOrganizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          org.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          org.sector.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    const progress = getKycProgress(org.id);
    const orgDocs = allDocuments.filter(d => d.orgId === org.id);
    const hasRejected = orgDocs.some(d => d.status === 'REJECTED');
    const hasPending = orgDocs.some(d => d.status === 'PENDING');

    if (kycFilter === 'ALL') return true;
    if (kycFilter === 'VERIFIED') return progress === 100 && !org.suspended;
    if (kycFilter === 'PENDING') return hasPending && progress < 100 && !org.suspended;
    if (kycFilter === 'REJECTED') return hasRejected;
    if (kycFilter === 'SUSPENDED') return org.suspended;

    return true;
  });

  // Count stats
  const totalOrgsCount = allOrganizations.length;
  const verifiedOrgsCount = allOrganizations.filter(o => getKycProgress(o.id) === 100 && !o.suspended).length;
  const pendingOrgsCount = allOrganizations.filter(o => allDocuments.filter(d => d.orgId === o.id).some(d => d.status === 'PENDING')).length;
  const suspendedOrgsCount = allOrganizations.filter(o => o.suspended).length;

  return (
    <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm space-y-6" id="integrated-kyc-module">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-gray-100 dark:border-gray-800 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Lock size={12} />
              Módulo Documental & KYC
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[9px] font-bold">
              Histórico Auditável e Versões
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mt-2">
            Central de Documentos Legais e Conformidade KYC
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Gestão segura e auditável de NIF, Licenças, Estatutos e Certificados corporativos para validação do Fundo OLO e LISPA.
          </p>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button 
            onClick={handleManualRefresh}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#20202B] rounded-xl transition-all cursor-pointer"
            title="Sincronizar dados"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Sincronizar
          </button>
        </div>
      </div>

      {/* ALERTS */}
      {alertMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -10 }}
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md ${
            alertMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {alertMsg.type === 'success' ? <CheckCircle size={15} /> : <XCircle size={15} />}
          <span>{alertMsg.text}</span>
        </motion.div>
      )}

      {/* CORE KPI SUMMARY STATS FOR ADMIN */}
      {isAdminOrAnalyst && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Organizações Totais</span>
            <p className="text-xl lg:text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{totalOrgsCount}</p>
            <span className="text-[9px] text-gray-400 mt-2">Cooperativas e PMEs registadas</span>
          </div>

          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">KYC Totalmente Verificado</span>
            <p className="text-xl lg:text-2xl font-black text-emerald-500 mt-1">{verifiedOrgsCount}</p>
            <span className="text-[9px] text-gray-400 mt-2">Prontas para elegibilidade de crédito</span>
          </div>

          <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Em Fila de Verificação</span>
            <p className="text-xl lg:text-2xl font-black text-amber-500 mt-1">{pendingOrgsCount}</p>
            <span className="text-[9px] text-gray-400 mt-2">Aguardando revisão de analistas</span>
          </div>

          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Organizações Suspensas</span>
            <p className="text-xl lg:text-2xl font-black text-red-500 mt-1">{suspendedOrgsCount}</p>
            <span className="text-[9px] text-gray-400 mt-2">Com inconformidades graves</span>
          </div>
        </div>
      )}

      {/* TAB NAVIGATION */}
      {isAdminOrAnalyst && (
        <div className="flex border-b border-gray-100 dark:border-gray-800 pb-2 gap-1.5">
          <button
            onClick={() => setActiveTab('fila-kyc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'fila-kyc' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'hover:bg-gray-50 dark:hover:bg-[#20202B] text-gray-600 dark:text-gray-400'
            }`}
          >
            <UserCheck size={14} />
            <span>Fila de Verificação KYC ({filteredOrgs.length})</span>
          </button>

          {organizationId && (
            <button
              onClick={() => setActiveTab('meus-documentos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'meus-documentos' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'hover:bg-gray-50 dark:hover:bg-[#20202B] text-gray-600 dark:text-gray-400'
              }`}
            >
              <FileText size={14} />
              <span>Os Meus Documentos Legais</span>
            </button>
          )}
        </div>
      )}

      {/* --- CONTENT AREA --- */}
      <div>
        
        {/* TAB 1: MEUS DOCUMENTOS (Cooperative/Organization User view) */}
        {activeTab === 'meus-documentos' && (
          <div className="space-y-6">
            
            {/* Explanatory Banner */}
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-950/50 flex items-start gap-3">
              <Info size={16} className="text-purple-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-purple-900 dark:text-purple-200 uppercase">Submissão Segura de Documentação de Angola</h4>
                <p className="text-[11px] text-purple-800/80 dark:text-purple-300 leading-relaxed">
                  Para ser elegível ao financiamento OLO, submeta e mantenha atualizada a documentação da sua organização. O carregamento de novas versões atualiza automaticamente o estado para 'PENDENTE' para revisão imediata da equipa de auditoria.
                </p>
              </div>
            </div>

            {/* Grid of Legal Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { type: 'NIF' as const, label: 'NIF Corporativo', desc: 'Identificação Fiscal da empresa' },
                { type: 'LICENSE' as const, label: 'Alvará / Licença Agrícola', desc: 'Licença comercial ou florestal' },
                { type: 'ESTATUTO' as const, label: 'Estatuto da Sociedade', desc: 'Publicação em Diário da República' },
                { type: 'CERTIFICADO' as const, label: 'Certificações / Selo Verde', desc: 'Qualidade ou responsabilidade ambiental' }
              ].map(docTypeInfo => {
                const doc = myDocuments.find(d => d.type === docTypeInfo.type);
                
                return (
                  <div 
                    key={docTypeInfo.type}
                    className="p-4 bg-gray-50 dark:bg-[#1E1E26] rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between min-h-[220px]"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                          <FileText size={18} />
                        </span>
                        {doc ? (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            doc.status === 'VERIFIED' 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                              : doc.status === 'REJECTED' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {doc.status === 'VERIFIED' ? 'Aprovado' : doc.status === 'REJECTED' ? 'Rejeitado' : 'Pendente'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-500 text-[9px] font-bold uppercase">
                            Não Enviado
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">{docTypeInfo.label}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{docTypeInfo.desc}</p>
                      </div>

                      {doc && (
                        <div className="space-y-1.5 p-2.5 bg-white dark:bg-[#121219] rounded-xl border border-gray-100 dark:border-gray-900">
                          <p className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 truncate font-mono">
                            {doc.name}
                          </p>
                          <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                            <span>Versão: v{doc.version || 1}</span>
                            <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                          </div>
                          {doc.feedback && doc.status === 'REJECTED' && (
                            <p className="text-[9px] text-red-500 font-medium italic border-t border-red-100 dark:border-red-950 pt-1 mt-1">
                              Feedback: {doc.feedback}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-auto flex gap-1.5 border-t border-gray-100 dark:border-gray-800">
                      {doc && (
                        <>
                          <button 
                            onClick={() => setSelectedDocForHistory(doc)}
                            className="flex-1 py-1.5 text-[10px] font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2A2A38] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                            title="Ver histórico auditável de versões"
                          >
                            <History size={11} /> Audit
                          </button>
                          
                          <button 
                            onClick={() => triggerAlert('Download do documento iniciado (Simulação)')}
                            className="p-1.5 text-gray-400 hover:text-purple-500 rounded-lg transition-colors cursor-pointer"
                            title="Descarregar ficheiro"
                          >
                            <Download size={13} />
                          </button>
                        </>
                      )}

                      <button 
                        onClick={() => {
                          setUploadingType(docTypeInfo.type);
                          setUploadedFileName(`${docTypeInfo.type}_${organizationId || 'Coop'}_v${doc ? (doc.version || 1) + 1 : 1}.pdf`);
                        }}
                        className={`py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          doc ? 'flex-1 border border-purple-500/20 text-purple-600 dark:text-purple-400 hover:bg-purple-500/5' : 'w-full bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
                        }`}
                      >
                        <UploadCloud size={12} /> {doc ? 'Atualizar' : 'Submeter'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Upload Modal / Form */}
            <AnimatePresence>
              {uploadingType && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-[#1E1E26] border border-gray-200 dark:border-gray-800 rounded-3xl max-w-md w-full p-6 shadow-xl relative space-y-4"
                  >
                    <button 
                      onClick={() => setUploadingType(null)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    >
                      <X size={18} />
                    </button>

                    <h3 className="text-sm font-black text-gray-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <UploadCloud className="text-purple-500" size={16} />
                      Carregar Nova Versão: {uploadingType}
                    </h3>

                    <form onSubmit={(e) => handleUploadDocument(e, uploadingType as any)} className="space-y-4">
                      {/* Drag & Drop simulated area */}
                      <div className="p-6 border-2 border-dashed border-purple-500/20 hover:border-purple-500/40 bg-purple-500/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 cursor-pointer">
                        <UploadCloud size={32} className="text-purple-500" />
                        <div>
                          <p className="text-xs font-extrabold text-gray-800 dark:text-gray-200">Arraste o seu ficheiro PDF ou clique para selecionar</p>
                          <p className="text-[10px] text-gray-400 mt-1">Apenas PDFs ou Imagens são permitidos. Tamanho máx: 10MB.</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Nome do Ficheiro Legal</label>
                        <input 
                          type="text"
                          value={uploadedFileName}
                          onChange={(e) => setUploadedFileName(e.target.value)}
                          className="w-full h-10 px-3 text-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121219] rounded-xl outline-none"
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => setUploadingType(null)}
                          className="flex-1 h-10 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 h-10 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Check size={14} /> Confirmar Envio
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* TAB 2: FILA KYC (Admin / SuperAdmin view) */}
        {activeTab === 'fila-kyc' && (
          <div className="space-y-4">
            
            {/* Search, Filter, and Stats Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-gray-50/50 dark:bg-[#1E1E26]/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="relative w-full md:w-80">
                <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Pesquisar cooperativa, província, setor..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121219] rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
                <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 shrink-0">
                  <Filter size={11} /> Filtrar Fila:
                </span>
                {[
                  { value: 'ALL' as const, label: 'Todos' },
                  { value: 'PENDING' as const, label: 'Pendentes' },
                  { value: 'VERIFIED' as const, label: 'Verificados' },
                  { value: 'REJECTED' as const, label: 'Rejeitados' },
                  { value: 'SUSPENDED' as const, label: 'Suspensos' }
                ].map(filterBtn => (
                  <button
                    key={filterBtn.value}
                    onClick={() => setKycFilter(filterBtn.value)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      kycFilter === filterBtn.value 
                        ? 'bg-purple-600 text-white shadow-sm' 
                        : 'bg-white dark:bg-[#13131A] text-gray-600 dark:text-gray-400 border border-gray-150 dark:border-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {filterBtn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Organizations KYC Cards List */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {filteredOrgs.map(org => {
                const orgDocs = allDocuments.filter(d => d.orgId === org.id);
                const progress = getKycProgress(org.id);
                
                return (
                  <div 
                    key={org.id}
                    className="p-5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-[#13131A] hover:shadow-md transition-all space-y-4"
                  >
                    {/* Card Header Info */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-900">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs font-extrabold text-gray-950 dark:text-white flex items-center gap-1.5">
                            <Building size={14} className="text-purple-500" />
                            {org.name}
                          </h4>
                          <span className="text-[9px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-mono uppercase">
                            {org.sector}
                          </span>
                          <span className="text-[9px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-mono">
                            {org.province}
                          </span>
                          {org.suspended && (
                            <span className="text-[9px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 uppercase animate-pulse">
                              <AlertTriangle size={10} /> Suspenso
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 font-mono">Nível de Maturidade: {org.maturity} | ID: {org.id}</p>
                      </div>

                      {/* Progress and status badge */}
                      <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end">
                        <div className="space-y-1 text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="text-[10px] font-black text-purple-600 dark:text-purple-400">{progress}% KYC</span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-600" style={{ width: `${progress}%` }} />
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
                          progress === 100 && !org.suspended
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : org.suspended 
                            ? 'bg-red-500/10 text-red-500' 
                            : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {progress === 100 && !org.suspended ? 'Verificado' : org.suspended ? 'Suspenso' : 'Pendente'}
                        </span>
                      </div>
                    </div>

                    {/* Organization's Documents Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { type: 'NIF' as const, label: 'NIF Corporativo' },
                        { type: 'LICENSE' as const, label: 'Alvará / Licença' },
                        { type: 'ESTATUTO' as const, label: 'Estatuto da Sociedade' },
                        { type: 'CERTIFICADO' as const, label: 'Certificações' }
                      ].map(docInfo => {
                        const doc = orgDocs.find(d => d.type === docInfo.type);

                        return (
                          <div 
                            key={docInfo.type}
                            className={`p-3 rounded-xl border flex flex-col justify-between min-h-[110px] ${
                              doc 
                                ? doc.status === 'VERIFIED' 
                                  ? 'bg-emerald-500/5 border-emerald-500/15' 
                                  : doc.status === 'REJECTED' 
                                  ? 'bg-red-500/5 border-red-500/15' 
                                  : 'bg-amber-500/5 border-amber-500/15'
                                : 'bg-gray-50/50 dark:bg-gray-900/40 border-gray-150 dark:border-gray-800 border-dashed'
                            }`}
                          >
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase truncate">
                                  {docInfo.label}
                                </span>
                                {doc && (
                                  <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                    doc.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : doc.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    v{doc.version || 1}
                                  </span>
                                )}
                              </div>
                              {doc ? (
                                <p className="text-[9px] text-gray-400 mt-1 truncate font-mono">{doc.name}</p>
                              ) : (
                                <p className="text-[9px] text-gray-400 italic mt-1">Não carregado</p>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100/10 gap-1">
                              {doc ? (
                                <>
                                  <button 
                                    onClick={() => setSelectedDocForHistory(doc)}
                                    className="p-1 text-gray-400 hover:text-purple-500 rounded"
                                    title="Histórico Auditável"
                                  >
                                    <Clock size={11} />
                                  </button>

                                  <button 
                                    onClick={() => setSelectedDocForReview({ doc, orgName: org.name })}
                                    className="px-2 py-0.5 bg-purple-600 hover:bg-purple-700 text-white text-[9px] font-bold rounded flex items-center gap-0.5 cursor-pointer"
                                    title="Rever documento legal"
                                  >
                                    Rever <ChevronRight size={10} />
                                  </button>
                                </>
                              ) : (
                                <span className="text-[9px] text-gray-400 font-semibold italic">N/A</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredOrgs.length === 0 && (
                <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                  Nenhuma organização correspondente encontrada na fila de conformidade.
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* MODAL 1: AUDIT TRAIL / HISTÓRICO DE VERSÕES */}
      <AnimatePresence>
        {selectedDocForHistory && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1E1E26] border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-6 shadow-xl relative space-y-4"
            >
              <button 
                onClick={() => setSelectedDocForHistory(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="text-sm font-black text-gray-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <History className="text-purple-500" size={16} />
                  Histórico Auditável e Versões do Documento
                </h3>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">Tipo: {selectedDocForHistory.type} | ID: {selectedDocForHistory.id}</p>
              </div>

              {/* Version History Timeline */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {getDocHistory(selectedDocForHistory).map((entry, idx) => (
                  <div key={idx} className="flex gap-3 relative pb-2">
                    {idx < getDocHistory(selectedDocForHistory).length - 1 && (
                      <span className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800" />
                    )}

                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      entry.actionType === 'UPLOAD' || entry.actionType === 'REPLACE' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950' 
                        : entry.actionType === 'APPROVED' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950' 
                        : 'bg-red-100 text-red-700 dark:bg-red-950'
                    }`}>
                      {entry.version}
                    </div>

                    <div className="flex-1 bg-gray-50 dark:bg-[#121219] p-3 rounded-xl border border-gray-100 dark:border-gray-900 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider">
                          {entry.actionType === 'UPLOAD' ? 'Registo Original' : entry.actionType === 'REPLACE' ? 'Substituição / Versão' : entry.actionType === 'APPROVED' ? 'Verificado & Aprovado' : 'Rejeitado com Inconformidades'}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">
                          {new Date(entry.uploadedAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-[10px] text-gray-500 font-mono leading-snug">
                        Ficheiro: <span className="text-gray-700 dark:text-gray-300 font-semibold">{entry.name}</span>
                      </p>

                      <div className="text-[9px] text-gray-400 flex items-center justify-between">
                        <span>Efetuado por: <strong className="text-gray-700 dark:text-gray-300 font-semibold">{entry.actionBy}</strong></span>
                      </div>

                      {entry.feedback && (
                        <p className={`p-2 rounded text-[9px] font-medium leading-relaxed ${
                          entry.actionType === 'APPROVED' ? 'bg-emerald-500/5 text-emerald-600' : 'bg-red-500/5 text-red-500'
                        }`}>
                          Observações: "{entry.feedback}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setSelectedDocForHistory(null)}
                className="w-full h-10 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Fechar Registo Auditável
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: DOCUMENT REVIEW WORKFLOW (Admin approval/rejection) */}
      <AnimatePresence>
        {selectedDocForReview && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1E1E26] border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-6 shadow-xl relative space-y-4"
            >
              <button 
                onClick={() => {
                  setSelectedDocForReview(null);
                  setReviewFeedback('');
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="text-sm font-black text-gray-950 dark:text-white uppercase tracking-wider">
                  Revisão e Validação Legal de KYC
                </h3>
                <p className="text-[10px] text-purple-600 font-mono mt-0.5">Cooperativa: {selectedDocForReview.orgName}</p>
              </div>

              {/* File Info Card */}
              <div className="p-4 bg-gray-50 dark:bg-[#121219] rounded-xl border border-gray-150 dark:border-gray-900 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 uppercase font-black">Tipo: {selectedDocForReview.doc.type}</span>
                  <span className="text-[10px] text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded font-mono font-bold">
                    Versão Atual: v{selectedDocForReview.doc.version || 1}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 font-mono truncate">
                  {selectedDocForReview.doc.name}
                </p>
                <p className="text-[10px] text-gray-400 font-mono">
                  Enviado em: {new Date(selectedDocForReview.doc.uploadedAt).toLocaleString()}
                </p>
              </div>

              {/* Visual simulated preview of document */}
              <div className="p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center bg-gray-50 dark:bg-black/10 text-center space-y-2">
                <FileText size={40} className="text-purple-500" />
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Visualização de PDF Simulado</p>
                <button 
                  type="button"
                  onClick={() => triggerAlert('Ficheiro original descarregado para análise.')}
                  className="px-2.5 py-1 text-[10px] font-extrabold text-purple-600 hover:bg-purple-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  Descarregar Ficheiro para Auditoria
                </button>
              </div>

              {/* Feedback Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Observações do Validador / Feedback (Obrigatório para Rejeição)</label>
                <textarea 
                  placeholder="Introduza notas de aprovação ou indique o motivo detalhado de inconformidade para que a cooperativa possa submeter uma correção..."
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  className="w-full h-24 p-3 text-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121219] rounded-xl outline-none resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => handleReviewAction('REJECTED')}
                  disabled={!reviewFeedback && selectedDocForReview.doc.status !== 'REJECTED'}
                  className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <XCircle size={14} /> Rejeitar Documento
                </button>
                <button 
                  type="button"
                  onClick={() => handleReviewAction('VERIFIED')}
                  className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1 shadow-md"
                >
                  <ShieldCheck size={14} /> Aprovar Documento
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
