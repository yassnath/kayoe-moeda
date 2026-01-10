// app/admin/custom-orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/admin/custom-orders", {
          method: "GET",
          cache: "no-store",
        });

        let data: unknown = null;

        try {
          data = await res.json();
        } catch {
          console.error(
            "Response GET /api/admin/custom-orders bukan JSON valid"
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
              : "Gagal mengambil data custom order";

          setError(message);
          return;
        }

        if (!Array.isArray(data)) {
          setError("Format data custom order tidak sesuai");
          return;
        }

        setOrders(data as CustomOrder[]);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil custom order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Admin - Custom Order Kayoe Moeda
      </h1>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 border border-red-300 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {loading && !error && (
        <p className="text-sm text-gray-600">Memuat daftar custom order...</p>
      )}

      {!loading && !error && (
        <>
          <p className="text-sm text-gray-600 mb-3">
            Total custom order:{" "}
            <span className="font-semibold">{orders.length}</span>
          </p>

          {orders.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada custom order dari pelanggan Kayoe Moeda.
            </p>
          ) : (
            <div className="overflow-x-auto border rounded-lg bg-white">
              <table className="min-w-full text-xs sm:text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 py-2 text-left">Tanggal</th>
                    <th className="px-3 py-2 text-left">Customer</th>
                    <th className="px-3 py-2 text-left">Pesanan</th>
                    <th className="px-3 py-2 text-left">Tipe</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        {formatTanggal(order.createdAt)}
                      </td>
                      <td className="px-3 py-2">
                        <div className="font-medium">
                          {order.customerName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.phone}
                        </div>
                      </td>
                      <td className="px-3 py-2">{order.orderName}</td>
                      <td className="px-3 py-2">
                        {formatType(order.orderType)}
                      </td>
                      <td className="px-3 py-2">
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          {formatStatus(order.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <Link
                          href={`/admin/custom-orders/${order.id}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Lihat detail
                        </Link>
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
