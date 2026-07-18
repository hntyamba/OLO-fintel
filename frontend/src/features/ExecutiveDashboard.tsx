import { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Award, 
  AlertTriangle, 
  CheckSquare, 
  Sparkles, 
  ChevronRight, 
  Clock,
  ArrowRight
} from "lucide-react";
import { Sector } from "../types";

interface ExecutiveDashboardProps {
  sector: Sector;
  score: number;
  onNavigate: (tab: string) => void;
}

export default function ExecutiveDashboard({ sector, score, onNavigate }: ExecutiveDashboardProps) {
  // Task state
  const [tasks, setTasks] = useState([
    { id: 1, text: "Registar colheita/venda do dia no painel", completed: false },
    { id: 2, text: "Fazer upload do Estatuto de Constituição", completed: true },
    { id: 3, text: "Simular elegibilidade de financiamento com IA", completed: false },
    { id: 4, text: "Rever stock de ração de crescimento/fertilizantes", completed: false }
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Sector specific contextual insights
  const sectorTips: Record<Sector, string[]> = {
    [Sector.Agriculture]: [
      "A humidade no Huambo está ideal para a sementeira. Considere iniciar o ciclo do Talhão B.",
      "O preço médio do milho na província subiu 8% esta semana. Oportunidade para fechar contratos.",
      "Atenção: Trator Massey Ferguson precisa de manutenção preventiva de óleo em 15 horas operacionais."
    ],
    [Sector.Livestock]: [
      "Lote de Suínos B04 atinge peso ideal de abate (95kg). Planeie o escoamento comercial.",
      "Vacinação de Febre Aftosa programada para amanhã cedo. Certifique-se de que o lote está no piquete 2.",
      "Custo alimentar aumentou 4% devido à escassez de milho para moagem local."
    ],
    [Sector.Fisheries]: [
      "Embarcação 'Rio Kwanza' regressou com captura recorde de 4.2 toneladas de Carapau.",
      "Previsão de ventos fortes para a costa de Benguela amanhã. Recomenda-se precaução nas viagens curtas.",
      "Consumo médio de gasóleo subiu 11% devido a correntes adversas na rota sul."
    ],
    [Sector.Commerce]: [
      "As vendas de cimento e materiais de construção aumentaram 14% em Luanda.",
      "Alerta de Stock Crítico: Cerveja Tigra está abaixo do stock mínimo definido de 10 caixas.",
      "Pipeline de CRM tem 3 propostas em fase de negociação de contrato. Atue para fechar esta semana."
    ]
  };

  const tips = sectorTips[sector] || sectorTips[Sector.Commerce];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Top Welcome Title block */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white">Dashboard Executivo</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
            Resumo em tempo real da sua cooperativa ou PME no setor de <strong className="text-purple-600 dark:text-purple-400">{sector === Sector.Agriculture ? "Agricultura" : sector === Sector.Livestock ? "Pecuária" : sector === Sector.Fisheries ? "Pesca" : "Comércio"}</strong>.
          </p>
        </div>

        {/* Dynamic date indicator */}
        <div className="flex items-center space-x-2 text-xs font-semibold bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl text-gray-500 dark:text-zinc-400">
          <Clock size={14} />
          <span>Última sincronização: Hoje às 08:24 (UTC-1)</span>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Revenue */}
        <div className="bg-white dark:glass-card p-4 rounded-2xl border border-gray-200/60 dark:border-white/10 shadow-sm space-y-2 hover:border-indigo-500/50 hover:glow-indigo transition-all duration-200">
          <div className="flex justify-between items-center text-xs font-bold text-gray-400">
            <span>Faturação Mensal</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <span className="block text-xl font-black text-gray-900 dark:text-white">1,450,000 Kz</span>
          <span className="block text-[10px] text-emerald-500 font-bold">+12.4% vs mês anterior</span>
        </div>

        {/* Expenses */}
        <div className="bg-white dark:glass-card p-4 rounded-2xl border border-gray-200/60 dark:border-white/10 shadow-sm space-y-2 hover:border-rose-500/50 hover:glow-rose transition-all duration-200">
          <div className="flex justify-between items-center text-xs font-bold text-gray-400">
            <span>Despesas Mensais</span>
            <TrendingDown size={16} className="text-rose-500" />
          </div>
          <span className="block text-xl font-black text-gray-900 dark:text-white">840,000 Kz</span>
          <span className="block text-[10px] text-rose-500 font-bold">-4.1% vs mês anterior</span>
        </div>

        {/* Net Profit Margin */}
        <div className="bg-white dark:glass-card p-4 rounded-2xl border border-gray-200/60 dark:border-white/10 shadow-sm space-y-2 hover:border-indigo-500/50 hover:glow-indigo transition-all duration-200">
          <div className="flex justify-between items-center text-xs font-bold text-gray-400">
            <span>Margem Bruta</span>
            <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Excelente</span>
          </div>
          <span className="block text-xl font-black text-gray-900 dark:text-white">42.1%</span>
          <span className="block text-[10px] text-gray-500 dark:text-zinc-400 font-medium">Margem líquida de 610,000 Kz</span>
        </div>

        {/* Liquidity */}
        <div className="bg-white dark:glass-card p-4 rounded-2xl border border-gray-200/60 dark:border-white/10 shadow-sm space-y-2 hover:border-indigo-500/50 hover:glow-indigo transition-all duration-200">
          <div className="flex justify-between items-center text-xs font-bold text-gray-400">
            <span>Disponibilidade</span>
            <Activity size={16} className="text-indigo-500" />
          </div>
          <span className="block text-xl font-black text-gray-900 dark:text-white">320,000 Kz</span>
          <span className="block text-[10px] text-indigo-500 font-bold">Fundo de maneio estável</span>
        </div>

        {/* Funding score */}
        <div className="bg-indigo-500/5 dark:bg-gradient-to-br dark:from-indigo-950/20 dark:to-rose-950/10 p-4 rounded-2xl border border-indigo-200 dark:border-white/10 shadow-sm space-y-2 col-span-1 sm:col-span-2 lg:col-span-1 glow-indigo transition-all duration-200">
          <div className="flex justify-between items-center text-xs font-bold text-indigo-700 dark:text-indigo-400">
            <span>Elegibilidade Bancária</span>
            <Award size={16} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="block text-2xl font-extrabold text-indigo-900 dark:text-white">{score} / 100</span>
          <button 
            onClick={() => onNavigate("funding")}
            className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-0.5"
          >
            <span>Ver checklist de fomento</span>
            <ChevronRight size={10} />
          </button>
        </div>

      </div>

      {/* ALERTS & DYNAMIC METRIC INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* AI Recommendations Column */}
        <div className="lg:col-span-7 bg-white dark:glass-card rounded-2xl border border-gray-200/60 dark:border-white/10 p-5 space-y-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
            <h3 className="text-sm font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
              OLO Advisor Recomendações Recentes
            </h3>
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              IA Ativa
            </span>
          </div>

          <div className="space-y-3.5">
            {tips.map((tip, idx) => (
              <div 
                key={idx}
                className="p-3.5 bg-slate-50 dark:bg-white/[0.02] rounded-xl border border-gray-100/60 dark:border-white/5 flex items-start space-x-3 text-xs text-gray-600 dark:text-zinc-300 font-medium leading-relaxed"
              >
                <div className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-[10px] shrink-0">
                  0{idx + 1}
                </div>
                <p>{tip}</p>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigate("ai")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-sm glow-indigo cursor-pointer"
          >
            <span>Consultar os Consultores Temáticos</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Task Checklist Manager */}
        <div className="lg:col-span-5 bg-white dark:glass-card rounded-2xl border border-gray-200/60 dark:border-white/10 p-5 space-y-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
            <h3 className="text-sm font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <CheckSquare size={16} className="text-indigo-600 dark:text-indigo-400" />
              Tarefas Operacionais do Dia
            </h3>
            <span className="text-[10px] text-gray-400 font-bold">Sincronizado</span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="w-full flex items-center space-x-3 text-left p-2.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition cursor-pointer"
              >
                <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition ${
                  task.completed 
                    ? "bg-indigo-600 border-indigo-600 text-white" 
                    : "border-gray-300 dark:border-white/10"
                }`}>
                  {task.completed && <span className="text-[10px]">✓</span>}
                </div>
                <span className={`text-xs font-semibold ${
                  task.completed 
                    ? "line-through text-gray-400 dark:text-zinc-500" 
                    : "text-gray-700 dark:text-zinc-200"
                }`}>
                  {task.text}
                </span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-blue-50/50 dark:bg-white/[0.02] rounded-xl border border-blue-100/50 dark:border-white/5 text-[11px] text-indigo-700 dark:text-indigo-400 flex items-center space-x-2">
            <AlertTriangle size={14} className="shrink-0 text-indigo-500" />
            <span>O registo regular de operações aumenta o seu score de elegibilidade.</span>
          </div>
        </div>

      </div>

      {/* CORE SECTIONS HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Operations */}
        <button 
          onClick={() => onNavigate("operations")}
          className="bg-white dark:glass-card p-5 rounded-2xl border border-gray-200/60 dark:border-white/10 text-left hover:border-indigo-500 hover:glow-indigo transition shadow-sm space-y-3 cursor-pointer"
        >
          <span className="text-xl">🚜</span>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Painel Operacional</h4>
            <p className="text-[11px] text-gray-400 dark:text-zinc-400 leading-normal">
              Aceda a talhões, ciclos pecuários, viagens de pesca ou frotas comerciais.
            </p>
          </div>
        </button>

        {/* Finance */}
        <button 
          onClick={() => onNavigate("finance")}
          className="bg-white dark:glass-card p-5 rounded-2xl border border-gray-200/60 dark:border-white/10 text-left hover:border-indigo-500 hover:glow-indigo transition shadow-sm space-y-3 cursor-pointer"
        >
          <span className="text-xl">💰</span>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Caixa & Tesouraria</h4>
            <p className="text-[11px] text-gray-400 dark:text-zinc-400 leading-normal">
              Gira todas as receitas de colheitas, vendas e despesas operacionais críticas.
            </p>
          </div>
        </button>

        {/* Documents */}
        <button 
          onClick={() => onNavigate("documents")}
          className="bg-white dark:glass-card p-5 rounded-2xl border border-gray-200/60 dark:border-white/10 text-left hover:border-indigo-500 hover:glow-indigo transition shadow-sm space-y-3 cursor-pointer"
        >
          <span className="text-xl">📂</span>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Dossiê de Documentos</h4>
            <p className="text-[11px] text-gray-400 dark:text-zinc-400 leading-normal">
              Centralize NIF, alvarás, faturas e certidões organizadas de forma segura.
            </p>
          </div>
        </button>

        {/* CRM */}
        <button 
          onClick={() => onNavigate("crm")}
          className="bg-white dark:glass-card p-5 rounded-2xl border border-gray-200/60 dark:border-white/10 text-left hover:border-indigo-500 hover:glow-indigo transition shadow-sm space-y-3 cursor-pointer"
        >
          <span className="text-xl">🤝</span>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">CRM & Parcerias</h4>
            <p className="text-[11px] text-gray-400 dark:text-zinc-400 leading-normal">
              Pipeline Kanban para acompanhar contratos de compradores institucionais.
            </p>
          </div>
        </button>

      </div>

    </div>
  );
}
