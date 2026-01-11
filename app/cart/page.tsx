"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { resolveImageSrc } from "@/lib/utils";
import Link from "next/link";

type Produk = {
  id: string;
  name: string;
  image: string;
  price: number;
};

type CartItem = {
  id: string;
  quantity: number;
  price: number;
  produk: Produk;
};

type CartData = {
  id: string | null;
  items: CartItem[];
};

export default function CartPage() {
  const [cart, setCart] = useState<CartData>({ id: null, items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(() => {
    return cart.items.reduce((sum, it) => sum + it.quantity * it.price, 0);
  }, [cart.items]);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Gagal mengambil cart");
        setCart({ id: null, items: [] });
        return;
      }

      setCart(data);
    } catch (e) {
      console.error(e);
      setError("Terjadi kesalahan saat mengambil cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (itemId: string, quantity: number) => {
    setError(null);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || "Gagal mengubah jumlah item");
        return;
      }

      await loadCart();
    } catch (e) {
      console.error(e);
      setError("Terjadi kesalahan saat mengubah jumlah item");
    }
  };

  const removeItem = async (itemId: string) => {
    setError(null);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || "Gagal menghapus item");
        return;
      }

      await loadCart();
    } catch (e) {
      console.error(e);
      setError("Terjadi kesalahan saat menghapus item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--km-bg)]">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-12">
          <div className="rounded-3xl border border-km-line bg-white p-6 shadow-soft">
            <p className="text-sm text-km-ink/60">Memuat cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-12">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
            Checkout
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-km-ink">
            Keranjang
          </h1>
          <p className="text-km-ink/70 max-w-2xl">
            Periksa item sebelum lanjut ke checkout.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-soft">
            <p className="text-sm font-semibold">Terjadi kesalahan</p>
            <p className="text-sm mt-1 text-red-700/90">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {cart.items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-km-line bg-white p-8 shadow-soft">
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/45">
              Keranjang kosong
            </p>
            <h2 className="mt-3 text-lg md:text-xl font-semibold tracking-tight text-km-ink">
              Keranjang Anda masih kosong
            </h2>
            <p className="mt-2 text-sm text-km-ink/70">
              Mulai dari katalog untuk menambahkan produk ke keranjang.
            </p>

            <div className="mt-6">
              <Link
                href="/produk"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                           bg-km-wood text-white ring-1 ring-km-wood hover:opacity-90 transition shadow-soft no-underline"
              >
                Belanja Produk
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,0.45fr] items-start">
            {/* List */}
            <div className="space-y-4">
              {cart.items.map((it) => {
                const img = resolveImageSrc(it.produk.image);

                const lineTotal = it.quantity * it.price;

                return (
                  <div
                    key={it.id}
                    className="rounded-3xl border border-km-line bg-white p-4 md:p-5 shadow-soft"
                  >
                    <div className="flex gap-4">
                      <div className="relative h-20 w-24 md:h-24 md:w-28 overflow-hidden rounded-2xl bg-km-surface-alt ring-1 ring-km-line">
                        <Image
                          src={img}
                          alt={it.produk.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 96px, 112px"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm md:text-base font-semibold tracking-tight text-km-ink line-clamp-1">
                              {it.produk.name}
                            </p>
                            <p className="mt-1 text-xs md:text-sm text-km-ink/65">
                              Rp {it.price.toLocaleString("id-ID")}
                            </p>
                          </div>

                          <button
                            onClick={() => removeItem(it.id)}
                            className="shrink-0 text-xs font-semibold text-red-600 hover:opacity-80 transition"
                            type="button"
                          >
                            Hapus
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          {/* Qty control */}
                          <div className="inline-flex items-center rounded-2xl bg-km-surface-alt ring-1 ring-km-line overflow-hidden">
                            <button
                              onClick={() =>
                                updateQty(it.id, Math.max(1, it.quantity - 1))
                              }
                              className="h-9 w-10 text-km-ink hover:bg-km-cream transition"
                              type="button"
                              aria-label="Kurangi jumlah"
                            >
                              −
                            </button>
                            <div className="h-9 w-12 flex items-center justify-center text-sm font-semibold text-km-ink">
                              {it.quantity}
                            </div>
                            <button
                              onClick={() => updateQty(it.id, it.quantity + 1)}
                              className="h-9 w-10 text-km-ink hover:bg-km-cream transition"
                              type="button"
                              aria-label="Tambah jumlah"
                            >
                              +
                            </button>
                          </div>

                          {/* Line total */}
                          <div className="text-sm text-km-ink/70">
                            Subtotal:{" "}
                            <span className="font-semibold text-km-ink">
                              Rp {lineTotal.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="rounded-3xl border border-km-line bg-white p-5 md:p-6 shadow-soft sticky top-24">
              <h2 className="text-base md:text-lg font-semibold tracking-tight text-km-ink">
                Ringkasan
              </h2>

              <div className="mt-4 flex items-center justify-between text-sm text-km-ink/70">
                <span>Total</span>
                <span className="text-base font-semibold text-km-ink">
                  Rp {total.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="mt-5 h-px bg-km-line" />

              {/* ✅ tombol navigasi ke checkout cart */}
              <Link href="/cart/checkout" className="block mt-5">
                <button
                  className="w-full rounded-full bg-km-wood ring-1 ring-km-wood px-4 py-3 text-sm font-semibold
                             text-white hover:opacity-90 transition shadow-soft"
                  type="button"
                >
                  Pesan Sekarang
                </button>
              </Link>

              <p className="text-xs text-km-ink/60 mt-3 leading-relaxed">
                * Anda akan diarahkan ke WhatsApp setelah checkout untuk konfirmasi pesanan.
              </p>

              <Link
                href="/produk"
                className="mt-4 inline-flex text-sm font-semibold text-km-ink hover:opacity-80 transition no-underline"
              >
                Tambah item lagi
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
