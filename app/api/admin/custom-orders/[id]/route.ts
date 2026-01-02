// app/api/admin/custom-orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function getIdFromRequest(req: NextRequest): string {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean); // ["api","admin","custom-orders","<id>"]
  return parts[parts.length - 1] || "";
}

// GET /api/admin/custom-orders/:id → detail custom order
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
        { message: "ID custom order tidak ditemukan di URL" },
        { status: 400 }
      );
    }

    const order = await prisma.customOrder.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Custom order tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/admin/custom-orders/[id] error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal mengambil detail custom order" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/custom-orders/:id → update status custom order
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
        { message: "ID custom order tidak ditemukan di URL" },
        { status: 400 }
      );
    }

    const body = (await req.json().catch(() => null)) as
      | { status?: string }
      | null;

    const status = body?.status;
    if (!status) {
      return NextResponse.json(
        { message: "Status wajib diisi" },
        { status: 400 }
      );
    }

    const order = await prisma.customOrder.update({
      where: { id },
      data: {
        status: status as any,
      },
    });

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/admin/custom-orders/[id] error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal mengupdate custom order" },
      { status: 500 }
    );
  }
}
