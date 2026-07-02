import serverless from "serverless-http";
import { app } from "../server/src/app.js";

const expressHandler = serverless(app);

function joinPath(raw) {
  if (Array.isArray(raw)) return raw.join("/");
  if (!raw) return "";
  return String(raw);
}

function buildPatchedUrl(req) {
  // Rewrite /api?path=public/settings -> /api/public/settings for Express.
  const pathPart = joinPath(req.query?.path).replace(/^\/+/, "");
  const query = new URLSearchParams();

  Object.entries(req.query || {}).forEach(([key, value]) => {
    if (key === "path") return;
    if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, String(v)));
      return;
    }
    if (value != null) query.set(key, String(value));
  });

  const basePath = pathPart ? `/api/${pathPart}` : "/api";
  const qs = query.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default async function handler(req, res) {
  req.url = buildPatchedUrl(req);
  return expressHandler(req, res);
}
