// app/admin/custom-orders/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type CustomOrderDetail = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  orderName: string;
  orderType: string;
  description: string;
  image: string | null;
  status: string;
  createdAt: string;
};

export default function AdminCustomOrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<CustomOrderDetail | null>(null);
  const [statusValue, setStatusValue] = useState<string>("NEW");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/admin/custom-orders/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        let data: unknown = null;

        try {
          data = await res.json();
        } catch {
          console.error(
            "Response GET /api/admin/custom-orders/[id] bukan JSON"
          );
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
              : "Gagal mengambil detail custom order";

          setError(message);
          return;
        }

        const detail = data as CustomOrderDetail;
        setOrder(detail);
        setStatusValue(detail.status);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil detail custom order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const formatTanggal = (value: string) =>
    new Date(value).toLocaleString("id-ID");

  const formatStatus = (status: string) => {
    switch (status) {
      case "NEW":
        return "Baru";
      case "CONTACTED":
        return "Sudah dihubungi";
      case "IN_PROGRESS":
        return "Dalam proses";
      case "DONE":
        return "Selesai";
      case "CANCELLED":
        return "Dibatalkan";
      default:
        return status;
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

  const normalizePhoneForWa = (phone: string) => {
    const digits = phone.replace(/[^\d]/g, "");
    if (digits.startsWith("0")) {
      return "62" + digits.slice(1);
    }
    return digits;
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/custom-orders/${id}`, {
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
        console.error(
          "Response PATCH /api/admin/custom-orders/[id] bukan JSON"
        );
      }

      if (!res.ok) {
        const message =
          data &&
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof (data as any).message === "string"
            ? (data as any).message
            : "Gagal mengupdate custom order";

        setError(message);
        return;
      }

      if (data && typeof data === "object") {
        const updated = data as CustomOrderDetail;
        setOrder(updated);
        setStatusValue(updated.status);
      }

      setSuccess("Status custom order berhasil diupdate.");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengupdate custom order"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">
          ID custom order tidak ditemukan di URL.
        </p>
        <Link
          href="/admin/custom-orders"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Kembali ke daftar custom order
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-600">Memuat detail custom order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 space-y-2">
        <p className="text-sm text-red-600">
          {error ?? "Custom order tidak ditemukan"}
        </p>
        <Link
          href="/admin/custom-orders"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Kembali ke daftar custom order
        </Link>
      </div>
    );
  }

  const waNumber = normalizePhoneForWa(order.phone);
  const waMessage = encodeURIComponent(
    `Halo ${order.customerName}, saya admin Kayoe Moeda ingin menindaklanjuti custom order Anda:\n\n` +
      `Nama pesanan: ${order.orderName}\n` +
      `Tipe: ${formatType(order.orderType)}\n\n` +
      `Silakan balas pesan ini untuk diskusi lebih lanjut.`
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold mb-2">
        Detail Custom Order Kayoe Moeda
      </h1>

      <Link
        href="/admin/custom-orders"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Kembali ke daftar custom order
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
        <div className="text-sm text-gray-700 space-y-1">
          <div>
            <span className="font-medium">ID:</span> {order.id}
          </div>
          <div>
            <span className="font-medium">Tanggal masuk:</span>{" "}
            {formatTanggal(order.createdAt)}
          </div>
        </div>

        <div className="border-t pt-3 text-sm text-gray-700 space-y-1">
          <div className="font-semibold mb-1">Customer</div>
          <div>
            <span className="font-medium">Nama:</span> {order.customerName}
          </div>
          <div>
            <span className="font-medium">Email:</span> {order.email}
          </div>
          <div>
            <span className="font-medium">Telepon/WA:</span> {order.phone}
          </div>
        </div>

        <div className="border-t pt-3 text-sm text-gray-700 space-y-1">
          <div className="font-semibold mb-1">Detail Pesanan</div>
          <div>
            <span className="font-medium">Nama pesanan:</span>{" "}
            {order.orderName}
          </div>
          <div>
            <span className="font-medium">Tipe:</span>{" "}
            {formatType(order.orderType)}
          </div>
          <div>
            <span className="font-medium">Status:</span>{" "}
            {formatStatus(order.status)}
          </div>
          <div>
            <span className="font-medium">Deskripsi:</span>
            <p className="mt-1 whitespace-pre-line">
              {order.description}
            </p>
          </div>
          {order.image && (
            <div className="mt-2">
              <span className="font-medium">Gambar referensi:</span>
              <div className="mt-1 relative w-40 h-40 border rounded overflow-hidden">
                <Image
                  src={order.image}
                  alt={order.orderName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-3 flex flex-wrap gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 rounded text-sm font-medium bg-green-500 text-white hover:bg-green-600"
          >
            Hubungi via WhatsApp
          </a>
        </div>
      </div>

      {/* Form ubah status */}
      <div className="border rounded-lg bg-white p-4 space-y-3">
        <h2 className="text-sm font-semibold">Ubah Status Custom Order</h2>

        <form onSubmit={handleUpdateStatus} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="NEW">Baru</option>
              <option value="CONTACTED">Sudah dihubungi</option>
              <option value="IN_PROGRESS">Dalam proses</option>
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
