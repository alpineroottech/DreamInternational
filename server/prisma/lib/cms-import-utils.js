/** Shared helpers for CMS content import (upsert by slug). */

export const now = () => new Date();

export const img = {
  tour: (n) => `/assets/img/tour/tour_4_${((n - 1) % 6) + 1}.jpg`,
  dest: (n) => `/assets/img/destination/destination_4_${((n - 1) % 6) + 1}.jpg`,
  hero: (n) => `/assets/img/destination/destination_10_${((n - 1) % 5) + 1}.jpg`,
};

/** Fields never overwritten on existing records — preserves admin-assigned images and categories. */
const DESTINATION_SKIP = ["heroImageUrl", "heroImageAlt", "cardImageUrl", "cardImageAlt", "galleryImages", "ogImageUrl"];
const TOUR_SKIP = ["featuredImageUrl", "featuredImageAlt", "cardImageUrl", "cardImageAlt", "galleryImages", "ogImageUrl", "mapImageUrl", "videoUrl", "categoryId"];
const ACTIVITY_SKIP = ["imageUrl", "imageAlt", "cardImageUrl", "cardImageAlt", "galleryImages", "ogImageUrl"];
const FLIGHT_SKIP = ["imageUrl", "imageAlt", "cardImageUrl", "cardImageAlt", "ogImageUrl"];

function withoutKeys(obj, keys) {
  const out = { ...obj };
  for (const key of keys) delete out[key];
  return out;
}

export function day(n, title, description, extra = {}) {
  return {
    dayNumber: n,
    title,
    description,
    order: n,
    ...extra,
  };
}

export function faq(order, question, answer) {
  return { order, question, answer };
}

export async function upsertDestination(prisma, data) {
  const { slug, ...rest } = data;
  const publishedAt = rest.status === "PUBLISHED" ? now() : undefined;
  const existing = await prisma.destination.findUnique({ where: { slug } });
  if (existing) {
    return prisma.destination.update({
      where: { slug },
      data: { ...withoutKeys(rest, DESTINATION_SKIP), publishedAt },
    });
  }
  return prisma.destination.create({ data: { slug, ...rest, publishedAt } });
}

export async function upsertFlightRoute(prisma, data) {
  const { slug, ...rest } = data;
  const publishedAt = rest.status === "PUBLISHED" ? now() : undefined;
  const existing = await prisma.flightRoute.findUnique({ where: { slug } });
  if (existing) {
    return prisma.flightRoute.update({
      where: { slug },
      data: { ...withoutKeys(rest, FLIGHT_SKIP), publishedAt },
    });
  }
  return prisma.flightRoute.create({ data: { slug, ...rest, publishedAt } });
}

export async function upsertActivity(prisma, data) {
  const { slug, ...rest } = data;
  const publishedAt = rest.status === "PUBLISHED" ? now() : undefined;
  const existing = await prisma.activity.findUnique({ where: { slug } });
  if (existing) {
    return prisma.activity.update({
      where: { slug },
      data: { ...withoutKeys(rest, ACTIVITY_SKIP), publishedAt },
    });
  }
  return prisma.activity.create({ data: { slug, ...rest, publishedAt } });
}

export async function upsertTour(prisma, tourData, itinerary = [], faqs = []) {
  const { slug, ...rest } = tourData;
  const publishedAt = rest.status === "PUBLISHED" ? now() : undefined;
  const existing = await prisma.tour.findUnique({ where: { slug } });
  if (existing) {
    await prisma.itineraryDay.deleteMany({ where: { tourId: existing.id } });
    await prisma.tourFAQ.deleteMany({ where: { tourId: existing.id } });
    return prisma.tour.update({
      where: { slug },
      data: {
        ...withoutKeys(rest, TOUR_SKIP),
        publishedAt,
        itineraryDays: itinerary.length ? { create: itinerary } : undefined,
        faqs: faqs.length ? { create: faqs } : undefined,
      },
    });
  }
  return prisma.tour.create({
    data: {
      slug,
      ...rest,
      publishedAt,
      itineraryDays: itinerary.length ? { create: itinerary } : undefined,
      faqs: faqs.length ? { create: faqs } : undefined,
    },
  });
}
