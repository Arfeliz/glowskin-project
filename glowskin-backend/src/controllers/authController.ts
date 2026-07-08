import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "Email y contraseña requeridos" });
    return;
  }

  const adminEmail    = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret     = process.env.JWT_SECRET;

  if (!adminEmail || !adminPassword || !jwtSecret) {
    res.status(500).json({ error: "Configuración de autenticación incompleta" });
    return;
  }

  if (email !== adminEmail || password !== adminPassword) {
    res.status(401).json({ error: "Credenciales incorrectas" });
    return;
  }

  const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "8h" });
  res.json({ token });
}
