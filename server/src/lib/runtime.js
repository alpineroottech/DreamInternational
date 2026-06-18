import path from "node:path";
import { fileURLToPath } from "node:url";

/** True when running on a serverless host (Netlify Functions, Vercel, etc.). */
export function isServerlessHost() {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY === "true"
  );
}

/** Safe __dirname for ESM — works when Netlify esbuild bundles the function. */
export function moduleDir(metaUrl, fallback = "server/src") {
  if (metaUrl) {
    try {
      return path.dirname(fileURLToPath(metaUrl));
    } catch {
      /* bundled builds may not provide import.meta.url */
    }
  }
  return path.resolve(process.cwd(), fallback);
}

/** Normalize a site URL for CORS allowlists. */
export function normalizeOrigin(url) {
  if (!url) return null;
  const withScheme = url.startsWith("http") ? url : `https://${url}`;
  return withScheme.replace(/\/$/, "");
}
