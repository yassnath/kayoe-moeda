// components/main.tsx
import Image from "next/image";
import Link from "next/link";
import { getproduks } from "@/lib/data";
import { resolveImageSrc } from "@/lib/utils";

export default async function Main() {
  const produks = await getproduks();

  if (!produks || produks.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 mt-10">
        <div className="rounded-2xl km-tile p-8 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-km-ink/45">
            Empty state
          </p>
          <h3 className="mt-3 text-lg md:text-xl font-semibold tracking-tight text-km-ink">
            Belum ada produk
          </h3>
          <p className="mt-2 text-sm text-km-ink/70">
            Admin perlu menambahkan produk di database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6 mt-10 grid gap-6 md:grid-cols-3">
      {produks.map((produk) => {
        const imageSrc = resolveImageSrc(produk.image);

        return (
          <article
            key={produk.id}
            className="group rounded-2xl km-tile overflow-hidden hover:shadow-lg transition"
          >
            <div className="relative h-56 w-full">
              <Image
                src={imageSrc}
                alt={produk.name}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-80" />
            </div>

            <div className="p-5 flex flex-col gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-semibold tracking-tight text-km-ink line-clamp-1">
                  {produk.name}
                </h3>
                <p className="mt-1 text-sm text-km-ink/65 line-clamp-2">
                  {produk.description}
                </p>
              </div>

              <div className="flex items-end justify-between gap-3 pt-2">
                <p className="text-base font-semibold text-km-ink">
                  Rp {produk.price.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-km-ink/55">
                  Stok: {produk.capacity} pcs
                </p>
              </div>

              <Link
                href="/produk"
                className="mt-2 inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold
                           bg-km-wood text-km-cream ring-1 ring-km-wood hover:opacity-90 transition shadow-md no-underline"
              >
                Lihat Katalog
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
