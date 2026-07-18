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
