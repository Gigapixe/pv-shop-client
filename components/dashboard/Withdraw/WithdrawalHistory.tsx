"use client";

import dayjs from "dayjs";
import { FiClock } from "react-icons/fi";
import EmptyState from "./EmptyState";
import { PaginationState, SortConfig, WithdrawalRow } from "@/types/withdraw";
import ReusableTable from "@/components/table/ReusableTable";
import PaginationControls from "../Affiliate/PaginationControls";
import { useTranslations } from "next-intl";

type Props = {
  rows: WithdrawalRow[];
  loading: boolean;
  sortConfig: SortConfig;
  requestSort: (key: keyof WithdrawalRow) => void;
  pagination: PaginationState;
  pageCount: number;
  totalDocs: number;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
};

export default function WithdrawalHistory({
  rows,
  loading,
  sortConfig,
  requestSort,
  pagination,
  pageCount,
  totalDocs,
  setPagination,
}: Props) {
  const t = useTranslations("withdraw");

  const columns = [
    {
      header: t("date"),
      accessor: "requestedAt",
      width: "25%",
      sortable: true,
      renderCell: (row: WithdrawalRow) =>
        dayjs(row.requestedAt).format("MMMM DD, YYYY h:mm A"),
    },
    {
      header: t("amount"),
      accessor: "amount",
      width: "10%",
      sortable: true,
      renderCell: (row: WithdrawalRow) => `$${row.amount.toFixed(2)}`,
    },
    {
      header: t("method"),
      accessor: "method",
      width: "15%",
      sortable: true,
      renderCell: (row: WithdrawalRow) => (
        <span className="capitalize">{row.method.replace("_", " ")}</span>
      ),
    },
    {
      header: t("status"),
      accessor: "status",
      width: "15%",
      sortable: true,
      renderCell: (row: WithdrawalRow) => {
        const status = row.status;
        let colorClass =
          "text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700";

        if (status === "completed" || status === "instant_completed") {
          colorClass =
            "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/20";
        } else if (status === "pending") {
          colorClass =
            "text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/20";
        } else if (status === "rejected") {
          colorClass =
            "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/20";
        }

        const label =
          status.replace("_", " ").charAt(0).toUpperCase() +
          status.replace("_", " ").slice(1);

        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}
          >
            {label}
          </span>
        );
      },
    },
    {
      header: t("details"),
      accessor: "walletDetails",
      width: "35%",
      renderCell: (row: WithdrawalRow) => {
        const { paypalEmail, cryptoAddress, cryptoNetwork } =
          row.walletDetails || {};
        if (paypalEmail) return paypalEmail;

        if (cryptoAddress) {
          return (
            <span className="truncate" title={cryptoAddress}>
              {cryptoAddress} ({cryptoNetwork || "TRC20"})
            </span>
          );
        }
        return "N/A";
      },
    },
  ];

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <FiClock className="text-xl text-emerald-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t("historyTitle")}
          </h3>
        </div>
      </div>

      <ReusableTable
        columns={columns as any}
        data={rows}
        sortConfig={sortConfig as any}
        requestSort={requestSort as any}
        emptyStateComponent={
          <EmptyState
            title={t("noHistoryTitle")}
            subtitle={t("noHistoryMessage")}
          />
        }
      />

      {rows.length > 0 && (
        <PaginationControls
          pagination={pagination}
          pageCount={pageCount}
          totalDocs={totalDocs}
          onPageChange={setPagination}
          loading={loading}
        />
      )}
    </div>
  );
}
