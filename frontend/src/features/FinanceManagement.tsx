import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Trash2,
  Calendar,
  FileSpreadsheet,
  Download,
  Upload,
  ShieldCheck,
  Scale,
  Users,
  Activity,
  Layers,
  PieChart,
  RefreshCw
} from "lucide-react";
import { APIService } from "../services/api";
import type { Transaction, ERPData, AssetLiability, Partner } from "../types";

export default function FinanceManagement() {
  // Tabs: ledger, assets, partners, reports
  const [activeSubTab, setActiveSubTab] = useState<"ledger" | "assets" | "partners" | "reports">("ledger");
  const [erp, setErp] = useState<ERPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for Transactions
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<"revenue" | "expense">("revenue");
  const [cat, setCat] = useState("Vendas");
  const [amount, setAmount] = useState("");
  const [resp, setResp] = useState("António Fula");

  // Form states for Assets/Liabilities
  const [alName, setAlName] = useState("");
  const [alType, setAlType] = useState<"asset" | "liability">("asset");
  const [alCat, setAlCat] = useState("Máquinas");
  const [alValue, setAlValue] = useState("");
  const [alDesc, setAlDesc] = useState("");

  // Form states for Partners
  const [partName, setPartName] = useState("");
  const [partType, setPartType] = useState<"supplier" | "client">("client");
  const [partNif, setPartNif] = useState("");
  const [partPhone, setPartPhone] = useState("");
  const [partEmail, setPartEmail] = useState("");
  const [partAddress, setPartAddress] = useState("");
  const [partBalance, setPartBalance] = useState("");

  // Load ERP data on mount
  useEffect(() => {
    fetchERP();
  }, []);

  const fetchERP = async () => {
    setLoading(true);
    try {
      const data = await APIService.getERPData();
      setErp(data);
    } catch (e) {
      setErrorMsg("Falha ao obter os dados do ERP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (updatedERP: ERPData) => {
    setSyncing(true);
    setErp(updatedERP);
    const success = await APIService.saveERPData(updatedERP);
    if (success) {
      showSuccess("Base de dados sincronizada com o servidor!");
    } else {
      setErrorMsg("Modo offline ativo: guardado em cache local.");
      setTimeout(() => setErrorMsg(null), 4000);
    }
    setSyncing(false);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <RefreshCw size={28} className="text-indigo-600 animate-spin" />
        <p className="text-xs text-gray-500 font-medium">A carregar registos financeiros em tempo real...</p>
      </div>
    );
  }

  const currentErp = erp || {
    humanResources: [],
    machinery: [],
    insumos: [],
    cycles: [],
    production: [],
    partners: [],
    assetsLiabilities: [],
    transactions: []
  };

  // Transaction Ledger handlers
  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;

    const newTx: Transaction = {
      id: "tx-" + (currentErp.transactions.length + 1) + "-" + Math.random().toString(36).substr(2, 4),
      description: desc,
      type,
      category: cat,
      amount: Number(amount),
      date: new Date().toISOString().split("T")[0],
      responsible: resp
    };

    const updated = {
      ...currentErp,
      transactions: [newTx, ...currentErp.transactions]
    };

    handleSync(updated);
    setDesc("");
    setAmount("");
    showSuccess("Transação inserida com sucesso!");
  };

  const handleDeleteTx = (id: string) => {
    const updated = {
      ...currentErp,
      transactions: currentErp.transactions.filter(t => t.id !== id)
    };
    handleSync(updated);
    showSuccess("Transação removida!");
  };

  // Assets & Liabilities handlers
  const handleAddAL = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alName || !alValue) return;

    const newAL: AssetLiability = {
      id: "al-" + (currentErp.assetsLiabilities.length + 1) + "-" + Math.random().toString(36).substr(2, 4),
      name: alName,
      type: alType,
      category: alCat,
      value: Number(alValue),
      description: alDesc,
      date: new Date().toISOString().split("T")[0]
    };

    const updated = {
      ...currentErp,
      assetsLiabilities: [...currentErp.assetsLiabilities, newAL]
    };

    handleSync(updated);
    setAlName("");
    setAlValue("");
    setAlDesc("");
    showSuccess("Ativo/Passivo registado!");
  };

  const handleDeleteAL = (id: string) => {
    const updated = {
      ...currentErp,
      assetsLiabilities: currentErp.assetsLiabilities.filter(item => item.id !== id)
    };
    handleSync(updated);
    showSuccess("Item removido do balanço!");
  };

  // Partners handlers
  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName) return;

    const newPartner: Partner = {
      id: "part-" + (currentErp.partners.length + 1) + "-" + Math.random().toString(36).substr(2, 4),
      name: partName,
      type: partType,
      nif: partNif || "Isento",
      phone: partPhone,
      email: partEmail,
      address: partAddress,
      balance: Number(partBalance || 0)
    };

    const updated = {
      ...currentErp,
      partners: [...currentErp.partners, newPartner]
    };

    handleSync(updated);
    setPartName("");
    setPartNif("");
    setPartPhone("");
    setPartEmail("");
    setPartAddress("");
    setPartBalance("");
    showSuccess("Parceiro comercial registado!");
  };

  const handleDeletePartner = (id: string) => {
    const updated = {
      ...currentErp,
      partners: currentErp.partners.filter(p => p.id !== id)
    };
    handleSync(updated);
    showSuccess("Parceiro removido.");
  };

  // Calculations
  const totalIncome = currentErp.transactions.filter((t: any) => t.type === "income" || t.type === "revenue").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = currentErp.transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = totalIncome - totalExpense;

  const totalAssets = currentErp.assetsLiabilities.filter(al => al.type === "asset").reduce((sum, al) => sum + al.value, 0);
  const totalLiabilities = currentErp.assetsLiabilities.filter(al => al.type === "liability").reduce((sum, al) => sum + al.value, 0);
  const equityValue = totalAssets - totalLiabilities;

  const totalPayables = currentErp.partners.filter(p => p.type === "supplier" && p.balance < 0).reduce((sum, p) => sum + Math.abs(p.balance), 0);
  const totalReceivables = currentErp.partners.filter(p => p.type === "client" && p.balance > 0).reduce((sum, p) => sum + p.balance, 0);

  // CSV Import/Export
  const downloadCSVTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Data,Descricao,Tipo,Categoria,Valor,Responsavel\n" +
      "2026-07-18,Venda de Batata Rena Lote C,receita,Vendas,380000,António Fula\n" +
      "2026-07-18,Compra de Fertilizante NPK,despesa,Sementes / Insumos,120000,Maria Diogo\n" +
      "2026-07-18,Pagamento Gasoleo Trator,despesa,Combustíveis,45000,Mateus Ndulu";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "modelo_olo_transacoes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Modelo baixado! Preencha-o e carregue-o para importar.");
  };

  const exportToCSV = () => {
    if (currentErp.transactions.length === 0) {
      setErrorMsg("Sem dados para exportar.");
      return;
    }
    let csvContent = "data:text/csv;charset=utf-8,ID,Data,Descricao,Tipo,Categoria,Valor,Responsavel\n";
    currentErp.transactions.forEach(t => {
      csvContent += `${t.id},${t.date},"${t.description.replace(/"/g, '""')}",${t.type},${t.category},${t.amount},${t.responsible || "N/D"}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `olo_financeiro_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Arquivo exportado com sucesso para Excel/CSV!");
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n");
        const importedTxs: Transaction[] = [];

        // Skip header line
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Simple comma splitter considering possible quotes
          const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          if (parts.length < 5) continue;

          const date = parts[0].trim();
          const description = parts[1].trim().replace(/^"|"$/g, "");
          const typeStr = parts[2].trim().toLowerCase();
          const category = parts[3].trim();
          const amountVal = Number(parts[4].trim());
          const responsible = parts[5] ? parts[5].trim() : "Importador";

          const finalType = (typeStr.includes("receita") || typeStr.includes("income") || typeStr.includes("entrada") || typeStr.includes("revenue")) ? "revenue" : "expense";

          if (description && !isNaN(amountVal)) {
            importedTxs.push({
              id: "tx-imported-" + i + "-" + Math.random().toString(36).substr(2, 4),
              description,
              type: finalType,
              category: category || "Outros",
              amount: amountVal,
              date: date || new Date().toISOString().split("T")[0],
              responsible
            });
          }
        }

        if (importedTxs.length > 0) {
          const updated = {
            ...currentErp,
            transactions: [...importedTxs, ...currentErp.transactions]
          };
          handleSync(updated);
          showSuccess(`${importedTxs.length} transações importadas com sucesso!`);
        } else {
          setErrorMsg("Nenhum registo válido encontrado no arquivo CSV.");
        }
      } catch (err) {
        setErrorMsg("Formato de CSV inválido. Descarregue o modelo e verifique.");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset input
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Header and Sync indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white flex items-center gap-2">
            Sistema Integrado de Finanças (ERP)
            {syncing && <RefreshCw size={18} className="text-indigo-600 animate-spin" />}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
            Contabilidade robusta em tempo real de ativos, passivos, contas correntes e transações da cooperativa.
          </p>
        </div>

        {/* Sync/Offline badge */}
        <div className="flex items-center space-x-2">
          {APIService.hasPendingSync() ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/50">
              <Activity size={12} className="animate-pulse" />
              Sincronização Pendente
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200/50">
              <ShieldCheck size={12} />
              Nuvem Sincronizada
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200/50 rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200/50 rounded-xl text-xs font-semibold">
          {successMsg}
        </div>
      )}

      {/* Financial Health Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cash balance */}
        <div className="bg-white dark:glass-card p-4 rounded-2xl border border-gray-200/60 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold text-gray-400">Caixa Líquido</span>
            <span className={`block text-xl font-black ${netCashFlow >= 0 ? "text-indigo-600 dark:text-indigo-400" : "text-rose-500"}`}>
              {netCashFlow.toLocaleString()} Kz
            </span>
            <span className="text-[10px] text-gray-400">Total transacionado</span>
          </div>
          <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Assets evaluation */}
        <div className="bg-white dark:glass-card p-4 rounded-2xl border border-gray-200/60 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold text-gray-400">Património Ativo</span>
            <span className="block text-xl font-black text-emerald-600 dark:text-emerald-400">
              {totalAssets.toLocaleString()} Kz
            </span>
            <span className="text-[10px] text-gray-400">Terrenos, máquinas e frotas</span>
          </div>
          <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Scale size={20} />
          </div>
        </div>

        {/* Liabilities */}
        <div className="bg-white dark:glass-card p-4 rounded-2xl border border-gray-200/60 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold text-gray-400">Passivo & Financiamentos</span>
            <span className="block text-xl font-black text-rose-600 dark:text-rose-400">
              {totalLiabilities.toLocaleString()} Kz
            </span>
            <span className="text-[10px] text-gray-400">Dívidas e microcréditos</span>
          </div>
          <div className="h-10 w-10 bg-rose-50 dark:bg-rose-950/30 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <ArrowDownRight size={20} />
          </div>
        </div>

        {/* Equity worth */}
        <div className="bg-white dark:glass-card p-4 rounded-2xl border border-gray-200/60 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold text-gray-400">Capital Próprio Estimado</span>
            <span className={`block text-xl font-black ${equityValue >= 0 ? "text-slate-800 dark:text-zinc-200" : "text-rose-500"}`}>
              {equityValue.toLocaleString()} Kz
            </span>
            <span className="text-[10px] text-gray-400">Ativo líquido de passivos</span>
          </div>
          <div className="h-10 w-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-700 dark:text-zinc-300 shrink-0">
            <Layers size={20} />
          </div>
        </div>
      </div>

      {/* Internal Sub-navigation menu */}
      <div className="border-b border-gray-200 dark:border-white/10 flex space-x-5 overflow-x-auto scrollbar-none pb-0.5">
        <button
          onClick={() => setActiveSubTab("ledger")}
          className={`pb-3 text-xs font-black transition cursor-pointer shrink-0 border-b-2 px-1 ${
            activeSubTab === "ledger"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-950 dark:hover:text-white"
          }`}
        >
          📄 Livro de Caixa e Import/Export
        </button>
        <button
          onClick={() => setActiveSubTab("assets")}
          className={`pb-3 text-xs font-black transition cursor-pointer shrink-0 border-b-2 px-1 ${
            activeSubTab === "assets"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-950 dark:hover:text-white"
          }`}
        >
          🚜 Balanço Patrimonial (Ativos/Passivos)
        </button>
        <button
          onClick={() => setActiveSubTab("partners")}
          className={`pb-3 text-xs font-black transition cursor-pointer shrink-0 border-b-2 px-1 ${
            activeSubTab === "partners"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-950 dark:hover:text-white"
          }`}
        >
          🤝 Fornecedores e Clientes (Saldos)
        </button>
        <button
          onClick={() => setActiveSubTab("reports")}
          className={`pb-3 text-xs font-black transition cursor-pointer shrink-0 border-b-2 px-1 ${
            activeSubTab === "reports"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-950 dark:hover:text-white"
          }`}
        >
          📊 Demonstração de Resultados (P&L)
        </button>
      </div>

      {/* SUB-TABS VIEWS */}

      {/* LEDGER TAB */}
      {activeSubTab === "ledger" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Ledger list */}
          <div className="lg:col-span-8 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Lançamentos de Caixa</h3>
              
              {/* CSV Import/Export Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={downloadCSVTemplate}
                  className="px-2 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 rounded-lg text-[10px] font-bold text-gray-600 dark:text-zinc-300 flex items-center gap-1 cursor-pointer transition"
                  title="Baixar Modelo de CSV"
                >
                  <Download size={11} />
                  Modelo CSV
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 border border-indigo-200/40 rounded-lg text-[10px] font-black text-indigo-700 dark:text-indigo-400 flex items-center gap-1 cursor-pointer transition"
                  title="Exportar para Excel"
                >
                  <FileSpreadsheet size={11} />
                  Exportar Excel
                </button>
                <label className="px-2 py-1 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 rounded-lg text-[10px] font-black text-white dark:text-slate-950 flex items-center gap-1 cursor-pointer transition">
                  <Upload size={11} />
                  Importar CSV
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {currentErp.transactions.map((t) => (
                <div 
                  key={t.id}
                  className="p-3 bg-slate-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-xl flex items-center justify-between text-xs transition hover:border-gray-300 dark:hover:border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-base ${
                      (t as any).type === "income" || t.type === "revenue"
                        ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400" 
                        : "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400"
                    }`}>
                      {(t as any).type === "income" || t.type === "revenue" ? "+" : "-"}
                    </div>
                    <div>
                      <span className="block font-bold text-gray-800 dark:text-zinc-200">{t.description}</span>
                      <span className="block text-[10px] text-gray-400">
                        {t.category} • {t.date} {t.responsible ? `• Responsável: ${t.responsible}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className={`font-black text-sm ${(t as any).type === "income" || t.type === "revenue" ? "text-green-600" : "text-rose-500"}`}>
                      {(t as any).type === "income" || t.type === "revenue" ? "+" : "-"} {t.amount.toLocaleString()} Kz
                    </span>
                    <button 
                      onClick={() => handleDeleteTx(t.id)}
                      className="text-gray-400 hover:text-rose-500 transition p-1 rounded hover:bg-slate-100 dark:hover:bg-white/5"
                      title="Excluir"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}

              {currentErp.transactions.length === 0 && (
                <div className="py-12 text-center text-xs text-gray-400 italic">
                  Nenhuma transação registada de momento. Use o formulário à direita ou importe um ficheiro CSV.
                </div>
              )}
            </div>
          </div>

          {/* Form to logger */}
          <div className="lg:col-span-4 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="font-extrabold text-sm flex items-center gap-2 text-gray-900 dark:text-white">
              <Plus size={16} className="text-indigo-600 dark:text-indigo-400" />
              Lançar Movimento de Caixa
            </h3>

            <form onSubmit={handleAddTx} className="space-y-3.5 text-xs font-bold text-gray-500">
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Tipo de Operação:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("revenue")}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      type === "revenue"
                        ? "border-green-600 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                        : "border-gray-200 dark:border-white/5 text-gray-500 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    Receita (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("expense")}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      type === "expense"
                        ? "border-rose-600 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400"
                        : "border-gray-200 dark:border-white/5 text-gray-500 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    Despesa (-)
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Descrição do Lançamento:</label>
                <input 
                  type="text" 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Ex: Venda de Sementes"
                  required
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Categoria:</label>
                  <select
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-700 dark:text-zinc-300 font-semibold"
                  >
                    <option value="Vendas" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Vendas 🌽</option>
                    <option value="Combustíveis" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Combustíveis ⛽</option>
                    <option value="Rações" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Rações / Nutrição 🐖</option>
                    <option value="Sementes / Insumos" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Sementes / Adubos 🌾</option>
                    <option value="Salários" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Salários / Pessoal 👤</option>
                    <option value="Equipamentos" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Equipamentos ⚙️</option>
                    <option value="Operacional" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Operacional Geral 📦</option>
                    <option value="Outros" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Outros Lançamentos 🏷️</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Valor (Kz):</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ex: 85000"
                    required
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Responsável pelo Lançamento:</label>
                <input 
                  type="text" 
                  value={resp}
                  onChange={(e) => setResp(e.target.value)}
                  placeholder="Ex: António Fula"
                  required
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm glow-indigo cursor-pointer text-center"
              >
                Lançar Movimento de Caixa
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ASSETS TAB */}
      {activeSubTab === "assets" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Assets and liabilities lists */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active Assets */}
            <div className="bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-4 flex items-center gap-1.5 text-emerald-600">
                <TrendingUp size={16} /> Ativos Reais (Propriedades, Stocks e Equipamentos)
              </h3>
              
              <div className="space-y-2.5">
                {currentErp.assetsLiabilities.filter(al => al.type === "asset").map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 bg-emerald-50/10 dark:bg-emerald-950/5 border border-emerald-100/50 dark:border-emerald-900/10 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="block font-bold text-gray-800 dark:text-zinc-200">{item.name}</span>
                      <span className="block text-[10px] text-gray-400">Categoria: {item.category} • {item.description}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-black text-emerald-600 dark:text-emerald-400">+{item.value.toLocaleString()} Kz</span>
                      <button 
                        onClick={() => handleDeleteAL(item.id)}
                        className="text-gray-400 hover:text-rose-500 transition p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                {currentErp.assetsLiabilities.filter(al => al.type === "asset").length === 0 && (
                  <p className="text-xs text-gray-400 italic py-4">Sem ativos registados.</p>
                )}
              </div>
            </div>

            {/* Liabilities */}
            <div className="bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-4 flex items-center gap-1.5 text-rose-600">
                <TrendingDown size={16} /> Passivos, Empréstimos & Dívidas Fornecedores
              </h3>

              <div className="space-y-2.5">
                {currentErp.assetsLiabilities.filter(al => al.type === "liability").map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 bg-rose-50/10 dark:bg-rose-950/5 border border-rose-100/50 dark:border-rose-900/10 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="block font-bold text-gray-800 dark:text-zinc-200">{item.name}</span>
                      <span className="block text-[10px] text-gray-400">Categoria: {item.category} • {item.description}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-black text-rose-600 dark:text-rose-400">-{item.value.toLocaleString()} Kz</span>
                      <button 
                        onClick={() => handleDeleteAL(item.id)}
                        className="text-gray-400 hover:text-rose-500 transition p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                {currentErp.assetsLiabilities.filter(al => al.type === "liability").length === 0 && (
                  <p className="text-xs text-gray-400 italic py-4">Sem passivos registados.</p>
                )}
              </div>
            </div>

          </div>

          {/* Form to asset */}
          <div className="lg:col-span-4 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="font-extrabold text-sm flex items-center gap-2 text-gray-900 dark:text-white">
              <Plus size={16} className="text-indigo-600 dark:text-indigo-400" />
              Lançar no Balanço Reais
            </h3>

            <form onSubmit={handleAddAL} className="space-y-3.5 text-xs font-bold text-gray-500">
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Classificação:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAlType("asset")}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      alType === "asset"
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                        : "border-gray-200 dark:border-white/5 text-gray-500 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    Ativo (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlType("liability")}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      alType === "liability"
                        ? "border-rose-600 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400"
                        : "border-gray-200 dark:border-white/5 text-gray-500 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    Passivo (-)
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Nome do Recurso/Conta:</label>
                <input 
                  type="text" 
                  value={alName}
                  onChange={(e) => setAlName(e.target.value)}
                  placeholder="Ex: Trator Massey Ferguson ou Empréstimo BCI"
                  required
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Categoria:</label>
                  <select
                    value={alCat}
                    onChange={(e) => setAlCat(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-700 dark:text-zinc-300 font-semibold"
                  >
                    <option value="Máquinas" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Máquinas/Frotas 🚜</option>
                    <option value="Imóveis" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Imóveis / Terrenos 🗺️</option>
                    <option value="Stocks" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Stocks de Produtos 🌽</option>
                    <option value="Banca" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Empréstimos Bancários 🏦</option>
                    <option value="Fornecedores" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Fornecedores Correntes 🤝</option>
                    <option value="Outros" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">Outros Balanço 🏷️</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Valor Avaliado (Kz):</label>
                  <input 
                    type="number" 
                    value={alValue}
                    onChange={(e) => setAlValue(e.target.value)}
                    placeholder="Ex: 5000000"
                    required
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Breve Descrição / Detalhe:</label>
                <textarea 
                  value={alDesc}
                  onChange={(e) => setAlDesc(e.target.value)}
                  placeholder="Ex: Contrato de microcrédito assinado em Maio 2026..."
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm glow-indigo cursor-pointer text-center"
              >
                Registar no Balanço
              </button>
            </form>
          </div>

        </div>
      )}

      {/* PARTNERS TAB */}
      {activeSubTab === "partners" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Partners lists */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Suppliers */}
            <div className="bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-amber-600"><Users size={16} /> Contas Correntes com Fornecedores</span>
                <span className="text-[10px] font-black text-rose-500">Total a Pagar: {totalPayables.toLocaleString()} Kz</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentErp.partners.filter(p => p.type === "supplier").map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-xl relative">
                    <button 
                      onClick={() => handleDeletePartner(p.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-rose-500 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                    <span className="block font-bold text-xs text-gray-800 dark:text-zinc-200">{p.name}</span>
                    <span className="block text-[10px] text-gray-400">NIF: {p.nif} • Tel: {p.phone}</span>
                    <span className="block text-[10px] text-gray-400">Endereço: {p.address}</span>
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-[10px]">
                      <span className="text-gray-400">Saldo Corrente:</span>
                      <span className={`font-black ${p.balance < 0 ? "text-rose-500" : "text-gray-500"}`}>
                        {p.balance < 0 ? `A Pagar: ${Math.abs(p.balance).toLocaleString()} Kz` : "Liquido"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clients */}
            <div className="bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-indigo-600"><Users size={16} /> Saldos a Receber de Clientes</span>
                <span className="text-[10px] font-black text-emerald-600">Total a Receber: {totalReceivables.toLocaleString()} Kz</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentErp.partners.filter(p => p.type === "client").map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-xl relative">
                    <button 
                      onClick={() => handleDeletePartner(p.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-rose-500 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                    <span className="block font-bold text-xs text-gray-800 dark:text-zinc-200">{p.name}</span>
                    <span className="block text-[10px] text-gray-400">NIF: {p.nif} • Tel: {p.phone}</span>
                    <span className="block text-[10px] text-gray-400">Email: {p.email}</span>
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-[10px]">
                      <span className="text-gray-400">Saldo a Receber:</span>
                      <span className={`font-black ${p.balance > 0 ? "text-emerald-600" : "text-gray-500"}`}>
                        {p.balance > 0 ? `${p.balance.toLocaleString()} Kz` : "Líquido"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Form to partner */}
          <div className="lg:col-span-4 bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="font-extrabold text-sm flex items-center gap-2 text-gray-900 dark:text-white">
              <Plus size={16} className="text-indigo-600 dark:text-indigo-400" />
              Registar Parceiro / Carteira
            </h3>

            <form onSubmit={handleAddPartner} className="space-y-3 text-xs font-bold text-gray-500">
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Relação Comercial:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPartType("client")}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      partType === "client"
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400"
                        : "border-gray-200 dark:border-white/5 text-gray-500 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    Cliente (Vendas)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPartType("supplier")}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      partType === "supplier"
                        ? "border-amber-600 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400"
                        : "border-gray-200 dark:border-white/5 text-gray-500 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    Fornecedor (Compra)
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Nome da Empresa/Pessoa:</label>
                <input 
                  type="text" 
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  placeholder="Ex: Alimenta Angola S.A. ou Moagem"
                  required
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">NIF Comercial:</label>
                  <input 
                    type="text" 
                    value={partNif}
                    onChange={(e) => setPartNif(e.target.value)}
                    placeholder="Ex: 500122933"
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-zinc-500">Contacto de Telefone:</label>
                  <input 
                    type="text" 
                    value={partPhone}
                    onChange={(e) => setPartPhone(e.target.value)}
                    placeholder="Ex: 923110292"
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Correio Eletrónico (Email):</label>
                <input 
                  type="email" 
                  value={partEmail}
                  onChange={(e) => setPartEmail(e.target.value)}
                  placeholder="Ex: compras@parceiro.ao"
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">Endereço de Entrega / Sede:</label>
                <input 
                  type="text" 
                  value={partAddress}
                  onChange={(e) => setPartAddress(e.target.value)}
                  placeholder="Ex: Zona Industrial, Viana"
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 dark:text-zinc-500">
                  {partType === "client" ? "Saldo Inicial a Receber (Kz):" : "Saldo Inicial a Pagar (Kz, use negativo):"}
                </label>
                <input 
                  type="number" 
                  value={partBalance}
                  onChange={(e) => setPartBalance(e.target.value)}
                  placeholder={partType === "client" ? "Ex: 450000" : "Ex: -250000"}
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-850 dark:text-zinc-200 font-medium"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm glow-indigo cursor-pointer text-center"
              >
                Cadastrar Parceiro
              </button>
            </form>
          </div>

        </div>
      )}

      {/* REPORTS TAB */}
      {activeSubTab === "reports" && (
        <div className="space-y-6">
          
          {/* Income Statement (P&L) Card */}
          <div className="bg-white dark:glass-card border border-gray-200/60 dark:border-white/10 rounded-2xl p-6">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <PieChart size={18} className="text-indigo-600 dark:text-indigo-400" />
              Demonstração de Resultados do Exercício (P&L) - Estimativa Anualizada
            </h3>

            {/* Simulated spreadsheet representation */}
            <div className="border border-gray-100 dark:border-white/5 rounded-xl overflow-hidden font-mono text-[11px] text-gray-600 dark:text-zinc-300">
              <div className="grid grid-cols-12 gap-2 bg-slate-100 dark:bg-white/5 p-3 font-bold border-b border-gray-200 dark:border-white/10">
                <div className="col-span-8 uppercase text-xs">Métrica Financeira</div>
                <div className="col-span-4 text-right uppercase text-xs">Valor Comercial (Kz)</div>
              </div>

              {/* Revenue */}
              <div className="grid grid-cols-12 gap-2 p-3 border-b border-gray-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.01]">
                <div className="col-span-8 font-bold text-gray-800 dark:text-zinc-200">(+) PRODUTOS DE VENDA (Receita Operacional Bruta)</div>
                <div className="col-span-4 text-right font-black text-green-600 text-xs">+{totalIncome.toLocaleString()} Kz</div>
              </div>

              {/* COGS */}
              <div className="grid grid-cols-12 gap-2 p-3 border-b border-gray-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.01]">
                <div className="col-span-8">(-) Custo dos Insumos Vendidos (Combustíveis, Sementes, Rações)</div>
                <div className="col-span-4 text-right text-rose-500">
                  -{currentErp.transactions.filter(t => t.type === "expense" && ["Combustíveis", "Rações", "Sementes / Insumos"].includes(t.category)).reduce((sum, t) => sum + t.amount, 0).toLocaleString()} Kz
                </div>
              </div>

              {/* Gross Profit */}
              <div className="grid grid-cols-12 gap-2 bg-slate-50/50 dark:bg-white/[0.02] p-3 border-b border-gray-100 dark:border-white/5 font-bold">
                <div className="col-span-8 text-gray-900 dark:text-white font-bold">(=) MARGEM BRUTA DE EXPLORAÇÃO</div>
                <div className="col-span-4 text-right text-xs text-indigo-600 dark:text-indigo-400">
                  {(totalIncome - currentErp.transactions.filter(t => t.type === "expense" && ["Combustíveis", "Rações", "Sementes / Insumos"].includes(t.category)).reduce((sum, t) => sum + t.amount, 0)).toLocaleString()} Kz
                </div>
              </div>

              {/* Administrative expenses */}
              <div className="grid grid-cols-12 gap-2 p-3 border-b border-gray-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.01]">
                <div className="col-span-8">(-) Encargos Administrativos e Pessoal (Salários, Operações)</div>
                <div className="col-span-4 text-right text-rose-500">
                  -{currentErp.transactions.filter(t => t.type === "expense" && ["Salários", "Equipamentos", "Operacional", "Outros"].includes(t.category)).reduce((sum, t) => sum + t.amount, 0).toLocaleString()} Kz
                </div>
              </div>

              {/* EBITDA */}
              <div className="grid grid-cols-12 gap-2 bg-slate-100/50 dark:bg-white/5 p-3 border-b border-gray-200 dark:border-white/10 font-bold">
                <div className="col-span-8 text-gray-900 dark:text-white uppercase font-black text-xs">(=) EBITDA Operacional</div>
                <div className="col-span-4 text-right text-sm font-black text-slate-800 dark:text-white">
                  {netCashFlow.toLocaleString()} Kz
                </div>
              </div>

              {/* Ratios */}
              <div className="grid grid-cols-12 gap-2 p-3 bg-indigo-50/20 dark:bg-indigo-950/10 font-bold text-indigo-700 dark:text-indigo-400">
                <div className="col-span-8 flex items-center gap-1.5 font-bold">
                  <ShieldCheck size={14} /> MARGEM EBITDA (%) - Indicador de Viabilidade Bancária (BDA/SADC)
                </div>
                <div className="col-span-4 text-right text-sm font-black">
                  {totalIncome > 0 ? ((netCashFlow / totalIncome) * 100).toFixed(1) : "0"} %
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl">
                <span className="block text-xs font-black text-indigo-600 dark:text-indigo-400">Rácio de Solvabilidade</span>
                <span className="block text-lg font-black text-gray-800 dark:text-zinc-200 mt-1">
                  {totalLiabilities > 0 ? (totalAssets / totalLiabilities).toFixed(2) : "Ilimitada (Sem Dívida)"}
                </span>
                <p className="text-[10px] text-gray-400 mt-1">
                  A capacidade de cobrir dívidas a longo prazo com o património próprio da cooperativa. Acima de 1.5 é considerado seguro pelos analistas.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl">
                <span className="block text-xs font-black text-emerald-600 dark:text-emerald-400">Rácio de Liquidez Geral</span>
                <span className="block text-lg font-black text-gray-800 dark:text-zinc-200 mt-1">
                  {totalPayables > 0 ? ((netCashFlow + totalReceivables) / totalPayables).toFixed(2) : "Ilimitada"}
                </span>
                <p className="text-[10px] text-gray-400 mt-1">
                  Determina se a cooperativa consegue saldar dívidas correntes a curto prazo utilizando caixa e créditos imediatos de clientes.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
