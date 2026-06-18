import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Reuse a single Prisma client across warm serverless invocations.
const globalForPrisma = globalThis;

function createPrisma() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  // Neon uses WebSockets in Node.js runtimes (Netlify Functions, local dev).
  if (typeof globalThis.WebSocket === "undefined") {
    neonConfig.webSocketConstructor = ws;
  }

  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma ?? createPrisma();
globalForPrisma.prisma = prisma;

export default prisma;
