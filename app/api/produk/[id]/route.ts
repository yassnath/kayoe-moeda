import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ID produk tidak valid." },
        { status: 400 }
      );
    }

    const produk = await prisma.produk.findUnique({
      where: { id },
    });

    if (!produk) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(produk, { status: 200 });
  } catch (error) {
    console.error("GET /api/produk/[id] error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil produk." },
      { status: 500 }
    );
  }
}
