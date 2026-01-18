"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import SubTabs from "@/components/admin/SubTabs";
import FilterBar from "@/components/admin/FilterBar";
import DataTable from "@/components/admin/DataTable";
import Alert from "@/components/admin/Alert";
import { formatDate } from "@/components/admin/utils";

type CustomOrder = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  orderName: string;
  orderType: string;
  status: string;
  createdAt: string;
};

const statusTabs = [
  { label: "Semua", value: "all" },
  { label: "Baru", value: "NEW" },
  { label: "Dalam Proses", value: "IN_PROGRESS" },
  { label: "Selesai", value: "DONE" },
];

const formatStatus = (status: string) => {
  switch (status) {
    case "NEW":
      return "Baru";
    case "IN_PROGRESS":
      return "Dalam Proses";
    case "DONE":
      return "Selesai";
    case "CANCELLED":
      return "Dibatalkan";
    default:
      return status;
  }
};

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "NEW":
      return "bg-amber-50 text-amber-800 ring-amber-200";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "DONE":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-km-surface-alt text-km-ink ring-km-line";
  }
};

const formatType = (type: string) => {
  switch (type) {
    case "MUG":
      return "Kursi";
    case "GELAS":
      return "Meja";
    case "PIRING":
      return "Lemari";
    case "MANGKOK":
      return "Rak";
    case "LAINNYA":
      return "Lainnya";
    default:
      return type;
  }
};

export default function AdminCustomOrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() || "/admin/custom-orders";
  const query = searchParams?.get("q")?.toLowerCase() ?? "";
  const statusFilter = searchParams?.get("status") ?? "all";
  const startDate = searchParams?.get("start") ?? "";
  const endDate = searchParams?.get("end") ?? "";

  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchValue, setSearchValue] = useState(query);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/custom-orders", {
          method: "GET",
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setError(data?.message || "Gagal mengambil data custom order.");
          setOrders([]);
          return;
        }
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat mengambil custom order.");
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
      result = result.filter((order) =>
        `${order.customerName} ${order.orderName} ${order.email}`
          .toLowerCase()
          .includes(query)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
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
  }, [orders, query, statusFilter, startDate, endDate]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, startDate, endDate]);

  const columns = [
    {
      key: "createdAt",
      header: "Tanggal",
      render: (row: CustomOrder) => (
        <div className="text-xs text-km-ink/70">{formatDate(row.createdAt)}</div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (row: CustomOrder) => (
        <div>
          <div className="font-semibold text-km-ink">{row.customerName}</div>
          <div className="text-xs text-km-ink/50">{row.email}</div>
          <div className="text-xs text-km-ink/50">{row.phone}</div>
        </div>
      ),
    },
    {
      key: "orderName",
      header: "Pesanan",
      render: (row: CustomOrder) => (
        <div className="text-sm text-km-ink">{row.orderName}</div>
      ),
    },
    {
      key: "orderType",
      header: "Tipe",
      render: (row: CustomOrder) => (
        <div className="text-sm text-km-ink">{formatType(row.orderType)}</div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: CustomOrder) => (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusBadgeClass(
            row.status
          )}`}
        >
          {formatStatus(row.status)}
        </span>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      render: (row: CustomOrder) => (
        <Link
          href={`/admin/custom-orders/${row.id}`}
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
        title="Custom Order"
        description="Kelola permintaan custom order pelanggan."
      />

      <div className="rounded-3xl border border-km-line bg-white p-4 shadow-soft">
        <SubTabs paramKey="status" tabs={statusTabs} />
      </div>

      <FilterBar>
        <div className="grid flex-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs font-semibold text-km-ink/70">
            Search
            <input
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink focus:outline-none focus:ring-2 focus:ring-km-brass/60"
              placeholder="Cari customer / pesanan"
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
            Belum ada custom order.
          </div>
        }
      />
    </div>
  );
}
