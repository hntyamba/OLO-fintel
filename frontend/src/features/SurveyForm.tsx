import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Award, Sparkles, Building, MapPin } from "lucide-react";
import { SurveyStats } from "../types";

interface SurveyFormProps {
  stats: SurveyStats | null;
  onSuccess: (updatedStats: SurveyStats, preselectedSector: string) => void;
  onCancel: () => void;
}

export default function SurveyForm({ stats, onSuccess, onCancel }: SurveyFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [persona, setPersona] = useState("");
  const [sector, setSector] = useState("");
  const [province, setProvince] = useState("");
  const [orgName, setOrgName] = useState("");
  const [managementTool, setManagementTool] = useState("");
  const [biggestChallenge, setBiggestChallenge] = useState("");
  const [fundingHistory, setFundingHistory] = useState("");
  const [aiValueRating, setAiValueRating] = useState(5);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const totalResp = stats?.totalResponses || 64;
  const nextCount = totalResp + 1;

  const personas = [
    "Presidente de Cooperativa",
    "Gestor PME",
    "Analista Financeiro",
    "Consultor"
  ];

  const sectors = [
    { id: "Agriculture", name: "Agricultura 🌾" },
    { id: "Livestock", name: "Pecuária 🐂" },
    { id: "Fisheries", name: "Pesca ⚓" },
    { id: "Commerce", name: "Comércio 🏪" }
  ];

  const provinces = [
    "Luanda", "Huambo", "Benguela", "Huíla", "Bié", "Cunene", "Namibe", "Uíge", "Malanje", "Cabinda", "Zaire", "Lunda Norte", "Lunda Sul", "Moxico", "Cuando Cubango", "Cuanza Norte", "Cuanza Sul", "Bengo"
  ];

  const tools = [
    { id: "Papel", label: "Cadernos de Papel 📝" },
    { id: "Excel", label: "Folhas de Excel 📊" },
    { id: "WhatsApp", label: "WhatsApp / Grupos de Trabalho 💬" },
    { id: "ERP", label: "Software de Gestão (ERP) 💻" },
    { id: "Outro", label: "Outros Métodos / Informal 🤷" }
  ];

  const challenges = [
    { id: "Financing", label: "Financiamento / Acesso a Crédito Bancário" },
    { id: "Inventory", label: "Controlo de Stock / Desperdício de Insumos" },
    { id: "Clientes", label: "Atração de Clientes / Compradores Seguros" },
    { id: "Production", label: "Dificuldade em medir produtividade por ciclo" },
    { id: "Reporting", label: "Ausência de Relatórios Consolidados" },
    { id: "Documents", label: "Dificuldade em reunir os documentos comerciais exigidos" }
  ];

  const fundingHistories = [
    { id: "Nunca Aplicou", label: "Nunca me candidatei a financiamento" },
    { id: "Aprovado", label: "Candidatei-me e consegui aprovação" },
    { id: "Rejeitado", label: "Candidatei-me mas o pedido foi rejeitado" }
  ];

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!persona) return setError("Por favor selecione a sua Persona / Cargo.");
      if (!sector) return setError("Por favor selecione o seu Setor principal.");
    }
    if (step === 2) {
      if (!province) return setError("Por favor selecione a sua Província.");
      if (!orgName) return setError("Por favor indique o nome da sua organização.");
    }
    if (step === 3) {
      if (!managementTool) return setError("Selecione como gere a sua operação.");
      if (!biggestChallenge) return setError("Indique o seu maior desafio atual.");
    }
    if (step === 4) {
      if (!fundingHistory) return setError("Selecione o seu histórico de candidaturas.");
    }

    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      persona,
      sector,
      province,
      managementTool,
      biggestChallenge,
      fundingHistory,
      aiValueRating,
      organizationName: orgName,
      email: email || undefined,
      phone: phone || undefined
    };

    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const resData = await res.json();

      if (resData.success) {
        setSubmitted(true);
        onSuccess(resData.data, sector);
      } else {
        setError(resData.message || "Erro ao submeter a resposta.");
      }
    } catch (err) {
      setError("Erro de rede ao ligar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050508] flex flex-col items-center justify-center p-4 transition-colors">
      
      {/* Dynamic Header */}
      <div className="max-w-xl w-full text-center space-y-2 mb-6">
        <span className="text-[10px] font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-100 dark:bg-indigo-950/40 border border-indigo-200/10 dark:border-white/5 px-3 py-1 rounded-full">
          Estágio de Validação SADC
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Estudo de Viabilidade</h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
          A sua resposta será a número <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">#{nextCount}</strong> de 100 necessárias para validação corporativa.
        </p>
      </div>

      <div className="max-w-xl w-full bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden transition-colors">
        
        {/* Step progress bar */}
        {!submitted && (
          <div className="w-full bg-gray-100 dark:bg-white/5 h-2 flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s} 
                className={`h-2 flex-1 transition-all duration-350 ${
                  s <= step ? "bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.5)]" : "bg-gray-200 dark:bg-white/5"
                }`}
              ></div>
            ))}
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded-xl text-xs font-semibold border border-rose-200/50 dark:border-rose-900/40 animate-fade-in">
              ⚠️ {error}
            </div>
          )}

          {!submitted ? (
            <>
              {/* STEP 1: Persona & Sector */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-in text-left">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Qual é a sua função e setor?</h3>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">Isto nos ajuda a ajustar a interface do OLO Fintel para as suas necessidades reais.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-550">Selecione o seu cargo / Persona:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {personas.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPersona(p)}
                          className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition cursor-pointer ${
                            persona === p
                              ? "border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-extrabold"
                              : "border-gray-200/60 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-gray-700 dark:text-zinc-300"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-550">Setor Principal:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {sectors.map((sec) => (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => setSector(sec.id)}
                          className={`p-3.5 rounded-xl border text-center text-xs font-semibold transition cursor-pointer ${
                            sector === sec.id
                              ? "border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-extrabold"
                              : "border-gray-200/60 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-gray-700 dark:text-zinc-300"
                          }`}
                        >
                          {sec.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Province & Organization Name */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in text-left">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Onde atua e qual é a sua marca?</h3>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">Mapeamento por província para estudo de fomento económico local.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 flex items-center gap-1">
                      <MapPin size={12} className="text-indigo-500 dark:text-indigo-400" />
                      Selecione a Província:
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-900 border border-gray-200/60 dark:border-white/5 rounded-xl p-3 text-sm font-semibold text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 text-left"
                    >
                      <option value="" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">-- Selecione a Província --</option>
                      {provinces.map((p) => (
                        <option key={p} value={p} className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">{p}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 flex items-center gap-1">
                      <Building size={12} className="text-indigo-500 dark:text-indigo-400" />
                      Nome da Cooperativa / PME:
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="Ex: Cooperativa Agrícola do Huambo"
                      className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/5 rounded-xl p-3 text-sm text-gray-850 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 font-medium text-left"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Tools & Biggest Challenge */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-in text-left">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Ferramentas e Principais Dores</h3>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">Como lida atualmente com a operação do negócio?</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Como regista as despesas e receitas hoje?</label>
                    <div className="space-y-1.5">
                      {tools.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setManagementTool(t.id)}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition flex justify-between items-center cursor-pointer ${
                            managementTool === t.id
                              ? "border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-extrabold"
                              : "border-gray-200/60 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-gray-700 dark:text-zinc-300"
                          }`}
                        >
                          <span>{t.label}</span>
                          {managementTool === t.id && <span className="h-2 w-2 rounded-full bg-indigo-600"></span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Qual é o seu maior desafio operacional?</label>
                    <div className="space-y-1.5">
                      {challenges.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setBiggestChallenge(c.id)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                            biggestChallenge === c.id
                              ? "border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-extrabold"
                              : "border-gray-200/60 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-gray-600 dark:text-zinc-404"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Funding History */}
              {step === 4 && (
                <div className="space-y-5 animate-fade-in text-left">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Candidatura a Financiamentos</h3>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">Mapeamento da relação de PMEs africanas com a banca comercial.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Qual é o seu histórico com pedidos de crédito?</label>
                    <div className="space-y-2">
                      {fundingHistories.map((fh) => (
                        <button
                          key={fh.id}
                          type="button"
                          onClick={() => setFundingHistory(fh.id)}
                          className={`w-full p-4 rounded-xl border text-left text-xs font-semibold transition cursor-pointer ${
                            fundingHistory === fh.id
                              ? "border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-extrabold"
                              : "border-gray-200/60 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-gray-700 dark:text-zinc-350"
                          }`}
                        >
                          {fh.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: AI Value & Contact */}
              {step === 5 && (
                <div className="space-y-5 animate-fade-in text-left">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Valor da Consultoria de Inteligência Artificial</h3>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">Assinale o quão valioso seria contar com assessoria especializada de IA na sua rotina.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                      De 1 a 5, o quão útil seria uma Inteligência Artificial sugerindo diagnósticos financeiros e operacionais?
                    </label>
                    <div className="flex justify-center space-x-2 pt-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAiValueRating(num)}
                          className={`h-12 w-12 rounded-xl border font-bold text-base transition flex items-center justify-center cursor-pointer ${
                            aiValueRating === num
                              ? "bg-indigo-600 border-indigo-600 text-white glow-indigo"
                              : "border-gray-200/60 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-gray-700 dark:text-zinc-450"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-550 dark:text-zinc-400">
                      Contactos Opcionais (Se desejar acompanhar os resultados do Estudo):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        className="bg-slate-50 dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/5 rounded-xl p-2.5 text-xs text-gray-850 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 text-left font-medium"
                      />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Telemóvel (ex: 923...)"
                        className="bg-slate-50 dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/5 rounded-xl p-2.5 text-xs text-gray-850 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 text-left font-medium"
                      />
                    </div>
                    <span className="block text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
                      🔒 OOLO Fintel cumpre estritamente com as políticas gerais de privacidade de dados.
                    </span>
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100/60 dark:border-white/5">
                <button
                  type="button"
                  onClick={step === 1 ? onCancel : handlePrev}
                  className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>{step === 1 ? "Voltar ao Início" : "Anterior"}</span>
                </button>

                {step === 5 ? (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50 cursor-pointer glow-indigo"
                  >
                    <span>{loading ? "A enviar..." : "Submeter Resposta"}</span>
                    <Sparkles size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-gray-900 dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-gray-950 font-bold py-2.5 px-6 rounded-xl text-xs transition flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Seguinte</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </>
          ) : (
            /* SUCCESS COMPLETED CARD */
            <div className="text-center space-y-6 py-4 animate-fade-in">
              <div className="mx-auto h-16 w-16 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-full">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Muito obrigado por colaborar!</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto font-medium">
                  A sua resposta foi guardada com sucesso! Ajudou a elevar a representação do seu município nas métricas do Estudo de Viabilidade Nacional do OLO Fintel.
                </p>
              </div>

              <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/15 flex items-center justify-between">
                <div className="flex items-center space-x-2.5 text-left">
                  <Award size={20} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-black">Bónus de Participação</span>
                    <span className="block text-xs font-bold text-indigo-950 dark:text-indigo-300">Organização Pré-Configurada!</span>
                  </div>
                </div>
                <span className="bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded">Ativo</span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    // Let the parent handle navigating directly into the application with preselected state
                    onCancel();
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition glow-indigo cursor-pointer"
                >
                  Voltar para o Web Site
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
