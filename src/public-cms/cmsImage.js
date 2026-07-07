import { resolveAssetUrl } from "./hooks";

/** CMS image: use saved URL, honour explicit clear (""), else fallback. */
export function cmsImage(value, fallback = "") {
  if (value === "") return "";
  if (value) return resolveAssetUrl(value);
  return fallback ? resolveAssetUrl(fallback) : "";
}
