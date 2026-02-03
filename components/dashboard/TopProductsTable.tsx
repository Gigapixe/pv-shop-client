"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { MdOutlineArrowDownward, MdOutlineArrowUpward } from "react-icons/md";
import { DateRange } from "../ui/DateRangeFilter";
import { useAuthStore } from "@/zustand/authStore";
import { getTopProducts } from "@/services/orderService";
import { useTranslations } from "next-intl";

type SortDirection = "ascending" | "descending";
type SortConfig = { key: string; direction: SortDirection } | null;

type ProductRow = {
  _id: number | string;
  name: string;
  image?: string[];
  price: number;
  quantity: number;
  isSkeleton?: boolean;
};

type ApiTopProductsItem = {
  _id: number | string;
  name: string;
  image?: string[];
  price: number;
  quantity: number;
};

type Column<T> = {
  header: string;
  accessor: keyof T | string;
  width?: string;
  sortable?: boolean;
  headerClassName?: string;
  renderCell?: (row: T) => React.ReactNode;
};

type TopProductsTableProps = {
  range: DateRange;
  limit?: number;
  columns?: Column<ProductRow>[];
  emptyStateComponent?: React.ReactNode;
  initialSort?: { key: keyof ProductRow; direction: SortDirection };
};

const makeSkeletonRows = (count = 5): ProductRow[] =>
  Array.from({ length: count }).map((_, i) => ({
    _id: `skeleton-${i}`,
    name: "",
    image: [],
    price: 0,
    quantity: 0,
    isSkeleton: true,
  }));

const money = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

