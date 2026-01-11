"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
        callbackUrl,
      });

      if (res?.error) {
        const message =
          res.error === "CredentialsSignin"
            ? "Username/email atau password salah"
            : res.error === "Configuration"
            ? "Konfigurasi login belum lengkap. Hubungi admin."
            : res.error;
        setError(message || "Login gagal");
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
    <div className="min-h-screen bg-[var(--km-bg)]">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: branding */}
          <div className="hidden lg:flex flex-col justify-between rounded-3xl border border-km-line bg-km-surface-alt p-8 shadow-soft">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
                Kayoe Moeda
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-km-ink leading-[1.1]">
                Selamat datang kembali.
              </h1>
              <p className="mt-4 text-km-ink/70 max-w-md leading-relaxed">
                Masuk untuk mengakses katalog produk, custom order, dan riwayat
                transaksi Kayoe Moeda.
              </p>
            </div>

            <div className="rounded-2xl border border-km-line bg-white p-5">
              <p className="text-sm font-semibold text-km-ink">Catatan</p>
              <p className="mt-1 text-sm text-km-ink/70">
                Customer, Admin, dan Owner akan diarahkan sesuai perannya setelah login.
              </p>
            </div>
          </div>

          {/* Right: form card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-lg rounded-3xl border border-km-line bg-white shadow-soft p-7 md:p-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
                  Sign In
                </p>
                <h2 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-km-ink">
                  Sign In Kayoe Moeda
                </h2>
                <p className="mt-2 text-sm text-km-ink/65 max-w-sm mx-auto">
                  Masukkan username/email dan password untuk melanjutkan.
                </p>
              </div>

              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                  <p className="text-sm font-semibold">Login gagal</p>
                  <p className="text-sm mt-1 text-red-700/90">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-km-ink">
                    Username / Email
                  </label>
                  <input
                    type="text"
                    placeholder="username atau email"
                    className="rounded-2xl px-4 py-3 text-sm text-km-ink
                               ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-km-ink">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full rounded-2xl px-4 py-3 pr-12 text-sm text-km-ink
                                 ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-km-ink/60 hover:text-km-ink transition"
                      aria-label={
                        showPassword ? "Sembunyikan password" : "Lihat password"
                      }
                    >
                      {showPassword ? (
                        <IoEyeOffOutline className="h-5 w-5" />
                      ) : (
                        <IoEyeOutline className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-km-ink hover:opacity-80 transition"
                  >
                    Lupa password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-km-wood ring-1 ring-km-wood px-4 py-3 text-sm font-semibold
                             text-white hover:opacity-90 transition shadow-soft disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Memproses..." : "Masuk"}
                </button>
              </form>

              <div className="mt-5 text-center text-sm text-km-ink/65">
                Belum punya akun?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-km-ink hover:opacity-80 transition no-underline"
                >
                  Daftar
                </Link>
              </div>

              <p className="mt-5 text-xs text-center text-km-ink/50 leading-relaxed">
                Dengan masuk, Anda setuju dengan kebijakan dan proses autentikasi Kayoe Moeda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
