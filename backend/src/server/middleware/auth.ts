import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "olo-fintel-secret-key-2026";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "olo-fintel-refresh-secret-key-2026";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    organizationId?: string;
  };
}

// Signs an Access Token
export function signAccessToken(payload: { id: string; email: string; role: string; organizationId?: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

// Signs a Refresh Token
export function signRefreshToken(payload: { id: string }) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

// Auth Middleware to verify tokens
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Acesso negado. Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      organizationId: decoded.organizationId || req.headers["x-organization-id"] as string
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Sessão inválida ou expirada." });
  }
}

// Middleware to restrict access based on roles (case-insensitive comparison)
export function requireRoles(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Não autenticado." });
    }

    const userRoleLower = req.user.role.toLowerCase();
    const allowedLower = allowedRoles.map(r => r.toLowerCase());

    if (!allowedLower.includes(userRoleLower)) {
      return res.status(403).json({ 
        success: false, 
        message: `Acesso proibido. Esta ação requer uma das seguintes funções: ${allowedRoles.join(", ")}` 
      });
    }

    next();
  };
}

// Inject multi-tenant organization context if available
export function injectTenant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const orgIdHeader = req.headers["x-organization-id"] as string;
  if (req.user && orgIdHeader) {
    req.user.organizationId = orgIdHeader;
  }
  next();
}
