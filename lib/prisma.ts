import { PrismaClient } from "@prisma/client";

const isPostgresUrl = (value?: string) =>
  !!value &&
  (value.startsWith("postgres://") || value.startsWith("postgresql://"));

const pooledCandidates = [
  process.env.POSTGRES_PRISMA_URL,
  process.env.POSTGRES_URL,
  process.env.DATABASE_URL,
  process.env.NEON_URL,
  process.env.NEON_DATABASE_URL,
  process.env.NEON_POSTGRES_PRISMA_URL,
  process.env.NEON_POSTGRES_URL,
  process.env.NEON_DATABASE_URL,
];

const directCandidates = [
  process.env.POSTGRES_URL_NON_POOLING,
  process.env.DATABASE_URL_NON_POOLING,
  process.env.DATABASE_URL_UNPOOLED,
  process.env.NEON_URL_NON_POOLING,
  process.env.NEON_URL_UNPOOLED,
  process.env.NEON_POSTGRES_URL_NON_POOLING,
  process.env.NEON_POSTGRES_URL_UNPOOLED,
];

const pooledUrl = pooledCandidates.find(isPostgresUrl);
const directUrl = directCandidates.find(isPostgresUrl) || pooledUrl;

if (pooledUrl) {
  // Normalize envs so Prisma uses the Neon/Vercel connection strings.
  if (!isPostgresUrl(process.env.POSTGRES_PRISMA_URL)) {
    process.env.POSTGRES_PRISMA_URL = pooledUrl;
  }
  if (!isPostgresUrl(process.env.POSTGRES_URL_NON_POOLING) && directUrl) {
    process.env.POSTGRES_URL_NON_POOLING = directUrl;
  }
  if (!isPostgresUrl(process.env.DATABASE_URL)) {
    process.env.DATABASE_URL = pooledUrl;
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
