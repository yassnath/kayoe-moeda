import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const ALLOWED_IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp"];

function isAllowedImage(file: File) {
  const type = file.type?.toLowerCase();
  if (type && ALLOWED_IMAGE_TYPES.has(type)) return true;
  const name = file.name?.toLowerCase() ?? "";
  return ALLOWED_IMAGE_EXT.some((ext) => name.endsWith(ext));
}

async function uploadProof(file: File, orderId: string): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN missing");
  }
  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const filename = `payment-proofs/${orderId}/${Date.now()}-${safeName}`;
  const blob = await put(filename, file, { access: "public" });
  return blob.url;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const orderId = params?.id;
    if (!orderId) {
      return NextResponse.json(
        { message: "Order tidak ditemukan." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order tidak ditemukan." },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("paymentProof") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { message: "File bukti pembayaran wajib diupload." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Ukuran file maksimal 5MB." },
        { status: 400 }
      );
    }

    if (!isAllowedImage(file)) {
      return NextResponse.json(
        {
          message:
            "Format file tidak didukung. Gunakan .png, .jpg, .jpeg, atau .webp.",
        },
        { status: 400 }
      );
    }

    let imageUrl: string;
    try {
      imageUrl = await uploadProof(file, orderId);
    } catch (error) {
      console.error("Upload payment proof error:", error);
      const errorMessage =
        error instanceof Error && error.message.includes("BLOB_READ_WRITE_TOKEN")
          ? "Vercel Blob belum terhubung. Tambahkan BLOB_READ_WRITE_TOKEN di Environment Variables."
          : "Gagal mengunggah bukti pembayaran.";
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentProofUrl: imageUrl,
        paymentProofUploadedAt: new Date(),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("POST /api/orders/[id]/payment-proof error:", error);
    return NextResponse.json(
      { message: "Gagal mengunggah bukti pembayaran." },
      { status: 500 }
    );
  }
}
