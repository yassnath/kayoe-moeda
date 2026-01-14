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

const ADMIN_WA_NUMBER = process.env.NEXT_PUBLIC_ADMIN_WA;

export default function CartCheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartSummary>({ id: null, items: [] });
  const [loadingCart, setLoadingCart] = useState(true);

  const [loadingPay, setLoadingPay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<{
    orderId?: string;
    orderCode?: string;
  } | null>(null);
  const [waUrl, setWaUrl] = useState<string | null>(null);

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

      const waNumber = ADMIN_WA_NUMBER
        ? normalizePhoneForWa(ADMIN_WA_NUMBER)
        : "";
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
        message
      )}`;

      setCheckoutResult({
        orderId: orderData?.orderId,
        orderCode: orderData?.orderCode,
      });
      setWaUrl(waNumber ? waUrl : null);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setLoadingPay(false);
    }
  };

  const payDisabled = loadingPay || loadingCart || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      {checkoutResult && waUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
              Pesanan dibuat
            </p>
            <h2 className="mt-2 text-lg font-semibold text-km-ink">
              Silakan lanjutkan pembayaran
            </h2>
            <p className="mt-2 text-sm text-km-ink/70">
              Setelah pembayaran, upload bukti pembayaran di halaman Riwayat
              Pesanan.
            </p>
            {!waUrl && (
              <p className="mt-2 text-xs text-red-600">
                Nomor WhatsApp admin belum diatur.
              </p>
            )}
            <div className="mt-4 rounded-2xl bg-km-surface-alt p-3 text-sm text-km-ink/70">
              Order ID:{" "}
              <span className="font-mono text-km-ink">
                {checkoutResult.orderId || "-"}
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={() =>
                  waUrl && window.open(waUrl, "_blank", "noopener,noreferrer")
                }
                disabled={!waUrl}
                className="w-full rounded-full bg-km-wood ring-1 ring-km-wood px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-60"
              >
                Buka WhatsApp
              </button>
              <button
                type="button"
                onClick={() => router.push("/history-order")}
                className="w-full rounded-full bg-white ring-1 ring-km-line px-4 py-3 text-sm font-semibold text-km-ink hover:bg-km-surface-alt transition"
              >
                Ke Riwayat Pesanan
              </button>
              <button
                type="button"
                onClick={() => {
                  setCheckoutResult(null);
                  setWaUrl(null);
                }}
                className="text-xs text-km-ink/60 hover:text-km-ink"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      {/* OPSI B: container per page */}
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-12">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
            Checkout
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-km-ink">
            Checkout Keranjang
          </h1>
          <p className="text-sm text-km-ink/70 max-w-2xl">
            Isi alamat pengiriman, lalu lanjutkan pemesanan via WhatsApp.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-soft">
            <p className="text-sm font-semibold">Terjadi kesalahan</p>
            <p className="text-sm mt-1 text-red-700/90">{error}</p>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,0.45fr] items-start">
          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-km-line bg-white p-5 md:p-7 shadow-soft space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base md:text-lg font-semibold tracking-tight text-km-ink">
                  Alamat Pengiriman
                </h2>
                <p className="mt-1 text-sm text-km-ink/60">
                  Pastikan data penerima dan alamat lengkap.
                </p>
              </div>

              <div className="hidden md:block text-xs text-km-ink/45">
                {loadingCart ? "Memuat ringkasan..." : `${itemCount} item`}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-semibold text-km-ink mb-1">
                  Nama Penerima
                </label>
                <input
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-km-ink
                             ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                  value={form.recipientName}
                  onChange={(e) =>
                    setForm({ ...form, recipientName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-km-ink mb-1">
                  No. WhatsApp / HP
                </label>
                <input
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-km-ink
                             ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                  value={form.recipientPhone}
                  onChange={(e) =>
                    setForm({ ...form, recipientPhone: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-km-ink mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-km-ink
                             ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
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
                  <label className="block text-sm font-semibold text-km-ink mb-1">
                    Kota
                  </label>
                  <input
                    className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-km-ink
                               ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-km-ink mb-1">
                    Provinsi
                  </label>
                  <input
                    className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-km-ink
                               ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                    value={form.province}
                    onChange={(e) =>
                      setForm({ ...form, province: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-km-ink mb-1">
                    Kode Pos
                  </label>
                  <input
                    className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-km-ink
                               ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
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
              className="w-full rounded-full bg-km-wood ring-1 ring-km-wood px-4 py-3 text-sm font-semibold
                         text-white hover:opacity-90 transition shadow-soft disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
            >
              {loadingPay
                ? "Memproses..."
                : "Pesan Sekarang"}
            </button>

            <p className="text-xs text-km-ink/55 leading-relaxed">
              Setelah klik pesan, Anda akan diarahkan ke WhatsApp untuk konfirmasi pesanan.
            </p>
          </form>

          {/* Summary */}
          <aside className="rounded-3xl border border-km-line bg-white p-5 md:p-6 shadow-soft sticky top-24">
            <h2 className="text-base md:text-lg font-semibold tracking-tight text-km-ink">
              Ringkasan
            </h2>

            <div className="mt-4 space-y-2 text-sm text-km-ink/70">
              <div className="flex items-center justify-between">
                <span>Item</span>
                <span className="font-semibold text-km-ink">
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

            <div className="mt-5 h-px bg-km-line" />

            <div className="mt-5 rounded-2xl bg-km-surface-alt p-4 ring-1 ring-km-line">
              <p className="text-sm font-semibold text-km-ink">
                Tips
              </p>
              <p className="mt-1 text-sm text-km-ink/70">
                Pastikan nomor WhatsApp aktif untuk update pengiriman dan konfirmasi.
              </p>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => router.push("/cart")}
                className="w-full rounded-full bg-white ring-1 ring-km-line px-4 py-3
                           text-sm font-semibold text-km-ink hover:bg-km-surface-alt transition"
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
