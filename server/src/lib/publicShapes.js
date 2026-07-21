/** Card/list payload for tours — omits itinerary, full description, and galleries. */
export function tourListShape(t) {
  return {
    id: t.id,
    title: t.title,
    slug: t.slug,
    market: t.market,
    shortDescription: t.shortDescription,
    status: t.status,
    isFeatured: t.isFeatured,
    basePrice: t.basePrice,
    durationDays: t.durationDays,
    durationNights: t.durationNights,
    difficulty: t.difficulty,
    maxAltitude: t.maxAltitude,
    groupSizeMin: t.groupSizeMin,
    groupSizeMax: t.groupSizeMax,
    startPoint: t.startPoint,
    endPoint: t.endPoint,
    featuredImageUrl: t.featuredImageUrl,
    featuredImageAlt: t.featuredImageAlt,
    cardImageUrl: t.cardImageUrl,
    cardImageAlt: t.cardImageAlt,
    highlights: t.highlights,
    publishedAt: t.publishedAt,
    updatedAt: t.updatedAt,
    categoryId: t.categoryId,
    category: t.category
      ? { id: t.category.id, name: t.category.name, slug: t.category.slug }
      : null,
  };
}

/** Full tour detail shape (includes itinerary). */
export function tourDetailShape(t) {
  return {
    ...t,
    itinerary: (t.itineraryDays || []).map((d) => ({
      title: d.title,
      description: d.description,
      activities: d.notes ? d.notes.split("\n").filter(Boolean) : [],
      startLocation: d.startLocation,
      endLocation: d.endLocation,
      altitudeM: d.altitudeM,
      distanceKm: d.distanceKm,
    })),
  };
}

/** Blog list cards — omit full HTML body. */
export function blogListShape(p) {
  const { content: _content, ...rest } = p;
  return rest;
}

/** Activity list cards. */
export function activityListShape(a) {
  const { description: _description, galleryImages: _gallery, ...rest } = a;
  return rest;
}

/** Vehicle rental list cards. */
export function vehicleRentalListShape(v) {
  const { description: _description, galleryImages: _gallery, ...rest } = v;
  return rest;
}
