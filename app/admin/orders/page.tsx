"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import SubTabs from "@/components/admin/SubTabs";
import FilterBar from "@/components/admin/FilterBar";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import Alert from "@/components/admin/Alert";
import { formatCurrency, formatDate } from "@/components/admin/utils";

type UserInfo = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
};

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type OrderRow = {
  id: string;
  orderCode: string;
  grossAmount: number;
  paymentStatus: string;
  shippingStatus: string;
  createdAt: string;
  user: UserInfo;
  items: OrderItem[];
};

const statusTabs = [
  { label: "Semua", value: "all" },
  { label: "Baru", value: "BARU" },
  { label: "Proses", value: "PROSES" },
  { label: "Selesai", value: "SELESAI" },
  { label: "Batal", value: "BATAL" },
];

const paymentOptions = [
  { label: "Semua", value: "all" },
  { label: "Unpaid", value: "UNPAID" },
  { label: "Paid", value: "PAID" },
];

const mapOrderStatus = (order: OrderRow) => {
  if (order.paymentStatus === "CANCELLED") return "BATAL";
  if (order.shippingStatus === "DELIVERED") return "SELESAI";
  if (order.shippingStatus === "PACKED" || order.shippingStatus === "SHIPPED") {
    return "PROSES";
  }
  return "BARU";
};

const mapPaymentStatus = (value: string) => {
  if (value === "PAID") return "PAID";
  if (value === "CANCELLED") return "UNPAID";
  return "UNPAID";
};

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() || "/admin/orders";
  const query = searchParams?.get("q")?.toLowerCase() ?? "";
  const statusFilter = searchParams?.get("status") ?? "all";
  const paymentFilter = searchParams?.get("payment") ?? "all";
  const startDate = searchParams?.get("start") ?? "";
  const endDate = searchParams?.get("end") ?? "";

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [exportFormat, setExportFormat] = useState("csv");
  const [searchValue, setSearchValue] = useState(query);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/admin/orders", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setError(data?.message || "Gagal mengambil data pesanan.");
          setOrders([]);
          return;
        }
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat mengambil data pesanan.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (query) {
      result = result.filter((order) => {
        const haystack = [
          order.orderCode,
          order.user?.name,
          order.user?.email,
          order.items.map((item) => item.name).join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((order) => mapOrderStatus(order) === statusFilter);
    }

    if (paymentFilter !== "all") {
      result = result.filter(
        (order) => mapPaymentStatus(order.paymentStatus) === paymentFilter
      );
    }

    if (startDate) {
      result = result.filter(
        (order) => new Date(order.createdAt) >= new Date(startDate)
      );
    }
    if (endDate) {
      result = result.filter(
        (order) => new Date(order.createdAt) <= new Date(endDate)
      );
    }

    return result;
  }, [orders, query, statusFilter, paymentFilter, startDate, endDate]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, paymentFilter, startDate, endDate]);

  const handleExport = async () => {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    params.set("format", exportFormat);
    if (query) params.set("q", query);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (paymentFilter !== "all") params.set("payment", paymentFilter);

    const url = `/api/reports/orders?${params.toString()}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const columns = [
    {
      key: "createdAt",
      header: "Tanggal",
      render: (row: OrderRow) => (
        <div className="text-xs text-km-ink/70">{formatDate(row.createdAt)}</div>
      ),
    },
    {
      key: "orderCode",
      header: "Order",
      render: (row: OrderRow) => (
        <div>
          <div className="font-semibold text-km-ink">{row.orderCode}</div>
          <div className="text-xs text-km-ink/50">{row.id}</div>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (row: OrderRow) => (
        <div>
          <div className="font-semibold text-km-ink">
            {row.user?.name ?? "Tanpa nama"}
          </div>
          <div className="text-xs text-km-ink/50">{row.user?.email}</div>
        </div>
      ),
    },
    {
      key: "grossAmount",
      header: "Total",
      render: (row: OrderRow) => (
        <div className="font-semibold text-km-ink">
          {formatCurrency(row.grossAmount)}
        </div>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment",
      render: (row: OrderRow) => (
        <StatusBadge type="payment" value={mapPaymentStatus(row.paymentStatus)} />
      ),
    },
    {
      key: "orderStatus",
      header: "Status",
      render: (row: OrderRow) => (
        <StatusBadge type="order" value={mapOrderStatus(row)} />
      ),
    },
    {
      key: "action",
      header: "Aksi",
      render: (row: OrderRow) => (
        <Link
          href={`/admin/orders/${row.id}`}
          className="text-xs font-semibold text-km-wood underline"
        >
          Detail
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pesanan"
        description="Kelola status pesanan dan pembayaran pelanggan."
        actions={
          <Link
            href="/admin/reports"
            className="rounded-full bg-km-wood px-4 py-2 text-xs font-semibold text-white ring-1 ring-km-wood no-underline hover:opacity-90"
          >
            Reports
          </Link>
        }
      />

      <div className="rounded-3xl border border-km-line bg-white p-4 shadow-soft">
        <SubTabs paramKey="status" tabs={statusTabs} />
      </div>

      <FilterBar>
        <div className="grid flex-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-semibold text-km-ink/70">
            Search
            <input
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink focus:outline-none focus:ring-2 focus:ring-km-brass/60"
              placeholder="Order / customer / produk"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                const params = new URLSearchParams(searchParams?.toString());
                if (e.target.value) params.set("q", e.target.value);
                else params.delete("q");
                router.replace(`${pathname}?${params.toString()}`);
              }}
            />
          </label>

          <label className="text-xs font-semibold text-km-ink/70">
            Payment
            <select
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
              value={paymentFilter}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams?.toString());
                if (e.target.value === "all") params.delete("payment");
                else params.set("payment", e.target.value);
                router.replace(`${pathname}?${params.toString()}`);
              }}
            >
              {paymentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold text-km-ink/70">
            Start date
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams?.toString());
                if (e.target.value) params.set("start", e.target.value);
                else params.delete("start");
                router.replace(`${pathname}?${params.toString()}`);
              }}
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
            />
          </label>

          <label className="text-xs font-semibold text-km-ink/70">
            End date
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams?.toString());
                if (e.target.value) params.set("end", e.target.value);
                else params.delete("end");
                router.replace(`${pathname}?${params.toString()}`);
              }}
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="rounded-full border border-km-line bg-white px-4 py-2 text-xs font-semibold text-km-ink"
          >
            <option value="csv">CSV</option>
            <option value="xlsx">XLSX</option>
            <option value="pdf">PDF</option>
          </select>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-full bg-km-brass px-4 py-2 text-xs font-semibold text-km-wood ring-1 ring-km-brass hover:opacity-90"
          >
            Export
          </button>
        </div>
      </FilterBar>

      {error && <Alert variant="error" title="Error" message={error} />}

      <DataTable
        columns={columns}
        data={paginatedOrders}
        loading={loading}
        pagination={{
          page,
          pageSize,
          total: filteredOrders.length,
          onPageChange: setPage,
        }}
        emptyState={
          <div className="text-center text-sm text-km-ink/60">
            Tidak ada pesanan yang sesuai filter.
          </div>
        }
      />
    </div>
  );
}
