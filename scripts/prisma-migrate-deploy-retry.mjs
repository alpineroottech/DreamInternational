import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MAX_ATTEMPTS = Number(process.env.PRISMA_MIGRATE_MAX_ATTEMPTS || 5);
const BASE_DELAY_MS = Number(process.env.PRISMA_MIGRATE_BASE_DELAY_MS || 8000);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const serverDir = path.join(root, "server");

function runMigrateDeploy() {
  return new Promise((resolve) => {
    const child = spawn("npx", ["prisma", "migrate", "deploy"], {
      stdio: "inherit",
      shell: true,
      cwd: serverDir,
    });

    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
  // eslint-disable-next-line no-await-in-loop
  const exitCode = await runMigrateDeploy();
  if (exitCode === 0) {
    console.log(`Prisma migrate deploy succeeded on attempt ${attempt}.`);
    process.exit(0);
  }

  if (attempt === MAX_ATTEMPTS) {
    console.error(`Prisma migrate deploy failed after ${MAX_ATTEMPTS} attempts.`);
    process.exit(exitCode);
  }

  const delay = BASE_DELAY_MS * attempt;
  console.warn(
    `Prisma migrate deploy failed on attempt ${attempt}. Retrying in ${delay}ms...`
  );
  // eslint-disable-next-line no-await-in-loop
  await new Promise((resolve) => setTimeout(resolve, delay));
}
