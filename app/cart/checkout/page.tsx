"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CartSummary = {
  id: string | null;
  items: {
    id: string;
    quantity: number;
    price: number;
    produk: { name: string };
  }[];
};

type OrderItemResponse = {
  name: string;
  quantity: number;
  price: number;
};

type CreateOrderResponse = {
  orderId?: string;
  orderCode?: string;
  grossAmount?: number;
  items?: OrderItemResponse[];
  message?: string;
};

export default function CartCheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartSummary>({ id: null, items: [] });
  const [loadingCart, setLoadingCart] = useState(true);

  const [loadingPay, setLoadingPay] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    recipientName: "",
    recipientPhone: "",
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const total = useMemo(() => {
    return cart.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  }, [cart.items]);

  const itemCount = useMemo(() => {
    return cart.items.reduce((sum, it) => sum + it.quantity, 0);
  }, [cart.items]);

  // 1) Load cart
  useEffect(() => {
    const load = async () => {
      setLoadingCart(true);
      setError(null);
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setCart({ id: null, items: [] });
          setError(data?.message || "Gagal mengambil cart.");
          return;
        }

        setCart({
          id: data?.id ?? null,
          items: Array.isArray(data?.items) ? data.items : [],
        });
      } catch (e) {
        console.error(e);
        setError("Gagal mengambil cart.");
      } finally {
        setLoadingCart(false);
      }
    };

    load();
  }, []);

  const normalizePhoneForWa = (phone: string) => {
    const digits = phone.replace(/[^\d]/g, "");
    if (digits.startsWith("0")) return `62${digits.slice(1)}`;
    return digits;
  };

  const formatCurrency = (value: number) =>
    `Rp ${value.toLocaleString("id-ID")}`;

  const buildWhatsappMessage = (payload: {
    orderCode?: string;
    items: OrderItemResponse[];
    total: number;
    recipientName: string;
    recipientPhone: string;
    addressLine: string;
    city: string;
    province: string;
    postalCode: string;
  }) => {
    const lines = payload.items.map((it, idx) => {
      const subtotal = it.price * it.quantity;
      return `${idx + 1}. ${it.name} (${it.quantity} x ${formatCurrency(
        it.price
      )}) = ${formatCurrency(subtotal)}`;
    });

    return [
      `Halo Admin Kayoe Moeda, saya memesan barang berikut:`,
      "",
      ...lines,
      "",
      `Total: ${formatCurrency(payload.total)}`,
      payload.orderCode ? `Kode Pesanan: ${payload.orderCode}` : null,
      "",
      `Nama Penerima: ${payload.recipientName}`,
      `No. WhatsApp: ${payload.recipientPhone}`,
      `Alamat: ${payload.addressLine}, ${payload.city}, ${payload.province}, ${payload.postalCode}`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  // 2) Submit: create order -> kirim ke WhatsApp
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (cart.items.length === 0) {
      setError("Keranjang kosong.");
      return;
    }

    setLoadingPay(true);

    try {
      const resOrder = await fetch("/api/orders/from-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const orderData: CreateOrderResponse = await resOrder.json().catch(
        () => ({})
      );

      if (!resOrder.ok) {
        setError(orderData?.message || "Gagal membuat order.");
        return;
      }

      const items =
        orderData?.items && orderData.items.length > 0
          ? orderData.items
          : cart.items.map((it) => ({
              name: it.produk?.name || "Produk",
              quantity: it.quantity,
              price: it.price,
            }));

      const totalAmount =
        typeof orderData?.grossAmount === "number"
          ? orderData.grossAmount
          : total;

      const message = buildWhatsappMessage({
        orderCode: orderData?.orderCode,
        items,
        total: totalAmount,
        recipientName: form.recipientName,
        recipientPhone: form.recipientPhone,
        addressLine: form.addressLine,
        city: form.city,
        province: form.province,
        postalCode: form.postalCode,
      });

      const waNumber = normalizePhoneForWa("085771753354");
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
        message
      )}`;

      window.location.href = waUrl;
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setLoadingPay(false);
    }
  };

  const payDisabled = loadingPay || loadingCart || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-km-sand">
      {/* OPSI B: container per page */}
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.32em] text-black/45">
            Checkout
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#111827]">
            Checkout Keranjang
          </h1>
          <p className="text-sm text-[#111827]/70 max-w-2xl">
            Isi alamat pengiriman, lalu lanjutkan pemesanan via WhatsApp.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-red-500/20 text-red-700 shadow-md">
            <p className="text-sm font-semibold">Terjadi kesalahan</p>
            <p className="text-sm mt-1 text-red-700/90">{error}</p>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,0.45fr] items-start">
          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="rounded-2xl bg-white p-5 md:p-7 ring-1 ring-black/5 shadow-md space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base md:text-lg font-semibold tracking-tight text-[#111827]">
                  Alamat Pengiriman
                </h2>
                <p className="mt-1 text-sm text-[#111827]/60">
                  Pastikan data penerima dan alamat lengkap.
                </p>
              </div>

              <div className="hidden md:block text-xs text-black/45">
                {loadingCart ? "Memuat ringkasan..." : `${itemCount} item`}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1">
                  Nama Penerima
                </label>
                <input
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-[#111827]
                             ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-km-caramel/70"
                  value={form.recipientName}
                  onChange={(e) =>
                    setForm({ ...form, recipientName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1">
                  No. WhatsApp / HP
                </label>
                <input
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-[#111827]
                             ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-km-caramel/70"
                  value={form.recipientPhone}
                  onChange={(e) =>
                    setForm({ ...form, recipientPhone: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-[#111827]
                             ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-km-caramel/70"
                  rows={3}
                  value={form.addressLine}
                  onChange={(e) =>
                    setForm({ ...form, addressLine: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1">
                    Kota
                  </label>
                  <input
                    className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-[#111827]
                               ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-km-caramel/70"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1">
                    Provinsi
                  </label>
                  <input
                    className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-[#111827]
                               ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-km-caramel/70"
                    value={form.province}
                    onChange={(e) =>
                      setForm({ ...form, province: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#111827] mb-1">
                    Kode Pos
                  </label>
                  <input
                    className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-[#111827]
                               ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-km-caramel/70"
                    value={form.postalCode}
                    onChange={(e) =>
                      setForm({ ...form, postalCode: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pay button */}
            <button
              disabled={payDisabled}
              className="w-full rounded-2xl bg-km-clay ring-1 ring-km-line px-4 py-3 text-sm font-semibold
                         hover:bg-km-cream transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
            >
              {loadingPay
                ? "Memproses..."
                : "Pesan Sekarang"}
            </button>

            <p className="text-xs text-[#111827]/55 leading-relaxed">
              Setelah klik pesan, Anda akan diarahkan ke WhatsApp untuk konfirmasi pesanan.
            </p>
          </form>

          {/* Summary */}
          <aside className="rounded-2xl bg-white p-5 md:p-6 ring-1 ring-black/5 shadow-md sticky top-24">
            <h2 className="text-base md:text-lg font-semibold tracking-tight text-[#111827]">
              Ringkasan
            </h2>

            <div className="mt-4 space-y-2 text-sm text-[#111827]/75">
              <div className="flex items-center justify-between">
                <span>Item</span>
                <span className="font-semibold text-[#111827]">
                  {loadingCart ? "..." : itemCount}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="text-base font-semibold text-km-ink">
                  Rp {loadingCart ? "..." : total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="mt-5 h-px bg-black/10" />

            <div className="mt-5 rounded-2xl bg-km-clay p-4 ring-1 ring-km-line">
              <p className="text-sm font-semibold text-[#111827]">
                Tips
              </p>
              <p className="mt-1 text-sm text-[#111827]/70">
                Pastikan nomor WhatsApp aktif untuk update pengiriman dan konfirmasi.
              </p>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => router.push("/cart")}
                className="w-full rounded-2xl bg-km-cream ring-1 ring-km-line px-4 py-3
                           text-sm font-semibold hover:bg-km-clay transition"
              >
                Kembali ke Keranjang
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
