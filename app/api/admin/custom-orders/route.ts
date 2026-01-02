// app/api/admin/custom-orders/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET /api/admin/custom-orders → list semua custom order
export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session || (role !== "ADMIN" && role !== "OWNER")) {
      return NextResponse.json(
        { message: "Tidak memiliki akses" },
        { status: 403 }
      );
    }

    const orders = await prisma.customOrder.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/admin/custom-orders error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal mengambil data custom order" },
      { status: 500 }
    );
  }
}
