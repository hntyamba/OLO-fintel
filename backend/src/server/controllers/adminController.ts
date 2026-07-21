import { Response } from "express";
import { db } from "../../db/client.ts";
import { AuthenticatedRequest } from "../middleware/auth.ts";

export async function getOrganizations(req: AuthenticatedRequest, res: Response) {
  try {
    const organizations = await db.organization.findMany({
      include: {
        profile: true,
        settings: true,
        memberships: {
          where: { status: "Active" },
          include: { role: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const result = organizations.map((org) => {
      const ownerMembership = org.memberships.find((m) => m.role?.name === "Owner");
      return {
        id: org.id,
        name: org.name,
        sector: org.sector,
        province: org.province || "Não definido",
        maturity: "BEGINNER",
        suspended: org.status === "Suspended",
        suspendedReason: undefined,
        assignedConsultantId: null
      };
    });

    return res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Erro ao obter organizações:", error);
    return res.status(500).json({ success: false, message: "Erro ao obter organizações." });
  }
}

export async function getUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        createdAt: true,
        memberships: {
          where: { status: "Active" },
          select: {
            organizationId: true,
            roleId: true,
            organization: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const result = users.map((u) => {
      const membership = u.memberships[0];
      return {
        id: u.id,
        name: `${u.firstName} ${u.lastName}`.trim(),
        email: u.email,
        role: membership?.roleId || "Member",
        organizationId: membership?.organizationId || null,
        organizationName: membership?.organization?.name || null,
        fundingScore: 0
      };
    });

    return res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Erro ao obter utilizadores:", error);
    return res.status(500).json({ success: false, message: "Erro ao obter utilizadores." });
  }
}

export async function getConsultants(req: AuthenticatedRequest, res: Response) {
  try {
    const consultantRole = await db.role.findUnique({ where: { name: "Consultant" } });
    if (!consultantRole) {
      return res.json({ success: true, data: [] });
    }

    const consultants = await db.organizationMembership.findMany({
      where: { roleId: consultantRole.id, status: "Active" },
      select: {
        userId: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        organizationId: true
      }
    });

    const consultantMap = new Map<string, { id: string; name: string; email: string; assignedOrgs: string[] }>();
    for (const c of consultants) {
      const existing = consultantMap.get(c.userId);
      if (existing) {
        existing.assignedOrgs.push(c.organizationId);
      } else {
        consultantMap.set(c.userId, {
          id: c.user.id,
          name: `${c.user.firstName} ${c.user.lastName}`.trim(),
          email: c.user.email,
          assignedOrgs: [c.organizationId]
        });
      }
    }

    return res.json({ success: true, data: Array.from(consultantMap.values()) });
  } catch (error: any) {
    console.error("Erro ao obter consultores:", error);
    return res.status(500).json({ success: false, message: "Erro ao obter consultores." });
  }
}

export async function getAdminDocuments(req: AuthenticatedRequest, res: Response) {
  try {
    const documents = await db.document.findMany({
      include: {
        versions: { orderBy: { version: "desc" }, take: 1 }
      },
      orderBy: { updatedAt: "desc" }
    });

    const result = documents.map((doc) => ({
      id: doc.id,
      orgId: doc.organizationId,
      name: doc.title,
      type: doc.category,
      uploadedAt: doc.updatedAt?.toISOString() || doc.createdAt.toISOString(),
      status: doc.status === "Approved" ? "VERIFIED" : doc.status === "Rejected" ? "REJECTED" : "PENDING",
      version: doc.currentVersion,
      feedback: undefined
    }));

    return res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Erro ao obter documentos admin:", error);
    return res.status(500).json({ success: false, message: "Erro ao obter documentos." });
  }
}

export async function documentAction(req: AuthenticatedRequest, res: Response) {
  try {
    const { documentId, action, feedback } = req.body;
    const userId = req.user?.id;

    if (!documentId || !action) {
      return res.status(400).json({ success: false, message: "documentId e action são obrigatórios." });
    }

    const statusMap: Record<string, string> = {
      VERIFIED: "Approved",
      APPROVED: "Approved",
      REJECTED: "Rejected"
    };

    const newStatus = statusMap[action] || action;

    const doc = await db.document.findUnique({ where: { id: documentId } });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Documento não encontrado." });
    }

    await db.document.update({
      where: { id: documentId },
      data: { status: newStatus }
    });

    if (userId) {
      await db.documentReview.create({
        data: {
          documentId,
          reviewerId: userId,
          decision: newStatus as "Approved" | "Rejected",
          comments: feedback
        }
      }).catch(() => {});
    }

    return res.json({ success: true, message: `Documento ${action} com sucesso.` });
  } catch (error: any) {
    console.error("Erro ao processar ação no documento:", error);
    return res.status(500).json({ success: false, message: "Erro ao processar ação no documento." });
  }
}

export async function delegateConsultant(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId, consultantId } = req.body;

    if (!organizationId || !consultantId) {
      return res.status(400).json({ success: false, message: "organizationId e consultantId são obrigatórios." });
    }

    const consultantRole = await db.role.findUnique({ where: { name: "Consultant" } });
    if (!consultantRole) {
      return res.status(500).json({ success: false, message: "Role Consultant não encontrada." });
    }

    const existing = await db.organizationMembership.findFirst({
      where: { organizationId, userId: consultantId }
    });

    if (existing) {
      await db.organizationMembership.update({
        where: { id: existing.id },
        data: { status: "Active", roleId: consultantRole.id }
      });
    } else {
      await db.organizationMembership.create({
        data: {
          organizationId,
          userId: consultantId,
          roleId: consultantRole.id,
          status: "Active"
        }
      });
    }

    return res.json({ success: true, message: "Consultor delegado com sucesso." });
  } catch (error: any) {
    console.error("Erro ao delegar consultor:", error);
    return res.status(500).json({ success: false, message: "Erro ao delegar consultor." });
  }
}

export async function suspendOrganization(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId, suspend, reason } = req.body;

    if (!organizationId || typeof suspend !== "boolean") {
      return res.status(400).json({ success: false, message: "organizationId e suspend (boolean) são obrigatórios." });
    }

    const org = await db.organization.findUnique({ where: { id: organizationId } });
    if (!org) {
      return res.status(404).json({ success: false, message: "Organização não encontrada." });
    }

    await db.organization.update({
      where: { id: organizationId },
      data: { status: suspend ? "Suspended" : "Active" }
    });

    return res.json({
      success: true,
      message: suspend
        ? `Organização suspensa. Motivo: ${reason || 'Não especificado'}`
        : "Organização reativada com sucesso."
    });
  } catch (error: any) {
    console.error("Erro ao suspender organização:", error);
    return res.status(500).json({ success: false, message: "Erro ao processar suspensão." });
  }
}
