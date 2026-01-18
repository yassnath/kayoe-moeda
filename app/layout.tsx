import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import AppShell from "@/components/app-shell";
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
          <AppShell>{children}</AppShell>
        </SessionProvider>
      </body>
    </html>
  );
}
