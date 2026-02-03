"use client";

import { JSX } from "react";
import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

type Props = {
  status?: string | null;
  className?: string;
};

const prettify = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

export default function ReferralStatusBadge({ status, className = "" }: Props) {
  const raw = (status ?? "").trim();
  const key = raw.toLowerCase(); // normalize

  const map: Record<
    string,
    { bg: string; text: string; icon?: JSX.Element; label?: string }
  > = {
    completed: {
      bg: "bg-emerald-100 dark:bg-emerald-900/50",
      text: "text-emerald-700 dark:text-emerald-300",
      icon: <FiCheckCircle className="w-3 h-3 mr-1" />,
      label: "Completed",
    },
    credited: {
      bg: "bg-blue-100 dark:bg-blue-900/50",
      text: "text-blue-700 dark:text-blue-300",
      icon: <FiCheckCircle className="w-3 h-3 mr-1" />,
      label: "Credited",
    },
    pending: {
      bg: "bg-yellow-100 dark:bg-yellow-900/50",
      text: "text-yellow-700 dark:text-yellow-300",
      icon: <FiClock className="w-3 h-3 mr-1" />,
      label: "Pending",
    },
    pending_transfer: {
      bg: "bg-orange-100 dark:bg-orange-900/50",
      text: "text-orange-700 dark:text-orange-300",
      icon: <FiClock className="w-3 h-3 mr-1" />,
      label: "Pending Transfer",
    },
    transferred_to_wallet: {
      bg: "bg-purple-100 dark:bg-purple-900/50",
      text: "text-purple-700 dark:text-purple-300",
      icon: <FiCheckCircle className="w-3 h-3 mr-1" />,
      label: "Transferred to Wallet",
    },
    requested_withdrawal: {
      bg: "bg-indigo-100 dark:bg-indigo-900/50",
      text: "text-indigo-700 dark:text-indigo-300",
      icon: <FiClock className="w-3 h-3 mr-1" />,
      label: "Requested Withdrawal",
    },
    withdrawn: {
      bg: "bg-green-100 dark:bg-green-900/50",
      text: "text-green-700 dark:text-green-300",
      icon: <FiCheckCircle className="w-3 h-3 mr-1" />,
      label: "Withdrawn",
    },
    cancelled: {
      bg: "bg-red-100 dark:bg-red-900/50",
      text: "text-red-700 dark:text-red-300",
      icon: <FiXCircle className="w-3 h-3 mr-1" />,
      label: "Cancelled",
    },
  };

  const cfg = map[key] || {
    bg: "bg-gray-100 dark:bg-gray-700",
    text: "text-gray-700 dark:text-gray-300",
    label: raw ? prettify(raw) : "Unknown",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text} ${className}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}
