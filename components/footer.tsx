import Image from "next/image";
import Link from "next/link";
import {
  RiInstagramLine,
  RiWhatsappLine,
} from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="km-footer bg-white text-km-ink border-t border-km-line">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Link href="/" className="inline-flex items-center justify-center md:justify-start">
              <Image
                src="/logo-kayoe.png"
                alt="Kayoe Moeda"
                width={180}
                height={52}
                className="h-auto w-[160px] md:w-[190px]"
                priority
              />
            </Link>

            <p className="mt-4 text-km-ink/70 leading-relaxed">
              Furnitur rumah yang fungsional, kuat, dan dibuat dengan perhatian
              pada detail.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center justify-center gap-4 md:justify-start">
              <a
                href="https://www.instagram.com/kayoemoeda.id?igsh=bDV2NWdpNmRmcDAz"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-km-line
                           bg-km-surface-alt hover:bg-km-sand transition"
                aria-label="Instagram"
              >
                <RiInstagramLine className="text-xl text-km-ink" />
              </a>

              <a
                href="https://wa.me/6285771753354"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-km-line
                           bg-km-surface-alt hover:bg-km-sand transition"
                aria-label="WhatsApp"
              >
                <RiWhatsappLine className="text-xl text-km-ink" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 md:gap-10 md:text-left">
            <div className="md:text-left">
              <h4 className="text-sm font-semibold tracking-wide text-km-ink">
                Menu
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-km-ink/75">
                <li>
                  <Link href="/" className="hover:opacity-80 transition no-underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:opacity-80 transition no-underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/produk" className="hover:opacity-80 transition no-underline">
                    Product
                  </Link>
                </li>
                <li>
                  <Link href="/custom-order" className="hover:opacity-80 transition no-underline">
                    Custom Order
                  </Link>
                </li>
                <li>
                  <Link href="/history-order" className="hover:opacity-80 transition no-underline">
                    History
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:text-left">
              <h4 className="text-sm font-semibold tracking-wide text-km-ink">
                Bantuan
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-km-ink/75">
                <li>
                  <Link href="/contact" className="hover:opacity-80 transition no-underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="hover:opacity-80 transition no-underline">
                    Chat
                  </Link>
                </li>
                <li>
                  <Link href="/signin" className="hover:opacity-80 transition no-underline">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:opacity-80 transition no-underline">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold tracking-wide text-km-ink">
              Newsletter
            </h4>
            <p className="mt-5 text-sm text-km-ink/70 leading-relaxed">
              Dapatkan info koleksi baru, promo, dan proses produksi Kayoe Moeda.
            </p>

            <form className="mt-6">
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-km-ink
                             placeholder:text-km-ink/50 ring-1 ring-km-line
                             focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                  placeholder="johndoe@example.com"
                />

                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold
                             bg-km-wood text-white ring-1 ring-km-wood hover:opacity-90 transition shadow-soft"
                >
                  Subscribe
                </button>
              </div>
            </form>

            <p className="mt-4 text-xs text-km-ink/60">
              Dengan subscribe, kamu setuju menerima email dari Kayoe Moeda.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-km-line">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 text-center text-sm text-km-ink/70">
          &copy; Copyright 2025 | Kayoe Moeda
        </div>
      </div>
    </footer>
  );
};

export default Footer;
