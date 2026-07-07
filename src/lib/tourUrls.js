/** Public URL for a tour detail page based on market. */
export function tourDetailPath(tourOrSlug, market) {
  const slug = typeof tourOrSlug === "string" ? tourOrSlug : tourOrSlug?.slug;
  const m = market || (typeof tourOrSlug === "object" ? tourOrSlug?.market : null);
  if (!slug) return m === "international" ? "/international-holidays" : "/tour";
  if (m === "international") return `/international-holidays/${slug}`;
  return `/tour-details?slug=${encodeURIComponent(slug)}`;
}

export function tourListingPath(market) {
  return market === "international" ? "/international-holidays" : "/tour";
}

export function tourListingLabel(market) {
  return market === "international" ? "International Holidays" : "Nepal Experiences";
}
