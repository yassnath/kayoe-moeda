// app/admin/insight/page.tsx
"use client";

import { useEffect, useState } from "react";

type MonthlyInsight = {
  month: string; // "2025-01"
  totalAmount: number;
  totalOrders: number;
};

type InsightResponse = {
  months: MonthlyInsight[];
  grandTotal: number;
  totalOrders: number;
};

export default function AdminInsightPage() {
  const [data, setData] = useState<InsightResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/admin/insight/sales", {
          method: "GET",
          cache: "no-store",
        });

        let json: unknown = null;

        try {
          json = await res.json();
        } catch {
          console.error("Response /api/admin/insight/sales bukan JSON valid");
          setError("Response server tidak valid");
          return;
        }

        if (!res.ok) {
          const message =
            json &&
            typeof json === "object" &&
            json !== null &&
            "message" in json &&
            typeof (json as any).message === "string"
              ? (json as any).message
              : "Gagal mengambil data insight penjualan";

          setError(message);
          return;
        }

        setData(json as InsightResponse);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil data insight penjualan"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, []);

  const formatMonthKey = (key: string) => {
    // key: "2025-01"
    const [year, month] = key.split("-");
    const d = new Date(Number(year), Number(month) - 1, 1);
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
    });
  };

  const formatRupiah = (value: number) =>
    `Rp ${value.toLocaleString("id-ID")}`;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Admin - Insight Penjualan</h1>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 border border-red-300 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {loading && !error && (
        <p className="text-sm text-gray-600">Memuat data insight penjualan...</p>
      )}

      {!loading && !error && data && (
        <>
          {/* Kartu ringkasan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg bg-white p-4">
              <div className="text-xs uppercase text-gray-500 mb-1">
                Total Pendapatan (pesanan diterima)
              </div>
              <div className="text-xl font-semibold">
                {formatRupiah(data.grandTotal)}
              </div>
            </div>

            <div className="border rounded-lg bg-white p-4">
              <div className="text-xs uppercase text-gray-500 mb-1">
                Total Pesanan Selesai
              </div>
              <div className="text-xl font-semibold">{data.totalOrders}</div>
            </div>
          </div>

          {/* Grafik batang per bulan */}
          <div className="mb-6 border rounded-lg bg-white p-4">
            <h2 className="text-sm font-semibold mb-3">
              Grafik Penjualan per Bulan
            </h2>

            {data.months.length === 0 ? (
              <p className="text-sm text-gray-500">
                Belum ada pesanan dengan status &quot;received&quot;.
              </p>
            ) : (
              <div className="space-y-3">
                {(() => {
                  const maxAmount =
                    data.months.reduce(
                      (max, m) =>
                        m.totalAmount > max ? m.totalAmount : max,
                      0
                    ) || 1;

                  return data.months.map((m) => {
                    const widthPercent = Math.max(
                      5,
                      (m.totalAmount / maxAmount) * 100
                    ); // minimal 5% biar kelihatan

                    return (
                      <div key={m.month} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="font-medium">
                            {formatMonthKey(m.month)}
                          </div>
                          <div className="text-gray-600">
                            {formatRupiah(m.totalAmount)} • {m.totalOrders}{" "}
                            pesanan
                          </div>
                        </div>
                        <div className="h-3 w-full rounded bg-gray-100 overflow-hidden">
                          <div
                            className="h-3 rounded bg-blue-500"
                            style={{ width: `${widthPercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>

          {/* Tabel per bulan */}
          <h2 className="text-lg font-semibold mb-2">
            Ringkasan Penjualan per Bulan
          </h2>

          {data.months.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada pesanan dengan status &quot;received&quot;.
            </p>
          ) : (
            <div className="overflow-x-auto border rounded-lg bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 py-2 text-left">Bulan</th>
                    <th className="px-3 py-2 text-left">Total Pesanan</th>
                    <th className="px-3 py-2 text-left">Total Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  {data.months.map((m) => (
                    <tr
                      key={m.month}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        {formatMonthKey(m.month)}
                      </td>
                      <td className="px-3 py-2">{m.totalOrders}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {formatRupiah(m.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
