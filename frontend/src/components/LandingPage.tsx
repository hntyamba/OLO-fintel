import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
  ArrowRight,
  BarChart3,
  Coins,
  FileText,
  Landmark,
  LayoutDashboard,
  LineChart,
  PieChart,
  PlusCircle,
  ShieldCheck,
  ShoppingCart,
  Target,
  TrendingUp,
  Users,
  Zap,
  AlertTriangle,
  FilePlus,
  Receipt,
  FileOutput,
} from 'lucide-react';

interface LandingPageProps {}

const FINANCIALS = {
  receitas: 32540000,
  despesas: 18230000,
  saldo: 14310000,
};

const FUNDING_SCORE = 72;

const BAR_DATA = [
  { label: 'Receitas', value: 32540000, color: 'bg-[#0DA676]' },
  { label: 'Despesas', value: 18230000, color: 'bg-[#DC2626]' },
  { label: 'Saldo', value: 14310000, color: 'bg-[#D4A843]' },
];

const ALERTS = [
  { text: 'Estoque Baixo', icon: AlertTriangle, color: 'text-amber-500' },
  { text: 'Fatura a Vencer', icon: Receipt, color: 'text-red-500' },
  { text: 'Vacina Pendente', icon: FileOutput, color: 'text-blue-500' },
];

const QUICK_ACTIONS = [
  { label: 'Nova Operação', icon: PlusCircle },
  { label: 'Registrar Despesa', icon: Receipt },
  { label: 'Nova Venda', icon: ShoppingCart },
  { label: 'Novo Documento', icon: FilePlus },
  { label: 'Relatório Rápido', icon: FileText },
];

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: 'Gestão Operacional',
    description:
      'Registe vendas, colheitas e inventário num só lugar. Controlo total das operações diárias da sua cooperativa.',
  },
  {
    icon: Coins,
    title: 'Finanças & Crédito',
    description:
      'Balanço automatizado, fluxo de caixa em tempo real e pontuação de crédito para aceder a financiamento bancário.',
  },
  {
    icon: Zap,
    title: 'IA & Recomendações',
    description:
      'Motor inteligente que analisa os seus dados e recomenda optimizações, previsões de mercado e alertas críticos.',
  },
];

const STATS = [
  { value: '500+', label: 'Cooperativas' },
  { value: '12', label: 'Províncias' },
  { value: '45K+', label: 'Operações' },
  { value: '98%', label: 'Satisfação' },
];

function formatKz(value: number): string {
  return value.toLocaleString('pt-AO') + ' Kz';
}

export default function LandingPage({}: LandingPageProps) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F4F6F8] font-sans text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0D1B2A] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0DA67610_0%,transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 lg:pt-36 lg:pb-28 relative z-10">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0DA676]/15 text-[#17C39B] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0DA676] animate-pulse" />
              Fintech para o Angola Real
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Inteligência. Organização. Oportunidades.
            </h1>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl">
              Transforme dados desorganizados em credibilidade financeira. O OLO Fintel ajuda cooperativas e PMEs angolanas a construírem a sua identidade económica para acederem a crédito e crescimento.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigate('/auth/login')}
                className="px-7 py-3.5 bg-[#0DA676] hover:bg-[#0B8F64] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#0DA676]/25 flex items-center gap-2 cursor-pointer"
              >
                Comece Agora
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/survey')}
                className="px-7 py-3.5 border border-white/20 hover:border-white/40 text-white rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                Participar no Inquérito
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MOCK DASHBOARD PREVIEW */}
      <section className="relative -mt-12 px-6 pb-20 z-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Dashboard chrome */}
            <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs font-mono text-gray-400">OLO Fintel Dashboard</span>
            </div>

            <div className="p-5 lg:p-8 space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-[#F4F6F8] p-5 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Receitas</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-[#0DA676] mt-1 font-mono">
                    {formatKz(FINANCIALS.receitas)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F4F6F8] p-5 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Despesas</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-red-500 mt-1 font-mono">
                    {formatKz(FINANCIALS.despesas)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F4F6F8] p-5 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Saldo</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-[#D4A843] mt-1 font-mono">
                    {formatKz(FINANCIALS.saldo)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Funding Score Gauge + Bar Chart */}
                <div className="lg:col-span-2 rounded-2xl bg-[#F4F6F8] p-6 border border-gray-100 space-y-6">
                  {/* Circular Gauge */}
                  <div className="flex items-center gap-8">
                    <div className="relative w-28 h-28 shrink-0">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="45"
                          stroke="#E5E7EB"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="45"
                          stroke="#0DA676"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={282}
                          strokeDashoffset={282 - (282 * FUNDING_SCORE) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-extrabold text-gray-900 font-mono">{FUNDING_SCORE}</span>
                        <span className="text-[9px] font-semibold text-gray-400 uppercase">de 100</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Funding Score</p>
                      <p className="text-sm font-bold text-gray-700 mt-1">
                        Perfil financeiro forte para candidatura a crédito bancário.
                      </p>
                    </div>
                  </div>

                  {/* Bar Chart Mock */}
                  <div className="flex items-end gap-4 h-32">
                    {BAR_DATA.map((bar) => {
                      const maxVal = FINANCIALS.receitas;
                      const pct = Math.round((bar.value / maxVal) * 100);
                      return (
                        <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[10px] font-mono font-bold text-gray-500">
                            {formatKz(bar.value)}
                          </span>
                          <div
                            className={cn('w-full rounded-t-lg transition-all', bar.color)}
                            style={{ height: `${pct}%` }}
                          />
                          <span className="text-[10px] font-semibold text-gray-400">{bar.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sidebar: Alerts + Quick Actions */}
                <div className="space-y-4">
                  {/* Alerts */}
                  <div className="rounded-2xl bg-[#F4F6F8] p-5 border border-gray-100 space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Alertas</p>
                    {ALERTS.map((alert) => (
                      <div key={alert.text} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <alert.icon size={16} className={alert.color} />
                        {alert.text}
                      </div>
                    ))}
                  </div>

                  {/* Quick Shortcuts */}
                  <div className="rounded-2xl bg-[#F4F6F8] p-5 border border-gray-100 space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Atalhos</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_ACTIONS.map((action) => (
                        <span
                          key={action.label}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-600"
                        >
                          <action.icon size={12} className="text-[#0DA676]" />
                          {action.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#0DA676] uppercase tracking-widest">
              Funcionalidades
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Tudo o que precisa numa plataforma
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Gestão operacional, finanças e inteligência artificial integradas para cooperativas e PMEs angolanas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow space-y-5"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0DA676]/10 flex items-center justify-center">
                  <feature.icon size={24} className="text-[#0DA676]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS / TESTIMONIALS */}
      <section className="py-20 px-6 bg-[#0D1B2A] text-white">
        <div className="max-w-7xl mx-auto text-center space-y-14">
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#17C39B] uppercase tracking-widest">
              Impacto Nacional
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Números que falam por si
            </h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
              Cooperativas e PMEs em toda Angola já estão a usar o OLO Fintel para transformar dados operacionais em credibilidade.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#17C39B] font-mono block">
                  {stat.value}
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="py-20 px-6 bg-[#F4F6F8]">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Pronto para começar?
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
            Crie a sua conta gratuita e comece a construir a identidade económica da sua cooperativa hoje.
          </p>
          <button
            onClick={() => navigate('/auth/login')}
            className="px-8 py-4 bg-[#0DA676] hover:bg-[#0B8F64] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#0DA676]/25 inline-flex items-center gap-2 cursor-pointer"
          >
            Comece Agora
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
