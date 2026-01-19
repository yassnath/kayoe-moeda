type StatusBadgeProps = {
  active: boolean;
};

export default function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-gray-100 text-gray-600 ring-gray-200"
      }`}
    >
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}
