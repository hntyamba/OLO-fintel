/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  FileText, 
  Percent, 
  ShieldAlert, 
  Clock, 
  PiggyBank, 
  Scale, 
  Receipt, 
  Plus, 
  Trash2, 
  Sliders, 
  Download, 
  Send, 
  Bell, 
  ChevronRight,
  Activity,
  Award,
  Layers,
  ArrowRightLeft
} from 'lucide-react';

interface FinancePageProps {
  userId: string;
  userRole: string;
  organizationId?: string | null;
  onRefresh?: () => void;
  key?: string;
}

export function FinancePage({ userId, userRole }: FinancePageProps) {
  // --- SUB-SECTIONS NAVIGATION ---
  const [activeTab, setActiveTab] = useState<'receitas_despesas' | 'fluxo_caixa' | 'rentabilidade' | 'planeamento' | 'ar_ap' | 'ativos' | 'relatorios'>('receitas_despesas');

  // --- 1. RECEITAS STATE ---
  const [receitas, setReceitas] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-fin-receitas-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'rec-1', titulo: 'Venda de Milho Branco (Kambeta)', valor: 1450000, categoria: 'Venda de Produção', fonte: 'Cooperativa Agrícola do Huambo', data: '2026-07-10', nota: 'Contrato de fornecimento padrão' },
      { id: 'rec-2', titulo: 'Fornecimento de Hortaliças frescas', valor: 350000, categoria: 'Venda de Produção', fonte: 'Rede de Supermercados Angolanos', data: '2026-07-15', nota: 'Entrega semanal efetuada' },
      { id: 'rec-3', titulo: 'Subvenção Governamental de Combustível', valor: 600000, categoria: 'Subvenções', fonte: 'Ministério da Agricultura e Pescas', data: '2026-07-18', nota: 'Reembolso de gasóleo agrícola' }
    ];
  });

  // --- 2. DESPESAS STATE ---
  const [despesas, setDespesas] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-fin-despesas-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'des-1', titulo: 'Fertilizante NPK 12-24-12', valor: 420000, centroCusto: 'Insumos', categoria: 'Fertilização', data: '2026-07-02', nota: 'Compra de 25 sacos' },
      { id: 'des-2', titulo: 'Salários dos Trabalhadores Temporários', valor: 320000, centroCusto: 'Pessoal', categoria: 'Mão de Obra', data: '2026-07-05', nota: 'Colheita intercalar de batata' },
      { id: 'des-3', titulo: 'Reparação do Trator Massey', valor: 180000, centroCusto: 'Equipamentos', categoria: 'Manutenção', data: '2026-07-12', nota: 'Substituição de filtros e óleo hidráulico' },
      { id: 'des-4', titulo: 'Gasóleo para Gerador e Trator', valor: 150000, centroCusto: 'Operações', categoria: 'Combustível', data: '2026-07-14', nota: 'Depósito de reserva' }
    ];
  });

  // --- 5. PLANEAMENTO / BUDGETING STATE ---
  const [budgets, setBudgets] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-fin-budgets-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'bdg-1', centroCusto: 'Insumos', limite: 800000 },
      { id: 'bdg-2', centroCusto: 'Pessoal', limite: 500000 },
      { id: 'bdg-3', centroCusto: 'Equipamentos', limite: 300000 },
      { id: 'bdg-4', centroCusto: 'Operações', limite: 250000 }
    ];
  });

  // --- 6. CONTAS A RECEBER (AR) STATE ---
  const [contasAReceber, setContasAReceber] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-fin-ar-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'ar-1', fatura: 'FAT-2026-001', cliente: 'Hotel Império', valor: 540000, vencimento: '2026-07-28', estado: 'Pendente', limiteCredito: 1000000 },
      { id: 'ar-2', fatura: 'FAT-2026-002', cliente: 'Supermercado Kero', valor: 1200000, vencimento: '2026-08-05', estado: 'Pendente', limiteCredito: 3000000 },
      { id: 'ar-3', fatura: 'FAT-2026-003', cliente: 'Restaurante Marginal', valor: 180000, vencimento: '2026-07-12', estado: 'Vencido', limiteCredito: 500000 }
    ];
  });

  // --- 7. CONTAS A PAGAR (AP) STATE ---
  const [contasAPagar, setContasAPagar] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-fin-ap-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'ap-1', fatura: 'PROV-456', fornecedor: 'AngoAlimentos Lda', valor: 650000, vencimento: '2026-07-27', estado: 'Pendente' },
      { id: 'ap-2', fatura: 'ELEC-901', fornecedor: 'ENDE Angola', valor: 45000, vencimento: '2026-07-25', estado: 'Pendente' },
      { id: 'ap-3', fatura: 'MAN-772', fornecedor: 'Mecânica Express S.A.', valor: 120000, vencimento: '2026-07-18', estado: 'Agendado' }
    ];
  });

  // --- 8. GESTÃO DE ATIVOS STATE ---
  const [ativos, setAtivos] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-fin-ativos-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'at-1', nome: 'Trator Agrícola Massey Ferguson 275', precoCompra: 12500000, dataCompra: '2024-01-15', vidaUtil: 10, localizacao: 'Talhão Alfa', estado: 'Excelente' },
      { id: 'at-2', nome: 'Bomba de Água Solar 5kW', precoCompra: 2400000, dataCompra: '2025-03-10', vidaUtil: 5, localizacao: 'Zona de Captação Norte', estado: 'Operacional' },
      { id: 'at-3', nome: 'Silo de Armazenamento de Grãos 50T', precoCompra: 8500000, dataCompra: '2023-08-20', vidaUtil: 15, localizacao: 'Sede Central', estado: 'Operacional' }
    ];
  });

  // --- PERSISTENCE EFFECT ---
  useEffect(() => { localStorage.setItem(`olo-fintel-fin-receitas-${userId}`, JSON.stringify(receitas)); }, [receitas, userId]);
  useEffect(() => { localStorage.setItem(`olo-fintel-fin-despesas-${userId}`, JSON.stringify(despesas)); }, [despesas, userId]);
  useEffect(() => { localStorage.setItem(`olo-fintel-fin-budgets-${userId}`, JSON.stringify(budgets)); }, [budgets, userId]);
  useEffect(() => { localStorage.setItem(`olo-fintel-fin-ar-${userId}`, JSON.stringify(contasAReceber)); }, [contasAReceber, userId]);
  useEffect(() => { localStorage.setItem(`olo-fintel-fin-ap-${userId}`, JSON.stringify(contasAPagar)); }, [contasAPagar, userId]);
  useEffect(() => { localStorage.setItem(`olo-fintel-fin-ativos-${userId}`, JSON.stringify(ativos)); }, [ativos, userId]);

  // --- TEMPORARY FORM STATES ---
  const [recForm, setRecForm] = useState({ titulo: '', valor: '', categoria: 'Venda de Produção', fonte: '', data: new Date().toISOString().split('T')[0], nota: '' });
  const [desForm, setDesForm] = useState({ titulo: '', valor: '', centroCusto: 'Insumos', categoria: '', data: new Date().toISOString().split('T')[0], nota: '' });
  const [arForm, setArForm] = useState({ fatura: '', cliente: '', valor: '', vencimento: new Date().toISOString().split('T')[0], limiteCredito: '1000000' });
  const [apForm, setApForm] = useState({ fatura: '', fornecedor: '', valor: '', vencimento: new Date().toISOString().split('T')[0] });
  const [ativoForm, setAtivoForm] = useState({ nome: '', precoCompra: '', dataCompra: new Date().toISOString().split('T')[0], vidaUtil: '10', localizacao: 'Sede', estado: 'Operacional' });
  const [budgetForm, setBudgetForm] = useState({ centroCusto: 'Insumos', limite: '' });

  // Cash Flow Forecasting inputs
  const [forecastMonths, setForecastMonths] = useState<number>(3);
  const [expectedGrowth, setExpectedGrowth] = useState<number>(5); // %
  const [fixedCostsEstimate, setFixedCostsEstimate] = useState<number>(450000); // Kz monthly

  // Notifications or status
  const [financeAlert, setFinanceAlert] = useState<string | null>(null);

  // Helper calculates
  const totalReceitasValue = receitas.reduce((sum, r) => sum + parseFloat(r.valor || 0), 0);
  const totalDespesasValue = despesas.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
  const netProfitValue = totalReceitasValue - totalDespesasValue;
  const currentCashFlow = netProfitValue; // Simplified cash balance difference

  // --- SUBMISSION HANDLERS ---
  const handleAddReceita = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recForm.titulo || !recForm.valor) return;
    const newRec = {
      id: `rec-${Date.now()}`,
      titulo: recForm.titulo,
      valor: parseFloat(recForm.valor),
      categoria: recForm.categoria,
      fonte: recForm.fonte || 'Geral',
      data: recForm.data,
      nota: recForm.nota
    };
    setReceitas([newRec, ...receitas]);
    setRecForm({ titulo: '', valor: '', categoria: 'Venda de Produção', fonte: '', data: new Date().toISOString().split('T')[0], nota: '' });
    triggerAlert('Receita registada com sucesso!');
  };

  const handleAddDespesa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desForm.titulo || !desForm.valor) return;
    const newDes = {
      id: `des-${Date.now()}`,
      titulo: desForm.titulo,
      valor: parseFloat(desForm.valor),
      centroCusto: desForm.centroCusto,
      categoria: desForm.categoria || 'Operacional',
      data: desForm.data,
      nota: desForm.nota
    };

    // Check budget limit
    const targetBudget = budgets.find(b => b.centroCusto === desForm.centroCusto);
    if (targetBudget) {
      const currentSpent = despesas
        .filter(d => d.centroCusto === desForm.centroCusto)
        .reduce((sum, d) => sum + d.valor, 0);
      if (currentSpent + newDes.valor > targetBudget.limite) {
        triggerAlert(`Aviso: O centro de custo [${desForm.centroCusto}] ultrapassou o orçamento planeado de ${targetBudget.limite.toLocaleString()} Kz!`);
      }
    }

    setDespesas([newDes, ...despesas]);
    setDesForm({ titulo: '', valor: '', centroCusto: 'Insumos', categoria: '', data: new Date().toISOString().split('T')[0], nota: '' });
    triggerAlert('Despesa registada com sucesso!');
  };

  const handleAddAR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arForm.fatura || !arForm.cliente || !arForm.valor) return;
    const newAR = {
      id: `ar-${Date.now()}`,
      fatura: arForm.fatura,
      cliente: arForm.cliente,
      valor: parseFloat(arForm.valor),
      vencimento: arForm.vencimento,
      estado: 'Pendente',
      limiteCredito: parseFloat(arForm.limiteCredito || '1000000')
    };
    setContasAReceber([newAR, ...contasAReceber]);
    setArForm({ fatura: '', cliente: '', valor: '', vencimento: new Date().toISOString().split('T')[0], limiteCredito: '1000000' });
    triggerAlert('Fatura a receber registada!');
  };

  const handleAddAP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apForm.fatura || !apForm.fornecedor || !apForm.valor) return;
    const newAP = {
      id: `ap-${Date.now()}`,
      fatura: apForm.fatura,
      fornecedor: apForm.fornecedor,
      valor: parseFloat(apForm.valor),
      vencimento: apForm.vencimento,
      estado: 'Pendente'
    };
    setContasAPagar([newAP, ...contasAPagar]);
    setApForm({ fatura: '', fornecedor: '', valor: '', vencimento: new Date().toISOString().split('T')[0] });
    triggerAlert('Fatura a pagar registada!');
  };

  const handleAddAtivo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ativoForm.nome || !ativoForm.precoCompra) return;
    const newAtivo = {
      id: `at-${Date.now()}`,
      nome: ativoForm.nome,
      precoCompra: parseFloat(ativoForm.precoCompra),
      dataCompra: ativoForm.dataCompra,
      vidaUtil: parseInt(ativoForm.vidaUtil || '10'),
      localizacao: ativoForm.localizacao,
      estado: ativoForm.estado
    };
    setAtivos([newAtivo, ...ativos]);
    setAtivoForm({ nome: '', precoCompra: '', dataCompra: new Date().toISOString().split('T')[0], vidaUtil: '10', localizacao: 'Sede', estado: 'Operacional' });
    triggerAlert('Ativo registado no património!');
  };

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetForm.limite) return;
    const limitVal = parseFloat(budgetForm.limite);
    
    setBudgets(prev => {
      const exists = prev.find(b => b.centroCusto === budgetForm.centroCusto);
      if (exists) {
        return prev.map(b => b.centroCusto === budgetForm.centroCusto ? { ...b, limite: limitVal } : b);
      } else {
        return [...prev, { id: `bdg-${Date.now()}`, centroCusto: budgetForm.centroCusto, limite: limitVal }];
      }
    });
    setBudgetForm({ centroCusto: 'Insumos', limite: '' });
    triggerAlert('Orçamento atualizado com sucesso!');
  };

  // Trigger alert
  const triggerAlert = (msg: string) => {
    setFinanceAlert(msg);
    setTimeout(() => {
      setFinanceAlert(null);
    }, 4500);
  };

  const handleDeleteItem = (listType: 'receitas' | 'despesas' | 'ar' | 'ap' | 'ativos', id: string) => {
    if (listType === 'receitas') setReceitas(receitas.filter(x => x.id !== id));
    if (listType === 'despesas') setDespesas(despesas.filter(x => x.id !== id));
    if (listType === 'ar') setContasAReceber(contasAReceber.filter(x => x.id !== id));
    if (listType === 'ap') setContasAPagar(contasAPagar.filter(x => x.id !== id));
    if (listType === 'ativos') setAtivos(ativos.filter(x => x.id !== id));
    triggerAlert('Registo excluído!');
  };

  // --- CREDIT ACTION / COLLECTION SIMULATION ---
  const handleSendReminder = (invoice: any) => {
    alert(`Mensagem de Cobrança enviada com sucesso para o cliente: ${invoice.cliente}!\n\nCanal: Notificação Interna e SMS/WhatsApp integrado.\nFatura: ${invoice.fatura}\nValor em dívida: ${invoice.valor.toLocaleString()} Kz\nVencimento: ${invoice.vencimento}`);
  };

  const handleMarkAsPaidAR = (id: string) => {
    const item = contasAReceber.find(x => x.id === id);
    if (!item) return;
    // Add to revenue
    const newRec = {
      id: `rec-${Date.now()}`,
      titulo: `Recebimento Fatura ${item.fatura} - ${item.cliente}`,
      valor: item.valor,
      categoria: 'Recebimento de Faturas',
      fonte: item.cliente,
      data: new Date().toISOString().split('T')[0],
      nota: 'Fatura liquidada pelo cliente'
    };
    setReceitas([newRec, ...receitas]);
    setContasAReceber(contasAReceber.map(x => x.id === id ? { ...x, estado: 'Pago' } : x));
    triggerAlert('Fatura marcada como PAGA! O saldo de receitas foi atualizado.');
  };

  const handlePayInvoiceAP = (id: string) => {
    const item = contasAPagar.find(x => x.id === id);
    if (!item) return;
    // Add to expense
    const newDes = {
      id: `des-${Date.now()}`,
      titulo: `Pagamento Fatura ${item.fatura} - ${item.fornecedor}`,
      valor: item.valor,
      centroCusto: 'Operações',
      categoria: 'Fornecedores',
      data: new Date().toISOString().split('T')[0],
      nota: 'Liquidação de dívida comercial'
    };
    setDespesas([newDes, ...despesas]);
    setContasAPagar(contasAPagar.map(x => x.id === id ? { ...x, estado: 'Pago' } : x));
    triggerAlert('Fatura marcada como PAGA! O saldo de despesas foi deduzido.');
  };

  // --- RENTABILIDADE CALCULATIONS ---
  // Rentabilidade por centro de custo/categoria
  const costCentersStats = ['Insumos', 'Pessoal', 'Equipamentos', 'Operações', 'Outros'].map(cc => {
    const totalCC = despesas.filter(d => d.centroCusto === cc).reduce((sum, d) => sum + d.valor, 0);
    const percentage = totalDespesasValue > 0 ? (totalCC / totalDespesasValue) * 100 : 0;
    return { name: cc, total: totalCC, pct: percentage.toFixed(1) };
  });

  const revenuesStats = ['Venda de Produção', 'Subvenções', 'Recebimento de Faturas', 'Outros'].map(cat => {
    const totalCat = receitas.filter(r => r.categoria === cat).reduce((sum, r) => sum + r.valor, 0);
    const percentage = totalReceitasValue > 0 ? (totalCat / totalReceitasValue) * 100 : 0;
    return { name: cat, total: totalCat, pct: percentage.toFixed(1) };
  });

  // EBITDA e Margem Líquida
  const grossProfit = totalReceitasValue; 
  const operatingExpenses = totalDespesasValue; // All treated as OPEX here
  const ebitda = grossProfit - operatingExpenses;
  const netMarginPct = totalReceitasValue > 0 ? (ebitda / totalReceitasValue) * 100 : 0;

  // --- GESTÃO DE ATIVOS: DEPRECIAÇÃO ---
  // Straight-line depreciation calculation based on years bought
  const calculateDepreciation = (ativo: any) => {
    const purchaseYear = new Date(ativo.dataCompra).getFullYear();
    const currentYear = 2026; // System simulated time is 2026
    const yearsElapsed = Math.max(0, currentYear - purchaseYear);
    const annualDepreciationRate = 1 / ativo.vidaUtil;
    const accumulatedDepreciationPct = Math.min(1, yearsElapsed * annualDepreciationRate);
    const accumulatedDepreciationVal = ativo.precoCompra * accumulatedDepreciationPct;
    const currentBookValue = ativo.precoCompra - accumulatedDepreciationVal;
    return {
      accumulatedPct: (accumulatedDepreciationPct * 100).toFixed(0),
      accumulatedVal: accumulatedDepreciationVal,
      currentBookValue,
      annualDepreciation: ativo.precoCompra * annualDepreciationRate
    };
  };

  // --- LIQUIDITY FORECASTS ---
  const generateLiquidityForecast = () => {
    let projectedCash = netProfitValue; // Initial Cash
    const forecastList = [];
    const monthlyRevenueAverage = receitas.length > 0 ? totalReceitasValue / receitas.length : 1000000;
    const growthFactor = 1 + (expectedGrowth / 100);

    for (let i = 1; i <= forecastMonths; i++) {
      // revenue grows i times
      const estRevenue = monthlyRevenueAverage * Math.pow(growthFactor, i);
      const estExpense = fixedCostsEstimate;
      const netMonthly = estRevenue - estExpense;
      projectedCash += netMonthly;

      forecastList.push({
        month: `Mês +${i}`,
        estimatedRevenue: estRevenue,
        estimatedExpense: estExpense,
        projectedBalance: projectedCash
      });
    }
    return forecastList;
  };

  const forecasts = generateLiquidityForecast();

  return (
    <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm space-y-6" id="complete-financial-module">
      
      {/* HEADER WITH CONTEXTUAL BANNER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-gray-100 dark:border-gray-800 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Coins size={12} />
              Módulo Gestão Financeira Integrada
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[9px] font-bold">
              Multi-Setor
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mt-2">
            Painel Financeiro Corporativo Completo
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Gestão integrada de orçamento, depreciação, receitas, DRE em tempo real e fluxos de contas.
          </p>
        </div>

        {/* Rapid Actions */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#252532] border border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {/* FLOAT ALERT BOX */}
      {financeAlert && (
        <div className="p-3 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse shadow-lg transition-all">
          <Award size={16} />
          <span>{financeAlert}</span>
        </div>
      )}

      {/* KEY KPIS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Total Receitas</span>
          <p className="text-xl lg:text-2xl font-black text-emerald-500 mt-2">
            {totalReceitasValue.toLocaleString()} Kz
          </p>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2 font-mono">
            <TrendingUp size={12} className="text-emerald-500" />
            <span>{receitas.length} registos ativos</span>
          </div>
        </div>

        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Controlo de Despesas</span>
          <p className="text-xl lg:text-2xl font-black text-red-500 mt-2">
            {totalDespesasValue.toLocaleString()} Kz
          </p>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2 font-mono">
            <TrendingDown size={12} className="text-red-500" />
            <span>{despesas.length} faturas de custo</span>
          </div>
        </div>

        <div className="p-4 bg-brand-iris/5 border border-brand-iris/10 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-brand-iris uppercase tracking-widest">Margem EBITDA</span>
          <p className={`text-xl lg:text-2xl font-black mt-2 ${ebitda >= 0 ? 'text-brand-iris' : 'text-red-500'}`}>
            {ebitda.toLocaleString()} Kz
          </p>
          <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-2 font-mono">
            <Percent size={12} className="text-brand-iris" />
            <span>Margem Líquida: <strong>{netMarginPct.toFixed(1)}%</strong></span>
          </div>
        </div>

        <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Crédito & Liquidez</span>
          <p className="text-xl lg:text-2xl font-black text-blue-500 mt-2">
            {contasAReceber.filter(x => x.estado === 'Pendente').reduce((sum, x) => sum + x.valor, 0).toLocaleString()} Kz
          </p>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2 font-mono">
            <Clock size={12} className="text-blue-500" />
            <span>Pendentes em carteira</span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION BAR */}
      <div className="flex flex-wrap border-b border-gray-100 dark:border-gray-800 pb-2 gap-1.5">
        <button
          onClick={() => setActiveTab('receitas_despesas')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'receitas_despesas' 
              ? 'bg-brand-iris text-white shadow-md' 
              : 'hover:bg-gray-50 dark:hover:bg-[#20202B] text-gray-600 dark:text-gray-400'
          }`}
        >
          <Receipt size={14} />
          <span>Receitas & Despesas</span>
        </button>

        <button
          onClick={() => setActiveTab('fluxo_caixa')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'fluxo_caixa' 
              ? 'bg-brand-iris text-white shadow-md' 
              : 'hover:bg-gray-50 dark:hover:bg-[#20202B] text-gray-600 dark:text-gray-400'
          }`}
        >
          <ArrowRightLeft size={14} />
          <span>Fluxo de Caixa</span>
        </button>

        <button
          onClick={() => setActiveTab('rentabilidade')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'rentabilidade' 
              ? 'bg-brand-iris text-white shadow-md' 
              : 'hover:bg-gray-50 dark:hover:bg-[#20202B] text-gray-600 dark:text-gray-400'
          }`}
        >
          <Percent size={14} />
          <span>Rentabilidade</span>
        </button>

        <button
          onClick={() => setActiveTab('planeamento')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'planeamento' 
              ? 'bg-brand-iris text-white shadow-md' 
              : 'hover:bg-gray-50 dark:hover:bg-[#20202B] text-gray-600 dark:text-gray-400'
          }`}
        >
          <Sliders size={14} />
          <span>Planeamento & Budgets</span>
        </button>

        <button
          onClick={() => setActiveTab('ar_ap')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'ar_ap' 
              ? 'bg-brand-iris text-white shadow-md' 
              : 'hover:bg-gray-50 dark:hover:bg-[#20202B] text-gray-600 dark:text-gray-400'
          }`}
        >
          <Clock size={14} />
          <span>AR (Receber) / AP (Pagar)</span>
        </button>

        <button
          onClick={() => setActiveTab('ativos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'ativos' 
              ? 'bg-brand-iris text-white shadow-md' 
              : 'hover:bg-gray-50 dark:hover:bg-[#20202B] text-gray-600 dark:text-gray-400'
          }`}
        >
          <Layers size={14} />
          <span>Gestão de Ativos</span>
        </button>

        <button
          onClick={() => setActiveTab('relatorios')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'relatorios' 
              ? 'bg-brand-iris text-white shadow-md' 
              : 'hover:bg-gray-50 dark:hover:bg-[#20202B] text-gray-600 dark:text-gray-400'
          }`}
        >
          <FileText size={14} />
          <span>Relatórios & DRE</span>
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="space-y-6">

        {/* TAB 1: RECEITAS & DESPESAS REGISTRATION */}
        {activeTab === 'receitas_despesas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Column */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Add Revenue Form */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#1E1E26] border border-gray-100 dark:border-gray-800">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-4">
                  <TrendingUp size={14} />
                  Registar Nova Receita (Entrada)
                </h3>
                <form onSubmit={handleAddReceita} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Título da Transação</label>
                    <input 
                      type="text" 
                      value={recForm.titulo}
                      onChange={e => setRecForm({...recForm, titulo: e.target.value})}
                      placeholder="Ex: Venda lote Carapau Fresco" 
                      className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Valor (Kz)</label>
                      <input 
                        type="number" 
                        value={recForm.valor}
                        onChange={e => setRecForm({...recForm, valor: e.target.value})}
                        placeholder="Ex: 850000" 
                        className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Categoria</label>
                      <select 
                        value={recForm.categoria}
                        onChange={e => setRecForm({...recForm, categoria: e.target.value})}
                        className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none focus:border-emerald-500"
                      >
                        <option value="Venda de Produção">Venda de Produção</option>
                        <option value="Subvenções">Subvenções / Apoios</option>
                        <option value="Recebimento de Faturas">Recebimento de Faturas</option>
                        <option value="Outros">Outros Rendimentos</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Fonte / Cliente</label>
                      <input 
                        type="text" 
                        value={recForm.fonte}
                        onChange={e => setRecForm({...recForm, fonte: e.target.value})}
                        placeholder="Ex: Armazém Central" 
                        className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Data</label>
                      <input 
                        type="date" 
                        value={recForm.data}
                        onChange={e => setRecForm({...recForm, data: e.target.value})}
                        className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Observações</label>
                    <input 
                      type="text" 
                      value={recForm.nota}
                      onChange={e => setRecForm({...recForm, nota: e.target.value})}
                      placeholder="Notas adicionais" 
                      className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Adicionar Entrada</span>
                  </button>
                </form>
              </div>

              {/* Add Expense Form */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#1E1E26] border border-gray-100 dark:border-gray-800">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-red-500 flex items-center gap-1.5 mb-4">
                  <TrendingDown size={14} />
                  Registar Nova Despesa (Saída)
                </h3>
                <form onSubmit={handleAddDespesa} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Título do Custo</label>
                    <input 
                      type="text" 
                      value={desForm.titulo}
                      onChange={e => setDesForm({...desForm, titulo: e.target.value})}
                      placeholder="Ex: Ração para bovinos de engorda" 
                      className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Valor (Kz)</label>
                      <input 
                        type="number" 
                        value={desForm.valor}
                        onChange={e => setDesForm({...desForm, valor: e.target.value})}
                        placeholder="Ex: 150000" 
                        className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Centro de Custo</label>
                      <select 
                        value={desForm.centroCusto}
                        onChange={e => setDesForm({...desForm, centroCusto: e.target.value})}
                        className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none focus:border-red-500"
                      >
                        <option value="Insumos">Insumos (Fertilizantes, Sementes, Ração)</option>
                        <option value="Pessoal">Pessoal (Salários, Seguros)</option>
                        <option value="Equipamentos">Equipamentos & Frota (Peças, Mecânica)</option>
                        <option value="Operações">Operações (Combustível, Água, Luz)</option>
                        <option value="Outros">Outros Custos Gerais</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Sub-categoria</label>
                      <input 
                        type="text" 
                        value={desForm.categoria}
                        onChange={e => setDesForm({...desForm, categoria: e.target.value})}
                        placeholder="Ex: Veterinária" 
                        className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Data</label>
                      <input 
                        type="date" 
                        value={desForm.data}
                        onChange={e => setDesForm({...desForm, data: e.target.value})}
                        className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Notas adicionais</label>
                    <input 
                      type="text" 
                      value={desForm.nota}
                      onChange={e => setDesForm({...desForm, nota: e.target.value})}
                      placeholder="Observações do custo" 
                      className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Adicionar Despesa</span>
                  </button>
                </form>
              </div>

            </div>

            {/* List Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Transactions list */}
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Activity size={16} className="text-brand-iris" />
                    Registo Cronológico de Lançamentos
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono">Simulado 2026</span>
                </div>

                <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                  
                  {/* Combines both sorted by date */}
                  {[
                    ...receitas.map(r => ({ ...r, entryType: 'INCOMING' })),
                    ...despesas.map(d => ({ ...d, entryType: 'OUTGOING' }))
                  ]
                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                    .map((item: any) => (
                      <div 
                        key={item.id}
                        className={`p-3.5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-2 transition-all ${
                          item.entryType === 'INCOMING' 
                            ? 'bg-emerald-500/5 border-emerald-500/10' 
                            : 'bg-red-500/5 border-red-500/10'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                              item.entryType === 'INCOMING' 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            }`}>
                              {item.entryType === 'INCOMING' ? 'Receita' : 'Despesa'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                              <Calendar size={10} />
                              {item.data}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">{item.titulo}</h4>
                          <p className="text-[10px] text-gray-400 font-mono">
                            {item.entryType === 'INCOMING' ? `Fonte: ${item.fonte}` : `Centro de Custo: ${item.centroCusto}`}
                            {item.nota && ` • ${item.nota}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-center">
                          <span className={`text-sm font-black ${
                            item.entryType === 'INCOMING' ? 'text-emerald-500' : 'text-red-500'
                          }`}>
                            {item.entryType === 'INCOMING' ? '+' : '-'} {item.valor.toLocaleString()} Kz
                          </span>
                          <button 
                            onClick={() => handleDeleteItem(item.entryType === 'INCOMING' ? 'receitas' : 'despesas', item.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Apagar registo"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                  ))}

                  {receitas.length === 0 && despesas.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-xs">Nenhuma receita ou despesa registada ainda.</p>
                    </div>
                  )}

                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: CONTINUOUS CASH FLOW & FORECAST */}
        {activeTab === 'fluxo_caixa' && (
          <div className="space-y-6">
            
            {/* Cash Flow Ledger Analysis */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#181822]">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-indigo-500" size={18} />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Demonstrativo Contínuo de Fluxo de Caixa</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Monitorização do saldo acumulado gerado a partir do resultado de transações e movimentações.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-[#1E1E26] border border-gray-100 dark:border-gray-800 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Entradas Acumuladas</span>
                  <p className="text-lg font-black text-emerald-500 mt-1">{totalReceitasValue.toLocaleString()} Kz</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#1E1E26] border border-gray-100 dark:border-gray-800 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Saídas Acumuladas</span>
                  <p className="text-lg font-black text-red-500 mt-1">{totalDespesasValue.toLocaleString()} Kz</p>
                </div>
                <div className="p-4 bg-brand-iris/10 border border-brand-iris/20 rounded-xl">
                  <span className="text-[10px] text-brand-iris font-bold uppercase">Fluxo Líquido Período</span>
                  <p className="text-lg font-black text-brand-iris mt-1">{currentCashFlow.toLocaleString()} Kz</p>
                </div>
              </div>
            </div>

            {/* PREVISÃO DE LIQUIDEZ (Liquidity Forecasting Simulator) */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <PiggyBank className="text-emerald-500" size={18} />
                    Simulador & Previsão de Liquidez a Curto-Médio Prazo
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Projete a liquidez futura da sua empresa com base nas médias históricas e parâmetros editáveis de mercado.
                  </p>
                </div>
                
                {/* Simulator Inputs */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400">Projetar para:</span>
                    <select 
                      value={forecastMonths} 
                      onChange={e => setForecastMonths(parseInt(e.target.value))}
                      className="px-2 py-1 bg-gray-50 dark:bg-[#20202A] text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                      <option value={3}>3 Meses</option>
                      <option value={6}>6 Meses</option>
                      <option value={12}>12 Meses</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400">Crescimento Rec. %:</span>
                    <input 
                      type="number"
                      value={expectedGrowth}
                      onChange={e => setExpectedGrowth(parseFloat(e.target.value) || 0)}
                      className="w-12 px-2 py-1 bg-gray-50 dark:bg-[#20202A] text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-800"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400">Despesa Fixa Estimada:</span>
                    <input 
                      type="number"
                      value={fixedCostsEstimate}
                      onChange={e => setFixedCostsEstimate(parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 bg-gray-50 dark:bg-[#20202A] text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Simulation Table Output */}
              <div className="ramp-table-container p-1">
                <table className="ramp-table">
                  <thead>
                    <tr className="text-gray-400">
                      <th className="py-2.5 font-bold uppercase tracking-wider">Período Projetado</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider text-right">Est. Receita Mensal</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider text-right">Est. Custos Totais</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider text-right">Saldo Líquido Projetado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {forecasts.map((f, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-[#1E1E28]/50">
                        <td className="py-3 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <ChevronRight size={14} className="text-emerald-500" />
                          {f.month}
                        </td>
                        <td className="py-3 text-right font-semibold text-emerald-500">
                          +{f.estimatedRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})} Kz
                        </td>
                        <td className="py-3 text-right font-semibold text-red-500">
                          -{f.estimatedExpense.toLocaleString(undefined, {maximumFractionDigits: 0})} Kz
                        </td>
                        <td className="py-3 text-right font-black text-gray-900 dark:text-white">
                          <span className={f.projectedBalance >= 0 ? 'text-brand-iris' : 'text-red-500'}>
                            {f.projectedBalance.toLocaleString(undefined, {maximumFractionDigits: 0})} Kz
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: RENTABILIDADE */}
        {activeTab === 'rentabilidade' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Margins breakdown */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-1.5">
                <Percent size={16} className="text-brand-iris" />
                Análise Margens de Rentabilidade
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span>Margem Operacional Bruta (Faturamento)</span>
                    <span className="text-brand-iris">100%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-iris" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span>EBITDA Operacional (Maturidade Financeira)</span>
                    <span className="text-brand-purple">{netMarginPct.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-purple animate-pulse" style={{ width: `${Math.max(0, Math.min(100, netMarginPct))}%` }} />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Indicador de Cobertura Financeira</span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    A sua empresa retém cerca de <strong className="text-gray-900 dark:text-white">{netMarginPct.toFixed(1)}%</strong> de cada Kwanza faturado como lucro líquido operacional de exploração, permitindo liquidez suficiente para expandir ou requerer novas linhas de financiamento OLO.
                  </p>
                </div>
              </div>
            </div>

            {/* Distribution analysis */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-1.5">
                <Scale size={16} className="text-emerald-500" />
                Custos por Centros de Custo (Análise de Desperdício)
              </h3>

              <div className="space-y-3">
                {costCentersStats.map((cc, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-700 dark:text-gray-300">{cc.name}</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{cc.total.toLocaleString()} Kz ({cc.pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          cc.name === 'Insumos' ? 'bg-amber-500' :
                          cc.name === 'Pessoal' ? 'bg-red-500' :
                          cc.name === 'Equipamentos' ? 'bg-indigo-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${cc.pct}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PLANEAMENTO / BUDGETING */}
        {activeTab === 'planeamento' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Configure Limits Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 bg-gray-50 dark:bg-[#1E1E26] rounded-2xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5 mb-4">
                  <Sliders size={14} />
                  Definir Teto Orçamental (Budget)
                </h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Defina o limite máximo recomendado de gastos para evitar fugas de capital no seu centro de custos.
                </p>
                <form onSubmit={handleUpdateBudget} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Centro de Custo</label>
                    <select 
                      value={budgetForm.centroCusto}
                      onChange={e => setBudgetForm({...budgetForm, centroCusto: e.target.value})}
                      className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    >
                      <option value="Insumos">Insumos (Fertilizantes, Sementes, Ração)</option>
                      <option value="Pessoal">Pessoal (Salários, Seguros)</option>
                      <option value="Equipamentos">Equipamentos & Frota (Peças, Mecânica)</option>
                      <option value="Operações">Operações (Combustível, Água, Luz)</option>
                      <option value="Outros">Outros Custos Gerais</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Limite Máximo Mensal (Kz)</label>
                    <input 
                      type="number" 
                      value={budgetForm.limite}
                      onChange={e => setBudgetForm({...budgetForm, limite: e.target.value})}
                      placeholder="Ex: 500000" 
                      className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none focus:border-brand-iris"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-2.5 bg-brand-iris hover:bg-brand-iris-hover text-white font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Atualizar Teto</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Budget status bars */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                  Estado Real vs. Orçamentado (Acompanhamento)
                </h3>

                <div className="space-y-4">
                  {budgets.map(b => {
                    const spent = despesas
                      .filter(d => d.centroCusto === b.centroCusto)
                      .reduce((sum, d) => sum + d.valor, 0);
                    const pctSpent = b.limite > 0 ? (spent / b.limite) * 100 : 0;
                    const isOver = spent > b.limite;

                    return (
                      <div key={b.id} className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-gray-900 dark:text-white">{b.centroCusto}</span>
                          <span className={isOver ? 'text-red-500' : 'text-gray-400'}>
                            {spent.toLocaleString()} / {b.limite.toLocaleString()} Kz
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              isOver ? 'bg-red-500' : pctSpent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, pctSpent)}%` }} 
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-gray-400 font-mono">Consumido: {pctSpent.toFixed(0)}%</span>
                          {isOver && (
                            <span className="text-red-500 font-bold flex items-center gap-1">
                              <ShieldAlert size={12} />
                              Excedido em {(spent - b.limite).toLocaleString()} Kz
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: ACCOUNTS RECEIVABLE & PAYABLE (AR/AP) */}
        {activeTab === 'ar_ap' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Contas a Receber (AR) */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="text-emerald-500" size={16} />
                  Contas a Receber (AR) - Faturas de Clientes
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Ativas</span>
              </div>

              {/* Add AR form trigger toggler */}
              <form onSubmit={handleAddAR} className="p-3 bg-gray-50 dark:bg-[#1E1E26] rounded-xl grid grid-cols-1 md:grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Nº Fatura (Ex: FAT-098)" 
                  value={arForm.fatura}
                  onChange={e => setArForm({...arForm, fatura: e.target.value})}
                  className="px-2.5 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/20 outline-none" 
                />
                <input 
                  type="text" 
                  placeholder="Cliente (Ex: Kero)" 
                  value={arForm.cliente}
                  onChange={e => setArForm({...arForm, cliente: e.target.value})}
                  className="px-2.5 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/20 outline-none" 
                />
                <input 
                  type="number" 
                  placeholder="Valor Kz" 
                  value={arForm.valor}
                  onChange={e => setArForm({...arForm, valor: e.target.value})}
                  className="px-2.5 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/20 outline-none" 
                />
                <input 
                  type="date" 
                  value={arForm.vencimento}
                  onChange={e => setArForm({...arForm, vencimento: e.target.value})}
                  className="px-2.5 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/20 outline-none" 
                />
                <div className="md:col-span-2">
                  <button type="submit" className="w-full py-1.5 bg-emerald-500 text-white rounded text-xs font-bold hover:bg-emerald-600 transition-all cursor-pointer">
                    Adicionar Fatura Cliente
                  </button>
                </div>
              </form>

              <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
                {contasAReceber.map(ar => (
                  <div key={ar.id} className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                    ar.estado === 'Pago' ? 'opacity-60 bg-gray-50 border-gray-200 dark:bg-transparent dark:border-gray-800' : 'bg-white dark:bg-[#1C1C24] border-gray-200 dark:border-gray-800'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-900 dark:text-white font-mono">{ar.fatura}</span>
                        <span className={`text-[8px] px-1.5 py-0.2 rounded font-extrabold ${
                          ar.estado === 'Pago' ? 'bg-green-100 text-green-800' : ar.estado === 'Vencido' ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ar.estado}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-700 dark:text-gray-300 mt-1">{ar.cliente}</p>
                      <p className="text-[10px] text-gray-400">Vence em: {ar.vencimento} • Limite Crédito: {ar.limiteCredito?.toLocaleString()} Kz</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white pr-2">
                        {ar.valor.toLocaleString()} Kz
                      </span>
                      {ar.estado !== 'Pago' && (
                        <>
                          <button 
                            onClick={() => handleSendReminder(ar)}
                            className="p-1 text-indigo-500 hover:bg-indigo-500/10 rounded cursor-pointer"
                            title="Cobrança Inteligente"
                          >
                            <Bell size={13} />
                          </button>
                          <button 
                            onClick={() => handleMarkAsPaidAR(ar.id)}
                            className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded hover:bg-emerald-600 cursor-pointer"
                          >
                            Receber
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDeleteItem('ar', ar.id)}
                        className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contas a Pagar (AP) */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <TrendingDown className="text-red-500" size={16} />
                  Contas a Pagar (AP) - Compromissos Fornecedores
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">Pendentes</span>
              </div>

              {/* Add AP form trigger */}
              <form onSubmit={handleAddAP} className="p-3 bg-gray-50 dark:bg-[#1E1E26] rounded-xl grid grid-cols-1 md:grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Fatura Provedor" 
                  value={apForm.fatura}
                  onChange={e => setApForm({...apForm, fatura: e.target.value})}
                  className="px-2.5 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/20 outline-none" 
                />
                <input 
                  type="text" 
                  placeholder="Fornecedor (Ex: ENDE)" 
                  value={apForm.fornecedor}
                  onChange={e => setApForm({...apForm, fornecedor: e.target.value})}
                  className="px-2.5 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/20 outline-none" 
                />
                <input 
                  type="number" 
                  placeholder="Valor Kz" 
                  value={apForm.valor}
                  onChange={e => setApForm({...apForm, valor: e.target.value})}
                  className="px-2.5 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/20 outline-none" 
                />
                <input 
                  type="date" 
                  value={apForm.vencimento}
                  onChange={e => setApForm({...apForm, vencimento: e.target.value})}
                  className="px-2.5 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/20 outline-none" 
                />
                <div className="md:col-span-2">
                  <button type="submit" className="w-full py-1.5 bg-red-500 text-white rounded text-xs font-bold hover:bg-red-600 transition-all cursor-pointer">
                    Adicionar Fatura Fornecedor
                  </button>
                </div>
              </form>

              <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
                {contasAPagar.map(ap => (
                  <div key={ap.id} className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                    ap.estado === 'Pago' ? 'opacity-60 bg-gray-50 border-gray-200 dark:bg-transparent dark:border-gray-800' : 'bg-white dark:bg-[#1C1C24] border-gray-200 dark:border-gray-800'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-900 dark:text-white font-mono">{ap.fatura}</span>
                        <span className={`text-[8px] px-1.5 py-0.2 rounded font-extrabold ${
                          ap.estado === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ap.estado}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-700 dark:text-gray-300 mt-1">{ap.fornecedor}</p>
                      <p className="text-[10px] text-gray-400 font-mono">Vencimento: {ap.vencimento}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white pr-2">
                        -{ap.valor.toLocaleString()} Kz
                      </span>
                      {ap.estado !== 'Pago' && (
                        <button 
                          onClick={() => handlePayInvoiceAP(ap.id)}
                          className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded hover:bg-red-600 cursor-pointer"
                        >
                          Pagar
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteItem('ap', ap.id)}
                        className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: FIXED ASSETS MANAGEMENT (GESTÃO DE ATIVOS) */}
        {activeTab === 'ativos' && (
          <div className="space-y-6">
            
            {/* Asset registry list */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Layers size={18} className="text-brand-iris" />
                    Património & Gestão de Ativos Imobilizados
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Registe frotas, equipamentos pesados e bombas de água para calcular a sua depreciação contabilística e monitorizar a sua movimentação física.
                  </p>
                </div>
              </div>

              {/* Add Asset Form inline collapsible */}
              <form onSubmit={handleAddAtivo} className="p-4 bg-gray-50 dark:bg-[#1E1E26] rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Nome do Ativo</label>
                  <input 
                    type="text" 
                    value={ativoForm.nome}
                    onChange={e => setAtivoForm({...ativoForm, nome: e.target.value})}
                    placeholder="Ex: Câmara Fria Estacionária" 
                    className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Preço de Aquisição (Kz)</label>
                  <input 
                    type="number" 
                    value={ativoForm.precoCompra}
                    onChange={e => setAtivoForm({...ativoForm, precoCompra: e.target.value})}
                    placeholder="Ex: 5000000" 
                    className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Data de Compra</label>
                  <input 
                    type="date" 
                    value={ativoForm.dataCompra}
                    onChange={e => setAtivoForm({...ativoForm, dataCompra: e.target.value})}
                    className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Vida Útil Estimada (Anos)</label>
                  <input 
                    type="number" 
                    value={ativoForm.vidaUtil}
                    onChange={e => setAtivoForm({...ativoForm, vidaUtil: e.target.value})}
                    placeholder="10" 
                    className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Localização / Movimentação</label>
                  <input 
                    type="text" 
                    value={ativoForm.localizacao}
                    onChange={e => setAtivoForm({...ativoForm, localizacao: e.target.value})}
                    placeholder="Ex: Talhão Central" 
                    className="w-full h-10 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                  />
                </div>
                <div className="md:col-span-3">
                  <button type="submit" className="w-full py-2 bg-brand-iris text-white hover:bg-brand-iris-hover rounded-xl text-xs font-bold transition-all cursor-pointer">
                    Integrar Ativo Imobilizado
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {ativos.map(ativo => {
                  const dep = calculateDepreciation(ativo);
                  return (
                    <div key={ativo.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3 bg-white dark:bg-[#1C1C24]">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                        <div>
                          <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase">{ativo.nome}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Adquirido em: <strong className="font-mono">{ativo.dataCompra}</strong> • Vida Útil: <strong className="font-mono">{ativo.vidaUtil} anos</strong> • Local: <strong className="text-brand-purple">{ativo.localizacao}</strong>
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-extrabold text-gray-900 dark:text-white">Valor Aquisição: {ativo.precoCompra.toLocaleString()} Kz</span>
                          <button 
                            onClick={() => handleDeleteItem('ativos', ativo.id)}
                            className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Depreciation status */}
                      <div className="space-y-1.5 pt-2 border-t border-gray-50 dark:border-gray-900">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-400 uppercase font-black">Depreciação Acumulada Contabilizada (Simulado 2026)</span>
                          <span className="text-amber-500 font-bold">{dep.accumulatedPct}% depreciado</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full" 
                            style={{ width: `${dep.accumulatedPct}%` }} 
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                          <span>Depreciação Anual Recorrente: {dep.annualDepreciation.toLocaleString()} Kz / ano</span>
                          <span>Valor Contabilístico Residual: <strong className="text-brand-iris">{dep.currentBookValue.toLocaleString()} Kz</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 7: DETAILED FINANCIAL REPORTS & DRE */}
        {activeTab === 'relatorios' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* INCOME STATEMENT (DRE) */}
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1C1C24] space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase flex items-center gap-1.5">
                    <FileText className="text-brand-iris" size={16} />
                    DRE - Demonstração do Resultado de Exercício
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono">Acumulado Simulado 2026</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700 dark:text-gray-300">(=) Receita Bruta de Exploração</span>
                    <span className="font-bold font-mono text-emerald-500">+{totalReceitasValue.toLocaleString()} Kz</span>
                  </div>

                  <div className="flex justify-between items-center pl-4 text-gray-500">
                    <span>(-) Custos de Insumos Diretos</span>
                    <span className="font-mono">-{despesas.filter(d => d.centroCusto === 'Insumos').reduce((sum, d) => sum + d.valor, 0).toLocaleString()} Kz</span>
                  </div>

                  <div className="flex justify-between items-center pl-4 text-gray-500">
                    <span>(-) Gastos com Pessoal</span>
                    <span className="font-mono">-{despesas.filter(d => d.centroCusto === 'Pessoal').reduce((sum, d) => sum + d.valor, 0).toLocaleString()} Kz</span>
                  </div>

                  <div className="flex justify-between items-center pl-4 text-gray-500">
                    <span>(-) Custos com Frota / Equipamentos</span>
                    <span className="font-mono">-{despesas.filter(d => d.centroCusto === 'Equipamentos').reduce((sum, d) => sum + d.valor, 0).toLocaleString()} Kz</span>
                  </div>

                  <div className="flex justify-between items-center pl-4 text-gray-500 border-b border-gray-50 dark:border-gray-900 pb-2">
                    <span>(-) Custos de Operações de Apoio</span>
                    <span className="font-mono">-{despesas.filter(d => d.centroCusto === 'Operações').reduce((sum, d) => sum + d.valor, 0).toLocaleString()} Kz</span>
                  </div>

                  <div className="flex justify-between items-center font-bold bg-gray-50 dark:bg-black/20 p-2.5 rounded-lg">
                    <span>(=) EBITDA OPERACIONAL</span>
                    <span className={`font-mono ${ebitda >= 0 ? 'text-brand-purple' : 'text-red-500'}`}>{ebitda.toLocaleString()} Kz</span>
                  </div>

                  <div className="flex justify-between items-center pl-4 text-gray-500">
                    <span>(-) Depreciação de Ativos Imobilizados</span>
                    <span className="font-mono">
                      -{ativos.reduce((sum, at) => sum + calculateDepreciation(at).annualDepreciation, 0).toLocaleString()} Kz
                    </span>
                  </div>

                  <div className="flex justify-between items-center font-black text-sm bg-brand-iris/10 text-brand-iris p-3 rounded-xl border border-brand-iris/20 mt-4">
                    <span>(=) RESULTADO LÍQUIDO DO PERÍODO</span>
                    <span className="font-mono">
                      {(ebitda - ativos.reduce((sum, at) => sum + calculateDepreciation(at).annualDepreciation, 0)).toLocaleString()} Kz
                    </span>
                  </div>
                </div>
              </div>

              {/* SIMPLIFIED BALANCE SHEET (BALANÇO PATRIMONIAL) */}
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1C1C24] space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase flex items-center gap-1.5">
                    <Scale className="text-emerald-500" size={16} />
                    Balanço Patrimonial Sintético
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono">Equilíbrio Ativo vs Passivo</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs divide-x divide-gray-100 dark:divide-gray-800">
                  
                  {/* ACTIVO column */}
                  <div className="space-y-3.5">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">ATIVOS (Recursos)</span>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span>Disponibilidades (Caixa)</span>
                        <span className="font-mono font-bold text-gray-950 dark:text-white">{Math.max(0, currentCashFlow).toLocaleString()} Kz</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clientes (Contas AR)</span>
                        <span className="font-mono font-bold text-gray-950 dark:text-white">
                          {contasAReceber.filter(x => x.estado === 'Pendente').reduce((sum, x) => sum + x.valor, 0).toLocaleString()} Kz
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ativos Freguesia (Líquido)</span>
                        <span className="font-mono font-bold text-gray-950 dark:text-white">
                          {ativos.reduce((sum, at) => sum + calculateDepreciation(at).currentBookValue, 0).toLocaleString()} Kz
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between font-bold text-brand-iris">
                      <span>Total Ativos</span>
                      <span>
                        {(
                          Math.max(0, currentCashFlow) + 
                          contasAReceber.filter(x => x.estado === 'Pendente').reduce((sum, x) => sum + x.valor, 0) +
                          ativos.reduce((sum, at) => sum + calculateDepreciation(at).currentBookValue, 0)
                        ).toLocaleString()} Kz
                      </span>
                    </div>
                  </div>

                  {/* PASSIVO column */}
                  <div className="pl-4 space-y-3.5">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">PASSIVO & CAPITAL PRÓPRIO</span>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span>Fornecedores (Contas AP)</span>
                        <span className="font-mono font-bold text-gray-950 dark:text-white">
                          {contasAPagar.filter(x => x.estado === 'Pendente').reduce((sum, x) => sum + x.valor, 0).toLocaleString()} Kz
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Capital Social / Próprio</span>
                        <span className="font-mono font-bold text-gray-950 dark:text-white">10,000,000 Kz</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between font-bold text-emerald-500">
                      <span>Total Passivos + Eq</span>
                      <span>
                        {(
                          contasAPagar.filter(x => x.estado === 'Pendente').reduce((sum, x) => sum + x.valor, 0) +
                          10000000
                        ).toLocaleString()} Kz
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
