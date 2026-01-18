import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildResponse, toCsv, toPdf, toXlsx } from "../helpers";

export const runtime = "nodejs";

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
    const format = (searchParams.get("format") || "csv") as
      | "csv"
      | "xlsx"
      | "pdf";

    const products = await prisma.produk.findMany({
      orderBy: { updatedAt: "desc" },
    });

    const rows = products.map((product) => ({
      name: product.name,
      price: product.price,
      stock: product.capacity,
      updatedAt: product.updatedAt.toISOString(),
    }));

    const filename = `reports_products.${format}`;
    const meta = `Records: ${rows.length}`;

    if (format === "xlsx") {
      return buildResponse({
        content: toXlsx(rows, "Products"),
        format,
        filename,
        meta,
      });
    }

    if (format === "pdf") {
      const content = await toPdf(rows, "Rekap Produk");
      return buildResponse({ content, format, filename, meta });
    }

    return buildResponse({
      content: toCsv(rows),
      format,
      filename,
      meta,
    });
  } catch (error: any) {
    console.error("GET /api/reports/products error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal membuat laporan" },
      { status: 500 }
    );
  }
}
