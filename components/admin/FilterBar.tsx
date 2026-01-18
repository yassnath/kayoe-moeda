import type { ReactNode } from "react";

type FilterBarProps = {
  children: ReactNode;
};

export default function FilterBar({ children }: FilterBarProps) {
  return (
    <div className="rounded-3xl border border-km-line bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        {children}
      </div>
    </div>
  );
}

