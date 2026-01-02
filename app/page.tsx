// app/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import Hero from "@/components/hero";
import Main from "@/components/main";
import HomeSkeleton from "@/components/skeletons/home-skeleton";

export default function Home() {
  return (
    <div className="bg-transparent">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-10 space-y-14">
        {/* HERO */}
        <Hero />

        {/* ABOUT */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-2xl km-tile p-7">
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/45">
              Tentang Kayoe Moeda
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-km-ink">
              Furnitur kayu yang rapi, kuat, dan nyaman digunakan
            </h2>
            <p className="mt-4 text-sm text-km-ink/70 leading-relaxed">
              Kayoe Moeda fokus pada kursi, meja, lemari, dan rak kayu dengan
              kualitas bahan yang konsisten dan finishing yang bersih.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/produk"
                className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold
                           bg-km-wood text-km-cream ring-1 ring-km-wood hover:opacity-90 transition shadow-md no-underline"
              >
                Lihat Katalog
              </Link>
              <Link
                href="/custom-order"
                className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold
                           bg-km-sand ring-1 ring-km-line hover:bg-km-clay transition no-underline"
              >
                Ajukan Custom
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 text-xs font-semibold">
              <div className="rounded-2xl km-chip px-3 py-3">
                Material kayu pilihan
              </div>
              <div className="rounded-2xl km-chip px-3 py-3">
                Finishing halus & rapi
              </div>
              <div className="rounded-2xl km-chip px-3 py-3">
                Bisa custom ukuran
              </div>
            </div>
          </div>

          <div className="rounded-2xl km-tile p-7">
            <h3 className="text-lg font-semibold tracking-tight text-km-ink">
              Kenapa Kayoe Moeda?
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-km-ink/70">
              <li>• Material kayu pilihan, finishing rapi.</li>
              <li>• Custom ukuran, warna, dan model.</li>
              <li>• Proses produksi jelas dan terukur.</li>
            </ul>

            <div className="mt-6 rounded-2xl km-chip p-4">
              <p className="text-sm font-semibold text-km-ink">
                Cerita singkat
              </p>
              <p className="mt-1 text-sm text-km-ink/70 leading-relaxed">
                Kayoe Moeda hadir untuk menghadirkan furnitur yang rapi, kuat,
                dan terasa hangat di setiap sudut rumah.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="pt-2">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/45">
              Katalog Unggulan
            </p>
            <h2 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight text-km-ink">
              Produk Kayoe Moeda
            </h2>
            <p className="mt-3 text-sm text-km-ink/70">
              Pilihan kursi, meja, lemari, dan rak kayu untuk kebutuhan rumah.
            </p>
          </div>

          <Suspense fallback={<HomeSkeleton />}>
            <Main />
          </Suspense>

          <div className="text-center mt-8">
            <Link
              href="/produk"
              className="inline-flex items-center justify-center rounded-2xl px-7 py-3 text-sm font-semibold
                         bg-km-sand ring-1 ring-km-line hover:bg-km-clay transition no-underline"
            >
              Lihat Semua Produk
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl km-tile p-7 md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr,auto] items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-km-ink">
                Siap belanja atau pesan mebel custom?
              </h2>
              <p className="mt-3 text-sm text-km-ink/70 leading-relaxed max-w-2xl">
                Masuk untuk akses katalog, pesanan custom, dan riwayat.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center rounded-2xl px-7 py-3 text-sm font-semibold
                           bg-km-wood text-km-cream ring-1 ring-km-wood hover:opacity-90 transition no-underline"
              >
                Masuk / Daftar
              </Link>
              <Link
                href="/custom-order"
                className="inline-flex items-center justify-center rounded-2xl px-7 py-3 text-sm font-semibold
                           bg-km-sand ring-1 ring-km-line hover:bg-km-clay transition no-underline"
              >
                Custom Order
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
