# BDD — Business Domain Document

## OLO Fintel

### Business Domain Definition & User Behavior Specification

**Versão:** 1.1
**Baseado em:** Vision Doc v1.1

---

# 1. Objetivo do Documento

Este documento descreve:

* atores do sistema;
* comportamento esperado;
* regras de negócio;
* jornadas;
* épicos;
* histórias de utilizador;
* eventos de negócio;
* critérios de aceitação;
* fluxos operacionais.

O objetivo é servir como ponte entre:

```text
Visão de Negócio
↓
UX
↓
Arquitetura Técnica
↓
Implementação
```

---

# 2. Contexto de Negócio

OLO Fintel é um Economic Operating System desenvolvido para organizações produtivas africanas.

O sistema transforma atividades operacionais do dia a dia em:

* histórico verificável;
* inteligência financeira;
* reputação económica;
* prontidão para financiamento.

## 2.1 Regra de Ouro do Domínio

**Nenhum épico funcional pode depender de um processo de financiamento para gerar valor.** Todo módulo operacional, financeiro, comercial ou documental deve ser utilizável e útil isoladamente, no dia-a-dia, mesmo que a organização nunca submeta uma candidatura a financiamento (ver EPIC 09 e EPIC 10, que são consequência, não pré-requisito, de uso da plataforma).

---

# 3. Stakeholders

## Stakeholders Primários

### PME

Objetivo:

* gerir operação;
* aumentar lucro;
* controlar custos;
* crescer.

---

### Cooperativa

Objetivo:

* coordenar membros;
* gerir produção;
* aumentar vendas;
* obter financiamento.

---

## Stakeholders Secundários

### Analistas

Objetivo:

* avaliar organizações;
* reduzir risco.

---

### Consultores

Objetivo:

* apoiar crescimento.

---

### Parceiros Financeiros

Objetivo:

* identificar organizações financiáveis.

---

### Governo

Objetivo:

* promover formalização;
* estimular produtividade.

---

### Júri / Avaliadores de Validação (novo)

Objetivo:

* avaliar evidência de tração e interesse de mercado;
* consultar resultados agregados do questionário de validação (ver EPIC 15).

---

# 4. Organização como Entidade Central

Toda a plataforma gira em torno da Organização.

```text
Organization
│
├── Users
├── Operations
├── Finance
├── Documents
├── Contracts
├── Assets
├── Reports
├── Funding Profile
└── Preferences (tema, notificações, idioma)
```

---

# 5. Tipos de Organização

## Agricultural Cooperative

Ativa:

* Produção
* Colheitas
* Inventário
* Clima

---

## Livestock Cooperative

Ativa:

* Rebanho
* Reprodução
* Alimentação
* Saúde Animal

---

## Fisheries Cooperative

Ativa:

* Capturas
* Embarcações
* Viagens
* Mercados

---

## Commercial SME

Ativa:

* Compras
* Vendas
* Inventário
* CRM

---

## Industrial SME

Ativa:

* Produção
* Matéria-prima
* Distribuição

---

# 6. Personas

---

## Persona 1

### Presidente de Cooperativa

Responsável por:

* membros;
* produção;
* vendas;
* documentação.

---

Objetivos:

* aumentar receitas;
* organizar cooperativa;
* obter crédito.

---

Dores:

* falta de dados;
* documentação dispersa;
* dificuldade de gestão.

---

# Persona 2

### Gestor PME

Responsável por:

* operação;
* equipa;
* finanças.

---

Objetivos:

* aumentar lucro;
* reduzir custos;
* crescer.

---

Dores:

* falta de controlo;
* decisões intuitivas.

---

# Persona 3

### Analista

Responsável por:

* avaliação;
* validação.

---

Objetivos:

* reduzir risco.

---

Dores:

* documentação inconsistente;
* falta de histórico.

---

# Persona 4

### Consultor

Responsável por:

* acompanhamento;
* melhoria contínua.

---

# 7. Ciclo de Vida da Organização

## Estado 1

Lead

---

## Estado 2

Registada

---

## Estado 3

Perfil Completo

---

## Estado 4

Operacional

---

## Estado 5

Funding Ready

---

## Estado 6

Financiada

---

## Estado 7

Parceira Estratégica

---

# 8. Épicos de Negócio

