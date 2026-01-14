import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session || (role !== "ADMIN" && role !== "OWNER")) {
      return NextResponse.json(
        { message: "Tidak memiliki akses" },
        { status: 403 }
      );
    }

    const id = params?.id;
    if (!id) {
      return NextResponse.json(
        { message: "ID pesanan tidak ditemukan di URL" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (order.paymentStatus === "CANCELLED") {
      return NextResponse.json(
        { message: "Pesanan sudah dibatalkan." },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { paymentStatus: "PAID" },
      include: { user: true, items: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/admin/orders/[id]/confirm-payment error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal konfirmasi pembayaran" },
      { status: 500 }
    );
  }
}
