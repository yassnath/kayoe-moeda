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
    <div className="bg-[var(--km-bg)]">
      <TitleSection title="Contact Us" subTitle="Kayoe Moeda" />

      <section className="w-full py-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
              Hubungi Kami
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-km-ink">
              Get In Touch Today
            </h2>
            <p className="mt-4 text-sm text-km-ink/70 leading-relaxed max-w-lg">
              Tim Kayoe Moeda siap membantu kebutuhan furnitur Anda. Kirim pesan untuk konsultasi
              produk, custom order, atau informasi pengiriman.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft flex gap-4">
                <div className="flex-none h-12 w-12 rounded-full border border-km-line bg-km-surface-alt flex items-center justify-center">
                  <IoMailOutline className="h-6 w-6 text-km-brass" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-km-ink">Email</h4>
                  <p className="text-km-ink/70">kalunastore@gmail.com</p>
                </div>
              </div>

              <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft flex gap-4">
                <div className="flex-none h-12 w-12 rounded-full border border-km-line bg-km-surface-alt flex items-center justify-center">
                  <IoCallOutline className="h-6 w-6 text-km-brass" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-km-ink">Phone Number</h4>
                  <p className="text-km-ink/70">081234546572</p>
                </div>
              </div>

              <div className="rounded-3xl border border-km-line bg-white p-5 shadow-soft flex gap-4">
                <div className="flex-none h-12 w-12 rounded-full border border-km-line bg-km-surface-alt flex items-center justify-center">
                  <IoLocationOutline className="h-6 w-6 text-km-brass" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-km-ink">Address</h4>
                  <p className="text-km-ink/70">
                    De Alamuda Residence K-16, Kota Surabaya, Jawa Timur 60222
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default Contact;
