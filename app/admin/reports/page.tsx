"use client";

import { useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import Alert from "@/components/admin/Alert";

const reportTypes = [
  { value: "orders", label: "Rekap Pesanan (detail)" },
  { value: "payments", label: "Rekap Pembayaran" },
  { value: "products", label: "Rekap Produk & Stok" },
  { value: "custom-orders", label: "Rekap Custom Order" },
  { value: "monthly", label: "Rekap Bulanan (summary)" },
];

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState("orders");
  const [format, setFormat] = useState("csv");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setError(null);
    setPreview(null);
    setIsGenerating(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      params.set("format", format);

      const res = await fetch(`/api/reports/${reportType}?${params.toString()}`);
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        setError(json?.message || "Gagal generate laporan.");
        return;
      }

      const meta = res.headers.get("x-report-meta");
      setPreview(meta || "Laporan siap diunduh.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const filename =
        res.headers
          .get("content-disposition")
          ?.split("filename=")[1]
          ?.replace(/\"/g, "") || `report.${format}`;
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat generate laporan.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Rekap data dan download laporan."
      />

      {error && <Alert variant="error" title="Error" message={error} />}

      <div className="rounded-3xl border border-km-line bg-white p-6 shadow-soft">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold text-km-ink">
            Pengaturan Laporan
          </div>
          <div className="text-xs text-km-ink/50">
            Pastikan rentang tanggal sudah sesuai.
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs font-semibold text-km-ink/70">
            Jenis laporan
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
            >
              {reportTypes.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold text-km-ink/70">
            Format
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
            >
              <option value="csv">CSV</option>
              <option value="xlsx">XLSX</option>
              <option value="pdf">PDF</option>
            </select>
          </label>

          <label className="text-xs font-semibold text-km-ink/70">
            Start date
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
            />
          </label>

          <label className="text-xs font-semibold text-km-ink/70">
            End date
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          className="mt-6 inline-flex min-w-[180px] items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft ring-1 ring-emerald-600 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isGenerating}
        >
          {isGenerating ? "Menyiapkan..." : "Download Laporan"}
        </button>
      </div>

      <div className="rounded-3xl border border-km-line bg-white p-6 shadow-soft">
        <div className="text-sm font-semibold text-km-ink">Preview Laporan</div>
        <div className="mt-3 grid gap-3 text-sm text-km-ink/70 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-km-ink/50">
              Tipe
            </div>
            <div className="font-semibold text-km-ink">
              {reportTypes.find((opt) => opt.value === reportType)?.label}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-km-ink/50">
              Format
            </div>
            <div className="font-semibold text-km-ink">
              {format.toUpperCase()}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-km-ink/50">
              Rentang Tanggal
            </div>
            <div className="font-semibold text-km-ink">
              {startDate || "Semua"} - {endDate || "Semua"}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-km-ink/50">
              Ringkasan
            </div>
            <div className="font-semibold text-km-ink">
              {preview || "Belum ada preview."}
            </div>
          </div>
        </div>

        <div className="mt-5 text-xs text-km-ink/50">
          Klik tombol download untuk membuat file terbaru.
        </div>
      </div>
    </div>
  );
}
