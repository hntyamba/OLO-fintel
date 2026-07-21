import { Response } from "express";
import { db } from "../../db/client.ts";
import { AuthenticatedRequest } from "../middleware/auth.ts";

/**
 * Fetch all notifications for the authenticated user
 */
export async function getNotifications(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Utilizador não autenticado." });
    }

    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return res.json({
      success: true,
      notifications
    });
  } catch (error: any) {
    console.error("Erro ao obter notificações:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Mark a single notification as read
 */
export async function markAsRead(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Utilizador não autenticado." });
    }

    if (!id) {
      return res.status(400).json({ success: false, message: "ID da notificação é obrigatório." });
    }

    const notification = await db.notification.findFirst({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notificação não encontrada." });
    }

    const updated = await db.notification.update({
      where: { id },
      data: { readAt: new Date() }
    });

    return res.json({
      success: true,
      message: "Notificação marcada como lida com sucesso.",
      notification: updated
    });
  } catch (error: any) {
    console.error("Erro ao marcar notificação como lida:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Mark all user notifications as read
 */
export async function markAllAsRead(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Utilizador não autenticado." });
    }

    await db.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() }
    });

    return res.json({
      success: true,
      message: "Todas as notificações foram marcadas como lidas."
    });
  } catch (error: any) {
    console.error("Erro ao marcar todas as notificações como lidas:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Create a new notification (useful for testing, administrative triggers, or alerts)
 */
export async function createNotification(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId, type, title, body } = req.body;

    if (!userId || !type || !title || !body) {
      return res.status(400).json({ success: false, message: "userId, type, title e body são requeridos." });
    }

    const newNotification = await db.notification.create({
      data: {
        userId,
        type, // e.g., Operational, Financial, Document, Funding, AI, Validation
        title,
        body,
        readAt: null
      }
    });

    return res.status(201).json({
      success: true,
      message: "Notificação criada com sucesso.",
      notification: newNotification
    });
  } catch (error: any) {
    console.error("Erro ao criar notificação:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
