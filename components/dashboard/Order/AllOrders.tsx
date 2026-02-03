"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IoBagHandle } from "react-icons/io5";
import OrdersTable, { RecentOrder } from "../../ui/OrdersTable";
import Pagination from "../../ui/Pagination";
import type { DateRange } from "@/components/ui/DateRangeFilter";
import { getOrdersPaginated } from "@/services/orderService"; // adjust path
import { useAuthStore } from "@/zustand/authStore";
import { OrderDetails } from "./OrderDetails";

const PAGE_SIZE = 10;

type AllOrdersProps = {
  search?: string;
  status?: string;
  paymentMethod?: string;
  range?: DateRange;
};

type PaginatedOrdersResponse = {
  status: "success" | "error";
  message: string;
  data: {
    orders: RecentOrder[];
    pagination: {
      totalDoc: number;
      limit: number;
      page: number;
      totalPages: number;
    };
  };
};

const useDebouncedValue = <T,>(value: T, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
};

const AllOrders: React.FC<AllOrdersProps> = ({
  search = "",
  status = "",
  paymentMethod = "",
  range = { from: null, to: null },
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();

  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [total, setTotal] = useState(0);

  const [selectedOrderData, setSelectedOrderData] =
    useState<RecentOrder | null>(null);

  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search.trim(), 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, paymentMethod, range?.from, range?.to]);

  const params = useMemo(() => {
    return {
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      status: status || undefined,
      paymentMethod: paymentMethod || undefined,

      startDate: range?.from ?? undefined,
      endDate: range?.to ?? undefined,
    };
  }, [page, debouncedSearch, status, paymentMethod, range?.from, range?.to]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          setLoading(false);
          setOrders([]);
          setTotal(0);
          return;
        }

        const res = await getOrdersPaginated(params, {
          token: token ?? undefined,
        });

        const payload = res as PaginatedOrdersResponse;

        if (!cancelled) {
          setOrders(payload?.data?.orders ?? []);
          setTotal(payload?.data?.pagination?.totalDoc ?? 0);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load orders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [params, token]);

  const handleSelectOrder = useCallback(
    (orderId: string) => {
      const selected = orders.find((o) => o._id === orderId) || null;
      setSelectedOrderData(selected);
    },
    [orders]
  );

  const handleBackToOrders = useCallback(() => {
    setSelectedOrderData(null);
  }, []);

  if (loading) {
    return (
      <section aria-busy="true" className="py-6">
        <div className="w-full h-28 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-xl border border-gray-200 dark:border-[#303030]" />
      </section>
    );
  }

  if (error) {
    return (
      <section aria-live="polite" className="text-center py-10">
        <p className="text-red-500 font-medium">{error}</p>
      </section>
    );
  }

  if (total === 0) {
    return (
      <section className="text-center py-10" aria-label="No orders">
        <span className="flex justify-center text-emerald-500 text-6xl mb-4">
          <IoBagHandle />
        </span>
        <h2 className="font-medium text-lg text-gray-600 dark:text-[#E5E5E5]">
          No orders found
        </h2>
        <p className="text-sm text-gray-500 dark:text-[#E5E5E5]">
          Try changing filters or your search.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {selectedOrderData ? (
        <>
          {" "}
          <OrderDetails order={selectedOrderData} onBack={handleBackToOrders} />
        </>
      ) : (
        <OrdersTable
          orders={orders}
          onSelect={handleSelectOrder}
          moneyCurrency="USD"
        />
      )}

      {!selectedOrderData && (
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
          className="pt-2"
        />
      )}
    </div>
  );
};

export default AllOrders;
