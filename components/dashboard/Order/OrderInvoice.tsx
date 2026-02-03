"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IoPrintOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";

import { useAuthStore } from "@/zustand/authStore";
import { getOrderById } from "@/services/orderService";
import { Order } from "@/types/order";
import dynamic from "next/dynamic";
import InvoiceActions from "./InvoiceActions";

const DownloadInvoicePdfButton = dynamic(
  () => import("./DownloadInvoicePdfButton"),
  {
    ssr: false,
    loading: () => (
      <button
        disabled
        className="rounded-xl flex items-center gap-2 bg-primary px-4 py-2 text-sm font-semibold text-white opacity-60"
      >
        Loading...
      </button>
    ),
  },
);

function formatDate(d?: string) {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatMoney(n?: number) {
  const v = Number(n ?? 0);
  return `USD$${v.toFixed(2)}`;
}

interface IDParams {
  id: string;
}

export default function OrderInvoice({ id }: IDParams) {
  const { token } = useAuthStore();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!id) return;
      if (!token) return;

      setLoading(true);
      try {
        const res = await getOrderById(id, { token, cache: "no-store" });
        const data = (res as any)?.data ?? res;
        if (!cancelled) setOrder(data as Order);
      } catch (e: any) {
        if (!cancelled) toast.error(e?.message ?? "Failed to load invoice");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  const onPrint = () => window.print();

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-600 dark:text-gray-300">
        Loading invoice...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-sm text-gray-600 dark:text-gray-300">
        Invoice not found.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Top message bar */}
      <div className="no-print mb-4 rounded-lg border border-gray-300 dark:border-primary/20 dark:bg-primary/10 px-4 py-3 text-sm text-primary/80 dark:text-primary/50">
        <span className="text-primary font-medium">
          {order?.user_info?.name ?? "Customer"}
        </span>
        {", You have successfully placed your order."}
      </div>

      <div
        ref={invoiceRef}
        className="print-card overflow-hidden rounded-2xl border border-gray-700 dark:bg-background-dark shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            {/* Left: title + status (mobile aligns with brand) */}
            <div className="flex items-start justify-between md:block w-full">
              <div>
                <h1 className="text-xl md:text-2xl font-bold dark:text-white tracking-wide">
                  INVOICE
                </h1>
                <div className="mt-2 text-xs dark:text-gray-300">
                  Status :{" "}
                  <span className="text-emerald-400">
                    {order.status ?? "—"}
                  </span>
                </div>
              </div>

              {/* Mobile brand (top-right) */}
              <div className="md:hidden text-right">
                <div className="dark:text-white font-semibold tracking-wide">
                  GAMINGTY
                </div>
                <div className="text-[10px] dark:text-gray-300 mt-1">
                  FLEXITECH LLC FZ
                </div>
              </div>
            </div>

            {/* Desktop brand */}
            <div className="hidden md:block text-right">
              <div className="dark:text-white font-semibold tracking-wide">
                GAMINGTY
              </div>
              <div className="text-[10px] dark:text-gray-300 mt-1">
                FLEXITECH LLC FZ
              </div>
              <div className="mt-3 flex flex-col text-[10px] leading-5 dark:text-gray-300">
                <span className="whitespace-nowrap overflow-hidden text-ellipsis block max-w-full">
                  The Meydan Hotel, Grandstand, 6th floor
                </span>

                <span className="whitespace-nowrap overflow-hidden text-ellipsis block max-w-full">
                  {" "}
                  Meydan Road, Nad Al Sheba, Dubai, UAE
                </span>

                <span className="whitespace-nowrap overflow-hidden text-ellipsis block max-w-full">
                  support@gamingty.com
                </span>
              </div>
            </div>

            {/* Mobile address card */}
            <div className="md:hidden rounded-xl border border-white/10 bg-white/5 p-3 text-[10px] leading-5 dark:text-gray-300">
              The Meydan Hotel, Grandstand, 6th floor,
              <br />
              Meydan Road, Nad Al Sheba, Dubai, UAE
              <br />
              support@gamingty.com
            </div>
          </div>

          <div className="mt-6 border-t dark:border-white/10" />

          {/* Meta row */}
          <div className="mt-6 grid grid-cols-1 gap-3 md:gap-6 md:grid-cols-3">
            {/* Date */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 md:border-0 md:bg-transparent md:p-0">
              <div className="text-[11px] font-semibold dark:text-gray-200">
                DATE
              </div>
              <div className="mt-1 text-[11px] dark:text-gray-300">
                {formatDate(order.createdAt)}
              </div>
            </div>

            {/* Order No */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-left md:text-center md:border-0 md:bg-transparent md:p-0">
              <div className="text-[11px] font-semibold dark:text-gray-200">
                ORDER NO.
              </div>
              <div className="mt-1 text-[11px] dark:text-gray-300">
                #{order.invoice ?? order._id}
              </div>
            </div>

            {/* Order To */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 md:text-right md:border-0 md:bg-transparent md:p-0">
              <div className="text-[11px] font-semibold dark:text-gray-200">
                ORDER TO.
              </div>
              <div className="mt-1 text-[11px] dark:text-gray-300 leading-5 wrap-break-word">
                {order?.user_info?.name ?? "-"}
                <br />
                {order?.user_info?.email ?? "-"}
                <br />
                {order?.user_info?.address ?? "-"}
                <br />
                {order?.user_info?.country ?? "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="px-4 md:px-8 pb-6">
          {/* Desktop/table layout */}
          <div className="hidden md:block rounded-xl border dark:border-white/10 overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-200 dark:bg-white/10 px-4 py-3 text-[11px] font-semibold dark:text-gray-200">
              <div className="col-span-1">#</div>
              <div className="col-span-7">ITEM</div>
              <div className="col-span-2 text-center">QUANTITY</div>
              <div className="col-span-2 text-right">PRICE</div>
            </div>

            <div className="divide-y divide-white/10">
              {order.cart?.map((it, idx) => (
                <div
                  key={it._id ?? idx}
                  className="grid grid-cols-12 px-4 py-4 text-[11px] dark:text-gray-200"
                >
                  <div className="col-span-1 dark:text-gray-400">{idx + 1}</div>
                  <div className="col-span-7">{it.title}</div>
                  <div className="col-span-2 text-center font-semibold dark:text-white">
                    {it.quantity}
                  </div>
                  <div className="col-span-2 text-right font-semibold dark:text-white">
                    {formatMoney(it.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile card layout */}
          <div className="md:hidden space-y-3">
            {order.cart?.map((it, idx) => (
              <div
                key={it._id ?? idx}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] dark:text-gray-400">
                      Item #{idx + 1}
                    </div>
                    <div className="mt-1 text-sm font-semibold dark:text-white wrap-break-word">
                      {it.title}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] dark:text-gray-400">Price</div>
                    <div className="text-sm font-bold dark:text-white">
                      {formatMoney(it.price)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-3 py-2">
                  <span className="text-xs dark:text-gray-300">Quantity</span>
                  <span className="text-xs font-semibold dark:text-white">
                    {it.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="px-4 md:px-8 pb-8">
          <div className="mt-2 border-t dark:border-white/10" />

          <div className="mt-6 grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-3">
            {/* Payment Method */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:border-0 md:bg-transparent md:p-0">
              <div className="text-[11px] font-semibold dark:text-gray-200">
                PAYMENT METHOD
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] dark:text-gray-300">
                {order.paymentMethodImage ? (
                  <Image
                    src={order.paymentMethodImage}
                    alt="pm"
                    width={20}
                    height={20}
                    className="rounded"
                  />
                ) : null}
                <span className="capitalize">{order.paymentMethod ?? "-"}</span>
              </div>
            </div>

            {/* Discount */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:text-center md:border-0 md:bg-transparent md:p-0">
              <div className="text-[11px] font-semibold dark:text-gray-200">
                DISCOUNT
              </div>
              <div className="mt-2 text-[11px] dark:text-gray-300">
                {formatMoney(order.discount ?? 0)}
              </div>
            </div>

            {/* Total */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:text-right md:border-0 md:bg-transparent md:p-0">
              <div className="text-[11px] font-semibold dark:text-gray-200">
                TOTAL AMOUNT
              </div>
              <div className="mt-2 text-xl font-extrabold text-rose-400">
                {formatMoney(order.total)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions (outside PDF capture OR keep inside if you want them printed) */}
      <div className="no-print mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <DownloadInvoicePdfButton
          order={order}
          filename={`invoice-${order?.invoice ?? order?._id}.pdf`}
        />

        <InvoiceActions order={order} />
      </div>
    </div>
  );
}
