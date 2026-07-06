import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { verifyJwt, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { uniqueSlug } from "../lib/slug.js";
import { sanitizeFields } from "../lib/sanitize.js";

const HTML_FIELDS = ["description", "bestTimeToVisit", "gettingThere", "tips"];

// ---------- Public router (published only) ----------
export const publicDestinations = Router();

// Strip internal/draft metadata; return a flat, display-ready shape.
function toPublic(d) {
  return {
    slug: d.slug,
    name: d.name,
    shortDescription: d.shortDescription,
    descriptionHtml: d.description,
    heroImage: { url: d.heroImageUrl, alt: d.heroImageAlt },
    cardImage: { url: d.cardImageUrl, alt: d.cardImageAlt },
    galleryImages: d.galleryImages || [],
    bestTimeToVisit: d.bestTimeToVisit,
    gettingThere: d.gettingThere,
    tips: d.tips,
    thingsToDo: d.thingsToDo || [],
    price: d.price,
    basePrice: d.basePrice,
    isFeatured: d.isFeatured,
    seo: {
      title: d.seoTitle || d.name,
      description: d.seoDescription || d.shortDescription,
      ogImage: d.ogImageUrl || d.heroImageUrl,
      canonical: d.canonicalUrl,
    },
  };
}

publicDestinations.get("/", async (req, res) => {
  const where = { status: "PUBLISHED" };
  if (req.query.featured === "true") where.isFeatured = true;
  const items = await prisma.destination.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
  });
  res.json(items.map(toPublic));
});

publicDestinations.get("/:slug", async (req, res) => {
  const d = await prisma.destination.findUnique({ where: { slug: req.params.slug } });
  if (!d || d.status !== "PUBLISHED") {
    return res.status(404).json({ error: "Destination not found" });
  }
  return res.json(toPublic(d));
});

// ---------- Admin router (auth + role) ----------
export const adminDestinations = Router();
adminDestinations.use(verifyJwt, requireRole("SUPER_ADMIN", "ADMIN", "EDITOR"));

const DestinationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().regex(/^[a-z0-9-]*$/, "Use lowercase letters, numbers and dashes").optional(),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  heroImageUrl: z.string().optional().nullable(),
  heroImageAlt: z.string().optional().nullable(),
  cardImageUrl: z.string().optional().nullable(),
  cardImageAlt: z.string().optional().nullable(),
  galleryImages: z.array(z.object({ url: z.string(), alt: z.string().optional() })).optional().nullable(),
  bestTimeToVisit: z.string().optional().nullable(),
  gettingThere: z.string().optional().nullable(),
  tips: z.string().optional().nullable(),
  thingsToDo: z.array(z.string()).optional().nullable(),
  price: z.string().optional().nullable(),
  basePrice: z.number().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  isFeatured: z.boolean().optional(),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(180).optional().nullable(),
  ogImageUrl: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
});

adminDestinations.get("/", async (req, res) => {
  const items = await prisma.destination.findMany({ orderBy: { updatedAt: "desc" } });
  res.json(items);
});

adminDestinations.get("/:id", async (req, res) => {
  const d = await prisma.destination.findUnique({ where: { id: req.params.id } });
  if (!d) return res.status(404).json({ error: "Destination not found" });
  res.json(d);
});

adminDestinations.post("/", validate(DestinationSchema), async (req, res) => {
  const data = sanitizeFields({ ...req.validated }, HTML_FIELDS);
  data.slug = await uniqueSlug(prisma.destination, data.slug || data.name);
  if (data.status === "PUBLISHED") data.publishedAt = new Date();
  const created = await prisma.destination.create({ data });
  res.status(201).json(created);
});

adminDestinations.patch("/:id", validate(DestinationSchema.partial()), async (req, res) => {
  const existing = await prisma.destination.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Destination not found" });

  const data = sanitizeFields({ ...req.validated }, HTML_FIELDS);
  if (data.slug !== undefined || data.name !== undefined) {
    data.slug = await uniqueSlug(prisma.destination, data.slug || data.name || existing.name, existing.id);
  }
  if (data.status === "PUBLISHED" && !existing.publishedAt) {
    data.publishedAt = new Date();
  }
  const updated = await prisma.destination.update({ where: { id: existing.id }, data });
  res.json(updated);
});

adminDestinations.delete("/:id", async (req, res) => {
  const existing = await prisma.destination.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Destination not found" });
  await prisma.destination.delete({ where: { id: existing.id } });
  res.json({ ok: true });
});
