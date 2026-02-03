"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import {
  IoChevronBackOutline,
  IoKeyOutline,
  IoCopyOutline,
  IoDownloadOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/zustand/authStore";
import { getOrderCredentials } from "@/services/orderService";
import { MdOutlinePayment } from "react-icons/md";
import DownloadIcon from "@/public/icons/DownloadIcon";
import Link from "next/link";

type CredentialItem = {
  _id: string;
  value: string;
  usedAt?: string | null;
};

type OrderCredentialsGroup = {
  _id: string;
  productTitle: string;
  credentials: CredentialItem[];
};

type OrderCredentialsResponse = {
  orderStatus: string;
  isWalletTopup: boolean;
  orderDetails: Array<{
    productTitle: string;
    quantity: number;
    price: number;
    productDetails?: any;
  }>;
  orderCredentials: OrderCredentialsGroup[];
};

type OrderDetailsProps = {
  order: any;
  onBack: () => void;
  onViewInvoice?: (order: any) => void;
};

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  onBack,
  onViewInvoice,
}) => {
  const { token } = useAuthStore();

  const [showKeys, setShowKeys] = useState(false);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [credData, setCredData] = useState<OrderCredentialsResponse | null>(
    null,
  );

  const isDelivered = useMemo(() => {
    const s = String(order?.status ?? order?.orderStatus ?? "").toLowerCase();
    return s === "delivered";
  }, [order?.status, order?.orderStatus]);

  const statusText = order?.status ?? order?.orderStatus ?? "Unknown";

  const credentialGroups = useMemo(() => {
    return credData?.orderCredentials ?? [];
  }, [credData]);

  const allFlat = useMemo(() => {
    return credentialGroups.flatMap((g) =>
      (g.credentials ?? []).map((c) => ({
        productTitle: g.productTitle,
        value: c.value,
        usedAt: c.usedAt ?? "",
      })),
    );
  }, [credentialGroups]);

  // Auto-call API on mount; auto-open keys if any exist
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const id = order?._id;
      if (!id) return;
      if (!token) return;
      if (credData || loadingKeys) return;

      setLoadingKeys(true);
      try {
        const res = await getOrderCredentials(id, {
          token,
          cache: "no-store",
        } as any);
        const data: OrderCredentialsResponse =
          (res as any)?.data ?? (res as any);

        if (cancelled) return;
        setCredData(data);

        const hasKeys = (data?.orderCredentials ?? []).some(
          (g) => (g.credentials ?? []).length > 0,
        );

        if (hasKeys) setShowKeys(true);
      } catch (e: any) {
        if (!cancelled) toast?.error?.(e?.message ?? "Failed to load keys");
      } finally {
        if (!cancelled) setLoadingKeys(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?._id, token]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const downloadAllCSV = () => {
    if (!allFlat.length) return;

    const header = ["productTitle", "value", "usedAt"].join(",");
    const rows = allFlat.map((r) => {
      const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      return [esc(r.productTitle), esc(r.value), esc(r.usedAt)].join(",");
    });

    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-keys-${order?.invoice ?? order?._id ?? "download"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatUsedAt = (usedAt?: string | null) => {
    if (!usedAt) return "";
    const d = new Date(usedAt);
    if (Number.isNaN(d.getTime())) return usedAt;
    return d.toLocaleString();
  };

  return (
    <div className="space-y-4 bg-white dark:bg-background-dark p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:underline"
      >
        <IoChevronBackOutline />
        Back to Orders
      </button>

      {/* Header */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="font-semibold text-gray-900 dark:text-white">
            Order #{order?.invoice ?? order?._id}
          </div>
          <div className="text-gray-700 dark:text-gray-200">
            USD ${Number(order?.total ?? 0).toFixed(2)}
          </div>
          <div className="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Image
              src={order?.paymentMethodImage}
              alt="paymentMethod"
              height={400}
              width={400}
              className="w-5 h-5 rounded-sm"
            />{" "}
            {order?.paymentMethod ?? "-"}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <span
            className={[
              "px-2 py-0.5 rounded-full text-xs font-medium",
              isDelivered
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-700 dark:bg-[#1b1b1b] dark:text-gray-300",
            ].join(" ")}
          >
            {statusText}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {order?.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
          </span>
        </div>
      </div>

      {/* Product + Buttons */}
      <div className="flex flex-col gap-4">
        {order?.cart?.map((item: any, index: any) => (
          <div
            key={item._id ?? index}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            {/* Item info */}
            <div className="min-w-0 flex gap-2 items-center">
              <div>
                <Image
                  width={1000}
                  height={1000}
                  className="w-16 h-16 object-cover rounded"
                  alt={item.title ?? "Order Item"}
                  src={item.image ?? "/placeholder.png"}
                />
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {item.title ?? "Order Item"}
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Price: USD ${Number(item.price ?? 0).toFixed(2)}
                  {item.quantity ? ` | x${item.quantity}` : ""}
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Type: {item.type ?? "-"}
                </div>
              </div>
            </div>

            {/* ✅ keep View Invoice button */}
            <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-2 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => setShowKeys((v) => !v)}
                className="inline-flex items-center text-xs justify-center gap-2 px-4 h-10 rounded-full border border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-[#0f1a14] w-full lg:w-auto"
              >
                <IoKeyOutline />
                {showKeys ? "Hide Keys" : "View Keys"}
              </button>

              <Link
                href={`/user/order/invoice/${order?._id}`}
                className="w-full lg:w-auto"
              >
                {" "}
                <button
                  type="button"
                  onClick={() => onViewInvoice?.(order)}
                  className="px-4 h-10 text-xs rounded-full border border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1b1b1b] w-full lg:w-auto"
                >
                  View Invoice
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Keys Section — screenshot-like UI */}
      {showKeys && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111] p-5">
          {!isDelivered ? (
            <div className="rounded-lg border text-center border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f0f] px-4 py-10 text-sm text-gray-700 dark:text-gray-200">
              Your order is currently <b>{statusText}</b>. Keys will be
              available once it's delivered.
            </div>
          ) : loadingKeys ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Loading keys...
            </div>
          ) : credentialGroups.length === 0 ? (
            <div className="text-sm text-center py-10 text-gray-600 dark:text-gray-300">
              No keys found.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header row like screenshot */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Keys & Credentials
                </h3>

                <button
                  type="button"
                  onClick={downloadAllCSV}
                  disabled={!allFlat.length}
                  className={[
                    "inline-flex items-center justify-center gap-2 px-4 h-10 rounded-full text-sm font-medium",
                    allFlat.length
                      ? "bg-emerald-500 text-white hover:opacity-95"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-[#1b1b1b] dark:text-gray-500",
                  ].join(" ")}
                >
                  <DownloadIcon />
                  Download All (CSV)
                </button>
              </div>

              {/* Groups */}
              {credentialGroups.map((group) => (
                <div
                  key={group._id}
                  className="rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#151515] p-4"
                >
                  {/* group header */}
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-3">
                    <Image
                      alt={order?.cart?.[0]?.title ?? "Order"}
                      src={order?.cart?.[0]?.image ?? "/placeholder.png"}
                      width={500}
                      height={500}
                      className="w-5 h-5"
                    />
                    <span className="truncate">{group.productTitle}</span>
                  </div>

                  {/* credentials list */}
                  <div className="space-y-3">
                    {(group.credentials ?? []).map((c) => (
                      <div
                        key={c._id}
                        className="max-w-130 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#0f0f0f] p-4"
                      >
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          Redeem Code:
                        </div>

                        {/* code row + copy */}
                        <div className="flex items-center gap-3">
                          <div className="font-mono text-sm text-gray-900 dark:text-white break-all">
                            {c.value}
                          </div>

                          <button
                            type="button"
                            onClick={() => copyToClipboard(c.value)}
                            className="shrink-0 p-2 rounded-lg border border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1b1b1b]"
                            aria-label="Copy code"
                            title="Copy"
                          >
                            <IoCopyOutline />
                          </button>
                        </div>

                        {/* usedAt row */}
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <MdOutlinePayment size={18} />
                          <span>{c.usedAt ? formatUsedAt(c.usedAt) : "—"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
