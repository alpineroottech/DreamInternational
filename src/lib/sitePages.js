// Registry of every real, navigable page on the public site.
//
// This is the single source of truth the admin "Navigation" screen uses to
// build the header/footer menus — admins pick from this list with checkboxes
// and drag to reorder; they never type a URL by hand. Add a new page here
// once and it becomes available everywhere (header, footer, mega menu).
export const SITE_PAGES = [
  { id: "home", label: "Home", url: "/", icon: "solar:home-smile-outline" },
  { id: "about", label: "About", url: "/about", icon: "solar:info-circle-outline" },
  { id: "nepal-experiences", label: "Nepal Experiences", url: "/tour", megaType: "nepal", icon: "solar:mountains-outline" },
  { id: "international-holidays", label: "International Holidays", url: "/international-holidays", megaType: "international", icon: "solar:globe-outline" },
  { id: "activities", label: "Activities", url: "/activities", megaType: "activities", icon: "solar:running-2-outline" },
  { id: "vehicle-rentals", label: "Vehicle Rentals", url: "/vehicle-rentals", megaType: "vehicle-rentals", icon: "solar:wheel-outline" },
  { id: "services", label: "Services", url: "/service", icon: "solar:case-round-outline" },
  {
    id: "ticketing",
    label: "Ticketing",
    url: "#",
    icon: "solar:airplane-outline",
    children: [
      { label: "Domestic Flights", url: "/ticketing/domestic", icon: "solar:map-point-outline" },
      { label: "International Flights", url: "/ticketing/international", icon: "solar:earth-outline" },
    ],
  },
  { id: "resorts", label: "Resorts", url: "/resort", icon: "solar:bedside-table-3-outline" },
  { id: "team", label: "Team / Guides", url: "/tour-guide", icon: "solar:users-group-rounded-outline" },
  { id: "blog", label: "Blog", url: "/blog", icon: "solar:document-text-outline" },
  { id: "gallery", label: "Gallery", url: "/gallery", icon: "solar:gallery-wide-outline" },
  { id: "faq", label: "FAQ", url: "/faq", icon: "solar:question-circle-outline" },
  { id: "pricing", label: "Pricing", url: "/price", icon: "solar:tag-price-outline" },
  { id: "contact", label: "Contact", url: "/contact", icon: "solar:phone-calling-outline" },
  { id: "privacy-policy", label: "Privacy Policy", url: "/privacy-policy", icon: "solar:shield-check-outline" },
  { id: "terms-and-conditions", label: "Terms & Conditions", url: "/terms-and-conditions", icon: "solar:document-outline" },
  { id: "cancellation-policy", label: "Cancellation Policy", url: "/cancellation-policy", icon: "solar:calendar-mark-outline" },
];

export const SITE_PAGES_BY_ID = SITE_PAGES.reduce((map, p) => {
  map[p.id] = p;
  return map;
}, {});

// Which pages show in the header by default, and in what order, on a
// brand-new site (or before an admin has ever saved custom navigation).
// International Holidays is intentionally hidden for now per the client's
// current request; flip it back on any time from Admin → Navigation.
export const DEFAULT_NAV_IDS = [
  "home",
  "about",
  "nepal-experiences",
  "activities",
  "vehicle-rentals",
  "ticketing",
  "blog",
];

/** Builds the full ordered visibility list (every registered page, in order) from a saved navConfig. */
export function resolveNavConfig(navConfig) {
  const saved = Array.isArray(navConfig) ? navConfig : [];
  const savedIds = new Set(saved.map((e) => e.id));
  const rows = saved
    .filter((e) => SITE_PAGES_BY_ID[e.id])
    .map((e) => ({ id: e.id, visible: e.visible !== false, label: e.label || "" }));
  // Any page registered in code but not yet present in saved config (e.g. a
  // brand-new page type like Vehicle Rentals) is appended using the default
  // visibility so it doesn't silently disappear from the site.
  SITE_PAGES.forEach((p) => {
    if (!savedIds.has(p.id)) {
      rows.push({ id: p.id, visible: DEFAULT_NAV_IDS.includes(p.id), label: "" });
    }
  });
  return rows;
}

/** Turns a navConfig (order + visibility + label overrides) into the {label,url,children} shape the public header/footer consume. */
export function navConfigToHeaderNav(navConfig) {
  return resolveNavConfig(navConfig)
    .filter((row) => row.visible)
    .map((row) => {
      const page = SITE_PAGES_BY_ID[row.id];
      if (!page) return null;
      return {
        label: row.label || page.label,
        url: page.url,
        ...(page.children ? { children: page.children } : {}),
      };
    })
    .filter(Boolean);
}

export const DEFAULT_HEADER_NAV = navConfigToHeaderNav(
  DEFAULT_NAV_IDS.map((id) => ({ id, visible: true }))
);
