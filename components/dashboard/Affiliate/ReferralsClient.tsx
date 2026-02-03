// src/app/(dashboard)/referrals/ReferralsClient.tsx
"use client";

import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getReferralCode,
  getReferralStats,
  getReferralList,
  getCommissionHistory,
} from "@/services/referralService";
import { useAuthStore } from "@/zustand/authStore";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import HeaderBar from "./HeaderBar";
import StatsGrid from "./StatsGrid";
import BalanceGrid from "./BalanceGrid";
import ReferralLinkCard from "./ReferralLinkCard";
import ReferralTableCard from "./ReferralTableCard";
import EmptyState from "./EmptyState";
import CommissionTableCard from "./CommissionTableCard";
import ReferralStatusBadge from "./ReferralStatusBadge";

export default function ReferralsClient() {
  const t = useTranslations("referral");
  const { token } = useAuthStore();

  // -----------------------------
  // Referral state
  // -----------------------------
  const [loadingCode, setLoadingCode] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingReferralList, setLoadingReferralList] = useState(true);

  const [referralData, setReferralData] = useState<{
    referralCode: string | null;
    referralLink: string | null;
  }>({ referralCode: null, referralLink: null });

  const [referralStats, setReferralStats] = useState({
    completedCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    totalReferrals: 0,
    totalVisits: 0,
    conversionRate: 0,
    totalEarningsLifetime: 0,
    totalPayoutsLifetime: 0,
    clearanceBalance: 0,
    withdrawableBalance: 0,
  });

  const [referralList, setReferralList] = useState<any[]>([]);
  const [referralError, setReferralError] = useState<string | null>(null);

  const [referralPagination, setReferralPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const [referralPageCount, setReferralPageCount] = useState(0);
  const [referralTotalDocs, setReferralTotalDocs] = useState(0);
  const [referralStatusFilter, setReferralStatusFilter] = useState<
    string | null
  >(null);

  const [referralSortConfig, setReferralSortConfig] = useState({
    key: "referredUser.joinedAt",
    direction: "descending" as "ascending" | "descending",
  });

  // -----------------------------
  // Commission state
  // -----------------------------
  const [loadingCommissionHistory, setLoadingCommissionHistory] =
    useState(true);
  const [commissionHistoryError, setCommissionHistoryError] = useState<
    string | null
  >(null);
  const [commissionHistoryList, setCommissionHistoryList] = useState<any[]>([]);

  const [commissionHistoryPagination, setCommissionHistoryPagination] =
    useState({
      pageIndex: 0,
      pageSize: 8,
    });

  const [commissionHistoryPageCount, setCommissionHistoryPageCount] =
    useState(0);
  const [commissionHistoryTotalDocs, setCommissionHistoryTotalDocs] =
    useState(0);

  const [commissionSortConfig, setCommissionSortConfig] = useState({
    key: "createdAt",
    direction: "descending" as "ascending" | "descending",
  });

  const referralsTableRef = useRef<HTMLDivElement | null>(null);

  const currentReferralPage = useMemo(
    () => referralPagination.pageIndex + 1,
    [referralPagination.pageIndex],
  );
  const referralLimit = useMemo(
    () => referralPagination.pageSize,
    [referralPagination.pageSize],
  );

  const currentCommissionPage = useMemo(
    () => commissionHistoryPagination.pageIndex + 1,
    [commissionHistoryPagination.pageIndex],
  );
  const commissionLimit = useMemo(
    () => commissionHistoryPagination.pageSize,
    [commissionHistoryPagination.pageSize],
  );

  // -----------------------------
  // Fetchers (use apiFetch services + token)
  // -----------------------------
  const fetchReferralCodeAndStats = async () => {
    if (!token) return;

    setLoadingCode(true);
    setLoadingStats(true);

    try {
      const codeRes = await getReferralCode({ token });
      if (codeRes.status === "success") setReferralData(codeRes.data);
      else toast.error(codeRes.message || t("fetchCodeError"));
    } catch (err: any) {
      toast.error(err?.message || t("fetchCodeError"));
    } finally {
      setLoadingCode(false);
    }

    try {
      const statsRes = await getReferralStats({ token });
      if (statsRes.status === "success") {
        setReferralStats((prev) => ({ ...prev, ...statsRes.data }));
      } else {
        toast.error(statsRes.message || t("fetchStatsError"));
      }
    } catch (err: any) {
      toast.error(err?.message || t("fetchStatsError"));
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchReferralListData = async () => {
    if (!token) return;

    setLoadingReferralList(true);
    setReferralError(null);

    try {
      const listRes = await getReferralList(
        {
          page: currentReferralPage,
          limit: referralLimit,
          status: referralStatusFilter,
        },
        { token },
      );

      if (listRes.status === "success" && listRes.data) {
        setReferralList(listRes.data.referrals || []);
        setReferralPageCount(listRes.data.pagination?.totalPages || 0);
        setReferralTotalDocs(listRes.data.pagination?.totalDocs || 0);
      } else {
        throw new Error(listRes.message || t("fetchListError"));
      }
    } catch (err: any) {
      setReferralError(err?.message || t("fetchListError"));
      setReferralList([]);
    } finally {
      setLoadingReferralList(false);
    }
  };

  const fetchCommissionHistoryData = async () => {
    if (!token) return;

    setLoadingCommissionHistory(true);
    setCommissionHistoryError(null);

    try {
      const historyRes = await getCommissionHistory(
        { page: currentCommissionPage, limit: commissionLimit },
        { token },
      );

      if (historyRes.status === "success" && historyRes.data) {
        setCommissionHistoryList(historyRes.data.history || []);
        setCommissionHistoryPageCount(
          historyRes.data.pagination?.totalPages || 0,
        );
        setCommissionHistoryTotalDocs(
          historyRes.data.pagination?.totalDocs || 0,
        );
      } else {
        throw new Error(historyRes.message || t("fetchCommissionError"));
      }
    } catch (err: any) {
      setCommissionHistoryError(err?.message || t("fetchCommissionError"));
      setCommissionHistoryList([]);
    } finally {
      setLoadingCommissionHistory(false);
    }
  };

  // fetch on token ready
  useEffect(() => {
    if (!token) return;
    fetchReferralCodeAndStats();
    fetchCommissionHistoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // referral list changes
  useEffect(() => {
    if (!token) return;
    fetchReferralListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currentReferralPage, referralLimit, referralStatusFilter]);

  // -----------------------------
  // Sorting
  // -----------------------------
  const requestReferralSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      referralSortConfig.key === key &&
      referralSortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setReferralSortConfig({ key, direction });
  };

  const requestCommissionSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      commissionSortConfig.key === key &&
      commissionSortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setCommissionSortConfig({ key, direction });
  };

  const sortedReferrals = useMemo(() => {
    const items = [...referralList];
    const key = referralSortConfig.key;
    if (!key) return items;

    const getNestedValue = (obj: any, path: string) =>
      path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);

    items.sort((a, b) => {
      const aValue = getNestedValue(a, key);
      const bValue = getNestedValue(b, key);

      if (aValue < bValue)
        return referralSortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue)
        return referralSortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });

    return items;
  }, [referralList, referralSortConfig]);

  const sortedCommissions = useMemo(() => {
    const items = [...commissionHistoryList];
    const key = commissionSortConfig.key;
    if (!key) return items;

    items.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue < bValue)
        return commissionSortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue)
        return commissionSortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });

    return items;
  }, [commissionHistoryList, commissionSortConfig]);

  // -----------------------------
  // Columns
  // -----------------------------
  const referralColumns = useMemo(
    () => [
      {
        header: t("userName"),
        accessor: "referredUser.name",
        width: "25%",
        sortable: true,
        renderCell: (row: any) => row.referredUser?.name || "N/A",
      },
      {
        header: t("joinedDate"),
        accessor: "referredUser.joinedAt",
        width: "30%",
        sortable: true,
        renderCell: (row: any) =>
          row.referredUser?.joinedAt
            ? dayjs(row.referredUser.joinedAt).format("MMMM DD, YYYY | hh:mm A")
            : "N/A",
      },
      {
        header: t("email"),
        accessor: "referredUser.email",
        width: "30%",
        sortable: true,
        renderCell: (row: any) => row.referredUser?.email || "N/A",
      },
      {
        header: t("status"),
        accessor: "status",
        width: "15%",
        sortable: true,
        renderCell: (row: any) => <ReferralStatusBadge status={row.status} />,
      },
    ],
    [t],
  );

  const commissionHistoryColumns = useMemo(
    () => [
      {
        header: t("description"),
        accessor: "notes",
        width: "35%",
        sortable: true,
        renderCell: (row: any) => row.notes || t("commissionFromReferral"),
      },
      {
        header: t("date"),
        accessor: "createdAt",
        width: "20%",
        sortable: true,
        renderCell: (row: any) =>
          row.createdAt ? dayjs(row.createdAt).format("MMMM DD, YYYY") : "N/A",
      },
      {
        header: t("amount"),
        accessor: "commissionAmount",
        width: "15%",
        sortable: true,
        renderCell: (row: any) =>
          `$${row.commissionAmount?.toFixed(2) || "0.00"}`,
      },
      {
        header: t("paymentStatus"),
        accessor: "status",
        width: "15%",
        sortable: true,
        renderCell: (row: any) => <ReferralStatusBadge status={row.status} />,
      },
      {
        header: t("clearance"),
        accessor: "clearanceUntil",
        width: "15%",
        sortable: true,
        renderCell: (row: any) => {
          const { clearanceUntil, status } = row;
          if (status !== "credited")
            return <ReferralStatusBadge status={status} />;
          if (!clearanceUntil) return "N/A";
          return dayjs().isAfter(dayjs(clearanceUntil))
            ? t("cleared")
            : `${t("clears")}: ${dayjs(clearanceUntil).format("MMM D")}`;
        },
      },
    ],
    [t],
  );

  return (
    <>
      <div className="space-y-8">
        <HeaderBar withdrawable={referralStats.withdrawableBalance} />

        <StatsGrid stats={referralStats} loading={loadingStats} />

        <BalanceGrid stats={referralStats} loading={loadingStats} />

        <ReferralLinkCard
          loading={loadingCode}
          referralLink={referralData.referralLink || ""}
          onCopy={() => {
            if (referralData.referralLink) {
              navigator.clipboard.writeText(referralData.referralLink);
              toast.success(t("linkCopied"));
            }
          }}
        />

        <ReferralTableCard
          title={t("myReferredUsers", {
            count: loadingReferralList ? "..." : referralTotalDocs,
          })}
          loading={loadingReferralList}
          error={referralError}
          tableRef={referralsTableRef}
          columns={referralColumns}
          data={sortedReferrals}
          sortConfig={referralSortConfig}
          requestSort={requestReferralSort}
          emptyState={
            <EmptyState
              title={t("noReferredUsersTitle")}
              subtitle={t("noReferredUsersMessage")}
            />
          }
          pagination={{
            pagination: referralPagination,
            pageCount: referralPageCount,
            totalDocs: referralTotalDocs,
            onPageChange: setReferralPagination,
            loading: loadingReferralList,
          }}
        />

        <CommissionTableCard
          loading={loadingCommissionHistory}
          error={commissionHistoryError}
          columns={commissionHistoryColumns}
          data={sortedCommissions}
          sortConfig={commissionSortConfig}
          requestSort={requestCommissionSort}
          emptyState={
            <EmptyState
              title={t("noCommissionTitle")}
              subtitle={t("noCommissionMessage")}
            />
          }
          pagination={{
            pagination: commissionHistoryPagination,
            pageCount: commissionHistoryPageCount,
            totalDocs: commissionHistoryTotalDocs,
            onPageChange: setCommissionHistoryPagination,
            loading: loadingCommissionHistory,
          }}
        />
      </div>
    </>
  );
}
