"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: any) {
    e.preventDefault();

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    setMessage(data.message);

    if (res.ok) {
      setTimeout(() => router.push("/signin"), 1500);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--km-bg)] pt-24 pb-16">
      <div className="w-full max-w-md rounded-3xl border border-km-line bg-white p-8 shadow-soft">
        <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
          Reset Password
        </p>
        <h1 className="mt-2 text-xl font-semibold text-km-ink">
          Buat Password Baru
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Password baru"
            className="w-full rounded-2xl border border-km-line px-4 py-3 text-sm text-km-ink
                       focus:outline-none focus:ring-2 focus:ring-km-brass/60"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full rounded-full bg-km-wood ring-1 ring-km-wood py-3 text-sm font-semibold
                       text-white hover:opacity-90 transition"
          >
            Simpan Password Baru
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-km-ink/70">{message}</p>
        )}
      </div>
    </div>
  );
}
