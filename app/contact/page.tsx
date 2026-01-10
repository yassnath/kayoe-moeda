import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import {
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
} from "react-icons/io5";
import TitleSection from "@/components/title-section";

export const metadata: Metadata = {
  title: "Contact",
};

const Contact = () => {
  return (
    <div className="bg-transparent text-white">
      <TitleSection title="Contact Us" subTitle="Kayoe Moeda" />

      <section className="w-full py-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/55">
              Hubungi Kami
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Get In Touch Today
            </h2>
            <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-lg">
              Tim Kayoe Moeda siap membantu kebutuhan furnitur Anda. Kirim pesan untuk konsultasi
              produk, custom order, atau informasi pengiriman.
            </p>

            <ul className="mt-10 space-y-6 text-sm text-white/80">
              <li className="flex gap-4">
                <div className="flex-none h-12 w-12 rounded-full border border-white/15 bg-white/5 flex items-center justify-center">
                  <IoMailOutline className="h-6 w-6 text-km-brass" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">Email</h4>
                  <p className="text-white/70">kalunastore@gmail.com</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-none h-12 w-12 rounded-full border border-white/15 bg-white/5 flex items-center justify-center">
                  <IoCallOutline className="h-6 w-6 text-km-brass" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">Phone Number</h4>
                  <p className="text-white/70">081234546572</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-none h-12 w-12 rounded-full border border-white/15 bg-white/5 flex items-center justify-center">
                  <IoLocationOutline className="h-6 w-6 text-km-brass" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">Address</h4>
                  <p className="text-white/70">
                    De Alamuda Residence K-16, Kota Surabaya, Jawa Timur 60222
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default Contact;
