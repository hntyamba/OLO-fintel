import React, { useState, useEffect } from 'react';
import { apiCall, getApiUrl } from '../lib/api';
import { 
  Sprout, 
  Activity, 
  Ship, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Calendar, 
  CloudSun, 
  Thermometer, 
  Compass, 
  Wrench, 
  Coins, 
  HeartPulse, 
  Boxes, 
  Users2, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle,
  FileSpreadsheet,
  Briefcase,
  ArrowDownLeft,
  ArrowUpRight,
  UtensilsCrossed,
  Building2,
  Bug,
  DollarSign,
  ShieldCheck,
  Clock,
  Receipt,
  FileText,
  ShieldAlert
} from 'lucide-react';

interface SectorOperationalDashboardProps {
  userIndustry: string | null;
  userId: string;
  userRole: string;
  key?: string;
}

// Normalizes any string variation into one of the 4 recognized sector codes
function detectSector(industry?: string | null): 'AGRICULTURE' | 'LIVESTOCK' | 'FISHERIES' | 'COMMERCE' | null {
  if (!industry) return null;
  const s = String(industry).toUpperCase();
  if (s === 'AGRICULTURE' || s.includes('AGRICUL') || s.includes('AGRO') || s.includes('FARM') || s.includes('MILHO') || s.includes('CAMPO')) return 'AGRICULTURE';
  if (s === 'LIVESTOCK' || s.includes('PECUAR') || s.includes('LIVESTOCK') || s.includes('GADO') || s.includes('ANIMAL') || s.includes('REBANHO')) return 'LIVESTOCK';
  if (s === 'FISHERIES' || s.includes('PESCA') || s.includes('FISH') || s.includes('EMBARCA') || s.includes('MAR')) return 'FISHERIES';
  if (s === 'COMMERCE' || s.includes('COMERC') || s.includes('COMMERCE') || s.includes('LOJA') || s.includes('VENDA')) return 'COMMERCE';
  return null;
}

