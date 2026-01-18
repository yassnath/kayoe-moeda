"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import Alert from "@/components/admin/Alert";
import TextField from "@/components/admin/form/TextField";
import TextArea from "@/components/admin/form/TextArea";
import FileUpload from "@/components/admin/form/FileUpload";
import SelectField from "@/components/admin/form/SelectField";

export default function AdminProductCreatePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/admin/produks", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || "Gagal menyimpan produk.");
        return;
      }

      setSuccess("Produk berhasil disimpan.");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat menyimpan produk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Produk"
        description="Lengkapi data produk baru untuk katalog."
        actions={
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-km-line px-4 py-2 text-xs font-semibold text-km-ink"
          >
            Kembali
          </button>
        }
      />

      {error && <Alert variant="error" title="Error" message={error} />}
      {success && <Alert variant="success" title="Berhasil" message={success} />}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-km-line bg-white p-6 shadow-soft"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <TextField label="Nama Produk" name="name" required />
            <TextField
              label="Harga"
              name="price"
              type="number"
              required
            />
            <TextField label="Stok" name="capacity" type="number" required />
            <SelectField
              label="Kategori"
              name="category"
              options={[
                { label: "Pilih kategori", value: "" },
                { label: "Kursi", value: "kursi" },
                { label: "Meja", value: "meja" },
                { label: "Lemari", value: "lemari" },
                { label: "Rak", value: "rak" },
                { label: "Lainnya", value: "lainnya" },
              ]}
            />
          </div>
          <div className="space-y-4">
            <SelectField
              label="Status"
              name="status"
              defaultValue="ACTIVE"
              options={[
                { label: "Aktif", value: "ACTIVE" },
                { label: "Nonaktif", value: "INACTIVE" },
              ]}
            />
            <FileUpload
              label="Ganti Gambar"
              name="image"
              preview={preview}
              onChange={(file) => {
                if (!file) {
                  setPreview(null);
                  return;
                }
                const objectUrl = URL.createObjectURL(file);
                setPreview(objectUrl);
              }}
            />
          </div>
          <div className="lg:col-span-2">
            <TextArea label="Deskripsi" name="description" required rows={5} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-km-wood px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-km-wood hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-km-line px-5 py-2.5 text-sm font-semibold text-km-ink"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