---

# EPIC 01

## Gestão Organizacional

---

### Objetivo

Criar identidade digital da organização.

---

### User Story

Como gestor

Quero criar a minha organização

Para começar a operar na plataforma.

---

### Critérios

✓ Nome registado

✓ Tipo definido

✓ Setor definido

✓ Localização definida

---

# EPIC 02

## Gestão de Membros

---

### User Story

Como cooperativa

Quero gerir membros

Para acompanhar participação.

---

### Funcionalidades

* adicionar membro;
* remover membro;
* atualizar perfil;
* histórico.

---

# EPIC 03

## Gestão Operacional

---

### User Story

Como gestor

Quero registar atividades

Para acompanhar a operação.

---

### Valor Diário

Este é o épico de uso mais frequente da plataforma: deve ser possível registar uma operação (venda, colheita, alimentação, captura) em **menos de 30 segundos**, a partir do mobile, sem depender de nenhuma etapa de financiamento.

---

AGRICULTURA
Gestão de Terras
Talhões

Campos:

Nome
Código
Área (ha)
Localização GPS
Tipo de solo
Estado
Responsável

Operações:

Criar talhão
Editar talhão
Arquivar talhão
Transferir responsável
Gestão de Culturas

Campos:

Cultura
Variedade
Data de plantio
Data prevista de colheita
Talhão associado
Quantidade plantada
Unidade

Operações:

Registar plantio
Editar plantio
Cancelar plantio
Finalizar ciclo
Gestão de Produção

Registos:

Produção diária
Produção semanal
Produção mensal
Produção sazonal

Campos:

Produto
Quantidade
Unidade
Qualidade
Talhão
Responsável
Gestão de Colheitas

Campos:

Data
Talhão
Produto
Quantidade
Perdas
Observações

Indicadores:

Produtividade por hectare
Produtividade por cultura
Produtividade por período
Gestão de Insumos

Categorias:

Sementes
Fertilizantes
Herbicidas
Pesticidas
Ferramentas
Combustível

Operações:

Entrada
Saída
Transferência
Ajuste
Inventário
Gestão de Equipamentos
Tratores
Bombas
Geradores
Pulverizadores
Veículos

Operações:

Registar manutenção
Registar avaria
Agendar manutenção
Controlar combustível
Gestão Climática

Dados:

Precipitação
Temperatura
Humidade
Velocidade do vento

Funcionalidades:

Alertas climáticos
Histórico climático
Correlação produção-clima
PECUÁRIA
Gestão de Rebanho

Espécies:

Bovinos
Suínos
Caprinos
Ovinos
Aves

Cada animal:

Identificação
Raça
Sexo
Data nascimento
Peso
Estado
Lote
Reprodução

Eventos:

Cobertura
Inseminação
Gestação
Parto
Desmame

Indicadores:

Taxa de fertilidade
Taxa de natalidade
Intervalo entre partos
Saúde Animal

Eventos:

Vacinação
Tratamento
Doença
Consulta veterinária
Quarentena
Óbito

Histórico completo por animal.

Alimentação
Ração
Pastagem
Suplementos
Consumo
Custos
Crescimento

Medições:

Peso
Altura
Ganho médio diário
Produção Animal

Dependendo da espécie:

Leite
Carne
Ovos
Lã
Reprodutores
Comercialização
Venda de animais
Venda de produtos
Contratos
Compradores
PESCA
Gestão de Embarcações

Campos:

Nome
Matrícula
Capacidade
Estado
Motor
Gestão de Viagens

Campos:

Data saída
Data chegada
Tripulação
Combustível
Zona pesca
Capturas

Campos:

Espécie
Quantidade
Peso
Valor
Qualidade
Custos Operacionais
Combustível
Gelo
Alimentação
Manutenção
Taxas
Manutenção

Eventos:

Preventiva
Corretiva
Inspeção
Substituição peças
Comercialização
Lotes
Mercados
Compradores
Contratos
COMÉRCIO
Gestão de Produtos

Campos:

SKU
Código
Categoria
Fornecedor
Preço compra
Preço venda
Inventário

Operações:

Entrada
Saída
Transferência
Ajuste
Inventário físico
Compras

Fluxo:

Pedido
Aprovação
Compra
Receção
Pagamento
Vendas

