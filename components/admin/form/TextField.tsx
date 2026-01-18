type TextFieldProps = {
  label: string;
  name: string;
  type?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
};

export default function TextField({
  label,
  name,
  type = "text",
  value,
  defaultValue,
  onChange,
  placeholder,
  required,
}: TextFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-km-ink">
      <span className="font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded-2xl border border-km-line bg-white px-4 py-3 text-sm text-km-ink focus:outline-none focus:ring-2 focus:ring-km-brass/60"
      />
    </label>
  );
}
