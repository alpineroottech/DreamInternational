import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { verifyJwt, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

// Keys that are safe to expose publicly (used by the public site layout).
const PUBLIC_KEYS = [
  "siteTitle",
  "tagline",
  "contactEmail",
  "contactPhone",
  "whatsappNumber",
  "address",
  "facebookUrl",
  "instagramUrl",
  "youtubeUrl",
  "tripadvisorUrl",
  "defaultSeoTitle",
  "defaultSeoDescription",
  "defaultOgImage",
];

function rowsToObject(rows) {
  const out = {};
  for (const r of rows) {
    let val = r.value;
    if (r.type === "json" && val != null) {
      try {
        val = JSON.parse(val);
      } catch {
        /* leave as string */
      }
    } else if (r.type === "boolean") {
      val = val === "true";
    } else if (r.type === "number") {
      val = val == null ? null : Number(val);
    }
    out[r.key] = val;
  }
  return out;
}

// ---------- Public settings ----------
export const publicSettings = Router();
publicSettings.get("/", async (_req, res) => {
  const rows = await prisma.setting.findMany({ where: { key: { in: PUBLIC_KEYS } } });
  res.json(rowsToObject(rows));
});

// ---------- Admin settings ----------
export const adminSettings = Router();
adminSettings.use(verifyJwt, requireRole("SUPER_ADMIN", "ADMIN"));

adminSettings.get("/", async (_req, res) => {
  const rows = await prisma.setting.findMany();
  res.json(rowsToObject(rows));
});

const SettingsSchema = z.record(z.string(), z.any());

adminSettings.put("/", validate(SettingsSchema), async (req, res) => {
  const entries = Object.entries(req.validated);
  await Promise.all(
    entries.map(([key, raw]) => {
      let type = "string";
      let value = raw;
      if (typeof raw === "boolean") {
        type = "boolean";
        value = String(raw);
      } else if (typeof raw === "number") {
        type = "number";
        value = String(raw);
      } else if (raw !== null && typeof raw === "object") {
        type = "json";
        value = JSON.stringify(raw);
      }
      return prisma.setting.upsert({
        where: { key },
        update: { value, type },
        create: { key, value, type },
      });
    })
  );
  const rows = await prisma.setting.findMany();
  res.json(rowsToObject(rows));
});
