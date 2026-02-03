import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { MdOutlineArrowDownward, MdOutlineArrowUpward } from "react-icons/md";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

type SortDirection = "ascending" | "descending";

interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface Column<T> {
  header: React.ReactNode;
  accessor: keyof T | string;
  width?: string;
  sortable?: boolean;
  headerClassName?: string;
  renderCell?: (row: T) => React.ReactNode;
}

import PaginationControls, { Pagination } from "./PaginationControl";

interface ReusableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortConfig?: SortConfig | null;
  requestSort?: (accessor: string) => void;
  emptyStateComponent?: React.ReactNode;

  // Optional pagination props — if provided, the table will render pagination controls
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

/**
 * A table component that remains in a tabular layout on all screen sizes,
 * becoming horizontally scrollable on smaller viewports if the content exceeds the available width.
 */
const ReusableTable = <T extends Record<string, any>>({
  columns,
  data,
  sortConfig,
  requestSort,
  emptyStateComponent,
  pagination,
  onPageChange,
  loading = false,
}: ReusableTableProps<T>) => {
  const [expandedRows, setExpandedRows] = useState<
    Record<string | number, boolean>
  >({});

  const toggleRow = (rowId: string | number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const getSortIcon = (accessor: string) => {
    if (!sortConfig || sortConfig.key !== accessor) {
      return (
        <div className="flex flex-col items-center">
          <IoMdArrowDropup className="ml-1 -mb-2 opacity-30" />
          <IoMdArrowDropdown className="ml-1 opacity-30" />
        </div>
      );
    }
    return sortConfig.direction === "ascending" ? (
      <MdOutlineArrowUpward className="ml-1" />
    ) : (
      <MdOutlineArrowDownward className="ml-1" />
    );
  };

  return (
    <div className="w-full">
      {/* Desktop / large: regular table with horizontal scrolling */}
      <div className="hidden lg:block overflow-x-auto border border-gray-200 dark:border-border-dark rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-100/60 dark:bg-[#1C1C1C]">
            <tr>
              {columns.map((col: Column<T>) => (
                <th
                  key={String(col.accessor)}
                  scope="col"
                  className="p-3 text-left text-md font-bold text-gray-600 dark:text-gray-400"
                  style={{ width: col.width || "auto" }}
                >
                  {col.sortable ? (
                    <button
                      onClick={() =>
                        requestSort && requestSort(String(col.accessor))
                      }
                      className="flex items-center cursor-pointer"
                    >
                      {col.header}
                      {getSortIcon(String(col.accessor))}
                    </button>
                  ) : (
                    <div className={`${col.headerClassName || ""}`}>
                      {col.header}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-border-dark">
            {data && data.length > 0 ? (
              data.map((row: T, rowIndex: number) => (
                <tr
                  key={(row as any)._id || rowIndex}
                  className="dark:hover:bg-gray-800/40 hover:bg-gray-50 transition-colors duration-200"
                >
                  {columns.map((col: Column<T>) => (
                    <td
                      key={String(col.accessor)}
                      className="p-3 text-md font-medium text-gray-800 dark:text-gray-200"
                    >
                      {col.renderCell
                        ? col.renderCell(row)
                        : (row as any)[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>{emptyStateComponent}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet: stacked cards for each row */}
      <div className="block lg:hidden">
        {data && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((row: T, rowIndex: number) => {
              // Show first 2 non-action columns, rest are collapsible
              const nonActionCols = columns.filter(
                (col) => col.header !== "Actions"
              );
              const mainCols = nonActionCols.slice(0, 2);
              const detailCols = nonActionCols.slice(2);
              const rowId = (row as any)._id || rowIndex;
              const isOpen = expandedRows[rowId] || false;

              return (
                <div
                  key={rowId}
                  className="p-3 border border-gray-200 dark:border-border-dark rounded-xl bg-white dark:bg-[#0b0b0b] shadow-sm"
                >
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 items-center">
                    {mainCols.map((col: Column<T>) => (
                      <React.Fragment key={String(col.accessor)}>
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">
                          {col.header}
                        </div>
                        <div className="text-xs font-medium text-gray-800 dark:text-gray-200 wrap-break-word">
                          {col.renderCell
                            ? col.renderCell(row)
                            : (row as any)[col.accessor]}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  {isOpen && detailCols.length > 0 && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 items-center mt-1">
                      {detailCols.map((col: Column<T>) => (
                        <React.Fragment key={String(col.accessor)}>
                          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">
                            {col.header}
                          </div>
                          <div className="text-xs font-medium text-gray-800 dark:text-gray-200 wrap-break-word">
                            {col.renderCell
                              ? col.renderCell(row)
                              : (row as any)[col.accessor]}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                  {detailCols.length > 0 && (
                    <button
                      className="w-full flex items-center justify-end text-xs text-gray-500 dark:text-gray-400 py-1 mt-1 mb-1"
                      onClick={() => toggleRow(rowId)}
                      aria-expanded={isOpen}
                    >
                      {isOpen ? (
                        <FiChevronUp className="mr-1" />
                      ) : (
                        <FiChevronDown className="mr-1" />
                      )}
                      {isOpen ? "Hide" : "Show More"}
                    </button>
                  )}
                  {/* Actions row, always at bottom, full width */}
                  {columns.some((col) => col.header === "Actions") && (
                    <div className="pt-2 mt-2 border-t border-gray-100 dark:border-border-dark flex items-center justify-end">
                      {columns.map((col) =>
                        col.header === "Actions" ? (
                          <div
                            key={String(col.accessor)}
                            className="flex items-center gap-2"
                          >
                            {col.renderCell
                              ? col.renderCell(row)
                              : (row as any)[col.accessor]}
                          </div>
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4">{emptyStateComponent}</div>
        )}
      </div>

      {/* Optional pagination controls */}
      {pagination && onPageChange && (
        <div className="mt-4">
          <PaginationControls
            pagination={pagination!}
            onPageChange={onPageChange!}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default ReusableTable;
