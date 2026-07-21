import prisma from "./prisma.js";
import { rowsToObject, PUBLIC_SETTING_KEYS } from "./settingsPublic.js";
import {
  tourListShape,
  blogListShape,
  activityListShape,
  vehicleRentalListShape,
} from "./publicShapes.js";

const byOrder = [{ order: "asc" }, { createdAt: "desc" }];
const tourListInclude = { category: true };
const tourListOrder = [{ isFeatured: "desc" }, { updatedAt: "desc" }];

function collectionEntry(path, params, items) {
  return { path, params: params || {}, items: items || [] };
}

/**
 * Single payload for the homepage + header mega menus.
 * Replaces ~15 separate client-side API calls with one cached response.
 */
export async function fetchHomePayload() {
  const [
    sectionRows,
    settingRows,
    categories,
    toursFeaturedNepal,
    toursNepal,
    toursInternational,
    activities,
    vehicleRentals,
    gallery,
    counters,
    team,
    reviews,
    brands,
    blog,
    faqs,
  ] = await Promise.all([
    prisma.section.findMany({
      where: { enabled: true, page: "home" },
      orderBy: [{ order: "asc" }],
    }),
    prisma.setting.findMany({ where: { key: { in: PUBLIC_SETTING_KEYS } } }),
    prisma.category.findMany({ where: { isVisible: true }, orderBy: byOrder }),
    prisma.tour.findMany({
      where: { status: "PUBLISHED", isFeatured: true, market: "nepal" },
      include: tourListInclude,
      orderBy: tourListOrder,
    }),
    prisma.tour.findMany({
      where: { status: "PUBLISHED", market: "nepal" },
      include: tourListInclude,
      orderBy: tourListOrder,
    }),
    prisma.tour.findMany({
      where: { status: "PUBLISHED", market: "international" },
      include: tourListInclude,
      orderBy: tourListOrder,
    }),
    prisma.activity.findMany({
      where: { status: "PUBLISHED" },
      orderBy: byOrder,
    }),
    prisma.vehicleRental.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { updatedAt: "desc" }],
    }),
    prisma.galleryImage.findMany({ where: { isVisible: true }, orderBy: byOrder }),
    prisma.counter.findMany({ where: { isVisible: true }, orderBy: byOrder }),
    prisma.teamMember.findMany({ where: { status: "PUBLISHED" }, orderBy: byOrder }),
    prisma.review.findMany({
      where: { isVisible: true, isFeatured: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.brand.findMany({ where: { isVisible: true }, orderBy: byOrder }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }],
    }),
    prisma.faq.findMany({ where: { isVisible: true }, orderBy: byOrder }),
  ]);

  const sortedSections = [...sectionRows].sort((a, b) => a.order - b.order);
  const byKey = {};
  sortedSections.forEach((s) => {
    byKey[s.key] = s.data || {};
  });

  return {
    settings: rowsToObject(settingRows),
    sections: {
      byKey,
      order: sortedSections.map((s) => s.key),
    },
    collections: [
      collectionEntry("/public/categories", {}, categories),
      collectionEntry("/public/tours", { featured: true, market: "nepal" }, toursFeaturedNepal.map(tourListShape)),
      collectionEntry("/public/tours", { market: "nepal" }, toursNepal.map(tourListShape)),
      collectionEntry("/public/tours", { market: "international" }, toursInternational.map(tourListShape)),
      collectionEntry("/public/activities", {}, activities.map(activityListShape)),
      collectionEntry("/public/vehicle-rentals", {}, vehicleRentals.map(vehicleRentalListShape)),
      collectionEntry("/public/gallery", {}, gallery),
      collectionEntry("/public/counters", {}, counters),
      collectionEntry("/public/team", {}, team),
      collectionEntry("/public/reviews", { featured: "true" }, reviews),
      collectionEntry("/public/brands", {}, brands),
      collectionEntry("/public/blog", {}, blog.map(blogListShape)),
      collectionEntry("/public/faqs", {}, faqs),
    ],
  };
}
