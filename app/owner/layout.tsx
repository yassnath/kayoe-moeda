import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import OwnerShell from "@/components/owner/OwnerShell";
import { prisma } from "@/lib/prisma";

export default async function OwnerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/signin?callbackUrl=/owner");
  }

  const role = (session.user as any)?.role;

  if (role !== "OWNER") {
    if (role === "ADMIN") redirect("/admin");
    redirect("/");
  }

  const userId = (session.user as any)?.id as string | undefined;
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;

  if (!user || user.isActive === false) {
    redirect("/signin");
  }

  return <OwnerShell>{children}</OwnerShell>;
}
