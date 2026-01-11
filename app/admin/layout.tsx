// app/admin/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // ? Wajib login
  if (!session) {
    redirect("/signin?callbackUrl=/admin");
  }

  // ? Role guard
  const role = (session.user as any)?.role as
    | "ADMIN"
    | "OWNER"
    | "CUSTOMER"
    | undefined;

  // Jika bukan admin, redirect sesuai role
  if (role !== "ADMIN") {
    if (role === "OWNER") redirect("/owner");
    redirect("/");
  }

  return (
    <div className="min-h-screen pt-24 pb-10 bg-[var(--km-bg)]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="rounded-3xl border border-km-line bg-white shadow-soft overflow-hidden">
          <div className="border-b border-km-line px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-km-ink/60">
                  Kayoe Moeda
                </p>
                <h1 className="text-lg font-semibold text-km-ink">
                  Admin Dashboard
                </h1>
              </div>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold
                           bg-white text-km-ink ring-1 ring-km-line hover:bg-black hover:text-white
                           hover:ring-black transition-colors no-underline"
              >
                Kembali ke Home
              </Link>
            </div>

            <nav className="mt-4 flex flex-wrap gap-2 text-sm">
              <AdminNavLink href="/admin">Overview</AdminNavLink>
              <AdminNavLink href="/admin/products">Produk / Produk</AdminNavLink>
              <AdminNavLink href="/admin/orders">Pesanan</AdminNavLink>
              <AdminNavLink href="/admin/custom-orders">Custom Order</AdminNavLink>
              <AdminNavLink href="/admin/insight">Insight Penjualan</AdminNavLink>
            </nav>
          </div>

          <main className="p-4 sm:p-6 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER ================= */
function AdminNavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold
                 bg-white text-km-ink ring-1 ring-km-line hover:bg-black hover:text-white
                 hover:ring-black transition-colors no-underline"
    >
      {children}
    </Link>
  );
}
