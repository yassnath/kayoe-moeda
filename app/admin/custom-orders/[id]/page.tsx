"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import PageHeader from "@/components/admin/PageHeader";
import Alert from "@/components/admin/Alert";
import TextArea from "@/components/admin/form/TextArea";
import SelectField from "@/components/admin/form/SelectField";
import { formatDate } from "@/components/admin/utils";
import { resolveImageSrc } from "@/lib/utils";

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
  internalNotes?: string | null;
};

const statusOptions = [
  { label: "Baru", value: "NEW" },
  { label: "Dalam Proses", value: "IN_PROGRESS" },
  { label: "Selesai", value: "DONE" },
  { label: "Batal", value: "CANCELLED" },
];

const typeLabel = (value: string) => {
  switch (value) {
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
      return value;
  }
};

const normalizePhoneForWa = (phone: string) => {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
};

export default function AdminCustomOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<CustomOrderDetail | null>(null);
  const [statusValue, setStatusValue] = useState<string>("NEW");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/custom-orders/${id}`, {
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setError(data?.message || "Custom order tidak ditemukan.");
          setOrder(null);
          return;
        }
        const detail = data as CustomOrderDetail;
        setOrder(detail);
        setStatusValue(detail.status);
        setNotes(detail.internalNotes ?? "");
      } catch (err) {
        console.error(err);
        setError("Gagal memuat detail custom order.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/custom-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusValue, internalNotes: notes }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || "Gagal memperbarui custom order.");
        return;
      }
      setOrder(data as CustomOrderDetail);
      setSuccess("Custom order berhasil diperbarui.");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat update custom order.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-km-line bg-white p-6 shadow-soft">
        <p className="text-sm text-km-ink/60">Memuat detail custom order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-3">
        {error && <Alert variant="error" title="Error" message={error} />}
        <button
          type="button"
          onClick={() => router.push("/admin/custom-orders")}
          className="rounded-full border border-km-line px-4 py-2 text-xs font-semibold text-km-ink"
        >
          Kembali
        </button>
      </div>
    );
  }

  const waNumber = normalizePhoneForWa(order.phone);
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Halo ${order.customerName}, kami dari Kayoe Moeda ingin menindaklanjuti custom order Anda.`
      )}`
    : "";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail Custom Order"
        description={`Permintaan: ${order.orderName}`}
        actions={
          <button
            type="button"
            onClick={() => router.push("/admin/custom-orders")}
            className="rounded-full border border-km-line px-4 py-2 text-xs font-semibold text-km-ink"
          >
            Kembali
          </button>
        }
      />

      {error && <Alert variant="error" title="Error" message={error} />}
      {success && <Alert variant="success" title="Berhasil" message={success} />}

      <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
            <div className="text-sm font-semibold text-km-ink">
              Informasi Customer
            </div>
            <div className="mt-2 space-y-1 text-sm text-km-ink/70">
              <div>{order.customerName}</div>
              <div>{order.email}</div>
              <div>{order.phone}</div>
              <div className="text-xs text-km-ink/50">
                {formatDate(order.createdAt)}
              </div>
            </div>
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center rounded-full bg-km-brass px-4 py-2 text-xs font-semibold text-km-wood ring-1 ring-km-brass hover:opacity-90"
              >
                Hubungi via WhatsApp
              </a>
            )}
          </div>

          <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
            <div className="text-sm font-semibold text-km-ink">
              Detail Pesanan
            </div>
            <div className="mt-2 space-y-2 text-sm text-km-ink/70">
              <div>
                <span className="font-semibold text-km-ink">Nama:</span>{" "}
                {order.orderName}
              </div>
              <div>
                <span className="font-semibold text-km-ink">Tipe:</span>{" "}
                {typeLabel(order.orderType)}
              </div>
              <div>
                <span className="font-semibold text-km-ink">Deskripsi:</span>
              </div>
              <p className="text-sm text-km-ink/70 leading-relaxed">
                {order.description}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft">
            <div className="text-sm font-semibold text-km-ink">
              Gambar Referensi
            </div>
            {order.image ? (
              <div className="mt-3 relative h-56 w-full overflow-hidden rounded-2xl border border-km-line">
                <Image
                  src={resolveImageSrc(order.image)}
                  alt={order.orderName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <p className="mt-3 text-sm text-km-ink/60">Tidak ada gambar.</p>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="space-y-4 rounded-3xl border border-km-line bg-white p-5 shadow-soft"
        >
          <div className="text-sm font-semibold text-km-ink">Aksi</div>
          <SelectField
            label="Status"
            name="status"
            value={statusValue}
            onChange={(e) => setStatusValue(e.target.value)}
            options={statusOptions}
          />
          <TextArea
            label="Internal Notes"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-km-wood px-4 py-2 text-sm font-semibold text-white ring-1 ring-km-wood hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}

