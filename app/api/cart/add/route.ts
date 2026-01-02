// app/api/cart/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Silakan login untuk menambahkan ke cart." },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    const body = await req.json().catch(() => null) as
      | { produkId?: string; quantity?: number }
      | null;

    if (!body?.produkId) {
      return NextResponse.json(
        { message: "Produk tidak valid." },
        { status: 400 }
      );
    }

    const quantity = body.quantity && body.quantity > 0 ? body.quantity : 1;

    // Pastikan produk ada
    const produk = await prisma.produk.findUnique({
      where: { id: body.produkId },
    });

    if (!produk) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    // Cari cart milik user
    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Cek apakah item sudah ada di cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, produkId: body.produkId },
    });

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });

      return NextResponse.json(updated);
    }

    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        produkId: body.produkId,
        quantity,
        price: produk.price, // harga per unit saat ini
      },
    });

    return NextResponse.json(newItem);
  } catch (error: any) {
    console.error("POST /api/cart/add error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal menambahkan ke cart." },
      { status: 500 }
    );
  }
}
