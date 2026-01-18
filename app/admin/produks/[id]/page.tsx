import { redirect } from "next/navigation";

export default function AdminProdukLegacyRedirect({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/admin/products/${params.id}/edit`);
}

