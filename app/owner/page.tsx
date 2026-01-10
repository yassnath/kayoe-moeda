"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type MonthlyRow = {
  month: string; // "2025-12"
  revenue: number;
  orders: number;
};

type TopProductRow = {
  name: string;
  sold: number;
  revenue: number;
};

type InsightsResponse = {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
  };
  monthly: MonthlyRow[];
  topProducts: TopProductRow[];
  message?: string;
};

function formatRupiah(n: number) {
  return "Rp " + (n || 0).toLocaleString("id-ID");
}

const EMPTY: InsightsResponse = {
  summary: { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
  monthly: [],
  topProducts: [],
};

export default function OwnerDashboardPage() {
  const [data, setData] = useState<InsightsResponse>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr(null);

      try {
        const res = await fetch("/api/owner/insights", { cache: "no-store" });
        const json = (await res.json().catch(() => null)) as
          | Partial<InsightsResponse>
          | null;

        if (!res.ok) {
          setErr((json as any)?.message || "Gagal mengambil insight.");
          setData(EMPTY);
          return;
        }

        // ✅ normalize biar tidak pernah undefined
        const normalized: InsightsResponse = {
          summary: {
            totalRevenue: Number(json?.summary?.totalRevenue ?? 0),
            totalOrders: Number(json?.summary?.totalOrders ?? 0),
            avgOrderValue: Number(json?.summary?.avgOrderValue ?? 0),
          },
          monthly: Array.isArray(json?.monthly)
            ? json!.monthly.map((m) => ({
                month: String((m as any).month ?? ""),
                revenue: Number((m as any).revenue ?? 0),
                orders: Number((m as any).orders ?? 0),
              }))
            : [],
          topProducts: Array.isArray(json?.topProducts)
            ? json!.topProducts.map((p) => ({
                name: String((p as any).name ?? ""),
                sold: Number((p as any).sold ?? 0),
                revenue: Number((p as any).revenue ?? 0),
              }))
            : [],
        };

        setData(normalized);
      } catch (e) {
        console.error(e);
        setErr("Gagal mengambil insight.");
        setData(EMPTY);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const chartMax = useMemo(() => {
    if (!data.monthly.length) return 0;
    return Math.max(...data.monthly.map((m) => m.revenue));
  }, [data.monthly]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pt-24 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-black/45">
            Owner
          </p>
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-[#111827]">
            Insight Dashboard
          </h1>
          <p className="mt-2 text-sm text-black/60">
            Ringkasan pemasukan & penjualan per bulan (order diproses/selesai).
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold
                     bg-km-clay ring-1 ring-km-line hover:bg-km-cream transition no-underline"
        >
          ← Kembali ke Home
        </Link>
      </div>

      {/* Error */}
      {err && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-km-cream/80 ring-1 ring-km-line shadow-sm p-5">
          <div className="text-xs uppercase tracking-[0.24em] text-black/45">
            Total Revenue
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#111827]">
            {loading ? "…" : formatRupiah(data.summary.totalRevenue)}
          </div>
          <div className="mt-1 text-xs text-black/45">
            Akumulasi order diproses/selesai.
          </div>
        </div>

        <div className="rounded-2xl bg-km-cream/80 ring-1 ring-km-line shadow-sm p-5">
          <div className="text-xs uppercase tracking-[0.24em] text-black/45">
            Total Orders
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#111827]">
            {loading ? "…" : data.summary.totalOrders}
          </div>
          <div className="mt-1 text-xs text-black/45">
            Jumlah order diproses/selesai.
          </div>
        </div>

        <div className="rounded-2xl bg-km-cream/80 ring-1 ring-km-line shadow-sm p-5">
          <div className="text-xs uppercase tracking-[0.24em] text-black/45">
            Avg Order Value
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#111827]">
            {loading ? "…" : formatRupiah(data.summary.avgOrderValue)}
          </div>
          <div className="mt-1 text-xs text-black/45">
            Rata-rata nilai transaksi.
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="rounded-2xl bg-km-cream/80 ring-1 ring-km-line shadow-sm p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#111827]">
                Revenue per Bulan
              </h2>
              <p className="text-xs text-black/45 mt-1">(diproses/selesai)</p>
            </div>
          </div>

          {loading ? (
            <div className="text-sm text-black/50">Memuat…</div>
          ) : data.monthly.length === 0 ? (
            <div className="rounded-2xl border border-black/5 bg-white/60 p-4 text-sm text-black/55">
              Belum ada data revenue bulanan.
            </div>
          ) : (
            <div className="space-y-3">
              {data.monthly.map((m) => {
                const pct = chartMax > 0 ? (m.revenue / chartMax) * 100 : 0;
                return (
                  <div key={m.month} className="flex items-center gap-3">
                    <div className="w-20 text-xs font-semibold text-black/60">
                      {m.month}
                    </div>

                    <div className="flex-1">
                      <div className="h-3 rounded-full bg-black/5 overflow-hidden">
                        <div
                          className="h-3 rounded-full bg-km-caramel"
                          style={{ width: `${pct}%` }}
                          title={`${formatRupiah(m.revenue)} • ${m.orders} orders`}
                        />
                      </div>
                      <div className="mt-1 text-[11px] text-black/45">
                        {m.orders} orders
                      </div>
                    </div>

                    <div className="w-28 text-xs text-right font-semibold text-black/70">
                      {formatRupiah(m.revenue)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="rounded-2xl bg-km-cream/80 ring-1 ring-km-line shadow-sm p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#111827]">
                Produk Terlaris
              </h2>
              <p className="text-xs text-black/45 mt-1">(diproses/selesai)</p>
            </div>
          </div>

          {loading ? (
            <div className="text-sm text-black/50">Memuat…</div>
          ) : data.topProducts.length === 0 ? (
            <div className="rounded-2xl border border-black/5 bg-white/60 p-4 text-sm text-black/55">
              Belum ada produk terlaris (transaksi PAID belum ada).
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left">
                  <tr className="border-b border-black/10">
                    <th className="py-2 pr-3 text-xs uppercase tracking-[0.22em] text-black/50">
                      Produk
                    </th>
                    <th className="py-2 pr-3 text-xs uppercase tracking-[0.22em] text-black/50">
                      Terjual
                    </th>
                    <th className="py-2 pr-3 text-xs uppercase tracking-[0.22em] text-black/50">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProducts.map((p, idx) => (
                    <tr
                      key={p.name}
                      className={[
                        "border-b border-black/5",
                        idx % 2 === 0 ? "bg-transparent" : "bg-black/[0.02]",
                      ].join(" ")}
                    >
                      <td className="py-3 pr-3 font-semibold text-black/75">
                        {p.name}
                      </td>
                      <td className="py-3 pr-3 text-black/65">{p.sold}</td>
                      <td className="py-3 pr-3 font-semibold text-black/75">
                        {formatRupiah(p.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="mt-3 text-xs text-black/45">
                Data dihitung dari order diproses/selesai.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
