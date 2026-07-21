# Documentação de Funcionalidades — OLO Fintel

Bem-vindo à documentação oficial do **OLO Fintel**, o Sistema Operacional Económico e Plataforma de Preparação para Financiamento (Funding Readiness) concebido especialmente para PMEs, Cooperativas e Empreendedores em Angola. 

Esta documentação detalha todas as funcionalidades, módulos interactivos, fluxos de dados e integrações inteligentes desenvolvidos na plataforma.

---

## 📌 Visão Geral do Sistema
O **OLO Fintel** funciona como um centro financeiro e operacional unificado. Ele traduz a atividade do dia-a-dia de setores tradicionais da economia angolana (Agricultura, Pecuária, Pescas e Comércio) em relatórios de conformidade, métricas de viabilidade económica e relatórios prontos para bancos, investidores e microfinanças.

---

## 🛠️ Arquitetura de Módulos e Funcionalidades

### 1. Sistema de Autenticação e Onboarding Setorial (`AuthPages.tsx` & `AuthContext.tsx`)
*   **Controlo de Acesso Seguro**: Fluxos de registo, início de sessão e recuperação de palavra-passe com simulação persistente de perfis corporativos.
*   **Seleção de Setor de Atividade (Indústria)**: No ato do registo, o utilizador define a sua indústria de atuação entre:
    *   **Agricultura & Cooperativas Agrícolas** (`AGRICULTURE`)
    *   **Pecuária & Criação de Animais** (`LIVESTOCK`)
    *   **Pesca Artesanal e Industrial** (`FISHERIES`)
    *   **Comércio, Retalho e Vendas** (`COMMERCE`)
    *   **Outros Serviços** (`SERVICES`)
*   **Personalização Dinâmica**: Toda a experiência visual (paletes de cores, menus, gráficos, dados simulados e terminologia) é moldada de acordo com o setor configurado no perfil do utilizador logado.

---

### 2. Painel de Controlo Centralizado e Adaptativo (`Dashboards.tsx`)
O **Dashboard Central** adapta-se automaticamente à identidade visual e operacional do setor do utilizador:
*   **Identidade Visual Setorial**:
    *   *Agricultura*: Cores verdes (`emerald`/`green`), terminologia voltada a hectares, talhões e sacos de colheita.
    *   *Pecuária*: Cores âmbar/laranja (`amber`/`orange`), métricas voltadas a cabeças de gado, peso corporal e vacinação.
    *   *Pescas*: Cores azuis (`sky`/`blue`), métricas focadas em viagens de pesca, embarcações e toneladas capturadas.
    *   *Comércio*: Cores roxas/violetas (`brand-purple`/`indigo`), métricas de volume de vendas diário, faturação e controlo de clientes devedores ("Fiado").
*   **Módulo Operacional Customizado**: O cartão de acesso rápido no painel adapta dinamicamente o seu título e comportamento (ex: "Módulo Agrícola", "Módulo Pecuário", "Módulo de Pescas", "Módulo Comercial").
*   **Central de Lançamentos Rápidos (Ações Rápidas - Command Palette `Cmd+K` / `Ctrl+K`)**:
    *   Um atalho global e interface de modal que filtra os formulários de inserção rápida baseando-se estritamente na indústria do utilizador, **ocultando totalmente opções de outros setores** para evitar poluição visual e erros de registo:
        *   **Agricultura**: *Registar Colheita Rápida* (sacos, peso, perdas) e *Aplicação Rápida de Insumos* (fertilizantes, sementes).
        *   **Pecuária**: *Registar Peso e Medição Corporal* (controlo de engorda em kg) e *Lançar Profilaxia ou Vacina* (vacinação preventiva contra aftosa, carbúnculo, etc.).
        *   **Pesca**: *Iniciar Viagem de Pesca* (embarcação, tripulação, combustível) e *Registar Captura de Peixe* (espécies, peso, lotação).
        *   **Comércio**: *Registar Venda Rápida* (faturação e venda a pronto ou fiado) e *Lançar Pagamento / Amortização* (amortizar dívida de clientes fiados).

---

### 3. Módulo de Custos e Despesas de Suporte (`SupportCostsModule.tsx`)
Gerencia de forma cirúrgica todos os custos indiretos e despesas operacionais (OpEx) das organizações:
*   **Recursos Humanos (RH)**: Simulador detalhado de folha salarial angolana, contemplando salários base, subsídios de alimentação e transporte, retenção de IRT (Imposto sobre o Rendimento de Trabalho) e contribuições para a INSS (Instituto Nacional de Segurança Social).
*   **Despesas Administrativas**: Lançamento de custos com eletricidade, água, internet, comunicações, combustível para geradores (essencial no contexto nacional) e manutenção.
*   **Visualização de Distribuição**: Gráficos analíticos que exibem o peso percentual de cada categoria no orçamento mensal da organização.

---

