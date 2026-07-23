/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  FileCheck, 
  Truck, 
  TrendingUp, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Calendar, 
  DollarSign, 
  Phone, 
  Mail, 
  AlertCircle, 
  FileText, 
  Search, 
  CheckCircle, 
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CommercialCRMModuleProps {
  userId: string;
  userRole: string;
  key?: string;
}

export function CrmPage({ userId, userRole }: CommercialCRMModuleProps) {
  // --- SUB-SECTIONS NAVIGATION ---
  const [activeTab, setActiveTab] = useState<'pipeline' | 'clientes' | 'fornecedores' | 'contratos'>('pipeline');

  // --- 1. PIPELINE & OPORTUNIDADES STATE ---
  const [oportunidades, setOportunidades] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-crm-oportunidades-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'op-1', titulo: 'Fornecimento Anual de Milho', cliente: 'Fábrica de Rações do Cuanza Sul', valor: 4500000, estagio: 'Negociação', probabilidade: 70, fechoPrevisto: '2026-08-15', notas: 'Negociação do preço por tonelada em curso.' },
      { id: 'op-2', titulo: 'Exportação Experimental de Carapau', cliente: 'Distribuidora Alimentar de Windhoek', valor: 12500000, estagio: 'Contrato', probabilidade: 90, fechoPrevisto: '2026-07-30', notas: 'Rascunho do contrato em revisão legal.' },
      { id: 'op-3', titulo: 'Lote de Novilhos para Abate', cliente: 'Carnes de Angola Lda', valor: 3800000, estagio: 'Contactado', probabilidade: 40, fechoPrevisto: '2026-09-01', notas: 'Contacto inicial realizado com o diretor de compras.' },
      { id: 'op-4', titulo: 'Distribuição de Hortaliças Frescas', cliente: 'Rede Candando', valor: 1800000, estagio: 'Lead', probabilidade: 20, fechoPrevisto: '2026-10-10', notas: 'Lead qualificado gerado na Feira Agrícola.' }
    ];
  });

  // --- 2. GESTÃO DE CLIENTES STATE ---
  const [clientes, setClientes] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-crm-clientes-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'cli-1', nome: 'Hotel Império S.A.', contacto: 'Mateus Gaspar', telefone: '+244 923 456 789', email: 'compras@hotelimperio.ao', provincia: 'Luanda', status: 'Ativo', historico: 'Cliente recorrente desde 2024. Pagamentos em dia.', valorGasto: 3400000 },
      { id: 'cli-2', nome: 'Sociedade de Frio do Namibe', contacto: 'Sebastião Simão', telefone: '+244 912 345 678', email: 'namibefrio@netangola.co.ao', provincia: 'Namibe', status: 'Ativo', historico: 'Compra pontual de grande volume de pescado.', valorGasto: 8900000 },
      { id: 'cli-3', nome: 'Cooperativa Agrícola da Caála', contacto: 'Ana Maria', telefone: '+244 934 789 123', email: 'caala.coop@gmail.com', provincia: 'Huambo', status: 'Inativo', historico: 'Interrupção temporária devido à reestruturação de infraestruturas.', valorGasto: 1200000 }
    ];
  });

  // --- 3. GESTÃO DE FORNECEDORES STATE ---
  const [fornecedores, setFornecedores] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-crm-fornecedores-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'for-1', nome: 'AngoAlimentos Lda', contacto: 'Dr. Álvaro Pires', telefone: '+244 921 554 112', email: 'comercial@angoalimentos.ao', categoria: 'Fertilizantes e Sementes', avaliacaoQualidade: 5, avaliacaoPrazo: 4, avaliacaoComunicacao: 5, notas: 'Fornecedor principal de adubos. Boa flexibilidade de crédito.' },
      { id: 'for-2', nome: 'Mecânica Express do Sul', contacto: 'Eng. Carlos Vaz', telefone: '+244 911 332 445', email: 'vendas@mecanicaexpress.co.ao', categoria: 'Manutenção de Frota', avaliacaoQualidade: 4, avaliacaoPrazo: 3, avaliacaoComunicacao: 4, notas: 'Oficina certificada. Prazos às vezes derrapam devido a peças importadas.' },
      { id: 'for-3', nome: 'PetroAngola Combustíveis', contacto: 'Dra. Isabel Silva', telefone: '+244 944 887 221', email: 'isabel.petro@petroangola.ao', categoria: 'Combustíveis e Lubrificantes', avaliacaoQualidade: 5, avaliacaoPrazo: 5, avaliacaoComunicacao: 4, notas: 'Fornecimento regular de gasóleo agrícola com subsídio governamental.' }
    ];
  });

  // --- 4. CONTRATOS STATE ---
  const [contratos, setContratos] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-crm-contratos-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'con-1', numero: 'CON-2026-001', titulo: 'Acordo Fornecimento de Hortaliças frescas', parceiro: 'Hotel Império S.A.', tipo: 'Venda', valorTotal: 3600000, dataInicio: '2026-01-01', dataFim: '2026-12-31', estado: 'Ativo', compromissos: 'Entrega semanal de 500kg de produtos selecionados às terças-feiras.' },
      { id: 'con-2', numero: 'CON-2026-002', titulo: 'Prestação de Assistência Mecânica Preventiva', parceiro: 'Mecânica Express do Sul', tipo: 'Compra', valorTotal: 1440000, dataInicio: '2026-03-15', dataFim: '2027-03-14', estado: 'Em Revisão', compromissos: 'Duas manutenções preventivas completas aos tratores principais a cada 6 meses.' },
      { id: 'con-3', numero: 'CON-2025-019', titulo: 'Fornecimento de Ração para Engorda Rápida', parceiro: 'AngoAlimentos Lda', tipo: 'Compra', valorTotal: 5200000, dataInicio: '2025-06-01', dataFim: '2026-06-01', estado: 'Expirado', compromissos: 'Entrega mensal de 10 toneladas de ração classe A com pagamento a 30 dias.' }
    ];
  });

  // --- PERSISTENCE EFFECT ---
  useEffect(() => { localStorage.setItem(`olo-fintel-crm-oportunidades-${userId}`, JSON.stringify(oportunidades)); }, [oportunidades, userId]);
  useEffect(() => { localStorage.setItem(`olo-fintel-crm-clientes-${userId}`, JSON.stringify(clientes)); }, [clientes, userId]);
  useEffect(() => { localStorage.setItem(`olo-fintel-crm-fornecedores-${userId}`, JSON.stringify(fornecedores)); }, [fornecedores, userId]);
  useEffect(() => { localStorage.setItem(`olo-fintel-crm-contratos-${userId}`, JSON.stringify(contratos)); }, [contratos, userId]);

  // --- TEMPORARY FORM STATES ---
  const [opForm, setOpForm] = useState({ titulo: '', cliente: '', valor: '', estagio: 'Lead', probabilidade: '20', fechoPrevisto: new Date().toISOString().split('T')[0], notas: '' });
  const [cliForm, setCliForm] = useState({ nome: '', contacto: '', telefone: '', email: '', provincia: 'Luanda', status: 'Ativo', historico: '', valorGasto: '0' });
  const [forForm, setForForm] = useState({ nome: '', contacto: '', telefone: '', email: '', categoria: '', avaliacaoQualidade: '5', avaliacaoPrazo: '5', avaliacaoComunicacao: '5', notas: '' });
  const [conForm, setConForm] = useState({ numero: '', titulo: '', parceiro: '', tipo: 'Venda', valorTotal: '', dataInicio: new Date().toISOString().split('T')[0], dataFim: new Date().getFullYear() + '-12-31', compromissos: '' });

  // Notifications or status alerts
  const [crmAlert, setCrmAlert] = useState<string | null>(null);
  const triggerAlert = (msg: string) => {
    setCrmAlert(msg);
    setTimeout(() => { setCrmAlert(null); }, 4000);
  };

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Kanban Board Columns / Stages
  const pipelineStages = ['Lead', 'Contactado', 'Negociação', 'Contrato', 'Cliente'];

  // --- SUBMISSION HANDLERS ---
  const handleAddOportunidade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opForm.titulo || !opForm.cliente || !opForm.valor) return;
    const newOp = {
      id: `op-${Date.now()}`,
      titulo: opForm.titulo,
      cliente: opForm.cliente,
      valor: parseFloat(opForm.valor),
      estagio: opForm.estagio,
      probabilidade: parseInt(opForm.probabilidade),
      fechoPrevisto: opForm.fechoPrevisto,
      notas: opForm.notas
    };
    setOportunidades([...oportunidades, newOp]);
    setOpForm({ titulo: '', cliente: '', valor: '', estagio: 'Lead', probabilidade: '20', fechoPrevisto: new Date().toISOString().split('T')[0], notas: '' });
    triggerAlert('Oportunidade adicionada com sucesso!');
  };

  const handleAddCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliForm.nome) return;
    const newCli = {
      id: `cli-${Date.now()}`,
      nome: cliForm.nome,
      contacto: cliForm.contacto || 'Sem contacto especificado',
      telefone: cliForm.telefone,
      email: cliForm.email,
      provincia: cliForm.provincia,
      status: cliForm.status,
      historico: cliForm.historico || 'Novo cliente registado no CRM.',
      valorGasto: parseFloat(cliForm.valorGasto || '0')
    };
    setClientes([newCli, ...clientes]);
    setCliForm({ nome: '', contacto: '', telefone: '', email: '', provincia: 'Luanda', status: 'Ativo', historico: '', valorGasto: '0' });
    triggerAlert('Cliente registado com sucesso!');
  };

  const handleAddFornecedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forForm.nome || !forForm.categoria) return;
    const newFor = {
      id: `for-${Date.now()}`,
      nome: forForm.nome,
      contacto: forForm.contacto,
      telefone: forForm.telefone,
      email: forForm.email,
      categoria: forForm.categoria,
      avaliacaoQualidade: parseInt(forForm.avaliacaoQualidade),
      avaliacaoPrazo: parseInt(forForm.avaliacaoPrazo),
      avaliacaoComunicacao: parseInt(forForm.avaliacaoComunicacao),
      notas: forForm.notas
    };
    setFornecedores([newFor, ...fornecedores]);
    setForForm({ nome: '', contacto: '', telefone: '', email: '', categoria: '', avaliacaoQualidade: '5', avaliacaoPrazo: '5', avaliacaoComunicacao: '5', notas: '' });
    triggerAlert('Fornecedor registado com sucesso!');
  };

  const handleAddContrato = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conForm.numero || !conForm.titulo || !conForm.parceiro || !conForm.valorTotal) return;
    const newCon = {
      id: `con-${Date.now()}`,
      numero: conForm.numero,
      titulo: conForm.titulo,
      parceiro: conForm.parceiro,
      tipo: conForm.tipo,
      valorTotal: parseFloat(conForm.valorTotal),
      dataInicio: conForm.dataInicio,
      dataFim: conForm.dataFim,
      estado: 'Ativo',
      compromissos: conForm.compromissos
    };
    setContratos([newCon, ...contratos]);
    setConForm({ numero: '', titulo: '', parceiro: '', tipo: 'Venda', valorTotal: '', dataInicio: new Date().toISOString().split('T')[0], dataFim: new Date().getFullYear() + '-12-31', compromissos: '' });
    triggerAlert('Contrato registado no sistema de monitorização!');
  };

  // Move stage inside Pipeline
  const moveOportunidadeStage = (id: string, direction: 'PREV' | 'NEXT') => {
    setOportunidades(prev => prev.map(op => {
      if (op.id !== id) return op;
      const currentIndex = pipelineStages.indexOf(op.estagio);
      let nextIndex = currentIndex;
      if (direction === 'PREV' && currentIndex > 0) nextIndex = currentIndex - 1;
      if (direction === 'NEXT' && currentIndex < pipelineStages.length - 1) nextIndex = currentIndex + 1;
      
      // Auto probability updates based on pipeline progress
      const probsMap: Record<string, number> = { Lead: 20, Contactado: 40, Negociação: 60, Contrato: 80, Cliente: 100 };
      const nextStage = pipelineStages[nextIndex];

      return {
        ...op,
        estagio: nextStage,
        probabilidade: probsMap[nextStage] || op.probabilidade
      };
    }));
    triggerAlert('Pipeline atualizado com sucesso!');
  };

  const handleDeleteItem = (listType: 'oportunidades' | 'clientes' | 'fornecedores' | 'contratos', id: string) => {
    if (listType === 'oportunidades') setOportunidades(oportunidades.filter(x => x.id !== id));
    if (listType === 'clientes') setClientes(clientes.filter(x => x.id !== id));
    if (listType === 'fornecedores') setFornecedores(fornecedores.filter(x => x.id !== id));
    if (listType === 'contratos') setContratos(contratos.filter(x => x.id !== id));
    triggerAlert('Registo removido!');
  };

  // Convert Contract state
  const changeContratoEstado = (id: string, novoEstado: string) => {
    setContratos(prev => prev.map(c => c.id === id ? { ...c, estado: novoEstado } : c));
    triggerAlert(`Estado do contrato atualizado para: ${novoEstado}`);
  };

  // --- CRM REPORT STATISTICS ---
  // Forecast sales calculation
  const totalPipelineValue = oportunidades.reduce((sum, op) => sum + op.valor, 0);
  const weightedPipelineValue = oportunidades.reduce((sum, op) => sum + (op.valor * (op.probabilidade / 100)), 0);

  // Filter lists based on search
  const filteredClientes = clientes.filter(c => 
    c.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.contacto.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.provincia.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFornecedores = fornecedores.filter(f => 
    f.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.categoria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContratos = contratos.filter(c => 
    c.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.parceiro.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.numero.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Days until contract end calculator for warnings
  const getContractStatusBadge = (endDateStr: string, activeState: string) => {
    if (activeState === 'Expirado') {
      return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[9px] font-bold">Expirado</span>;
    }
    const daysLeft = Math.ceil((new Date(endDateStr).getTime() - new Date('2026-07-18').getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) {
      return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[9px] font-bold">Vencido</span>;
    }
    if (daysLeft <= 30) {
      return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold">Expira em {daysLeft} dias</span>;
    }
    return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">Válido ({daysLeft} d)</span>;
  };

  return (
    <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm space-y-6" id="integrated-crm-module">
      
      {/* HEADER BANNER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-gray-100 dark:border-gray-800 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Users size={12} />
              Módulo Comercial e CRM
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold">
              Negociação de Contratos
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mt-2">
            CRM & Planeamento Comercial de Angola
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Gestão integrada do pipeline de vendas, acompanhamento de contratos corporativos, avaliação de fornecedores e compromissos.
          </p>
        </div>

        {/* Search tool */}
        <div className="relative w-full lg:w-72">
          <Search size={14} className="absolute left-3 top-3 text-gray-400" />
          <input 
            type="text"
            placeholder="Pesquisar clientes, fornecedores..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121219] rounded-xl outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* FLOATING ACTION ALERT */}
      {crmAlert && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="p-3 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
        >
          <Sparkles size={14} />
          <span>{crmAlert}</span>
        </motion.div>
      )}

      {/* CORE KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Pipeline Total</span>
          <p className="text-xl lg:text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
            {totalPipelineValue.toLocaleString()} Kz
          </p>
          <span className="text-[10px] text-gray-400 mt-2 font-mono">{oportunidades.length} Oportunidades Ativas</span>
        </div>

        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Previsão Ponderada (Prob.)</span>
          <p className="text-xl lg:text-2xl font-black text-emerald-500 mt-2">
            {weightedPipelineValue.toLocaleString(undefined, {maximumFractionDigits: 0})} Kz
          </p>
          <span className="text-[10px] text-gray-400 mt-2 font-mono">Receita esperada de curto prazo</span>
        </div>

        <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Carteira de Clientes</span>
          <p className="text-xl lg:text-2xl font-black text-blue-500 mt-2">
            {clientes.filter(c => c.status === 'Ativo').length} Ativos
          </p>
          <span className="text-[10px] text-gray-400 mt-2 font-mono">De {clientes.length} registados</span>
        </div>

        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Contratos Ativos</span>
          <p className="text-xl lg:text-2xl font-black text-amber-500 mt-2">
            {contratos.filter(c => c.estado === 'Ativo').length} Acordos
          </p>
          <span className="text-[10px] text-gray-400 mt-2 font-mono">Compra & Venda</span>
        </div>
      </div>

      {/* MODULE TAB NAVIGATION */}
      <div className="flex flex-wrap border-b border-gray-100 dark:border-gray-800 pb-2 gap-1.5">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'pipeline' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'hover:bg-gray-50 dark:hover:bg-[#20202B] text-gray-600 dark:text-gray-400'
          }`}
        >
          <Briefcase size={14} />
          <span>Pipeline (Kanban) & Previsão</span>
        </button>

        <button
          onClick={() => setActiveTab('clientes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'clientes' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'hover:bg-gray-50 dark:hover:bg-[#20202B] text-gray-600 dark:text-gray-400'
          }`}
        >
          <Users size={14} />
          <span>Gestão de Clientes</span>
        </button>

        <button
          onClick={() => setActiveTab('fornecedores')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'fornecedores' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'hover:bg-gray-50 dark:hover:bg-[#20202B] text-gray-600 dark:text-gray-400'
          }`}
        >
          <Truck size={14} />
          <span>Gestão de Fornecedores</span>
        </button>

        <button
          onClick={() => setActiveTab('contratos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'contratos' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'hover:bg-gray-50 dark:hover:bg-[#20202B] text-gray-600 dark:text-gray-400'
          }`}
        >
          <FileCheck size={14} />
          <span>Contratos & Compromissos</span>
        </button>
      </div>

      {/* --- RENDER CONTENT AREA --- */}
      <div className="space-y-6">

        {/* 1. PIPELINE (KANBAN BOARD) & SALES FORECASTING */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            
            {/* Sales Forecasting Info */}
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 uppercase">
                  <TrendingUp size={14} />
                  Planeamento de Vendas & Probabilidade de Fecho
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  Utilize os controlos rápidos para mover as suas oportunidades pelas fases do funil comercial angolano. O valor ponderado é recalculado automaticamente de acordo com a probabilidade atual de fecho de cada negócio.
                </p>
              </div>
            </div>

            {/* Pipeline Stage Swimlanes (Kanban Simulation) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {pipelineStages.map(stage => {
                const stageOps = oportunidades.filter(op => op.estagio === stage);
                const stageTotal = stageOps.reduce((sum, op) => sum + op.valor, 0);

                return (
                  <div key={stage} className="bg-gray-50 dark:bg-[#1E1E26] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col min-h-[380px]">
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2 mb-3">
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-800 dark:text-gray-200">{stage}</h4>
                        <span className="text-[10px] text-gray-400">{stageOps.length} negócios</span>
                      </div>
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded-lg">
                        {stageTotal >= 1000000 ? `${(stageTotal/1000000).toFixed(1)}M Kz` : `${stageTotal.toLocaleString()} Kz`}
                      </span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px]">
                      {stageOps.map(op => (
                        <div key={op.id} className="p-3 bg-white dark:bg-[#13131A] rounded-xl border border-gray-100 dark:border-gray-800 space-y-2 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start gap-1">
                            <h5 className="text-[11px] font-bold text-gray-900 dark:text-white leading-snug">{op.titulo}</h5>
                            <button 
                              onClick={() => handleDeleteItem('oportunidades', op.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                              title="Excluir negócio"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                          
                          <p className="text-[10px] text-gray-400 font-mono">Cliente: {op.cliente}</p>
                          
                          <div className="flex justify-between items-center text-[10px] pt-1">
                            <span className="font-extrabold text-gray-900 dark:text-white">{op.valor.toLocaleString()} Kz</span>
                            <span className="text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.2 rounded font-mono">{op.probabilidade}% prob.</span>
                          </div>

                          <div className="text-[9px] text-gray-400 flex items-center gap-1">
                            <Calendar size={10} />
                            <span>Fecho: {op.fechoPrevisto}</span>
                          </div>

                          {op.notas && <p className="text-[9px] text-gray-400 italic border-t border-gray-100 dark:border-gray-800 pt-1 mt-1">{op.notas}</p>}

                          {/* Stage controls */}
                          <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-2 mt-1 gap-1">
                            <button 
                              disabled={stage === 'Lead'}
                              onClick={() => moveOportunidadeStage(op.id, 'PREV')}
                              className="p-1 rounded bg-gray-50 dark:bg-[#20202A] hover:bg-gray-100 text-gray-500 cursor-pointer disabled:opacity-30 text-[9px] font-bold flex items-center"
                              title="Recuar fase"
                            >
                              <ChevronLeft size={10} /> Recuar
                            </button>
                            <button 
                              disabled={stage === 'Cliente'}
                              onClick={() => moveOportunidadeStage(op.id, 'NEXT')}
                              className="p-1 rounded bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-600 cursor-pointer disabled:opacity-30 text-[9px] font-bold flex items-center"
                              title="Avançar fase"
                            >
                              Avançar <ChevronRight size={10} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {stageOps.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-300">
                          <span className="text-[10px]">Sem negócios</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Add Oportunidade Form */}
            <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1E1E26]/50">
              <h3 className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4 flex items-center gap-1">
                <Plus size={14} className="text-indigo-500" />
                Registar Nova Oportunidade Comercial
              </h3>
              <form onSubmit={handleAddOportunidade} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
                <div className="md:col-span-1 lg:col-span-2">
                  <label className="block text-[9px] font-bold text-gray-400 uppercase">Título da Oportunidade</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Venda Lote Bovinos Engorda" 
                    value={opForm.titulo}
                    onChange={e => setOpForm({...opForm, titulo: e.target.value})}
                    className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase">Cliente Potencial</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Carnes do Sul" 
                    value={opForm.cliente}
                    onChange={e => setOpForm({...opForm, cliente: e.target.value})}
                    className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase">Valor Estimado (Kz)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 2400000" 
                    value={opForm.valor}
                    onChange={e => setOpForm({...opForm, valor: e.target.value})}
                    className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase">Estágio Inicial</label>
                  <select 
                    value={opForm.estagio}
                    onChange={e => setOpForm({...opForm, estagio: e.target.value})}
                    className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Contactado">Contactado</option>
                    <option value="Negociação">Negociação</option>
                    <option value="Contrato">Contrato</option>
                    <option value="Cliente">Cliente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase">Fecho Estimado</label>
                  <input 
                    type="date" 
                    value={opForm.fechoPrevisto}
                    onChange={e => setOpForm({...opForm, fechoPrevisto: e.target.value})}
                    className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                  />
                </div>
                <div className="md:col-span-4 lg:col-span-6 flex justify-between gap-3 mt-1">
                  <input 
                    type="text"
                    placeholder="Notas adicionais sobre o negócio..."
                    value={opForm.notas}
                    onChange={e => setOpForm({...opForm, notas: e.target.value})}
                    className="flex-1 h-9 px-3 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                  />
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Adicionar Negócio
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* 2. GESTÃO DE CLIENTES */}
        {activeTab === 'clientes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Create Client Form */}
            <div className="lg:col-span-4 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1E1E26]/50 space-y-4">
              <h3 className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} className="text-indigo-500" />
                Adicionar Perfil de Cliente
              </h3>
              <form onSubmit={handleAddCliente} className="space-y-3">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase">Nome da Empresa / Cliente</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Cooperativa de Benguela" 
                    value={cliForm.nome}
                    onChange={e => setCliForm({...cliForm, nome: e.target.value})}
                    className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">Contacto Focal</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Mateus Gaspar" 
                      value={cliForm.contacto}
                      onChange={e => setCliForm({...cliForm, contacto: e.target.value})}
                      className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">Província</label>
                    <select 
                      value={cliForm.provincia}
                      onChange={e => setCliForm({...cliForm, provincia: e.target.value})}
                      className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    >
                      <option value="Luanda">Luanda</option>
                      <option value="Huambo">Huambo</option>
                      <option value="Benguela">Benguela</option>
                      <option value="Namibe">Namibe</option>
                      <option value="Huíla">Huíla</option>
                      <option value="Cabinda">Cabinda</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">Telefone</label>
                    <input 
                      type="text" 
                      placeholder="Ex: +244 923..." 
                      value={cliForm.telefone}
                      onChange={e => setCliForm({...cliForm, telefone: e.target.value})}
                      className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">E-mail</label>
                    <input 
                      type="email" 
                      placeholder="Ex: email@empresa.ao" 
                      value={cliForm.email}
                      onChange={e => setCliForm({...cliForm, email: e.target.value})}
                      className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">Estado</label>
                    <select 
                      value={cliForm.status}
                      onChange={e => setCliForm({...cliForm, status: e.target.value})}
                      className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">Faturação Histórica (Kz)</label>
                    <input 
                      type="number" 
                      value={cliForm.valorGasto}
                      onChange={e => setCliForm({...cliForm, valorGasto: e.target.value})}
                      className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase">Histórico e Observações</label>
                  <textarea 
                    placeholder="Histórico do cliente, contratos ativos, etc." 
                    value={cliForm.historico}
                    onChange={e => setCliForm({...cliForm, historico: e.target.value})}
                    className="w-full h-20 p-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Registar Cliente
                </button>
              </form>
            </div>

            {/* Clients List */}
            <div className="lg:col-span-8 p-5 border border-gray-200 dark:border-gray-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Fichas de Perfil e Histórico de Clientes</h3>
              
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {filteredClientes.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50/40 dark:hover:bg-[#1E1E26]/40 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">{c.nome}</h4>
                        <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          c.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {c.status}
                        </span>
                        <span className="text-[9px] text-gray-400 bg-gray-50 dark:bg-gray-900 px-1.5 py-0.2 rounded font-mono">
                          {c.provincia}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] text-gray-500 font-mono">
                        <div className="flex items-center gap-1"><Phone size={10} /> {c.telefone || 'Sem telefone'}</div>
                        <div className="flex items-center gap-1"><Mail size={10} /> {c.email || 'Sem e-mail'}</div>
                        <div className="font-extrabold text-indigo-600">Total Negócios: {c.valorGasto.toLocaleString()} Kz</div>
                      </div>

                      <div className="p-2.5 bg-gray-50 dark:bg-black/10 rounded-lg text-[10px] text-gray-400">
                        <strong className="text-gray-700 dark:text-gray-300">Contacto focal:</strong> {c.contacto} | <strong className="text-gray-700 dark:text-gray-300">Histórico:</strong> {c.historico}
                      </div>
                    </div>

                    <div className="self-end md:self-center">
                      <button 
                        onClick={() => handleDeleteItem('clientes', c.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remover cliente"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredClientes.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-xs">
                    Nenhum cliente correspondente encontrado.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* 3. GESTÃO DE FORNECEDORES */}
        {activeTab === 'fornecedores' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Create Supplier Form */}
            <div className="lg:col-span-4 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1E1E26]/50 space-y-4">
              <h3 className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                <Truck size={14} className="text-indigo-500" />
                Adicionar Perfil de Fornecedor
              </h3>
              <form onSubmit={handleAddFornecedor} className="space-y-3">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase">Nome do Fornecedor</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Distribuidora de Rações Norte" 
                    value={forForm.nome}
                    onChange={e => setForForm({...forForm, nome: e.target.value})}
                    className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase">Categoria de Serviço</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Sementes, Fertilizantes, Gelo" 
                    value={forForm.categoria}
                    onChange={e => setForForm({...forForm, categoria: e.target.value})}
                    className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">Contacto Comercial</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Álvaro Pires" 
                      value={forForm.contacto}
                      onChange={e => setForForm({...forForm, contacto: e.target.value})}
                      className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">Telefone</label>
                    <input 
                      type="text" 
                      placeholder="Ex: +244 912..." 
                      value={forForm.telefone}
                      onChange={e => setForForm({...forForm, telefone: e.target.value})}
                      className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2.5">
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Avaliação do Fornecedor</span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold text-gray-400">Qualidade (1-5)</label>
                      <select 
                        value={forForm.avaliacaoQualidade}
                        onChange={e => setForForm({...forForm, avaliacaoQualidade: e.target.value})}
                        className="w-full h-8 px-1 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-lg outline-none"
                      >
                        <option value="5">5 ★ Perfeito</option>
                        <option value="4">4 ★ Muito Bom</option>
                        <option value="3">3 ★ Razoável</option>
                        <option value="2">2 ★ Fraco</option>
                        <option value="1">1 ★ Insuficiente</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[8px] font-bold text-gray-400">Prazos (1-5)</label>
                      <select 
                        value={forForm.avaliacaoPrazo}
                        onChange={e => setForForm({...forForm, avaliacaoPrazo: e.target.value})}
                        className="w-full h-8 px-1 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-lg outline-none"
                      >
                        <option value="5">5 ★ Perfeito</option>
                        <option value="4">4 ★ Muito Bom</option>
                        <option value="3">3 ★ Razoável</option>
                        <option value="2">2 ★ Fraco</option>
                        <option value="1">1 ★ Insuficiente</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[8px] font-bold text-gray-400">Atendimento (1-5)</label>
                      <select 
                        value={forForm.avaliacaoComunicacao}
                        onChange={e => setForForm({...forForm, avaliacaoComunicacao: e.target.value})}
                        className="w-full h-8 px-1 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-lg outline-none"
                      >
                        <option value="5">5 ★ Perfeito</option>
                        <option value="4">4 ★ Muito Bom</option>
                        <option value="3">3 ★ Razoável</option>
                        <option value="2">2 ★ Fraco</option>
                        <option value="1">1 ★ Insuficiente</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase">Observações Internas</label>
                  <textarea 
                    placeholder="Contratos vigentes, prazos de entrega, políticas..." 
                    value={forForm.notas}
                    onChange={e => setForForm({...forForm, notas: e.target.value})}
                    className="w-full h-16 p-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Registar Fornecedor
                </button>
              </form>
            </div>

            {/* Suppliers List */}
            <div className="lg:col-span-8 p-5 border border-gray-200 dark:border-gray-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Perfil, Contratos & Avaliação de Fornecedores</h3>
              
              <div className="space-y-3.5 max-h-[550px] overflow-y-auto pr-1">
                {filteredFornecedores.map(f => (
                  <div key={f.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50/40 dark:hover:bg-[#1E1E26]/40 transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-gray-900 dark:text-white">{f.nome}</h4>
                        <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full">
                          {f.categoria}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDeleteItem('fornecedores', f.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer self-end md:self-center"
                        title="Remover fornecedor"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] text-gray-400 font-mono mb-2">
                      <div><strong className="text-gray-600 dark:text-gray-300">Contacto focal:</strong> {f.contacto || 'N/D'} • {f.telefone}</div>
                      <div><strong className="text-gray-600 dark:text-gray-300">Email:</strong> {f.email || 'N/D'}</div>
                    </div>

                    {/* Star ratings */}
                    <div className="grid grid-cols-3 gap-2 py-2 bg-gray-50 dark:bg-black/10 rounded-lg px-3 mb-2 text-[10px]">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Qualidade:</span>
                        <div className="flex text-amber-500 font-bold">
                          {Array.from({length: f.avaliacaoQualidade}).map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Prazos:</span>
                        <div className="flex text-amber-500 font-bold">
                          {Array.from({length: f.avaliacaoPrazo}).map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Comunicação:</span>
                        <div className="flex text-amber-500 font-bold">
                          {Array.from({length: f.avaliacaoComunicacao}).map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                        </div>
                      </div>
                    </div>

                    {f.notas && <p className="text-[10px] text-gray-400 italic pt-1 border-t border-gray-100 dark:border-gray-800">{f.notas}</p>}
                  </div>
                ))}

                {filteredFornecedores.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-xs">
                    Nenhum fornecedor correspondente encontrado.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* 4. CONTRATOS & COMPROMISSOS */}
        {activeTab === 'contratos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Create Contract Form */}
            <div className="lg:col-span-4 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1E1E26]/50 space-y-4">
              <h3 className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck size={14} className="text-indigo-500" />
                Registar Contrato / Compromisso
              </h3>
              <form onSubmit={handleAddContrato} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">Referência / Código</label>
                    <input 
                      type="text" 
                      placeholder="Ex: CON-2026-98" 
                      value={conForm.numero}
                      onChange={e => setConForm({...conForm, numero: e.target.value})}
                      className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">Tipo</label>
                    <select 
                      value={conForm.tipo}
                      onChange={e => setConForm({...conForm, tipo: e.target.value})}
                      className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    >
                      <option value="Venda">Venda (Receita para nós)</option>
                      <option value="Compra">Compra (Custos para nós)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase">Título do Contrato</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Fornecimento de Hortaliças Frescas" 
                    value={conForm.titulo}
                    onChange={e => setConForm({...conForm, titulo: e.target.value})}
                    className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">Empresa Parceira</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Hotel Império" 
                      value={conForm.parceiro}
                      onChange={e => setConForm({...conForm, parceiro: e.target.value})}
                      className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">Valor Total (Kz)</label>
                    <input 
                      type="number" 
                      placeholder="Ex: 3600000" 
                      value={conForm.valorTotal}
                      onChange={e => setConForm({...conForm, valorTotal: e.target.value})}
                      className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">Data de Início</label>
                    <input 
                      type="date" 
                      value={conForm.dataInicio}
                      onChange={e => setConForm({...conForm, dataInicio: e.target.value})}
                      className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">Data de Fim</label>
                    <input 
                      type="date" 
                      value={conForm.dataFim}
                      onChange={e => setConForm({...conForm, dataFim: e.target.value})}
                      className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase">Cláusulas e Compromissos Principais</label>
                  <textarea 
                    placeholder="Regras de entrega, periodicidade de vistorias, datas de pagamento vigentes..." 
                    value={conForm.compromissos}
                    onChange={e => setConForm({...conForm, compromissos: e.target.value})}
                    className="w-full h-20 p-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13131A] rounded-xl outline-none resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Registar Acordo
                </button>
              </form>
            </div>

            {/* Contracts List */}
            <div className="lg:col-span-8 p-5 border border-gray-200 dark:border-gray-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Acompanhamento e Vencimentos de Contratos</h3>
              
              <div className="space-y-3.5 max-h-[550px] overflow-y-auto pr-1">
                {filteredContratos.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50/40 dark:hover:bg-[#1E1E26]/40 transition-all space-y-3">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-mono font-bold">{c.numero}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            c.tipo === 'Venda' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600' : 'bg-red-50 dark:bg-red-950 text-red-600'
                          }`}>
                            Contrato {c.tipo}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-gray-900 dark:text-white">{c.titulo}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {getContractStatusBadge(c.dataFim, c.estado)}
                        <select 
                          value={c.estado} 
                          onChange={e => changeContratoEstado(c.id, e.target.value)}
                          className="px-2 py-1 bg-gray-50 dark:bg-[#1E1E28] text-[10px] font-bold rounded border border-gray-200 dark:border-gray-800 cursor-pointer"
                        >
                          <option value="Ativo">Ativo</option>
                          <option value="Em Revisão">Em Revisão</option>
                          <option value="Suspenso">Suspenso</option>
                          <option value="Expirado">Expirado</option>
                        </select>
                        <button 
                          onClick={() => handleDeleteItem('contratos', c.id)}
                          className="p-1 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                          title="Remover contrato"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] text-gray-400 font-mono">
                      <div><strong className="text-gray-600 dark:text-gray-300">Parceiro:</strong> {c.parceiro}</div>
                      <div><strong className="text-gray-600 dark:text-gray-300">Valor Acordado:</strong> {c.valorTotal.toLocaleString()} Kz</div>
                      <div><strong className="text-gray-600 dark:text-gray-300">Vigência:</strong> {c.dataInicio} a {c.dataFim}</div>
                    </div>

                    {c.compromissos && (
                      <div className="p-3 bg-gray-50 dark:bg-black/10 rounded-xl space-y-1">
                        <span className="text-[9px] font-black uppercase text-indigo-500 tracking-wider flex items-center gap-1">
                          <CheckCircle size={10} /> Cláusulas & Compromissos Regulamentares
                        </span>
                        <p className="text-[10px] text-gray-500 leading-relaxed">{c.compromissos}</p>
                      </div>
                    )}
                  </div>
                ))}

                {filteredContratos.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-xs">
                    Nenhum contrato correspondente encontrado.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
