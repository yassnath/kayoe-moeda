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
      <div className="min-h-[60vh] flex items-center justify-center text-white/70">
        Produk tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="bg-transparent text-white">
      <section className="w-full py-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
          {/* Gambar Produk */}
          <div className="relative min-h-[320px] overflow-hidden border border-white/10">
            <Image
              src={resolveImageSrc(produk.image)}
              alt={produk.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
          </div>

          {/* Detail Produk */}
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.32em] text-white/55">
              Detail Produk
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold text-white">
              {produk.name}
            </h1>

            <p className="text-sm text-white/70 leading-relaxed">
              {produk.description}
            </p>

            {/* Harga & Stok */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">
                  Harga
                </p>
                <p className="mt-2 text-lg font-semibold text-km-brass">
                  Rp {produk.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">
                  Stok
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {produk.capacity} pcs
                </p>
              </div>
            </div>

            {/* Tombol Aksi */}
            <button className="w-full px-6 py-3 bg-km-brass text-km-wood ring-1 ring-white/20 font-semibold hover:opacity-90 transition">
              Tambah ke Keranjang
            </button>

            <Link
              href="/"
              className="block w-full text-center border border-white/20 px-6 py-3 hover:bg-white/10 transition no-underline"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
