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
    <div>
      <TitleSection title="About Us" subTitle="Kayoe Moeda." />
      <div className="max-w-screen-xl mx-auto py-20 px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <Image src="/about-image.jpg" width={650} height={579} alt="About Kayoe Moeda" />
          <div>
            <h1 className="text-5xl font-semibold text-gray-900 mb-4">
              Siapa Kami – Kayoe Moeda
            </h1>
            <p className="text-gray-700 py-5 text-justify">
              Kayoe Moeda adalah perusahaan mebel yang berfokus pada pembuatan kursi, meja, dan
              berbagai perabotan rumah berbahan kayu. Kami mengutamakan kualitas material, kerapian
              finishing, dan ketepatan ukuran agar setiap produk nyaman digunakan serta awet untuk
              jangka panjang.
              Kami tumbuh bersama pelanggan yang membutuhkan furnitur fungsional dengan desain yang
              rapi dan mudah dipadukan di berbagai gaya interior. Karena itu, Kayoe Moeda juga
              menyediakan layanan custom untuk menyesuaikan ukuran, model, dan warna sesuai kebutuhan
              ruang. Setiap produk dikerjakan oleh pengrajin lokal dengan perhatian pada detail agar
              hasilnya kuat, presisi, dan tetap hangat bagi rumah Anda.
            </p>
            <ul className="list-item space-y-6 pt-8">
              <li className="flex gap-5">
                <div className="flex-none mt-1">
                  <IoEyeOutline className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Visi :</h4>
                  <p className="text-gray-600 text-justify">
                    Menjadi perusahaan mebel yang menghadirkan furnitur rumah yang kuat, rapi, dan
                    nyaman, dengan desain yang fungsional serta bernilai jangka panjang.
                  </p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="flex-none mt-1">
                  <IoLocateOutline className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Misi :</h4>
                  <p className="text-gray-600">
                    * Mengutamakan material berkualitas dan finishing yang rapi di setiap produk.
                    * Menyediakan layanan custom agar ukuran, warna, dan model sesuai kebutuhan ruang.
                    * Menjaga ketelitian produksi untuk hasil yang kuat, presisi, dan tahan lama.
                    * Memberdayakan pengrajin lokal dengan standar kerja yang konsisten.
                    * Memberikan layanan yang jelas dan responsif dari konsultasi hingga pengiriman.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          {/* Contact Form */}
        </div>
      </div>
    </div>
  );
};

export default About;
