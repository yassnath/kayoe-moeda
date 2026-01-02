import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role as "ADMIN" | "OWNER" | "CUSTOMER" | undefined;

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized", summary: { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 }, monthly: [], topProducts: [] },
        { status: 401 }
      );
    }
    if (role !== "OWNER") {
      return NextResponse.json(
        { message: "Forbidden", summary: { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 }, monthly: [], topProducts: [] },
        { status: 403 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: { not: "CANCELLED" },
        shippingStatus: { in: ["PACKED", "SHIPPED", "DELIVERED"] },
      },
      include: { items: true },
      orderBy: { createdAt: "asc" },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + (o.grossAmount || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const monthlyMap = new Map<string, { revenue: number; orders: number }>();
    for (const o of orders) {
      const k = monthKey(o.createdAt);
      const prev = monthlyMap.get(k) ?? { revenue: 0, orders: 0 };
      monthlyMap.set(k, { revenue: prev.revenue + (o.grossAmount || 0), orders: prev.orders + 1 });
    }

    const monthly = Array.from(monthlyMap.entries()).map(([month, v]) => ({
      month,
      revenue: v.revenue,
      orders: v.orders,
    }));

    const productMap = new Map<string, { sold: number; revenue: number }>();
    for (const o of orders) {
      for (const it of o.items) {
        const key = it.name;
        const prev = productMap.get(key) ?? { sold: 0, revenue: 0 };
        productMap.set(key, {
          sold: prev.sold + (it.quantity || 0),
          revenue: prev.revenue + (it.price || 0) * (it.quantity || 0),
        });
      }
    }

    const topProducts = Array.from(productMap.entries())
      .map(([name, v]) => ({ name, sold: v.sold, revenue: v.revenue }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    return NextResponse.json({
      summary: { totalRevenue, totalOrders, avgOrderValue },
      monthly,
      topProducts,
    });
  } catch (e) {
    console.error("OWNER INSIGHTS ERROR:", e);
    return NextResponse.json(
      { message: "Gagal mengambil insight.", summary: { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 }, monthly: [], topProducts: [] },
      { status: 500 }
    );
  }
}
