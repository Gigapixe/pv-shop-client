"use client";

import BalanceCard from "@/components/dashboard/Withdraw/BalanceCard";
import WithdrawalForm from "@/components/dashboard/Withdraw/WithdrawalForm";
import WithdrawalHistory from "@/components/dashboard/Withdraw/WithdrawalHistory";
import {
  getWithdrawalHistory,
  requestWithdrawal,
} from "@/services/customerService";
import { getReferralStats } from "@/services/referralService";
import {
  ExternalPayoutType,
  PaginationState,
  SortConfig,
  WithdrawalFormState,
  WithdrawalRow,
} from "@/types/withdraw";
import { useAuthStore } from "@/zustand/authStore";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

const MIN_WALLET_WITHDRAWAL = 10;
const MIN_EXTERNAL_WITHDRAWAL = 20;

export default function WithdrawPage() {
  const t = useTranslations("withdraw");
  const { token } = useAuthStore();

  const [loadingStats, setLoadingStats] = useState(true);
  const [withdrawableBalance, setWithdrawableBalance] = useState(0);

  const [loadingHistory, setLoadingHistory] = useState(true);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRow[]>(
    [],
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });

  const [pageCount, setPageCount] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "requestedAt",
    direction: "descending",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<WithdrawalFormState>({
    amount: "",
    method: "wallet",
    walletDetails: { paypalEmail: "", cryptoAddress: "" },
  });

  const [externalPayoutType, setExternalPayoutType] =
    useState<ExternalPayoutType>("paypal");

  const currentPage = useMemo(() => pagination.pageIndex + 1, [pagination]);
  const limit = useMemo(() => pagination.pageSize, [pagination.pageSize]);

  const fetchWithdrawableBalance = async () => {
    if (!token) return;
    setLoadingStats(true);

    try {
      const statsRes = await getReferralStats({ token });

      // adapt if your apiFetch returns {success: boolean} etc.
      if (statsRes.status === "success" && statsRes.data) {
        setWithdrawableBalance(statsRes.data.withdrawableBalance || 0);
      } else {
        toast.error(statsRes.message || t("fetchBalanceError"));
      }
    } catch (err: any) {
      toast.error(err?.message || t("fetchBalanceError"));
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchHistory = async () => {
    if (!token) return;
    setLoadingHistory(true);

    try {
      const historyRes = await getWithdrawalHistory(token, currentPage, limit);

      if (historyRes.status === "success" && historyRes.data) {
        setWithdrawalHistory(historyRes.data.withdrawals || []);
        setPageCount(historyRes.data.pagination?.totalPages || 0);
        setTotalDocs(historyRes.data.pagination?.totalDocs || 0);
      } else {
        toast.error(historyRes.message || t("fetchHistoryError"));
        setWithdrawalHistory([]);
      }
    } catch (err: any) {
      setWithdrawalHistory([]);
      toast.error(err?.message || t("fetchHistoryError"));
    } finally {
      setLoadingHistory(false);
    }
  };

  // ✅ Only fetch when token is available
  useEffect(() => {
    if (!token) return;
    fetchWithdrawableBalance();
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currentPage, limit]);

  const requestSort = (key: keyof WithdrawalRow) => {
    setSortConfig((prev) => {
      const direction =
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending";
      return { key, direction };
    });
  };

  const sortedRows = useMemo(() => {
    const items = [...withdrawalHistory];
    const { key, direction } = sortConfig;

    items.sort((a, b) => {
      const av = a[key] as any;
      const bv = b[key] as any;
      if (av < bv) return direction === "ascending" ? -1 : 1;
      if (av > bv) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    return items;
  }, [withdrawalHistory, sortConfig]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error(t("loginRequired"));
      return;
    }

    setIsSubmitting(true);

    const amount = parseFloat(form.amount);

    if (Number.isNaN(amount) || amount <= 0) {
      toast.error(t("validAmountRequired"));
      setIsSubmitting(false);
      return;
    }

    if (amount > withdrawableBalance) {
      toast.error(t("amountExceedsBalance"));
      setIsSubmitting(false);
      return;
    }

    if (form.method === "wallet" && amount < MIN_WALLET_WITHDRAWAL) {
      toast.error(t("minWalletWithdrawal", { amount: MIN_WALLET_WITHDRAWAL }));
      setIsSubmitting(false);
      return;
    }

    if (form.method === "external" && amount < MIN_EXTERNAL_WITHDRAWAL) {
      toast.error(
        t("minExternalWithdrawal", { amount: MIN_EXTERNAL_WITHDRAWAL }),
      );
      setIsSubmitting(false);
      return;
    }

    const payload: any = { amount, method: form.method };

    if (form.method === "external") {
      const { paypalEmail, cryptoAddress } = form.walletDetails;
      payload.walletDetails = {};

      if (externalPayoutType === "paypal") {
        if (!paypalEmail) {
          toast.error(t("paypalEmailRequired"));
          setIsSubmitting(false);
          return;
        }
        payload.walletDetails.paypalEmail = paypalEmail;
      } else {
        if (!cryptoAddress) {
          toast.error(t("cryptoAddressRequired"));
          setIsSubmitting(false);
          return;
        }
        payload.walletDetails.cryptoAddress = cryptoAddress;
        payload.walletDetails.cryptoNetwork = "TRC20";
      }
    }

    try {
      const res = await requestWithdrawal(token, payload);

      if (res.status === "success") {
        toast.success(res.message || t("withdrawalSuccess"));

        // ✅ if API returns new balances, update local state
        if (typeof res.data?.newReferralEarning === "number") {
          setWithdrawableBalance(res.data.newReferralEarning);
        } else {
          // fallback: refetch stats to stay accurate
          fetchWithdrawableBalance();
        }

        // If API returned a new wallet balance, update auth store
        if (typeof res.data?.newWalletBalance === "number") {
          useAuthStore.getState().setUserBalance(res.data.newWalletBalance);
        }
        setForm({
          amount: "",
          method: "wallet",
          walletDetails: { paypalEmail: "", cryptoAddress: "" },
        });
        setExternalPayoutType("paypal");

        fetchHistory();
      } else {
        toast.error(res.message || t("withdrawalFailed"));
      }
    } catch (err: any) {
      toast.error(err?.message || t("withdrawalError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        {t("pageTitle")}
      </h1>

      <BalanceCard
        title={t("availableForWithdrawal")}
        value={`$${withdrawableBalance.toFixed(2)}`}
        loading={loadingStats}
      />

      <WithdrawalForm
        withdrawableBalance={withdrawableBalance}
        loadingStats={loadingStats}
        isSubmitting={isSubmitting}
        form={form}
        setForm={setForm}
        externalPayoutType={externalPayoutType}
        setExternalPayoutType={setExternalPayoutType}
        onSubmit={handleSubmit}
      />

      <WithdrawalHistory
        rows={sortedRows}
        loading={loadingHistory}
        sortConfig={sortConfig}
        requestSort={requestSort}
        pagination={pagination}
        setPagination={setPagination}
        pageCount={pageCount}
        totalDocs={totalDocs}
      />
    </div>
  );
}
