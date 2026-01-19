"use client";

import { useState } from "react";

type PasswordFieldsProps = {
  password: string;
  confirm: string;
  onChangePassword: (value: string) => void;
  onChangeConfirm: (value: string) => void;
};

export default function PasswordFields({
  password,
  confirm,
  onChangePassword,
  onChangeConfirm,
}: PasswordFieldsProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-xs font-semibold text-km-ink/70">
        Password Baru
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-km-line bg-white px-3 py-2">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            className="w-full bg-transparent text-sm text-km-ink focus:outline-none"
            placeholder="Minimal 8 karakter"
          />
        </div>
      </label>
      <label className="text-xs font-semibold text-km-ink/70">
        Konfirmasi Password
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-km-line bg-white px-3 py-2">
          <input
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => onChangeConfirm(e.target.value)}
            className="w-full bg-transparent text-sm text-km-ink focus:outline-none"
            placeholder="Ulangi password"
          />
        </div>
      </label>
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="text-xs font-semibold text-km-ink/60 hover:text-km-ink"
      >
        {show ? "Sembunyikan password" : "Tampilkan password"}
      </button>
    </div>
  );
}
