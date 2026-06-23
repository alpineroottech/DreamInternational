import { Router } from "express";
import prisma from "./prisma.js";
import { verifyJwt, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { uniqueSlug } from "./slug.js";
import { sanitizeFields } from "./sanitize.js";

const DEFAULT_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

/**
 * Build a pair of routers (public + admin) for a Prisma model using a shared
 * convention: status/visibility filtering, slug uniqueness, HTML sanitization.
 */
export function buildResource(config) {
  const {
    modelName,
    schema,
    hasStatus = true,
    hasVisibility = false,
    hasSlug = true,
    slugFrom = "title",
    htmlFields = [],
    publicShape = (x) => x,
    publicOrderBy,
    adminOrderBy = { updatedAt: "desc" },
    publicBaseWhere = {},
    filterQueryFields = [],
    roles = DEFAULT_ROLES,
  } = config;

  const model = prisma[modelName];
  if (!model) throw new Error(`Unknown Prisma model: ${modelName}`);

  const publicRouter = Router();
  const adminRouter = Router();

  const publicWhere = (req) => {
    const where = { ...publicBaseWhere };
    if (hasStatus) where.status = "PUBLISHED";
    else if (hasVisibility) where.isVisible = true;
    if (req.query.featured === "true") where.isFeatured = true;
    for (const field of filterQueryFields) {
      const val = req.query[field];
      if (val !== undefined && val !== "") where[field] = String(val);
    }
    return where;
  };

  // ---------- Public ----------
  publicRouter.get("/", async (req, res, next) => {
    try {
      const items = await model.findMany({
        where: publicWhere(req),
        orderBy: publicOrderBy || adminOrderBy,
      });
      res.json(items.map(publicShape));
    } catch (e) {
      next(e);
    }
  });

  if (hasSlug) {
    publicRouter.get("/:slug", async (req, res, next) => {
      try {
        const row = await model.findUnique({ where: { slug: req.params.slug } });
        if (!row || (hasStatus && row.status !== "PUBLISHED")) {
          return res.status(404).json({ error: "Not found" });
        }
        res.json(publicShape(row));
      } catch (e) {
        next(e);
      }
    });
  }

  // ---------- Admin ----------
  adminRouter.use(verifyJwt, requireRole(...roles));

  adminRouter.get("/", async (_req, res, next) => {
    try {
      res.json(await model.findMany({ orderBy: adminOrderBy }));
    } catch (e) {
      next(e);
    }
  });

  adminRouter.get("/:id", async (req, res, next) => {
    try {
      const row = await model.findUnique({ where: { id: req.params.id } });
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(row);
    } catch (e) {
      next(e);
    }
  });

  adminRouter.post("/", validate(schema), async (req, res, next) => {
    try {
      const data = sanitizeFields({ ...req.validated }, htmlFields);
      if (hasSlug) data.slug = await uniqueSlug(model, data.slug || data[slugFrom]);
      if (hasStatus && data.status === "PUBLISHED") data.publishedAt = new Date();
      res.status(201).json(await model.create({ data }));
    } catch (e) {
      next(e);
    }
  });

  adminRouter.patch("/:id", validate(schema.partial()), async (req, res, next) => {
    try {
      const existing = await model.findUnique({ where: { id: req.params.id } });
      if (!existing) return res.status(404).json({ error: "Not found" });
      const data = sanitizeFields({ ...req.validated }, htmlFields);
      if (hasSlug && (data.slug !== undefined || data[slugFrom] !== undefined)) {
        data.slug = await uniqueSlug(
          model,
          data.slug || data[slugFrom] || existing[slugFrom],
          existing.id
        );
      }
      if (hasStatus && data.status === "PUBLISHED" && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
      res.json(await model.update({ where: { id: existing.id }, data }));
    } catch (e) {
      next(e);
    }
  });

  adminRouter.delete("/:id", async (req, res, next) => {
    try {
      const existing = await model.findUnique({ where: { id: req.params.id } });
      if (!existing) return res.status(404).json({ error: "Not found" });
      await model.delete({ where: { id: existing.id } });
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  return { publicRouter, adminRouter };
}
