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
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    const rows = orders.map((order) => ({
      orderCode: order.orderCode,
      customer: order.user?.name ?? "-",
      total: order.grossAmount,
      paymentStatus: order.paymentStatus,
      paymentProof: order.paymentProofUrl ? "Uploaded" : "None",
      createdAt: order.createdAt.toISOString(),
    }));

    const filename = `reports_payments_${startDate || "all"}_${endDate || "all"}.${format}`;
    const meta = `Records: ${rows.length}`;

    if (format === "xlsx") {
      return buildResponse({
        content: toXlsx(rows, "Payments"),
        format,
        filename,
        meta,
      });
    }

    if (format === "pdf") {
      const content = await toPdf(rows, "Rekap Pembayaran");
      return buildResponse({ content, format, filename, meta });
    }

    return buildResponse({
      content: toCsv(rows),
      format,
      filename,
      meta,
    });
  } catch (error: any) {
    console.error("GET /api/reports/payments error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal membuat laporan" },
      { status: 500 }
    );
  }
}

