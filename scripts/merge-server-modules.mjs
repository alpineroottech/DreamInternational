/**
 * Merge server/node_modules into root node_modules so serverless functions
 * (Netlify / Vercel) can resolve Express/Prisma deps and the generated
 * Prisma client at /var/task/node_modules.
 */
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fromDir = path.join(root, "server/node_modules");
const toDir = path.join(root, "node_modules");

if (!existsSync(fromDir)) {
  console.error("server/node_modules not found. Run npm install in server/ first.");
  process.exit(1);
}

mkdirSync(toDir, { recursive: true });

for (const name of readdirSync(fromDir)) {
  const src = path.join(fromDir, name);
  const dest = path.join(toDir, name);
  cpSync(src, dest, { recursive: true, force: true });
}

console.log("Merged server/node_modules into root node_modules for Netlify API.");
