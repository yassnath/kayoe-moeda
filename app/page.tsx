// app/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import {
  IoSparklesOutline,
  IoColorPaletteOutline,
  IoShieldCheckmarkOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import Hero from "@/components/hero";
import Main from "@/components/main";
import HomeSkeleton from "@/components/skeletons/home-skeleton";

const BENEFITS = [
  {
    title: "Material Kayu Pilihan",
    desc: "Pilih bahan terbaik untuk hasil mebel yang kuat dan rapi.",
    icon: IoShieldCheckmarkOutline,
  },
  {
    title: "Finishing Halus",
    desc: "Sentuhan akhir bersih dan konsisten di setiap detail.",
    icon: IoSparklesOutline,
  },
  {
    title: "Desain Fleksibel",
    desc: "Custom ukuran, warna, dan model sesuai kebutuhan ruang.",
    icon: IoColorPaletteOutline,
  },
];

const WHY = [
  "Material kayu pilihan dengan standar kualitas konsisten.",
  "Proses produksi jelas, estimasi dan timeline transparan.",
  "Finishing halus yang tahan lama untuk pemakaian harian.",
  "Layanan custom untuk ukuran dan desain yang presisi.",
];

export default function Home() {
  return (
    <div className="bg-transparent">
      {/* HERO */}
      <Hero />

      {/* BENEFITS */}
      <section className="w-full bg-white border-t border-km-line py-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
              Katalog Unggulan
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-km-ink">
              Produk Kayoe Moeda
            </h2>
            <p className="mt-3 text-sm text-km-ink/70 max-w-xl">
              Pilihan kursi, meja, lemari, dan rak kayu untuk kebutuhan rumah.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-3xl border border-km-line bg-white p-6 shadow-soft"
              >
                <benefit.icon className="h-8 w-8 text-km-brass" />
                <h3 className="mt-4 text-lg font-semibold text-km-ink">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-km-ink/70 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="w-full bg-[var(--km-surface-alt)] border-t border-km-line py-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
              Tentang Kayoe Moeda
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-km-ink">
              Kenapa Kayoe Moeda?
            </h2>
            <p className="text-sm text-km-ink/70 max-w-xl">
              Kayoe Moeda hadir untuk menghadirkan furnitur yang rapi, kuat, dan
              terasa hangat di setiap sudut rumah.
            </p>
          </div>

          <div className="rounded-3xl border border-km-line bg-white p-6 shadow-soft">
            <ul className="space-y-4">
              {WHY.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-km-ink/75">
                  <IoCheckmarkCircleOutline className="h-5 w-5 text-km-brass flex-none mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PREVIEW PRODUCTS */}
      <section className="w-full bg-white border-t border-km-line py-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="flex flex-col gap-3 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
              Preview Produk
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-km-ink">
              Rekomendasi Produk
            </h2>
            <p className="text-sm text-km-ink/70">
              Temukan pilihan furnitur terbaik untuk kebutuhan rumah Anda.
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
                       bg-km-wood text-white ring-1 ring-km-wood hover:opacity-90 transition no-underline"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-[var(--km-surface-alt)] border-t border-km-line py-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="rounded-3xl border border-km-line bg-white p-8 md:p-10 shadow-soft flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
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
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold
                           bg-km-wood text-white ring-1 ring-km-wood hover:opacity-90 transition no-underline"
              >
                Masuk / Daftar
              </Link>
              <Link
                href="/custom-order"
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold
                           bg-white text-km-ink ring-1 ring-km-line hover:bg-km-surface-alt transition no-underline"
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
