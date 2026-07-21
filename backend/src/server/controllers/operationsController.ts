import { Response } from "express";
import { db } from "../../db/client.ts";
import { AuthenticatedRequest } from "../middleware/auth.ts";

// ==========================================
// AGRICULTURE OPERATIONAL CONTROLLER
// ==========================================

export async function createFarm(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, location, area } = req.body;
    const { organizationId } = req.user || {};

    if (!name || !organizationId) {
      return res.status(400).json({ success: false, message: "Nome da fazenda é obrigatório." });
    }

    const farm = await db.farm.create({
      data: {
        organizationId,
        name,
        location,
        area: area ? parseFloat(area) : 0.0
      }
    });

    return res.status(201).json({ success: true, data: farm });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao registar fazenda." });
  }
}

export async function getFarms(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId } = req.user || {};
    const farms = await db.farm.findMany({
      where: { organizationId },
      include: { plots: true }
    });
    return res.json({ success: true, data: farms });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao obter fazendas." });
  }
}

export async function createHarvest(req: AuthenticatedRequest, res: Response) {
  try {
    const { plantingId, harvestDate, quantity, quality, losses, notes } = req.body;
    if (!plantingId || !quantity || !harvestDate) {
      return res.status(400).json({ success: false, message: "Dados de colheita obrigatórios em falta." });
    }

    const harvest = await db.harvest.create({
      data: {
        plantingId,
        harvestDate: new Date(harvestDate),
        quantity: parseFloat(quantity),
        quality: quality || "Standard",
        losses: losses ? parseFloat(losses) : 0.0,
        notes
      }
    });

    return res.status(201).json({ success: true, data: harvest });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao registar colheita." });
  }
}

export async function getHarvests(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId } = req.user || {};
    const harvests = await db.harvest.findMany({
      where: {
        planting: {
          plot: {
            farm: { organizationId }
          }
        }
      },
      include: {
        planting: {
          include: { crop: true }
        }
      }
    });
    return res.json({ success: true, data: harvests });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao obter colheitas." });
  }
}

// ==========================================
// LIVESTOCK OPERATIONAL CONTROLLER
// ==========================================

export async function registerAnimal(req: AuthenticatedRequest, res: Response) {
  try {
    const { tagNumber, species, breed, gender, birthDate, weight } = req.body;
    const { organizationId } = req.user || {};

    if (!tagNumber || !species || !gender || !organizationId) {
      return res.status(400).json({ success: false, message: "Identificação, espécie e gênero são obrigatórios." });
    }

    const animal = await db.animal.create({
      data: {
        organizationId,
        tagNumber,
        species,
        breed,
        gender,
        birthDate: birthDate ? new Date(birthDate) : null,
        weight: weight ? parseFloat(weight) : null,
        status: "Active"
      }
    });

    return res.status(201).json({ success: true, data: animal });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Erro ao registar animal." });
  }
}

export async function getAnimals(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId } = req.user || {};
    const animals = await db.animal.findMany({
      where: { organizationId },
      include: { vaccinations: true, treatments: true }
    });
    return res.json({ success: true, data: animals });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao obter rebanho." });
  }
}

// ==========================================
// FISHERIES OPERATIONAL CONTROLLER
// ==========================================

export async function registerVessel(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, registrationNumber, capacity } = req.body;
    const { organizationId } = req.user || {};

    if (!name || !registrationNumber || !organizationId) {
      return res.status(400).json({ success: false, message: "Nome e matrícula da embarcação obrigatórios." });
    }

    const vessel = await db.vessel.create({
      data: {
        organizationId,
        name,
        registrationNumber,
        capacity: capacity ? parseFloat(capacity) : 0.0,
        status: "Operational"
      }
    });

    return res.status(201).json({ success: true, data: vessel });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao registar embarcação." });
  }
}

