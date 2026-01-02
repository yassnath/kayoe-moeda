"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

type MonthItem = { ym: string; revenue: number; orders: number };
type TopProduct = { produkId: string; name: string; qty: number; revenue: number };

type InsightResponse = {
  summary: { totalRevenue: number; totalOrders: number };
  monthly: MonthItem[];
  topProducts: TopProduct[];
  message?: string;
};

function rupiah(n: number) {
  return `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
}

export default function OwnerInsightPage() {
  const [months, setMonths] = useState(12);
  const [top, setTop] = useState(10);

  const [data, setData] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/owner/insights?months=${months}&top=${top}`, {
          cache: "no-store",
        });
        const json = (await res.json().catch(() => null)) as InsightResponse | null;

        if (!res.ok) {
          setErr(json?.message || "Gagal mengambil insight.");
          setData(null);
          return;
        }

        setData(json);
      } catch (e) {
        console.error(e);
        setErr("Gagal mengambil insight.");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [months, top]);

  const chartMonthly = useMemo(() => data?.monthly ?? [], [data]);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Insight Bisnis</h1>
            <p className="text-sm text-gray-600 mt-1">
              Ringkasan pemasukan & performa penjualan Kayoe Moeda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-sm border border-km-line bg-km-brass text-km-wood px-4 py-2 rounded-2xl hover:opacity-90 transition no-underline"
            >
              Kembali
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 km-tile rounded-2xl p-4 flex flex-wrap gap-3 items-center">
          <div className="text-sm font-medium">Periode:</div>
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="border border-km-line rounded-2xl px-3 py-2 text-sm"
          >
            <option value={3}>3 bulan</option>
            <option value={6}>6 bulan</option>
            <option value={12}>12 bulan</option>
            <option value={24}>24 bulan</option>
          </select>

          <div className="ml-0 sm:ml-4 text-sm font-medium">Top Produk:</div>
          <select
            value={top}
            onChange={(e) => setTop(Number(e.target.value))}
            className="border border-km-line rounded-2xl px-3 py-2 text-sm"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
          </select>

          {loading && <span className="text-sm text-gray-500 ml-auto">Memuat…</span>}
        </div>

        {err && (
          <div className="mt-4 bg-red-50 text-red-700 border border-red-300 px-4 py-2 rounded-2xl text-sm">
            {err}
          </div>
        )}

        {/* Summary cards */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="km-tile rounded-2xl p-5">
            <div className="text-sm text-gray-600">Total Pemasukan</div>
            <div className="text-2xl font-semibold mt-2">
              {rupiah(data?.summary.totalRevenue || 0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Akumulasi dalam {months} bulan terakhir
            </div>
          </div>

          <div className="km-tile rounded-2xl p-5">
            <div className="text-sm text-gray-600">Total Order</div>
            <div className="text-2xl font-semibold mt-2">
              {Number(data?.summary.totalOrders || 0).toLocaleString("id-ID")}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Akumulasi dalam {months} bulan terakhir
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="km-tile rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Pemasukan per Bulan</h2>
            <div className="mt-4 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartMonthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ym" />
                  <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                  <Tooltip formatter={(v: any) => rupiah(Number(v))} />
                  <Line type="monotone" dataKey="revenue" strokeWidth={2} dot={false} stroke="#C2A15A" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="km-tile rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Order per Bulan</h2>
            <div className="mt-4 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartMonthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ym" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#0F3A2C" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top products */}
        <div className="mt-4 km-tile rounded-2xl p-5">
          <h2 className="text-lg font-semibold">Produk Terlaris</h2>
          <p className="text-sm text-gray-600 mt-1">
            Berdasarkan total quantity terjual (status PAID/PACKED/SHIPPED/DELIVERED).
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border border-km-line">
              <thead className="bg-km-moss text-white">
                <tr>
                  <th className="text-left p-3 border">#</th>
                  <th className="text-left p-3 border">Produk</th>
                  <th className="text-right p-3 border">Terjual</th>
                  <th className="text-right p-3 border">Omzet</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topProducts || []).length === 0 ? (
                  <tr>
                    <td className="p-3 border text-gray-500" colSpan={4}>
                      Belum ada data penjualan pada periode ini.
                    </td>
                  </tr>
                ) : (
                  data!.topProducts.map((p, idx) => (
                    <tr key={`${p.produkId}-${idx}`}>
                      <td className="p-3 border">{idx + 1}</td>
                      <td className="p-3 border font-medium">{p.name}</td>
                      <td className="p-3 border text-right">{p.qty.toLocaleString("id-ID")}</td>
                      <td className="p-3 border text-right">{rupiah(p.revenue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
