"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const ADMIN_WA_NUMBER = process.env.NEXT_PUBLIC_ADMIN_WA;

const isAllowedImage = (file: File) =>
  ALLOWED_IMAGE_TYPES.includes(file.type?.toLowerCase());

const normalizePhoneForWa = (phone: string) => {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
};

const buildWhatsappMessage = (payload: { orderCode?: string }) =>
  [
    "Halo Admin Kayoe Moeda, saya sudah upload bukti pembayaran.",
    payload.orderCode ? `Kode Pesanan: ${payload.orderCode}` : null,
    "Mohon konfirmasi pembayaran ya. Terima kasih.",
  ]
    .filter(Boolean)
    .join("\n");

type OrderItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  orderCode: string;
  paymentStatus: string;
  shippingStatus: string;
  grossAmount: number;
  createdAt: string;
  paymentProofUrl: string | null;
  paymentProofUploadedAt: string | null;
  recipientName: string | null;
  recipientPhone: string | null;
  addressLine: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  items: OrderItem[];
};

const BANK_INFO = {
  name: "BCA",
  accountNumber: "1234 5678 90",
  accountName: "Kayoe Moeda",
};

const PAYMENT_DEADLINE_MS = 24 * 60 * 60 * 1000;

function badgeClass(label: string) {
  const v = (label || "").toUpperCase();

  if (v.includes("SELESAI")) {
    return "bg-emerald-50 ring-1 ring-emerald-200 text-emerald-700";
  }
  if (v.includes("DIPROSES")) {
    return "bg-km-sand ring-1 ring-km-line text-km-ink";
  }
  if (v.includes("BATAL")) {
    return "bg-red-50 ring-1 ring-red-200 text-red-700";
  }
  return "bg-km-surface-alt text-km-ink ring-1 ring-km-line";
}

function paymentLabel(status: string) {
  const v = (status || "").toUpperCase();
  if (v === "PAID") return "Sudah bayar";
  if (v === "PENDING") return "Belum bayar";
  if (v === "FAILED") return "Gagal";
  if (v === "EXPIRED") return "Kadaluarsa";
  if (v === "CANCELLED") return "Dibatalkan";
  return status;
}

function formatTimeLeft(createdAt: string) {
  const created = new Date(createdAt).getTime();
  const deadline = created + PAYMENT_DEADLINE_MS;
  const diff = deadline - Date.now();
  if (Number.isNaN(created)) return null;
  if (diff <= 0) return { expired: true, text: "Batas waktu pembayaran habis." };
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  return {
    expired: false,
    text: `Sisa waktu pembayaran: ${hours} jam ${minutes} menit`,
  };
}

