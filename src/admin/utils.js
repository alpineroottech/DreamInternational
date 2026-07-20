import { resolveApiBaseUrl } from "../lib/apiBaseUrl";

export const API_ORIGIN = resolveApiBaseUrl().replace(/\/api$/, "");

// Resolve an image path: media-library uploads come from the API origin,
// template assets and absolute URLs are used as-is.
export function resolveAssetUrl(url) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/assets") || url.startsWith("data:")) return url;
  if (url.startsWith("/uploads")) return `${API_ORIGIN}${url}`;
  return url;
}

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
