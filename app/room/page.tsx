import { getprodukById } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export default async function produkDetailPage({ params }: { params: { id: string } }) {
  const produk = await getprodukById(params.id);

  if (!produk) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 mt-10 text-center text-km-ink/60">
        Produk tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 mt-10">
      <div className="grid md:grid-cols-2 gap-10 km-tile p-8 rounded-2xl">

        {/* Gambar Produk */}
        <div className="relative w-full h-80 md:h-full">
          <Image
            src={produk.image}
            alt={produk.name}
            fill
            className="object-cover rounded-md"
          />
        </div>

        {/* Detail Produk */}
        <div className="flex flex-col justify-center">

          <p className="text-xs uppercase tracking-[0.3em] text-km-ink/60 mb-2">
            Detail Produk
          </p>

          <h1 className="text-3xl font-bold text-km-ink mb-3">
            {produk.name}
          </h1>

          <p className="text-km-ink/70 mb-5">
            {produk.description}
          </p>

          {/* Harga & Stok */}
          <div className="grid grid-cols-2 gap-5 mb-5">
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

          {/* Tombol Aksi */}
          <button className="w-full py-3 bg-km-brass text-km-wood ring-1 ring-km-line font-semibold rounded-2xl hover:opacity-90 transition mb-3">
            Tambah ke Keranjang
          </button>

          <Link
            href="/"
            className="block w-full text-center border border-km-line py-2 rounded-2xl hover:bg-km-cream transition no-underline"
          >
            Kembali ke Beranda
          </Link>
        </div>

      </div>
    </div>
  );
}
