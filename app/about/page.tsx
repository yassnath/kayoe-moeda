import { Metadata } from "next";
import TitleSection from "@/components/title-section";
import Image from "next/image";
import { IoEyeOutline, IoLocateOutline } from "react-icons/io5";

export const metadata: Metadata = {
  title: "About Kayoe Moeda",
  description: "Tentang Kayoe Moeda",
};

const About = () => {
  return (
    <div className="bg-[var(--km-bg)]">
      <TitleSection title="About Us" subTitle="Kayoe Moeda" />

      <section className="w-full py-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl border border-km-line shadow-soft">
            <Image
              src="/about-image.jpg"
              width={900}
              height={700}
              alt="About Kayoe Moeda"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-km-ink">
              Siapa Kami - Kayoe Moeda
            </h2>
            <p className="text-sm leading-relaxed text-km-ink/70">
              Kayoe Moeda adalah perusahaan mebel yang berfokus pada pembuatan kursi, meja, dan
              berbagai perabotan rumah berbahan kayu. Kami mengutamakan kualitas material, kerapian
              finishing, dan ketepatan ukuran agar setiap produk nyaman digunakan serta awet untuk
              jangka panjang. Kami tumbuh bersama pelanggan yang membutuhkan furnitur fungsional
              dengan desain yang rapi dan mudah dipadukan di berbagai gaya interior. Karena itu,
              Kayoe Moeda juga menyediakan layanan custom untuk menyesuaikan ukuran, model, dan warna
              sesuai kebutuhan ruang. Setiap produk dikerjakan oleh pengrajin lokal dengan perhatian
              pada detail agar hasilnya kuat, presisi, dan tetap hangat bagi rumah Anda.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-none mt-1 text-km-brass">
                  <IoEyeOutline className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-km-ink">Visi</h3>
                  <p className="mt-2 text-sm text-km-ink/70 leading-relaxed">
                    Menjadi perusahaan mebel yang menghadirkan furnitur rumah yang kuat, rapi, dan
                    nyaman, dengan desain yang fungsional serta bernilai jangka panjang.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-none mt-1 text-km-brass">
                  <IoLocateOutline className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-km-ink">Misi</h3>
                  <ul className="mt-2 space-y-2 text-sm text-km-ink/70">
                    <li className="flex gap-2">
                      <span className="text-km-brass">-</span>
                      Mengutamakan material berkualitas dan finishing yang rapi di setiap produk.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-km-brass">-</span>
                      Menyediakan layanan custom agar ukuran, warna, dan model sesuai kebutuhan ruang.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-km-brass">-</span>
                      Menjaga ketelitian produksi untuk hasil yang kuat, presisi, dan tahan lama.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-km-brass">-</span>
                      Memberdayakan pengrajin lokal dengan standar kerja yang konsisten.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-km-brass">-</span>
                      Memberikan layanan yang jelas dan responsif dari konsultasi hingga pengiriman.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
