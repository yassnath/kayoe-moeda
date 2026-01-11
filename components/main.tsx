// components/main.tsx
import Image from "next/image";
import Link from "next/link";
import { getproduks } from "@/lib/data";
import { resolveImageSrc } from "@/lib/utils";

export default async function Main() {
  const produks = await getproduks();

  if (!produks || produks.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={`placeholder-${idx}`}
              className="rounded-3xl border border-km-line bg-white p-4 shadow-soft"
            >
              <div className="h-36 rounded-2xl bg-km-surface-alt" />
              <div className="mt-4 h-4 w-3/4 rounded-full bg-km-surface-alt" />
              <div className="mt-2 h-3 w-1/2 rounded-full bg-km-surface-alt" />
              <div className="mt-4 h-9 w-full rounded-full bg-km-surface-alt" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {produks.map((produk) => {
          const imageSrc = resolveImageSrc(produk.image);

          return (
            <Link
              key={produk.id}
              href={`/produk/${produk.id}`}
              className="group rounded-3xl border border-km-line bg-white shadow-soft overflow-hidden
                         hover:shadow-lift transition"
            >
              <div className="relative h-44 w-full">
                <Image
                  src={imageSrc}
                  alt={produk.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] uppercase tracking-[0.24em] text-km-ink/55">
                  Kayoe Moeda
                </p>
                <h3 className="mt-2 text-lg font-semibold text-km-ink">
                  {produk.name}
                </h3>
                <div className="mt-1 flex items-center justify-between text-sm text-km-ink/70">
                  <span>Rp {produk.price.toLocaleString("id-ID")}</span>
                  <span>Stok {produk.capacity}</span>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-km-ink/60">
                  View Detail &gt;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
