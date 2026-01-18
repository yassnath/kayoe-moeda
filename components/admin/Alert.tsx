type AlertProps = {
  variant?: "success" | "error" | "info";
  title?: string;
  message: string;
};

const styles: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  error: "bg-red-50 text-red-700 ring-red-200",
  info: "bg-blue-50 text-blue-700 ring-blue-200",
};

export default function Alert({
  variant = "info",
  title,
  message,
}: AlertProps) {
  return (
    <div className={`rounded-2xl px-4 py-3 text-sm ring-1 ${styles[variant]}`}>
      {title && <div className="font-semibold">{title}</div>}
      <div className="mt-1">{message}</div>
    </div>
  );
}