const getSortIcon = (sortConfig: SortConfig, accessor: string) => {
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

const defaultColumns: Column<ProductRow>[] = [
  {
    header: "Product",
    accessor: "name",
    width: "55%",
    sortable: true,
    renderCell: (row) =>
      row.isSkeleton ? (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {row.image?.[0] ? (
            <img
              src={row.image[0]}
              alt={row.name}
              className="w-10 h-10 rounded-md object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-700" />
          )}
          <span className="text-[10px] lg:text-sm font-medium text-gray-800 dark:text-white line-clamp-2">
            {row.name}
          </span>
        </div>
      ),
  },
  {
    header: "Price",
    accessor: "price",
    width: "20%",
    sortable: true,
    renderCell: (row) =>
      row.isSkeleton ? (
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
      ) : (
        <span className="text-gray-600 dark:text-[#E5E5E5]">
          {money(row.price)}
        </span>
      ),
  },
  {
    header: "Orders",
    accessor: "quantity",
    width: "20%",
    sortable: true,
    renderCell: (row) =>
      row.isSkeleton ? (
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
      ) : (
        <span className="text-gray-600 flex justify-center dark:text-[#E5E5E5]">
          {row.quantity}
        </span>
      ),
  },
];

function extractTopProducts(res: any): ApiTopProductsItem[] {
  if (Array.isArray(res?.data)) return res.data;
  return [];
}

const TopProductsTable: React.FC<TopProductsTableProps> = ({
  range,
  limit = 10,
  columns,
  emptyStateComponent,
  initialSort = { key: "quantity", direction: "descending" },
}) => {
  const token = useAuthStore((s) => s.token);
  const t = useTranslations("dashboard.topProducts");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<ProductRow[]>([]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: String(initialSort.key),
    direction: initialSort.direction,
  });

  const defaultColumnsTranslated: Column<ProductRow>[] = useMemo(
    () => [
      {
        header: t("product"),
        accessor: "name",
        width: "55%",
        sortable: true,
        renderCell: (row) =>
          row.isSkeleton ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {row.image?.[0] ? (
                <img
                  src={row.image[0]}
                  alt={row.name}
                  className="w-10 h-10 rounded-md object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-700" />
              )}
              <span className="text-[10px] lg:text-sm font-medium text-gray-800 dark:text-white line-clamp-2">
                {row.name}
              </span>
            </div>
          ),
      },
      {
        header: t("price"),
        accessor: "price",
        width: "20%",
        sortable: true,
        renderCell: (row) =>
          row.isSkeleton ? (
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
          ) : (
            <span className="text-gray-600 dark:text-[#E5E5E5]">
              {money(row.price)}
            </span>
          ),
      },
      {
        header: t("orders"),
        accessor: "quantity",
        width: "20%",
        sortable: true,
        renderCell: (row) =>
          row.isSkeleton ? (
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
          ) : (
            <span className="text-gray-600 flex justify-center dark:text-[#E5E5E5]">
              {row.quantity}
            </span>
          ),
      },
    ],
    [t],
  );

  // ✅ stable primitive deps (prevents infinite loop)
  const fromKey = useMemo(
    () => (range?.from ? new Date(range.from).toISOString() : ""),
    [range?.from],
  );
  const toKey = useMemo(
    () => (range?.to ? new Date(range.to).toISOString() : ""),
    [range?.to],
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          if (!cancelled) {
            setRows([]);
            setLoading(false);
          }
          return;
        }

        if (!cancelled) setRows(makeSkeletonRows(Math.min(5, limit)));

        const res = await getTopProducts(
          {
            startDate: fromKey || undefined,
            endDate: toKey || undefined,
            limit,
          },
          { token },
        );

        const list = extractTopProducts(res);

        if (!cancelled) {
          setRows(
            list.map((p) => ({
              _id: p._id,
              name: p.name,
              image: p.image,
              price: Number(p.price ?? 0),
              quantity: Number(p.quantity ?? 0),
            })),
          );
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? "Failed to load top products");
          setRows([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [token, fromKey, toKey, limit]);

  const cols = useMemo(
    () => columns ?? defaultColumnsTranslated,
    [columns, defaultColumnsTranslated],
  );

  const sortedRows = useMemo(() => {
    if (!rows?.length) return [];
    if (!sortConfig?.key) return rows;

    const key = sortConfig.key as keyof ProductRow;

    return [...rows].sort((a, b) => {
      const av = (a as any)[key];
      const bv = (b as any)[key];

      if (typeof av === "number" && typeof bv === "number") {
        return sortConfig.direction === "ascending" ? av - bv : bv - av;
      }

      const as = String(av ?? "");
      const bs = String(bv ?? "");
      return sortConfig.direction === "ascending"
        ? as.localeCompare(bs)
        : bs.localeCompare(as);
    });
  }, [rows, sortConfig]);

  const requestSort = (accessor: string) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== accessor)
        return { key: accessor, direction: "ascending" };
      return {
        key: accessor,
        direction: prev.direction === "ascending" ? "descending" : "ascending",
      };
    });
  };

  const emptyUI =
    emptyStateComponent ??
    (loading ? (
      <div className="p-5 text-sm text-gray-500 dark:text-gray-400">
        {t("loading")}
      </div>
    ) : (
      <div className="p-5 text-sm text-gray-500 dark:text-gray-400">
        {t("noProducts")}
      </div>
    ));

  return (
    <div className="w-full">
      {error ? (
        <div className="p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : null}

      {/* Desktop */}
      <div className="hidden lg:block overflow-x-auto border border-gray-200 dark:border-[#303030] rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-100/60 dark:bg-[#1C1C1C]">
            <tr>
              {cols.map((col) => (
                <th
                  key={String(col.accessor)}
                  scope="col"
                  className="p-3 text-left text-md font-bold text-gray-600 dark:text-gray-400"
                  style={{ width: col.width || "auto" }}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => requestSort(String(col.accessor))}
                      className="flex items-center cursor-pointer"
                      type="button"
                    >
                      {col.header}
                      {getSortIcon(sortConfig, String(col.accessor))}
                    </button>
                  ) : (
                    <div className={col.headerClassName || ""}>
                      {col.header}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-[#303030]">
            {sortedRows.length > 0 ? (
              sortedRows.map((row, rowIndex) => (
                <tr
                  key={String(row._id ?? rowIndex)}
                  className="dark:hover:bg-gray-800/40 hover:bg-gray-50 transition-colors duration-200"
                >
                  {cols.map((col) => (
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
                <td colSpan={cols.length}>{emptyUI}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet */}
      <div className="block lg:hidden">
        {sortedRows.length > 0 ? (
          <div className="space-y-3">
            {sortedRows.map((row, rowIndex) => {
              const rowId = row._id ?? rowIndex;

              const nonActionCols = cols.filter((c) => c.header !== "Actions");
              const primaryCol = nonActionCols[0];
              const otherCols = nonActionCols.slice(1);

              return (
                <div
                  key={String(rowId)}
                  className="p-3 border border-gray-200 dark:border-[#303030] rounded-xl bg-white dark:bg-[#0b0b0b] shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs pb-1 lg:text-sm font-semibold text-gray-500 dark:text-gray-400 truncate">
                        {primaryCol?.header}
                      </div>
                      <div className="text-[10px] lg:text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {primaryCol?.renderCell
                          ? primaryCol.renderCell(row)
                          : (row as any)[primaryCol?.accessor as any]}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      {otherCols.map((col) => (
                        <div key={String(col.accessor)} className="text-right">
                          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {col.header}
                          </div>
                          <div className="text-xs lg:text-sm font-medium text-gray-800 dark:text-gray-200">
                            {col.renderCell
                              ? col.renderCell(row)
                              : (row as any)[col.accessor]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {cols.some((c) => c.header === "Actions") && (
                    <div className="pt-2 mt-2 border-t border-gray-100 dark:border-[#222] flex items-center justify-end">
                      {cols.map((col) =>
                        col.header === "Actions" ? (
                          <div
                            key={String(col.accessor)}
                            className="flex items-center gap-2"
                          >
                            {col.renderCell
                              ? col.renderCell(row)
                              : (row as any)[col.accessor]}
                          </div>
                        ) : null,
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4">{emptyUI}</div>
        )}
      </div>
    </div>
  );
};

export default TopProductsTable;
