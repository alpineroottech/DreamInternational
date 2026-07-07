import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { deliverFlightInquiryEmails } from "../lib/email.js";
import { verifyJwt, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});

const Schema = z.object({
  ticketType: z.enum(["domestic", "international"]).default("domestic"),
  fromCity:   z.string().min(1, "Departure city is required").max(120),
  toCity:     z.string().min(1, "Destination city is required").max(120),
  travelDate: z.string().max(40).optional().nullable(),
  returnDate: z.string().max(40).optional().nullable(),
  passengers: z.number().int().min(1).max(99).default(1),
  cabinClass: z.enum(["Economy", "Business", "First"]).default("Economy"),
  preferredAirline: z.string().max(120).optional().nullable(),
  name:       z.string().min(1, "Full name is required").max(120),
  email:      z.string().email("A valid email is required"),
  phone:      z.string().max(40).optional().nullable(),
  nationality:z.string().max(80).optional().nullable(),
  message:    z.string().max(3000).optional().nullable(),
});

// ---------- Public ----------
export const publicFlightInquiries = Router();

publicFlightInquiries.post("/", limiter, validate(Schema), async (req, res, next) => {
  try {
    const inquiry = await prisma.flightInquiry.create({ data: req.validated });
    deliverFlightInquiryEmails(inquiry);
    res.status(201).json({ ok: true, id: inquiry.id });
  } catch (e) {
    next(e);
  }
});

// ---------- Admin ----------
export const adminFlightInquiries = Router();
adminFlightInquiries.use(verifyJwt, requireRole("SUPER_ADMIN", "ADMIN", "EDITOR"));

adminFlightInquiries.get("/", async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status) where.status = String(req.query.status);
    if (req.query.ticketType) where.ticketType = String(req.query.ticketType);
    const rows = await prisma.flightInquiry.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

const UpdateSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESPONDED", "CLOSED"]).optional(),
  internalNotes: z.string().max(5000).optional().nullable(),
});

adminFlightInquiries.patch("/:id", validate(UpdateSchema), async (req, res, next) => {
  try {
    const updated = await prisma.flightInquiry.update({ where: { id: req.params.id }, data: req.validated });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

adminFlightInquiries.delete("/:id", async (req, res, next) => {
  try {
    await prisma.flightInquiry.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
