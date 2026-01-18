"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import Alert from "@/components/admin/Alert";
import { formatCurrency } from "@/components/admin/utils";

type ProdukItem = {
  id: string;
  name: string;
  price: number;
  capacity: number;
  updatedAt: string;
};

type OrderItem = {
  id: string;
  orderCode: string;
  paymentStatus: string;
  shippingStatus: string;
  grossAmount: number;
  createdAt: string;
};

type CustomOrderItem = {
  id: string;
  orderName: string;
  customerName: string;
  status: string;
  createdAt: string;
};

const LOW_STOCK_THRESHOLD = 5;

export default function AdminOverviewPage() {
  const [produks, setProduks] = useState<ProdukItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        const [produksRes, ordersRes, customRes] = await Promise.all([
          fetch("/api/admin/produks", { cache: "no-store" }),
          fetch("/api/admin/orders", { cache: "no-store" }),
          fetch("/api/admin/custom-orders", { cache: "no-store" }),
        ]);

        const produksData = await produksRes.json().catch(() => []);
        const ordersData = await ordersRes.json().catch(() => []);
        const customData = await customRes.json().catch(() => []);

        if (!produksRes.ok || !ordersRes.ok || !customRes.ok) {
          setError("Gagal mengambil data overview.");
          setLoading(false);
          return;
        }

        setProduks(Array.isArray(produksData) ? produksData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setCustomOrders(Array.isArray(customData) ? customData : []);
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat mengambil data overview.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (order) => new Date(order.createdAt).toDateString() === today
  );
  const todayCustom = customOrders.filter(
    (order) => new Date(order.createdAt).toDateString() === today
  );
  const latestOrders = orders.slice(0, 5);
  const latestCustomOrders = customOrders.slice(0, 5);

  const monthlyRevenue = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return orders
      .filter((order) => {
        const created = new Date(order.createdAt);
        return created.getMonth() === month && created.getFullYear() === year;
      })
      .reduce((sum, order) => sum + (order.grossAmount || 0), 0);
  }, [orders]);

  const unpaidOrders = orders.filter((order) => order.paymentStatus !== "PAID");
  const lowStock = produks.filter((produk) => produk.capacity < LOW_STOCK_THRESHOLD);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Ringkasan cepat aktivitas Kayoe Moeda hari ini."
        actions={
          <Link
            href="/admin/products/new"
            className="rounded-full bg-km-wood px-4 py-2 text-xs font-semibold text-white ring-1 ring-km-wood no-underline hover:opacity-90"
          >
            Tambah Produk
          </Link>
        }
      />

      {error && <Alert variant="error" title="Error" message={error} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Pesanan Baru"
          value={loading ? "-" : `${todayOrders.length}`}
          helper="Hari ini"
        />
        <StatCard
          label="Custom Order"
          value={loading ? "-" : `${todayCustom.length}`}
          helper="Hari ini"
        />
        <StatCard
          label="Revenue"
          value={loading ? "-" : formatCurrency(monthlyRevenue)}
          helper="Bulan ini"
        />
        <StatCard
          label="Unpaid Orders"
          value={loading ? "-" : `${unpaidOrders.length}`}
          helper="Bulan ini"
        />
        <StatCard
          label="Low Stock"
          value={loading ? "-" : `${lowStock.length}`}
          helper={`Stok < ${LOW_STOCK_THRESHOLD}`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-km-ink">
              Pesanan Terbaru
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-km-wood underline"
            >
              Lihat semua
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-sm text-km-ink/60">Memuat...</p>
            ) : latestOrders.length === 0 ? (
              <p className="text-sm text-km-ink/60">Belum ada pesanan.</p>
            ) : (
              latestOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between text-sm text-km-ink"
                >
                  <div>
                    <div className="font-semibold">{order.orderCode}</div>
                    <div className="text-xs text-km-ink/50">
                      {new Date(order.createdAt).toLocaleString("id-ID")}
                    </div>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(order.grossAmount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-km-ink">
              Custom Order Terbaru
            </h3>
            <Link
              href="/admin/custom-orders"
              className="text-xs font-semibold text-km-wood underline"
            >
              Lihat semua
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-sm text-km-ink/60">Memuat...</p>
            ) : latestCustomOrders.length === 0 ? (
              <p className="text-sm text-km-ink/60">Belum ada custom order.</p>
            ) : (
              latestCustomOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between text-sm text-km-ink"
                >
                  <div>
                    <div className="font-semibold">{order.orderName}</div>
                    <div className="text-xs text-km-ink/50">
                      {order.customerName}
                    </div>
                  </div>
                  <span className="text-xs text-km-ink/50">
                    {new Date(order.createdAt).toLocaleString("id-ID")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-km-ink">
              Low Stock Products
            </h3>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-km-wood underline"
            >
              Kelola produk
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {loading ? (
              <p className="text-sm text-km-ink/60">Memuat...</p>
            ) : lowStock.length === 0 ? (
              <p className="text-sm text-km-ink/60">
                Tidak ada produk yang stoknya menipis.
              </p>
            ) : (
              lowStock.slice(0, 5).map((produk) => (
                <div
                  key={produk.id}
                  className="rounded-2xl border border-km-line bg-km-surface-alt p-3 text-sm text-km-ink"
                >
                  <div className="font-semibold">{produk.name}</div>
                  <div className="text-xs text-km-ink/50">
                    Stok: {produk.capacity}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
