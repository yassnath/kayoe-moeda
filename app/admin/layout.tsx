// app/admin/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    // offset dari navbar global (64px)
    <div className="min-h-screen pt-20 bg-km-sand">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="flex gap-6">
          {/* ================= SIDEBAR ================= */}
          <aside className="w-64 shrink-0">
            <div className="sticky top-24 rounded-2xl bg-km-cream border border-km-line shadow-sm overflow-hidden">
              {/* Header sidebar */}
              <div className="px-6 py-5 border-b border-km-line">
                <p className="text-xs uppercase tracking-widest text-km-muted">
                  Kayoe Moeda
                </p>
                <h1 className="text-lg font-semibold">Admin Dashboard</h1>
              </div>

              {/* Menu */}
              <nav className="px-3 py-4 text-sm space-y-1">
                <SidebarLink href="/admin">Overview</SidebarLink>
                <SidebarLink href="/admin/products">
                  Produk / Produk
                </SidebarLink>
                <SidebarLink href="/admin/orders">Pesanan</SidebarLink>
                <SidebarLink href="/admin/custom-orders">
                  Custom Order
                </SidebarLink>
                <SidebarLink href="/admin/insight">
                  Insight Penjualan
                </SidebarLink>
              </nav>

              {/* Footer sidebar */}
              <div className="border-t border-km-line px-4 py-3">
                <Link
                  href="/"
                  className="text-xs text-km-muted hover:text-km-ink no-underline"
                >
                  ← Kembali ke Home
                </Link>
              </div>
            </div>
          </aside>

          {/* ================= MAIN CONTENT ================= */}
          <main className="flex-1 min-w-0">
            <div className="rounded-2xl bg-km-cream border border-km-line shadow-sm p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER ================= */
function SidebarLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="
        block rounded-lg px-4 py-2
        text-km-ink/80
        hover:bg-km-clay hover:text-km-ink
        transition no-underline
      "
    >
      {children}
    </Link>
  );
}
