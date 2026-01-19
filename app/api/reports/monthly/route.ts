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
      orderBy: { createdAt: "asc" },
    });

    const monthly: Record<
      string,
      { totalOrders: number; totalRevenue: number }
    > = {};

    for (const order of orders) {
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!monthly[key]) {
        monthly[key] = { totalOrders: 0, totalRevenue: 0 };
      }
      monthly[key].totalOrders += 1;
      monthly[key].totalRevenue += order.grossAmount || 0;
    }

    const rows = Object.entries(monthly).map(([month, values]) => ({
      month,
      totalOrders: values.totalOrders,
      totalRevenue: values.totalRevenue,
    }));

    const filename = `reports_monthly_${startDate || "all"}_${endDate || "all"}.${format}`;
    const meta = `Records: ${rows.length}`;

    if (format === "xlsx") {
      return buildResponse({
        content: toXlsx(rows, "Monthly"),
        format,
        filename,
        meta,
      });
    }

    if (format === "pdf") {
      const content = await toPdf(rows, "Rekap Bulanan");
      return buildResponse({ content, format, filename, meta });
    }

    return buildResponse({
      content: toCsv(rows),
      format,
      filename,
      meta,
    });
  } catch (error: any) {
    console.error("GET /api/reports/monthly error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal membuat laporan" },
      { status: 500 }
    );
  }
}
