export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { put } from "@vercel/blob";

const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const ALLOWED_IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp"];

function isAllowedImage(file: File) {
  const type = file.type?.toLowerCase();
  if (type && ALLOWED_IMAGE_TYPES.has(type)) return true;
  const name = file.name?.toLowerCase() ?? "";
  return ALLOWED_IMAGE_EXT.some((ext) => name.endsWith(ext));
}

async function uploadRoomImage(file: File): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN missing");
  }
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

    if (!isAllowedImage(imageFile)) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Gunakan .png, .jpg, .jpeg, atau .webp." },
        { status: 400 }
      );
    }

    try {
      imageUrl = await uploadRoomImage(imageFile);
    } catch (error) {
      console.error("Upload room image error:", error);
      const errorMessage =
        error instanceof Error &&
        error.message.includes("BLOB_READ_WRITE_TOKEN")
          ? "Vercel Blob belum terhubung. Tambahkan BLOB_READ_WRITE_TOKEN di Environment Variables."
          : "Gagal mengunggah gambar. Pastikan Vercel Blob sudah aktif.";
      return NextResponse.json(
        { error: errorMessage },
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
