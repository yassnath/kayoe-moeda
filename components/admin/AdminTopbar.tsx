"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

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
          <div className="hidden lg:flex items-center gap-5">
            {tabs.map((tab) => {
              const active =
                pathname === tab.href ||
                (tab.href !== "/admin" && pathname.startsWith(tab.href));
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`text-xs font-semibold tracking-wide no-underline transition ${
                    active
                      ? "text-km-wood"
                      : "text-km-ink/70 hover:text-km-ink"
                  }`}
                >
                  <span className="pb-1 border-b-2 border-transparent">
                    {tab.label}
                  </span>
                  {active && (
                    <span className="block h-0.5 w-full bg-km-wood mt-1 rounded-full" />
                  )}
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
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 ring-1 ring-km-line">
            <div className="text-xs font-semibold text-km-ink">
              {name || "Admin"}
            </div>
            <Link
              href="/api/auth/signout"
              className="rounded-full px-3 py-1 text-xs font-semibold text-km-ink ring-1 ring-km-line hover:bg-km-surface-alt no-underline"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </div>

      <div className="xl:hidden border-t border-km-line bg-[var(--km-bg)]">
        <div className="mx-auto flex flex-wrap gap-2 px-4 py-2 md:px-6">
          {tabs.map((tab) => {
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

