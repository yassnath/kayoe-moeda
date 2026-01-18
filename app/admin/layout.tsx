// app/admin/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminShell from "@/components/admin/AdminShell";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // ? Wajib login
  if (!session) {
    redirect("/signin?callbackUrl=/admin");
  }

  // ? Role guard
  const role = (session.user as any)?.role as
    | "ADMIN"
    | "OWNER"
    | "CUSTOMER"
    | undefined;

  // Jika bukan admin, redirect ke signin
  if (role !== "ADMIN" && role !== "OWNER") {
    redirect("/signin");
  }

  return (
    <AdminShell>
      <AdminTopbar name={session.user?.name} role={role ?? "ADMIN"} />
      <main className="mt-6 space-y-6">{children}</main>
    </AdminShell>
  );
}
