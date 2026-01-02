"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // kalau ada ?callbackUrl= pakai itu, kalau tidak → /admin
      const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error || "Login gagal");
        return;
      }

      const targetUrl = res?.url ?? callbackUrl;
      router.push(targetUrl);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-km-sand">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: brand copy */}
          <div className="hidden lg:block">
            <p className="text-xs uppercase tracking-[0.32em] text-black/45">
              Kayoe Moeda
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#111827] leading-[1.1]">
              Selamat datang kembali.
            </h1>
            <p className="mt-4 text-[#111827]/70 max-w-md leading-relaxed">
              Masuk untuk mengakses katalog produk, custom order, dan riwayat transaksi Kayoe Moeda.
            </p>

            <div className="mt-6 rounded-2xl bg-white ring-1 ring-black/5 p-5 shadow-md max-w-md">
                <p className="text-sm font-semibold text-[#111827]">Catatan</p>
              <p className="mt-1 text-sm text-[#111827]/70">
                Customer, Admin, dan Owner akan diarahkan sesuai perannya setelah login.
              </p>
            </div>
          </div>

          {/* Right: form card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-lg rounded-2xl bg-white ring-1 ring-black/5 shadow-md p-7 md:p-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.32em] text-black/45">
                  Sign In
                </p>
                <h2 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-[#111827]">
                  Sign In Kayoe Moeda
                </h2>
                <p className="mt-2 text-sm text-[#111827]/65">
                  Masukkan username dan password untuk melanjutkan.
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-5 rounded-2xl bg-white ring-1 ring-red-500/20 p-4 text-red-700">
                  <p className="text-sm font-semibold">Login gagal</p>
                  <p className="text-sm mt-1 text-red-700/90">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Username */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[#111827]">
                    Username
                  </label>
                  <input
                    type="text"
                    className="rounded-2xl px-4 py-3 text-sm text-[#111827]
                               ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-km-caramel/70"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[#111827]">
                    Password
                  </label>
                  <input
                    type="password"
                    className="rounded-2xl px-4 py-3 text-sm text-[#111827]
                               ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-km-caramel/70"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                {/* Forgot password link */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-km-forest hover:opacity-80 transition"
                  >
                    Lupa password?
                  </Link>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-km-clay ring-1 ring-km-line px-4 py-3 text-sm font-semibold
                             hover:bg-km-cream transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Memproses..." : "Masuk"}
                </button>
              </form>

              {/* Sign Up link */}
              <div className="mt-5 text-center text-sm text-[#111827]/65">
                Belum punya akun?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-km-ink hover:opacity-80 transition no-underline"
                >
                  Daftar
                </Link>
              </div>

              <p className="mt-5 text-xs text-center text-[#111827]/45 leading-relaxed">
                Dengan masuk, Anda setuju dengan kebijakan dan proses autentikasi Kayoe Moeda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
