"use client";

import { useCallback, useState } from "react";
import { useAuthStore } from "@/zustand/authStore";
import { getCustomerBalance } from "@/services/customerService";

export default function useWalletBalance() {
  const user = useAuthStore((s) => s.user);
  const setUserBalance = useAuthStore((s) => s.setUserBalance);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await getCustomerBalance();

      // adapt to possible api shapes
      const newBalance =
        res?.data?.balance ?? res?.data?.newWalletBalance ?? res?.data;
      if (typeof newBalance === "number") {
        setUserBalance(newBalance);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch wallet balance");
    } finally {
      setLoading(false);
    }
  }, [setUserBalance]);

  return {
    balance: user?.balance ?? 0,
    loading,
    error,
    refresh,
  };
}
