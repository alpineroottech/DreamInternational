import "dotenv/config";
import serverless from "serverless-http";
import { app } from "../server/src/app.js";

const expressHandler = serverless(app);

/**
 * Vercel rewrites  /api/(.*)  →  /api/index?_path=$1
 * so req.url arrives as /api/index?_path=public%2Fsettings&...
 * Reconstruct the real /api/<path>?<remaining-qs> before handing off to Express.
 */
export default function handler(req, res) {
  try {
    const rawQuery = req.url.includes("?") ? req.url.split("?").slice(1).join("?") : "";
    const qs = new URLSearchParams(rawQuery);
    const subPath = qs.get("_path") ?? "";
    qs.delete("_path");
    const rest = qs.toString();
    req.url = `/api/${subPath}${rest ? `?${rest}` : ""}`;
  } catch {
    // If URL parsing fails, leave req.url as-is and let Express handle it.
  }
  return expressHandler(req, res);
}
