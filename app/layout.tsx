import type { Metadata } from "next";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import WhatsAppGate from "@/components/whatsapp-gate";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kayoe Moeda",
  description: "Mebel kayu berkualitas untuk rumah Anda.",
  icons: {
    icon: "public/logo-kayoe.png",
    shortcut: "public/logo-kayoe.png",
    apple: "public/logo-kayoe.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="min-h-screen text-km-ink antialiased">
        <SessionProvider session={session}>
          <Navbar />

          {/* ? Global offset untuk fixed navbar */}
          <main className="pt-24">{children}</main>

          <Footer />
          <WhatsAppGate />
        </SessionProvider>
      </body>
    </html>
  );
}
