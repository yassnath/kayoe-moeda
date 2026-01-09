import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CartCheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/signin?callbackUrl=/cart/checkout");
  }

  return <>{children}</>;
}
