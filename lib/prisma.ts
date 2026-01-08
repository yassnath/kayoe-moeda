import { PrismaClient } from "@prisma/client";

const dbUrl = process.env.DATABASE_URL;
const postgresUrl =
  process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;

if (
  (!dbUrl || (!dbUrl.startsWith("postgres://") && !dbUrl.startsWith("postgresql://"))) &&
  postgresUrl
) {
  // Use Vercel Postgres URL when DATABASE_URL is missing or still MySQL.
  process.env.DATABASE_URL = postgresUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
