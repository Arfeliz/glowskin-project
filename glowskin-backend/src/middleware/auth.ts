import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token requerido" });
    return;
  }

  const token     = authHeader.slice(7);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({ error: "JWT_SECRET no configurado" });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as { role: string };
    if (payload.role !== "admin") {
      res.status(403).json({ error: "Sin permisos" });
      return;
    }
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}
