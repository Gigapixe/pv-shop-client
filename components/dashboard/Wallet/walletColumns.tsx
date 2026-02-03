// components/wallet/ui/walletColumns.tsx
"use client";

import { useTranslations } from "next-intl";

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const getStatusClass = (status: string) => {
  const normalizedStatus = status?.toLowerCase().trim();

  switch (normalizedStatus) {
    case "completed":
    case "success":
    case "successful":
      return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 dark:from-emerald-900/40 dark:to-emerald-900/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/30 shadow-sm";
    case "pending":
    case "processing":
    case "in_progress":
      return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 dark:from-amber-900/40 dark:to-amber-900/20 dark:text-amber-300 border border-amber-200 dark:border-amber-700/30 shadow-sm";
    case "failed":
    case "error":
    case "declined":
    case "rejected":
      return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-50 to-red-100 text-red-800 dark:from-red-900/40 dark:to-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-700/30 shadow-sm";
    case "cancelled":
    case "canceled":
      return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 dark:from-slate-900/40 dark:to-slate-900/20 dark:text-slate-300 border border-slate-200 dark:border-slate-700/30 shadow-sm";
    case "refunded":
    case "refund":
      return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 dark:from-blue-900/40 dark:to-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-700/30 shadow-sm";
    case "on_hold":
    case "hold":
    case "holding":
      return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 dark:from-orange-900/40 dark:to-orange-900/20 dark:text-orange-300 border border-orange-200 dark:border-orange-700/30 shadow-sm";
    case "expired":
      return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 dark:from-purple-900/40 dark:to-purple-900/20 dark:text-purple-300 border border-purple-200 dark:border-purple-700/30 shadow-sm";
    default:
      return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 dark:from-gray-900/40 dark:to-gray-900/20 dark:text-gray-300 border border-gray-200 dark:border-gray-700/30 shadow-sm";
  }
};

const getTypeClass = (type: string) => {
  const normalizedType = type?.toLowerCase().trim();

  if (normalizedType.includes("purchase"))
    return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-rose-50 to-rose-100 text-rose-800 dark:from-rose-900/40 dark:to-rose-900/20 dark:text-rose-300 border border-rose-200 dark:border-rose-700/30 shadow-sm";
  if (normalizedType.includes("gift"))
    return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 dark:from-emerald-900/40 dark:to-emerald-900/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/30 shadow-sm";
  if (normalizedType.includes("refund"))
    return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 dark:from-blue-900/40 dark:to-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-700/30 shadow-sm";
  if (normalizedType.includes("bonus"))
    return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 dark:from-purple-900/40 dark:to-purple-900/20 dark:text-purple-300 border border-purple-200 dark:border-purple-700/30 shadow-sm";
  if (
    normalizedType.includes("wallet") ||
    normalizedType.includes("load") ||
    normalizedType.includes("topup")
  )
    return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-800 dark:from-cyan-900/40 dark:to-cyan-900/20 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700/30 shadow-sm";
  if (normalizedType.includes("withdraw") || normalizedType.includes("payout"))
    return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-800 dark:from-indigo-900/40 dark:to-indigo-900/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/30 shadow-sm";
  if (normalizedType.includes("transfer") || normalizedType.includes("send"))
    return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 dark:from-orange-900/40 dark:to-orange-900/20 dark:text-orange-300 border border-orange-200 dark:border-orange-700/30 shadow-sm";

  return "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 dark:from-gray-900/40 dark:to-gray-900/20 dark:text-gray-300 border border-gray-200 dark:border-gray-700/30 shadow-sm";
};

export function buildWalletColumns(t?: (key: string) => string) {
  const translate = t || ((key: string) => key);
  return [
    {
      header: "Date",
      accessor: "createdAt",
      width: "25%",
      sortable: true,
      renderCell: (row: any) => (
        <span className="text-gray-600 dark:text-[#E5E5E5] whitespace-nowrap">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      width: "20%",
      renderCell: (row: any) => (
        <span
          className={`px-3 py-1 text-xs font-medium whitespace-nowrap rounded-full ${getTypeClass(
            row.type,
          )}`}
        >
          {row.type.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Method",
      accessor: "paymentMethod",
      width: "20%",
      renderCell: (row: any) => (
        <span className="text-gray-600 dark:text-[#E5E5E5] whitespace-nowrap">
          {row.paymentMethod}
        </span>
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
      width: "15%",
      sortable: true,
      renderCell: (row: any) => (
        <span
          className={`font-semibold whitespace-nowrap ${
            row.amount < 0 ? "text-rose-500" : "text-emerald-500"
          }`}
        >
          {row.amount < 0 ? "-" : ""}
          {formatCurrency(Math.abs(row.amount))}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      width: "10%",
      renderCell: (row: any) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(
            row.status,
          )}`}
        >
          {row.status}
        </span>
      ),
    },
  ];
}

// re-export helpers for mobile card
export { formatDate, formatCurrency, getStatusClass, getTypeClass };
