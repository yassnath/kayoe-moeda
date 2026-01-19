"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";
import OwnerFilterBar from "@/components/owner/OwnerFilterBar";
import OwnerDataTable from "@/components/owner/OwnerDataTable";
import RoleBadge from "@/components/owner/RoleBadge";
import StatusBadge from "@/components/owner/StatusBadge";
import ConfirmDialog from "@/components/owner/ConfirmDialog";

type AdminRow = {
  id: string;
  name: string | null;
  email: string | null;
  username: string;
  role: "OWNER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
};

export default function OwnerAdminsPage() {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [confirmTarget, setConfirmTarget] = useState<AdminRow | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/owner/admins", { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setError(data?.message || "Gagal memuat admin.");
          return;
        }
        setAdmins(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat memuat admin.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = [...admins];
    if (term) {
      list = list.filter((row) => {
        const haystack = `${row.name ?? ""} ${row.email ?? ""} ${
          row.username ?? ""
        }`.toLowerCase();
        return haystack.includes(term);
      });
    }
    if (statusFilter !== "all") {
      list = list.filter((row) =>
        statusFilter === "active" ? row.isActive : !row.isActive
      );
    }
    return list;
  }, [admins, query, statusFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const handleToggle = async (row: AdminRow) => {
    setConfirmTarget(row);
  };

  const confirmToggle = async () => {
    if (!confirmTarget) return;
    try {
      const res = await fetch(`/api/owner/admins/${confirmTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !confirmTarget.isActive,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || "Gagal mengubah status.");
        return;
      }
      setAdmins((prev) =>
        prev.map((item) =>
          item.id === confirmTarget.id
            ? { ...item, isActive: !confirmTarget.isActive }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      setError("Gagal mengubah status.");
    } finally {
      setConfirmTarget(null);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Nama",
      render: (row: AdminRow) => (
        <div>
          <div className="font-semibold text-km-ink">
            {row.name || row.username}
          </div>
          <div className="text-xs text-km-ink/50">{row.email ?? "-"}</div>
        </div>
      ),
    },
    {
      key: "username",
      header: "Username",
      render: (row: AdminRow) => (
        <div className="text-sm text-km-ink">{row.username}</div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (row: AdminRow) => <RoleBadge role={row.role} />,
    },
    {
      key: "status",
      header: "Status",
      render: (row: AdminRow) => <StatusBadge active={row.isActive} />,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (row: AdminRow) => (
        <div className="text-xs text-km-ink/60">
          {new Date(row.createdAt).toLocaleDateString("id-ID")}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row: AdminRow) => (
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/owner/admins/${row.id}/edit`}
            className="rounded-full border border-km-line px-3 py-1 text-xs font-semibold text-km-ink no-underline"
          >
            Edit
          </Link>
          {row.role === "ADMIN" && (
            <button
              type="button"
              onClick={() => handleToggle(row)}
              className="rounded-full border border-km-line px-3 py-1 text-xs font-semibold text-km-ink"
            >
              {row.isActive ? "Nonaktifkan" : "Aktifkan"}
            </button>
          )}
          {row.role === "ADMIN" && (
            <Link
              href={`/owner/admins/${row.id}/edit#reset-password`}
              className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 no-underline"
            >
              Reset Password
            </Link>
          )}
        </div>
      ),
    },
  ];

  const totalActive = admins.filter((row) => row.isActive).length;
  const totalInactive = admins.filter((row) => !row.isActive).length;

  return (
    <div className="space-y-6">
      <OwnerPageHeader
        title="Kelola Admin"
        description="Kelola akun admin dan owner untuk dashboard."
        actions={
          <Link
            href="/owner/admins/new"
            className="rounded-full bg-km-wood px-4 py-2 text-xs font-semibold text-white ring-1 ring-km-wood no-underline hover:opacity-90"
          >
            Tambah Admin
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl border border-km-line bg-white p-4 shadow-soft">
          <div className="text-xs uppercase tracking-wide text-km-ink/50">
            Total aktif
          </div>
          <div className="mt-2 text-xl font-semibold text-km-ink">
            {totalActive}
          </div>
        </div>
        <div className="rounded-3xl border border-km-line bg-white p-4 shadow-soft">
          <div className="text-xs uppercase tracking-wide text-km-ink/50">
            Total nonaktif
          </div>
          <div className="mt-2 text-xl font-semibold text-km-ink">
            {totalInactive}
          </div>
        </div>
      </div>

      <OwnerFilterBar>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs font-semibold text-km-ink/70">
            Search
            <input
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
              placeholder="Cari nama/email/username"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label className="text-xs font-semibold text-km-ink/70">
            Status
            <select
              className="mt-2 w-full rounded-2xl border border-km-line px-3 py-2 text-sm text-km-ink"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </label>
        </div>
      </OwnerFilterBar>

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-soft">
          {error}
        </div>
      )}

      <OwnerDataTable
        columns={columns}
        data={paginated}
        loading={loading}
        pagination={{
          page,
          pageSize,
          total: filtered.length,
          onPageChange: setPage,
        }}
        emptyState={
          <div className="flex flex-col items-center gap-3 text-center text-sm text-km-ink/60">
            <div>Belum ada admin.</div>
            <Link
              href="/owner/admins/new"
              className="rounded-full bg-km-wood px-4 py-2 text-xs font-semibold text-white ring-1 ring-km-wood no-underline"
            >
              Tambah Admin
            </Link>
          </div>
        }
      />

      <ConfirmDialog
        open={!!confirmTarget}
        title={
          confirmTarget?.isActive ? "Nonaktifkan admin?" : "Aktifkan admin?"
        }
        description={
          confirmTarget?.isActive
            ? "Admin yang dinonaktifkan tidak bisa login."
            : "Admin akan aktif kembali."
        }
        confirmLabel={confirmTarget?.isActive ? "Nonaktifkan" : "Aktifkan"}
        onConfirm={confirmToggle}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
