/** Site-wide default when no CMS color is set for a page. */
export const DEFAULT_HERO_COLOR = "#140ca9";

/** Sensible defaults per page — editable in CMS → Settings → Page hero colors. */
export const DEFAULT_PAGE_HERO_COLORS = {
  about: "#140ca9",
  tours: "#140ca9",
  "tour-details": "#140ca9",
  "international-holidays": "#0d5c63",
  destinations: "#0d5c63",
  "destination-details": "#0d5c63",
  activities: "#c41a00",
  "activity-details": "#c41a00",
  services: "#113d48",
  "service-details": "#113d48",
  blog: "#1e4d6b",
  "blog-details": "#1e4d6b",
  contact: "#113d48",
  faq: "#1a237e",
  gallery: "#0d5c63",
  pricing: "#140ca9",
  "tour-guide": "#1e4d6b",
  "tour-guide-details": "#1e4d6b",
  resort: "#0d5c63",
  "resort-details": "#0d5c63",
  shop: "#113d48",
  "shop-details": "#113d48",
  cart: "#140ca9",
  checkout: "#140ca9",
  wishlist: "#140ca9",
  error: "#1a237e",
  "ticketing-domestic": "#140ca9",
  "ticketing-international": "#0a074f",
  "ticketing-route": "#140ca9",
};

const HEX_RE = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

export function isValidHeroColor(value) {
  return typeof value === "string" && HEX_RE.test(value.trim());
}

/** Resolve banner color: CMS page override → site default → built-in default → brand fallback. */
export function resolveHeroColor(pageKey, settings = {}) {
  const pageHeroColors =
    settings.pageHeroColors && typeof settings.pageHeroColors === "object" && !Array.isArray(settings.pageHeroColors)
      ? settings.pageHeroColors
      : {};

  if (pageKey && isValidHeroColor(pageHeroColors[pageKey])) {
    return pageHeroColors[pageKey].trim();
  }
  if (isValidHeroColor(settings.defaultHeroColor)) {
    return settings.defaultHeroColor.trim();
  }
  if (pageKey && DEFAULT_PAGE_HERO_COLORS[pageKey]) {
    return DEFAULT_PAGE_HERO_COLORS[pageKey];
  }
  return DEFAULT_HERO_COLOR;
}

/** Inline styles for a solid gradient hero banner. */
export function heroBannerStyle(color) {
  return {
    "--hero-banner-color": color,
    backgroundColor: color,
    backgroundImage: "none",
  };
}
