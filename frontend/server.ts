/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  UserContext, 
  SurveyResponse, 
  OperationalRecord, 
  DocumentRecord, 
  Organization, 
  Consultant 
} from './src/types.js';

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'db_storage.json');

// Interface for database structure
interface DatabaseSchema {
  users: Array<any>;
  organizations: Array<Organization>;
  surveyResponses: Array<SurveyResponse>;
  operationalRecords: Array<OperationalRecord>;
  documentRecords: Array<DocumentRecord>;
  consultants: Array<Consultant>;
  fundingApplications?: Array<any>;
  vessels?: Array<any>;
  catches?: Array<any>;
}

// Ensure database file exists and is pre-populated with realistic test users.
function initializeDatabase(): DatabaseSchema {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Remove any pre-seeded fake survey responses
      if (parsed.surveyResponses) {
        parsed.surveyResponses = parsed.surveyResponses.filter((resp: any) => {
          const match = resp.id.match(/^survey-(\d+)$/);
          if (match) {
            const num = parseInt(match[1], 10);
            return num > 63; // Filter out original fake 1 to 63 surveys
          }
          return true;
        });
      }
      if (!parsed.vessels) parsed.vessels = [
        { id: 'emb-1', organizationId: 'org-1', name: 'Estrela do Namibe', registrationNumber: 'NAM-2024-A', capacity: 15, status: 'Operational' },
        { id: 'emb-2', organizationId: 'org-1', name: 'Kwanza Mar', registrationNumber: 'NAM-2021-B', capacity: 8, status: 'Operational' },
        { id: 'emb-3', organizationId: 'org-1', name: 'Varela', registrationNumber: 'NAM-2026-V', capacity: 12, status: 'Operational' }
      ];
      if (!parsed.catches) parsed.catches = [];
      return parsed;
    } catch (e) {
      console.error('Failed to parse database, re-initializing...', e);
    }
  }

  // Start with an empty list of survey responses to ensure no false data on the landing page
  const surveyResponses: Array<SurveyResponse> = [];

  // Seed default organizations
  const organizations: Array<Organization> = [
    {
      id: 'org-1',
      name: 'Cooperativa Agrícola Humpata',
      sector: 'AGRICULTURE',
      province: 'Huíla',
      maturity: 'INTERMEDIATE',
      assignedConsultantId: 'consultant-1',
      suspended: false
    },
    {
      id: 'org-2',
      name: 'Criadores do Planalto Huambo',
      sector: 'LIVESTOCK',
      province: 'Huambo',
      maturity: 'ADVANCED',
      assignedConsultantId: null,
      suspended: false
    },
    {
      id: 'org-3',
      name: 'Pescas Artesanais do Namibe',
      sector: 'FISHERIES',
      province: 'Namibe',
      maturity: 'BEGINNER',
      assignedConsultantId: 'consultant-1',
      suspended: false
    },
    {
      id: 'org-4',
      name: 'Comercial Luanda Norte',
      sector: 'COMMERCE',
      province: 'Luanda',
      maturity: 'BEGINNER',
      assignedConsultantId: null,
      suspended: true,
      suspendedReason: 'KYC documents invalid or suspended'
    }
  ];

  // Seed default users (SuperAdmin, Admin, Analyst, Consultant, Owner, Mob, Loid, Joe, Josu, Lee, Kuen, Koy, Kiala)
  const users = [
    {
      id: '0e506a30-6397-4321-80f2-20454689354f',
      name: 'Mob Depp',
      email: 'mob@gmail.com',
      phone: '+244900000000',
      password: 'password',
      role: 'OWNER',
      industry: 'AGRICULTURE',
      maturity: 'INTERMEDIATE',
      organizationId: 'org-1',
      organizationName: 'Cooperativa Agrícola Humpata',
      province: 'Huíla',
      fundingScore: 78
    },
    {
      id: '2aeb5541-9101-4537-b294-7d2244eecca4',
      name: 'loid garno',
      email: 'loid@gmail.com',
      phone: '+244900000000',
      password: 'password',
      role: 'OWNER',
      industry: 'AGRICULTURE',
      maturity: 'INTERMEDIATE',
      organizationId: 'org-1',
      organizationName: 'Cooperativa Agrícola Humpata',
      province: 'Huíla',
      fundingScore: 75
    },
    {
      id: '4ad16185-5f5b-424c-ad37-54438a761170',
      name: 'joe bert',
      email: 'joe@gmail.com',
      phone: '+244900000000',
      password: 'password',
      role: 'OWNER',
      industry: 'AGRICULTURE',
      maturity: 'INTERMEDIATE',
      organizationId: 'org-1',
      organizationName: 'Cooperativa Agrícola Humpata',
      province: 'Huíla',
      fundingScore: 70
    },
    {
      id: '4c8363fd-112e-4a48-a149-f991c26f427d',
      name: 'Josu Fintel',
      email: 'josu@gmail.com',
      phone: '+244900000000',
      password: 'password',
      role: 'OWNER',
      industry: 'AGRICULTURE',
      maturity: 'INTERMEDIATE',
      organizationId: 'org-1',
      organizationName: 'Cooperativa Agrícola Humpata',
      province: 'Huíla',
      fundingScore: 82
    },
    {
      id: '5373a356-0c94-4cd5-8649-4438a8945386',
      name: 'Lee Nas',
      email: 'lee@gmail.com',
      phone: '+244900000000',
      password: 'password',
      role: 'OWNER',
      industry: 'AGRICULTURE',
      maturity: 'INTERMEDIATE',
      organizationId: 'org-1',
      organizationName: 'Cooperativa Agrícola Humpata',
      province: 'Huíla',
      fundingScore: 74
    },
    {
      id: 'a47753d0-ed5b-4c8d-9cd0-ae51f4dc7767',
      name: 'Kuen Fintel',
      email: 'kuen@gmail.com',
      phone: '+244900000000',
      password: 'password',
      role: 'OWNER',
      industry: 'AGRICULTURE',
      maturity: 'INTERMEDIATE',
      organizationId: 'org-1',
      organizationName: 'Cooperativa Agrícola Humpata',
      province: 'Huíla',
      fundingScore: 80
    },
    {
      id: 'b80718c1-4af7-4a49-b949-f54a3450c9d0',
      name: 'Koy Mateus',
      email: 'koy.mateus@coop.ao',
      phone: '+244923000000',
      password: 'password',
      role: 'OWNER',
      industry: 'AGRICULTURE',
      maturity: 'INTERMEDIATE',
      organizationId: 'org-1',
      organizationName: 'Cooperativa Agrícola Humpata',
      province: 'Huíla',
      fundingScore: 85
    },
    {
      id: 'c016dd4f-378b-4642-901d-afd23c0e3c2b',
      name: 'Kiala Mateus',
      email: 'kiala.mateus@coop.ao',
      phone: '+244923000000',
      password: 'password',
      role: 'OWNER',
      industry: 'AGRICULTURE',
      maturity: 'INTERMEDIATE',
      organizationId: 'org-1',
      organizationName: 'Cooperativa Agrícola Humpata',
      province: 'Huíla',
      fundingScore: 88
    },
    {
      id: 'user-superadmin',
      name: 'Carlos Manuel',
      email: 'superadmin@olofintel.ao',
      password: 'password',
      role: 'SUPER_ADMIN',
      industry: null,
      maturity: 'ADVANCED',
      organizationId: null,
      organizationName: null,
      province: 'Luanda',
      fundingScore: 100
    },
    {
      id: 'user-analyst',
      name: 'Sofia Antunes',
      email: 'analyst@olofintel.ao',
      password: 'password',
      role: 'ANALYST',
      industry: null,
      maturity: 'ADVANCED',
      organizationId: null,
      organizationName: null,
      province: 'Luanda',
      fundingScore: 100
    },
    {
      id: 'user-consultant',
      name: 'Adilson Neto',
      email: 'consultant@olofintel.ao',
      password: 'password',
      role: 'CONSULTANT',
      industry: null,
      maturity: 'ADVANCED',
      organizationId: null,
      organizationName: null,
      province: 'Huíla',
      fundingScore: 90
    },
    {
      id: 'user-owner',
      name: 'Mateus Gaspar',
      email: 'owner@olofintel.ao',
      password: 'password',
      role: 'OWNER',
      industry: 'AGRICULTURE',
      maturity: 'INTERMEDIATE',
      organizationId: 'org-1',
      organizationName: 'Cooperativa Agrícola Humpata',
      province: 'Huíla',
      fundingScore: 78
    }
  ];

  // Seed default consultants
  const consultants: Array<Consultant> = [
    {
      id: 'consultant-1',
      name: 'Adilson Neto',
      email: 'consultant@olofintel.ao',
      assignedOrgs: ['org-1', 'org-3']
    }
  ];

  // Seed initial Document Records for Cooperativa Agrícola Humpata
  const documentRecords: Array<DocumentRecord> = [
    {
      id: 'doc-1',
      orgId: 'org-1',
      name: 'NIF_Cooperativa_Humpata.pdf',
      type: 'NIF',
      uploadedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      status: 'VERIFIED'
    },
    {
      id: 'doc-2',
      orgId: 'org-1',
      name: 'Estatuto_Social_Publicado.pdf',
      type: 'ID_CARD',
      uploadedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      status: 'PENDING'
    },
    {
      id: 'doc-3',
      orgId: 'org-1',
      name: 'Extrato_Bancario_Banco_BAI_Q1.pdf',
      type: 'BANK_STATEMENT',
      uploadedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      status: 'PENDING'
    }
  ];

  // Seed initial Operational Records
  const operationalRecords: Array<OperationalRecord> = [
    {
      id: 'op-1',
      orgId: 'org-1',
      type: 'HARVEST',
      date: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString().split('T')[0],
      title: 'Colheita de Batata Doce - Talhão Sul',
      quantity: 1200,
      unit: 'kg',
      notes: 'Colheita com excelente rendimento e qualidade visual ótima.'
    },
    {
      id: 'op-2',
      orgId: 'org-1',
      type: 'SALE',
      date: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString().split('T')[0],
      title: 'Venda de Milho Amarelo - Mercado Central',
      quantity: 500,
      unit: 'kg',
      amount: 450000,
      notes: 'Vendido ao preço de atacado para distribuidor regional.'
    },
    {
      id: 'op-3',
      orgId: 'org-1',
      type: 'EXPENSE',
      date: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString().split('T')[0],
      title: 'Compra de Adubo e Fertilizantes NPK',
      quantity: 10,
      unit: 'sacos',
      amount: 180000,
      notes: 'Insumo essencial para a plantação do bloco B.'
    }
  ];

  const initialDb: DatabaseSchema = {
    users,
    organizations,
    surveyResponses,
    operationalRecords,
    documentRecords,
    consultants,
    fundingApplications: [],
    vessels: [
      { id: 'emb-1', organizationId: 'org-1', name: 'Estrela do Namibe', registrationNumber: 'NAM-2024-A', capacity: 15, status: 'Operational' },
      { id: 'emb-2', organizationId: 'org-1', name: 'Kwanza Mar', registrationNumber: 'NAM-2021-B', capacity: 8, status: 'Operational' },
      { id: 'emb-3', organizationId: 'org-1', name: 'Varela', registrationNumber: 'NAM-2026-V', capacity: 12, status: 'Operational' }
    ],
    catches: []
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  return initialDb;
}

