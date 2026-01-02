// app/custom-order/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";

type CustomOrderItem = {
  id: string;
  orderName: string;
  orderType: string;
  description: string;
  image: string | null;
  status: string;
  createdAt: string;
};

export default function CustomOrderCustomerPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [history, setHistory] = useState<CustomOrderItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      setError(null);
      const res = await fetch("/api/custom-orders", { cache: "no-store" });

      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        setError("Response server tidak valid.");
        setHistory([]);
        return;
      }

      if (!res.ok) {
        const msg =
          data && typeof data === "object" && data !== null && "message" in data
            ? String((data as any).message)
            : "Gagal mengambil riwayat.";
        setError(msg);
        setHistory([]);
        return;
      }

      if (!Array.isArray(data)) {
        setError("Format data riwayat tidak sesuai.");
        setHistory([]);
        return;
      }

      setHistory(data as CustomOrderItem[]);
    } catch (e) {
      console.error(e);
      setError("Terjadi kesalahan saat mengambil riwayat.");
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/custom-orders", {
        method: "POST",
        body: formData,
      });

      let data: unknown = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        const msg =
          data && typeof data === "object" && data !== null && "message" in data
            ? String((data as any).message)
            : "Gagal mengirim custom order";
        setError(msg);
        return;
      }

      form.reset();
      setSuccess(
        "Custom order berhasil dikirim. Admin akan menghubungi Anda via WhatsApp."
      );
      await loadHistory();
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat mengirim custom order");
    } finally {
      setSubmitting(false);
    }
  };

  const badgeClass = (status: string) => {
    const s = status.toUpperCase();
    // soft badge (premium)
    if (s === "NEW") return "bg-km-cream ring-1 ring-km-line";
    if (s === "CONTACTED") return "bg-km-clay ring-1 ring-km-line";
    if (s === "IN_PROGRESS") return "bg-km-sand ring-1 ring-km-line";
    if (s === "DONE") return "bg-km-clay ring-1 ring-km-line";
    if (s === "CANCELLED") return "bg-red-100 ring-1 ring-red-200";
    return "bg-black/[0.04] text-black/70 ring-1 ring-black/10";
  };

  return (
    <div className="min-h-screen bg-km-sand">
      {/* OPSI B container */}
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.32em] text-black/45">
            Custom Order
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#111827]">
            Request Mebel Custom
          </h1>
          <p className="text-sm text-[#111827]/70 max-w-2xl leading-relaxed">
            Isi form untuk mengajukan mebel custom (kursi / meja / lemari / rak).
            <br />
            <span className="text-xs text-[#111827]/50">
              * Kamu harus login untuk mengirim custom order dan melihat riwayat.
            </span>
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-red-500/20 text-red-700 shadow-md">
            <p className="text-sm font-semibold">Peringatan</p>
            <p className="text-sm mt-1 text-red-700/90">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-emerald-500/20 text-emerald-700 shadow-md">
            <p className="text-sm font-semibold">Berhasil</p>
            <p className="text-sm mt-1 text-emerald-700/90">{success}</p>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,0.85fr] items-start">
          {/* FORM */}
          <div className="rounded-2xl bg-km-cream ring-1 ring-km-line shadow-md p-5 md:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base md:text-lg font-semibold tracking-tight text-[#111827]">
                  Custom Order Form
                </h2>
                <p className="mt-1 text-sm text-[#111827]/60">
                  Jelaskan kebutuhan Anda. Tim Kayoe Moeda akan menghubungi via WhatsApp.
                </p>
              </div>

              <div className="hidden md:block text-xs text-black/45">
                Perkiraan respons: 1–2 hari kerja
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#111827] mb-1">
                    Full Name
                  </label>
                  <input
                    name="customerName"
                    className="w-full rounded-2xl px-4 py-3 text-sm text-[#111827]
                               ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-km-caramel/70"
                    required
                    placeholder="Nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full rounded-2xl px-4 py-3 text-sm text-[#111827]
                               ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-km-caramel/70"
                    required
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    name="phone"
                    className="w-full rounded-2xl px-4 py-3 text-sm text-[#111827]
                               ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-km-caramel/70"
                    placeholder="Contoh: 08123456789"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1">
                  Order Name
                </label>
                <input
                  name="orderName"
                  className="w-full rounded-2xl px-4 py-3 text-sm text-[#111827]
                             ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-km-caramel/70"
                  required
                  placeholder="Contoh: Set meja makan 4 kursi"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1">
                  Order Type
                </label>
                <select
                  name="orderType"
                  className="w-full rounded-2xl px-4 py-3 text-sm text-[#111827]
                             ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-km-caramel/70 bg-white"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Pilih tipe
                  </option>
                  <option value="MUG">Kursi</option>
                  <option value="GELAS">Meja</option>
                  <option value="PIRING">Lemari</option>
                  <option value="MANGKOK">Rak</option>
                  <option value="LAINNYA">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1">
                  Order Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  className="w-full rounded-2xl px-4 py-3 text-sm text-[#111827]
                             ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-km-caramel/70"
                  required
                  placeholder="Tulis ukuran, material, warna, jumlah, dan referensi desain..."
                />
                <p className="mt-2 text-xs text-[#111827]/50">
                  Semakin detail, semakin cepat proses estimasi.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1">
                  Upload Reference Image (optional)
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full rounded-2xl px-4 py-3 text-sm text-[#111827]
                             ring-1 ring-black/10 bg-white"
                />
              </div>

              <button
                disabled={submitting}
                className="w-full rounded-2xl bg-km-clay ring-1 ring-km-line px-4 py-3 text-sm font-semibold
                           hover:bg-km-cream transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Mengirim..." : "Kirim Permintaan Custom"}
              </button>

              <div className="rounded-2xl bg-km-clay p-4 ring-1 ring-km-line">
                <p className="text-sm font-semibold text-[#111827]">
                  Setelah mengirim
                </p>
                <p className="mt-1 text-sm text-[#111827]/70 leading-relaxed">
                  Admin akan meninjau permintaan Anda dan menghubungi via WhatsApp
                  untuk estimasi harga dan waktu pengerjaan.
                </p>
              </div>
            </form>
          </div>

          {/* RIWAYAT */}
          <div className="rounded-2xl bg-km-cream ring-1 ring-km-line shadow-md p-5 md:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base md:text-lg font-semibold tracking-tight text-[#111827]">
                  Custom Order History
                </h2>
                <p className="mt-1 text-sm text-[#111827]/60">
                  Status akan diperbarui oleh admin.
                </p>
              </div>

              <button
                onClick={loadHistory}
                className="shrink-0 inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold
                           bg-km-cream ring-1 ring-km-line hover:bg-km-clay transition"
                type="button"
              >
                Muat Ulang
              </button>
            </div>

            {loadingHistory ? (
              <div className="mt-5 rounded-2xl bg-black/[0.03] p-4 ring-1 ring-black/5">
                <p className="text-sm text-black/60">Memuat riwayat...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="mt-5 rounded-2xl bg-black/[0.03] p-6 ring-1 ring-black/5">
                <p className="text-xs uppercase tracking-[0.32em] text-black/40">
                  Empty state
                </p>
                <p className="mt-2 text-sm text-black/60">
                  Belum ada custom order (atau Anda belum login).
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="rounded-2xl ring-1 ring-black/5 bg-white p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#111827] line-clamp-1">
                          {h.orderName}
                        </div>
                        <div className="mt-1 text-xs text-black/50">
                          {h.orderType} •{" "}
                          {new Date(h.createdAt).toLocaleString("id-ID")}
                        </div>
                      </div>

                      <span
                        className={`shrink-0 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(
                          h.status
                        )}`}
                      >
                        {h.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-[#111827]/70 leading-relaxed line-clamp-3">
                      {h.description}
                    </p>

                    {h.image && (
                      <a
                        href={h.image}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex text-sm font-semibold text-km-ink hover:opacity-80 transition no-underline"
                      >
                        Lihat gambar →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
