import { Response } from "express";
import { db } from "../../db/client.ts";
import { AuthenticatedRequest } from "../middleware/auth.ts";

export async function calculateAndGetScore(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId } = req.user || {};

    if (!organizationId) {
      return res.status(400).json({ success: false, message: "Contexto de organização em falta." });
    }

    // Load org details to know sector
    const org = await db.organization.findUnique({ where: { id: organizationId } });
    if (!org) {
      return res.status(404).json({ success: false, message: "Organização não encontrada." });
    }

    // 1. Operational Score (0-100)
    let opScore = 40.0;
    if (org.sector === "Agriculture" || org.sector === "Agricultura") {
      const farmsCount = await db.farm.count({ where: { organizationId } });
      const plantingsCount = await db.planting.count({ where: { plot: { farm: { organizationId } } } });
      const inputsCount = await db.agriculturalInput.count({ where: { organizationId } });
      opScore = Math.min(40 + (farmsCount * 15) + (plantingsCount * 10) + (inputsCount * 5), 100);
    } else if (org.sector === "Livestock" || org.sector === "Pecuária") {
      const animalsCount = await db.animal.count({ where: { organizationId } });
      opScore = Math.min(40 + (animalsCount * 4), 100);
    } else if (org.sector === "Fisheries" || org.sector === "Pesca") {
      const vesselsCount = await db.vessel.count({ where: { organizationId } });
      const tripsCount = await db.fishingTrip.count({ where: { vessel: { organizationId } } });
      opScore = Math.min(35 + (vesselsCount * 20) + (tripsCount * 10), 100);
    } else {
      const productsCount = await db.product.count({ where: { organizationId } });
      opScore = Math.min(40 + (productsCount * 3), 100);
    }

    // 2. Financial Score (0-100)
    const revenues = await db.revenue.findMany({ where: { organizationId } });
    const expenses = await db.expense.findMany({ where: { organizationId } });
    const totalRev = revenues.reduce((s, r) => s + r.amount, 0);
    const totalExp = expenses.reduce((s, e) => s + e.amount, 0);

    let finScore = 30.0; // base score
    if (totalRev > 0) {
      const margin = (totalRev - totalExp) / totalRev;
      const marginBonus = margin > 0.15 ? 30 : margin > 0 ? 15 : 0;
      const countBonus = Math.min(revenues.length * 5, 40);
      finScore = Math.min(finScore + marginBonus + countBonus, 100);
    }

    // 3. Commercial Score (0-100)
    const contractsCount = await db.contract.count({ where: { organizationId } });
    const leadsCount = await db.lead.count({ where: { organizationId } });
    const commScore = Math.min(30 + (contractsCount * 25) + (leadsCount * 5), 100);

    // 4. Document Score (0-100)
    const docs = await db.document.findMany({ where: { organizationId } });
    const mandatoryCategories = ["NIF", "CommercialLicense", "Statutes"];
    let approvedMandatoryCount = 0;

    mandatoryCategories.forEach(cat => {
      const found = docs.find(d => d.category === cat && d.status === "Approved");
      if (found) approvedMandatoryCount++;
    });

    const docScore = Math.round((approvedMandatoryCount / mandatoryCategories.length) * 100);

    // Final Weighted Score
    const finalScore = Math.round((opScore * 0.25) + (finScore * 0.35) + (commScore * 0.2) + (docScore * 0.2));

    // Save Score
    const scoreRecord = await db.fundingScore.create({
      data: {
        organizationId,
        operationalScore: opScore,
        financialScore: finScore,
        commercialScore: commScore,
        documentScore: docScore,
        finalScore
      }
    });

    // Check checklist items
    const checklist = [
      { item: "Registo do NIF Fiscal", status: docs.some(d => d.category === "NIF" && d.status === "Approved") ? "Completed" : "Pending" },
      { item: "Upload do Alvará Comercial", status: docs.some(d => d.category === "CommercialLicense" && d.status === "Approved") ? "Completed" : "Pending" },
      { item: "Histórico de Receitas (Mínimo 3 meses)", status: revenues.length >= 3 ? "Completed" : "Pending" },
      { item: "Controle de Custos Operacionais", status: expenses.length > 0 ? "Completed" : "Pending" }
    ];

    return res.json({
      success: true,
      data: {
        score: finalScore,
        breakdown: {
          operational: opScore,
          financial: finScore,
          commercial: commScore,
          documentation: docScore
        },
        checklist,
        evaluatedAt: scoreRecord.generatedAt
      }
    });

  } catch (error: any) {
    console.error("Erro ao calcular pontuação:", error);
    return res.status(500).json({ success: false, message: "Erro ao recalcular score de financiamento." });
  }
}

export async function submitApplication(req: AuthenticatedRequest, res: Response) {
  try {
    const { requestedAmount, purpose } = req.body;
    const { organizationId } = req.user || {};

    if (!requestedAmount || !purpose || !organizationId) {
      return res.status(400).json({ success: false, message: "Valor solicitado e propósito do financiamento são obrigatórios." });
    }

    // Verify readiness checklist
    const docsCount = await db.document.count({
      where: { organizationId, status: "Approved" }
    });

    if (docsCount === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Candidatura bloqueada. A organização deve ter pelo menos 1 documento principal aprovado por analistas." 
      });
    }

    const application = await db.fundingApplication.create({
      data: {
        organizationId,
        requestedAmount: parseFloat(requestedAmount),
        purpose,
        status: "Submitted",
        submittedAt: new Date()
      }
    });

    return res.status(201).json({
      success: true,
      message: "Candidatura a financiamento submetida com sucesso à banca parceira.",
      data: application
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao registar candidatura." });
  }
}

export async function getApplications(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId } = req.user || {};
    const applications = await db.fundingApplication.findMany({
      where: { organizationId },
      include: { reviews: true },
      orderBy: { createdAt: "desc" }
    });
    return res.json({ success: true, data: applications });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao obter candidaturas." });
  }
}

export async function getAnalystApplications(req: AuthenticatedRequest, res: Response) {
  try {
    // Analyst role only
    const applications = await db.fundingApplication.findMany({
      include: {
        organization: {
          select: { name: true, sector: true, province: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return res.json({ success: true, data: applications });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao obter candidaturas para análise." });
  }
}

export async function reviewApplication(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { decision, comments } = req.body; // Approved, Rejected
    const { id: analystId } = req.user || {};

    if (!decision || !analystId) {
      return res.status(400).json({ success: false, message: "Decisão e analista são necessários." });
    }

    const app = await db.fundingApplication.findUnique({ where: { id } });
    if (!app) {
      return res.status(404).json({ success: false, message: "Candidatura não encontrada." });
    }

    const updatedApp = await db.fundingApplication.update({
      where: { id },
      data: { status: decision }
    });

    await db.fundingReview.create({
      data: {
        applicationId: id,
        analystId,
        decision,
        comments
      }
    });

    return res.json({
      success: true,
      message: `Candidatura analisada com decisão: ${decision}.`,
      data: updatedApp
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao registar parecer de análise." });
  }
}
