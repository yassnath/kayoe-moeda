import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Kayoe Moeda"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061610] via-[#0b2a22]/85 to-transparent" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(45% 45% at 95% 10%, rgba(244,234,210,0.35), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6 pt-12 pb-12 lg:pt-16 lg:pb-16">
        <div className="max-w-2xl space-y-6 text-white">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.35em] uppercase text-white/80 border border-white/15 bg-white/5">
            Kayoe Moeda
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
            Furniture Shop
            <br className="hidden sm:block" />
            elegan looks cocok untuk pelengkap rumah anda
          </h1>

          <p className="text-sm sm:text-base font-medium leading-relaxed text-white/80">
            Kursi, meja, lemari, dan rak kayu dikerjakan presisi oleh pengrajin
            lokal. Finishing halus dan siap custom sesuai kebutuhan ruang.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/produk"
              className="no-underline inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                         bg-km-brass text-km-wood ring-1 ring-white/20 hover:opacity-90 transition shadow-lg"
            >
              Lihat Produk
            </Link>
            <Link
              href="/custom-order"
              className="no-underline inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                         bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition"
            >
              Ajukan Custom
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-white/70">
            <span className="rounded-full px-3 py-1 border border-white/15">
              Order via WhatsApp
            </span>
            <span className="rounded-full px-3 py-1 border border-white/15">
              Dibuat pengrajin lokal
            </span>
            <span className="rounded-full px-3 py-1 border border-white/15">
              Custom desain mebel
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
