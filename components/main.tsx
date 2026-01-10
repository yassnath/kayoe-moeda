// components/main.tsx
import Image from "next/image";
import Link from "next/link";
import { getproduks } from "@/lib/data";
import { resolveImageSrc } from "@/lib/utils";

export default async function Main() {
  const produks = await getproduks();

  if (!produks || produks.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 mt-10 text-center text-white/70">
        <p className="text-xs uppercase tracking-[0.32em] text-white/50">
          Empty state
        </p>
        <h3 className="mt-3 text-lg md:text-xl font-semibold tracking-tight text-white">
          Belum ada produk
        </h3>
        <p className="mt-2 text-sm text-white/60">
          Admin perlu menambahkan produk di database.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-none px-4 md:px-6">
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {produks.map((produk) => {
          const imageSrc = resolveImageSrc(produk.image);

          return (
            <Link
              key={produk.id}
              href={`/produk/${produk.id}`}
              className="group relative min-h-[240px] sm:min-h-[320px] lg:min-h-[360px] overflow-hidden"
            >
              <Image
                src={imageSrc}
                alt={produk.name}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/80" />
              <div className="absolute inset-0 border border-white/10" />

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
                  Kayoe Moeda
                </p>
                <h3 className="mt-2 text-lg font-semibold">{produk.name}</h3>
                <div className="mt-1 flex items-center justify-between text-sm text-white/80">
                  <span>Rp {produk.price.toLocaleString("id-ID")}</span>
                  <span>Stok {produk.capacity}</span>
                </div>
                <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/70">
                  View Detail >
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
