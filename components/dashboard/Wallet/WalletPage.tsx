"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import TopUpSection from "./TopUpSection";
import TransactionHistorySection from "./TransactionHistorySection";

import { useAuthStore } from "@/zustand/authStore";
import { useCartStore } from "@/zustand/store";
import useWalletBalance from "@/hooks/useWalletBalance";

import { getWalletTransactions } from "@/services/walletService";

export type SortConfig = { key: string; direction: "ascending" | "descending" };
export type Transaction = any;

export default function WalletPage() {
  const t = useTranslations("wallet");
  const { user: userInfo, token } = useAuthStore();

  // ✅ USD only
  const currencySymbol = "$";
  const balance = Number(userInfo?.balance ?? 0);

  const { items, addToCart, metaType } = useCartStore();

  const [amount, setAmount] = useState("20.00");
  const [isLoading, setIsLoading] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "createdAt",
    direction: "descending",
  });

  const [expandedTransactions, setExpandedTransactions] = useState<Set<any>>(
    new Set(),
  );

  const numericAmount = parseFloat(amount) || 0;

  const existingTopUpItem = useMemo(
    () => items.find((item: any) => item.type === "WALLET_LOAD"),
    [items],
  );

  const requestIdRef = useRef(0);

  // Refresh wallet balance on page load and when tab becomes visible
  const { refresh } = useWalletBalance();
  useEffect(() => {
    if (!token) return;
    // refresh once on load
    refresh();

    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [token, refresh]);
  useEffect(() => {
    const reqId = ++requestIdRef.current;

    const run = async () => {
      if (!token) {
        setTransactionsLoading(false);
        setTransactions([]);
        setTotalPages(1);
        setTotalResults(0);
        return;
      }

      setTransactionsLoading(true);
      try {
        const res: any = await getWalletTransactions(
          { page: currentPage, limit: rowsPerPage },
          { token },
        );

        if (reqId !== requestIdRef.current) return;

        if (res?.status === "success" && res?.data) {
          setTransactions(res.data.transactions || []);
          setTotalPages(res.data.totalPages || 1);
          setTotalResults(res.data.totalResults || 0);
        } else {
          setTransactions([]);
          setTotalPages(1);
          setTotalResults(0);
        }
      } catch (e) {
        console.error("Error fetching transactions:", e);
        if (reqId !== requestIdRef.current) return;
        setTransactions([]);
        setTotalPages(1);
        setTotalResults(0);
      } finally {
        if (reqId !== requestIdRef.current) return;
        setTransactionsLoading(false);
      }
    };

    run();
  }, [token, currentPage, rowsPerPage]);

  const handleAmountChange = (value: string) => {
    if (/^[0-9]*\.?[0-9]*$/.test(value)) setAmount(value);
  };

  const handlePaymentRedirect = async () => {
    if (!numericAmount) return;

    if (numericAmount < 10 || numericAmount > 1000) {
      toast.error(t("amountRangeError"));
      return;
    }

    // Prevent adding a WALLET_LOAD when the cart already contains DIGITAL_PINS
    if (metaType === "DIGITAL_PINS") {
      toast.error("Please complete the purchase first.");
      return;
    }

    if (existingTopUpItem) {
      toast.error(t("existingTopUpError"));
      return;
    }

    setIsLoading(true);
    try {
      const topUpItem: any = {
        title: t("topUpTitle"),
        slug: "wallet-topup",
        price: numericAmount,
        originalPrice: numericAmount,
        image:
          "https://res.cloudinary.com/dfty6x0fa/image/upload/v1754120356/payment-methods/xhnegdnqvjofdl7wcei2.jpg",
        type: "WALLET_LOAD",
      };

      const ok = addToCart(topUpItem);
      if (!ok) {
        toast.error(
          "Cannot add wallet top-up: cart contains a different product type.",
        );
        return;
      }

      toast.success(t("topUpAddedSuccess"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(t("topUpAddedError"));
    } finally {
      setIsLoading(false);
    }
  };

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedTransactions = useMemo(() => {
    const sortable = [...transactions];
    if (!sortConfig.key) return sortable;

    sortable.sort((a: any, b: any) => {
      const av = a?.[sortConfig.key];
      const bv = b?.[sortConfig.key];
      if (av < bv) return sortConfig.direction === "ascending" ? -1 : 1;
      if (av > bv) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });

    return sortable;
  }, [transactions, sortConfig]);

  const toggleTransactionExpand = (transactionId: any) => {
    setExpandedTransactions((prev) => {
      const next = new Set(prev);
      if (next.has(transactionId)) next.delete(transactionId);
      else next.add(transactionId);
      return next;
    });
  };

  const showingFrom =
    totalResults > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const showingTo = Math.min(currentPage * rowsPerPage, totalResults);

  return (
    <section className="space-y-6">
      <div className="space-y-8">
        <TopUpSection
          currencySymbol={currencySymbol}
          balance={balance}
          amount={amount}
          onAmountChange={handleAmountChange}
          numericAmount={numericAmount}
          isLoading={isLoading}
          existingTopUpItem={!!existingTopUpItem}
          onAddToCart={handlePaymentRedirect}
        />

        <TransactionHistorySection
          transactions={sortedTransactions}
          loading={transactionsLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(n) => {
            setRowsPerPage(n);
            setCurrentPage(1);
          }}
          showingFrom={showingFrom}
          showingTo={showingTo}
          sortConfig={sortConfig}
          requestSort={requestSort}
          expandedTransactions={expandedTransactions}
          onToggleExpand={toggleTransactionExpand}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}
