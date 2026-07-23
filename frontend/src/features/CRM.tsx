import React, { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Trash2, 
  RefreshCw,
  CheckCircle2,
  Activity
} from "lucide-react";
import { APIService } from "../services/api";
import type { Lead, ERPData } from "../types";

const INITIAL_LEADS: Lead[] = [
  { id: "lead-1", name: "Manuel Carlos", company: "Supermercados Angomart", stage: "Lead", value: 450000, phone: "923114500", email: "mcarlos@angomart.co.ao", updatedAt: "2026-07-15" },
  { id: "lead-2", name: "Dra. Isabel Santos", company: "Distribuidora Kero Luanda", stage: "Contacted", value: 1200000, phone: "912445500", email: "isantos@kero.co.ao", updatedAt: "2026-07-16" },
  { id: "lead-3", name: "Eng. Rui Costa", company: "Moagens do Sul Benguela", stage: "Negotiation", value: 3500000, phone: "931221100", email: "rcosta@moagensbenguela.ao", updatedAt: "2026-07-17" },
  { id: "lead-4", name: "Dra. Paula Neto", company: "Alimentos Frescos Luanda", stage: "Contract", value: 950000, phone: "942110033", email: "pneto@frescos.co.ao", updatedAt: "2026-07-14" },
  { id: "lead-5", name: "João Mateus", company: "Cooperativa Geral Huíla", stage: "Cliente", value: 650000, phone: "922115599", email: "jmateus@coophuila.org.ao", updatedAt: "2026-07-12" }
];