export default function HistoryOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState<{
    type: "success" | "error";
    message: string;
    orderId: string;
    waUrl?: string;
  } | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<
    Record<string, File | null>
  >({});
  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);

  const handleFileSelect = (orderId: string, file?: File | null) => {
    setUploadNotice(null);
    setSelectedFiles((prev) => ({
      ...prev,
      [orderId]: file ?? null,
    }));
  };

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders/history", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Gagal mengambil history order.");
        setOrders([]);
        return;
      }

      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (e) {
      console.error(e);
      setError("Gagal mengambil history order.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleUploadProof = async (orderId: string) => {
    const file = selectedFiles[orderId] ?? null;
    setUploadNotice(null);
    const currentOrder = orders.find((o) => o.id === orderId);

    if (!file) {
      setUploadNotice({
        type: "error",
        message: "Pilih file bukti pembayaran terlebih dahulu.",
        orderId,
      });
      return;
    }

    if (!isAllowedImage(file)) {
      setUploadNotice({
        type: "error",
        message: "Format file tidak didukung (JPG/PNG/WEBP).",
        orderId,
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadNotice({
        type: "error",
        message: "Ukuran file maksimal 5MB.",
        orderId,
      });
      return;
    }

    setUploadingId(orderId);

    try {
      const formData = new FormData();
      formData.append("paymentProof", file);

      const res = await fetch(`/api/orders/${orderId}/payment-proof`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUploadNotice({
          type: "error",
          message: data?.message || "Gagal mengunggah bukti pembayaran.",
          orderId,
        });
        return;
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                paymentProofUrl:
                  typeof data?.paymentProofUrl === "string"
                    ? data.paymentProofUrl
                    : o.paymentProofUrl,
                paymentProofUploadedAt:
                  typeof data?.paymentProofUploadedAt === "string"
                    ? data.paymentProofUploadedAt
                    : o.paymentProofUploadedAt,
              }
            : o
        )
      );

      const waNumber = ADMIN_WA_NUMBER
        ? normalizePhoneForWa(ADMIN_WA_NUMBER)
        : "";
      const waMessage = buildWhatsappMessage({
        orderCode: currentOrder?.orderCode,
      });
      const waUrl = waNumber
        ? `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`
        : "";

      setSelectedFiles((prev) => ({ ...prev, [orderId]: null }));
      setUploadNotice({
        type: "success",
        message: "Bukti pembayaran berhasil diunggah.",
        orderId,
        waUrl: waUrl || undefined,
      });
    } catch (e) {
      console.error(e);
      setUploadNotice({
        type: "error",
        message: "Terjadi kesalahan saat upload bukti pembayaran.",
        orderId,
      });
    } finally {
      setUploadingId(null);
    }
  };

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="rounded-3xl border border-km-line bg-white p-6 shadow-soft">
          <p className="text-sm text-km-ink/60">Memuat riwayat pesanan...</p>
        </div>
      );
    }

    if (error) {
      return (
        <>
          <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-soft">
            <p className="text-sm font-semibold">Terjadi kesalahan</p>
            <p className="text-sm mt-1 text-red-700/90">{error}</p>
          </div>

          <div className="mt-6 rounded-3xl border border-km-line bg-white p-8 shadow-soft">
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/45">
              Empty state
            </p>
            <h3 className="mt-3 text-lg md:text-xl font-semibold tracking-tight text-km-ink">
              Belum ada order / gagal load
            </h3>
            <p className="mt-2 text-sm text-km-ink/70">
              Belum ada pesanan atau gagal memuat data.
            </p>
            <Link
              href="/produk"
              className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                         bg-km-wood ring-1 ring-km-wood text-white hover:opacity-90 transition shadow-soft no-underline"
            >
              Belanja Produk
            </Link>
          </div>
        </>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="rounded-3xl border border-km-line bg-white p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.32em] text-km-ink/45">
            Empty state
          </p>
          <h3 className="mt-3 text-lg md:text-xl font-semibold tracking-tight text-km-ink">
            Belum ada pesanan
          </h3>
          <p className="mt-2 text-sm text-km-ink/70">
            Setelah checkout, riwayat pesanan akan muncul di sini.
          </p>
          <Link
            href="/produk"
            className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                       bg-km-wood ring-1 ring-km-wood text-white hover:opacity-90 transition shadow-soft no-underline"
          >
            Belanja Produk
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {orders.map((o) => {
          const orderLabel =
            o.paymentStatus === "CANCELLED"
              ? "Dibatalkan"
              : o.shippingStatus === "DELIVERED"
              ? "Selesai"
              : o.shippingStatus === "PACKED" || o.shippingStatus === "SHIPPED"
              ? "Diproses"
              : "Pending";

          return (
            <div
              key={o.id}
              className="rounded-3xl border border-km-line bg-white p-5 md:p-6 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-km-ink">
                    Order <span className="text-km-brass">{o.orderCode}</span>
                  </div>
                  <div className="mt-1 text-xs text-km-ink/50">
                    {new Date(o.createdAt).toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(
                      orderLabel
                    )}`}
                    title="Status pesanan"
                  >
                    Pesanan: {orderLabel}
                  </span>
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white ring-1 ring-km-line text-km-ink">
                    Pembayaran: {paymentLabel(o.paymentStatus)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-km-surface-alt p-4 ring-1 ring-km-line">
                <span className="text-sm text-km-ink/75">Total Pembelian</span>
                <span className="text-base font-semibold text-km-ink">
                  Rp {Number(o.grossAmount || 0).toLocaleString("id-ID")}
                </span>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-white ring-1 ring-km-line p-4">
                  <div className="text-sm font-semibold text-km-ink">Produk</div>

                  <div className="mt-3 space-y-3">
                    {o.items.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-km-ink line-clamp-1">
                            {it.name}
                          </div>
                          <div className="text-xs text-km-ink/55 mt-0.5">
                            {it.quantity} x Rp{" "}
                            {Number(it.price || 0).toLocaleString("id-ID")}
                          </div>
                        </div>

                        <div className="text-sm font-semibold text-km-ink">
                          Rp {(it.quantity * it.price).toLocaleString("id-ID")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-white ring-1 ring-km-line p-4">
                    <div className="text-sm font-semibold text-km-ink">
                      Pengiriman
                    </div>
                    <div className="mt-3 text-sm text-km-ink/75 space-y-1">
                      <div>{o.recipientName || "-"}</div>
                      <div>{o.recipientPhone || "-"}</div>
                      <div className="leading-relaxed">
                        {(o.addressLine || "-") +
                          (o.city ? `, ${o.city}` : "") +
                          (o.province ? `, ${o.province}` : "") +
                          (o.postalCode ? `, ${o.postalCode}` : "")}
                      </div>
                    </div>
                  </div>

                  {o.paymentStatus === "PENDING" && (
                    <div className="rounded-2xl bg-km-surface-alt ring-1 ring-km-line p-4 text-sm text-km-ink/80">
                      <div className="font-semibold text-km-ink">
                        Informasi Pembayaran
                      </div>
                      <div className="mt-2 space-y-1">
                        <div>Bank: {BANK_INFO.name}</div>
                        <div>No. Rekening: {BANK_INFO.accountNumber}</div>
                        <div>Atas Nama: {BANK_INFO.accountName}</div>
                      </div>
                      <div className="mt-3 text-xs text-km-ink/60">
                        {formatTimeLeft(o.createdAt)?.text ||
                          "Batas waktu pembayaran 1x24 jam sejak order dibuat."}
                      </div>
                      <div className="mt-2 text-xs text-km-ink/60">
                        Setelah transfer, upload bukti pembayaran di bawah.
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl bg-white ring-1 ring-km-line p-4">
                    <div className="text-sm font-semibold text-km-ink">
                      Bukti Pembayaran
                    </div>

                    {o.paymentProofUrl ? (
                      <div className="mt-3 space-y-1 text-sm text-km-ink/75">
                        <a
                          href={o.paymentProofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-km-brass underline"
                        >
                          Lihat bukti pembayaran
                        </a>
                        <div className="text-xs text-km-ink/50">
                          Diunggah:{" "}
                          {o.paymentProofUploadedAt
                            ? new Date(o.paymentProofUploadedAt).toLocaleString(
                                "id-ID"
                              )
                            : "-"}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2">
                        <input
                          type="file"
                          accept={ALLOWED_IMAGE_TYPES.join(",")}
                          className="block w-full text-sm text-km-ink/80"
                          onChange={(e) =>
                            handleFileSelect(o.id, e.target.files?.[0])
                          }
                          onInput={(e) =>
                            handleFileSelect(
                              o.id,
                              (e.target as HTMLInputElement).files?.[0]
                            )
                          }
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedFiles[o.id]) {
                              setUploadNotice({
                                type: "error",
                                message:
                                  "Pilih file bukti pembayaran terlebih dahulu.",
                                orderId: o.id,
                              });
                              return;
                            }
                            setConfirmOrderId(o.id);
                          }}
                          disabled={uploadingId === o.id}
                          className="w-full rounded-full bg-km-brass ring-1 ring-km-brass px-4 py-2 text-xs font-semibold text-km-wood hover:opacity-90 transition disabled:opacity-60"
                        >
                          {uploadingId === o.id ? "Mengunggah..." : "Konfirmasi & Upload"}
                        </button>
                        <p className="text-xs text-km-ink/55">
                          Format JPG/PNG/WEBP, maksimal 5MB.
                        </p>
                      </div>
                    )}

                    {uploadNotice?.orderId === o.id && (
                      <div
                        className={`mt-3 rounded-2xl px-3 py-2 text-xs ${
                          uploadNotice.type === "success"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-red-50 text-red-700 ring-1 ring-red-200"
                        }`}
                      >
                        {uploadNotice.message}
                        {uploadNotice.type === "success" &&
                          uploadNotice.waUrl && (
                            <div className="mt-2">
                              <a
                                href={uploadNotice.waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline text-emerald-800"
                              >
                                Kirim notifikasi WhatsApp ke admin
                              </a>
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [loading, error, orders]);

  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
              Pelanggan
            </p>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-km-ink">
              Riwayat Pesanan
            </h1>
            <p className="mt-2 text-sm text-km-ink/70">
              Riwayat pesanan serta status pemrosesan dan pengiriman.
            </p>
          </div>

          <Link
            href="/produk"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold
                       bg-km-wood ring-1 ring-km-wood text-white hover:opacity-90 transition shadow-soft no-underline"
          >
            Belanja Lagi
          </Link>
        </div>

        <div className="mt-8">{content}</div>
      </div>
      {confirmOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
              Konfirmasi Upload
            </p>
            <h3 className="mt-2 text-lg font-semibold text-km-ink">
              Pastikan bukti pembayaran sudah benar
            </h3>
            <p className="mt-2 text-sm text-km-ink/70">
              File yang dipilih:{" "}
              <span className="font-semibold text-km-ink">
                {selectedFiles[confirmOrderId]?.name || "-"}
              </span>
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  const id = confirmOrderId;
                  setConfirmOrderId(null);
                  if (id) {
                    handleUploadProof(id);
                  }
                }}
                className="w-full rounded-full bg-km-wood ring-1 ring-km-wood px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                Upload Sekarang
              </button>
              <button
                type="button"
                onClick={() => setConfirmOrderId(null)}
                className="w-full rounded-full bg-white ring-1 ring-km-line px-4 py-3 text-sm font-semibold text-km-ink hover:bg-km-surface-alt transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
