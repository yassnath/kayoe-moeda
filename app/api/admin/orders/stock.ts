import { prisma } from "@/lib/prisma";

type StockAction = "deduct" | "restore";

export async function adjustOrderStock(orderId: string, action: StockAction) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { produk: true },
      },
    },
  });

  if (!order) {
    throw new Error("Pesanan tidak ditemukan.");
  }

  if (action === "deduct" && order.stockAdjusted) {
    return order;
  }

  if (action === "restore" && !order.stockAdjusted) {
    return order;
  }

  if (action === "deduct") {
    for (const item of order.items) {
      if (!item.produk) {
        throw new Error("Produk untuk item pesanan tidak ditemukan.");
      }
      if (item.produk.capacity < item.quantity) {
        throw new Error(
          `Stok ${item.produk.name} tidak cukup untuk pesanan ini.`
        );
      }
    }
  }

  await prisma.$transaction([
    ...order.items.map((item) =>
      prisma.produk.update({
        where: { id: item.produkId },
        data: {
          capacity:
            action === "deduct"
              ? { decrement: item.quantity }
              : { increment: item.quantity },
        },
      })
    ),
    prisma.order.update({
      where: { id: orderId },
      data: { stockAdjusted: action === "deduct" },
    }),
  ]);

  return order;
}
