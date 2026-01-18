type StatusBadgeProps = {
  type: "order" | "payment";
  value: string;
};

const orderStyles: Record<string, string> = {
  BARU: "bg-amber-50 text-amber-800 ring-amber-200",
  PROSES: "bg-blue-50 text-blue-700 ring-blue-200",
  SELESAI: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  BATAL: "bg-red-50 text-red-700 ring-red-200",
};

const paymentStyles: Record<string, string> = {
  UNPAID: "bg-amber-50 text-amber-800 ring-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REFUNDED: "bg-slate-50 text-slate-600 ring-slate-200",
};

export default function StatusBadge({ type, value }: StatusBadgeProps) {
  const normalized = value.toUpperCase();
  const styles =
    type === "order"
      ? orderStyles[normalized] || "bg-km-surface-alt text-km-ink ring-km-line"
      : paymentStyles[normalized] || "bg-km-surface-alt text-km-ink ring-km-line";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles}`}
    >
      {value}
    </span>
  );
}

