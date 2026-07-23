import React, { useState } from 'react';
import { Sprout, Activity, Ship, ShoppingBag, Sparkles } from 'lucide-react';
import AgricultureView from './AgricultureView';
import LivestockView from './LivestockView';
import FisheriesView from './FisheriesView';
import CommerceView from './CommerceView';

export interface OperationsPageProps {
  userIndustry: string | null;
  userId: string;
  userRole: string;
}

export default function OperationsPage({ userIndustry, userId, userRole }: OperationsPageProps) {
  const [activeSector, setActiveSector] = useState<'AGRICULTURE' | 'LIVESTOCK' | 'FISHERIES' | 'COMMERCE'>(() => {
    const savedSector = localStorage.getItem(`olo-fintel-lastSector-${userId}`);
    if (savedSector) return savedSector as any;
    return (userIndustry as any) || 'AGRICULTURE';
  });

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

  const [genericForm, setGenericForm] = useState<Record<string, string>>({});

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
        const brand = genericForm.motorBrand || 'Yamaha';
        const hp = genericForm.motorHP || '250HP';
        setEmbarcoes(prev => [...prev, {
          id,
          nome: genericForm.nome || 'Nova Barca',
          matricula: genericForm.matricula || `NAM-${Math.floor(Math.random() * 900) + 100}-A`,
          capacidade: parseFloat(genericForm.capacidade || '5'),
          estado: 'Ativo',
          motor: hp ? `${brand} ${hp}` : brand
        }]);
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

    setGenericForm({});
    alert('Registo operacional adicionado com sucesso!');
  };

  return (
    <div className="w-full bg-white dark:bg-[#15151C] border border-gray-200 dark:border-[#232330] rounded-2xl p-6 shadow-sm space-y-6">
      {/* SECTION HEADER & PRIMARY SECTOR SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 dark:border-[#232330] pb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-brand-iris" size={20} />
            Módulos Operacionais por Setor
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Gira os recursos específicos da cooperativa ou PME. Alterne entre setores para testes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {canSwitchSectors ? (
            <>
              <button
                onClick={() => changeSector('AGRICULTURE')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeSector === 'AGRICULTURE'
                    ? 'bg-brand-iris text-white shadow-md'
                    : 'bg-gray-50 dark:bg-[#1E1E28] hover:bg-gray-100 dark:hover:bg-[#282835] text-gray-700 dark:text-gray-300'
                }`}
              >
                <Sprout size={16} />
                <span>Agricultura</span>
              </button>

              <button
                onClick={() => changeSector('LIVESTOCK')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeSector === 'LIVESTOCK'
                    ? 'bg-[#E3A008] text-white shadow-md'
                    : 'bg-gray-50 dark:bg-[#1E1E28] hover:bg-gray-100 dark:hover:bg-[#282835] text-gray-700 dark:text-gray-300'
                }`}
              >
                <Activity size={16} />
                <span>Pecuária</span>
              </button>

              <button
                onClick={() => changeSector('FISHERIES')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeSector === 'FISHERIES'
                    ? 'bg-[#0E9F6E] text-white shadow-md'
                    : 'bg-gray-50 dark:bg-[#1E1E28] hover:bg-gray-100 dark:hover:bg-[#282835] text-gray-700 dark:text-gray-300'
                }`}
              >
                <Ship size={16} />
                <span>Pesca</span>
              </button>

              <button
                onClick={() => changeSector('COMMERCE')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeSector === 'COMMERCE'
                    ? 'bg-[#3F83F8] text-white shadow-md'
                    : 'bg-gray-50 dark:bg-[#1E1E28] hover:bg-gray-100 dark:hover:bg-[#282835] text-gray-700 dark:text-gray-300'
                }`}
              >
                <ShoppingBag size={16} />
                <span>Comércio</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-iris/10 text-brand-iris text-xs font-bold rounded-xl border border-brand-iris/20">
              {activeSector === 'AGRICULTURE' && <><Sprout size={14} className="text-brand-iris" /> <span className="text-gray-800 dark:text-gray-200">Setor: Agricultura</span></>}
              {activeSector === 'LIVESTOCK' && <><Activity size={14} className="text-[#E3A008]" /> <span className="text-gray-800 dark:text-gray-200">Setor: Pecuária</span></>}
              {activeSector === 'FISHERIES' && <><Ship size={14} className="text-[#0E9F6E]" /> <span className="text-gray-800 dark:text-gray-200">Setor: Pesca</span></>}
              {activeSector === 'COMMERCE' && <><ShoppingBag size={14} className="text-[#3F83F8]" /> <span className="text-gray-800 dark:text-gray-200">Setor: Comércio</span></>}
              <span className="text-[10px] text-gray-400 font-normal border-l border-gray-200 dark:border-gray-800 pl-2 ml-1">Painel Operacional do Seu Perfil</span>
            </div>
          )}
        </div>
      </div>

      {/* SUB-WORKSPACE CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SIDEBAR */}
        <div className="lg:col-span-3 space-y-1.5 border-r border-gray-100 dark:border-[#232330] pr-0 lg:pr-4">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 mb-2">Recursos & Operações</p>
          {activeSector === 'AGRICULTURE' && [
            { id: 'talhoes', label: 'Talões', desc: 'Solares, solos e áreas' },
            { id: 'culturas', label: 'Culturas', desc: 'Ciclos de plantio ativos' },
            { id: 'producao', label: 'Produção', desc: 'Registos periódicos' },
            { id: 'colheitas', label: 'Colheitas', desc: 'Datas, perdas e volumes' },
            { id: 'insumos', label: 'Insumos', desc: 'Sementes, fertilizantes, etc' },
            { id: 'equipamentos', label: 'Equipamentos', desc: 'Tratores e manutenção' },
            { id: 'clima', label: 'Clima', desc: 'Temperatura e alertas' },
            { id: 'indicadores', label: 'Indicadores', desc: 'Análise de produtividade' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveResource(item.id); localStorage.setItem(`olo-fintel-lastResource-${userId}`, item.id); }}
              className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 ${activeResource === item.id ? 'bg-brand-iris/10 text-brand-iris border-l-4 border-brand-iris' : 'hover:bg-gray-50 dark:hover:bg-[#1C1C24] text-gray-700 dark:text-gray-300'}`}
            >
              <span className="text-xs font-bold">{item.label}</span>
              <span className="text-[9px] text-gray-400 leading-none">{item.desc}</span>
            </button>
          ))}
          {activeSector === 'LIVESTOCK' && [
            { id: 'rebanho', label: 'Rebanho', desc: 'Gado, raças e lotes' },
            { id: 'reproducao', label: 'Reprodução', desc: 'Inseminação e partos' },
            { id: 'saude', label: 'Saúde Animal', desc: 'Tratamentos e vacinação' },
            { id: 'alimentacao', label: 'Alimentação', desc: 'Consumo diário e custos' },
            { id: 'crescimento', label: 'Crescimento', desc: 'Controlo de peso regular' },
            { id: 'producaoAnimal', label: 'Produção Animal', desc: 'Leite, carne e ovos' },
            { id: 'comercializacaoPecuaria', label: 'Comercialização', desc: 'Contratos e vendas' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveResource(item.id); localStorage.setItem(`olo-fintel-lastResource-${userId}`, item.id); }}
              className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 ${activeResource === item.id ? 'bg-[#E3A008]/10 text-[#E3A008] border-l-4 border-[#E3A008]' : 'hover:bg-gray-50 dark:hover:bg-[#1C1C24] text-gray-700 dark:text-gray-300'}`}
            >
              <span className="text-xs font-bold">{item.label}</span>
              <span className="text-[9px] text-gray-400 leading-none">{item.desc}</span>
            </button>
          ))}
          {activeSector === 'FISHERIES' && [
            { id: 'embarcacoes', label: 'Embarcações', desc: 'Motores, frotas e estados' },
            { id: 'viagens', label: 'Viagens', desc: 'Controlo de tripulação/saídas' },
            { id: 'capturas', label: 'Capturas', desc: 'Espécies e quantidades' },
            { id: 'custosPesca', label: 'Custos Operacionais', desc: 'Combustível, gelo e taxas' },
            { id: 'manutencaoPesca', label: 'Manutenção', desc: 'Inspeções e peças' },
            { id: 'comercializacaoPesca', label: 'Comercialização', desc: 'Mercados e compradores' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveResource(item.id); localStorage.setItem(`olo-fintel-lastResource-${userId}`, item.id); }}
              className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 ${activeResource === item.id ? 'bg-[#0E9F6E]/10 text-[#0E9F6E] border-l-4 border-[#0E9F6E]' : 'hover:bg-gray-50 dark:hover:bg-[#1C1C24] text-gray-700 dark:text-gray-300'}`}
            >
              <span className="text-xs font-bold">{item.label}</span>
              <span className="text-[9px] text-gray-400 leading-none">{item.desc}</span>
            </button>
          ))}
          {activeSector === 'COMMERCE' && [
            { id: 'produtos', label: 'Produtos', desc: 'SKU, compras e vendas' },
            { id: 'inventario', label: 'Inventário', desc: 'Stocks e movimentos' },
            { id: 'compras', label: 'Compras PMEs', desc: 'Ciclo completo de pedidos' },
            { id: 'vendas', label: 'Vendas PMEs', desc: 'Faturação e entrega' },
            { id: 'crm', label: 'CRM', desc: 'Leads, clientes e parceiros' },
            { id: 'contasAReceber', label: 'Contas a Receber', desc: 'Faturas e parcelas' },
            { id: 'contasAPagar', label: 'Contas a Pagar', desc: 'Obrigações e prazos' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveResource(item.id); localStorage.setItem(`olo-fintel-lastResource-${userId}`, item.id); }}
              className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 ${activeResource === item.id ? 'bg-[#3F83F8]/10 text-[#3F83F8] border-l-4 border-[#3F83F8]' : 'hover:bg-gray-50 dark:hover:bg-[#1C1C24] text-gray-700 dark:text-gray-300'}`}
            >
              <span className="text-xs font-bold">{item.label}</span>
              <span className="text-[9px] text-gray-400 leading-none">{item.desc}</span>
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="lg:col-span-9 space-y-6">
          {activeSector === 'AGRICULTURE' && (
            <AgricultureView
              userId={userId} activeResource={activeResource} setActiveResource={setActiveResource}
              genericForm={genericForm} setGenericForm={setGenericForm}
              talhoes={talhoes} setTalhoes={setTalhoes} culturas={culturas} setCulturas={setCulturas}
              producoes={producoes} setProducoes={setProducoes} colheitas={colheitas} setColheitas={setColheitas}
              insumos={insumos} setInsumos={setInsumos} equipamentos={equipamentos} setEquipamentos={setEquipamentos}
              clima={clima} setClima={setClima} handleFormSubmit={handleFormSubmit}
            />
          )}
          {activeSector === 'LIVESTOCK' && (
            <LivestockView
              userId={userId} activeResource={activeResource} setActiveResource={setActiveResource}
              genericForm={genericForm} setGenericForm={setGenericForm}
              rebanho={rebanho} setRebanho={setRebanho} reproducao={reproducao} setReproducao={setReproducao}
              saudeAnimal={saudeAnimal} setSaudeAnimal={setSaudeAnimal} alimentacao={alimentacao} setAlimentacao={setAlimentacao}
              crescimento={crescimento} setCrescimento={setCrescimento} producaoAnimal={producaoAnimal} setProducaoAnimal={setProducaoAnimal}
              comercializacaoPecuaria={comercializacaoPecuaria} setComercializacaoPecuaria={setComercializacaoPecuaria}
              handleFormSubmit={handleFormSubmit}
            />
          )}
          {activeSector === 'FISHERIES' && (
            <FisheriesView
              userId={userId} activeResource={activeResource} setActiveResource={setActiveResource}
              genericForm={genericForm} setGenericForm={setGenericForm}
              embarcoes={embarcoes} setEmbarcoes={setEmbarcoes} viagens={viagens} setViagens={setViagens}
              capturas={capturas} setCapturas={setCapturas} custosPesca={custosPesca} setCustosPesca={setCustosPesca}
              manutencaoPesca={manutencaoPesca} setManutencaoPesca={setManutencaoPesca}
              comercializacaoPesca={comercializacaoPesca} setComercializacaoPesca={setComercializacaoPesca}
              handleFormSubmit={handleFormSubmit}
            />
          )}
          {activeSector === 'COMMERCE' && (
            <CommerceView
              userId={userId} activeResource={activeResource} setActiveResource={setActiveResource}
              genericForm={genericForm} setGenericForm={setGenericForm}
              produtos={produtos} setProdutos={setProdutos} inventario={inventario} setInventario={setInventario}
              compras={compras} setCompras={setCompras} vendas={vendas} setVendas={setVendas}
              crm={crm} setCrm={setCrm} contasAReceber={contasAReceber} setContasAReceber={setContasAReceber}
              contasAPagar={contasAPagar} setContasAPagar={setContasAPagar}
              handleFormSubmit={handleFormSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
