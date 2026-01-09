// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin seed data
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@kayoemoeda.local";
  const adminUsername = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const adminPasswordPlain = process.env.SEED_ADMIN_PASSWORD ?? "password";

  // Owner seed data
  const ownerEmail = process.env.SEED_OWNER_EMAIL ?? "owner@kayoemoeda.local";
  const ownerUsername = process.env.SEED_OWNER_USERNAME ?? "owner";
  const ownerPasswordPlain = process.env.SEED_OWNER_PASSWORD ?? "password";

  const adminPasswordHash = await bcrypt.hash(adminPasswordPlain, 10);
  const ownerPasswordHash = await bcrypt.hash(ownerPasswordPlain, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPasswordHash,
      role: "ADMIN",
    },
    create: {
      name: "Super Admin Kayoe Moeda",
      email: adminEmail,
      username: adminUsername,
      password: adminPasswordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {
      password: ownerPasswordHash,
      role: "OWNER",
    },
    create: {
      name: "Owner Kayoe Moeda",
      email: ownerEmail,
      username: ownerUsername,
      password: ownerPasswordHash,
      role: "OWNER",
    },
  });

  console.log("Admin created or updated");
  console.log("Admin Email   :", adminEmail);
  console.log("Admin Password:", adminPasswordPlain);
  console.log("Owner created or updated");
  console.log("Owner Email   :", ownerEmail);
  console.log("Owner Password:", ownerPasswordPlain);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
