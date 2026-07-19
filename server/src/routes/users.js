import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { hashPassword, verifyPassword, validatePasswordStrength } from "../lib/auth.js";
import { verifyJwt, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

// Fields safe to return to the client — never leak passwordHash.
const SAFE_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
};

async function countActiveSuperAdmins(excludeId) {
  return prisma.adminUser.count({
    where: {
      role: "SUPER_ADMIN",
      isActive: true,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
}

// ---------- User management (SUPER_ADMIN only) ----------
export const adminUsers = Router();
adminUsers.use(verifyJwt, requireRole("SUPER_ADMIN"));

adminUsers.get("/", async (_req, res, next) => {
  try {
    const users = await prisma.adminUser.findMany({
      select: SAFE_SELECT,
      orderBy: { createdAt: "asc" },
    });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

const CreateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1),
  role: z.enum(ROLES),
});

adminUsers.post("/", validate(CreateUserSchema), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.validated;

    const strength = validatePasswordStrength(password);
    if (!strength.ok) {
      return res.status(400).json({ error: strength.message });
    }

    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "A user with this email already exists" });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.adminUser.create({
      data: { name, email, passwordHash, role, isActive: true },
      select: SAFE_SELECT,
    });
    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
});

const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(ROLES).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(1).optional(),
});

adminUsers.patch("/:id", validate(UpdateUserSchema), async (req, res, next) => {
  try {
    const existing = await prisma.adminUser.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Not found" });

    const { name, role, isActive, password } = req.validated;
    const data = {};
    if (name !== undefined) data.name = name;
    if (role !== undefined) data.role = role;
    if (isActive !== undefined) data.isActive = isActive;

    // Guard: never let the last active SUPER_ADMIN be demoted or deactivated —
    // that would lock everyone out of user management permanently.
    const losesSuperAdmin =
      existing.role === "SUPER_ADMIN" &&
      existing.isActive &&
      ((role !== undefined && role !== "SUPER_ADMIN") || isActive === false);
    if (losesSuperAdmin) {
      const remaining = await countActiveSuperAdmins(existing.id);
      if (remaining < 1) {
        return res.status(400).json({
          error: "At least one active Super Admin must remain. Promote another user first.",
        });
      }
    }

    if (password !== undefined) {
      const strength = validatePasswordStrength(password);
      if (!strength.ok) {
        return res.status(400).json({ error: strength.message });
      }
      data.passwordHash = await hashPassword(password);
    }

    const user = await prisma.adminUser.update({
      where: { id: existing.id },
      data,
      select: SAFE_SELECT,
    });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

adminUsers.delete("/:id", async (req, res, next) => {
  try {
    const existing = await prisma.adminUser.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Not found" });

    if (existing.id === req.user.sub) {
      return res.status(400).json({ error: "You cannot delete your own account" });
    }

    if (existing.role === "SUPER_ADMIN" && existing.isActive) {
      const remaining = await countActiveSuperAdmins(existing.id);
      if (remaining < 1) {
        return res.status(400).json({
          error: "At least one active Super Admin must remain. Promote another user first.",
        });
      }
    }

    await prisma.adminUser.delete({ where: { id: existing.id } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ---------- Self-service password change (any authenticated admin user) ----------
export const selfAccount = Router();
selfAccount.use(verifyJwt);

const ChangeOwnPasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

selfAccount.patch("/password", validate(ChangeOwnPasswordSchema), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.validated;
    const user = await prisma.adminUser.findUnique({ where: { id: req.user.sub } });
    if (!user || !user.isActive) return res.status(401).json({ error: "Not authenticated" });

    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Current password is incorrect" });

    const strength = validatePasswordStrength(newPassword);
    if (!strength.ok) {
      return res.status(400).json({ error: strength.message });
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
