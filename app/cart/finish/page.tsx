import Link from "next/link";

export default function FinishPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      <div className="pt-24 px-4 max-w-xl mx-auto">
        <div className="rounded-3xl border border-km-line bg-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
            Checkout
          </p>
          <h1 className="mt-2 text-xl font-semibold text-km-ink">
            Checkout selesai
          </h1>
          <p className="text-sm text-km-ink/70 mt-2">
            Order ID:{" "}
            <span className="font-mono text-km-ink">
              {searchParams.orderId || "-"}
            </span>
          </p>
          <p className="text-sm text-km-ink/70 mt-2">
            Status akan berubah otomatis setelah Midtrans mengirim notification.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/cart"
              className="text-sm font-semibold text-km-ink hover:opacity-80 transition"
            >
              Lihat cart
            </Link>
            <Link
              href="/produk"
              className="text-sm font-semibold text-km-ink hover:opacity-80 transition"
            >
              Belanja lagi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
