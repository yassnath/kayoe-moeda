import type { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HistoryOrderLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/signin?callbackUrl=/history-order");
  }

  return <>{children}</>;
}
