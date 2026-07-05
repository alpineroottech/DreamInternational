/**
 * Import synthesized tour, destination, and flight content into the CMS database.
 * Run: npm run import:cms --prefix server
 *
 * Content is original copy informed by public Nepal travel references — not scraped images.
 * Safe to re-run: upserts by slug and refreshes itineraries/FAQs on existing tours.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { buildDestinations, buildFlightRoutes, buildTours } from "./content/cms-content-data.js";
import { upsertDestination, upsertFlightRoute, upsertTour } from "./lib/cms-import-utils.js";

if (typeof globalThis.WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Dream International CMS content import\n");

  const categories = await prisma.category.findMany({ where: { type: "tour" } });
  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c]));
  if (!categories.length) {
    console.warn("No tour categories found — run seed first for category links.");
  }

  // Destinations
  const destinations = buildDestinations();
  for (const dest of destinations) {
    // eslint-disable-next-line no-await-in-loop
    await upsertDestination(prisma, dest);
    console.log(`  destination: ${dest.slug}`);
  }

  // Tours
  const tours = buildTours(categoryMap);
  for (const { tour, itinerary, faqs } of tours) {
    // eslint-disable-next-line no-await-in-loop
    await upsertTour(prisma, tour, itinerary, faqs);
    console.log(`  tour: ${tour.slug} (${itinerary.length} days, ${faqs.length} FAQs)`);
  }

  // Flight routes
  const routes = buildFlightRoutes();
  for (const route of routes) {
    // eslint-disable-next-line no-await-in-loop
    await upsertFlightRoute(prisma, route);
    console.log(`  flight: ${route.slug}`);
  }

  const [destCount, tourCount, routeCount] = await Promise.all([
    prisma.destination.count({ where: { status: "PUBLISHED" } }),
    prisma.tour.count({ where: { status: "PUBLISHED" } }),
    prisma.flightRoute.count({ where: { status: "PUBLISHED" } }),
  ]);

  console.log(`\nDone — ${destCount} published destinations, ${tourCount} published tours, ${routeCount} published flight routes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
