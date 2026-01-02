// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 🔐 DATA ADMIN AWAL
  const adminEmail = "lanabintang54@gmail.com"; // email untuk login
  const adminUsername = "admin"; // hanya identitas, bukan login utama
  const adminPasswordPlain = "Admin123!"; // password untuk login (boleh diganti)

  // Hash password (sesuai field password di Prisma: String)
  const passwordHash = await bcrypt.hash(adminPasswordPlain, 10);

  // Upsert admin (kalau sudah ada, tidak diubah)
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Super Admin Kaluna Living",
      email: adminEmail,
      username: adminUsername,
      password: passwordHash,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin created or already exists");
  console.log("➡ Email   :", adminEmail);
  console.log("➡ Password:", adminPasswordPlain);
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
