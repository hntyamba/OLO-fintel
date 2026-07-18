import { Response } from "express";
import { db } from "../../db/client.ts";
import { AuthenticatedRequest } from "../middleware/auth.ts";

export async function uploadDocument(req: AuthenticatedRequest, res: Response) {
  try {
    const { category, title, fileUrl } = req.body;
    const { organizationId, id: userId } = req.user || {};

    if (!category || !title || !fileUrl || !organizationId || !userId) {
      return res.status(400).json({ success: false, message: "Categoria, título e link do arquivo são obrigatórios." });
    }

    // Create main Document record
    const doc = await db.document.create({
      data: {
        organizationId,
        category,
        title,
        status: "Pending"
      }
    });

    // Create Document Version
    const version = await db.documentVersion.create({
      data: {
        documentId: doc.id,
        fileUrl,
        version: 1,
        uploadedBy: userId
      }
    });

    // Create Audit Log
    await db.auditLog.create({
      data: {
        organizationId,
        userId,
        entity: "Document",
        entityId: doc.id,
        action: "CREATE",
        newValue: JSON.stringify({ category, title, fileUrl })
      }
    }).catch(() => {});

    return res.status(201).json({
      success: true,
      message: "Documento enviado com sucesso para revisão.",
      data: {
        id: doc.id,
        title: doc.title,
        category: doc.category,
        status: doc.status,
        fileUrl: version.fileUrl,
        uploadedAt: version.uploadedAt
      }
    });

  } catch (error: any) {
    console.error("Erro ao enviar documento:", error);
    return res.status(500).json({ success: false, message: "Erro interno no servidor ao submeter documento." });
  }
}

export async function getDocuments(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId } = req.user || {};
    const docs = await db.document.findMany({
      where: { organizationId },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    const formattedDocs = docs.map(d => ({
      id: d.id,
      title: d.title,
      category: d.category,
      status: d.status,
      fileUrl: d.versions[0]?.fileUrl || null,
      updatedAt: d.updatedAt
    }));

    return res.json({ success: true, data: formattedDocs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao obter documentos da organização." });
  }
}

export async function reviewDocument(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { decision, comments } = req.body; // Approved, Rejected
    const { id: reviewerId } = req.user || {};

    if (!decision || !reviewerId) {
      return res.status(400).json({ success: false, message: "A decisão da revisão e a identificação do revisor são necessárias." });
    }

    const doc = await db.document.findUnique({ where: { id } });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Documento não encontrado." });
    }

    const updatedDoc = await db.document.update({
      where: { id },
      data: { status: decision }
    });

    await db.documentReview.create({
      data: {
        documentId: id,
        reviewerId,
        decision,
        comments
      }
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        organizationId: doc.organizationId,
        userId: reviewerId,
        entity: "Document",
        entityId: id,
        action: decision === "Approved" ? "APPROVE" : "REJECT",
        oldValue: JSON.stringify({ status: doc.status }),
        newValue: JSON.stringify({ status: decision, comments })
      }
    }).catch(() => {});

    return res.json({
      success: true,
      message: `Documento avaliado como: ${decision}.`,
      data: {
        id: updatedDoc.id,
        title: updatedDoc.title,
        status: updatedDoc.status
      }
    });

  } catch (error: any) {
    console.error("Erro ao avaliar documento:", error);
    return res.status(500).json({ success: false, message: "Erro interno ao submeter revisão documental." });
  }
}