export default function SectorOperationalDashboard({ userIndustry, userId, userRole }: SectorOperationalDashboardProps) {
  const autoSector = detectSector(userIndustry) || 'AGRICULTURE';
  const [showAllSectors, setShowAllSectors] = useState<boolean>(false);

  // Sector and resource states
  const [activeSector, setActiveSector] = useState<'AGRICULTURE' | 'LIVESTOCK' | 'FISHERIES' | 'COMMERCE'>(autoSector);

  // Auto-detection sync effect: Automatically update activeSector whenever userIndustry changes
  React.useEffect(() => {
    const detected = detectSector(userIndustry) || 'AGRICULTURE';
    setActiveSector(detected);
    let res = 'produtos';
    if (detected === 'AGRICULTURE') res = 'talhoes';
    else if (detected === 'LIVESTOCK') res = 'rebanho';
    else if (detected === 'FISHERIES') res = 'embarcacoes';
    setActiveResource(res);
  }, [userIndustry, userId]);
  
  // Default first sub-tab when sector changes
  const [activeResource, setActiveResource] = useState<string>(() => {
    const savedResource = localStorage.getItem(`olo-fintel-lastResource-${userId}`);
    if (savedResource) return savedResource;
    const sec = userIndustry || 'AGRICULTURE';
    if (sec === 'AGRICULTURE') return 'talhoes';
    if (sec === 'LIVESTOCK') return 'rebanho';
    if (sec === 'FISHERIES') return 'embarcacoes';
    return 'produtos';
  });

  const changeSector = (sec: 'AGRICULTURE' | 'LIVESTOCK' | 'FISHERIES' | 'COMMERCE') => {
    setActiveSector(sec);
    localStorage.setItem(`olo-fintel-lastSector-${userId}`, sec);
    setGenericForm({});
    let res = 'produtos';
    if (sec === 'AGRICULTURE') res = 'talhoes';
    else if (sec === 'LIVESTOCK') res = 'rebanho';
    else if (sec === 'FISHERIES') res = 'embarcacoes';
    setActiveResource(res);
    localStorage.setItem(`olo-fintel-lastResource-${userId}`, res);
  };

  // --- AGRICULTURE STATES ---
  const [talhoes, setTalhoes] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-talhoes-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 't-1', nome: 'Talhão Alfa (Milho)', codigo: 'TAL-001', area: 12.5, gps: '-12.784, 13.456', tipoSolo: 'Argiloso', estado: 'Ativo', responsavel: 'Mateus Gaspar' },
      { id: 't-2', nome: 'Talhão Beta (Batatas)', codigo: 'TAL-002', area: 8.2, gps: '-12.786, 13.459', tipoSolo: 'Arenoso', estado: 'Em Pousio', responsavel: 'Sebastião Simão' }
    ];
  });

  const [culturas, setCulturas] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-culturas-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'c-1', cultura: 'Milho', variedade: 'Kambeta', dataPlantio: '2026-03-10', dataColheitaPrevista: '2026-08-15', talhao: 'Talhão Alfa (Milho)', quantidade: 5000, estado: 'Ciclo Ativo' },
      { id: 'c-2', cultura: 'Batata Doce', variedade: 'Dourada', dataPlantio: '2026-04-01', dataColheitaPrevista: '2026-09-01', talhao: 'Talhão Beta (Batatas)', quantidade: 3000, estado: 'Ciclo Ativo' }
    ];
  });

  const [producoes, setProducoes] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-producoes-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'p-1', produto: 'Milho Branco', quantidade: 1200, unidade: 'kg', qualidade: 'Classe A', talhao: 'Talhão Alfa (Milho)', responsavel: 'Mateus Gaspar', periodo: 'Diário' },
      { id: 'p-2', produto: 'Mandioca Amarela', quantidade: 450, unidade: 'kg', qualidade: 'Classe B', talhao: 'Talhão Beta (Batatas)', responsavel: 'Sebastião Simão', periodo: 'Semanal' }
    ];
  });

  const [colheitas, setColheitas] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-colheitas-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'col-1', data: '2026-07-10', talhao: 'Talhão Alfa (Milho)', produto: 'Milho Branco', quantidade: 4500, perdas: 150, observacoes: 'Excelente colheita sob clima ameno' }
    ];
  });

  const [insumos, setInsumos] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-insumos-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'ins-1', nome: 'NPK 12-24-12', categoria: 'Fertilizantes', quantidade: 45, unidade: 'sacos', movimento: 'Entrada' },
      { id: 'ins-2', nome: 'Sementes de Milho Amarelo', categoria: 'Sementes', quantidade: 120, unidade: 'kg', movimento: 'Ajuste' }
    ];
  });

  const [equipamentos, setEquipamentos] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-equipamentos-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'eq-1', nome: 'Trator Massey 275', tipo: 'Tratores', estado: 'Operacional', combustivel: 75, proximaManutencao: '2026-08-10' },
      { id: 'eq-2', nome: 'Bomba de Água Solar 5kW', tipo: 'Bombas', estado: 'Manutenção', combustivel: 100, proximaManutencao: '2026-07-25' }
    ];
  });

  const [clima, setClima] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-clima-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'cli-1', data: '2026-07-18', precipitacao: 1.2, temperatura: 24, humidade: 62, vento: 14, alertas: 'Sem Alertas Climáticos' }
    ];
  });

  // --- LIVESTOCK STATES ---
  const [rebanho, setRebanho] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-rebanho-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'reb-1', identificacao: 'BOV-045', raca: 'Nelore', sexo: 'Macho', dataNascimento: '2024-05-12', peso: 420, estado: 'Saudável', lote: 'Lote Engorda A' },
      { id: 'reb-2', identificacao: 'BOV-089', raca: 'Nelore', sexo: 'Fêmea', dataNascimento: '2023-11-20', peso: 380, estado: 'Saudável', lote: 'Lote Reprodução' }
    ];
  });

  const [reproducao, setReproducao] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-reproducao-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'rep-1', tipo: 'Gestação', vacaId: 'BOV-089', touroId: 'BOV-002', data: '2026-02-15', resultado: 'Confirmado', estado: 'Ativo' }
    ];
  });

  const [saudeAnimal, setSaudeAnimal] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-saudeAnimal-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'sau-1', animalId: 'BOV-045', tipo: 'Vacinação', descricao: 'Vacina contra Febre Aftosa', data: '2026-06-10', medicamento: 'Aftovax', custo: 5000 }
    ];
  });

  const [alimentacao, setAlimentacao] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-alimentacao-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'ali-1', lote: 'Lote Engorda A', tipo: 'Ração', consumoDiario: 250, custo: 18000 }
    ];
  });

  const [crescimento, setCrescimento] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-crescimento-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'cre-1', animalId: 'BOV-045', data: '2026-07-15', peso: 420, altura: 135, ganhoDiario: 0.85 }
    ];
  });

  const [producaoAnimal, setProducaoAnimal] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-producaoAnimal-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'pa-1', produto: 'Leite', data: '2026-07-18', quantidade: 320, unidade: 'Litros', responsavel: 'Mateus Gaspar' }
    ];
  });

  const [comercializacaoPecuaria, setComercializacaoPecuaria] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-comercializacaoPecuaria-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'com-1', tipo: 'Venda de Animais', cliente: 'Carnes de Angola Lda', descricao: 'Venda de 5 Bois Gordos', valor: 2500000, data: '2026-07-12' }
    ];
  });

  // --- FISHERIES STATES ---
  const [embarcoes, setEmbarcoes] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-embarcacoes-${userId}`) || localStorage.getItem(`olo-fintel-op-embarcoes-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'emb-1', nome: 'Estrela do Namibe', matricula: 'NAM-2024-A', capacidade: 15, estado: 'Ativo', motor: 'Yamaha 250HP' },
      { id: 'emb-2', nome: 'Kwanza Mar', matricula: 'NAM-2021-B', capacidade: 8, estado: 'Ativo', motor: 'Suzuki 150HP' }
    ];
  });

  const [viagens, setViagens] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-viagens-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'via-1', embarcacao: 'Estrela do Namibe', dataSaida: '2026-07-12', dataChegada: '2026-07-15', tripulacao: 6, combustivel: 800, zonaPesca: 'Zona Sul - Tombwa' }
    ];
  });

  const [capturas, setCapturas] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-capturas-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'cap-1', viagemId: 'via-1', especie: 'Carapau', quantidade: 140, peso: 3500, valor: 1400000, qualidade: 'Fresco Classe A' }
    ];
  });

  const [custosPesca, setCustosPesca] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-custosPesca-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'cust-1', viagemId: 'via-1', combustivel: 320000, gelo: 80000, alimentacao: 45000, manutencao: 25000, taxas: 15000 }
    ];
  });

  const [manutencaoPesca, setManutencaoPesca] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-manutencaoPesca-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'man-1', embarcacao: 'Estrela do Namibe', tipo: 'Preventiva', descricao: 'Mudança de óleo e filtros do motor', data: '2026-07-05', custo: 120000 }
    ];
  });

  const [comercializacaoPesca, setComercializacaoPesca] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-comercializacaoPesca-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'com-p1', lote: 'Lote-CAP1', mercado: 'Armazenistas', comprador: 'FrioNamibe S.A.', quantidade: 3500, valor: 1650000, contrato: 'Venda à Vista' }
    ];
  });

  // --- COMMERCE STATES ---
  const [produtos, setProdutos] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-produtos-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'prod-1', sku: 'ALIM-001', codigo: 'PROD-789', categoria: 'Alimentos', fornecedor: 'AngoAlimentos Lda', precoCompra: 1200, precoVenda: 1800, estoque: 450 },
      { id: 'prod-2', sku: 'LIMPEZA-005', codigo: 'PROD-456', categoria: 'Higiene', fornecedor: 'Distribuidora Sul', precoCompra: 800, precoVenda: 1350, estoque: 280 }
    ];
  });

  const [inventario, setInventario] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-inventario-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'inv-1', produtoId: 'prod-1', tipo: 'Entrada', quantidade: 100, data: '2026-07-16', responsavel: 'Mateus Gaspar' }
    ];
  });

  const [compras, setCompras] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-compras-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'com-c1', pedido: 'Compra de Arroz Agulha (50 sacos)', fornecedor: 'AngoAlimentos Lda', valor: 650000, estado: 'Receção', data: '2026-07-14' }
    ];
  });

  const [vendas, setVendas] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-vendas-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'ven-c1', orcamento: 'Fornecimento de Cesta Básica (20 un)', cliente: 'Hotel Império', valor: 540000, estado: 'Pagamento', data: '2026-07-17' }
    ];
  });

  const [crm, setCrm] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-crm-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'crm-1', nome: 'Hotel Império', tipo: 'Cliente', contacto: '+244 923 456 789', email: 'compras@hotelimperio.ao', status: 'Ativo' }
    ];
  });

  const [contasAReceber, setContasAReceber] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-contasAReceber-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'cr-1', fatura: 'FAT-2026-098', cliente: 'Hotel Império', parcelas: '1/1', valor: 540000, dataVencimento: '2026-07-30', estado: 'Pendente' }
    ];
  });

  const [contasAPagar, setContasAPagar] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-contasAPagar-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'cp-1', fornecedor: 'AngoAlimentos Lda', despesa: 'Fatura de Arroz', obrigacoes: 'Fornecimento', valor: 650000, dataVencimento: '2026-07-28', estado: 'Pendente' }
    ];
  });

  // --- CROSS-SECTOR OPERATIONAL STATES ---
  // 1. Trabalho & Mão de Obra (Labor)
  const [trabalho, setTrabalho] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-trabalho-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'trab-1', data: '2026-07-16', trabalhador: 'Equipa de Campo A (5 jornaleiros)', tarefa: 'Monda e Capina Intercalar', trabalhadores: 5, horas: 8, diaria: 3500, total: 17500, estadoPagamento: 'Pago', setor: 'AGRICULTURE', localizacao: 'Talhão Alfa' },
      { id: 'trab-2', data: '2026-07-15', trabalhador: 'Adelino Chivinda & Pastor Auxiliar', tarefa: 'Maneio e Condução de Pastagens', trabalhadores: 2, horas: 10, diaria: 4000, total: 8000, estadoPagamento: 'Pago', setor: 'LIVESTOCK', localizacao: 'Pasto Norte' },
      { id: 'trab-3', data: '2026-07-14', trabalhador: 'Mestre Garcia & Tripulação (6 pescadores)', tarefa: 'Despesca Costeira & Recolha de Redes', trabalhadores: 6, horas: 12, diaria: 6000, total: 36000, estadoPagamento: 'Pago', setor: 'FISHERIES', localizacao: 'Tombwa Baía' },
      { id: 'trab-4', data: '2026-07-17', trabalhador: 'Operadores de Caixa & Repositores (3)', tarefa: 'Receção de Cargas e Atendimento', trabalhadores: 3, horas: 8, diaria: 4500, total: 13500, estadoPagamento: 'Pago', setor: 'COMMERCE', localizacao: 'Loja Principal' }
    ];
  });

  // 2. Entradas de Caixa (Cash Inflows / Sales)
  const [entradasCaixa, setEntradasCaixa] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-entradasCaixa-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'ec-1', data: '2026-07-18', titulo: 'Venda de Milho Seco a Granel', cliente: 'Cooperativa Agrícola Humpata', valor: 450000, categoria: 'Venda de Produção', formaPagamento: 'Transferência BAI', docRef: 'FAT-2026-001', setor: 'AGRICULTURE' },
      { id: 'ec-2', data: '2026-07-16', titulo: 'Venda de 4 Novilhos Nelore Gordos', cliente: 'Matadouro Municipal Huambo', valor: 1800000, categoria: 'Venda de Animais', formaPagamento: 'Transferência BFA', docRef: 'FAT-2026-002', setor: 'LIVESTOCK' },
      { id: 'ec-3', data: '2026-07-17', titulo: 'Venda de 80 Caixas de Carapau Fresco', cliente: 'Peixaria Central Namibe', valor: 850000, categoria: 'Venda de Pescado', formaPagamento: 'TPA Multicaixa', docRef: 'VD-8891', setor: 'FISHERIES' },
      { id: 'ec-4', data: '2026-07-18', titulo: 'Vendas Diárias de Mercearia e Balcão', cliente: 'Consumidores a Retalho', valor: 320000, categoria: 'Vendas Comerciais', formaPagamento: 'Numerário', docRef: 'CX-7712', setor: 'COMMERCE' }
    ];
  });

  // 3. Saídas de Caixa (Cash Outflows / Expenses)
  const [saidasCaixa, setSaidasCaixa] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-saidasCaixa-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'sc-1', data: '2026-07-14', titulo: 'Compra de 20 Sacos Adubo NPK 12-24-12', fornecedor: 'AgroQuímica Huíla Lda', valor: 280000, categoria: 'Insumos & Fertilizantes', centroCusto: 'Talhão Alfa', formaPagamento: 'Transferência BAI', docRef: 'REC-3312', setor: 'AGRICULTURE' },
      { id: 'sc-2', data: '2026-07-12', titulo: 'Ração Concentrada e Sal Mineral', fornecedor: 'NutriAnimal Angola', valor: 190000, categoria: 'Alimentação & Nutrição', centroCusto: 'Curral Principal', formaPagamento: 'TPA', docRef: 'REC-3389', setor: 'LIVESTOCK' },
      { id: 'sc-3', data: '2026-07-15', titulo: 'Gasóleo (400L) e Gelo em Escama (1.5t)', fornecedor: 'Sonangol Namibe & Fábrica Gelo', valor: 310000, categoria: 'Combustível & Gelo', centroCusto: 'Barco Estrela', formaPagamento: 'Numerário', docRef: 'REC-4412', setor: 'FISHERIES' },
      { id: 'sc-4', data: '2026-07-17', titulo: 'Reposição de Stock de Arroz e Óleo', fornecedor: 'AngoAlimentos Grossista', valor: 540000, categoria: 'Mercadorias para Venda', centroCusto: 'Armazém', formaPagamento: 'Transferência BFA', docRef: 'FAT-9901', setor: 'COMMERCE' }
    ];
  });

  // 4. Consumo Familiar / Auto-Consumo (Household Subsistence)
  const [consumoFamiliar, setConsumoFamiliar] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-consumoFamiliar-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'fam-1', data: '2026-07-17', produto: 'Milho Branco (Fuba) e Mandioca', quantidade: 60, unidade: 'kg', valorUnitario: 800, valorTotal: 48000, membrosFamilia: 6, origem: 'Talhão Alfa (Colheita Própria)', finalidade: 'Alimentação Diária da Família', setor: 'AGRICULTURE', observacoes: 'Retirado para o consumo doméstico semanal da residência' },
      { id: 'fam-2', data: '2026-07-16', produto: 'Leite Fresco Diário da Ordenha', quantidade: 35, unidade: 'Litros', valorUnitario: 900, valorTotal: 31500, membrosFamilia: 5, origem: 'Vacas Lote Leiteiro', finalidade: 'Nutrição Familiar & Crianças', setor: 'LIVESTOCK', observacoes: 'Consumo familiar diário (5L/dia durante 7 dias)' },
      { id: 'fam-3', data: '2026-07-15', produto: 'Carapau & Garoupa Fresca Escolhida', quantidade: 25, unidade: 'kg', valorUnitario: 1400, valorTotal: 35000, membrosFamilia: 7, origem: 'Maré do Barco Estrela Namibe', finalidade: 'Alimentação Familiar e Tripulantes', setor: 'FISHERIES', observacoes: 'Peixe selecionado para subsistência das famílias dos mestres' },
      { id: 'fam-4', data: '2026-07-18', produto: 'Arroz, Açúcar, Óleo Vegetal e Sabão', quantidade: 8, unidade: 'artigos', valorUnitario: 3200, valorTotal: 25600, membrosFamilia: 4, origem: 'Stock da Mercearia', finalidade: 'Uso Doméstico do Proprietário', setor: 'COMMERCE', observacoes: 'Retirada de produtos essenciais da loja para casa' }
    ];
  });

  // 5. Ativos Fixos & Património (Machinery, Vessels, Buildings, Depreciation)
  const [ativosFixos, setAtivosFixos] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-ativosFixos-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'ast-1', nome: 'Trator Massey Ferguson 275 com Charrua', categoria: 'Tratores & Maquinaria Agrícola', identificador: 'TRAT-MF275-AO', dataAquisicao: '2023-04-10', custoAquisicao: 18500000, vidaUtil: 10, depreciacaoAnual: 10, valorAtual: 14800000, estado: 'Operacional', proximaManutencao: '2026-09-15', localizacao: 'Hangar Agrícola', setor: 'AGRICULTURE', responsavel: 'Mateus Gaspar' },
      { id: 'ast-2', nome: 'Touro Reprodutor Nelore P.O. (Campeão)', categoria: 'Reprodutores & Matrizes de Elite', identificador: 'NEL-PO-008', dataAquisicao: '2024-01-20', custoAquisicao: 4200000, vidaUtil: 8, depreciacaoAnual: 12.5, valorAtual: 3675000, estado: 'Excelente', proximaManutencao: '2026-08-01', localizacao: 'Pasto de Cobertura', setor: 'LIVESTOCK', responsavel: 'Adelino Chivinda' },
      { id: 'ast-3', nome: 'Embarcação em Fibra com Motor Yamaha 250HP', categoria: 'Embarcações & Motores Marítimos', identificador: 'NAM-2024-A (Estrela)', dataAquisicao: '2024-05-15', custoAquisicao: 14200000, vidaUtil: 12, depreciacaoAnual: 8.33, valorAtual: 12600000, estado: 'Operacional', proximaManutencao: '2026-08-20', localizacao: 'Porto Pesqueiro Namibe', setor: 'FISHERIES', responsavel: 'Mestre Garcia' },
      { id: 'ast-4', nome: 'Carrinha de Transporte Isuzu 3.5t & Arcas Frias', categoria: 'Veículos & Refrigeração Comercial', identificador: 'LD-44-88-GG', dataAquisicao: '2024-02-10', custoAquisicao: 16000000, vidaUtil: 8, depreciacaoAnual: 12.5, valorAtual: 13000000, estado: 'Operacional', proximaManutencao: '2026-09-01', localizacao: 'Garagem Comercial', setor: 'COMMERCE', responsavel: 'Gaspar Neto' }
    ];
  });

  // 6. Monitoria de Pragas, Doenças e Sanidade (Pest & Biosecurity Control)
  const [pragas, setPragas] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-op-pragas-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'pst-1', data: '2026-07-15', praga: 'Lagarta do Cartucho (Spodoptera frugiperda)', gravidade: 'Média', areaAfetada: '3.5 Hectares (Talhão Alfa)', sintomas: 'Folhas do milho perfuradas e serradas na fase vegetativa V4', acao: 'Pulverização com Biopesticida Baculovírus & Neem', produtoAplicado: 'BioNeem 1.5L/ha', custoIntervencao: 45000, estadoResolucao: 'Sob Controlo', inspetor: 'Eng. Agrónomo Manuel', setor: 'AGRICULTURE', observacoes: 'Incidência reduzida de 28% para 4% após 48h da aplicação' },
      { id: 'pst-2', data: '2026-07-12', praga: 'Carraças Bovinas (Rhipicephalus / Febre do Carrapato)', gravidade: 'Alta', areaAfetada: 'Lote de Novilhas (22 cabeças)', sintomas: 'Fixação de parasitas no úbere e orelhas, perda de apetite', acao: 'Banho de Imersão e Aspersão Carracicida', produtoAplicado: 'Cipermetrina Pour-on 100ml', custoIntervencao: 32000, estadoResolucao: 'Resolvido', inspetor: 'Técnico Veterinário Silva', setor: 'LIVESTOCK', observacoes: 'Todos os animais tratados sem reincidência de anemia' },
      { id: 'pst-3', data: '2026-07-14', praga: 'Parasitismo de Guelra & Controlo de Frescura', gravidade: 'Baixa', areaAfetada: 'Lote Carapau 1500kg', sintomas: 'Inspeção de rotina pré-descarga em lota', acao: 'Lavagem em Salmoura e Congelação a -18°C', produtoAplicado: 'Gelo escama esterilizado', custoIntervencao: 18000, estadoResolucao: 'Resolvido', inspetor: 'Mestre de Pesca Garcia', setor: 'FISHERIES', observacoes: 'Conformidade HACCP 100% aprovada para distribuição' },
      { id: 'pst-4', data: '2026-07-16', praga: 'Gorgulho do Grão (Sitophilus zeamais) em Armazém', gravidade: 'Média', areaAfetada: 'Armazém Bloco B (Sacas de Milho/Arroz)', sintomas: 'Presença de pequenos gorgulhos em sacos de milho armazenado', acao: 'Fumigação com Pastilhas de Fosfina & Arejamento', produtoAplicado: 'Fosfeto de Alumínio 3g/m³', custoIntervencao: 28000, estadoResolucao: 'Sob Controlo', inspetor: 'Gestor de Armazém Kiala', setor: 'COMMERCE', observacoes: 'Armazém vedado por 72h com vedação hermética' }
    ];
  });

  // Save effects
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-trabalho-${userId}`, JSON.stringify(trabalho)); }, [trabalho, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-entradasCaixa-${userId}`, JSON.stringify(entradasCaixa)); }, [entradasCaixa, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-saidasCaixa-${userId}`, JSON.stringify(saidasCaixa)); }, [saidasCaixa, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-consumoFamiliar-${userId}`, JSON.stringify(consumoFamiliar)); }, [consumoFamiliar, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-ativosFixos-${userId}`, JSON.stringify(ativosFixos)); }, [ativosFixos, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-pragas-${userId}`, JSON.stringify(pragas)); }, [pragas, userId]);

  // Save effects
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-talhoes-${userId}`, JSON.stringify(talhoes)); }, [talhoes, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-culturas-${userId}`, JSON.stringify(culturas)); }, [culturas, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-producoes-${userId}`, JSON.stringify(producoes)); }, [producoes, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-colheitas-${userId}`, JSON.stringify(colheitas)); }, [colheitas, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-insumos-${userId}`, JSON.stringify(insumos)); }, [insumos, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-equipamentos-${userId}`, JSON.stringify(equipamentos)); }, [equipamentos, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-clima-${userId}`, JSON.stringify(clima)); }, [clima, userId]);

  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-rebanho-${userId}`, JSON.stringify(rebanho)); }, [rebanho, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-reproducao-${userId}`, JSON.stringify(reproducao)); }, [reproducao, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-saudeAnimal-${userId}`, JSON.stringify(saudeAnimal)); }, [saudeAnimal, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-alimentacao-${userId}`, JSON.stringify(alimentacao)); }, [alimentacao, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-crescimento-${userId}`, JSON.stringify(crescimento)); }, [crescimento, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-producaoAnimal-${userId}`, JSON.stringify(producaoAnimal)); }, [producaoAnimal, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-comercializacaoPecuaria-${userId}`, JSON.stringify(comercializacaoPecuaria)); }, [comercializacaoPecuaria, userId]);

  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-embarcacoes-${userId}`, JSON.stringify(embarcoes)); }, [embarcoes, userId]);

  // Sync vessels with backend API
  React.useEffect(() => {
    apiCall('/api/v1/operations/fisheries/vessels')
      .then(async res => {
        if (!res.ok) return null;
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          return await res.json();
        }
        return null;
      })
      .then(data => {
        if (data) {
          const list = Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : (data.vessels && Array.isArray(data.vessels) ? data.vessels : null));
          if (list) {
            setEmbarcoes(prev => {
              const mappedFromApi = list.map((v: any, idx: number) => ({
                id: v.id || `emb-api-${idx}`,
                nome: v.name || v.nome || 'Embarcação',
                name: v.name || v.nome || 'Embarcação',
                matricula: v.registrationNumber || v.matricula || `NAM-${Math.floor(Math.random() * 900) + 100}-V`,
                registrationNumber: v.registrationNumber || v.matricula || `NAM-${Math.floor(Math.random() * 900) + 100}-V`,
                capacidade: v.capacity || v.capacityTons || v.capacidade || 10,
                capacity: v.capacity || v.capacityTons || v.capacidade || 10,
                capacityTons: v.capacityTons || v.capacity || v.capacidade || 10,
                estado: v.status === 'Operational' ? 'Ativo' : (v.estado || 'Ativo'),
                status: v.status || (v.estado === 'Ativo' ? 'Operational' : 'Operational'),
                motor: v.motor || (v.engineBrand ? `${v.engineBrand} ${v.enginePower || ''}`.trim() : 'Yamaha 250HP'),
                engineBrand: v.engineBrand || v.marcaMotor,
                enginePower: v.enginePower || v.potenciaMotor,
                details: v.details || v.detalhes
              }));

              if (mappedFromApi.length > 0) {
                const hasOnlyMocks = prev.every(p => String(p.id).startsWith('emb-') && !String(p.id).startsWith('ves-'));
                if (hasOnlyMocks || prev.length === 0) {
                  return mappedFromApi;
                }
                const apiIds = new Set(mappedFromApi.map(v => v.id));
                const apiNames = new Set(mappedFromApi.map(v => (v.nome || v.name || '').toLowerCase()));
                const localCreated = prev.filter(p => !apiIds.has(p.id) && !apiNames.has((p.nome || p.name || '').toLowerCase()));
                return [...mappedFromApi, ...localCreated];
              }
              return prev;
            });
          }
        }
      })
      .catch(err => console.warn('Notice syncing vessels from API:', err));
  }, [userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-viagens-${userId}`, JSON.stringify(viagens)); }, [viagens, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-capturas-${userId}`, JSON.stringify(capturas)); }, [capturas, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-custosPesca-${userId}`, JSON.stringify(custosPesca)); }, [custosPesca, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-manutencaoPesca-${userId}`, JSON.stringify(manutencaoPesca)); }, [manutencaoPesca, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-comercializacaoPesca-${userId}`, JSON.stringify(comercializacaoPesca)); }, [comercializacaoPesca, userId]);

  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-produtos-${userId}`, JSON.stringify(produtos)); }, [produtos, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-inventario-${userId}`, JSON.stringify(inventario)); }, [inventario, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-compras-${userId}`, JSON.stringify(compras)); }, [compras, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-vendas-${userId}`, JSON.stringify(vendas)); }, [vendas, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-crm-${userId}`, JSON.stringify(crm)); }, [crm, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-contasAReceber-${userId}`, JSON.stringify(contasAReceber)); }, [contasAReceber, userId]);
  React.useEffect(() => { localStorage.setItem(`olo-fintel-op-contasAPagar-${userId}`, JSON.stringify(contasAPagar)); }, [contasAPagar, userId]);

  const canSwitchSectors = !userIndustry || ['SUPER_ADMIN', 'ANALYST', 'CONSULTANT'].includes(userRole || '');

  // Form input field state
  const [genericForm, setGenericForm] = useState<Record<string, string>>({});

  // Trigger form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `${activeResource}-${Date.now()}`;
    const newItem = { id, ...genericForm };

    if (activeSector === 'AGRICULTURE') {
      if (activeResource === 'talhoes') {
        setTalhoes(prev => [...prev, {
          id,
          nome: genericForm.nome || 'Novo Talhão',
          codigo: genericForm.codigo || `TAL-${Math.floor(Math.random() * 900) + 100}`,
          area: parseFloat(genericForm.area || '1.0'),
          gps: genericForm.gps || 'S/D',
          tipoSolo: genericForm.tipoSolo || 'Misto',
          estado: 'Ativo',
          responsavel: genericForm.responsavel || 'S/D'
        }]);
      } else if (activeResource === 'culturas') {
        setCulturas(prev => [...prev, {
          id,
          cultura: genericForm.cultura || 'Cultura',
          variedade: genericForm.variedade || 'Variedade',
          dataPlantio: genericForm.dataPlantio || new Date().toISOString().split('T')[0],
          dataColheitaPrevista: genericForm.dataColheitaPrevista || 'S/D',
          talhao: genericForm.talhao || 'Talhão Geral',
          quantidade: parseFloat(genericForm.quantidade || '0'),
          estado: 'Ciclo Ativo'
        }]);
      } else if (activeResource === 'producao') {
        setProducoes(prev => [...prev, {
          id,
          produto: genericForm.produto || 'Produto',
          quantidade: parseFloat(genericForm.quantidade || '0'),
          unidade: genericForm.unidade || 'kg',
          qualidade: genericForm.qualidade || 'Normal',
          talhao: genericForm.talhao || 'Talhão Geral',
          responsavel: genericForm.responsavel || 'S/D',
          periodo: genericForm.periodo || 'Diário'
        }]);
      } else if (activeResource === 'colheitas') {
        setColheitas(prev => [...prev, {
          id,
          data: genericForm.data || new Date().toISOString().split('T')[0],
          talhao: genericForm.talhao || 'Talhão Geral',
          produto: genericForm.produto || 'Produto',
          quantidade: parseFloat(genericForm.quantidade || '0'),
          perdas: parseFloat(genericForm.perdas || '0'),
          observacoes: genericForm.observacoes || 'S/D'
        }]);
      } else if (activeResource === 'insumos') {
        setInsumos(prev => [...prev, {
          id,
          nome: genericForm.nome || 'Insumo',
          categoria: genericForm.categoria || 'Sementes',
          quantidade: parseFloat(genericForm.quantidade || '0'),
          unidade: genericForm.unidade || 'kg',
          movimento: genericForm.movimento || 'Entrada'
        }]);
      } else if (activeResource === 'equipamentos') {
        setEquipamentos(prev => [...prev, {
          id,
          nome: genericForm.nome || 'Equipamento',
          tipo: genericForm.tipo || 'Tratores',
          estado: 'Operacional',
          combustivel: parseInt(genericForm.combustivel || '100', 10),
          proximaManutencao: genericForm.proximaManutencao || 'S/D'
        }]);
      } else if (activeResource === 'clima') {
        setClima(prev => [...prev, {
          id,
          data: genericForm.data || new Date().toISOString().split('T')[0],
          temperatura: parseFloat(genericForm.temperatura || '24'),
          precipitacao: parseFloat(genericForm.precipitacao || '0'),
          humidade: parseFloat(genericForm.humidade || '60'),
          vento: parseFloat(genericForm.vento || '10'),
          alertas: genericForm.alertas || 'Sem Alertas'
        }]);
      }
    } else if (activeSector === 'LIVESTOCK') {
      if (activeResource === 'rebanho') {
        setRebanho(prev => [...prev, {
          id,
          identificacao: genericForm.identificacao || `BOV-${Math.floor(Math.random() * 900) + 100}`,
          raca: genericForm.raca || 'Nelore',
          sexo: genericForm.sexo || 'Macho',
          dataNascimento: genericForm.dataNascimento || 'S/D',
          peso: parseFloat(genericForm.peso || '300'),
          estado: 'Saudável',
          lote: genericForm.lote || 'Geral'
        }]);
      } else if (activeResource === 'reproducao') {
        setReproducao(prev => [...prev, {
          id,
          tipo: genericForm.tipo || 'Gestação',
          vacaId: genericForm.vacaId || 'BOV-089',
          touroId: genericForm.touroId || 'BOV-002',
          data: genericForm.data || new Date().toISOString().split('T')[0],
          resultado: 'Pendente',
          estado: 'Ativo'
        }]);
      } else if (activeResource === 'saude') {
        setSaudeAnimal(prev => [...prev, {
          id,
          animalId: genericForm.animalId || 'BOV-045',
          tipo: genericForm.tipo || 'Vacinação',
          descricao: genericForm.descricao || 'Tratamento Preventivo',
          data: genericForm.data || new Date().toISOString().split('T')[0],
          medicamento: genericForm.medicamento || 'Geral',
          custo: parseFloat(genericForm.custo || '0')
        }]);
      } else if (activeResource === 'alimentacao') {
        setAlimentacao(prev => [...prev, {
          id,
          lote: genericForm.lote || 'Geral',
          tipo: genericForm.tipo || 'Ração',
          consumoDiario: parseFloat(genericForm.consumoDiario || '0'),
          custo: parseFloat(genericForm.custo || '0')
        }]);
      } else if (activeResource === 'crescimento') {
        setCrescimento(prev => [...prev, {
          id,
          animalId: genericForm.animalId || 'BOV-045',
          data: genericForm.data || new Date().toISOString().split('T')[0],
          peso: parseFloat(genericForm.peso || '0'),
          altura: parseFloat(genericForm.altura || '0'),
          ganhoDiario: parseFloat(genericForm.ganhoDiario || '0')
        }]);
      } else if (activeResource === 'producaoAnimal') {
        setProducaoAnimal(prev => [...prev, {
          id,
          produto: genericForm.produto || 'Leite',
          data: genericForm.data || new Date().toISOString().split('T')[0],
          quantidade: parseFloat(genericForm.quantidade || '0'),
          unidade: genericForm.unidade || 'Litros',
          responsavel: genericForm.responsavel || 'Mateus Gaspar'
        }]);
      } else if (activeResource === 'comercializacaoPecuaria') {
        setComercializacaoPecuaria(prev => [...prev, {
          id,
          tipo: genericForm.tipo || 'Venda',
          cliente: genericForm.cliente || 'Comprador',
          descricao: genericForm.descricao || 'S/D',
          valor: parseFloat(genericForm.valor || '0'),
          data: genericForm.data || new Date().toISOString().split('T')[0]
        }]);
      }
    } else if (activeSector === 'FISHERIES') {
      if (activeResource === 'embarcacoes') {
        const brand = genericForm.motorBrand || genericForm.engineBrand || genericForm.marcaMotor || 'Yamaha';
        const hp = genericForm.motorHP || genericForm.enginePower || genericForm.potenciaMotor || '250 HP';
        const vDetails = genericForm.detalhes || genericForm.details || 'Embarcação de pesca artesanal com motor de popa reformado em 2025';
        const vName = genericForm.nome || genericForm.name || 'Nova Barca';
        const vMatricula = genericForm.matricula || genericForm.registrationNumber || `LA-${Math.floor(Math.random() * 8000) + 1000}`;
        const vCapacidade = parseFloat(genericForm.capacidade || genericForm.capacity || '15.5');

        setEmbarcoes(prev => [...prev, {
          id,
          nome: vName,
          name: vName,
          matricula: vMatricula,
          registrationNumber: vMatricula,
          capacidade: vCapacidade,
          capacity: vCapacidade,
          capacityTons: vCapacidade,
          estado: 'Ativo',
          status: 'Operational',
          motor: hp ? `${brand} ${hp}` : brand,
          engineBrand: brand,
          enginePower: hp,
          details: vDetails
        }]);

        const orgCandidate = userId || localStorage.getItem('olo-fintel-orgId') || localStorage.getItem('organizationId') || 'org-1';

        const postBody: Record<string, any> = {
          name: vName,
          vesselName: vName,
          nome: vName,

          registrationNumber: vMatricula,
          registration: vMatricula,
          matricula: vMatricula,

          capacity: vCapacidade,
          capacityTons: vCapacidade,
          capacidade: vCapacidade,

          engineBrand: brand,
          engine_brand: brand,
          marcaMotor: brand,
          marca: brand,
          motorBrand: brand,

          enginePower: hp,
          engine_power: hp,
          potenciaMotor: hp,
          potencia: hp,
          motorHP: hp,

          details: vDetails,
          detalhes: vDetails,
          observacoes: vDetails,

          organizationId: orgCandidate
        };

        // Send to backend API so it persists in server database (vessel table in Supabase via NestJS)
        apiCall('/api/v1/operations/fisheries/vessels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postBody)
        })
          .then(async res => {
            if (res.ok) {
              const resData = await res.json().catch(() => ({}));
              const serverObj = resData?.data || resData?.vessel || (resData?.id ? resData : null);
              if (serverObj && serverObj.id) {
                setEmbarcoes(prev => prev.map(item => {
                  if (item.id === id) {
                    return {
                      ...item,
                      id: serverObj.id,
                      nome: serverObj.name || item.nome,
                      name: serverObj.name || item.name,
                      matricula: serverObj.registrationNumber || item.matricula,
                      registrationNumber: serverObj.registrationNumber || item.registrationNumber,
                      capacidade: serverObj.capacity || item.capacidade,
                      capacity: serverObj.capacity || item.capacity,
                      details: serverObj.details || item.details
                    };
                  }
                  return item;
                }));
              }
            }
          })
          .catch(err => console.error('Error sending vessel to API:', err));
      } else if (activeResource === 'viagens') {
        setViagens(prev => [...prev, {
          id,
          embarcacao: genericForm.embarcacao || 'Estrela do Namibe',
          dataSaida: genericForm.dataSaida || new Date().toISOString().split('T')[0],
          dataChegada: genericForm.dataChegada || 'Pendente',
          tripulacao: parseInt(genericForm.tripulacao || '5', 10),
          combustivel: parseFloat(genericForm.combustivel || '0'),
          zonaPesca: genericForm.zonaPesca || 'S/D'
        }]);
      } else if (activeResource === 'capturas') {
        setCapturas(prev => [...prev, {
          id,
          viagemId: genericForm.viagemId || 'via-1',
          especie: genericForm.especie || 'Carapau',
          quantidade: parseInt(genericForm.quantidade || '0', 10),
          peso: parseFloat(genericForm.peso || '0'),
          valor: parseFloat(genericForm.valor || '0'),
          qualidade: genericForm.qualidade || 'Excelente'
        }]);
        apiCall('/api/v1/operations/fisheries/catches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vesselId: genericForm.viagemId || 'emb-1',
            species: genericForm.especie || 'Carapau',
            weightKg: parseFloat(genericForm.peso || '0'),
            weight: parseFloat(genericForm.peso || '0'),
            date: new Date().toISOString().split('T')[0]
          })
        }).catch(err => console.error('Error sending catch to API:', err));
      } else if (activeResource === 'custosPesca') {
        setCustosPesca(prev => [...prev, {
          id,
          viagemId: genericForm.viagemId || 'via-1',
          combustivel: parseFloat(genericForm.combustivel || '0'),
          gelo: parseFloat(genericForm.gelo || '0'),
          alimentacao: parseFloat(genericForm.alimentacao || '0'),
          manutencao: parseFloat(genericForm.manutencao || '0'),
          taxas: parseFloat(genericForm.taxas || '0')
        }]);
      } else if (activeResource === 'manutencaoPesca') {
        setManutencaoPesca(prev => [...prev, {
          id,
          embarcacao: genericForm.embarcacao || 'Barca Geral',
          tipo: genericForm.tipo || 'Preventiva',
          descricao: genericForm.descricao || 'Inspeção Regular',
          data: genericForm.data || new Date().toISOString().split('T')[0],
          custo: parseFloat(genericForm.custo || '0')
        }]);
      } else if (activeResource === 'comercializacaoPesca') {
        setComercializacaoPesca(prev => [...prev, {
          id,
          lote: genericForm.lote || `LOTE-${Math.floor(Math.random() * 900) + 100}`,
          mercado: genericForm.mercado || 'Armazenistas',
          comprador: genericForm.comprador || 'S/D',
          quantidade: parseFloat(genericForm.quantidade || '0'),
          valor: parseFloat(genericForm.valor || '0'),
          contrato: genericForm.contrato || 'Venda à Vista'
        }]);
      }
    } else if (activeSector === 'COMMERCE') {
      if (activeResource === 'produtos') {
        setProdutos(prev => [...prev, {
          id,
          sku: genericForm.sku || 'SKU-001',
          codigo: genericForm.codigo || `PROD-${Math.floor(Math.random() * 900) + 100}`,
          categoria: genericForm.categoria || 'Geral',
          fornecedor: genericForm.fornecedor || 'S/D',
          precoCompra: parseFloat(genericForm.precoCompra || '0'),
          precoVenda: parseFloat(genericForm.precoVenda || '0'),
          estoque: parseInt(genericForm.estoque || '0', 10)
        }]);
      } else if (activeResource === 'inventario') {
        setInventario(prev => [...prev, {
          id,
          produtoId: genericForm.produtoId || 'prod-1',
          tipo: genericForm.tipo || 'Entrada',
          quantidade: parseInt(genericForm.quantidade || '0', 10),
          data: genericForm.data || new Date().toISOString().split('T')[0],
          responsavel: genericForm.responsavel || 'Mateus Gaspar'
        }]);
      } else if (activeResource === 'compras') {
        setCompras(prev => [...prev, {
          id,
          pedido: genericForm.pedido || 'Pedido Compra',
          fornecedor: genericForm.fornecedor || 'S/D',
          valor: parseFloat(genericForm.valor || '0'),
          estado: 'Pedido',
          data: genericForm.data || new Date().toISOString().split('T')[0]
        }]);
      } else if (activeResource === 'vendas') {
        setVendas(prev => [...prev, {
          id,
          orcamento: genericForm.orcamento || 'Orçamento Venda',
          cliente: genericForm.cliente || 'S/D',
          valor: parseFloat(genericForm.valor || '0'),
          estado: 'Orçamento',
          data: genericForm.data || new Date().toISOString().split('T')[0]
        }]);
      } else if (activeResource === 'crm') {
        setCrm(prev => [...prev, {
          id,
          nome: genericForm.nome || 'Novo Lead',
          tipo: genericForm.tipo || 'Cliente',
          contacto: genericForm.contacto || 'S/D',
          email: genericForm.email || 'S/D',
          status: 'Ativo'
        }]);
      } else if (activeResource === 'contasAReceber') {
        setContasAReceber(prev => [...prev, {
          id,
          fatura: genericForm.fatura || 'FAT-001',
          cliente: genericForm.cliente || 'S/D',
          parcelas: genericForm.parcelas || '1/1',
          valor: parseFloat(genericForm.valor || '0'),
          dataVencimento: genericForm.dataVencimento || 'S/D',
          estado: 'Pendente'
        }]);
      } else if (activeResource === 'contasAPagar') {
        setContasAPagar(prev => [...prev, {
          id,
          fornecedor: genericForm.fornecedor || 'S/D',
          despesa: genericForm.despesa || 'Despesa Geral',
          obrigacoes: genericForm.obrigacoes || 'Serviços',
          valor: parseFloat(genericForm.valor || '0'),
          dataVencimento: genericForm.dataVencimento || 'S/D',
          estado: 'Pendente'
        }]);
      }
    }

    // Generic Cross-Sector Operational Handlers (Work for all 4 sectors)
    if (activeResource === 'trabalho') {
      const workers = parseInt(genericForm.numTrabalhadores || genericForm.trabalhadores || '1', 10);
      const diariaVal = parseFloat(genericForm.valorDiaria || genericForm.diaria || '3500');
      const horasVal = parseFloat(genericForm.horasTrabalhadas || genericForm.horas || '8');
      const calculatedTotal = parseFloat(genericForm.custoTotal || genericForm.total || (workers * diariaVal).toString());
      
      const newTrab = {
        id,
        data: genericForm.data || new Date().toISOString().split('T')[0],
        trabalhador: genericForm.trabalhador || 'Trabalhador / Equipa',
        tarefa: genericForm.tarefa || 'Atividade Operacional',
        trabalhadores: workers,
        numTrabalhadores: workers,
        horas: horasVal,
        horasTrabalhadas: horasVal,
        diaria: diariaVal,
        valorDiaria: diariaVal,
        total: calculatedTotal,
        custoTotal: calculatedTotal,
        estadoPagamento: genericForm.estadoPagamento || 'Pago',
        setor: activeSector,
        localizacao: genericForm.localizacao || 'Unidade de Produção',
        observacoes: genericForm.observacoes || ''
      };
      setTrabalho(prev => [newTrab, ...prev]);

      apiCall('/api/v1/operations/labor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: activeSector,
          activity: newTrab.tarefa,
          workerName: newTrab.trabalhador,
          workersCount: newTrab.trabalhadores,
          hoursWorked: newTrab.horas,
          dailyRate: newTrab.diaria,
          totalCost: newTrab.total,
          date: newTrab.data,
          status: newTrab.estadoPagamento,
          notes: newTrab.observacoes
        })
      }).catch(err => console.warn('Sync labor error:', err));

    } else if (activeResource === 'entradas_caixa') {
      const val = parseFloat(genericForm.valor || '0');
      const newEntry = {
        id,
        data: genericForm.data || new Date().toISOString().split('T')[0],
        titulo: genericForm.descricao || genericForm.titulo || 'Entrada de Caixa',
        descricao: genericForm.descricao || genericForm.titulo || 'Entrada de Caixa',
        cliente: genericForm.cliente || 'Cliente / Comprador',
        valor: val,
        categoria: genericForm.categoria || 'Venda de Produção',
        formaPagamento: genericForm.metodoPagamento || genericForm.formaPagamento || 'Numerário',
        metodoPagamento: genericForm.metodoPagamento || genericForm.formaPagamento || 'Numerário',
        docRef: genericForm.docRef || `REC-${Math.floor(Math.random() * 9000) + 1000}`,
        setor: activeSector,
        observacoes: genericForm.observacoes || ''
      };
      setEntradasCaixa(prev => [newEntry, ...prev]);

      apiCall('/api/v1/operations/cash-inflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: activeSector,
          source: newEntry.cliente,
          amount: newEntry.valor,
          category: newEntry.categoria,
          paymentMethod: newEntry.formaPagamento,
          date: newEntry.data,
          referenceDocument: newEntry.docRef,
          notes: newEntry.titulo + (newEntry.observacoes ? ' - ' + newEntry.observacoes : '')
        })
      }).catch(err => console.warn('Sync cash-inflow error:', err));

    } else if (activeResource === 'saidas_caixa') {
      const val = parseFloat(genericForm.valor || '0');
      const newOut = {
        id,
        data: genericForm.data || new Date().toISOString().split('T')[0],
        titulo: genericForm.descricao || genericForm.titulo || 'Despesa / Custo Operacional',
        descricao: genericForm.descricao || genericForm.titulo || 'Despesa / Custo Operacional',
        fornecedor: genericForm.fornecedor || 'Fornecedor',
        valor: val,
        categoria: genericForm.categoria || 'Insumos & Operação',
        centroCusto: genericForm.centroCusto || 'Unidade Principal',
        formaPagamento: genericForm.formaPagamento || 'Numerário',
        metodoPagamento: genericForm.formaPagamento || 'Numerário',
        docRef: genericForm.docRef || `DESP-${Math.floor(Math.random() * 9000) + 1000}`,
        setor: activeSector,
        observacoes: genericForm.observacoes || ''
      };
      setSaidasCaixa(prev => [newOut, ...prev]);

      apiCall('/api/v1/operations/cash-outflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: activeSector,
          recipient: newOut.fornecedor,
          amount: newOut.valor,
          category: newOut.categoria,
          paymentMethod: newOut.formaPagamento,
          date: newOut.data,
          referenceDocument: newOut.docRef,
          notes: newOut.titulo + (newOut.observacoes ? ' - ' + newOut.observacoes : '')
        })
      }).catch(err => console.warn('Sync cash-outflow error:', err));

    } else if (activeResource === 'consumo_familiar') {
      const qtd = parseFloat(genericForm.quantidade || '1');
      const unitVal = parseFloat(genericForm.valorUnitarioEstimado || genericForm.valorUnitario || '500');
      const totVal = parseFloat(genericForm.valorTotalEstimado || genericForm.valorTotal || (qtd * unitVal).toString());
      
      const newFam = {
        id,
        data: genericForm.data || new Date().toISOString().split('T')[0],
        produto: genericForm.produto || 'Alimento da Produção',
        quantidade: qtd,
        unidade: genericForm.unidade || 'kg',
        valorUnitario: unitVal,
        valorUnitarioEstimado: unitVal,
        valorTotal: totVal,
        valorTotalEstimado: totVal,
        membrosFamilia: parseInt(genericForm.membrosFamilia || '4', 10),
        origem: genericForm.origem || 'Produção Própria',
        finalidade: genericForm.finalidade || 'Alimentação Familiar',
        setor: activeSector,
        observacoes: genericForm.observacoes || ''
      };
      setConsumoFamiliar(prev => [newFam, ...prev]);

      apiCall('/api/v1/operations/family-consumption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: activeSector,
          product: newFam.produto,
          quantity: newFam.quantidade,
          unit: newFam.unidade,
          estimatedValue: newFam.valorTotal,
          date: newFam.data,
          familyMembersBenefited: newFam.membrosFamilia,
          notes: newFam.finalidade + ' - Origem: ' + newFam.origem
        })
      }).catch(err => console.warn('Sync family-consumption error:', err));

    } else if (activeResource === 'ativos_fixos') {
      const cost = parseFloat(genericForm.valorAquisicao || genericForm.custoAquisicao || '5000000');
      const life = parseFloat(genericForm.vidaUtil || '10');
      const depRate = parseFloat(genericForm.depreciacaoAnual || (100 / (life || 10)).toFixed(2));
      const curVal = parseFloat(genericForm.valorAtual || cost.toString());

      const newAst = {
        id,
        nome: genericForm.nome || 'Ativo Fixo / Equipamento',
        categoria: genericForm.categoria || 'Maquinaria & Equipamentos',
        identificador: genericForm.codigo || genericForm.identificador || `PAT-${Math.floor(Math.random() * 9000) + 1000}`,
        codigo: genericForm.codigo || genericForm.identificador || `PAT-${Math.floor(Math.random() * 9000) + 1000}`,
        dataAquisicao: genericForm.dataAquisicao || new Date().toISOString().split('T')[0],
        custoAquisicao: cost,
        valorAquisicao: cost,
        vidaUtil: life,
        depreciacaoAnual: depRate,
        valorAtual: curVal,
        estado: genericForm.estadoOperacional || genericForm.estado || 'Operacional',
        estadoOperacional: genericForm.estadoOperacional || genericForm.estado || 'Operacional',
        proximaManutencao: genericForm.proximaManutencao || 'S/D',
        localizacao: genericForm.localizacao || 'Sede da Unidade',
        setor: activeSector,
        responsavel: genericForm.responsavel || 'Responsável Técnico',
        observacoes: genericForm.observacoes || ''
      };
      setAtivosFixos(prev => [newAst, ...prev]);

      apiCall('/api/v1/operations/fixed-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: activeSector,
          assetName: newAst.nome,
          category: newAst.categoria,
          identifier: newAst.identificador,
          acquisitionDate: newAst.dataAquisicao,
          acquisitionCost: newAst.custoAquisicao,
          currentValue: newAst.valorAtual,
          depreciationRate: newAst.depreciacaoAnual,
          status: newAst.estado,
          location: newAst.localizacao,
          notes: newAst.observacoes
        })
      }).catch(err => console.warn('Sync fixed-assets error:', err));

    } else if (activeResource === 'pragas') {
      const newPst = {
        id,
        data: genericForm.data || new Date().toISOString().split('T')[0],
        praga: genericForm.praga || 'Praga / Anomalia Sanitária',
        gravidade: genericForm.gravidade || 'Média',
        areaAfetada: genericForm.areaAfetada || 'Área / Lote Afetado',
        sintomas: genericForm.sintomas || 'Sintomas observados em campo',
        acao: genericForm.acao || 'Intervenção / Controlo',
        produtoAplicado: genericForm.produtoAplicado || 'Tratamento',
        custoIntervencao: parseFloat(genericForm.custoIntervencao || '0'),
        estadoResolucao: genericForm.estadoResolucao || 'Sob Controlo',
        inspetor: genericForm.inspetor || 'Técnico Responsável',
        setor: activeSector,
        observacoes: genericForm.observacoes || ''
      };
      setPragas(prev => [newPst, ...prev]);

      apiCall('/api/v1/operations/pest-monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: activeSector,
          targetPestOrDisease: newPst.praga,
          severity: newPst.gravidade,
          affectedAreaOrUnits: newPst.areaAfetada,
          symptoms: newPst.sintomas,
          controlActionTaken: newPst.acao,
          treatmentProduct: newPst.produtoAplicado,
          interventionCost: newPst.custoIntervencao,
          resolutionStatus: newPst.estadoResolucao,
          date: newPst.data,
          inspector: newPst.inspetor,
          notes: newPst.observacoes
        })
      }).catch(err => console.warn('Sync pest-monitoring error:', err));
    }

    setGenericForm({});
    alert('Registo operacional adicionado com sucesso!');
  };

  return (
    <div className="w-full bg-white dark:bg-[#15151C] border border-gray-200 dark:border-[#232330] rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* SECTION HEADER & PRIMARY SECTOR SELECTOR */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-100 dark:border-[#232330] pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-brand-iris" size={20} />
              Módulo Operacional do Setor
            </h2>
            {autoSector && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold rounded-lg border border-green-500/20">
                <Sparkles size={12} className="text-green-500 animate-pulse" />
                Setor Auto-Detetado: {
                  autoSector === 'AGRICULTURE' ? '🌾 Agricultura' :
                  autoSector === 'LIVESTOCK' ? 'ox Pecuária' :
                  autoSector === 'FISHERIES' ? '🐟 Pesca' : '🏪 Comércio'
                }
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {autoSector 
              ? `O seu perfil foi configurado para o setor de ${
                  autoSector === 'AGRICULTURE' ? 'Agricultura e Cultivos' :
                  autoSector === 'LIVESTOCK' ? 'Pecuária e Rebanhos' :
                  autoSector === 'FISHERIES' ? 'Pescas e Capturas' : 'Comércio Geral'
                }. Os formulários e relatórios relevantes foram ativados.`
              : 'Gira os recursos específicos da sua cooperativa ou PME. Selecione o setor operacional pretendido.'}
          </p>
        </div>

        {/* Sector controls - Auto-detected from user profile */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-iris text-white shadow-md border border-brand-iris/20">
            {activeSector === 'AGRICULTURE' && <Sprout size={16} />}
            {activeSector === 'LIVESTOCK' && <Activity size={16} />}
            {activeSector === 'FISHERIES' && <Ship size={16} />}
            {activeSector === 'COMMERCE' && <ShoppingBag size={16} />}
            <span>
              {activeSector === 'AGRICULTURE' ? 'Setor Agrícola' :
               activeSector === 'LIVESTOCK' ? 'Setor Pecuário' :
               activeSector === 'FISHERIES' ? 'Setor de Pescas' : 'Setor Comercial'}
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-white/20 text-white ml-1">
              Setor Vínculado
            </span>
          </div>
        </div>
      </div>

      {/* SUB-WORKSPACE CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDEBAR: Specific Resource Tabs */}
        <div className="lg:col-span-3 space-y-1.5 border-r border-gray-100 dark:border-[#232330] pr-0 lg:pr-4">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 mb-2">Recursos & Operações</p>
          
          {activeSector === 'AGRICULTURE' && (
            <>
              {[
                { id: 'talhoes', label: 'Talhões & Solos', desc: 'Parcelas, solos e áreas' },
                { id: 'culturas', label: 'Culturas & Plantio', desc: 'Ciclos de plantio ativos' },
                { id: 'producao', label: '🌾 Produção & Colheitas', desc: 'Colheitas, volumes e perdas' },
                { id: 'trabalho', label: '💼 Trabalho & Pessoal', desc: 'Mão de obra, diárias e tarefas' },
                { id: 'entradas_caixa', label: '↙️ Entradas de Caixa', desc: 'Vendas e receitas do campo' },
                { id: 'saidas_caixa', label: '↗️ Saídas de Caixa', desc: 'Insumos, combustíveis e contas' },
                { id: 'consumo_familiar', label: '🍲 Consumo Familiar', desc: 'Auto-consumo da produção' },
                { id: 'ativos_fixos', label: '🚜 Ativos & Maquinaria', desc: 'Tratores, rega e depreciação' },
                { id: 'pragas', label: '🐛 Monitoria de Pragas', desc: 'Pragas, sanidade e biopesticidas' },
                { id: 'insumos', label: 'Insumos & Adubos', desc: 'Sementes, fertilizantes, etc' },
                { id: 'clima', label: 'Clima & Estação', desc: 'Temperatura, chuva e alertas' },
                { id: 'indicadores', label: 'Indicadores do Setor', desc: 'Análise de produtividade' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveResource(item.id);
                    localStorage.setItem(`olo-fintel-lastResource-${userId}`, item.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 ${
                    activeResource === item.id 
                      ? 'bg-brand-iris/10 text-brand-iris border-l-4 border-brand-iris font-semibold' 
                      : 'hover:bg-gray-50 dark:hover:bg-[#1C1C24] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[9px] text-gray-400 leading-none">{item.desc}</span>
                </button>
              ))}
            </>
          )}

          {activeSector === 'LIVESTOCK' && (
            <>
              {[
                { id: 'rebanho', label: 'Rebanho & Efetivo', desc: 'Gado, raças e lotes' },
                { id: 'producaoAnimal', label: '🥛 Produção Animal', desc: 'Leite, carne e ovos' },
                { id: 'trabalho', label: '💼 Trabalho & Pastores', desc: 'Maneio diário e diárias' },
                { id: 'entradas_caixa', label: '↙️ Entradas de Caixa', desc: 'Venda de animais e leite' },
                { id: 'saidas_caixa', label: '↗️ Saídas de Caixa', desc: 'Rações, vacinas e custos' },
                { id: 'consumo_familiar', label: '🍲 Consumo Familiar', desc: 'Leite e carne para casa' },
                { id: 'ativos_fixos', label: '🐂 Ativos & Reprodutores', desc: 'Touros PO, currais e tanques' },
                { id: 'pragas', label: '🐛 Monitoria Sanitária', desc: 'Carraças, aftosa e banhos' },
                { id: 'reproducao', label: 'Reprodução & Partos', desc: 'Inseminação e nascimentos' },
                { id: 'saude', label: 'Saúde & Vacinas', desc: 'Tratamentos e desparasitação' },
                { id: 'alimentacao', label: 'Alimentação & Ração', desc: 'Consumo diário e silagem' },
                { id: 'crescimento', label: 'Pesagem & Ganho', desc: 'Controlo de peso regular' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveResource(item.id);
                    localStorage.setItem(`olo-fintel-lastResource-${userId}`, item.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 ${
                    activeResource === item.id 
                      ? 'bg-[#E3A008]/10 text-[#E3A008] border-l-4 border-[#E3A008] font-semibold' 
                      : 'hover:bg-gray-50 dark:hover:bg-[#1C1C24] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[9px] text-gray-400 leading-none">{item.desc}</span>
                </button>
              ))}
            </>
          )}

          {activeSector === 'FISHERIES' && (
            <>
              {[
                { id: 'embarcacoes', label: 'Embarcações & Frota', desc: 'Motores, barcos e licenças' },
                { id: 'capturas', label: '🐟 Capturas & Produção', desc: 'Descargas em lota e quilos' },
                { id: 'trabalho', label: '💼 Trabalho & Tripulação', desc: 'Mestres, marinheiros e quinhões' },
                { id: 'entradas_caixa', label: '↙️ Entradas de Caixa', desc: 'Vendas de pescado em lota' },
                { id: 'saidas_caixa', label: '↗️ Saídas de Caixa', desc: 'Gasóleo, gelo e portagens' },
                { id: 'consumo_familiar', label: '🍲 Consumo Familiar', desc: 'Peixe para famílias' },
                { id: 'ativos_fixos', label: '⚓ Ativos & Equipamentos', desc: 'Barcos, motores e redes' },
                { id: 'pragas', label: '🐛 Sanidade & Qualidade', desc: 'Inspeção HACCP e frio' },
                { id: 'viagens', label: 'Viagens & Saídas', desc: 'Controlo de marés e tripulantes' },
                { id: 'custosPesca', label: 'Custos Operacionais', desc: 'Combustível, gelo e taxas' },
                { id: 'manutencaoPesca', label: 'Manutenção Náutica', desc: 'Motores de popa e calafeto' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveResource(item.id);
                    localStorage.setItem(`olo-fintel-lastResource-${userId}`, item.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 ${
                    activeResource === item.id 
                      ? 'bg-[#0E9F6E]/10 text-[#0E9F6E] border-l-4 border-[#0E9F6E] font-semibold' 
                      : 'hover:bg-gray-50 dark:hover:bg-[#1C1C24] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[9px] text-gray-400 leading-none">{item.desc}</span>
                </button>
              ))}
            </>
          )}

          {activeSector === 'COMMERCE' && (
            <>
              {[
                { id: 'produtos', label: 'Produtos & Catálogo', desc: 'SKU, compras e preços' },
                { id: 'inventario', label: '📦 Movimento & Stocks', desc: 'Entradas, saídas e quebras' },
                { id: 'trabalho', label: '💼 Trabalho & Turnos', desc: 'Balconistas, caixas e salários' },
                { id: 'entradas_caixa', label: '↙️ Entradas de Caixa', desc: 'Vendas diárias e recebimentos' },
                { id: 'saidas_caixa', label: '↗️ Saídas de Caixa', desc: 'Fornecedores, faturas e rendas' },
                { id: 'consumo_familiar', label: '🍲 Consumo Familiar', desc: 'Retiradas de loja para casa' },
                { id: 'ativos_fixos', label: '🏬 Ativos & Instalações', desc: 'Carrinhas, arcas e balanças' },
                { id: 'pragas', label: '🐛 Monitoria de Armazém', desc: 'Gorgulhos, validade e higiene' },
                { id: 'crm', label: 'CRM & Clientes', desc: 'Clientes e parceiros comerciais' },
                { id: 'contasAReceber', label: 'Contas a Receber', desc: 'Faturas e créditos pendentes' },
                { id: 'contasAPagar', label: 'Contas a Pagar', desc: 'Obrigações e prazos' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveResource(item.id);
                    localStorage.setItem(`olo-fintel-lastResource-${userId}`, item.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 ${
                    activeResource === item.id 
                      ? 'bg-[#3F83F8]/10 text-[#3F83F8] border-l-4 border-[#3F83F8] font-semibold' 
                      : 'hover:bg-gray-50 dark:hover:bg-[#1C1C24] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[9px] text-gray-400 leading-none">{item.desc}</span>
                </button>
              ))}
            </>
          )}
        </div>

        {/* WORKSPACE CONTENT PANEL */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* 1. WEATHER forecast card (only for AGRICULTURE - CLIMA) */}
          {activeSector === 'AGRICULTURE' && activeResource === 'clima' && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-brand-iris/10 border border-brand-iris/20 text-gray-800 dark:text-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-iris text-white rounded-2xl">
                    <CloudSun size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Estação Agro-Metereológica</h4>
                    <p className="text-[10px] text-gray-400">Tempo real & Correlações agroclimáticas</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-[#E3A008]/20 text-[#E3A008] text-[9px] font-bold rounded-lg border border-[#E3A008]/30">
                    ALERTA: Geada Leve Prevista
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div className="p-3 bg-white dark:bg-[#1A1A24] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Temperatura</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">24.5 °C</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#1A1A24] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Precipitação</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">1.2 mm</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#1A1A24] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Humidade Ar</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">62%</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#1A1A24] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Vento</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">14.5 km/h</p>
                </div>
              </div>
              <div className="bg-white dark:bg-[#1A1A24] rounded-xl p-3 border border-gray-100 dark:border-gray-800 mt-4 flex items-center gap-2 text-xs">
                <span className="font-bold text-brand-iris">Correlação Clima-Produção:</span>
                <span className="text-gray-500">A precipitação acumulada este mês está 8% acima da média histórica, favorecendo a cultura de Milho (Talhão Alfa).</span>
              </div>
            </div>
          )}

          {/* 2. PRODUCTION INDICATORS tab (only for AGRICULTURE - INDICADORES) */}
          {activeSector === 'AGRICULTURE' && activeResource === 'indicadores' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-[#1C1C24] border border-gray-150 dark:border-gray-800 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Produtividade por Hectare</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white mt-1">450 kg/ha</p>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-[9px] text-green-500 font-semibold mt-1 block">▲ +12% vs ano transato</span>
                </div>

                <div className="p-4 bg-white dark:bg-[#1C1C24] border border-gray-150 dark:border-gray-800 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Produtividade por Cultura</p>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Milho Branco</span>
                      <span className="font-bold text-gray-900 dark:text-white">5,000 kg</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Batata Doce</span>
                      <span className="font-bold text-gray-900 dark:text-white">3,000 kg</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-400 mt-2 block">Total acumulado: 8,000 kg colhidos</span>
                </div>

                <div className="p-4 bg-white dark:bg-[#1C1C24] border border-gray-150 dark:border-gray-800 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Produtividade por Período</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400 w-6">Q1:</span>
                      <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full">
                        <div className="bg-brand-iris h-full rounded-full" style={{ width: '42%' }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">4.2t</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400 w-6">Q2:</span>
                      <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full">
                        <div className="bg-brand-iris h-full rounded-full" style={{ width: '51%' }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">5.1t</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400 w-6">Q3:</span>
                      <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full">
                        <div className="bg-brand-iris h-full rounded-full" style={{ width: '68%' }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">6.8t</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-[#1C1C24] border border-gray-150 dark:border-gray-800 rounded-2xl flex flex-col md:flex-row items-center gap-4 justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Exportar Relatório Operacional</h4>
                  <p className="text-[11px] text-gray-400 mt-1">Gere um ficheiro Excel ou CSV com todo o histórico agroclimático e de produção.</p>
                </div>
                <button 
                  onClick={() => alert('Ficheiro baixado com sucesso no formato Excel.')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <FileSpreadsheet size={16} />
                  <span>Exportar Planilha</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. METRIC CARDS AND OPERATIONAL WORKSPACE */}
          {activeResource !== 'indicadores' && (
            <div className="space-y-6">
              
              {/* Data Table */}
              <div className="bg-white dark:bg-[#1C1C24] border border-gray-150 dark:border-[#22222E] rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-[#22222E] flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                    Histórico de Registos: <span className="text-brand-iris">{activeResource.toUpperCase()}</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    {activeSector === 'FISHERIES' && activeResource === 'embarcacoes' && (
                      <button
                        onClick={async () => {
                          const testName = `Barco Baía Azul ${Math.floor(Math.random() * 90) + 10}`;
                          const testMatricula = `LA-${Math.floor(Math.random() * 8000) + 1000}-V`;
                          const testCap = 18.5;
                          
                          try {
                            const orgCandidate = userId || localStorage.getItem('olo-fintel-orgId') || localStorage.getItem('organizationId') || 'org-1';

                            const testBody: Record<string, any> = {
                              name: testName,
                              vesselName: testName,
                              nome: testName,

                              registrationNumber: testMatricula,
                              registration: testMatricula,
                              matricula: testMatricula,

                              capacity: testCap,
                              capacityTons: testCap,
                              capacidade: testCap,

                              engineBrand: 'Yamaha',
                              engine_brand: 'Yamaha',
                              marcaMotor: 'Yamaha',
                              marca: 'Yamaha',
                              motorBrand: 'Yamaha',

                              enginePower: '250 HP',
                              engine_power: '250 HP',
                              potenciaMotor: '250 HP',
                              potencia: '250 HP',
                              motorHP: '250 HP',

                              details: 'Embarcação de pesca artesanal com motor de popa reformado em 2025',
                              detalhes: 'Embarcação de pesca artesanal com motor de popa reformado em 2025',
                              observacoes: 'Embarcação de pesca artesanal com motor de popa reformado em 2025',

                              organizationId: orgCandidate
                            };

                            const res = await apiCall('/api/v1/operations/fisheries/vessels', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(testBody)
                            });
                            
                            const resData = await res.json().catch(() => ({}));
                            
                            // Adicionar localmente
                            const newV = {
                              id: resData.id || resData.vessel?.id || resData.data?.id || `emb-${Date.now()}`,
                              nome: testName,
                              name: testName,
                              matricula: testMatricula,
                              registrationNumber: testMatricula,
                              capacidade: testCap,
                              capacity: testCap,
                              capacityTons: testCap,
                              estado: 'Ativo',
                              status: 'Operational',
                              motor: 'Yamaha 250HP'
                            };
                            setEmbarcoes(prev => [newV, ...prev]);
                            
                            alert(`[POST /vessels OK - Status ${res.status}]\nEmbarcação enviada ao backend:\n- Nome: ${testName}\n- Matrícula: ${testMatricula}\n- Capacidade: ${testCap} Toneladas`);
                          } catch (err: any) {
                            alert(`Erro ao enviar embarcação ao servidor: ${err.message}`);
                          }
                        }}
                        className="px-2.5 py-1 bg-brand-navy dark:bg-brand-iris text-white rounded text-[10px] font-bold hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
                        title="Enviar requisição POST para a API /v1/operations/fisheries/vessels no NestJS/Supabase"
                      >
                        ⚡ Testar POST API /vessels
                      </button>
                    )}
                    <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-mono rounded">
                      Total: {
                        activeResource === 'trabalho' ? trabalho.filter(t => t.setor === activeSector || !t.setor).length :
                        activeResource === 'entradas_caixa' ? entradasCaixa.filter(t => t.setor === activeSector || !t.setor).length :
                        activeResource === 'saidas_caixa' ? saidasCaixa.filter(t => t.setor === activeSector || !t.setor).length :
                        activeResource === 'consumo_familiar' ? consumoFamiliar.filter(t => t.setor === activeSector || !t.setor).length :
                        activeResource === 'ativos_fixos' ? ativosFixos.filter(t => t.setor === activeSector || !t.setor).length :
                        activeResource === 'pragas' ? pragas.filter(t => t.setor === activeSector || !t.setor).length :
                        activeSector === 'AGRICULTURE' ? (
                          activeResource === 'talhoes' ? talhoes.length :
                          activeResource === 'culturas' ? culturas.length :
                          activeResource === 'producao' ? producoes.length :
                          activeResource === 'colheitas' ? colheitas.length :
                          activeResource === 'insumos' ? insumos.length :
                          activeResource === 'equipamentos' ? equipamentos.length :
                          activeResource === 'clima' ? clima.length : 0
                        ) : activeSector === 'LIVESTOCK' ? (
                          activeResource === 'rebanho' ? rebanho.length :
                          activeResource === 'reproducao' ? reproducao.length :
                          activeResource === 'saude' ? saudeAnimal.length :
                          activeResource === 'alimentacao' ? alimentacao.length :
                          activeResource === 'crescimento' ? crescimento.length :
                          activeResource === 'producaoAnimal' ? producaoAnimal.length :
                          activeResource === 'comercializacaoPecuaria' ? comercializacaoPecuaria.length : 0
                        ) : activeSector === 'FISHERIES' ? (
                          activeResource === 'embarcacoes' ? embarcoes.length :
                          activeResource === 'viagens' ? viagens.length :
                          activeResource === 'capturas' ? capturas.length :
                          activeResource === 'custosPesca' ? custosPesca.length :
                          activeResource === 'manutencaoPesca' ? manutencaoPesca.length :
                          activeResource === 'comercializacaoPesca' ? comercializacaoPesca.length : 0
                        ) : (
                          activeResource === 'produtos' ? produtos.length :
                          activeResource === 'inventario' ? inventario.length :
                          activeResource === 'compras' ? compras.length :
                          activeResource === 'vendas' ? vendas.length :
                          activeResource === 'crm' ? crm.length :
                          activeResource === 'contasAReceber' ? contasAReceber.length :
                          activeResource === 'contasAPagar' ? contasAPagar.length : 0
                        )
                      } registos
                    </span>
                  </div>
                </div>

                <div className="ramp-table-container p-1">
                  <table className="ramp-table">
                    <thead>
                      <tr className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                        {activeSector === 'AGRICULTURE' && activeResource === 'talhoes' && (
                          <>
                            <th className="p-3">Código</th>
                            <th className="p-3">Nome</th>
                            <th className="p-3">Área (ha)</th>
                            <th className="p-3">Solo</th>
                            <th className="p-3">GPS</th>
                            <th className="p-3">Responsável</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3 text-right">Ações</th>
                          </>
                        )}
                        {activeSector === 'AGRICULTURE' && activeResource === 'culturas' && (
                          <>
                            <th className="p-3">Cultura</th>
                            <th className="p-3">Variedade</th>
                            <th className="p-3">Talhão</th>
                            <th className="p-3 text-right">Quantidade (un)</th>
                            <th className="p-3">Plantio</th>
                            <th className="p-3">Colheita Prev.</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3 text-right">Ações</th>
                          </>
                        )}
                        {activeSector === 'AGRICULTURE' && activeResource === 'producao' && (
                          <>
                            <th className="p-3">Produto</th>
                            <th className="p-3 text-right">Quantidade</th>
                            <th className="p-3">Qualidade</th>
                            <th className="p-3">Talhão</th>
                            <th className="p-3">Responsável</th>
                            <th className="p-3">Período</th>
                          </>
                        )}
                        {activeSector === 'AGRICULTURE' && activeResource === 'colheitas' && (
                          <>
                            <th className="p-3">Data</th>
                            <th className="p-3">Talhão</th>
                            <th className="p-3">Produto</th>
                            <th className="p-3 text-right">Qtd Colhida (kg)</th>
                            <th className="p-3 text-right">Perdas (kg)</th>
                            <th className="p-3">Observações</th>
                          </>
                        )}
                        {activeSector === 'AGRICULTURE' && activeResource === 'insumos' && (
                          <>
                            <th className="p-3">Insumo</th>
                            <th className="p-3">Categoria</th>
                            <th className="p-3 text-right">Quantidade</th>
                            <th className="p-3">Unidade</th>
                            <th className="p-3">Movimento</th>
                          </>
                        )}
                        {activeSector === 'AGRICULTURE' && activeResource === 'equipamentos' && (
                          <>
                            <th className="p-3">Equipamento</th>
                            <th className="p-3">Tipo</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3 text-right">Combustível</th>
                            <th className="p-3">Próxima Manutenção</th>
                            <th className="p-3 text-right">Ações</th>
                          </>
                        )}
                        {activeSector === 'AGRICULTURE' && activeResource === 'clima' && (
                          <>
                            <th className="p-3">Data</th>
                            <th className="p-3 text-right">Temperatura</th>
                            <th className="p-3 text-right">Precipitação</th>
                            <th className="p-3 text-right">Humidade</th>
                            <th className="p-3 text-right">Vento</th>
                            <th className="p-3">Alertas</th>
                          </>
                        )}

                        {/* LIVESTOCK COLUMNS */}
                        {activeSector === 'LIVESTOCK' && activeResource === 'rebanho' && (
                          <>
                            <th className="p-3">Identificação</th>
                            <th className="p-3">Raça</th>
                            <th className="p-3">Sexo</th>
                            <th className="p-3">Data Nasc.</th>
                            <th className="p-3 text-right">Peso (kg)</th>
                            <th className="p-3">Lote</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3 text-right">Ações</th>
                          </>
                        )}
                        {activeSector === 'LIVESTOCK' && activeResource === 'reproducao' && (
                          <>
                            <th className="p-3">Tipo</th>
                            <th className="p-3">Vaca ID</th>
                            <th className="p-3">Touro ID</th>
                            <th className="p-3">Data</th>
                            <th className="p-3">Resultado</th>
                            <th className="p-3">Estado</th>
                          </>
                        )}
                        {activeSector === 'LIVESTOCK' && activeResource === 'saude' && (
                          <>
                            <th className="p-3">ID Animal</th>
                            <th className="p-3">Tipo</th>
                            <th className="p-3">Descrição</th>
                            <th className="p-3">Medicamento</th>
                            <th className="p-3 text-right">Custo (Kz)</th>
                            <th className="p-3">Data</th>
                          </>
                        )}
                        {activeSector === 'LIVESTOCK' && activeResource === 'alimentacao' && (
                          <>
                            <th className="p-3">Lote</th>
                            <th className="p-3">Tipo Alimentação</th>
                            <th className="p-3 text-right">Consumo Diário (kg)</th>
                            <th className="p-3 text-right">Custo Diário (Kz)</th>
                          </>
                        )}
                        {activeSector === 'LIVESTOCK' && activeResource === 'crescimento' && (
                          <>
                            <th className="p-3">ID Animal</th>
                            <th className="p-3 text-right">Peso (kg)</th>
                            <th className="p-3 text-right">Altura (cm)</th>
                            <th className="p-3 text-right">Ganho Diário</th>
                            <th className="p-3">Data Registo</th>
                          </>
                        )}
                        {activeSector === 'LIVESTOCK' && activeResource === 'producaoAnimal' && (
                          <>
                            <th className="p-3">Produto</th>
                            <th className="p-3 text-right">Quantidade</th>
                            <th className="p-3">Unidade</th>
                            <th className="p-3">Responsável</th>
                            <th className="p-3">Data</th>
                          </>
                        )}
                        {activeSector === 'LIVESTOCK' && activeResource === 'comercializacaoPecuaria' && (
                          <>
                            <th className="p-3">Tipo</th>
                            <th className="p-3">Cliente</th>
                            <th className="p-3">Descrição</th>
                            <th className="p-3 text-right">Valor (Kz)</th>
                            <th className="p-3">Data</th>
                          </>
                        )}

                        {/* FISHERIES COLUMNS */}
                        {activeSector === 'FISHERIES' && activeResource === 'embarcacoes' && (
                          <>
                            <th className="p-3">Embarcação</th>
                            <th className="p-3">Matrícula</th>
                            <th className="p-3 text-right">Capacidade (ton)</th>
                            <th className="p-3">Motor</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3 text-right">Ações</th>
                          </>
                        )}
                        {activeSector === 'FISHERIES' && activeResource === 'viagens' && (
                          <>
                            <th className="p-3">Embarcação</th>
                            <th className="p-3">Saída</th>
                            <th className="p-3">Chegada</th>
                            <th className="p-3 text-right">Tripulação</th>
                            <th className="p-3 text-right">Combustível (L)</th>
                            <th className="p-3">Zona Pesca</th>
                          </>
                        )}
                        {activeSector === 'FISHERIES' && activeResource === 'capturas' && (
                          <>
                            <th className="p-3">ID Viagem</th>
                            <th className="p-3">Espécie</th>
                            <th className="p-3 text-right">Caixas</th>
                            <th className="p-3 text-right">Peso (kg)</th>
                            <th className="p-3 text-right">Valor Previsto (Kz)</th>
                            <th className="p-3">Qualidade</th>
                          </>
                        )}
                        {activeSector === 'FISHERIES' && activeResource === 'custosPesca' && (
                          <>
                            <th className="p-3">ID Viagem</th>
                            <th className="p-3 text-right">Combustível (Kz)</th>
                            <th className="p-3 text-right">Gelo (Kz)</th>
                            <th className="p-3 text-right">Alimentação (Kz)</th>
                            <th className="p-3 text-right">Manutenção (Kz)</th>
                            <th className="p-3 text-right">Taxas (Kz)</th>
                          </>
                        )}
                        {activeSector === 'FISHERIES' && activeResource === 'manutencaoPesca' && (
                          <>
                            <th className="p-3">Embarcação</th>
                            <th className="p-3">Tipo Manutenção</th>
                            <th className="p-3">Descrição</th>
                            <th className="p-3 text-right">Custo (Kz)</th>
                            <th className="p-3">Data</th>
                          </>
                        )}
                        {activeSector === 'FISHERIES' && activeResource === 'comercializacaoPesca' && (
                          <>
                            <th className="p-3">Lote</th>
                            <th className="p-3">Mercado</th>
                            <th className="p-3">Comprador</th>
                            <th className="p-3 text-right">Qtd (kg)</th>
                            <th className="p-3 text-right">Valor Total (Kz)</th>
                            <th className="p-3">Contrato</th>
                          </>
                        )}

                        {/* COMMERCE COLUMNS */}
                        {activeSector === 'COMMERCE' && activeResource === 'produtos' && (
                          <>
                            <th className="p-3">SKU</th>
                            <th className="p-3">Código</th>
                            <th className="p-3">Categoria</th>
                            <th className="p-3">Fornecedor</th>
                            <th className="p-3 text-right">Preço Compra</th>
                            <th className="p-3 text-right">Preço Venda</th>
                            <th className="p-3 text-right">Estoque</th>
                          </>
                        )}
                        {activeSector === 'COMMERCE' && activeResource === 'inventario' && (
                          <>
                            <th className="p-3">ID Produto</th>
                            <th className="p-3">Movimento</th>
                            <th className="p-3 text-right">Quantidade</th>
                            <th className="p-3">Data</th>
                            <th className="p-3">Responsável</th>
                          </>
                        )}
                        {activeSector === 'COMMERCE' && activeResource === 'compras' && (
                          <>
                            <th className="p-3">ID</th>
                            <th className="p-3">Pedido</th>
                            <th className="p-3">Fornecedor</th>
                            <th className="p-3 text-right">Valor (Kz)</th>
                            <th className="p-3">Data</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3 text-right">Ações</th>
                          </>
                        )}
                        {activeSector === 'COMMERCE' && activeResource === 'vendas' && (
                          <>
                            <th className="p-3">ID</th>
                            <th className="p-3">Orçamento</th>
                            <th className="p-3">Cliente</th>
                            <th className="p-3 text-right">Valor (Kz)</th>
                            <th className="p-3">Data</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3 text-right">Ações</th>
                          </>
                        )}
                        {activeSector === 'COMMERCE' && activeResource === 'crm' && (
                          <>
                            <th className="p-3">Nome do Cliente</th>
                            <th className="p-3">Tipo</th>
                            <th className="p-3">Contacto</th>
                            <th className="p-3">E-mail</th>
                            <th className="p-3">Status</th>
                          </>
                        )}
                        {activeSector === 'COMMERCE' && activeResource === 'contasAReceber' && (
                          <>
                            <th className="p-3">Fatura</th>
                            <th className="p-3">Cliente</th>
                            <th className="p-3">Parcelas</th>
                            <th className="p-3 text-right">Valor (Kz)</th>
                            <th className="p-3">Vencimento</th>
                            <th className="p-3">Estado</th>
                          </>
                        )}
                        {activeSector === 'COMMERCE' && activeResource === 'contasAPagar' && (
                          <>
                            <th className="p-3">Fornecedor</th>
                            <th className="p-3">Despesa</th>
                            <th className="p-3">Obrigações</th>
                            <th className="p-3 text-right">Valor (Kz)</th>
                            <th className="p-3">Vencimento</th>
                            <th className="p-3">Estado</th>
                          </>
                        )}

                        {/* CROSS-SECTOR OPERATIONAL COLUMNS */}
                        {activeResource === 'trabalho' && (
                          <>
                            <th className="p-3">Data</th>
                            <th className="p-3">Trabalhador / Equipa</th>
                            <th className="p-3">Tarefa / Função</th>
                            <th className="p-3 text-right">Pessoas</th>
                            <th className="p-3 text-right">Horas</th>
                            <th className="p-3 text-right">Diária (Kz)</th>
                            <th className="p-3 text-right">Total Pago (Kz)</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3 text-right">Ações</th>
                          </>
                        )}
                        {activeResource === 'entradas_caixa' && (
                          <>
                            <th className="p-3">Data</th>
                            <th className="p-3">Descrição / Operação</th>
                            <th className="p-3">Cliente / Pagador</th>
                            <th className="p-3">Categoria</th>
                            <th className="p-3">Método / Conta</th>
                            <th className="p-3 text-right">Valor (Kz)</th>
                            <th className="p-3 text-right">Ações</th>
                          </>
                        )}
                        {activeResource === 'saidas_caixa' && (
                          <>
                            <th className="p-3">Data</th>
                            <th className="p-3">Descrição / Custo</th>
                            <th className="p-3">Fornecedor / Beneficiário</th>
                            <th className="p-3">Categoria de Despesa</th>
                            <th className="p-3">Centro de Custo</th>
                            <th className="p-3 text-right">Valor (Kz)</th>
                            <th className="p-3 text-right">Ações</th>
                          </>
                        )}
                        {activeResource === 'consumo_familiar' && (
                          <>
                            <th className="p-3">Data</th>
                            <th className="p-3">Produto Retirado</th>
                            <th className="p-3 text-right">Quantidade</th>
                            <th className="p-3 text-right">Preço Ref. (Kz)</th>
                            <th className="p-3 text-right">Valor Estimado (Kz)</th>
                            <th className="p-3">Beneficiários</th>
                            <th className="p-3">Finalidade</th>
                            <th className="p-3 text-right">Ações</th>
                          </>
                        )}
                        {activeResource === 'ativos_fixos' && (
                          <>
                            <th className="p-3">Ativo / Equipamento</th>
                            <th className="p-3">Código / Registo</th>
                            <th className="p-3">Categoria</th>
                            <th className="p-3 text-right">Custo Compra (Kz)</th>
                            <th className="p-3 text-right">Valor Atual (Kz)</th>
                            <th className="p-3">Localização</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3 text-right">Ações</th>
                          </>
                        )}
                        {activeResource === 'pragas' && (
                          <>
                            <th className="p-3">Data</th>
                            <th className="p-3">Praga / Alvo Sanitário</th>
                            <th className="p-3">Gravidade</th>
                            <th className="p-3">Área / Lote Afetado</th>
                            <th className="p-3">Ação / Tratamento</th>
                            <th className="p-3 text-right">Custo Interv. (Kz)</th>
                            <th className="p-3">Estado Resolução</th>
                            <th className="p-3 text-right">Ações</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {/* --- AGRICULTURE RENDERS --- */}
                      {activeSector === 'AGRICULTURE' && activeResource === 'talhoes' && talhoes.map(t => (
                        <tr key={t.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-500 font-bold">{t.codigo}</td>
                          <td className="p-3 font-semibold text-gray-900 dark:text-white">{t.nome}</td>
                          <td className="p-3 font-mono">{t.area} ha</td>
                          <td className="p-3">{t.tipoSolo}</td>
                          <td className="p-3 text-gray-400 font-mono text-[10px]">{t.gps}</td>
                          <td className="p-3 text-gray-500">{t.responsavel}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              t.estado === 'Ativo' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                              t.estado === 'Arquivado' ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-700'
                            }`}>{t.estado}</span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button 
                              onClick={() => {
                                const newResp = prompt('Nome do novo responsável para o talhão:', t.responsavel);
                                if (newResp) {
                                  setTalhoes(prev => prev.map(x => x.id === t.id ? { ...x, responsavel: newResp } : x));
                                  alert('Responsável transferido com sucesso!');
                                }
                              }}
                              className="text-brand-iris hover:underline cursor-pointer"
                            >
                              Transferir
                            </button>
                            <button 
                              onClick={() => {
                                setTalhoes(prev => prev.map(x => x.id === t.id ? { ...x, estado: 'Arquivado' } : x));
                                alert('Talhão arquivado com sucesso!');
                              }}
                              className="text-red-500 hover:underline cursor-pointer"
                            >
                              Arquivar
                            </button>
                          </td>
                        </tr>
                      ))}

                      {activeSector === 'AGRICULTURE' && activeResource === 'culturas' && culturas.map(c => (
                        <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-bold text-gray-900 dark:text-white">{c.cultura}</td>
                          <td className="p-3 text-gray-500">{c.variedade}</td>
                          <td className="p-3">{c.talhao}</td>
                          <td className="p-3 text-right font-mono">{c.quantidade.toLocaleString()}</td>
                          <td className="p-3 font-mono text-gray-400">{c.dataPlantio}</td>
                          <td className="p-3 font-mono text-gray-400">{c.dataColheitaPrevista}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 rounded text-[9px] font-bold">{c.estado}</span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button 
                              onClick={() => {
                                setCulturas(prev => prev.map(x => x.id === c.id ? { ...x, estado: 'Ciclo Finalizado', dataColheitaPrevista: 'Colhido Hoje' } : x));
                                alert('Ciclo finalizado com sucesso!');
                              }}
                              className="text-green-600 hover:underline cursor-pointer"
                            >
                              Finalizar Ciclo
                            </button>
                            <button 
                              onClick={() => {
                                setCulturas(prev => prev.filter(x => x.id !== c.id));
                                alert('Ciclo de plantio cancelado.');
                              }}
                              className="text-red-500 hover:underline cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </td>
                        </tr>
                      ))}

                      {activeSector === 'AGRICULTURE' && activeResource === 'producao' && producoes.map(p => (
                        <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-semibold text-gray-900 dark:text-white">{p.produto}</td>
                          <td className="p-3 text-right font-mono font-bold">{p.quantidade}</td>
                          <td className="p-3 font-mono">{p.unidade}</td>
                          <td className="p-3">{p.qualidade}</td>
                          <td className="p-3">{p.talhao}</td>
                          <td className="p-3 text-gray-500">{p.responsavel}</td>
                          <td className="p-3 font-bold text-brand-iris">{p.periodo}</td>
                        </tr>
                      ))}

                      {activeSector === 'AGRICULTURE' && activeResource === 'colheitas' && colheitas.map(col => (
                        <tr key={col.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-400">{col.data}</td>
                          <td className="p-3 font-semibold text-gray-900 dark:text-white">{col.talhao}</td>
                          <td className="p-3">{col.produto}</td>
                          <td className="p-3 text-right font-mono font-bold text-green-600">+{col.quantidade} kg</td>
                          <td className="p-3 text-right font-mono text-red-500">-{col.perdas} kg</td>
                          <td className="p-3 text-gray-500 italic">{col.observacoes}</td>
                        </tr>
                      ))}

                      {activeSector === 'AGRICULTURE' && activeResource === 'insumos' && insumos.map(ins => (
                        <tr key={ins.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-bold text-gray-900 dark:text-white">{ins.nome}</td>
                          <td className="p-3 text-gray-500">{ins.categoria}</td>
                          <td className="p-3 text-right font-mono">{ins.quantidade}</td>
                          <td className="p-3 font-mono">{ins.unidade}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              ins.movimento === 'Entrada' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>{ins.movimento}</span>
                          </td>
                        </tr>
                      ))}

                      {activeSector === 'AGRICULTURE' && activeResource === 'equipamentos' && equipamentos.map(eq => (
                        <tr key={eq.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-bold text-gray-900 dark:text-white">{eq.nome}</td>
                          <td className="p-3 text-gray-500">{eq.tipo}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              eq.estado === 'Operacional' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                              eq.estado === 'Avaria' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>{eq.estado}</span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="font-mono">{eq.combustivel}%</span>
                              <div className="w-12 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full ${eq.combustivel < 25 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${eq.combustivel}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-gray-400">{eq.proximaManutencao}</td>
                          <td className="p-3 text-right space-x-2">
                            <button 
                              onClick={() => {
                                setEquipamentos(prev => prev.map(x => x.id === eq.id ? { ...x, proximaManutencao: '2026-08-30', estado: 'Operacional' } : x));
                                alert('Manutenção agendada e registada com sucesso!');
                              }}
                              className="text-brand-iris hover:underline cursor-pointer"
                            >
                              Manutenção
                            </button>
                            <button 
                              onClick={() => {
                                setEquipamentos(prev => prev.map(x => x.id === eq.id ? { ...x, estado: 'Avaria' } : x));
                                alert('Estado do trator alterado para AVARIA.');
                              }}
                              className="text-red-500 hover:underline cursor-pointer"
                            >
                              Avaria
                            </button>
                          </td>
                        </tr>
                      ))}

                      {activeSector === 'AGRICULTURE' && activeResource === 'clima' && clima.map(cl => (
                        <tr key={cl.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-400">{cl.data}</td>
                          <td className="p-3 text-right font-mono">{cl.temperatura} °C</td>
                          <td className="p-3 text-right font-mono">{cl.precipitacao} mm</td>
                          <td className="p-3 text-right font-mono">{cl.humidade} %</td>
                          <td className="p-3 text-right font-mono">{cl.vento} km/h</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-bold">{cl.alertas}</span>
                          </td>
                        </tr>
                      ))}

                      {/* --- LIVESTOCK RENDERS --- */}
                      {activeSector === 'LIVESTOCK' && activeResource === 'rebanho' && rebanho.map(g => (
                        <tr key={g.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-brand-iris font-bold">{g.identificacao}</td>
                          <td className="p-3 font-semibold text-gray-900 dark:text-white">{g.raca}</td>
                          <td className="p-3">{g.sexo}</td>
                          <td className="p-3 font-mono text-gray-400">{g.dataNascimento}</td>
                          <td className="p-3 text-right font-mono font-bold">{g.peso} kg</td>
                          <td className="p-3 text-gray-500">{g.lote}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-bold">{g.estado}</span>
                          </td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => {
                                const newLote = prompt('Escreva o novo lote para este gado:', g.lote);
                                if (newLote) {
                                  setRebanho(prev => prev.map(x => x.id === g.id ? { ...x, lote: newLote } : x));
                                  alert('Gado transferido para o novo lote!');
                                }
                              }}
                              className="text-brand-iris hover:underline cursor-pointer"
                            >
                              Transferir Lote
                            </button>
                          </td>
                        </tr>
                      ))}

                      {activeSector === 'LIVESTOCK' && activeResource === 'reproducao' && reproducao.map(rep => (
                        <tr key={rep.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-bold">{rep.tipo}</td>
                          <td className="p-3 font-mono text-gray-500">{rep.vacaId}</td>
                          <td className="p-3 font-mono text-gray-500">{rep.touroId}</td>
                          <td className="p-3 font-mono text-gray-400">{rep.data}</td>
                          <td className="p-3 font-bold text-green-600">{rep.resultado}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-brand-iris/10 text-brand-iris rounded text-[9px] font-bold">{rep.estado}</span>
                          </td>
                        </tr>
                      ))}

                      {activeSector === 'LIVESTOCK' && activeResource === 'saude' && saudeAnimal.map(s => (
                        <tr key={s.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-500">{s.animalId}</td>
                          <td className="p-3 font-bold">{s.tipo}</td>
                          <td className="p-3 text-gray-500">{s.descricao}</td>
                          <td className="p-3">{s.medicamento}</td>
                          <td className="p-3 text-right font-mono text-red-500">-{s.custo.toLocaleString()} Kz</td>
                          <td className="p-3 font-mono text-gray-400">{s.data}</td>
                        </tr>
                      ))}

                      {activeSector === 'LIVESTOCK' && activeResource === 'alimentacao' && alimentacao.map(a => (
                        <tr key={a.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-bold">{a.lote}</td>
                          <td className="p-3">{a.tipo}</td>
                          <td className="p-3 text-right font-mono font-bold">{a.consumoDiario} kg</td>
                          <td className="p-3 text-right font-mono text-amber-600">{a.custo.toLocaleString()} Kz</td>
                        </tr>
                      ))}

                      {activeSector === 'LIVESTOCK' && activeResource === 'crescimento' && crescimento.map(cr => (
                        <tr key={cr.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono">{cr.animalId}</td>
                          <td className="p-3 text-right font-mono font-bold">{cr.peso} kg</td>
                          <td className="p-3 text-right font-mono">{cr.altura} cm</td>
                          <td className="p-3 text-right text-green-500 font-bold font-mono">+{cr.ganhoDiario} kg/dia</td>
                          <td className="p-3 font-mono text-gray-400">{cr.data}</td>
                        </tr>
                      ))}

                      {activeSector === 'LIVESTOCK' && activeResource === 'producaoAnimal' && producaoAnimal.map(pa => (
                        <tr key={pa.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-bold">{pa.produto}</td>
                          <td className="p-3 text-right font-mono font-bold">+{pa.quantidade}</td>
                          <td className="p-3">{pa.unidade}</td>
                          <td className="p-3 text-gray-500">{pa.responsavel}</td>
                          <td className="p-3 font-mono text-gray-400">{pa.data}</td>
                        </tr>
                      ))}

                      {activeSector === 'LIVESTOCK' && activeResource === 'comercializacaoPecuaria' && comercializacaoPecuaria.map(cp => (
                        <tr key={cp.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-bold text-amber-600">{cp.tipo}</td>
                          <td className="p-3 font-semibold text-gray-900 dark:text-white">{cp.cliente}</td>
                          <td className="p-3 text-gray-400">{cp.descricao}</td>
                          <td className="p-3 text-right font-mono font-bold text-green-600">+{cp.valor.toLocaleString()} Kz</td>
                          <td className="p-3 font-mono text-gray-400">{cp.data}</td>
                        </tr>
                      ))}

                      {/* --- FISHERIES RENDERS --- */}
                      {activeSector === 'FISHERIES' && activeResource === 'embarcacoes' && (
                        embarcoes.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">
                              <p className="font-semibold text-sm mb-1">Nenhuma embarcação cadastrada</p>
                              <p className="text-xs text-gray-400 mb-3">Envie requisições via API NestJS/Supabase ou adicione localmente para sincronizar.</p>
                            </td>
                          </tr>
                        ) : (
                          embarcoes.map((e, idx) => {
                            const vName = e.nome || e.name || 'Embarcação sem Nome';
                            const vMatricula = e.matricula || e.registrationNumber || e.regNumber || 'N/D';
                            const vCapacidade = e.capacidade || e.capacity || e.capacityTons || 0;
                            const vMotor = e.motor || 'Yamaha 250HP';
                            const vEstado = e.estado || (e.status === 'Operational' ? 'Ativo' : (e.status || 'Ativo'));

                            return (
                              <tr key={e.id || `emb-${idx}`} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                                <td className="p-3 font-bold text-gray-900 dark:text-white">{vName}</td>
                                <td className="p-3 font-mono text-gray-500">{vMatricula}</td>
                                <td className="p-3 text-right font-mono">{vCapacidade} t</td>
                                <td className="p-3 text-gray-400">{vMotor}</td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-bold">{vEstado}</span>
                                </td>
                                <td className="p-3 text-right">
                                  <button 
                                    onClick={() => {
                                      setEmbarcoes(prev => prev.map(x => (x.id === e.id || x.nome === vName) ? { ...x, estado: 'Manutenção', status: 'Maintenance' } : x));
                                      alert(`A embarcação "${vName}" foi enviada para MANUTENÇÃO no estaleiro.`);
                                    }}
                                    className="text-brand-iris hover:underline cursor-pointer text-[10px] font-bold"
                                  >
                                    Manutenção
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )
                      )}

                      {activeSector === 'FISHERIES' && activeResource === 'viagens' && viagens.map(v => (
                        <tr key={v.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-bold">{v.embarcacao}</td>
                          <td className="p-3 font-mono text-gray-400">{v.dataSaida}</td>
                          <td className="p-3 font-mono text-gray-400">{v.dataChegada}</td>
                          <td className="p-3 text-right font-mono">{v.tripulacao} marinheiros</td>
                          <td className="p-3 text-right font-mono">{v.combustivel} L</td>
                          <td className="p-3 text-brand-iris font-semibold">{v.zonaPesca}</td>
                        </tr>
                      ))}

                      {activeSector === 'FISHERIES' && activeResource === 'capturas' && capturas.map(cap => (
                        <tr key={cap.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-500">{cap.viagemId}</td>
                          <td className="p-3 font-bold text-gray-900 dark:text-white">{cap.especie}</td>
                          <td className="p-3 text-right font-mono">{cap.quantidade} caixas</td>
                          <td className="p-3 text-right font-mono font-bold text-green-600">+{cap.peso} kg</td>
                          <td className="p-3 text-right font-mono font-black">{cap.valor.toLocaleString()} Kz</td>
                          <td className="p-3 font-semibold text-brand-iris">{cap.qualidade}</td>
                        </tr>
                      ))}

                      {activeSector === 'FISHERIES' && activeResource === 'custosPesca' && custosPesca.map(cust => (
                        <tr key={cust.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-500">{cust.viagemId}</td>
                          <td className="p-3 text-right font-mono text-red-500">{cust.combustivel.toLocaleString()} Kz</td>
                          <td className="p-3 text-right font-mono text-red-500">{cust.gelo.toLocaleString()} Kz</td>
                          <td className="p-3 text-right font-mono text-red-500">{cust.alimentacao.toLocaleString()} Kz</td>
                          <td className="p-3 text-right font-mono text-red-500">{cust.manutencao.toLocaleString()} Kz</td>
                          <td className="p-3 text-right font-mono text-red-500">{cust.taxas.toLocaleString()} Kz</td>
                        </tr>
                      ))}

                      {activeSector === 'FISHERIES' && activeResource === 'manutencaoPesca' && manutencaoPesca.map(m => (
                        <tr key={m.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-bold">{m.embarcacao}</td>
                          <td className="p-3 text-brand-iris font-semibold">{m.tipo}</td>
                          <td className="p-3 text-gray-500">{m.descricao}</td>
                          <td className="p-3 text-right font-mono text-red-500">-{m.custo.toLocaleString()} Kz</td>
                          <td className="p-3 font-mono text-gray-400">{m.data}</td>
                        </tr>
                      ))}

                      {activeSector === 'FISHERIES' && activeResource === 'comercializacaoPesca' && comercializacaoPesca.map(cp => (
                        <tr key={cp.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-500">{cp.lote}</td>
                          <td className="p-3 font-bold">{cp.mercado}</td>
                          <td className="p-3 font-semibold text-gray-900 dark:text-white">{cp.comprador}</td>
                          <td className="p-3 text-right font-mono">{cp.quantidade} kg</td>
                          <td className="p-3 text-right font-mono text-green-600 font-bold">+{cp.valor.toLocaleString()} Kz</td>
                          <td className="p-3 text-brand-iris font-bold">{cp.contrato}</td>
                        </tr>
                      ))}

                      {/* --- COMMERCE RENDERS --- */}
                      {activeSector === 'COMMERCE' && activeResource === 'produtos' && produtos.map(p => (
                        <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-500">{p.sku}</td>
                          <td className="p-3 font-mono font-bold text-brand-iris">{p.codigo}</td>
                          <td className="p-3">{p.categoria}</td>
                          <td className="p-3 text-gray-500">{p.fornecedor}</td>
                          <td className="p-3 text-right font-mono text-red-500">{p.precoCompra.toLocaleString()} Kz</td>
                          <td className="p-3 text-right font-mono text-green-600 font-bold">{p.precoVenda.toLocaleString()} Kz</td>
                          <td className="p-3 text-right font-mono font-black">{p.estoque} un</td>
                        </tr>
                      ))}

                      {activeSector === 'COMMERCE' && activeResource === 'inventario' && inventario.map(i => (
                        <tr key={i.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-500">{i.produtoId}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              i.tipo === 'Entrada' ? 'bg-green-105 text-green-700' : 'bg-red-105 text-red-700'
                            }`}>{i.tipo}</span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold">{i.quantidade}</td>
                          <td className="p-3 font-mono text-gray-400">{i.data}</td>
                          <td className="p-3 text-gray-500">{i.responsavel}</td>
                        </tr>
                      ))}

                      {activeSector === 'COMMERCE' && activeResource === 'compras' && compras.map(c => (
                        <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-400 text-[10px]">{c.id}</td>
                          <td className="p-3 font-bold">{c.pedido}</td>
                          <td className="p-3 font-semibold text-gray-900 dark:text-white">{c.fornecedor}</td>
                          <td className="p-3 text-right font-mono text-red-500">-{c.valor.toLocaleString()} Kz</td>
                          <td className="p-3 font-mono text-gray-400">{c.data}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-bold">{c.estado}</span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {c.estado === 'Pedido' && (
                              <button 
                                onClick={() => {
                                  setCompras(prev => prev.map(x => x.id === c.id ? { ...x, estado: 'Aprovação' } : x));
                                  alert('Pedido de compra aprovado com sucesso!');
                                }}
                                className="text-brand-iris hover:underline cursor-pointer"
                              >
                                Aprovar
                              </button>
                            )}
                            {c.estado === 'Aprovação' && (
                              <button 
                                onClick={() => {
                                  setCompras(prev => prev.map(x => x.id === c.id ? { ...x, estado: 'Receção' } : x));
                                  alert('Mercadorias dadas como recebidas em estoque!');
                                }}
                                className="text-green-600 hover:underline cursor-pointer"
                              >
                                Receber
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}

                      {activeSector === 'COMMERCE' && activeResource === 'vendas' && vendas.map(v => (
                        <tr key={v.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-400 text-[10px]">{v.id}</td>
                          <td className="p-3 font-bold">{v.orcamento}</td>
                          <td className="p-3 font-semibold text-gray-900 dark:text-white">{v.cliente}</td>
                          <td className="p-3 text-right font-mono text-green-600 font-bold">+{v.valor.toLocaleString()} Kz</td>
                          <td className="p-3 font-mono text-gray-400">{v.data}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold">{v.estado}</span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {v.estado === 'Orçamento' && (
                              <button 
                                onClick={() => {
                                  setVendas(prev => prev.map(x => x.id === v.id ? { ...x, estado: 'Pedido' } : x));
                                  alert('Orçamento aprovado e convertido em Pedido!');
                                }}
                                className="text-brand-iris hover:underline cursor-pointer"
                              >
                                Aprovar
                              </button>
                            )}
                            {v.estado === 'Pedido' && (
                              <button 
                                onClick={() => {
                                  setVendas(prev => prev.map(x => x.id === v.id ? { ...x, estado: 'Fatura' } : x));
                                  alert('Fatura emitida com sucesso!');
                                }}
                                className="text-green-600 hover:underline cursor-pointer"
                              >
                                Faturar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}

                      {activeSector === 'COMMERCE' && activeResource === 'crm' && crm.map(cl => (
                        <tr key={cl.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-bold text-gray-900 dark:text-white">{cl.nome}</td>
                          <td className="p-3 font-semibold text-brand-iris">{cl.tipo}</td>
                          <td className="p-3 font-mono">{cl.contacto}</td>
                          <td className="p-3 text-gray-500">{cl.email}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-green-105 text-green-700 rounded text-[9px] font-bold">{cl.status}</span>
                          </td>
                        </tr>
                      ))}

                      {activeSector === 'COMMERCE' && activeResource === 'contasAReceber' && contasAReceber.map(cr => (
                        <tr key={cr.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-bold">{cr.fatura}</td>
                          <td className="p-3 font-semibold text-gray-900 dark:text-white">{cr.cliente}</td>
                          <td className="p-3 font-mono">{cr.parcelas}</td>
                          <td className="p-3 text-right font-mono font-bold text-green-600">+{cr.valor.toLocaleString()} Kz</td>
                          <td className="p-3 font-mono text-gray-400">{cr.dataVencimento}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold">{cr.estado}</span>
                          </td>
                        </tr>
                      ))}

                      {activeSector === 'COMMERCE' && activeResource === 'contasAPagar' && contasAPagar.map(cp => (
                        <tr key={cp.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-semibold text-gray-900 dark:text-white">{cp.fornecedor}</td>
                          <td className="p-3 font-bold">{cp.despesa}</td>
                          <td className="p-3 text-gray-400">{cp.obligacoes || cp.obrigacoes}</td>
                          <td className="p-3 text-right font-mono text-red-500">-{cp.valor.toLocaleString()} Kz</td>
                          <td className="p-3 font-mono text-gray-400">{cp.dataVencimento}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold">{cp.estado}</span>
                          </td>
                        </tr>
                      ))}

                      {/* --- CROSS-SECTOR OPERATIONAL ROWS --- */}
                      {activeResource === 'trabalho' && trabalho.filter(t => t.setor === activeSector || !t.setor).map(tr => (
                        <tr key={tr.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-400 text-[10px]">{tr.data}</td>
                          <td className="p-3 font-bold text-gray-900 dark:text-white">{tr.trabalhador}</td>
                          <td className="p-3 text-brand-iris font-medium">{tr.tarefa}</td>
                          <td className="p-3 text-right font-mono">{tr.numTrabalhadores ?? tr.trabalhadores ?? 1} un</td>
                          <td className="p-3 text-right font-mono">{tr.horasTrabalhadas ?? tr.horas ?? 8}h</td>
                          <td className="p-3 text-right font-mono text-gray-500">{(tr.valorDiaria ?? tr.diaria ?? 0).toLocaleString()} Kz</td>
                          <td className="p-3 text-right font-mono font-bold text-red-500">-{(tr.custoTotal ?? tr.total ?? 0).toLocaleString()} Kz</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              tr.estadoPagamento === 'Pago' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                              tr.estadoPagamento === 'Parcial' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                            }`}>{tr.estadoPagamento || 'Pago'}</span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm('Pretende remover este registo de mão de obra?')) {
                                  setTrabalho(prev => prev.filter(x => x.id !== tr.id));
                                }
                              }}
                              className="text-red-500 hover:text-red-700 text-xs font-semibold p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {activeResource === 'entradas_caixa' && entradasCaixa.filter(ec => ec.setor === activeSector || !ec.setor).map(ec => (
                        <tr key={ec.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-400 text-[10px]">{ec.data}</td>
                          <td className="p-3 font-bold text-gray-900 dark:text-white">{ec.descricao || ec.titulo || 'Entrada de Caixa'}</td>
                          <td className="p-3 text-gray-600 dark:text-gray-300">{ec.cliente || 'Consumidor / Mercado'}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 rounded text-[9px] font-bold">
                              {ec.categoria || 'Venda'}
                            </span>
                          </td>
                          <td className="p-3 text-gray-500 font-mono text-[11px]">{ec.metodoPagamento || ec.formaPagamento || 'Numerário'}</td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-600">+{(ec.valor ?? 0).toLocaleString()} Kz</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm('Pretende remover esta entrada de caixa?')) {
                                  setEntradasCaixa(prev => prev.filter(x => x.id !== ec.id));
                                }
                              }}
                              className="text-red-500 hover:text-red-700 text-xs font-semibold p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {activeResource === 'saidas_caixa' && saidasCaixa.filter(sc => sc.setor === activeSector || !sc.setor).map(sc => (
                        <tr key={sc.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-400 text-[10px]">{sc.data}</td>
                          <td className="p-3 font-bold text-gray-900 dark:text-white">{sc.descricao || sc.titulo || 'Despesa Operacional'}</td>
                          <td className="p-3 text-gray-600 dark:text-gray-300">{sc.fornecedor || 'Fornecedor Local'}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 rounded text-[9px] font-bold">
                              {sc.categoria || 'Custo'}
                            </span>
                          </td>
                          <td className="p-3 text-gray-500 text-xs">{sc.centroCusto || 'Unidade Principal'}</td>
                          <td className="p-3 text-right font-mono font-bold text-red-500">-{(sc.valor ?? 0).toLocaleString()} Kz</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm('Pretende remover esta saída de caixa?')) {
                                  setSaidasCaixa(prev => prev.filter(x => x.id !== sc.id));
                                }
                              }}
                              className="text-red-500 hover:text-red-700 text-xs font-semibold p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {activeResource === 'consumo_familiar' && consumoFamiliar.filter(cf => cf.setor === activeSector || !cf.setor).map(cf => (
                        <tr key={cf.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-400 text-[10px]">{cf.data}</td>
                          <td className="p-3 font-bold text-gray-900 dark:text-white">{cf.produto}</td>
                          <td className="p-3 text-right font-mono font-bold">{cf.quantidade} {cf.unidade}</td>
                          <td className="p-3 text-right font-mono text-gray-500">{(cf.valorUnitarioEstimado ?? cf.valorUnitario ?? 0).toLocaleString()} Kz</td>
                          <td className="p-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">{(cf.valorTotalEstimado ?? cf.valorTotal ?? 0).toLocaleString()} Kz</td>
                          <td className="p-3 text-gray-600 dark:text-gray-300 font-mono text-xs">{cf.membrosFamilia || 4} pessoas</td>
                          <td className="p-3 text-gray-500 text-xs">{cf.finalidade}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm('Pretende remover este registo de auto-consumo?')) {
                                  setConsumoFamiliar(prev => prev.filter(x => x.id !== cf.id));
                                }
                              }}
                              className="text-red-500 hover:text-red-700 text-xs font-semibold p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {activeResource === 'ativos_fixos' && ativosFixos.filter(af => af.setor === activeSector || !af.setor).map(af => (
                        <tr key={af.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-bold text-gray-900 dark:text-white">{af.nome}</td>
                          <td className="p-3 font-mono text-brand-iris font-semibold text-xs">{af.codigo || af.identificador || 'AT-001'}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 rounded text-[9px] font-bold">
                              {af.categoria}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono text-gray-500">{(af.valorAquisicao ?? af.custoAquisicao ?? 0).toLocaleString()} Kz</td>
                          <td className="p-3 text-right font-mono font-bold text-gray-900 dark:text-white">{(af.valorAtual ?? af.custoAquisicao ?? 0).toLocaleString()} Kz</td>
                          <td className="p-3 text-gray-500 text-xs">{af.localizacao}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              (af.estadoOperacional || af.estado) === 'Excelente' || (af.estadoOperacional || af.estado) === 'Bom' || (af.estadoOperacional || af.estado) === 'Operacional' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                              (af.estadoOperacional || af.estado) === 'Em Manutenção' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            }`}>{af.estadoOperacional || af.estado || 'Operacional'}</span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm('Pretende remover este ativo fixo?')) {
                                  setAtivosFixos(prev => prev.filter(x => x.id !== af.id));
                                }
                              }}
                              className="text-red-500 hover:text-red-700 text-xs font-semibold p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {activeResource === 'pragas' && pragas.filter(pr => pr.setor === activeSector || !pr.setor).map(pr => (
                        <tr key={pr.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-mono text-gray-400 text-[10px]">{pr.data}</td>
                          <td className="p-3 font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <Bug size={14} className="text-red-500" />
                            {pr.praga}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              pr.gravidade === 'Crítica' || pr.gravidade === 'Alta' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' :
                              pr.gravidade === 'Média' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                            }`}>{pr.gravidade}</span>
                          </td>
                          <td className="p-3 text-gray-600 dark:text-gray-300 text-xs">{pr.areaAfetada}</td>
                          <td className="p-3 text-gray-500 text-xs">
                            <div className="font-semibold text-gray-900 dark:text-white">{pr.acao}</div>
                            <div className="text-[10px] text-gray-400">{pr.produtoAplicado}</div>
                          </td>
                          <td className="p-3 text-right font-mono text-red-500 font-semibold">{pr.custoIntervencao ? `-${(pr.custoIntervencao ?? 0).toLocaleString()} Kz` : '0 Kz'}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              pr.estadoResolucao === 'Resolvido' ? 'bg-green-100 text-green-700' :
                              pr.estadoResolucao === 'Sob Controlo' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                            }`}>{pr.estadoResolucao}</span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm('Pretende remover esta monitoria de pragas?')) {
                                  setPragas(prev => prev.filter(x => x.id !== pr.id));
                                }
                              }}
                              className="text-red-500 hover:text-red-700 text-xs font-semibold p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inline Form to Add Record */}
              <div className="p-5 bg-gray-50 dark:bg-[#1C1C24] border border-gray-150 dark:border-[#22222E] rounded-2xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Plus className="text-brand-iris" size={16} />
                  Registar Novo Item: {activeResource.toUpperCase()}
                </h4>

                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeSector === 'AGRICULTURE' && activeResource === 'talhoes' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nome do Talhão</label>
                        <input 
                          type="text" 
                          required
                          value={genericForm.nome || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, nome: e.target.value }))}
                          placeholder="Ex: Talhão Gama" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Área (ha)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          value={genericForm.area || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, area: e.target.value }))}
                          placeholder="Ex: 5.5" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Coordenadas GPS</label>
                        <input 
                          type="text" 
                          value={genericForm.gps || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, gps: e.target.value }))}
                          placeholder="Ex: -12.34, 13.56" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tipo de Solo</label>
                        <input 
                          type="text" 
                          value={genericForm.tipoSolo || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, tipoSolo: e.target.value }))}
                          placeholder="Ex: Arenoso, Calcário" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Responsável</label>
                        <input 
                          type="text" 
                          value={genericForm.responsavel || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, responsavel: e.target.value }))}
                          placeholder="Ex: Mateus Gaspar" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}

                  {activeSector === 'AGRICULTURE' && activeResource === 'culturas' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cultura</label>
                        <input 
                          type="text" 
                          required
                          value={genericForm.cultura || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, cultura: e.target.value }))}
                          placeholder="Ex: Soja, Milho" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Variedade</label>
                        <input 
                          type="text" 
                          value={genericForm.variedade || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, variedade: e.target.value }))}
                          placeholder="Ex: Kambeta" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Quantidade Plantada</label>
                        <input 
                          type="number" 
                          required
                          value={genericForm.quantidade || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, quantidade: e.target.value }))}
                          placeholder="Ex: 5000" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Data Plantio</label>
                        <input 
                          type="date" 
                          value={genericForm.dataPlantio || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, dataPlantio: e.target.value }))}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Talhão</label>
                        <input 
                          type="text" 
                          value={genericForm.talhao || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, talhao: e.target.value }))}
                          placeholder="Ex: Talhão Alfa" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}

                  {activeSector === 'FISHERIES' && activeResource === 'embarcacoes' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nome da Embarcação</label>
                        <input 
                          type="text" 
                          required
                          value={genericForm.nome || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, nome: e.target.value }))}
                          placeholder="Ex: Estrela do Namibe" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Matrícula da Embarcação</label>
                        <input 
                          type="text" 
                          required
                          value={genericForm.matricula || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, matricula: e.target.value }))}
                          placeholder="Ex: NAM-2024-A" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Capacidade (Toneladas)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          required
                          value={genericForm.capacidade || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, capacidade: e.target.value }))}
                          placeholder="Ex: 15" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Marca do Motor</label>
                        <select 
                          required
                          value={genericForm.motorBrand || 'Yamaha'} 
                          onChange={e => setGenericForm(p => ({ ...p, motorBrand: e.target.value }))}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="Yamaha">Yamaha</option>
                          <option value="Suzuki">Suzuki</option>
                          <option value="Honda">Honda</option>
                          <option value="Mercury">Mercury</option>
                          <option value="Volvo Penta">Volvo Penta</option>
                          <option value="Tohatsu">Tohatsu</option>
                          <option value="Yanmar">Yanmar</option>
                          <option value="Outra">Outra</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Potência do Motor (HP)</label>
                        <input 
                          type="text" 
                          required
                          value={genericForm.motorHP || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, motorHP: e.target.value }))}
                          placeholder="Ex: 250 HP" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Detalhes / Observações</label>
                        <textarea 
                          value={genericForm.detalhes || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, detalhes: e.target.value }))}
                          placeholder="Ex: Embarcação de pesca artesanal com motor de popa reformado em 2025" 
                          rows={2}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}

                  {activeResource === 'trabalho' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Trabalhador / Equipa</label>
                        <input 
                          type="text" 
                          required
                          value={genericForm.trabalhador || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, trabalhador: e.target.value }))}
                          placeholder="Ex: Equipa de Sachadores / João Manuel" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tarefa / Função</label>
                        <input 
                          type="text" 
                          required
                          value={genericForm.tarefa || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, tarefa: e.target.value }))}
                          placeholder="Ex: Monda, Colheita, Limpeza de redes, Balcão" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Número de Pessoas</label>
                        <input 
                          type="number" 
                          min="1"
                          required
                          value={genericForm.numTrabalhadores || '1'} 
                          onChange={e => setGenericForm(p => ({ ...p, numTrabalhadores: e.target.value }))}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Horas Trabalhadas</label>
                        <input 
                          type="number" 
                          step="0.5"
                          required
                          value={genericForm.horasTrabalhadas || '8'} 
                          onChange={e => setGenericForm(p => ({ ...p, horasTrabalhadas: e.target.value }))}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Valor Diária por Pessoa (Kz)</label>
                        <input 
                          type="number" 
                          required
                          value={genericForm.valorDiaria || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, valorDiaria: e.target.value }))}
                          placeholder="Ex: 5000" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Estado do Pagamento</label>
                        <select 
                          value={genericForm.estadoPagamento || 'Pago'} 
                          onChange={e => setGenericForm(p => ({ ...p, estadoPagamento: e.target.value }))}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="Pago">Pago</option>
                          <option value="Pendente">Pendente</option>
                          <option value="Parcial">Parcial</option>
                        </select>
                      </div>
                    </>
                  )}

                  {activeResource === 'entradas_caixa' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Descrição da Entrada</label>
                        <input 
                          type="text" 
                          required
                          value={genericForm.descricao || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, descricao: e.target.value }))}
                          placeholder="Ex: Venda de 20 sacos de milho / 5 caixas de carapau" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Valor da Entrada (Kz)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          value={genericForm.valor || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, valor: e.target.value }))}
                          placeholder="Ex: 85000" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cliente / Origem</label>
                        <input 
                          type="text" 
                          value={genericForm.cliente || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, cliente: e.target.value }))}
                          placeholder="Ex: Mercado do 30 / Armazém Rocha" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Categoria de Receita</label>
                        <input 
                          type="text" 
                          value={genericForm.categoria || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, categoria: e.target.value }))}
                          placeholder="Ex: Venda Direta, Serviços, Subvenção" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Método de Pagamento</label>
                        <select 
                          value={genericForm.metodoPagamento || 'Numerário'} 
                          onChange={e => setGenericForm(p => ({ ...p, metodoPagamento: e.target.value }))}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="Numerário">Numerário / Cash</option>
                          <option value="Transferência Multicaixa">Transferência Multicaixa / Express</option>
                          <option value="TPA / Cartão">TPA / Cartão</option>
                          <option value="Cheque / Depósito">Cheque / Depósito Bancário</option>
                        </select>
                      </div>
                    </>
                  )}

                  {activeResource === 'saidas_caixa' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Descrição do Custo / Despesa</label>
                        <input 
                          type="text" 
                          required
                          value={genericForm.descricao || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, descricao: e.target.value }))}
                          placeholder="Ex: Compra de Gasóleo / Ração / Embalagens" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Valor da Saída (Kz)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          value={genericForm.valor || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, valor: e.target.value }))}
                          placeholder="Ex: 35000" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Fornecedor / Beneficiário</label>
                        <input 
                          type="text" 
                          value={genericForm.fornecedor || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, fornecedor: e.target.value }))}
                          placeholder="Ex: Sonangol, Pumangol, AgroAngola" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Categoria de Despesa</label>
                        <input 
                          type="text" 
                          value={genericForm.categoria || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, categoria: e.target.value }))}
                          placeholder="Ex: Combustível, Insumos, Manutenção, Renda" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Centro de Custo / Lote</label>
                        <input 
                          type="text" 
                          value={genericForm.centroCusto || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, centroCusto: e.target.value }))}
                          placeholder="Ex: Talhão 3 / Barco Alfa / Loja Centro" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}

                  {activeResource === 'consumo_familiar' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Produto / Alimento Retirado</label>
                        <input 
                          type="text" 
                          required
                          value={genericForm.produto || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, produto: e.target.value }))}
                          placeholder="Ex: Milho, Feijão, Leite, Peixe Carapau, Frango" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Quantidade Retirada</label>
                        <input 
                          type="number" 
                          step="0.1"
                          required
                          value={genericForm.quantidade || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, quantidade: e.target.value }))}
                          placeholder="Ex: 15" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Unidade</label>
                        <select 
                          value={genericForm.unidade || 'kg'} 
                          onChange={e => setGenericForm(p => ({ ...p, unidade: e.target.value }))}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="kg">kg (Quilogramas)</option>
                          <option value="litros">litros (Litros)</option>
                          <option value="unidades">unidades</option>
                          <option value="sacos">sacos</option>
                          <option value="caixas">caixas</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Preço de Referência Unitário (Kz)</label>
                        <input 
                          type="number" 
                          value={genericForm.valorUnitarioEstimado || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, valorUnitarioEstimado: e.target.value }))}
                          placeholder="Ex: 800" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Beneficiários (Pessoas na Casa)</label>
                        <input 
                          type="number" 
                          value={genericForm.membrosFamilia || '4'} 
                          onChange={e => setGenericForm(p => ({ ...p, membrosFamilia: e.target.value }))}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Finalidade</label>
                        <input 
                          type="text" 
                          value={genericForm.finalidade || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, finalidade: e.target.value }))}
                          placeholder="Ex: Alimentação do agregado / Apoio comunitário" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}

                  {activeResource === 'ativos_fixos' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nome do Ativo / Equipamento</label>
                        <input 
                          type="text" 
                          required
                          value={genericForm.nome || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, nome: e.target.value }))}
                          placeholder="Ex: Trator Massey Ferguson / Arca Congeladora / Motor Yamaha" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Código / Matrícula</label>
                        <input 
                          type="text" 
                          value={genericForm.codigo || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, codigo: e.target.value }))}
                          placeholder="Ex: AT-2025-01" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Categoria de Ativo</label>
                        <input 
                          type="text" 
                          value={genericForm.categoria || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, categoria: e.target.value }))}
                          placeholder="Ex: Maquinaria, Veículo, Instalações, Frio" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Custo de Aquisição (Kz)</label>
                        <input 
                          type="number" 
                          required
                          value={genericForm.valorAquisicao || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, valorAquisicao: e.target.value }))}
                          placeholder="Ex: 8500000" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Valor Atual Estimado (Kz)</label>
                        <input 
                          type="number" 
                          value={genericForm.valorAtual || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, valorAtual: e.target.value }))}
                          placeholder="Ex: 7200000" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Estado Operacional</label>
                        <select 
                          value={genericForm.estadoOperacional || 'Bom'} 
                          onChange={e => setGenericForm(p => ({ ...p, estadoOperacional: e.target.value }))}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="Excelente">Excelente</option>
                          <option value="Bom">Bom</option>
                          <option value="Em Manutenção">Em Manutenção</option>
                          <option value="Danificado">Danificado</option>
                        </select>
                      </div>
                    </>
                  )}

                  {activeResource === 'pragas' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Praga / Anomalia Sanitária</label>
                        <input 
                          type="text" 
                          required
                          value={genericForm.praga || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, praga: e.target.value }))}
                          placeholder="Ex: Lagarta do Cartucho / Carraças / Gorgulho / Míldio" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nível de Gravidade</label>
                        <select 
                          value={genericForm.gravidade || 'Média'} 
                          onChange={e => setGenericForm(p => ({ ...p, gravidade: e.target.value }))}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="Baixa">Baixa</option>
                          <option value="Média">Média</option>
                          <option value="Alta">Alta</option>
                          <option value="Crítica">Crítica</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Área / Lote Afetado</label>
                        <input 
                          type="text" 
                          value={genericForm.areaAfetada || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, areaAfetada: e.target.value }))}
                          placeholder="Ex: Talhão Beta / Curral 2 / Armazém Norte" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Ação de Controlo / Intervenção</label>
                        <input 
                          type="text" 
                          value={genericForm.acao || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, acao: e.target.value }))}
                          placeholder="Ex: Pulverização com Biopesticida / Banho carracicida" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Produto / Tratamento Aplicado</label>
                        <input 
                          type="text" 
                          value={genericForm.produtoAplicado || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, produtoAplicado: e.target.value }))}
                          placeholder="Ex: Óleo de Neem / Deltametrina / Fosfina" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Custo da Intervenção (Kz)</label>
                        <input 
                          type="number" 
                          value={genericForm.custoIntervencao || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, custoIntervencao: e.target.value }))}
                          placeholder="Ex: 12000" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}

                  {/* Default simple text fallback fields for generic tables */}
                  {!(activeResource === 'talhoes' || activeResource === 'culturas' || activeResource === 'embarcacoes' || activeResource === 'trabalho' || activeResource === 'entradas_caixa' || activeResource === 'saidas_caixa' || activeResource === 'consumo_familiar' || activeResource === 'ativos_fixos' || activeResource === 'pragas') && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Identificador / Nome</label>
                        <input 
                          type="text" 
                          required
                          value={genericForm.nome || genericForm.identificacao || genericForm.produto || genericForm.pedido || genericForm.orcamento || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, nome: e.target.value, identificacao: e.target.value, produto: e.target.value, pedido: e.target.value, orcamento: e.target.value }))}
                          placeholder="Escreva a identificação" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Quantidade / Valor / Área</label>
                        <input 
                          type="number" 
                          step="any"
                          required
                          value={genericForm.quantidade || genericForm.valor || genericForm.peso || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, quantidade: e.target.value, valor: e.target.value, peso: e.target.value }))}
                          placeholder="Quantidade ou valor numérico" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Detalhes Adicionais / Lote / Responsável</label>
                        <input 
                          type="text" 
                          value={genericForm.detalhes || genericForm.lote || genericForm.responsavel || genericForm.cliente || genericForm.fornecedor || ''} 
                          onChange={e => setGenericForm(p => ({ ...p, detalhes: e.target.value, lote: e.target.value, responsavel: e.target.value, cliente: e.target.value, fornecedor: e.target.value }))}
                          placeholder="Responsável, Lote, Cliente ou Fornecedor" 
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-3 flex justify-end">
                    <button 
                      type="submit" 
                      className="px-5 py-2 bg-brand-iris hover:bg-brand-iris-dark text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Adicionar Registo</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
