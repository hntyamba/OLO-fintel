import { useState } from "react";
import { 
  BookOpen, 
  Search, 
  HelpCircle, 
  Award, 
  Play, 
  ChevronRight, 
  ExternalLink,
  ChevronDown
} from "lucide-react";

export default function KnowledgeHub() {
  const [activeCategory, setActiveAdvisor] = useState("Geral");
  const [searchQuery, setSearchQuery] = useState("");

  const articles = [
    { title: "Manual de Formalização de Cooperativas em Angola", desc: "Passo a passo completo sobre como registar a sua cooperativa no BUE e obter o NIF de isenção aduaneira.", cat: "Geral", duration: "12 min leitura" },
    { title: "Gestão Básica de Tesouraria para Pequenos Negócios", desc: "Como usar um registo diário simples de caixa para prever a falta de dinheiro antes de afetar a compra de combustíveis.", cat: "Finanças", duration: "8 min leitura" },
    { title: "Guia Prático de Fomento à Agricultura Familiar", desc: "Tudo sobre as principais sementes e corretivos de solo adequados para as províncias do Huambo, Bié e Huíla.", cat: "Agricultura", duration: "15 min leitura" },
    { title: "Rotas de Escoamento e Conservação de Peixe em Angola", desc: "Aprenda a otimizar a cadeia de frio e selagem térmica para carapau, sardinha e garoupa nas frotas de pesca costeira.", cat: "Pesca", duration: "10 min leitura" },
    { title: "Tabela Sanitária de Vacinação de Caprinos e Bovinos", desc: "Calendário periódico de dosagens e vacinas exigidas pela Direção Nacional de Pecuária para certificação formal.", cat: "Pecuária", duration: "6 min leitura" }
  ];

  const filteredArticles = articles.filter(art => {
    const matchCat = activeCategory === "Geral" || art.cat === activeCategory;
    const matchSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || art.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories = ["Geral", "Finanças", "Agricultura", "Pecuária", "Pesca"];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white">Knowledge Hub</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 font-medium">
            Aceda a guias de boas práticas, manuais de fomento e legislação SADC atualizada para cooperativas e PMEs regionais.
          </p>
        </div>

        {/* Mock Search input */}
        <div className="flex items-center space-x-2 bg-white dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/5 rounded-xl px-3 py-1.5 w-full sm:w-64 focus-within:border-indigo-500/50 transition-colors">
          <Search size={14} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Pesquisar artigos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs focus:outline-none w-full font-semibold text-gray-800 dark:text-zinc-200 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Category selector row */}
      <div className="flex items-center space-x-1 overflow-x-auto select-none no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveAdvisor(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition shrink-0 cursor-pointer ${
              activeCategory === cat
                ? "bg-indigo-600 border-indigo-600 text-white shadow-md glow-indigo"
                : "bg-white dark:bg-white/[0.02] border-gray-200 dark:border-white/5 text-gray-600 dark:text-zinc-350 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of articles list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map((art, idx) => (
          <div 
            key={idx}
            className="bg-white dark:glass-card border border-gray-200/60 dark:border-white/5 rounded-2xl p-5 space-y-4 hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                <span>{art.cat}</span>
                <span className="text-gray-400 dark:text-zinc-500 font-mono">{art.duration}</span>
              </div>
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white leading-snug">
                {art.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed font-medium">
                {art.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100/60 dark:border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold">Biblioteca OLO Fintel</span>
              <button className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline flex items-center gap-0.5 cursor-pointer">
                <span>Ler artigo completo</span>
                <ChevronRight size={10} />
              </button>
            </div>
          </div>
        ))}

        {filteredArticles.length === 0 && (
          <div className="col-span-2 py-12 text-center text-xs text-gray-400 dark:text-zinc-500 italic font-medium">
            Nenhum guia encontrado para a categoria ou termo pesquisado.
          </div>
        )}
      </div>

      {/* Curated Video references card */}
      <div className="bg-white dark:glass-card border border-gray-200/60 dark:border-white/5 rounded-2xl p-5 space-y-4">
        <h3 className="font-extrabold text-sm flex items-center gap-2 text-gray-950 dark:text-white">
          <Play size={16} className="text-indigo-500 dark:text-indigo-400" />
          Sessões de Capacitação em Vídeo (Aulas Curtas)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-white/[0.01] rounded-xl border border-gray-100/60 dark:border-white/5 flex justify-between items-center text-xs font-bold text-gray-700 dark:text-zinc-300">
            <div className="space-y-0.5 text-left">
              <span>Como formalizar PMEs no BUE</span>
              <span className="block text-[10px] text-gray-400 dark:text-zinc-500 font-medium">Fomento e cooperativismo • 18 min</span>
            </div>
            <button className="h-8 w-8 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-500/10 dark:border-white/5 rounded-full flex items-center justify-center hover:scale-105 transition cursor-pointer">
              ▶
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-white/[0.01] rounded-xl border border-gray-100/60 dark:border-white/5 flex justify-between items-center text-xs font-bold text-gray-700 dark:text-zinc-300">
            <div className="space-y-0.5 text-left">
              <span>Fluxo de Caixa Descomplicado</span>
              <span className="block text-[10px] text-gray-400 dark:text-zinc-500 font-medium">Módulo finanças OLO • 12 min</span>
            </div>
            <button className="h-8 w-8 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-500/10 dark:border-white/5 rounded-full flex items-center justify-center hover:scale-105 transition cursor-pointer">
              ▶
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
