import { Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { db } from "../../db/client.ts";
import { AuthenticatedRequest } from "../middleware/auth.ts";

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is missing or unconfigured.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

export async function askAdvisor(req: AuthenticatedRequest, res: Response) {
  try {
    const { prompt, advisorType } = req.body; // advisorType: Executive, Financial, Operations, Commercial, Funding
    const { organizationId, id: userId } = req.user || {};

    if (!prompt || !organizationId || !userId) {
      return res.status(400).json({ success: false, message: "Prompt do utilizador é obrigatório." });
    }

    const type = advisorType || "Executive";

    // Build context
    const org = await db.organization.findUnique({ where: { id: organizationId } });
    const revenues = await db.revenue.findMany({ where: { organizationId }, take: 10 });
    const expenses = await db.expense.findMany({ where: { organizationId }, take: 10 });

    const totalRev = revenues.reduce((s, r) => s + r.amount, 0);
    const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
    const profit = totalRev - totalExp;

    const sectorContext = `Setor: ${org?.sector}. Nome: ${org?.name}.`;
    const financialContext = `Finanças: Receita Total: ${totalRev} AOA, Despesa Total: ${totalExp} AOA, Saldo Líquido: ${profit} AOA.`;

    const systemInstruction = `Você é o OLO Fintel AI Advisor especializado no perfil ${type}. 
    Seu papel é apoiar PMEs e cooperativas em Angola e na África Austral a organizar suas operações diárias e tornarem-se qualificadas para financiamento (Funding Ready).
    Forneça respostas acionáveis, práticas, estruturadas, sem jargões complexos e sempre contextualizadas à realidade local angolana.
    Use dados fornecidos no contexto para dar recomendações precisas.`;

    const fullPrompt = `${systemInstruction}\n\nContexto da Organização:\n${sectorContext}\n${financialContext}\n\nPergunta do Utilizador: ${prompt}`;

    try {
      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: fullPrompt,
      });

      const reply = response.text || "De momento não foi possível gerar uma resposta clara do consultor.";

      return res.json({
        success: true,
        data: {
          reply,
          advisorType: type,
          source: "Gemini API"
        }
      });

    } catch (apiError: any) {
      console.warn("Gemini API not available, falling back to local heuristic advisor response.", apiError.message);

      // Highly tailored local rule-based advisor responses
      let reply = "";
      if (type === "Financial") {
        reply = `Com base no saldo financeiro atual (${profit} AOA), a principal recomendação para a sua organização no setor de ${org?.sector} é auditar os custos operacionais (que representam ${totalRev > 0 ? Math.round((totalExp / totalRev) * 100) : 100}% das receitas). Sugerimos limitar despesas com combustível e insumos não essenciais nesta fase.`;
      } else if (type === "Funding") {
        reply = `Olá! Sou o seu consultor de Financiamento. Analisando o seu perfil, para se candidatar com sucesso a linhas de crédito (como o Prodesi / BDA ou microcrédito), deve certificar-se de que tem o seu NIF e o Alvará Comercial aprovados no nosso portal documental. Complete estes requisitos para elevar o seu score!`;
      } else {
        reply = `O seu consultor de Gestão recomenda focar no registo operacional diário das suas atividades (colheitas, animais, capturas ou vendas). A regularidade dos dados registados na plataforma OLO Fintel é o ativo mais credível para demonstrar idoneidade perante compradores e parceiros bancários em Angola.`;
      }

      return res.json({
        success: true,
        data: {
          reply,
          advisorType: type,
          source: "Local Heuristic Engine (Offline Fallback)"
        }
      });
    }

  } catch (error: any) {
    console.error("Erro no AI Advisor:", error);
    return res.status(500).json({ success: false, message: "Erro interno no servidor do consultor inteligente." });
  }
}

export async function getRecommendations(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId } = req.user || {};
    if (!organizationId) {
      return res.status(400).json({ success: false, message: "Organização não fornecida." });
    }

    const org = await db.organization.findUnique({ where: { id: organizationId } });

    // Generate dynamic recommendations list based on sector
    let recommendations = [
      {
        id: "rec-1",
        title: "Atualizar Documentação Legal",
        description: "Faça upload do NIF e do Estatuto da Cooperativa para avançar no seu checklist de financiamento.",
        priority: "High",
        status: "Active"
      },
      {
        id: "rec-2",
        title: "Registo Regular de Fluxos de Caixa",
        description: "Tente manter uma frequência diária ou semanal nos registos de vendas para criar um histórico financeiro robusto.",
        priority: "Medium",
        status: "Active"
      }
    ];

    if (org?.sector === "Agriculture" || org?.sector === "Agricultura") {
      recommendations.push({
        id: "rec-3",
        title: "Controlo de Insumos e Sementes",
        description: "Registe a quantidade de NPK utilizada no talhão principal para correlacionar produtividade com custos de insumos.",
        priority: "Medium",
        status: "Active"
      });
    } else if (org?.sector === "Fisheries" || org?.sector === "Pesca") {
      recommendations.push({
        id: "rec-3",
        title: "Controlo de Consumo de Combustível",
        description: "As despesas com diesel representam grande parte dos custos. Registe as saídas por viagem para otimizar margens.",
        priority: "High",
        status: "Active"
      });
    }

    return res.json({ success: true, data: recommendations });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao obter recomendações de IA." });
  }
}

export async function getActionPlan(req: AuthenticatedRequest, res: Response) {
  try {
    const actionPlan = [
      { title: "Completar Perfil Organizacional", task: "Adicionar NIF e Alvará comercial no módulo de Documentos", deadline: "Em 3 dias", status: "Pending" },
      { title: "Registar Custos de Produção", task: "Lançar no módulo de Finanças as últimas 3 faturas de insumos/combustível", deadline: "Em 5 dias", status: "Pending" },
      { title: "Avaliar Score", task: "Solicitar recálculo dinâmico no Funding Readiness Center", deadline: "Em 7 dias", status: "Pending" }
    ];
    return res.json({ success: true, data: actionPlan });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao carregar plano de ação estruturado." });
  }
}