Fluxo:

Orçamento
Pedido
Fatura
Pagamento
Entrega
CRM

Entidades:

Lead
Cliente
Parceiro
Fornecedor
Contas a Receber
Faturas
Parcelas
Pagamentos
Atrasos
Contas a Pagar
Fornecedores
Despesas
Obrigações

---

# EPIC 04

## Gestão Financeira

---


Como gestor

Quero controlar finanças

Para tomar melhores decisões.

---

### Funcionalidades

* receitas;
* despesas;
* fluxo de caixa;
* projeções.

---

### Critérios

Todas as transações devem possuir:

* data;
* categoria;
* valor;
* responsável.

---

# EPIC 05

## Gestão de Inventário

---

### User Story

Como organização

Quero controlar recursos

Para evitar desperdícios.

---

### Funcionalidades

* entradas;
* saídas;
* alertas;
* níveis mínimos.

---

# EPIC 06

## CRM

---

### User Story

Como organização

Quero gerir clientes

Para aumentar vendas.

---

### Funcionalidades

* leads;
* clientes;
* contratos;
* pipeline.

---

# EPIC 07

## Gestão Documental

---

### User Story

Como organização

Quero centralizar documentos

Para reduzir burocracia.

---

### Documentos

* NIF;
* licença;
* estatutos;
* contratos;
* relatórios.

---

# EPIC 08

## Consultor Financeiro IA

---

### User Story

Como gestor

Quero receber recomendações

Para melhorar desempenho.

---

### Capacidades

* diagnóstico;
* previsão;
* análise;
* explicação.

---

### Exemplo

Pergunta:

```text
Como reduzir custos?
```

Resposta:

```text
Custos logísticos representam 38%
das despesas totais.
```

---

# EPIC 09

## Funding Readiness

---

### User Story

Como organização

Quero saber se estou pronta para financiamento

Para aumentar probabilidade de aprovação.

---

### Componentes

* score;
* checklist;
* documentação;
* recomendações.

---

# EPIC 10

## Candidatura a Financiamento

---

### User Story

Como organização

Quero submeter candidatura

Para procurar financiamento.

---

### Critérios

✓ Score mínimo

✓ Perfil completo

✓ Documentação válida

✓ Histórico mínimo

---

# EPIC 11

## Portal de Analistas

---

### User Story

Como analista

Quero analisar organizações

Para emitir parecer.

---

### Funcionalidades

* revisão;
* comentários;
* aprovação;
* rejeição.

---

# EPIC 12

## Benchmarking

---

### User Story

Como gestor

Quero comparar desempenho

Para identificar oportunidades.

---

### Indicadores

* receitas;
* produtividade;
* margens;
* custos.

---

# EPIC 13

## Knowledge Hub

---

### User Story

Como organização

Quero aprender continuamente

Para melhorar gestão.

---

### Conteúdo

* guias;
* cursos;
* artigos;
* legislação.

---

# EPIC 14 (NOVO)

## Preferências de Interface — Tema Claro/Escuro

---

### User Story

Como utilizador

Quero alternar entre modo claro e modo escuro

Para usar a plataforma confortavelmente em qualquer condição de luz (escritório, campo, ou registo noturno de operações).

---

### Funcionalidades

* alternância manual claro/escuro/automático (segue o sistema operativo);
* preferência guardada por utilizador e sincronizada entre dispositivos;
* aplicação instantânea, sem recarregar a página;
* disponível em todas as áreas: landing page, dashboard, portal de analistas, mobile.

---

### Critérios de Aceitação

✓ Toggle acessível no cabeçalho (desktop) e no perfil (mobile)

✓ Preferência é lembrada no próximo login

✓ Todos os componentes (gráficos, tabelas, mapas) têm variante adaptada ao tema escuro — nenhum texto ou dado perde legibilidade

✓ Opção "Automático" respeita o horário/tema do dispositivo

---

# EPIC 15 (NOVO)

## Questionário de Validação de Mercado

---

### User Story

Como equipa fundadora do OLO Fintel

Quero recolher entre 50 e 100 respostas de um questionário estruturado

Para validar o problema e a proposta de valor perante um júri.

---

### Funcionalidades

