export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { put } from "@vercel/blob";

async function uploadRoomImage(file: File): Promise<string> {
  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const filename = `rooms/${Date.now()}-${safeName}`;
  const blob = await put(filename, file, { access: "public" });
  return blob.url;
}

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

    let imageUrl = "/uploads/default-produk.jpg";

    try {
      imageUrl = await uploadRoomImage(imageFile);
    } catch (error) {
      console.error("Upload room image error:", error);
      return NextResponse.json(
        { error: "Gagal mengunggah gambar. Pastikan Vercel Blob sudah aktif." },
        { status: 500 }
      );
    }

    const produk = await prisma.produk.create({
      data: {
        name,
        description,
        price,
        capacity,
        image: imageUrl,
      },
    });

    return NextResponse.json(produk, { status: 201 });
  } catch (err: any) {
    console.error("Produk CREATE ERROR →", err);

    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
