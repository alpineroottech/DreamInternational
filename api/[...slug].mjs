import "dotenv/config";
import serverless from "serverless-http";
import { app } from "../server/src/app.js";

const expressHandler = serverless(app);

function stripSlugQuery(searchParams) {
  const next = new URLSearchParams(searchParams);
  next.delete("slug");
  const qs = next.toString();
  return qs ? `?${qs}` : "";
}

function resolveApiUrl(req) {
  const headerUrl = req.headers["x-vercel-original-url"] || req.headers["x-invoke-path"];
  const incoming = headerUrl || req.url || "/";
  const [pathname, search = ""] = incoming.split("?");

  if (pathname.startsWith("/api/") || pathname === "/api") {
    return pathname + stripSlugQuery(search);
  }

  const slug = req.query?.slug;
  if (slug) {
    const path = Array.isArray(slug) ? slug.join("/") : String(slug);
    return `/api/${path.replace(/^\/+/, "")}${stripSlugQuery(search)}`;
  }

  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `/api${normalized}${stripSlugQuery(search)}`;
}

export default function handler(req, res) {
  req.url = resolveApiUrl(req);
  return expressHandler(req, res);
}
