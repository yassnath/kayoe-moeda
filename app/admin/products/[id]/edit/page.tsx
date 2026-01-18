"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import Alert from "@/components/admin/Alert";
import TextField from "@/components/admin/form/TextField";
import TextArea from "@/components/admin/form/TextArea";
import FileUpload from "@/components/admin/form/FileUpload";
import SelectField from "@/components/admin/form/SelectField";
import { resolveImageSrc } from "@/lib/utils";

type ProdukItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  capacity: number;
};

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [produk, setProduk] = useState<ProdukItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/produks/${id}`, {
          method: "GET",
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setError(data?.message || "Produk tidak ditemukan.");
          setProduk(null);
          return;
        }
        setProduk(data as ProdukItem);
        setPreview(resolveImageSrc((data as ProdukItem).image));
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data produk.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/admin/produks/${id}`, {
        method: "PATCH",
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || "Gagal memperbarui produk.");
        return;
      }
      setSuccess("Produk berhasil diperbarui.");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat memperbarui produk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-km-line bg-white p-6 shadow-soft">
        <p className="text-sm text-km-ink/60">Memuat detail produk...</p>
      </div>
    );
  }

  if (!produk) {
    return <Alert variant="error" title="Error" message={error || "Produk tidak ditemukan."} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Produk"
        description="Perbarui informasi produk."
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
            <TextField label="Nama Produk" name="name" defaultValue={produk.name} required />
            <TextField label="Harga" name="price" type="number" defaultValue={produk.price} required />
            <TextField label="Stok" name="capacity" type="number" defaultValue={produk.capacity} required />
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
              options={[
                { label: "Aktif", value: "active" },
                { label: "Nonaktif", value: "inactive" },
              ]}
            />
            <FileUpload
              label="Ganti Gambar"
              name="image"
              preview={preview}
              onChange={(file) => {
                if (!file) return;
                const objectUrl = URL.createObjectURL(file);
                setPreview(objectUrl);
              }}
            />
          </div>
          <div className="lg:col-span-2">
            <TextArea
              label="Deskripsi"
              name="description"
              defaultValue={produk.description}
              required
              rows={5}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-km-wood px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-km-wood hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
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
