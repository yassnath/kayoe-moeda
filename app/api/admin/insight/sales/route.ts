// app/api/admin/insight/sales/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET /api/admin/insight/sales → data penjualan per bulan (pesanan diproses/selesai)
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

    // Ambil semua order yang sudah diproses/selesai dan tidak dibatalkan
    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: { not: "CANCELLED" },
        shippingStatus: { in: ["PACKED", "SHIPPED", "DELIVERED"] },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Kelompokkan per bulan YYYY-MM di sisi JS
    const monthly: Record<
      string,
      {
        totalAmount: number;
        totalOrders: number;
      }
    > = {};

    for (const o of orders) {
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`; // contoh: 2025-01

      if (!monthly[key]) {
        monthly[key] = {
          totalAmount: 0,
          totalOrders: 0,
        };
      }

      monthly[key].totalAmount += o.grossAmount || 0;
      monthly[key].totalOrders += 1;
    }

    const months = Object.entries(monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, val]) => ({
        month,
        totalAmount: val.totalAmount,
        totalOrders: val.totalOrders,
      }));

    const grandTotal = months.reduce(
      (sum, m) => sum + m.totalAmount,
      0
    );
    const totalOrders = months.reduce(
      (sum, m) => sum + m.totalOrders,
      0
    );

    return NextResponse.json(
      {
        months,
        grandTotal,
        totalOrders,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/admin/insight/sales error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal mengambil data insight penjualan" },
      { status: 500 }
    );
  }
}
