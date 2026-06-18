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
const isVercel = Boolean(process.env.VERCEL);
const isProduction = process.env.NODE_ENV === "production";

function buildAllowedOrigins() {
  const origins = new Set();
  if (process.env.CLIENT_ORIGIN) origins.add(process.env.CLIENT_ORIGIN.replace(/\/$/, ""));
  if (process.env.VERCEL_URL) origins.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.VERCEL_BRANCH_URL) origins.add(`https://${process.env.VERCEL_BRANCH_URL}`);
  // Local CRA dev server
  if (!isProduction) {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }
  return [...origins];
}

const allowedOrigins = buildAllowedOrigins();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin(origin, callback) {
      // Same-origin / server-to-server requests have no Origin header.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin.replace(/\/$/, ""))) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.use(
  "/api",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, standardHeaders: true, legacyHeaders: false })
);

// Local disk uploads (dev only — Vercel uses Cloudinary in media routes).
if (!isVercel) {
  app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));
}

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, service: "dream-cms", env: isProduction ? "production" : "development" })
);

app.use("/api/auth", authRoutes);
app.use("/api/public/destinations", publicDestinations);
app.use("/api/public/settings", publicSettings);
app.use("/api/public/sections", publicSections);
app.use("/api/public/inquiries", publicInquiries);
app.use("/api/admin/destinations", adminDestinations);
app.use("/api/admin/settings", adminSettings);
app.use("/api/admin/sections", adminSections);
app.use("/api/admin/inquiries", adminInquiries);
app.use("/api/admin/media", mediaRoutes);

registerResources(app);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "Origin not allowed" });
  }
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

export { app };
