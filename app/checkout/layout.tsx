import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/signin?callbackUrl=/checkout");
  }

  return <>{children}</>;
}
