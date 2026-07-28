/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  ShieldCheck,
  Lock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  RefreshCw,
  Eye,
  Download,
  FileCheck2,
  Trash2,
  Sparkles,
  Info,
  Building,
  Check,
  X,
  FileCode2,
  KeyRound
} from 'lucide-react';
import { getApiUrl, safeStorage } from '../lib/api';

export interface DocumentUploadItem {
  id: string;
  organizationId: string;
  title: string;
  category: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  updatedAt: string;
  fileBase64?: string;
  feedback?: string;
}

interface SecureDocumentUploadProps {
  organizationId?: string | null;
  organizationName?: string;
  userRole?: string;
  onUploadSuccess?: () => void;
}

const CATEGORIES = [
  { id: 'FINANCIAL', label: 'Demonstrações Financeiras', desc: 'DRE, Balanços, Relatórios Contabilísticos e Extratos' },
  { id: 'LEGAL', label: 'Documentação Legal', desc: 'Estatutos, Certidões Comerciais, Diário da República' },
  { id: 'OPERATIONAL', label: 'Licenças & Operações', desc: 'Alvarás, Títulos de Concessão, Registo de Frota/Parcelas' },
  { id: 'FISCAL', label: 'Fiscal & Impostos', desc: 'Cartão de NIF, Certidão de Não Dívida (AGT/INSS)' },
  { id: 'IDENTIFICATION', label: 'Identificação dos Sócios', desc: 'Bilhete de Identidade, Passaporte dos Gerentes' },
  { id: 'OTHER', label: 'Outros Anexos', desc: 'Documentos complementares exigidos pelo comitê' },
];

