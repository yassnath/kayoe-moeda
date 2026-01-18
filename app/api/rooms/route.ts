// app/api/admin/Produks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

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

export async function GET() {
  try {
    const produks = await prisma.produk.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(produks);
  } catch (error) {
    console.error("GET /api/admin/Produks error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data Produk" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session || (role !== "ADMIN" && role !== "OWNER")) {
      return NextResponse.json(
        { message: "Tidak memiliki akses" },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const priceRaw = formData.get("price") as string | null;
    const capacityRaw = formData.get("capacity") as string | null;
    const file = formData.get("image") as File | null;

    if (!name || !description || !priceRaw) {
      return NextResponse.json(
        { message: "Nama, deskripsi, dan harga wajib diisi" },
        { status: 400 }
      );
    }

    const priceClean = priceRaw.replace(/[^\d]/g, "");
    const priceNumber = Number.parseInt(priceClean, 10);
    if (Number.isNaN(priceNumber)) {
      return NextResponse.json(
        { message: "Format harga tidak valid" },
        { status: 400 }
      );
    }

    const capacityNumber = capacityRaw
      ? Math.max(1, Number.parseInt(capacityRaw, 10) || 1)
      : 1;

    let imagePath = "/uploads/default-produk.jpg";

    if (file && file.size > 0) {
      if (!isAllowedImage(file)) {
        return NextResponse.json(
          { message: "Format file tidak didukung. Gunakan .png, .jpg, .jpeg, atau .webp." },
          { status: 400 }
        );
      }

      try {
        imagePath = await uploadRoomImage(file);
      } catch (error) {
        console.error("Upload room image error:", error);
        const errorMessage =
          error instanceof Error &&
          error.message.includes("BLOB_READ_WRITE_TOKEN")
            ? "Vercel Blob belum terhubung. Tambahkan BLOB_READ_WRITE_TOKEN di Environment Variables."
            : "Gagal mengunggah gambar. Pastikan Vercel Blob sudah aktif.";
        return NextResponse.json(
          { message: errorMessage },
          { status: 500 }
        );
      }
    }

    const produk = await prisma.produk.create({
      data: {
        name,
        description,
        image: imagePath,
        price: priceNumber,
        capacity: capacityNumber,
      },
    });

    return NextResponse.json(produk, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/Produks error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal menambahkan Produk" },
      { status: 500 }
    );
  }
}
