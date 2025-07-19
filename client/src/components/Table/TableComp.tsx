import React from "react";
import { Pagination } from "./Pagination";

export interface Column<T> {
  label: string;
  key: keyof T;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSortChange?: (key: keyof T, direction: "asc" | "desc") => void;
  sortKey?: keyof T;
  sortDirection?: "asc" | "desc";
  onSearchChange?: (query: string) => void;
  emptyMessage?: string;
}

export function Table<T extends object>({
  data,
  columns,
  page,
  totalPages,
  onPageChange,
  onSortChange,
  sortKey,
  sortDirection,
  onSearchChange,
  emptyMessage = "No records found.",
}: TableProps<T>) {
  return (
    <div className="space-y-6">
      {onSearchChange && (
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 bg-blue-50 text-blue-800 placeholder-blue-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      )}

      <div className="w-full overflow-x-auto rounded-xl border border-blue-100 shadow-sm bg-blue-50">
        <table className="w-full text-sm text-left text-blue-900">
          <thead className="bg-blue-100 text-xs uppercase tracking-wider text-blue-600">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={String(col.key.toString() + idx)}
                  onClick={() => {
                    if (onSortChange) {
                      const newDirection =
                        sortKey === col.key && sortDirection === "asc"
                          ? "desc"
                          : "asc";
                      onSortChange(col.key, newDirection);
                    }
                  }}
                  className="px-6 py-4 cursor-pointer select-none hover:text-blue-700 transition-colors"
                >
                  <div className="flex items-center">
                    {col.label}
                    {sortKey === col.key && (
                      <span className="ml-1 text-base">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-blue-100/50 transition-colors"
                >
                  {columns.map((col, colIndex) => {
                    const value = row[col.key];
                    return (
                      <td
                        key={String(col.key) + colIndex}
                        className="px-6 py-4"
                      >
                        {col.render
                          ? col.render(value, row)
                          : String(value ?? "")}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-6 text-center text-blue-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {
        <div className="flex justify-end">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      }
    </div>
  );
}
