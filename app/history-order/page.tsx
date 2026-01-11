"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type OrderItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  orderCode: string;
  paymentStatus: string;
  shippingStatus: string;
  grossAmount: number;
  createdAt: string;
  recipientName: string | null;
  recipientPhone: string | null;
  addressLine: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  items: OrderItem[];
};

function badgeClass(label: string) {
  const v = (label || "").toUpperCase();

  if (v.includes("SELESAI")) {
    return "bg-emerald-50 ring-1 ring-emerald-200 text-emerald-700";
  }
  if (v.includes("DIPROSES")) {
    return "bg-km-sand ring-1 ring-km-line text-km-ink";
  }
  if (v.includes("BATAL")) {
    return "bg-red-50 ring-1 ring-red-200 text-red-700";
  }
  return "bg-km-surface-alt text-km-ink ring-1 ring-km-line";
}

export default function HistoryOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders/history", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Gagal mengambil history order.");
        setOrders([]);
        return;
      }

      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (e) {
      console.error(e);
      setError("Gagal mengambil history order.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="rounded-3xl border border-km-line bg-white p-6 shadow-soft">
          <p className="text-sm text-km-ink/60">Memuat riwayat pesanan...</p>
        </div>
      );
    }

    if (error) {
      return (
        <>
          <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-soft">
            <p className="text-sm font-semibold">Terjadi kesalahan</p>
            <p className="text-sm mt-1 text-red-700/90">{error}</p>
          </div>

          <div className="mt-6 rounded-3xl border border-km-line bg-white p-8 shadow-soft">
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/45">
              Empty state
            </p>
            <h3 className="mt-3 text-lg md:text-xl font-semibold tracking-tight text-km-ink">
              Belum ada order / gagal load
            </h3>
            <p className="mt-2 text-sm text-km-ink/70">
              Belum ada pesanan atau gagal memuat data.
            </p>
            <Link
              href="/produk"
              className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                         bg-km-wood ring-1 ring-km-wood text-white hover:opacity-90 transition shadow-soft no-underline"
            >
              Belanja Produk
            </Link>
          </div>
        </>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="rounded-3xl border border-km-line bg-white p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.32em] text-km-ink/45">
            Empty state
          </p>
          <h3 className="mt-3 text-lg md:text-xl font-semibold tracking-tight text-km-ink">
            Belum ada pesanan
          </h3>
          <p className="mt-2 text-sm text-km-ink/70">
            Setelah checkout, riwayat pesanan akan muncul di sini.
          </p>
          <Link
            href="/produk"
            className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                       bg-km-wood ring-1 ring-km-wood text-white hover:opacity-90 transition shadow-soft no-underline"
          >
            Belanja Produk
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {orders.map((o) => {
          const orderLabel =
            o.paymentStatus === "CANCELLED"
              ? "Dibatalkan"
              : o.shippingStatus === "DELIVERED"
              ? "Selesai"
              : o.shippingStatus === "PACKED" || o.shippingStatus === "SHIPPED"
              ? "Diproses"
              : "Pending";

          return (
            <div
              key={o.id}
              className="rounded-3xl border border-km-line bg-white p-5 md:p-6 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-km-ink">
                    Order <span className="text-km-brass">{o.orderCode}</span>
                  </div>
                  <div className="mt-1 text-xs text-km-ink/50">
                    {new Date(o.createdAt).toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(
                      orderLabel
                    )}`}
                    title="Status pesanan"
                  >
                    Pesanan: {orderLabel}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-km-surface-alt p-4 ring-1 ring-km-line">
                <span className="text-sm text-km-ink/75">Total Pembelian</span>
                <span className="text-base font-semibold text-km-ink">
                  Rp {Number(o.grossAmount || 0).toLocaleString("id-ID")}
                </span>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-white ring-1 ring-km-line p-4">
                  <div className="text-sm font-semibold text-km-ink">Produk</div>

                  <div className="mt-3 space-y-3">
                    {o.items.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-km-ink line-clamp-1">
                            {it.name}
                          </div>
                          <div className="text-xs text-km-ink/55 mt-0.5">
                            {it.quantity} x Rp{" "}
                            {Number(it.price || 0).toLocaleString("id-ID")}
                          </div>
                        </div>

                        <div className="text-sm font-semibold text-km-ink">
                          Rp {(it.quantity * it.price).toLocaleString("id-ID")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-white ring-1 ring-km-line p-4">
                    <div className="text-sm font-semibold text-km-ink">
                      Pengiriman
                    </div>
                    <div className="mt-3 text-sm text-km-ink/75 space-y-1">
                      <div>{o.recipientName || "-"}</div>
                      <div>{o.recipientPhone || "-"}</div>
                      <div className="leading-relaxed">
                        {(o.addressLine || "-") +
                          (o.city ? `, ${o.city}` : "") +
                          (o.province ? `, ${o.province}` : "") +
                          (o.postalCode ? `, ${o.postalCode}` : "")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [loading, error, orders]);

  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
              Pelanggan
            </p>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-km-ink">
              Riwayat Pesanan
            </h1>
            <p className="mt-2 text-sm text-km-ink/70">
              Riwayat pesanan serta status pemrosesan dan pengiriman.
            </p>
          </div>

          <Link
            href="/produk"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold
                       bg-km-wood ring-1 ring-km-wood text-white hover:opacity-90 transition shadow-soft no-underline"
          >
            Belanja Lagi
          </Link>
        </div>

        <div className="mt-8">{content}</div>
      </div>
    </div>
  );
}
