import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ReportsClient from "./ReportsClient";

export default async function AdminReportsPage() {
  const session = await auth();
  const role = (session?.user as any)?.role as
    | "ADMIN"
    | "OWNER"
    | "CUSTOMER"
    | undefined;

  if (!session || (role !== "ADMIN" && role !== "OWNER")) {
    redirect("/admin");
  }

  return <ReportsClient />;
}
