/** Shared helpers for CMS content import (upsert by slug). */

export const now = () => new Date();

export const img = {
  tour: (n) => `/assets/img/tour/tour_4_${((n - 1) % 6) + 1}.jpg`,
  dest: (n) => `/assets/img/destination/destination_4_${((n - 1) % 6) + 1}.jpg`,
  hero: (n) => `/assets/img/destination/destination_10_${((n - 1) % 5) + 1}.jpg`,
};

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
  return prisma.destination.upsert({
    where: { slug },
    update: { ...rest, publishedAt: rest.status === "PUBLISHED" ? now() : undefined },
    create: { slug, ...rest, publishedAt: rest.status === "PUBLISHED" ? now() : undefined },
  });
}

export async function upsertFlightRoute(prisma, data) {
  const { slug, ...rest } = data;
  return prisma.flightRoute.upsert({
    where: { slug },
    update: { ...rest, publishedAt: rest.status === "PUBLISHED" ? now() : undefined },
    create: { slug, ...rest, publishedAt: rest.status === "PUBLISHED" ? now() : undefined },
  });
}

export async function upsertActivity(prisma, data) {
  const { slug, ...rest } = data;
  return prisma.activity.upsert({
    where: { slug },
    update: { ...rest, publishedAt: rest.status === "PUBLISHED" ? now() : undefined },
    create: { slug, ...rest, publishedAt: rest.status === "PUBLISHED" ? now() : undefined },
  });
}

export async function upsertTour(prisma, tourData, itinerary = [], faqs = []) {
  const { slug, ...rest } = tourData;
  const existing = await prisma.tour.findUnique({ where: { slug } });
  if (existing) {
    await prisma.itineraryDay.deleteMany({ where: { tourId: existing.id } });
    await prisma.tourFAQ.deleteMany({ where: { tourId: existing.id } });
    return prisma.tour.update({
      where: { slug },
      data: {
        ...rest,
        publishedAt: rest.status === "PUBLISHED" ? now() : undefined,
        itineraryDays: itinerary.length ? { create: itinerary } : undefined,
        faqs: faqs.length ? { create: faqs } : undefined,
      },
    });
  }
  return prisma.tour.create({
    data: {
      slug,
      ...rest,
      publishedAt: rest.status === "PUBLISHED" ? now() : undefined,
      itineraryDays: itinerary.length ? { create: itinerary } : undefined,
      faqs: faqs.length ? { create: faqs } : undefined,
    },
  });
}
