import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import WhatsAppPopup from "@/components/whatsapp-popup";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-head",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kayoe Moeda",
  description: "Mebel kayu berkualitas untuk rumah Anda.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={`${sourceSans.variable} ${cormorant.variable}`}>
      <body className="min-h-screen text-km-ink antialiased">
        <SessionProvider session={session}>
          <Navbar />

          {/* ✅ Global offset untuk fixed navbar */}
          <main className="pt-24">
            {/* ✅ Lebih lebar + panel utama */}
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-12">
            <div className="rounded-[28px] km-panel km-shell">
              <div className="px-4 md:px-10 py-10">{children}</div>
            </div>
            </div>
          </main>

          <Footer />
          <WhatsAppPopup />
        </SessionProvider>
      </body>
    </html>
  );
}
