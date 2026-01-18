type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label: string;
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  required?: boolean;
};

export default function SelectField({
  label,
  name,
  value,
  defaultValue,
  onChange,
  options,
  required,
}: SelectFieldProps) {
  const selectProps =
    value !== undefined ? { value, onChange } : { defaultValue };

  return (
    <label className="flex flex-col gap-2 text-sm text-km-ink">
      <span className="font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <select
        name={name}
        {...selectProps}
        className="rounded-2xl border border-km-line bg-white px-4 py-3 text-sm text-km-ink focus:outline-none focus:ring-2 focus:ring-km-brass/60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
