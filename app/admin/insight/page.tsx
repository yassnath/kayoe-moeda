import { redirect } from "next/navigation";
import { auth } from "@/auth";
import InsightClient from "./InsightClient";

export default async function AdminInsightPage() {
  const session = await auth();
  const role = (session?.user as any)?.role as
    | "ADMIN"
    | "OWNER"
    | "CUSTOMER"
    | undefined;

  if (!session || role !== "OWNER") {
    redirect("/admin");
  }

  return <InsightClient />;
}
