"use client";

import { useState } from "react";

type AdminFormValues = {
  name: string;
  email: string;
  username: string;
  isActive: boolean;
};

type AdminFormProps = {
  initialValues?: Partial<AdminFormValues>;
  onSubmit: (values: AdminFormValues) => Promise<void>;
  submitLabel: string;
  disableStatus?: boolean;
  readOnlyIdentity?: boolean;
};

export default function AdminForm({
  initialValues,
  onSubmit,
  submitLabel,
  disableStatus,
  readOnlyIdentity,
}: AdminFormProps) {
  const [values, setValues] = useState<AdminFormValues>({
    name: initialValues?.name || "",
    email: initialValues?.email || "",
    username: initialValues?.username || "",
    isActive: initialValues?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof AdminFormValues, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-km-line bg-white p-6 shadow-soft"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold text-km-ink/70">
          Nama lengkap
          <input
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
          />
        </label>
        <label className="text-xs font-semibold text-km-ink/70">
          Email
          <input
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            readOnly={readOnlyIdentity}
            className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
          />
        </label>
        <label className="text-xs font-semibold text-km-ink/70">
          Username
          <input
            value={values.username}
            onChange={(e) => handleChange("username", e.target.value)}
            required
            readOnly={readOnlyIdentity}
            className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
          />
        </label>
        <label className="text-xs font-semibold text-km-ink/70">
          Status
          <select
            value={values.isActive ? "active" : "inactive"}
            onChange={(e) => handleChange("isActive", e.target.value === "active")}
            disabled={disableStatus}
            className="mt-2 w-full rounded-2xl border border-km-line bg-white px-3 py-2 text-sm text-km-ink disabled:opacity-60"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-full bg-km-wood px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-km-wood hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}
