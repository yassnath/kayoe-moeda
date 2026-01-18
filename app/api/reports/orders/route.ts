import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildResponse, toCsv, toPdf, toXlsx } from "../helpers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session || (role !== "ADMIN" && role !== "OWNER")) {
      return NextResponse.json(
        { message: "Tidak memiliki akses" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const format = (searchParams.get("format") || "csv") as
      | "csv"
      | "xlsx"
      | "pdf";
    const query = searchParams.get("q")?.toLowerCase() ?? "";
    const statusFilter = searchParams.get("status") ?? "all";
    const paymentFilter = searchParams.get("payment") ?? "all";

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
      where: dateFilter,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    const mapOrderStatus = (order: typeof orders[number]) => {
      if (order.paymentStatus === "CANCELLED") return "BATAL";
      if (order.shippingStatus === "DELIVERED") return "SELESAI";
      if (
        order.shippingStatus === "PACKED" ||
        order.shippingStatus === "SHIPPED"
      ) {
        return "PROSES";
      }
      return "BARU";
    };

    const mapPaymentStatus = (value: string) => {
      if (value === "PAID") return "PAID";
      return "UNPAID";
    };

    const filteredOrders = orders.filter((order) => {
      if (query) {
        const haystack = [
          order.orderCode,
          order.user?.name,
          order.user?.email,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (statusFilter !== "all" && mapOrderStatus(order) !== statusFilter) {
        return false;
      }
      if (
        paymentFilter !== "all" &&
        mapPaymentStatus(order.paymentStatus) !== paymentFilter
      ) {
        return false;
      }
      return true;
    });

    const rows = filteredOrders.map((order) => ({
      orderCode: order.orderCode,
      customer: order.user?.name ?? "-",
      email: order.user?.email ?? "-",
      phone: order.user?.phone ?? "-",
      total: order.grossAmount,
      paymentStatus: order.paymentStatus,
      shippingStatus: order.shippingStatus,
      createdAt: order.createdAt.toISOString(),
    }));

    const filename = `reports_orders_${startDate || "all"}_${endDate || "all"}.${format}`;
    const meta = `Records: ${rows.length}`;

    if (format === "xlsx") {
      return buildResponse({
        content: toXlsx(rows, "Orders"),
        format,
        filename,
        meta,
      });
    }

    if (format === "pdf") {
      const content = await toPdf(rows, "Rekap Pesanan");
      return buildResponse({ content, format, filename, meta });
    }

    return buildResponse({
      content: toCsv(rows),
      format,
      filename,
      meta,
    });
  } catch (error: any) {
    console.error("GET /api/reports/orders error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal membuat laporan" },
      { status: 500 }
    );
  }
}
