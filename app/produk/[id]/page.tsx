import { redirect } from "next/navigation";

interface ProdukDetailProps {
  params: { id: string };
}

export default function ProdukDetailRedirect({ params }: ProdukDetailProps) {
  redirect(`/detail-produk/${params.id}`);
}
