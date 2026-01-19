"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import PageHeader from "@/components/admin/PageHeader";
import FilterBar from "@/components/admin/FilterBar";
import StatCard from "@/components/admin/StatCard";
import Alert from "@/components/admin/Alert";
import { formatCurrency } from "@/components/admin/utils";

type TrendItem = {
  label: string;
  totalAmount: number;
  totalOrders: number;
};

type TopProduct = {
  name: string;
  totalQty: number;
  totalAmount: number;
};

type InsightResponse = {
  trend: TrendItem[];
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  paidCount: number;
  unpaidCount: number;
  statusBreakdown: { status: string; count: number }[];
  topProducts: TopProduct[];
};

const statusColors: Record<string, string> = {
  BARU: "#fbbf24",
  PROSES: "#3b82f6",
  SELESAI: "#10b981",
  BATAL: "#ef4444",
};

export default function InsightClient() {
  const [data, setData] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      const res = await fetch(
        `/api/admin/insight/sales?${params.toString()}`,
        { cache: "no-store" }
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.message || "Gagal mengambil data insight.");
        setData(null);
        return;
      }
      setData(json as InsightResponse);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat memuat insight.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusPie = data?.statusBreakdown ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insight"
        description="Analisis performa penjualan dan pembayaran."
      />

      <FilterBar>
        <div className="grid flex-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs font-semibold text-km-ink/70">
            Start date
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
            />
          </label>
          <label className="text-xs font-semibold text-km-ink/70">
            End date
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
            />
          </label>
          <button
            type="button"
            onClick={fetchData}
            className="self-end rounded-full bg-km-wood px-4 py-2 text-xs font-semibold text-white ring-1 ring-km-wood hover:opacity-90"
          >
            Apply
          </button>
        </div>
      </FilterBar>

      {error && <Alert variant="error" title="Error" message={error} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Total Revenue"
          value={loading ? "-" : formatCurrency(data?.totalRevenue || 0)}
        />
        <StatCard
          label="Total Orders"
          value={loading ? "-" : `${data?.totalOrders ?? 0}`}
        />
        <StatCard
          label="AOV"
          value={loading ? "-" : formatCurrency(data?.averageOrderValue || 0)}
        />
        <StatCard
          label="Paid Orders"
          value={loading ? "-" : `${data?.paidCount ?? 0}`}
        />
        <StatCard
          label="Unpaid Orders"
          value={loading ? "-" : `${data?.unpaidCount ?? 0}`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
          <div className="text-sm font-semibold text-km-ink">
            Revenue Trend
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.trend ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalAmount"
                  stroke="#b08a5b"
                  strokeWidth={2}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
          <div className="text-sm font-semibold text-km-ink">
            Status Breakdown
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPie}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={90}
                >
                  {statusPie.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={statusColors[entry.status] || "#e5e7eb"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
          <div className="text-sm font-semibold text-km-ink">
            Top Products
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.topProducts ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalAmount" fill="#3b82f6" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
          <div className="text-sm font-semibold text-km-ink">
            Summary Orders
          </div>
          <div className="mt-4 space-y-3 text-sm text-km-ink/70">
            {data?.trend?.length ? (
              data.trend.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span>{formatCurrency(item.totalAmount)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-km-ink/60">Belum ada data.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
