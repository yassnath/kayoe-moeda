// app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Util: ambil id dari URL
function getIdFromRequest(req: NextRequest): string {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean); // ["api","admin","orders","<id>"]
  return parts[parts.length - 1] || "";
}

// GET /api/admin/orders/:id → detail pesanan
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

    const id = getIdFromRequest(req);
    if (!id) {
      return NextResponse.json(
        { message: "ID pesanan tidak ditemukan di URL" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/admin/orders/[id] error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal mengambil detail pesanan" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/orders/:id → update status pesanan (manual)
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session || (role !== "ADMIN" && role !== "OWNER")) {
      return NextResponse.json(
        { message: "Tidak memiliki akses" },
        { status: 403 }
      );
    }

    const id = getIdFromRequest(req);
    if (!id) {
      return NextResponse.json(
        { message: "ID pesanan tidak ditemukan di URL" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null) as
      | { status?: string }
      | null;

    const status = body?.status;
    if (!status) {
      return NextResponse.json(
        { message: "Status baru wajib diisi" },
        { status: 400 }
      );
    }
    if (!["PENDING", "PROCESSING", "DONE", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { message: "Status tidak valid" },
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

    let paymentStatus: "PENDING" | "PAID" | "CANCELLED" = "PENDING";
    let shippingStatus:
      | "PENDING"
      | "PACKED"
      | "SHIPPED"
      | "DELIVERED" = "PENDING";

    if (status === "PROCESSING") {
      paymentStatus = "PAID";
      shippingStatus = "PACKED";
    } else if (status === "DONE") {
      paymentStatus = "PAID";
      shippingStatus = "DELIVERED";
    } else if (status === "CANCELLED") {
      paymentStatus = "CANCELLED";
      shippingStatus = "PENDING";
    }

    await prisma.order.update({
      where: { id },
      data: {
        paymentStatus,
        shippingStatus,
      },
    });

    const updated = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: true,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/admin/orders/[id] error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal mengupdate status pesanan" },
      { status: 500 }
    );
  }
}
