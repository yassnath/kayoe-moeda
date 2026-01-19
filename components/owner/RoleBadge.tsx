type RoleBadgeProps = {
  role: "OWNER" | "ADMIN";
};

export default function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        role === "OWNER"
          ? "bg-amber-50 text-amber-700 ring-amber-200"
          : "bg-blue-50 text-blue-700 ring-blue-200"
      }`}
    >
      {role}
    </span>
  );
}
