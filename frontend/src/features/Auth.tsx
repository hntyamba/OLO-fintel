import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Briefcase, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { Role, Sector } from "../types";

interface AuthProps {
  onBack: () => void;
  onAuthSuccess: (user: { name: string; email: string; role: Role; sector: Sector; organizationName: string }) => void;
}

export default function Auth({ onBack, onAuthSuccess }: AuthProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>(Role.Owner);
  const [sector, setSector] = useState<Sector>(Sector.Agriculture);
  const [organizationName, setOrganizationName] = useState("");

  const roleDescriptions: Record<Role, { title: string; desc: string }> = {
    [Role.Owner]: { title: "Dono / Sócio", desc: "Acesso total a finanças, operações, crm e score de fomento." },
    [Role.Manager]: { title: "Gestor Operacional", desc: "Acompanhamento diário das operações, crm e conselhos de fomento." },
    [Role.FinancialOfficer]: { title: "Diretor Financeiro", desc: "Gestão do fluxo de caixa, carregamento de faturas e score de fomento." },
    [Role.Analyst]: { title: "Analista de Crédito / Auditor", desc: "Auditoria e verificação documental para investidores e bancos parceiros." },
    [Role.Consultant]: { title: "Consultor Técnico OLO", desc: "Supervisão operacional e apoio no preenchimento de fomento." },
    [Role.Member]: { title: "Produtor Associado", desc: "Registo simplificado de tarefas diárias e consulta de manuais." },
    [Role.Jury]: { title: "Júri LISPA / Investidor", desc: "Mapeamento em tempo real da tração nacional de PMEs angolanas." }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!email || !password) {
      setError("Por favor, preencha o email e a palavra-passe.");
      setLoading(false);
      return;
    }

    if (mode === "register" && (!name || !role)) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload = mode === "login" 
      ? { email, password }
      : { name, email, password, role, sector, organizationName };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(data.message || "Sessão iniciada com sucesso!");
        setTimeout(() => {
          onAuthSuccess(data.user);
        }, 800);
      } else {
        setError(data.message || "Ocorreu um erro na autenticação.");
      }
    } catch (err) {
      setError("Erro de ligação ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050508] flex flex-col justify-center items-center p-4 transition-colors relative">
      
      {/* Decorative Blur Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-xl relative z-10 space-y-6">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Voltar ao Início</span>
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-rose-500 items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/10 mb-2">
            OLO
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Portal <span className="text-indigo-600 dark:text-indigo-400">OLO Fintel</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 max-w-md mx-auto">
            Organização económica, controlo de tesouraria diário e preparação para financiamento SADC.
          </p>
        </div>

        {/* Card Form container */}
        <motion.div 
          layout
          className="bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 transition-colors"
        >
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/5">
            <button
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccess(null);
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-white dark:bg-indigo-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Iniciar Sessão
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError(null);
                setSuccess(null);
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-white dark:bg-indigo-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Criar Conta Grátis
            </button>
          </div>

          {/* Messages */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-rose-500/5 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold flex items-center space-x-2"
            >
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center space-x-2"
            >
              <CheckCircle2 size={14} className="shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Registration specific fields */}
            {mode === "register" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                {/* Full name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300">Nome Completo</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: António Fula"
                      className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
                      required={mode === "register"}
                    />
                  </div>
                </div>

                {/* Role / User Type selector */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300">Tipo de Utilizador / Função SADC</label>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="relative">
                      <Briefcase size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
                      >
                        {Object.values(Role).map((r) => (
                          <option key={r} value={r} className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">
                            {roleDescriptions[r].title}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Role help text helper */}
                    <div className="p-3 bg-indigo-50/60 dark:bg-white/[0.01] rounded-xl border border-indigo-100/50 dark:border-white/5 text-[10px] text-gray-500 dark:text-zinc-400 leading-relaxed">
                      <strong>Permissões:</strong> {roleDescriptions[role].desc}
                    </div>
                  </div>
                </div>

                {/* Organization and Sector fields - Hidden for Jury role */}
                {role !== Role.Jury && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Organization Name */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300">Nome da Cooperativa / PME</label>
                      <div className="relative">
                        <Building2 size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          placeholder="Ex: Cooperativa Geral do Huambo"
                          className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Sector selection */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300">Setor Económico Principal</label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value as Sector)}
                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                      >
                        <option value={Sector.Agriculture} className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Agronegócio / Agricultura 🌾</option>
                        <option value={Sector.Livestock} className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Pecuária / Criação de Animais 🐂</option>
                        <option value={Sector.Fisheries} className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Pesca & Frotas Marítimas ⚓</option>
                        <option value={Sector.Commerce} className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Comércio de Retalho & Logística 🏪</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Common fields (Email & Password) */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300">Endereço de Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu-email@dominio.com"
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300">Palavra-passe</label>
                {mode === "login" && (
                  <button type="button" className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Esqueceu a palavra-passe?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold text-gray-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Quick Helper for Test Login */}
            {mode === "login" && (
              <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 space-y-1">
                <span className="block text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Acesso de Teste do Júri & Donos</span>
                <p className="text-[10px] text-gray-500 dark:text-zinc-400 leading-normal">
                  • <strong>Júri LISPA:</strong> email <code className="bg-slate-100 dark:bg-black/30 px-1 py-0.5 rounded">juri@lispa.ao</code> / pass <code className="bg-slate-100 dark:bg-black/30 px-1 py-0.5 rounded">123</code><br />
                  • <strong>Dono Cooperativa:</strong> email <code className="bg-slate-100 dark:bg-black/30 px-1 py-0.5 rounded">owner@olo.ao</code> / pass <code className="bg-slate-100 dark:bg-black/30 px-1 py-0.5 rounded">123</code>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 glow-indigo cursor-pointer"
            >
              <span>{loading ? "A processar..." : mode === "login" ? "Iniciar Sessão" : "Criar Conta Grátis"}</span>
              {!loading && <ArrowRight size={16} />}
            </button>

          </form>
        </motion.div>

        {/* Security / Compliance note */}
        <p className="text-[10px] text-center text-gray-400 dark:text-zinc-500 leading-relaxed max-w-sm mx-auto">
          Ao registar-se ou iniciar sessão, o utilizador aceita os Termos de Serviço SADC e as Políticas de Proteção de Dados Financeiros OLO Fintel.
        </p>

      </div>
    </div>
  );
}
