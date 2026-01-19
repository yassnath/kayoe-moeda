"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";
import AdminForm from "@/components/owner/AdminForm";
import PasswordFields from "@/components/owner/PasswordFields";
import ConfirmDialog from "@/components/owner/ConfirmDialog";

type AdminDetail = {
  id: string;
  name: string | null;
  email: string | null;
  username: string;
  role: "OWNER" | "ADMIN";
  isActive: boolean;
};

export default function OwnerAdminEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [admin, setAdmin] = useState<AdminDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/owner/admins/${id}`, {
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setError(data?.message || "Admin tidak ditemukan.");
          return;
        }
        setAdmin(data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat admin.");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  const handleUpdate = async (values: {
    name: string;
    email: string;
    username: string;
    isActive: boolean;
  }) => {
    setError(null);
    const res = await fetch(`/api/owner/admins/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.message || "Gagal memperbarui admin.");
      return;
    }
    router.push("/owner/admins");
  };

  const handleReset = async () => {
    setError(null);
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Password dan konfirmasi tidak sama.");
      return;
    }
    const res = await fetch(`/api/owner/admins/${id}/password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.message || "Gagal reset password.");
      return;
    }
    setPassword("");
    setConfirm("");
    setConfirmOpen(false);
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-km-line bg-white p-6 shadow-soft">
        <p className="text-sm text-km-ink/60">Memuat admin...</p>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-soft">
        {error || "Admin tidak ditemukan."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OwnerPageHeader
        title="Edit Admin"
        description="Perbarui data admin dan status akun."
        breadcrumbs={[
          { label: "Kelola Admin", href: "/owner/admins" },
          { label: "Edit Admin" },
        ]}
      />

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-soft">
          {error}
        </div>
      )}

      <AdminForm
        initialValues={{
          name: admin.name ?? "",
          email: admin.email ?? "",
          username: admin.username,
          isActive: admin.isActive,
        }}
        submitLabel="Simpan Perubahan"
        disableStatus={admin.role === "OWNER"}
        readOnlyIdentity
        onSubmit={handleUpdate}
      />

      {admin.role === "ADMIN" && (
        <div
          id="reset-password"
          className="rounded-3xl border border-km-line bg-white p-6 shadow-soft"
        >
          <h3 className="text-sm font-semibold text-km-ink">
            Reset Password
          </h3>
          <div className="mt-4">
            <PasswordFields
              password={password}
              confirm={confirm}
              onChangePassword={setPassword}
              onChangeConfirm={setConfirm}
            />
          </div>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="mt-4 rounded-full bg-km-wood px-4 py-2 text-xs font-semibold text-white ring-1 ring-km-wood hover:opacity-90"
          >
            Simpan Password
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Reset password admin?"
        description="Pastikan password baru sudah benar."
        confirmLabel="Reset"
        onConfirm={handleReset}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