export default function CRM() {
  const [erp, setErp] = useState<ERPData | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [addingLead, setAddingLead] = useState(false);

  const stages: ("Lead" | "Contacted" | "Negotiation" | "Contract" | "Cliente")[] = [
    "Lead",
    "Contacted",
    "Negotiation",
    "Contract",
    "Cliente"
  ];

  useEffect(() => {
    fetchERP();
  }, []);

  const fetchERP = async () => {
    setLoading(true);
    try {
      const data = await APIService.getERPData();
      setErp(data);
      // Retrieve leads from erp.leads (which we'll support as dynamic extension), fallback to INITIAL_LEADS
      const erpLeads = (data as any).leads || INITIAL_LEADS;
      setLeads(erpLeads);
    } catch (e) {
      setErrorMsg("Falha ao obter base de dados de Clientes.");
      setLeads(INITIAL_LEADS);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (updatedLeads: Lead[]) => {
    setSyncing(true);
    setLeads(updatedLeads);
    
    const updatedERP = {
      ...(erp || {
        humanResources: [],
        machinery: [],
        insumos: [],
        cycles: [],
        production: [],
        partners: [],
        assetsLiabilities: [],
        transactions: []
      }),
      leads: updatedLeads
    };

    setErp(updatedERP);
    const success = await APIService.saveERPData(updatedERP);
    if (success) {
      showSuccess("Lista de Clientes e Propostas sincronizada!");
    } else {
      setErrorMsg("Modo offline: alteração guardada localmente.");
      setTimeout(() => setErrorMsg(null), 4000);
    }
    setSyncing(false);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCompany || !newValue) return;

    const newLead: Lead = {
      id: "lead-" + (leads.length + 1) + "-" + Math.random().toString(36).substr(2, 4),
      name: newName,
      company: newCompany,
      stage: "Lead",
      value: Number(newValue),
      phone: newPhone || "Não indicado",
      email: newEmail || "Não indicado",
      updatedAt: new Date().toISOString().split("T")[0]
    };

    const updated = [...leads, newLead];
    handleSync(updated);

    setNewName("");
    setNewCompany("");
    setNewValue("");
    setNewPhone("");
    setNewEmail("");
    setAddingLead(false);
    showSuccess("Nova Oportunidade registada!");
  };

  const moveStage = (id: string, direction: "forward" | "backward") => {
    const updated = leads.map(lead => {
      if (lead.id === id) {
        const currentIndex = stages.indexOf(lead.stage as any);
        let nextIndex = currentIndex;
        if (direction === "forward" && currentIndex < stages.length - 1) {
          nextIndex += 1;
        } else if (direction === "backward" && currentIndex > 0) {
          nextIndex -= 1;
        }
        return {
          ...lead,
          stage: stages[nextIndex],
          updatedAt: new Date().toISOString().split("T")[0]
        };
      }
      return lead;
    });
    handleSync(updated);
  };

  const deleteLead = (id: string) => {
    const updated = leads.filter(lead => lead.id !== id);
    handleSync(updated);
    showSuccess("Oportunidade removida.");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <RefreshCw size={28} className="text-indigo-600 animate-spin" />
        <p className="text-xs text-gray-500 font-medium">A carregar propostas comerciais e funil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white flex items-center gap-2">
            Clientes & CRM
            {syncing && <RefreshCw size={18} className="text-indigo-600 animate-spin" />}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
            Acompanhe o funil de vendas, contratos comerciais e propostas de fornecimento com distribuidores e compradores SADC.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {/* Sync Status Badge */}
          {APIService.hasPendingSync() ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/50">
              <Activity size={12} className="animate-pulse" />
              Sincronização Pendente
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200/50">
              <CheckCircle2 size={12} />
              Nuvem Sincronizada
            </span>
          )}

          <button
            onClick={() => setAddingLead(!addingLead)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-sm glow-indigo cursor-pointer"
          >
            <Plus size={14} />
            <span>Nova Oportunidade</span>
          </button>
        </div>
      </div>

      {/* Messaging alerts */}
      {errorMsg && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200/50 rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200/50 rounded-xl text-xs font-semibold">
          {successMsg}
        </div>
      )}

      {/* Adding Lead Modal / Form Box */}
      {addingLead && (
        <form onSubmit={handleAddLead} className="p-5 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl space-y-4 shadow-md max-w-xl text-xs font-bold text-gray-500">
          <div className="pb-2 border-b border-gray-100 dark:border-white/5">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Adicionar Oportunidade Comercial</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-gray-400 dark:text-zinc-500">Nome do Responsável / Comprador:</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Carlos Mateus"
                required
                className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-400 dark:text-zinc-500">Empresa / Distribuidor:</label>
              <input 
                type="text" 
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Ex: Alimentos Shoprite"
                required
                className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-gray-400 dark:text-zinc-500">Valor Contrato (Kz):</label>
              <input 
                type="number" 
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Ex: 850000"
                required
                className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-400 dark:text-zinc-500">Telemóvel:</label>
              <input 
                type="text" 
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="923..."
                className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-400 dark:text-zinc-500">E-mail:</label>
              <input 
                type="email" 
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Ex: email@co.ao"
                className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setAddingLead(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-xl transition shadow-sm glow-indigo cursor-pointer"
            >
              Criar Oportunidade
            </button>
          </div>
        </form>
      )}

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto select-none pb-6">
        {stages.map((stage) => {
          const stageLeads = leads.filter(lead => lead.stage === stage);
          const stageTotalValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0);

          return (
            <div 
              key={stage}
              className="bg-gray-100/50 dark:glass-card rounded-2xl border border-gray-200/50 dark:border-white/5 p-3 space-y-3 min-w-[200px]"
            >
              {/* Stage Header */}
              <div className="flex justify-between items-center pb-2 border-b border-gray-200/60 dark:border-white/5">
                <div>
                  <span className="block text-xs font-black text-gray-800 dark:text-zinc-200 uppercase tracking-wider">{stage}</span>
                  <span className="block text-[10px] text-gray-400 font-semibold">{stageLeads.length} de acordos</span>
                </div>
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-mono font-bold px-2 py-0.5 rounded">
                  {stageTotalValue.toLocaleString()} Kz
                </span>
              </div>

              {/* Stage Cards list */}
              <div className="space-y-2.5">
                {stageLeads.map((lead) => (
                  <div 
                    key={lead.id}
                    className="p-3.5 bg-white dark:bg-white/[0.01] rounded-xl border border-gray-200/60 dark:border-white/5 shadow-sm hover:shadow-md transition space-y-3"
                  >
                    <div>
                      <span className="block text-xs font-extrabold text-gray-800 dark:text-zinc-200">{lead.company}</span>
                      <span className="block text-[10px] text-gray-400">{lead.name} • {lead.updatedAt}</span>
                    </div>

                    <span className="block text-xs font-black text-indigo-600 dark:text-indigo-400">
                      {lead.value.toLocaleString()} Kz
                    </span>

                    {/* Interactive controls */}
                    <div className="flex justify-between items-center pt-2.5 border-t border-gray-100 dark:border-white/5">
                      <button 
                        onClick={() => deleteLead(lead.id)}
                        className="text-gray-400 hover:text-rose-500 transition p-1 rounded hover:bg-slate-50 dark:hover:bg-white/5"
                        title="Remover"
                      >
                        <Trash2 size={12} />
                      </button>

                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => moveStage(lead.id, "backward")}
                          className="p-1 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded text-gray-500 transition"
                          title="Anterior"
                        >
                          <ChevronLeft size={12} />
                        </button>
                        <button 
                          onClick={() => moveStage(lead.id, "forward")}
                          className="p-1 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded text-gray-500 transition font-bold"
                          title="Seguinte"
                        >
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="py-6 text-center text-[10px] text-gray-400 italic">
                    Sem propostas neste estado.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