### 4. Módulo Financeiro e de Conformidade (`FinancialModule.tsx`)
Gera relatórios financeiros essenciais estruturados segundo as regras contabilísticas gerais e o Plano Geral de Contabilidade (PGC) angolano:
*   **Demonstração de Resultados do Exercício (DRE)**: Estrutura clássica com Receitas Brutas, Custos de Mercadorias Vendidas (CMV), Margem Bruta, Custos Operacionais, EBITDA, Amortizações, Impostos (como o Imposto Industrial Angolano de 25% ou taxas simplificadas) e Resultado Líquido.
*   **Fluxo de Caixa (Cash Flow)**: Registo de entradas e saídas mensais com categorização entre Atividades Operacionais, de Investimento e de Financiamento.
*   **Balanço Patrimonial Simplificado**: Relação clara de Ativos (Circulantes e Não Circulantes) versus Passivos e Capital Próprio.
*   **Exportação e Impressão**: Opção de gerar relatórios em PDF/Impressão bem-formatados e profissionais para anexar a candidaturas de crédito bancário.

---

### 5. Preparação para Financiamento - Scorecard (`FundingReadinessModule.tsx`)
A joia da coroa da plataforma, que funciona como um avaliador independente de crédito (credit scoring) focado no ecossistema local:
*   **Algoritmo de Pontuação de Viabilidade (0 a 100)**: Mede o nível de preparação da PME ou cooperativa em 5 pilares críticos:
    *   *Governação e Organização Jurídica* (Registo comercial, alvará, NIF).
    *   *Qualidade dos Registos Financeiros* (Existência de DRE, fluxo de caixa atualizado).
    *   *Capacidade de Colateral / Garantias* (Bens, equipamentos, fiadores).
    *   *Métricas de Desempenho Operacional* (Consistência das receitas do setor).
    *   *Histórico de Crédito e Risco*.
*   **Recomendações de Melhoria**: Sugestões automáticas baseadas em regras de decisão de crédito reais dos bancos parceiros (ex: BFA, BAI, BIC, BCI).
*   **Simulador de Linhas de Crédito**: Apresenta e qualifica a PME para as principais linhas nacionais (Apoio ao Crédito - PAC, FADA para agricultura, e microcrédito regulado pelo BNA).

---

### 6. Gestor de Documentos e KYC (`DocumentKYCModule.tsx`)
*   **Pastas de Conformidade Regulamentar**: Repositório digital onde o utilizador armazena, monitoriza a validade e verifica os documentos corporativos exigidos pela legislação angolana e pelo BNA (Banco Nacional de Angola):
    *   *Alvará Comercial / Licença de Exploração* (vital para o exercício de atividade comercial ou industrial).
    *   *Certidão de Registo Comercial Simplificada*.
    *   *NIF da Empresa (Cartão de Contribuinte)*.
    *   *Publicação em Diário da República*.
    *   *Demonstrações Financeiras Certificadas por Perito Contabilista*.
*   **Validador KYC Inteligente**: Sistema que indica a completitude da pasta de documentos para fins de "Diligência Prévia" bancária.

---

### 7. Centro de Decisão Inteligente com IA (`AICenterModule.tsx`)
Interage com a API do **Gemini** (utilizando o SDK `@google/genai` oficial) para fornecer consultoria estratégica de alto nível:
*   **Análise Financeira Automatizada**: A IA analisa as tabelas de custos de suporte e os relatórios financeiros do utilizador para destacar pontos de desperdício, gargalos de liquidez ou áreas de sobrefaturação.
*   **Gerador de Planos de Negócio e Expansão**: Comandos guiados que utilizam dados do setor do utilizador para desenhar planos de expansão realistas de acordo com o mercado provincial e nacional (ex: mercado do Luanda, Huambo, Huíla, Benguela, Cuanza Sul).
*   **Consultor de Financiamento**: Responde a dúvidas sobre taxas de juro, carência de capital e como renegociar dívidas ativas.

---

### 8. Gestão Multilingue e Preferências Gerais (`LanguageContext.tsx` & `ThemeContext.tsx`)
*   **Tradução Integrada**: Alternância completa entre Português (PT) e Inglês (EN) para facilitar a apresentação dos dados a investidores ou parceiros internacionais.
*   **Modo Escuro / Claro**: Interface adaptada para visualização confortável em qualquer ecrã ou ambiente de trabalho.
*   **Configuração de Divisa**: Opção de alternar a exibição financeira de Kwanza (AOA) para Dólar Americano (USD) ou Euro (EUR) com conversão simulada em tempo real.

---

## 🚀 Como Todas as Funcionalidades Cooperam

1.  **Onboarding**: Uma cooperativa agrícola regista-se no **OLO Fintel** e seleciona o setor de **Agricultura**.
2.  **Operação Diária**: Usando os atalhos rápidos (`Cmd+K`), o gestor regista rapidamente o peso da colheita de milho de hoje e os adubos aplicados.
3.  **Gestão de Custos**: No final do mês, lança os salários dos trabalhadores agrícolas e os custos de combustível do trator e do gerador de rega.
4.  **Fecho Financeiro**: O sistema puxa os lançamentos rápidos de colheitas (receita estimada) e despesas de suporte para montar instantaneamente a DRE e o Balanço Patrimonial em conformidade com o PGC.
5.  **Análise de Crédito**: A cooperativa anexa o seu Alvará Comercial e NIF no Gestor KYC. O módulo de **Funding Readiness** processa estes documentos e os dados financeiros gerados, calculando uma nota de viabilidade (ex: 82/100) e indicando que a cooperativa está pronta para concorrer à Linha de Apoio do FADA.
6.  **Apoio de IA**: O utilizador abre o centro de IA, onde o assistente analisa a folha de custos e sugere táticas para otimizar os custos de transporte do milho até aos grandes centros comerciais em Luanda.
