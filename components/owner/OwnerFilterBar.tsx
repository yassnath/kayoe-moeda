import type { ReactNode } from "react";

export default function OwnerFilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-km-line bg-white p-4 shadow-soft">
      {children}
    </div>
  );
}
