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

export async function submitResponse(req: Request, res: Response) {
  try {
    const { surveyId, answers, organizationTypeHint, provinceHint, personaHint } = req.body;

    if (!surveyId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "Dados de resposta inválidos." });
    }

    const survey = await db.survey.findUnique({ where: { id: surveyId } });
    if (!survey || survey.status !== "Open") {
      return res.status(400).json({ success: false, message: "Este estudo de validação está encerrado ou é inexistente." });
    }

    // Generate unique fingerprint hash based on IP & UA to prevent double voting
    const ip = req.ip || req.socket.remoteAddress || "unknown-ip";
    const userAgent = req.headers["user-agent"] || "unknown-ua";
    const fingerprint = hashFingerprint(ip, userAgent);

    // Check for existing response
    const existing = await db.surveyResponse.findFirst({
      where: { surveyId, respondentFingerprint: fingerprint }
    });

    if (existing) {
      return res.status(409).json({ 
        success: false, 
        message: "A sua resposta já foi registada anteriormente para este estudo. Agradecemos a sua colaboração!" 
      });
    }

    // Create Survey Response
    const responseRecord = await db.surveyResponse.create({
      data: {
        surveyId,
        respondentFingerprint: fingerprint,
        organizationTypeHint: organizationTypeHint || "Outro",
        provinceHint: provinceHint || "Indefinida",
        personaHint: personaHint || "Visitante"
      }
    });

    // Create Survey Answers
    for (const answer of answers) {
      await db.surveyAnswer.create({
        data: {
          responseId: responseRecord.id,
          questionId: answer.questionId,
          value: String(answer.value)
        }
      });
    }

    // Trigger check for goalCount
    const currentResponsesCount = await db.surveyResponse.count({
      where: { surveyId }
    });

    let goalReachedTriggered = false;
    if (currentResponsesCount >= survey.goalCount && survey.status === "Open") {
      // Mark survey as closed or log goal reached
      await db.survey.update({
        where: { id: surveyId },
        data: { status: "Closed" } // Or keep open but log
      }).catch(() => {});
      goalReachedTriggered = true;
    }

    return res.status(201).json({
      success: true,
      message: "A sua resposta foi submetida com sucesso! Obrigado pelo seu contributo para o ecossistema angolano.",
      data: {
        responseId: responseRecord.id,
        surveyProgress: {
          current: currentResponsesCount,
          target: survey.goalCount,
          isGoalReached: currentResponsesCount >= survey.goalCount,
          justReached: goalReachedTriggered
        }
      }
    });

  } catch (error: any) {
    console.error("Erro ao submeter resposta:", error);
    return res.status(500).json({ success: false, message: "Erro interno no servidor ao registar a sua resposta." });
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
