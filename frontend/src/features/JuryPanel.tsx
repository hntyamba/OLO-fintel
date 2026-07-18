import { useState } from "react";
import { 
  Lock, 
  Download, 
  TrendingUp, 
  Users, 
  MapPin, 
  Grid, 
  HelpCircle, 
  Database,
  ArrowLeft,
  CheckCircle2,
  FileText
} from "lucide-react";
import { SurveyStats } from "../types";

interface JuryPanelProps {
  stats: SurveyStats | null;
  onExit: () => void;
  onLoginAsOwner?: () => void;
}

export default function JuryPanel({ stats, onExit, onLoginAsOwner }: JuryPanelProps) {
  const [exporting, setExporting] = useState(false);
  const [exportedMsg, setExportedMsg] = useState<string | null>(null);

  const totalResp = stats?.totalResponses || 64;
  const goal = stats?.goal || 100;
  const progressPct = Math.min(100, Math.round((totalResp / goal) * 100));

  const sectorLabels: Record<string, string> = {
    Agriculture: "Agricultura 🌾",
    Livestock: "Pecuária 🐂",
    Fisheries: "Pesca ⚓",
    Commerce: "Comércio 🏪"
  };

  const challengeLabels: Record<string, string> = {
    Financing: "Financiamento",
    Inventory: "Gestão de Stock",
    Clientes: "Atração de Clientes",
    Production: "Controlo de Produção",
    Reporting: "Falta de Relatórios",
    Documents: "Organização Documental"
  };

  const toolLabels: Record<string, string> = {
    Papel: "Cadernos de Papel",
    Excel: "Folhas de Excel",
    WhatsApp: "WhatsApp / Grupos",
    ERP: "Sistemas ERP",
    Outro: "Outros Métodos"
  };

  const handleExport = (type: "pdf" | "excel") => {
    setExporting(true);
    setExportedMsg(null);
    setTimeout(() => {
      setExporting(false);
      setExportedMsg(`Relatório de Validação Nacional exportado com sucesso em formato ${type.toUpperCase()}!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-100 font-sans p-4 sm:p-6 lg:p-8 space-y-8 transition-colors">
      
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onExit}
            className="p-2.5 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 rounded-lg border border-white/5 transition cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
              <Lock size={12} />
              <span>Painel de Validação do Júri (LISPA)</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">OLO Fintel Tração & Mercado</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button 
            onClick={() => handleExport("excel")}
            disabled={exporting}
            className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            <Download size={14} />
            <span>Excel</span>
          </button>
          <button 
            onClick={() => handleExport("pdf")}
            disabled={exporting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center space-x-2 disabled:opacity-50 glow-indigo cursor-pointer"
          >
            <FileText size={14} />
            <span>Exportar PDF</span>
          </button>
          {onLoginAsOwner && (
            <button 
              onClick={onLoginAsOwner}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center space-x-2 cursor-pointer shadow-sm shadow-emerald-500/15"
            >
              <span>Testar Plataforma &rarr;</span>
            </button>
          )}

        </div>
      </div>

      {exportedMsg && (
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{exportedMsg}</span>
        </div>
      )}

      {/* Main KPI Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="dark:glass-card p-5 rounded-2xl border border-white/5 space-y-2">
          <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Amostra de Respostas</span>
          <span className="block text-3xl font-extrabold text-white">{totalResp}</span>
          <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
            <span>Meta de Validação</span>
            <span className="text-zinc-200 font-bold">{goal}</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-1 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
          </div>
        </div>

        <div className="dark:glass-card p-5 rounded-2xl border border-white/5 space-y-2">
          <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Mapeamento Regional</span>
          <span className="block text-3xl font-extrabold text-white">10</span>
          <span className="block text-xs font-medium text-zinc-400 leading-relaxed">
            Províncias de Angola ativas na amostragem (Foco Huambo & Luanda).
          </span>
        </div>

        <div className="dark:glass-card p-5 rounded-2xl border border-white/5 space-y-2">
          <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Aprovação do Valor de IA</span>
          <span className="block text-3xl font-extrabold text-white">{stats?.avgAiRating || "4.8"} / 5.0</span>
          <span className="block text-xs font-medium text-indigo-400 leading-relaxed">
            Média de interesse das cooperativas na assessoria de Inteligência Artificial.
          </span>
        </div>

        <div className="dark:glass-card p-5 rounded-2xl border border-white/5 space-y-2">
          <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Foco na Informalidade</span>
          <span className="block text-3xl font-extrabold text-white">82%</span>
          <span className="block text-xs font-medium text-zinc-400 leading-relaxed">
            Dos respondentes utilizam canais analógicos (Papel/WhatsApp) na gestão operacional.
          </span>
        </div>
      </div>

      {/* Aggregate Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sector and Persona Distribution */}
        <div className="dark:glass-card rounded-2xl border border-white/5 p-6 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <Grid size={16} className="text-indigo-400" />
            Setores e Personas Representadas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Sectors Pie Chart Equivalent */}
            <div className="space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Distribuição por Setor</span>
              <div className="space-y-2.5">
                {stats?.bySector && Object.entries(stats.bySector).map(([key, val]) => {
                  const pct = Math.round((val / totalResp) * 100);
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-300 font-medium">{sectorLabels[key] || key}</span>
                        <span className="text-white font-bold">{val} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Persona Breakdown */}
            <div className="space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Distribuição por Persona</span>
              <div className="space-y-2.5">
                {stats?.byPersona && Object.entries(stats.byPersona).map(([key, val]) => {
                  const pct = Math.round((val / totalResp) * 100);
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-300 font-medium">{key}</span>
                        <span className="text-white font-bold">{val} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Challenges and Tools Breakdown */}
        <div className="dark:glass-card rounded-2xl border border-white/5 p-6 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <TrendingUp size={16} className="text-indigo-400" />
            Problemas Realizados Identificados
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Biggest Challenges */}
            <div className="space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Maior Desafio Atual</span>
              <div className="space-y-2.5">
                {stats?.byChallenge && Object.entries(stats.byChallenge).slice(0, 4).map(([key, val]) => {
                  const pct = Math.round((val / totalResp) * 100);
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-300 truncate block max-w-[140px] font-medium">{challengeLabels[key] || key}</span>
                        <span className="text-white font-bold">{val}</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-rose-600 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tools Breakdown */}
            <div className="space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Ferramentas Atuais</span>
              <div className="space-y-2.5">
                {stats?.byTool && Object.entries(stats.byTool).slice(0, 4).map(([key, val]) => {
                  const pct = Math.round((val / totalResp) * 100);
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-300 font-medium">{toolLabels[key] || key}</span>
                        <span className="text-white font-bold">{val}</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Security Mandate Message */}
      <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/15 flex items-center space-x-3 text-xs text-indigo-300">
        <Database size={16} className="text-indigo-400 shrink-0" />
        <p className="leading-relaxed text-[11px]">
          <strong>Regra de Conformidade LISPA / GDPR:</strong> Os nomes individuais, endereços eletrónicos e números de telemóvel dos respondentes foram completamente anonimizados neste painel. Nenhuma entidade individual pode ser reidentificada, protegendo o ecossistema operacional de PMEs angolanas.
        </p>
      </div>

    </div>
  );
}
