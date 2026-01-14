import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const ALLOWED = ["PENDING", "PAID", "FAILED", "EXPIRED", "CANCELLED"] as const;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "ID pesanan tidak ditemukan di URL" },
        { status: 400 }
      );
    }

    const body = (await req.json().catch(() => null)) as
      | { paymentStatus?: string }
      | null;
    const paymentStatus = body?.paymentStatus?.toUpperCase();

    if (!paymentStatus || !ALLOWED.includes(paymentStatus as any)) {
      return NextResponse.json(
        { message: "Status pembayaran tidak valid" },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { paymentStatus: paymentStatus as any },
      include: { user: true, items: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/admin/orders/[id]/payment-status error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal mengupdate status pembayaran" },
      { status: 500 }
    );
  }
}
