import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { deliverInquiryEmails } from "../lib/email.js";
import { verifyJwt, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

// ---------- Public (contact / booking forms) ----------
export const publicInquiries = Router();

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});

const InquirySchema = z.object({
  type: z.enum(["STANDARD", "CUSTOM_TRIP"]).optional(),
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("A valid email is required"),
  phone: z.string().max(40).optional().nullable(),
  nationality: z.string().max(80).optional().nullable(),
  travelDates: z.string().max(120).optional().nullable(),
  groupSize: z.number().int().positive().max(1000).optional().nullable(),
  tourId: z.string().optional().nullable(),
  customDetails: z.any().optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
});

publicInquiries.post("/", inquiryLimiter, validate(InquirySchema), async (req, res, next) => {
  try {
    // Persist first; email delivery (when configured) must not block/lose the record.
    const inquiry = await prisma.inquiry.create({ data: req.validated });
    deliverInquiryEmails(inquiry);
    res.status(201).json({ ok: true, id: inquiry.id });
  } catch (e) {
    next(e);
  }
});

// ---------- Admin ----------
export const adminInquiries = Router();
adminInquiries.use(verifyJwt, requireRole("SUPER_ADMIN", "ADMIN"));

adminInquiries.get("/", async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status) where.status = String(req.query.status);
    const rows = await prisma.inquiry.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

const UpdateSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESPONDED", "CLOSED"]).optional(),
  internalNotes: z.string().max(5000).optional().nullable(),
});

adminInquiries.patch("/:id", validate(UpdateSchema), async (req, res, next) => {
  try {
    const updated = await prisma.inquiry.update({ where: { id: req.params.id }, data: req.validated });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

adminInquiries.delete("/:id", async (req, res, next) => {
  try {
    await prisma.inquiry.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
