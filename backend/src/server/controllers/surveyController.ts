import { Request, Response } from "express";
import crypto from "crypto";
import { db } from "../../db/client.ts";

// Helper to hash fingerprint for duplicate detection
function hashFingerprint(ip: string, userAgent: string): string {
  return crypto.createHash("sha256").update(`${ip}-${userAgent}`).digest("hex");
}

export async function getActiveSurvey(req: Request, res: Response) {
  try {
    const survey = await db.survey.findFirst({
      where: { status: "Open" }
    });

    if (!survey) {
      return res.status(404).json({ success: false, message: "Nenhum estudo de validação ativo no momento." });
    }

    const questions = await db.surveyQuestion.findMany({
      where: { surveyId: survey.id },
      orderBy: { order: "asc" }
    });

    const responseCount = await db.surveyResponse.count({
      where: { surveyId: survey.id }
    });

    return res.json({
      success: true,
      data: {
        survey: {
          id: survey.id,
          title: survey.title,
          description: survey.description,
          goalCount: survey.goalCount,
          responseCount,
          isGoalReached: responseCount >= survey.goalCount
        },
        questions: questions.map(q => ({
          id: q.id,
          order: q.order,
          type: q.type,
          text: q.text,
          options: q.options
        }))
      }
    });

  } catch (error: any) {
    console.error("Erro ao obter estudo ativo:", error);
    return res.status(500).json({ success: false, message: "Erro ao obter o formulário de validação." });
  }
}

// Helper to calculate derived metrics dynamically from survey input data
export function calculateSurveyMetrics(dataMap: Record<string, any>) {
  const A3_lostSales = dataMap.A3_lostSales;
  const C1_profitMarginIdea = dataMap.C1_profitMarginIdea;
  const D2_shareRealData = dataMap.D2_shareRealData;
  const D1_probabilityToUse = dataMap.D1_probabilityToUse;
  const D3_willingToPay = dataMap.D3_willingToPay;
  const C3_sectorConditionalAnswer = dataMap.C3_sectorConditionalAnswer;
  const B3_trustReport = dataMap.B3_trustReport;

  // 1. isUrgentPain (boolean)
  const isUrgentPain = ["4_6", "MORE_6"].includes(String(A3_lostSales)) && String(C1_profitMarginIdea) === "NO";

  // 2. isHighIntent (boolean)
  const isHighIntent = String(D2_shareRealData) === "ALL_GOLD" && ["51_80", "81_100"].includes(String(D1_probabilityToUse));

  // 3. adoptionScore (0-100)
  let d1Score = 10;
  if (D1_probabilityToUse === "81_100") d1Score = 100;
  else if (D1_probabilityToUse === "51_80") d1Score = 70;
  else if (D1_probabilityToUse === "21_50") d1Score = 40;
  else if (D1_probabilityToUse === "0_20") d1Score = 10;

  let d3Score = 10;
  if (D3_willingToPay === "MORE_7500") d3Score = 100;
  else if (D3_willingToPay === "2500_7500") d3Score = 80;
  else if (D3_willingToPay === "UP_2500") d3Score = 50;
  else if (D3_willingToPay === "FREE") d3Score = 10;

  let d2Score = 20;
  if (D2_shareRealData === "ALL_GOLD") d2Score = 100;
  else if (D2_shareRealData === "AGGREGATED_SILVER") d2Score = 60;
  else if (D2_shareRealData === "FICTIONAL_BRONZE") d2Score = 20;

  let c1Score = 10;
  if (C1_profitMarginIdea === "YES") c1Score = 100;
  else if (C1_profitMarginIdea === "MAYBE") c1Score = 50;
  else if (C1_profitMarginIdea === "NO") c1Score = 10;

  let c3Score = 10;
  if (["SIM_HISTORICO", "PLANILHA", "COM_DADOS", "EXATO"].includes(String(C3_sectorConditionalAnswer))) {
    c3Score = 100;
  } else if (["MAIS_OU_MENOS", "A_VULSO", "ACHO"].includes(String(C3_sectorConditionalAnswer))) {
    c3Score = 50;
  } else {
    c3Score = 10;
  }
  const maturityScore = (c1Score + c3Score) / 2;

  let b3Score = 10;
  if (B3_trustReport === "YES") b3Score = 100;
  else if (B3_trustReport === "MAYBE") b3Score = 50;
  else if (B3_trustReport === "NO") b3Score = 10;

  const rawAdoptionScore = (d1Score * 0.30) + (d3Score * 0.20) + (d2Score * 0.20) + (maturityScore * 0.20) + (b3Score * 0.10);
  const adoptionScore = Math.min(100, Math.max(0, Math.round(rawAdoptionScore)));

  return { adoptionScore, isHighIntent, isUrgentPain };
}

