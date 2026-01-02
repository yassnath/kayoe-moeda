export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const role = session?.user?.role;

    if (!session || (role !== "ADMIN" && role !== "OWNER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const name = String(formData.get("name") || "");
    const description = String(formData.get("description") || "");
    const price = Number(formData.get("price") || 0);
    const capacity = Number(formData.get("capacity") || 1);
    const imageFile = formData.get("image") as File | null;

    if (!name || !price || !imageFile) {
      return NextResponse.json(
        { error: "Nama, harga, dan gambar wajib diisi" },
        { status: 400 }
      );
    }

    // ------- SIMPAN GAMBAR -------
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(imageFile.name);
    const base = path.basename(imageFile.name, ext).replace(/\s+/g, "-");
    const filename = `${Date.now()}-${base}${ext}`;

    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, buffer);

    const imageUrl = `/uploads/${filename}`;
    // ------------------------------

    const Produk = await prisma.Produk.create({
      data: {
        name,
        description,
        price,
        capacity,
        image: imageUrl,
      },
    });

    return NextResponse.json(Produk, { status: 201 });
  } catch (err: any) {
    console.error("Produk CREATE ERROR →", err);

    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
