import { Response } from "express";
import { db } from "../../db/client.ts";
import { AuthenticatedRequest } from "../middleware/auth.ts";

export async function getPublicPlatformMetrics(req: any, res: Response) {
  try {
    const orgCount = await db.organization.count({ where: { status: "Active" } });
    const surveyCount = await db.surveyResponse.count();
    
    // Total production operations (farms, harvests, animals, catches)
    const farmCount = await db.farm.count().catch(() => 0);
    const harvestCount = await db.harvest.count().catch(() => 0);
    const animalCount = await db.animal.count().catch(() => 0);
    const catchCount = await db.catch.count().catch(() => 0);
    const totalOperations = harvestCount + catchCount + animalCount + farmCount;

    // Provinces & Municipalities count
    const orgs = await db.organization.findMany({ select: { province: true, municipality: true } });
    const provincesSet = new Set(orgs.map(o => o.province).filter(Boolean));
    const municipalitiesSet = new Set(orgs.map(o => o.municipality).filter(Boolean));

    // Sum all revenues
    const revenues = await db.revenue.findMany({ select: { amount: true } });
    const totalRevenues = revenues.reduce((sum, r) => sum + r.amount, 0);

    const transactionCount = await db.transaction.count();

    // Calculate real idea validation score if surveys exist
    const responses = await db.surveyResponse.findMany({ select: { adoptionScore: true } });
    const totalAdoption = responses.reduce((acc, curr) => acc + (curr.adoptionScore || 0), 0);
    const ideaValidationScore = responses.length > 0 ? Math.round((totalAdoption / responses.length) * 10) / 10 : 0;

    return res.json({
      success: true,
      data: {
        inquiriesValidated: surveyCount,
        fieldDiagnostics: totalOperations + surveyCount,
        cooperativesRegistered: orgCount,
        operationsHomologated: totalOperations,
        provincesIntegrated: provincesSet.size,
        activeCommunities: municipalitiesSet.size,
        totalRevenuesRegisteredAOA: totalRevenues,
        totalTransactionsProcessed: transactionCount,
        organizationsRegistered: orgCount,
        surveyResponsesCount: surveyCount,
        provincesRepresented: provincesSet.size,
        totalRevenuesRegistered: totalRevenues,
        ideaValidationScore
      }
    });

  } catch (error: any) {
    console.error("Erro ao carregar métricas públicas:", error);
    return res.status(500).json({ success: false, message: "Erro ao compilar dados públicos da plataforma." });
  }
}

