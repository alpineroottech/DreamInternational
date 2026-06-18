import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "node:path";

import authRoutes from "./routes/auth.js";
import { publicDestinations, adminDestinations } from "./routes/destinations.js";
import { publicSettings, adminSettings } from "./routes/settings.js";
import { publicSections, adminSections } from "./routes/sections.js";
import { publicInquiries, adminInquiries } from "./routes/inquiries.js";
import mediaRoutes from "./routes/media.js";
import { registerResources } from "./resources.js";
import { isServerlessHost, normalizeOrigin, moduleDir } from "./lib/runtime.js";

const __dirname = moduleDir(import.meta.url);
const isServerless = isServerlessHost();
const isProduction = process.env.NODE_ENV === "production";

function buildAllowedOrigins() {
  const origins = new Set();
  const add = (url) => {
    const n = normalizeOrigin(url);
    if (n) origins.add(n);
  };

  add(process.env.CLIENT_ORIGIN);
  add(process.env.URL);
  add(process.env.DEPLOY_PRIME_URL);
  add(process.env.DEPLOY_URL);
  add(process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`);
  add(process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`);

  if (!isProduction) {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
    origins.add("http://localhost:8888");
  }
  return [...origins];
}

const allowedOrigins = buildAllowedOrigins();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const normalized = normalizeOrigin(origin);
      if (normalized && allowedOrigins.includes(normalized)) return callback(null, true);
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

if (!isServerless) {
  app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));
}

app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    service: "dream-cms",
    env: isProduction ? "production" : "development",
    host: isServerless ? "serverless" : "node",
  })
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
