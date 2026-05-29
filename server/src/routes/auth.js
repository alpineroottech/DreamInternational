import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { verifyPassword, signToken } from "../lib/auth.js";
import { verifyJwt } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." },
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", loginLimiter, validate(LoginSchema), async (req, res) => {
  const { email, password } = req.validated;
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const token = signToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60 * 1000,
  });

  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ ok: true });
});

router.get("/me", verifyJwt, async (req, res) => {
  const user = await prisma.adminUser.findUnique({ where: { id: req.user.sub } });
  if (!user || !user.isActive) return res.status(401).json({ error: "Not authenticated" });
  return res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

export default router;
