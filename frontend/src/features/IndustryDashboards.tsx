import React, { useState, useEffect } from "react";
import { 
  Plus, 
  MapPin, 
  Layers, 
  Calendar, 
  CloudSun, 
  ShieldAlert, 
  Anchor, 
  Activity, 
  Gauge, 
  ShoppingBag, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Users,
  Wrench,
  Package,
  FileSpreadsheet,
  AlertCircle,
  RefreshCw,
  Trash2
} from "lucide-react";
import { Sector } from "../types";
import { APIService, ERPData, HRMember, MachineryItem, InsumoItem, ProductionCycle, DailyProduction } from "../services/api";

interface IndustryDashboardsProps {
  sector: Sector;
}

export default function IndustryDashboards({ sector }: IndustryDashboardsProps) {
  const [erp, setErp] = useState<ERPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<"cycles" | "hr" | "machinery" | "insumos" | "production">("cycles");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states - Cycles & Campaigns
  const [cyName, setCyName] = useState("");
  const [cyStart, setCyStart] = useState("");
  const [cyEnd, setCyEnd] = useState("");
  const [cyBudget, setCyBudget] = useState("");
  const [cyTarget, setCyTarget] = useState("");
  const [cyUnit, setCyUnit] = useState("Toneladas");

  // Form states - Human Resources
  const [hrName, setHrName] = useState("");
  const [hrRole, setHrRole] = useState("");
  const [hrContact, setHrContact] = useState("");
  const [hrWage, setHrWage] = useState("");

  // Form states - Machinery
  const [mName, setMName] = useState("");
  const [mType, setMType] = useState("");
  const [mSerial, setMSerial] = useState("");
  const [mConsumption, setMConsumption] = useState("");
  const [mNextMaintenance, setMNextMaintenance] = useState("");

  // Form states - Insumos
  const [insName, setInsName] = useState("");
  const [insCat, setInsCat] = useState("Fertilizantes");
  const [insStock, setInsStock] = useState("");
  const [insMin, setInsMin] = useState("");
  const [insUnit, setInsUnit] = useState("Sacos");
  const [insCost, setInsCost] = useState("");

  // Form states - Production
  const [prodCycleId, setProdCycleId] = useState("");
  const [prodQty, setProdQty] = useState("");
  const [prodUnit, setProdUnit] = useState("Toneladas");
  const [prodOperator, setProdOperator] = useState("");
  const [prodNotes, setProdNotes] = useState("");

  useEffect(() => {
    fetchERP();
  }, []);

  const fetchERP = async () => {
    setLoading(true);
    try {
      const data = await APIService.getERPData();
      setErp(data);
    } catch (e) {
      setErrorMsg("Falha ao obter os dados do ERP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (updatedERP: ERPData) => {
    setSyncing(true);
    setErp(updatedERP);
    const success = await APIService.saveERPData(updatedERP);
    if (success) {
      showSuccess("Base de dados de Operações sincronizada com sucesso!");
    } else {
      setErrorMsg("Modo offline ativo: guardado em cache local.");
      setTimeout(() => setErrorMsg(null), 4000);
    }
    setSyncing(false);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <RefreshCw size={28} className="text-indigo-600 animate-spin" />
        <p className="text-xs text-gray-500 font-medium">A carregar registos operacionais do ERP...</p>
      </div>
    );
  }

  const currentErp = erp || {
    humanResources: [],
    machinery: [],
    insumos: [],
    cycles: [],
    production: [],
    partners: [],
    assetsLiabilities: [],
    transactions: []
  };

  // Filter cycles according to current user's active sector
  const filteredCycles = currentErp.cycles.filter(c => c.sector === sector);

  // handlers - Cycles
  const handleAddCycle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cyName || !cyStart || !cyEnd || !cyBudget || !cyTarget) return;

    const newCycle: ProductionCycle = {
      id: "cy-" + (currentErp.cycles.length + 1) + "-" + Math.random().toString(36).substr(2, 4),
      name: cyName,
      sector: sector,
      startDate: cyStart,
      endDate: cyEnd,
      budgetForecast: Number(cyBudget),
      actualCosts: 0,
      targetOutput: Number(cyTarget),
      currentOutput: 0,
      status: "Preparação"
    };

    const updated = {
      ...currentErp,
      cycles: [...currentErp.cycles, newCycle]
    };

    handleSync(updated);
    setCyName("");
    setCyStart("");
    setCyEnd("");
    setCyBudget("");
    setCyTarget("");
    showSuccess("Nova Época/Ciclo de Produção planeado!");
  };

  const handleDeleteCycle = (id: string) => {
    const updated = {
      ...currentErp,
      cycles: currentErp.cycles.filter(c => c.id !== id)
    };
    handleSync(updated);
    showSuccess("Ciclo removido.");
  };

  // handlers - HR
  const handleAddHR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hrName || !hrRole || !hrWage) return;

    const newHR: HRMember = {
      id: "hr-" + (currentErp.humanResources.length + 1) + "-" + Math.random().toString(36).substr(2, 4),
      name: hrName,
      role: hrRole,
      contact: hrContact || "N/A",
      dailyWage: Number(hrWage),
      status: "Ativo",
      admissionDate: new Date().toISOString().split("T")[0]
    };

    const updated = {
      ...currentErp,
      humanResources: [...currentErp.humanResources, newHR]
    };

    handleSync(updated);
    setHrName("");
    setHrRole("");
    setHrContact("");
    setHrWage("");
    showSuccess("Cooperado/Colaborador registado!");
  };

  const handleDeleteHR = (id: string) => {
    const updated = {
      ...currentErp,
      humanResources: currentErp.humanResources.filter(h => h.id !== id)
    };
    handleSync(updated);
    showSuccess("Colaborador removido da folha de salários.");
  };

  // handlers - Machinery
  const handleAddMachinery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName || !mType || !mSerial) return;

    const newM: MachineryItem = {
      id: "m-" + (currentErp.machinery.length + 1) + "-" + Math.random().toString(36).substr(2, 4),
      name: mName,
      type: mType,
      serialNumber: mSerial,
      status: "Operacional",
      fuelConsumption: mConsumption || "N/A",
      lastMaintenance: new Date().toISOString().split("T")[0],
      nextMaintenance: mNextMaintenance || "N/D"
    };

    const updated = {
      ...currentErp,
      machinery: [...currentErp.machinery, newM]
    };

    handleSync(updated);
    setMName("");
    setMType("");
    setMSerial("");
    setMConsumption("");
    setMNextMaintenance("");
    showSuccess("Equipamento/Máquina registado na frota.");
  };

  const handleDeleteMachinery = (id: string) => {
    const updated = {
      ...currentErp,
      machinery: currentErp.machinery.filter(m => m.id !== id)
    };
    handleSync(updated);
    showSuccess("Máquina removida da frota.");
  };

  // handlers - Insumos
  const handleAddInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insName || !insStock || !insMin || !insCost) return;

    const newIns: InsumoItem = {
      id: "ins-" + (currentErp.insumos.length + 1) + "-" + Math.random().toString(36).substr(2, 4),
      name: insName,
      category: insCat,
      stock: Number(insStock),
      minStock: Number(insMin),
      unit: insUnit,
      costPrice: Number(insCost),
      supplierId: "part-1" // Supplier association fallback
    };

    const updated = {
      ...currentErp,
      insumos: [...currentErp.insumos, newIns]
    };

    handleSync(updated);
    setInsName("");
    setInsStock("");
    setInsMin("");
    setInsCost("");
    showSuccess("Insumo registado no armazém.");
  };

  const handleDeleteInsumo = (id: string) => {
    const updated = {
      ...currentErp,
      insumos: currentErp.insumos.filter(i => i.id !== id)
    };
    handleSync(updated);
    showSuccess("Insumo removido do stock.");
  };

  // handlers - Production Logging
  const handleAddProduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodCycleId || !prodQty || !prodOperator) return;

    const matchedCycle = currentErp.cycles.find(c => c.id === prodCycleId);
    const cycleTitle = matchedCycle ? matchedCycle.name : "Ciclo Geral";

    const newProd: DailyProduction = {
      id: "p-" + (currentErp.production.length + 1) + "-" + Math.random().toString(36).substr(2, 4),
      date: new Date().toISOString().split("T")[0],
      cycleId: prodCycleId,
      cycleTitle,
      quantity: Number(prodQty),
      unit: prodUnit,
      operatorName: prodOperator,
      notes: prodNotes
    };

    // Auto-update the current output on the parent cycle!
    const updatedCycles = currentErp.cycles.map(c => {
      if (c.id === prodCycleId) {
        return {
          ...c,
          currentOutput: c.currentOutput + Number(prodQty),
          status: c.currentOutput + Number(prodQty) >= c.targetOutput ? ("Concluído" as any) : "Colheita"
        };
      }
      return c;
    });

    const updated = {
      ...currentErp,
      production: [newProd, ...currentErp.production],
      cycles: updatedCycles
    };

    handleSync(updated);
    setProdCycleId("");
    setProdQty("");
    setProdOperator("");
    setProdNotes("");
    showSuccess("Registo de Colheita/Captura adicionado e ciclo atualizado!");
  };

  const handleDeleteProduction = (id: string, cycleId: string, qty: number) => {
    // Revert cycle output
    const updatedCycles = currentErp.cycles.map(c => {
      if (c.id === cycleId) {
        return {
          ...c,
          currentOutput: Math.max(0, c.currentOutput - qty)
        };
      }
      return c;
    });

    const updated = {
      ...currentErp,
      production: currentErp.production.filter(p => p.id !== id),
      cycles: updatedCycles
    };
    handleSync(updated);
    showSuccess("Registo de produção excluído.");
  };

  // Translate sectors visually for localized UI
  const getSectorLabel = () => {
    switch (sector) {
      case Sector.Agriculture: return "Agrícola";
      case Sector.Livestock: return "Pecuário";
      case Sector.Fisheries: return "Pescas";
      case Sector.Commerce: return "Comercial";
      default: return "";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white flex items-center gap-2">
            Gestão de Recursos e Operações ({getSectorLabel()})
            {syncing && <RefreshCw size={18} className="text-indigo-600 animate-spin" />}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
            Controle ciclos de produção, cooperados, tratores/embarcações, e armazém de insumos para fechar o desperdício.
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center space-x-2">
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

      {/* Internal ERP tabs */}
      <div className="border-b border-gray-200 dark:border-white/10 flex space-x-5 overflow-x-auto scrollbar-none pb-0.5">
        <button
          onClick={() => setActiveTab("cycles")}
          className={`pb-3 text-xs font-black transition cursor-pointer shrink-0 border-b-2 px-1 ${
            activeTab === "cycles"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-950 dark:hover:text-white"
          }`}
        >
          🌽 Campanhas e Ciclos ({filteredCycles.length})
        </button>
        <button
          onClick={() => setActiveTab("hr")}
          className={`pb-3 text-xs font-black transition cursor-pointer shrink-0 border-b-2 px-1 ${
            activeTab === "hr"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-950 dark:hover:text-white"
          }`}
        >
          👥 Recursos Humanos ({currentErp.humanResources.length})
        </button>
        <button
          onClick={() => setActiveTab("machinery")}
          className={`pb-3 text-xs font-black transition cursor-pointer shrink-0 border-b-2 px-1 ${
            activeTab === "machinery"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-950 dark:hover:text-white"
          }`}
        >
          🚜 Máquinas & Frota ({currentErp.machinery.length})
        </button>
        <button
          onClick={() => setActiveTab("insumos")}
          className={`pb-3 text-xs font-black transition cursor-pointer shrink-0 border-b-2 px-1 ${
            activeTab === "insumos"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-950 dark:hover:text-white"
          }`}
        >
          📦 Armazém Insumos ({currentErp.insumos.length})
        </button>
        <button
          onClick={() => setActiveTab("production")}
          className={`pb-3 text-xs font-black transition cursor-pointer shrink-0 border-b-2 px-1 ${
            activeTab === "production"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-950 dark:hover:text-white"
          }`}
        >
          📈 Registo de Colheitas ({currentErp.production.length})
        </button>
      </div>

      {/* CONTENT PANELS */}

      {/* 1. CYCLES & CAMPAIGNS */}
      {activeTab === "cycles" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cycle lists */}
          <div className="lg:col-span-8 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Preparação de Início de Época / Ciclos Ativos</h3>
              <span className="text-[10px] text-gray-400 italic">Filtrado para setor {sector}</span>
            </div>

            <div className="space-y-3">
              {filteredCycles.map(c => {
                const percent = Math.min(100, Math.round((c.currentOutput / c.targetOutput) * 100));
                return (
                  <div key={c.id} className="p-4 bg-slate-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-2xl space-y-3 relative hover:border-gray-300 dark:hover:border-white/10 transition">
                    <button 
                      onClick={() => handleDeleteCycle(c.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-rose-500 transition"
                    >
                      <Trash2 size={12} />
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 mb-1 border border-indigo-200/20">
                          {c.status}
                        </span>
                        <h4 className="font-extrabold text-xs text-gray-800 dark:text-zinc-200">{c.name}</h4>
                      </div>
                      <div className="text-right text-[10px] text-gray-400">
                        <span>Duração: {c.startDate} até {c.endDate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[10px] pt-1">
                      <div>
                        <span className="block text-gray-400">Orçamento Previsto:</span>
                        <span className="block font-extrabold text-slate-800 dark:text-zinc-300">{c.budgetForecast.toLocaleString()} Kz</span>
                      </div>
                      <div>
                        <span className="block text-gray-400">Custos Reais:</span>
                        <span className="block font-extrabold text-slate-800 dark:text-zinc-300">
                          {/* Aggregate costs linked directly from cash book transactions for this cycle category name */}
                          {c.actualCosts.toLocaleString()} Kz
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-400">Meta Estabelecida:</span>
                        <span className="block font-extrabold text-indigo-600 dark:text-indigo-400">{c.targetOutput} {c.currentOutput >= 0 ? cyUnit : "Toneladas"}</span>
                      </div>
                    </div>

                    {/* Meta progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-gray-400">
                        <span>Progresso de Rendimento: {c.currentOutput} {cyUnit}</span>
                        <span>{percent}% da meta</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredCycles.length === 0 && (
                <div className="py-12 text-center text-xs text-gray-400 italic">
                  Nenhuma época ou campanha planeada de momento. Use o formulário lateral para planejar o início de época.
                </div>
              )}
            </div>
          </div>

          {/* Form to cycle */}
          <div className="lg:col-span-4 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="font-extrabold text-sm flex items-center gap-2 text-gray-900 dark:text-white">
              <Plus size={16} className="text-indigo-600 dark:text-indigo-400" />
              Planeamento de Ciclo / Época
            </h3>

            <form onSubmit={handleAddCycle} className="space-y-3.5 text-xs font-bold text-gray-500">
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Título do Ciclo / Campanha:</label>
                <input 
                  type="text" 
                  value={cyName}
                  onChange={(e) => setCyName(e.target.value)}
                  placeholder="Ex: Campanha Milho Huambo 2026"
                  required
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Início:</label>
                  <input 
                    type="date" 
                    value={cyStart}
                    onChange={(e) => setCyStart(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-700 dark:text-zinc-300 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Término:</label>
                  <input 
                    type="date" 
                    value={cyEnd}
                    onChange={(e) => setCyEnd(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-700 dark:text-zinc-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Orçamento Previsto (Kz):</label>
                  <input 
                    type="number" 
                    value={cyBudget}
                    onChange={(e) => setCyBudget(e.target.value)}
                    placeholder="Ex: 4500000"
                    required
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Unidade Produtiva:</label>
                  <select 
                    value={cyUnit}
                    onChange={(e) => setCyUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-700 dark:text-zinc-300 font-semibold"
                  >
                    <option value="Toneladas" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Toneladas 🌽</option>
                    <option value="Sacas" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Sacas 🌾</option>
                    <option value="Cabeças" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Cabeças (Animais) 🐖</option>
                    <option value="Quilos" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Quilos (Kg) 🐟</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Meta de Produção ({cyUnit}):</label>
                <input 
                  type="number" 
                  value={cyTarget}
                  onChange={(e) => setCyTarget(e.target.value)}
                  placeholder="Ex: 120"
                  required
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm glow-indigo cursor-pointer text-center"
              >
                Planear Início de Época
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. HUMAN RESOURCES */}
      {activeTab === "hr" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* HR lists */}
          <div className="lg:col-span-8 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Folha de Membros e Cooperados Ativos</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentErp.humanResources.map(h => (
                <div key={h.id} className="p-3.5 bg-slate-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-xl flex items-center justify-between text-xs relative">
                  <button 
                    onClick={() => handleDeleteHR(h.id)}
                    className="absolute top-2.5 right-2.5 text-gray-400 hover:text-rose-500 transition"
                  >
                    <Trash2 size={12} />
                  </button>

                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 bg-slate-200 dark:bg-white/5 text-slate-800 dark:text-zinc-200 font-black rounded-lg flex items-center justify-center text-xs">
                      {h.name.charAt(0)}
                    </div>
                    <div>
                      <span className="block font-bold text-gray-800 dark:text-zinc-150">{h.name}</span>
                      <span className="block text-[10px] text-gray-400">{h.role} • {h.contact}</span>
                    </div>
                  </div>

                  <div className="text-right pr-4">
                    <span className="block text-[10px] text-gray-400">Diária:</span>
                    <span className="block font-black text-indigo-600 dark:text-indigo-400">{h.dailyWage.toLocaleString()} Kz</span>
                  </div>
                </div>
              ))}

              {currentErp.humanResources.length === 0 && (
                <div className="col-span-2 py-12 text-center text-xs text-gray-400 italic">
                  Nenhum colaborador ou cooperador registado.
                </div>
              )}
            </div>
          </div>

          {/* Form to HR */}
          <div className="lg:col-span-4 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="font-extrabold text-sm flex items-center gap-2 text-gray-900 dark:text-white">
              <Plus size={16} className="text-indigo-600 dark:text-indigo-400" />
              Registar Cooperado / Trabalhador
            </h3>

            <form onSubmit={handleAddHR} className="space-y-3.5 text-xs font-bold text-gray-500">
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Nome Completo:</label>
                <input 
                  type="text" 
                  value={hrName}
                  onChange={(e) => setHrName(e.target.value)}
                  placeholder="Ex: Mateus Ndulu"
                  required
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Cargo / Função:</label>
                <input 
                  type="text" 
                  value={hrRole}
                  onChange={(e) => setHrRole(e.target.value)}
                  placeholder="Ex: Operador de Trator / Agrónomo"
                  required
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Contacto Tel:</label>
                  <input 
                    type="text" 
                    value={hrContact}
                    onChange={(e) => setHrContact(e.target.value)}
                    placeholder="Ex: 923441022"
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Taxa Diária (Kz):</label>
                  <input 
                    type="number" 
                    value={hrWage}
                    onChange={(e) => setHrWage(e.target.value)}
                    placeholder="Ex: 12000"
                    required
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm glow-indigo cursor-pointer text-center"
              >
                Registar Cooperado
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. MACHINERY & FLEETS */}
      {activeTab === "machinery" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Fleet lists */}
          <div className="lg:col-span-8 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Inventário de Ativos Mecânicos e Frota Activa</h3>

            <div className="space-y-3">
              {currentErp.machinery.map(m => (
                <div key={m.id} className="p-3.5 bg-slate-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-xl relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                  <button 
                    onClick={() => handleDeleteMachinery(m.id)}
                    className="absolute top-3.5 right-3.5 text-gray-400 hover:text-rose-500 transition"
                  >
                    <Trash2 size={12} />
                  </button>

                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-slate-100 dark:bg-white/5 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                      <Wrench size={16} />
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/20 mb-0.5">
                        {m.status}
                      </span>
                      <span className="block font-bold text-gray-850 dark:text-zinc-200">{m.name}</span>
                      <span className="block text-[10px] text-gray-400">Tipo: {m.type} • Série: {m.serialNumber}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 sm:gap-6 pr-6 text-[10px] text-gray-450">
                    <div>
                      <span className="block text-gray-400">Consumo Combustível:</span>
                      <span className="block font-bold text-gray-700 dark:text-zinc-300">{m.fuelConsumption}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400">Próxima Manutenção:</span>
                      <span className="block font-bold text-amber-600 dark:text-amber-400">{m.nextMaintenance}</span>
                    </div>
                  </div>
                </div>
              ))}

              {currentErp.machinery.length === 0 && (
                <div className="py-12 text-center text-xs text-gray-400 italic">
                  Nenhuma máquina ou equipamento registado.
                </div>
              )}
            </div>
          </div>

          {/* Form to Machinery */}
          <div className="lg:col-span-4 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="font-extrabold text-sm flex items-center gap-2 text-gray-900 dark:text-white">
              <Plus size={16} className="text-indigo-600 dark:text-indigo-400" />
              Registar Máquina / Frota
            </h3>

            <form onSubmit={handleAddMachinery} className="space-y-3 text-xs font-bold text-gray-500">
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Nome do Equipamento:</label>
                <input 
                  type="text" 
                  value={mName}
                  onChange={(e) => setMName(e.target.value)}
                  placeholder="Ex: Trator John Deere 5075E"
                  required
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Tipo/Categoria:</label>
                  <input 
                    type="text" 
                    value={mType}
                    onChange={(e) => setMType(e.target.value)}
                    placeholder="Ex: Trator / Barco / Bomba"
                    required
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Nº de Série / Matrícula:</label>
                  <input 
                    type="text" 
                    value={mSerial}
                    onChange={(e) => setMSerial(e.target.value)}
                    placeholder="Ex: MF290-A"
                    required
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Consumo Estimado:</label>
                  <input 
                    type="text" 
                    value={mConsumption}
                    onChange={(e) => setMConsumption(e.target.value)}
                    placeholder="Ex: 15 Litros/Hora"
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Próxima Revisão:</label>
                  <input 
                    type="date" 
                    value={mNextMaintenance}
                    onChange={(e) => setMNextMaintenance(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-700 dark:text-zinc-300 font-medium"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm glow-indigo cursor-pointer text-center"
              >
                Adicionar Equipamento
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. INSUMOS & STOCK */}
      {activeTab === "insumos" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stock lists */}
          <div className="lg:col-span-8 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Inventário de Armazém de Matérias Primas</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentErp.insumos.map(i => {
                const lowStock = i.stock <= i.minStock;
                return (
                  <div key={i.id} className="p-3.5 bg-slate-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-2xl relative space-y-2 text-xs">
                    <button 
                      onClick={() => handleDeleteInsumo(i.id)}
                      className="absolute top-2.5 right-2.5 text-gray-400 hover:text-rose-500 transition"
                    >
                      <Trash2 size={12} />
                    </button>

                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-slate-100 dark:bg-white/5 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                        <Package size={16} />
                      </div>
                      <div>
                        <span className="block font-black text-gray-800 dark:text-zinc-200">{i.name}</span>
                        <span className="block text-[9px] text-gray-400">Categoria: {i.category}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                      <div>
                        <span className="block text-gray-400">Stock Atual:</span>
                        <span className={`font-black ${lowStock ? "text-rose-500" : "text-gray-800 dark:text-zinc-300"}`}>
                          {i.stock} {i.unit}
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-400">Preço de Custo unitário:</span>
                        <span className="font-extrabold text-gray-700 dark:text-zinc-350">{i.costPrice.toLocaleString()} Kz</span>
                      </div>
                    </div>

                    {lowStock && (
                      <div className="inline-flex items-center gap-1 text-[9px] font-black text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-md border border-rose-200/20">
                        <AlertCircle size={10} /> Rotura ou stock mínimo atingido!
                      </div>
                    )}
                  </div>
                );
              })}

              {currentErp.insumos.length === 0 && (
                <div className="col-span-2 py-12 text-center text-xs text-gray-400 italic">
                  Nenhum insumo ou matéria prima cadastrada.
                </div>
              )}
            </div>
          </div>

          {/* Form to Insumos */}
          <div className="lg:col-span-4 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="font-extrabold text-sm flex items-center gap-2 text-gray-900 dark:text-white">
              <Plus size={16} className="text-indigo-600 dark:text-indigo-400" />
              Registar Matéria Prima / Insumo
            </h3>

            <form onSubmit={handleAddInsumo} className="space-y-3.5 text-xs font-bold text-gray-500">
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Nome do Insumo:</label>
                <input 
                  type="text" 
                  value={insName}
                  onChange={(e) => setInsName(e.target.value)}
                  placeholder="Ex: Adubo NPK 12-24-12 ou Milho"
                  required
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Categoria:</label>
                  <select 
                    value={insCat}
                    onChange={(e) => setInsCat(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-700 dark:text-zinc-300 font-semibold"
                  >
                    <option value="Fertilizantes" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Fertilizantes 🌾</option>
                    <option value="Sementes" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Sementes 🌱</option>
                    <option value="Rações" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Rações / Nutrição 🐖</option>
                    <option value="Combustíveis" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Combustíveis ⛽</option>
                    <option value="Embalagens" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Embalagens / Caixas 📦</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Unidade:</label>
                  <select 
                    value={insUnit}
                    onChange={(e) => setInsUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-700 dark:text-zinc-300 font-semibold"
                  >
                    <option value="Sacos" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Sacos</option>
                    <option value="Kg" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Quilos (Kg)</option>
                    <option value="Litros" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Litros</option>
                    <option value="Caixas" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Caixas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Stock Inicial:</label>
                  <input 
                    type="number" 
                    value={insStock}
                    onChange={(e) => setInsStock(e.target.value)}
                    placeholder="Ex: 50"
                    required
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Stock Mínimo:</label>
                  <input 
                    type="number" 
                    value={insMin}
                    onChange={(e) => setInsMin(e.target.value)}
                    placeholder="Ex: 10"
                    required
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Custo Unitário de Compra (Kz):</label>
                <input 
                  type="number" 
                  value={insCost}
                  onChange={(e) => setInsCost(e.target.value)}
                  placeholder="Ex: 19500"
                  required
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm glow-indigo cursor-pointer text-center"
              >
                Cadastrar Insumo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. PRODUCTION LOGGING / HARVESTS */}
      {activeTab === "production" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Harvest lists */}
          <div className="lg:col-span-8 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Registo Histórico de Rendimento (Colheitas e Capturas)</h3>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {currentErp.production.map(p => (
                <div key={p.id} className="p-3.5 bg-slate-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-xl flex items-start justify-between text-xs transition">
                  <div>
                    <span className="block font-black text-indigo-600 dark:text-indigo-400 mb-0.5">
                      +{p.quantity} {p.unit}
                    </span>
                    <span className="block font-bold text-gray-800 dark:text-zinc-200">{p.cycleTitle}</span>
                    <span className="block text-[10px] text-gray-400">Data de Entrada: {p.date} • Operador: {p.operatorName}</span>
                    {p.notes && <span className="block text-[10px] text-gray-400 italic mt-1 bg-slate-200/20 dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-white/5">Nota: {p.notes}</span>}
                  </div>

                  <button 
                    onClick={() => handleDeleteProduction(p.id, p.cycleId, p.quantity)}
                    className="text-gray-400 hover:text-rose-500 transition p-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              {currentErp.production.length === 0 && (
                <div className="py-12 text-center text-xs text-gray-400 italic">
                  Nenhum registo de produção inserido de momento. Use o formulário à direita.
                </div>
              )}
            </div>
          </div>

          {/* Form to Production */}
          <div className="lg:col-span-4 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="font-extrabold text-sm flex items-center gap-2 text-gray-900 dark:text-white">
              <Plus size={16} className="text-indigo-600 dark:text-indigo-400" />
              Lançar Rendimento de Produção
            </h3>

            <form onSubmit={handleAddProduction} className="space-y-3.5 text-xs font-bold text-gray-500">
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Associar ao Ciclo de Produção:</label>
                <select
                  value={prodCycleId}
                  onChange={(e) => setProdCycleId(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-700 dark:text-zinc-300 font-semibold"
                >
                  <option value="" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Selecione um ciclo ativo...</option>
                  {filteredCycles.map(c => (
                    <option key={c.id} value={c.id} className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">{c.name} (Meta: {c.targetOutput})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Quantidade obtida:</label>
                  <input 
                    type="number" 
                    value={prodQty}
                    onChange={(e) => setProdQty(e.target.value)}
                    placeholder="Ex: 15"
                    required
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Unidade:</label>
                  <select 
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-700 dark:text-zinc-300 font-semibold"
                  >
                    <option value="Toneladas" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Toneladas 🌽</option>
                    <option value="Sacas" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Sacas 🌾</option>
                    <option value="Cabeças" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Cabeças 🐖</option>
                    <option value="Quilos" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Quilos (Kg) 🐟</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Responsável / Operador:</label>
                <input 
                  type="text" 
                  value={prodOperator}
                  onChange={(e) => setProdOperator(e.target.value)}
                  placeholder="Ex: Mateus Ndulu"
                  required
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Notas de Qualidade / Incidentes:</label>
                <textarea 
                  value={prodNotes}
                  onChange={(e) => setProdNotes(e.target.value)}
                  placeholder="Ex: Primeira colheita parcial de boa qualidade sem incidência de pragas."
                  rows={2.5}
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm glow-indigo cursor-pointer text-center"
              >
                Registar Produção
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
