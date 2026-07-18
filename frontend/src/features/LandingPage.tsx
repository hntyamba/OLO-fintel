import { useState, useEffect } from "react";
import { 
  Building2, 
  TrendingUp, 
  Users, 
  MapPin, 
  FileCheck, 
  ArrowRight, 
  HelpCircle, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet,
  PhoneCall,
  Lock
} from "lucide-react";
import { SurveyStats } from "../types";

interface LandingPageProps {
  stats: SurveyStats | null;
  onStartSurvey: () => void;
  onLoginClick: () => void;
}

export default function LandingPage({ stats, onStartSurvey, onLoginClick }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Fallback stats if server not fully responded
  const totalResp = stats?.totalResponses || 64;
  const goal = stats?.goal || 100;
  const pct = Math.min(100, Math.round((totalResp / goal) * 100));

  const sectorLabels: Record<string, string> = {
    Agriculture: "Agricultura",
    Livestock: "Pecuária",
    Fisheries: "Pesca",
    Commerce: "Comércio"
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
    Papel: "Cadernos / Papel",
    Excel: "Folhas de Excel",
    WhatsApp: "WhatsApp / Grupos",
    ERP: "Sistemas ERP",
    Outro: "Outros Métodos"
  };

  const faqs = [
    {
      q: "O que é o OLO Fintel?",
      a: "O OLO Fintel é um Sistema Operativo Económico desenvolvido para PMEs, cooperativas e associações produtivas africanas. Ajudamos a organizar operações diárias, controlar fluxos de caixa e criar transparência para acesso a crédito."
    },
    {
      q: "Preciso de me candidatar a financiamento para usar a plataforma?",
      a: "De forma alguma! O nosso princípio é o valor diário primeiro. Use o sistema todos os dias para gerir os seus talhões, animais, barcos ou vendas, controlar stock e despesas de forma rápida e intuitiva, mesmo que nunca peça financiamento."
    },
    {
      q: "Como funciona o Funding Readiness Score?",
      a: "É uma pontuação de 0 a 100 calculada de forma multidimensional com base na consistência operacional, saúde financeira, pipeline comercial e conformidade documental. Quanto mais preenche e organiza o seu perfil, maior o seu score de elegibilidade bancária."
    },
    {
      q: "Os meus dados estão seguros?",
      a: "Sim, os seus dados são confidenciais e protegidos. Apenas são agregados de forma anónima para estudos nacionais (como o questionário de validação) e nunca serão partilhados com terceiros sem a sua autorização explícita."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      
      {/* Top Banner for Survey Validation */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white text-xs md:text-sm py-2.5 px-4 text-center font-medium relative z-10 flex flex-col sm:flex-row justify-center items-center gap-2">
        <span className="inline-flex items-center gap-1 bg-purple-900/40 px-2 py-0.5 rounded-full text-[11px] border border-purple-500/30">
          ESTUDO NACIONAL
        </span>
        <span>Ajudando a mapear os desafios operacionais e acesso ao crédito em Angola.</span>
        <button 
          onClick={onStartSurvey}
          className="underline font-bold hover:text-purple-200 transition-colors cursor-pointer"
        >
          Responder agora ({totalResp}/{goal} respostas) &rarr;
        </button>
      </div>

      {/* Main Header Nav */}
      <header className="sticky top-0 bg-white/80 dark:bg-black/40 backdrop-blur-md border-b border-gray-200 dark:border-white/5 z-40 px-4 lg:px-8 py-3.5 flex justify-between items-center transition-colors">
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-purple-500/10">
            OLO
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">OLO <span className="text-purple-600 dark:text-indigo-400">Fintel</span></span>
            <span className="block text-[10px] text-gray-500 dark:text-zinc-400 font-medium tracking-widest uppercase">Economic OS</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-gray-600 dark:text-zinc-300">
          <a href="#problem" className="hover:text-purple-600 dark:hover:text-purple-400">O Problema</a>
          <a href="#solutions" className="hover:text-purple-600 dark:hover:text-purple-400">Funcionalidades</a>
          <a href="#industries" className="hover:text-purple-600 dark:hover:text-purple-400">Setores</a>
          <a href="#validation" className="hover:text-purple-600 dark:hover:text-purple-400">Validação Real</a>
        </nav>

        <div className="flex items-center space-x-3">
          <button 
            onClick={onLoginClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-md glow-indigo flex items-center space-x-2"
          >
            <Lock size={13} />
            <span>Acessar o Sistema</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-purple-200/50 dark:border-purple-800/30">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse"></span>
            <span>Estágio de Validação de Mercado (LISPA Co-Creation)</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
            Transformamos as suas operações diárias em <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400 font-bold">credibilidade financeira</span>.
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
            O OLO Fintel ajuda cooperativas e PMEs agrícolas, pesqueiras, pecuárias e comerciais a organizar as suas tarefas do dia-a-dia, controlar fluxos de caixa e obter um perfil de Funding Score auditável.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
            <button 
              onClick={onLoginClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl text-base transition flex items-center justify-center space-x-2 group cursor-pointer shadow-md glow-indigo"
            >
              <span>Acessar o Sistema</span>
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition" />
            </button>
            
            <button 
              onClick={onStartSurvey}
              className="bg-white dark:bg-white/[0.04] hover:bg-gray-50 dark:hover:bg-white/[0.08] text-gray-800 dark:text-zinc-200 font-bold px-6 py-3.5 rounded-xl text-base transition flex items-center justify-center space-x-2 border border-gray-300 dark:border-white/10 cursor-pointer shadow-sm"
            >
              <span>Responder ao Estudo</span>
              <span className="text-xs bg-purple-100 dark:bg-indigo-950 text-purple-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-full">{totalResp}/100</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-8">
            <div className="bg-white dark:glass-card p-4 rounded-xl border border-gray-200/60 dark:border-white/10 shadow-sm transition-colors">
              <span className="block text-2xl font-extrabold text-purple-600 dark:text-indigo-400">+{totalResp}</span>
              <span className="block text-xs font-semibold text-gray-500 dark:text-zinc-400">Respostas ao Estudo</span>
            </div>
            <div className="bg-white dark:glass-card p-4 rounded-xl border border-gray-200/60 dark:border-white/10 shadow-sm transition-colors">
              <span className="block text-2xl font-extrabold text-gray-900 dark:text-white">10</span>
              <span className="block text-xs font-semibold text-gray-500 dark:text-zinc-400">Províncias Ativas</span>
            </div>
            <div className="bg-white dark:glass-card p-4 rounded-xl border border-gray-200/60 dark:border-white/10 shadow-sm transition-colors">
              <span className="block text-2xl font-extrabold text-gray-900 dark:text-white">4</span>
              <span className="block text-xs font-semibold text-gray-500 dark:text-zinc-400">Setores de Atuação</span>
            </div>
            <div className="bg-white dark:glass-card p-4 rounded-xl border border-gray-200/60 dark:border-white/10 shadow-sm transition-colors col-span-2 sm:col-span-1">
              <span className="block text-2xl font-extrabold text-purple-600 dark:text-rose-400">{stats?.avgAiRating || "4.8"}/5</span>
              <span className="block text-xs font-semibold text-gray-500 dark:text-zinc-400">Aprovação da IA</span>
            </div>
          </div>
        </div>

        {/* Visual Mock / Feature Card */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-rose-500/10 rounded-3xl blur-3xl -z-10"></div>
          
          <div className="bg-white dark:glass-card rounded-2xl border border-gray-200 dark:border-white/10 p-5 shadow-xl hover:shadow-2xl transition-all glow-indigo">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-xs font-mono text-gray-400 dark:text-zinc-500">OLO Fintel Dashboard v1.1</span>
            </div>

            <div className="pt-4 space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-black/30 rounded-xl flex items-center justify-between border border-gray-100 dark:border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-purple-100 dark:bg-indigo-950/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-indigo-400 font-bold text-sm">
                    FS
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 dark:text-zinc-400">Funding Readiness Score</span>
                    <span className="block text-lg font-bold text-gray-900 dark:text-white">78 / 100</span>
                  </div>
                </div>
                <span className="bg-green-100 dark:bg-emerald-950/80 text-green-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">Financiável</span>
              </div>

              {/* Progress bar and checklist */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-500 dark:text-zinc-400">Progresso Documental</span>
                  <span className="text-gray-900 dark:text-white">85%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-zinc-850 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: "85%" }}></div>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-zinc-400">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>Alvará Comercial Registado e Válido</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-zinc-400">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>Histórico Financeiro Diário (Últimos 3 meses)</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-zinc-400">
                  <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                  <span>Estatutos de Constituição Pendentes</span>
                </div>
              </div>

              {/* Dynamic survey progress card */}
              <div className="mt-4 p-3 bg-purple-50/60 dark:bg-indigo-950/20 rounded-xl border border-purple-100 dark:border-indigo-950/30">
                <div className="flex justify-between text-xs font-semibold pb-1.5 text-purple-900 dark:text-indigo-300">
                  <span>Validação com o Mercado Nacional</span>
                  <span>{pct}% Concluído</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden mb-2">
                  <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                </div>
                <p className="text-[11px] text-purple-700/80 dark:text-indigo-400/80 leading-relaxed font-medium">
                  Meta: 100 respostas para consolidação do estudo de mercado do júri. Faltam {goal - totalResp} respostas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Problem Section */}
      <section id="problem" className="bg-white dark:bg-black/20 py-20 px-4 lg:px-8 border-y border-gray-200 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">A Realidade Nacional</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">O Abismo entre Operações e a Banca</h2>
            <p className="text-gray-500 dark:text-zinc-400 text-sm sm:text-base">
              PMEs e cooperativas geram riqueza todos os dias, mas não conseguem comprovar o seu valor devido à informalidade dos seus registos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 p-5 rounded-xl hover:bg-slate-50 dark:hover:glass-card dark:hover:glow-indigo transition duration-200">
              <div className="h-11 w-11 bg-red-100 dark:bg-rose-950/40 rounded-lg flex items-center justify-center text-red-600 dark:text-rose-400">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Informalidade dos Registos</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                Mais de 80% dos negócios agrícolas e comerciais registam dados em cadernos de papel ou chats de WhatsApp, perdendo rastreabilidade operacional e de faturamento.
              </p>
            </div>

            <div className="space-y-4 p-5 rounded-xl hover:bg-slate-50 dark:hover:glass-card dark:hover:glow-indigo transition duration-200">
              <div className="h-11 w-11 bg-red-100 dark:bg-rose-950/40 rounded-lg flex items-center justify-center text-red-600 dark:text-rose-400">
                <FileSpreadsheet size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dificuldade de Documentação</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                Estatutos, NIF, licenças e declarações de produção estão sempre dispersos, atrasando ou inviabilizando qualquer pedido formal de crédito.
              </p>
            </div>

            <div className="space-y-4 p-5 rounded-xl hover:bg-slate-50 dark:hover:glass-card dark:hover:glow-indigo transition duration-200">
              <div className="h-11 w-11 bg-red-100 dark:bg-rose-950/40 rounded-lg flex items-center justify-center text-red-600 dark:text-rose-400">
                <PhoneCall size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Avaliação Ineficaz dos Bancos</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                As instituições financeiras rejeitam os pedidos por falta de dados históricos de produção organizados, considerando o setor informal como altíssimo risco.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solutions" className="py-20 px-4 lg:px-8 max-w-7xl mx-auto transition-colors">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">A Nossa Solução</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Simples no Dia-a-Dia, Poderoso para a Banca</h2>
          <p className="text-gray-500 dark:text-zinc-400 text-sm sm:text-base">
            O OLO Fintel atua como uma ponte. Centralize tudo e use diariamente para gerir a sua cooperativa ou empresa, gerando valor imediato sem precisar de depender de crédito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:glass-card p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm space-y-3">
            <div className="h-10 w-10 bg-purple-100 dark:bg-indigo-950/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-indigo-400">
              <TrendingUp size={20} />
            </div>
            <h4 className="font-extrabold text-base text-gray-900 dark:text-white">Controle Operacional</h4>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
              Registe frotas, ciclos de plantação, lotes pecuários ou capturas de pesca em menos de 30 segundos, diretamente do telemóvel.
            </p>
          </div>

          <div className="bg-white dark:glass-card p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm space-y-3">
            <div className="h-10 w-10 bg-purple-100 dark:bg-indigo-950/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-indigo-400">
              <Building2 size={20} />
            </div>
            <h4 className="font-extrabold text-base text-gray-900 dark:text-white">Finanças Claras</h4>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
              Categorize receitas e despesas por talhão, embarcação ou lote de animais para saber exatamente onde ganha e onde perde dinheiro.
            </p>
          </div>

          <div className="bg-white dark:glass-card p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm space-y-3">
            <div className="h-10 w-10 bg-purple-100 dark:bg-indigo-950/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-indigo-400">
              <FileCheck size={20} />
            </div>
            <h4 className="font-extrabold text-base text-gray-900 dark:text-white">Organização Documental</h4>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
              Dossiê digital pronto e auditável com todos os documentos comerciais da sua organização estruturados para partilha instantânea.
            </p>
          </div>

          <div className="bg-white dark:glass-card p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm space-y-3">
            <div className="h-10 w-10 bg-purple-100 dark:bg-indigo-950/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-indigo-400">
              <Cpu size={20} />
            </div>
            <h4 className="font-extrabold text-base text-gray-900 dark:text-white">Consultoria IA Dedicada</h4>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
              Consulte 5 assessores IA especializados para obter diagnósticos, planos de ação e alertas de risco em tempo real.
            </p>
          </div>
        </div>
      </section>

      {/* Market Validation and Live Stats Panel */}
      <section id="validation" className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-20 px-4 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Charts side */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Mapeamento em Tempo Real</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold">Estatísticas do Nosso Estudo Nacional</h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                  Apresentamos abaixo a agregação em tempo real das <strong className="text-purple-300">{totalResp} respostas</strong> recolhidas. Estes dados são usados para provar o mercado de PMEs ao júri de investidores.
                </p>
              </div>

              {/* Dynamic SVG Charts Container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                
                {/* SVG Chart 1 - Challenges distribution */}
                <div className="bg-slate-800/60 dark:glass-card rounded-xl p-5 border border-slate-700/60 dark:border-white/5">
                  <span className="block text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">Principais Desafios Relatados</span>
                  
                  <div className="space-y-3.5">
                    {stats?.byChallenge ? (
                      Object.entries(stats.byChallenge)
                        .slice(0, 4)
                        .map(([key, value]) => {
                          const percent = Math.round((value / totalResp) * 100);
                          return (
                            <div key={key} className="space-y-1">
                              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                                <span>{challengeLabels[key] || key}</span>
                                <span className="text-slate-200 font-bold">{value} ({percent}%)</span>
                              </div>
                              <div className="w-full bg-slate-700 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-xs text-slate-400 italic">Carregando métricas dinâmicas...</div>
                    )}
                  </div>
                </div>

                {/* SVG Chart 2 - Province Distribution */}
                <div className="bg-slate-800/60 dark:glass-card rounded-xl p-5 border border-slate-700/60 dark:border-white/5">
                  <span className="block text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">Distribuição por Províncias</span>
                  
                  <div className="space-y-3.5">
                    {stats?.byProvince ? (
                      Object.entries(stats.byProvince)
                        .slice(0, 4)
                        .map(([key, value]) => {
                          const percent = Math.round((value / totalResp) * 100);
                          return (
                            <div key={key} className="space-y-1">
                              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                                <span className="flex items-center gap-1">
                                  <MapPin size={10} className="text-indigo-400" />
                                  {key}
                                </span>
                                <span className="text-slate-200 font-bold">{value} ({percent}%)</span>
                              </div>
                              <div className="w-full bg-slate-700 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="bg-rose-400 h-2 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-xs text-slate-400 italic">Carregando províncias...</div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Form CTA & Jury Gate */}
            <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-6">
              <div className="space-y-2">
                <span className="bg-purple-900/40 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Mapeamento de Mercado SADC
                </span>
                <h3 className="text-xl font-extrabold leading-tight">Faça parte do Estudo Nacional</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  O questionário é gratuito, leva menos de 3 minutos, ajuda a direcionar fomento agrícola ao seu município e melhora a visibilidade das PMEs informais de Angola.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button 
                  onClick={onStartSurvey}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition flex items-center justify-center space-x-2 group cursor-pointer"
                >
                  <span>Responder ao Questionário</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition" />
                </button>

                <button 
                  onClick={onLoginClick}
                  className="w-full bg-transparent hover:bg-white/5 text-slate-200 border border-white/20 font-bold py-3 px-4 rounded-xl text-xs transition"
                >
                  Acessar o Sistema
                </button>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Progresso Global</span>
                <span className="text-white font-bold">{totalResp} / 100 respostas recolhidas</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Supported Industries Sectors Showcase */}
      <section id="industries" className="py-20 px-4 lg:px-8 max-w-7xl mx-auto transition-colors">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Modularidade Setorial</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Adaptado às Realidades Nacionais</h2>
          <p className="text-gray-500 dark:text-zinc-400 text-sm sm:text-base">
            O OLO Fintel transforma a interface e os widgets em tempo real com base no setor da sua organização.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Agriculture Card */}
          <div className="bg-white dark:glass-card rounded-2xl border border-gray-200/60 dark:border-white/10 p-5 space-y-4 hover:border-indigo-500 transition-all duration-200 hover:glow-indigo">
            <span className="text-2xl">🌾</span>
            <div className="space-y-1">
              <h4 className="font-extrabold text-base text-gray-900 dark:text-white">Agricultura</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Acompanhe o estado de talhões, ciclos de culturas, insumos, sementes, colheitas e planeamento do clima.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-black/30 p-2.5 rounded-lg text-[11px] font-mono text-gray-500 dark:text-zinc-400 border border-transparent dark:border-white/5">
              <span className="block font-bold text-gray-700 dark:text-zinc-300">Módulos ativos:</span>
              <span>• Talhões & Solos<br />• Ciclos de Produção<br />• Alertas Climáticos</span>
            </div>
          </div>

          {/* Livestock Card */}
          <div className="bg-white dark:glass-card rounded-2xl border border-gray-200/60 dark:border-white/10 p-5 space-y-4 hover:border-indigo-500 transition-all duration-200 hover:glow-indigo">
            <span className="text-2xl">🐂</span>
            <div className="space-y-1">
              <h4 className="font-extrabold text-base text-gray-900 dark:text-white">Pecuária</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Registe animais individuais ou por lotes, datas de nascimentos, vacinas periódicas, ração e mortalidade.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-black/30 p-2.5 rounded-lg text-[11px] font-mono text-gray-500 dark:text-zinc-400 border border-transparent dark:border-white/5">
              <span className="block font-bold text-gray-700 dark:text-zinc-300">Módulos ativos:</span>
              <span>• Registo do Rebanho<br />• Controlo de Vacinas<br />• Custo Alimentar</span>
            </div>
          </div>

          {/* Fisheries Card */}
          <div className="bg-white dark:glass-card rounded-2xl border border-gray-200/60 dark:border-white/10 p-5 space-y-4 hover:border-indigo-500 transition-all duration-200 hover:glow-indigo">
            <span className="text-2xl">⚓</span>
            <div className="space-y-1">
              <h4 className="font-extrabold text-base text-gray-900 dark:text-white">Pesca</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Gerencie viagens de embarcações, histórico de capturas por espécie, consumo de combustível e manutenção.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-black/30 p-2.5 rounded-lg text-[11px] font-mono text-gray-500 dark:text-zinc-400 border border-transparent dark:border-white/5">
              <span className="block font-bold text-gray-700 dark:text-zinc-300">Módulos ativos:</span>
              <span>• Frotas & Barcos<br />• Viagens & Capturas<br />• Eficiência Térmica</span>
            </div>
          </div>

          {/* Commerce Card */}
          <div className="bg-white dark:glass-card rounded-2xl border border-gray-200/60 dark:border-white/10 p-5 space-y-4 hover:border-indigo-500 transition-all duration-200 hover:glow-indigo">
            <span className="text-2xl">🏪</span>
            <div className="space-y-1">
              <h4 className="font-extrabold text-base text-gray-900 dark:text-white">Comércio</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Gerencie stock de entrada/saída, produtos mais vendidos, margem de custos e fornecedores chave.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-black/30 p-2.5 rounded-lg text-[11px] font-mono text-gray-500 dark:text-zinc-400 border border-transparent dark:border-white/5">
              <span className="block font-bold text-gray-700 dark:text-zinc-300">Módulos ativos:</span>
              <span>• Alertas de Stock Baixo<br />• Orçamentos & Faturação<br />• Pipeline CRM</span>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white dark:bg-zinc-900 py-20 px-4 lg:px-8 border-t border-gray-200 dark:border-zinc-800/80 transition-colors">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">F.A.Q</span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Perguntas Frequentes</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-slate-50 dark:glass-card rounded-xl border border-gray-200/60 dark:border-white/5 overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left py-4 px-5 font-bold text-sm sm:text-base flex justify-between items-center text-gray-900 dark:text-white cursor-pointer hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                >
                  <span>{faq.q}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-xl">{activeFaq === idx ? "−" : "+"}</span>
                </button>
                {activeFaq === idx && (
                  <p className="py-3.5 px-5 text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed border-t border-gray-100 dark:border-white/5">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 px-4 lg:px-8 border-t border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand details */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-white font-black text-sm">
                O
              </div>
              <span className="font-extrabold text-white text-lg">OLO Fintel</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              O Sistema Operativo Económico (Economic OS) desenhado especificamente para cooperativas e PMEs de Angola. Organização operacional diária, controlo de tesouraria e score para concessão de crédito.
            </p>
            <div className="text-[10px] text-indigo-400 font-semibold bg-indigo-950/40 border border-indigo-500/10 px-2.5 py-1.5 rounded-lg inline-block">
              Parceiro LISPA Co-Creation Program
            </div>
          </div>

          {/* Col 2: Fomento Links */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <span className="block text-xs font-bold text-white uppercase tracking-wider">Fomento SADC</span>
            <ul className="space-y-2 text-xs">
              <li><button onClick={onStartSurvey} className="hover:text-white transition cursor-pointer">Estudo de Viabilidade</button></li>
              <li><a href="#validation" className="hover:text-white transition">Resultados Nacionais</a></li>
              <li><span className="text-slate-600 select-none">Linha de Crédito BDA</span></li>
              <li><span className="text-slate-600 select-none">Garantias Públicas</span></li>
            </ul>
          </div>

          {/* Col 3: Soluções */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <span className="block text-xs font-bold text-white uppercase tracking-wider">Plataforma</span>
            <ul className="space-y-2 text-xs">
              <li><a href="#solutions" className="hover:text-white transition">Funcionalidades</a></li>
              <li><a href="#industries" className="hover:text-white transition">Setores Agrícolas</a></li>
              <li><button onClick={onLoginClick} className="hover:text-white transition cursor-pointer">Registo de Cooperativa</button></li>
              <li><button onClick={onLoginClick} className="hover:text-white transition text-indigo-400 font-bold cursor-pointer">Acesso à Área Reservada</button></li>
            </ul>
          </div>

          {/* Col 4: Legal & Compliance */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <span className="block text-xs font-bold text-white uppercase tracking-wider">Conformidade</span>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-500 select-none">Lei de Proteção de Dados</span></li>
              <li><span className="text-slate-500 select-none">Regulamento LISPA</span></li>
              <li><span className="text-slate-500 select-none">Diretrizes de Fomento BUE</span></li>
              <li><span className="text-slate-500 select-none">Política de Privacidade</span></li>
            </ul>
          </div>

          {/* Col 5: Contacto */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <span className="block text-xs font-bold text-white uppercase tracking-wider">Contactos</span>
            <p className="text-xs text-slate-400">Luanda, Angola</p>
            <p className="text-xs text-slate-400">suporte@olo.ao</p>
            <div className="flex space-x-3 pt-2">
              <span className="text-slate-600 hover:text-white text-xs cursor-pointer">LinkedIn</span>
              <span className="text-slate-600 hover:text-white text-xs cursor-pointer">Twitter</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-1">
            <span>OLO Fintel &copy; 2026. Desenvolvido em conformidade com as diretivas económicas nacionais.</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-600">Língua: PT 🇦🇴</span>
            <span className="text-slate-600">Servidores: Luanda (Optimal)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