* botão/CTA persistente de "Responder ao Questionário" visível na landing page e em pontos estratégicos da aplicação (ver XDD secção 5);
* formulário de questionário em várias etapas (multi-step), com perguntas segmentadas por persona e setor;
* barra de progresso pública mostrando respostas recolhidas vs meta (ex. "63 / 100 respostas");
* impossibilidade de resposta duplicada pelo mesmo utilizador/dispositivo (1 resposta por identificador);
* painel do júri: vista agregada e anonimizada dos resultados, com filtros por província, tipo de organização e persona;
* exportação dos resultados agregados em PDF/Excel para apresentação ao júri;
* encerramento automático (ou aviso) ao atingir a meta configurada de respostas.

---

### Critérios de Aceitação

✓ Meta de respostas é configurável (padrão: 100)

✓ Cada resposta fica associada a metadados não identificáveis (setor, província, tipo de organização) mas não expõe dados pessoais sem consentimento

✓ O botão de questionário não interfere na jornada operacional principal do utilizador — é dispensável/fechável

✓ Painel do júri é acessível apenas por role específica ("Júri"/"Avaliador") ou por link seguro e temporário

---

# 9. Eventos de Negócio

---

## Evento

Receita registada

---

Consequências:

* fluxo atualizado;
* score atualizado;
* relatórios atualizados.

---

## Evento

Despesa registada

---

Consequências:

* rentabilidade recalculada.

---

## Evento

Documento aprovado

---

Consequências:

* score atualizado.

---

## Evento

Contrato criado

---

Consequências:

* previsão atualizada.

---

## Evento

Funding solicitado

---

Consequências:

* processo criado;
* analista notificado.

---

## Evento (NOVO)

Preferência de tema alterada

---

Consequências:

* preferência persistida no perfil do utilizador;
* aplicada em todos os dispositivos na próxima sessão.

---

## Evento (NOVO)

Questionário de validação respondido

---

Consequências:

* contador de respostas atualizado;
* painel do júri recalculado;
* barra de progresso pública atualizada;
* se meta atingida, notificação enviada à equipa fundadora.

---

# 10. KPIs Principais

---

## Organização

* crescimento receita;
* margem;
* liquidez.

---

## Operações

* produtividade;
* eficiência;
* nº médio de registos operacionais por utilizador por dia (indicador central de valor diário).

---

## CRM

* contratos ativos;
* taxa de conversão.

---

## Funding

* score;
* prontidão.

---

## Validação (NOVO)

* nº de respostas recolhidas vs meta (50–100);
* taxa de conclusão do questionário (iniciado vs terminado);
* distribuição de respostas por setor/província.

---

# 11. Regras de Negócio

## Regra 01

Toda organização deve possuir um setor.

---

## Regra 02

Setor define módulos ativos.

---

## Regra 03

Score nunca pode ser alterado manualmente.

---

## Regra 04

Todo documento possui histórico.

---

## Regra 05

Toda decisão de analista é auditável.

---

## Regra 06

Toda recomendação IA deve possuir justificação.

---

## Regra 07

Nenhum financiamento pode ser submetido sem documentação obrigatória.

---

## Regra 08 (NOVA)

Nenhuma funcionalidade core (Operações, Finanças, Documentos, CRM) pode exigir que a organização esteja em processo de financiamento para ser utilizada.

---

## Regra 09 (NOVA)

Cada utilizador/dispositivo só pode submeter uma resposta ao questionário de validação; respostas duplicadas devem ser bloqueadas ou sinalizadas.

---

## Regra 10 (NOVA)

A preferência de tema (claro/escuro/automático) é sempre sobrescrevível pelo utilizador e nunca pode ser forçada pela organização ou pelo administrador.

---

# 12. Métrica Norte

A principal métrica do OLO Fintel será:

> Número de organizações que gerem as suas operações diariamente dentro da plataforma.

Não:

* downloads;
* utilizadores registados;
* visitas.

Mas sim:

* operações registadas;
* transações registadas;
* decisões tomadas com apoio da plataforma.

Porque o verdadeiro objetivo do OLO Fintel é tornar-se o sistema operativo económico diário das PMEs e cooperativas africanas.

Enquanto essa métrica ainda está a ser construída (fase pré-lançamento), a métrica de apoio é o **progresso do questionário de validação (EPIC 15)**, usada como prova de interesse de mercado perante o júri.
