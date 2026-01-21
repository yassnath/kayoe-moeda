import Image from "next/image";
import Link from "next/link";
import { resolveImageSrc } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface ProdukDetailProps {
  params: { id: string };
}

export default async function DetailProdukPage({ params }: ProdukDetailProps) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id;

  if (!id) {
    return (
      <div className="min-h-screen bg-[var(--km-bg)]">
        <section className="w-full py-12 lg:py-16">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-soft">
              <p className="text-sm font-semibold">Produk tidak ditemukan</p>
              <p className="text-sm mt-1 text-red-700/90">
                ID produk tidak valid.
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

  const produk = await prisma.produk.findFirst({
    where: { id, status: "ACTIVE" },
  });

  if (!produk) {
    return (
      <div className="min-h-screen bg-[var(--km-bg)]">
        <section className="w-full py-12 lg:py-16">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-soft">
              <p className="text-sm font-semibold">Produk tidak ditemukan</p>
              <p className="text-sm mt-1 text-red-700/90">
                Produk tidak tersedia.
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
              Detail Produk
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
                href={`/cart/checkout`}
                className="w-full inline-flex items-center justify-center rounded-full bg-emerald-600 text-white ring-1 ring-emerald-600 px-6 py-3 text-sm font-semibold
                           shadow-soft hover:opacity-90 transition no-underline min-h-[44px]"
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
