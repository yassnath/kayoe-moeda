// app/api/cart/remove/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Silakan login." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null) as
      | { itemId?: string }
      | null;

    if (!body?.itemId) {
      return NextResponse.json(
        { message: "Item tidak valid." },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: body.itemId },
    });

    return NextResponse.json({ message: "Item dihapus." });
  } catch (error: any) {
    console.error("POST /api/cart/remove error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal menghapus item." },
      { status: 500 }
    );
  }
}
