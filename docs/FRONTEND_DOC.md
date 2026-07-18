# GOOGLE AI STUDIO / GEMINI FRONTEND MASTER PROMPT

## OLO Fintel Frontend Generation Prompt

You are a Senior Product Designer, Senior UX Designer, Senior Frontend Architect and Senior Next.js 14 Engineer.

Your task is to generate the complete frontend of OLO Fintel.

Do NOT generate a prototype.

Do NOT generate a simple MVP.

Generate a production-ready platform that looks like a startup ready for incubation, acceleration, investors, banks, SMEs and agricultural cooperatives.

The frontend must look more similar to:

* Stripe
* Notion
* Linear
* Brex
* Ramp
* Mercury
* AgriWebb

than to a hackathon project.

---

# PROJECT

Name:

```text
OLO Fintel
```

Tagline:

```text
Transform operational data into funding readiness.
```

Mission:

```text
Help SMEs and cooperatives become financially organized, bankable and growth-ready.
```

---

# BRANDING

Primary Color:

```text
White
```

Secondary Color:

```text
Iris
```

Official Brand Color:

```text
Premium Purple
```

Support Color:

```text
Black
```

Style:

```text
Modern SaaS
Professional
Institutional
Trustworthy
Data-driven
African-first
```

Avoid:

```text
Crypto style
Web3 style
Gaming style
Flashy gradients
Neon effects
```

---

# TECH STACK

Use:

```text
Next.js 14 App Router
TypeScript
TailwindCSS
Shadcn UI
TanStack Query
React Hook Form
Zod
Lucide Icons
```

---

# RESPONSIVE DESIGN

Must support:

```text
Desktop
Tablet
Mobile
```

Mobile first.

---

# LANDING PAGE

The landing page is extremely important.

The primary audience is:

```text
LISPA jury
Banks
Incubators
Investors
Partners
Cooperatives
SMEs
```

The landing page must feel real.

It must not look like a concept.

---

# LANDING PAGE STRUCTURE

---

## Hero Section

Headline:

```text
Turn your business operations into financial credibility.
```

Subheadline:

```text
OLO Fintel helps cooperatives and SMEs organize operations, improve decision-making and prepare for financing.
```

Primary CTA:

```text
Request Access
```

Secondary CTA:

```text
Answer Survey
```

---

Hero must include:

Dynamic platform metrics.

Example:

```text
Organizations Registered

Funding Readiness Assessments

Contracts Managed

Revenue Tracked

Expenses Recorded

Agricultural Production Logged
```

All metrics fetched from API.

---

# PROBLEM SECTION

Explain:

```text
Most cooperatives and SMEs still manage operations using:

paper
excel
whatsapp
informal records
```

Consequences:

```text
poor visibility
poor decision making
limited financing access
```

---

# SOLUTION SECTION

Explain:

```text
Operations
Finance
Funding Readiness
AI Financial Advisor
CRM
Documents
Analytics
```

Use visual cards.

---

# INDUSTRIES SECTION

Display sectors supported.

---

Agriculture

Show:

```text
Planting
Harvesting
Inputs
Equipment
Weather
Production
```

---

Livestock

Show:

```text
Animals
Vaccination
Breeding
Feed
Mortality
Weight Tracking
```

---

Fisheries

Show:

```text
Trips
Catch
Maintenance
Fuel
Revenue
```

---

Commerce

Show:

```text
Inventory
Sales
Purchases
Customers
Suppliers
```

---

# FUNDING READINESS SECTION

This section is critical.

Show:

```text
Funding Score
```

Breakdown:

```text
Operational Score
Financial Score
Commercial Score
Documentation Score
```

Show realistic visualization.

---

# AI FINANCIAL ADVISOR SECTION

Show:

```text
Executive Advisor

Financial Advisor

Operations Advisor

Funding Advisor
```

Display examples:

```text
Insights

Recommendations

Action Plans

Risk Detection
```

---

# REAL MARKET VALIDATION SECTION

VERY IMPORTANT

Create a dynamic section fed by survey/interview data.

Must consume API data.

Display:

```text
Number of interviews

Top challenges

Top requested features

Province distribution

Sector distribution

Financing challenges

Digitalization challenges
```

