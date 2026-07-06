/** Remove fields Prisma must not receive on scalar updates. */
const READ_ONLY_KEYS = new Set(["id", "createdAt", "updatedAt"]);

/** Nested relation objects returned by admin GET includes — not valid update scalars. */
const RELATION_KEYS = new Set([
  "category",
  "itineraryDays",
  "faqs",
  "reviews",
  "inquiries",
  "author",
  "tour",
  "blogPosts",
  "itinerary",
]);

export function stripRelationPayload(data, { keep = [] } = {}) {
  const keepSet = new Set(keep);
  const out = { ...data };
  for (const key of Object.keys(out)) {
    if (READ_ONLY_KEYS.has(key)) delete out[key];
    else if (RELATION_KEYS.has(key) && !keepSet.has(key)) delete out[key];
  }
  if (out.categoryId === "") out.categoryId = null;
  return out;
}
