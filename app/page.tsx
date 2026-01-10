// app/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import Hero from "@/components/hero";
import Main from "@/components/main";
import HomeSkeleton from "@/components/skeletons/home-skeleton";

export default function Home() {
  return (
    <div className="bg-transparent">
      {/* HERO */}
      <Hero />

      {/* ABOUT */}
      <section className="relative w-full border-t border-white/10 py-20 lg:py-28">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 grid gap-12 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6 text-white/80">
            <p className="text-xs uppercase tracking-[0.32em] text-white/55">
              Tentang Kayoe Moeda
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Furniture Shop
            </h2>
            <p className="text-sm leading-relaxed text-white/70">
              Kayoe Moeda fokus pada kursi, meja, lemari, dan rak kayu dengan
              kualitas bahan yang konsisten dan finishing yang bersih.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/produk"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                           bg-km-brass text-km-wood ring-1 ring-white/15 hover:opacity-90 transition no-underline"
              >
                Lihat Katalog
              </Link>
              <Link
                href="/custom-order"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                           bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition no-underline"
              >
                Ajukan Custom
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.24em] text-white/70">
              <span className="rounded-full px-3 py-2 border border-white/15">
                Material kayu pilihan
              </span>
              <span className="rounded-full px-3 py-2 border border-white/15">
                Finishing halus & rapi
              </span>
              <span className="rounded-full px-3 py-2 border border-white/15">
                Bisa custom ukuran
              </span>
            </div>
          </div>

          <div className="space-y-4 text-white/75 lg:border-l lg:border-white/10 lg:pl-8">
            <h3 className="text-lg font-semibold tracking-tight text-white">
              Kenapa Kayoe Moeda?
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-km-brass">-</span>
                Material kayu pilihan, finishing rapi.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-km-brass">-</span>
                Custom ukuran, warna, dan model.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-km-brass">-</span>
                Proses produksi jelas dan terukur.
              </li>
            </ul>
            <p className="text-sm text-white/70 leading-relaxed">
              Kayoe Moeda hadir untuk menghadirkan furnitur yang rapi, kuat, dan
              terasa hangat di setiap sudut rumah.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="relative w-full border-t border-white/10 py-20 lg:py-28">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(55% 55% at 95% 0%, rgba(244,234,210,0.28), transparent 60%), radial-gradient(45% 45% at 5% 100%, rgba(244,234,210,0.18), transparent 65%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-white/55">
              Katalog Unggulan
            </p>
            <h2 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight text-white">
              Produk Kayoe Moeda
            </h2>
            <p className="mt-3 text-sm text-white/70">
              Pilihan kursi, meja, lemari, dan rak kayu untuk kebutuhan rumah.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Suspense fallback={<HomeSkeleton />}>
            <Main />
          </Suspense>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/produk"
            className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold
                       bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition no-underline"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="relative w-full border-t border-white/10 py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b2a22]/65 via-[#0f3a2c]/35 to-[#0b2a22]/85" />
        <div className="relative mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 text-white">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Siap belanja atau pesan mebel custom?
              </h2>
              <p className="mt-3 text-sm text-white/70 leading-relaxed max-w-2xl">
                Masuk untuk akses katalog, pesanan custom, dan riwayat.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold
                           bg-km-brass text-km-wood ring-1 ring-white/20 hover:opacity-90 transition no-underline"
              >
                Masuk / Daftar
              </Link>
              <Link
                href="/custom-order"
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold
                           bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition no-underline"
              >
                Custom Order
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
