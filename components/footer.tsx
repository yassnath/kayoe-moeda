import Image from "next/image";
import Link from "next/link";
import {
  RiInstagramLine,
  RiWhatsappLine,
} from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="km-footer bg-gradient-to-r from-km-wood via-km-moss to-km-wood text-white">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo-kayoe.png"
                alt="Kayoe Moeda"
                width={180}
                height={52}
                className="h-auto w-[160px] md:w-[190px]"
                priority
              />
            </Link>

            <p className="mt-4 text-white/90 leading-relaxed">
              Furnitur rumah yang fungsional, kuat, dan dibuat dengan perhatian
              pada detail.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://www.instagram.com/kayoemoeda.id?igsh=bDV2NWdpNmRmcDAz"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-km-moss
                           hover:opacity-90 transition"
                aria-label="Instagram"
              >
                <RiInstagramLine className="text-xl text-white" />
              </a>

              <a
                href="https://wa.me/6285771753354"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-km-moss
                           hover:opacity-90 transition"
                aria-label="WhatsApp"
              >
                <RiWhatsappLine className="text-xl text-white" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 md:gap-10">
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white">
                Links
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-white/90">
                <li>
                  <Link href="#" className="hover:opacity-90 transition no-underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-90 transition no-underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-90 transition no-underline">
                    Produk
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-90 transition no-underline">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white">
                Legal
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-white/90">
                <li>
                  <a href="#" className="hover:opacity-90 transition no-underline">
                    Legal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-90 transition no-underline">
                    Term &amp; Condition
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-90 transition no-underline">
                    Payment Method
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-90 transition no-underline">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">
              Newsletter
            </h4>
            <p className="mt-5 text-sm text-white/90 leading-relaxed">
              Dapatkan info koleksi baru, promo, dan proses produksi Kayoe Moeda.
            </p>

            <form className="mt-6">
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-2xl bg-km-cream px-4 py-3 text-sm text-km-ink
                             placeholder:text-km-ink/60 ring-1 ring-km-line
                             focus:outline-none focus:ring-2 focus:ring-km-brass/70"
                  placeholder="johndoe@example.com"
                />

                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold
                             bg-km-sand text-km-wood ring-1 ring-km-sand hover:opacity-90 transition shadow-md"
                >
                  Subscribe
                </button>
              </div>
            </form>

            <p className="mt-4 text-xs text-white/80">
              Dengan subscribe, kamu setuju menerima email dari Kayoe Moeda.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-km-line">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 text-center text-sm text-white/85">
          &copy; Copyright 2025 | Kayoe Moeda
        </div>
      </div>
    </footer>
  );
};

export default Footer;
