// app/produk/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { resolveImageSrc } from "@/lib/utils";

type ProdukItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  capacity: number;
};

export default function ProdukPage() {
  const [produks, setProduks] = useState<ProdukItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Ambil daftar produk dari API
  useEffect(() => {
    const fetchProduks = async () => {
      try {
        setError(null);
        setInfo(null);
        setLoading(true);

        const res = await fetch("/api/admin/produks", {
          method: "GET",
          cache: "no-store",
        });

        let data: unknown = null;

        try {
          data = await res.json();
        } catch {
          console.error("Response GET /api/admin/produks bukan JSON valid");
          setError("Response server tidak valid.");
          return;
        }

        if (!res.ok) {
          const message =
            data &&
            typeof data === "object" &&
            data !== null &&
            "message" in data &&
            typeof (data as any).message === "string"
              ? (data as any).message
              : "Gagal mengambil data produk";

          setError(message);
          return;
        }

        if (!Array.isArray(data)) {
          setError("Format data produk tidak sesuai");
          return;
        }

        setProduks(data as ProdukItem[]);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil produk"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduks();
  }, []);

  // Tambah ke cart
  const handleAddToCart = async (produkId: string) => {
    try {
      setError(null);
      setInfo(null);
      setAddingId(produkId);

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produkId,
          quantity: 1,
        }),
      });

      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        console.error("Response /api/cart/add bukan JSON valid");
      }

      if (!res.ok) {
        const message =
          data &&
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof (data as any).message === "string"
            ? (data as any).message
            : "Gagal menambahkan ke keranjang";

        setError(message);
        return;
      }

      setInfo("Produk berhasil ditambahkan ke keranjang.");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menambahkan ke keranjang"
      );
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <section className="w-full py-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-white/55">
              Katalog
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Produk Kayoe Moeda
            </h1>
            <p className="mt-3 text-sm text-white/70">
              Temukan kursi, meja, dan perabotan kayu lainnya. Gunakan layanan
              custom untuk ukuran dan model yang lebih sesuai kebutuhan ruang.
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mt-6 border border-red-500/40 bg-red-500/10 p-4 text-red-100">
              <p className="text-sm font-semibold">Terjadi kesalahan</p>
              <p className="text-sm mt-1 text-red-100/90">{error}</p>
            </div>
          )}

          {info && (
            <div className="mt-6 border border-emerald-400/40 bg-emerald-400/10 p-4 text-emerald-100">
              <p className="text-sm font-semibold">Berhasil</p>
              <p className="text-sm mt-1 text-emerald-100/90">{info}</p>
            </div>
          )}

          {/* Content */}
          <div className="mt-10">
            {loading ? (
              <div className="border border-white/10 bg-white/5 p-6 text-white/70">
                <p className="text-sm">Memuat produk...</p>
              </div>
            ) : produks.length === 0 ? (
              <div className="border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-xs uppercase tracking-[0.32em] text-white/50">
                  Empty state
                </p>
                <h3 className="mt-3 text-lg md:text-xl font-semibold tracking-tight text-white">
                  Belum ada produk tersedia
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Silakan cek kembali nanti atau ajukan pesanan custom.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {produks.map((produk) => {
                  const imageSrc = resolveImageSrc(produk.image);

                  return (
                    <article
                      key={produk.id}
                      className="group relative min-h-[280px] overflow-hidden border border-white/10 bg-[#071a14]/60"
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={imageSrc}
                          alt={produk.name}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/80" />
                      </div>

                      <div className="relative z-10 flex h-full flex-col justify-end p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-base md:text-lg font-semibold text-white line-clamp-1">
                            {produk.name}
                          </h3>
                          <span className="shrink-0 rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
                            Stok {produk.capacity}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-white/70 line-clamp-2 leading-relaxed">
                          {produk.description}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-base md:text-lg font-semibold text-white">
                            Rp {produk.price.toLocaleString("id-ID")}
                          </p>
                          <p className="text-xs text-white/55">Ready stock</p>
                        </div>

                        <button
                          onClick={() => handleAddToCart(produk.id)}
                          disabled={addingId === produk.id}
                          className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold
                                     bg-km-brass text-km-wood ring-1 ring-white/20 hover:opacity-90 transition
                                     disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {addingId === produk.id
                            ? "Menambahkan..."
                            : "Tambah ke keranjang"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
