// app/signup/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          username,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registrasi gagal");
      } else {
        setSuccess("Registrasi berhasil. Mengalihkan ke halaman login...");
        setTimeout(() => {
          router.push("/signin");
        }, 1500);
      }
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left copy */}
          <div className="hidden lg:flex flex-col justify-between rounded-3xl border border-km-line bg-km-surface-alt p-8 shadow-soft">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
                Kayoe Moeda
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-km-ink leading-[1.1]">
                Buat akun Anda.
              </h1>
              <p className="mt-4 text-km-ink/70 max-w-md leading-relaxed">
                Buat akun baru sebagai Customer untuk mulai belanja, checkout,
                dan melihat riwayat pesanan di Kayoe Moeda.
              </p>
            </div>

            <div className="rounded-2xl border border-km-line bg-white p-5">
              <p className="text-sm font-semibold text-km-ink">Aman & rapi</p>
              <p className="mt-1 text-sm text-km-ink/70">
                Data kamu akan digunakan untuk pengiriman dan update transaksi.
              </p>
            </div>
          </div>

          {/* Form card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-lg rounded-3xl border border-km-line bg-white shadow-soft p-7 md:p-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
                  Sign Up
                </p>
                <h2 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-km-ink">
                  Buat Akun Customer Kayoe Moeda
                </h2>
                <p className="mt-2 text-sm text-km-ink/65">
                  Isi data berikut untuk registrasi.
                </p>
              </div>

              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                  <p className="text-sm font-semibold">Registrasi gagal</p>
                  <p className="text-sm mt-1 text-red-700/90">{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                  <p className="text-sm font-semibold">Berhasil</p>
                  <p className="text-sm mt-1 text-emerald-700/90">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-km-ink mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl px-4 py-3 text-sm text-km-ink
                               ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Nama lengkap"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-km-ink mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl px-4 py-3 text-sm text-km-ink
                               ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="username"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-km-ink mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-2xl px-4 py-3 text-sm text-km-ink
                               ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="email@example.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-km-ink mb-1">
                    No. Telepon
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-2xl px-4 py-3 text-sm text-km-ink
                               ring-1 ring-km-line focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="08xxxxxxxxxx"
                    autoComplete="tel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-km-ink mb-1">
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
                      placeholder="Masukkan password"
                      autoComplete="new-password"
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
                  <p className="mt-2 text-xs text-km-ink/50">
                    Gunakan password yang mudah diingat tapi aman.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-km-brass ring-1 ring-km-brass px-4 py-3 text-sm font-semibold
                             text-km-wood hover:opacity-90 transition shadow-soft disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Memproses..." : "Buat Akun"}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-km-ink/65">
                Sudah punya akun?{" "}
                <Link
                  href="/signin"
                  className="font-semibold text-km-brass hover:text-km-wood transition no-underline"
                >
                  Masuk
                </Link>
              </p>

              <p className="mt-5 text-xs text-center text-km-ink/50 leading-relaxed">
                Dengan mendaftar, kamu menyetujui kebijakan dan proses layanan Kayoe Moeda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
