import "./src/db/env.ts";
import { db, getIsDbConfigured, getIsUsingMock } from "./src/db/client.ts";
import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { swaggerDocument } from "./src/server/swagger.ts";

// Middleware
import { requireAuth, requireRoles, injectTenant } from "./src/server/middleware/auth.ts";

// Controllers
import { register, login, refresh, logout, updateProfile, me } from "./src/server/controllers/authController.ts";
import { getActiveSurvey, submitResponse, getSurveyStatistics, getJuryDashboard } from "./src/server/controllers/surveyController.ts";
import { getPublicPlatformMetrics, getExecutiveDashboard } from "./src/server/controllers/dashboardController.ts";
import {
  createFarm,
  getFarms,
  createHarvest,
  getHarvests,
  registerAnimal,
  getAnimals,
  registerVessel,
  getVessels,
  recordCatch,
  createProduct,
  getProducts,
  getUnifiedOperations,
  addUnifiedOperation
} from "./src/server/controllers/operationsController.ts";
import {
  createAccount,
  getAccounts,
  createRevenue,
  getRevenues,
  createExpense,
  getExpenses,
  getCashFlow
} from "./src/server/controllers/financeController.ts";
import { uploadDocument, getDocuments, reviewDocument } from "./src/server/controllers/documentController.ts";
import {
  calculateAndGetScore,
  submitApplication,
  getApplications,
  getAnalystApplications,
  reviewApplication
} from "./src/server/controllers/fundingController.ts";
import { askAdvisor, getRecommendations, getActionPlan } from "./src/server/controllers/aiController.ts";
import { getNotifications, markAsRead, markAllAsRead, createNotification } from "./src/server/controllers/notificationController.ts";
import {
  getOrganizations,
  getUsers,
  getConsultants,
  getAdminDocuments,
  documentAction,
  delegateConsultant,
  suspendOrganization
} from "./src/server/controllers/adminController.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global parsing middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Enable CORS for external frontend (Vercel) & local development
  const allowedOrigins = [
    "https://olofintel.vercel.app",
    "https://olofintel.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000",
  ];
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
  
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-side calls)
      if (!origin || allowedOrigins.includes(origin) || origin.includes(".run.app") || origin.includes("localhost") || origin.includes("127.0.0.1")) {
        callback(null, true);
      } else {
        callback(new Error(`Bloqueado por política CORS: Origem '${origin}' não autorizada.`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-organization-id"]
  }));

  // Swagger Documentation
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // ==========================================
  // PUBLIC & LANDING PAGE ENDPOINTS
  // ==========================================
  app.get("/api/v1/public/platform-metrics", getPublicPlatformMetrics);
  app.get("/api/v1/surveys/active", getActiveSurvey);
  app.post("/api/v1/surveys/responses", submitResponse);
  app.get("/api/v1/surveys/statistics", getSurveyStatistics);

  // ==========================================
  // AUTHENTICATION ENDPOINTS
  // ==========================================
  app.post("/api/v1/auth/register", register);
  app.post("/api/v1/auth/login", login);
  app.post("/api/v1/auth/refresh", refresh);
  app.post("/api/v1/auth/logout", logout);
  app.get("/api/v1/auth/me", requireAuth, me);
  
  // ==========================================
  // SECURED MULTI-TENANT ROUTES (requireAuth)
  // ==========================================
  
  // User Profile
  app.post("/api/v1/auth/profile/update", requireAuth, updateProfile);
  
  // Dashboard
  app.get("/api/v1/dashboard", requireAuth, injectTenant, getExecutiveDashboard);

  // Operations - Agriculture
  app.post("/api/v1/operations/agriculture/farms", requireAuth, injectTenant, createFarm);
  app.get("/api/v1/operations/agriculture/farms", requireAuth, injectTenant, getFarms);
  app.post("/api/v1/operations/agriculture/harvests", requireAuth, injectTenant, createHarvest);
  app.get("/api/v1/operations/agriculture/harvests", requireAuth, injectTenant, getHarvests);

  // Operations - Livestock
  app.post("/api/v1/operations/livestock/animals", requireAuth, injectTenant, registerAnimal);
  app.get("/api/v1/operations/livestock/animals", requireAuth, injectTenant, getAnimals);

  // Operations - Fisheries
  app.post("/api/v1/operations/fisheries/vessels", requireAuth, injectTenant, registerVessel);
  app.get("/api/v1/operations/fisheries/vessels", requireAuth, injectTenant, getVessels);
  app.post("/api/v1/operations/fisheries/catches", requireAuth, injectTenant, recordCatch);

  // Operations - Commerce
  app.post("/api/v1/operations/commerce/products", requireAuth, injectTenant, createProduct);
  app.get("/api/v1/operations/commerce/products", requireAuth, injectTenant, getProducts);

  // Operations - Unified
  app.get("/api/v1/operations/list", requireAuth, injectTenant, getUnifiedOperations);
  app.post("/api/v1/operations/add", requireAuth, injectTenant, addUnifiedOperation);

  // Finance Module
  app.post("/api/v1/finance/accounts", requireAuth, injectTenant, createAccount);
  app.get("/api/v1/finance/accounts", requireAuth, injectTenant, getAccounts);
  app.post("/api/v1/finance/revenues", requireAuth, injectTenant, createRevenue);
  app.get("/api/v1/finance/revenues", requireAuth, injectTenant, getRevenues);
  app.post("/api/v1/finance/expenses", requireAuth, injectTenant, createExpense);
  app.get("/api/v1/finance/expenses", requireAuth, injectTenant, getExpenses);
  app.get("/api/v1/finance/cashflow", requireAuth, injectTenant, getCashFlow);

  // Documents Module
  app.post("/api/v1/documents", requireAuth, injectTenant, uploadDocument);
  app.get("/api/v1/documents", requireAuth, injectTenant, getDocuments);

  // Funding Scores & Applications
  app.get("/api/v1/funding/score", requireAuth, injectTenant, calculateAndGetScore);
  app.post("/api/v1/funding/applications", requireAuth, injectTenant, submitApplication);
  app.get("/api/v1/funding/applications", requireAuth, injectTenant, getApplications);

  // AI Advisor Endpoints
  app.post("/api/v1/ai/chat", requireAuth, injectTenant, askAdvisor);
  app.get("/api/v1/ai/recommendations", requireAuth, injectTenant, getRecommendations);
  app.get("/api/v1/ai/action-plan", requireAuth, injectTenant, getActionPlan);

  // Notifications Endpoints
  app.get("/api/v1/notifications", requireAuth, getNotifications);
  app.patch("/api/v1/notifications/read-all", requireAuth, markAllAsRead);
  app.patch("/api/v1/notifications/:id/read", requireAuth, markAsRead);
  app.post("/api/v1/notifications", requireAuth, createNotification);

  // ==========================================
  // ROLE GATED PORTALS (Analyst / Jury / Admin)
  // ==========================================
  
  // Jury Dashboard for studying surveys
  app.get(
    "/api/v1/surveys/jury-dashboard", 
    requireAuth, 
    requireRoles(["Jury", "Admin", "Analyst"]), 
    getJuryDashboard
  );

  // Analyst Portal (Document Review & Funding applications)
  app.put(
    "/api/v1/documents/:id/review", 
    requireAuth, 
    requireRoles(["Analyst", "Admin"]), 
    reviewDocument
  );
  app.get(
    "/api/v1/analyst/applications", 
    requireAuth, 
    requireRoles(["Analyst", "Admin"]), 
    getAnalystApplications
  );
  app.put(
    "/api/v1/analyst/applications/:id/review", 
    requireAuth, 
    requireRoles(["Analyst", "Admin"]), 
    reviewApplication
  );

  // ==========================================
  // ADMIN PORTAL (requireAuth + requireRoles)
  // ==========================================
  app.get("/api/v1/admin/organizations", requireAuth, requireRoles(["Admin", "Analyst"]), getOrganizations);
  app.get("/api/v1/admin/users", requireAuth, requireRoles(["Admin", "Analyst"]), getUsers);
  app.get("/api/v1/admin/consultants", requireAuth, requireRoles(["Admin"]), getConsultants);
  app.get("/api/v1/admin/documents", requireAuth, requireRoles(["Admin", "Analyst"]), getAdminDocuments);
  app.post("/api/v1/admin/document-action", requireAuth, requireRoles(["Admin", "Analyst"]), documentAction);
  app.post("/api/v1/admin/delegate", requireAuth, requireRoles(["Admin"]), delegateConsultant);
  app.post("/api/v1/admin/suspend", requireAuth, requireRoles(["Admin"]), suspendOrganization);

  // Healthcheck Route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
  });

  // ==========================================
  // ADMIN/DEVELOPER UTILITIES & DB VISUALIZER
  // ==========================================
  app.get("/api/v1/admin/db-status", requireAuth, requireRoles(["ADMIN"]), async (req, res) => {
    try {
      const counts = {
        organizations: await db.organization.count().catch(() => 0),
        users: await db.user.count().catch(() => 0),
        farms: await db.farm.count().catch(() => 0),
        animals: await db.animal.count().catch(() => 0),
        vessels: await db.vessel.count().catch(() => 0),
        products: await db.product.count().catch(() => 0),
        transactions: await db.transaction.count().catch(() => 0),
        documents: await db.document.count().catch(() => 0),
        fundingApplications: await db.fundingApplication.count().catch(() => 0),
        surveys: await db.survey.count().catch(() => 0),
        surveyResponses: await db.surveyResponse.count().catch(() => 0),
      };

      const lastUsers = await db.user.findMany({
        take: 15,
        orderBy: { createdAt: "desc" },
        select: { id: true, firstName: true, lastName: true, email: true, status: true, createdAt: true }
      }).catch(() => []);

      const lastOrgs = await db.organization.findMany({
        take: 15,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, sector: true, province: true, status: true, createdAt: true }
      }).catch(() => []);

      const lastResponses = await db.surveyResponse.findMany({
        take: 15,
        orderBy: { completedAt: "desc" }
      }).catch(() => []);

      const lastApplications = await db.fundingApplication.findMany({
        take: 15,
        orderBy: { createdAt: "desc" }
      }).catch(() => []);

      res.json({
        success: true,
        engine: "OLO Fintel Administrative Console",
        dbConfigured: getIsDbConfigured(),
        isUsingMock: getIsUsingMock(),
        databaseUrl: process.env.DATABASE_URL ? "postgresql://postgres.zxtvhwrqxeychyehqcqv:colege@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true" : "Not Defined",
        counts,
        lastUsers,
        lastOrgs,
        lastResponses,
        lastApplications,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/v1/admin/db-reset", requireAuth, requireRoles(["Admin"]), async (req, res) => {
    try {
      
      if (!getIsUsingMock()) {
        // Safe delete cascade or deletion of dependants first
        await db.surveyAnswer.deleteMany().catch(() => {});
        await db.surveyResponse.deleteMany().catch(() => {});
        await db.document.deleteMany().catch(() => {});
        await db.fundingApplication.deleteMany().catch(() => {});
        await db.transaction.deleteMany().catch(() => {});
        await db.product.deleteMany().catch(() => {});
        await db.animal.deleteMany().catch(() => {});
        await db.vessel.deleteMany().catch(() => {});
        await db.farm.deleteMany().catch(() => {});
        await db.organizationMembership.deleteMany().catch(() => {});
        await db.organizationSettings.deleteMany().catch(() => {});
        await db.organizationProfile.deleteMany().catch(() => {});
        await db.fundingProfile.deleteMany().catch(() => {});
        await db.session.deleteMany().catch(() => {});
        await db.user.deleteMany().catch(() => {});
        await db.organization.deleteMany().catch(() => {});
        
        // Seed standard survey
        await db.survey.upsert({
          where: { id: "default-survey-id" },
          update: {},
          create: {
            id: "default-survey-id",
            title: "Estudo Nacional de PMEs e Cooperativas",
            description: "Estudo para validação de dores operacionais e financeiras de organizações produtivas africanas.",
            goalCount: 100,
            status: "Open",
          }
        });

        await db.surveyQuestion.upsert({
          where: { id: "q-sector" },
          update: {},
          create: {
            id: "q-sector",
            surveyId: "default-survey-id",
            order: 1,
            type: "single_choice",
            text: "Qual é o setor principal da sua organização?",
            options: ["Agricultura", "Pecuária", "Pesca", "Comércio", "Outro"]
          }
        });
      } else {
        // Clear InMemory store
        // @ts-ignore
        if (db.store) {
          // @ts-ignore
          db.store = {
            users: [],
            organizations: [],
            organizationProfiles: [],
            organizationSettings: [],
            memberships: [],
            farms: [],
            plots: [],
            crops: [],
            plantings: [],
            harvests: [],
            inputs: [],
            inputUsages: [],
            equipments: [],
            maintenances: [],
            weatherRecords: [],
            animals: [],
            vaccinations: [],
            treatments: [],
            feedRecords: [],
            weightRecords: [],
            vessels: [],
            trips: [],
            catches: [],
            products: [],
            inventories: [],
            inventoryMovements: [],
            leads: [],
            opportunities: [],
            customers: [],
            suppliers: [],
            contracts: [],
            tasks: [],
            accounts: [],
            revenues: [],
            expenses: [],
            transactions: [],
            budgets: [],
            forecasts: [],
            documents: [],
            documentVersions: [],
            fundingProfiles: [],
            fundingScores: [],
            fundingChecklists: [],
            fundingApplications: [],
            fundingReviews: [],
            metrics: [],
            kpis: [],
            benchmarks: [],
            conversations: [],
            messages: [],
            recommendations: [],
            insights: [],
            actionPlans: [],
            surveys: [],
            surveyQuestions: [],
            surveyResponses: [],
            surveyAnswers: [],
            notifications: [],
            auditLogs: [],
            files: []
          };
          // @ts-ignore
          db.seedDefaults();
        }
      }

      res.json({ success: true, message: "Base de dados redefinida e sincronizada com sucesso!" });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Global Error Handler for API routes (Prevents Express from rendering HTML on server errors/CORS issues)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[Global Error Handler] Caught exception:", err);
    res.status(res.statusCode === 200 || res.statusCode === 304 ? 500 : res.statusCode).json({
      success: false,
      error: err.message || "Erro interno de processamento no servidor."
    });
  });

  // ==========================================
  // VITE STATIC OR DEV MIDDLEWARE
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode serving static build assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OLO Fintel Engine] running on http://localhost:${PORT}`);
    console.log(`[OLO Fintel Engine] Swagger documentation active at http://localhost:${PORT}/api/docs`);
  });
}

startServer();
