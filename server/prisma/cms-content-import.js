/**
 * Import synthesized tour, destination, and flight content into the CMS database.
 * Run: npm run import:cms --prefix server
 *
 * Content is original copy informed by public Nepal travel references — not scraped images.
 * Safe to re-run: updates text content only. Images, galleries, and tour categories
 * assigned in the admin are never overwritten on existing records.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { buildActivities } from "./content/cms-content-activities.js";
import { buildDestinations, buildTours } from "./content/cms-content-data.js";
import { buildFlightRoutes } from "./content/cms-content-flights.js";
import { upsertActivity, upsertDestination, upsertFlightRoute, upsertTour } from "./lib/cms-import-utils.js";

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

  // Activities
  const activities = buildActivities();
  for (const activity of activities) {
    // eslint-disable-next-line no-await-in-loop
    await upsertActivity(prisma, activity);
    console.log(`  activity: ${activity.slug}`);
  }

  const [destCount, tourCount, routeCount, activityCount] = await Promise.all([
    prisma.destination.count({ where: { status: "PUBLISHED" } }),
    prisma.tour.count({ where: { status: "PUBLISHED" } }),
    prisma.flightRoute.count({ where: { status: "PUBLISHED" } }),
    prisma.activity.count({ where: { status: "PUBLISHED" } }),
  ]);

  console.log(`\nDone — ${destCount} destinations, ${tourCount} tours, ${routeCount} flights, ${activityCount} activities (published).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
