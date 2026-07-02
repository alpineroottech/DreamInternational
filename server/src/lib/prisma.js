import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Reuse a single Prisma client across warm serverless invocations.
const globalForPrisma = globalThis;

function withConnectTimeout(connectionString) {
  try {
    const url = new URL(connectionString);
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "5");
    }
    return url.toString();
  } catch {
    return connectionString;
  }
}

function createPrisma() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  // Neon uses WebSockets in Node.js runtimes (Netlify Functions, local dev).
  if (typeof globalThis.WebSocket === "undefined") {
    neonConfig.webSocketConstructor = ws;
  }

  const connectionString = withConnectTimeout(process.env.DATABASE_URL);
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

let prismaClient = globalForPrisma.prisma ?? null;

function getPrisma() {
  if (!prismaClient) {
    prismaClient = createPrisma();
    globalForPrisma.prisma = prismaClient;
  }
  return prismaClient;
}

const prisma = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getPrisma();
      const value = client[prop];
      return typeof value === "function" ? value.bind(client) : value;
    },
  }
);

export default prisma;
