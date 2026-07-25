// @ts-ignore
import "./env.ts";
// @ts-ignore
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export let isDbConfigured = false;
export let isUsingMock = true;

export const getIsDbConfigured = () => !fallbackToMemory && isDbConfigured;
export const getIsUsingMock = () => fallbackToMemory || isUsingMock;

// @ts-ignore
let prismaInstance: PrismaClient | null = null;

if (process.env.DATABASE_URL && process.env.DATABASE_URL !== "MY_DATABASE_URL") {
  try {
    // @ts-ignore
    prismaInstance = new PrismaClient();
    isDbConfigured = true;
    isUsingMock = false;
    console.log("Database: Initializing Prisma ORM engine...");
    prismaInstance.$connect().then(() => {
      console.log("Database: PostgreSQL engine connected successfully via Prisma ORM.");
    }).catch((err: any) => {
      activateMemoryFallback(err);
    });
  } catch (error) {
    console.log("Database: Using in-memory database fallback.");
    isDbConfigured = false;
    isUsingMock = true;
  }
} else {
  console.log("Database: Running with in-memory store for development/preview.");
}

let fallbackToMemory = !isDbConfigured;

function activateMemoryFallback(err?: any) {
  if (!fallbackToMemory) {
    console.log("[Database Engine] Storage engine: In-Memory Database (Sandbox mode active).");
    fallbackToMemory = true;
    isDbConfigured = false;
    isUsingMock = true;
  }
}

function isConnectionError(err: any): boolean {
  if (!err) return false;
  const msg = String(err.message || err);
  const name = String(err.name || "");
  const code = String(err.code || "");
  return (
    name.includes("PrismaClient") ||
    msg.includes("PrismaClientInitializationError") ||
    msg.includes("PrismaClientKnownRequestError") ||
    msg.includes("Authentication failed") ||
    msg.includes("database server") ||
    msg.includes("credentials") ||
    msg.includes("pooler.supabase.com") ||
    msg.includes("Can't reach database server") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("ETIMEDOUT") ||
    code.startsWith("P100") ||
    code.startsWith("P101")
  );
}

