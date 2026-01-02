// app/admin/orders/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type UserInfo = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
};

type OrderItemInfo = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderDetail = {
  id: string;
  orderCode: string;
  grossAmount: number;
  paymentStatus: string;
  shippingStatus: string;
  createdAt: string;
  recipientName: string | null;
  recipientPhone: string | null;
  addressLine: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  user: UserInfo;
  items: OrderItemInfo[];
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [statusValue, setStatusValue] = useState<string>("PENDING");

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      let data: unknown = null;

      try {
        data = await res.json();
      } catch {
        console.error("Response GET /api/admin/orders/[id] bukan JSON");
        setError("Response server tidak valid");
        return;
      }

      if (!res.ok) {
        const message =
          data &&
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof (data as any).message === "string"
            ? (data as any).message
            : "Gagal mengambil detail pesanan";

        setError(message);
        return;
      }

      const detail = data as OrderDetail;
      setOrder(detail);
      setStatusValue(deriveStatusValue(detail));
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengambil detail pesanan"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatTanggal = (value: string) =>
    new Date(value).toLocaleString("id-ID");

  const translateStatus = (value: string) => {
    switch (value) {
      case "PROCESSING":
        return "Diproses";
      case "DONE":
        return "Selesai";
      case "CANCELLED":
        return "Dibatalkan";
      default:
        return "Pending";
    }
  };

  const deriveStatusValue = (detail: OrderDetail) => {
    if (detail.paymentStatus === "CANCELLED") return "CANCELLED";
    if (detail.shippingStatus === "DELIVERED") return "DONE";
    if (
      detail.shippingStatus === "PACKED" ||
      detail.shippingStatus === "SHIPPED"
    ) {
      return "PROCESSING";
    }
    return "PENDING";
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: statusValue }),
      });

      let data: unknown = null;

      try {
        data = await res.json();
      } catch {
        console.error("Response PATCH /api/admin/orders/[id] bukan JSON");
      }

      if (!res.ok) {
        const message =
          data &&
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof (data as any).message === "string"
            ? (data as any).message
            : "Gagal mengupdate status pesanan";

        setError(message);
        return;
      }

      if (data && typeof data === "object") {
        const updated = data as OrderDetail;
        setOrder(updated);
        setStatusValue(deriveStatusValue(updated));
      }

      setSuccess("Status pesanan berhasil diupdate.");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengupdate status pesanan"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">
          ID pesanan tidak ditemukan di URL.
        </p>
        <Link
          href="/admin/orders"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Kembali ke daftar pesanan
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-600">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 space-y-2">
        <p className="text-sm text-red-600">
          {error ?? "Pesanan tidak ditemukan"}
        </p>
        <Link
          href="/admin/orders"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Kembali ke daftar pesanan
        </Link>
      </div>
    );
  }

  const total = order.grossAmount || 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold mb-2">
        Detail Pesanan Kayoe Moeda
      </h1>

      <Link
        href="/admin/orders"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Kembali ke daftar pesanan
      </Link>

      {(error || success) && (
        <div className="mt-3 space-y-2">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded text-sm">
              {success}
            </div>
          )}
        </div>
      )}

      <div className="border rounded-lg bg-white p-4 space-y-3">
        <div className="text-sm text-gray-700">
          <div>
            <span className="font-medium">ID Pesanan:</span> {order.id}
          </div>
          <div>
            <span className="font-medium">Kode Pesanan:</span> {order.orderCode}
          </div>
          <div>
            <span className="font-medium">Tanggal dibuat:</span>{" "}
            {formatTanggal(order.createdAt)}
          </div>
          <div>
            <span className="font-medium">Customer:</span>{" "}
            {order.user?.name ?? "Tanpa nama"}
          </div>
          {order.user?.email && (
            <div>
              <span className="font-medium">Email:</span> {order.user.email}
            </div>
          )}
          {order.user?.phone && (
            <div>
              <span className="font-medium">Telepon:</span> {order.user.phone}
            </div>
          )}
        </div>

        <div className="border-t pt-3 text-sm text-gray-700 space-y-1">
          <div className="font-semibold">Detail Pesanan</div>
          {order.items.length === 0 ? (
            <div>-</div>
          ) : (
            order.items.map((item) => (
              <div key={item.id}>
                {item.name} ({item.quantity} x Rp{" "}
                {Number(item.price || 0).toLocaleString("id-ID")})
              </div>
            ))
          )}
          <div>
            <span className="font-medium">Total harga:</span> Rp{" "}
            {total.toLocaleString("id-ID")}
          </div>
          <div>
            <span className="font-medium">Status saat ini:</span>{" "}
            {translateStatus(statusValue)}
          </div>
        </div>

        <div className="border-t pt-3 text-sm text-gray-700 space-y-1">
          <div className="font-semibold">Alamat Pengiriman</div>
          <div>{order.recipientName || "-"}</div>
          <div>{order.recipientPhone || "-"}</div>
          <div>
            {(order.addressLine || "-") +
              (order.city ? `, ${order.city}` : "") +
              (order.province ? `, ${order.province}` : "") +
              (order.postalCode ? `, ${order.postalCode}` : "")}
          </div>
        </div>
      </div>

      {/* Form ubah status */}
      <div className="border rounded-lg bg-white p-4 space-y-3">
        <h2 className="text-sm font-semibold">Ubah Status Pesanan</h2>

        <form onSubmit={handleUpdateStatus} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Status pesanan
            </label>
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Diproses</option>
              <option value="DONE">Selesai</option>
              <option value="CANCELLED">Dibatalkan</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Status"}
          </button>
        </form>
      </div>
    </div>
  );
}
