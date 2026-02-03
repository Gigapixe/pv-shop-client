"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IoBagHandle } from "react-icons/io5";
import OrdersTable, { RecentOrder } from "../ui/OrdersTable";
import { useAuthStore } from "@/zustand/authStore";
import { getRecentOrders } from "@/services/orderService";
import { OrderDetails } from "./Order/OrderDetails";
import { useTranslations } from "next-intl";

type RecentOrdersResponse = {
  status?: "success" | "error";
  message?: string;
  orders?: RecentOrder[];
};

function extractRecentOrders(res: RecentOrdersResponse | any): RecentOrder[] {
  if (Array.isArray(res?.orders)) return res.orders;
  if (Array.isArray(res?.data?.orders)) return res.data.orders;
  if (Array.isArray(res?.data?.data?.orders)) return res.data.data.orders;
  if (Array.isArray(res?.data)) return res.data; // if API returns data: []
  return [];
}

const RecentOrders: React.FC = () => {
  const token = useAuthStore((s) => s.token);
  const t = useTranslations("dashboard.recentOrders");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [selectedOrderData, setSelectedOrderData] =
    useState<RecentOrder | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          if (!cancelled) {
            setOrders([]);
            setSelectedOrderData(null);
            setLoading(false);
          }
          return;
        }

        const res = (await getRecentOrders({ token })) as RecentOrdersResponse;

        // ✅ force correct type so `.find((o) => ...)` isn't `any`
        const list: RecentOrder[] = extractRecentOrders(res);

        if (!cancelled) {
          setOrders(list);

          // keep selected if still exists, otherwise clear
          setSelectedOrderData((prev) =>
            prev
              ? (list.find((o: RecentOrder) => o._id === prev._id) ?? null)
              : null,
          );
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? "Failed to load recent orders");
          setOrders([]);
          setSelectedOrderData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSelectOrder = useCallback(
    (orderId: string) => {
      const selected = orders.find((o) => o._id === orderId) || null;
      setSelectedOrderData(selected);
    },
    [orders],
  );

  const handleBackToOrders = useCallback(() => {
    setSelectedOrderData(null);
  }, []);

  const recentOrders = useMemo(() => orders, [orders]);

  // Loading
  if (loading) {
    return (
      <section aria-busy="true" className="py-6">
        <div className="w-full h-28 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-xl border border-gray-200 dark:border-[#303030]" />
      </section>
    );
  }

  // Error
  if (error) {
    return (
      <section aria-live="polite" className="text-center py-10">
        <p className="text-red-500 font-medium">{error}</p>
      </section>
    );
  }

  // Empty state
  if (recentOrders.length === 0) {
    return (
      <section className="text-center py-10" aria-label="No orders">
        <span className="flex justify-center text-emerald-500 text-6xl mb-4">
          <IoBagHandle />
        </span>
        <h2 className="font-medium text-lg text-gray-600 dark:text-[#E5E5E5]">
          {t("noOrdersTitle")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-[#E5E5E5]">
          {t("noOrdersMessage")}
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {selectedOrderData ? (
        <OrderDetails order={selectedOrderData} onBack={handleBackToOrders} />
      ) : (
        <OrdersTable
          orders={recentOrders}
          onSelect={handleSelectOrder}
          moneyCurrency="USD"
        />
      )}
    </div>
  );
};

export default RecentOrders;
