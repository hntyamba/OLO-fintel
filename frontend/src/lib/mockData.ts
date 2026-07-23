export const MOCK_SURVEY_STATS = {
  total: 54,
  byProvince: {
    "Benguela": 28,
    "Huambo": 14,
    "Luanda": 12
  },
  bySector: {
    "Agricultura": 32,
    "Pecuária": 12,
    "Pesca": 10
  },
  challenges: [
    { id: '1', challenge: 'Falta de controle de fluxo de caixa.', percentage: 48 },
    { id: '2', challenge: 'Dificuldade de acesso a financiamento bancário.', percentage: 37 },
    { id: '3', challenge: 'Falta de registos e histórico financeiro organizado.', percentage: 15 }
  ]
};

export const MOCK_ORGANIZATIONS = [
  { id: 'org-sim-uuid-benguela', name: 'Cooperativa Agropecuária do Dombe Grande', sector: 'Agriculture', province: 'Benguela', maturity: 'INTERMEDIATE', suspended: false, assignedConsultantId: 'cons-1', suspendedReason: null },
  { id: 'org-2', name: 'Cooperativa Agrícola de Catabola', sector: 'Agriculture', province: 'Bié', maturity: 'BEGINNER', suspended: false, assignedConsultantId: null, suspendedReason: null },
  { id: 'org-3', name: 'Associação de Pescas de Cacuaco', sector: 'Fisheries', province: 'Luanda', maturity: 'ADVANCED', suspended: false, assignedConsultantId: 'cons-2', suspendedReason: null }
];

export const MOCK_USERS = [
  { id: 'usr-1', name: 'José Gariel', email: 'josegariel622@gmail.com', role: 'SUPER_ADMIN', organizationId: 'org-sim-uuid-benguela', organizationName: 'Cooperativa Agropecuária do Dombe Grande', fundingScore: 78 },
  { id: 'usr-2', name: 'Manuel António', email: 'manuel@example.com', role: 'OWNER', organizationId: 'org-2', organizationName: 'Cooperativa Agrícola de Catabola', fundingScore: 45 }
];

export const MOCK_CONSULTANTS = [
  { id: 'cons-1', name: 'Dr. Lucas Ribeiro', email: 'lucas@fintel.ao', activeDelegations: 12 },
  { id: 'cons-2', name: 'Dra. Maria Mendes', email: 'maria@fintel.ao', activeDelegations: 7 }
];

export const MOCK_DOCUMENTS = [
  { id: "doc-1", docType: "Certidão Comercial", name: "certidao_comercial_2026.pdf", status: "VERIFIED", uploadedAt: "2026-07-10T14:30:00.000Z" },
  { id: "doc-2", docType: "Demonstração de Resultados", name: "dre_exercicio_2025.pdf", status: "PENDING", uploadedAt: "2026-07-18T10:15:00.000Z" }
];

export const MOCK_OPERATIONS = [
  { id: "op-1", type: "receita", category: "Venda de Milho", amount: 450000, date: "2026-07-15", description: "Lote de 5 toneladas para mercado local", status: "CONFIRMADO" },
  { id: "op-2", type: "despesa", category: "Combustível", amount: 85000, date: "2026-07-14", description: "Abastecimento do trator de rega", status: "CONFIRMADO" }
];

export const MOCK_AI_ADVISOR = {
  report: `### Relatório do Consultor Especializado (Financeiro)\n\nCom base nos dados fornecidos para a cooperativa, identificámos as seguintes oportunidades cruciais:\n\n1. **Gestão do Fluxo de Caixa**: A sua cooperativa apresenta sazonalidade elevada. Sugere-se a criação de um fluxo de reserva financeira que cubra pelo menos 3 meses de despesas fixas operacionais.\n2. **Otimização de Custos de Produção**: Reduzir a dependência de fertilizantes químicos através da transição progressiva para fertilizantes orgânicos e compostagem local pode diminuir os custos operacionais em até 22%.\n3. **Prontidão de Financiamento**: Recomendamos a submissão formal de uma Demonstração de Resultados (DRE) juntamente com extratos bancários mensais organizados para aumentar a sua pontuação de elegibilidade de 45% para 78%.\n\n_Recomendação gerada com sucesso para o utilizador._`
};

export const MOCK_FUNDING_SCORE = {
  score: 74,
  details: {
    documentationScore: 80,
    creditHistoryScore: 60,
    leverageScore: 70,
    riskRating: 'Baixo/Médio'
  }
};

export const MOCK_ACTION_PLAN = {
  actionPlan: [
    { step: 1, title: 'Organizar Documentação Financeira', description: 'Compilar DRE, extratos bancários e estatutos para apresentação a investidores.', priority: 'Alta', deadline: '2 semanas' },
    { step: 2, title: 'Melhorar Fluxo de Caixa', description: 'Implementar registo diário de receitas e despesas no módulo financeiro.', priority: 'Alta', deadline: '1 mês' },
    { step: 3, title: 'Diversificar Canais de Venda', description: 'Expandir para mercados institucionais e contratos com distribuidores.', priority: 'Média', deadline: '3 meses' }
  ]
};

export const MOCK_APPLICATIONS = [
  {
    id: 'app-5011',
    requestedAmount: 5000000,
    purpose: 'Compra de Trator de Pneus e Equipamentos de Rega',
    status: 'InAnalysis',
    createdAt: '2026-07-19T12:00:00.000Z'
  }
];

export const MOCK_NOTIFICATIONS = [
  { id: 'not-1', title: 'Candidatura Submetida', message: 'A sua candidatura a crédito de 1.5M Kz está em fase de análise pelo júri.', type: 'info', read: false, createdAt: new Date().toISOString() }
];
