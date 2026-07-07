/** Site-wide default when no CMS color is set for a page. */
export const DEFAULT_HERO_COLOR = "#001a57";

/** Sensible defaults per page — editable in CMS → Settings → Page hero colors. */
export const DEFAULT_PAGE_HERO_COLORS = {
  about: "#001a57",
  tours: "#001a57",
  "tour-details": "#001a57",
  "international-holidays": "#001a57",
  destinations: "#001a57",
  "destination-details": "#001a57",
  activities: "#001a57",
  "activity-details": "#001a57",
  services: "#001a57",
  "service-details": "#001a57",
  blog: "#001a57",
  "blog-details": "#001a57",
  contact: "#001a57",
  faq: "#001a57",
  gallery: "#001a57",
  pricing: "#001a57",
  "tour-guide": "#001a57",
  "tour-guide-details": "#001a57",
  resort: "#001a57",
  "resort-details": "#001a57",
  shop: "#001a57",
  "shop-details": "#001a57",
  cart: "#001a57",
  checkout: "#001a57",
  wishlist: "#001a57",
  error: "#001a57",
  "ticketing-domestic": "#001a57",
  "ticketing-international": "#001a57",
  "ticketing-route": "#001a57",
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