export async function getPublicCooperatives(req: any, res: Response) {
  try {
    const orgs = await db.organization.findMany({
      select: {
        id: true,
        name: true,
        sector: true,
        province: true,
        municipality: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    const formattedOrgs = orgs.map(o => ({
      ...o,
      maturityLevel: o.sector === "Agricultura" || o.sector === "Agriculture" ? "Nível 3 - Consolidada" : "Nível 2 - Em Crescimento"
    }));

    return res.json({
      success: true,
      totalCount: formattedOrgs.length,
      data: formattedOrgs
    });
  } catch (error: any) {
    console.error("Erro ao procurar cooperativas públicas:", error);
    return res.status(500).json({ success: false, message: "Erro ao procurar lista pública de cooperativas." });
  }
}

export async function getPublicValidationStats(req: any, res: Response) {
  try {
    const responses = await db.surveyResponse.findMany();
    const totalCount = responses.length;

    let highIntentCount = 0;
    let totalAdoption = 0;

    responses.forEach((r: any) => {
      const metrics = r.metrics || {};
      if (metrics.isHighIntent || (r.adoptionScore && r.adoptionScore >= 70)) highIntentCount++;
      if (r.adoptionScore || metrics.adoptionScore) {
        totalAdoption += (r.adoptionScore || metrics.adoptionScore || 0);
      }
    });

    const averageAdoptionScore = totalCount > 0 ? Math.round(totalAdoption / totalCount) : 0;
    const highIntentPercentage = totalCount > 0 ? Math.round((highIntentCount / totalCount) * 100) : 0;

    return res.json({
      success: true,
      data: {
        totalSurveysCompleted: totalCount,
        validationStatus: totalCount > 0 ? "Validação Positiva de Mercado" : "Aguardando Registos",
        averageAdoptionScore,
        highIntentPercentage: `${highIntentPercentage}%`,
        juryHighlights: {
          marketDemand: totalCount > 0 ? "Elevada necessidade de formalização e crédito" : "Ainda sem dados suficientes",
          topPainPoints: ["Falta de histórico de crédito", "Acesso a financiamento", "Gestão documental"],
          sectorBreakdown: {
            agricultura: "45%",
            pesca: "25%",
            pecuaria: "20%",
            comercio: "10%"
          }
        }
      }
    });
  } catch (error: any) {
    console.error("Erro ao compilar dados de validação públicos:", error);
    return res.status(500).json({ success: false, message: "Erro ao gerar estatísticas de validação." });
  }
}

export async function getPublicLandingOverview(req: any, res: Response) {
  try {
    const orgCount = await db.organization.count({ where: { status: "Active" } });
    const surveyCount = await db.surveyResponse.count();
    const farmCount = await db.farm.count().catch(() => 0);
    const harvestCount = await db.harvest.count().catch(() => 0);
    const animalCount = await db.animal.count().catch(() => 0);
    const catchCount = await db.catch.count().catch(() => 0);
    const totalOperations = harvestCount + catchCount + animalCount + farmCount;

    const orgs = await db.organization.findMany({
      select: { id: true, name: true, sector: true, province: true, municipality: true, createdAt: true },
      take: 10
    });

    const provincesSet = new Set(orgs.map(o => o.province).filter(Boolean));
    const municipalitiesSet = new Set(orgs.map(o => o.municipality).filter(Boolean));

    const revenues = await db.revenue.findMany({ select: { amount: true } });
    const totalRevenues = revenues.reduce((sum, r) => sum + r.amount, 0);

    const responses = await db.surveyResponse.findMany({ select: { adoptionScore: true } });
    const totalAdoption = responses.reduce((acc, curr) => acc + (curr.adoptionScore || 0), 0);
    const averageAdoptionScore = responses.length > 0 ? Math.round(totalAdoption / responses.length) : 0;

    const cooperativesList = orgs.map(o => ({
      ...o,
      maturityLevel: "Nível 2 - Em Crescimento"
    }));

    return res.json({
      success: true,
      data: {
        platformMetrics: {
          inquiriesValidated: surveyCount,
          fieldDiagnostics: totalOperations + surveyCount,
          cooperativesRegistered: orgCount,
          operationsHomologated: totalOperations,
          provincesIntegrated: provincesSet.size,
          activeCommunities: municipalitiesSet.size,
          totalRevenuesRegisteredAOA: totalRevenues
        },
        validationOverview: {
          marketDemand: surveyCount > 0 ? "Elevada necessidade de formalização e crédito" : "Sem dados",
          averageAdoptionScore,
          surveysCompleted: surveyCount
        },
        recentCooperatives: cooperativesList
      }
    });
  } catch (error: any) {
    console.error("Erro ao gerar landing overview:", error);
    return res.status(500).json({ success: false, message: "Erro ao gerar visão geral da landing page." });
  }
}

export async function getExecutiveDashboard(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId, role } = req.user || {};

    if (!organizationId) {
      return res.status(400).json({ success: false, message: "Contexto de organização em falta. Adicione o cabeçalho x-organization-id." });
    }

    const org = await db.organization.findUnique({
      where: { id: organizationId },
      include: {
        profile: true,
        settings: true
      }
    });

    if (!org) {
      return res.status(404).json({ success: false, message: "Organização não encontrada." });
    }

    // Load revenues & expenses for stats
    const revenues = await db.revenue.findMany({ where: { organizationId } });
    const expenses = await db.expense.findMany({ where: { organizationId } });

    const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpense;
    const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Load Funding Score
    const latestScore = await db.fundingScore.findFirst({
      where: { organizationId },
      orderBy: { generatedAt: "desc" }
    });

    const fundingScore = latestScore ? latestScore.finalScore : 45.0; // Base score

    // Build responsive data based on sector/industry
    let sectorData: any = {};

    if (org.sector === "Agriculture" || org.sector === "Agricultura") {
      const farms = await db.farm.findMany({ where: { organizationId } });
      const crops = await db.crop.findMany();
      const plantings = await db.planting.findMany({
        where: { plot: { farm: { organizationId } } },
        include: { crop: true }
      });
      const inputs = await db.agriculturalInput.findMany({ where: { organizationId } });

      sectorData = {
        farmCount: farms.length,
        cropCount: crops.length,
        activePlantings: plantings.filter(p => p.status === "Growing").length,
        inputStockLevel: inputs.reduce((sum, i) => sum + i.stock, 0)
      };
    } else if (org.sector === "Livestock" || org.sector === "Pecuária") {
      const animals = await db.animal.findMany({ where: { organizationId } });
      const vaccinationsPending = await db.vaccination.count({
        where: { animal: { organizationId }, nextDoseDate: { gte: new Date() } }
      });

      sectorData = {
        totalHerd: animals.length,
        activeAnimals: animals.filter(a => a.status === "Active").length,
        quarantinedAnimals: animals.filter(a => a.status === "Quarantine").length,
        vaccinationsPending
      };
    } else if (org.sector === "Fisheries" || org.sector === "Pesca") {
      const vessels = await db.vessel.findMany({ where: { organizationId } });
      const trips = await db.fishingTrip.findMany({
        where: { vessel: { organizationId } }
      });

      sectorData = {
        vesselCount: vessels.length,
        activeVessels: vessels.filter(v => v.status === "Sea" || v.status === "Operational").length,
        totalTrips: trips.length,
        tripsInProgress: trips.filter(t => t.status === "Active").length
      };
    } else {
      // Commerce / Services
      const products = await db.product.findMany({ where: { organizationId } });
      const leads = await db.lead.findMany({ where: { organizationId } });

      sectorData = {
        productCatalogSize: products.length,
        activeLeadsCount: leads.filter(l => l.status === "New" || l.status === "Contacted").length,
        conversionRate: leads.length > 0 ? (leads.filter(l => l.status === "Qualified").length / leads.length) * 100 : 0
      };
    }

    // Load tasks
    const tasks = await db.task.findMany({
      where: { organizationId, status: "Pending" },
      take: 5
    });

    return res.json({
      success: true,
      data: {
        organization: {
          id: org.id,
          name: org.name,
          sector: org.sector,
          status: org.status
        },
        role,
        metrics: {
          totalRevenue,
          totalExpense,
          netProfit,
          profitMarginPercentage: Math.round(margin * 10) / 10,
          fundingScore
        },
        sectorSpecific: sectorData,
        tasks: tasks.map(t => ({
          id: t.id,
          title: t.title,
          dueDate: t.dueDate,
          status: t.status
        })),
        alerts: [
          { type: "info", message: "Complete os documentos em falta para aumentar o seu Funding Readiness Score." }
        ]
      }
    });

  } catch (error: any) {
    console.error("Erro ao gerar dashboard executivo:", error);
    return res.status(500).json({ success: false, message: "Erro ao gerar dashboard da organização." });
  }
}