export async function getVessels(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId } = req.user || {};
    const vessels = await db.vessel.findMany({
      where: { organizationId }
    });
    return res.json({ success: true, data: vessels });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao obter frota marítima." });
  }
}

export async function recordCatch(req: AuthenticatedRequest, res: Response) {
  try {
    const { tripId, species, weight, marketValue } = req.body;

    if (!tripId || !species || !weight) {
      return res.status(400).json({ success: false, message: "Identificação da viagem, espécie e peso são obrigatórios." });
    }

    const catchRecord = await db.catch.create({
      data: {
        tripId,
        species,
        weight: parseFloat(weight),
        marketValue: marketValue ? parseFloat(marketValue) : 0.0
      }
    });

    return res.status(201).json({ success: true, data: catchRecord });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao registar captura de pescado." });
  }
}

// ==========================================
// COMMERCE OPERATIONAL CONTROLLER
// ==========================================

export async function createProduct(req: AuthenticatedRequest, res: Response) {
  try {
    const { sku, name, category, purchasePrice, salePrice, initialStock } = req.body;
    const { organizationId } = req.user || {};

    if (!name || !category || !organizationId) {
      return res.status(400).json({ success: false, message: "Nome e categoria do produto são obrigatórios." });
    }

    const product = await db.product.create({
      data: {
        organizationId,
        sku,
        name,
        category,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : 0.0,
        salePrice: salePrice ? parseFloat(salePrice) : 0.0,
        status: "Active"
      }
    });

    // Create default inventory
    await db.inventory.create({
      data: {
        productId: product.id,
        quantity: initialStock ? parseFloat(initialStock) : 0.0,
        available: initialStock ? parseFloat(initialStock) : 0.0
      }
    });

    return res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Erro ao criar produto." });
  }
}

export async function getProducts(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId } = req.user || {};
    const products = await db.product.findMany({
      where: { organizationId },
      include: { inventory: true }
    });
    return res.json({ success: true, data: products });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao obter catálogo de produtos." });
  }
}

// ==========================================
// UNIFIED OPERATIONS CONTROLLER
// ==========================================

