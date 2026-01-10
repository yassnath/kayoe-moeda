// app/api/admin/produks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
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

async function uploadProdukImage(file: File): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN missing");
  }
  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const filename = `produks/${Date.now()}-${safeName}`;
  const blob = await put(filename, file, { access: "public" });
  return blob.url;
}

// Util: ambil ID dari URL dengan aman
function getIdFromRequest(req: NextRequest): string {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean); // ["api","admin","produks","<id>"]
  return parts[parts.length - 1] || "";
}

// ========== GET DETAIL ==========
export async function GET(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);

    if (!id) {
      return NextResponse.json(
        { message: "ID produk tidak ditemukan di URL" },
        { status: 400 }
      );
    }

    const produk = await prisma.produk.findUnique({
      where: { id },
    });

    if (!produk) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(produk, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/admin/produks/[id] error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal mengambil data produk" },
      { status: 500 }
    );
  }
}

// ========== PATCH / UPDATE ==========
export async function PATCH(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);

    if (!id) {
      return NextResponse.json(
        { message: "ID produk tidak ditemukan di URL" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const priceRaw = formData.get("price") as string | null;
    const capacityRaw = formData.get("capacity") as string | null;
    const file = formData.get("image") as File | null;

    // parsing harga
    let price: number | undefined;
    if (priceRaw) {
      const clean = priceRaw.replace(/[^\d]/g, "");
      const parsed = Number.parseInt(clean, 10);
      if (!Number.isNaN(parsed)) {
        price = parsed;
      }
    }

    // parsing kapasitas
    let capacity: number | undefined;
    if (capacityRaw) {
      const parsed = Number.parseInt(capacityRaw, 10);
      if (!Number.isNaN(parsed)) {
        capacity = parsed;
      }
    }

    // upload gambar baru (opsional)
    let imagePath: string | undefined;
    if (file && file.size > 0) {
      if (!isAllowedImage(file)) {
        return NextResponse.json(
          { message: "Format file tidak didukung. Gunakan .png, .jpg, .jpeg, atau .webp." },
          { status: 400 }
        );
      }

      try {
        imagePath = await uploadProdukImage(file);
      } catch (error) {
        console.error("Upload produk image error:", error);
        const errorMessage =
          error instanceof Error &&
          error.message.includes("BLOB_READ_WRITE_TOKEN")
            ? "Vercel Blob belum terhubung. Tambahkan BLOB_READ_WRITE_TOKEN di Environment Variables."
            : "Gagal mengunggah gambar. Pastikan Vercel Blob sudah aktif.";
        return NextResponse.json(
          {
            message: errorMessage,
          },
          { status: 500 }
        );
      }
    }

    const updated = await prisma.produk.update({
      where: { id },
      data: {
        ...(name !== null && { name }),
        ...(description !== null && { description }),
        ...(price !== undefined && { price }),
        ...(capacity !== undefined && { capacity }),
        ...(imagePath && { image: imagePath }),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/admin/produks/[id] error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal mengupdate produk" },
      { status: 500 }
    );
  }
}

// ========== DELETE ==========
export async function DELETE(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);

    if (!id) {
      return NextResponse.json(
        { message: "ID produk tidak ditemukan di URL" },
        { status: 400 }
      );
    }

    await prisma.produk.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Produk berhasil dihapus" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/admin/produks/[id] error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}
