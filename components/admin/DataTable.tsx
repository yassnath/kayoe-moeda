import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  emptyState?: ReactNode;
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
};

export default function DataTable<T>({
  columns,
  data,
  emptyState,
  loading,
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="rounded-3xl border border-km-line bg-white shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-km-surface-alt">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-km-ink/60 ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`loading-${idx}`} className="border-t border-km-line">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <div className="h-4 w-24 rounded-full bg-km-surface-alt" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8">
                  {emptyState ?? (
                    <div className="text-center text-sm text-km-ink/60">
                      Tidak ada data.
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="border-t border-km-line">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4 text-km-ink">
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-km-line px-4 py-3 text-xs text-km-ink/60">
          <span>
            Page {pagination.page} dari{" "}
            {Math.max(1, Math.ceil(pagination.total / pagination.pageSize))}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-km-line disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={
                pagination.page >=
                Math.ceil(pagination.total / pagination.pageSize)
              }
              className="rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-km-line disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