const db = initializeDatabase();

// Helper to save state
function saveDatabase() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // CORS Middleware - Permite pedidos de qualquer origem (Vercel, localhost, etc.)
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, olo-fintel-userId, olo-fintel-orgId');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Tratamento de pedidos preflight OPTIONS
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // ----------------- API ROUTES -----------------

  // Public survey aggregates for Landing Page & LISPA jury validation
  app.get('/api/survey/stats', (req, res) => {
    const total = db.surveyResponses.length;
    
    // Aggregates
    const sectorsCount: Record<string, number> = {};
    const provincesCount: Record<string, number> = {};
    const challengesCount: Record<string, number> = {};
    const fundingCount: Record<string, number> = { APPROVED: 0, REJECTED: 0, NEVER: 0 };
    
    // Rich strategic aggregates for Jury Graphs
    const maturityCount = { beginner: 0, intermediate: 0, advanced: 0 };
    const bancarizacaoCount = { approved: 0, rejected: 0, in_progress: 0, never: 0 };
    const lostHoursCount = { less_2: 0, h3_5: 0, h6_10: 0, more_10: 0 };
    let totalEstimatedWeeklyHours = 0;

    db.surveyResponses.forEach(resp => {
      // Compatibility mapping for older records
      const s = resp.sector || 'AGRICULTURE';
      const p = resp.province || 'Luanda';
      const ch = resp.biggestChallenge || 'Access to Credit & Bank Loans';
      const fh = resp.fundingHistory || 'NEVER';

      sectorsCount[s] = (sectorsCount[s] || 0) + 1;
      provincesCount[p] = (provincesCount[p] || 0) + 1;
      challengesCount[ch] = (challengesCount[ch] || 0) + 1;
      
      if (['APPROVED', 'REJECTED', 'NEVER'].includes(fh)) {
        fundingCount[fh] = (fundingCount[fh] || 0) + 1;
      } else {
        fundingCount['NEVER'] = (fundingCount['NEVER'] || 0) + 1;
      }

      // Rich new strategic fields processing
      const c1 = resp.C1_profitMarginIdea || (resp.operationalAnalyticsRating && resp.operationalAnalyticsRating >= 4 ? 'YES' : 'MAYBE');
      if (c1 === 'YES') maturityCount.advanced++;
      else if (c1 === 'MAYBE') maturityCount.intermediate++;
      else maturityCount.beginner++;

      const b1 = resp.B1_appliedFunding || (resp.fundingHistory === 'APPROVED' ? 'APPROVED' : resp.fundingHistory === 'REJECTED' ? 'REJECTED' : 'NEVER');
      if (b1 === 'APPROVED') bancarizacaoCount.approved++;
      else if (b1 === 'REJECTED') bancarizacaoCount.rejected++;
      else if (b1 === 'IN_PROGRESS') bancarizacaoCount.in_progress++;
      else bancarizacaoCount.never++;

      const a2 = resp.A2_lostHours || (resp.usesPaper ? '6_10' : '3_5');
      if (a2 === 'LESS_2') {
        lostHoursCount.less_2++;
        totalEstimatedWeeklyHours += 1;
      } else if (a2 === '3_5') {
        lostHoursCount.h3_5++;
        totalEstimatedWeeklyHours += 4;
      } else if (a2 === '6_10') {
        lostHoursCount.h6_10++;
        totalEstimatedWeeklyHours += 8;
      } else if (a2 === 'MORE_10') {
        lostHoursCount.more_10++;
        totalEstimatedWeeklyHours += 12;
      }
    });

    res.json({
      total,
      sectors: sectorsCount,
      provinces: provincesCount,
      challenges: challengesCount,
      fundingHistory: fundingCount,
      maturityLevels: maturityCount,
      bancarizacao: bancarizacaoCount,
      lostHoursStats: lostHoursCount,
      avgHoursLost: total > 0 ? Number((totalEstimatedWeeklyHours / total).toFixed(1)) : 5.4,
      totalLostHoursYear: totalEstimatedWeeklyHours * 52,
      registeredOrgs: db.organizations.length,
      totalOperations: db.operationalRecords.length
    });
  });

  // Submit survey response
  app.post('/api/survey/submit', (req, res) => {
    const { 
      // Base / Backwards compatible fields
      persona, 
      organizationName, 
      sector, 
      province, 
      usesPaper, 
      usesExcel, 
      usesWhatsApp, 
      biggestChallenge, 
      fundingHistory, 
      operationalAnalyticsRating, 
      aiConsultingRating,

      // Rich strategic fields
      A1_usesPaper,
      A1_usesExcel,
      A1_usesWhatsApp,
      A1_usesBillingSoftware,
      A1_usesNone,
      A2_lostHours,
      A3_lostSales,
      B1_appliedFunding,
      B2_rejectionReason,
      B3_trustReport,
      C1_profitMarginIdea,
      C2_biggestHeadache,
      C3_sectorConditionalAnswer,
      D1_probabilityToUse,
      D2_shareRealData,
      D3_willingToPay,
      E1_orgName,
      E2_nif,
      E3_sector,
      E4_province,
      E5_employeeCount,
      E6_persona,
      E7_contact
    } = req.body;

    // Validate minimum required fields (Contact is mandatory now, plus either old or new sector/province fields)
    const finalContact = E7_contact || req.body.email || '';
    const finalSector = E3_sector || sector || 'AGRICULTURE';
    const finalProvince = E4_province || province || 'Luanda';
    const finalPersona = E6_persona || persona || 'GESTOR';
    const finalOrgName = E1_orgName || organizationName || 'Organização Anónima';

    if (!finalContact) {
      return res.status(400).json({ error: 'O contacto (email ou telefone) é obrigatório para receber o diagnóstico.' });
    }

    // Map strategic sector selection to backend IndustrySector enum
    let industrySector: any = 'AGRICULTURE';
    if (finalSector.includes('AGRICULTURE') || finalSector.includes('Agro') || finalSector === 'AGRICULTURE') {
      industrySector = 'AGRICULTURE';
    } else if (finalSector.includes('LIVESTOCK') || finalSector.includes('Pecuária') || finalSector === 'LIVESTOCK') {
      industrySector = 'LIVESTOCK';
    } else if (finalSector.includes('FISHERIES') || finalSector.includes('Pesca') || finalSector === 'FISHERIES') {
      industrySector = 'FISHERIES';
    } else if (finalSector.includes('COMMERCE') || finalSector.includes('Comércio') || finalSector === 'COMMERCE') {
      industrySector = 'COMMERCE';
    } else if (finalSector.includes('TRANSPORT') || finalSector.includes('Transporte') || finalSector === 'TRANSPORT') {
      industrySector = 'TRANSPORT';
    }

    // Map strategic challenge selection to biggestChallenge legacy string
    let finalChallenge = biggestChallenge || 'Access to Credit & Bank Loans';
    if (C2_biggestHeadache) {
      if (C2_biggestHeadache.includes('inventário') || C2_biggestHeadache.includes('stock')) {
        finalChallenge = 'Inventory Control & Fertilizer Stock';
      } else if (C2_biggestHeadache.includes('vendas') || C2_biggestHeadache.includes('clientes')) {
        finalChallenge = 'Record Keeping (Paper-based logs lost)';
      } else if (C2_biggestHeadache.includes('despesas')) {
        finalChallenge = 'Operational Expenses Control';
      } else if (C2_biggestHeadache.includes('papelada') || C2_biggestHeadache.includes('governo')) {
        finalChallenge = 'Regulatory compliance & AML/KYC documents';
      } else if (C2_biggestHeadache.includes('lucro') || C2_biggestHeadache.includes('prejuízo')) {
        finalChallenge = 'Profit and Loss calculations';
      }
    }

    // Map strategic B1 credit selection to legacy fundingHistory
    let legacyFunding: 'APPROVED' | 'REJECTED' | 'NEVER' = 'NEVER';
    if (B1_appliedFunding === 'APPROVED') legacyFunding = 'APPROVED';
    else if (B1_appliedFunding === 'REJECTED') legacyFunding = 'REJECTED';

    // Calculate Secret Adoption Score
    let score = 30; // base score
    if (D1_probabilityToUse === '81_100') score += 30;
    else if (D1_probabilityToUse === '51_80') score += 20;
    else if (D1_probabilityToUse === '21_50') score += 10;

    if (D2_shareRealData === 'ALL_GOLD') score += 25;
    else if (D2_shareRealData === 'AGGREGATED_SILVER') score += 15;
    else if (D2_shareRealData === 'FICTIONAL_BRONZE') score += 5;

    if (D3_willingToPay && D3_willingToPay !== 'FREE') score += 15;

    // Calculate pain level and specific rules
    const isHighIntent = (D1_probabilityToUse === '81_100' && D2_shareRealData === 'ALL_GOLD');
    const isUrgentPain = (C1_profitMarginIdea === 'NO' && A3_lostSales !== 'NONE' && A3_lostSales !== '');

    let painLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (A2_lostHours === 'MORE_10' || A2_lostHours === '6_10' || A3_lostSales === 'MORE_6' || A3_lostSales === '4_6' || C1_profitMarginIdea === 'NO') {
      painLevel = 'HIGH';
    } else if (A2_lostHours === '3_5' || A3_lostSales === '1_3' || C1_profitMarginIdea === 'MAYBE') {
      painLevel = 'MEDIUM';
    }

    const newResponse: SurveyResponse = {
      id: `survey-${Date.now()}`,
      persona: finalPersona,
      organizationName: finalOrgName,
      sector: industrySector,
      province: finalProvince,
      usesPaper: typeof A1_usesPaper !== 'undefined' ? !!A1_usesPaper : !!usesPaper,
      usesExcel: typeof A1_usesExcel !== 'undefined' ? !!A1_usesExcel : !!usesExcel,
      usesWhatsApp: typeof A1_usesWhatsApp !== 'undefined' ? !!A1_usesWhatsApp : !!usesWhatsApp,
      biggestChallenge: finalChallenge,
      fundingHistory: legacyFunding,
      operationalAnalyticsRating: Number(operationalAnalyticsRating) || (C1_profitMarginIdea === 'YES' ? 5 : C1_profitMarginIdea === 'MAYBE' ? 3 : 1),
      aiConsultingRating: Number(aiConsultingRating) || (D1_probabilityToUse === '81_100' ? 5 : 3),
      createdAt: new Date().toISOString(),

      // Strategic Questionnaire responses
      A1_usesPaper: !!A1_usesPaper,
      A1_usesExcel: !!A1_usesExcel,
      A1_usesWhatsApp: !!A1_usesWhatsApp,
      A1_usesBillingSoftware: !!A1_usesBillingSoftware,
      A1_usesNone: !!A1_usesNone,
      A2_lostHours: A2_lostHours || '3_5',
      A3_lostSales: A3_lostSales || 'NONE',
      B1_appliedFunding: B1_appliedFunding || 'NEVER',
      B2_rejectionReason: B2_rejectionReason || null,
      B3_trustReport: B3_trustReport || 'MAYBE',
      C1_profitMarginIdea: C1_profitMarginIdea || 'MAYBE',
      C2_biggestHeadache: C2_biggestHeadache || 'Geral',
      C3_sectorConditionalAnswer: C3_sectorConditionalAnswer || 'Nenhum',
      D1_probabilityToUse: D1_probabilityToUse || '51_80',
      D2_shareRealData: D2_shareRealData || 'AGGREGATED_SILVER',
      D3_willingToPay: D3_willingToPay || 'FREE',
      E1_orgName: finalOrgName,
      E2_nif: E2_nif || '',
      E3_sector: finalSector,
      E4_province: finalProvince,
      E5_employeeCount: E5_employeeCount || '1_5',
      E6_persona: finalPersona,
      E7_contact: finalContact,
      adoptionScore: score,
      painLevel,
      isHighIntent,
      isUrgentPain
    };

    db.surveyResponses.unshift(newResponse);
    saveDatabase();
    res.json({ success: true, survey: newResponse });
  });

  // Health Check endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Authentication API: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // 1. Exact match
    let user = db.users.find(u => u.email === email && u.password === password);
    
    // 2. Flexible case-insensitive email/name match
    if (!user && cleanEmail) {
      user = db.users.find(u => 
        u.email.toLowerCase() === cleanEmail || 
        u.email.toLowerCase().startsWith(cleanEmail) ||
        u.name.toLowerCase().includes(cleanEmail)
      );
    }

    // 3. Auto-provision user account if logging in with custom handle/email (e.g. mob)
    if (!user && cleanEmail) {
      const isSuperAdmin = cleanEmail.includes('superadmin') || cleanEmail.includes('admin');
      const isAnalyst = cleanEmail.includes('analyst');
      const isConsultant = cleanEmail.includes('consultant');
      const role = isSuperAdmin ? 'SUPER_ADMIN' : isAnalyst ? 'ANALYST' : isConsultant ? 'CONSULTANT' : 'OWNER';

      let displayName = cleanEmail.split('@')[0];
      displayName = displayName.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      user = {
        id: `user-${Date.now()}`,
        name: displayName || 'Utilizador',
        email: email || `${cleanEmail}@olofintel.ao`,
        password: password || 'password',
        role: role,
        industry: role === 'OWNER' ? 'AGRICULTURE' : null,
        maturity: 'INTERMEDIATE',
        organizationId: role === 'OWNER' ? 'org-1' : null,
        organizationName: role === 'OWNER' ? 'Cooperativa Agrícola Humpata' : null,
        province: 'Huíla',
        fundingScore: 78
      };

      db.users.push(user);
      saveDatabase();
    }

    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciais inválidas. Por favor insira o seu email/nome de utilizador e palavra-passe.' 
      });
    }

    res.json(user);
  });

  // Authentication API: Register User and Org
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role, industry, province, organizationName } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta.' });
    }

    const emailExists = db.users.some(u => u.email === email);
    if (emailExists) {
      return res.status(400).json({ error: 'Este email já se encontra registado.' });
    }

    let orgId: string | null = null;
    let finalOrgName: string | null = null;

    if (['OWNER', 'MANAGER', 'FINANCIAL_OFFICER'].includes(role) && organizationName) {
      orgId = `org-${Date.now()}`;
      finalOrgName = organizationName;
      
      const newOrg: Organization = {
        id: orgId,
        name: organizationName,
        sector: industry || 'AGRICULTURE',
        province: province || 'Luanda',
        maturity: 'BEGINNER',
        assignedConsultantId: null,
        suspended: false
      };
      db.organizations.push(newOrg);
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role,
      industry: orgId ? industry : null,
      maturity: 'BEGINNER',
      organizationId: orgId,
      organizationName: finalOrgName,
      province: province || 'Luanda',
      fundingScore: 25 // Default starting score upon initial registration
    };

    db.users.push(newUser);
    saveDatabase();
    res.json(newUser);
  });

  // Get active user details
  app.get('/api/auth/me/:userId', (req, res) => {
    const user = db.users.find(u => u.id === req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }
    res.json(user);
  });

  // Update user profile details & enterprise context
  app.post('/api/auth/profile/update', (req, res) => {
    const { userId, name, email, password, province, organizationName, industry } = req.body;
    
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }

    if (email && email !== user.email) {
      const emailExists = db.users.some(u => u.email === email && u.id !== userId);
      if (emailExists) {
        return res.status(400).json({ error: 'Este email já se encontra registado por outro utilizador.' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (password) user.password = password;
    if (province) user.province = province;
    if (organizationName) user.organizationName = organizationName;
    if (industry) user.industry = industry;
    
    if (user.organizationId) {
      const org = db.organizations.find(o => o.id === user.organizationId);
      if (org) {
        if (organizationName) org.name = organizationName;
        if (industry) org.sector = industry;
        if (province) org.province = province;
      }
    }

    saveDatabase();
    res.json(user);
  });

  // Operations API: List
  app.get('/api/operations/list/:orgId', (req, res) => {
    const records = db.operationalRecords.filter(r => r.orgId === req.params.orgId);
    res.json(records);
  });

  // Operations API: Add
  app.post('/api/operations/add', (req, res) => {
    const { orgId, type, title, quantity, unit, amount, notes, date } = req.body;

    if (!orgId || !type || !title || !date) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta.' });
    }

    const newRecord: OperationalRecord = {
      id: `op-${Date.now()}`,
      orgId,
      type,
      date,
      title,
      quantity: quantity ? Number(quantity) : undefined,
      unit,
      amount: amount ? Number(amount) : undefined,
      notes
    };

    db.operationalRecords.unshift(newRecord);

    // Dynamic Funding Score Logic:
    // Adding operations shows "operational transparency", which boosts the scoring slightly!
    const user = db.users.find(u => u.organizationId === orgId);
    if (user) {
      const recordsCount = db.operationalRecords.filter(r => r.orgId === orgId).length;
      const docsCount = db.documentRecords.filter(d => d.orgId === orgId && d.status === 'VERIFIED').length;
      
      // Basic scoring algorithm based on logged data + verified documents
      const docsScore = Math.min(docsCount * 25, 50); // Up to 50% for 2 verified docs
      const opsScore = Math.min(recordsCount * 5, 40); // Up to 40% for 8 operations logged
      const maturityBase = user.maturity === 'ADVANCED' ? 10 : user.maturity === 'INTERMEDIATE' ? 5 : 0;
      
      user.fundingScore = Math.min(20 + docsScore + opsScore + maturityBase, 100);
    }

    saveDatabase();
    res.json({ success: true, record: newRecord });
  });

  // Fisheries Operations API: Register Vessel
  const registerVesselHandler = (req: any, res: any) => {
    const { name, registrationNumber, capacity, organizationId } = req.body;
    const orgId = organizationId || req.body.orgId || 'org-1';

    if (!name) {
      return res.status(400).json({ success: false, message: 'Nome e matrícula da embarcação obrigatórios.' });
    }

    if (!db.vessels) db.vessels = [];

    const newVessel = {
      id: `vessel-${Date.now()}`,
      organizationId: orgId,
      name,
      registrationNumber: registrationNumber || `NAM-${Math.floor(Math.random() * 900) + 100}-V`,
      capacity: capacity ? parseFloat(capacity) : 10.0,
      status: 'Operational',
      createdAt: new Date().toISOString()
    };

    db.vessels.unshift(newVessel);
    saveDatabase();

    return res.status(201).json({ success: true, data: newVessel, vessel: newVessel });
  };

  const getVesselsHandler = (req: any, res: any) => {
    if (!db.vessels) db.vessels = [];
    return res.json({ success: true, data: db.vessels, vessels: db.vessels });
  };

  const recordCatchHandler = (req: any, res: any) => {
    const { vesselId, species, weight, value, organizationId } = req.body;
    if (!db.catches) db.catches = [];

    const newCatch = {
      id: `catch-${Date.now()}`,
      organizationId: organizationId || 'org-1',
      vesselId,
      species: species || 'Carapau',
      weight: weight ? parseFloat(weight) : 0,
      value: value ? parseFloat(value) : 0,
      createdAt: new Date().toISOString()
    };

    db.catches.unshift(newCatch);
    saveDatabase();

    return res.status(201).json({ success: true, data: newCatch, catch: newCatch });
  };

  app.post('/api/v1/operations/fisheries/vessels', registerVesselHandler);
  app.post('/api/operations/fisheries/vessels', registerVesselHandler);
  app.get('/api/v1/operations/fisheries/vessels', getVesselsHandler);
  app.get('/api/operations/fisheries/vessels', getVesselsHandler);
  app.post('/api/v1/operations/fisheries/catches', recordCatchHandler);
  app.post('/api/operations/fisheries/catches', recordCatchHandler);

  // Documents API: List
  app.get('/api/documents/list/:orgId', (req, res) => {
    const docs = db.documentRecords.filter(d => d.orgId === req.params.orgId);
    res.json(docs);
  });

  // Documents API: List All (Admin)
  app.get('/api/admin/documents', (req, res) => {
    res.json(db.documentRecords);
  });

  // Documents API: Upload (Simulated)
  app.post('/api/documents/upload', (req, res) => {
    const { orgId, type, name, uploadedBy } = req.body;

    if (!orgId || !type || !name) {
      return res.status(400).json({ error: 'Faltam metadados do documento.' });
    }

    const uBy = uploadedBy || 'Utilizador';
    let doc = db.documentRecords.find(d => d.orgId === orgId && d.type === type);

    if (doc) {
      // Overwrite/version update
      const currentVersion = doc.version || 1;
      const nextVersion = currentVersion + 1;
      
      if (!doc.history) {
        doc.history = [
          {
            version: currentVersion,
            name: doc.name,
            uploadedAt: doc.uploadedAt,
            actionBy: 'Utilizador',
            actionType: 'UPLOAD'
          }
        ];
      }

      doc.name = name;
      doc.uploadedAt = new Date().toISOString();
      doc.status = 'PENDING';
      delete doc.feedback;
      doc.version = nextVersion;

      doc.history.push({
        version: nextVersion,
        name: name,
        uploadedAt: new Date().toISOString(),
        actionBy: uBy,
        actionType: 'REPLACE'
      });
    } else {
      // Create new
      doc = {
        id: `doc-${Date.now()}`,
        orgId,
        name,
        type,
        uploadedAt: new Date().toISOString(),
        status: 'PENDING',
        version: 1,
        history: [
          {
            version: 1,
            name: name,
            uploadedAt: new Date().toISOString(),
            actionBy: uBy,
            actionType: 'UPLOAD'
          }
        ]
      };
      db.documentRecords.unshift(doc);
    }

    saveDatabase();
    res.json({ success: true, document: doc });
  });

  // ----------------- FUNDING READINESS ROUTES -----------------
  app.get('/api/funding/applications/:orgId', (req, res) => {
    if (!db.fundingApplications) {
      db.fundingApplications = [];
    }
    const apps = db.fundingApplications.filter((a: any) => a.orgId === req.params.orgId);
    res.json(apps);
  });

  app.post('/api/funding/apply', (req, res) => {
    if (!db.fundingApplications) {
      db.fundingApplications = [];
    }
    const appRecord = req.body;
    db.fundingApplications.unshift(appRecord);
    saveDatabase();
    res.json({ success: true, application: appRecord });
  });

  app.post('/api/funding/action-plan', async (req, res) => {
    const { subscores, currentScore, industry, maturity, pendingChecklist } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: 'GEMINI_API_KEY não está configurada no painel de configurações (Settings).' });
    }

    try {
      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Analise a maturidade da cooperativa em Angola e gere um plano de ação estruturado de prontidão para financiamento (Funding Readiness).
      
      Dados da Cooperativa:
      - Setor: ${industry}
      - Nível de Maturidade: ${maturity}
      - Pontuação de Prontidão Atual: ${currentScore}/100
      - Subscores: Financeiro (${subscores.financeiro}/25), Operacional (${subscores.operacional}/25), Documental (${subscores.documental}/25), Comercial (${subscores.comercial}/25)
      - Itens pendentes: ${JSON.stringify(pendingChecklist)}

      Por favor, retorne uma resposta estrita de acordo com o esquema JSON configurado contendo:
      1. Um resumo curto e objetivo ("summary") em português sobre a situação de elegibilidade e o que deve priorizar.
      2. Três passos concretos e práticos ("nextSteps") para melhorar a elegibilidade especificando o título em português, uma descrição detalhada do que fazer de forma contextualizada para Angola (mencionando bancos locais como BPC, BCI, BAI, FADA ou programas como PAC, Aviso 10 BNA), a categoria relevante do passo, e o impacto estimado no score (ALTO, MÉDIO ou BAIXO).
      3. Três dicas práticas de gestão de tesouraria rural/cooperativa ("tips") aplicáveis a Angola.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "Resumo geral da elegibilidade e prontidão para financiamento."
              },
              nextSteps: {
                type: Type.ARRAY,
                description: "Passos recomendados para melhorar o score e atrair investidores.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Título do passo, em português." },
                    description: { type: Type.STRING, description: "Descrição detalhada do que fazer." },
                    category: { type: Type.STRING, description: "Categoria (Financeiro, Documental, Operacional, Comercial)" },
                    impact: { type: Type.STRING, description: "Impacto no score: ALTO, MÉDIO, BAIXO" }
                  },
                  required: ["title", "description", "category", "impact"]
                }
              },
              tips: {
                type: Type.ARRAY,
                description: "Conselhos práticos de gestão financeira.",
                items: {
                  type: Type.STRING
                }
              }
            },
            required: ["summary", "nextSteps", "tips"]
          }
        }
      });

      const responseText = response.text || '{}';
      const parsedActionPlan = JSON.parse(responseText.trim());

      res.json({ success: true, actionPlan: parsedActionPlan });
    } catch (err: any) {
      console.error('Gemini API action plan error:', err);
      res.status(500).json({ error: 'Erro ao invocar a API do Gemini: ' + err.message });
    }
  });

  // ----------------- AI CENTER ADVISOR ROUTE -----------------
  app.post('/api/ai/advisor', async (req, res) => {
    const { advisorType, organization, financials, operations, commercial, documents, question } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // We'll prepare a robust local fallback in case the API Key is not set
    const generateLocalFallback = (type: string) => {
      const ind = organization?.industry || 'AGRICULTURE';
      const sectorName = ind === 'AGRICULTURE' ? 'Agrícola' : ind === 'FISHERIES' ? 'Pesqueiro' : ind === 'LIVESTOCK' ? 'Pecuário' : 'Comercial';
      const m = organization?.maturity || 'BEGINNER';
      const maturityName = m === 'BEGINNER' ? 'Iniciante' : m === 'INTERMEDIATE' ? 'Intermédia' : 'Avançada';

      switch (type) {
        case 'financial':
          return {
            diagnostico: `A cooperativa apresenta um perfil financeiro em estágio **${maturityName}**. Com base nos dados registados, há necessidade urgente de consolidar o fluxo de caixa mensal. As despesas declaradas representam um rácio de custos fixos considerável em relação às receitas operacionais, limitando a liquidez imediata.`,
            riscos: `- **Ruptura de Caixa**: Falta de reservas para cobrir os custos fixos nos meses de entressafra ou baixas capturas.\n- **Inelegibilidade de Crédito**: A ausência de um demonstrativo formal de perdas e ganhos digitalizado afasta bancos como o BPC ou o FADA.\n- **Mistura de Fundos**: Alta probabilidade de confusão entre o patrimônio dos cooperados e as contas da cooperativa.`,
            oportunidades: `- **Otimização de Custos**: Identificação de gargalos em compras de fertilizantes/combustível através de orçamentos por centro de custos.\n- **Negociação em Volume**: Compras centralizadas com cooperativas parceiras para diminuir o custo unitário dos insumos.\n- **Garantia de Recebíveis**: Negociação com compradores de contratos de aquisição para antecipação de faturas.`,
            acoes: `1. **Sistematizar Fluxo de Caixa**: Introduzir registos diários de todas as entradas e saídas no Módulo Financeiro.\n2. **Planeamento Orçamental**: Fixar um limite de custos operacionais não superior a 70% das receitas estimadas.\n3. **Criação de Fundo de Reserva**: Reter 5% de cada transação de venda coletiva para um fundo de emergência.`,
            impactoEsperado: `Melhoria imediata de 15% na margem de lucro operacional no primeiro trimestre e elevação de mais de 20 pontos no subscore financeiro do simulador OLO Fintel.`
          };
        case 'operations':
          return {
            diagnostico: `Eficiência operacional classificada como **${maturityName}**. O volume de atividades operacionais registadas (${operations?.logCount || 0} logs) indica uma boa iniciativa, mas com pouca regularidade de monitorização técnica de perdas pós-colheita ou armazenamento.`,
            riscos: `- **Perda de Rastreabilidade**: Sem registos diários, torna-se impossível certificar a qualidade dos produtos para compradores grossistas exigentes.\n- **Depreciação de Ativos**: Falha na manutenção preventiva de tratores, embarcações ou silos por falta de logs de controlo.\n- **Desperdício de Recursos**: Insumos agrícolas mal aproveitados devido à ausência de relatórios de aplicação.`,
            oportunidades: `- **Digitalização do Campo/Mar**: Utilização do registo operacional rápido via telemóvel para monitorizar frotas, pescas ou colheitas em tempo real.\n- **Partilha de Equipamentos**: Criação de uma escala rotativa automatizada para maximizar o uso de tratores ou câmaras frigoríficas.\n- **Certificação Local**: Elevação do padrão técnico para qualificar a cooperativa a selos de qualidade de Angola.`,
            acoes: `1. **Treino de Cooperados**: Capacitar pelo menos 3 líderes de campo para efetuar o registo operacional no sistema logo após cada turno.\n2. **Auditoria de Perdas**: Criar um log específico para registar descarte ou produtos estragados, visando identificar focos de falhas físicas.\n3. **Cronograma de Ativos**: Lançar as revisões preventivas dos equipamentos associados.`,
            impactoEsperado: `Aumento de 12% no rendimento operacional bruto, redução de desperdícios físicos e sustentação de relatórios técnicos aceitáveis para seguros agrícolas.`
          };
        case 'commercial':
          return {
            diagnostico: `O desempenho comercial da cooperativa indica dependência de mercados informais e pouca diversificação de clientes. O CRM regista poucas propostas ativas, o que reduz a previsibilidade de receitas a médio prazo.`,
            riscos: `- **Concentração de Comprador**: Se um único cliente falhar ou atrasar os pagamentos, a cooperativa entra em colapso financeiro.\n- **Vendas Abaixo do Custo**: Negociação sob pressão com intermediários informais ("candongueiros"), sacrificando a margem de lucro útil.\n- **Perda de Prazos**: Propostas comerciais ativas no CRM sem acompanhamento adequado ("follow-up").`,
            oportunidades: `- **Contratos de Compra Antecipada (Offtake)**: Firmar contratos formais com cadeias de supermercados em Luanda (Kero, Alimenta Angola) ou hotéis provinciais.\n- **Marca Própria Cooperativa**: Empacotamento e rotulagem conjunta para vender com maior valor acrescentado.\n- **Participação em Feiras**: Utilizar o histórico de produção digitalizado para demonstrar estabilidade de fornecimento a compradores industriais.`,
            acoes: `1. **Registar 100% de Clientes**: Alimentar a base de dados do CRM com todos os compradores atuais e potenciais.\n2. **Follow-up Automático**: Atualizar o estado das oportunidades comerciais no CRM semanalmente.\n3. **Proposta de Valor**: Elaborar um catálogo digital simples dos produtos da cooperativa realçando o impacto social local.`,
            impactoEsperado: `Previsibilidade de receitas aumentada em 40%, conquista de pelo menos 2 novos compradores de médio porte no trimestre e consolidação comercial.`
          };
        case 'funding':
          return {
            diagnostico: `A cooperativa está a preparar a sua documentação e histórico de transações para elegibilidade. O score atual de prontidão revela que o maior entrave está na validação técnica de documentos e falta de histórico financeiro digital.`,
            riscos: `- **Reprovação em KYC/AML**: Falta de alvarás vigentes ou certidões fiscais atualizadas impede a abertura de contas de crédito oficiais.\n- **Taxas Proibitivas**: Desespero por capital de giro forçando a contratação de empréstimos informais com taxas acima de 20% ao mês.\n- **Desalinhamento de Prazos**: Candidatar-se a linhas de investimento com período de carência inferior ao ciclo de maturação da colheita/produção.`,
            oportunidades: `- **Linha de Crédito Aviso 10 BNA**: Aceder a taxas bonificadas de 7.5% ao ano através de bancos parceiros ao demonstrar transparência contabilística.\n- **Microfomento do FADA**: Solicitar pequenos valores com processos de aprovação simplificados focados em cooperativas agrícolas.\n- **Garantias do FGC**: Mitigar a falta de colaterais imobiliários utilizando o Fundo de Garantia de Crédito.`,
            acoes: `1. **Saneamento Documental**: Carregar e verificar imediatamente todos os documentos exigidos (NIF, Alvará, Estatuto) no Módulo KYC.\n2. **Melhorar Score de Crédito**: Executar as ações propostas no Checklist de Prontidão para ultrapassar os 60 pontos no OLO Fintel.\n3. **Diligência com Bancos**: Agendar reunião com o gerente de PMEs do banco local (BAI, BPC, BCI) com o relatório de prontidão em mãos.`,
            impactoEsperado: `Redução do tempo de aprovação de crédito de meses para poucas semanas, aumento da taxa de sucesso de candidatura para 85% e menor custo de capital.`
          };
        case 'executive':
        default:
          return {
            diagnostico: `Visão geral estratégica da cooperativa no sector **${sectorName}**. A organização demonstra resiliência, mas a falta de integração sistemática entre as áreas Financeira, Operacional, Comercial e Documental impede uma tomada de decisão ágil e descentralizada.`,
            riscos: `- **Vulnerabilidade Climática e Macroeconómica**: Falta de diversificação produtiva e flutuações cambiais em Angola ameaçando insumos importados.\n- **Perda de Confiança Institucional**: Falhas de governança e falta de relatórios auditáveis afastando investidores e parceiros institucionais.`,
            oportunidades: `- **Liderança Digital**: Tornar-se uma cooperativa de referência digital na província, atraindo subsídios de agências de cooperação internacional.\n- **Fileiras de Alto Valor**: Transição de culturas/produtos de subsistência para itens de alta procura industrial (ex: soja, milho, processamento de pescado).`,
            acoes: `1. **Reunião Geral Mensal**: Reunir os cooperados para partilhar as métricas geradas pela plataforma OLO Fintel, fomentando transparência.\n2. **Aliança com Parceiros Locais**: Estabelecer acordos com cooperativas de transporte e logística para rateio de fretes.\n3. **Formação de Líderes**: Capacitar a equipa administrativa na interpretação de relatórios de orçamentos e CRM.`,
            impactoEsperado: `Fortalecimento da governança interna, aumento da coesão dos membros cooperados e posicionamento de mercado robusto para captar parcerias estratégicas em Angola.`
          };
      }
    };

    if (!apiKey) {
      // Return beautiful structured fallback
      const report = generateLocalFallback(advisorType);
      if (question) {
        // Append user question context to fallback
        report.diagnostico = `[Nota: Respondendo em modo de simulação offline] \n\nEm resposta à sua questão ("${question}"): \n\n${report.diagnostico}`;
      }
      return res.json({ success: true, report });
    }

    try {
      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemPrompts = {
        executive: `Você é o Diretor de Estratégia e Conselheiro Executivo (Executive Advisor) da plataforma OLO Fintel, focado em cooperativas agrícolas, pesqueiras e pecuárias em Angola. Seu objetivo é dar visões gerais estratégicas, governança corporativa, crescimento de longo prazo e posicionamento de mercado.`,
        financial: `Você é o Diretor Financeiro e Conselheiro de Custos (Financial Advisor) da plataforma OLO Fintel. Seu objetivo é fornecer diagnósticos financeiros analíticos, estratégias de redução de custos de insumos ou combustível, fluxo de caixa realista, análise de lucros/perdas e equilíbrio de tesouraria cooperativa sob a realidade de Angola.`,
        operations: `Você é o Diretor de Produção e Conselheiro Operacional (Operations Advisor) da plataforma OLO Fintel. Seu objetivo é otimizar processos de colheita, manejo, pesca, logística de transporte, armazenamento, combate ao desperdício e maximização do uso de ativos físicos no interior de Angola.`,
        commercial: `Você é o Diretor Comercial e Conselheiro de Vendas/CRM (Commercial Advisor) da plataforma OLO Fintel. Seu objetivo é ajudar a cooperativa a conquistar novos mercados formais (parcerias, supermercados, distribuidores de Luanda), desenhar estratégias de preços, fechar contratos futuros de fornecimento e usar o CRM de forma rentável.`,
        funding: `Você é o Conselheiro de Crédito e Financiamento (Funding Advisor) da plataforma OLO Fintel. Seu objetivo é preparar a cooperativa para aceder a financiamento formal (linhas FADA, Aviso 10 BNA, PAC do PRODESI), garantir que cumpram regras de KYC/AML, estruturar candidaturas e obter as garantias colaterais do FGC.`
      };

      const contextPrompt = `
      Contexto atual da cooperativa:
      - Setor: ${organization?.industry || 'AGRICULTURE'}
      - Maturidade: ${organization?.maturity || 'BEGINNER'}
      - Província de Angola: ${organization?.province || 'Huambo'}
      - Nome / Org: ${organization?.name || 'Cooperativa'}
      - Indicadores Financeiros: Receita total de ${financials?.revenue || 0} AOA, despesas de ${financials?.expenses || 0} AOA, saldo de ${financials?.balance || 0} AOA, contas a receber de ${financials?.accountsReceivable || 0} AOA, contas a pagar de ${financials?.accountsPayable || 0} AOA, orçamentos definidos: ${financials?.budgetsCount || 0}.
      - Indicadores Operacionais: ${operations?.logCount || 0} atividades registadas no histórico operacional.
      - Indicadores Comerciais: ${commercial?.dealsCount || 0} oportunidades ativas no CRM, ${commercial?.clientsCount || 0} clientes registados, ${commercial?.contractsCount || 0} acordos formais anexados.
      - Indicadores Documentais (KYC): ${documents?.uploadedCount || 0} documentos enviados, dos quais ${documents?.verifiedCount || 0} foram verificados tecnicamente pela equipa OLO.
      
      ${question ? `Questão específica enviada pelo utilizador: "${question}"` : 'Por favor, realize uma análise periódica completa com base nas métricas apresentadas.'}
      
      Instruções Cruciais de Tom e Terminologia:
      - Fale estritamente em português de Angola ou português europeu profissional.
      - Use terminologia de negócios realística, séria e modesta. Evite autoelogios ou termos pomposos.
      - Cite o contexto local de Angola, mencionando bancos atuantes (BAI, BCI, BPC, BIC, etc.) e programas públicos angolanos de apoio à produção nacional (PRODESI, FADA, Aviso 10/2022 do BNA, FGC) quando apropriado.
      
      Você DEVE retornar a sua resposta estritamente estruturada de acordo com o esquema JSON configurado contendo exatamente as seguintes chaves de texto (suporta formatação Markdown rica como listas, negrito, etc.):
      - diagnostico: O diagnóstico analítico da situação.
      - riscos: Riscos operacionais, financeiros ou reputacionais detetados.
      - oportunidades: Oportunidades viáveis de melhoria imediata ou de mercado.
      - acoes: Plano de ações sugeridas com passos concretos (1, 2, 3).
      - impactoEsperado: O impacto estimado nos negócios e no score de crédito da cooperativa.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          { text: systemPrompts[advisorType as keyof typeof systemPrompts] || systemPrompts.executive },
          { text: contextPrompt }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diagnostico: { type: Type.STRING, description: "Diagnóstico aprofundado, realista e sério. Suporta markdown." },
              riscos: { type: Type.STRING, description: "Principais riscos identificados na situação. Suporta markdown." },
              oportunidades: { type: Type.STRING, description: "Oportunidades de crescimento, parcerias ou eficiência. Suporta markdown." },
              acoes: { type: Type.STRING, description: "Lista de ações sugeridas para implementação a curto/médio prazo. Suporta markdown." },
              impactoEsperado: { type: Type.STRING, description: "O impacto esperado nos negócios e na prontidão de financiamento. Suporta markdown." }
            },
            required: ["diagnostico", "riscos", "oportunidades", "acoes", "impactoEsperado"]
          }
        }
      });

      const responseText = response.text || '{}';
      const parsedReport = JSON.parse(responseText.trim());

      res.json({ success: true, report: parsedReport });
    } catch (err: any) {
      console.error('Gemini API advisor error:', err);
      // Fallback gracefully on rate limits or failures
      const fallbackReport = generateLocalFallback(advisorType);
      if (question) {
        fallbackReport.diagnostico = `[Nota: Erro de API de Inteligência Artificial, servindo relatório baseado em heurísticas locais] \n\nEm resposta à sua questão ("${question}"): \n\n${fallbackReport.diagnostico}`;
      }
      res.json({ success: true, report: fallbackReport });
    }
  });

  // ----------------- ADMIN/SUPERADMIN SYSTEM MANAGEMENT ROUTES -----------------

  // List all organizations (for SuperAdmin, Admin, Analysts)
  app.get('/api/admin/organizations', (req, res) => {
    res.json(db.organizations);
  });

  // List all users
  app.get('/api/admin/users', (req, res) => {
    res.json(db.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, industry: u.industry, maturity: u.maturity, province: u.province, fundingScore: u.fundingScore, organizationId: u.organizationId, organizationName: u.organizationName })));
  });

  // List all consultants
  app.get('/api/admin/consultants', (req, res) => {
    res.json(db.consultants);
  });

  // Delegate organization to consultant (Drag-and-drop or menu assignment)
  app.post('/api/admin/delegate', (req, res) => {
    const { organizationId, consultantId } = req.body;
    
    const org = db.organizations.find(o => o.id === organizationId);
    if (!org) {
      return res.status(404).json({ error: 'Organização não encontrada.' });
    }

    const consultant = db.consultants.find(c => c.id === consultantId);
    if (!consultant) {
      return res.status(404).json({ error: 'Consultor não encontrado.' });
    }

    // Assign on org
    org.assignedConsultantId = consultantId;
    
    // Assign on consultant
    if (!consultant.assignedOrgs.includes(organizationId)) {
      consultant.assignedOrgs.push(organizationId);
    }

    // Clean other consultants' lists of this org
    db.consultants.forEach(c => {
      if (c.id !== consultantId) {
        c.assignedOrgs = c.assignedOrgs.filter(id => id !== organizationId);
      }
    });

    saveDatabase();
    res.json({ success: true, org });
  });

  // Suspend/Unsuspend user account
  app.post('/api/admin/suspend', (req, res) => {
    const { organizationId, suspend, reason } = req.body;
    const org = db.organizations.find(o => o.id === organizationId);
    
    if (!org) {
      return res.status(404).json({ error: 'Organização não encontrada.' });
    }

    org.suspended = !!suspend;
    if (suspend) {
      org.suspendedReason = reason || 'Razão não especificada.';
    } else {
      delete org.suspendedReason;
    }

    saveDatabase();
    res.json({ success: true, org });
  });

  // Approve/Reject documents in KYC queue
  app.post('/api/admin/document-action', (req, res) => {
    const { documentId, action, feedback, actionBy } = req.body; // action: 'VERIFIED' or 'REJECTED'

    const doc = db.documentRecords.find(d => d.id === documentId);
    if (!doc) {
      return res.status(404).json({ error: 'Documento não encontrado.' });
    }

    doc.status = action === 'VERIFIED' ? 'VERIFIED' : 'REJECTED';
    if (feedback) {
      doc.feedback = feedback;
    } else {
      delete doc.feedback;
    }

    const reviewer = actionBy || 'Validador';
    if (!doc.history) {
      doc.history = [
        {
          version: doc.version || 1,
          name: doc.name,
          uploadedAt: doc.uploadedAt,
          actionBy: 'Utilizador',
          actionType: 'UPLOAD'
        }
      ];
    }

    doc.history.push({
      version: doc.version || 1,
      name: doc.name,
      uploadedAt: new Date().toISOString(),
      actionBy: reviewer,
      actionType: action === 'VERIFIED' ? 'APPROVED' : 'REJECTED',
      feedback: feedback
    });

    // Recompute organization maturity/funding score upon document validation
    const orgId = doc.orgId;
    const user = db.users.find(u => u.organizationId === orgId);
    if (user) {
      const recordsCount = db.operationalRecords.filter(r => r.orgId === orgId).length;
      const docsCount = db.documentRecords.filter(d => d.orgId === orgId && d.status === 'VERIFIED').length;
      
      const docsScore = Math.min(docsCount * 25, 50); // Up to 50% for 2 verified docs
      const opsScore = Math.min(recordsCount * 5, 40); // Up to 40% for 8 operations logged
      const maturityBase = user.maturity === 'ADVANCED' ? 10 : user.maturity === 'INTERMEDIATE' ? 5 : 0;
      
      user.fundingScore = Math.min(20 + docsScore + opsScore + maturityBase, 100);

      // Upgrade maturity automatically based on completeness
      if (user.fundingScore > 80) {
        user.maturity = 'ADVANCED';
        const org = db.organizations.find(o => o.id === orgId);
        if (org) org.maturity = 'ADVANCED';
      } else if (user.fundingScore > 50) {
        user.maturity = 'INTERMEDIATE';
        const org = db.organizations.find(o => o.id === orgId);
        if (org) org.maturity = 'INTERMEDIATE';
      }
    }

    saveDatabase();
    res.json({ success: true, document: doc });
  });

  // ----------------- VITE DEVELOPMENT SERVER AND SPA SERVING -----------------

  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting server in DEVELOPMENT mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    console.log('Starting server in PRODUCTION mode...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 OLO Fintel Fullstack Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server crashed on startup:', err);
});
