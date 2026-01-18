"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import Alert from "@/components/admin/Alert";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { formatCurrency, formatDate } from "@/components/admin/utils";

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
  paymentProofUrl: string | null;
  paymentProofUploadedAt: string | null;
  recipientName: string | null;
  recipientPhone: string | null;
  addressLine: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  user: UserInfo;
  items: OrderItemInfo[];
};

const mapOrderStatus = (order: OrderDetail) => {
  if (order.paymentStatus === "CANCELLED") return "BATAL";
  if (order.shippingStatus === "DELIVERED") return "SELESAI";
  if (order.shippingStatus === "PACKED" || order.shippingStatus === "SHIPPED") {
    return "PROSES";
  }
  return "BARU";
};

const mapPaymentStatus = (value: string) => {
  if (value === "PAID") return "PAID";
  return "UNPAID";
};

const orderStatusToApi = (value: string) => {
  switch (value) {
    case "PROSES":
      return "PROCESSING";
    case "SELESAI":
      return "DONE";
    case "BATAL":
      return "CANCELLED";
    default:
      return "PENDING";
  }
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [confirmingPaid, setConfirmingPaid] = useState(false);
  const [orderStatus, setOrderStatus] = useState("BARU");
  const [paymentStatus, setPaymentStatus] = useState("UNPAID");
  const [confirmFinish, setConfirmFinish] = useState(false);

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "GET",
        cache: "no-store",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || "Pesanan tidak ditemukan.");
        setOrder(null);
        return;
      }
      const detail = data as OrderDetail;
      setOrder(detail);
      setOrderStatus(mapOrderStatus(detail));
      setPaymentStatus(mapPaymentStatus(detail.paymentStatus));
    } catch (err) {
      console.error(err);
      setError("Gagal memuat detail pesanan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleUpdateStatus = async (force = false) => {
    if (!order) return;
    if (!force && orderStatus === "SELESAI" && paymentStatus === "UNPAID") {
      setConfirmFinish(true);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: orderStatusToApi(orderStatus) }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || "Gagal mengupdate status pesanan.");
        return;
      }
      const updated = data as OrderDetail;
      setOrder(updated);
      setOrderStatus(mapOrderStatus(updated));
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat update status pesanan.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePayment = async () => {
    if (!order) return;
    setPaymentSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/payment-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: paymentStatus === "PAID" ? "PAID" : "PENDING",
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || "Gagal update pembayaran.");
        return;
      }
      const updated = data as OrderDetail;
      setOrder(updated);
      setPaymentStatus(mapPaymentStatus(updated.paymentStatus));
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat update pembayaran.");
    } finally {
      setPaymentSaving(false);
    }
  };

  const handleSetPaid = async () => {
    if (!order) return;
    setConfirmingPaid(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/confirm-payment`, {
        method: "POST",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || "Gagal mengkonfirmasi pembayaran.");
        return;
      }
      const updated = data as OrderDetail;
      setOrder(updated);
      setPaymentStatus(mapPaymentStatus(updated.paymentStatus));
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat konfirmasi pembayaran.");
    } finally {
      setConfirmingPaid(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-km-line bg-white p-6 shadow-soft">
        <p className="text-sm text-km-ink/60">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-3">
        {error && <Alert variant="error" title="Error" message={error} />}
        <button
          type="button"
          onClick={() => router.push("/admin/orders")}
          className="rounded-full border border-km-line px-4 py-2 text-xs font-semibold text-km-ink"
        >
          Kembali ke Pesanan
        </button>
      </div>
    );
  }

  const waNumber = order.user?.phone
    ? order.user.phone.replace(/[^\d]/g, "")
    : "";
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Halo ${order.user?.name || ""}, kami dari Kayoe Moeda.`
      )}`
    : "";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail Pesanan"
        description={`Order ${order.orderCode}`}
        actions={
          <button
            type="button"
            onClick={() => router.push("/admin/orders")}
            className="rounded-full border border-km-line px-4 py-2 text-xs font-semibold text-km-ink"
          >
            Kembali
          </button>
        }
      />

      {error && <Alert variant="error" title="Error" message={error} />}

      <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-km-ink/50">
                  Order Info
                </div>
                <div className="mt-2 text-xl font-semibold text-km-ink">
                  {order.orderCode}
                </div>
                <div className="text-sm text-km-ink/60">
                  {formatDate(order.createdAt)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <StatusBadge type="order" value={orderStatus} />
                <StatusBadge type="payment" value={paymentStatus} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
            <div className="text-sm font-semibold text-km-ink">Customer</div>
            <div className="mt-2 space-y-1 text-sm text-km-ink/70">
              <div>{order.user?.name || "-"}</div>
              <div>{order.user?.email || "-"}</div>
              <div>{order.user?.phone || "-"}</div>
            </div>
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center rounded-full bg-km-brass px-4 py-2 text-xs font-semibold text-km-wood ring-1 ring-km-brass hover:opacity-90"
              >
                WhatsApp
              </a>
            )}
          </div>

          <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
            <div className="text-sm font-semibold text-km-ink">
              Alamat Pengiriman
            </div>
            <div className="mt-2 text-sm text-km-ink/70">
              {order.recipientName || "-"}
              <br />
              {order.recipientPhone || "-"}
              <br />
              {(order.addressLine || "-") +
                (order.city ? `, ${order.city}` : "") +
                (order.province ? `, ${order.province}` : "") +
                (order.postalCode ? `, ${order.postalCode}` : "")}
            </div>
          </div>

          <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
            <div className="text-sm font-semibold text-km-ink">Items</div>
            <div className="mt-3 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm text-km-ink"
                >
                  <div>
                    {item.name} ({item.quantity}x)
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-km-ink">
              <span>Total</span>
              <span className="text-base font-semibold">
                {formatCurrency(order.grossAmount)}
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
            <div className="text-sm font-semibold text-km-ink">
              Bukti Pembayaran
            </div>
            {order.paymentProofUrl ? (
              <div className="mt-3 space-y-2 text-sm">
                <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-km-line">
                  <Image
                    src={order.paymentProofUrl}
                    alt="Bukti pembayaran"
                    fill
                    className="object-cover"
                  />
                </div>
                <a
                  href={order.paymentProofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-km-wood underline"
                >
                  Lihat bukti pembayaran
                </a>
                <div className="text-xs text-km-ink/50">
                  Diunggah: {formatDate(order.paymentProofUploadedAt)}
                </div>
              </div>
            ) : (
              <div className="mt-3 text-sm text-km-ink/60">
                Belum ada bukti pembayaran.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
            <div className="text-sm font-semibold text-km-ink">
              Update Status Pesanan
            </div>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-km-line px-4 py-2 text-sm text-km-ink"
            >
              <option value="BARU">Baru</option>
              <option value="PROSES">Proses</option>
              <option value="SELESAI">Selesai</option>
              <option value="BATAL">Batal</option>
            </select>
            <button
              type="button"
              onClick={handleUpdateStatus}
              disabled={saving}
              className="mt-4 w-full rounded-full bg-km-wood px-4 py-2 text-sm font-semibold text-white ring-1 ring-km-wood hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan Status"}
            </button>
          </div>

          <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
            <div className="text-sm font-semibold text-km-ink">
              Payment Status
            </div>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-km-line px-4 py-2 text-sm text-km-ink"
            >
              <option value="UNPAID">Unpaid</option>
              <option value="PAID">Paid</option>
            </select>
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={handleUpdatePayment}
                disabled={paymentSaving}
                className="w-full rounded-full bg-km-brass px-4 py-2 text-sm font-semibold text-km-wood ring-1 ring-km-brass hover:opacity-90 disabled:opacity-60"
              >
                {paymentSaving ? "Menyimpan..." : "Simpan Pembayaran"}
              </button>
              <button
                type="button"
                onClick={handleSetPaid}
                disabled={confirmingPaid || paymentStatus === "PAID"}
                className="w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white ring-1 ring-emerald-600 hover:opacity-90 disabled:opacity-60"
              >
                {confirmingPaid ? "Mengonfirmasi..." : "Set Paid"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmFinish}
        title="Status selesai tapi belum bayar"
        description="Pesanan masih UNPAID. Lanjutkan set status SELESAI?"
        confirmLabel="Tetap Selesaikan"
        onConfirm={() => {
      setConfirmFinish(false);
      handleUpdateStatus(true);
    }}
        onCancel={() => setConfirmFinish(false)}
      />
    </div>
  );
}
