"use client";

import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

type OwnerDataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: ReactNode;
  pagination?: Pagination;
};

export default function OwnerDataTable<T>({
  columns,
  data,
  loading,
  emptyState,
  pagination,
}: OwnerDataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-3xl border border-km-line bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-km-surface-alt text-xs uppercase tracking-wide text-km-ink/60">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-km-ink/60"
                  colSpan={columns.length}
                >
                  Memuat data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td className="px-4 py-6" colSpan={columns.length}>
                  {emptyState || (
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
                    <td key={col.key} className="px-4 py-3 align-top">
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.total > pagination.pageSize && (
        <div className="flex items-center justify-between border-t border-km-line px-4 py-3 text-xs text-km-ink/60">
          <span>
            Page {pagination.page} dari{" "}
            {Math.ceil(pagination.total / pagination.pageSize)}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="rounded-full border border-km-line px-3 py-1 disabled:opacity-50"
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
              className="rounded-full border border-km-line px-3 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
