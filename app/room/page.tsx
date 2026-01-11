import { getprodukById } from "@/lib/data";
import { resolveImageSrc } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function produkDetailPage(
  { params }: { params?: { id?: string } } = {}
) {
  const produk = await getprodukById(params?.id);

  if (!produk) {
    return (
      <div className="min-h-[60vh] bg-[var(--km-bg)] flex items-center justify-center px-4">
        <div className="rounded-3xl border border-km-line bg-white p-6 text-center shadow-soft">
          <p className="text-sm text-km-ink/70">Produk tidak ditemukan.</p>
          <Link
            href="/produk"
            className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold
                       bg-km-wood text-white ring-1 ring-km-wood hover:opacity-90 transition"
          >
            Kembali ke Produk
          </Link>
        </div>
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

            <button className="w-full rounded-full bg-km-wood text-white ring-1 ring-km-wood px-6 py-3 text-sm font-semibold hover:opacity-90 transition">
              Tambah ke Keranjang
            </button>

            <Link
              href="/"
              className="block w-full text-center rounded-full border border-km-line bg-white px-6 py-3 text-sm font-semibold
                         text-km-ink hover:bg-km-surface-alt transition no-underline"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
