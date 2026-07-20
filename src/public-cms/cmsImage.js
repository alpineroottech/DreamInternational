import { resolveAssetUrl } from "./hooks";

/** CMS image URL only — no template fallbacks. */
export function cmsImage(value) {
  if (value === "") return "";
  if (value) return resolveAssetUrl(value);
  return "";
}
