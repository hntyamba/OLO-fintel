import { useState } from "react";
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  HelpCircle,
  Play
} from "lucide-react";
import { Sector } from "../types";

interface FundingReadinessProps {
  sector: Sector;
  score: number;
  onScoreChange: (score: number) => void;
}

export default function FundingReadiness({ sector, score, onScoreChange }: FundingReadinessProps) {
  // Checklist State (Toggling items changes overall score dynamically in the simulator!)
  const [checklist, setChecklist] = useState([
    { id: "nif", text: "NIF de Contribuinte Válido e Registado", points: 15, checked: true },
    { id: "alvara", text: "Alvará Comercial / Licença de Pesca ou Agrícola", points: 20, checked: true },
    { id: "history", text: "Mínimo de 3 meses de registos diários de caixa", points: 25, checked: false },
    { id: "estatuto", text: "Estatutos de Constituição Registados no BUE", points: 20, checked: false },
    { id: "contracts", text: "Pelo menos 1 contrato comercial ativo com comprador", points: 20, checked: true }
  ]);

  // Simulation parameters
  const [revenueSim, setRevenueSim] = useState(0); // -50% to +50%
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [actionPlanText, setActionPlanText] = useState<string | null>(null);

  // Calculate dynamic simulated score
  const baseCheckedScore = checklist.reduce((sum, item) => sum + (item.checked ? item.points : 0), 0);
  const simAdjustment = Math.round(revenueSim * 0.2); // adjusting score slightly up/down based on simulated revenue increase
  const simulatedScore = Math.max(0, Math.min(100, baseCheckedScore + simAdjustment));

  const toggleCheck = (id: string) => {
    const updated = checklist.map(item => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setChecklist(updated);
    
    // Propagate score change back to App parent state
    const newScore = updated.reduce((sum, item) => sum + (item.checked ? item.points : 0), 0);
    onScoreChange(newScore);
  };

  const handleGeneratePlan = async () => {
    setLoadingPlan(true);
    setActionPlanText(null);

    const query = `Gere um plano de ação estrito e altamente profissional para uma organização com Funding Readiness Score de ${simulatedScore}/100. Setor de atuação: ${sector}. A organização quer atingir score 90+ para se qualificar para microcrédito bonificado em Angola. Recomende melhorias com base nos itens documentais em falta.`;

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          advisorRole: "Consultor de Fomento & Linhas de Crédito",
          sector,
          query,
          contextData: { score: simulatedScore, orgName: "sua cooperativa", sector }
        })
      });

      const resData = await res.json();
      if (resData.success) {
        setActionPlanText(resData.text);
      } else {
        setActionPlanText("Não foi possível aceder ao servidor de IA no momento. Por favor verifique as configurações.");
      }
    } catch (err) {
      setActionPlanText("Falha ao ligar ao motor de IA. Fallback offline ativo.");
    } finally {
      setLoadingPlan(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white">Funding Readiness Center</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
          Descubra se a sua organização está pronta para aceder a linhas de fomento nacional (ex: PAC, Prodesi) e fundos de microcrédito.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Score & Simulator Area */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Score Visual Card */}
          <div className="bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div className="space-y-2 text-center sm:text-left">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">O Seu Score Geral</span>
              <span className="block text-5xl font-black text-indigo-600 dark:text-indigo-400">{simulatedScore} <span className="text-sm text-gray-400 font-bold">/ 100</span></span>
              
              <span className={`inline-block text-[11px] font-extrabold px-3 py-1 rounded-full ${
                simulatedScore >= 80 
                  ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200/50"
                  : simulatedScore >= 50
                  ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50"
                  : "bg-red-100 dark:bg-rose-950/40 text-red-700 dark:text-rose-400 border border-rose-200/50"
              }`}>
                {simulatedScore >= 80 
                  ? "Elegibilidade Elevada (Excelente)" 
                  : simulatedScore >= 50 
                  ? "Aptidão Intermédia (Ajustes recomendados)" 
                  : "Informal (Bloqueio bancário absoluto)"}
              </span>
            </div>

            {/* Score breakdown bar */}
            <div className="w-full sm:w-48 space-y-3 shrink-0">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest text-center sm:text-left">Composição Multidimensional</span>
              <div className="space-y-1.5 text-[11px] font-bold">
                <div className="flex justify-between">
                  <span className="text-gray-500">Documental</span>
                  <span className="text-gray-900 dark:text-white">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Operacional</span>
                  <span className="text-gray-900 dark:text-white">65%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Finanças</span>
                  <span className="text-gray-900 dark:text-white">45%</span>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATOR INPUTS */}
          <div className="bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-5 shadow-sm">
            <div className="pb-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-gray-900 dark:text-white">
                <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" />
                Simulador de Elegibilidade de Crédito
              </h3>
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Interativo
              </span>
            </div>

            {/* Simulated Checklist toggles */}
            <div className="space-y-3.5">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Ative os requisitos documentais para simular o score:</span>
              
              <div className="space-y-2">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100/80 dark:hover:bg-white/[0.04] rounded-xl border border-gray-100 dark:border-white/5 transition text-xs font-bold text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition ${
                        item.checked 
                          ? "bg-indigo-600 border-indigo-600 text-white" 
                          : "border-gray-300 dark:border-zinc-700"
                      }`}>
                        {item.checked && <span>✓</span>}
                      </div>
                      <span className={item.checked ? "text-gray-900 dark:text-white font-black" : "text-gray-400 font-semibold"}>
                        {item.text}
                      </span>
                    </div>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded font-mono shrink-0">
                      +{item.points} pts
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Revenue slider simulator */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>Simular Crescimento de Venda Mensal:</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {revenueSim >= 0 ? `+${revenueSim}%` : `${revenueSim}%`}
                </span>
              </div>
              <input 
                type="range" 
                min="-50" 
                max="50" 
                value={revenueSim}
                onChange={(e) => setRevenueSim(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-gray-400 leading-normal">
                Nota: O crescimento de vendas regular e justificado em faturas digitais aumenta a consistência do score financeiro junto ao investidor de fomento SADC.
              </p>
            </div>
          </div>

        </div>

        {/* AI action plan column */}
        <div className="lg:col-span-5 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-5 shadow-sm transition-colors h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
            <h3 className="font-extrabold text-sm flex items-center gap-2 text-gray-900 dark:text-white">
              <Cpu size={16} className="text-indigo-600 dark:text-indigo-400" />
              Plano de Ação Inteligente (IA)
            </h3>
          </div>

          <p className="text-xs text-gray-500 leading-normal">
            Gere recomendações personalizadas com base no seu score atual para acelerar o dossiê da sua organização perante a banca.
          </p>

          {!actionPlanText ? (
            <button
              onClick={handleGeneratePlan}
              disabled={loadingPlan}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer glow-indigo"
            >
              <Sparkles size={14} />
              <span>{loadingPlan ? "Analisando com Gemini..." : "Gerar Plano de Ação por IA"}</span>
            </button>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-slate-50 dark:bg-white/[0.01] rounded-xl border border-gray-100 dark:border-white/5 text-xs text-gray-600 dark:text-zinc-300 font-medium leading-relaxed max-h-[320px] overflow-y-auto whitespace-pre-line text-left">
                {actionPlanText}
              </div>
              <button
                onClick={() => setActionPlanText(null)}
                className="w-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-gray-700 dark:text-zinc-200 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Refazer Simulação
              </button>
            </div>
          )}

          {loadingPlan && (
            <div className="flex flex-col items-center justify-center space-y-2 py-8 animate-pulse text-xs text-indigo-600 dark:text-indigo-400 font-bold">
              <div className="h-6 w-6 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Gerando diagnóstico e oportunidades...</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
