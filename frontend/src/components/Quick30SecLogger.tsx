import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Timer, 
  CheckCircle2, 
  TrendingUp, 
  ShoppingBag, 
  Sprout, 
  Receipt, 
  Clock, 
  Sparkles, 
  X, 
  ArrowRight,
  Flame,
  ShieldCheck,
  RotateCcw,
  PlusCircle,
  FileText
} from 'lucide-react';
import { useAuth } from './AuthContext.js';

interface Quick30SecLoggerProps {
  onRecordAdded?: () => void;
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
}

export default function Quick30SecLogger({ 
  onRecordAdded, 
  isOpenAsModal = false, 
  onCloseModal 
}: Quick30SecLoggerProps) {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  // Selected Type: Venda (Sale), Colheita (Harvest), Despesa (Expense)
  const [activeTab, setActiveTab] = useState<'venda' | 'colheita' | 'despesa'>('venda');

  // Form Fields
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('sacos');
  const [amount, setAmount] = useState('');
  const [clientOrSupplier, setClientOrSupplier] = useState('');
  const [notes, setNotes] = useState('');

  // Timer state for "Regra dos 30 Segundos"
  const [timerActive, setTimerActive] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Success state after submission
  const [lastSubmittedTime, setLastSubmittedTime] = useState<number | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Today's Stats
  const [todayCount, setTodayCount] = useState(0);

  // Preset 1-tap shortcuts
  const presets = {
    venda: [
      { name: 'Milho Amarelo (10 Sacos)', qty: '10', unit: 'sacos', amount: '50000', client: 'Mercado Local' },
      { name: 'Batata Renascença (5 Sacos)', qty: '5', unit: 'sacos', amount: '35000', client: 'Armazém Huambo' },
      { name: 'Carapau Fresco (100 kg)', qty: '100', unit: 'kg', amount: '120000', client: 'Peixaria Namibe' },
      { name: 'Leite Fresco (20 Litros)', qty: '20', unit: 'litros', amount: '18000', client: 'Cooperativa Lacticínios' },
      { name: 'Cabo de Tomate (10 Caixas)', qty: '10', unit: 'caixas', amount: '45000', client: 'Comprador Atacado' }
    ],
    colheita: [
      { name: 'Milho (Talhão Alfa)', qty: '50', unit: 'sacos', amount: '0', client: 'Talhão A1' },
      { name: 'Batata Doce (Talhão Beta)', qty: '30', unit: 'sacos', amount: '0', client: 'Talhão B2' },
      { name: 'Banana Pão (20 Cachos)', qty: '20', unit: 'cachos', amount: '0', client: 'Pomar Sul' },
      { name: 'Mandioca Doce (40 Sacos)', qty: '40', unit: 'sacos', amount: '0', client: 'Horta Central' },
      { name: 'Captura Marítima (500 kg)', qty: '500', unit: 'kg', amount: '0', client: 'Barco Espadarte' }
    ],
    despesa: [
      { name: 'Combustível / Gerador', qty: '1', unit: 'litro', amount: '15000', client: 'Posto Sonangol' },
      { name: 'Mão de Obra Diária', qty: '1', unit: 'serviço', amount: '5000', client: 'Trabalhadores Campo' },
      { name: 'Adubo NPK 12-24-12 (2 Sacos)', qty: '2', unit: 'sacos', amount: '42000', client: 'Agro-Loja' },
      { name: 'Frete / Transporte', qty: '1', unit: 'viagem', amount: '25000', client: 'Transportador Local' },
      { name: 'Sacaria / Embalagens', qty: '100', unit: 'unidades', amount: '12000', client: 'Fornecedor Sacos' }
    ]
  };

  // Start stopwatch on component mount or reset
  useEffect(() => {
    startTimer();
    loadTodayCount();
    return () => stopTimer();
  }, [activeTab]);

  const startTimer = () => {
    stopTimer();
    setElapsedSeconds(0);
    setTimerActive(true);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => +(prev + 0.1).toFixed(1));
    }, 100);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
  };

  const loadTodayCount = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const recSaved = localStorage.getItem(`mirawelch-fin-receitas-${userId}`) || localStorage.getItem(`olo-fintel-fin-receitas-${userId}`);
    const desSaved = localStorage.getItem(`mirawelch-fin-despesas-${userId}`) || localStorage.getItem(`olo-fintel-fin-despesas-${userId}`);
    const colSaved = localStorage.getItem(`mirawelch-op-colheitas-${userId}`) || localStorage.getItem(`olo-fintel-op-colheitas-${userId}`);

    let count = 0;
    if (recSaved) JSON.parse(recSaved).forEach((r: any) => { if (r.data === todayStr) count++; });
    if (desSaved) JSON.parse(desSaved).forEach((d: any) => { if (d.data === todayStr) count++; });
    if (colSaved) JSON.parse(colSaved).forEach((c: any) => { if (c.data === todayStr) count++; });

    setTodayCount(count);
  };

  // Apply a preset shortcut instantly
  const handleApplyPreset = (preset: { name: string; qty: string; unit: string; amount: string; client: string }) => {
    setItem(preset.name);
    setQuantity(preset.qty);
    setUnit(preset.unit);
    setAmount(preset.amount);
    setClientOrSupplier(preset.client);
  };

  // One-click instant submit (Submit in <30 seconds)
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const recordTime = elapsedSeconds;
    stopTimer();

    const todayStr = new Date().toISOString().split('T')[0];
    const id = `quick-${Date.now()}`;
    const formattedTitle = item || (activeTab === 'venda' ? 'Venda Rápida' : activeTab === 'colheita' ? 'Colheita Rápida' : 'Despesa Rápida');
    const numAmount = parseFloat(amount || '0');
    const numQty = parseFloat(quantity || '1');

    if (activeTab === 'venda') {
      // 1. Save to Financial Revenues
      const key = `mirawelch-fin-receitas-${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || localStorage.getItem(`olo-fintel-fin-receitas-${userId}`) || '[]');
      const newRec = {
        id,
        data: todayStr,
        descricao: `${formattedTitle} (${numQty} ${unit})`,
        cliente: clientOrSupplier || 'Cliente Local',
        valor: numAmount,
        categoria: 'Vendas Agrícolas / Produtos',
        conta: 'Caixa Geral',
        status: 'Pago',
        observacoes: `Registo Rápido (<30s). Tempo: ${recordTime}s. ${notes}`,
        docRef: `VD-${Math.floor(1000 + Math.random() * 9000)}`
      };
      const updated = [newRec, ...existing];
      localStorage.setItem(key, JSON.stringify(updated));
      localStorage.setItem(`olo-fintel-fin-receitas-${userId}`, JSON.stringify(updated));

      // 2. Also record in CRM deals
      const crmKey = `mirawelch-crm-oportunidades-${userId}`;
      const existingCrm = JSON.parse(localStorage.getItem(crmKey) || localStorage.getItem(`olo-fintel-crm-oportunidades-${userId}`) || '[]');
      const newCrm = {
        id: `op-${Date.now()}`,
        titulo: formattedTitle,
        cliente: clientOrSupplier || 'Cliente Balcão',
        valor: numAmount,
        estagio: 'Cliente',
        probabilidade: 100,
        fechoPrevisto: todayStr,
        notas: `Registo instantâneo em ${recordTime}s.`
      };
      localStorage.setItem(crmKey, JSON.stringify([newCrm, ...existingCrm]));

    } else if (activeTab === 'despesa') {
      // Save to Financial Expenses
      const key = `mirawelch-fin-despesas-${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || localStorage.getItem(`olo-fintel-fin-despesas-${userId}`) || '[]');
      const newDes = {
        id,
        data: todayStr,
        descricao: `${formattedTitle} (${numQty} ${unit})`,
        fornecedor: clientOrSupplier || 'Fornecedor Geral',
        valor: numAmount,
        categoria: 'Custos Operacionais',
        conta: 'Caixa Geral',
        status: 'Pago',
        observacoes: `Registo Rápido (<30s). Tempo: ${recordTime}s. ${notes}`,
        docRef: `DSP-${Math.floor(1000 + Math.random() * 9000)}`
      };
      const updated = [newDes, ...existing];
      localStorage.setItem(key, JSON.stringify(updated));
      localStorage.setItem(`olo-fintel-fin-despesas-${userId}`, JSON.stringify(updated));

    } else if (activeTab === 'colheita') {
      // Save to Harvests/Production
      const key = `mirawelch-op-colheitas-${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || localStorage.getItem(`olo-fintel-op-colheitas-${userId}`) || '[]');
      const newCol = {
        id,
        data: todayStr,
        talhao: clientOrSupplier || 'Talhão Geral',
        produto: formattedTitle,
        quantidade: numQty,
        perdas: 0,
        observacoes: `Colheita rápida (<30s). Tempo: ${recordTime}s. ${notes}`,
        syncStatus: 'SYNCED',
        photo: '',
        gps: '-14.9782, 13.4321'
      };
      const updated = [newCol, ...existing];
      localStorage.setItem(key, JSON.stringify(updated));
      localStorage.setItem(`olo-fintel-op-colheitas-${userId}`, JSON.stringify(updated));
    }

    setLastSubmittedTime(recordTime);
    setShowSuccessToast(true);
    setTodayCount(prev => prev + 1);

    // Reset Form
    setItem('');
    setAmount('');
    setNotes('');

    if (onRecordAdded) onRecordAdded();

    // Hide toast & restart timer after 3 seconds
    setTimeout(() => {
      setShowSuccessToast(false);
      startTimer();
    }, 3500);
  };

  const containerContent = (
    <div className="bg-white dark:bg-[#15151D] border border-emerald-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden transition-all">
      
      {/* Decorative Speed Graphic */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-gray-100 dark:border-gray-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/20 shrink-0">
            <Zap size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white leading-none">
                Registo em &lt;30 Segundos
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center gap-1">
                <Flame size={11} /> Regra dos 30s
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Mais rápido que o caderno de papel. Zero formulários burocráticos.
            </p>
          </div>
        </div>

        {/* Stopwatch Realtime Display */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#0E0E14] p-2 px-3.5 rounded-2xl border border-gray-200/70 dark:border-gray-800">
          <div className="flex items-center gap-1.5">
            <Timer size={16} className={elapsedSeconds > 30 ? 'text-amber-500' : 'text-emerald-500 animate-spin'} style={{ animationDuration: '4s' }} />
            <span className="text-xs font-mono font-black text-gray-900 dark:text-white">
              {elapsedSeconds.toFixed(1)}s
            </span>
          </div>

          <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />

          <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
            {elapsedSeconds < 30 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck size={12} /> Desafio OK
              </span>
            ) : (
              <span className="text-amber-500 font-bold">Tempo Elevado</span>
            )}
          </span>

          {isOpenAsModal && onCloseModal && (
            <button 
              onClick={onCloseModal} 
              className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ml-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs Selection: Venda, Colheita, Despesa */}
      <div className="grid grid-cols-3 gap-2 my-4 p-1 bg-gray-100 dark:bg-[#0E0E14] rounded-2xl">
        <button
          onClick={() => setActiveTab('venda')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'venda'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <ShoppingBag size={14} /> Venda Rápida
        </button>

        <button
          onClick={() => setActiveTab('colheita')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'colheita'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Sprout size={14} /> Colheita
        </button>

        <button
          onClick={() => setActiveTab('despesa')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'despesa'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Receipt size={14} /> Despesa
        </button>
      </div>

      {/* 1-Tap Presets (Pre-filled chips for speed) */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          <span>Atalhos de 1 Clique (Carregar Dados)</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-mono">Preenchimento Instantâneo</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets[activeTab].map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-[#1A1A24] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-gray-200/80 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 text-[11px] font-medium text-gray-700 dark:text-gray-300 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Zap size={11} className="text-amber-500 shrink-0" />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Quick Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
              {activeTab === 'venda' ? 'Produto / Artigo Vendido' : activeTab === 'colheita' ? 'Cultura / Produto Colhido' : 'Descrição da Despesa'}
            </label>
            <input
              type="text"
              required
              placeholder={activeTab === 'venda' ? 'Ex: Milho, Batata, Peixe...' : activeTab === 'colheita' ? 'Ex: Milho, Mandioca...' : 'Ex: Gasóleo, Adubo, Salários...'}
              value={item}
              onChange={e => setItem(e.target.value)}
              className="w-full h-10 px-3 text-xs font-semibold bg-gray-50 dark:bg-[#0E0E14] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:border-emerald-500 transition-colors text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
              {activeTab === 'venda' ? 'Cliente ou Local' : activeTab === 'colheita' ? 'Talhão / Barco / Origem' : 'Fornecedor ou Posto'}
            </label>
            <input
              type="text"
              placeholder={activeTab === 'venda' ? 'Ex: Comprador Local, Mercado' : activeTab === 'colheita' ? 'Ex: Talhão A1, Pomar' : 'Ex: Sonangol, Loja Agro'}
              value={clientOrSupplier}
              onChange={e => setClientOrSupplier(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-gray-50 dark:bg-[#0E0E14] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:border-emerald-500 transition-colors text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Qtd.</label>
            <input
              type="number"
              min="0.1"
              step="any"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="w-full h-10 px-3 text-xs font-bold font-mono bg-gray-50 dark:bg-[#0E0E14] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:border-emerald-500 transition-colors text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Unidade</label>
            <select
              value={unit}
              onChange={e => setUnit(e.target.value)}
              className="w-full h-10 px-2 text-xs bg-gray-50 dark:bg-[#0E0E14] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:border-emerald-500 transition-colors text-gray-900 dark:text-white"
            >
              <option value="sacos">Sacos</option>
              <option value="kg">Quilos (kg)</option>
              <option value="ton">Toneladas</option>
              <option value="caixas">Caixas</option>
              <option value="litros">Litros</option>
              <option value="cachos">Cachos</option>
              <option value="unidades">Unid.</option>
            </select>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
              {activeTab === 'colheita' ? 'Valor Estimado (Opcional)' : 'Valor Total (Kz)'}
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full h-10 pl-3 pr-10 text-xs font-black font-mono bg-gray-50 dark:bg-[#0E0E14] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:border-emerald-500 transition-colors text-gray-900 dark:text-white"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-400">Kz</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full h-12 mt-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-xs font-black tracking-wide shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <Zap size={16} className="text-amber-300" />
          <span>HOMOLOGAR REGISTO EM MENOS DE 30s</span>
          <ArrowRight size={15} />
        </button>
      </form>

      {/* Success Banner */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-3.5 bg-emerald-500 text-white rounded-2xl flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={20} className="text-amber-300 shrink-0" />
              <div>
                <h4 className="text-xs font-black leading-tight">
                  Registo Gravado em {lastSubmittedTime}s! 🎉
                </h4>
                <p className="text-[10px] text-emerald-100 mt-0.5">
                  Poupaste ~3 minutos em relação ao registo no caderno de papel.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-700/60 px-2 py-1 rounded-lg">
              100% Offline
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Productivity Comparison Bar */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex flex-wrap justify-between items-center text-[10px] text-gray-500 dark:text-gray-400 gap-2">
        <div className="flex items-center gap-1.5 font-semibold">
          <Clock size={12} className="text-emerald-500" />
          <span>Registos Hoje: <strong className="text-gray-900 dark:text-white">{todayCount}</strong></span>
        </div>

        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-amber-500" />
          <span>Tempo Economizado Hoje: <strong className="text-emerald-600 dark:text-emerald-400">~{todayCount * 3} min</strong></span>
        </div>

        <div className="flex items-center gap-1 text-gray-400 font-mono">
          <ShieldCheck size={12} className="text-teal-500" />
          <span>Cache Local Ativa</span>
        </div>
      </div>

    </div>
  );

  if (isOpenAsModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-xl"
        >
          {containerContent}
        </motion.div>
      </div>
    );
  }

  return containerContent;
}
