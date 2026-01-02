import Link from "next/link";

export default function FinishPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  return (
    <div className="min-h-screen bg-km-sand">
      <div className="pt-24 px-4 max-w-xl mx-auto">
        <div className="bg-white border rounded-lg p-6">
          <h1 className="text-xl font-semibold">Checkout selesai</h1>
          <p className="text-sm text-gray-600 mt-2">
            Order ID: <span className="font-mono">{searchParams.orderId || "-"}</span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Status akan berubah otomatis setelah Midtrans mengirim notification.
          </p>

          <div className="mt-4 flex gap-3">
            <Link href="/cart" className="text-sm underline">
              Lihat cart
            </Link>
            <Link href="/produk" className="text-sm underline">
              Belanja lagi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
