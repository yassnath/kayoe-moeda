// app/api/admin/insight/sales/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET /api/admin/insight/sales → data penjualan per bulan (pesanan diproses/selesai)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session || role !== "OWNER") {
      return NextResponse.json(
        { message: "Tidak memiliki akses" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const dateFilter =
      startDate || endDate
        ? {
            createdAt: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(endDate) } : {}),
            },
          }
        : {};

    const orders = await prisma.order.findMany({
      where: {
        ...dateFilter,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          ...dateFilter,
        },
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

    const trend = Object.entries(monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, val]) => ({
        label: month,
        totalAmount: val.totalAmount,
        totalOrders: val.totalOrders,
      }));

    const totalRevenue = trend.reduce(
      (sum, m) => sum + m.totalAmount,
      0
    );
    const totalOrders = trend.reduce(
      (sum, m) => sum + m.totalOrders,
      0
    );

    const paidCount = orders.filter((o) => o.paymentStatus === "PAID").length;
    const unpaidCount = orders.length - paidCount;

    const statusBreakdown = [
      {
        status: "BARU",
        count: orders.filter((o) => o.shippingStatus === "PENDING").length,
      },
      {
        status: "PROSES",
        count: orders.filter(
          (o) => o.shippingStatus === "PACKED" || o.shippingStatus === "SHIPPED"
        ).length,
      },
      {
        status: "SELESAI",
        count: orders.filter((o) => o.shippingStatus === "DELIVERED").length,
      },
      {
        status: "BATAL",
        count: orders.filter((o) => o.paymentStatus === "CANCELLED").length,
      },
    ];

    const productMap = new Map<
      string,
      { name: string; totalQty: number; totalAmount: number }
    >();
    for (const item of orderItems) {
      const current = productMap.get(item.name) || {
        name: item.name,
        totalQty: 0,
        totalAmount: 0,
      };
      current.totalQty += item.quantity;
      current.totalAmount += item.quantity * item.price;
      productMap.set(item.name, current);
    }

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);

    return NextResponse.json(
      {
        trend,
        totalRevenue,
        totalOrders,
        averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
        paidCount,
        unpaidCount,
        statusBreakdown,
        topProducts,
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