Charts:

```text
Bar Chart

Pie Chart

Trend Charts
```

Purpose:

Show market validation to LISPA.

---

# IMPACT SECTION

Display platform impact.

Metrics from backend.

Example:

```text
Organizations onboarded

Funding requests prepared

Documents uploaded

Revenue tracked

Contracts managed
```

---

# TESTIMONIALS SECTION

Dynamic.

API Driven.

---

# FAQ SECTION

Professional FAQ.

---

# FINAL CTA

```text
Ready to become funding-ready?
```

Buttons:

```text
Register Organization

Answer Survey
```

---

# QUESTIONARY PAGE

This is NOT a contact form.

This is a market validation engine.

Every response must be stored in database.

Backend API integration required.

---

Questions Group 1:

Current Business Operations

Examples:

```text
How do you currently manage operations?

Paper

Excel

WhatsApp

ERP

Other
```

---

Questions Group 2:

Current Challenges

Examples:

```text
What is your biggest challenge?

Financing

Inventory

Customers

Production

Reporting

Documents
```

---

Questions Group 3:

Funding Readiness

Examples:

```text
Have you ever applied for financing?

Approved?

Rejected?

Never Applied?
```

---

Questions Group 4:

Value Assessment

Examples:

```text
Would operational analytics help?

Would funding readiness scoring help?

Would AI financial consulting help?

Would document organization help?
```

---

Questions Group 5:

Organization Information

Collect:

```text
Organization Name

Sector

Province

Municipality

Phone

Email

Role
```

Store in database.

---

# AUTHENTICATION

Pages:

```text
Login

Register

Forgot Password

Reset Password
```

---

# REGISTRATION FLOW

Step 1

User Information

```text
Name

Email

Phone

Password
```

---

Step 2

Organization

```text
Organization Name

Industry

Province

Municipality
```

---

Step 3

Role

```text
Owner

Manager

Analyst

Consultant

Member
```

---

Step 4

Required Documents Upload

````

Important:

Documents are uploaded but NOT validated automatically.

Only stored.

---

# DOCUMENT REQUIREMENTS

Dynamic according to industry.

---

Agriculture

```text
Cooperative Registration

Tax Number

Representative ID

Optional Production Documents
````

---

Livestock

```text
Business Registration

Animal Records

Tax Number
```

---

Fisheries

```text
Fishing License

Registration

Tax Number
```

---

Commerce

```text
Business Registration

Tax Number

Representative ID
```

---

# ROLE BASED ACCESS

EXTREMELY IMPORTANT

Users must ONLY see:

```text
pages
menus
features
actions
```

allowed by their role.

Never show inaccessible pages.

Never show inaccessible menu items.

---

# OWNER

Access:

```text
Everything
```

---

# ADMIN

Access:

```text
Operations

Finance

CRM

Documents

Funding
```

---

# MANAGER

Access:

```text
Operations

Analytics

CRM
```

---

# FINANCIAL OFFICER

Access:

```text
Finance

Funding

Documents
```

---

# ANALYST

Access:

```text
Funding Reviews

Applications

Scoring
```

---

# CONSULTANT

Access:

```text
AI Advisor

Organizations Assigned

Recommendations
```

---

# MEMBER

Access:

```text
Assigned Activities Only
```

---

# DASHBOARD SYSTEM

Dashboard must change according to:

```text
Industry
Role
Permissions
```

---

# AGRICULTURE DASHBOARD

Widgets:

```text
Production

Plantings

Harvests

Weather

Inputs

Funding Score
```

---

# LIVESTOCK DASHBOARD

Widgets:

```text
Animals

Vaccinations

Births

Feed Costs

Mortality

Funding Score
```

---

# FISHERIES DASHBOARD

Widgets:

```text
Trips

Catch

Fuel

Maintenance

Revenue

Funding Score
```

---

# COMMERCE DASHBOARD

Widgets:

```text
Sales

Purchases

Inventory

Customers

Suppliers

Funding Score
```

---

# ANALYST PORTAL

Dedicated portal.

Features:

```text
Review Applications

Review Documents

Funding Scoring

Recommendations