export async function getUnifiedOperations(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId } = req.user || {};
    if (!organizationId) {
      return res.status(400).json({ success: false, message: "组织ID é obrigatório." });
    }

    const org = await db.organization.findUnique({ where: { id: organizationId } });
    const sector = org?.sector || "";

    const logs: any[] = [];

    if (sector.includes("Agricult") || sector.includes("agricult")) {
      const farms = await db.farm.findMany({
        where: { organizationId },
        include: { plots: { include: { plantings: { include: { crop: true } } } } }
      });
      for (const farm of farms) {
        logs.push({
          id: farm.id,
          orgId: organizationId,
          type: "FARM",
          title: farm.name,
          quantity: farm.area,
          unit: "ha",
          amount: 0,
          notes: farm.location || "",
          date: farm.createdAt.toISOString().split("T")[0]
        });
        for (const plot of farm.plots) {
          for (const planting of plot.plantings) {
            logs.push({
              id: planting.id,
              orgId: organizationId,
              type: "PLANTING",
              title: `${planting.crop?.name || "Cultura"} - ${plot.name}`,
              quantity: planting.quantity,
              unit: planting.unit,
              amount: 0,
              notes: `Estado: ${planting.status}`,
              date: planting.startDate.toISOString().split("T")[0]
            });
          }
        }
      }

      const harvests = await db.harvest.findMany({
        where: { planting: { plot: { farm: { organizationId } } } },
        include: { planting: { include: { crop: true } } }
      });
      for (const h of harvests) {
        logs.push({
          id: h.id,
          orgId: organizationId,
          type: "HARVEST",
          title: `Colheita - ${h.planting?.crop?.name || "Cultura"}`,
          quantity: h.quantity,
          unit: "kg",
          amount: 0,
          notes: h.notes || `Qualidade: ${h.quality}`,
          date: h.harvestDate.toISOString().split("T")[0]
        });
      }
    }

    if (sector.includes("Pecu") || sector.includes("pecu") || sector.includes("Livestock")) {
      const animals = await db.animal.findMany({ where: { organizationId } });
      for (const a of animals) {
        logs.push({
          id: a.id,
          orgId: organizationId,
          type: "ANIMAL",
          title: `${a.species} - ${a.tagNumber}`,
          quantity: a.weight || 0,
          unit: "kg",
          amount: 0,
          notes: `Raça: ${a.breed || "N/A"} | Estado: ${a.status}`,
          date: (a.birthDate || a.createdAt).toISOString().split("T")[0]
        });
      }
    }

    if (sector.includes("Pesca") || sector.includes("pesca") || sector.includes("Fisheries")) {
      const vessels = await db.vessel.findMany({ where: { organizationId } });
      for (const v of vessels) {
        logs.push({
          id: v.id,
          orgId: organizationId,
          type: "VESSEL",
          title: v.name,
          quantity: v.capacity,
          unit: "t",
          amount: 0,
          notes: `Matrícula: ${v.registrationNumber} | Estado: ${v.status}`,
          date: v.createdAt.toISOString().split("T")[0]
        });
      }
    }

    if (sector.includes("Comércio") || sector.includes("comerc") || sector.includes("Commerce") || !sector) {
      const products = await db.product.findMany({ where: { organizationId } });
      for (const p of products) {
        logs.push({
          id: p.id,
          orgId: organizationId,
          type: "PRODUCT",
          title: p.name,
          quantity: 0,
          unit: "un",
          amount: p.salePrice,
          notes: `Categoria: ${p.category} | Estado: ${p.status}`,
          date: p.createdAt.toISOString().split("T")[0]
        });
      }
    }

    const revenues = await db.revenue.findMany({ where: { organizationId } });
    for (const r of revenues) {
      logs.push({
        id: r.id,
        orgId: organizationId,
        type: "SALE",
        title: r.source,
        quantity: 1,
        unit: "un",
        amount: r.amount,
        notes: `Categoria: ${r.category}`,
        date: r.date.toISOString().split("T")[0]
      });
    }

    const expenses = await db.expense.findMany({ where: { organizationId } });
    for (const e of expenses) {
      logs.push({
        id: e.id,
        orgId: organizationId,
        type: "EXPENSE",
        title: e.description,
        quantity: 1,
        unit: "un",
        amount: e.amount,
        notes: `Categoria: ${e.category}`,
        date: e.date.toISOString().split("T")[0]
      });
    }

    logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return res.json({ success: true, data: logs });
  } catch (error: any) {
    console.error("Erro ao obter operações unificadas:", error);
    return res.status(500).json({ success: false, message: "Erro ao obter operações." });
  }
}

export async function addUnifiedOperation(req: AuthenticatedRequest, res: Response) {
  try {
    const { type, title, quantity, unit, amount, notes, date } = req.body;
    const { organizationId } = req.user || {};

    if (!type || !organizationId) {
      return res.status(400).json({ success: false, message: "Tipo de operação e organização são obrigatórios." });
    }

    switch (type) {
      case "SALE":
        await db.revenue.create({
          data: {
            organizationId,
            source: title || "Venda",
            amount: parseFloat(amount) || 0,
            date: date ? new Date(date) : new Date(),
            category: "Sales"
          }
        });
        break;
      case "EXPENSE":
        await db.expense.create({
          data: {
            organizationId,
            description: title || "Despesa",
            amount: parseFloat(amount) || 0,
            date: date ? new Date(date) : new Date(),
            category: "Operational"
          }
        });
        break;
      default:
        break;
    }

    return res.status(201).json({ success: true, message: "Operação registada com sucesso." });
  } catch (error: any) {
    console.error("Erro ao adicionar operação:", error);
    return res.status(500).json({ success: false, message: "Erro ao registar operação." });
  }
}
