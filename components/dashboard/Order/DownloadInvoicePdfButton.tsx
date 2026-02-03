"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePdf from "./InvoicePdf";
import { RiDownloadCloud2Line } from "react-icons/ri";

// Replace with your own Button component
function Btn({ disabled, children }: any) {
  return (
    <button
      disabled={disabled}
      className="rounded-xl flex items-center gap-2 bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
    >
      {children}
      <RiDownloadCloud2Line size={18}/>
    </button>
  );
}

export default function DownloadInvoicePdfButton({
  order,
  filename,
}: {
  order: any;
  filename: string;
}) {
  return (
    <PDFDownloadLink
      document={<InvoicePdf order={order} />}
      fileName={filename}
    >
      {({ loading }) => (
        <Btn disabled={loading}>{loading ? "Generating..." : "Download"}</Btn>
      )}
    </PDFDownloadLink>
  );
}
