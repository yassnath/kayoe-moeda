// app/custom-order/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { resolveImageSrc } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";

type CustomOrderItem = {
  id: string;
  orderName: string;
  orderType: string;
  description: string;
  image: string | null;
  status: string;
  createdAt: string;
};

type FieldErrors = {
  customerName?: string;
  email?: string;
  phone?: string;
  orderName?: string;
  orderType?: string;
  description?: string;
};

export default function CustomOrderCustomerPage() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [history, setHistory] = useState<CustomOrderItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const badgeClass = (status: string) => {
    const s = status.toUpperCase();
    if (s === "NEW") return "bg-km-surface-alt ring-1 ring-km-line";
    if (s === "CONTACTED") return "bg-km-sand ring-1 ring-km-line";
    if (s === "IN_PROGRESS") return "bg-km-cream ring-1 ring-km-line";
    if (s === "DONE") return "bg-emerald-50 ring-1 ring-emerald-200";
    if (s === "CANCELLED") return "bg-red-50 ring-1 ring-red-200";
    return "bg-white ring-1 ring-km-line";
  };

  const validateForm = (form: HTMLFormElement) => {
    const nextErrors: FieldErrors = {};
    const data = new FormData(form);
    const requiredFields = [
      "customerName",
      "email",
      "phone",
      "orderName",
      "orderType",
      "description",
    ];

    requiredFields.forEach((field) => {
      const value = String(data.get(field) || "").trim();
      if (!value) {
        nextErrors[field as keyof FieldErrors] = "Wajib diisi.";
      }
    });

    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const form = e.currentTarget;
    const nextErrors = validateForm(form);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setError("Mohon lengkapi data yang wajib diisi.");
      return;
    }

    setSubmitting(true);
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
      setFileName(null);
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

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(false);

    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    const dataTransfer = new DataTransfer();
    Array.from(files).forEach((file) => dataTransfer.items.add(file));

    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
      setFileName(files[0]?.name || null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      <section className="w-full py-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
              Custom Order
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-km-ink">
              Request Mebel Custom
            </h1>
            <p className="text-sm text-km-ink/70 max-w-2xl leading-relaxed">
              Isi form untuk mengajukan mebel custom (kursi / meja / lemari /
              rak). Anda harus login untuk mengirim custom order dan melihat
              riwayat.
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-soft">
              <p className="text-sm font-semibold">Peringatan</p>
              <p className="text-sm mt-1 text-red-700/90">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800 shadow-soft">
              <p className="text-sm font-semibold">Berhasil</p>
              <p className="text-sm mt-1">{success}</p>
              <div className="mt-4 text-sm text-emerald-800/80">
                <p className="font-semibold">Langkah berikutnya:</p>
                <ol className="mt-2 list-decimal pl-5 space-y-1">
                  <li>Admin meninjau detail custom order.</li>
                  <li>Admin menghubungi via WhatsApp untuk estimasi.</li>
                  <li>Konfirmasi harga dan waktu produksi.</li>
                </ol>
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,0.9fr] items-start">
            {/* FORM */}
            <div className="relative rounded-3xl border border-km-line bg-white p-6 md:p-8 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base md:text-lg font-semibold tracking-tight text-km-ink">
                    Custom Order Form
                  </h2>
                  <p className="mt-1 text-sm text-km-ink/60 max-w-sm">
                    Jelaskan kebutuhan Anda. Tim Kayoe Moeda akan menghubungi via WhatsApp.
                  </p>
                </div>

                <div className="hidden md:block text-xs text-km-ink/45">
                  Perkiraan respons: 1-2 hari kerja
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-km-ink mb-1">
                      Full Name
                    </label>
                    <input
                      name="customerName"
                      disabled={!isLoggedIn}
                      className="w-full rounded-2xl px-4 py-3 text-sm text-km-ink
                                 ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                      placeholder="Nama lengkap"
                    />
                    <p className="mt-1 text-xs text-km-ink/50">
                      Gunakan nama sesuai identitas.
                    </p>
                    {fieldErrors.customerName && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldErrors.customerName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-km-ink mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      disabled={!isLoggedIn}
                      className="w-full rounded-2xl px-4 py-3 text-sm text-km-ink
                                 ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                      placeholder="email@example.com"
                    />
                    <p className="mt-1 text-xs text-km-ink/50">
                      Untuk konfirmasi dan detail pesanan.
                    </p>
                    {fieldErrors.email && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-km-ink mb-1">
                      WhatsApp / Phone Number
                    </label>
                    <input
                      name="phone"
                      disabled={!isLoggedIn}
                      className="w-full rounded-2xl px-4 py-3 text-sm text-km-ink
                                 ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                      placeholder="Contoh: 08123456789"
                    />
                    <p className="mt-1 text-xs text-km-ink/50">
                      Nomor aktif untuk konsultasi.
                    </p>
                    {fieldErrors.phone && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-km-ink mb-1">
                    Order Name
                  </label>
                  <input
                    name="orderName"
                    disabled={!isLoggedIn}
                    className="w-full rounded-2xl px-4 py-3 text-sm text-km-ink
                             ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                    placeholder="Contoh: Set meja makan 4 kursi"
                  />
                  <p className="mt-1 text-xs text-km-ink/50">
                    Nama singkat agar pesanan mudah dikenali.
                  </p>
                  {fieldErrors.orderName && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.orderName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-km-ink mb-1">
                    Order Type
                  </label>
                  <select
                    name="orderType"
                    disabled={!isLoggedIn}
                    className="w-full rounded-2xl px-4 py-3 text-sm text-km-ink
                             ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60 bg-white"
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
                  <p className="mt-1 text-xs text-km-ink/50">
                    Pilih kategori utama mebel Anda.
                  </p>
                  {fieldErrors.orderType && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.orderType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-km-ink mb-1">
                    Order Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    disabled={!isLoggedIn}
                    className="w-full rounded-2xl px-4 py-3 text-sm text-km-ink
                             ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                    placeholder="Tulis ukuran, material, warna, jumlah, dan referensi desain..."
                  />
                  <p className="mt-1 text-xs text-km-ink/50">
                    Semakin detail, semakin cepat proses estimasi.
                  </p>
                  {fieldErrors.description && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-km-ink mb-1">
                    Upload Reference Image (optional)
                  </label>
                  <label
                    htmlFor="custom-image"
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-6 text-sm text-km-ink/60
                               transition ${
                                 dragActive
                                   ? "border-km-brass bg-km-surface-alt"
                                   : "border-km-line bg-white"
                               }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                  >
                    <span className="font-semibold text-km-ink">
                      Drag & drop file
                    </span>
                    <span>atau klik untuk memilih file</span>
                    {fileName && (
                      <span className="text-xs text-km-ink/70">
                        File: {fileName}
                      </span>
                    )}
                  </label>
                  <input
                    ref={fileInputRef}
                    id="custom-image"
                    type="file"
                    name="image"
                    accept=".png,.jpg,.jpeg,.webp"
                    className="hidden"
                    disabled={!isLoggedIn}
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
                  />
                  <p className="mt-1 text-xs text-km-ink/50">
                    Format: PNG, JPG, JPEG, WEBP. Maks 5MB.
                  </p>
                </div>

                <button
                  disabled={submitting || !isLoggedIn}
                  className="w-full rounded-2xl bg-km-brass ring-1 ring-km-brass px-4 py-3 text-sm font-semibold
                           text-km-wood hover:opacity-90 transition shadow-soft disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Mengirim..." : "Kirim Permintaan Custom"}
                </button>

                <div className="rounded-2xl bg-km-surface-alt p-4 ring-1 ring-km-line">
                  <p className="text-sm font-semibold text-km-ink">
                    Setelah mengirim
                  </p>
                  <p className="mt-1 text-sm text-km-ink/70 leading-relaxed">
                    Admin akan meninjau permintaan Anda dan menghubungi via WhatsApp
                    untuk estimasi harga dan waktu pengerjaan.
                  </p>
                </div>
              </form>

              {!isLoggedIn && (
                <div className="absolute inset-0 rounded-3xl bg-white/80 backdrop-blur-sm flex items-center justify-center p-6">
                  <div className="max-w-sm rounded-2xl bg-white ring-1 ring-km-line p-5 text-center shadow-soft">
                    <p className="text-sm font-semibold text-km-ink">
                      Login diperlukan
                    </p>
                    <p className="mt-2 text-sm text-km-ink/70">
                      Silakan login untuk mengisi dan mengirim custom order.
                    </p>
                    <Link
                      href="/signin?callbackUrl=/custom-order"
                      className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold
                                 bg-km-wood text-white ring-1 ring-km-wood hover:opacity-90 transition no-underline"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* RIWAYAT */}
            <div className="rounded-3xl border border-km-line bg-white p-6 md:p-8 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base md:text-lg font-semibold tracking-tight text-km-ink">
                    Custom Order History
                  </h2>
                  <p className="mt-1 text-sm text-km-ink/60">
                    Status akan diperbarui oleh admin.
                  </p>
                </div>

                <button
                  onClick={loadHistory}
                  className="shrink-0 inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold
                           bg-white ring-1 ring-km-line hover:bg-km-surface-alt transition"
                  type="button"
                >
                  Muat Ulang
                </button>
              </div>

              {loadingHistory ? (
                <div className="mt-5 rounded-2xl bg-km-surface-alt p-4 ring-1 ring-km-line">
                  <p className="text-sm text-km-ink/60">Memuat riwayat...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="mt-5 rounded-2xl bg-km-surface-alt p-6 ring-1 ring-km-line">
                  <p className="text-xs uppercase tracking-[0.32em] text-km-ink/40">
                    Empty state
                  </p>
                  <p className="mt-2 text-sm text-km-ink/60">
                    Belum ada custom order (atau Anda belum login).
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {history.map((h) => (
                    <div
                      key={h.id}
                      className="rounded-2xl ring-1 ring-km-line bg-white p-4 hover:shadow-soft transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-km-ink line-clamp-1">
                            {h.orderName}
                          </div>
                          <div className="mt-1 text-xs text-km-ink/50">
                            {h.orderType} - {new Date(h.createdAt).toLocaleString("id-ID")}
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

                      <p className="mt-3 text-sm text-km-ink/70 leading-relaxed line-clamp-3">
                        {h.description}
                      </p>

                      {h.image && (
                        <a
                          href={resolveImageSrc(h.image)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex text-sm font-semibold text-km-ink hover:opacity-80 transition no-underline"
                        >
                          Lihat gambar
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
