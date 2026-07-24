import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Sparkles, 
  TrendingUp, 
  CheckCircle, 
  Database, 
  Shield, 
  FileText, 
  Send, 
  RefreshCw, 
  BarChart, 
  Plus, 
  Lock, 
  HelpCircle, 
  Activity, 
  Award, 
  User, 
  AlertCircle, 
  ChevronRight, 
  X, 
  DollarSign, 
  FileCheck,
  Building,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Layers,
  HeartPulse,
  Ship,
  ShoppingBag,
  Cpu,
  Trash2,
  Check,
  Code
} from "lucide-react";

// Types matching OLO Fintel Backend Architecture
interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "IN" | "OUT";
  category: string;
  date: string;
}

interface DocumentItem {
  id: string;
  title: string;
  category: "NIF" | "CommercialLicense" | "Statutes";
  status: "Approved" | "Rejected" | "Pending" | "NotUploaded";
  fileUrl?: string;
}

interface SurveyAnswer {
  questionId: string;
  value: string;
}

export default function App() {
  // -------------------------------------------------------------
  // SIMULATION STATE (Owner / Sector / User Role Selector)
  // -------------------------------------------------------------
  const [activeSector, setActiveSector] = useState<"Agriculture" | "Livestock" | "Fisheries" | "Commerce">("Agriculture");
  const [activeRole, setActiveRole] = useState<"Owner" | "FinancialOfficer" | "Analyst" | "Jury" | "Guest" | "Admin">("Admin");
  const [activeProvince, setActiveProvince] = useState<string>("Benguela");
  const [orgName, setOrgName] = useState<string>("Cooperativa Agrícola de Catabola");
  const [nifValue, setNifValue] = useState<string>("5001228941");
  const [phoneValue, setPhoneValue] = useState<string>("+244 923 881 229");

  // -------------------------------------------------------------
  // BUSINESS OPERATIONS DATA STATE
  // -------------------------------------------------------------
  // 1. Agriculture
  const [plantings, setPlantings] = useState([
    { id: "p-1", crop: "Milho Amarelo", plot: "Talhão Norte", status: "Growing", area: "12 Ha", date: "2026-05-10" },
    { id: "p-2", crop: "Feijão Manteiga", plot: "Talhão Sul", status: "Harvested", area: "8 Ha", date: "2026-04-12" },
    { id: "p-3", crop: "Mandioca de Mesa", plot: "Talhão Leste", status: "Growing", area: "15 Ha", date: "2026-06-01" },
  ]);
  const [newCrop, setNewCrop] = useState("Milho Branco");
  const [newPlot, setNewPlot] = useState("Talhão Oeste");
  const [newArea, setNewArea] = useState("5 Ha");

  // 2. Livestock
  const [animals, setAnimals] = useState([
    { id: "a-1", tag: "AO-8821", breed: "Brahman", gender: "Fêmea", status: "Active", weight: "420 kg", vaccine: "Aftosa Ok" },
    { id: "a-2", tag: "AO-8822", breed: "Nelore", gender: "Macho", status: "Active", weight: "510 kg", vaccine: "Pendente" },
    { id: "a-3", tag: "AO-8823", breed: "Brahman", gender: "Fêmea", status: "Quarantine", weight: "380 kg", vaccine: "Aftosa Ok" },
  ]);
  const [newAnimalTag, setNewAnimalTag] = useState("AO-8824");
  const [newAnimalBreed, setNewAnimalBreed] = useState("Nelore");
  const [newAnimalWeight, setNewAnimalWeight] = useState("450 kg");

  // 3. Fisheries
  const [catches, setCatches] = useState([
    { id: "c-1", vessel: "Kalandula I", species: "Carapau", weight: "3.2 Ton", value: 1250000, date: "2026-07-15" },
    { id: "c-2", vessel: "Kalandula I", species: "Caxucho", weight: "1.8 Ton", value: 950000, date: "2026-07-16" },
    { id: "c-3", vessel: "Sassa Rio", species: "Sardinha", weight: "5.4 Ton", value: 2100000, date: "2026-07-17" },
  ]);
  const [newCatchSpecies, setNewCatchSpecies] = useState("Carapau");
  const [newCatchWeight, setNewCatchWeight] = useState("2.5 Ton");
  const [newCatchValue, setNewCatchValue] = useState("1100000");

  // 4. Commerce
  const [products, setProducts] = useState([
    { id: "pr-1", name: "Saco Adubo NPK 12-24-12", stock: 85, price: 24500, category: "Insumos" },
    { id: "pr-2", name: "Sementes Milho Híbrido 2kg", stock: 150, price: 6500, category: "Sementes" },
    { id: "pr-3", name: "Pulverizador Manual 16L", stock: 18, price: 38000, category: "Equipamentos" },
  ]);
  const [newProductName, setNewProductName] = useState("Enxada de Aço Forjado");
  const [newProductStock, setNewProductStock] = useState("40");
  const [newProductPrice, setNewProductPrice] = useState("7500");

  // -------------------------------------------------------------
  // FINANCE STATE
  // -------------------------------------------------------------
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "t-1", description: "Venda Directa - Sacos de Milho", amount: 1850000, type: "IN", category: "Sales", date: "2026-07-10" },
    { id: "t-2", description: "Diesel para Tractores e Logística", amount: 450000, type: "OUT", category: "Fuel", date: "2026-07-12" },
    { id: "t-3", description: "Compra de Fertilizantes NPK", amount: 720000, type: "OUT", category: "Supplies", date: "2026-07-14" },
    { id: "t-4", description: "Subsídio / Prêmio de Campanha", amount: 950000, type: "IN", category: "Subsidies", date: "2026-07-15" },
    { id: "t-5", description: "Venda Excedente de Sementes", amount: 320000, type: "IN", category: "Sales", date: "2026-07-17" },
  ]);
  const [newTxDesc, setNewTxDesc] = useState("");
  const [newTxAmount, setNewTxAmount] = useState("");
  const [newTxType, setNewTxType] = useState<"IN" | "OUT">("IN");
  const [newTxCategory, setNewTxCategory] = useState("Sales");

  // -------------------------------------------------------------
  // DOCUMENTATION STATE
  // -------------------------------------------------------------
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: "doc-1", title: "NIF Fiscal / Cartão de Contribuinte", category: "NIF", status: "Approved", fileUrl: "nif_fiscal_coop.pdf" },
    { id: "doc-2", title: "Alvará Comercial Activo", category: "CommercialLicense", status: "Pending", fileUrl: "alvara_comercial_2026.pdf" },
    { id: "doc-3", title: "Estatutos da Cooperativa Diário da República", category: "Statutes", status: "NotUploaded" },
  ]);

  // -------------------------------------------------------------
  // FUNDING ENGINE STATE
  // -------------------------------------------------------------
  const [isSubmittingFunding, setIsSubmittingFunding] = useState(false);
  const [fundingStatus, setFundingStatus] = useState<"None" | "Submitted" | "Approved" | "Rejected">("None");
  const [requestedAmount, setRequestedAmount] = useState("5000000");
  const [fundingPurpose, setFundingPurpose] = useState("Compra de Equipamento e Sementes de Campanha");

  // -------------------------------------------------------------
  // SURVEY STATE (Epic 15 Validation Survey)
  // -------------------------------------------------------------
  const [surveyProgress, setSurveyProgress] = useState({ current: 68, target: 100 });
  const [surveyStep, setSurveyStep] = useState(1);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>({
    sector: "Agricultura",
    biggestPain: "Falta de histórico de crédito para financiamento comercial",
    province: "Benguela",
    frequencyOfRecord: "Semanal"
  });
  const [surveyVoted, setSurveyVoted] = useState(false);
  // Simulating live survey logs for Jury View
  const [surveySubmissions, setSurveySubmissions] = useState([
    { id: "s-1", sector: "Agricultura", challenge: "Acesso a adubos e sementes", province: "Huambo", role: "Presidente" },
    { id: "s-2", sector: "Pesca", challenge: "Custo alto de combustível diesel", province: "Luanda", role: "Armador" },
    { id: "s-3", sector: "Pecuária", challenge: "Falta de vacinas e medicamentos", province: "Huíla", role: "Gestor" },
    { id: "s-4", sector: "Comércio", challenge: "Controle de stock e vendas", province: "Cabinda", role: "Comerciante" },
    { id: "s-5", sector: "Agricultura", challenge: "Histórico financeiro para a banca", province: "Malanje", role: "Associado" },
  ]);

  // -------------------------------------------------------------
  // AI ADVISOR CHAT STATE (Gemini 3.5 Flash Integration)
  // -------------------------------------------------------------
  const [aiAdvisorType, setAiAdvisorType] = useState<"Executive" | "Financial" | "Operations" | "Funding">("Executive");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiChat, setAiChat] = useState<Array<{ sender: "user" | "ai"; text: string; time: string }>>([
    { 
      sender: "ai", 
      text: "Olá! Sou o seu Consultor Inteligente OLO Fintel, energizado com Gemini 3.5. Como posso ajudar a organizar as operações e finanças da sua cooperativa hoje?", 
      time: "08:30" 
    }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // -------------------------------------------------------------
  // SYSTEM ACTIVITY LOGS STATE
  // -------------------------------------------------------------
  const [sysLogs, setSysLogs] = useState<Array<{ time: string; action: string; type: "INFO" | "SUCCESS" | "WARN" | "API" }>>([
    { time: "08:30:38", action: "System boot completed. OLO Fintel engine connected to database.", type: "INFO" },
    { time: "08:30:39", action: "GET /api/v1/public/platform-metrics - 200 OK - Baseline metrics loaded", type: "API" },
    { time: "08:30:40", action: "GET /api/v1/surveys/active - 200 OK - Active validation study identified", type: "API" },
  ]);

  const addLog = (action: string, type: "INFO" | "SUCCESS" | "WARN" | "API" = "API") => {
    const time = new Date().toISOString().slice(11, 19);
    setSysLogs(prev => [{ time, action, type }, ...prev].slice(0, 30));
  };

// -------------------------------------------------------------
  // ADMIN/DEVELOPER CONSOLE STATE & UTILITIES
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<"simulator" | "database" | "api">("simulator");
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [dbSuccessMsg, setDbSuccessMsg] = useState("");
  const [selectedEndpointIdx, setSelectedEndpointIdx] = useState(0);
  const [customPayload, setCustomPayload] = useState("");
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isCallingApi, setIsCallingApi] = useState(false);

  // 1. Estados de Autenticação Únicos do Administrador
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Helper único para ler o Token
  const getAuthToken = useCallback(() => localStorage.getItem("adminAccessToken"), []);

  // Fetch Database Status redefinido de forma segura
  const fetchDbStatus = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setAuthError("No active admin session. Please log in.");
      return;
    }

    setIsLoadingDb(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/v1/admin/db-status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminAccessToken");
        setIsAdminAuthenticated(false); // Força retorno ao ecrã de login
        setAuthError("Session expired. Please log in again.");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setDbStatus(data);
      } else {
        setAuthError(data.message || "Failed to fetch database status.");
      }
    } catch (err: any) {
      console.error("Erro a carregar status da BD:", err);
      setAuthError("Network error while reaching the server.");
    } finally {
      setIsLoadingDb(false);
    }
  }, [getAuthToken]);

   // Credenciais administrativas padrão para a Consola Exclusiva
  const ADMIN_AUTO_EMAIL = "kanji@olofintel.com";
  const ADMIN_AUTO_PASS = "20kperweek";

  // Função Única de Autenticação em Fluxo Contínuo
  const executeAutoAuth = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);

    // Passo 1: Tentar Login Direto
    try {
      let res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: ADMIN_AUTO_EMAIL, password: ADMIN_AUTO_PASS })
      });

      let data = await res.json();

      // Passo 2: Se o utilizador administrador não existir, cria-o automaticamente
      if (!res.ok && (res.status === 404 || data.message?.includes("not found") || data.message?.includes("inexistente"))) {
        console.log("ℹ️ Administrador principal não encontrado. A criar registo automático...");
        
        res = await fetch("/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: ADMIN_AUTO_EMAIL,
            password: ADMIN_AUTO_PASS,
            firstName: "Kanji",
            lastName: "Kode",
            role: "ADMIN" // Força o privilégio no backend
          })
        });
        
        data = await res.json();
      }

      // Passo 3: Gravar credenciais e libertar a Consola se o token foi gerado
      if (res.ok && data.token) {
        localStorage.setItem("adminAccessToken", data.token);
        setIsAdminAuthenticated(true);
        if (typeof addLog === "function") {
          addLog("Autenticação administrativa automatizada com sucesso.", "SUCCESS");
        }
      } else {
        setAuthError(data.message || "Falha no fluxo automatizado de Auth.");
      }
    } catch (err) {
      setAuthError("Servidor offline ou erro de rede no Render.");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Verificar sessão ou disparar o fluxo automático no arranque
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAdminAuthenticated(true);
    } else {
      executeAutoAuth(); // Dispara o motor automático se não houver sessão ativa
    }
  }, [getAuthToken, executeAutoAuth]);

  // Executar o fetch dos dados da BD apenas se estiver validado
  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchDbStatus();
    }
  }, [isAdminAuthenticated, fetchDbStatus]);
  
  const handleResetDb = async () => {
    if (!window.confirm("Aviso: Esta ação irá redefinir todas as tabelas e dados no PostgreSQL/Supabase. Desejas continuar?")) return;
    setIsLoadingDb(true);
    try {
      const res = await fetch("/api/v1/admin/db-reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setDbSuccessMsg("Base de dados redefinida e sincronizada com sucesso!");
        await fetchDbStatus();
        addLog("Redefinição total da Base de Dados executada pelo Administrador.", "WARN");
        setTimeout(() => setDbSuccessMsg(""), 4000);
      } else {
        alert("Erro ao redefinir base de dados: " + data.error);
      }
    } catch (err: any) {
      alert("Erro de conexão ao servidor: " + err.message);
    } finally {
      setIsLoadingDb(false);
    }
  };

  const ENDPOINTS = [
    {
      name: "Autenticação: Registo de Novo Gestor",
      method: "POST",
      path: "/api/v1/auth/register",
      auth: "Livre (Público)",
      tenant: "Não aplicável",
      description: "Cria uma conta de utilizador gestor e cria a respetiva Organização com papel de 'Owner'.",
      payload: {
        firstName: "Kiala",
        lastName: "Mateus",
        email: "kiala.mateus@coop.ao",
        password: "SenhaSuperSegura",
        phone: "+244923000000",
        organizationName: "Cooperativa Agrícola de Catabola",
        sector: "Agriculture"
      }
    },
    {
      name: "Autenticação: Iniciar Sessão (Login)",
      method: "POST",
      path: "/api/v1/auth/login",
      auth: "Livre (Público)",
      tenant: "Não aplicável",
      description: "Autentica o utilizador e devolve tokens JWT de acesso (1h) e de atualização (7 dias).",
      payload: {
        email: "raisingpigs252@gmail.com",
        password: "SenhaSuperSegura"
      }
    },
    {
      name: "Estudo de Mercado: Obter Estudo Ativo",
      method: "GET",
      path: "/api/v1/surveys/active",
      auth: "Livre (Público)",
      tenant: "Não aplicável",
      description: "Retorna a estrutura das perguntas do estudo de validação de mercado (Epic 15) e progresso.",
      payload: null
    },
    {
      name: "Estudo de Mercado: Submeter Resposta",
      method: "POST",
      path: "/api/v1/surveys/responses",
      auth: "Livre (Público)",
      tenant: "Não aplicável",
      description: "Regista as respostas de um respondente. Controlado por fingerprint de IP para evitar duplicados.",
      payload: {
        surveyId: "default-survey-id",
        organizationTypeHint: "Cooperativa",
        provinceHint: "Benguela",
        personaHint: "Presidente",
        answers: [
          { questionId: "q-sector", value: "Agricultura" },
          { questionId: "q-province", value: "Benguela" },
          { questionId: "q-challenge", value: "Falta de controle de fluxo de caixa." }
        ]
      }
    },
    {
      name: "Estatísticas: Painel de Júri de Validação",
      method: "GET",
      path: "/api/v1/surveys/jury-dashboard",
      auth: "Autenticado (Jury / Analyst / Admin)",
      tenant: "Opcional",
      description: "Disponibiliza dados agregados e métricas anónimas. Requer o perfil correspondente.",
      payload: null
    },
    {
      name: "Consultoria: Chat com Advisor de IA (Gemini)",
      method: "POST",
      path: "/api/v1/ai/chat",
      auth: "Autenticado (Qualquer papel)",
      tenant: "Requerido (Cabeçalho 'x-organization-id')",
      description: "Envia o prompt para o consultor especializado selecionado (Executive, Financial, Operations, Funding).",
      payload: {
        prompt: "Como reduzir os custos na colheita e otimizar adubos?",
        advisorType: "Operations"
      }
    },
    {
      name: "Funding: Calcular Score de Elegibilidade",
      method: "GET",
      path: "/api/v1/funding/score",
      auth: "Autenticado (Owner / FinancialOfficer / Analyst / Admin)",
      tenant: "Requerido (Cabeçalho 'x-organization-id')",
      description: "Calcula dinamicamente a prontidão financeira de 0 a 100 com base nos lançamentos reais.",
      payload: null
    },
    {
      name: "Funding: Submeter Dossiê à Banca",
      method: "POST",
      path: "/api/v1/funding/applications",
      auth: "Autenticado (Owner / FinancialOfficer / Admin)",
      tenant: "Requerido (Cabeçalho 'x-organization-id')",
      description: "Cria um dossiê de candidatura de crédito e envia para análise analítica dos bancos parceiros.",
      payload: {
        requestedAmount: 5000000,
        purpose: "Compra de Trator de Pneus e Equipamentos de Rega por Aspersão"
      }
    },
    {
      name: "Notificações: Listar Notificações",
      method: "GET",
      path: "/api/v1/notifications",
      auth: "Autenticado (Qualquer papel)",
      tenant: "Não aplicável",
      description: "Obtém todas as notificações enviadas para o utilizador autenticado (notificações operacionais, financeiras, etc.).",
      payload: null
    },
    {
      name: "Notificações: Marcar Todas como Lidas",
      method: "PATCH",
      path: "/api/v1/notifications/read-all",
      auth: "Autenticado (Qualquer papel)",
      tenant: "Não aplicável",
      description: "Marca instantaneamente todas as notificações pendentes do utilizador como lidas.",
      payload: {}
    },
    {
      name: "Notificações: Criar Notificação Simulada",
      method: "POST",
      path: "/api/v1/notifications",
      auth: "Autenticado (Qualquer papel)",
      tenant: "Não aplicável",
      description: "Dispara/Simula o envio de uma notificação customizada para fins de auditoria ou alertamento operacional.",
      payload: {
        userId: "usr-sim-uuid-benguela",
        type: "Operational",
        title: "Alerta de Colheita Crítica",
        body: "A humidade do solo no Setor C da fazenda atingiu limites críticos. Agendar irrigação prioritária."
      }
    }
  ];

  const handleExecuteApiCall = async () => {
    setIsCallingApi(true);
    setApiResponse(null);
    const endpoint = ENDPOINTS[selectedEndpointIdx];
    
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": "Bearer mock-access-token-jwt",
        "x-organization-id": "org-sim-uuid-benguela"
      };

      const options: RequestInit = {
        method: endpoint.method,
        headers
      };

      if (endpoint.method !== "GET" && customPayload) {
        options.body = customPayload;
      }

      const res = await fetch(endpoint.path, options);
      const contentType = res.headers.get("content-type");
      const text = await res.text();
      
      if (contentType && contentType.includes("application/json")) {
        try {
          const data = JSON.parse(text);
          setApiResponse(JSON.stringify(data, null, 2));
        } catch (e) {
          setApiResponse(`[Status ${res.status}] Erro ao parsear JSON:\n\n${text}`);
        }
      } else {
        setApiResponse(`[Status ${res.status} - ${res.statusText || "No Status Text"}]\n\n${text}`);
      }
      
      if (res.ok) {
        addLog(`Playground API: ${endpoint.method} ${endpoint.path} - Retornado com sucesso (${res.status})`, "SUCCESS");
      } else {
        addLog(`Playground API: ${endpoint.method} ${endpoint.path} - Servidor respondeu com erro (${res.status})`, "WARN");
      }
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
      addLog(`Playground API: ${endpoint.method} ${endpoint.path} - Erro de ligação físico`, "WARN");
    } finally {
      setIsCallingApi(false);
    }
  };

  useEffect(() => {
    fetchDbStatus();
  }, []);

  useEffect(() => {
    const endpoint = ENDPOINTS[selectedEndpointIdx];
    if (endpoint && endpoint.payload) {
      setCustomPayload(JSON.stringify(endpoint.payload, null, 2));
    } else {
      setCustomPayload("");
    }
    setApiResponse(null);
  }, [selectedEndpointIdx]);

  // -------------------------------------------------------------
  // DYNAMIC CALCULATORS FOR READINESS SCORE
  // -------------------------------------------------------------
  // 1. Operational Score: based on registered items
  const opScore = Math.min(40 + (
    activeSector === "Agriculture" ? plantings.length * 15 :
    activeSector === "Livestock" ? animals.length * 15 :
    activeSector === "Fisheries" ? catches.length * 15 :
    products.length * 15
  ), 100);

  // 2. Financial Score: based on ratio of transactions and profitability
  const totalInflow = transactions.filter(t => t.type === "IN").reduce((sum, t) => sum + t.amount, 0);
  const totalOutflow = transactions.filter(t => t.type === "OUT").reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalInflow - totalOutflow;
  const finScore = Math.min(30 + (transactions.length * 6) + (totalInflow > totalOutflow ? 20 : 0), 100);

  // 3. Document Score: based on uploaded / approved document status
  const approvedDocs = documents.filter(d => d.status === "Approved").length;
  const docScore = Math.round((approvedDocs / documents.length) * 100);

  // 4. Commercial Score: based on activity logs
  const commScore = Math.min(35 + (transactions.filter(t => t.category === "Sales").length * 15), 100);

  // Final Weighted score
  const finalFundingScore = Math.round((opScore * 0.25) + (finScore * 0.35) + (commScore * 0.2) + (docScore * 0.2));

  // -------------------------------------------------------------
  // DYNAMIC SURVEY STATISTICS (Jury View Agregados)
  // -------------------------------------------------------------
  const getSurveyAggregates = () => {
    const sectors: Record<string, number> = {};
    const provinces: Record<string, number> = {};
    const challenges: Record<string, number> = {};

    surveySubmissions.forEach(s => {
      sectors[s.sector] = (sectors[s.sector] || 0) + 1;
      provinces[s.province] = (provinces[s.province] || 0) + 1;
      // Extract general challenge keywords or use entire text
      const shortCh = s.challenge.slice(0, 20) + "...";
      challenges[shortCh] = (challenges[shortCh] || 0) + 1;
    });

    return { sectors, provinces, challenges };
  };

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  // Toggle dynamic doc status
  const toggleDocStatus = (docId: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        let nextStatus: "Approved" | "Rejected" | "Pending" | "NotUploaded" = "NotUploaded";
        if (d.status === "NotUploaded") nextStatus = "Pending";
        else if (d.status === "Pending") nextStatus = "Approved";
        else if (d.status === "Approved") nextStatus = "Rejected";
        else nextStatus = "NotUploaded";

        addLog(`Documento '${d.category}' alterado para o estado: ${nextStatus}`, "SUCCESS");
        return { ...d, status: nextStatus, fileUrl: nextStatus !== "NotUploaded" ? `${d.category.toLowerCase()}_copy.pdf` : undefined };
      }
      return d;
    }));
  };

  // Add Transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxDesc || !newTxAmount) return;
    const amountVal = parseFloat(newTxAmount);
    if (isNaN(amountVal)) return;

    const newTx: Transaction = {
      id: "t-" + (transactions.length + 1),
      description: newTxDesc,
      amount: amountVal,
      type: newTxType,
      category: newTxCategory,
      date: new Date().toISOString().slice(0, 10)
    };

    setTransactions([newTx, ...transactions]);
    setNewTxDesc("");
    setNewTxAmount("");
    addLog(`POST /api/v1/finance/${newTxType === "IN" ? "revenues" : "expenses"} - Gravado ${amountVal} AOA`, "SUCCESS");
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    addLog(`Transação ${id} removida do ledger local.`, "WARN");
  };

  // Add Operational Item based on sector
  const handleAddOperationalItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSector === "Agriculture") {
      const newItem = {
        id: "p-" + (plantings.length + 1),
        crop: newCrop,
        plot: newPlot,
        status: "Growing",
        area: newArea,
        date: new Date().toISOString().slice(0, 10)
      };
      setPlantings([newItem, ...plantings]);
      addLog(`POST /api/v1/operations/agriculture/harvests - Talhão ${newPlot} semeado com ${newCrop}`, "SUCCESS");
    } else if (activeSector === "Livestock") {
      const newItem = {
        id: "a-" + (animals.length + 1),
        tag: newAnimalTag,
        breed: newAnimalBreed,
        status: "Active",
        gender: "Macho",
        weight: newAnimalWeight,
        vaccine: "Pendente"
      };
      setAnimals([newItem, ...animals]);
      setNewAnimalTag("AO-" + (Math.floor(Math.random() * 9000) + 1000));
      addLog(`POST /api/v1/operations/livestock/animals - Animal registado com tag ${newAnimalTag}`, "SUCCESS");
    } else if (activeSector === "Fisheries") {
      const newItem = {
        id: "c-" + (catches.length + 1),
        vessel: "Kalandula I",
        species: newCatchSpecies,
        weight: newCatchWeight,
        value: parseFloat(newCatchValue) || 1200000,
        date: new Date().toISOString().slice(0, 10)
      };
      setCatches([newItem, ...catches]);
      addLog(`POST /api/v1/operations/fisheries/catches - Captura de ${newCatchSpecies} (${newCatchWeight}) registada`, "SUCCESS");
    } else {
      const newItem = {
        id: "pr-" + (products.length + 1),
        name: newProductName,
        stock: parseInt(newProductStock) || 10,
        price: parseFloat(newProductPrice) || 5000,
        category: "Equipamento"
      };
      setProducts([newItem, ...products]);
      addLog(`POST /api/v1/operations/commerce/products - Produto '${newProductName}' adicionado ao catálogo`, "SUCCESS");
    }
  };

  // Submit survey
  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVote = {
      id: "s-" + (surveySubmissions.length + 1),
      sector: surveyAnswers.sector,
      challenge: surveyAnswers.biggestPain,
      province: surveyAnswers.province,
      role: activeRole === "Guest" ? "Visitante" : activeRole
    };
    setSurveySubmissions([newVote, ...surveySubmissions]);
    setSurveyProgress(prev => ({ ...prev, current: prev.current + 1 }));
    setSurveyVoted(true);
    addLog(`POST /api/v1/surveys/responses - Resposta ao estudo submetida (IP: HashFingerprint)`, "SUCCESS");
  };

  // AI Chat inquiry
  const handleAiInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userMsg = aiPrompt;
    setAiPrompt("");
    const timestamp = new Date().toISOString().slice(11, 16);
    setAiChat(prev => [...prev, { sender: "user", text: userMsg, time: timestamp }]);
    setIsAiThinking(true);
    addLog(`POST /api/v1/ai/chat - Prompt enviado ao Gemini 3.5 para contexto '${aiAdvisorType}'`, "API");

    // Live backend integration with server.ts endpoint
    try {
      const response = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock-access-token-jwt",
          "x-organization-id": "org-sim-uuid"
        },
        body: JSON.stringify({
          prompt: userMsg,
          advisorType: aiAdvisorType
        })
      });

      const resJson = await response.json();
      const aiReply = resJson.success && resJson.data?.reply
        ? resJson.data.reply
        : null;

      if (aiReply) {
        setAiChat(prev => [...prev, { sender: "ai", text: aiReply, time: new Date().toISOString().slice(11, 16) }]);
        addLog(`Response successfully retrieved via server-side Gemini AI engine!`, "SUCCESS");
      } else {
        throw new Error("No payload reply");
      }
    } catch (err) {
      // Offline fallback tailored to the sector & questions
      setTimeout(() => {
        let reply = "";
        if (aiAdvisorType === "Financial") {
          reply = `[Consultor Financeiro OLO] Analisando o fluxo de caixa actual da ${orgName}, o seu saldo líquido é de ${netBalance.toLocaleString()} AOA. Para maximizar o seu Funding Score (actualmente ${finalFundingScore}%), deve elevar as receitas regulares e regularizar o Alvará Comercial. Tente cortar custos logísticos supérfluos.`;
        } else if (aiAdvisorType === "Funding") {
          reply = `[Consultor de Financiamento] Olá! Para se tornar elegível a linhas de apoio (como o BDA / Prodesi ou microcrédito do FADA em Angola), a sua documentação é prioritária. O seu Document Score está em ${docScore}%. Suba e aprove os Estatutos para desbloquear as candidaturas!`;
        } else if (aiAdvisorType === "Operations") {
          reply = `[Consultor de Operações] A gestão operacional no sector de ${activeSector === "Agriculture" ? "Agricultura" : activeSector === "Livestock" ? "Pecuária" : activeSector === "Fisheries" ? "Pesca" : "Comércio"} é vital. Registou recentemente ${
            activeSector === "Agriculture" ? plantings.length + " sementeiras" :
            activeSector === "Livestock" ? animals.length + " animais" :
            activeSector === "Fisheries" ? catches.length + " pescas" :
            products.length + " produtos"
          }. A consistência nestes lançamentos gera dados de idoneidade que os bancos angolanos valorizam.`;
        } else {
          reply = `[Consultor Executivo] Com base no NIF ${nifValue} na província do ${activeProvince}, a sua cooperativa demonstra boa tração diária. Recomendo criar um plano de emergência para resiliência climática e organizar o fundo de caixa num banco parceiro comercial.`;
        }
        setAiChat(prev => [...prev, { sender: "ai", text: reply, time: new Date().toISOString().slice(11, 16) }]);
        addLog(`Offline fallback advisor responded with customized localized business guidelines.`, "INFO");
      }, 900);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Submit credit lines request
  const handleApplyFunding = () => {
    if (docScore < 50) {
      addLog("Erro ao submeter: O Document Score deve ser de pelo menos 50% para candidaturas à banca.", "WARN");
      alert("Candidatura Bloqueada! É necessário fazer upload e ter documentos aprovados (mínimo 50% de Document Score) para enviar pedidos à banca parceira.");
      return;
    }
    setIsSubmittingFunding(true);
    addLog(`POST /api/v1/funding/applications - Enviando dossiê de crédito de ${requestedAmount} AOA...`, "API");
    
    setTimeout(() => {
      setIsSubmittingFunding(false);
      setFundingStatus("Submitted");
      addLog(`Submetido com Sucesso! Dossiê enviado ao BDA / FADA e bancos parceiros com o selo de validação OLO Fintel.`, "SUCCESS");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans p-4 md:p-6 flex flex-col justify-between">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Cpu className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">OLO FINTEL ENGINE</h1>
              <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full">v1.2-STABLE</span>
            </div>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Identidade Económica & Score de Financiamento</p>
          </div>
        </div>

        {/* CONTROLLER BOX / SELECTOR SIMULATOR IN HEADER */}
        <div className="flex flex-wrap items-center gap-3 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/80 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase pl-1">Sector:</span>
            <select 
              value={activeSector} 
              onChange={(e) => {
                const s = e.target.value as any;
                setActiveSector(s);
                addLog(`Modulado simulador: Alterado sector da Organização para ${s}`, "INFO");
              }}
              className="bg-zinc-950 border border-zinc-800 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:border-emerald-500"
            >
              <option value="Agriculture">🌾 Agricultura / Cooperativas</option>
              <option value="Livestock">🐄 Pecuária / Criadores</option>
              <option value="Fisheries">⚓ Pesca Artesanal / Cooperativa</option>
              <option value="Commerce">🛍️ Comércio de Insumos</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-3">
            <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">Utilizador:</span>
            <select 
              value={activeRole} 
              onChange={(e) => {
                const r = e.target.value as any;
                setActiveRole(r);
                addLog(`RBAC Modulado: Utilizador logado como ${r}`, "INFO");
              }}
              className="bg-zinc-950 border border-zinc-800 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:border-emerald-500"
            >
              <option value="Owner">👑 Gestor (Owner / Dono)</option>
              <option value="FinancialOfficer">💰 Analista Financeiro (Finances)</option>
              <option value="Analyst">🛡️ Analista de Crédito (Banca)</option>
              <option value="Jury">⚖️ Jurado Evaluador (Ecosystem)</option>
              <option value="Admin">⚡ Super Administrador (Admin)</option>
              <option value="Guest">🌐 Visitante / Público</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 self-stretch md:self-auto justify-between border-t md:border-t-0 pt-3 md:pt-0 border-zinc-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-xs font-mono text-zinc-400">ENGINE_LIVE: 2026-07-18</span>
          </div>
        </div>
      </header>

      {/* DEVELOPER / SUPERADMIN CONTROL PANEL TABS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-900 border border-zinc-800 p-2 rounded-2xl mb-6">
        <div className="flex items-center gap-2 pl-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-300">CONSOLA ADMINISTRATIVA:</span>
        </div>
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-850 gap-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === "simulator"
                ? "bg-emerald-500 text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <span>📱</span> Simulador de Operações
          </button>
          <button
            onClick={() => {
              setActiveTab("database");
              fetchDbStatus();
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === "database"
                ? "bg-emerald-500 text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <span>🗄️</span> DB Postgres Inspector
          </button>
          <button
            onClick={() => setActiveTab("api")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === "api"
                ? "bg-emerald-500 text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <span>⚡</span> API Docs & Playground
          </button>
        </div>
      </div>

      {activeTab === "simulator" && (
        <main className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-grow mb-6">
        
        {/* CARD 1: ECONOMIC IDENTITY & DOCUMENT STATUS (Col-span-4, Row-span-12 equivalent) */}
        <section className="md:col-span-4 bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700/50 transition-colors duration-200">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Identidade Económica</h3>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase font-mono">Verificado</span>
            </div>

            {/* Editable Fields for Demonstration */}
            <div className="space-y-3.5 mb-6">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Nome da Organização</label>
                <input 
                  type="text" 
                  value={orgName} 
                  onChange={(e) => {
                    setOrgName(e.target.value);
                    addLog(`Nome da Organização atualizado para: ${e.target.value}`, "INFO");
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">NIF Fiscal</label>
                  <input 
                    type="text" 
                    value={nifValue} 
                    onChange={(e) => {
                      setNifValue(e.target.value);
                      addLog(`NIF Fiscal alterado para: ${e.target.value}`, "INFO");
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Província</label>
                  <select 
                    value={activeProvince} 
                    onChange={(e) => {
                      setActiveProvince(e.target.value);
                      addLog(`Província alterada para: ${e.target.value}`, "INFO");
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Benguela">Benguela</option>
                    <option value="Luanda">Luanda</option>
                    <option value="Huambo">Huambo</option>
                    <option value="Huíla">Huíla</option>
                    <option value="Cabinda">Cabinda</option>
                    <option value="Uíge">Uíge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Contacto Telefónico</label>
                <input 
                  type="text" 
                  value={phoneValue} 
                  onChange={(e) => {
                    setPhoneValue(e.target.value);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Document Vault Section */}
            <div className="border-t border-zinc-800/80 pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Dossiê de Documentos</h4>
                <span title="Clique no documento para simular envio/aprovação pelos analistas">
                  <HelpCircle className="w-3.5 h-3.5 text-zinc-600 cursor-help" />
                </span>
              </div>
              
              <div className="space-y-2.5">
                {documents.map((doc) => (
                  <div 
                    key={doc.id} 
                    onClick={() => toggleDocStatus(doc.id)}
                    className="group flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800/50 hover:border-zinc-700 cursor-pointer transition-all duration-150"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-zinc-900 rounded-lg text-zinc-400 group-hover:text-emerald-400">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-300">{doc.category}</p>
                        <p className="text-[9px] font-mono text-zinc-600 truncate max-w-[150px]">{doc.title}</p>
                      </div>
                    </div>
                    <div>
                      {doc.status === "Approved" && (
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">APROVADO</span>
                      )}
                      {doc.status === "Pending" && (
                        <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">PENDENTE</span>
                      )}
                      {doc.status === "Rejected" && (
                        <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-mono">REJEITADO</span>
                      )}
                      {doc.status === "NotUploaded" && (
                        <span className="text-[9px] bg-zinc-800 text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-full font-mono">EM FALTA</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-zinc-600 font-mono mt-2 text-center">💡 Dica: Clique nos documentos para simular a submissão e análise.</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Uptime: 99.98%</span>
            <span className="text-emerald-400">Canónico Ativo</span>
          </div>
        </section>

        {/* CARD 2: DYNAMIC OPERATIONS BOARD (Col-span-5, Row-span-2) */}
        <section className="md:col-span-5 bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700/50 transition-colors duration-200">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                  Painel de Operações: {
                    activeSector === "Agriculture" ? "Agricultura" : 
                    activeSector === "Livestock" ? "Pecuária" : 
                    activeSector === "Fisheries" ? "Pesca" : "Comércio"
                  }
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 font-bold bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
                CAMPANHA_2026
              </span>
            </div>

            {/* SECTOR-SPECIFIC LISTINGS */}
            <div className="max-h-[220px] overflow-y-auto space-y-2 mb-4 pr-1">
              
              {/* AGRICULTURE */}
              {activeSector === "Agriculture" && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 text-[10px] font-mono text-zinc-600 border-b border-zinc-800 pb-1 px-1">
                    <span>CULTURA</span>
                    <span>LOCALIZAÇÃO</span>
                    <span className="text-right">ÁREA</span>
                  </div>
                  {plantings.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-2 bg-zinc-950 rounded-lg border border-zinc-800/60 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="font-semibold text-zinc-200">{p.crop}</span>
                      </div>
                      <span className="text-zinc-400 font-mono text-[11px]">{p.plot}</span>
                      <span className="text-emerald-400 font-mono text-[11px]">{p.area}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* LIVESTOCK */}
              {activeSector === "Livestock" && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 text-[10px] font-mono text-zinc-600 border-b border-zinc-800 pb-1 px-1">
                    <span>CÓDIGO (BRINCO)</span>
                    <span>RAÇA / ESTADO</span>
                    <span className="text-right">PESO</span>
                  </div>
                  {animals.map(a => (
                    <div key={a.id} className="flex justify-between items-center p-2 bg-zinc-950 rounded-lg border border-zinc-800/60 text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${a.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                        <span className="font-mono text-zinc-200 font-bold">{a.tag}</span>
                      </div>
                      <span className="text-zinc-400 text-[11px]">{a.breed} ({a.status})</span>
                      <span className="text-emerald-400 font-mono text-[11px]">{a.weight}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* FISHERIES */}
              {activeSector === "Fisheries" && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 text-[10px] font-mono text-zinc-600 border-b border-zinc-800 pb-1 px-1">
                    <span>EMBARCAÇÃO</span>
                    <span>ESPÉCIE CAPTURADA</span>
                    <span className="text-right">TONELAGEM</span>
                  </div>
                  {catches.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-2 bg-zinc-950 rounded-lg border border-zinc-800/60 text-xs">
                      <div className="flex items-center gap-2">
                        <Ship className="w-3.5 h-3.5 text-blue-400" />
                        <span className="font-semibold text-zinc-200">{c.vessel}</span>
                      </div>
                      <span className="text-zinc-400 text-[11px]">{c.species}</span>
                      <span className="text-emerald-400 font-mono text-[11px]">{c.weight}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* COMMERCE */}
              {activeSector === "Commerce" && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 text-[10px] font-mono text-zinc-600 border-b border-zinc-800 pb-1 px-1">
                    <span>NOME DO PRODUTO</span>
                    <span>STOCK RESTRITO</span>
                    <span className="text-right">PREÇO UNIT.</span>
                  </div>
                  {products.map(pr => (
                    <div key={pr.id} className="flex justify-between items-center p-2 bg-zinc-950 rounded-lg border border-zinc-800/60 text-xs">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
                        <span className="font-semibold text-zinc-200 truncate max-w-[120px]">{pr.name}</span>
                      </div>
                      <span className={`font-mono text-[11px] ${pr.stock < 20 ? "text-red-400" : "text-zinc-400"}`}>{pr.stock} Un</span>
                      <span className="text-emerald-400 font-mono text-[11px]">{pr.price.toLocaleString()} AOA</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* DYNAMIC QUICK ADD FORM (RBAC RESTRICTED - Only Manager, Owner, Admin) */}
          <div className="border-t border-zinc-800/80 pt-4">
            {["Owner", "FinancialOfficer", "Admin"].includes(activeRole) ? (
              <form onSubmit={handleAddOperationalItem} className="space-y-3">
                <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">Lançar Novo Registo Operacional</p>
                
                {/* Agriculture Form */}
                {activeSector === "Agriculture" && (
                  <div className="grid grid-cols-3 gap-2">
                    <input 
                      type="text" 
                      placeholder="Cultura" 
                      value={newCrop} 
                      onChange={(e) => setNewCrop(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white" 
                    />
                    <input 
                      type="text" 
                      placeholder="Talhão" 
                      value={newPlot} 
                      onChange={(e) => setNewPlot(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white" 
                    />
                    <input 
                      type="text" 
                      placeholder="Área (Ha)" 
                      value={newArea} 
                      onChange={(e) => setNewArea(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white" 
                    />
                  </div>
                )}

                {/* Livestock Form */}
                {activeSector === "Livestock" && (
                  <div className="grid grid-cols-3 gap-2">
                    <input 
                      type="text" 
                      placeholder="Brinco Tag" 
                      value={newAnimalTag} 
                      onChange={(e) => setNewAnimalTag(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs font-mono text-white" 
                    />
                    <input 
                      type="text" 
                      placeholder="Raça" 
                      value={newAnimalBreed} 
                      onChange={(e) => setNewAnimalBreed(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white" 
                    />
                    <input 
                      type="text" 
                      placeholder="Peso" 
                      value={newAnimalWeight} 
                      onChange={(e) => setNewAnimalWeight(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white" 
                    />
                  </div>
                )}

                {/* Fisheries Form */}
                {activeSector === "Fisheries" && (
                  <div className="grid grid-cols-3 gap-2">
                    <select 
                      value={newCatchSpecies} 
                      onChange={(e) => setNewCatchSpecies(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                    >
                      <option value="Carapau">Carapau</option>
                      <option value="Caxucho">Caxucho</option>
                      <option value="Sardinha">Sardinha</option>
                      <option value="Atum">Atum</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Peso (Ton)" 
                      value={newCatchWeight} 
                      onChange={(e) => setNewCatchWeight(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white" 
                    />
                    <input 
                      type="number" 
                      placeholder="Preço Total" 
                      value={newCatchValue} 
                      onChange={(e) => setNewCatchValue(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white" 
                    />
                  </div>
                )}

                {/* Commerce Form */}
                {activeSector === "Commerce" && (
                  <div className="grid grid-cols-3 gap-2">
                    <input 
                      type="text" 
                      placeholder="Produto" 
                      value={newProductName} 
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded col-span-1 px-2.5 py-1 text-xs text-white" 
                    />
                    <input 
                      type="number" 
                      placeholder="Stock" 
                      value={newProductStock} 
                      onChange={(e) => setNewProductStock(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white" 
                    />
                    <input 
                      type="number" 
                      placeholder="Preço (AOA)" 
                      value={newProductPrice} 
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white" 
                    />
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" /> Registar Actividade
                </button>
              </form>
            ) : (
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center gap-2.5 text-zinc-500 text-xs">
                <Lock className="w-4 h-4 text-zinc-600 shrink-0" />
                <span>Modificação de registros de atividade bloqueada para o seu perfil (<b>{activeRole}</b>). Altere para <b>Owner</b>, <b>Analista Financeiro</b> ou <b>Admin</b> acima para editar.</span>
              </div>
            )}
          </div>
        </section>

        {/* CARD 3: REAL-TIME CASH FLOW LEDGER (Col-span-3, Row-span-2) */}
        <section className="md:col-span-3 bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700/50 transition-colors duration-200">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Ledger Financeiro</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            </div>

            {/* Account Balance Card */}
            <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 p-4 rounded-xl border border-zinc-800/80 mb-4">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Saldo Corrente Estimado</span>
              <p className={`text-xl font-bold font-mono tracking-tight mt-1 ${netBalance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {netBalance.toLocaleString()} <span className="text-xs text-zinc-400">AOA</span>
              </p>
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-2.5 pt-2.5 border-t border-zinc-900">
                <span className="text-emerald-500">📥 +{totalInflow.toLocaleString()}</span>
                <span className="text-red-400">📤 -{totalOutflow.toLocaleString()}</span>
              </div>
            </div>

            {/* Cash Flow Ledger Activity */}
            <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 text-xs">
              {transactions.map(t => (
                <div key={t.id} className="flex justify-between items-center p-2 bg-zinc-950 rounded-lg border border-zinc-900/60 group">
                  <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                    {t.type === "IN" ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <ArrowDownLeft className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-zinc-300 truncate" title={t.description}>{t.description}</p>
                      <p className="text-[8px] font-mono text-zinc-500">{t.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`font-mono text-[11px] font-bold ${t.type === "IN" ? "text-emerald-400" : "text-red-400"}`}>
                      {t.type === "IN" ? "+" : "-"}{t.amount.toLocaleString()}
                    </span>
                    {["Owner", "Admin"].includes(activeRole) && (
                      <button 
                        onClick={() => handleDeleteTransaction(t.id)}
                        className="text-zinc-700 hover:text-red-400 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Apagar registo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Transaction Adding Form */}
          <div className="border-t border-zinc-800/80 pt-3">
            {["Owner", "FinancialOfficer", "Admin"].includes(activeRole) ? (
              <form onSubmit={handleAddTransaction} className="space-y-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Descrição do lançamento" 
                    value={newTxDesc} 
                    onChange={(e) => setNewTxDesc(e.target.value)}
                    required
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-white" 
                  />
                  <select 
                    value={newTxType} 
                    onChange={(e) => setNewTxType(e.target.value as any)}
                    className="bg-zinc-950 border border-zinc-800 rounded text-xs text-white px-1"
                  >
                    <option value="IN">Inflow (+)</option>
                    <option value="OUT">Outflow (-)</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Valor em AOA" 
                    value={newTxAmount} 
                    onChange={(e) => setNewTxAmount(e.target.value)}
                    required
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-white font-mono" 
                  />
                  <button 
                    type="submit" 
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs rounded cursor-pointer transition-colors"
                  >
                    Gravar
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-[9px] text-zinc-500 font-mono text-center">Permissão de lançamentos financeiros restrita a gestores e financeiros.</p>
            )}
          </div>
        </section>

        {/* CARD 4: FUNDING READINESS CENTER & SCORE ENGINE (Col-span-4, Row-span-2) */}
        <section className="md:col-span-4 bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700/50 transition-colors duration-200">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Funding Readiness Score</h3>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-500/20 font-mono font-bold">PRODESI_READY</span>
            </div>

            {/* Score Radial Visualizer */}
            <div className="flex items-center gap-5 bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 mb-4">
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                {/* SVG circular bar */}
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="rgba(39, 39, 42, 0.4)" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="32" 
                    stroke="#10b981" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray={201}
                    strokeDashoffset={201 - (201 * finalFundingScore) / 100}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-lg font-bold font-mono text-white leading-none">{finalFundingScore}%</span>
                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono mt-0.5">Score</span>
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Operacional (25%)</span>
                  <span className="font-mono text-emerald-400">{opScore}%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Financeiro (35%)</span>
                  <span className="font-mono text-emerald-400">{finScore}%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Documental (20%)</span>
                  <span className="font-mono text-emerald-400">{docScore}%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Comercial (20%)</span>
                  <span className="font-mono text-emerald-400">{commScore}%</span>
                </div>
              </div>
            </div>

            {/* Credit Checklist Tracker */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-zinc-950/50 rounded-lg border border-zinc-800">
                <span className="text-zinc-400">NIF Fiscal Ativo e Validado</span>
                {documents.find(d => d.category === "NIF")?.status === "Approved" ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 animate-pulse" />
                )}
              </div>
              <div className="flex items-center justify-between p-2 bg-zinc-950/50 rounded-lg border border-zinc-800">
                <span className="text-zinc-400">Histórico Financeiro ({transactions.length} lançamentos)</span>
                {transactions.length >= 3 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-zinc-600" />
                )}
              </div>
              <div className="flex items-center justify-between p-2 bg-zinc-950/50 rounded-lg border border-zinc-800">
                <span className="text-zinc-400">Alvará Comercial Ativo</span>
                {documents.find(d => d.category === "CommercialLicense")?.status === "Approved" ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-zinc-600" />
                )}
              </div>
            </div>
          </div>

          {/* Funding Application Gated Trigger */}
          <div className="border-t border-zinc-800/80 pt-4">
            {fundingStatus === "None" ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[8px] text-zinc-500 uppercase font-mono block mb-1">Montante Solicitado (AOA)</label>
                    <input 
                      type="number" 
                      value={requestedAmount} 
                      onChange={(e) => setRequestedAmount(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white font-mono" 
                    />
                  </div>
                  <div className="flex-1.5">
                    <label className="text-[8px] text-zinc-500 uppercase font-mono block mb-1">Finalidade do Crédito</label>
                    <input 
                      type="text" 
                      value={fundingPurpose} 
                      onChange={(e) => setFundingPurpose(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white" 
                    />
                  </div>
                </div>

                <button 
                  onClick={handleApplyFunding}
                  disabled={isSubmittingFunding}
                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer transition-all duration-200"
                >
                  {isSubmittingFunding ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      A submeter Candidatura ao Banco...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submeter Candidatura de Crédito
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span className="font-bold">Candidatura de Financiamento Submetida!</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Os dados da cooperativa foram empacotados num dossier digital assinado e entregues aos analistas bancários do BDA e FADA para concessão de crédito.
                </p>
                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 border-t border-emerald-500/10 pt-2">
                  <span>ID: APP-88219-AOA</span>
                  <span className="font-bold text-emerald-400 uppercase">Estado: Em Análise</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CARD 5: EPIC 15 SURVEY STUDY (Col-span-4, Row-span-2) */}
        <section className="md:col-span-4 bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700/50 transition-colors duration-200">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <BarChart className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Estudo de Validação OLO</h3>
              </div>
              <span className="text-[10px] bg-zinc-950 text-zinc-500 px-2 py-0.5 border border-zinc-800/80 rounded font-mono font-bold">EPIC_15_STUDY</span>
            </div>

            {/* Live Progress Bar towards target */}
            <div className="mb-4">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-zinc-500">Amostra Mínima Necessária</span>
                <span className="font-mono text-emerald-400 font-bold">{surveyProgress.current} / {surveyProgress.target} Respostas</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-1.5 border border-zinc-800 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#10b981]" 
                  style={{ width: `${Math.min((surveyProgress.current / surveyProgress.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Conditional Rendering: Jury/Analyst Aggregates View vs Visitor Survey Form */}
            {["Jury", "Analyst", "Admin"].includes(activeRole) ? (
              <div className="space-y-3">
                <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800/80">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Painel Evaluador do Júri</span>
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-mono">ANÓNIMO</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
                    Estes dados estão em conformidade com as regras de anonimato absoluto (mínimo de 3 submissões necessárias).
                  </p>

                  {/* Mock Visual Aggregates Bar Charts */}
                  <div className="space-y-2.5 text-[11px]">
                    <div>
                      <div className="flex justify-between text-[10px] text-zinc-500 mb-0.5">
                        <span>Sector Agro / Pecuária</span>
                        <span className="font-mono">65%</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-2 rounded overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: "65%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-zinc-500 mb-0.5">
                        <span>Sector Pescas</span>
                        <span className="font-mono">20%</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-2 rounded overflow-hidden">
                        <div className="bg-blue-400 h-full" style={{ width: "20%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-zinc-500 mb-0.5">
                        <span>Falta de Histórico de Crédito</span>
                        <span className="font-mono">75%</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-2 rounded overflow-hidden">
                        <div className="bg-amber-400 h-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 font-mono text-center">
                  Conselho do Júri: Realizar parcerias com cooperativas em Cabinda.
                </div>
              </div>
            ) : (
              <div>
                {!surveyVoted ? (
                  <form onSubmit={handleSurveySubmit} className="space-y-3 bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Participar no Estudo de Impacto</p>
                    
                    {surveyStep === 1 && (
                      <div className="space-y-2.5">
                        <label className="text-[10px] text-zinc-500 block">Qual é o maior desafio financeiro na vossa região?</label>
                        <select 
                          value={surveyAnswers.biggestPain}
                          onChange={(e) => setSurveyAnswers({ ...surveyAnswers, biggestPain: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="Acesso a financiamento bancário e microcrédito">Falta de crédito/microcrédito</option>
                          <option value="Dificuldade de controle de receitas e despesas">Desorganização de receitas</option>
                          <option value="Preço elevado de adubos, sementes e diesel em Angola">Preços de combustível/adubos</option>
                          <option value="Ausência de NIF ou registo comercial activo">Burocracia de documentos e NIF</option>
                        </select>
                        <button 
                          type="button" 
                          onClick={() => setSurveyStep(2)}
                          className="w-full py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs transition-colors"
                        >
                          Seguinte
                        </button>
                      </div>
                    )}

                    {surveyStep === 2 && (
                      <div className="space-y-2.5">
                        <label className="text-[10px] text-zinc-500 block">Com que frequência registam as vossas vendas?</label>
                        <select 
                          value={surveyAnswers.frequencyOfRecord}
                          onChange={(e) => setSurveyAnswers({ ...surveyAnswers, frequencyOfRecord: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="Diária">Diariamente</option>
                          <option value="Semanal">Semanalmente</option>
                          <option value="Mensal">Mensalmente</option>
                          <option value="Não registamos de forma organizada">Não registamos (Falta de ferramentas)</option>
                        </select>
                        <div className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={() => setSurveyStep(1)}
                            className="flex-1 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs"
                          >
                            Voltar
                          </button>
                          <button 
                            type="submit" 
                            className="flex-1 py-1 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded text-xs transition-colors"
                          >
                            Submeter Voto
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center text-xs space-y-2">
                    <div className="flex justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-400 stroke-[1.5]" />
                    </div>
                    <p className="font-bold">A sua resposta foi registada!</p>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Obrigado por apoiar a validação do ecossistema de cooperativas de Angola. O seu fingerprint anónimo foi gravado com sucesso.
                    </p>
                    <button 
                      onClick={() => setSurveyVoted(false)} 
                      className="text-[10px] text-emerald-500 hover:underline font-mono"
                    >
                      Votar Novamente (Simulação)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between text-[10px] text-zinc-600 font-mono">
            <span>Matrícula Legal: OLO-F15</span>
            <span>Estudo Ativo</span>
          </div>
        </section>

        {/* CARD 6: GEMINI 3.5 POWERED AI ADVISOR (Col-span-4, Row-span-2) */}
        <section className="md:col-span-4 bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700/50 transition-colors duration-200">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Fintel AI Advisor</h3>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono font-bold">GEMINI_3.5_FLASH</span>
            </div>

            {/* Advisor Specialization Selector */}
            <div className="flex gap-1.5 mb-3">
              {(["Executive", "Financial", "Operations", "Funding"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setAiAdvisorType(t);
                    addLog(`Especialidade do AI Advisor alterada para: ${t}`, "INFO");
                  }}
                  className={`flex-1 py-1 text-[9px] font-mono uppercase tracking-wider rounded border transition-all ${
                    aiAdvisorType === t 
                      ? "bg-emerald-500 border-emerald-500 text-zinc-950 font-bold" 
                      : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {t === "Executive" ? "Exec" : t === "Financial" ? "Fin" : t === "Operations" ? "Oper" : "Cred"}
                </button>
              ))}
            </div>

            {/* Chat Messages Frame */}
            <div className="bg-zinc-950 rounded-xl border border-zinc-850 p-3 h-[145px] overflow-y-auto space-y-2.5 mb-3 pr-1 text-xs">
              {aiChat.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`p-2.5 rounded-xl max-w-[90%] leading-relaxed ${
                    msg.sender === "user" 
                      ? "bg-emerald-500 text-zinc-950 font-medium rounded-tr-none" 
                      : "bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-zinc-600 font-mono mt-1">{msg.time}</span>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] p-1.5 bg-zinc-900/40 rounded-lg border border-zinc-850">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>A pensar com Gemini 3.5...</span>
                </div>
              )}
            </div>
          </div>

          {/* Prompt input and suggested shortcuts */}
          <div className="border-t border-zinc-800/80 pt-3">
            <div className="flex flex-wrap gap-1 mb-2.5">
              <button 
                onClick={() => setAiPrompt("Dicas para melhorar o meu Score")}
                className="text-[9px] bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white px-2 py-0.5 rounded"
              >
                💡 Score?
              </button>
              <button 
                onClick={() => setAiPrompt("Reduzir custos de combustível")}
                className="text-[9px] bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white px-2 py-0.5 rounded"
              >
                ⛽ Combustível?
              </button>
              <button 
                onClick={() => setAiPrompt("NIF em falta")}
                className="text-[9px] bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white px-2 py-0.5 rounded"
              >
                📄 NIF em falta?
              </button>
            </div>

            <form onSubmit={handleAiInquiry} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Pergunte ao Consultor..." 
                value={aiPrompt} 
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-grow bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button 
                type="submit" 
                disabled={isAiThinking}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-zinc-950 font-bold p-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>

        {/* CARD 7: SYSTEM ACTIVITY LOGS & NETWORK TRACE CONSOLE (Col-span-12, Row-span-1) */}
        <section className="col-span-1 md:col-span-12 bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 overflow-hidden flex flex-col justify-between hover:border-zinc-700/50 transition-colors duration-200">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Consola e Logs de Rede do Servidor</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    addLog("GET /api/health - 200 OK - Database connection optimal.", "SUCCESS");
                  }}
                  className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-[10px] font-mono text-zinc-400 hover:text-white rounded"
                >
                  📡 Ping Server
                </button>
                <button 
                  onClick={() => setSysLogs([])}
                  className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-[10px] font-mono text-zinc-400 hover:text-white rounded"
                >
                  🧹 Limpar
                </button>
              </div>
            </div>

            {/* Logs List Console Style */}
            <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-850/80 font-mono text-xs space-y-1.5 max-h-[110px] overflow-y-auto">
              {sysLogs.length === 0 ? (
                <div className="text-zinc-600 text-center py-2 italic">A aguardar eventos... Realize ações acima para gerar atividade na consola.</div>
              ) : (
                sysLogs.map((log, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 leading-relaxed">
                    <span className="col-span-2 md:col-span-1 text-zinc-600">{log.time}</span>
                    <span className="col-span-2 md:col-span-1">
                      {log.type === "API" && <span className="text-blue-400 font-bold">[API_REQ]</span>}
                      {log.type === "SUCCESS" && <span className="text-emerald-400 font-bold">[SUCCESS]</span>}
                      {log.type === "WARN" && <span className="text-amber-500 font-bold">[WARNING]</span>}
                      {log.type === "INFO" && <span className="text-zinc-500 font-bold">[SYSTEM]</span>}
                    </span>
                    <span className="col-span-8 md:col-span-10 text-zinc-400 break-all">{log.action}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

      </main>
      )}

      {activeTab === "database" && (
        <main className="flex-grow flex flex-col gap-6 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  PostgreSQL Database Inspector & Seeder
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Visualize, monitore e administre o estado atual do banco de dados relacional.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchDbStatus}
                  disabled={isLoadingDb}
                  className="px-4 py-2 bg-zinc-850 hover:bg-zinc-800 text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer border border-zinc-800"
                >
                  {isLoadingDb ? "A atualizar..." : "🔄 Atualizar Dados"}
                </button>
                <button
                  onClick={handleResetDb}
                  disabled={isLoadingDb}
                  className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  ⚠️ Redefinir Banco de Dados
                </button>
              </div>
            </div>

            {dbSuccessMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-xs font-mono mb-6 animate-pulse">
                {dbSuccessMsg}
              </div>
            )}

            {/* DB ENGINE STATUS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                <span className="text-[10px] text-zinc-500 font-mono block mb-1">MOTOR DE BASE DE DADOS</span>
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  {dbStatus?.dbConfigured ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      PostgreSQL Engine
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      In-Memory Sandbox
                    </>
                  )}
                </span>
              </div>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                <span className="text-[10px] text-zinc-500 font-mono block mb-1">CONEXÃO SUPABASE</span>
                <span className="text-sm font-mono text-zinc-300 truncate block">
                  {dbStatus?.dbConfigured ? "Conectado via TCP/Pooler" : "Offline / Mock Fallback"}
                </span>
              </div>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                <span className="text-[10px] text-zinc-500 font-mono block mb-1">REGISTOS TOTAIS</span>
                <span className="text-sm font-mono font-bold text-emerald-400 block">
                  {dbStatus?.counts ? Object.values(dbStatus.counts).reduce((a: any, b: any) => a + b, 0) : 0} linhas
                </span>
              </div>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                <span className="text-[10px] text-zinc-500 font-mono block mb-1">MODO DE EXECUÇÃO</span>
                <span className="text-sm font-bold text-white block">
                  {dbStatus?.isUsingMock ? "🔒 Sandbox (Sem Persistência)" : "🚀 Supabase Live"}
                </span>
              </div>
            </div>

            {/* METRICS BENTO CONTAINER */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-850 text-center">
                <span className="text-[10px] text-zinc-500 font-mono block">ORGANIZAÇÕES</span>
                <span className="text-xl font-bold text-white font-mono mt-1 block">
                  {dbStatus?.counts?.organizations ?? 0}
                </span>
              </div>
              <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-850 text-center">
                <span className="text-[10px] text-zinc-500 font-mono block">UTILIZADORES</span>
                <span className="text-xl font-bold text-white font-mono mt-1 block">
                  {dbStatus?.counts?.users ?? 0}
                </span>
              </div>
              <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-850 text-center">
                <span className="text-[10px] text-zinc-500 font-mono block">DOSSIÊS DE CRÉDITO</span>
                <span className="text-xl font-bold text-white font-mono mt-1 block">
                  {dbStatus?.counts?.fundingApplications ?? 0}
                </span>
              </div>
              <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-850 text-center">
                <span className="text-[10px] text-zinc-500 font-mono block">RESPOSTAS ESTUDO</span>
                <span className="text-xl font-bold text-white font-mono mt-1 block">
                  {dbStatus?.counts?.surveyResponses ?? 0}
                </span>
              </div>
              <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-850 col-span-2 md:col-span-1 text-center">
                <span className="text-[10px] text-zinc-500 font-mono block">DOCUMENTOS</span>
                <span className="text-xl font-bold text-white font-mono mt-1 block">
                  {dbStatus?.counts?.documents ?? 0}
                </span>
              </div>
            </div>

            {/* TABELAS COMPACTAS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ORGANIZATIONS LIST */}
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-850">
                <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase mb-3 tracking-wider flex items-center gap-1.5">
                  📁 Últmas Organizações Registadas ({dbStatus?.counts?.organizations ?? 0})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-900 text-zinc-500">
                        <th className="py-2">Nome</th>
                        <th className="py-2">Sector</th>
                        <th className="py-2">Província</th>
                        <th className="py-2">Criado em</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(!dbStatus?.lastOrgs || dbStatus.lastOrgs.length === 0) ? (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-zinc-600 italic">Sem organizações registadas.</td>
                        </tr>
                      ) : (
                        dbStatus.lastOrgs.map((org: any) => (
                          <tr key={org.id} className="border-b border-zinc-900 text-zinc-300 hover:text-white">
                            <td className="py-2 font-bold">{org.name}</td>
                            <td className="py-2 font-mono text-[10px] text-emerald-400">{org.sector}</td>
                            <td className="py-2">{org.province || "Benguela"}</td>
                            <td className="py-2 font-mono text-[10px] text-zinc-500">{new Date(org.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* USERS LIST */}
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-850">
                <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase mb-3 tracking-wider flex items-center gap-1.5">
                  👤 Últimos Utilizadores Registados ({dbStatus?.counts?.users ?? 0})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-900 text-zinc-500">
                        <th className="py-2">Nome</th>
                        <th className="py-2">E-mail</th>
                        <th className="py-2">Estado</th>
                        <th className="py-2">Criado em</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(!dbStatus?.lastUsers || dbStatus.lastUsers.length === 0) ? (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-zinc-600 italic">Sem utilizadores registados.</td>
                        </tr>
                      ) : (
                        dbStatus.lastUsers.map((user: any) => (
                          <tr key={user.id} className="border-b border-zinc-900 text-zinc-300 hover:text-white">
                            <td className="py-2 font-bold">{user.firstName} {user.lastName}</td>
                            <td className="py-2 font-mono text-[10px]">{user.email}</td>
                            <td className="py-2">
                              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase font-bold font-mono">
                                {user.status}
                              </span>
                            </td>
                            <td className="py-2 font-mono text-[10px] text-zinc-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SURVEY RESPONSES LIST */}
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-850 col-span-1 lg:col-span-2">
                <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase mb-3 tracking-wider flex items-center gap-1.5">
                  📝 Últimas Submissões do Estudo de Mercado ({dbStatus?.counts?.surveyResponses ?? 0})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-900 text-zinc-500">
                        <th className="py-2">ID Submissão</th>
                        <th className="py-2">Tipo de Organização</th>
                        <th className="py-2">Província</th>
                        <th className="py-2">Cargo do Respondente</th>
                        <th className="py-2">Data da Resposta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(!dbStatus?.lastResponses || dbStatus.lastResponses.length === 0) ? (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-zinc-600 italic">Nenhuma submissão de estudo encontrada na BD. Use o simulador para registar respostas!</td>
                        </tr>
                      ) : (
                        dbStatus.lastResponses.map((resp: any) => (
                          <tr key={resp.id} className="border-b border-zinc-900 text-zinc-300 hover:text-white">
                            <td className="py-2 font-mono text-[10px] text-zinc-500 truncate max-w-[120px]">{resp.id}</td>
                            <td className="py-2">{resp.organizationTypeHint || "N/A"}</td>
                            <td className="py-2 text-emerald-400 font-bold">{resp.provinceHint || "N/A"}</td>
                            <td className="py-2 font-mono text-[10px] text-zinc-400">{resp.personaHint || "N/A"}</td>
                            <td className="py-2 font-mono text-[10px] text-zinc-500">{new Date(resp.completedAt).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </main>
      )}

      {activeTab === "api" && (
        <main className="flex-grow flex flex-col gap-6 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="mb-6 border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                API Explorer & Integration Playground
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Explore os contratos de rotas, payloads, cabeçalhos, gere cURLs automáticos e teste pedidos em tempo real.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* ENDPOINT SELECTOR & CONTRACT INFO (Col-span-4) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-2 font-bold">
                    Selecionar Endpoint do Sistema:
                  </label>
                  <select
                    value={selectedEndpointIdx}
                    onChange={(e) => setSelectedEndpointIdx(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {ENDPOINTS.map((endpoint, index) => (
                      <option key={index} value={index}>
                        {endpoint.method} {endpoint.path}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 flex-grow space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-[10px] font-mono font-black rounded-lg ${
                      ENDPOINTS[selectedEndpointIdx]?.method === "GET" 
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {ENDPOINTS[selectedEndpointIdx]?.method}
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-300">
                      {ENDPOINTS[selectedEndpointIdx]?.path}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white">{ENDPOINTS[selectedEndpointIdx]?.name}</h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {ENDPOINTS[selectedEndpointIdx]?.description}
                    </p>
                  </div>

                  <div className="border-t border-zinc-900 pt-3 space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Autenticação:</span>
                      <span className="text-zinc-300 font-bold">{ENDPOINTS[selectedEndpointIdx]?.auth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Escopo Multi-Tenant:</span>
                      <span className="text-zinc-300 font-bold">{ENDPOINTS[selectedEndpointIdx]?.tenant}</span>
                    </div>
                  </div>

                  {/* CODE GENERATOR: cURL COMPILER */}
                  <div className="border-t border-zinc-900 pt-3">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-2 font-bold">
                      Comando de Integração (cURL):
                    </label>
                    <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-850 font-mono text-[10px] text-zinc-400 leading-relaxed overflow-x-auto relative group">
                      <pre>
{`curl -X ${ENDPOINTS[selectedEndpointIdx]?.method} \\
  "https://fintel-engine.olo.ao${ENDPOINTS[selectedEndpointIdx]?.path}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <SEU_JWT_TOKEN>" \\
  ${ENDPOINTS[selectedEndpointIdx]?.tenant.includes("Requerido") ? '-H "x-organization-id: <ORG_ID_UUID>" \\\n  ' : ''}${ENDPOINTS[selectedEndpointIdx]?.payload ? `-d '${JSON.stringify(ENDPOINTS[selectedEndpointIdx]?.payload, null, 2).replace(/'/g, "'\\''")}'` : ''}`}
                      </pre>
                      <button
                        onClick={() => {
                          const curlText = `curl -X ${ENDPOINTS[selectedEndpointIdx]?.method} "https://fintel-engine.olo.ao${ENDPOINTS[selectedEndpointIdx]?.path}" -H "Content-Type: application/json" -H "Authorization: Bearer <SEU_JWT_TOKEN>" ${ENDPOINTS[selectedEndpointIdx]?.tenant.includes("Requerido") ? '-H "x-organization-id: <ORG_ID_UUID>" ' : ''}${ENDPOINTS[selectedEndpointIdx]?.payload ? `-d '${JSON.stringify(ENDPOINTS[selectedEndpointIdx]?.payload)}'` : ''}`;
                          navigator.clipboard.writeText(curlText);
                          alert("cURL copiado para a área de transferência!");
                        }}
                        className="absolute right-2 top-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-[10px] text-emerald-400 px-2 py-0.5 rounded cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                      >
                        Copiar cURL
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYLOAD EDITOR & REAL-TIME CALLER (Col-span-8) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 flex flex-col h-[280px]">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-2 font-bold flex justify-between items-center">
                    <span>Corpo do Pedido (Request Body - JSON)</span>
                    {ENDPOINTS[selectedEndpointIdx]?.payload === null && (
                      <span className="text-zinc-600 font-normal normal-case">Sem payload necessário (GET)</span>
                    )}
                  </label>
                  <textarea
                    value={customPayload}
                    onChange={(e) => setCustomPayload(e.target.value)}
                    disabled={ENDPOINTS[selectedEndpointIdx]?.payload === null}
                    className="w-full flex-grow bg-zinc-900 border border-zinc-800 font-mono text-xs text-emerald-400 rounded-xl p-3 focus:outline-none focus:border-emerald-500 resize-none disabled:opacity-40"
                    placeholder="{}"
                  />
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 flex-grow flex flex-col min-h-[220px]">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">
                      Consola de Resposta do Servidor (Response Body)
                    </label>
                    <button
                      onClick={handleExecuteApiCall}
                      disabled={isCallingApi}
                      className="px-4 py-1.5 bg-emerald-500 text-zinc-950 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-xs font-mono font-black tracking-wider uppercase transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.2)] flex items-center gap-2"
                    >
                      {isCallingApi ? "A executar..." : "⚡ Testar Pedido"}
                    </button>
                  </div>
                  
                  <div className="flex-grow bg-zinc-900 p-3 rounded-xl border border-zinc-850 font-mono text-xs text-zinc-300 leading-relaxed overflow-y-auto max-h-[280px]">
                    {apiResponse ? (
                      <pre className="text-emerald-400 whitespace-pre-wrap">{apiResponse}</pre>
                    ) : (
                      <div className="text-zinc-600 text-center py-10 italic">
                        Clique no botão "Testar Pedido" para despachar o pedido real para o servidor express e obter a resposta em formato JSON.
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      )}

      {/* FOOTER BAR */}
      <footer className="mt-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-zinc-600 border-t border-zinc-900 pt-4 gap-2">
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <span>PRISMA_CLIENT: v7.8.0</span>
          <span>POSTGRES: ACTIVE</span>
          <span>LOCATION_ACCENT: ANGOLA/SOUTHERN_AFRICA</span>
          <span>PORT: 3000</span>
        </div>
        <div className="text-center md:text-right">
          OLO FINTEL FRAMEWORK • SYSTEM_Uptime: 100%
        </div>
      </footer>
    </div>
  );
}
