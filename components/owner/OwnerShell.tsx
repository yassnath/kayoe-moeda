import type { ReactNode } from "react";

export default function OwnerShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--km-bg)] pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 pt-6">
        {children}
      </div>
    </div>
  );
}
