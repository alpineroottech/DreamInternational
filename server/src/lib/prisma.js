import { PrismaClient } from "@prisma/client";

// Reuse a single Prisma client across warm serverless invocations.
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();
globalForPrisma.prisma = prisma;

export default prisma;
