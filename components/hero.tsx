import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative -mt-24 overflow-hidden bg-[var(--km-bg)]">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(800px 420px at 90% 0%, rgba(194,161,90,0.18), transparent 60%), radial-gradient(640px 320px at 0% 100%, rgba(23,64,51,0.08), transparent 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-6 pt-24 pb-12 lg:pt-24 lg:pb-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.35em] uppercase text-km-ink/70 border border-km-line bg-white">
              Kayoe Moeda
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-km-ink">
              Furniture Shop
              <br className="hidden sm:block" />
              elegan looks cocok untuk pelengkap rumah anda
            </h1>

            <p className="text-sm sm:text-base font-medium leading-relaxed text-km-ink/75 max-w-xl">
              Kursi, meja, lemari, dan rak kayu dikerjakan presisi oleh pengrajin
              lokal. Finishing halus dan siap custom sesuai kebutuhan ruang.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/produk"
                className="no-underline inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                         bg-white text-km-ink ring-1 ring-km-line hover:bg-km-surface-alt transition"
              >
                Lihat Produk
              </Link>
              <Link
                href="/custom-order"
                className="no-underline inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                         bg-white text-km-ink ring-1 ring-km-line hover:bg-km-surface-alt transition"
              >
                Ajukan Custom
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-km-ink/60">
              <span className="rounded-full px-3 py-1 border border-km-line bg-white">
                Order via WhatsApp
              </span>
              <span className="rounded-full px-3 py-1 border border-km-line bg-white">
                Dibuat pengrajin lokal
              </span>
              <span className="rounded-full px-3 py-1 border border-km-line bg-white">
                Custom desain mebel
              </span>
            </div>
          </div>

          <div className="relative h-[320px] sm:h-[380px] lg:h-[480px] overflow-hidden rounded-3xl border border-km-line shadow-soft">
            <Image
              src="/hero.jpg"
              alt="Kayoe Moeda"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
