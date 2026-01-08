import { PrismaClient } from "@prisma/client";

const postgresCandidate =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

const isPostgres =
  !!postgresCandidate &&
  (postgresCandidate.startsWith("postgres://") ||
    postgresCandidate.startsWith("postgresql://"));

if (isPostgres) {
  // Ensure Prisma envs exist when only one Postgres URL is provided.
  if (!process.env.POSTGRES_PRISMA_URL) {
    process.env.POSTGRES_PRISMA_URL = postgresCandidate;
  }
  if (!process.env.POSTGRES_URL_NON_POOLING) {
    process.env.POSTGRES_URL_NON_POOLING = postgresCandidate;
  }
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = postgresCandidate;
  }
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