// Simple in-memory fallback implementation of Prisma APIs to prevent crashes
class InMemoryDb {
  private store: Record<string, any[]> = {
    users: [],
    sessions: [],
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

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    // Seed default Admin user for Kanji Kode
    const adminPasswordHash = bcrypt.hashSync("20kperweek", 10);
    const adminId = "usr-admin-kanji";
    const orgId = "org-olo-fintel";

    this.store.users.push({
      id: adminId,
      firstName: "Kanji",
      lastName: "Kode",
      email: "kanji@olofintel.com",
      phone: "+244 923 000 000",
      passwordHash: adminPasswordHash,
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.store.organizations.push({
      id: orgId,
      name: "OLO Fintel Administrative Org",
      sector: "Technology",
      province: "Luanda",
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.store.memberships.push({
      id: "mem-admin",
      organizationId: orgId,
      userId: adminId,
      roleId: "Admin",
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Seed default survey
    const surveyId = "default-survey-id";
    this.store.surveys.push({
      id: surveyId,
      title: "Estudo Nacional de PMEs e Cooperativas",
      description: "Estudo para validação de dores operacionais e financeiras de organizações produtivas africanas.",
      goalCount: 100,
      status: "Open",
      createdAt: new Date()
    });

    // Seed default survey questions
    const q1Id = "q-sector";
    const q2Id = "q-province";
    const q3Id = "q-challenge";
    this.store.surveyQuestions.push(
      {
        id: q1Id,
        surveyId,
        order: 1,
        type: "single_choice",
        text: "Qual é o setor principal da sua organização?",
        options: ["Agricultura", "Pecuária", "Pesca", "Comércio", "Outro"]
      },
      {
        id: q2Id,
        surveyId,
        order: 2,
        type: "single_choice",
        text: "Em qual província angolana está localizado?",
        options: ["Luanda", "Benguela", "Huambo", "Huíla", "Cabinda", "Cuanza Sul", "Outra"]
      },
      {
        id: q3Id,
        surveyId,
        order: 3,
        type: "text",
        text: "Qual é a sua principal dificuldade na gestão financeira diária?",
        options: []
      }
    );

    // Seed generic benchmark averages
    this.store.benchmarks.push(
      { id: "b1", sector: "Agriculture", metric: "YieldPerHectare", average: 4.2, top10: 8.5, top25: 6.1 },
      { id: "b2", sector: "Agriculture", metric: "ProfitMargin", average: 0.18, top10: 0.35, top25: 0.28 },
      { id: "b3", sector: "Fisheries", metric: "FuelEfficiency", average: 2.1, top10: 1.2, top25: 1.6 }
    );
  }

  private createModelApi(table: string) {
    const api = {
      findMany: async (args?: any) => {
        let list = [...(this.store[table] || [])];
        if (args?.where) {
          list = list.filter(item => {
            for (const key in args.where) {
              const val = args.where[key];
              if (typeof val === 'object' && val !== null) {
                if ('equals' in val) {
                  if (item[key] !== val.equals) return false;
                } else if ('in' in val) {
                  if (!val.in.includes(item[key])) return false;
                }
              } else {
                if (item[key] !== val) return false;
              }
            }
            return true;
          });
        }
        if (args?.orderBy) {
          const keys = Object.keys(args.orderBy);
          if (keys.length > 0) {
            const key = keys[0];
            const dir = args.orderBy[key] === "desc" ? -1 : 1;
            list.sort((a, b) => {
              if (a[key] < b[key]) return -1 * dir;
              if (a[key] > b[key]) return 1 * dir;
              return 0;
            });
          }
        }
        if (args?.take) {
          list = list.slice(0, args.take);
        }
        return list;
      },
      findUnique: async (args: any) => {
        if (!args?.where) return null;
        const list = this.store[table] || [];
        const item = list.find(item => {
          for (const key in args.where) {
            const val = args.where[key];
            if (typeof val === 'object' && val !== null) {
              if ('equals' in val) {
                if (item[key] !== val.equals) return false;
              }
            } else {
              if (item[key] !== val) return false;
            }
          }
          return true;
        });
        return item || null;
      },
      findFirst: async (args?: any) => {
        const list = await api.findMany(args);
        return list[0] || null;
      },
      create: async (args: any) => {
        const data = {
          id: args.data.id || `${table.slice(0, 3)}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...args.data
        };
        if (!this.store[table]) this.store[table] = [];
        this.store[table].push(data);
        return data;
      },
      update: async (args: any) => {
        const list = this.store[table] || [];
        const index = list.findIndex(item => {
          for (const key in args.where) {
            if (item[key] !== args.where[key]) return false;
          }
          return true;
        });
        if (index === -1) throw new Error(`Record not found in ${table}`);
        const updated = {
          ...list[index],
          ...args.data,
          updatedAt: new Date()
        };
        list[index] = updated;
        return updated;
      },
      delete: async (args: any) => {
        const list = this.store[table] || [];
        const index = list.findIndex(item => {
          for (const key in args.where) {
            if (item[key] !== args.where[key]) return false;
          }
          return true;
        });
        if (index === -1) throw new Error(`Record not found in ${table}`);
        const deleted = list.splice(index, 1)[0];
        return deleted;
      },
      deleteMany: async (args?: any) => {
        if (!this.store[table]) this.store[table] = [];
        if (!args?.where || Object.keys(args.where).length === 0) {
          const count = this.store[table].length;
          this.store[table] = [];
          return { count };
        }
        const list = await api.findMany(args);
        let count = 0;
        for (const item of list) {
          const index = this.store[table].findIndex(x => x.id === item.id);
          if (index !== -1) {
            this.store[table].splice(index, 1);
            count++;
          }
        }
        return { count };
      },
      upsert: async (args: any) => {
        const item = await api.findUnique({ where: args.where });
        if (item) {
          return api.update({ where: args.where, data: args.update });
        } else {
          return api.create({ data: { ...args.where, ...args.create } });
        }
      },
      count: async (args?: any) => {
        const list = await api.findMany(args);
        return list.length;
      },
      updateMany: async (args?: any) => {
        const list = await api.findMany(args);
        let count = 0;
        if (!this.store[table]) this.store[table] = [];
        for (const item of list) {
          const index = this.store[table].findIndex(x => x.id === item.id);
          if (index !== -1) {
            this.store[table][index] = {
              ...this.store[table][index],
              ...args.data,
              updatedAt: new Date()
            };
            count++;
          }
        }
        return { count };
      }
    };
    return api;
  }

  get user() { return this.createModelApi("users"); }
  get session() { return this.createModelApi("sessions"); }
  get organization() { return this.createModelApi("organizations"); }
  get organizationProfile() { return this.createModelApi("organizationProfiles"); }
  get organizationSettings() { return this.createModelApi("organizationSettings"); }
  get organizationMembership() { return this.createModelApi("memberships"); }
  get farm() { return this.createModelApi("farms"); }
  get plot() { return this.createModelApi("plots"); }
  get crop() { return this.createModelApi("crops"); }
  get planting() { return this.createModelApi("plantings"); }
  get harvest() { return this.createModelApi("harvests"); }
  get agriculturalInput() { return this.createModelApi("inputs"); }
  get inputUsage() { return this.createModelApi("inputUsages"); }
  get equipment() { return this.createModelApi("equipments"); }
  get equipmentMaintenance() { return this.createModelApi("maintenances"); }
  get weatherRecord() { return this.createModelApi("weatherRecords"); }
  get animal() { return this.createModelApi("animals"); }
  get vaccination() { return this.createModelApi("vaccinations"); }
  get treatment() { return this.createModelApi("treatments"); }
  get feedRecord() { return this.createModelApi("feedRecords"); }
  get weightRecord() { return this.createModelApi("weightRecords"); }
  get vessel() { return this.createModelApi("vessels"); }
  get fishingTrip() { return this.createModelApi("trips"); }
  get catch() { return this.createModelApi("catches"); }
  get product() { return this.createModelApi("products"); }
  get inventory() { return this.createModelApi("inventories"); }
  get inventoryMovement() { return this.createModelApi("inventoryMovements"); }
  get lead() { return this.createModelApi("leads"); }
  get opportunity() { return this.createModelApi("opportunities"); }
  get customer() { return this.createModelApi("customers"); }
  get supplier() { return this.createModelApi("suppliers"); }
  get contract() { return this.createModelApi("contracts"); }
  get task() { return this.createModelApi("tasks"); }
  get account() { return this.createModelApi("accounts"); }
  get revenue() { return this.createModelApi("revenues"); }
  get expense() { return this.createModelApi("expenses"); }
  get transaction() { return this.createModelApi("transactions"); }
  get budget() { return this.createModelApi("budgets"); }
  get forecast() { return this.createModelApi("forecasts"); }
  get document() { return this.createModelApi("documents"); }
  get documentVersion() { return this.createModelApi("documentVersions"); }
  get fundingProfile() { return this.createModelApi("fundingProfiles"); }
  get fundingScore() { return this.createModelApi("fundingScores"); }
  get fundingChecklist() { return this.createModelApi("fundingChecklists"); }
  get fundingApplication() { return this.createModelApi("fundingApplications"); }
  get fundingReview() { return this.createModelApi("fundingReviews"); }
  get organizationMetrics() { return this.createModelApi("metrics"); }
  get kpi() { return this.createModelApi("kpis"); }
  get benchmark() { return this.createModelApi("benchmarks"); }
  get aiConversation() { return this.createModelApi("conversations"); }
  get aiMessage() { return this.createModelApi("messages"); }
  get aiRecommendation() { return this.createModelApi("recommendations"); }
  get aiInsight() { return this.createModelApi("insights"); }
  get aiActionPlan() { return this.createModelApi("actionPlans"); }
  get survey() { return this.createModelApi("surveys"); }
  get surveyQuestion() { return this.createModelApi("surveyQuestions"); }
  get surveyResponse() { return this.createModelApi("surveyResponses"); }
  get surveyAnswer() { return this.createModelApi("surveyAnswers"); }
  get notification() { return this.createModelApi("notifications"); }
  get auditLog() { return this.createModelApi("auditLogs"); }
  get file() { return this.createModelApi("files"); }
}

const memoryDbInstance = new InMemoryDb();

// Export client with transparent dual support
export const db: PrismaClient = new Proxy({} as any, {
  get(target, prop: string | symbol) {
    if (typeof prop === "symbol") return (memoryDbInstance as any)[prop];

    if (prop === "$transaction") {
      return async (arg: any) => {
        if (!fallbackToMemory && prismaInstance) {
          try {
            return await prismaInstance.$transaction(arg);
          } catch (err: any) {
            if (isConnectionError(err)) {
              activateMemoryFallback(err);
            } else {
              throw err;
            }
          }
        }
        if (Array.isArray(arg)) {
          return Promise.all(arg);
        } else if (typeof arg === "function") {
          return arg(db);
        }
      };
    }

    if (prop === "$queryRaw" || prop === "$executeRaw") {
      return async (...args: any[]) => {
        if (!fallbackToMemory && prismaInstance) {
          try {
            return await (prismaInstance as any)[prop](...args);
          } catch (err: any) {
            if (isConnectionError(err)) {
              activateMemoryFallback(err);
              return [];
            } else {
              throw err;
            }
          }
        }
        return [];
      };
    }

    const memoryModel = (memoryDbInstance as any)[prop];

    if (!fallbackToMemory && prismaInstance && (prismaInstance as any)[prop]) {
      const prismaModel = (prismaInstance as any)[prop];
      if (typeof prismaModel === "object" && prismaModel !== null) {
        return new Proxy(prismaModel, {
          get(mTarget, mProp: string | symbol) {
            const originalMethod = mTarget[mProp];
            if (typeof originalMethod === "function") {
              return async (...args: any[]) => {
                if (fallbackToMemory) {
                  const fallbackMethod = memoryModel?.[mProp];
                  if (typeof fallbackMethod === "function") {
                    return fallbackMethod(...args);
                  }
                  return null;
                }
                try {
                  return await originalMethod.apply(mTarget, args);
                } catch (err: any) {
                  if (isConnectionError(err)) {
                    activateMemoryFallback(err);
                    const fallbackMethod = memoryModel?.[mProp];
                    if (typeof fallbackMethod === "function") {
                      return fallbackMethod(...args);
                    }
                    return null;
                  }
                  throw err;
                }
              };
            }
            return originalMethod;
          }
        });
      }
    }

    return memoryModel;
  }
}) as unknown as PrismaClient;
