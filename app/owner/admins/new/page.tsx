"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";
import AdminForm from "@/components/owner/AdminForm";
import PasswordFields from "@/components/owner/PasswordFields";

export default function OwnerAdminCreatePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (values: {
    name: string;
    email: string;
    username: string;
    isActive: boolean;
  }) => {
    setError(null);
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Password dan konfirmasi tidak sama.");
      return;
    }

    const res = await fetch("/api/owner/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        role: "ADMIN",
        password,
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.message || "Gagal menambahkan admin.");
      return;
    }
    router.push("/owner/admins");
  };

  return (
    <div className="space-y-6">
      <OwnerPageHeader
        title="Tambah Admin"
        description="Buat akun admin baru untuk dashboard."
        breadcrumbs={[
          { label: "Kelola Admin", href: "/owner/admins" },
          { label: "Tambah Admin" },
        ]}
      />

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-soft">
          {error}
        </div>
      )}

      <AdminForm
        submitLabel="Simpan Admin"
        onSubmit={handleSubmit}
      />

      <div className="rounded-3xl border border-km-line bg-white p-6 shadow-soft">
        <h3 className="text-sm font-semibold text-km-ink">Password Admin</h3>
        <div className="mt-4">
          <PasswordFields
            password={password}
            confirm={confirm}
            onChangePassword={setPassword}
            onChangeConfirm={setConfirm}
          />
        </div>
      </div>
    </div>
  );
}