Approval Workflow
```

---

# AI ADVISOR INTERFACE

ChatGPT-like interface.

Features:

```text
Conversation History

Recommendations

Action Plans

Saved Insights
```

---

# DESIGN REQUIREMENTS

Must feel:

```text
Professional
Modern
Institutional
Bank-ready
Investor-ready
Production-ready
```

---

# IMPORTANT

Generate:

```text
Layouts

Pages

Components

Forms

Charts

Tables

Navigation

Role-based navigation

Industry-based dashboards

Survey pages

Landing page

Authentication pages

Analyst portal

AI advisor interface
```

Do not use mock startup styling.

Generate a frontend that could realistically be demonstrated to LISPA, banks, investors and SME stakeholders as a serious financial operating system for cooperatives and SMEs.

# ADDENDUM — FRONTEND ARCHITECTURE REQUIREMENTS

## SSR FIRST APPROACH

Use Next.js 14 App Router with a hybrid rendering strategy.

### Public Pages

Must use:

```text
SSR
ISR
SEO Optimization
```

Pages:

```text
Landing Page
Survey
FAQ
Public Statistics
Documentation
```

Goals:

```text
Fast loading
Google indexing
Low bandwidth consumption
Better performance on slow networks
```

---

### Private Application

Use:

```text
Server Components
Streaming
Partial Hydration
Client Components only when needed
```

Avoid SPA-only architecture.

---

# MULTILINGUAL SUPPORT

The platform must be designed from day one as multilingual.

Supported Languages:

```text
Portuguese (Default)

English

Umbundu

Kimbundu
```

Implementation:

```text
next-intl
```

or equivalent enterprise-grade solution.

Requirements:

```text
Language Switcher

Localized Routes

Localized Validation Messages

Localized Dashboard Labels

Localized Notifications
```

Example:

```text
/pt

/en

/umb

/kmb
```

---

# PWA REQUIREMENTS

OLO Fintel must function as a Progressive Web App.

Reason:

Many users operate in:

```text
Rural Areas

Intermittent Connectivity

Low-end Android Devices
```

Requirements:

```text
Installable App

Offline Support

App Manifest

Push Notifications

Offline Cache

Background Sync
```

---

# OFFLINE-FIRST STRATEGY

Critical forms should continue working offline.

Examples:

```text
Planting Records

Harvest Records

Animal Records

Sales Records

Expenses

Survey Responses
```

When internet returns:

```text
Automatic Synchronization
```

---

# LOW BANDWIDTH OPTIMIZATION

The platform must be optimized for Angolan connectivity realities.

Requirements:

```text
Image Optimization

Code Splitting

Lazy Loading

Streaming

Compression

Minimal JS Payload
```

Avoid:

```text
Heavy animations

Large video backgrounds

Excessive client-side rendering
```

---

# ACCESSIBILITY

Minimum WCAG AA compliance.

Requirements:

```text
Keyboard Navigation

Screen Reader Support

High Contrast

Proper Form Labels

Accessible Charts
```

---

# DESIGN FREEDOM

The AI is allowed to improve the design and user experience whenever it identifies opportunities that align with the business goals.

It may:

```text
Improve information architecture

Improve dashboard layouts

Improve onboarding flows

Improve survey experience

Improve navigation

Improve data visualization

Improve mobile usability
```

However, it must never:

```text
Remove core business requirements

Remove role-based access

Remove funding readiness workflows

Remove analyst portal

Remove survey engine

Remove multilingual support

Remove PWA support
```

---

# AFRICA-FIRST DESIGN

The platform should be designed considering:

```text
Angola

SADC Region

Low Digital Literacy

Mobile First Users

Low Connectivity Environments
```

The goal is not to replicate Silicon Valley SaaS products blindly.

The goal is to create a financial operating system that feels native to African SMEs and cooperatives while maintaining international product quality standards.

---

# FRONTEND NORTH STAR

Every screen should help users answer one of these questions:

```text
What is happening in my business?

What should I do next?

Am I ready for financing?

What risks should I solve?

How can I improve performance?
```

The platform should feel like a combination of:

```text
ERP
CRM
Financial Consultant
Funding Readiness Platform
Operational Intelligence System
```

rather than a collection of disconnected modules.
