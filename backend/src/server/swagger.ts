export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "OLO Fintel - API Canónica",
    version: "1.1.0",
    description: "Infraestrutura de Identidade Económica e Sistema Operativo Operacional/Financeiro para PMEs e Cooperativas."
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor Local / Preview"
    }
  ],
  paths: {
    "/api/v1/auth/register": {
      post: {
        summary: "Registar novo utilizador e organização",
        description: "Regista um gestor, cria a sua organização associada e ativa as preferências padrão.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["firstName", "lastName", "email", "password", "organizationName", "sector"],
                properties: {
                  firstName: { type: "string", example: "Kiala" },
                  lastName: { type: "string", example: "Mateus" },
                  email: { type: "string", format: "email", example: "kiala.mateus@coop.ao" },
                  password: { type: "string", format: "password", example: "SenhaSegura123" },
                  phone: { type: "string", example: "+244923000000" },
                  organizationName: { type: "string", example: "Cooperativa Agrícola de Catabola" },
                  sector: { type: "string", enum: ["Agriculture", "Livestock", "Fisheries", "Commerce"], example: "Agriculture" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Utilizador criado com sucesso" },
          409: { description: "Email em uso" }
        }
      }
    },
    "/api/v1/auth/login": {
      post: {
        summary: "Iniciar Sessão",
        description: "Autentica o utilizador e retorna tokens de acesso JWT.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "kiala.mateus@coop.ao" },
                  password: { type: "string", example: "SenhaSegura123" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Autenticado com sucesso" },
          401: { description: "Credenciais inválidas" }
        }
      }
    },
    "/api/v1/public/platform-metrics": {
      get: {
        summary: "Obter métricas públicas de tração",
        description: "Retorna agregados globais da plataforma para exibir na landing page (total de registos, províncias, etc).",
        responses: {
          200: { description: "Dados agregados obtidos com sucesso" }
        }
      }
    },
    "/api/v1/surveys/active": {
      get: {
        summary: "Obter questionário de validação ativo",
        description: "Retorna a estrutura ativa do estudo de validação de mercado para os visitantes responderem.",
        responses: {
          200: { description: "Questionário retornado com sucesso" }
        }
      }
    },
    "/api/v1/surveys/responses": {
      post: {
        summary: "Submeter resposta ao estudo de validação",
        description: "Permite a visitantes e utilizadores submeterem as suas respostas ao estudo. Utiliza fingerprint para evitar duplicados.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["surveyId", "answers"],
                properties: {
                  surveyId: { type: "string", example: "default-survey-id" },
                  organizationTypeHint: { type: "string", example: "Cooperativa" },
                  provinceHint: { type: "string", example: "Benguela" },
                  personaHint: { type: "string", example: "Presidente" },
                  answers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        questionId: { type: "string", example: "q-sector" },
                        value: { type: "string", example: "Agricultura" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Resposta submetida" },
          409: { description: "Duplicado detetado" }
        }
      }
    },
    "/api/v1/dashboard": {
      get: {
        summary: "Obter Dashboard Executivo",
        description: "Retorna dados financeiros, operacionais e alertas específicos do setor e perfil do utilizador logado.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Dashboard carregado" }
        }
      }
    },
    "/api/v1/finance/revenues": {
      post: {
        summary: "Registar Receita",
        description: "Cria uma entrada de receita financeira e atualiza os saldos das contas vinculadas.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["source", "amount", "date", "category"],
                properties: {
                  source: { type: "string", example: "Venda de 50 sacos de Milho" },
                  amount: { type: "number", example: 450000.0 },
                  date: { type: "string", format: "date-time", example: "2026-07-18T12:00:00Z" },
                  category: { type: "string", example: "Sales" },
                  accountId: { type: "string", example: "acc-123" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Receita registada com sucesso" }
        }
      }
    },
    "/api/v1/funding/score": {
      get: {
        summary: "Calcular Funding Readiness Score",
        description: "Executa o motor de cálculo canónico para obter subpontuações operacional, financeira, comercial e documental de 0 a 100.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Pontuação calculada com sucesso" }
        }
      }
    },
    "/api/v1/ai/chat": {
      post: {
        summary: "Conversar com o IA Advisor",
        description: "Envia perguntas ao assistente inteligente integrado com Gemini 3.5 Flash para obter conselhos estruturados de gestão.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["prompt"],
                properties: {
                  prompt: { type: "string", example: "Como reduzir meus custos operacionais no setor pecuário?" },
                  advisorType: { type: "string", enum: ["Executive", "Financial", "Operations", "Commercial", "Funding"], example: "Financial" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Resposta gerada" }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};
