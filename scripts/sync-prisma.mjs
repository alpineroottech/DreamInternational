/**
 * Copy Prisma client from server/node_modules into root node_modules so the
 * Netlify serverless function can resolve @prisma/client at deploy time.
 */
import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fromPrisma = path.join(root, "server/node_modules/.prisma");
const fromClient = path.join(root, "server/node_modules/@prisma/client");
const toPrisma = path.join(root, "node_modules/.prisma");
const toClient = path.join(root, "node_modules/@prisma/client");

if (!existsSync(fromPrisma) || !existsSync(fromClient)) {
  console.error("Prisma client not found in server/node_modules. Run prisma generate in server/ first.");
  process.exit(1);
}

mkdirSync(path.dirname(toPrisma), { recursive: true });
mkdirSync(path.dirname(toClient), { recursive: true });
cpSync(fromPrisma, toPrisma, { recursive: true });
cpSync(fromClient, toClient, { recursive: true });
console.log("Synced Prisma client to root node_modules for Netlify functions.");
