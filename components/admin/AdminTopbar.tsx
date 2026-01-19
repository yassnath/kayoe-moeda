"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { debounce } from "./utils";

type AdminTopbarProps = {
  name?: string | null;
  role?: string | null;
};

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Produk" },
  { href: "/admin/orders", label: "Pesanan" },
  { href: "/admin/custom-orders", label: "Custom Order" },
  { href: "/admin/insight", label: "Insight" },
  { href: "/admin/reports", label: "Reports" },
];

export default function AdminTopbar({ name, role }: AdminTopbarProps) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        const params = new URLSearchParams(searchParams?.toString());
        if (value) {
          params.set("q", value);
        } else {
          params.delete("q");
        }
        router.replace(`${pathname}?${params.toString()}`);
      }, 300),
    [pathname, router, searchParams]
  );

  const visibleTabs =
    role === "OWNER"
      ? tabs
      : tabs.filter((tab) => tab.href !== "/admin/reports");

  return (
    <div className="sticky top-0 z-40 border-b border-km-line bg-[var(--km-bg)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 no-underline">
            <div className="h-9 w-9 rounded-full bg-km-wood/10 ring-1 ring-km-line flex items-center justify-center text-xs font-semibold text-km-ink">
              KM
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold text-km-ink">
                Admin Kayoe Moeda
              </div>
              <div className="text-xs text-km-ink/55">Dashboard</div>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-4">
            {visibleTabs.map((tab) => {
              const active =
                pathname === tab.href ||
                (tab.href !== "/admin" && pathname.startsWith(tab.href));
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`whitespace-nowrap border-b-2 pb-1 text-xs font-semibold tracking-wide no-underline transition ${
                    active
                      ? "border-km-wood text-km-wood"
                      : "border-transparent text-km-ink/70 hover:text-km-ink"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <div className="hidden md:flex w-full max-w-xs items-center gap-2 rounded-full bg-white/80 px-3 py-2 ring-1 ring-km-line">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Cari order / customer / produk..."
              className="w-full bg-transparent text-xs text-km-ink placeholder:text-km-ink/40 focus:outline-none"
            />
          </div>
          <div
            ref={menuRef}
            className="relative flex items-center rounded-full bg-white px-3 py-1.5 ring-1 ring-km-line"
          >
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 text-xs font-semibold text-km-ink"
            >
              <span>{role === "OWNER" ? "Owner" : "Admin"}</span>
              <span className="text-km-ink/40">v</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 w-44 rounded-2xl border border-km-line bg-white p-2 shadow-soft">
                {role === "OWNER" && (
                  <Link
                    href="/owner/admins"
                    className="block rounded-xl px-3 py-2 text-xs font-semibold text-km-ink hover:bg-km-surface-alt no-underline"
                  >
                    Kelola Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() =>
                    signOut({
                      callbackUrl: "/signin",
                      redirect: true,
                    })
                  }
                  className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="xl:hidden border-t border-km-line bg-[var(--km-bg)]">
        <div className="mx-auto flex flex-wrap gap-2 px-4 py-2 md:px-6">
          {visibleTabs.map((tab) => {
            const active =
              pathname === tab.href ||
              (tab.href !== "/admin" && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold no-underline transition ${
                  active
                    ? "bg-km-wood/10 text-km-wood"
                    : "text-km-ink/80 hover:text-km-ink"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
        <div className="md:hidden px-4 pb-3">
          <div className="flex w-full items-center gap-2 rounded-full bg-white px-3 py-2 ring-1 ring-km-line">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Cari order / customer / produk..."
              className="w-full bg-transparent text-xs text-km-ink placeholder:text-km-ink/40 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}



