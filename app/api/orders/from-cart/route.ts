import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

type Body = {
  recipientName?: string;
  recipientPhone?: string;
  addressLine?: string;
  city?: string;
  province?: string;
  postalCode?: string;
};

function genOrderCode() {
  return `KM-${Date.now()}`;
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    // ✅ guard login
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ setelah guard, pastikan userId bertipe string (bukan string | undefined)
    const userId = session.user.id as string;

    const body = (await req.json().catch(() => ({}))) as Body;

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: { produk: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Keranjang kosong" }, { status: 400 });
    }

    const grossAmount = cart.items.reduce(
      (sum, it) => sum + it.quantity * it.price,
      0
    );

    const orderCode = genOrderCode();

    const created = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderCode,
          userId,
          grossAmount,

          // shipping (optional di schema, aman null)
          recipientName: body.recipientName ?? null,
          recipientPhone: body.recipientPhone ?? null,
          addressLine: body.addressLine ?? null,
          city: body.city ?? null,
          province: body.province ?? null,
          postalCode: body.postalCode ?? null,

          items: {
            create: cart.items.map((it) => ({
              produkId: it.produk.id,
              quantity: it.quantity,
              price: it.price,
              name: it.produk.name,
              image: it.produk.image,
            })),
          },
        },
        select: {
          id: true,
          orderCode: true,
          grossAmount: true,
          items: {
            select: {
              name: true,
              quantity: true,
              price: true,
            },
          },
        },
      });

      // kosongkan cart setelah order dibuat
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });

    return NextResponse.json(
      {
        orderId: created.id,
        orderCode: created.orderCode,
        grossAmount: created.grossAmount,
        items: created.items,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("from-cart error:", e);
    return NextResponse.json(
      { message: "Gagal membuat order dari cart" },
      { status: 500 }
    );
  }
}
