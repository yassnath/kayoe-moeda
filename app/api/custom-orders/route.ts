// app/api/custom-orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

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
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), "public", "uploads", "custom-orders");
      await mkdir(uploadsDir, { recursive: true });

      const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
      const fileName = `${Date.now()}-${safeName}`;
      const fullPath = path.join(uploadsDir, fileName);

      await writeFile(fullPath, buffer);
      imagePath = `/uploads/custom-orders/${fileName}`;
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
