/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Sparkles,
  GripVertical,
  Eye,
  Edit3,
  X,
  ExternalLink,
  Building2,
  Tag
} from 'lucide-react';

interface CommercialCRMModuleProps {
  userId: string;
  userRole: string;
  initialSubTab?: 'pipeline' | 'clientes' | 'fornecedores' | 'contratos';
  onSubTabChange?: (tab: 'pipeline' | 'clientes' | 'fornecedores' | 'contratos') => void;
  key?: string;
}

export default function CommercialCRMModule({ userId, userRole, initialSubTab, onSubTabChange }: CommercialCRMModuleProps) {
  // --- SUB-SECTIONS NAVIGATION ---
  const [activeTab, setActiveTab] = useState<'pipeline' | 'clientes' | 'fornecedores' | 'contratos'>(initialSubTab || 'pipeline');

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleTabSelect = (tab: 'pipeline' | 'clientes' | 'fornecedores' | 'contratos') => {
    setActiveTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  // --- 1. PIPELINE & OPORTUNIDADES STATE ---
  const [oportunidades, setOportunidades] = useState<any[]>(() => {
    const saved = localStorage.getItem(`mirawelch-crm-oportunidades-${userId}`) || localStorage.getItem(`olo-fintel-crm-oportunidades-${userId}`);
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
    const saved = localStorage.getItem(`mirawelch-crm-clientes-${userId}`) || localStorage.getItem(`olo-fintel-crm-clientes-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'cli-1', nome: 'Hotel Império S.A.', contacto: 'Mateus Gaspar', telefone: '+244 923 456 789', email: 'compras@hotelimperio.ao', provincia: 'Luanda', status: 'Ativo', historico: 'Cliente recorrente desde 2024. Pagamentos em dia.', valorGasto: 3400000 },
      { id: 'cli-2', nome: 'Sociedade de Frio do Namibe', contacto: 'Sebastião Simão', telefone: '+244 912 345 678', email: 'namibefrio@netangola.co.ao', provincia: 'Namibe', status: 'Ativo', historico: 'Compra pontual de grande volume de pescado.', valorGasto: 8900000 },
      { id: 'cli-3', nome: 'Cooperativa Agrícola da Caála', contacto: 'Ana Maria', telefone: '+244 934 789 123', email: 'caala.coop@gmail.com', provincia: 'Huambo', status: 'Inativo', historico: 'Interrupção temporária devido à reestruturação de infraestruturas.', valorGasto: 1200000 }
    ];
  });

  // --- 3. GESTÃO DE FORNECEDORES STATE ---
  const [fornecedores, setFornecedores] = useState<any[]>(() => {
    const saved = localStorage.getItem(`mirawelch-crm-fornecedores-${userId}`) || localStorage.getItem(`olo-fintel-crm-fornecedores-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'for-1', nome: 'AngoAlimentos Lda', contacto: 'Dr. Álvaro Pires', telefone: '+244 921 554 112', email: 'comercial@angoalimentos.ao', categoria: 'Fertilizantes e Sementes', avaliacaoQualidade: 5, avaliacaoPrazo: 4, avaliacaoComunicacao: 5, notas: 'Fornecedor principal de adubos. Boa flexibilidade de crédito.' },
      { id: 'for-2', nome: 'Mecânica Express do Sul', contacto: 'Eng. Carlos Vaz', telefone: '+244 911 332 445', email: 'vendas@mecanicaexpress.co.ao', categoria: 'Manutenção de Frota', avaliacaoQualidade: 4, avaliacaoPrazo: 3, avaliacaoComunicacao: 4, notas: 'Oficina certificada. Prazos às vezes derrapam devido a peças importadas.' },
      { id: 'for-3', nome: 'PetroAngola Combustíveis', contacto: 'Dra. Isabel Silva', telefone: '+244 944 887 221', email: 'isabel.petro@petroangola.ao', categoria: 'Combustíveis e Lubrificantes', avaliacaoQualidade: 5, avaliacaoPrazo: 5, avaliacaoComunicacao: 4, notas: 'Fornecimento regular de gasóleo agrícola com subsídio governamental.' }
    ];
  });

  // --- 4. CONTRATOS STATE ---
  const [contratos, setContratos] = useState<any[]>(() => {
    const saved = localStorage.getItem(`mirawelch-crm-contratos-${userId}`) || localStorage.getItem(`olo-fintel-crm-contratos-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'con-1', numero: 'CON-2026-001', titulo: 'Acordo Fornecimento de Hortaliças frescas', parceiro: 'Hotel Império S.A.', tipo: 'Venda', valorTotal: 3600000, dataInicio: '2026-01-01', dataFim: '2026-12-31', estado: 'Ativo', compromissos: 'Entrega semanal de 500kg de produtos selecionados às terças-feiras.' },
      { id: 'con-2', numero: 'CON-2026-002', titulo: 'Prestação de Assistência Mecânica Preventiva', parceiro: 'Mecânica Express do Sul', tipo: 'Compra', valorTotal: 1440000, dataInicio: '2026-03-15', dataFim: '2027-03-14', estado: 'Em Revisão', compromissos: 'Duas manutenções preventivas completas aos tratores principais a cada 6 meses.' },
      { id: 'con-3', numero: 'CON-2025-019', titulo: 'Fornecimento de Ração para Engorda Rápida', parceiro: 'AngoAlimentos Lda', tipo: 'Compra', valorTotal: 5200000, dataInicio: '2025-06-01', dataFim: '2026-06-01', estado: 'Expirado', compromissos: 'Entrega mensal de 10 toneladas de ração classe A com pagamento a 30 dias.' }
    ];
  });

  // --- PERSISTENCE EFFECT ---
  useEffect(() => { localStorage.setItem(`mirawelch-crm-oportunidades-${userId}`, JSON.stringify(oportunidades)); }, [oportunidades, userId]);
  useEffect(() => { localStorage.setItem(`mirawelch-crm-clientes-${userId}`, JSON.stringify(clientes)); }, [clientes, userId]);
  useEffect(() => { localStorage.setItem(`mirawelch-crm-fornecedores-${userId}`, JSON.stringify(fornecedores)); }, [fornecedores, userId]);
  useEffect(() => { localStorage.setItem(`mirawelch-crm-contratos-${userId}`, JSON.stringify(contratos)); }, [contratos, userId]);

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

  // --- DRAG AND DROP & MODAL POPUP STATES ---
  const [draggedOpId, setDraggedOpId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  // Detail Popups
  const [selectedOpportunity, setSelectedOpportunity] = useState<any | null>(null);
  const [isEditingOp, setIsEditingOp] = useState(false);
  const [opModalForm, setOpModalForm] = useState<any>(null);

  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
  const [selectedContract, setSelectedContract] = useState<any | null>(null);

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

  // Direct Stage movement for Drag and Drop or Dropdown Selection
  const moveOportunidadeToStage = (id: string, targetStage: string) => {
    const probsMap: Record<string, number> = { Lead: 20, Contactado: 40, Negociação: 60, Contrato: 80, Cliente: 100 };
    setOportunidades(prev => prev.map(op => {
      if (op.id !== id) return op;
      return {
        ...op,
        estagio: targetStage,
        probabilidade: probsMap[targetStage] ?? op.probabilidade
      };
    }));
    triggerAlert(`Oportunidade movida para a fase: ${targetStage}`);
  };

  const handleConvertToClient = (op: any) => {
    const newCli = {
      id: `cli-${Date.now()}`,
      nome: op.cliente || op.titulo,
      contacto: 'Contacto Comercial Focal',
      telefone: '+244 923 000 000',
      email: '',
      provincia: 'Luanda',
      status: 'Ativo',
      historico: `Convertido a partir da Oportunidade do CRM "${op.titulo}" com valor de ${op.valor.toLocaleString()} Kz.`,
      valorGasto: op.valor || 0
    };
    setClientes(prev => [newCli, ...prev]);
    moveOportunidadeToStage(op.id, 'Cliente');
    if (selectedOpportunity && selectedOpportunity.id === op.id) {
      setSelectedOpportunity({ ...selectedOpportunity, estagio: 'Cliente', probabilidade: 100 });
    }
    triggerAlert(`"${op.cliente || op.titulo}" foi adicionado com sucesso aos Clientes Ativos!`);
  };

  const handleConvertToContract = (op: any) => {
    const newCon = {
      id: `con-${Date.now()}`,
      numero: `CON-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      titulo: `Contrato de ${op.titulo}`,
      parceiro: op.cliente || op.titulo,
      tipo: 'Venda',
      valorTotal: op.valor,
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      estado: 'Ativo',
      compromissos: op.notas || 'Contrato comercial gerado a partir do funil de vendas.'
    };
    setContratos(prev => [newCon, ...prev]);
    moveOportunidadeToStage(op.id, 'Contrato');
    if (selectedOpportunity && selectedOpportunity.id === op.id) {
      setSelectedOpportunity({ ...selectedOpportunity, estagio: 'Contrato', probabilidade: 80 });
    }
    triggerAlert(`Contrato "${newCon.numero}" gerado a partir desta oportunidade!`);
  };

  const handleSaveOpModal = () => {
    if (!opModalForm) return;
    setOportunidades(prev => prev.map(op => op.id === opModalForm.id ? { ...opModalForm } : op));
    setSelectedOpportunity({ ...opModalForm });
    setIsEditingOp(false);
    triggerAlert('Detalhes da oportunidade atualizados com sucesso!');
  };

  // Move stage inside Pipeline (Step buttons)
  const moveOportunidadeStage = (id: string, direction: 'PREV' | 'NEXT') => {
    setOportunidades(prev => prev.map(op => {
      if (op.id !== id) return op;
      const currentIndex = pipelineStages.indexOf(op.estagio);
      let nextIndex = currentIndex;
      if (direction === 'PREV' && currentIndex > 0) nextIndex = currentIndex - 1;
      if (direction === 'NEXT' && currentIndex < pipelineStages.length - 1) nextIndex = currentIndex + 1;
      
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
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-wider">
              • Submódulo: {
                activeTab === 'pipeline' ? 'Oportunidades & Funil' :
                activeTab === 'clientes' ? 'Gestão de Clientes' :
                activeTab === 'fornecedores' ? 'Fornecedores & Parcerias' :
                'Contratos Comerciais'
              }
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

      {/* FLOATING ACTION TOAST (Fixed position so it never shifts page layout) */}
      <AnimatePresence>
        {crmAlert && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 p-3.5 px-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-xl border border-indigo-400/30 backdrop-blur-md"
          >
            <Sparkles size={15} className="text-amber-300 shrink-0" />
            <span>{crmAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

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



      {/* --- RENDER CONTENT AREA --- */}
      <div className="space-y-6">

        {/* 1. PIPELINE (KANBAN BOARD) & SALES FORECASTING */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            
            {/* Sales Forecasting Info */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-indigo-600 dark:text-indigo-400" />
                  Funil de Vendas Comercial
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  Arraste os negócios entre as colunas para atualizar a fase ou clique no cartão para ver todos os detalhes e emitir contratos.
                </p>
              </div>
            </div>

            {/* Pipeline Stage Swimlanes (Kanban with Drag and Drop) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {pipelineStages.map(stage => {
                const stageOps = oportunidades.filter(op => op.estagio === stage);
                const stageTotal = stageOps.reduce((sum, op) => sum + op.valor, 0);
                const isOver = dragOverStage === stage;

                return (
                  <div 
                    key={stage} 
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      if (dragOverStage !== stage) setDragOverStage(stage);
                    }}
                    onDragLeave={(e) => {
                      if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                      if (dragOverStage === stage) setDragOverStage(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const opId = e.dataTransfer.getData('text/plain') || draggedOpId;
                      setDragOverStage(null);
                      setDraggedOpId(null);
                      if (opId) {
                        moveOportunidadeToStage(opId, stage);
                      }
                    }}
                    className={`bg-gray-50/80 dark:bg-[#1A1A22] p-3.5 rounded-2xl border transition-colors duration-150 flex flex-col h-[460px] ${
                      isOver 
                        ? 'border-2 border-dashed border-indigo-500 bg-indigo-500/10' 
                        : 'border-gray-200/60 dark:border-gray-800/80'
                    }`}
                  >
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2 mb-3 shrink-0">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                          {stage}
                        </h4>
                        <span className="text-[10px] text-gray-400">{stageOps.length} {stageOps.length === 1 ? 'negócio' : 'negócios'}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                        {stageTotal >= 1000000 ? `${(stageTotal/1000000).toFixed(1)}M Kz` : `${stageTotal.toLocaleString()} Kz`}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1 overflow-y-auto h-full pr-1 scrollbar-thin">
                      <AnimatePresence>
                        {stageOps.map(op => (
                          <motion.div 
                            key={op.id} 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            whileHover={{ y: -2 }}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', op.id);
                              e.dataTransfer.effectAllowed = 'move';
                              setDraggedOpId(op.id);
                            }}
                            onDragEnd={() => {
                              setDraggedOpId(null);
                              setDragOverStage(null);
                            }}
                            onClick={() => setSelectedOpportunity(op)}
                            className={`p-3.5 bg-white dark:bg-[#121218] rounded-2xl border space-y-2.5 transition-all cursor-grab active:cursor-grabbing group relative ${
                              draggedOpId === op.id 
                                ? 'opacity-30 border-dashed border-indigo-500 shadow-none' 
                                : 'border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800'
                            }`}
                          >
                            {/* Card Header: Client Badge & Action */}
                            <div className="flex justify-between items-center gap-1">
                              <span className="px-2 py-0.5 text-[9px] font-semibold rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 truncate max-w-[130px]">
                                {op.cliente}
                              </span>

                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                <button 
                                  onClick={() => handleDeleteItem('oportunidades', op.id)}
                                  className="p-1 text-gray-300 hover:text-red-500 transition-colors cursor-pointer rounded"
                                  title="Eliminar"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Card Title */}
                            <h5 className="text-[12px] font-bold text-gray-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {op.titulo}
                            </h5>

                            {/* Amount & Progress */}
                            <div className="space-y-1 pt-0.5">
                              <div className="flex justify-between items-baseline text-xs">
                                <span className="font-extrabold text-gray-900 dark:text-white">
                                  {op.valor.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">Kz</span>
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                                  {op.probabilidade}% prob.
                                </span>
                              </div>

                              {/* Minimal probability bar */}
                              <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                  style={{ width: `${op.probabilidade}%` }}
                                />
                              </div>
                            </div>

                            {/* Card Footer: Date & Stage controls */}
                            <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800/60 pt-2 text-[10px] text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar size={11} className="text-gray-300 dark:text-gray-600" />
                                <span>{op.fechoPrevisto}</span>
                              </div>

                              {/* Quick Stage Controls */}
                              <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                                <button 
                                  disabled={stage === 'Lead'}
                                  onClick={() => moveOportunidadeStage(op.id, 'PREV')}
                                  className="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 cursor-pointer transition-colors"
                                  title="Recuar fase"
                                >
                                  <ChevronLeft size={12} />
                                </button>
                                <button 
                                  disabled={stage === 'Cliente'}
                                  onClick={() => moveOportunidadeStage(op.id, 'NEXT')}
                                  className="p-1 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 disabled:opacity-20 cursor-pointer transition-colors"
                                  title="Avançar fase"
                                >
                                  <ChevronRight size={12} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {stageOps.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-14 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400">
                          <span className="text-[11px] font-medium text-gray-400">Arraste negócios para aqui</span>
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
                      <option value="Cunene">Cunene</option>
                      <option value="Cubango">Cubango</option>
                      <option value="Cuando">Cuando</option>
                      <option value="Moxico Leste">Moxico Leste</option>
                      <option value="Moxico">Moxico</option>
                      <option value="Lunda Sul">Lunda Sul</option>
                      <option value="Lunda Norte">Lunda Norte</option>
                      <option value="Bié">Bié</option>
                      <option value="Malanje">Malanje</option>
                      <option value="Benguela">Benguela</option>
                      <option value="Cuanza Sul">Cuanza Sul</option>
                      <option value="Cuanza Norte">Cuanza Norte</option>
                      <option value="Uíge">Uíge</option>
                      <option value="Zaire">Zaire</option>
                      <option value="Icolo e Bengo">Icolo e Bengo</option>
                      <option value="Bengo">Bengo</option>
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

      {/* --- 1. OPPORTUNITY DETAIL POPUP MODAL --- */}
      <AnimatePresence>
        {selectedOpportunity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#1A1A22] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                    Oportunidade Comercial
                  </span>
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-1">
                    {selectedOpportunity.titulo}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Building2 size={12} className="text-gray-400" /> Cliente: <strong className="text-gray-700 dark:text-gray-300">{selectedOpportunity.cliente}</strong>
                  </p>
                </div>
                <button 
                  onClick={() => { setSelectedOpportunity(null); setIsEditingOp(false); }}
                  className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Stage Stepper Buttons */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Fase do Negócio</label>
                <div className="grid grid-cols-5 gap-1 bg-gray-50 dark:bg-black/20 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
                  {pipelineStages.map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        moveOportunidadeToStage(selectedOpportunity.id, st);
                        const probsMap: Record<string, number> = { Lead: 20, Contactado: 40, Negociação: 60, Contrato: 80, Cliente: 100 };
                        setSelectedOpportunity(prev => prev ? { ...prev, estagio: st, probabilidade: probsMap[st] ?? prev.probabilidade } : null);
                      }}
                      className={`py-2 px-1 text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center ${
                        selectedOpportunity.estagio === st
                          ? 'bg-indigo-600 text-white shadow-md font-black'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Form or View */}
              {!isEditingOp ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-[#12121A] rounded-2xl border border-gray-100 dark:border-gray-800">
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Valor Estimado</span>
                      <p className="text-base font-black text-gray-900 dark:text-white mt-1">
                        {selectedOpportunity.valor.toLocaleString()} Kz
                      </p>
                    </div>

                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-950">
                      <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Probabilidade</span>
                      <p className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-1">
                        {selectedOpportunity.probabilidade}%
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-950 col-span-2 sm:col-span-1">
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Valor Ponderado</span>
                      <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        {((selectedOpportunity.valor * selectedOpportunity.probabilidade) / 100).toLocaleString(undefined, {maximumFractionDigits: 0})} Kz
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-[#12121A] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1">
                      <Calendar size={11} /> Previsão de Fecho Do Negócio
                    </span>
                    <p className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
                      {selectedOpportunity.fechoPrevisto}
                    </p>
                  </div>

                  {selectedOpportunity.notas && (
                    <div className="p-4 bg-gray-50 dark:bg-[#12121A] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Notas & Observações Comerciais</span>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                        "{selectedOpportunity.notas}"
                      </p>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setOpModalForm({ ...selectedOpportunity }); setIsEditingOp(true); }}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 size={13} /> Editar Oportunidade
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteItem('oportunidades', selectedOpportunity.id);
                          setSelectedOpportunity(null);
                        }}
                        className="px-3 py-2 bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Eliminar
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConvertToContract(selectedOpportunity)}
                        className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileCheck size={13} /> Gerar Contrato
                      </button>
                      <button
                        onClick={() => handleConvertToClient(selectedOpportunity)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Users size={13} /> Converter em Cliente
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit Form inside Modal */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase">Título da Oportunidade</label>
                      <input 
                        type="text" 
                        value={opModalForm.titulo}
                        onChange={e => setOpModalForm({ ...opModalForm, titulo: e.target.value })}
                        className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12121A] rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase">Cliente Potencial</label>
                      <input 
                        type="text" 
                        value={opModalForm.cliente}
                        onChange={e => setOpModalForm({ ...opModalForm, cliente: e.target.value })}
                        className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12121A] rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase">Valor Estimado (Kz)</label>
                      <input 
                        type="number" 
                        value={opModalForm.valor}
                        onChange={e => setOpModalForm({ ...opModalForm, valor: parseFloat(e.target.value || '0') })}
                        className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12121A] rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase">Probabilidade ({opModalForm.probabilidade}%)</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5"
                        value={opModalForm.probabilidade}
                        onChange={e => setOpModalForm({ ...opModalForm, probabilidade: parseInt(e.target.value) })}
                        className="w-full mt-3 accent-indigo-600 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase">Data de Fecho</label>
                      <input 
                        type="date" 
                        value={opModalForm.fechoPrevisto}
                        onChange={e => setOpModalForm({ ...opModalForm, fechoPrevisto: e.target.value })}
                        className="w-full h-9 px-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12121A] rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase">Observações</label>
                    <textarea 
                      value={opModalForm.notas}
                      onChange={e => setOpModalForm({ ...opModalForm, notas: e.target.value })}
                      className="w-full h-20 p-3 mt-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12121A] rounded-xl outline-none resize-none"
                    />
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingOp(false)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveOpModal}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md"
                    >
                      Guardar Alterações
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- 2. CLIENT DETAIL POPUP MODAL --- */}
      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#1A1A22] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider">
                    Perfil de Cliente CRM
                  </span>
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-1">{selectedClient.nome}</h3>
                </div>
                <button onClick={() => setSelectedClient(null)} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 dark:bg-[#12121A] rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Estado</span>
                  <p className="font-bold text-emerald-600 mt-0.5">{selectedClient.status}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-[#12121A] rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Província</span>
                  <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">{selectedClient.provincia}</p>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 dark:bg-[#12121A] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2 text-xs">
                <div className="flex items-center gap-2"><Phone size={13} className="text-indigo-500" /> <strong>Telefone:</strong> {selectedClient.telefone || 'N/D'}</div>
                <div className="flex items-center gap-2"><Mail size={13} className="text-indigo-500" /> <strong>E-mail:</strong> {selectedClient.email || 'N/D'}</div>
                <div className="flex items-center gap-2"><Users size={13} className="text-indigo-500" /> <strong>Contacto Focal:</strong> {selectedClient.contacto || 'N/D'}</div>
              </div>

              {selectedClient.historico && (
                <div className="p-3.5 bg-gray-50 dark:bg-[#12121A] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Histórico do Cliente</span>
                  <p className="text-xs text-gray-600 dark:text-gray-300 italic">"{selectedClient.historico}"</p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button onClick={() => setSelectedClient(null)} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer">
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
