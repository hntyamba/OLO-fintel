# XDD — Experience Design Document

## OLO Fintel

### Experience Design & Product Interaction Architecture

**Versão:** 1.1
**Baseado em:** Vision Doc v1.1 + BDD v1.1

---

# 1. Objetivo

Definir a experiência completa do utilizador dentro da plataforma OLO Fintel.

Este documento descreve:

* experiência do utilizador;
* design system;
* navegação;
* dashboards;
* componentes;
* jornadas;
* personalização;
* onboarding;
* comportamento adaptativo;
* interação com IA;
* experiência mobile;
* experiência desktop;
* tema claro/escuro;
* questionário de validação para o júri.

---

# 2. Princípios de UX

## 2.1 Data First

O sistema existe para ajudar a tomar decisões.

Cada ecrã deve responder:

```text
O que está a acontecer?
Porque está a acontecer?
O que devo fazer?
```

---

## 2.2 Contextual

Cada utilizador vê apenas o que é relevante.

---

## 2.3 Progressive Complexity

Novos utilizadores veem apenas o essencial.

A complexidade aumenta conforme:

* maturidade;
* utilização;
* setor;
* permissões.

---

## 2.4 Action Driven

Todo dashboard deve sugerir ações.

Nunca apenas gráficos.

---

## 2.5 Explainability

Toda recomendação IA deve possuir:

```text
Análise

Justificação

Dados utilizados

Ações sugeridas
```

---

## 2.6 Conforto em Qualquer Luz (NOVO)

A plataforma é frequentemente usada em contextos de luz muito diferentes: escritório fechado, campo agrícola sob sol forte, ou registo de operações à noite/madrugada (ex. pescador ao regressar da faina). A interface deve funcionar bem em modo claro e em modo escuro, sem perda de legibilidade ou contraste, em nenhum destes contextos.

---

# 3. Design System

---

## Cores — Modo Claro (padrão)

### Primária — Background

White

```css
#FFFFFF
```

---

### Secondary — Accent

Iris

```css
#5D5FEF
```

---

### Official Purple

```css
#7C3AED
```

---

### Texto Principal

Dark

```css
#111111
```

---

## Cores — Modo Escuro (NOVO)

### Background Base

```css
#0E0E12
```

---

### Surface (cards, sidebar, modais)

```css
#1A1A21
```

---

### Surface Elevada (dropdowns, tooltips)

```css
#232330
```

---

### Accent (mesma identidade, ajustada para contraste AA em fundo escuro)

Iris Dark

```css
#8385FF
```

---

### Official Purple Dark

```css
#A78BFA
```

---

### Texto Principal

```css
#F5F5F7
```

---

### Texto Secundário

```css
#A1A1AA
```

---

### Bordas / Divisores

```css
#2A2A35
```

---

## Estados (comuns a ambos os temas — ajustar luminosidade +/- 10% no escuro para manter contraste AA)

Success

```css
#22C55E
```

---

Warning

```css
#F59E0B
```

---

Danger

```css
#EF4444
```

---

Info

```css
#3B82F6
```

---

## 3.1 Regras do Modo Escuro

* nunca usar preto puro (`#000000`) como fundo — usar `#0E0E12` para reduzir fadiga ocular ("halation");
* gráficos, mapas e badges devem ter paleta própria testada em fundo escuro (não apenas inverter cores);
* imagens/ícones com fundo branco sólido devem ter variante para tema escuro ou fundo transparente;
* contraste mínimo AA (4.5:1) obrigatório em texto sobre fundo em ambos os temas;
* três opções disponíveis: **Claro**, **Escuro**, **Automático** (segue preferência do sistema operativo/hora do dispositivo).

## 3.2 Componente: Toggle de Tema

* Desktop: ícone sol/lua no cabeçalho, junto a Notificações e Perfil (ver secção 6);
* Mobile: dentro de "Perfil" > "Aparência", com os três estados como segmented control;
* Transição aplicada instantaneamente (sem reload), com preferência persistida no perfil do utilizador e por dispositivo enquanto não autenticado.

---

# 4. Personalização Dinâmica

---

# Layer 1

## Role Based Experience

---

### Owner

Vê:

```text
Organização

Finanças

Operações

Funding

IA

Relatórios
```

---

### Manager

Vê:

```text
Operações

Equipa

Inventário

Clientes
```

---

### Financial Officer

Vê:

```text
Receitas

Despesas

Fluxo de Caixa

Funding
```

---

### Analyst

Vê:

```text
Organizações

Documentos

Scoring

Processos
```

---

### Consultant

Vê:

```text
Clientes

Diagnósticos

Planos de ação
```

---

### Jury / Avaliador (NOVO)

Vê apenas:

