"use client";

import React from "react";
import Image from "next/image";

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

type InvoicePrintProps = {
  order: any; // replace with Order type
};

const InvoicePrint = React.forwardRef<HTMLDivElement, InvoicePrintProps>(
  ({ order }, ref) => {
    if (!order) return null;

    return (
      <div ref={ref} className="print-area bg-white text-black p-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide">INVOICE</h1>
            <div className="mt-1 text-sm">
              Status: <span className="font-semibold">{order.status ?? "—"}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="font-bold text-lg">GAMINGTY</div>
            <div className="text-xs mt-1">FLEXITECH LLC FZ</div>
            <div className="text-xs mt-2 leading-5">
              The Meydan Hotel, Grandstand, 6th floor,
              <br />
              Meydan Road, Nad Al Sheba, Dubai, UAE
              <br />
              support@gamingty.com
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* META */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold">DATE</div>
            <div>{formatDate(order.createdAt)}</div>
          </div>

          <div className="text-center">
            <div className="font-semibold">ORDER NO.</div>
            <div>#{order.invoice ?? order._id}</div>
          </div>

          <div className="text-right">
            <div className="font-semibold">ORDER TO.</div>
            <div className="leading-5">
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

        {/* ITEMS */}
        <div className="mt-6 border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-100 px-4 py-3 text-sm font-semibold">
            <div className="col-span-1">#</div>
            <div className="col-span-7">ITEM</div>
            <div className="col-span-2 text-center">QUANTITY</div>
            <div className="col-span-2 text-right">PRICE</div>
          </div>

          <div className="divide-y">
            {order.cart?.map((it: any, idx: number) => (
              <div
                key={it._id ?? idx}
                className="grid grid-cols-12 px-4 py-3 text-sm"
              >
                <div className="col-span-1">{idx + 1}</div>
                <div className="col-span-7">{it.title}</div>
                <div className="col-span-2 text-center font-semibold">
                  {it.quantity}
                </div>
                <div className="col-span-2 text-right font-semibold">
                  {formatMoney(it.price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold">PAYMENT METHOD</div>
            <div className="mt-2 flex items-center gap-2">
              {order.paymentMethodImage ? (
                <Image
                  src={order.paymentMethodImage}
                  alt="pm"
                  width={18}
                  height={18}
                  className="rounded"
                />
              ) : null}
              <span className="capitalize">{order.paymentMethod ?? "-"}</span>
            </div>
          </div>

          <div className="text-center">
            <div className="font-semibold">DISCOUNT</div>
            <div className="mt-2">{formatMoney(order.discount ?? 0)}</div>
          </div>

          <div className="text-right">
            <div className="font-semibold">TOTAL AMOUNT</div>
            <div className="mt-2 text-xl font-extrabold">
              {formatMoney(order.total)}
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-600">
          This invoice is generated electronically.
        </div>
      </div>
    );
  }
);

InvoicePrint.displayName = "InvoicePrint";
export default InvoicePrint;
