// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Silakan login untuk checkout." },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { message: "Cart kosong, tidak bisa checkout." },
        { status: 400 }
      );
    }

    // Ambil item pertama sebagai produk utama (sesuai batasan 1 produk / reservation)
    const firstItem = cart.items[0];

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 1. Buat reservation
    const reservation = await prisma.reservation.create({
      data: {
        starDate: new Date(),
        endDate: new Date(),
        price: totalAmount,
        userId,
        produkId: firstItem.produkId,
      },
    });

    // 2. Buat payment
    const payment = await prisma.payment.create({
      data: {
        amount: totalAmount,
        status: "unpaid",
        reservationId: reservation.id,
      },
    });

    // 3. Kosongkan cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({
      message: "Checkout berhasil. Lanjutkan pembayaran.",
      reservation,
      payment,
    });
  } catch (error: any) {
    console.error("POST /api/checkout error:", error);
    return NextResponse.json(
      { message: "Checkout gagal." },
      { status: 500 }
    );
  }
}