```text
Painel de Validação (agregado, anonimizado)
```

Sem acesso a nenhum outro módulo operacional, financeiro ou documental de nenhuma organização.

---

# Layer 2

## Industry Based Experience

---

### Agriculture

Ativa:

```text
Talhões

Culturas

Produção

Colheitas

Clima

Insumos
```

---

### Livestock

Ativa:

```text
Rebanho

Saúde

Reprodução

Alimentação
```

---

### Fisheries

Ativa:

```text
Embarcações

Viagens

Capturas

Mercados
```

---

### Commerce

Ativa:

```text
Produtos

Inventário

Compras

Vendas

CRM
```

---

# Layer 3

## Maturity Based Experience

---

### Beginner

Dashboard simples.

---

### Intermediate

Indicadores avançados.

---

### Advanced

Benchmarking

Forecasting

Funding Readiness

AI Insights

---

# 5. Landing Page

---

# Hero Section

Headline:

> Transformamos operações diárias em inteligência financeira.

---

CTA 1

```text
Participar do Piloto
```

---

CTA 2

```text
Responder ao Estudo Nacional
```

---

## Botão de Questionário — Componente Persistente (NOVO)

Além do CTA 2 no Hero, existe um **botão flutuante persistente** ("Responder ao Questionário", com contador tipo "63/100 respostas") visível:

* na landing page (canto inferior direito, fechável, reaparece após 24h se fechado sem responder);
* no rodapé do onboarding, antes do utilizador entrar no dashboard pela primeira vez (não bloqueante — pode ser ignorado);
* como banner discreto e dispensável no topo do Dashboard Executivo, apenas para utilizadores que ainda não responderam.

Este botão desaparece automaticamente (ou passa a "Obrigado, meta atingida") assim que a meta configurada de respostas (50–100) é alcançada.

---

# Dynamic Metrics

Dados em tempo real.

```text
Organizações Registadas

Questionários Respondidos

Províncias Representadas

Receitas Registadas

Transações Processadas
```

---

# Validation Section

Pergunta:

```text
Como gere atualmente a sua organização?
```

---

Questionário integrado, em passos curtos (multi-step), com barra de progresso do próprio formulário e barra de progresso da meta global (ex. "És a resposta nº 64 de 100").

---

# Product Demo Section

Dashboard interativo.

---

# AI Advisor Section

Casos reais simulados.

---

# Roadmap Section

V1

V2

V3

---

# 5.1 Painel do Júri (NOVO)

Página dedicada, acessível por link seguro/temporário ou role "Jury":

## Conteúdo

```text
Total de respostas vs meta (barra de progresso)

Distribuição por província

Distribuição por tipo de organização (cooperativa/PME, setor)

Distribuição por persona (presidente, gestor, analista, consultor)

Respostas por pergunta (gráficos agregados, sem dados pessoais)

Botão: Exportar (PDF / Excel)
```

## Regras de Exibição

* nunca mostrar nome, contacto ou identificação individual de um respondente;
* dados agregados apenas a partir de um mínimo de respostas por segmento (ex. 3+), para evitar reidentificação em segmentos pequenos.

---

# 6. Estrutura Global da Aplicação

---

## Sidebar

```text
Dashboard

Organização

Operações

Inventário

CRM

Finanças

Documentos

Funding

IA

Knowledge Hub

Relatórios
```

---

## Header

Pesquisa Global

Notificações

Toggle de Tema (Claro/Escuro/Automático) — NOVO

Mensagens

Perfil

---

# 7. Dashboard Executivo

Primeiro ecrã após login.

---

# Perguntas que responde

```text
Como estamos?

O que mudou?

Onde perdemos dinheiro?

O que precisa atenção?

O que devo fazer hoje?
```

---

# Executive Summary

Cards

```text
Receita

Despesa

Margem

Liquidez

Funding Score
```

---

# Health Indicators

```text
Financeiro

Operacional

Documental

Comercial
```

---

# AI Recommendations

Priorizadas.

---

# Tasks

Lista diária.

---

# Alerts

Problemas críticos.

---

# 8. Dashboard Agricultura

---

## Produção Atual

```text
Produção Total

Produção por Cultura

Produtividade
```

---

## Talhões

Mapa visual.

---

## Clima

Widget dedicado.

---

## Colheitas

Calendário.

---

## IA Agrícola

Perguntas:

```text
Qual cultura está mais rentável?

Qual talhão produz menos?

Quando devo colher?
```

---

# 9. Dashboard Pecuária

---

## Rebanho

Indicadores:

```text
Total

Nascimento

Óbitos

Gestação
```

---

## Saúde

Vacinas pendentes.

---

## Alimentação

Custos.

---

## IA Pecuária

