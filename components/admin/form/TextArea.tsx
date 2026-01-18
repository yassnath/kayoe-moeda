type TextAreaProps = {
  label: string;
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
};

export default function TextArea({
  label,
  name,
  value,
  defaultValue,
  onChange,
  placeholder,
  required,
  rows = 4,
}: TextAreaProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-km-ink">
      <span className="font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <textarea
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="rounded-2xl border border-km-line bg-white px-4 py-3 text-sm text-km-ink focus:outline-none focus:ring-2 focus:ring-km-brass/60"
      />
    </label>
  );
}
