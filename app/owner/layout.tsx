import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
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

  return <>{children}</>;
}
