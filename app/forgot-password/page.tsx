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
    <div className="min-h-screen bg-km-sand">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-10">
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white ring-1 ring-black/5 shadow-md p-7 md:p-8">
            {/* Header */}
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.32em] text-black/45">
                Pemulihan Akun
              </p>
              <h1 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-[#111827]">
                Lupa Password
              </h1>
              <p className="mt-2 text-sm text-[#111827]/65 leading-relaxed">
                Masukkan email yang terdaftar. Kami akan mengirimkan link untuk
                mengatur ulang password Anda.
              </p>
            </div>

            {/* Message */}
            {message && (
              <div className="mt-5 rounded-2xl bg-white ring-1 ring-black/10 p-4 text-center">
                <p className="text-sm text-[#111827]/80">{message}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full rounded-2xl px-4 py-3 text-sm text-[#111827]
                             ring-1 ring-black/10 focus:outline-none
                             focus:ring-2 focus:ring-km-caramel/70"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-km-clay ring-1 ring-km-line px-4 py-3
                           text-sm font-semibold hover:bg-km-cream transition
                           shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Mengirim..." : "Kirim Link Reset"}
              </button>
            </form>

            {/* Back to sign in */}
            <div className="mt-6 text-center">
              <Link
                href="/signin"
                className="text-sm font-semibold text-km-ink hover:opacity-80 transition no-underline"
              >
                ← Kembali ke Sign In
              </Link>
            </div>

            {/* Helper text */}
            <p className="mt-5 text-xs text-center text-[#111827]/45 leading-relaxed">
              Jika tidak menemukan email dari kami, periksa folder spam atau
              coba beberapa menit lagi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
