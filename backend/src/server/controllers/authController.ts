import { Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../../db/client.ts";
import { AuthenticatedRequest, signAccessToken, signRefreshToken } from "../middleware/auth.ts";

export async function register(req: AuthenticatedRequest, res: Response) {
  try {
    const { firstName, lastName, email, password, phone, organizationName, sector } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Este e-mail já está em uso." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create User, Organization, Settings, Profile and Membership in a transaction or sequential operations
    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        status: "Active"
      }
    });

    let organizationId = undefined;
    let userRole = "Member";

    if (organizationName && sector) {
      const org = await db.organization.create({
        data: {
          name: organizationName,
          sector,
          status: "Active"
        }
      });

      organizationId = org.id;
      userRole = "Owner";

      // Create Settings & Profile
      await db.organizationSettings.create({
        data: {
          organizationId: org.id,
          theme: "system",
          language: "pt"
        }
      });

      await db.organizationProfile.create({
        data: {
          organizationId: org.id,
          description: `Organização focada no setor de ${sector}.`
        }
      });

      // Create Membership
      await db.organizationMembership.create({
        data: {
          organizationId: org.id,
          userId: user.id,
          roleId: "Owner",
          status: "Active"
        }
      });

      // Create Funding Profile
      await db.fundingProfile.create({
        data: {
          organizationId: org.id,
          status: "NotStarted"
        }
      });
    }

    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: userRole,
      organizationId
    });

    const refreshToken = signRefreshToken({ id: user.id });

    // Store session
    await db.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    return res.status(201).json({
      success: true,
      message: "Usuário registado com sucesso.",
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        },
        accessToken,
        refreshToken,
        organizationId,
        role: userRole
      }
    });

  } catch (error: any) {
    console.error("Erro no registo de utilizador:", error);
    return res.status(500).json({ success: false, message: "Erro interno no servidor ao registar utilizador." });
  }
}

export async function login(req: AuthenticatedRequest, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "E-mail e senha são obrigatórios." });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: "E-mail ou senha incorretos." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "E-mail ou senha incorretos." });
    }

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Fetch user membership and role
    const membership = await db.organizationMembership.findFirst({
      where: { userId: user.id, status: "Active" }
    });

    const role = membership ? membership.roleId : "Member";
    const organizationId = membership ? membership.organizationId : undefined;

    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role,
      organizationId
    });

    const refreshToken = signRefreshToken({ id: user.id });

    // Create session
    await db.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        },
        accessToken,
        refreshToken,
        organizationId,
        role
      }
    });

  } catch (error: any) {
    console.error("Erro no login:", error);
    return res.status(500).json({ success: false, message: "Erro interno ao realizar login." });
  }
}

export async function refresh(req: AuthenticatedRequest, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token é obrigatório." });
    }

    const session = await db.session.findUnique({
      where: { token: refreshToken }
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: "Refresh token inválido ou expirado." });
    }

    const user = await db.user.findUnique({ where: { id: session.userId } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Utilizador não encontrado." });
    }

    const membership = await db.organizationMembership.findFirst({
      where: { userId: user.id, status: "Active" }
    });

    const role = membership ? membership.roleId : "Member";
    const organizationId = membership ? membership.organizationId : undefined;

    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role,
      organizationId
    });

    return res.json({
      success: true,
      data: {
        accessToken
      }
    });

  } catch (error: any) {
    console.error("Erro ao renovar token:", error);
    return res.status(500).json({ success: false, message: "Erro interno ao renovar token de acesso." });
  }
}

export async function logout(req: AuthenticatedRequest, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await db.session.delete({ where: { token: refreshToken } }).catch(() => {});
    }
    return res.json({ success: true, message: "Sessão encerrada com sucesso." });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao encerrar sessão." });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId, name, email, password, province, organizationName, industry } = req.body;
    const requesterId = req.user?.id;

    if (!requesterId) {
      return res.status(401).json({ success: false, message: "Não autenticado." });
    }

    const targetUserId = userId || requesterId;

    const user = await db.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilizador não encontrado." });
    }

    const updateData: any = {};
    if (name) {
      const parts = name.split(" ");
      updateData.firstName = parts[0] || user.firstName;
      updateData.lastName = parts.slice(1).join(" ") || user.lastName;
    }
    if (email) updateData.email = email;
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10);

    if (Object.keys(updateData).length > 0) {
      await db.user.update({ where: { id: targetUserId }, data: updateData });
    }

    const membership = await db.organizationMembership.findFirst({
      where: { userId: targetUserId, status: "Active" }
    });

    if (membership && (organizationName || industry || province)) {
      const orgUpdateData: any = {};
      if (organizationName) orgUpdateData.name = organizationName;
      if (industry) orgUpdateData.sector = industry;
      if (province) orgUpdateData.province = province;

      if (Object.keys(orgUpdateData).length > 0) {
        await db.organization.update({
          where: { id: membership.organizationId },
          data: orgUpdateData
        });
      }
    }

    return res.json({ success: true, message: "Perfil atualizado com sucesso." });
  } catch (error: any) {
    console.error("Erro ao atualizar perfil:", error);
    return res.status(500).json({ success: false, message: "Erro ao atualizar perfil." });
  }
}