Perguntas:

```text
Qual lote gera mais lucro?

Quais animais precisam atenção?
```

---

# 10. Dashboard Pesca

---

## Capturas

Por espécie.

---

## Embarcações

Status.

---

## Custos

Combustível.

---

## IA Pesqueira

Perguntas:

```text
Qual embarcação é mais eficiente?
```

---

# 11. Dashboard Comércio

---

## Vendas

Diárias.

---

## Produtos

Mais vendidos.

---

## Inventário

Alertas.

---

## CRM

Pipeline.

---

## IA Comercial

Perguntas:

```text
Quais produtos devo promover?
```

---

# 12. Funding Readiness Center

Uma área inteira da plataforma.

---

## Score Geral

0-100

---

## Subscores

```text
Financeiro

Operacional

Documental

Comercial
```

---

## Checklist

Itens pendentes.

---

## Simulações

```text
Se aumentar receita em 20%

Novo score
```

---

## Plano de Ação

Gerado por IA.

---

# 13. AI Center

Não será um chat genérico.

---

## Advisors

### Executive Advisor

Visão geral.

---

### Financial Advisor

Finanças.

---

### Operations Advisor

Operações.

---

### Commercial Advisor

Vendas.

---

### Funding Advisor

Crédito.

---

# Estrutura de Resposta

```text
Diagnóstico

Riscos

Oportunidades

Ações

Impacto esperado
```

---

# 14. Knowledge Hub

---

## Biblioteca

```text
Artigos

Guias

Vídeos

Modelos

Documentos
```

---

## Trilhas

Agricultura

Pecuária

Pesca

Comércio

Finanças

---

# 15. CRM

---

## Pipeline

Kanban.

---

Etapas:

```text
Lead

Contactado

Negociação

Contrato

Cliente
```

---

# 16. Relatórios

---

## PDF

Exportação.

---

## Excel

Exportação.

---

## Dashboard Share

Link seguro.

---

# 17. Mobile Experience

Prioridade máxima.

---

## Bottom Navigation

```text
Home

Tasks

Adicionar

IA

Perfil
```

---

## Quick Actions

```text
Nova Receita

Nova Venda

Nova Captura

Nova Colheita

Novo Animal
```

---

## Perfil (Mobile) — Aparência (NOVO)

```text
Tema: Claro / Escuro / Automático
Idioma
Notificações
```

---

# 18. Notifications System

---

Tipos:

```text
Operacionais

Financeiras

Documentais

Funding

IA

Validação (progresso do questionário, apenas visível à equipa fundadora/admin)
```

---

# 19. Gamification

---

## Completeness Score

Perfil.

---

## Achievement System

Exemplos:

```text
100 Receitas Registadas

Primeiro Contrato

Funding Ready

Perfil Completo
```

---

# 20. Future Experience Layers

Preparadas na arquitetura desde a V1.

---

## Open Banking

---

## Seguradoras

---

## Pagamento de Impostos

---

## Marketplaces

---

## Dados Satélite

---

## Dados Climáticos Avançados

---

## APIs Governamentais

---

# 21. North Star Experience

Quando um gestor abrir o OLO Fintel pela manhã, deve conseguir responder em menos de 2 minutos:

```text
Como está a minha organização?

Onde estão os problemas?

Onde estão as oportunidades?

O que devo fazer hoje?

Estou preparado para crescer?
```

Se a plataforma responder consistentemente a estas cinco perguntas, ela torna-se parte do dia a dia da organização e deixa de ser apenas um ERP ou uma ferramenta de financiamento.

---

# 22. Anexo — Mapeamento de Páginas Core (NOVO)

Referência rápida para geração de rotas/páginas de forma consistente com este documento.

```text
/                          Landing Page (com botão de questionário)
/questionario              Questionário de validação (multi-step)
/jury                      Painel do Júri (role-gated)
/login, /registo           Autenticação
/onboarding                Criação de organização + setor
/dashboard                 Dashboard Executivo
/dashboard/agricultura     Dashboard setorial
/dashboard/pecuaria        Dashboard setorial
/dashboard/pesca           Dashboard setorial
/dashboard/comercio        Dashboard setorial
/operacoes/*               Módulos operacionais por setor
/financas                  Receitas, Despesas, Fluxo de Caixa
/inventario                Gestão de inventário
/crm                       Pipeline e clientes
/documentos                Gestão documental
/funding                   Funding Readiness Center
/funding/candidatura       Candidatura a financiamento
/ia                        AI Center (advisors)
/relatorios                Relatórios exportáveis
/knowledge-hub             Biblioteca e trilhas
/analista                  Portal de Analistas
/perfil                    Perfil, Aparência (tema), Notificações
```
