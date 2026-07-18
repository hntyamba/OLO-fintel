# DATA_MODEL_DOC

## OLO Fintel

### Domain Data Architecture & Canonical Data Model

**Versão:** 1.0

---

# 1. Objetivo

Definir o modelo de dados canónico da plataforma.

Este documento servirá como base para:

* Prisma Schema
* PostgreSQL Design
* APIs NestJS
* Event System
* AI Context Engine
* Dashboards
* Funding Engine

---

# 2. Arquitetura Multi-Tenant

Todas as entidades de negócio pertencem a uma organização.

```text
Organization
 ├── Users
 ├── Operations
 ├── Finance
 ├── CRM
 ├── Documents
 ├── Funding
 ├── Analytics
 └── AI
```

---

# 3. Core Domain

## Organization

Representa uma entidade económica.

Campos:

```text
id
name
legalName
taxNumber
sector
industry
size
country
province
municipality
address
phone
email
website
status
createdAt
updatedAt
```

---

## OrganizationProfile

```text
organizationId
mission
vision
description
foundedAt
employeeCount
annualRevenue
```

---

## OrganizationSettings

```text
organizationId
currency
language
timezone
theme
notificationsEnabled
```

---

## OrganizationMembership

Relaciona utilizadores e organizações.

```text
id
organizationId
userId
roleId
status
joinedAt
```

---

# 4. Identity Domain

## User

```text
id
firstName
lastName
email
phone
passwordHash
avatar
status
lastLogin
createdAt
```

---

## Role

```text
id
name
description
```

---

## Permission

```text
id
resource
action
```

---

## Session

```text
id
userId
token
expiresAt
```

---

# 5. Industry Domain

## Industry

```text
id
name
code
```

Exemplos:

```text
Agriculture
Livestock
Fisheries
Commerce
Manufacturing
Services
Transport
```

---

# 6. Agriculture Domain

## Farm

```text
id
organizationId
name
location
area
```

---

## Plot

```text
id
farmId
name
area
gpsCoordinates
soilType
status
```

---

## Crop

```text
id
name
category
variety
```

---

## Planting

```text
id
plotId
cropId
startDate
expectedHarvestDate
quantity
unit
```

---

## Harvest

```text
id
plantingId
harvestDate
quantity
quality
losses
```

---

## AgriculturalInput

```text
id
organizationId
name
category
stock
unit
```

---

## InputUsage

```text
id
inputId
plotId
quantity
date
```

---

## Equipment

```text
id
organizationId
name
type
serialNumber
status
```

---

## EquipmentMaintenance

```text
id
equipmentId
type
cost
date
notes
```

---

## WeatherRecord

```text
id
organizationId
temperature
humidity
rainfall
windSpeed
recordedAt
source
```

---

# 7. Livestock Domain

## Animal

```text
id
organizationId
tagNumber
species
breed
gender
birthDate
weight
status
```

---

## Vaccination

```text
id
animalId
vaccine
date
nextDoseDate
```

---

## Treatment

```text
id
animalId
disease
medicine
date
```

---

## Birth

```text
id
motherAnimalId
date
offspringCount
```

---

## Death

```text
id
animalId
cause
date
```

---

## FeedRecord

```text
id
animalId
feedType
quantity
cost
date
```

---

## WeightRecord

```text
id
animalId
weight
date
```

---

# 8. Fisheries Domain

## Vessel

```text
id
organizationId
name
registrationNumber
capacity
status
```

---

## FishingTrip

```text
id
vesselId
departureDate
arrivalDate
fuelCost
crewCount
```

---

## Catch

```text
id
tripId
species
weight
marketValue
```

---

## VesselMaintenance

```text
id
vesselId
maintenanceType
cost
date
```

---

# 9. Commerce Domain

## Product

```text
id
organizationId
sku
name
category
purchasePrice
salePrice
```

---

## Inventory

```text
id
productId
quantity
reserved
available
```

---

## InventoryMovement

```text
id
productId
type
quantity
reason
date
```

---

## PurchaseOrder

```text
id
supplierId
status
totalAmount
```

---

## PurchaseOrderItem

```text
id
purchaseOrderId
productId
quantity
price
```

---

## SaleOrder

```text
id
customerId
status
totalAmount
```

---

## SaleOrderItem

```text
id
saleOrderId
productId
quantity
price
```

---

# 10. CRM Domain

## Lead

```text
id
organizationId
name
phone
email
source
status
```

---

## Opportunity

```text
id
leadId
value
stage
probability
```

---

## Customer

```text
id
organizationId
name
phone
email
taxNumber
```

---

## Supplier

```text
id
organizationId
name
phone
email
taxNumber
```

---

## Contract

