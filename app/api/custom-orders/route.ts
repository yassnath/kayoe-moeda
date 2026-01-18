// app/api/custom-orders/route.ts
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

async function uploadCustomOrderImage(file: File): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN missing");
  }
  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const filename = `custom-orders/${Date.now()}-${safeName}`;
  const blob = await put(filename, file, { access: "public" });
  return blob.url;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const customerName = (formData.get("customerName") as string | null)?.trim();
    const email = (formData.get("email") as string | null)?.trim();
    const phone = (formData.get("phone") as string | null)?.trim();
    const orderName = (formData.get("orderName") as string | null)?.trim();
    const orderTypeRaw = (formData.get("orderType") as string | null)?.trim();
    const description = (formData.get("description") as string | null)?.trim();
    const file = formData.get("image") as File | null;

    if (!customerName || !email || !phone || !orderName || !orderTypeRaw || !description) {
      return NextResponse.json(
        { message: "Semua field wajib diisi (kecuali gambar)." },
        { status: 400 }
      );
    }

    const allowed = ["MUG", "GELAS", "PIRING", "MANGKOK", "LAINNYA"];
    const normalizedType = orderTypeRaw.toUpperCase();
    if (!allowed.includes(normalizedType)) {
      return NextResponse.json(
        { message: "Tipe pesanan tidak valid." },
        { status: 400 }
      );
    }

    let imagePath: string | null = null;

    if (file && file.size > 0) {
      if (!isAllowedImage(file)) {
        return NextResponse.json(
          { message: "Format file tidak didukung. Gunakan .png, .jpg, .jpeg, atau .webp." },
          { status: 400 }
        );
      }

      try {
        imagePath = await uploadCustomOrderImage(file);
      } catch (error) {
        console.error("Upload custom order image error:", error);
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

    // ✅ Pakai userId langsung (dan cast any untuk menghindari typings cache Prisma)
    const created = await prisma.customOrder.create({
      data: {
        userId,
        customerName,
        email,
        phone,
        orderName,
        orderType: normalizedType,
        description,
        image: imagePath,
        status: "NEW",
      } as any,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/custom-orders error:", error);
    return NextResponse.json(
      { message: "Gagal mengirim custom order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const list = await prisma.customOrder.findMany({
      where: { userId } as any,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        customerName: true,
        email: true,
        phone: true,
        orderName: true,
        orderType: true,
        description: true,
        image: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(list, { status: 200 });
  } catch (error) {
    console.error("GET /api/custom-orders error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil riwayat custom order" },
      { status: 500 }
    );
  }
}
