"use client";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-km-ink">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-km-ink/70">{description}</p>
        )}
        <div className="mt-5 flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-full bg-km-wood ring-1 ring-km-wood px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-full bg-white ring-1 ring-km-line px-4 py-3 text-sm font-semibold text-km-ink hover:bg-km-surface-alt transition"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