export default function SecureDocumentUpload({
  organizationId: propOrgId,
  organizationName = 'Cooperativa OLO Fintel',
  userRole = 'OWNER',
  onUploadSuccess,
}: SecureDocumentUploadProps) {
  const getOrgId = () => {
    if (propOrgId) return propOrgId;
    const cachedUserStr = safeStorage.getItem('olo_fintel_cached_user');
    if (cachedUserStr) {
      try {
        const u = JSON.parse(cachedUserStr);
        if (u.organizationId) return u.organizationId;
      } catch {}
    }
    return safeStorage.getItem('olo_fintel_orgId') || safeStorage.getItem('olo-fintel-orgId') || safeStorage.getItem('organizationId') || 'org-dwgy5kqb6';
  };
  const currentOrgId = getOrgId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- FORM STATE ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('FINANCIAL');
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState<string>('');
  
  // UI & Loading States
  const [isDragOver, setIsDragOver] = useState(false);
  const [convertingBase64, setConvertingBase64] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Document List & Status Tracking
  const [documents, setDocuments] = useState<DocumentUploadItem[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<DocumentUploadItem | null>(null);

  // --- FETCH DOCUMENTS FROM API ---
  const fetchDocuments = async () => {
    setLoadingDocs(true);
    try {
      const token = safeStorage.getItem('olo_fintel_token');
      const res = await fetch(getApiUrl(`/api/v1/documents/list/${currentOrgId}`), {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'x-organization-id': currentOrgId
        }
      });

      if (res.ok) {
        const json = await res.json();
        const docList = Array.isArray(json) ? json : (json.data || json.documents || []);
        
        const normalizedDocs = docList.map((d: any) => {
          const docId = d.id || `doc-${Math.random().toString(36).substr(2, 9)}`;
          const docTitle = d.title || d.name || 'Documento';
          const docName = d.name || d.title || 'Documento';
          const rawStat = String(d.status || 'PENDING').toUpperCase();
          const statusVal = (rawStat === 'APPROVED' || rawStat === 'VERIFIED') ? 'VERIFIED' : (rawStat === 'REJECTED' ? 'REJECTED' : 'PENDING');
          const feedbackVal = d.feedback || d.notes || '';

          return {
            ...d,
            id: docId,
            title: docTitle,
            name: docName,
            category: (d.category || d.type || 'FINANCIAL').toUpperCase(),
            type: (d.type || d.category || 'FINANCIAL').toUpperCase(),
            status: statusVal,
            feedback: feedbackVal,
            uploadedAt: d.uploadedAt || d.createdAt || d.updatedAt || new Date().toISOString(),
            fileBase64: d.fileBase64 || d.fileUrl || '',
          };
        });
        setDocuments(normalizedDocs);
      } else {
        // Fallback local storage
        const local = JSON.parse(safeStorage.getItem('olo_fintel_documents') || '[]');
        setDocuments(local);
      }
    } catch (err) {
      console.warn('Erro ao carregar lista de documentos, usando cache local:', err);
      const local = JSON.parse(safeStorage.getItem('olo_fintel_documents') || '[]');
      setDocuments(local);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [currentOrgId]);

  // Format file size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Convert File to Base64 with animated progress
  const processFile = (file: File) => {
    // Validation: Max 15MB
    const maxMB = 15;
    if (file.size > maxMB * 1024 * 1024) {
      setUploadMessage({
        text: `O ficheiro excede o limite máximo permitido de ${maxMB}MB.`,
        type: 'error',
      });
      return;
    }

    setSelectedFile(file);
    if (!title) {
      // Auto-fill title from filename removing extension
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setTitle(nameWithoutExt.replace(/[-_]/g, ' '));
    }
    setFileSizeStr(formatBytes(file.size));
    setConvertingBase64(true);
    setConversionProgress(15);

    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setConversionProgress(percent);
      }
    };

    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFileBase64(base64);
      setConvertingBase64(false);
      setConversionProgress(100);
      setUploadMessage(null);
    };

    reader.onerror = () => {
      setConvertingBase64(false);
      setUploadMessage({
        text: 'Erro ao converter ficheiro para o formato Base64 seguro.',
        type: 'error',
      });
    };

    reader.readAsDataURL(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Submit to API endpoint /api/v1/documents/upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileBase64 || !title.trim()) {
      setUploadMessage({
        text: 'Selecione um ficheiro válido e defina o título do documento.',
        type: 'error',
      });
      return;
    }

    setUploading(true);
    setUploadMessage(null);

    const payload = {
      organizationId: currentOrgId,
      title: title.trim(),
      name: title.trim(),
      category: category,
      type: category,
      fileBase64: fileBase64,
    };

    try {
      const token = safeStorage.getItem('olo_fintel_token');
      const res = await fetch(getApiUrl('/api/v1/documents/upload'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
          'x-organization-id': currentOrgId,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (res.ok && responseData.success) {
        setUploadMessage({
          text: responseData.message || 'Documento submetido com sucesso para validação do Júri.',
          type: 'success',
        });

        // Reset form
        setSelectedFile(null);
        setTitle('');
        setFileBase64('');
        setFileSizeStr('');
        if (fileInputRef.current) fileInputRef.current.value = '';

        // Refresh list
        fetchDocuments();
        if (onUploadSuccess) onUploadSuccess();
      } else {
        setUploadMessage({
          text: responseData.message || responseData.error || 'Falha ao submeter o documento ao servidor.',
          type: 'error',
        });
      }
    } catch (err) {
      console.error('Erro de envio:', err);
      setUploadMessage({
        text: 'Erro de comunicação ao enviar documento.',
        type: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  // Clear current selected file
  const handleClearSelection = () => {
    setSelectedFile(null);
    setFileBase64('');
    setFileSizeStr('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadMessage(null);
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
      case 'APROVADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Aprovado pelo Júri
          </span>
        );
      case 'REJECTED':
      case 'REJEITADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejeitado (Corrigir)
          </span>
        );
      case 'PENDING':
      case 'EM_ANALISE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Em Análise do Júri
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Security Protocol Info */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-medium px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Base64 Payload Safe Mode
              </span>
              <span className="text-slate-400 text-xs">Rota Canonical API: <code className="text-emerald-400 font-mono">POST /api/v1/documents/upload</code></span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Submissão Segura de Documentos KYC
            </h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl">
              Os seus documentos são codificados diretamente no navegador em formato <strong className="text-emerald-300">Base64</strong> antes do envio seguro para validação do Júri e Gestores de Risco.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-md shrink-0">
            <Building className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Organização Conectada</p>
              <p className="text-xs font-semibold text-white truncate max-w-[180px]">{organizationName}</p>
              <p className="text-[10px] text-emerald-400 font-mono">ID: {currentOrgId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Form Box (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-600" />
                Carregar Novo Documento
              </h3>
              <p className="text-xs text-slate-5-00 text-slate-500">Converte o ficheiro em Base64 e envia ao endpoint autorizado</p>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-100 flex items-center gap-1">
              <KeyRound className="w-3 h-3" /> RBAC Protected
            </span>
          </div>

          {/* Feedback Alert */}
          {uploadMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl text-xs md:text-sm font-medium flex items-start gap-3 border ${
                uploadMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              {uploadMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{uploadMessage.type === 'success' ? 'Sucesso na Submissão' : 'Atenção'}</p>
                <p className="text-xs opacity-90 mt-0.5">{uploadMessage.text}</p>
              </div>
              <button
                onClick={() => setUploadMessage(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {/* Drag & Drop Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ficheiro / Documento Digital (PDF, PNG, JPG, DOCX - máx 15MB)
              </label>

              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    isDragOver
                      ? 'border-emerald-500 bg-emerald-50/60 scale-[1.01]'
                      : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50/80 bg-slate-50/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Arraste o ficheiro para aqui ou <span className="text-emerald-700 underline underline-offset-2">clique para selecionar</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PDF, imagens ou documentos de texto. O ficheiro será processado em Base64 com segurança.
                  </p>
                </div>
              ) : (
                <div className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate max-w-[240px]">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{fileSizeStr}</span>
                          <span>•</span>
                          <span className="font-mono text-emerald-700 font-medium">{selectedFile.type || 'Ficheiro Selecionado'}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleClearSelection}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remover ficheiro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress bar during Base64 conversion */}
                  {convertingBase64 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-medium text-emerald-800">
                        <span>A converter ficheiro para Base64...</span>
                        <span>{conversionProgress}%</span>
                      </div>
                      <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${conversionProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Base64 conversion badge indicator */}
                  {fileBase64 && !convertingBase64 && (
                    <div className="p-2.5 bg-white border border-emerald-200/80 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-emerald-800 font-semibold text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <FileCode2 className="w-3.5 h-3.5 text-emerald-600" /> Conversão Base64 Concluída
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                          {fileBase64.length.toLocaleString()} caracteres
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-500 truncate bg-slate-50 p-1.5 rounded border border-slate-100">
                        {fileBase64.substring(0, 75)}...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Document Title Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título Oficial do Documento <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Demonstração Financeira 2025 ou Estatutos da Cooperativa"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoria do Documento (KYC & Elegibilidade)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label} — {cat.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={uploading || convertingBase64 || !fileBase64 || !title.trim()}
                className={`w-full py-3 px-4 rounded-xl text-xs md:text-sm font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                  uploading || convertingBase64 || !fileBase64 || !title.trim()
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-emerald-600/20'
                }`}
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    A Enviar ao Servidor (/api/v1/documents/upload)...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Submeter Documento Seguramente
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Documents Status Tracker List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Estado dos Documentos
                </h3>
                <p className="text-xs text-slate-500">Acompanhamento em tempo real pelo Júri</p>
              </div>

              <button
                onClick={fetchDocuments}
                disabled={loadingDocs}
                className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200"
                title="Atualizar Estado"
              >
                <RefreshCw className={`w-4 h-4 ${loadingDocs ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            </div>

            {/* Document List */}
            <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {loadingDocs ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
                  <p className="text-xs">A carregar documentos do servidor...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2 border-2 border-dashed border-slate-100 rounded-2xl">
                  <Info className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-medium text-slate-600">Nenhum documento submetido ainda.</p>
                  <p className="text-[11px] text-slate-400">Utilize o formulário ao lado para enviar a primeira certidão ou relatório financeiro.</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 bg-slate-50/50 hover:bg-emerald-50/20 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {doc.title || doc.name || 'Documento Anexado'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          ID: {doc.id} • {doc.category || 'FINANCIAL'}
                        </p>
                      </div>
                      {getStatusBadge(doc.status)}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Atualizado em: {doc.updatedAt || 'Recentemente'}</span>
                      {doc.fileBase64 && (
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver Anexo
                        </button>
                      )}
                    </div>

                    {/* Feedback if rejected */}
                    {doc.feedback && doc.status === 'REJECTED' && (
                      <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800">
                        <strong>Motivo do Júri:</strong> {doc.feedback}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Info Box */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Integração com Comité de Crédito
            </div>
            <p className="text-[10px] text-slate-500">
              Documentos com o estado <strong className="text-emerald-700">Aprovado</strong> elevam a pontuação de elegibilidade da cooperativa no módulo de financiamento.
            </p>
          </div>
        </div>
      </div>

      {/* Base64 / Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{previewDoc.title}</h4>
                    <p className="text-xs text-slate-500">Anexo Base64 • ID: {previewDoc.id}</p>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {previewDoc.fileBase64 && previewDoc.fileBase64.startsWith('data:image/') ? (
                <div className="max-h-96 overflow-auto rounded-xl border border-slate-200 p-2 bg-slate-50 text-center">
                  <img
                    src={previewDoc.fileBase64}
                    alt={previewDoc.title}
                    className="max-h-80 mx-auto rounded-lg object-contain"
                  />
                </div>
              ) : previewDoc.fileBase64 ? (
                <div className="space-y-2">
                  <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-48 border border-slate-800">
                    <p className="text-slate-400 text-[10px] mb-1">// Ficheiro em formato Base64:</p>
                    {previewDoc.fileBase64.substring(0, 300)}...
                  </div>
                  <a
                    href={previewDoc.fileBase64}
                    download={`${previewDoc.title.replace(/\s+/g, '_')}.pdf`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Transferir Ficheiro
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">Nenhum conteúdo Base64 disponível para pré-visualização.</p>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