export async function submitResponse(req: Request, res: Response) {
  try {
    const body = req.body || {};

    // Check if this is the new flattened survey form submission (formData format)
    const isFlattenedForm = body.A2_lostHours !== undefined || 
                            body.E3_sector !== undefined || 
                            body.D1_probabilityToUse !== undefined ||
                            body.A3_lostSales !== undefined;

    if (isFlattenedForm) {
      // 1. Group Validation: A1_* tools
      const {
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
        E4_provinceOther,
        E5_employeeCount,
        E6_persona,
        E7_contact
      } = body;

      const hasA1Tool = Boolean(A1_usesPaper || A1_usesExcel || A1_usesWhatsApp || A1_usesBillingSoftware || A1_usesNone);
      if (!hasA1Tool) {
        return res.status(400).json({ error: "Por favor, selecione pelo menos uma ferramenta de gestão ou 'Nenhuma'." });
      }

      if (!A2_lostHours) {
        return res.status(400).json({ error: "Por favor, selecione quantas horas são perdidas semanalmente." });
      }

      if (!A3_lostSales) {
        return res.status(400).json({ error: "Por favor, indique a estimativa de negócios perdidos por falta de informação." });
      }

      if (!B1_appliedFunding) {
        return res.status(400).json({ error: "Por favor, indique se já se candidatou a financiamento bancário." });
      }

      if (B1_appliedFunding === "REJECTED" && (!B2_rejectionReason || !String(B2_rejectionReason).trim())) {
        return res.status(400).json({ error: "Por favor, especifique o motivo de rejeição do financiamento." });
      }

      if (!B3_trustReport) {
        return res.status(400).json({ error: "Por favor, indique se confiaria num relatório de credibilidade." });
      }

      if (!C1_profitMarginIdea) {
        return res.status(400).json({ error: "Por favor, responda se sabe a margem de lucro do seu negócio." });
      }

      if (!C2_biggestHeadache || !String(C2_biggestHeadache).trim()) {
        return res.status(400).json({ error: "Por favor, indique a maior dor de cabeça na gestão financeira." });
      }

      if (!E3_sector) {
        return res.status(400).json({ error: "O setor de atividade é obrigatório." });
      }

      // 2.1 Conditional Validation for C3_sectorConditionalAnswer based on E3_sector
      const validC3BySector: Record<string, string[]> = {
        AGRICULTURE: ["SIM_HISTORICO", "MAIS_OU_MENOS", "NAO_REGISTO"],
        LIVESTOCK: ["PLANILHA", "A_VULSO", "SEM_CONTROLO"],
        FISHERIES: ["COM_DADOS", "MAIS_OU_MENOS", "NAO_CONTROLO"],
        COMMERCE: ["EXATO", "ACHO", "NAO_SEI"],
        TRANSPORT: ["EXATO", "ACHO", "NAO_SEI"],
        INDUSTRY: ["EXATO", "ACHO", "NAO_SEI"]
      };

      const allowedC3 = validC3BySector[String(E3_sector).toUpperCase()] || ["EXATO", "ACHO", "NAO_SEI"];
      if (!C3_sectorConditionalAnswer || !allowedC3.includes(String(C3_sectorConditionalAnswer))) {
        return res.status(400).json({ error: "Por favor, selecione uma resposta de maturidade válida para o setor selecionado." });
      }

      if (!D1_probabilityToUse) {
        return res.status(400).json({ error: "Por favor, indique a probabilidade de utilizar a plataforma." });
      }

      if (!D2_shareRealData) {
        return res.status(400).json({ error: "Por favor, indique o nível de partilha de dados desejado." });
      }

      if (!D3_willingToPay) {
        return res.status(400).json({ error: "Por favor, indique a sua disponibilidade financeira ou modelo de pagamento." });
      }

      if (!E4_province || !String(E4_province).trim()) {
        return res.status(400).json({ error: "A província da organização é obrigatória." });
      }

      if (String(E4_province).toLowerCase() === "outra" && (!E4_provinceOther || !String(E4_provinceOther).trim())) {
        return res.status(400).json({ error: "Por favor, especifique qual é a outra província." });
      }

      if (!E5_employeeCount) {
        return res.status(400).json({ error: "Por favor, selecione o número de colaboradores." });
      }

      if (!E6_persona) {
        return res.status(400).json({ error: "Por favor, selecione a sua função ou perfil na empresa." });
      }

      if (!E7_contact || !String(E7_contact).trim()) {
        return res.status(400).json({ error: "Por favor, insira o seu contacto de e-mail ou telefone." });
      }

      // 3. Calculation of Derived Metrics dynamically
      const { adoptionScore, isHighIntent, isUrgentPain } = calculateSurveyMetrics(body);

      // 4. Persistence in Database (background / safe execution)
      try {
        const ip = req.ip || req.socket.remoteAddress || "unknown-ip";
        const userAgent = req.headers["user-agent"] || "unknown-ua";
        const fingerprint = hashFingerprint(ip, userAgent);

        const activeSurvey = await db.survey.findFirst({ where: { status: "Open" } });
        const targetSurveyId = activeSurvey ? activeSurvey.id : "d112b0c7-9776-44a4-a562-b1ff7d695c64";

        const responseRecord = await db.surveyResponse.create({
          data: {
            surveyId: targetSurveyId,
            respondentFingerprint: fingerprint,
            organizationTypeHint: String(E3_sector),
            provinceHint: String(E4_province),
            personaHint: String(E6_persona),
            adoptionScore,
            isHighIntent,
            isUrgentPain
          }
        });

        // Save main answers as key-value pairs
        const keysToSave = [
          "A1_usesPaper", "A1_usesExcel", "A1_usesWhatsApp", "A1_usesBillingSoftware", "A1_usesNone",
          "A2_lostHours", "A3_lostSales", "B1_appliedFunding", "B2_rejectionReason",
          "B3_trustReport", "C1_profitMarginIdea", "C2_biggestHeadache", "C3_sectorConditionalAnswer",
          "D1_probabilityToUse", "D2_shareRealData", "D3_willingToPay", "E1_orgName", "E2_nif",
          "E3_sector", "E4_province", "E5_employeeCount", "E6_persona", "E7_contact"
        ];

        for (const key of keysToSave) {
          if (body[key] !== undefined && body[key] !== null) {
            await db.surveyAnswer.create({
              data: {
                responseId: responseRecord.id,
                questionId: key,
                value: String(body[key])
              }
            }).catch(() => {});
          }
        }
      } catch (dbErr) {
        console.warn("Non-blocking DB survey insert fallback:", dbErr);
      }

      // 5. Response Contract: { survey: { adoptionScore, isHighIntent, isUrgentPain } }
      const surveyResult = {
        adoptionScore,
        isHighIntent,
        isUrgentPain
      };

      return res.status(200).json({
        success: true,
        survey: surveyResult,
        data: {
          survey: surveyResult
        }
      });
    }

    // Legacy format handling: { surveyId, answers }
    const { surveyId, answers } = body;
    if (!surveyId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Dados de resposta inválidos." });
    }

    const survey = await db.survey.findUnique({ where: { id: surveyId } });
    if (!survey || survey.status !== "Open") {
      return res.status(400).json({ error: "Este estudo de validação está encerrado ou é inexistente." });
    }

    const legacyMap: Record<string, any> = {};
    for (const answer of answers) {
      if (answer.questionId) legacyMap[answer.questionId] = answer.value;
    }

    const { adoptionScore, isHighIntent, isUrgentPain } = calculateSurveyMetrics(legacyMap);

    const ip = req.ip || req.socket.remoteAddress || "unknown-ip";
    const userAgent = req.headers["user-agent"] || "unknown-ua";
    const fingerprint = hashFingerprint(ip, userAgent);

    const responseRecord = await db.surveyResponse.create({
      data: {
        surveyId,
        respondentFingerprint: fingerprint,
        organizationTypeHint: body.organizationTypeHint || legacyMap.E3_sector || "Outro",
        provinceHint: body.provinceHint || legacyMap.E4_province || "Luanda",
        personaHint: body.personaHint || legacyMap.E6_persona || "Visitante",
        adoptionScore,
        isHighIntent,
        isUrgentPain 
      }
    });

    for (const answer of answers) {
      await db.surveyAnswer.create({
        data: {
          responseId: responseRecord.id,
          questionId: answer.questionId,
          value: String(answer.value)
        }
      });
    }

    const surveyResult = {
      adoptionScore,
      isHighIntent,
      isUrgentPain
    };

    return res.status(200).json({
      success: true,
      survey: surveyResult,
      data: {
        survey: surveyResult
      }
    });

  } catch (error: any) {
    console.error("Erro ao submeter resposta do inquérito:", error);
    return res.status(500).json({ error: "Erro interno no servidor ao processar o inquérito." });
  }
}

