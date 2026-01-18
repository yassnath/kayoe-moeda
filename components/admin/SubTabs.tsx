"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type Tab = {
  label: string;
  value: string;
};

type SubTabsProps = {
  paramKey: string;
  tabs: Tab[];
};

export default function SubTabs({ paramKey, tabs }: SubTabsProps) {
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const active = searchParams?.get(paramKey) || "all";

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const params = new URLSearchParams(searchParams?.toString());
        if (tab.value === "all") {
          params.delete(paramKey);
        } else {
          params.set(paramKey, tab.value);
        }

        const href = `${pathname}?${params.toString()}`;
        const isActive = active === tab.value || (tab.value === "all" && !active);

        return (
          <Link
            key={tab.value}
            href={href}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ring-1 no-underline transition ${
              isActive
                ? "bg-km-wood text-white ring-km-wood"
                : "bg-white text-km-ink ring-km-line hover:bg-km-surface-alt"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

