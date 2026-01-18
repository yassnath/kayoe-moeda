import Image from "next/image";

type FileUploadProps = {
  label: string;
  name?: string;
  value?: string;
  preview?: string | null;
  onChange?: (file: File | null) => void;
};

export default function FileUpload({
  label,
  name,
  value,
  preview,
  onChange,
}: FileUploadProps) {
  return (
    <div className="flex flex-col gap-2 text-sm text-km-ink">
      <span className="font-semibold">{label}</span>
      {preview && (
        <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-km-line">
          <Image src={preview} alt={label} fill className="object-cover" />
        </div>
      )}
      <input
        type="file"
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.files?.[0] ?? null)}
        className="rounded-2xl border border-km-line bg-white px-4 py-3 text-sm text-km-ink"
        accept="image/*"
      />
    </div>
  );
}
