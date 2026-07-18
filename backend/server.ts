import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { createServer as createViteServer } from "vite";
import { swaggerDocument } from "./src/server/swagger.ts";

// Middleware
import { requireAuth, requireRoles, injectTenant } from "./src/server/middleware/auth.ts";

// Controllers
import { register, login, refresh, logout } from "./src/server/controllers/authController.ts";
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
  getProducts
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global parsing middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  // ==========================================
  // SECURED MULTI-TENANT ROUTES (requireAuth)
  // ==========================================
  
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

  // Healthcheck Route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
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