```text
id
organizationId
title
customerId
startDate
endDate
value
status
```

---

## Interaction

```text
id
customerId
type
notes
date
```

---

## Task

```text
id
organizationId
title
description
dueDate
status
assignedUserId
```

---

# 11. Finance Domain

## Account

```text
id
organizationId
name
type
balance
```

---

## Revenue

```text
id
organizationId
source
amount
date
category
```

---

## Expense

```text
id
organizationId
description
amount
date
category
```

---

## Transaction

```text
id
accountId
type
amount
reference
date
```

---

## Budget

```text
id
organizationId
period
expectedRevenue
expectedExpense
```

---

## Forecast

```text
id
organizationId
period
projectedRevenue
projectedExpense
```

---

# 12. Documents Domain

## Document

```text
id
organizationId
category
title
currentVersion
status
```

---

## DocumentVersion

```text
id
documentId
fileUrl
version
uploadedBy
uploadedAt
```

---

## DocumentReview

```text
id
documentId
reviewerId
decision
comments
reviewedAt
```

---

# 13. Funding Domain

## FundingProfile

```text
id
organizationId
status
lastAssessmentDate
```

---

## FundingScore

```text
id
organizationId
financialScore
operationalScore
commercialScore
documentScore
finalScore
generatedAt
```

---

## FundingChecklist

```text
id
organizationId
item
status
```

---

## FundingApplication

```text
id
organizationId
requestedAmount
purpose
status
submittedAt
```

---

## FundingReview

```text
id
applicationId
analystId
decision
comments
reviewedAt
```

---

# 14. Analytics Domain

## OrganizationMetrics

Tabela agregada.

```text
id
organizationId
month
year
revenue
expense
cashFlow
inventoryValue
activeContracts
fundingScore
```

---

## KPI

```text
id
organizationId
name
value
period
```

---

## Benchmark

```text
id
industryId
metric
average
top10
top25
```

---

# 15. AI Domain

## AIConversation

```text
id
organizationId
userId
advisorType
createdAt
```

---

## AIMessage

```text
id
conversationId
role
content
createdAt
```

---

## AIRecommendation

```text
id
organizationId
title
description
priority
status
generatedAt
```

---

## AIInsight

```text
id
organizationId
type
title
description
confidence
generatedAt
```

---

## AIActionPlan

```text
id
organizationId
title
description
deadline
status
```

---

# 16. Knowledge Hub Domain

## Course

```text
id
title
description
industryId
```

---

## Lesson

```text
id
courseId
title
content
```

---

## Resource

```text
id
title
type
url
```

---

## Completion

```text
id
userId
courseId
progress
completedAt
```

---

# 17. Survey Domain

## Survey

```text
id
title
description
status
```

---

## Question

```text
id
surveyId
question
type
order
```

---

## Response

```text
id
surveyId
respondentId
submittedAt
```

---

## Answer

```text
id
responseId
questionId
value
```

---

# 18. Notification Domain

## Notification

```text
id
userId
type
title
body
readAt
```

---

## NotificationTemplate

```text
id
name
channel
content
```

---

# 19. Audit Domain

## AuditLog

```text
id
organizationId
userId
entity
entityId
action
oldValue
newValue
ipAddress
createdAt
```

---

# 20. File Storage Domain

## File

```text
id
organizationId
bucket
path
mimeType
size
uploadedBy
uploadedAt
```

---

# 21. Event Registry

Eventos principais:

```text
OrganizationCreated

MemberAdded

RevenueCreated

ExpenseCreated

ContractCreated

DocumentUploaded

DocumentApproved

FundingSubmitted

FundingApproved

HarvestCompleted

AnimalRegistered

VaccinationApplied

CatchRegistered

InventoryUpdated

RecommendationGenerated
```

---

# 22. Index Strategy

Índices obrigatórios:

```text
organizationId

createdAt

status

industryId

userId

documentId

applicationId
```

Índices compostos:

```text
organizationId + createdAt

organizationId + status

organizationId + type

organizationId + category
```

---

# 23. Soft Delete Strategy

Todas as entidades críticas:

```text
deletedAt
deletedBy
```

---

# 24. Future V2 Domains

Preparados desde a V1:

```text
Insurance

OpenBanking

Tax

GovernmentIntegration

Marketplace

SatelliteData

ClimateForecast

Payments

DigitalIdentity
```

---

# 25. Data Architecture North Star

Toda informação operacional gerada por uma organização deve poder ser transformada em:

```text
Operação
↓
Histórico
↓
Indicador
↓
Insight
↓
Score
↓
Decisão
↓
Financiamento
```

Esse é o fluxo central de dados do OLO Fintel e a razão pela qual a plataforma existe.
