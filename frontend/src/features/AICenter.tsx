import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  Compass, 
  Award, 
  Users, 
  Plus, 
  Clock,
  Briefcase
} from "lucide-react";
import { Sector } from "../types";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface AICenterProps {
  sector: Sector;
  score: number;
}

export default function AICenter({ sector, score }: AICenterProps) {
  const [activeAdvisor, setActiveAdvisor] = useState("Executive Advisor");
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "Executive Advisor": [
      { sender: "ai", text: "Olá! Sou o seu Assessor Estratégico Executivo do OLO Fintel. Analisei a sua cooperativa ou empresa hoje. Como posso ajudá-lo a otimizar a sua estratégia operacional geral de fomento económico?" }
    ],
    "Financial Advisor": [
      { sender: "ai", text: "Olá! Sou o seu Diretor Financeiro Digital por IA. Posso ajudar a analisar perdas com insumos, margens de vendas de lotes operacionais, e projeção de fluxo de caixa para os próximos meses. Qual é a sua dúvida?" }
    ],
    "Operations Advisor": [
      { sender: "ai", text: `Olá! Sou o seu Assessor Operacional especializado no setor de ${sector === Sector.Agriculture ? "Agricultura" : sector === Sector.Livestock ? "Pecuária" : sector === Sector.Fisheries ? "Pesca" : "Comércio"}. Posso analisar ciclos de sementeiras, controle sanitário de rebanhos, viagens marítimas de frotas e níveis críticos de stock. Como posso ajudar nas tarefas diárias?` }
    ],
    "Commercial Advisor": [
      { sender: "ai", text: "Olá! Sou o seu Assessor Comercial Inteligente. Vamos otimizar as suas negociações de faturas com compradores institucionais e canais de exportação SADC. Como posso ajudar hoje?" }
    ],
    "Funding Advisor": [
      { sender: "ai", text: `Olá! Sou o seu Especialista de Funding & Crédito do OLO Fintel. Com o seu score atual de ${score}/100, identifiquei oportunidades claras na sua estrutura documental e consistência de caixa. Qual é a sua pergunta sobre as linhas de microcrédito disponíveis em Angola?` }
    ]
  });

  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMessages = messages[activeAdvisor] || [];

  const advisors = [
    { name: "Executive Advisor", desc: "Visão estratégica global", icon: Briefcase, color: "text-blue-500 bg-blue-50 dark:bg-white/5 dark:text-zinc-300 dark:border-white/5 border border-transparent" },
    { name: "Financial Advisor", desc: "Fluxo de caixa e despesas", icon: TrendingUp, color: "text-green-500 bg-green-50 dark:bg-white/5 dark:text-zinc-300 dark:border-white/5 border border-transparent" },
    { name: "Operations Advisor", desc: "Produtividade do setor", icon: Compass, color: "text-amber-500 bg-amber-50 dark:bg-white/5 dark:text-zinc-300 dark:border-white/5 border border-transparent" },
    { name: "Commercial Advisor", desc: "Contratos e compradores SADC", icon: Users, color: "text-indigo-500 bg-indigo-50 dark:bg-white/5 dark:text-zinc-300 dark:border-white/5 border border-transparent" },
    { name: "Funding Advisor", desc: "Linhas de fomento e score", icon: Award, color: "text-purple-500 bg-purple-50 dark:bg-white/5 dark:text-zinc-300 dark:border-white/5 border border-transparent" }
  ];

  const suggestedQuestions: Record<string, string[]> = {
    "Executive Advisor": [
      "Quais são os principais riscos estratégicos da minha operação?",
      "Como usar o OLO Fintel para aumentar a transparência institucional?",
      "Como gerir a cooperativa com múltiplos cargos ativados?"
    ],
    "Financial Advisor": [
      "Como reduzir os meus custos operacionais com insumos?",
      "Como otimizar a minha provisão de caixa para o próximo trimestre?",
      "Como separar os custos de colheitas/lotes de forma estruturada?"
    ],
    "Operations Advisor": [
      "Como planear a manutenção das minhas frotas ou tratores?",
      "O que devo monitorizar para evitar quebras em lotes de produção?",
      "Quais alertas automáticos de stock mínimo devo configurar?"
    ],
    "Commercial Advisor": [
      "Como estruturar contratos e faturas para compradores formais?",
      "Quais as exigências comerciais mais comuns de distribuidores em Angola?",
      "Como o CRM ajuda a aumentar a velocidade do pipeline de vendas?"
    ],
    "Funding Advisor": [
      "O que é que falta para atingir um Funding Score superior a 90?",
      "Quais bancos parceiros em Angola aceitam relatórios do OLO Fintel?",
      "Como submeter uma candidatura de microcrédito com o meu score atual?"
    ]
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || sending) return;

    // Append user message
    const updatedMessages = [...activeMessages, { sender: "user" as const, text }];
    setMessages({
      ...messages,
      [activeAdvisor]: updatedMessages
    });
    setInputMessage("");
    setSending(true);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          advisorRole: activeAdvisor,
          sector,
          query: text,
          contextData: { score, orgName: "sua cooperativa", sector }
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages({
          ...messages,
          [activeAdvisor]: [...updatedMessages, { sender: "ai" as const, text: data.text }]
        });
      } else {
        setMessages({
          ...messages,
          [activeAdvisor]: [...updatedMessages, { sender: "ai" as const, text: "Ocorreu um erro ao gerar a análise. Por favor verifique o seu segredo do Gemini API." }]
        });
      }
    } catch (err) {
      setMessages({
        ...messages,
        [activeAdvisor]: [...updatedMessages, { sender: "ai" as const, text: "Não foi possível ligar ao motor de IA no OLO Fintel. Fallback offline ativo." }]
      });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeAdvisor]);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white">AI Center</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
          Consulte os nossos assessores inteligentes de fomento económico. Todas as recomendações são acionáveis e formatadas em Diagnóstico, Riscos, Oportunidades e Plano de Ação.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        
        {/* Left column: Advisors list */}
        <div className="lg:col-span-4 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-4 space-y-3 overflow-y-auto select-none">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Assessores Temáticos</span>
          
          <div className="space-y-1">
            {advisors.map((adv) => {
              const Icon = adv.icon;
              const isActive = activeAdvisor === adv.name;
              return (
                <button
                  key={adv.name}
                  onClick={() => setActiveAdvisor(adv.name)}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center space-x-3 ${
                    isActive
                      ? "border-indigo-500/60 bg-indigo-500/10 dark:bg-indigo-500/10"
                      : "border-transparent hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${adv.color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <span className={`block font-bold ${isActive ? "text-indigo-600 dark:text-indigo-400 font-extrabold" : "text-gray-800 dark:text-zinc-200"}`}>{adv.name}</span>
                    <span className="block text-[10px] text-gray-400 truncate max-w-[180px]">{adv.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Chat box */}
        <div className="lg:col-span-8 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl flex flex-col overflow-hidden h-full">
          
          {/* Chat header info */}
          <div className="p-4 bg-slate-50 dark:bg-white/[0.01] border-b border-gray-100/60 dark:border-white/5 flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-2.5">
              <Cpu size={18} className="text-indigo-600 dark:text-indigo-400" />
              <span className="font-extrabold text-sm text-gray-900 dark:text-white">{activeAdvisor}</span>
            </div>
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold px-2 py-0.5 rounded">
              Gemini 3.5 Flash
            </span>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {activeMessages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap text-left ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white font-semibold glow-indigo shadow-md"
                    : "bg-slate-50 dark:bg-white/[0.02] text-gray-850 dark:text-zinc-200 border border-gray-100/80 dark:border-white/5"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {sending && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-slate-50 dark:bg-white/[0.02] rounded-2xl p-4 text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center space-x-2 border border-gray-100/60 dark:border-white/5">
                  <div className="h-4 w-4 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>A analisar as métricas operacionais...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef}></div>
          </div>

          {/* Fast suggestion bar */}
          <div className="px-4 py-2 border-t border-gray-100/60 dark:border-white/5 bg-slate-50/40 dark:bg-white/[0.01] flex items-center gap-2 overflow-x-auto whitespace-nowrap shrink-0 select-none">
            {suggestedQuestions[activeAdvisor]?.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(q)}
                className="text-[10px] bg-white dark:bg-white/[0.02] hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-gray-600 dark:text-zinc-300 hover:text-indigo-700 dark:hover:text-indigo-400 border border-gray-200 dark:border-white/5 px-3 py-1.5 rounded-full font-semibold transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat input form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 border-t border-gray-100/60 dark:border-white/5 flex items-center space-x-2 shrink-0 bg-white dark:bg-transparent"
          >
            <input 
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Perguntar ao ${activeAdvisor}...`}
              className="flex-1 bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl px-3.5 py-3 text-xs text-gray-850 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || sending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition flex items-center justify-center disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-500/10 glow-indigo"
            >
              <Send size={14} />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
