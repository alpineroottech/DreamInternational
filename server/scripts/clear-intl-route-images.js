/**
 * Clears placeholder image URLs from international flight routes so the
 * frontend generated route artwork is used instead.
 *
 * Usage: node scripts/clear-intl-route-images.js
 */
import prisma from "../src/lib/prisma.js";

const result = await prisma.flightRoute.updateMany({
  where: { ticketType: "international" },
  data: {
    imageUrl: null,
    cardImageUrl: null,
  },
});

console.log(`Cleared images on ${result.count} international flight route(s).`);
await prisma.$disconnect();
