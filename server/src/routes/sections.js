import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { verifyJwt, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { sanitizeRichText } from "../lib/sanitize.js";

// Section `data` is free-form JSON; sanitize the fields we know are rich text.
const HTML_KEYS = new Set(["text", "content", "html", "body"]);
function sanitizeSectionData(data) {
  if (!data || typeof data !== "object") return data;
  const walk = (val) => {
    if (Array.isArray(val)) return val.map(walk);
    if (val && typeof val === "object") {
      const out = {};
      for (const [k, v] of Object.entries(val)) {
        out[k] = HTML_KEYS.has(k) && typeof v === "string" ? sanitizeRichText(v) : walk(v);
      }
      return out;
    }
    return val;
  };
  return walk(data);
}

// ---------- Public ----------
export const publicSections = Router();

// GET /api/public/sections?page=home  -> enabled sections in order
publicSections.get("/", async (req, res, next) => {
  try {
    const where = { enabled: true };
    if (req.query.page) where.page = String(req.query.page);
    const rows = await prisma.section.findMany({
      where,
      orderBy: [{ order: "asc" }],
    });
    res.json(rows.map((s) => ({ page: s.page, key: s.key, order: s.order, data: s.data || {} })));
  } catch (e) {
    next(e);
  }
});

// GET /api/public/sections/:page/:key -> single section
publicSections.get("/:page/:key", async (req, res, next) => {
  try {
    const row = await prisma.section.findUnique({
      where: { page_key: { page: req.params.page, key: req.params.key } },
    });
    if (!row || !row.enabled) return res.status(404).json({ error: "Not found" });
    res.json({ page: row.page, key: row.key, data: row.data || {} });
  } catch (e) {
    next(e);
  }
});

// ---------- Admin ----------
export const adminSections = Router();
adminSections.use(verifyJwt, requireRole("SUPER_ADMIN", "ADMIN", "EDITOR"));

adminSections.get("/", async (req, res, next) => {
  try {
    const where = {};
    if (req.query.page) where.page = String(req.query.page);
    const rows = await prisma.section.findMany({ where, orderBy: [{ page: "asc" }, { order: "asc" }] });
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

const SectionSchema = z.object({
  page: z.string().min(1),
  key: z.string().min(1),
  label: z.string().optional().nullable(),
  enabled: z.boolean().optional(),
  order: z.number().int().optional(),
  data: z.any().optional(),
});

adminSections.post("/", validate(SectionSchema), async (req, res, next) => {
  try {
    const payload = { ...req.validated };
    if (payload.data !== undefined) payload.data = sanitizeSectionData(payload.data);
    const created = await prisma.section.create({ data: payload });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// Bulk reorder: [{ id, order }]
adminSections.patch("/reorder", async (req, res, next) => {
  try {
    const items = Array.isArray(req.body) ? req.body : [];
    await Promise.all(
      items.map((it) =>
        prisma.section.update({ where: { id: it.id }, data: { order: it.order } })
      )
    );
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

adminSections.patch("/:id", validate(SectionSchema.partial()), async (req, res, next) => {
  try {
    const payload = { ...req.validated };
    if (payload.data !== undefined) payload.data = sanitizeSectionData(payload.data);
    const updated = await prisma.section.update({ where: { id: req.params.id }, data: payload });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

adminSections.delete("/:id", async (req, res, next) => {
  try {
    await prisma.section.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
