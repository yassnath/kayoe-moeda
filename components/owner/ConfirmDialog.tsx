type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Konfirmasi",
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl border border-km-line bg-white p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-km-ink">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-km-ink/70">{description}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-km-line px-4 py-2 text-xs font-semibold text-km-ink"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-km-wood px-4 py-2 text-xs font-semibold text-white ring-1 ring-km-wood hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
