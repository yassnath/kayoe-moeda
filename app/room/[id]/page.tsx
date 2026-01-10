// app/produk/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getprodukById } from "@/lib/data";
import { resolveImageSrc } from "@/lib/utils";

interface produkPageProps {
  params: { id: string };
}

export default async function produkDetailPage({ params }: produkPageProps) {
  const produk = await getprodukById(params.id);

  if (!produk) {
    return notFound();
  }

  return (
    <div className="bg-transparent">
      <div className="max-w-screen-xl mx-auto px-4 py-10 md:py-16 grid gap-10 md:grid-cols-[2fr,1.3fr]">
        {/* Gambar utama */}
        <div className="km-tile rounded-2xl overflow-hidden">
          <div className="relative w-full h-80 md:h-[420px]">
            <Image
              src={resolveImageSrc(produk.image)}
              alt={produk.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Detail / info */}
        <div className="km-tile rounded-2xl p-6 md:p-8 flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.3em] text-km-ink/60">
            produk Detail
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold text-km-ink">
            {produk.name}
          </h1>

          <p className="text-km-ink/70 leading-relaxed">
            {produk.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-6 text-sm text-km-ink/70">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-km-ink/50">
                Harga
              </p>
              <p className="text-lg font-semibold text-km-brass">
                Rp {produk.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-km-ink/50">
                Stok
              </p>
              <p className="text-lg font-semibold text-km-ink">
                {produk.capacity} pcs
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={`/checkout?produkId=${produk.id}`}
              className="w-full text-center px-6 py-3 rounded-2xl bg-km-brass text-km-wood ring-1 ring-km-line font-semibold hover:opacity-90 transition no-underline"
            >
              Pesan Sekarang
            </Link>

            <Link
              href="/"
              className="w-full text-center px-6 py-3 rounded-2xl border border-km-line text-km-ink hover:bg-km-cream transition text-sm no-underline"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
