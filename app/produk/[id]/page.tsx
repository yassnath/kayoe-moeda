"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { resolveImageSrc } from "@/lib/utils";

type ProdukDetail = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  capacity: number;
};

interface ProdukDetailProps {
  params: { id: string };
}

export default function ProdukDetailPage({ params }: ProdukDetailProps) {
  const [produk, setProduk] = useState<ProdukDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/produk/${params.id}`, {
          cache: "no-store",
        });

        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setError(
            data?.message || "Produk tidak ditemukan atau gagal dimuat."
          );
          setProduk(null);
          return;
        }

        setProduk(data as ProdukDetail);
      } catch (e) {
        console.error(e);
        setError("Gagal memuat detail produk.");
        setProduk(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--km-bg)]">
        <section className="w-full py-12 lg:py-16">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <div className="rounded-3xl border border-km-line bg-white p-6 shadow-soft">
              <p className="text-sm text-km-ink/60">Memuat detail produk...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!produk || error) {
    return (
      <div className="min-h-screen bg-[var(--km-bg)]">
        <section className="w-full py-12 lg:py-16">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-soft">
              <p className="text-sm font-semibold">Produk tidak ditemukan</p>
              <p className="text-sm mt-1 text-red-700/90">
                {error ?? "Produk tidak tersedia."}
              </p>
              <Link
                href="/produk"
                className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold
                           bg-km-wood text-white ring-1 ring-km-wood hover:opacity-90 transition no-underline"
              >
                Kembali ke Produk
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      <section className="w-full py-12 lg:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 grid gap-8 lg:grid-cols-[1.1fr,0.9fr] items-start">
          <div className="rounded-3xl border border-km-line bg-white p-4 shadow-soft">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-km-surface-alt">
              <Image
                src={resolveImageSrc(produk.image)}
                alt={produk.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-km-line bg-white p-6 md:p-7 shadow-soft space-y-5">
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
              Produk Detail
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-km-ink">
              {produk.name}
            </h1>

            <p className="text-sm text-km-ink/70 leading-relaxed max-w-prose">
              {produk.description}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-km-line bg-km-surface-alt p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-km-ink/55">
                  Harga
                </p>
                <p className="mt-2 text-lg font-semibold text-km-ink">
                  Rp {produk.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="rounded-2xl border border-km-line bg-km-surface-alt p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-km-ink/55">
                  Stok
                </p>
                <p className="mt-2 text-lg font-semibold text-km-ink">
                  {produk.capacity} pcs
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href={`/checkout?produkId=${produk.id}`}
                className="w-full text-center rounded-full bg-km-wood text-white ring-1 ring-km-wood px-6 py-3 text-sm font-semibold
                           hover:opacity-90 transition no-underline"
              >
                Pesan Sekarang
              </Link>

              <Link
                href="/produk"
                className="w-full text-center rounded-full border border-km-line bg-white px-6 py-3 text-sm font-semibold
                           text-km-ink hover:bg-km-surface-alt transition no-underline"
              >
                Kembali ke Produk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
