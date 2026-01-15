"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message || "Jika email terdaftar, link reset akan dikirim.");
    } catch {
      setMessage("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-3xl border border-km-line bg-white shadow-soft p-7 md:p-8">
            {/* Header */}
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
                Pemulihan Akun
              </p>
              <h1 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-km-ink">
                Lupa Password
              </h1>
              <p className="mt-2 text-sm text-km-ink/65 leading-relaxed">
                Masukkan email yang terdaftar. Kami akan mengirimkan link untuk
                mengatur ulang password Anda.
              </p>
            </div>

            {/* Message */}
            {message && (
              <div className="mt-5 rounded-2xl border border-km-line bg-km-surface-alt p-4 text-center">
                <p className="text-sm text-km-ink/80">{message}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-km-ink mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full rounded-2xl px-4 py-3 text-sm text-km-ink
                             ring-1 ring-km-line focus:outline-none
                             focus:ring-2 focus:ring-km-brass/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-km-wood ring-1 ring-km-wood px-4 py-3
                           text-sm font-semibold text-white hover:opacity-90 transition
                           shadow-soft disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Mengirim..." : "Kirim Link Reset"}
              </button>
            </form>

            {/* Back to sign in */}
            <div className="mt-6 text-center">
              <Link
                href="/signin"
                className="text-sm font-semibold text-km-brass hover:text-km-wood transition no-underline"
              >
                Kembali ke Sign In
              </Link>
            </div>

            {/* Helper text */}
            <p className="mt-5 text-xs text-center text-km-ink/45 leading-relaxed">
              Jika tidak menemukan email dari kami, periksa folder spam atau
              coba beberapa menit lagi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
