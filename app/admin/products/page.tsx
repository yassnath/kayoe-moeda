"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import FilterBar from "@/components/admin/FilterBar";
import DataTable from "@/components/admin/DataTable";
import Alert from "@/components/admin/Alert";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { formatCurrency, formatDate } from "@/components/admin/utils";
import { resolveImageSrc } from "@/lib/utils";

type ProdukItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  capacity: number;
  updatedAt: string;
};

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() || "/admin/products";
  const query = searchParams?.get("q")?.toLowerCase() ?? "";
  const sort = searchParams?.get("sort") ?? "updated";

  const [produks, setProduks] = useState<ProdukItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(query);

  useEffect(() => {
    const fetchProduks = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/admin/produks", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setError(data?.message || "Gagal mengambil data produk.");
          setProduks([]);
          return;
        }
        setProduks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat mengambil data produk.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduks();
  }, []);

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  const filteredProduks = useMemo(() => {
    let result = [...produks];
    if (query) {
      result = result.filter((p) =>
        `${p.name} ${p.description}`.toLowerCase().includes(query)
      );
    }

    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "stock") {
      result.sort((a, b) => a.capacity - b.capacity);
    } else {
      result.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
    return result;
  }, [produks, query, sort]);

  const paginatedProduks = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProduks.slice(start, start + pageSize);
  }, [filteredProduks, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [query, sort]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/produks/${id}/delete`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || "Gagal menghapus produk.");
        return;
      }
      setProduks((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat menghapus produk.");
    } finally {
      setConfirmId(null);
    }
  };

  const columns = [
    {
      key: "image",
      header: "Foto",
      render: (row: ProdukItem) => (
        <div className="relative h-12 w-16 overflow-hidden rounded-xl border border-km-line">
          <Image
            src={resolveImageSrc(row.image)}
            alt={row.name}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      key: "name",
      header: "Nama",
      render: (row: ProdukItem) => (
        <div>
          <div className="font-semibold text-km-ink">{row.name}</div>
          <div className="text-xs text-km-ink/50 line-clamp-1">
            {row.description}
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Harga",
      render: (row: ProdukItem) => (
        <div className="font-semibold text-km-ink">
          {formatCurrency(row.price)}
        </div>
      ),
    },
    {
      key: "capacity",
      header: "Stok",
      render: (row: ProdukItem) => (
        <div className="text-sm text-km-ink">{row.capacity}</div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: () => (
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
          Aktif
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (row: ProdukItem) => (
        <div className="text-xs text-km-ink/60">{formatDate(row.updatedAt)}</div>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row: ProdukItem) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/products/${row.id}/edit`}
            className="rounded-full px-3 py-1 text-xs font-semibold text-km-wood ring-1 ring-km-wood"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setConfirmId(row.id)}
            className="rounded-full px-3 py-1 text-xs font-semibold text-red-600 ring-1 ring-red-200"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produk"
        description="Kelola katalog produk Kayoe Moeda."
      />

      <FilterBar>
        <div className="grid flex-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs font-semibold text-km-ink/70">
            Search
            <input
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink focus:outline-none focus:ring-2 focus:ring-km-brass/60"
              placeholder="Cari nama produk"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                const params = new URLSearchParams(searchParams?.toString());
                if (e.target.value) params.set("q", e.target.value);
                else params.delete("q");
                router.replace(`${pathname}?${params.toString()}`);
              }}
            />
          </label>
          <label className="text-xs font-semibold text-km-ink/70">
            Sort
            <select
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
              value={sort}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams?.toString());
                params.set("sort", e.target.value);
                router.replace(`${pathname}?${params.toString()}`);
              }}
            >
              <option value="updated">Terbaru</option>
              <option value="price-asc">Harga terendah</option>
              <option value="price-desc">Harga tertinggi</option>
              <option value="stock">Stok terendah</option>
            </select>
          </label>
        </div>
      </FilterBar>

      <div className="flex justify-end">
        <Link
          href="/admin/products/new"
          className="rounded-full bg-km-wood px-4 py-2 text-xs font-semibold text-white ring-1 ring-km-wood no-underline hover:opacity-90"
        >
          Tambah Produk
        </Link>
      </div>

      {error && <Alert variant="error" title="Error" message={error} />}

      <DataTable
        columns={columns}
        data={paginatedProduks}
        loading={loading}
        pagination={{
          page,
          pageSize,
          total: filteredProduks.length,
          onPageChange: setPage,
        }}
        emptyState={
          <div className="flex flex-col items-center gap-3 text-center text-sm text-km-ink/60">
            <div>Belum ada produk. Tambahkan produk baru untuk mulai.</div>
            <Link
              href="/admin/products/new"
              className="rounded-full bg-km-wood px-4 py-2 text-xs font-semibold text-white ring-1 ring-km-wood no-underline"
            >
              Tambah Produk
            </Link>
          </div>
        }
      />

      <ConfirmDialog
        open={!!confirmId}
        title="Hapus produk?"
        description="Produk yang dihapus tidak bisa dikembalikan."
        confirmLabel="Hapus Produk"
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
