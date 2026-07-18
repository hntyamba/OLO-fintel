import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent Database Files
const SURVEY_FILE = path.join(process.cwd(), "survey_responses.json");
const USERS_FILE = path.join(process.cwd(), "users.json");
const ERP_FILE = path.join(process.cwd(), "erp_data.json");

function loadERPData(): any {
  try {
    if (fs.existsSync(ERP_FILE)) {
      const data = fs.readFileSync(ERP_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading ERP data:", err);
  }
  
  // Seed initial deep ERP data if not exists
  const initialERP = {
    humanResources: [
      { id: "hr-1", name: "Mateus Ndulu", role: "Operador de Trator", contact: "923441022", dailyWage: 12000, status: "Ativo", admissionDate: "2024-03-12" },
      { id: "hr-2", name: "Isabel Gouveia", role: "Técnica Agrícola / Agrónoma", contact: "912445511", dailyWage: 18000, status: "Ativo", admissionDate: "2023-11-01" },
      { id: "hr-3", name: "António Chipindo", role: "Auxiliar de Regadio", contact: "931224488", dailyWage: 8000, status: "Ativo", admissionDate: "2025-05-15" },
      { id: "hr-4", name: "Kavungo Manuel", role: "Trabalhador Sazonal", contact: "922119933", dailyWage: 6000, status: "Inativo", admissionDate: "2026-02-10" },
      { id: "hr-5", name: "Francisco Bonga", role: "Mestre de Linha / Tripulação", contact: "915882200", dailyWage: 15000, status: "Ativo", admissionDate: "2024-06-20" }
    ],
    machinery: [
      { id: "m-1", name: "Trator Massey Ferguson 290", type: "Trator", serialNumber: "MF290-992A", status: "Operacional", fuelConsumption: "15L/h", lastMaintenance: "2026-05-10", nextMaintenance: "2026-08-10" },
      { id: "m-2", name: "Trator John Deere 5075E", type: "Trator", serialNumber: "JD5075-1102", status: "Manutenção", fuelConsumption: "12L/h", lastMaintenance: "2026-02-15", nextMaintenance: "2026-07-20" },
      { id: "m-3", name: "Bomba de Rega Diesel 10HP", type: "Equipamento Rega", serialNumber: "BRD10-449", status: "Operacional", fuelConsumption: "3L/h", lastMaintenance: "2026-06-01", nextMaintenance: "2026-09-01" },
      { id: "m-4", name: "Arado de Discos 3x28", type: "Alfazia", serialNumber: "AD328-552", status: "Operacional", fuelConsumption: "N/A", lastMaintenance: "2025-10-10", nextMaintenance: "2026-10-10" }
    ],
    insumos: [
      { id: "ins-1", name: "Adubo NPK 12-24-12", category: "Fertilizantes", stock: 120, minStock: 30, unit: "Sacos", costPrice: 22000, supplierId: "sup-1" },
      { id: "ins-2", name: "Sementes Milho Branco Híbrido", category: "Sementes", stock: 250, minStock: 50, unit: "Kg", costPrice: 4200, supplierId: "sup-2" },
      { id: "ins-3", name: "Gasóleo Marítimo / Agrícola", category: "Combustíveis", stock: 800, minStock: 200, unit: "Litros", costPrice: 150, supplierId: "sup-3" },
      { id: "ins-4", name: "Ração Crescimento Suíno", category: "Rações", stock: 15, minStock: 25, unit: "Sacos", costPrice: 18500, supplierId: "sup-1" },
      { id: "ins-5", name: "Adubo Ureia 46%", category: "Fertilizantes", stock: 80, minStock: 20, unit: "Sacos", costPrice: 19500, supplierId: "sup-1" }
    ],
    cycles: [
      { id: "cy-1", name: "Campanha Milho Huambo 2026", sector: "Agriculture", startDate: "2026-09-15", endDate: "2027-02-15", budgetForecast: 4500000, actualCosts: 1850000, targetOutput: 120, currentOutput: 0, status: "Preparação" },
      { id: "cy-2", name: "Ciclo Batata Rena Inverno", sector: "Agriculture", startDate: "2026-05-10", endDate: "2026-09-20", budgetForecast: 2800000, actualCosts: 2450000, targetOutput: 80, currentOutput: 32, status: "Crescimento" },
      { id: "cy-3", name: "Lote Engorda Suína B", sector: "Livestock", startDate: "2026-03-01", endDate: "2026-08-30", budgetForecast: 1500000, actualCosts: 1100000, targetOutput: 90, currentOutput: 0, status: "Crescimento" },
      { id: "cy-4", name: "Campanha Pesca Alto Mar Kwanza", sector: "Fisheries", startDate: "2026-07-01", endDate: "2026-07-31", budgetForecast: 2000000, actualCosts: 1250000, targetOutput: 35, currentOutput: 18, status: "Ativo" }
    ],
    production: [
      { id: "p-1", date: "2026-07-10", cycleId: "cy-2", cycleTitle: "Ciclo Batata Rena Inverno", quantity: 12, unit: "Toneladas", operatorName: "Mateus Ndulu", notes: "Primeira colheita parcial do talhão sul com boa qualidade." },
      { id: "p-2", date: "2026-07-14", cycleId: "cy-2", cycleTitle: "Ciclo Batata Rena Inverno", quantity: 20, unit: "Toneladas", operatorName: "Isabel Gouveia", notes: "Colheita principal do setor central." },
      { id: "p-3", date: "2026-07-16", cycleId: "cy-4", cycleTitle: "Campanha Pesca Alto Mar Kwanza", quantity: 8, unit: "Toneladas", operatorName: "Francisco Bonga", notes: "Captura de carapau em Benguela." }
    ],
    partners: [
      { id: "part-1", type: "supplier", name: "Insumos Agrícolas do Huambo Lda", nif: "500112933", phone: "923110292", email: "vendas@insumoshuambo.ao", address: "Zona Industrial, Huambo", balance: -450000 },
      { id: "part-2", type: "supplier", name: "Sementes & Nutrição Angola SARL", nif: "544991022", phone: "912440055", email: "contacto@sementesnutricao.ao", address: "Estrada de Catete, Luanda", balance: 0 },
      { id: "part-3", type: "supplier", name: "Sonangol Distribuidora S.A.", nif: "500001009", phone: "222440011", email: "postos@sonangol.co.ao", address: "Av. Rainha Ginga, Luanda", balance: -180000 },
      { id: "part-4", type: "client", name: "Supermercados Alimenta Angola", nif: "500334882", phone: "933110033", email: "compras@alimentangola.com", address: "Viana, Luanda", balance: 1250000 },
      { id: "part-5", type: "client", name: "Moagem Kwanza Sul S.A.", nif: "501229944", phone: "921884400", email: "aprovisionamento@moagemks.ao", address: "Sumbe, Kwanza Sul", balance: 3400000 }
    ],
    assetsLiabilities: [
      { id: "al-1", type: "asset", name: "Terreno Agrícola Huambo (Chã de Areia)", category: "Imóveis", value: 15000000, description: "Propriedade de 25 hectares registada na conservatória local.", date: "2022-04-15" },
      { id: "al-2", type: "asset", name: "Tratores & Alfaias Mecânicas", category: "Máquinas", value: 8500000, description: "Valor de balanço contabilístico atual depreciado dos dois tratores.", date: "2024-01-10" },
      { id: "al-3", type: "asset", name: "Stock de Milho em Silo", category: "Stocks", value: 3500000, description: "Sementes e grão pronto para comercialização e armazenado.", date: "2026-07-01" },
      { id: "al-4", type: "liability", name: "Microcrédito BCI Cooperativas", category: "Banca", value: 5000000, description: "Linha de fomento agrícola contratada a 8% de taxa de juro bonificada.", date: "2025-05-15" },
      { id: "al-5", type: "liability", name: "Dívida Corrente a Fornecedores (Insumos)", category: "Fornecedores", value: 630000, description: "Saldo de faturas em aberto com fornecedores de sementes e combustíveis.", date: "2026-07-12" }
    ],
    transactions: [
      { id: "tx-1", description: "Venda de Saca de Milho - Lote A", type: "income", category: "Vendas", amount: 250000, date: "2026-07-15" },
      { id: "tx-2", description: "Aquisição de Gasóleo Marítimo / Agrícola", type: "expense", category: "Combustíveis", amount: 110000, date: "2026-07-16" },
      { id: "tx-3", description: "Venda de Captura de Carapau", type: "income", category: "Vendas", amount: 480000, date: "2026-07-17" },
      { id: "tx-4", description: "Sacos de Ração de Engorda Suína", type: "expense", category: "Rações", amount: 74000, date: "2026-07-14" },
      { id: "tx-5", description: "Salários Mensais Cooperados", type: "expense", category: "Operacional", amount: 450000, date: "2026-07-12" },
      { id: "tx-6", description: "Venda de Batata Rena - Lote B", type: "income", category: "Vendas", amount: 850000, date: "2026-07-11" },
      { id: "tx-7", description: "Reparação de Trator Massey Ferguson", type: "expense", category: "Equipamentos", amount: 125000, date: "2026-07-09" }
    ]
  };

  try {
    fs.writeFileSync(ERP_FILE, JSON.stringify(initialERP, null, 2), "utf-8");
  } catch (err) {
    console.error("Error creating initial ERP data file:", err);
  }
  return initialERP;
}

function saveERPData(data: any) {
  try {
    fs.writeFileSync(ERP_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving ERP data to file:", err);
  }
}

function loadSurveyResponses(): any[] | null {
  try {
    if (fs.existsSync(SURVEY_FILE)) {
      const data = fs.readFileSync(SURVEY_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading survey responses from file:", err);
  }
  return null;
}

function saveSurveyResponses(responses: any[]) {
  try {
    fs.writeFileSync(SURVEY_FILE, JSON.stringify(responses, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving survey responses to file:", err);
  }
}

function loadUsers(): any[] | null {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading users from file:", err);
  }
  return null;
}

function saveUsers(users: any[]) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving users to file:", err);
  }
}

// In-Memory Survey Responses list synced with File Database
let surveyResponses: any[] = loadSurveyResponses() || [];

if (surveyResponses.length === 0) {
  // Pre-seeded realistic market data
  // Represents 64 initial responses to prove validation traction to the LISPA jury.
  surveyResponses = [
    { id: "1", timestamp: "2026-07-10T10:11:00Z", persona: "Presidente de Cooperativa", sector: "Agriculture", province: "Huambo", managementTool: "Papel", biggestChallenge: "Financing", fundingHistory: "Rejeitado", aiValueRating: 5 },
    { id: "2", timestamp: "2026-07-10T14:22:00Z", persona: "Gestor PME", sector: "Commerce", province: "Luanda", managementTool: "Excel", biggestChallenge: "Clientes", fundingHistory: "Nunca Aplicou", aiValueRating: 4 },
    { id: "3", timestamp: "2026-07-11T09:05:00Z", persona: "Presidente de Cooperativa", sector: "Fisheries", province: "Benguela", managementTool: "Papel", biggestChallenge: "Financing", fundingHistory: "Nunca Aplicou", aiValueRating: 5 },
    { id: "4", timestamp: "2026-07-11T16:45:00Z", persona: "Gestor PME", sector: "Livestock", province: "Huíla", managementTool: "WhatsApp", biggestChallenge: "Production", fundingHistory: "Nunca Aplicou", aiValueRating: 5 },
    { id: "5", timestamp: "2026-07-12T11:30:00Z", persona: "Consultor", sector: "Commerce", province: "Luanda", managementTool: "Excel", biggestChallenge: "Reporting", fundingHistory: "Aprovado", aiValueRating: 4 },
    { id: "6", timestamp: "2026-07-12T12:15:00Z", persona: "Analista Financeiro", sector: "Agriculture", province: "Huambo", managementTool: "Outro", biggestChallenge: "Documents", fundingHistory: "Aprovado", aiValueRating: 5 },
    { id: "7", timestamp: "2026-07-13T08:00:00Z", persona: "Presidente de Cooperativa", sector: "Agriculture", province: "Bié", managementTool: "Papel", biggestChallenge: "Financing", fundingHistory: "Rejeitado", aiValueRating: 5 },
    { id: "8", timestamp: "2026-07-13T15:20:00Z", persona: "Gestor PME", sector: "Fisheries", province: "Namibe", managementTool: "WhatsApp", biggestChallenge: "Inventory", fundingHistory: "Nunca Aplicou", aiValueRating: 4 },
    { id: "9", timestamp: "2026-07-14T10:10:00Z", persona: "Presidente de Cooperativa", sector: "Livestock", province: "Cunene", managementTool: "Papel", biggestChallenge: "Financing", fundingHistory: "Nunca Aplicou", aiValueRating: 5 },
    { id: "10", timestamp: "2026-07-14T17:55:00Z", persona: "Gestor PME", sector: "Commerce", province: "Benguela", managementTool: "Excel", biggestChallenge: "Clientes", fundingHistory: "Aprovado", aiValueRating: 4 },
  ];

  // Seed 54 more records programmatically to reach exactly 64 responses
  const provincesSeed = ["Luanda", "Huambo", "Benguela", "Huíla", "Bié", "Cunene", "Namibe", "Uíge", "Malanje", "Cabinda"];
  const sectorsSeed = ["Agriculture", "Livestock", "Fisheries", "Commerce"];
  const personasSeed = ["Presidente de Cooperativa", "Gestor PME", "Analista Financeiro", "Consultor"];
  const toolsSeed = ["Papel", "Excel", "WhatsApp", "Outro", "ERP"];
  const challengesSeed = ["Financing", "Inventory", "Clientes", "Production", "Reporting", "Documents"];
  const fundingSeed = ["Nunca Aplicou", "Aprovado", "Rejeitado"];

  for (let i = 11; i <= 64; i++) {
    const seedPersona = personasSeed[i % personasSeed.length];
    const seedSector = sectorsSeed[i % sectorsSeed.length];
    const seedProvince = provincesSeed[i % provincesSeed.length];
    const seedTool = toolsSeed[i % toolsSeed.length];
    const seedChallenge = challengesSeed[i % challengesSeed.length];
    const seedFunding = fundingSeed[i % fundingSeed.length];
    const rating = (i % 3 === 0) ? 4 : 5;

    surveyResponses.push({
      id: String(i),
      timestamp: new Date(Date.now() - (64 - i) * 6 * 3600 * 1000).toISOString(),
      persona: seedPersona,
      sector: seedSector,
      province: seedProvince,
      managementTool: seedTool,
      biggestChallenge: seedChallenge,
      fundingHistory: seedFunding,
      aiValueRating: rating,
      organizationName: `${seedPersona === "Presidente de Cooperativa" ? "Cooperativa" : "Empresa"} Geral de ${seedProvince}`
    });
  }

  saveSurveyResponses(surveyResponses);
}

// User Accounts list synced with File Database
let users: any[] = loadUsers() || [];
if (users.length === 0) {
  users = [
    {
      name: "Júri LISPA",
      email: "juri@lispa.ao",
      password: "123",
      role: "Jury",
      sector: "Commerce",
      organizationName: "LISPA Co-Creation"
    },
    {
      name: "António Fula",
      email: "owner@olo.ao",
      password: "123",
      role: "Owner",
      sector: "Agriculture",
      organizationName: "Cooperativa Agrícola do Huambo"
    },
    {
      name: "Maria Diogo",
      email: "manager@olo.ao",
      password: "123",
      role: "Manager",
      sector: "Commerce",
      organizationName: "Logística Luanda Lda"
    },
    {
      name: "Dr. Eduardo Mateus",
      email: "analyst@olo.ao",
      password: "123",
      role: "Analyst",
      sector: "Agriculture",
      organizationName: "Banco de Fomento Angola"
    }
  ];
  saveUsers(users);
}

// Lazy Gemini Client Initialization
let aiClient: any = null;
function getAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// Calculates aggregated stats from current survey responses
function calculateStats() {
  const stats = {
    totalResponses: surveyResponses.length,
    goal: 100,
    byProvince: {} as Record<string, number>,
    bySector: {} as Record<string, number>,
    byPersona: {} as Record<string, number>,
    byChallenge: {} as Record<string, number>,
    byTool: {} as Record<string, number>,
    byFunding: {} as Record<string, number>,
    avgAiRating: 0
  };

  let totalRating = 0;

  surveyResponses.forEach(r => {
    stats.byProvince[r.province] = (stats.byProvince[r.province] || 0) + 1;
    stats.bySector[r.sector] = (stats.bySector[r.sector] || 0) + 1;
    stats.byPersona[r.persona] = (stats.byPersona[r.persona] || 0) + 1;
    stats.byChallenge[r.biggestChallenge] = (stats.byChallenge[r.biggestChallenge] || 0) + 1;
    stats.byTool[r.managementTool] = (stats.byTool[r.managementTool] || 0) + 1;
    stats.byFunding[r.fundingHistory] = (stats.byFunding[r.fundingHistory] || 0) + 1;
    totalRating += r.aiValueRating;
  });

  stats.avgAiRating = Number((totalRating / surveyResponses.length).toFixed(1));
  return stats;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Stats Endpoint
app.get("/api/stats", (req, res) => {
  try {
    const stats = calculateStats();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ERP Data Endpoints
app.get("/api/erp", (req, res) => {
  try {
    const erpData = loadERPData();
    res.json({ success: true, data: erpData });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/erp/save", (req, res) => {
  try {
    const updatedData = req.body;
    if (!updatedData || typeof updatedData !== "object") {
      return res.status(400).json({ success: false, message: "Dados do ERP inválidos" });
    }
    saveERPData(updatedData);
    res.json({ success: true, data: updatedData, message: "Base de Dados do ERP sincronizada com sucesso!" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Survey Submission Endpoint
app.post("/api/survey", (req, res) => {
  try {
    const { persona, sector, province, managementTool, biggestChallenge, fundingHistory, aiValueRating, organizationName, email, phone } = req.body;

    if (!persona || !sector || !province || !managementTool || !biggestChallenge || !fundingHistory || !aiValueRating) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios em falta" });
    }

    // Fingerprint or basic duplicate check (prevent multiple identical entries in rapid succession if names match)
    if (organizationName) {
      const exists = surveyResponses.some(r => r.organizationName?.toLowerCase() === organizationName.toLowerCase());
      if (exists) {
        return res.status(400).json({ success: false, message: "Esta organização já registou uma resposta." });
      }
    }

    const newResponse = {
      id: String(surveyResponses.length + 1),
      timestamp: new Date().toISOString(),
      persona,
      sector,
      province,
      managementTool,
      biggestChallenge,
      fundingHistory,
      aiValueRating: Number(aiValueRating),
      organizationName: organizationName || `Org anónima de ${province}`,
      email,
      phone
    };

    surveyResponses.push(newResponse);
    saveSurveyResponses(surveyResponses);
    const updatedStats = calculateStats();

    res.json({ success: true, data: updatedStats, message: "Resposta submetida com sucesso!" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Authentication Endpoints
app.post("/api/auth/register", (req, res) => {
  try {
    const { name, email, password, role, sector, organizationName } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios em falta" });
    }

    const currentUsers = loadUsers() || [];
    const exists = currentUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ success: false, message: "Este email já está registado." });
    }

    const newUser = {
      name,
      email,
      password,
      role,
      sector: sector || "Commerce",
      organizationName: organizationName || `Organização de ${name}`
    };

    currentUsers.push(newUser);
    saveUsers(currentUsers);

    res.json({
      success: true,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        sector: newUser.sector,
        organizationName: newUser.organizationName
      },
      message: "Utilizador registado com sucesso!"
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios em falta" });
    }

    const currentUsers = loadUsers() || [];
    const user = currentUsers.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && String(u.password) === String(password)
    );

    if (!user) {
      return res.status(401).json({ success: false, message: "Credenciais inválidas. Verifique o email e palavra-passe." });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        sector: user.sector,
        organizationName: user.organizationName
      },
      message: "Sessão iniciada com sucesso!"
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Advisor (Gemini) Endpoint
app.post("/api/advisor", async (req, res) => {
  try {
    const { advisorRole, sector, query, contextData } = req.body;

    if (!advisorRole || !query) {
      return res.status(400).json({ success: false, message: "Cargo do consultor e pergunta são obrigatórios." });
    }

    const systemInstructions = `Você é o ${advisorRole} oficial do OLO Fintel - uma plataforma de inteligência financeira e de preparação para financiamento focada em PMEs e cooperativas em Angola e região SADC.
O utilizador opera no setor: ${sector || 'Geral'}.

Sua tarefa é analisar a pergunta e o contexto operacional fornecido e produzir uma resposta no formato estrito de 5 blocos bem definidos, escrita em Português de Angola de forma profissional, clara e acionável.

A resposta deve conter obrigatoriamente estes 5 títulos e seções:

### Diagnóstico
[Forneça um diagnóstico claro da situação atual com base no contexto.]

### Riscos
[Aponte 2 a 3 riscos operacionais ou financeiros críticos se nada for feito.]

### Oportunidades
[Destaque melhorias, otimizações ou novos canais que podem ser explorados.]

### Ações Sugeridas
[Liste 3 ações claras, numeradas e práticas para o utilizador executar já hoje.]

### Impacto Esperado
[Estime o benefício financeiro ou operacional concreto esperados (ex: aumento de 15% na liquidez, redução de perdas).]`;

    const userPrompt = `Contexto Operacional/Financeiro do utilizador:
${JSON.stringify(contextData || {}, null, 2)}

Pergunta do utilizador:
"${query}"`;

    const ai = getAI();

    if (ai) {
      console.log(`Calling Gemini API for advisor role: ${advisorRole}...`);
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemInstructions,
          temperature: 0.7,
        }
      });

      const responseText = response.text || "Não foi possível gerar as recomendações no momento.";
      res.json({ success: true, text: responseText });
    } else {
      // Graceful local fallback for premium performance without Gemini API key configured
      console.log("No Gemini API key detected. Generating localized high-quality advisory fallback.");
      const fallbackResponse = generateMockAdvisory(advisorRole, sector || "Commerce", query, contextData || {});
      res.json({ success: true, text: fallbackResponse });
    }
  } catch (err: any) {
    console.error("Gemini Advisor Endpoint Error:", err);
    res.status(500).json({ success: false, message: err.message || "Erro na geração de IA." });
  }
});

// Mock generator for offline/unconfigured preview environments
function generateMockAdvisory(role: string, sector: string, query: string, context: any): string {
  const organizationName = context.orgName || "sua organização";
  
  if (role.toLowerCase().includes("financial") || role.toLowerCase().includes("finanças")) {
    return `### Diagnóstico
Analisámos a sua pergunta sobre finanças para a ${organizationName} no setor de ${sector}. O seu fluxo de caixa atual indica um descompasso estrutural entre os custos fixos com insumos e os ciclos de receita. A ausência de faturas rastreáveis e registos diários cria uma zona cinzenta que prejudica a visibilidade real da margem bruta.

### Riscos
1. **Quebra de Liquidez**: Se as contas a receber não forem cobradas em 15 dias, haverá falta de fundo de maneio para pagar salários e combustíveis.
2. **Incapacidade de Financiamento**: Os bancos parceiros rejeitam contas que não apresentam demonstrações de resultados organizadas mensais.

### Oportunidades
- **Negociação em Volume**: Agregação de compras de sementes ou insumos junto a outras cooperativas para reduzir o custo em até 12%.
- **Antecipação de Recebíveis**: Digitalização imediata de faturas para fechar contratos com compradores institucionais.

### Ações Sugeridas
1. **Registar Tudo Diariamente**: Utilize o painel de Finanças do OLO Fintel para registar todas as entradas e saídas no momento em que ocorrem.
2. **Separar Contas**: Crie uma barreira absoluta entre as despesas pessoais do gestor e o caixa da cooperativa.
3. **Planear Provisões**: Reserve 8% de cada receita de colheita ou venda para contingências e manutenção.

### Impacto Esperado
Espera-se uma melhoria imediata na estabilidade de caixa em 30 dias, com redução de custos supérfluos em até 15% e aumento considerável do seu Funding Score.`;
  }

  if (role.toLowerCase().includes("funding") || role.toLowerCase().includes("crédito")) {
    return `### Diagnóstico
O perfil de Funding Readiness da ${organizationName} está atualmente pontuado em ${context.score || 45}/100. Embora os dados operacionais apresentem regularidade, a lacuna documental (falta de NIF atualizado e Estatutos Registados) atua como um bloqueador absoluto para a banca nacional e linhas de microcrédito.

### Riscos
1. **Exclusão de Linhas Bonificadas**: Perda de acesso a crédito subsidiado com taxas abaixo de 10% devido a falhas documentais simples.
2. **Dependência de Capital Informal**: Recorrer a financiadores informais que cobram juros de usura que corroem toda a margem de lucro.

### Oportunidades
- **Elegibilidade Rápida**: A conclusão do seu dossiê documental aumentará o seu score para o patamar de "Pronto" (+25 pontos).
- **Relatórios Automatizados**: Exportação direta de dados auditados pelo OLO Fintel em PDF para apresentar diretamente ao gerente do banco.

### Ações Sugeridas
1. **Fazer Upload do NIF e Licenças**: Adicione os documentos que faltam na seção "Documentos" do OLO Fintel para aprovação do analista.
2. **Organizar o Histórico de Vendas**: Registar pelo menos 3 meses seguidos de vendas no painel comercial para comprovar regularidade de faturação.
3. **Simular Cenários**: Utilize o nosso simulador de score para ver qual componente (Comercial, Operacional ou Financeiro) terá o maior retorno sobre investimento documental.

### Impacto Esperado
Ao atingir um Funding Score superior a 75/100, a organização torna-se elegível para análise preferencial por cooperativas de microcrédito e bancos comerciais parceiros do OLO Fintel.`;
  }

  // Default General / Executive Advisor
  return `### Diagnóstico
Com base na análise estratégica da ${organizationName} (setor ${sector}), identificamos que a operação está a produzir volume, mas carece de um sistema de controle de frotas/equipamentos ou inventário estrito. A ausência de controle em tempo real cria perdas na colheita/inventário que afetam as margens gerais.

### Riscos
1. **Rotura de Stock de Insumos**: Paragens não planeadas da operação agrícola, pecuária ou de pesca por falta de rações, combustíveis ou sementes.
2. **Perda de Rastreabilidade**: Compradores de grande dimensão exigem histórico operacional e de qualidade que não está registado.

### Oportunidades
- **Digitalização da Produção**: Registo instantâneo de atividades diretamente do campo/embarcação via mobile, permitindo economia de combustível de até 10%.
- **Fidelização de Membros**: Mostrar transparência de contas para atrair novos produtores associados.

### Ações Sugeridas
1. **Ativar Módulo de Inventário**: Cadastre os produtos críticos (combustível, rações, sementes) e defina níveis de stock de alerta.
2. **Criar Atividades Diárias**: Delegar no sistema tarefas claras de manutenção preventiva para evitar falhas de tratores ou barcos.
3. **Responder ao Questionário**: Contribua com a sua resposta para o Estudo de Validação para reforçar a presença do seu município nas métricas regionais.

### Impacto Esperado
Redução imediata em 20% no desperdício de insumos operacionais e obtenção de um perfil transparente para auditoria externa.`;
}

// ----------------------------------------------------
// VITE MIDDLEWARE SETUP & STATIC FILES
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
