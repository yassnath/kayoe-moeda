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

  const upsertSeedUser = async ({
    name,
    email,
    username,
    role,
    passwordPlain,
  }: {
    name: string;
    email?: string;
    username: string;
    role: "ADMIN" | "OWNER";
    passwordPlain: string;
  }) => {
    const passwordHash = await bcrypt.hash(passwordPlain, 10);

    const existingByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingByUsername) {
      let safeEmail: string | undefined;
      if (email && email !== existingByUsername.email) {
        const emailOwner = await prisma.user.findUnique({
          where: { email },
        });
        if (!emailOwner || emailOwner.id === existingByUsername.id) {
          safeEmail = email;
        }
      }

      await prisma.user.update({
        where: { id: existingByUsername.id },
        data: {
          name,
          role,
          password: passwordHash,
          ...(safeEmail ? { email: safeEmail } : {}),
        },
      });
      return;
    }

    if (email) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingByEmail) {
        await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            name,
            username,
            role,
            password: passwordHash,
          },
        });
        return;
      }
    }

    await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: passwordHash,
        role,
      },
    });
  };

  await upsertSeedUser({
    name: "Super Admin Kayoe Moeda",
    email: adminEmail,
    username: adminUsername,
    role: "ADMIN",
    passwordPlain: adminPasswordPlain,
  });

  await upsertSeedUser({
    name: "Owner Kayoe Moeda",
    email: ownerEmail,
    username: ownerUsername,
    role: "OWNER",
    passwordPlain: ownerPasswordPlain,
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
