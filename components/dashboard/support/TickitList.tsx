"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import {
  FiArrowRight,
  FiEye,
  FiFolderMinus,
  FiMessageSquare,
} from "react-icons/fi";
import { MdArrowOutward } from "react-icons/md";
import Link from "next/link";
import { useTranslations } from "next-intl";

// Internal imports
import ReusableTable from "@/components/table/ReusableTable";
import { getUserSupportTickets } from "@/services/supportService";
import { Ticket } from "@/types/ticket";
import Button from "@/components/ui/Button";

interface Column<T> {
  header: React.ReactNode;
  accessor: keyof T | string;
  width?: string;
  sortable?: boolean;
  headerClassName?: string;
  renderCell?: (row: T) => React.ReactNode;
}

const EmptyState = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="text-center py-16">
    <div className="flex justify-center mb-4">
      <FiFolderMinus size={60} className="text-emerald-400/50" />
    </div>
    <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
      {title}
    </h4>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
  </div>
);

export default function TicketListPage() {
  const t = useTranslations("support");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalDocs: number;
    pageSize: number;
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({
    key: "updatedAt",
    direction: "descending",
  });
  const router = useRouter();

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await getUserSupportTickets(
        10,
        currentPage,
        statusFilter || undefined,
      );
      if (response.success) {
        setTickets(response.data.tickets || []);
        setPagination(response.data.pagination || null);
      } else {
        toast.error(response.message || t("fetchTicketsError"));
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("fetchTicketsError"),
      );
    } finally {
      setLoading(false);
    }
  };

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedTickets = useMemo(() => {
    let sortableItems = [...tickets];
    if (sortConfig.key) {
      sortableItems.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [tickets, sortConfig]);

  const columns: Column<Ticket>[] = [
    {
      header: t("ticketId"),
      accessor: "ticketId",
      width: "10%",
      sortable: true,
      renderCell: (row) => (
        <span className="font-mono text-sm dark:text-gray-300">
          #{row.ticketId || row._id.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      header: t("ticketTitle"),
      accessor: "title",
      width: "30%",
      sortable: true,
      renderCell: (row) => (
        <Link
          href={`/user/ticket/${row.ticketId || row._id}`}
          className="text-sm font-medium text-gray-900 hover:text-emerald-600 dark:text-white dark:hover:text-emerald-400 cursor-pointer"
        >
          {row.title}
        </Link>
      ),
    },
    {
      header: t("priority"),
      accessor: "priority",
      width: "15%",
      sortable: true,
      renderCell: (row) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
            row.priority === "high"
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              : row.priority === "medium"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
          }`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      header: t("status"),
      accessor: "status",
      width: "15%",
      sortable: true,
      renderCell: (row) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
            row.status === "open"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              : row.status === "in progress"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                : row.status === "resolved"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: t("lastUpdated"),
      accessor: "updatedAt",
      width: "15%",
      sortable: true,
      renderCell: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {dayjs(row.updatedAt).format("MMM D, YYYY")}
        </span>
      ),
    },
    {
      header: t("actions"),
      accessor: "actions",
      width: "15%",
      renderCell: (row) => (
        <Link
          href={`/user/ticket/${row.ticketId || row._id}`}
          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-100 rounded-full hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50 transition-colors"
        >
          <FiEye />
          <span>{t("viewDetails")}</span>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiMessageSquare className="text-2xl text-gray-700 dark:text-text-light" />
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-text-light">
            {t("pageTitle")}
          </h1>
        </div>
        <Button
          href="/user/open-ticket"
          btnType="primary"
          className="px-0! pl-4! pr-1.5!"
        >
          {t("openNewTicket")}
          <span className="text-primary bg-white p-1 rounded-full">
            <FiArrowRight className="-rotate-45" />
          </span>
        </Button>
      </div>

      <div className="rounded-xl bg-background-light dark:bg-background-dark-2 border border-border-light dark:border-border-dark shadow-sm">
        <div className="p-6">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Reset page on filter change
            }}
            className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-sm bg-background dark:bg-background-dark text-text dark:text-text-light focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:outline-none"
          >
            <option value="">{t("allStatus")}</option>
            <option value="open">{t("statusOpen")}</option>
            <option value="in progress">{t("statusInProgress")}</option>
            <option value="resolved">{t("statusResolved")}</option>
            <option value="closed">{t("statusClosed")}</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center p-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {t("loadingTickets")}
            </p>
          </div>
        ) : (
          <ReusableTable
            columns={columns}
            data={sortedTickets}
            sortConfig={sortConfig}
            requestSort={requestSort}
            emptyStateComponent={
              <EmptyState
                title={t("noTicketsFound")}
                subtitle={t("noTicketsSubtitle")}
              />
            }
            pagination={pagination || undefined}
            onPageChange={setCurrentPage}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
