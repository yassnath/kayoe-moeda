// app/produk/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { resolveImageSrc } from "@/lib/utils";

type ProdukItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  capacity: number;
};

const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "kursi", label: "Kursi" },
  { id: "meja", label: "Meja" },
  { id: "lemari", label: "Lemari" },
  { id: "rak", label: "Rak" },
];

const SORTS = [
  { id: "default", label: "Urutan default" },
  { id: "price-asc", label: "Harga terendah" },
  { id: "price-desc", label: "Harga tertinggi" },
];

const categoryKeywords: Record<string, string[]> = {
  kursi: ["kursi", "chair", "sofa"],
  meja: ["meja", "table"],
  lemari: ["lemari", "wardrobe", "cabinet"],
  rak: ["rak", "shelf"],
};

export default function ProdukPage() {
  const [produks, setProduks] = useState<ProdukItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WA ?? "";

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [view, setView] = useState<"grid" | "list">("grid");

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

  const filteredProduks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let result = [...produks];

    if (normalizedQuery) {
      result = result.filter((p) => {
        const haystack = `${p.name} ${p.description}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    }

    if (category !== "all") {
      const keys = categoryKeywords[category] || [];
      result = result.filter((p) => {
        const haystack = `${p.name} ${p.description}`.toLowerCase();
        return keys.some((k) => haystack.includes(k));
      });
    }

    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [produks, query, category, sort]);

  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      <section className="w-full py-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
              Katalog
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-km-ink">
              Produk Kayoe Moeda
            </h1>
            <p className="mt-3 text-sm text-km-ink/70 max-w-2xl">
              Temukan kursi, meja, dan perabotan kayu lainnya. Gunakan layanan
              custom untuk ukuran dan model yang lebih sesuai kebutuhan ruang.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-km-line bg-white p-4 shadow-soft">
            <div className="grid gap-4 md:grid-cols-[1.5fr,1fr,1fr,auto] md:items-end">
              <div>
                <label className="text-xs font-semibold text-km-ink/70">
                  Search Produk
                </label>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari nama produk"
                  className="mt-2 w-full rounded-2xl border border-km-line px-4 py-3 text-sm
                             text-km-ink placeholder:text-km-ink/45 focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-km-ink/70">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-km-line bg-white px-4 py-3 text-sm
                             text-km-ink focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                >
                  {CATEGORIES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-km-ink/70">
                  Sort
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-km-line bg-white px-4 py-3 text-sm
                             text-km-ink focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                >
                  {SORTS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-pressed={view === "grid"}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ring-1 transition ${
                    view === "grid"
                      ? "bg-km-wood text-white ring-km-wood"
                      : "bg-white text-km-ink ring-km-line"
                  }`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-pressed={view === "list"}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ring-1 transition ${
                    view === "list"
                      ? "bg-km-wood text-white ring-km-wood"
                      : "bg-white text-km-ink ring-km-line"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-soft">
              <p className="text-sm font-semibold">Terjadi kesalahan</p>
              <p className="text-sm mt-1 text-red-700/90">{error}</p>
            </div>
          )}

          {info && (
            <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 shadow-soft">
              <p className="text-sm font-semibold">Berhasil</p>
              <p className="text-sm mt-1 text-emerald-700/90">{info}</p>
            </div>
          )}

          {/* Content */}
          <div className="mt-8">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: view === "grid" ? 6 : 4 }).map((_, idx) => (
                  <div
                    key={`loading-${idx}`}
                    className="rounded-3xl border border-km-line bg-white p-4 shadow-soft animate-pulse"
                  >
                    <div className="h-36 rounded-2xl bg-km-surface-alt" />
                    <div className="mt-4 h-4 w-3/4 rounded-full bg-km-surface-alt" />
                    <div className="mt-2 h-3 w-1/2 rounded-full bg-km-surface-alt" />
                  </div>
                ))}
              </div>
            ) : filteredProduks.length === 0 ? (
              <div className="rounded-3xl border border-km-line bg-white p-8 text-center shadow-soft">
                <p className="text-xs uppercase tracking-[0.32em] text-km-ink/40">
                  Empty state
                </p>
                <h3 className="mt-3 text-lg md:text-xl font-semibold tracking-tight text-km-ink">
                  Produk tidak ditemukan
                </h3>
                <p className="mt-2 text-sm text-km-ink/70 max-w-md mx-auto">
                  Coba ubah pencarian atau gunakan layanan custom untuk kebutuhan
                  khusus.
                </p>
                <Link
                  href="/custom-order"
                  className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                             bg-km-wood text-white ring-1 ring-km-wood hover:opacity-90 transition no-underline"
                >
                  Ajukan Custom Order
                </Link>
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    : "space-y-4"
                }
              >
                {filteredProduks.map((produk) => {
                  const imageSrc = resolveImageSrc(produk.image);
                  const waMessage = encodeURIComponent(
                    `Halo Kayoe Moeda, saya tertarik dengan produk ${produk.name}.`
                  );
                  const waNumber = adminWa
                    ? adminWa.replace(/[^\d]/g, "").replace(/^0/, "62")
                    : "";

                  return (
                    <article
                      key={produk.id}
                      className={`rounded-3xl border border-km-line bg-white shadow-soft overflow-hidden ${
                        view === "list" ? "flex flex-col md:flex-row" : ""
                      }`}
                    >
                      <Link
                        href={`/produk/${produk.id}`}
                        className={`block ${
                          view === "list" ? "md:flex md:w-full" : ""
                        }`}
                      >
                        <div
                          className={`relative ${
                            view === "list"
                              ? "h-48 md:h-auto md:w-64"
                              : "h-44 w-full"
                          }`}
                        >
                          <Image
                            src={imageSrc}
                            alt={produk.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>

                        <div className="flex-1 p-5 flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-lg font-semibold text-km-ink">
                              {produk.name}
                            </h3>
                            <span className="shrink-0 rounded-full border border-km-line bg-km-surface-alt px-3 py-1 text-xs text-km-ink/70">
                              Stok {produk.capacity}
                            </span>
                          </div>

                          <p className="text-sm text-km-ink/70 line-clamp-3 leading-relaxed">
                            {produk.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <p className="text-base font-semibold text-km-ink">
                              Rp {produk.price.toLocaleString("id-ID")}
                            </p>
                            <p className="text-xs text-km-ink/50">Ready stock</p>
                          </div>
                        </div>
                      </Link>

                      <div className="flex flex-wrap gap-2 px-5 pb-5 pt-2">
                        <Link
                          href={`/checkout?produkId=${produk.id}`}
                          className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold
                                     bg-km-wood text-white ring-1 ring-km-wood hover:opacity-90 transition no-underline"
                        >
                          Pesan sekarang
                        </Link>
                        {waNumber ? (
                          <a
                            href={`https://wa.me/${waNumber}?text=${waMessage}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold
                                       bg-km-brass text-white ring-1 ring-km-brass hover:opacity-90 transition"
                          >
                            WhatsApp
                          </a>
                        ) : (
                          <span
                            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold
                                       bg-km-surface-alt text-km-ink/60 ring-1 ring-km-line"
                            title="Nomor WhatsApp admin belum diatur"
                          >
                            WhatsApp
                          </span>
                        )}
                        <button
                          onClick={() => handleAddToCart(produk.id)}
                          disabled={addingId === produk.id}
                          className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold
                                     bg-white text-km-ink ring-1 ring-km-line hover:bg-km-surface-alt transition
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
