// components/wallet/ui/TransactionMobileCard.tsx
"use client";

import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useTranslations } from "next-intl";

import {
  formatCurrency,
  formatDate,
  getStatusClass,
  getTypeClass,
} from "./walletColumns";

type Props = {
  transaction: any;
  isExpanded: boolean;
  onToggle: () => void;
  onCopy: (text: string) => void;
};

const formatTransactionType = (type: string) =>
  type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatTransactionDetails = (
  transaction: any,
  t: (key: string) => string,
) => {
  const details: any[] = [
    {
      label: t("transactionId"),
      value: transaction._id || transaction.id || "N/A",
      copyable: true,
    },
    { label: t("dateTime"), value: formatDate(transaction.createdAt) },
    {
      label: t("type"),
      value: formatTransactionType(transaction.type),
      highlight: true,
    },
    { label: t("paymentMethod"), value: transaction.paymentMethod || "N/A" },
    {
      label: t("amount"),
      value: `${transaction.amount < 0 ? "-" : ""}${formatCurrency(
        Math.abs(transaction.amount),
      )}`,
      highlight: true,
      color: transaction.amount < 0 ? "text-rose-500" : "text-emerald-500",
    },
    { label: t("status"), value: transaction.status, badge: true },
  ];

  if (transaction.description) {
    details.splice(3, 0, {
      label: t("description"),
      value: transaction.description,
    });
  }
  if (transaction.reference) {
    details.push({
      label: t("reference"),
      value: transaction.reference,
      copyable: true,
    });
  }
  if (transaction.fee !== undefined && transaction.fee !== 0) {
    details.push({
      label: t("transactionFee"),
      value: formatCurrency(Math.abs(transaction.fee)),
    });
  }
  return details;
};

export default function TransactionMobileCard({
  transaction,
  isExpanded,
  onToggle,
  onCopy,
}: Props) {
  const t = useTranslations("wallet");
  const transactionDetails = formatTransactionDetails(transaction, t);

  return (
    <div className="bg-gray-50 dark:bg-background-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-border-dark">
      {/* Header */}
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 text-[10px] font-medium whitespace-nowrap rounded-full ${getTypeClass(
                  transaction.type,
                )}`}
              >
                {formatTransactionType(transaction.type)}
              </span>
              <span
                className={`px-2.5 py-1 text-[10px] font-semibold rounded-full ${getStatusClass(
                  transaction.status,
                )}`}
              >
                {transaction.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-[#E5E5E5] truncate">
                {formatDate(transaction.createdAt)}
              </span>
              {transaction.paymentMethod && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500 dark:text-[#E5E5E5] truncate">
                    {transaction.paymentMethod}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-2">
            <div className="text-right">
              <span
                className={`font-bold text-sm ${
                  transaction.amount < 0 ? "text-rose-500" : "text-emerald-500"
                }`}
              >
                {transaction.amount < 0 ? "-" : ""}
                {formatCurrency(Math.abs(transaction.amount))}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              {isExpanded ? (
                <FiChevronUp className="text-gray-400 w-5 h-5" />
              ) : (
                <FiChevronDown className="text-gray-400 w-5 h-5" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-200 dark:border-border-dark bg-white dark:bg-[#1C1C1C] p-4">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            {t("transactionDetails")}
          </h4>
          <div className="space-y-3">
            {transactionDetails.map((detail, idx) => (
              <div
                key={idx}
                className={`flex justify-between items-center gap-2 ${
                  detail.highlight ? "font-bold" : ""
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">
                    {detail.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 min-w-0 ml-2">
                  {detail.badge ? (
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusClass(
                        detail.value,
                      )}`}
                    >
                      {detail.value}
                    </span>
                  ) : (
                    <span
                      className={`text-sm text-right truncate max-w-31.25 font-bold ${
                        detail.color || "text-gray-700 dark:text-gray-300"
                      } ${detail.highlight ? "font-bold" : ""}`}
                    >
                      {detail.value}
                    </span>
                  )}

                  {detail.copyable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopy(String(detail.value));
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title={t("copyToClipboard")}
                    >
                      <svg
                        className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
