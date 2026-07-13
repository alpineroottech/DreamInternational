// One-off maintenance script: hides "International Holidays" from the main
// nav and adds "Vehicle Rentals", while writing a full navConfig so the new
// Admin → Navigation checklist (checkbox + drag reorder) has a sane starting
// state for every registered page. Safe to re-run.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

if (typeof globalThis.WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Mirrors src/lib/sitePages.js — kept in sync manually since this script
// runs standalone against the server's own Prisma client.
const SITE_PAGES = [
  { id: "home", label: "Home", url: "/" },
  { id: "about", label: "About", url: "/about" },
  { id: "nepal-experiences", label: "Nepal Experiences", url: "/tour" },
  { id: "international-holidays", label: "International Holidays", url: "/international-holidays" },
  { id: "activities", label: "Activities", url: "/activities" },
  { id: "vehicle-rentals", label: "Vehicle Rentals", url: "/vehicle-rentals" },
  { id: "services", label: "Services", url: "/service" },
  {
    id: "ticketing",
    label: "Ticketing",
    url: "#",
    children: [
      { label: "Domestic Flights", url: "/ticketing/domestic" },
      { label: "International Flights", url: "/ticketing/international" },
    ],
  },
  { id: "resorts", label: "Resorts", url: "/resort" },
  { id: "team", label: "Team / Guides", url: "/tour-guide" },
  { id: "blog", label: "Blog", url: "/blog" },
  { id: "gallery", label: "Gallery", url: "/gallery" },
  { id: "faq", label: "FAQ", url: "/faq" },
  { id: "pricing", label: "Pricing", url: "/price" },
  { id: "contact", label: "Contact", url: "/contact" },
  { id: "privacy-policy", label: "Privacy Policy", url: "/privacy-policy" },
  { id: "terms-and-conditions", label: "Terms & Conditions", url: "/terms-and-conditions" },
  { id: "cancellation-policy", label: "Cancellation Policy", url: "/cancellation-policy" },
];

const VISIBLE_IDS = new Set(["home", "about", "nepal-experiences", "activities", "vehicle-rentals", "ticketing", "blog"]);

async function main() {
  const navConfig = SITE_PAGES.map((p) => ({ id: p.id, visible: VISIBLE_IDS.has(p.id), label: "" }));
  const headerNav = SITE_PAGES.filter((p) => VISIBLE_IDS.has(p.id)).map((p) => ({
    label: p.label,
    url: p.url,
    ...(p.children ? { children: p.children } : {}),
  }));

  await prisma.setting.upsert({
    where: { key: "navConfig" },
    update: { value: JSON.stringify(navConfig), type: "json" },
    create: { key: "navConfig", value: JSON.stringify(navConfig), type: "json" },
  });
  await prisma.setting.upsert({
    where: { key: "headerNav" },
    update: { value: JSON.stringify(headerNav), type: "json" },
    create: { key: "headerNav", value: JSON.stringify(headerNav), type: "json" },
  });

  console.log("Navigation updated. Header now shows:", headerNav.map((h) => h.label).join(", "));
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
