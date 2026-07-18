import React, { useState } from "react";
import { 
  FileCheck, 
  Upload, 
  Trash2, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Inbox
} from "lucide-react";
import { Document, DocumentStatus } from "../types";

export default function Documents() {
  const [docs, setDocs] = useState<Document[]>([
    { id: "1", name: "Alvara_Comercial_Certificado_2026.pdf", category: "Alvará / Licença", status: DocumentStatus.Approved, uploadedAt: "2026-07-10", size: "1.4 MB", url: "#" },
    { id: "2", name: "Cartao_Contribuinte_NIF_Cooperativa.pdf", category: "Cartão de Contribuinte", status: DocumentStatus.Approved, uploadedAt: "2026-07-11", size: "840 KB", url: "#" },
    { id: "3", name: "Estatutos_Sociedade_Rascunho.pdf", category: "Estatutos de Constituição", status: DocumentStatus.Pending, uploadedAt: "2026-07-16", size: "3.2 MB", url: "#", notes: "Em auditoria documental por Dr. Eduardo" }
  ]);

  const [dragActive, setDragActive] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("Estatutos de Constituição");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const newDoc: Document = {
        id: String(docs.length + 1),
        name: file.name,
        category: uploadCategory,
        status: DocumentStatus.Pending,
        uploadedAt: new Date().toISOString().split("T")[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: "#"
      };
      setDocs([...docs, newDoc]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc: Document = {
        id: String(docs.length + 1),
        name: file.name,
        category: uploadCategory,
        status: DocumentStatus.Pending,
        uploadedAt: new Date().toISOString().split("T")[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: "#"
      };
      setDocs([...docs, newDoc]);
    }
  };

  const deleteDoc = (id: string) => {
    setDocs(docs.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white">Dossiê Documental</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
          Gerencie e certifique os documentos comerciais da sua empresa ou cooperativa de forma centralizada e auditável.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Documents List list */}
        <div className="lg:col-span-7 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="font-extrabold text-sm flex items-center gap-2 text-gray-900 dark:text-white">
            <FileCheck size={16} className="text-indigo-600 dark:text-indigo-400" />
            Documentos Carregados
          </h3>

          <div className="space-y-3">
            {docs.map((doc) => (
              <div 
                key={doc.id}
                className="p-3.5 bg-slate-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl flex items-center justify-between text-xs transition hover:shadow-sm"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="h-9 w-9 bg-indigo-100 dark:bg-white/[0.03] rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-200/15 dark:border-white/5">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-gray-850 dark:text-zinc-200 truncate pr-2" title={doc.name}>
                      {doc.name}
                    </span>
                    <span className="block text-[10px] text-gray-400">
                      {doc.category} • {doc.size} • Carregado em {doc.uploadedAt}
                    </span>
                    {doc.notes && (
                      <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                        ⚠️ Nota: {doc.notes}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    doc.status === DocumentStatus.Approved
                      ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300"
                      : doc.status === DocumentStatus.Pending
                      ? "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                      : "bg-red-100 dark:bg-rose-950/40 text-red-700 dark:text-rose-400"
                  }`}>
                    {doc.status === DocumentStatus.Approved && <CheckCircle2 size={10} />}
                    {doc.status === DocumentStatus.Pending && <Clock size={10} />}
                    {doc.status}
                  </span>

                  <button 
                    onClick={() => deleteDoc(doc.id)}
                    className="text-gray-400 hover:text-rose-500 transition p-1 rounded hover:bg-slate-100 dark:hover:bg-white/5"
                    title="Apagar"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}

            {docs.length === 0 && (
              <div className="py-12 text-center text-xs text-gray-400 italic">
                Nenhum documento carregado. Utilize o formulário ao lado para fazer upload.
              </div>
            )}
          </div>
        </div>

        {/* Drag & Drop Upload Zone area */}
        <div className="lg:col-span-5 space-y-4 h-fit select-none">
          
          <div className="bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="font-extrabold text-sm flex items-center gap-2 text-gray-900 dark:text-white">
              <Upload size={16} className="text-indigo-600 dark:text-indigo-400" />
              Upload de Documentos
            </h3>

            <div className="space-y-1.5 text-xs font-bold text-gray-500">
              <label className="text-gray-400 dark:text-zinc-500">Tipo / Categoria do Documento:</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none font-semibold text-gray-800 dark:text-zinc-200"
              >
                <option value="Alvará / Licença" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Alvará Comercial / Licença 📜</option>
                <option value="Cartão de Contribuinte" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Cartão de Contribuinte (NIF) 💳</option>
                <option value="Estatutos de Constituição" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Estatutos de Constituição 📝</option>
                <option value="Representante ID" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Bilhete de Identidade / Procuração 👤</option>
              </select>
            </div>

            {/* Drag and Drop Container */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition cursor-pointer relative ${
                dragActive 
                  ? "border-indigo-500 bg-indigo-500/10" 
                  : "border-gray-200/60 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-white/[0.01]"
              }`}
            >
              <Inbox size={32} className="text-indigo-500 mb-2" />
              <span className="block text-xs font-bold text-gray-800 dark:text-zinc-200">
                Arraste o seu ficheiro PDF ou Imagem aqui
              </span>
              <span className="block text-[10px] text-gray-400 mt-1">
                Ou clique para pesquisar no computador (Max: 10MB)
              </span>

              <input 
                type="file"
                onChange={handleFileInput}
                accept=".pdf,.png,.jpg,.jpeg"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>

          <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/15 text-[11px] text-indigo-700 dark:text-indigo-300 flex items-start space-x-2">
            <Sparkles size={14} className="shrink-0 mt-0.5 text-indigo-500 dark:text-indigo-400" />
            <p className="leading-relaxed">
              <strong>OLO Auditoria Inteligente:</strong> Ao carregar o NIF ou Alvará, os analistas certificados do OLO Fintel analisam as certidões e qualificam o seu Funding Readiness score de forma ágil.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
