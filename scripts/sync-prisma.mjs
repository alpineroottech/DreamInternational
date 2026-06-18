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

if (!existsSync(fromPrisma) || !existsSync(fromClient)) {
  console.error("Prisma client not found in server/node_modules. Run prisma generate in server/ first.");
  process.exit(1);
}

const targets = [
  ["server/node_modules/.prisma", "node_modules/.prisma"],
  ["server/node_modules/@prisma/client", "node_modules/@prisma/client"],
  ["server/node_modules/.prisma", "netlify/functions/node_modules/.prisma"],
  ["server/node_modules/@prisma/client", "netlify/functions/node_modules/@prisma/client"],
];

for (const [fromRel, toRel] of targets) {
  const from = path.join(root, fromRel);
  const to = path.join(root, toRel);
  if (!existsSync(from)) {
    console.error(`Missing ${fromRel}. Run prisma generate in server/ first.`);
    process.exit(1);
  }
  mkdirSync(path.dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
}

console.log("Synced Prisma client for Netlify functions.");
