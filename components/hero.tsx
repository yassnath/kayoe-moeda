import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="rounded-[28px] km-panel overflow-visible">
      <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] items-center p-6 sm:p-10">
        <div className="space-y-5">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.35em] km-chip shadow-sm">
            KAYOE MOEDA
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-km-ink">
            Furniture Shop
            <br className="hidden sm:block" />
            elegan looks cocok untuk pelengkap rumah anda
          </h1>

          <p className="text-sm sm:text-base font-medium leading-relaxed max-w-xl text-km-ink/80">
            Kursi, meja, lemari, dan rak kayu dikerjakan presisi oleh pengrajin
            lokal. Finishing halus dan siap custom sesuai kebutuhan ruang.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/produk"
              className="no-underline inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold
                         bg-km-wood text-km-cream ring-1 ring-km-wood hover:opacity-90 transition shadow-md"
            >
              Lihat Produk
            </Link>
            <Link
              href="/custom-order"
              className="no-underline inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold
                         bg-km-sand ring-1 ring-km-line hover:bg-km-clay transition shadow-sm"
            >
              Ajukan Custom
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full px-3 py-1 km-chip">
              Order via WhatsApp
            </span>
            <span className="rounded-full px-3 py-1 km-chip">
              Dibuat pengrajin lokal
            </span>
            <span className="rounded-full px-3 py-1 km-chip">
              Custom desain mebel
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl overflow-hidden ring-1 ring-km-line shadow-md bg-km-paper">
            <div className="relative h-[320px] sm:h-[380px]">
              <Image
                src="/hero.jpg"
                alt="Kayoe Moeda"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-km-wood/15 via-transparent to-km-brass/60" />
            </div>
          </div>
          <div className="mt-4">
            <div className="inline-flex rounded-2xl km-chip px-4 py-3 text-xs font-semibold shadow-sm">
              Finishing rapi • Presisi ukuran • Bahan pilihan
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
