import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authRoutes from "./routes/auth.js";
import { publicDestinations, adminDestinations } from "./routes/destinations.js";
import { publicSettings, adminSettings } from "./routes/settings.js";
import { publicSections, adminSections } from "./routes/sections.js";
import { publicInquiries, adminInquiries } from "./routes/inquiries.js";
import mediaRoutes from "./routes/media.js";
import { registerResources } from "./resources.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

// Lenient global limiter as a backstop against abuse (per-route limiters
// on login/inquiries are stricter).
app.use(
  "/api",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, standardHeaders: true, legacyHeaders: false })
);

// Serve locally uploaded media (dev). Production uses Cloudinary CDN URLs.
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "dream-cms" }));

// Auth
app.use("/api/auth", authRoutes);

// Public (no auth) — published content only
app.use("/api/public/destinations", publicDestinations);
app.use("/api/public/settings", publicSettings);
app.use("/api/public/sections", publicSections);
app.use("/api/public/inquiries", publicInquiries);

// Admin (JWT + role)
app.use("/api/admin/destinations", adminDestinations);
app.use("/api/admin/settings", adminSettings);
app.use("/api/admin/sections", adminSections);
app.use("/api/admin/inquiries", adminInquiries);
app.use("/api/admin/media", mediaRoutes);

// Generic content resources (tours, activities, services, team, resorts,
// blog, categories, brands, gallery, counters, faqs, reviews)
registerResources(app);

// Centralized error handler (e.g. multer file errors)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Dream International CMS API running on http://localhost:${PORT}`);
});