export async function getSurveyStatistics(req: Request, res: Response) {
  try {
    const survey = await db.survey.findFirst({
      where: { status: "Open" }
    }) || await db.survey.findFirst({
      orderBy: { createdAt: "desc" }
    });

    if (!survey) {
      return res.json({ success: true, data: { count: 0, target: 100, progressPercentage: 0 } });
    }

    const count = await db.surveyResponse.count({
      where: { surveyId: survey.id }
    });

    // Get simple aggregates for public landing page
    const responses = await db.surveyResponse.findMany({
      where: { surveyId: survey.id }
    });

    const sectors: Record<string, number> = {};
    const provinces: Record<string, number> = {};
    const personas: Record<string, number> = {};

    responses.forEach(r => {
      if (r.organizationTypeHint) sectors[r.organizationTypeHint] = (sectors[r.organizationTypeHint] || 0) + 1;
      if (r.provinceHint) provinces[r.provinceHint] = (provinces[r.provinceHint] || 0) + 1;
      if (r.personaHint) personas[r.personaHint] = (personas[r.personaHint] || 0) + 1;
    });

    return res.json({
      success: true,
      data: {
        surveyTitle: survey.title,
        count,
        target: survey.goalCount,
        progressPercentage: Math.min(Math.round((count / survey.goalCount) * 100), 100),
        distribution: {
          sectors,
          provinces,
          personas
        }
      }
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao compilar dados estatísticos." });
  }
}

export async function getJuryDashboard(req: Request, res: Response) {
  try {
    // A Jury dashboard must offer anonymous, aggregated data.
    // To preserve confidentiality, we only show aggregates when total responses are >= 3.
    const survey = await db.survey.findFirst({
      orderBy: { createdAt: "desc" }
    });

    if (!survey) {
      return res.status(404).json({ success: false, message: "Nenhum estudo registado." });
    }

    const responses = await db.surveyResponse.findMany({
      where: { surveyId: survey.id }
    });

    if (responses.length < 3) {
      return res.json({
        success: true,
        message: "Dados de validação em compilação preliminar. Mínimo de 3 respostas necessárias para exibição anónima do painel de júri.",
        data: {
          responsesCount: responses.length,
          target: survey.goalCount,
          isLocked: true
        }
      });
    }

    // Process questions and answer frequency
    const questions = await db.surveyQuestion.findMany({
      where: { surveyId: survey.id },
      orderBy: { order: "asc" }
    });

    const answers = await db.surveyAnswer.findMany({
      where: {
        response: { surveyId: survey.id }
      }
    });

    const questionStats = questions.map(q => {
      const qAnswers = answers.filter(a => a.questionId === q.id);
      const frequency: Record<string, number> = {};
      const texts: string[] = [];

      qAnswers.forEach(ans => {
        if (q.type === "single_choice" || q.type === "scale") {
          frequency[ans.value] = (frequency[ans.value] || 0) + 1;
        } else {
          texts.push(ans.value);
        }
      });

      return {
        id: q.id,
        text: q.text,
        type: q.type,
        options: q.options,
        stats: {
          totalAnswers: qAnswers.length,
          frequency,
          sampleTexts: texts.slice(0, 10) // show up to 10 generic answers
        }
      };
    });

    return res.json({
      success: true,
      data: {
        survey: {
          id: survey.id,
          title: survey.title,
          responsesCount: responses.length,
          target: survey.goalCount,
          isLocked: false
        },
        questionStats
      }
    });

  } catch (error: any) {
    console.error("Erro no painel de júri:", error);
    return res.status(500).json({ success: false, message: "Erro interno no painel de avaliação do júri." });
  }
}
