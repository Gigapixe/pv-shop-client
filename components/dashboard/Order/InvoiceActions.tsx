"use client";

import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import InvoicePrint from "./InvoicePrint";
import { LuPrinter } from "react-icons/lu";

export default function InvoiceActions({ order }: { order: any }) {
  const printInvoiceRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintInvoice = useReactToPrint({
    contentRef: printInvoiceRef,
    onBeforePrint: async () => {
      setIsPrinting(true);
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  return (
    <>
      {/* must be rendered in DOM to print */}
      <div className="hidden print:block">
        <InvoicePrint ref={printInvoiceRef} order={order} />
      </div>

      <button
        type="button"
        onClick={() => handlePrintInvoice()}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:opacity-95"
        disabled={isPrinting}
      >
        {isPrinting ? "Printing..." : "Print"}
        <LuPrinter size={18} />
      </button>
    </>
  );
}
