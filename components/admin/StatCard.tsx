import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
};

export default function StatCard({ label, value, helper, icon }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-km-line bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-km-ink/45">
            {label}
          </p>
          <div className="mt-2 text-2xl font-semibold text-km-ink">{value}</div>
          {helper && (
            <p className="mt-1 text-xs text-km-ink/50">{helper}</p>
          )}
        </div>
        {icon && (
          <div className="rounded-2xl bg-km-surface-alt p-2 text-km-ink">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

